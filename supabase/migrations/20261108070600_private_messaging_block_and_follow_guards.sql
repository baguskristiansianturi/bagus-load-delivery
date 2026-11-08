create or replace function public.start_direct_conversation(p_other_user_id uuid)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v_me uuid:=auth.uid();v_id uuid;v_key text;v_visibility text;
begin
 if v_me is null then raise exception 'Sign in required';end if;
 if p_other_user_id is null or p_other_user_id=v_me then raise exception 'Choose another account';end if;
 select visibility into v_visibility from public.user_profiles where id=p_other_user_id;
 if not found then raise exception 'Account not found';end if;
 if exists(select 1 from public.user_blocks where (blocker_id=v_me and blocked_id=p_other_user_id) or (blocker_id=p_other_user_id and blocked_id=v_me)) then raise exception 'Messaging is unavailable for this account';end if;
 if v_visibility='private' and not exists(select 1 from public.user_follows where follower_id=v_me and following_id=p_other_user_id and status='accepted') then raise exception 'Follow request must be accepted before messaging this private account';end if;
 v_key:=least(v_me::text,p_other_user_id::text)||':'||greatest(v_me::text,p_other_user_id::text);
 insert into public.user_conversations(conversation_type,direct_key,created_by) values('direct',v_key,v_me) on conflict(direct_key) do update set updated_at=now() returning id into v_id;
 insert into public.user_conversation_members(conversation_id,user_id,role) values(v_id,v_me,'member'),(v_id,p_other_user_id,'member') on conflict do nothing;
 return v_id;
end $$;
revoke all on function public.start_direct_conversation(uuid) from public,anon;grant execute on function public.start_direct_conversation(uuid) to authenticated;
create or replace function private.can_send_conversation_message(p_conversation_id uuid,p_sender_id uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select private.is_conversation_member(p_conversation_id,p_sender_id)
 and not exists(select 1 from public.user_conversation_members m join public.user_blocks b on (b.blocker_id=p_sender_id and b.blocked_id=m.user_id) or (b.blocker_id=m.user_id and b.blocked_id=p_sender_id) where m.conversation_id=p_conversation_id and m.user_id<>p_sender_id)
$$;
revoke all on function private.can_send_conversation_message(uuid,uuid) from public,anon;grant execute on function private.can_send_conversation_message(uuid,uuid) to authenticated;
drop policy if exists conversation_messages_insert on public.user_messages;
create policy conversation_messages_insert on public.user_messages for insert to authenticated with check(sender_id=(select auth.uid()) and private.can_send_conversation_message(conversation_id,(select auth.uid())));
