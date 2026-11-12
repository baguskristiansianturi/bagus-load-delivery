create table if not exists public.user_profile_image_frames (
 user_id uuid primary key references auth.users(id) on delete cascade,
 avatar_x numeric(5,2) not null default 50 check (avatar_x between 0 and 100),
 avatar_y numeric(5,2) not null default 42 check (avatar_y between 0 and 100),
 avatar_zoom numeric(4,2) not null default 1 check (avatar_zoom between 1 and 2.5),
 card_x numeric(5,2) not null default 50 check (card_x between 0 and 100),
 card_y numeric(5,2) not null default 32 check (card_y between 0 and 100),
 card_zoom numeric(4,2) not null default 1 check (card_zoom between 1 and 2.5),
 updated_at timestamptz not null default now()
);
alter table public.user_profile_image_frames enable row level security;
drop policy if exists user_profile_image_frames_visible_read on public.user_profile_image_frames;
create policy user_profile_image_frames_visible_read on public.user_profile_image_frames
for select to anon, authenticated using (
 user_id = (select auth.uid()) or exists (
  select 1 from public.user_profiles p where p.id = user_profile_image_frames.user_id and p.visibility = 'public'
 )
);
drop policy if exists user_profile_image_frames_owner_insert on public.user_profile_image_frames;
create policy user_profile_image_frames_owner_insert on public.user_profile_image_frames
for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists user_profile_image_frames_owner_update on public.user_profile_image_frames;
create policy user_profile_image_frames_owner_update on public.user_profile_image_frames
for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists user_profile_image_frames_owner_delete on public.user_profile_image_frames;
create policy user_profile_image_frames_owner_delete on public.user_profile_image_frames
for delete to authenticated using (user_id = (select auth.uid()));
grant select on public.user_profile_image_frames to anon, authenticated;
grant insert, update, delete on public.user_profile_image_frames to authenticated;
