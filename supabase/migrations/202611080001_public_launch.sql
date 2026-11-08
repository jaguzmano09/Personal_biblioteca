-- Run against a backup/staging database first. Transactional: invalid legacy rows abort without deletion.
begin;

create table if not exists public.libros (
  id uuid primary key default gen_random_uuid(), user_id uuid not null,
  google_books_id text, titulo text not null, autores text[], editorial text,
  fecha_publicacion text, paginas integer, portada_url text, isbn text,
  estado text not null, puntuacion numeric(3,1), resumen_analisis text,
  personaje_favorito text, citas_destacadas text, anio_lectura integer,
  mes_lectura integer, formato text, procedencia text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.metas_lectura (
  user_id uuid not null, anio integer not null, meta_libros integer not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key (user_id, anio)
);

alter table public.libros alter column puntuacion type numeric(3,1);
alter table public.libros alter column user_id set not null;
alter table public.libros alter column titulo set not null;
alter table public.libros alter column estado set not null;
alter table public.libros alter column created_at set not null;
alter table public.libros alter column updated_at set not null;
alter table public.metas_lectura alter column created_at set not null;
alter table public.metas_lectura alter column updated_at set not null;
alter table public.metas_lectura alter column anio set not null;
alter table public.metas_lectura alter column meta_libros set not null;
alter table public.metas_lectura alter column user_id set not null;
alter table public.libros add constraint libros_owner_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.metas_lectura add constraint metas_owner_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.libros add constraint libros_values_valid check (
  length(trim(titulo)) between 1 and 1000 and
  (google_books_id is null or length(google_books_id) between 1 and 200) and
  (autores is null or (cardinality(autores) <= 50 and length(array_to_string(autores, '')) <= 25000)) and
  (editorial is null or length(editorial) <= 1000) and
  (fecha_publicacion is null or length(fecha_publicacion) <= 100) and
  (isbn is null or length(isbn) <= 32) and
  estado in ('Leído', 'Leyendo', 'Pendiente', 'Abandonado') and
  (puntuacion is null or puntuacion between 0 and 10) and
  (paginas is null or paginas between 0 and 1000000) and
  (anio_lectura is null or anio_lectura between 1000 and 9999) and
  (mes_lectura is null or (anio_lectura is not null and mes_lectura between 1 and 12)) and
  (formato is null or formato in ('Física', 'Digital')) and
  (procedencia is null or procedencia in ('Casa de mis papás', 'Regalado', 'Comprado')) and
  (resumen_analisis is null or length(resumen_analisis) <= 20000) and
  (citas_destacadas is null or length(citas_destacadas) <= 20000) and
  (personaje_favorito is null or length(personaje_favorito) <= 500)
);
alter table public.metas_lectura add constraint metas_values_valid check (
  anio between 1000 and 9999 and meta_libros between 1 and 100000
);
create unique index libros_owner_google_unique on public.libros(user_id, google_books_id) where google_books_id is not null;
create unique index metas_owner_year_unique on public.metas_lectura(user_id, anio);
create index libros_owner_updated on public.libros(user_id, updated_at desc, id);

-- Remove legacy permissive policies: PostgreSQL ORs permissive policies together.
do $$ declare p record; begin
  for p in select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('libros', 'metas_lectura')
  loop execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename); end loop;
end $$;

alter table public.libros enable row level security;
alter table public.libros force row level security;
alter table public.metas_lectura enable row level security;
alter table public.metas_lectura force row level security;
revoke all on public.libros, public.metas_lectura from public, anon, authenticated;
grant select, insert, update, delete on public.libros, public.metas_lectura to authenticated;

create policy libros_select_own on public.libros for select to authenticated using ((select auth.uid()) = user_id);
create policy libros_insert_own on public.libros for insert to authenticated with check ((select auth.uid()) = user_id);
create policy libros_update_own on public.libros for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy libros_delete_own on public.libros for delete to authenticated using ((select auth.uid()) = user_id);
create policy metas_select_own on public.metas_lectura for select to authenticated using ((select auth.uid()) = user_id);
create policy metas_insert_own on public.metas_lectura for insert to authenticated with check ((select auth.uid()) = user_id);
create policy metas_update_own on public.metas_lectura for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy metas_delete_own on public.metas_lectura for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.protect_library_identity() returns trigger
language plpgsql set search_path = '' as $$ begin
  if new.user_id is distinct from old.user_id or new.created_at is distinct from old.created_at then
    raise exception 'Immutable ownership/creation fields' using errcode = '42501';
  end if;
  if tg_table_name = 'libros' and new.id is distinct from old.id then
    raise exception 'Immutable book ID' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.protect_library_identity() from public;
create trigger libros_identity before update on public.libros for each row execute function public.protect_library_identity();
-- Separate trigger avoids accessing a nonexistent id field on metas_lectura.
create or replace function public.protect_goal_identity() returns trigger
language plpgsql set search_path = '' as $$ begin
  if new.user_id is distinct from old.user_id or new.anio is distinct from old.anio or new.created_at is distinct from old.created_at then
    raise exception 'Immutable goal identity' using errcode = '42501';
  end if;
  new.updated_at := now(); return new;
end $$;
revoke all on function public.protect_goal_identity() from public;
create trigger metas_identity before update on public.metas_lectura for each row execute function public.protect_goal_identity();

-- Shared atomic limiter: works across serverless instances, one row per user (deleted with account).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.book_search_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null, requests integer not null
);
alter table private.book_search_limits enable row level security;
revoke all on private.book_search_limits from public, anon, authenticated;
create or replace function public.consume_book_search() returns boolean
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid(); allowed boolean; begin
  if owner_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  insert into private.book_search_limits as limiter(user_id, window_start, requests)
  values (owner_id, clock_timestamp(), 1)
  on conflict (user_id) do update set
    window_start = case when limiter.window_start <= clock_timestamp() - interval '1 minute' then clock_timestamp() else limiter.window_start end,
    requests = case when limiter.window_start <= clock_timestamp() - interval '1 minute' then 1 else limiter.requests + 1 end
  where limiter.window_start <= clock_timestamp() - interval '1 minute' or limiter.requests < 20
  returning true into allowed;
  return coalesce(allowed, false);
end $$;
revoke all on function public.consume_book_search() from public, anon;
grant execute on function public.consume_book_search() to authenticated;
commit;
