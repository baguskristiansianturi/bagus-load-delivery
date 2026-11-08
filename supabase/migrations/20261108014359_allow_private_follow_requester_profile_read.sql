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
      and uf.status in ('pending','accepted')
  )
);
