create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  notification_type text not null check (notification_type in ('follow_request','new_follower','follow_accepted','post_like','post_comment')),
  entity_type text,
  entity_id uuid,
  message text not null default '',
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint user_notifications_not_self check (actor_user_id is null or actor_user_id <> recipient_user_id)
);
create index if not exists user_notifications_recipient_created_idx on public.user_notifications (recipient_user_id, created_at desc);
create index if not exists user_notifications_unread_idx on public.user_notifications (recipient_user_id, created_at desc) where read_at is null;
alter table public.user_notifications enable row level security;
revoke all on public.user_notifications from anon, authenticated;
grant select, update on public.user_notifications to authenticated;
create policy "Users read own notifications" on public.user_notifications for select to authenticated using ((select auth.uid()) = recipient_user_id);
create policy "Users mark own notifications read" on public.user_notifications for update to authenticated using ((select auth.uid()) = recipient_user_id) with check ((select auth.uid()) = recipient_user_id);
create or replace function private.enqueue_social_notification()
returns trigger language plpgsql security definer set search_path = pg_catalog, public, private as $$
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
create trigger notify_follow_insert after insert on public.user_follows for each row execute function private.enqueue_social_notification();
create trigger notify_follow_accept after update of status on public.user_follows for each row execute function private.enqueue_social_notification();
create trigger notify_post_like after insert on public.post_likes for each row execute function private.enqueue_social_notification();
create trigger notify_post_comment after insert on public.post_comments for each row execute function private.enqueue_social_notification();
