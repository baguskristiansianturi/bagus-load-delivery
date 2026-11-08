-- Social notifications, realtime delivery, and idempotent offline message queue.
alter table public.user_messages add column if not exists client_message_id uuid;
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid='public.user_messages'::regclass and conname='user_messages_sender_client_message_unique') then
    alter table public.user_messages add constraint user_messages_sender_client_message_unique unique(sender_id,client_message_id);
  end if;
end $$;
alter table public.user_notifications drop constraint if exists user_notifications_notification_type_check;
alter table public.user_notifications add constraint user_notifications_notification_type_check
check (notification_type = any (array['follow_request','new_follower','follow_accepted','unfollow','post_like','post_comment','new_message','system_update']));
create or replace function private.notify_social_unfollow()
returns trigger language plpgsql security definer set search_path = '' as $function$
begin
 if old.follower_id is not null and old.following_id is not null and old.follower_id <> old.following_id then
  insert into public.user_notifications(recipient_user_id,actor_user_id,notification_type,entity_type,entity_id,message)
  values(old.following_id,old.follower_id,'unfollow','profile',old.follower_id,'berhenti mengikuti Anda');
 end if;
 return old;
end; $function$;
revoke all on function private.notify_social_unfollow() from public,anon,authenticated;
drop trigger if exists notify_social_unfollow on public.user_follows;
create trigger notify_social_unfollow after delete on public.user_follows for each row execute function private.notify_social_unfollow();
create or replace function private.notify_direct_message()
returns trigger language plpgsql security definer set search_path = '' as $function$
declare recipient uuid;
begin
 for recipient in select m.user_id from public.user_conversation_members m where m.conversation_id=new.conversation_id and m.user_id<>new.sender_id loop
  insert into public.user_notifications(recipient_user_id,actor_user_id,notification_type,entity_type,entity_id,message)
  values(recipient,new.sender_id,'new_message','conversation',new.conversation_id,'mengirim pesan kepada Anda');
 end loop;
 return new;
end; $function$;
revoke all on function private.notify_direct_message() from public,anon,authenticated;
drop trigger if exists notify_direct_message on public.user_messages;
create trigger notify_direct_message after insert on public.user_messages for each row execute function private.notify_direct_message();
do $$
begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_messages') then alter publication supabase_realtime add table public.user_messages; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_notifications') then alter publication supabase_realtime add table public.user_notifications; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_follows') then alter publication supabase_realtime add table public.user_follows; end if;
 end if;
end $$;
