import express from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import { cachePublic } from '../middleware/cache.js'
import { deletePaymentProofFiles } from '../utils/storageCleaner.js'

const router = express.Router()

// Auto cleanup helper: purge payment proof images from orders older than 30 days (fire-and-forget)
let lastCleanupTime = 0
const tryAutoPurgeOldPayments = async () => {
  const now = Date.now()
  // Run at most once every 6 hours
  if (now - lastCleanupTime < 6 * 60 * 60 * 1000) return
  lastCleanupTime = now

  try {
    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

    const { data: oldOrders } = await supabase
      .from('orders')
      .select('id, payment_proof_url')
      .lte('created_at', oneMonthAgo.toISOString())
      .not('payment_proof_url', 'is', null)
      .limit(100)

    if (oldOrders && oldOrders.length > 0) {
      const urls = oldOrders
        .map(o => o.payment_proof_url)
        .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')))

      if (urls.length > 0) {
        await deletePaymentProofFiles(urls, 'payment-proofs')
        await supabase
          .from('orders')
          .update({ payment_proof_url: null })
          .in('id', oldOrders.map(o => o.id))
        console.log(`[AutoPurge] Cleaned ${urls.length} old payment proofs (> 30 days)`)
      }
    }
  } catch (e) {
    console.error('[AutoPurge] Background payment cleanup failed:', e.message)
  }
}

// GET: Fetch all events
router.get('/', cachePublic({ sMaxAge: 10, maxAge: 5, staleWhileRevalidate: 10 }), async (req, res) => {
  try {
    const { is_past, hide_old } = req.query

    // Trigger background auto cleanup if needed
    tryAutoPurgeOldPayments()

    let query = supabase
      .from('events')
      .select(`
        *,
        event_lineup (
          member_id,
          members (
            id,
            member_id,
            nama_panggung,
            image_url
          )
        ),
        event_gallery (
          id,
          tipe,
          path,
          kredit
        )
      `)
      .order('tahun', { ascending: false })
      // Cannot sort by bulan string because 'Februari' > 'April' alphabetically
      // We will sort in JS below
      .order('tanggal', { ascending: false })

    if (is_past !== undefined) {
      query = query.eq('is_past', is_past === 'true')
    }

    let { data, error } = await query

    if (error) throw error

    // Custom Sort for Month Names
    const monthMap = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    }

    if (data) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      data = data.map(event => {
        const monthIndex = monthMap[event.bulan] !== undefined ? monthMap[event.bulan] : 0
        const eventDate = new Date(event.tahun, monthIndex, event.tanggal)
        const isPast = event.is_past || eventDate < now
        const isOlderThanMonth = eventDate < oneMonthAgo

        return {
          ...event,
          is_past: isPast,
          is_older_than_month: isOlderThanMonth
        }
      })

      // If hide_old is requested (e.g. from shop/schedule/dashboard filter), exclude events > 30 days old
      if (hide_old === 'true') {
        data = data.filter(event => !event.is_older_than_month)
      }

      data.sort((a, b) => {
        // 1. Year (Desc)
        if (b.tahun !== a.tahun) return b.tahun - a.tahun
        
        // 2. Month (Desc)
        const monthA = monthMap[a.bulan] !== undefined ? monthMap[a.bulan] : -1
        const monthB = monthMap[b.bulan] !== undefined ? monthMap[b.bulan] : -1
        if (monthB !== monthA) return monthB - monthA
        
        // 3. Date (Desc)
        return b.tanggal - a.tanggal
      })
    }

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET: Fetch single event by ID
router.get('/:id', cachePublic({ sMaxAge: 10, maxAge: 5, staleWhileRevalidate: 10 }), async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_lineup (
          member_id,
          members (
            id,
            member_id,
            nama_panggung,
            image_url
          )
        ),
        event_gallery (
          id,
          tipe,
          path,
          kredit
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Event tidak ditemukan' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST: Create new event (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nama, tanggal, bulan, tahun, lokasi, event_time, cheki_time, is_past, type, theme_name, theme_color, lineup, harga_cheki_po, harga_cheki_ots, ots_enabled } = req.body

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        nama,
        tanggal: parseInt(tanggal, 10),
        bulan,
        tahun: parseInt(tahun, 10),
        lokasi: lokasi || '-',
        event_time,
        cheki_time,
        is_past: Boolean(is_past),
        type: type || 'regular',
        is_special: type === 'special',
        theme_name: type === 'special' ? theme_name : null,
        theme_color: type === 'special' ? theme_color : null,
        harga_cheki_po: harga_cheki_po ? parseInt(harga_cheki_po, 10) : null,
        harga_cheki_ots: harga_cheki_ots ? parseInt(harga_cheki_ots, 10) : null,
        ots_enabled: Boolean(ots_enabled)
      })
      .select()
      .single()

    if (eventError) throw eventError

    // Insert lineup if provided (filter only valid UUIDs)
    if (lineup && Array.isArray(lineup) && lineup.length > 0) {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const validMemberIds = lineup.filter(mId => typeof mId === 'string' && UUID_REGEX.test(mId))
      if (validMemberIds.length > 0) {
        const lineupData = validMemberIds.map(member_id => ({
          event_id: event.id,
          member_id
        }))

        const { error: lineupError } = await supabase
          .from('event_lineup')
          .insert(lineupData)

        if (lineupError) console.error('Lineup insert error:', lineupError)
      }
    }

    res.json({ success: true, data: event })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH: Update event
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { lineup, ...updates } = req.body

    const allowedColumns = [
      'nama', 'tanggal', 'bulan', 'tahun', 'lokasi', 'event_time', 'cheki_time',
      'is_past', 'is_special', 'type', 'theme_name', 'theme_color', 'event_date',
      'deskripsi', 'harga_cheki_po', 'harga_cheki_ots', 'ots_enabled'
    ]

    const cleanUpdates = {}
    for (const key of allowedColumns) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key]
      }
    }

    if (cleanUpdates.tanggal !== undefined) {
      cleanUpdates.tanggal = parseInt(cleanUpdates.tanggal, 10)
    }
    if (cleanUpdates.tahun !== undefined) {
      cleanUpdates.tahun = parseInt(cleanUpdates.tahun, 10)
    }
    if (cleanUpdates.is_past !== undefined) {
      cleanUpdates.is_past = Boolean(cleanUpdates.is_past)
    }
    if (cleanUpdates.type) {
      cleanUpdates.is_special = cleanUpdates.type === 'special'
    }
    if (cleanUpdates.harga_cheki_po !== undefined) {
      cleanUpdates.harga_cheki_po = cleanUpdates.harga_cheki_po ? parseInt(cleanUpdates.harga_cheki_po, 10) : null
    }
    if (cleanUpdates.harga_cheki_ots !== undefined) {
      cleanUpdates.harga_cheki_ots = cleanUpdates.harga_cheki_ots ? parseInt(cleanUpdates.harga_cheki_ots, 10) : null
    }
    if (cleanUpdates.ots_enabled !== undefined) {
      cleanUpdates.ots_enabled = Boolean(cleanUpdates.ots_enabled)
    }

    // Update event basic info
    const { data: event, error: eventError } = await supabase
      .from('events')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (eventError) throw eventError
    if (!event) {
      return res.status(404).json({ error: 'Event tidak ditemukan' })
    }

    // Update lineup if provided
    if (lineup !== undefined && Array.isArray(lineup)) {
      // Delete existing lineup
      await supabase
        .from('event_lineup')
        .delete()
        .eq('event_id', id)

      // Insert new lineup (filter only valid UUIDs)
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const validMemberIds = lineup.filter(mId => typeof mId === 'string' && UUID_REGEX.test(mId))
      if (validMemberIds.length > 0) {
        const lineupData = validMemberIds.map(member_id => ({
          event_id: id,
          member_id
        }))

        const { error: lineupError } = await supabase
          .from('event_lineup')
          .insert(lineupData)

        if (lineupError) console.error('Lineup update error:', lineupError)
      }
    }

    res.json({ success: true, data: event })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE: Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await supabase.from('event_lineup').delete().eq('event_id', id)
    await supabase.from('event_gallery').delete().eq('event_id', id)

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Event deleted' })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
