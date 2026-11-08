import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

const initialMigration = await readFile(new URL('../supabase/migrations/202611080001_public_launch.sql', import.meta.url), 'utf8')
const coverMigration = await readFile(new URL('../supabase/migrations/202611080002_manual_covers.sql', import.meta.url), 'utf8')
const migration = initialMigration + '\n' + coverMigration
const A = '11111111-1111-4111-8111-111111111111'
const B = '22222222-2222-4222-8222-222222222222'
const book = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
async function setup() {
  const db = new PGlite()
  // Supabase supplies these roles and auth.uid in production; emulate the JWT subject, not RLS itself.
  await db.exec(`create role anon; create role authenticated;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    insert into auth.users values ('${A}'), ('${B}');`)
  return db
}
async function asUser(db: PGlite, role: string, id: string) {
  await db.exec('reset role')
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id])
  await db.exec(`set role ${role}`)
}

test('PostgreSQL enforces ownership, constraints and shared search quotas', async t => {
  const db = await setup()
  try {
    await db.exec(migration)
    await asUser(db, 'authenticated', A)
    await db.exec(`insert into public.libros(id,user_id,google_books_id,titulo,estado,puntuacion) values ('${book}','${A}','google-1','Private A','Leído',10);
      insert into public.metas_lectura(user_id,anio,meta_libros) values ('${A}',2026,5);`)
    await t.test('owner can read, update and upsert their own records', async () => {
      assert.equal((await db.query('select * from public.libros')).rows.length, 1)
      await db.exec(`update public.libros set puntuacion=0 where id='${book}';
        insert into public.metas_lectura(user_id,anio,meta_libros) values ('${A}',2026,8)
        on conflict(user_id,anio) do update set meta_libros=excluded.meta_libros;`)
      assert.equal((await db.query<{ meta_libros: number }>('select meta_libros from public.metas_lectura')).rows[0].meta_libros, 8)
    })
    await t.test('other authenticated accounts cannot read, modify, delete or insert as owner', async () => {
      await asUser(db, 'authenticated', B)
      for (const table of ['libros', 'metas_lectura']) {
        assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0)
        const column = table === 'libros' ? "titulo='stolen'" : 'meta_libros=99'
        assert.equal((await db.query(`update public.${table} set ${column} returning *`)).rows.length, 0)
        assert.equal((await db.query(`delete from public.${table} returning *`)).rows.length, 0)
      }
      await assert.rejects(db.exec(`insert into public.libros(user_id,titulo,estado) values ('${A}','spoof','Pendiente')`), /row-level security/)
      await assert.rejects(db.exec(`insert into public.metas_lectura(user_id,anio,meta_libros) values ('${A}',2027,2)`), /row-level security/)
      // Same Google ID/year is allowed for a different user.
      await db.exec(`insert into public.libros(user_id,google_books_id,titulo,estado) values ('${B}','google-1','Private B','Pendiente');
        insert into public.metas_lectura(user_id,anio,meta_libros) values ('${B}',2026,2);`)
    })
    await t.test('ownership, identity, ranges and duplicates are protected in the database', async () => {
      await asUser(db, 'authenticated', A)
      for (const sql of [
        `update public.libros set user_id='${B}'`, `update public.libros set id=gen_random_uuid()`,
        `update public.metas_lectura set user_id='${B}'`, `update public.metas_lectura set anio=2027`,
        `update public.libros set puntuacion=11`, `update public.libros set mes_lectura=1`,
        `update public.metas_lectura set meta_libros=0`,
        `insert into public.libros(user_id,google_books_id,titulo,estado) values ('${A}','google-1','duplicate','Leído')`,
      ]) await assert.rejects(db.exec(sql))
    })
    await t.test('search quota is per authenticated account and resets after the window', async () => {
      for (let i = 0; i < 20; i++) assert.equal((await db.query<{ allowed: boolean }>('select public.consume_book_search() as allowed')).rows[0].allowed, true)
      assert.equal((await db.query<{ allowed: boolean }>('select public.consume_book_search() as allowed')).rows[0].allowed, false)
      await assert.rejects(db.exec('select * from private.book_search_limits'), /permission denied/)
      await asUser(db, 'authenticated', B)
      assert.equal((await db.query<{ allowed: boolean }>('select public.consume_book_search() as allowed')).rows[0].allowed, true)
      await db.exec('reset role')
      await db.exec(`update private.book_search_limits set window_start=now()-interval '2 minutes' where user_id='${A}'`)
      await asUser(db, 'authenticated', A)
      assert.equal((await db.query<{ allowed: boolean }>('select public.consume_book_search() as allowed')).rows[0].allowed, true)
    })
    await t.test('cover quota is separate from search and enforces account limits', async () => {
      await asUser(db, 'authenticated', A)
      for (let i = 0; i < 120; i++) assert.equal((await db.query<{ allowed: boolean }>('select public.consume_cover_request() as allowed')).rows[0].allowed, true)
      assert.equal((await db.query<{ allowed: boolean }>('select public.consume_cover_request() as allowed')).rows[0].allowed, false)
      await assert.rejects(db.exec('select * from private.cover_request_limits'), /permission denied/)
      await asUser(db, 'authenticated', B)
      assert.equal((await db.query<{ allowed: boolean }>('select public.consume_cover_request() as allowed')).rows[0].allowed, true)
    })
    await t.test('anonymous role has no access or quota RPC permission', async () => {
      await asUser(db, 'anon', '')
      for (const table of ['libros', 'metas_lectura']) {
        for (const sql of [`select * from public.${table}`, `delete from public.${table}`,
          table === 'libros' ? `insert into public.libros(user_id,titulo,estado) values ('${A}','anonymous','Leído')` : `insert into public.metas_lectura(user_id,anio,meta_libros) values ('${A}',2028,1)`,
          table === 'libros' ? `update public.libros set titulo='anonymous'` : 'update public.metas_lectura set meta_libros=1']) await assert.rejects(db.exec(sql), /permission denied/)
      }
      await assert.rejects(db.exec('select public.consume_book_search()'), /permission denied/)
      await assert.rejects(db.exec('select public.consume_cover_request()'), /permission denied/)
    })
    await t.test('owners can delete without affecting other accounts', async () => {
      await asUser(db, 'authenticated', A)
      assert.equal((await db.query('delete from public.libros returning id')).rows.length, 1)
      assert.equal((await db.query('delete from public.metas_lectura returning user_id')).rows.length, 1)
      await asUser(db, 'authenticated', B)
      assert.equal((await db.query('select * from public.libros')).rows.length, 1)
      assert.equal((await db.query('select * from public.metas_lectura')).rows.length, 1)
    })
  } finally { await db.close() }
})

test('migration removes existing permissive policies and preserves legacy rows', async () => {
  const db = await setup()
  try {
    // Create the same starting tables, plus a dangerous old policy and a numeric(2,1) score.
    const tables = migration.slice(migration.indexOf('create table'), migration.indexOf('alter table public.libros alter column puntuacion'))
    await db.exec(tables)
    await db.exec(`alter table public.libros alter column puntuacion type numeric(2,1);
      alter table public.libros enable row level security;
      create policy legacy_allow_all on public.libros for all to public using(true) with check(true);
      insert into public.libros(user_id,titulo,estado,puntuacion,portada_url) values ('${A}','Keep me','Leído',9.5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:original&s=10');`)
    await db.exec(migration)
    await asUser(db, 'authenticated', B)
    assert.equal((await db.query('select * from public.libros')).rows.length, 0)
    await asUser(db, 'authenticated', A)
    assert.equal((await db.query('select * from public.libros')).rows.length, 1)
    assert.equal((await db.query<{ portada_url: string }>('select portada_url from public.libros')).rows[0].portada_url,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:original&s=10')
    await db.exec('update public.libros set puntuacion=10')
  } finally { await db.close() }
})
