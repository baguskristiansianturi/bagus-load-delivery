create or replace function public.update_store_verification_details(p_store_id uuid,p_legal_name text,p_email text,p_full_address text)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if not exists(select 1 from public.store_members where store_id=p_store_id and user_id=auth.uid() and member_status='active' and role='owner') then raise exception 'Only the store owner can update verification details';end if;
 if length(trim(coalesce(p_legal_name,'')))<3 or length(trim(coalesce(p_email,'')))<5 or length(trim(coalesce(p_full_address,'')))<8 then raise exception 'Legal name, valid email, and full address are required';end if;
 update public.stores set legal_name=trim(p_legal_name),email=trim(p_email),full_address=trim(p_full_address),updated_at=now() where id=p_store_id;
end $$;
revoke all on function public.update_store_verification_details(uuid,text,text,text) from public,anon;
grant execute on function public.update_store_verification_details(uuid,text,text,text) to authenticated;
