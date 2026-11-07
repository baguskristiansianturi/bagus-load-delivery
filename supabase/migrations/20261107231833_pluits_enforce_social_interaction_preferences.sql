drop policy if exists post_comments_insert_self on public.post_comments;
create policy post_comments_insert_self on public.post_comments
for insert to authenticated with check (
 user_id=(select auth.uid())
 and exists (
  select 1 from public.user_posts p
  where p.id=post_comments.post_id
   and coalesce((select pref.allow_comments from public.account_content_preferences pref where pref.user_id=p.user_id),true)=true
 )
);
drop policy if exists post_tags_insert_owner on public.post_tags;
create policy post_tags_insert_owner on public.post_tags
for insert to authenticated with check (
 tagged_by=(select auth.uid())
 and tagged_user_id<>(select auth.uid())
 and exists (
  select 1 from public.user_posts p
  where p.id=post_tags.post_id and p.user_id=(select auth.uid())
 )
 and coalesce((select pref.allow_mentions from public.account_content_preferences pref where pref.user_id=post_tags.tagged_user_id),true)=true
);