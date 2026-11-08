alter table public.directory_memberships
  add column if not exists source_claim_id uuid
  references public.directory_claims(id) on delete set null;
create index if not exists directory_memberships_source_claim_idx
  on public.directory_memberships(source_claim_id) where source_claim_id is not null;

create or replace function private.sync_directory_claim_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_verification text;
  membership_role text;
  other_approved boolean;
  other_open boolean;
begin
  if new.status = 'approved' then
    next_verification := 'verified';
    membership_role := case new.applicant_role
      when 'owner' then 'owner'
      when 'staff' then 'staff'
      else 'manager'
    end;
  elsif new.status in ('submitted','under_review') then
    next_verification := 'pending';
  elsif new.status in ('rejected','disputed','withdrawn') then
    select exists (
      select 1 from public.directory_claims c
      where c.entity_id = new.entity_id and c.id <> new.id and c.status = 'approved'
    ) into other_approved;
    select exists (
      select 1 from public.directory_claims c
      where c.entity_id = new.entity_id and c.id <> new.id and c.status in ('submitted','under_review')
    ) into other_open;
    if other_approved then
      next_verification := 'verified';
    elsif other_open then
      next_verification := 'pending';
    else
      next_verification := case new.status
        when 'rejected' then 'rejected'
        when 'disputed' then 'suspended'
        else 'unclaimed'
      end;
    end if;
  else
    return new;
  end if;

  update public.directory_entities
  set verification_status = next_verification, updated_at = now()
  where id = new.entity_id;

  if new.status = 'approved' then
    insert into public.directory_memberships(entity_id,user_id,role,status,granted_by,source_claim_id)
    values(new.entity_id,new.applicant_user_id,membership_role,'active',new.reviewer_user_id,new.id)
    on conflict (entity_id,user_id,role)
    do update set status='active', granted_by=excluded.granted_by,
      source_claim_id=excluded.source_claim_id, ends_at=null;
  elsif tg_op = 'UPDATE' and old.status = 'approved' and new.status <> 'approved' then
    update public.directory_memberships
    set status='revoked', ends_at=now()
    where source_claim_id=new.id;
  end if;

  return new;
end;
$$;
revoke all on function private.sync_directory_claim_status() from public, anon, authenticated;
