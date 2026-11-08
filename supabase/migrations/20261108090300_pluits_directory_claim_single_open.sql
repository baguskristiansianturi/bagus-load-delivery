-- Prevent competing active claims on the same directory entity.
create unique index if not exists directory_claims_one_open_per_entity
  on public.directory_claims(entity_id)
  where status in ('submitted','under_review');

drop policy if exists directory_claims_applicant_insert on public.directory_claims;
create policy directory_claims_applicant_insert on public.directory_claims
for insert to authenticated with check (
  applicant_user_id = (select auth.uid())
  and status = 'submitted'
  and reviewer_user_id is null
  and reviewed_at is null
  and exists (
    select 1 from public.directory_entities e
    where e.id = entity_id
      and e.status = 'published'
      and e.verification_status in ('unclaimed','rejected')
  )
);
