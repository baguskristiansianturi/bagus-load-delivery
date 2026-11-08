drop policy if exists user_profiles_read_visible on public.user_profiles;
create policy user_profiles_read_visible
on public.user_profiles for select to authenticated
using (
  id = (select auth.uid())
  or visibility = 'public'
  or private.is_user_following((select auth.uid()), id, 'accepted')
  or private.is_user_following(id, (select auth.uid()), 'accepted')
);

create or replace function private.get_user_profile_directory_by_ids(p_ids uuid[])
returns table (
  id uuid, username text, display_name text, visibility text,
  bio text, avatar_path text, cover_path text,
  public_city text, public_province text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    up.id, up.username, up.display_name, up.visibility,
    case when up.visibility = 'public'
      or up.id = (select auth.uid())
      or private.is_user_following((select auth.uid()), up.id, 'accepted')
      or private.is_user_following(up.id, (select auth.uid()), 'accepted')
      then up.bio else '' end,
    case when up.visibility = 'public'
      or up.id = (select auth.uid())
      or private.is_user_following((select auth.uid()), up.id, 'accepted')
      or private.is_user_following(up.id, (select auth.uid()), 'accepted')
      then up.avatar_path else null end,
    case when up.visibility = 'public'
      or up.id = (select auth.uid())
      or private.is_user_following((select auth.uid()), up.id, 'accepted')
      or private.is_user_following(up.id, (select auth.uid()), 'accepted')
      then up.cover_path else null end,
    case when up.visibility = 'public'
      or up.id = (select auth.uid())
      or private.is_user_following((select auth.uid()), up.id, 'accepted')
      or private.is_user_following(up.id, (select auth.uid()), 'accepted')
      then up.public_city else null end,
    case when up.visibility = 'public'
      or up.id = (select auth.uid())
      or private.is_user_following((select auth.uid()), up.id, 'accepted')
      or private.is_user_following(up.id, (select auth.uid()), 'accepted')
      then up.public_province else null end
  from public.user_profiles up
  where up.id = any(coalesce(p_ids, array[]::uuid[]));
$$;
revoke all on function private.get_user_profile_directory_by_ids(uuid[]) from public;
grant execute on function private.get_user_profile_directory_by_ids(uuid[]) to anon, authenticated;

create or replace function public.get_user_profile_directory_by_ids(p_ids uuid[])
returns table (
  id uuid, username text, display_name text, visibility text,
  bio text, avatar_path text, cover_path text,
  public_city text, public_province text
)
language sql
stable
security invoker
set search_path = ''
as $$ select * from private.get_user_profile_directory_by_ids(p_ids); $$;
revoke all on function public.get_user_profile_directory_by_ids(uuid[]) from public;
grant execute on function public.get_user_profile_directory_by_ids(uuid[]) to anon, authenticated;
