import test from 'node:test'
import assert from 'node:assert/strict'
import { inspectBackups } from '../scripts/check-backups.mjs'

test('backup inventory is blocked without credentials and cannot send them to another host', async () => {
  const fetchImpl = async () => { throw new Error('Must not request') }
  assert.deepEqual(await inspectBackups({ projectRef: 'a'.repeat(20), token: undefined, fetchImpl }), {
    status: 'blocked', reason: 'missing_management_token',
  })
  assert.deepEqual(await inspectBackups({ projectRef: '../attacker.example', token: 'fixture', fetchImpl }), {
    status: 'blocked', reason: 'invalid_project_ref',
  })
})

test('backup reports never leak provider errors, signed links or inventory bodies', async () => {
  const token = 'fixture-private-token'
  const options = { projectRef: 'a'.repeat(20), token }
  const failed = await inspectBackups({ ...options, fetchImpl: async () => Response.json({ secret: token }, { status: 403 }) })
  assert.deepEqual(failed, { status: 'unverified', reason: 'provider_request_failed', httpStatus: 403 })
  const listed = await inspectBackups({
    ...options,
    fetchImpl: async (url, init) => {
      assert.equal(url, `https://api.supabase.com/v1/projects/${options.projectRef}/database/backups`)
      assert.equal(init?.redirect, 'error')
      assert.equal(new Headers(init?.headers).get('authorization'), `Bearer ${token}`)
      return Response.json({ backups: [{ signed_url: token, internal: 'private' }], pitr_enabled: false, other_secret: token })
    },
  })
  assert.deepEqual(listed, { status: 'listed', backupCount: 1, restoreVerified: false, pitrEnabled: false })
  assert.equal(JSON.stringify({ failed, listed }).includes(token), false)
  const unavailable = await inspectBackups({ ...options, fetchImpl: async () => { throw new Error(token) } })
  assert.deepEqual(unavailable, { status: 'unverified', reason: 'provider_unavailable' })
  assert.deepEqual(await inspectBackups({ ...options, fetchImpl: async () => Response.json({ secret: token }) }), {
    status: 'unverified', reason: 'unexpected_provider_response',
  })
})
