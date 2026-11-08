import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import type { IncomingMessage } from 'node:http'
import sharp from 'sharp'
import { fetchCoverBytes, sanitizeCover, publicAddress, networkUrl, pinnedOptions } from '../src/lib/cover-proxy.ts'
const example = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:example&s=10'
const resolve = async () => [{ address: '142.250.184.14', family: 4 }]
function response(body: Buffer | string, headers: Record<string,string> = {}, statusCode = 200) {
  const stream = Readable.from([body]) as IncomingMessage
  stream.headers = { 'content-type': 'image/png', ...headers }
  stream.statusCode = statusCode
  return stream
}
test('public-address checks block internal and special address forms', () => {
  for (const ip of ['127.0.0.1','0.0.0.0','10.0.0.1','172.16.0.1','192.168.1.1','169.254.169.254','100.64.0.1',
    '224.0.0.1','192.0.2.1','::1','::','fc00::1','fe80::1','::ffff:127.0.0.1','64:ff9b::7f00:1']) assert.equal(publicAddress(ip), false, ip)
  assert.equal(publicAddress('142.250.184.14'), true)
  assert.equal(publicAddress('2606:4700:4700::1111'), true)
})
test('network validation and pinned connections keep the original host and TLS name', () => {
  assert.equal(networkUrl(example).href, example)
  for (const url of ['https://127.1/image','http://2130706433/image','http://[::1]/image','http://localhost/image',
    'http://metadata.local/image','https://user:secret@example.com/image','file:///etc/passwd','https://example.com:8080/image']) assert.throws(() => networkUrl(url), url)
  const opts = pinnedOptions(new URL(example), '142.250.184.14')
  assert.equal(opts.hostname, '142.250.184.14')
  assert.equal(opts.servername, 'encrypted-tbn0.gstatic.com')
  assert.equal((opts.headers as Record<string,string>).Host, 'encrypted-tbn0.gstatic.com')
  assert.equal(opts.rejectUnauthorized, true)
  assert.equal(Object.hasOwn(opts.headers!, 'Cookie'), false)
})
test('image download vets DNS answers and every redirect before connecting', async () => {
  let calls = 0
  await assert.rejects(fetchCoverBytes(example, { resolve: async () => [{ address: '10.0.0.1', family: 4 }],
    download: async () => { calls++; return response('x') } }))
  assert.equal(calls, 0)
  await assert.rejects(fetchCoverBytes(example, { resolve: async () => [...await resolve(), { address: '::1', family: 6 }],
    download: async () => { calls++; return response('x') } }))
  assert.equal(calls, 0)
  await assert.rejects(fetchCoverBytes(example, { resolve, download: async () => { calls++; return response('', { location: 'http://169.254.169.254/latest/meta-data' }, 302) } }))
  assert.equal(calls, 1)
  calls = 0
  const bytes = await fetchCoverBytes(example, { resolve, download: async () => ++calls === 1
    ? response('', { location: '/cover.png' }, 302) : response('bytes') })
  assert.equal(bytes.toString(), 'bytes')
  assert.equal(calls, 2)
})
test('timeouts, excessive redirects, unsupported MIME, encoding and large payloads fail closed', async () => {
  for (const res of [response('html', { 'content-type': 'text/html' }), response('x', { 'content-encoding': 'gzip' }),
    response('x', { 'content-length': String(6 * 1024 * 1024) }), response(Buffer.alloc(5 * 1024 * 1024 + 1))]) {
    await assert.rejects(fetchCoverBytes(example, { resolve, download: async () => res }))
  }
  await assert.rejects(fetchCoverBytes(example, { resolve, download: async () => response('', { location: '/again' }, 302) }))
  // A deadline also bounds DNS lookup, not just the HTTP socket.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10)
  try { await assert.rejects(fetchCoverBytes(example, { resolve: () => new Promise(() => {}), signal: controller.signal })) }
  finally { clearTimeout(timer) }
})
test('real raster decoding produces metadata-free JPEG; active and malformed content is rejected', async () => {
  const png = await sharp({ create: { width: 10, height: 20, channels: 3, background: '#abc' } }).png().toBuffer()
  const jpeg = await sanitizeCover(png)
  const meta = await sharp(jpeg).metadata()
  assert.equal(meta.format, 'jpeg')
  assert.equal(meta.width, 10)
  assert.equal(meta.exif, undefined)
  for (const bytes of [Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), Buffer.from('<html>x</html>'), Buffer.from([255,216,255,0])]) await assert.rejects(sanitizeCover(bytes))
  const huge = await sharp({ create: { width: 4100, height: 4100, channels: 3, background: '#fff' } }).png().toBuffer()
  await assert.rejects(sanitizeCover(huge))
})
