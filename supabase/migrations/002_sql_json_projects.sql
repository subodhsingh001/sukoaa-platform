-- Apply after 001_platform.sql to save the new SQL and JSON project types.
begin;
alter table public.projects drop constraint if exists projects_language_check;
alter table public.projects add constraint projects_language_check
 check (language in ('javascript','typescript','html','react','python','sql','json','go','nextjs'));
commit;
