drop policy if exists user_profiles_read_visible on public.user_profiles;
create policy user_profiles_read_visible
on public.user_profiles for select to authenticated
using (
  id = (select auth.uid())
  or visibility = 'public'
  or exists (
    select 1 from public.user_follows uf
    where uf.follower_id = (select auth.uid())
      and uf.following_id = user_profiles.id
      and uf.status = 'accepted'
  )
  or exists (
    select 1 from public.user_follows uf
    where uf.following_id = (select auth.uid())
      and uf.follower_id = user_profiles.id
      and uf.status = 'accepted'
  )
);

create or replace function private.get_user_profile_directory(p_username text)
returns table (
  id uuid, username text, display_name text, visibility text, bio text,
  avatar_path text, cover_path text, public_city text, public_province text
)
language sql stable security definer set search_path = ''
as $$
  select up.id, up.username, up.display_name, up.visibility,
    case when up.visibility = 'public' or up.id = (select auth.uid())
      or exists (select 1 from public.user_follows uf where uf.follower_id = (select auth.uid()) and uf.following_id = up.id and uf.status = 'accepted')
      then up.bio else '' end,
    case when up.visibility = 'public' or up.id = (select auth.uid())
      or exists (select 1 from public.user_follows uf where uf.follower_id = (select auth.uid()) and uf.following_id = up.id and uf.status = 'accepted')
      then up.avatar_path else null end,
    case when up.visibility = 'public' or up.id = (select auth.uid())
      or exists (select 1 from public.user_follows uf where uf.follower_id = (select auth.uid()) and uf.following_id = up.id and uf.status = 'accepted')
      then up.cover_path else null end,
    case when up.visibility = 'public' or up.id = (select auth.uid())
      or exists (select 1 from public.user_follows uf where uf.follower_id = (select auth.uid()) and uf.following_id = up.id and uf.status = 'accepted')
      then up.public_city else null end,
    case when up.visibility = 'public' or up.id = (select auth.uid())
      or exists (select 1 from public.user_follows uf where uf.follower_id = (select auth.uid()) and uf.following_id = up.id and uf.status = 'accepted')
      then up.public_province else null end
  from public.user_profiles up
  where lower(up.username) = lower(trim(p_username))
  limit 1;
$$;
revoke all on function private.get_user_profile_directory(text) from public;
grant execute on function private.get_user_profile_directory(text) to anon, authenticated;

create or replace function public.get_user_profile_directory(p_username text)
returns table (
  id uuid, username text, display_name text, visibility text, bio text,
  avatar_path text, cover_path text, public_city text, public_province text
)
language sql stable security invoker set search_path = ''
as $$ select * from private.get_user_profile_directory(p_username); $$;
revoke all on function public.get_user_profile_directory(text) from public;
grant execute on function public.get_user_profile_directory(text) to anon, authenticated;
