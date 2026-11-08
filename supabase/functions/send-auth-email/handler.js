// Runtime-neutral implementation; index.js supplies signature verification and secrets.
const subjects = {
  signup: 'Confirma tu cuenta en Personal Biblioteca',
  invite: 'Invitación a Personal Biblioteca',
  recovery: 'Restablece tu contraseña de Personal Biblioteca',
  magiclink: 'Accede a Personal Biblioteca',
  email_change: 'Confirma tu cambio de correo',
  reauthentication: 'Confirma tu identidad en Personal Biblioteca',
}
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const required = (value) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid payload')
  return value
}
const email = (value) => {
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(required(value))) throw new Error('Invalid email')
  return value
}

export function buildMessages(payload, config) {
  const { user, email_data: data } = payload
  const type = required(data?.email_action_type)
  const subject = subjects[type]
  if (!subject) throw new Error('Unsupported email action')
  // Never use a payload-provided origin or redirect destination in authentication links.
  const origin = new URL(config.supabaseUrl)
  const callback = new URL(config.callbackUrl)
  if (origin.protocol !== 'https:' || callback.protocol !== 'https:') throw new Error('HTTPS required')
  const recipients = type === 'email_change'
    ? [
        ...(data.token_hash_new ? [{ to: user.email, hash: data.token_hash_new, token: data.token }] : []),
        { to: user.new_email, hash: data.token_hash, token: data.token_new || data.token },
      ]
    : [{ to: user.email, hash: data.token_hash, token: data.token }]
  return recipients.map(({ to, hash, token }) => {
    let textContent
    let htmlContent
    if (type === 'reauthentication') {
      const otp = required(token)
      if (!/^\d{6,10}$/.test(otp)) throw new Error('Invalid OTP')
      textContent = `Tu código de confirmación es: ${otp}. Si no lo solicitaste, ignora este correo.`
      htmlContent = `<p>Tu código de confirmación es: <strong>${escapeHtml(otp)}</strong>.</p><p>Si no lo solicitaste, ignora este correo.</p>`
    } else {
      const verifyUrl = new URL('/auth/v1/verify', origin)
      verifyUrl.searchParams.set('token', required(hash))
      verifyUrl.searchParams.set('type', type)
      verifyUrl.searchParams.set('redirect_to', callback.href)
      textContent = `${subject}. Abre este enlace: ${verifyUrl.href}\nSi no lo solicitaste, ignora este correo.`
      htmlContent = `<h1>Personal Biblioteca</h1><p>${escapeHtml(subject)}</p><p><a href="${escapeHtml(verifyUrl.href)}">Continuar</a></p><p>Si no lo solicitaste, ignora este correo.</p>`
    }
    return { sender: { email: email(config.senderEmail), name: 'Personal Biblioteca' },
      to: [{ email: email(to) }], subject, textContent, htmlContent }
  })
}

export function createHandler({ verify, config, fetchImpl = fetch, log = console.error }) {
  const failure = (status, message) => Response.json({ error: { http_code: status, message } }, { status })
  return async (req) => {
    if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } })
    // Hook payloads contain tokens and personal data: never log bodies or signatures.
    const body = await req.text()
    if (body.length > 65536) return failure(413, 'Payload too large')
    let payload
    try { payload = await verify(body, Object.fromEntries(req.headers)) }
    catch { return failure(401, 'Invalid webhook signature') }
    let messages
    try { messages = buildMessages(payload, config) }
    catch { return failure(400, 'Unsupported or invalid email payload') }
    const signal = AbortSignal.timeout(3500)
    for (const message of messages) {
      try {
        const response = await fetchImpl('https://api.brevo.com/v3/smtp/email', {
          method: 'POST', signal,
          headers: { 'api-key': config.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(message),
        })
        if (!response.ok) {
          // Status identifies authentication/quota/provider failures without disclosing the email or tokens.
          log(JSON.stringify({ event: 'brevo_send_failed', status: response.status }))
          await response.body?.cancel()
          return failure(502, 'Email provider rejected the request')
        }
        await response.body?.cancel()
      } catch {
        log(JSON.stringify({ event: 'brevo_unavailable' }))
        return failure(502, 'Email provider unavailable')
      }
    }
    return Response.json({})
  }
}
