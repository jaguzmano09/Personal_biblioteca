import test from 'node:test'
import assert from 'node:assert/strict'
import { buildMessages, createHandler } from '../supabase/functions/send-auth-email/handler.js'

const config = { apiKey: 'test-secret', senderEmail: 'sender@example.com',
  supabaseUrl: 'https://project.supabase.co', callbackUrl: 'https://example.com/api/auth/callback' }
const payload = { user: { email: 'reader@example.com', new_email: 'new@example.com' },
  email_data: { email_action_type: 'signup', token: '123456', token_hash: 'hash',
    redirect_to: 'https://attacker.example', site_url: 'https://attacker.example' } }
const request = () => new Request('https://hook.example', { method: 'POST', body: JSON.stringify(payload) })

test('confirmation links use trusted origins and preserve verification hash/type', () => {
  const [message] = buildMessages(payload, config)
  const link = new URL(message.textContent.match(/https:\/\/[^\s]+/)![0])
  assert.equal(link.origin, config.supabaseUrl)
  assert.equal(link.searchParams.get('token'), 'hash')
  assert.equal(link.searchParams.get('type'), 'signup')
  assert.equal(link.searchParams.get('redirect_to'), config.callbackUrl)
  assert.ok(!message.htmlContent.includes('attacker.example'))
})
test('secure email changes use the reversed hash mapping for each recipient', () => {
  const messages = buildMessages({ ...payload, email_data: { ...payload.email_data,
    email_action_type: 'email_change', token_hash: 'new-hash', token_hash_new: 'old-hash' } }, config)
  assert.equal(messages.length, 2)
  assert.equal(messages[0].to[0].email, 'reader@example.com')
  assert.ok(messages[0].textContent.includes('token=old-hash'))
  assert.equal(messages[1].to[0].email, 'new@example.com')
  assert.ok(messages[1].textContent.includes('token=new-hash'))
})
test('single email change, invitation, recovery, magiclink and OTP are supported', () => {
  for (const type of ['email_change', 'invite', 'recovery', 'magiclink', 'reauthentication']) {
    const [message] = buildMessages({ ...payload, email_data: { ...payload.email_data, email_action_type: type } }, config)
    assert.equal(message.to[0].email, type === 'email_change' ? 'new@example.com' : 'reader@example.com')
    assert.ok(type === 'reauthentication' ? message.textContent.includes('123456') : message.textContent.includes(`type=${type}`))
  }
})
test('rejects unsupported actions and incomplete payloads', () => {
  assert.throws(() => buildMessages({}, config))
  assert.throws(() => buildMessages({ ...payload, email_data: { email_action_type: 'unknown' } }, config))
  assert.throws(() => buildMessages(payload, { ...config, senderEmail: '<script>' }))
})
test('invalid signatures never call Brevo', async () => {
  let sent = false
  const handler = createHandler({ verify: () => { throw Error('signature') }, config,
    fetchImpl: async () => { sent = true; return new Response() } })
  assert.equal((await handler(request())).status, 401)
  assert.equal(sent, false)
})
test('signed request sends API key server-side and returns success', async () => {
  const handler = createHandler({ verify: () => payload, config, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email')
    assert.equal(new Headers(options?.headers).get('api-key'), 'test-secret')
    assert.equal(JSON.parse(String(options?.body)).to[0].email, 'reader@example.com')
    return new Response('{}', { status: 201 })
  } })
  assert.equal((await handler(request())).status, 200)
})
test('provider rejection and timeout fail without exposing secrets or recipients', async () => {
  for (const status of [401, 403, 429, 500, 0]) {
    const logs: string[] = []
    const handler = createHandler({ verify: () => payload, config, log: (line: string) => logs.push(line),
      fetchImpl: async () => { if (!status) throw Error('private details'); return new Response('private details', { status }) } })
    const response = await handler(request())
    assert.equal(response.status, 502)
    const output = await response.text() + logs.join('')
    for (const sensitive of ['reader@example.com', 'test-secret', '123456', 'private details']) assert.ok(!output.includes(sensitive))
  }
})

test('shared brand identity reaches every email and untrusted content stays escaped', async () => {
  const { brand } = await import('../supabase/functions/_shared/brand.js')
  for (const type of ['signup', 'invite', 'recovery', 'magiclink', 'email_change', 'reauthentication']) {
    const [message] = buildMessages({ ...payload, email_data: { ...payload.email_data, email_action_type: type } }, config)
    assert.equal(message.sender.name, brand.name)
    assert.ok(message.htmlContent.includes(brand.colors.cloth))
    assert.ok(message.htmlContent.includes('lang="es"'))
    assert.ok(!message.htmlContent.includes('<script'))
  }
  const name = brand.name
  try {
    brand.name = '<script>alert(1)</script>'
    const [message] = buildMessages(payload, config)
    assert.ok(message.htmlContent.includes('&lt;script&gt;'))
    assert.ok(!message.htmlContent.includes('<script>'))
  } finally { brand.name = name }
})
