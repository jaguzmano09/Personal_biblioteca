import { createHmac, randomUUID } from 'node:crypto'
import { isIP } from 'node:net'
import ipaddr from 'ipaddr.js'

export type AuthAttempt = 'login' | 'signup' | 'recovery' | 'confirmation'

export function trustedAuthIp(
  headers: Pick<Headers, 'get'>,
  vercel: boolean,
  local: boolean
) {
  // Vercel overwrites this header. Other deployments must supply their own trusted adapter.
  const value = vercel
    ? headers.get('x-forwarded-for')?.trim()
    : local
      ? '127.0.0.1'
      : null
  if (!value || !isIP(value)) throw new Error('Trusted client address unavailable')
  const address = ipaddr.process(value)
  if (address.kind() === 'ipv6') {
    // Use /64 so rotating IPv6 interface identifiers cannot reset an attempt budget.
    const bytes = address.toByteArray()
    bytes.fill(0, 8)
    return ipaddr.fromByteArray(bytes).toString() + '/64'
  }
  return address.toString()
}

export function authAttemptProof(
  secret: string,
  action: AuthAttempt,
  ip: string,
  email: string,
  now = Date.now(),
  nonce = randomUUID()
) {
  if (!/^[a-f0-9]{64}$/.test(secret))
    throw new Error('Invalid limiter configuration')
  const hmac = (value: string) =>
    createHmac('sha256', Buffer.from(secret, 'hex')).update(value).digest('hex')
  const ipHash = hmac(`ip:${ip}`)
  const accountHash = hmac(`email:${email.trim().toLowerCase()}`)
  const issuedAt = Math.floor(now / 1000)
  return {
    p_action: action,
    p_ip_hash: ipHash,
    p_account_hash: accountHash,
    p_issued_at: issuedAt,
    p_nonce: nonce,
    p_signature: hmac([action, ipHash, accountHash, issuedAt, nonce].join('|'))
  }
}
