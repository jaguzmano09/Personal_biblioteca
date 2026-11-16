import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto'
import { authAttemptProof, trustedAuthIp } from '../src/lib/auth-abuse.ts'

const migration = await readFile(
  new URL(
    '../supabase/migrations/20261116025030_auth_abuse_limits.sql',
    import.meta.url
  ),
  'utf8'
)
const secret = 'a'.repeat(64)
const callSql = 'select public.consume_auth_attempt($1,$2,$3,$4,$5,$6) as allowed'

test('only trusted ingress IPs are accepted and IPv6 address rotation shares a /64 budget', () => {
  assert.equal(
    trustedAuthIp(
      new Headers({ 'x-forwarded-for': '::ffff:192.0.2.1' }),
      true,
      false
    ),
    '192.0.2.1'
  )
  assert.equal(
    trustedAuthIp(
      new Headers({ 'x-forwarded-for': '2001:db8:1234:5678::1' }),
      true,
      false
    ),
    trustedAuthIp(
      new Headers({ 'x-forwarded-for': '2001:db8:1234:5678::abcd' }),
      true,
      false
    )
  )
  assert.throws(() =>
    trustedAuthIp(new Headers({ 'x-forwarded-for': '192.0.2.1' }), false, false)
  )
  assert.throws(() =>
    trustedAuthIp(
      new Headers({ 'x-forwarded-for': '192.0.2.1, 192.0.2.2' }),
      true,
      false
    )
  )
  assert.equal(
    trustedAuthIp(new Headers({ 'x-forwarded-for': '192.0.2.1' }), false, true),
    '127.0.0.1'
  )
  assert.throws(() =>
    authAttemptProof('short', 'login', 'ip', 'reader@example.test')
  )
  assert.equal(
    authAttemptProof(secret, 'login', 'ip', ' Reader@Example.Test ').p_account_hash,
    authAttemptProof(secret, 'signup', 'ip', 'reader@example.test').p_account_hash
  )
})

test('real PostgreSQL gates anonymous quota calls by signature and atomic expiring budgets', async t => {
  const db = new PGlite({ extensions: { pgcrypto } })
  try {
    await db.exec(
      'create role anon; create role authenticated; create schema extensions;'
    )
    await db.exec(migration)
    await db.query('update private.auth_guard_config set secret=$1', [secret])
    const call = async (proof: ReturnType<typeof authAttemptProof>) => {
      await db.exec('set role anon')
      try {
        return (await db.query<{ allowed: boolean }>(callSql, Object.values(proof)))
          .rows[0].allowed
      } finally {
        await db.exec('reset role')
      }
    }
    await t.test(
      'rejects unsigned, tampered, expired and replayed requests without arbitrary writes',
      async () => {
        const proof = authAttemptProof(
          secret,
          'login',
          '192.0.2.1',
          'reader@example.test'
        )
        assert.equal(await call({ ...proof, p_signature: '0'.repeat(64) }), false)
        assert.equal(await call({ ...proof, p_action: 'signup' }), false)
        assert.equal(
          await call(
            authAttemptProof(
              secret,
              'login',
              'ip',
              'x@example.test',
              Date.now() - 120000
            )
          ),
          false
        )
        assert.equal(
          (await db.query('select * from private.auth_attempt_limits')).rows.length,
          0
        )
        assert.equal(await call(proof), true)
        assert.equal(await call(proof), false)
        await db.exec('set role anon')
        await assert.rejects(db.query('select * from private.auth_guard_config'))
        await assert.rejects(
          db.query('update private.auth_attempt_limits set requests=1')
        )
        await assert.rejects(
          db.query("select private.consume_auth_bucket('bypass',100,1,now())")
        )
        await db.exec('reset role')
      }
    )
    await t.test(
      'limits login pairs while preserving access from another IP and another account',
      async () => {
        for (let i = 0; i < 4; i++)
          assert.equal(
            await call(
              authAttemptProof(secret, 'login', '192.0.2.1', 'reader@example.test')
            ),
            true
          )
        assert.equal(
          await call(
            authAttemptProof(secret, 'login', '192.0.2.1', 'reader@example.test')
          ),
          false
        )
        assert.equal(
          await call(
            authAttemptProof(secret, 'login', '192.0.2.2', 'reader@example.test')
          ),
          true
        )
        assert.equal(
          await call(
            authAttemptProof(secret, 'login', '192.0.2.1', 'other@example.test')
          ),
          true
        )
        await db.exec(
          "update private.auth_attempt_limits set expires_at=now()-interval '1 second'"
        )
        assert.equal(
          await call(
            authAttemptProof(secret, 'login', '192.0.2.1', 'reader@example.test')
          ),
          true
        )
      }
    )
    await t.test(
      'shares mail recipient budgets across actions and IP changes',
      async () => {
        for (const [i, action] of (
          ['signup', 'recovery', 'confirmation'] as const
        ).entries())
          assert.equal(
            await call(
              authAttemptProof(
                secret,
                action,
                `198.51.100.${i + 1}`,
                'recipient@example.test'
              )
            ),
            true
          )
        assert.equal(
          await call(
            authAttemptProof(
              secret,
              'recovery',
              '198.51.100.99',
              'recipient@example.test'
            )
          ),
          false
        )
        assert.equal(
          await call(
            authAttemptProof(
              secret,
              'login',
              '198.51.100.99',
              'recipient@example.test'
            )
          ),
          true
        )
      }
    )
    await t.test(
      'IP cap prevents unlimited pair rows and tables hold no raw identifiers',
      async () => {
        for (let i = 0; i < 20; i++)
          assert.equal(
            await call(
              authAttemptProof(secret, 'login', '203.0.113.1', `r${i}@example.test`)
            ),
            true
          )
        for (let i = 20; i < 35; i++)
          assert.equal(
            await call(
              authAttemptProof(secret, 'login', '203.0.113.1', `r${i}@example.test`)
            ),
            false
          )
        const rows = await db.query<{ bucket: string }>(
          'select bucket from private.auth_attempt_limits'
        )
        assert.equal(
          rows.rows.some(
            r => r.bucket.includes('@') || r.bucket.includes('203.0.113.1')
          ),
          false
        )
        const policies = await db.query<{ relrowsecurity: boolean }>(
          "select relrowsecurity from pg_class where relname in ('auth_guard_config','auth_attempt_limits','auth_attempt_nonces')"
        )
        assert.equal(policies.rows.length, 3)
        assert.ok(policies.rows.every(r => r.relrowsecurity))
      }
    )
  } finally {
    await db.close()
  }
})
