create index if not exists pluits_system_announcements_created_by_idx on public.pluits_system_announcements(created_by);
drop policy if exists pluits_system_announcements_read_published on public.pluits_system_announcements;
create policy pluits_system_announcements_read_published on public.pluits_system_announcements for select to authenticated
 using ((status='published' and published_at is not null and published_at<=now() and (expires_at is null or expires_at>now())) or coalesce((select auth.jwt()->'app_metadata'->>'role'),'') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_insert on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_insert on public.pluits_system_announcements for insert to authenticated
 with check (created_by=(select auth.uid()) and coalesce((select auth.jwt()->'app_metadata'->>'role'),'') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_update on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_update on public.pluits_system_announcements for update to authenticated
 using (coalesce((select auth.jwt()->'app_metadata'->>'role'),'') in ('admin','moderator'))
 with check (coalesce((select auth.jwt()->'app_metadata'->>'role'),'') in ('admin','moderator'));
drop policy if exists pluits_system_announcements_admin_delete on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_delete on public.pluits_system_announcements for delete to authenticated
 using (coalesce((select auth.jwt()->'app_metadata'->>'role'),'') in ('admin','moderator'));
