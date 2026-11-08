create table if not exists public.pluits_system_announcements (
 id uuid primary key default gen_random_uuid(),
 title text not null check (length(trim(title)) between 3 and 160),
 body text not null check (length(trim(body)) between 3 and 8000),
 language text not null default 'id' check (language in ('id','en')),
 severity text not null default 'info' check (severity in ('info','important','critical')),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 published_at timestamptz,
 expires_at timestamptz,
 constraint pluits_system_announcements_dates check (expires_at is null or published_at is null or expires_at>published_at)
);
create index if not exists pluits_system_announcements_published_idx on public.pluits_system_announcements(published_at desc) where status='published';
create table if not exists public.pluits_system_announcement_reads (
 announcement_id uuid not null references public.pluits_system_announcements(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 read_at timestamptz not null default now(),
 primary key(announcement_id,user_id)
);
create index if not exists pluits_system_announcement_reads_user_idx on public.pluits_system_announcement_reads(user_id,read_at desc);
alter table public.pluits_system_announcements enable row level security;
alter table public.pluits_system_announcement_reads enable row level security;
drop policy if exists pluits_system_announcements_read_published on public.pluits_system_announcements;
create policy pluits_system_announcements_read_published on public.pluits_system_announcements for select to authenticated using ((status='published' and published_at is not null and published_at<=now() and (expires_at is null or expires_at>now())) or coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_insert on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_insert on public.pluits_system_announcements for insert to authenticated with check (created_by=(select auth.uid()) and coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_update on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_update on public.pluits_system_announcements for update to authenticated using (coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator')) with check (coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_delete on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_delete on public.pluits_system_announcements for delete to authenticated using (coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
drop policy if exists pluits_system_announcement_reads_select_own on public.pluits_system_announcement_reads;
create policy pluits_system_announcement_reads_select_own on public.pluits_system_announcement_reads for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists pluits_system_announcement_reads_insert_own on public.pluits_system_announcement_reads;
create policy pluits_system_announcement_reads_insert_own on public.pluits_system_announcement_reads for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists pluits_system_announcement_reads_update_own on public.pluits_system_announcement_reads;
create policy pluits_system_announcement_reads_update_own on public.pluits_system_announcement_reads for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
grant select on public.pluits_system_announcements to authenticated;
grant insert,update,delete on public.pluits_system_announcements to authenticated;
grant select,insert,update on public.pluits_system_announcement_reads to authenticated;
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='pluits_system_announcements') then alter publication supabase_realtime add table public.pluits_system_announcements; end if;
end $$;
