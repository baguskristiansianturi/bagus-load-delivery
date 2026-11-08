
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
        or exists (
          select 1 from public.user_follows uf
          where uf.follower_id = (select auth.uid())
            and uf.following_id = user_posts.user_id
            and uf.status = 'accepted'
        )
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
      or exists (
        select 1 from public.user_follows uf
        where uf.follower_id = (select auth.uid())
          and uf.following_id = user_stories.user_id
          and uf.status = 'accepted'
      )
    )
  )
);

drop policy if exists pluits_media_select_owner_or_public_post on storage.objects;
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
          or exists (
            select 1 from public.user_follows uf
            where uf.follower_id = (select auth.uid())
              and uf.following_id = p.user_id
              and uf.status = 'accepted'
          )
        )
    )
    or exists (
      select 1 from public.user_stories s
      where s.media_path = objects.name
        and s.visibility = 'public'
        and s.expires_at > now()
        and (
          exists (select 1 from public.user_profiles up where up.id = s.user_id and up.visibility = 'public')
          or exists (
            select 1 from public.user_follows uf
            where uf.follower_id = (select auth.uid())
              and uf.following_id = s.user_id
              and uf.status = 'accepted'
          )
        )
    )
    or exists (
      select 1 from public.user_profiles up
      where (up.visibility = 'public' or exists (
        select 1 from public.user_follows uf
        where uf.follower_id = (select auth.uid())
          and uf.following_id = up.id
          and uf.status = 'accepted'
      ))
      and (up.avatar_path = objects.name or up.cover_path = objects.name)
    )
  )
);

drop policy if exists pluits_story_media_read on storage.objects;
create policy pluits_story_media_read_anon
on storage.objects for select to anon
using (
  bucket_id = 'pluits-user-media'
  and exists (
    select 1 from public.user_stories s
    join public.user_profiles up on up.id = s.user_id
    where s.media_path = objects.name
      and s.visibility = 'public'
      and s.expires_at > now()
      and up.visibility = 'public'
  )
);
