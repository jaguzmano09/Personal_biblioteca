// Starts the production build with nonfunctional local service settings. No live account is used.
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import assert from 'node:assert/strict'

const reservation = createServer()
await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve))
const port = reservation.address().port
await new Promise(resolve => reservation.close(resolve))
const origin = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  env: { ...process.env, SUPABASE_URL: 'http://127.0.0.1:59999', SUPABASE_ANON_KEY: 'sb_publishable_local_test', SITE_URL: origin },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
server.stdout.on('data', chunk => { output += chunk })
server.stderr.on('data', chunk => { output += chunk })
try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${origin}/registro`)).ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, output)
  for (const path of ['/biblioteca', '/biblioteca/datos', '/biblioteca/anything.jpg']) {
    const response = await fetch(origin + path, { redirect: 'manual' })
    assert.equal(response.status, 307, path)
    assert.equal(new URL(response.headers.get('location'), origin).pathname, '/login')
    assert.match(response.headers.get('cache-control'), /no-store/)
  }
  const home = await fetch(origin)
  assert.equal(home.status, 200)
  assert.match(home.headers.get('cache-control'), /no-store/)
  const homeHtml = await home.text()
  assert.match(homeHtml, /Lo que lees también te escribe/)
  assert.match(homeHtml, /href="\/registro"/)
  assert.match(homeHtml, /sample-note/)
  const cover = await fetch(`${origin}/api/covers?url=https://example.com/cover.png`)
  assert.equal(cover.status, 401)
  assert.match(cover.headers.get('cache-control'), /no-store/)
  const search = await fetch(`${origin}/api/google-books?q=test`)
  assert.equal(search.status, 401)
  assert.match(search.headers.get('cache-control'), /no-store/)
  const accountExport = await fetch(`${origin}/api/account/export`)
  assert.equal(accountExport.status, 401)
  assert.match(accountExport.headers.get('cache-control'), /no-store/)
  const callback = await fetch(`${origin}/api/auth/callback`, { redirect: 'manual' })
  assert.equal(callback.status, 307)
  assert.equal(callback.headers.get('location'), `${origin}/login?error=confirmation`)
  const login = await fetch(`${origin}/login?error=confirmation`)
  assert.equal(login.status, 200)
  assert.equal(login.headers.get('x-frame-options'), 'DENY')
  assert.equal(login.headers.get('referrer-policy'), 'no-referrer')
  assert.equal(login.headers.get('x-content-type-options'), 'nosniff')
  assert.match(login.headers.get('content-security-policy'), /frame-ancestors 'none'/)
  const html = await login.text()
  assert.match(html, /role="alert"/)
  assert.match(html, /caducado/)
  assert.match(html, /for="loginform-1"/)
  console.log('Production smoke checks passed: anonymous isolation, redirects, callback errors and security headers.')
} finally {
  server.kill('SIGTERM')
  await new Promise(resolve => { if (server.exitCode !== null) resolve(); else server.once('exit', resolve) })
}
