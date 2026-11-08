-- Pluits user-first foundation: public profiles, private addresses, social posts and interactions.
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Pengguna Pluits' check (char_length(display_name) between 1 and 80),
  username text not null default ('user_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_path text,
  cover_path text,
  public_city text,
  public_province text,
  visibility text not null default 'public' check (visibility in ('public','private')),
  show_store boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_profiles_username_format check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9._]{2,29}$')
);
create unique index if not exists user_profiles_username_lower_uidx on public.user_profiles (lower(username));

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Rumah',
  recipient_name text not null,
  phone text not null,
  province text not null,
  city text not null,
  district text not null,
  village text,
  postal_code text not null,
  address_line text not null,
  delivery_note text,
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_addresses_postal_code check (postal_code ~ '^[0-9]{5}$'),
  constraint user_addresses_latitude check (latitude is null or latitude between -90 and 90),
  constraint user_addresses_longitude check (longitude is null or longitude between -180 and 180)
);
create index if not exists user_addresses_user_idx on public.user_addresses(user_id, is_default desc, created_at desc);
create unique index if not exists user_addresses_one_default_uidx on public.user_addresses(user_id) where is_default;

create table if not exists public.user_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  caption text not null default '' check (char_length(caption) <= 2200),
  tags text[] not null default '{}',
  media_path text not null,
  media_type text not null check (media_type in ('image','video')),
  visibility text not null default 'public' check (visibility in ('public','private')),
  moderation_status text not null default 'published' check (moderation_status in ('published','hidden','removed')),
  created_at timestamptz not null default now()
);
create index if not exists user_posts_feed_idx on public.user_posts(created_at desc) where visibility='public' and moderation_status='published';
create index if not exists user_posts_user_idx on public.user_posts(user_id,created_at desc);

create table if not exists public.post_likes (
  post_id uuid not null references public.user_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(post_id,user_id)
);
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.user_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1200),
  created_at timestamptz not null default now()
);
create index if not exists post_comments_post_idx on public.post_comments(post_id,created_at);
create table if not exists public.post_saves (
  post_id uuid not null references public.user_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(post_id,user_id)
);

alter table public.user_profiles enable row level security;
alter table public.user_addresses enable row level security;
alter table public.user_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_saves enable row level security;

drop policy if exists user_profiles_read_visible on public.user_profiles;
create policy user_profiles_read_visible on public.user_profiles for select to authenticated
using (id = (select auth.uid()) or visibility = 'public');
drop policy if exists user_profiles_insert_self on public.user_profiles;
create policy user_profiles_insert_self on public.user_profiles for insert to authenticated
with check (id = (select auth.uid()));
drop policy if exists user_profiles_update_self on public.user_profiles;
create policy user_profiles_update_self on public.user_profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists user_addresses_select_self on public.user_addresses;
create policy user_addresses_select_self on public.user_addresses for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists user_addresses_insert_self on public.user_addresses;
create policy user_addresses_insert_self on public.user_addresses for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists user_addresses_update_self on public.user_addresses;
create policy user_addresses_update_self on public.user_addresses for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists user_addresses_delete_self on public.user_addresses;
create policy user_addresses_delete_self on public.user_addresses for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists user_posts_read_visible on public.user_posts;
create policy user_posts_read_visible on public.user_posts for select to authenticated
using (
  user_id = (select auth.uid())
  or (
    visibility = 'public' and moderation_status = 'published'
    and exists (select 1 from public.user_profiles up where up.id = user_posts.user_id and up.visibility = 'public')
  )
);
drop policy if exists user_posts_insert_self on public.user_posts;
create policy user_posts_insert_self on public.user_posts for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists user_posts_update_self on public.user_posts;
create policy user_posts_update_self on public.user_posts for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists user_posts_delete_self on public.user_posts;
create policy user_posts_delete_self on public.user_posts for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists post_likes_read_visible on public.post_likes;
create policy post_likes_read_visible on public.post_likes for select to authenticated
using (exists (select 1 from public.user_posts p where p.id = post_likes.post_id));
drop policy if exists post_likes_insert_self on public.post_likes;
create policy post_likes_insert_self on public.post_likes for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.user_posts p where p.id = post_likes.post_id));
drop policy if exists post_likes_delete_self on public.post_likes;
create policy post_likes_delete_self on public.post_likes for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists post_comments_read_visible on public.post_comments;
create policy post_comments_read_visible on public.post_comments for select to authenticated
using (exists (select 1 from public.user_posts p where p.id = post_comments.post_id));
drop policy if exists post_comments_insert_self on public.post_comments;
create policy post_comments_insert_self on public.post_comments for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.user_posts p where p.id = post_comments.post_id));
drop policy if exists post_comments_delete_self on public.post_comments;
create policy post_comments_delete_self on public.post_comments for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists post_saves_select_self on public.post_saves;
create policy post_saves_select_self on public.post_saves for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists post_saves_insert_self on public.post_saves;
create policy post_saves_insert_self on public.post_saves for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.user_posts p where p.id = post_saves.post_id));
drop policy if exists post_saves_delete_self on public.post_saves;
create policy post_saves_delete_self on public.post_saves for delete to authenticated using (user_id = (select auth.uid()));

grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update, delete on public.user_addresses to authenticated;
grant select, insert, update, delete on public.user_posts to authenticated;
grant select, insert, delete on public.post_likes to authenticated;
grant select, insert, delete on public.post_comments to authenticated;
grant select, insert, delete on public.post_saves to authenticated;

create or replace function private.create_user_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.user_profiles(id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Pengguna Pluits'))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_user_profile on auth.users;
create trigger on_auth_user_created_user_profile
after insert on auth.users for each row execute function private.create_user_profile_for_new_user();

insert into public.user_profiles(id,display_name)
select p.id, coalesce(nullif(trim(p.full_name),''),'Pengguna Pluits')
from public.profiles p
on conflict (id) do nothing;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('pluits-user-media','pluits-user-media',false,52428800,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists pluits_user_media_upload_self on storage.objects;
create policy pluits_user_media_upload_self on storage.objects for insert to authenticated
with check (bucket_id='pluits-user-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists pluits_user_media_update_self on storage.objects;
create policy pluits_user_media_update_self on storage.objects for update to authenticated
using (bucket_id='pluits-user-media' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check (bucket_id='pluits-user-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists pluits_user_media_delete_self on storage.objects;
create policy pluits_user_media_delete_self on storage.objects for delete to authenticated
using (bucket_id='pluits-user-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists pluits_user_media_read_allowed on storage.objects;
create policy pluits_user_media_read_allowed on storage.objects for select to authenticated
using (
  bucket_id='pluits-user-media' and (
    (storage.foldername(name))[1]=(select auth.uid())::text
    or exists (
      select 1 from public.user_posts p
      join public.user_profiles up on up.id=p.user_id
      where p.media_path=storage.objects.name and p.visibility='public'
        and p.moderation_status='published' and up.visibility='public'
    )
    or exists (
      select 1 from public.user_profiles up
      where up.visibility='public' and (up.avatar_path=storage.objects.name or up.cover_path=storage.objects.name)
    )
  )
);
