create table if not exists public.account_content_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 personal_default_visibility text not null default 'public' check (personal_default_visibility in ('public','private')),
 professional_default_visibility text not null default 'public' check (professional_default_visibility in ('public','unlisted')),
 business_default_visibility text not null default 'public' check (business_default_visibility in ('public','unlisted')),
 story_default_visibility text not null default 'public' check (story_default_visibility in ('public','private')),
 allow_comments boolean not null default true,
 allow_mentions boolean not null default true,
 message_preference text not null default 'everyone' check (message_preference in ('everyone','followers','nobody')),
 updated_at timestamptz not null default now()
);
alter table public.account_content_preferences enable row level security;
drop policy if exists account_content_preferences_owner_all on public.account_content_preferences;
create policy account_content_preferences_owner_all on public.account_content_preferences
for all to authenticated using (user_id=(select auth.uid()))
with check (user_id=(select auth.uid()));
drop trigger if exists account_content_preferences_updated_at on public.account_content_preferences;
create trigger account_content_preferences_updated_at before update on public.account_content_preferences
for each row execute function private.touch_updated_at();
grant select,insert,update on public.account_content_preferences to authenticated;