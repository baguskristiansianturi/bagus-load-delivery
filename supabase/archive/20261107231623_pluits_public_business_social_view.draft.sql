-- ARCHIVED DRAFT — DO NOT APPLY.\n-- Preserved because this file differed from the exact SQL recorded in live Supabase migration history.\n\ncreate or replace view public.public_business_profiles
with (security_barrier=true)
as
select id,name,username,public_city,public_area
from public.stores
where store_status='active' and verification_status='verified';
grant select on public.public_business_profiles to anon, authenticated;

drop policy if exists user_posts_read_public_anon on public.user_posts;
create policy user_posts_read_public_anon on public.user_posts
for select to anon using (
 visibility='public' and moderation_status='published' and (
  (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
  or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
  or (profile_context='business' and exists (select 1 from public.public_business_profiles s where s.id=user_posts.business_store_id))
 )
);
drop policy if exists user_posts_read_visible on public.user_posts;
create policy user_posts_read_visible on public.user_posts
for select to authenticated using (
 user_id=(select auth.uid()) or (
  visibility='public' and moderation_status='published' and (
   (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
   or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
   or (profile_context='business' and exists (select 1 from public.public_business_profiles s where s.id=user_posts.business_store_id))
  )
 )
);