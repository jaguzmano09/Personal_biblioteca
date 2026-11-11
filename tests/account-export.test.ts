import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

const account = {
  id: 'owner-a',
  email: 'reader@example.test',
  private_auth_field: 'never-export'
}
let signedIn = true
let failTable = ''
let rowCount = 0
const filters: { table: string; column: string; owner: string }[] = []
const client = {
  auth: {
    getUser: async () => ({
      data: { user: signedIn ? account : null },
      error: null
    })
  },
  from: (table: string) => {
    const query = {
      select: () => query,
      eq: (column: string, owner: string) => {
        filters.push({ table, column, owner })
        return query
      },
      order: () => query,
      range: async (start: number, end: number) => ({
        error:
          table === failTable
            ? { message: 'private provider diagnostic' }
            : null,
        data: Array.from(
          { length: Math.max(0, Math.min(rowCount, end + 1) - start) },
          (_, index) =>
            table === 'libros'
              ? {
                  id: `book-${start + index}`,
                  resumen_analisis: 'Private note',
                  puntuacion: 7.6
                }
              : { anio: 1000 + start + index, meta_libros: 12 }
        )
      })
    }
    return query
  }
}
Object.defineProperty(globalThis, '__tinterunaExportTest', {
  configurable: true,
  value: {
    createClient: async () => client,
    requireUser: async () => {
      assert.ok(signedIn, 'Private reads require authentication')
      return { supabase: client, user: account }
    },
    revalidatePath: () => assert.fail('Export must be read-only')
  }
})

const source = (path: string) => new URL(`../src/${path}`, import.meta.url).href
const routeUrl = source('app/api/account/export/route.ts')
const librosUrl = source('lib/libros.ts')
const metasUrl = source('lib/metas.ts')
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if ([routeUrl, librosUrl, metasUrl].includes(context.parentURL ?? '')) {
      if (specifier === '@/lib/libros')
        return { url: librosUrl, shortCircuit: true }
      if (specifier === '@/lib/metas')
        return { url: metasUrl, shortCircuit: true }
      if (specifier === './validation')
        return { url: source('lib/validation.ts'), shortCircuit: true }
      const boundaries: Record<string, string> = {
        '@/lib/supabase/server': 'createClient',
        './session': 'requireUser',
        'next/cache': 'revalidatePath'
      }
      const name = boundaries[specifier]
      if (name)
        return {
          url: `data:text/javascript,${encodeURIComponent(`export function ${name}(...args) { return globalThis.__tinterunaExportTest.${name}(...args) }`)}`,
          shortCircuit: true
        }
    }
    return nextResolve(specifier, context)
  }
})
const { GET } = (await import(
  routeUrl
)) as typeof import('../src/app/api/account/export/route.ts')
hooks.deregister()
after(() => Reflect.deleteProperty(globalThis, '__tinterunaExportTest'))

test('anonymous export returns a private 401 without reading records', async () => {
  signedIn = false
  filters.length = 0
  const response = await GET()
  assert.equal(response.status, 401)
  assert.match(response.headers.get('cache-control')!, /private, no-store/)
  assert.equal(response.headers.get('content-disposition'), null)
  assert.equal(filters.length, 0)
})

test('export includes all paginated books and goals under the session owner', async () => {
  signedIn = true
  rowCount = 501
  filters.length = 0
  const response = await GET()
  assert.equal(response.status, 200)
  assert.match(
    response.headers.get('content-disposition')!,
    /^attachment; filename="tinteruna-\d{4}-\d{2}-\d{2}\.json"$/
  )
  assert.match(response.headers.get('cache-control')!, /no-store/)
  const body = await response.json()
  assert.deepEqual(body.cuenta, { id: account.id, correo: account.email })
  assert.equal(body.libros.length, 501)
  assert.equal(body.metas.length, 501)
  assert.equal(body.libros[500].resumen_analisis, 'Private note')
  assert.equal(body.libros[500].puntuacion, 7.6)
  assert.equal(filters.length, 4)
  for (const filter of filters) {
    assert.equal(filter.column, 'user_id')
    assert.equal(filter.owner, account.id)
  }
  assert.deepEqual(
    new Set(filters.map(filter => filter.table)),
    new Set(['libros', 'metas_lectura'])
  )
})

test('export failures return a safe private error without a partial download', async () => {
  failTable = 'metas_lectura'
  const response = await GET()
  assert.equal(response.status, 500)
  assert.equal(response.headers.get('content-disposition'), null)
  assert.match(response.headers.get('cache-control')!, /no-store/)
  assert.doesNotMatch(
    await response.text(),
    /private provider diagnostic|Private note/
  )
  failTable = ''
})
