create or replace function private.is_user_following(
  p_follower_id uuid,
  p_following_id uuid,
  p_status text default 'accepted'
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_follows uf
    where uf.follower_id = p_follower_id
      and uf.following_id = p_following_id
      and uf.status = p_status
  );
$$;
revoke all on function private.is_user_following(uuid,uuid,text) from public, anon;
grant execute on function private.is_user_following(uuid,uuid,text) to authenticated;

drop policy if exists user_profiles_read_visible on public.user_profiles;
create policy user_profiles_read_visible
on public.user_profiles for select to authenticated
using (
  id = (select auth.uid())
  or visibility = 'public'
  or private.is_user_following((select auth.uid()), id, 'pending')
  or private.is_user_following((select auth.uid()), id, 'accepted')
  or private.is_user_following(id, (select auth.uid()), 'pending')
  or private.is_user_following(id, (select auth.uid()), 'accepted')
);

drop policy if exists user_posts_read_visible on public.user_posts;
create policy user_posts_read_visible
on public.user_posts for select to authenticated
using (
  user_id = (select auth.uid())
  or (
    visibility = 'public'
    and moderation_status = 'published'
    and (
      (profile_context = 'personal' and (
        exists (select 1 from public.user_profiles up where up.id = user_posts.user_id and up.visibility = 'public')
        or private.is_user_following((select auth.uid()), user_posts.user_id, 'accepted')
      ))
      or (profile_context = 'professional' and exists (
        select 1 from public.professional_profiles pp
        where pp.id = user_posts.professional_profile_id
          and pp.profile_status = 'active' and pp.visibility = 'public'
      ))
      or (profile_context = 'business' and private.is_store_publicly_verified(business_store_id))
    )
  )
);

drop policy if exists stories_read_visible_authenticated on public.user_stories;
create policy stories_read_visible_authenticated
on public.user_stories for select to authenticated
using (
  (select auth.uid()) = user_id
  or (
    expires_at > now()
    and visibility = 'public'
    and (
      exists (select 1 from public.user_profiles up where up.id = user_stories.user_id and up.visibility = 'public')
      or private.is_user_following((select auth.uid()), user_stories.user_id, 'accepted')
    )
  )
);

drop policy if exists pluits_user_media_read_allowed on storage.objects;
create policy pluits_user_media_read_allowed
on storage.objects for select to authenticated
using (
  bucket_id = 'pluits-user-media'
  and (
    (storage.foldername(name))[1] = ((select auth.uid())::text)
    or exists (
      select 1 from public.user_posts p
      where p.media_path = objects.name
        and p.visibility = 'public'
        and p.moderation_status = 'published'
        and (
          exists (select 1 from public.user_profiles up where up.id = p.user_id and up.visibility = 'public')
          or private.is_user_following((select auth.uid()), p.user_id, 'accepted')
        )
    )
    or exists (
      select 1 from public.user_stories s
      where s.media_path = objects.name
        and s.visibility = 'public'
        and s.expires_at > now()
        and (
          exists (select 1 from public.user_profiles up where up.id = s.user_id and up.visibility = 'public')
          or private.is_user_following((select auth.uid()), s.user_id, 'accepted')
        )
    )
    or exists (
      select 1 from public.user_profiles up
      where (up.visibility = 'public' or private.is_user_following((select auth.uid()),up.id,'accepted'))
      and (up.avatar_path = objects.name or up.cover_path = objects.name)
    )
  )
);
