alter table public.post_comments add column if not exists parent_comment_id uuid;
do $$ begin
 if not exists (select 1 from pg_constraint where conname='post_comments_id_post_id_unique' and conrelid='public.post_comments'::regclass) then
  alter table public.post_comments add constraint post_comments_id_post_id_unique unique(id,post_id);
 end if;
 if not exists (select 1 from pg_constraint where conname='post_comments_parent_same_post_fkey' and conrelid='public.post_comments'::regclass) then
  alter table public.post_comments add constraint post_comments_parent_same_post_fkey foreign key(parent_comment_id,post_id) references public.post_comments(id,post_id) on delete cascade;
 end if;
end $$;
create index if not exists post_comments_parent_created_idx on public.post_comments(parent_comment_id,created_at);
create table if not exists public.post_comment_likes (
 comment_id uuid not null references public.post_comments(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(comment_id,user_id)
);
alter table public.post_comment_likes enable row level security;
revoke all on public.post_comment_likes from anon,authenticated;
grant select,insert,delete on public.post_comment_likes to authenticated;
drop policy if exists post_comment_likes_read_visible on public.post_comment_likes;
create policy post_comment_likes_read_visible on public.post_comment_likes for select to authenticated using (
 exists(select 1 from public.post_comments c join public.user_posts p on p.id=c.post_id where c.id=post_comment_likes.comment_id)
);
drop policy if exists post_comment_likes_insert_self on public.post_comment_likes;
create policy post_comment_likes_insert_self on public.post_comment_likes for insert to authenticated with check (
 user_id=(select auth.uid()) and exists(select 1 from public.post_comments c join public.user_posts p on p.id=c.post_id where c.id=post_comment_likes.comment_id)
);
drop policy if exists post_comment_likes_delete_self on public.post_comment_likes;
create policy post_comment_likes_delete_self on public.post_comment_likes for delete to authenticated using(user_id=(select auth.uid()));
drop policy if exists post_comments_insert_self on public.post_comments;
create policy post_comments_insert_self on public.post_comments for insert to authenticated with check (
 user_id=(select auth.uid())
 and exists(select 1 from public.user_posts p where p.id=post_comments.post_id and coalesce((select pref.allow_comments from public.account_content_preferences pref where pref.user_id=p.user_id),true)=true)
 and (parent_comment_id is null or exists(select 1 from public.post_comments parent where parent.id=post_comments.parent_comment_id and parent.post_id=post_comments.post_id))
);
