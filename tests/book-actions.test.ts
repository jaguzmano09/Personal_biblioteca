import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

let dependencies: Record<string, unknown> = {}
Object.defineProperty(globalThis, '__tinterunaActionTest', {
  get: () => dependencies,
  configurable: true
})
const actionUrl = new URL('../src/lib/libros.ts', import.meta.url).href
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === actionUrl) {
      if (specifier === './validation')
        return {
          url: new URL('../src/lib/validation.ts', import.meta.url).href,
          shortCircuit: true
        }
      if (specifier === './session' || specifier === 'next/cache') {
        const name =
          specifier === './session' ? 'requireUser' : 'revalidatePath'
        return {
          url: `data:text/javascript,${encodeURIComponent(`export function ${name}(...args) { return globalThis.__tinterunaActionTest.${name}(...args) }`)}`,
          shortCircuit: true
        }
      }
    }
    return nextResolve(specifier, context)
  }
})
const { guardarLibro } = (await import(
  actionUrl
)) as typeof import('../src/lib/libros.ts')
hooks.deregister()
after(() => Reflect.deleteProperty(globalThis, '__tinterunaActionTest'))

// Exercise the server action itself with isolated Auth and database boundaries.
function setup(
  databaseError: { code: string; message: string } | null = null,
  authenticated = true
) {
  const inserted: unknown[] = []
  const invalidated: string[] = []
  const session = {
    user: { id: 'owner-a' },
    supabase: {
      from: () => ({
        insert: (payload: unknown) => {
          inserted.push(payload)
          return {
            select: () => ({
              single: async () => ({
                data: { id: 'book-a' },
                error: databaseError
              })
            })
          }
        }
      })
    }
  }
  dependencies = {
    requireUser: async () => {
      if (!authenticated) throw new Error('Authentication required')
      return session
    },
    revalidatePath: (path: string) => invalidated.push(path)
  }
  return { guardarLibro, inserted, invalidated }
}

const edition = {
  google_books_id: 'edition-a',
  titulo: 'Una historia',
  autores: ['Autora'],
  portada_url: 'https://images.example.org/book.jpg',
  editorial: null,
  fecha_publicacion: null,
  paginas: null,
  isbn: null
}

test('book creation authenticates before validation or database access', async () => {
  const action = setup(null, false)
  await assert.rejects(
    action.guardarLibro(edition, {}),
    /Authentication required/
  )
  assert.equal(action.inserted.length, 0)
})

test('invalid personal data is returned as a recoverable action result', async () => {
  const action = setup()
  const result = await action.guardarLibro(edition, {
    estado: 'Pendiente',
    puntuacion: 20
  })
  assert.equal(result.ok, false)
  assert.match(result.error!, /Revisa los campos/)
  assert.equal(action.inserted.length, 0)
  assert.equal(action.invalidated.length, 0)
})

test('duplicate and provider errors remain actionable without leaking database details', async () => {
  for (const code of ['23505', 'XX000']) {
    const action = setup({ code, message: 'private database diagnostic' })
    const result = await action.guardarLibro(edition, { estado: 'Pendiente' })
    assert.equal(result.ok, false)
    assert.match(result.error!, /Tus/)
    assert.doesNotMatch(result.error!, /private database diagnostic/)
    if (code === '23505') assert.match(result.error!, /esta edición/)
    assert.equal(action.invalidated.length, 0)
  }
})

test('successful creation preserves decimal scores, notes and varied cover sources under the owner', async () => {
  const action = setup()
  const result = await action.guardarLibro(edition, {
    estado: 'Leyendo',
    puntuacion: 7.6,
    resumen_analisis: 'Mi primera impresión',
    user_id: 'another-owner'
  })
  assert.equal(result.ok, true)
  assert.equal(result.libro!.id, 'book-a')
  const payload = action.inserted[0] as Record<string, unknown>
  assert.equal(payload.user_id, 'owner-a')
  assert.equal(payload.puntuacion, 7.6)
  assert.equal(payload.resumen_analisis, 'Mi primera impresión')
  assert.equal(payload.portada_url, edition.portada_url)
  assert.deepEqual(action.invalidated, ['/biblioteca'])
})
