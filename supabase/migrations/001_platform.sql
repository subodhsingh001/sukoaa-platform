-- Sukoaa v0.2.0. Run once in a new Supabase project using SQL Editor.
-- auth.users is managed by Supabase; do not create your own password table.
begin;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name)<=100),
  created_at timestamptz not null default now()
);
create table public.app_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin'))
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check(char_length(trim(name)) between 1 and 100),
  language text not null check(language in ('javascript','typescript','html','react','python','go','nextjs')),
  source text not null default '' check(char_length(source)<=50000),
  stdin text not null default '' check(char_length(stdin)<=5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_owner_updated_idx on public.projects(owner_id,updated_at desc);
create table public.releases (
  id uuid primary key default gen_random_uuid(),
  title text not null check(char_length(title) between 1 and 100),
  version text not null check(char_length(version) between 1 and 50),
  platform text not null check(char_length(platform) between 1 and 30),
  download_url text not null check(download_url ~ '^https://[^\s]+$' and char_length(download_url)<=2000),
  sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(title,version,platform)
);
create index releases_published_created_idx on public.releases(published,created_at desc);
-- Future AI jobs are deliberately not created or consumed by any endpoint.
-- An actual agent implementation needs a separately reviewed migration and quota model.
create function public.initialize_account() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id) values(new.id);
  insert into public.app_roles(user_id,role) values(new.id,'member');
  return new;
end; $$;
revoke all on function public.initialize_account() from public,anon,authenticated;
create trigger on_sukoaa_account_created after insert on auth.users for each row execute function public.initialize_account();
-- Backfill accounts that existed before this migration.
insert into public.profiles(id) select id from auth.users on conflict do nothing;
insert into public.app_roles(user_id,role) select id,'member' from auth.users on conflict do nothing;
create function public.project_before_write() returns trigger language plpgsql set search_path='' as $$
begin
  if TG_OP='INSERT' then
    -- Serialize per-owner quota checks to prevent concurrent quota bypass.
    perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text,0));
    if (select count(*) from public.projects where owner_id=new.owner_id)>=100 then
      raise exception 'Project quota reached (100 projects)';
    end if;
  else
    if new.owner_id<>old.owner_id or new.id<>old.id then raise exception 'Project owner and ID are immutable'; end if;
    new.created_at=old.created_at;
  end if;
  new.updated_at=now();return new;
end; $$;
revoke all on function public.project_before_write() from public,anon,authenticated;
create trigger set_project_timestamp before insert or update on public.projects for each row execute function public.project_before_write();
alter table public.profiles enable row level security;
alter table public.app_roles enable row level security;
alter table public.projects enable row level security;
alter table public.releases enable row level security;
revoke all on public.profiles,public.app_roles,public.projects,public.releases from anon,authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.app_roles to authenticated;
grant select,insert,update,delete on public.projects to authenticated;
grant select on public.releases to anon,authenticated;
grant insert,update,delete on public.releases to authenticated;
create policy profiles_read on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy roles_read_own on public.app_roles for select to authenticated using(user_id=(select auth.uid()));
-- No INSERT/UPDATE/DELETE grants or policies for user role self-service.
create policy projects_read on public.projects for select to authenticated using(owner_id=(select auth.uid()));
create policy projects_insert on public.projects for insert to authenticated with check(owner_id=(select auth.uid()));
create policy projects_update on public.projects for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy projects_delete on public.projects for delete to authenticated using(owner_id=(select auth.uid()));
create policy releases_public_read on public.releases for select to anon,authenticated using(published=true);
create policy releases_admin_read on public.releases for select to authenticated using(exists(select 1 from public.app_roles where user_id=(select auth.uid()) and role='admin'));
create policy releases_admin_write on public.releases for all to authenticated using(exists(select 1 from public.app_roles where user_id=(select auth.uid()) and role='admin')) with check(exists(select 1 from public.app_roles where user_id=(select auth.uid()) and role='admin'));
commit;
-- Promote an admin ONLY using SQL Editor, never through a public signup form:
-- update public.app_roles set role='admin' where user_id=(select id from auth.users where email='YOUR_EMAIL');
