-- Align the store type field with the product's business categories.
-- This is onboarding data, not seller verification or eligibility enforcement.
alter table public.stores drop constraint if exists stores_business_type_check;
alter table public.stores add constraint stores_business_type_check
  check (business_type in ('PT','CV','UD','individual','umkm','family_business','cooperative','company'));

create or replace function public.create_store(
 p_name text,p_username text,p_business_type text,p_phone text,p_city text,
 p_area text default null,p_legal_name text default null,p_email text default null,p_full_address text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare v_user uuid := auth.uid(); v_region uuid; v_store uuid;
begin
 if v_user is null then raise exception 'Authentication required'; end if;
 if length(trim(coalesce(p_name,'')))<2 then raise exception 'Nama toko minimal 2 karakter'; end if;
 if p_business_type not in ('PT','CV','UD','individual','umkm','family_business','cooperative','company') then raise exception 'Jenis usaha tidak valid'; end if;
 if p_username !~ '^[a-z0-9][a-z0-9-]{2,39}$' then raise exception 'Username toko 3-40 karakter: huruf kecil, angka, tanda hubung'; end if;
 select id into v_region from public.operating_regions where code='ID-BA' and is_open_for_sellers=true;
 if v_region is null then raise exception 'Pendaftaran toko belum dibuka di wilayah ini'; end if;
 insert into public.stores(owner_user_id,region_id,name,username,business_type,legal_name,phone,email,public_city,public_area,full_address)
 values(v_user,v_region,trim(p_name),lower(p_username),p_business_type,nullif(trim(p_legal_name),''),trim(p_phone),nullif(trim(p_email),''),trim(p_city),nullif(trim(p_area),''),nullif(trim(p_full_address),'')) returning id into v_store;
 insert into public.store_members(store_id,user_id,role,member_status) values(v_store,v_user,'owner','active');
 insert into public.store_settings(store_id) values(v_store);
 insert into public.store_audit_logs(store_id,actor_user_id,action,entity_type,entity_id) values(v_store,v_user,'store.created','store',v_store);
 return v_store;
end;
$$;
