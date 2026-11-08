create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create or replace function private.is_conversation_member(p_conversation_id uuid,p_user_id uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from public.user_conversation_members m where m.conversation_id=p_conversation_id and m.user_id=p_user_id)
$$;
revoke all on function private.is_conversation_member(uuid,uuid) from public,anon;
grant execute on function private.is_conversation_member(uuid,uuid) to authenticated;
drop policy if exists conversation_members_read on public.user_conversations;
drop policy if exists conversation_members_list on public.user_conversation_members;
drop policy if exists conversation_messages_read on public.user_messages;
drop policy if exists conversation_messages_insert on public.user_messages;
create policy conversation_members_read on public.user_conversations for select to authenticated using(private.is_conversation_member(id,(select auth.uid())));
create policy conversation_members_list on public.user_conversation_members for select to authenticated using(private.is_conversation_member(conversation_id,(select auth.uid())));
create policy conversation_messages_read on public.user_messages for select to authenticated using(private.is_conversation_member(conversation_id,(select auth.uid())));
create policy conversation_messages_insert on public.user_messages for insert to authenticated with check(sender_id=(select auth.uid()) and private.is_conversation_member(conversation_id,(select auth.uid())));
