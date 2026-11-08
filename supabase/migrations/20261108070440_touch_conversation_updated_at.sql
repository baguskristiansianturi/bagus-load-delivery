create or replace function private.touch_user_conversation_updated_at()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin update public.user_conversations set updated_at=now() where id=new.conversation_id;return new;end $$;
revoke all on function private.touch_user_conversation_updated_at() from public,anon,authenticated;
drop trigger if exists user_messages_touch_conversation on public.user_messages;
create trigger user_messages_touch_conversation after insert on public.user_messages for each row execute function private.touch_user_conversation_updated_at();
