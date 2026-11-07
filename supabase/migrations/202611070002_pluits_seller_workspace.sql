-- Pluits Indonesia — Seller onboarding and store workspace foundation
-- Incremental testing release: account -> create store -> owner dashboard -> upload product images.
-- This is an initial foundation; finance, orders, staff invitations and payouts are later milestones.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function private.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_pluits
after insert on auth.users
for each row execute function private.create_profile_for_new_user();

create table public.operating_regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  province text not null,
  country_code char(2) not null default 'ID',
  is_open_for_sellers boolean not null default false,
  is_open_for_buyers boolean not null default false,
  created_at timestamptz not null default now()
);
insert into public.operating_regions(code,name,province,is_open_for_sellers,is_open_for_buyers)
values ('ID-BA','Bali','Bali',true,true);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  region_id uuid not null references public.operating_regions(id),
  name text not null,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9-]{2,39}$'),
  business_type text not null check (business_type in ('PT','CV','UD')),
  legal_name text,
  description text,
  phone text not null,
  email text,
  public_city text not null default 'Denpasar',
  public_area text,
  full_address text,
  postal_code text,
  store_logo_path text,
  store_banner_path text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected','suspended')),
  store_status text not null default 'draft' check (store_status in ('draft','pending_review','active','temporarily_closed','suspended')),
  online_sales_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_members (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager','catalog','orders','accounting','staff')),
  permission_grants jsonb not null default '{}'::jsonb,
  member_status text not null default 'active' check (member_status in ('invited','active','suspended','revoked')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(store_id,user_id)
);

create table public.store_settings (
  store_id uuid primary key references public.stores(id) on delete cascade,
  currency_code char(3) not null default 'IDR',
  timezone text not null default 'Asia/Makassar',
  minimum_order_amount numeric(14,2) not null default 0 check (minimum_order_amount >= 0),
  allow_pickup boolean not null default true,
  allow_delivery boolean not null default true,
  order_notification_email boolean not null default true,
  order_notification_whatsapp boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_operating_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  is_open boolean not null default true,
  opens_at time,
  closes_at time,
  order_cutoff_minutes integer not null default 0 check (order_cutoff_minutes >= 0),
  unique(store_id,weekday),
  check (not is_open or (opens_at is not null and closes_at is not null))
);

create table public.store_delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  coverage_description text,
  minimum_order_amount numeric(14,2) not null default 0 check (minimum_order_amount >= 0),
  delivery_fee numeric(14,2) check (delivery_fee >= 0),
  free_delivery_minimum numeric(14,2) check (free_delivery_minimum >= 0),
  max_distance_km numeric(8,2) check (max_distance_km > 0),
  service_days smallint[] not null default array[1,2,3,4,5,6,7],
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  parent_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id,name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  description text,
  brand text,
  product_code text,
  base_unit text not null default 'pcs',
  preparation_minutes integer not null default 0 check (preparation_minutes >= 0),
  minimum_quantity numeric(14,3) not null default 1 check (minimum_quantity > 0),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  variant_name text not null default 'Default',
  sale_unit text not null default 'pcs',
  online_price numeric(14,2) not null default 0 check (online_price >= 0),
  offline_price numeric(14,2) check (offline_price >= 0),
  discount_price numeric(14,2) check (discount_price >= 0),
  stock_quantity numeric(14,3) not null default 0 check (stock_quantity >= 0),
  weight_kg numeric(14,3) check (weight_kg >= 0),
  length_cm numeric(14,3) check (length_cm >= 0),
  width_cm numeric(14,3) check (width_cm >= 0),
  height_cm numeric(14,3) check (height_cm >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id,sku),
  check (discount_price is null or discount_price <= online_price)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  movement_type text not null check (movement_type in ('opening','restock','sale','adjustment','return','damage')),
  quantity_change numeric(14,3) not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.store_audit_logs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index on public.store_members(user_id,store_id);
create index on public.products(store_id,status);
create index on public.product_variants(product_id,is_active);
create index on public.product_images(product_id,sort_order);
create index on public.inventory_movements(store_id,created_at desc);

create function private.is_store_member(p_store_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.store_members m
    where m.store_id = p_store_id and m.user_id = (select auth.uid())
      and m.member_status = 'active'
  );
$$;

create function private.is_store_owner(p_store_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.store_members m
    where m.store_id = p_store_id and m.user_id = (select auth.uid())
      and m.role = 'owner' and m.member_status = 'active'
  );
$$;

create function public.create_store(
  p_name text,
  p_username text,
  p_business_type text,
  p_phone text,
  p_city text,
  p_area text default null,
  p_legal_name text default null,
  p_email text default null,
  p_full_address text default null
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
  if v_user is null then raise exception 'Authentication required'; end if;
  if length(trim(coalesce(p_name,''))) < 2 then raise exception 'Nama toko minimal 2 karakter'; end if;
  if p_business_type not in ('PT','CV','UD') then raise exception 'Bentuk usaha harus PT, CV, atau UD'; end if;
  if p_username !~ '^[a-z0-9][a-z0-9-]{2,39}$' then raise exception 'Username toko 3-40 karakter: huruf kecil, angka, tanda hubung'; end if;
  select id into v_region from public.operating_regions
   where code = 'ID-BA' and is_open_for_sellers = true;
  if v_region is null then raise exception 'Pendaftaran toko belum dibuka di wilayah ini'; end if;

  insert into public.stores(owner_user_id,region_id,name,username,business_type,legal_name,phone,email,public_city,public_area,full_address)
  values(v_user,v_region,trim(p_name),lower(p_username),p_business_type,nullif(trim(p_legal_name),''),trim(p_phone),nullif(trim(p_email),''),trim(p_city),nullif(trim(p_area),''),nullif(trim(p_full_address),''))
  returning id into v_store;

  insert into public.store_members(store_id,user_id,role,member_status)
  values(v_store,v_user,'owner','active');

  insert into public.store_settings(store_id) values(v_store);
  insert into public.store_audit_logs(store_id,actor_user_id,action,entity_type,entity_id)
  values(v_store,v_user,'store.created','store',v_store);

  return v_store;
end;
$$;

revoke all on function public.create_store(text,text,text,text,text,text,text,text,text) from public, anon;
grant execute on function public.create_store(text,text,text,text,text,text,text,text,text) to authenticated;
revoke all on function private.is_store_member(uuid), private.is_store_owner(uuid) from public, anon;
grant execute on function private.is_store_member(uuid), private.is_store_owner(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.operating_regions enable row level security;
alter table public.stores enable row level security;
alter table public.store_members enable row level security;
alter table public.store_settings enable row level security;
alter table public.store_operating_hours enable row level security;
alter table public.store_delivery_zones enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.store_audit_logs enable row level security;

create policy profile_self_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profile_self_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy regions_public_read on public.operating_regions for select to anon,authenticated using (is_open_for_buyers or is_open_for_sellers);
create policy stores_owner_or_member_read on public.stores for select to authenticated using (owner_user_id = (select auth.uid()) or private.is_store_member(id));
create policy stores_public_active_read on public.stores for select to anon,authenticated using (store_status = 'active');
create policy members_self_or_owner_read on public.store_members for select to authenticated using (user_id = (select auth.uid()) or private.is_store_owner(store_id));
create policy settings_member_all on public.store_settings for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));
create policy hours_member_all on public.store_operating_hours for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));
create policy zones_member_all on public.store_delivery_zones for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));
create policy categories_member_all on public.product_categories for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));
create policy products_member_all on public.products for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));
create policy variants_member_all on public.product_variants for all to authenticated using (
 exists(select 1 from public.products p where p.id=product_id and private.is_store_member(p.store_id))
) with check (
 exists(select 1 from public.products p where p.id=product_id and private.is_store_member(p.store_id))
);
create policy images_member_all on public.product_images for all to authenticated using (
 exists(select 1 from public.products p where p.id=product_id and private.is_store_member(p.store_id))
) with check (
 exists(select 1 from public.products p where p.id=product_id and private.is_store_member(p.store_id))
);
create policy inventory_member_read on public.inventory_movements for select to authenticated using (private.is_store_member(store_id));
create policy audit_member_read on public.store_audit_logs for select to authenticated using (private.is_store_member(store_id));

grant select on public.operating_regions,public.stores to anon,authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.store_members to authenticated;
grant select,insert,update,delete on public.store_settings,public.store_operating_hours,public.store_delivery_zones,
 public.product_categories,public.products,public.product_variants,public.product_images to authenticated;
grant select on public.inventory_movements,public.store_audit_logs to authenticated;

-- Storage is private by default. Product images are stored under <store_uuid>/<product_uuid>/<filename>.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('pluits-store-media','pluits-store-media',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

create policy pluits_media_owner_upload on storage.objects
for insert to authenticated with check (
 bucket_id='pluits-store-media'
 and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
 and private.is_store_member(((storage.foldername(name))[1])::uuid)
);
create policy pluits_media_member_read on storage.objects
for select to authenticated using (
 bucket_id='pluits-store-media'
 and private.is_store_member(((storage.foldername(name))[1])::uuid)
);
create policy pluits_media_member_update on storage.objects
for update to authenticated using (
 bucket_id='pluits-store-media'
 and private.is_store_member(((storage.foldername(name))[1])::uuid)
) with check (
 bucket_id='pluits-store-media'
 and private.is_store_member(((storage.foldername(name))[1])::uuid)
);
create policy pluits_media_member_delete on storage.objects
for delete to authenticated using (
 bucket_id='pluits-store-media'
 and private.is_store_member(((storage.foldername(name))[1])::uuid)
);

create trigger profiles_updated_at before update on public.profiles
for each row execute function private.touch_updated_at();
create trigger stores_updated_at before update on public.stores
for each row execute function private.touch_updated_at();
create trigger settings_updated_at before update on public.store_settings
for each row execute function private.touch_updated_at();
create trigger products_updated_at before update on public.products
for each row execute function private.touch_updated_at();
create trigger variants_updated_at before update on public.product_variants
for each row execute function private.touch_updated_at();
