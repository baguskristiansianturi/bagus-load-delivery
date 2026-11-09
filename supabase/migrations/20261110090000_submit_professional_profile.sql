-- Submit a professional profile to the PLUITS moderation queue.
-- Owners can submit; only authorized moderators can approve or reject.
create or replace function public.submit_professional_profile(p_profile_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_profile public.professional_profiles;
  v_case_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in required';
  end if;

  select * into v_profile
  from public.professional_profiles
  where id = p_profile_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Professional profile not found or access denied';
  end if;

  if v_profile.profile_status = 'active' then
    raise exception 'Professional profile is already approved';
  end if;

  if v_profile.profile_status = 'suspended' then
    raise exception 'Suspended professional profile cannot be resubmitted';
  end if;

  if length(trim(coalesce(v_profile.display_name,''))) < 2
     or length(trim(coalesce(v_profile.profession_category,''))) < 2
     or length(trim(coalesce(v_profile.username,''))) < 3 then
    raise exception 'Complete the professional name, username, and profession category before submission';
  end if;

  update public.professional_profiles
  set profile_status = 'submitted', updated_at = now()
  where id = p_profile_id and user_id = auth.uid();

  select id into v_case_id
  from public.profile_verification_cases
  where target_type = 'professional'
    and target_id = p_profile_id
    and applicant_user_id = auth.uid()
    and status in ('submitted','under_review')
  order by submitted_at desc
  limit 1;

  if v_case_id is null then
    insert into public.profile_verification_cases
      (target_type,target_id,applicant_user_id,verification_scope,status,applicant_note)
    values
      ('professional',p_profile_id,auth.uid(),'professional_profile','submitted','')
    returning id into v_case_id;
  end if;

  return jsonb_build_object(
    'profile_id', p_profile_id,
    'profile_status', 'submitted',
    'verification_case_id', v_case_id
  );
end;
$function$;

revoke all on function public.submit_professional_profile(uuid) from public;
grant execute on function public.submit_professional_profile(uuid) to authenticated;


-- Authorized reviewers can approve or reject submitted professional profiles.
create or replace function public.review_professional_profile(
  p_profile_id uuid,
  p_decision text,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_profile public.professional_profiles;
  v_case public.profile_verification_cases;
begin
  if auth.uid() is null
     or coalesce(auth.jwt()->'app_metadata'->>'role','') not in ('admin','moderator') then
    raise exception 'Admin review access required';
  end if;
  if p_decision not in ('verified','rejected') then
    raise exception 'Invalid review decision';
  end if;

  select * into v_profile
  from public.professional_profiles
  where id = p_profile_id
  for update;
  if not found then
    raise exception 'Professional profile not found';
  end if;

  select * into v_case
  from public.profile_verification_cases
  where target_type = 'professional'
    and target_id = p_profile_id
    and status in ('submitted','under_review')
  order by submitted_at desc
  limit 1
  for update;
  if not found then
    raise exception 'Professional profile is not awaiting review';
  end if;

  update public.professional_profiles
  set profile_status = case when p_decision='verified' then 'active' else 'rejected' end,
      updated_at = now()
  where id = p_profile_id;

  update public.profile_verification_cases
  set status = p_decision,
      reviewer_user_id = auth.uid(),
      reviewer_note = left(trim(coalesce(p_note,'')),2000),
      reviewed_at = now(),
      updated_at = now()
  where id = v_case.id;

  return jsonb_build_object(
    'profile_id', p_profile_id,
    'profile_status', case when p_decision='verified' then 'active' else 'rejected' end,
    'verification_case_id', v_case.id,
    'decision', p_decision
  );
end;
$function$;

revoke all on function public.review_professional_profile(uuid,text,text) from public;
grant execute on function public.review_professional_profile(uuid,text,text) to authenticated;

drop policy if exists professional_profiles_admin_review_read on public.professional_profiles;
create policy professional_profiles_admin_review_read
on public.professional_profiles
for select
to authenticated
using (coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));

drop policy if exists profile_verification_admin_read on public.profile_verification_cases;
create policy profile_verification_admin_read
on public.profile_verification_cases
for select
to authenticated
using (coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
