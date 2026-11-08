create table if not exists public.user_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_follows_pkey primary key (follower_id, following_id),
  constraint user_follows_no_self check (follower_id <> following_id)
);

create index if not exists user_follows_following_status_created_idx
  on public.user_follows (following_id, status, created_at desc);
create index if not exists user_follows_follower_status_created_idx
  on public.user_follows (follower_id, status, created_at desc);

alter table public.user_follows enable row level security;

create or replace function private.set_user_follow_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_visibility text;
begin
  select up.visibility into target_visibility
  from public.user_profiles up
  where up.id = new.following_id;

  if target_visibility is null then
    raise exception 'Target profile not found' using errcode = '23503';
  end if;

  new.status := case when target_visibility = 'public' then 'accepted' else 'pending' end;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_user_follow_status() from public, anon, authenticated;

drop trigger if exists user_follows_set_status on public.user_follows;
create trigger user_follows_set_status
before insert on public.user_follows
for each row execute function private.set_user_follow_status();

create policy user_follows_read_participants_or_public
on public.user_follows
for select to authenticated
using (
  follower_id = (select auth.uid())
  or following_id = (select auth.uid())
  or (
    status = 'accepted'
    and exists (
      select 1 from public.user_profiles f
      where f.id = user_follows.follower_id and f.visibility = 'public'
    )
    and exists (
      select 1 from public.user_profiles t
      where t.id = user_follows.following_id and t.visibility = 'public'
    )
  )
);

create policy user_follows_insert_self
on public.user_follows
for insert to authenticated
with check (
  follower_id = (select auth.uid())
  and follower_id <> following_id
);

create policy user_follows_accept_request
on public.user_follows
for update to authenticated
using (
  following_id = (select auth.uid())
  and status = 'pending'
)
with check (
  following_id = (select auth.uid())
  and status = 'accepted'
);

create policy user_follows_delete_participant
on public.user_follows
for delete to authenticated
using (
  follower_id = (select auth.uid())
  or following_id = (select auth.uid())
);

grant select, insert, delete on public.user_follows to authenticated;
grant update (status) on public.user_follows to authenticated;
