drop policy if exists content_reports_reporter_read on public.content_reports;
create policy content_reports_reporter_or_moderator_read on public.content_reports for select to authenticated using(reporter_user_id=(select auth.uid()) or coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
create or replace function public.review_content_report(p_report_id uuid,p_decision text,p_note text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_report public.content_reports;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','') not in ('admin','moderator') then raise exception 'Moderator access required';end if;
 if p_decision not in ('reviewing','actioned','dismissed') then raise exception 'Invalid moderation decision';end if;
 select * into v_report from public.content_reports where id=p_report_id for update;
 if not found then raise exception 'Report not found';end if;
 if p_decision='actioned' then
  if v_report.target_type='post' then update public.user_posts set moderation_status='removed' where id=v_report.target_id;
  elsif v_report.target_type='comment' then update public.post_comments set body='[Komentar dihapus oleh moderator]' where id=v_report.target_id;
  elsif v_report.target_type='entity' then update public.directory_entities set status='archived',updated_at=now() where id=v_report.target_id;
  end if;
 end if;
 update public.content_reports set status=p_decision,moderator_user_id=auth.uid(),moderator_note=left(trim(coalesce(p_note,'')),2000),reviewed_at=now() where id=p_report_id;
 return jsonb_build_object('report_id',p_report_id,'status',p_decision);
end $$;
revoke all on function public.review_content_report(uuid,text,text) from public,anon;
grant execute on function public.review_content_report(uuid,text,text) to authenticated;
