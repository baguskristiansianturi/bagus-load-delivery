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
