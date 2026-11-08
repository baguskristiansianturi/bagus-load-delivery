create or replace function public.report_content(p_target_type text,p_target_id uuid,p_reason text,p_details text default '')
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v_exists boolean:=false;v_owner uuid;v_id uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if p_target_type not in ('post','user','comment','entity') then raise exception 'Invalid report target';end if;
 if p_reason not in ('spam','harassment','hate','violence','nudity','scam','misinformation','other') then raise exception 'Invalid report reason';end if;
 if p_target_type='post' then select user_id into v_owner from public.user_posts where id=p_target_id;v_exists:=found;
 elsif p_target_type='user' then select id into v_owner from public.user_profiles where id=p_target_id;v_exists:=found;
 elsif p_target_type='comment' then select user_id into v_owner from public.post_comments where id=p_target_id;v_exists:=found;
 else select created_by into v_owner from public.directory_entities where id=p_target_id;v_exists:=found;
 end if;
 if not v_exists then raise exception 'Content not found';end if;
 if v_owner=auth.uid() then raise exception 'You cannot report your own content';end if;
 if exists(select 1 from public.content_reports where reporter_user_id=auth.uid() and target_type=p_target_type and target_id=p_target_id and status in ('pending','reviewing')) then raise exception 'You already reported this content';end if;
 insert into public.content_reports(reporter_user_id,target_type,target_id,reason,details) values(auth.uid(),p_target_type,p_target_id,p_reason,left(trim(coalesce(p_details,'')),2000)) returning id into v_id;
 return v_id;
end $$;
revoke all on function public.report_content(text,uuid,text,text) from public,anon;
grant execute on function public.report_content(text,uuid,text,text) to authenticated;
