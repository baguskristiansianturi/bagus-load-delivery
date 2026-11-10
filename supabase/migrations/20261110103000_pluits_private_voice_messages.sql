-- PLUITS direct messages: private voice-note support for the two-account UAT.
-- Existing text messages remain unchanged and readable.
alter table public.user_messages
  add column if not exists message_type text not null default 'text',
  add column if not exists media_path text,
  add column if not exists media_duration_seconds smallint,
  add column if not exists media_mime_type text;

alter table public.user_messages drop constraint if exists user_messages_body_check;
alter table public.user_messages add constraint user_messages_payload_check check (
  (message_type = 'text' and char_length(trim(body)) between 1 and 5000 and media_path is null and media_duration_seconds is null and media_mime_type is null)
  or
  (message_type = 'voice' and char_length(trim(body)) = 0 and media_path is not null and media_duration_seconds between 1 and 180 and media_mime_type in ('audio/webm','audio/mp4','audio/ogg','audio/mpeg','audio/wav','audio/3gpp'))
);

create index if not exists user_messages_voice_media_idx on public.user_messages(conversation_id, created_at desc) where message_type = 'voice';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pluits-message-media','pluits-message-media',false,10485760,array['audio/webm','audio/mp4','audio/ogg','audio/mpeg','audio/wav','audio/3gpp'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Conversation members read private voice notes" on storage.objects;
create policy "Conversation members read private voice notes" on storage.objects for select to authenticated
using (bucket_id='pluits-message-media' and array_length(storage.foldername(name),1)=2
and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
and split_part(name,'/',2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
and private.is_conversation_member(split_part(name,'/',1)::uuid,(select auth.uid())));

drop policy if exists "Members upload own private voice notes" on storage.objects;
create policy "Members upload own private voice notes" on storage.objects for insert to authenticated
with check (bucket_id='pluits-message-media' and array_length(storage.foldername(name),1)=2
and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
and split_part(name,'/',2)=(select auth.uid())::text
and private.is_conversation_member(split_part(name,'/',1)::uuid,(select auth.uid())));

drop policy if exists "Members delete own private voice notes" on storage.objects;
create policy "Members delete own private voice notes" on storage.objects for delete to authenticated
using (bucket_id='pluits-message-media' and split_part(name,'/',2)=(select auth.uid())::text
and private.is_conversation_member(split_part(name,'/',1)::uuid,(select auth.uid())));

create or replace function private.bump_conversation_on_message()
returns trigger language plpgsql security definer set search_path = '' as $function$
begin
 update public.user_conversations set updated_at=now() where id=new.conversation_id;
 return new;
end;
$function$;
revoke all on function private.bump_conversation_on_message() from public,anon,authenticated;
drop trigger if exists bump_conversation_on_message on public.user_messages;
create trigger bump_conversation_on_message after insert on public.user_messages for each row execute function private.bump_conversation_on_message();
