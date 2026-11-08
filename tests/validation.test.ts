import { test } from 'node:test'
import assert from 'node:assert/strict'
import { personalData, bookChanges, googleBook, credentials, coverUrl, integer, uuid } from '../src/lib/validation.ts'
import { readingStatistics } from '../src/lib/statistics.ts'
import type { Libro } from '../src/lib/types.ts'

test('untrusted fields cannot overwrite ownership, IDs or timestamps', () => {
  const malicious = { estado: 'Pendiente', user_id: 'attacker', id: 'other', created_at: 'yesterday', updated_at: 'tomorrow', titulo: 'overwritten' }
  const result = bookChanges(malicious)
  for (const key of ['user_id', 'id', 'created_at', 'updated_at', 'titulo']) assert.equal(Object.hasOwn(result, key), false)
  assert.equal(result.estado, 'Pendiente')
  assert.equal(personalData({ estado: 'Leído', puntuacion: 10 }).puntuacion, 10)
})
test('invalid ranges and field types are rejected at runtime', () => {
  for (const change of [{ puntuacion: 11 }, { puntuacion: NaN }, { puntuacion: '8' }, { puntuacion: 1.23 },
    { anio_lectura: 0 }, { anio_lectura: 2026, mes_lectura: 13 }, { mes_lectura: 1 },
    { estado: 'unknown' }, { formato: 'other' }, { resumen_analisis: 'x'.repeat(20001) }]) {
    assert.throws(() => personalData({ estado: 'Leído', ...change }))
  }
  for (const value of [0, 1.5, Infinity, '5']) assert.throws(() => integer(value, 1, 100000))
  assert.throws(() => uuid('not-a-uuid'))
})
test('manual covers accept arbitrary image providers while rejecting unsafe URL syntax', () => {
  assert.equal(coverUrl('https://books.google.com/books?id=123'), 'https://books.google.com/books?id=123')
  const manual = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:example&s=10'
  assert.equal(coverUrl(manual), manual)
  assert.equal(coverUrl('https://other-provider.example/cover.jpg'), 'https://other-provider.example/cover.jpg')
  assert.equal(coverUrl('http://other-provider.example/cover.jpg'), 'http://other-provider.example/cover.jpg')
  for (const url of ['https://user@books.google.com/x', 'javascript:alert(1)',
    'https://books.google.com:444/x', 'data:image/png;base64,x']) assert.throws(() => coverUrl(url))
})
test('book metadata is validated and only explicit fields are retained', () => {
  const result = googleBook({ google_books_id: 'abc', titulo: ' Title ', autores: ['Author'], user_id: 'fake' })
  assert.equal(result.titulo, 'Title')
  assert.equal(Object.hasOwn(result, 'user_id'), false)
  assert.throws(() => googleBook({ google_books_id: 'x', titulo: ' ', autores: [] }))
  assert.throws(() => googleBook({ google_books_id: 'x', titulo: 'Title', autores: [1] }))
})
test('registration requires stronger passwords while existing passwords can log in', () => {
  assert.throws(() => credentials('a@example.com', 'short', true))
  assert.throws(() => credentials('not-email', 'a-long-password', true))
  assert.equal(credentials(' a@example.com ', 'old123').email, 'a@example.com')
  assert.equal(credentials('a@example.com', 'twelve-chars!', true).password, 'twelve-chars!')
})
test('annual statistics count only completed books, including zero ratings', () => {
  const base = { anio_lectura: 2026, paginas: 100, puntuacion: 0, autores: ['A', 'A'] }
  const books = [ { ...base, estado: 'Leído' }, { ...base, estado: 'Pendiente', puntuacion: 10 },
    { ...base, estado: 'Abandonado' }, { ...base, estado: 'Leído', anio_lectura: 2025 } ] as Libro[]
  assert.deepEqual(readingStatistics(books, 2026), { total: 1, promedioPuntuacion: 0, autorTop: null, totalPaginas: 100 })
  assert.equal(readingStatistics([], 2026).promedioPuntuacion, null)
})

test('database configuration rejects service-role keys and unsafe site origins', async () => {
  const { supabaseConfig, siteOrigin } = await import('../src/lib/supabase/config.ts')
  const previous = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY, site: process.env.SITE_URL }
  try {
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    for (const role of ['service_role', 'authenticated']) {
      process.env.SUPABASE_ANON_KEY = 'header.' + Buffer.from(JSON.stringify({ role })).toString('base64url') + '.signature'
      assert.throws(supabaseConfig)
    }
    process.env.SUPABASE_ANON_KEY = 'sb_secret_test'
    assert.throws(supabaseConfig)
    process.env.SUPABASE_ANON_KEY = 'sb_publishable_test'
    assert.equal(supabaseConfig().key, 'sb_publishable_test')
    for (const site of ['http://public.example', 'https://example.com/path', 'https://user@example.com', 'https://example.com/?query=x']) {
      process.env.SITE_URL = site; assert.throws(siteOrigin)
    }
    process.env.SITE_URL = 'http://localhost:3000'
    assert.equal(siteOrigin(), 'http://localhost:3000')
    process.env.SITE_URL = 'https://example.com'
    assert.equal(siteOrigin(), 'https://example.com')
  } finally {
    for (const [name, value] of Object.entries({ SUPABASE_URL: previous.url, SUPABASE_ANON_KEY: previous.key, SITE_URL: previous.site })) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value
    }
  }
})
