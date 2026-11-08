create table if not exists public.user_conversations (
 id uuid primary key default gen_random_uuid(),
 conversation_type text not null default 'direct' check(conversation_type in ('direct','group')),
 title text not null default '',
 direct_key text unique,
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.user_conversation_members (
 conversation_id uuid not null references public.user_conversations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null default 'member' check(role in ('member','admin')),
 last_read_at timestamptz,
 joined_at timestamptz not null default now(),
 primary key(conversation_id,user_id)
);
create table if not exists public.user_messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.user_conversations(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete restrict,
 body text not null check(char_length(trim(body)) between 1 and 5000),
 created_at timestamptz not null default now(),
 edited_at timestamptz,
 deleted_at timestamptz
);
create index if not exists user_messages_conversation_created_idx on public.user_messages(conversation_id,created_at desc);
create index if not exists user_conversation_members_user_idx on public.user_conversation_members(user_id,joined_at desc);
alter table public.user_conversations enable row level security;
alter table public.user_conversation_members enable row level security;
alter table public.user_messages enable row level security;
revoke all on public.user_conversations,public.user_conversation_members,public.user_messages from anon,authenticated;
grant select on public.user_conversations,public.user_conversation_members,public.user_messages to authenticated;
grant insert on public.user_messages to authenticated;
create policy conversation_members_read on public.user_conversations for select to authenticated using(exists(select 1 from public.user_conversation_members m where m.conversation_id=id and m.user_id=(select auth.uid())));
create policy conversation_members_list on public.user_conversation_members for select to authenticated using(exists(select 1 from public.user_conversation_members m where m.conversation_id=conversation_id and m.user_id=(select auth.uid())));
create policy conversation_messages_read on public.user_messages for select to authenticated using(exists(select 1 from public.user_conversation_members m where m.conversation_id=user_messages.conversation_id and m.user_id=(select auth.uid())));
create policy conversation_messages_insert on public.user_messages for insert to authenticated with check(sender_id=(select auth.uid()) and exists(select 1 from public.user_conversation_members m where m.conversation_id=user_messages.conversation_id and m.user_id=(select auth.uid())));
create or replace function public.start_direct_conversation(p_other_user_id uuid)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v_me uuid:=auth.uid();v_id uuid;v_key text;
begin
 if v_me is null then raise exception 'Sign in required';end if;
 if p_other_user_id is null or p_other_user_id=v_me then raise exception 'Choose another account';end if;
 if not exists(select 1 from public.user_profiles where id=p_other_user_id) then raise exception 'Account not found';end if;
 v_key:=least(v_me::text,p_other_user_id::text)||':'||greatest(v_me::text,p_other_user_id::text);
 insert into public.user_conversations(conversation_type,direct_key,created_by) values('direct',v_key,v_me) on conflict(direct_key) do update set updated_at=now() returning id into v_id;
 insert into public.user_conversation_members(conversation_id,user_id,role) values(v_id,v_me,'member'),(v_id,p_other_user_id,'member') on conflict do nothing;
 return v_id;
end $$;
revoke all on function public.start_direct_conversation(uuid) from public,anon;
grant execute on function public.start_direct_conversation(uuid) to authenticated;
create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 update public.user_conversation_members set last_read_at=now() where conversation_id=p_conversation_id and user_id=auth.uid();
 if not found then raise exception 'Conversation not found';end if;
end $$;
revoke all on function public.mark_conversation_read(uuid) from public,anon;
grant execute on function public.mark_conversation_read(uuid) to authenticated;
