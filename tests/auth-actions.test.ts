import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { registrationConsent, NOTICE_VERSION } from '../src/lib/registration.ts'

let dependencies: {
  auth: Record<string, (...args: any[]) => any>
  ready: boolean
  guard?: { error?: string; captchaToken?: string }
}
Object.defineProperty(globalThis, '__tinterunaAuthTest', {
  get: () => dependencies,
  configurable: true
})
const actionUrl = new URL('../src/lib/auth.ts', import.meta.url).href
const hooks = registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL === actionUrl) {
      if (specifier === './validation' || specifier === './registration')
        return {
          url: new URL(`../src/lib/${specifier.slice(2)}.ts`, import.meta.url).href,
          shortCircuit: true
        }
      let source: string | null = null
      if (specifier === './supabase/server')
        source =
          'export async function createClient(){return {auth:globalThis.__tinterunaAuthTest.auth}}'
      if (specifier === './supabase/config')
        source = 'export function siteOrigin(){return "https://example.test"}'
      if (specifier === './operator-config')
        source =
          'export function operatorConfig(){return {ready:globalThis.__tinterunaAuthTest.ready}}'
      if (specifier === './auth-security')
        source =
          'export async function guardAuthAttempt(){return globalThis.__tinterunaAuthTest.guard ?? {}}'
      if (specifier === 'next/navigation')
        source = 'export function redirect(path){throw new Error("REDIRECT "+path)}'
      if (source)
        return {
          url: `data:text/javascript,${encodeURIComponent(source)}`,
          shortCircuit: true
        }
    }
    return next(specifier, context)
  }
})
const actions = (await import(actionUrl)) as typeof import('../src/lib/auth.ts')
hooks.deregister()
after(() => Reflect.deleteProperty(globalThis, '__tinterunaAuthTest'))

function setup() {
  const calls: { method: string; args: any[] }[] = []
  const auth = Object.fromEntries(
    [
      'signInWithPassword',
      'resetPasswordForEmail',
      'resend',
      'updateUser',
      'signOut',
      'signUp'
    ].map(method => [
      method,
      async (...args: any[]) => {
        calls.push({ method, args })
        return { error: null }
      }
    ])
  )
  dependencies = {
    ready: true,
    auth: {
      ...auth,
      getUser: async () => ({ data: { user: { id: 'owner' } }, error: null })
    }
  }
  return calls
}

test('email recovery and confirmation use fixed destinations and non-enumerating responses', async () => {
  const calls = setup()
  const recovery = await actions.solicitarCorreo(' reader@example.test ', 'recovery')
  assert.equal(calls[0].args[0], 'reader@example.test')
  assert.equal(
    calls[0].args[1].redirectTo,
    'https://example.test/api/auth/callback?flow=recovery'
  )
  await actions.solicitarCorreo('reader@example.test', 'confirmation')
  assert.equal(calls[1].args[0].type, 'signup')
  assert.equal(
    calls[1].args[0].options.emailRedirectTo,
    'https://example.test/api/auth/callback'
  )
  dependencies.auth.resetPasswordForEmail = async () => ({
    error: { message: 'private account diagnostic' }
  })
  assert.deepEqual(
    await actions.solicitarCorreo('reader@example.test', 'recovery'),
    recovery
  )
  dependencies.auth.resetPasswordForEmail = async () => {
    throw Error('private failure')
  }
  assert.deepEqual(
    await actions.solicitarCorreo('reader@example.test', 'recovery'),
    recovery
  )
  assert.ok((await actions.solicitarCorreo('invalid', 'recovery')).error)
})

test('all access actions stop on guard denial and forward the token only to Auth', async () => {
  const calls = setup()
  const consent = {
    age: 'adult',
    terms: true,
    privacy: true,
    version: NOTICE_VERSION
  }
  dependencies.guard = { error: 'Limited' }
  assert.deepEqual(
    await actions.iniciarSesion('reader@example.test', 'password', 'token'),
    { error: 'Limited' }
  )
  assert.deepEqual(
    await actions.registrarUsuario(
      'reader@example.test',
      'a-strong-password',
      consent,
      'token'
    ),
    { error: 'Limited' }
  )
  assert.deepEqual(
    await actions.solicitarCorreo('reader@example.test', 'recovery', 'token'),
    { error: 'Limited' }
  )
  assert.deepEqual(
    await actions.solicitarCorreo('reader@example.test', 'confirmation', 'token'),
    { error: 'Limited' }
  )
  assert.equal(calls.length, 0)
  dependencies.guard = { captchaToken: 'one-use-token' }
  await assert.rejects(
    actions.iniciarSesion('reader@example.test', 'password', 'token'),
    /REDIRECT/
  )
  await actions.registrarUsuario(
    'reader@example.test',
    'a-strong-password',
    consent,
    'token'
  )
  await actions.solicitarCorreo('reader@example.test', 'recovery', 'token')
  await actions.solicitarCorreo('reader@example.test', 'confirmation', 'token')
  assert.equal(calls[0].args[0].options.captchaToken, 'one-use-token')
  assert.equal(calls[1].args[0].options.captchaToken, 'one-use-token')
  assert.equal(calls[2].args[1].captchaToken, 'one-use-token')
  assert.equal(calls[3].args[0].options.captchaToken, 'one-use-token')
})

test('password updates require matching strong credentials and a server-validated user', async () => {
  const calls = setup()
  assert.ok((await actions.actualizarClave('short', 'short')).error)
  assert.ok(
    (await actions.actualizarClave('a-strong-new-password', 'different')).error
  )
  assert.equal(calls.length, 0)
  dependencies.auth.getUser = async () => ({
    data: { user: null },
    error: null
  })
  assert.ok(
    (await actions.actualizarClave('a-strong-new-password', 'a-strong-new-password'))
      .error
  )
  assert.equal(calls.length, 0)
  setup()
  const result = await actions.actualizarClave(
    'a-strong-new-password',
    'a-strong-new-password'
  )
  assert.equal(result.success, true)
  assert.equal(result.sessionClosed, true)
})

test('registration rejects missing consent, youth self-registration and incomplete operator settings', async () => {
  const calls = setup()
  const consent = {
    age: 'adult',
    terms: true,
    privacy: true,
    version: NOTICE_VERSION
  }
  for (const invalid of [
    null,
    { ...consent, age: 'teen' },
    { ...consent, privacy: false },
    { ...consent, terms: false },
    { ...consent, version: 'old' }
  ]) {
    assert.throws(() => registrationConsent(invalid))
    assert.ok(
      (
        await actions.registrarUsuario(
          'reader@example.test',
          'a-strong-new-password',
          invalid
        )
      ).error
    )
  }
  assert.equal(calls.length, 0)
  dependencies.ready = false
  assert.ok(
    (
      await actions.registrarUsuario(
        'reader@example.test',
        'a-strong-new-password',
        consent
      )
    ).error
  )
  assert.equal(calls.length, 0)
  dependencies.ready = true
  assert.equal(
    (
      await actions.registrarUsuario(
        'reader@example.test',
        'a-strong-new-password',
        consent
      )
    ).success,
    true
  )
  const receipt = calls[0].args[0].options.data.registration_acceptance
  assert.equal(receipt.terms_version, NOTICE_VERSION)
  assert.equal(receipt.privacy_version, NOTICE_VERSION)
  assert.ok(Number.isFinite(Date.parse(receipt.accepted_at)))
})
