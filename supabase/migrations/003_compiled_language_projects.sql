-- Apply after migrations 001 and 002. No RLS changes.
begin;
alter table public.projects drop constraint if exists projects_language_check;
alter table public.projects add constraint projects_language_check
 check (language in ('javascript','typescript','html','react','python','sql','json','go','nextjs','c','cpp','rust','csharp','java'));
commit;
