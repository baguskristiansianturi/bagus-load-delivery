
drop policy if exists stories_read_public_active on public.user_stories;
drop policy if exists stories_read_owner on public.user_stories;

create policy stories_read_public_active
on public.user_stories
for select to anon
using (
  expires_at > now()
  and visibility = 'public'
  and exists (
    select 1 from public.user_profiles up
    where up.id = user_stories.user_id and up.visibility = 'public'
  )
);

create policy stories_read_visible_authenticated
on public.user_stories
for select to authenticated
using (
  (select auth.uid()) = user_id
  or (
    expires_at > now()
    and visibility = 'public'
    and exists (
      select 1 from public.user_profiles up
      where up.id = user_stories.user_id and up.visibility = 'public'
    )
  )
);

drop policy if exists wallet_accounts_read_own on public.wallet_accounts;
create policy wallet_accounts_read_own
on public.wallet_accounts
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists wallet_requests_read_own on public.wallet_requests;
create policy wallet_requests_read_own
on public.wallet_requests
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists wallet_requests_insert_own on public.wallet_requests;
create policy wallet_requests_insert_own
on public.wallet_requests
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and processed_at is null
);
