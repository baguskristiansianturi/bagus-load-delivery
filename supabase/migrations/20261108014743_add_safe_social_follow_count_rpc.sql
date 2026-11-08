create or replace function private.get_user_follow_counts(p_user_id uuid)
returns table (
  followers_count bigint,
  following_count bigint,
  pending_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    case when
      exists (select 1 from public.user_profiles up where up.id = p_user_id and up.visibility = 'public')
      or p_user_id = (select auth.uid())
      or private.is_user_following((select auth.uid()), p_user_id, 'accepted')
      then (select count(*) from public.user_follows uf where uf.following_id = p_user_id and uf.status = 'accepted')
      else null end,
    case when
      exists (select 1 from public.user_profiles up where up.id = p_user_id and up.visibility = 'public')
      or p_user_id = (select auth.uid())
      or private.is_user_following((select auth.uid()), p_user_id, 'accepted')
      then (select count(*) from public.user_follows uf where uf.follower_id = p_user_id and uf.status = 'accepted')
      else null end,
    case when p_user_id = (select auth.uid())
      then (select count(*) from public.user_follows uf where uf.following_id = p_user_id and uf.status = 'pending')
      else null end;
$$;
revoke all on function private.get_user_follow_counts(uuid) from public;
grant execute on function private.get_user_follow_counts(uuid) to anon, authenticated;

create or replace function public.get_user_follow_counts(p_user_id uuid)
returns table (
  followers_count bigint,
  following_count bigint,
  pending_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$ select * from private.get_user_follow_counts(p_user_id); $$;
revoke all on function public.get_user_follow_counts(uuid) from public;
grant execute on function public.get_user_follow_counts(uuid) to anon, authenticated;
