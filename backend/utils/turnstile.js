/**
 * Cloudflare Turnstile Verification Helper
 * Verifies turnstile response token with Cloudflare siteverify endpoint.
 */
export async function verifyTurnstileToken(token, clientIp = null) {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // If secret key is not set in development, bypass or warn
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Turnstile] TURNSTILE_SECRET_KEY is not defined in production environment!')
      return { success: false, error: 'Server security misconfiguration' }
    }
    console.warn('[Turnstile] TURNSTILE_SECRET_KEY not set. Bypassing check in non-production.')
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'Token verifikasi keamanan (Turnstile) diperlukan' }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secret)
    formData.append('response', token)
    if (clientIp) {
      formData.append('remoteip', clientIp)
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const data = await res.json()
    console.log('[Turnstile] Verification result:', { success: data.success, errorCodes: data['error-codes'] })

    if (data.success === true) {
      return { success: true, data }
    }

    return { 
      success: false, 
      error: 'Verifikasi keamanan gagal. Silakan coba lagi.', 
      errorCodes: data['error-codes'] 
    }
  } catch (err) {
    console.error('[Turnstile] Error verifying token with Cloudflare:', err)
    return { success: false, error: 'Gagal memverifikasi keamanan server. Silakan coba sesaat lagi.' }
  }
}
