-- Apply after 001. For an aborted 001, retry its corrected version first, then this file.
-- No user rows or cover URLs are changed. Also upgrades databases where the original 001 succeeded.
begin;
alter table public.libros drop constraint if exists libros_values_valid;
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

create table private.cover_request_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null, requests integer not null
);
alter table private.cover_request_limits enable row level security;
revoke all on private.cover_request_limits from public, anon, authenticated;
create or replace function public.consume_cover_request() returns boolean
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid(); allowed boolean; begin
  if owner_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  insert into private.cover_request_limits as limiter(user_id, window_start, requests)
  values (owner_id, clock_timestamp(), 1)
  on conflict (user_id) do update set
    window_start = case when limiter.window_start <= clock_timestamp() - interval '1 minute' then clock_timestamp() else limiter.window_start end,
    requests = case when limiter.window_start <= clock_timestamp() - interval '1 minute' then 1 else limiter.requests + 1 end
  where limiter.window_start <= clock_timestamp() - interval '1 minute' or limiter.requests < 120
  returning true into allowed;
  return coalesce(allowed, false);
end $$;
revoke all on function public.consume_cover_request() from public, anon;
grant execute on function public.consume_cover_request() to authenticated;
commit;
