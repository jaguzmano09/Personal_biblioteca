import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import type { SupabaseClient } from '@supabase/supabase-js'

const names = [
  'SITE_URL',
  'VERCEL',
  'TINTERUNA_CAPTCHA_ENABLED',
  'TURNSTILE_SITE_KEY',
  'TINTERUNA_AUTH_RATE_LIMIT_ENABLED',
  'TINTERUNA_AUTH_RATE_LIMIT_SECRET'
]
const original = names.map(name => [name, process.env[name]] as const)
const moduleUrl = new URL('../src/lib/auth-security.ts', import.meta.url).href
const hooks = registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL === moduleUrl) {
      if (specifier === 'server-only')
        return { url: 'data:text/javascript,export {}', shortCircuit: true }
      if (specifier === 'next/headers')
        return {
          url: 'data:text/javascript,export async function headers(){return new Headers({"x-forwarded-for":"192.0.2.10"})}',
          shortCircuit: true
        }
      if (specifier.startsWith('./'))
        return {
          url: new URL(specifier + '.ts', moduleUrl).href,
          shortCircuit: true
        }
    }
    return next(specifier, context)
  }
})
const { guardAuthAttempt, authChallengeConfig } = (await import(
  moduleUrl
)) as typeof import('../src/lib/auth-security.ts')
hooks.deregister()
after(() => {
  for (const [name, value] of original) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
})
function setup() {
  for (const name of names) delete process.env[name]
  process.env.SITE_URL = 'https://example.test'
  const calls: unknown[] = []
  let result: { data: unknown; error: unknown } = { data: true, error: null }
  const client = {
    rpc: async (name: string, args: unknown) => {
      calls.push({ name, args })
      return result
    }
  } as unknown as SupabaseClient
  return {
    client,
    calls,
    result: (value: typeof result) => {
      result = value
    }
  }
}

test('explicit enablement fails closed on configuration/RPC failures and throttles before provider access', async () => {
  const f = setup()
  assert.deepEqual(
    await guardAuthAttempt(f.client, 'reader@example.test', 'login', undefined),
    {}
  )
  assert.equal(f.calls.length, 0)
  process.env.TINTERUNA_AUTH_RATE_LIMIT_ENABLED = 'true'
  assert.ok(
    (await guardAuthAttempt(f.client, 'reader@example.test', 'login', 'token')).error
  )
  process.env.TINTERUNA_AUTH_RATE_LIMIT_SECRET = 'a'.repeat(64)
  process.env.VERCEL = '1'
  assert.deepEqual(
    await guardAuthAttempt(f.client, 'reader@example.test', 'login', undefined),
    {}
  )
  assert.equal(f.calls.length, 1)
  assert.equal(JSON.stringify(f.calls).includes('reader@example.test'), false)
  assert.equal(JSON.stringify(f.calls).includes('192.0.2.10'), false)
  f.result({ data: false, error: null })
  assert.match(
    (await guardAuthAttempt(f.client, 'reader@example.test', 'login', undefined))
      .error ?? '',
    /Demasiados/
  )
  f.result({ data: null, error: { message: 'private internal provider error' } })
  const failed = await guardAuthAttempt(
    f.client,
    'reader@example.test',
    'login',
    undefined
  )
  assert.ok(failed.error)
  assert.equal(JSON.stringify(failed).includes('private internal'), false)
  process.env.TINTERUNA_AUTH_RATE_LIMIT_ENABLED = 'typo'
  assert.ok(
    (await guardAuthAttempt(f.client, 'reader@example.test', 'login', undefined))
      .error
  )
})

test('CAPTCHA is required server-side, forwards one token for provider redemption and rejects public test keys', async () => {
  const f = setup()
  process.env.TINTERUNA_CAPTCHA_ENABLED = 'true'
  assert.deepEqual(authChallengeConfig(), { required: true, siteKey: null })
  assert.ok(
    (await guardAuthAttempt(f.client, 'r@example.test', 'signup', 'x')).error
  )
  process.env.TURNSTILE_SITE_KEY = '0x4-fixture-site-key'
  for (const token of [undefined, '', 'x'.repeat(2049)])
    assert.ok(
      (await guardAuthAttempt(f.client, 'r@example.test', 'recovery', token)).error
    )
  assert.deepEqual(
    await guardAuthAttempt(
      f.client,
      'r@example.test',
      'confirmation',
      'one-use-token'
    ),
    { captchaToken: 'one-use-token' }
  )
  process.env.TURNSTILE_SITE_KEY = '1x00000000000000000000AA'
  assert.equal(authChallengeConfig().siteKey, null)
  process.env.SITE_URL = 'http://localhost:3000'
  assert.equal(authChallengeConfig().siteKey, process.env.TURNSTILE_SITE_KEY)
  process.env.TINTERUNA_CAPTCHA_ENABLED = 'typo'
  assert.equal(authChallengeConfig().siteKey, null)
})
