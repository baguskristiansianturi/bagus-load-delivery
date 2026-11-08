-- Claim review controls entity verification state and creates manager access
-- only after a reviewer changes a claim to approved.
create or replace function private.sync_directory_claim_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_verification text;
  membership_role text;
begin
  if new.status in ('submitted','under_review') then
    next_verification := 'pending';
  elsif new.status = 'approved' then
    next_verification := 'verified';
    membership_role := case new.applicant_role
      when 'owner' then 'owner'
      when 'staff' then 'staff'
      else 'manager'
    end;
  elsif new.status = 'rejected' then
    next_verification := 'rejected';
  elsif new.status = 'disputed' then
    next_verification := 'suspended';
  elsif new.status = 'withdrawn' then
    if exists (
      select 1 from public.directory_claims c
      where c.entity_id = new.entity_id
        and c.id <> new.id
        and c.status in ('submitted','under_review','approved')
    ) then
      next_verification := case when exists (
        select 1 from public.directory_claims c
        where c.entity_id = new.entity_id and c.status = 'approved'
      ) then 'verified' else 'pending' end;
    else
      next_verification := 'unclaimed';
    end if;
  else
    return new;
  end if;

  update public.directory_entities
  set verification_status = next_verification, updated_at = now()
  where id = new.entity_id;

  if new.status = 'approved' then
    insert into public.directory_memberships(entity_id,user_id,role,status,granted_by)
    values(new.entity_id,new.applicant_user_id,membership_role,'active',new.reviewer_user_id)
    on conflict (entity_id,user_id,role)
    do update set status='active', granted_by=excluded.granted_by, ends_at=null;
  end if;

  return new;
end;
$$;
revoke all on function private.sync_directory_claim_status() from public, anon, authenticated;

drop trigger if exists directory_claims_sync_status on public.directory_claims;
create trigger directory_claims_sync_status
after insert or update of status on public.directory_claims
for each row execute function private.sync_directory_claim_status();
