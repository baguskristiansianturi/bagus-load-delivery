drop policy if exists directory_media_public_read on public.directory_media;
create policy directory_media_public_read on public.directory_media
for select to anon, authenticated using (
  (moderation_status='published' and exists(select 1 from public.directory_entities e where e.id=entity_id and e.status='published'))
  or exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active')
);

drop policy if exists directory_media_manager_insert on public.directory_media;
create policy directory_media_manager_insert on public.directory_media
for insert to authenticated with check (
  uploaded_by=(select auth.uid())
  and moderation_status='pending'
  and exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
);

drop policy if exists directory_media_manager_update on public.directory_media;
create policy directory_media_manager_update on public.directory_media
for update to authenticated
using (
  moderation_status='pending'
  and exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
)
with check (
  uploaded_by=(select auth.uid())
  and moderation_status='pending'
  and exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
);

drop policy if exists user_post_directory_entities_public_read on public.user_post_directory_entities;
create policy user_post_directory_entities_public_read on public.user_post_directory_entities
for select to anon, authenticated using (
  exists(select 1 from public.user_posts p where p.id=post_id)
  and exists(select 1 from public.directory_entities e where e.id=entity_id and e.status='published')
);
