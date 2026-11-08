import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { request as httpsRequest } from 'node:https'
import { request as httpRequest } from 'node:http'
import type { RequestOptions } from 'node:https'
import type { IncomingMessage } from 'node:http'
import ipaddr from 'ipaddr.js'
import sharp from 'sharp'

const MAX_BYTES = 5 * 1024 * 1024
const MAX_PIXELS = 16000000
const fail = () => new Error('Portada no disponible.')

export function publicAddress(address: string): boolean {
  try {
    const parsed = ipaddr.process(address)
    return parsed.range() === 'unicast'
  } catch { return false }
}
export function networkUrl(source: string): URL {
  if (source.length > 8192) throw fail()
  const url = new URL(source)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) throw fail()
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') ||
      (isIP(host) && !publicAddress(host))) throw fail()
  return url
}
export function pinnedOptions(url: URL, address: string): RequestOptions {
  if (!publicAddress(address)) throw fail()
  const host = url.hostname.replace(/^\[|\]$/g, '')
  return {
    // Connect to the vetted IP, without a second DNS lookup. Host and TLS verification use the original name.
    hostname: address, port: url.protocol === 'https:' ? 443 : 80,
    servername: isIP(host) ? undefined : host, rejectUnauthorized: true,
    headers: { Host: url.host, Accept: 'image/jpeg,image/png,image/webp,image/gif', 'Accept-Encoding': 'identity' },
    agent: false,
  }
}
type Resolve = (hostname: string) => Promise<{ address: string; family: number }[]>
type Download = (url: URL, address: string, signal: AbortSignal) => Promise<IncomingMessage>
const resolvePublic: Resolve = hostname => lookup(hostname, { all: true, verbatim: true })
const download: Download = (url, address, signal) => new Promise((resolve, reject) => {
  const request = url.protocol === 'https:' ? httpsRequest : httpRequest
  const req = request(url, { ...pinnedOptions(url, address), signal }, resolve)
  req.on('error', reject)
  req.end()
})
async function beforeAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted()
  let abort: () => void = () => {}
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      abort = () => reject(fail())
      signal.addEventListener('abort', abort, { once: true })
    })])
  } finally { signal.removeEventListener('abort', abort) }
}
export async function fetchCoverBytes(source: string, dependencies: { resolve?: Resolve; download?: Download; signal?: AbortSignal } = {}): Promise<Buffer> {
  const signal = dependencies.signal ?? AbortSignal.timeout(8000)
  const resolve = dependencies.resolve ?? resolvePublic
  const get = dependencies.download ?? download
  let current = networkUrl(source)
  for (let redirects = 0; redirects <= 3; redirects++) {
    signal.throwIfAborted()
    const host = current.hostname.replace(/^\[|\]$/g, '')
    const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await beforeAbort(resolve(host), signal)
    if (!addresses.length || addresses.some(item => !publicAddress(item.address))) throw fail()
    signal.throwIfAborted()
    const response = await get(current, addresses[0].address, signal)
    const status = response.statusCode ?? 0
    if ([301, 302, 303, 307, 308].includes(status)) {
      const location = response.headers.location
      response.destroy()
      if (!location || redirects === 3) throw fail()
      current = networkUrl(new URL(location, current).href)
      continue
    }
    try {
      const mime = response.headers['content-type']?.split(';')[0].trim().toLowerCase()
      if (status !== 200 || !mime || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mime) ||
          (response.headers['content-encoding'] && response.headers['content-encoding'] !== 'identity') ||
          Number(response.headers['content-length'] ?? 0) > MAX_BYTES) throw fail()
      const chunks: Buffer[] = []
      let length = 0
      for await (const chunk of response) {
        signal.throwIfAborted()
        const bytes = Buffer.from(chunk)
        length += bytes.length
        if (length > MAX_BYTES) throw fail()
        chunks.push(bytes)
      }
      return Buffer.concat(chunks)
    } finally { response.destroy() }
  }
  throw fail()
}
export async function sanitizeCover(bytes: Buffer): Promise<Buffer> {
  if (bytes.length > MAX_BYTES) throw fail()
  // Sniff before calling a decoder: reject SVG, XML, HTML and unsupported containers.
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
  const gif = ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())
  const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
  if (!jpeg && !png && !gif && !webp) throw fail()
  return sharp(bytes, { limitInputPixels: MAX_PIXELS, pages: 1, failOn: 'warning' })
    .timeout({ seconds: 3 }).rotate().resize({ width: 800, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 }).toBuffer()
}
