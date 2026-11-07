create table if not exists public.post_tags (
  post_id uuid not null references public.user_posts(id) on delete cascade,
  tagged_user_id uuid not null references auth.users(id) on delete cascade,
  tagged_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(post_id,tagged_user_id)
);
create index if not exists post_tags_user_idx on public.post_tags(tagged_user_id,created_at desc);
alter table public.post_tags enable row level security;
drop policy if exists post_tags_read_visible on public.post_tags;
create policy post_tags_read_visible on public.post_tags for select to authenticated
using (exists (select 1 from public.user_posts p where p.id=post_tags.post_id));
drop policy if exists post_tags_insert_owner on public.post_tags;
create policy post_tags_insert_owner on public.post_tags for insert to authenticated
with check (
 tagged_by=(select auth.uid())
 and exists (select 1 from public.user_posts p where p.id=post_tags.post_id and p.user_id=(select auth.uid()))
 and tagged_user_id<>(select auth.uid())
);
drop policy if exists post_tags_delete_participant on public.post_tags;
create policy post_tags_delete_participant on public.post_tags for delete to authenticated
using (
 tagged_by=(select auth.uid()) or tagged_user_id=(select auth.uid())
 or exists (select 1 from public.user_posts p where p.id=post_tags.post_id and p.user_id=(select auth.uid()))
);
grant select,insert,delete on public.post_tags to authenticated;
