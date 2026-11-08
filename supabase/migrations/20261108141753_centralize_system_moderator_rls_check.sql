create or replace function private.is_pluits_moderator()
returns boolean language sql stable security invoker set search_path = '' as $function$
  select coalesce((select auth.jwt())->'app_metadata'->>'role' = any (array['admin','moderator']),false);
$function$;
revoke all on function private.is_pluits_moderator() from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.is_pluits_moderator() to authenticated;
drop policy if exists pluits_system_announcements_read_published on public.pluits_system_announcements;
create policy pluits_system_announcements_read_published on public.pluits_system_announcements for select to authenticated
 using ((status='published' and published_at is not null and published_at<=now() and (expires_at is null or expires_at>now())) or (select private.is_pluits_moderator()));
drop policy if exists pluits_system_announcements_admin_insert on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_insert on public.pluits_system_announcements for insert to authenticated
 with check (created_by=(select auth.uid()) and (select private.is_pluits_moderator()));
drop policy if exists pluits_system_announcements_admin_update on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_update on public.pluits_system_announcements for update to authenticated
 using ((select private.is_pluits_moderator())) with check ((select private.is_pluits_moderator()));
drop policy if exists pluits_system_announcements_admin_delete on public.pluits_system_announcements;
create policy pluits_system_announcements_admin_delete on public.pluits_system_announcements for delete to authenticated
 using ((select private.is_pluits_moderator()));
