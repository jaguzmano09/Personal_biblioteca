begin;

-- Additive Free-plan storage. No account/library data or existing policies are changed.
create schema if not exists private;
create extension if not exists pgcrypto with schema extensions;

create table private.auth_guard_config (
  singleton boolean primary key default true check (singleton),
  secret text not null check (secret ~ '^[0-9a-f]{64}$')
);
insert into private.auth_guard_config(singleton,secret)
values (true,encode(extensions.gen_random_bytes(32),'hex'));

create table private.auth_attempt_limits (
  bucket text primary key check (length(bucket) <= 150),
  window_start timestamptz not null,
  expires_at timestamptz not null,
  requests integer not null check (requests > 0)
);
create index auth_attempt_limits_expiry on private.auth_attempt_limits(expires_at);
create table private.auth_attempt_nonces (
  nonce uuid primary key,
  expires_at timestamptz not null
);
create index auth_attempt_nonces_expiry on private.auth_attempt_nonces(expires_at);

alter table private.auth_guard_config enable row level security;
alter table private.auth_attempt_limits enable row level security;
alter table private.auth_attempt_nonces enable row level security;
revoke all on private.auth_guard_config, private.auth_attempt_limits, private.auth_attempt_nonces from public, anon, authenticated;

create function private.consume_auth_bucket(p_bucket text, p_max integer, p_seconds integer, p_now timestamptz)
returns boolean language plpgsql set search_path = '' as $$
declare accepted boolean;
begin
  insert into private.auth_attempt_limits as limiter(bucket,window_start,expires_at,requests)
  values (p_bucket,p_now,p_now + make_interval(secs => p_seconds),1)
  on conflict (bucket) do update set
    window_start = case when limiter.expires_at <= p_now then p_now else limiter.window_start end,
    expires_at = case when limiter.expires_at <= p_now then p_now + make_interval(secs => p_seconds) else limiter.expires_at end,
    requests = case when limiter.expires_at <= p_now then 1 else limiter.requests + 1 end
  where limiter.expires_at <= p_now or limiter.requests < p_max
  returning true into accepted;
  return coalesce(accepted,false);
end $$;
revoke all on function private.consume_auth_bucket(text,integer,integer,timestamptz) from public,anon,authenticated;

-- Pre-auth callers need this RPC, but only the web server can sign valid requests.
-- Keyed identifiers, timestamp and nonce prevent arbitrary bucket writes and replay.
create function public.consume_auth_attempt(
  p_action text, p_ip_hash text, p_account_hash text,
  p_issued_at bigint, p_nonce uuid, p_signature text
) returns boolean language plpgsql security definer set search_path = '' as $$
declare
  signing_key text;
  expected bytea;
  accepted uuid;
  attempt_time timestamptz := clock_timestamp();
begin
  if not coalesce(p_action in ('login','signup','recovery','confirmation'),false)
    or not coalesce(p_ip_hash ~ '^[0-9a-f]{64}$',false)
    or not coalesce(p_account_hash ~ '^[0-9a-f]{64}$',false)
    or not coalesce(p_signature ~ '^[0-9a-f]{64}$',false)
    or p_nonce is null
    or not coalesce(abs(extract(epoch from attempt_time) - p_issued_at) <= 60,false)
  then return false; end if;

  select secret into signing_key from private.auth_guard_config where singleton;
  if signing_key is null then return false; end if;
  expected := extensions.hmac(
    convert_to(p_action || '|' || p_ip_hash || '|' || p_account_hash || '|' || p_issued_at::text || '|' || p_nonce::text,'UTF8'),
    decode(signing_key,'hex'),'sha256');
  if extensions.digest(decode(p_signature,'hex'),'sha256') is distinct from extensions.digest(expected,'sha256')
    then return false; end if;

  delete from private.auth_attempt_nonces where expires_at <= attempt_time;
  delete from private.auth_attempt_limits where expires_at <= attempt_time;
  insert into private.auth_attempt_nonces(nonce,expires_at)
    values(p_nonce,attempt_time + interval '2 minutes') on conflict do nothing returning nonce into accepted;
  if accepted is null then return false; end if;

  -- Cap aggregate IP traffic first so blocked clients cannot create arbitrary account buckets.
  if not private.consume_auth_bucket('all:ip:' || p_ip_hash,30,60,attempt_time) then return false; end if;
  if p_action = 'login' then
    if not private.consume_auth_bucket('login:ip:' || p_ip_hash,20,60,attempt_time) then return false; end if;
    -- Pair budget, rather than a global account lockout that strangers could trigger.
    return private.consume_auth_bucket('login:pair:' || encode(extensions.digest(p_ip_hash || p_account_hash,'sha256'),'hex'),5,600,attempt_time);
  end if;
  if not private.consume_auth_bucket(p_action || ':ip:' || p_ip_hash,case when p_action='signup' then 3 else 5 end,600,attempt_time)
    then return false; end if;
  -- All email-producing requests share a recipient budget, including changed-IP retries.
  return private.consume_auth_bucket('mail:account:' || p_account_hash,3,3600,attempt_time);
end $$;

revoke all on function public.consume_auth_attempt(text,text,text,bigint,uuid,text) from public;
grant execute on function public.consume_auth_attempt(text,text,text,bigint,uuid,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
