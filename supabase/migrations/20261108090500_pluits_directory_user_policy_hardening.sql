drop policy if exists user_interest_preferences_owner_all on public.user_interest_preferences;
create policy user_interest_preferences_owner_all on public.user_interest_preferences
for all to authenticated
using (user_id = (select auth.uid()) and source = 'explicit')
with check (user_id = (select auth.uid()) and source = 'explicit');

drop policy if exists directory_claims_applicant_insert on public.directory_claims;
create policy directory_claims_applicant_insert on public.directory_claims
for insert to authenticated with check (
  applicant_user_id = (select auth.uid())
  and status = 'submitted'
  and reviewer_user_id is null
  and reviewed_at is null
  and cardinality(evidence_paths) = 0
  and exists (
    select 1 from public.directory_entities e
    where e.id = entity_id
      and e.status = 'published'
      and e.verification_status in ('unclaimed','rejected')
  )
);
