-- Allow public post media records, including secondary gallery videos, to authorize their Storage objects.
-- The bucket remains private; access is limited by publication, visibility and profile/store status.
drop policy if exists pluits_user_media_read_allowed on storage.objects;
create policy pluits_user_media_read_allowed on storage.objects for select to authenticated using (
 bucket_id='pluits-user-media' and (
  (storage.foldername(name))[1]=(select auth.uid())::text
  or exists(select 1 from public.user_posts p where p.media_path=storage.objects.name and p.visibility='public' and p.moderation_status='published'
   and ((p.profile_context='personal' and exists(select 1 from public.user_profiles up where up.id=p.user_id and up.visibility='public'))
    or (p.profile_context='professional' and exists(select 1 from public.professional_profiles pp where pp.id=p.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
    or (p.profile_context='business' and private.is_store_publicly_verified(p.business_store_id))))
  or exists(select 1 from public.post_media pm join public.user_posts p on p.id=pm.post_id and p.user_id=pm.user_id
   where pm.media_path=storage.objects.name and split_part(storage.objects.name,'/',1)=pm.user_id::text and p.visibility='public' and p.moderation_status='published'
   and ((p.profile_context='personal' and exists(select 1 from public.user_profiles up where up.id=p.user_id and up.visibility='public'))
    or (p.profile_context='professional' and exists(select 1 from public.professional_profiles pp where pp.id=p.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
    or (p.profile_context='business' and private.is_store_publicly_verified(p.business_store_id))))
  or exists(select 1 from public.user_stories s where s.media_path=storage.objects.name and s.visibility='public' and s.expires_at>now()
   and (exists(select 1 from public.user_profiles up where up.id=s.user_id and up.visibility='public') or private.is_user_following((select auth.uid()),s.user_id,'accepted')))
  or exists(select 1 from public.user_profiles up where (up.visibility='public' or private.is_user_following((select auth.uid()),up.id,'accepted')) and (up.avatar_path=storage.objects.name or up.cover_path=storage.objects.name))
 ));
drop policy if exists pluits_user_media_read_public_anon on storage.objects;
create policy pluits_user_media_read_public_anon on storage.objects for select to anon using (
 bucket_id='pluits-user-media' and (
  exists(select 1 from public.user_posts p where p.media_path=storage.objects.name and p.visibility='public' and p.moderation_status='published'
   and ((p.profile_context='personal' and exists(select 1 from public.user_profiles up where up.id=p.user_id and up.visibility='public'))
    or (p.profile_context='professional' and exists(select 1 from public.professional_profiles pp where pp.id=p.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
    or (p.profile_context='business' and private.is_store_publicly_verified(p.business_store_id))))
  or exists(select 1 from public.post_media pm join public.user_posts p on p.id=pm.post_id and p.user_id=pm.user_id
   where pm.media_path=storage.objects.name and split_part(storage.objects.name,'/',1)=pm.user_id::text and p.visibility='public' and p.moderation_status='published'
   and ((p.profile_context='personal' and exists(select 1 from public.user_profiles up where up.id=p.user_id and up.visibility='public'))
    or (p.profile_context='professional' and exists(select 1 from public.professional_profiles pp where pp.id=p.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
    or (p.profile_context='business' and private.is_store_publicly_verified(p.business_store_id))))
  or exists(select 1 from public.user_profiles up where up.visibility='public' and (up.avatar_path=storage.objects.name or up.cover_path=storage.objects.name))
 ));
