drop policy if exists stores_public_active_read on public.stores;
revoke select on public.stores from anon;
create function public.update_store_profile(p_store_id uuid,p_name text,p_city text,p_area text default null,p_description text default null,p_phone text default null)
returns void language plpgsql security definer set search_path = ''
as $$
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if not private.is_store_owner(p_store_id) then raise exception 'Only the store owner can update the store profile'; end if;
 if length(trim(coalesce(p_name,'')))<2 then raise exception 'Nama toko minimal 2 karakter'; end if;
 update public.stores set name=trim(p_name),public_city=trim(p_city),public_area=nullif(trim(p_area),''),description=nullif(trim(p_description),''),phone=coalesce(nullif(trim(p_phone),''),phone) where id=p_store_id;
 insert into public.store_audit_logs(store_id,actor_user_id,action,entity_type,entity_id) values(p_store_id,auth.uid(),'store.profile_updated','store',p_store_id);
end;
$$;
revoke all on function public.update_store_profile(uuid,text,text,text,text,text) from public,anon;
grant execute on function public.update_store_profile(uuid,text,text,text,text,text) to authenticated;