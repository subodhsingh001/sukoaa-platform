-- Run after migration. Expect every table's rowsecurity to be true.
select tablename,rowsecurity from pg_tables where schemaname='public' and tablename in ('profiles','app_roles','projects','releases');
select tablename,policyname,roles,cmd from pg_policies where schemaname='public' order by tablename,policyname;
-- There must be no client write privilege on app_roles.
select has_table_privilege('authenticated','public.app_roles','INSERT') as can_insert_role,
       has_table_privilege('authenticated','public.app_roles','UPDATE') as can_update_role,
       has_table_privilege('authenticated','public.app_roles','DELETE') as can_delete_role;
-- All three above must be false. Also perform the two-account tests in the security guide.
