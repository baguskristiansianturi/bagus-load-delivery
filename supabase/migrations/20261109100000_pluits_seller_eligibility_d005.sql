-- D-005: allow individuals and diverse local business profiles.
-- Historical migrations remain untouched; this forward migration aligns the
-- Seller Center schema and RPC with the approved product decision.

alter table public.stores
  drop constraint if exists stores_business_type_check;

alter table public.stores
  add column if not exists legal_form text;

update public.stores
set legal_form = coalesce(legal_form, business_type),
    business_type = 'company'
where business_type in ('PT', 'CV', 'UD');

alter table public.stores
  add constraint stores_business_type_check
  check (business_type in ('individual', 'umkm', 'family_business', 'cooperative', 'company'));

alter table public.stores
  add constraint stores_legal_form_check
  check (legal_form is null or legal_form in ('PT', 'CV', 'UD', 'Koperasi', 'Yayasan', 'Lainnya'));

drop function if exists public.create_store(text,text,text,text,text,text,text,text,text);

create function public.create_store(
  p_name text,
  p_username text,
  p_business_type text,
  p_phone text,
  p_city text,
  p_area text default null,
  p_legal_name text default null,
  p_email text default null,
  p_full_address text default null,
  p_legal_form text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_region uuid;
  v_store uuid;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Nama toko minimal 2 karakter';
  end if;
  if p_business_type not in ('individual', 'umkm', 'family_business', 'cooperative', 'company') then
    raise exception 'Pilih jenis usaha yang tersedia';
  end if;
  if p_legal_form is not null and p_legal_form not in ('PT', 'CV', 'UD', 'Koperasi', 'Yayasan', 'Lainnya') then
    raise exception 'Bentuk hukum tidak valid';
  end if;
  if p_username !~ '^[a-z0-9][a-z0-9-]{2,39}$' then
    raise exception 'Username toko 3-40 karakter: huruf kecil, angka, tanda hubung';
  end if;
  if length(trim(coalesce(p_phone, ''))) < 6 then
    raise exception 'Nomor telepon/WhatsApp wajib diisi';
  end if;
  if length(trim(coalesce(p_city, ''))) < 2 then
    raise exception 'Kota operasional wajib diisi';
  end if;
  if length(trim(coalesce(p_full_address, ''))) < 8 then
    raise exception 'Alamat fisik/operasional wajib diisi untuk verifikasi';
  end if;

  select id into v_region
  from public.operating_regions
  where code = 'ID-BA' and is_open_for_sellers = true;

  if v_region is null then
    raise exception 'Pendaftaran toko belum dibuka di wilayah ini';
  end if;

  insert into public.stores (
    owner_user_id, region_id, name, username, business_type, legal_form,
    legal_name, phone, email, public_city, public_area, full_address
  )
  values (
    v_user, v_region, trim(p_name), lower(p_username), p_business_type, p_legal_form,
    nullif(trim(p_legal_name), ''), trim(p_phone), nullif(trim(p_email), ''),
    trim(p_city), nullif(trim(p_area), ''), trim(p_full_address)
  )
  returning id into v_store;

  insert into public.store_members(store_id, user_id, role, member_status)
  values (v_store, v_user, 'owner', 'active');

  insert into public.store_settings(store_id) values (v_store);

  insert into public.store_audit_logs(store_id, actor_user_id, action, entity_type, entity_id)
  values (v_store, v_user, 'store.created', 'store', v_store);

  return v_store;
end;
$$;

revoke all on function public.create_store(text,text,text,text,text,text,text,text,text,text) from public, anon;
grant execute on function public.create_store(text,text,text,text,text,text,text,text,text,text) to authenticated;

create or replace function public.submit_store_for_verification(p_store_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store public.stores;
begin
  if auth.uid() is null then
    raise exception 'Sign in required';
  end if;

  select * into v_store
  from public.stores
  where id = p_store_id
  for update;

  if not found then
    raise exception 'Store not found';
  end if;

  if not exists (
    select 1
    from public.store_members
    where store_id = p_store_id
      and user_id = auth.uid()
      and member_status = 'active'
      and role = 'owner'
  ) then
    raise exception 'Only the store owner can submit verification';
  end if;

  if length(trim(coalesce(v_store.phone, ''))) < 6
     or length(trim(coalesce(v_store.full_address, ''))) < 8
     or length(trim(coalesce(v_store.public_city, ''))) < 2 then
    raise exception 'Lengkapi nomor telepon, kota, dan alamat operasional sebelum mengajukan verifikasi';
  end if;

  if v_store.verification_status = 'verified' then
    raise exception 'Store is already verified';
  end if;

  update public.stores
  set verification_status = 'pending',
      store_status = 'pending_review',
      online_sales_enabled = false,
      updated_at = now()
  where id = p_store_id;

  return jsonb_build_object(
    'store_id', p_store_id,
    'verification_status', 'pending',
    'store_status', 'pending_review'
  );
end;
$$;

revoke all on function public.submit_store_for_verification(uuid) from public, anon;
grant execute on function public.submit_store_for_verification(uuid) to authenticated;
