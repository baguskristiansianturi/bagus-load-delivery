create table if not exists public.user_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_path text not null,
  media_type text not null check (media_type in ('image','video')),
  caption text not null default '',
  visibility text not null default 'public' check (visibility in ('public','private')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index if not exists user_stories_active_created_idx
  on public.user_stories (expires_at desc, created_at desc);
create index if not exists user_stories_user_active_idx
  on public.user_stories (user_id, expires_at desc);
alter table public.user_stories enable row level security;
grant select, insert, delete on public.user_stories to authenticated;
grant select on public.user_stories to anon;
drop policy if exists "stories_read_public_active" on public.user_stories;
create policy "stories_read_public_active" on public.user_stories
for select to anon, authenticated
using (
  expires_at > now()
  and visibility = 'public'
  and exists (
    select 1 from public.user_profiles up
    where up.id = user_stories.user_id and up.visibility = 'public'
  )
);
drop policy if exists "stories_read_owner" on public.user_stories;
create policy "stories_read_owner" on public.user_stories
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "stories_insert_owner" on public.user_stories;
create policy "stories_insert_owner" on public.user_stories
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "stories_delete_owner" on public.user_stories;
create policy "stories_delete_owner" on public.user_stories
for delete to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "pluits_story_media_read" on storage.objects;
create policy "pluits_story_media_read" on storage.objects
for select to anon, authenticated
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