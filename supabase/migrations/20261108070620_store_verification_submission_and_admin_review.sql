create policy stores_admin_review_read on public.stores for select to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','moderator'));
create or replace function public.submit_store_for_verification(p_store_id uuid) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_store public.stores;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 select * into v_store from public.stores where id=p_store_id for update;
 if not found then raise exception 'Store not found';end if;
 if not exists(select 1 from public.store_members where store_id=p_store_id and user_id=auth.uid() and member_status='active' and role='owner') then raise exception 'Only the store owner can submit verification';end if;
 if length(trim(coalesce(v_store.legal_name,'')))<3 or length(trim(coalesce(v_store.phone,'')))<6 or length(trim(coalesce(v_store.full_address,'')))<8 or length(trim(coalesce(v_store.email,'')))<5 then raise exception 'Complete legal name, phone, email, and full business address before submission';end if;
 if v_store.verification_status='verified' then raise exception 'Store is already verified';end if;
 update public.stores set verification_status='pending',store_status='pending_review',online_sales_enabled=false,updated_at=now() where id=p_store_id;
 return jsonb_build_object('store_id',p_store_id,'verification_status','pending','store_status','pending_review');
end $$;
revoke all on function public.submit_store_for_verification(uuid) from public,anon;grant execute on function public.submit_store_for_verification(uuid) to authenticated;
create or replace function public.review_store_verification(p_store_id uuid,p_decision text,p_note text default '') returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
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
create or replace function public.update_store_verification_details(p_store_id uuid,p_legal_name text,p_email text,p_full_address text) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if not exists(select 1 from public.store_members where store_id=p_store_id and user_id=auth.uid() and member_status='active' and role='owner') then raise exception 'Only the store owner can update verification details';end if;
 if length(trim(coalesce(p_legal_name,'')))<3 or length(trim(coalesce(p_email,'')))<5 or length(trim(coalesce(p_full_address,'')))<8 then raise exception 'Legal name, valid email, and full address are required';end if;
 update public.stores set legal_name=trim(p_legal_name),email=trim(p_email),full_address=trim(p_full_address),updated_at=now() where id=p_store_id;
end $$;
revoke all on function public.update_store_verification_details(uuid,text,text,text) from public,anon;grant execute on function public.update_store_verification_details(uuid,text,text,text) to authenticated;
