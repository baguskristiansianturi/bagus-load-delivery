revoke update on public.user_notifications from authenticated;
grant update (read_at) on public.user_notifications to authenticated;
create or replace function private.enqueue_social_notification()
returns trigger language plpgsql security definer set search_path = pg_catalog as $$
declare recipient uuid; actor uuid; kind text; target_id uuid; note text;
begin
  if tg_table_name = 'user_follows' then
    if tg_op = 'INSERT' then
      recipient := new.following_id; actor := new.follower_id;
      kind := case when new.status = 'accepted' then 'new_follower' else 'follow_request' end;
      note := case when new.status = 'accepted' then 'mulai mengikuti Anda' else 'meminta mengikuti akun Anda' end;
    elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'accepted' then
      recipient := new.follower_id; actor := new.following_id; kind := 'follow_accepted'; note := 'menerima permintaan mengikuti Anda';
    else return new; end if;
  elsif tg_table_name = 'post_likes' then
    select p.user_id into recipient from public.user_posts p where p.id = new.post_id;
    actor := new.user_id; kind := 'post_like'; target_id := new.post_id; note := 'menyukai postingan Anda';
  elsif tg_table_name = 'post_comments' then
    select p.user_id into recipient from public.user_posts p where p.id = new.post_id;
    actor := new.user_id; kind := 'post_comment'; target_id := new.post_id; note := 'mengomentari postingan Anda';
  else return new; end if;
  if recipient is not null and actor is not null and recipient <> actor then
    insert into public.user_notifications(recipient_user_id, actor_user_id, notification_type, entity_type, entity_id, message)
    values (recipient, actor, kind, case when target_id is null then 'profile' else 'post' end, target_id, note);
  end if;
  return new;
end; $$;
revoke all on function private.enqueue_social_notification() from public, anon, authenticated;
