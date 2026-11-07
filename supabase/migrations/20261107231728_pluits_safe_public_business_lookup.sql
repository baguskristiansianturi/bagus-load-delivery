drop policy if exists user_posts_read_public_anon on public.user_posts;
drop policy if exists user_posts_read_visible on public.user_posts;
drop view if exists public.public_business_profiles;

create or replace function private.is_store_publicly_verified(p_store_id uuid)
returns boolean language sql stable security definer set search_path=''
as $$ select exists (select 1 from public.stores s where s.id=p_store_id and s.store_status='active' and s.verification_status='verified'); $$;
revoke all on function private.is_store_publicly_verified(uuid) from public;
grant execute on function private.is_store_publicly_verified(uuid) to anon, authenticated;

create or replace function private.get_public_business_profiles(p_ids uuid[])
returns table(id uuid,name text,username text,public_city text,public_area text)
language sql stable security definer set search_path=''
as $$
 select s.id,s.name,s.username,s.public_city,s.public_area from public.stores s
 where s.id=any(coalesce(p_ids,'{}'::uuid[])) and s.store_status='active' and s.verification_status='verified';
$$;
revoke all on function private.get_public_business_profiles(uuid[]) from public;
grant execute on function private.get_public_business_profiles(uuid[]) to anon, authenticated;

create or replace function public.get_public_business_profiles(p_ids uuid[])
returns table(id uuid,name text,username text,public_city text,public_area text)
language sql stable security invoker set search_path=''
as $$ select * from private.get_public_business_profiles(p_ids); $$;
revoke all on function public.get_public_business_profiles(uuid[]) from public;
grant execute on function public.get_public_business_profiles(uuid[]) to anon, authenticated;

create policy user_posts_read_public_anon on public.user_posts
for select to anon using (
 visibility='public' and moderation_status='published' and (
  (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
  or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
  or (profile_context='business' and private.is_store_publicly_verified(user_posts.business_store_id))
 )
);
create policy user_posts_read_visible on public.user_posts
for select to authenticated using (
 user_id=(select auth.uid()) or (
  visibility='public' and moderation_status='published' and (
   (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
   or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
   or (profile_context='business' and private.is_store_publicly_verified(user_posts.business_store_id))
  )
 )
);