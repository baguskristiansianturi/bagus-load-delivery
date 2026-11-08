
-- Allow anonymous visitors to browse only public Pluits profiles and published public posts.
-- Private profiles, private posts, addresses and user interactions remain inaccessible.
drop policy if exists user_profiles_read_public_anon on public.user_profiles;
create policy user_profiles_read_public_anon
on public.user_profiles
for select
to anon
using (visibility = 'public');

drop policy if exists user_posts_read_public_anon on public.user_posts;
create policy user_posts_read_public_anon
on public.user_posts
for select
to anon
using (
  visibility = 'public'
  and moderation_status = 'published'
  and exists (
    select 1
    from public.user_profiles up
    where up.id = user_posts.user_id
      and up.visibility = 'public'
  )
);

-- Private bucket remains private. Anonymous signed-URL creation is limited to
-- media explicitly referenced by a public published post or a public profile.
drop policy if exists pluits_user_media_read_public_anon on storage.objects;
create policy pluits_user_media_read_public_anon
on storage.objects
for select
to anon
using (
  bucket_id = 'pluits-user-media'
  and (
    exists (
      select 1
      from public.user_posts p
      join public.user_profiles up on up.id = p.user_id
      where p.media_path = storage.objects.name
        and p.visibility = 'public'
        and p.moderation_status = 'published'
        and up.visibility = 'public'
    )
    or exists (
      select 1
      from public.user_profiles up
      where up.visibility = 'public'
        and (up.avatar_path = storage.objects.name or up.cover_path = storage.objects.name)
    )
  )
);
