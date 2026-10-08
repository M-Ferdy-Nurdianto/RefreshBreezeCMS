// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiter Middleware — In-Memory + Supabase ip_bans
// ─────────────────────────────────────────────────────────────────────────────
// CATATAN PENTING:
// Karena Vercel serverless menjalankan tiap invocation di instance terpisah,
// rate limit berbasis memori ini bersifat "best effort" — setiap instance punya
// counter sendiri.  Untuk perlindungan ketat, gunakan rate limiting di level
// Cloudflare (WAF / Rate Limiting Rules) sebagai lapisan pertama.
//
// Middleware ini tetap berguna sebagai lapisan kedua:
//  • Menangkap burst dalam satu instance (cold start → warm → banyak request)
//  • Auto-ban IP yang berulang kali kena limit, disimpan di Supabase (persisten)
//  • Tidak butuh dependency eksternal tambahan (tanpa Redis, tanpa service pihak ketiga)
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from '../config/supabase.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Parse env value as integer or return fallback. */
const toInt = (v, fb) => {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : fb
}

/**
 * Extract the *real* client IP behind Cloudflare → Vercel.
 * Priority: cf-connecting-ip > x-forwarded-for (first IP) > socket address.
 */
export const getClientIp = (req) => {
  const cfIp = req.headers['cf-connecting-ip']
  if (typeof cfIp === 'string' && cfIp.trim().length > 0) {
    return cfIp.trim()
  }

  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim()
  }

  return req.socket?.remoteAddress || '0.0.0.0'
}

// ── Configuration (semua bisa di-override lewat env var) ─────────────────────

const GENERAL_LIMIT     = toInt(process.env.RL_GENERAL_LIMIT, 60)     // requests
const GENERAL_WINDOW_S  = toInt(process.env.RL_GENERAL_WINDOW, 10)    // seconds
const WRITE_LIMIT       = toInt(process.env.RL_WRITE_LIMIT, 10)       // requests
const WRITE_WINDOW_S    = toInt(process.env.RL_WRITE_WINDOW, 60)      // seconds
const BAN_STRIKES       = toInt(process.env.RL_BAN_STRIKES, 3)        // strikes before ban
const BAN_STRIKE_TTL_S  = toInt(process.env.RL_BAN_STRIKE_TTL, 60)    // seconds — strike window
const BAN_DURATION_S    = toInt(process.env.RL_BAN_DURATION, 3600)     // seconds — ban duration

const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_DISABLED !== 'true'

const MAX_MAP_SIZE = 10_000 // Maks IP yang disimpan di memori sebelum auto-purge

const WHITELIST = (process.env.RATE_LIMIT_WHITELIST || '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean)

// ── In-memory stores ─────────────────────────────────────────────────────────

/** @type {Map<string, { hits: number, windowStart: number }>} */
const generalBuckets = new Map()

/** @type {Map<string, { hits: number, windowStart: number }>} */
const writeBuckets = new Map()

/**
 * Strike tracker — counts how many WINDOWS an IP has been rate-limited.
 * Key: IP, Value: { count: number, windowStart: number, lastLimitedWindow: number }
 * `lastLimitedWindow` ensures we only count ONE strike per window, not per rejected request.
 * @type {Map<string, { count: number, windowStart: number, lastLimitedWindow: number }>}
 */
const strikes = new Map()

/**
 * Banned IPs loaded from Supabase + locally added bans.
 * @type {Set<string>}
 */
const bannedIps = new Set()
let lastBanRefresh = 0
const BAN_REFRESH_INTERVAL_MS = 60_000 // Refresh ban list dari Supabase maks sekali per 60 detik

// ── Periodic cleanup (mencegah memory leak) ──────────────────────────────────

let lastCleanup = Date.now()
const CLEANUP_INTERVAL_MS = 30_000 // tiap 30 detik

const purgeExpired = (map, windowMs) => {
  const now = Date.now()
  for (const [key, val] of map) {
    if (now - val.windowStart > windowMs) {
      map.delete(key)
    }
  }
}

const enforceMaxSize = (map) => {
  if (map.size <= MAX_MAP_SIZE) return
  // Hapus entri paling lama (iterator order = insertion order)
  const excess = map.size - MAX_MAP_SIZE
  let deleted = 0
  for (const key of map.keys()) {
    if (deleted >= excess) break
    map.delete(key)
    deleted++
  }
}

const runCleanup = () => {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  purgeExpired(generalBuckets, GENERAL_WINDOW_S * 1000)
  purgeExpired(writeBuckets, WRITE_WINDOW_S * 1000)
  purgeExpired(strikes, BAN_STRIKE_TTL_S * 1000)

  enforceMaxSize(generalBuckets)
  enforceMaxSize(writeBuckets)
  enforceMaxSize(strikes)
}

// ── Ban management (Supabase ip_bans table) ──────────────────────────────────

/**
 * Load active bans from Supabase into the in-memory Set.
 * Called at most once per BAN_REFRESH_INTERVAL_MS per instance.
 */
const refreshBanList = async () => {
  const now = Date.now()
  if (now - lastBanRefresh < BAN_REFRESH_INTERVAL_MS) return
  lastBanRefresh = now

  try {
    const { data, error } = await supabase
      .from('ip_bans')
      .select('ip')
      .gt('banned_until', new Date().toISOString())

    if (error) throw error

    // Rebuild Set: keep locally added bans, add DB bans
    // We don't clear the set entirely so bans added in this instance (not yet
    // flushed to next refresh) are retained
    if (data) {
      for (const row of data) {
        bannedIps.add(row.ip)
      }
    }
  } catch (err) {
    // Fail-open: jangan crash API kalau Supabase unreachable
    console.error('[RateLimiter] Failed to refresh ban list (fail-open):', err)
  }
}

/**
 * Ban an IP: insert ke Supabase + tambahkan ke Set lokal.
 */
const banIp = async (ip, reason) => {
  const bannedUntil = new Date(Date.now() + BAN_DURATION_S * 1000).toISOString()

  // Langsung masukkan ke Set lokal (instant effect tanpa tunggu DB)
  bannedIps.add(ip)

  try {
    await supabase
      .from('ip_bans')
      .upsert(
        { ip, banned_until: bannedUntil, reason },
        { onConflict: 'ip' }
      )
  } catch (err) {
    // Fail-open: ban sudah aktif di memori lokal, Supabase hanya persistensi
    console.error('[RateLimiter] Failed to persist ban to Supabase (fail-open):', err)
  }
}

// ── Sensitive request detection ──────────────────────────────────────────────

const SENSITIVE_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH'])
const SENSITIVE_PATHS = ['/api/auth/login', '/api/auth/register']

const isSensitiveRequest = (req) => {
  if (SENSITIVE_METHODS.has(req.method)) return true
  const pathOnly = req.originalUrl.split('?')[0].toLowerCase()
  return SENSITIVE_PATHS.some(p => pathOnly.startsWith(p))
}

// ── Sliding window counter ───────────────────────────────────────────────────

/**
 * Check and increment the rate limit counter for a given IP.
 * Returns { allowed, remaining, resetMs }
 */
const checkLimit = (bucketMap, ip, maxHits, windowMs) => {
  const now = Date.now()
  const entry = bucketMap.get(ip)

  if (!entry || now - entry.windowStart >= windowMs) {
    // Window expired or first request — start new window
    bucketMap.set(ip, { hits: 1, windowStart: now })
    return { allowed: true, remaining: maxHits - 1, resetMs: now + windowMs }
  }

  entry.hits++
  const resetMs = entry.windowStart + windowMs
  const remaining = Math.max(0, maxHits - entry.hits)

  if (entry.hits > maxHits) {
    return { allowed: false, remaining: 0, resetMs }
  }

  return { allowed: true, remaining, resetMs }
}

// ── Strike tracking ──────────────────────────────────────────────────────────

/**
 * Record a strike for an IP.  Strikes are counted per-window, NOT per rejected
 * request.  This prevents a short burst from an otherwise legitimate user
 * triggering an immediate ban.
 *
 * Returns true if the IP should be banned.
 */
const recordStrike = (ip, windowKey) => {
  const now = Date.now()
  const entry = strikes.get(ip)

  if (!entry || now - entry.windowStart >= BAN_STRIKE_TTL_S * 1000) {
    // New strike window
    strikes.set(ip, { count: 1, windowStart: now, lastLimitedWindow: windowKey })
    return 1 >= BAN_STRIKES
  }

  // Hanya hitung strike jika ini window baru (bukan request berulang di window yang sama)
  if (entry.lastLimitedWindow === windowKey) {
    return entry.count >= BAN_STRIKES
  }

  entry.count++
  entry.lastLimitedWindow = windowKey

  return entry.count >= BAN_STRIKES
}

// ── Main middleware ──────────────────────────────────────────────────────────

/**
 * Global rate-limiter middleware.
 * Mount BEFORE any route handler:  `app.use(rateLimiter)`
 *
 * Karena memori per instance, limit ini bersifat "best effort" dan bukan
 * pengganti rate limit di level Cloudflare.  Gunakan Cloudflare WAF / Rate
 * Limiting Rules sebagai lapisan pertama yang pasti.
 */
export const rateLimiter = async (req, res, next) => {
  // Skip preflight
  if (req.method === 'OPTIONS') return next()

  // Feature flag
  if (!RATE_LIMIT_ENABLED) return next()

  const ip = getClientIp(req)

  // ── 1. Whitelist check (paling awal, sebelum ban check) ──────────────────
  if (WHITELIST.includes(ip)) return next()

  // ── 2. Ban check (dari Set di memori — TANPA query Supabase per request) ─
  // Refresh ban list dari DB secara berkala (maks 1x per 60 detik)
  await refreshBanList()

  if (bannedIps.has(ip)) {
    console.warn(
      `[RateLimiter] BLOCKED banned ip=${ip} path=${req.originalUrl} time=${new Date().toISOString()}`
    )
    return res.status(403).json({ error: 'Akses ditolak' })
  }

  // ── 3. Rate limit check ──────────────────────────────────────────────────
  const sensitive = isSensitiveRequest(req)
  const bucketMap = sensitive ? writeBuckets : generalBuckets
  const maxHits   = sensitive ? WRITE_LIMIT  : GENERAL_LIMIT
  const windowMs  = sensitive ? WRITE_WINDOW_S * 1000 : GENERAL_WINDOW_S * 1000

  const { allowed, remaining, resetMs } = checkLimit(bucketMap, ip, maxHits, windowMs)

  // Set informational headers
  res.set('X-RateLimit-Limit', String(maxHits))
  res.set('X-RateLimit-Remaining', String(remaining))

  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000))
    res.set('Retry-After', String(retryAfter))

    console.warn(
      `[RateLimiter] LIMIT ip=${ip} path=${req.originalUrl} limit=${maxHits} time=${new Date().toISOString()}`
    )

    // ── 4. Strike + auto-ban ──────────────────────────────────────────────
    // windowKey = bucket windowStart — dipakai supaya strike dihitung sekali per window
    const bucket = bucketMap.get(ip)
    const windowKey = bucket ? bucket.windowStart : Date.now()
    const shouldBan = recordStrike(ip, windowKey)

    if (shouldBan) {
      const reason = `Auto-ban: ${BAN_STRIKES}x rate limit exceeded within ${BAN_STRIKE_TTL_S}s on ${req.originalUrl}`
      console.warn(
        `[RateLimiter] BANNED ip=${ip} path=${req.originalUrl} duration=${BAN_DURATION_S}s time=${new Date().toISOString()}`
      )
      // Fire-and-forget — jangan block response
      banIp(ip, reason).catch(() => {})
      // Hapus strike counter setelah ban
      strikes.delete(ip)
    }

    return res.status(429).json({ error: 'Terlalu banyak request' })
  }

  // ── 5. Periodic cleanup ─────────────────────────────────────────────────
  runCleanup()

  next()
}
