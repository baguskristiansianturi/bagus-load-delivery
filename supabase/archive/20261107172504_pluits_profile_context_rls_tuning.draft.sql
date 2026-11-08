-- ARCHIVED DRAFT — DO NOT APPLY.\n-- Preserved because this file differed from the exact SQL recorded in live Supabase migration history.\n\n-- Consolidate profile read policies and index the context/verification foreign keys.
drop policy if exists professional_profiles_public_read on public.professional_profiles;
drop policy if exists professional_profiles_owner_read on public.professional_profiles;
create policy professional_profiles_read on public.professional_profiles
for select to anon, authenticated using (
 (profile_status = 'active' and visibility = 'public')
 or (auth.uid() is not null and user_id = (select auth.uid()))
);
drop policy if exists professional_portfolio_public_read on public.professional_portfolio_items;
drop policy if exists professional_portfolio_owner_read on public.professional_portfolio_items;
create policy professional_portfolio_read on public.professional_portfolio_items
for select to anon, authenticated using (
 (is_published and exists (select 1 from public.professional_profiles p where p.id=professional_id and p.profile_status='active' and p.visibility='public'))
 or (auth.uid() is not null and exists (select 1 from public.professional_profiles p where p.id=professional_id and p.user_id=(select auth.uid())))
);
create index if not exists account_context_preferences_active_store_idx on public.account_context_preferences(active_store_id);
create index if not exists profile_verification_reviewer_idx on public.profile_verification_cases(reviewer_user_id);
