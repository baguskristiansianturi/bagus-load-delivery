create or replace function public.review_store_verification(p_store_id uuid,p_decision text,p_note text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_store public.stores;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','') not in ('admin','moderator') then raise exception 'Admin review access required';end if;
 if p_decision not in ('verified','rejected') then raise exception 'Invalid review decision';end if;
 select * into v_store from public.stores where id=p_store_id for update;
 if not found then raise exception 'Store not found';end if;
 if v_store.store_status<>'pending_review' or v_store.verification_status<>'pending' then raise exception 'Store is not awaiting verification';end if;
 update public.stores set verification_status=p_decision,store_status=case when p_decision='verified' then 'active' else 'draft' end,online_sales_enabled=false,updated_at=now() where id=p_store_id;
 insert into public.store_audit_logs(store_id,actor_user_id,action,entity_type,entity_id,details) values(p_store_id,auth.uid(),'verification_'||p_decision,'store',p_store_id,jsonb_build_object('note',left(trim(coalesce(p_note,'')),2000)));
 return jsonb_build_object('store_id',p_store_id,'verification_status',p_decision);
end $$;
revoke all on function public.review_store_verification(uuid,text,text) from public,anon;grant execute on function public.review_store_verification(uuid,text,text) to authenticated;
