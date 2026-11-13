create table if not exists public.user_hidden_content (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post','user')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (viewer_id, target_type, target_id)
);
create index if not exists user_hidden_content_viewer_created_idx
  on public.user_hidden_content (viewer_id, created_at desc);
alter table public.user_hidden_content enable row level security;
create policy "Users can read own hidden content"
  on public.user_hidden_content for select to authenticated
  using ((select auth.uid()) = viewer_id);
create policy "Users can hide content for themselves"
  on public.user_hidden_content for insert to authenticated
  with check ((select auth.uid()) = viewer_id);
create policy "Users can unhide their own content"
  on public.user_hidden_content for delete to authenticated
  using ((select auth.uid()) = viewer_id);
grant select, insert, delete on public.user_hidden_content to authenticated;
