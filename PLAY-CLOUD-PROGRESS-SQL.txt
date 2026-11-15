-- Optional: account continuity for Play & Learn. Guest activities do not need this.
begin;
create table if not exists public.play_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null default '{"version":1,"entries":{},"bookmarks":[],"drafts":{},"lastId":""}'::jsonb,
 revision integer not null default 1 check (revision > 0),
 updated_at timestamptz not null default now(),
 constraint play_payload_size check (octet_length(payload::text) <= 160000)
);
alter table public.play_profiles enable row level security;
revoke all on public.play_profiles from anon;
grant select, insert, update on public.play_profiles to authenticated;
drop policy if exists play_read_own on public.play_profiles;
create policy play_read_own on public.play_profiles for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists play_insert_own on public.play_profiles;
create policy play_insert_own on public.play_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists play_update_own on public.play_profiles;
create policy play_update_own on public.play_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
commit;
