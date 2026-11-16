import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { sessionCookieOptions } from '../src/lib/supabase/config.ts'

const originalOrigin = process.env.SITE_URL
after(() => {
  if (originalOrigin === undefined) delete process.env.SITE_URL
  else process.env.SITE_URL = originalOrigin
})

test('session cookies require HTTPS outside localhost and stay host-only', () => {
  for (const origin of ['https://example.test', 'https://preview.example.test']) {
    process.env.SITE_URL = origin
    assert.deepEqual(sessionCookieOptions(), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/',
    })
  }
  process.env.SITE_URL = 'http://localhost:3000'
  assert.equal(sessionCookieOptions().secure, false)
  process.env.SITE_URL = 'http://127.0.0.1:3000'
  assert.equal(sessionCookieOptions().secure, false)
  for (const origin of ['http://public.example', 'https://example.test/path']) {
    process.env.SITE_URL = origin
    assert.throws(sessionCookieOptions)
  }
})

test('the installed SSR SDK protects PKCE, chunked sessions, refresh and deletion', async () => {
  process.env.SITE_URL = 'https://example.test'
  const jar = new Map<string, string>()
  const writes: { name: string; value: string; options: CookieOptions }[] = []
  const requests: { path: string; body: Record<string, unknown> }[] = []
  let generation = 0
  const user = {
    id: '00000000-0000-4000-8000-000000000001',
    aud: 'authenticated', role: 'authenticated',
    email: 'reader@example.test', app_metadata: {},
    // Ensure real SDK cookie chunking and stale-chunk removal are exercised.
    user_metadata: { fixture: 'x'.repeat(7000) }, created_at: new Date().toISOString(),
  }
  const fetchMock = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input))
    const body = JSON.parse(String(init?.body ?? '{}'))
    requests.push({ path: url.pathname + url.search, body })
    if (url.pathname.endsWith('/recover')) return Response.json({})
    if (url.pathname.endsWith('/logout')) return new Response(null, { status: 204 })
    if (url.pathname.endsWith('/user')) return Response.json(user)
    if (url.pathname.endsWith('/token')) {
      generation++
      const claims = { sub: user.id, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 }
      const jwt = ['header', Buffer.from(JSON.stringify(claims)).toString('base64url'), 'signature'].join('.')
      return Response.json({ access_token: jwt, refresh_token: `fixture-refresh-${generation}`, token_type: 'bearer', expires_in: 3600, user })
    }
    throw new Error('Unexpected fixture request')
  }
  const client = () => createServerClient('https://project.supabase.co', 'sb_publishable_fixture', {
    cookieOptions: sessionCookieOptions(),
    global: { fetch: fetchMock },
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll(cookies) {
        writes.push(...cookies)
        for (const cookie of cookies) {
          if (cookie.options.maxAge === 0) jar.delete(cookie.name)
          else jar.set(cookie.name, cookie.value)
        }
      },
    },
  })

  const recovery = await client().auth.resetPasswordForEmail(user.email, {
    redirectTo: 'https://example.test/api/auth/callback?flow=recovery',
  })
  assert.equal(recovery.error, null)
  assert.ok(writes.some(c => /code-verifier/.test(c.name) && c.value))
  assert.ok(requests.some(r => r.path.startsWith('/auth/v1/recover') && r.body.code_challenge))

  const exchanged = await client().auth.exchangeCodeForSession('fixture-code')
  assert.equal(exchanged.error, null)
  assert.ok(requests.some(r => r.path.includes('grant_type=pkce') && r.body.code_verifier))
  assert.ok(writes.filter(c => /auth-token\.\d+$/.test(c.name) && c.value).length > 1)
  assert.equal((await client().auth.getUser()).data.user?.id, user.id)

  const refreshed = await client().auth.refreshSession()
  assert.equal(refreshed.error, null)
  assert.ok(requests.some(r => r.path.includes('grant_type=refresh_token')))
  assert.equal((await client().auth.signOut()).error, null)
  assert.ok(writes.some(c => c.options.maxAge === 0 && c.value === ''))
  assert.equal([...jar.keys()].filter(name => /auth-token(?:\.\d+)?$/.test(name)).length, 0)
  assert.ok(writes.length > 0)
  for (const cookie of writes) {
    assert.equal(cookie.options.httpOnly, true)
    assert.equal(cookie.options.secure, true)
    assert.equal(cookie.options.sameSite, 'lax')
    assert.equal(cookie.options.path, '/')
    assert.equal(cookie.options.domain, undefined)
    assert.ok(cookie.options.maxAge === 0 || (cookie.options.maxAge ?? 0) > 0)
  }
})
