-- Bagus Load & Delivery — Marketplace foundation
-- Migration: 202611070001_initial_marketplace
-- No demo inventory is seeded. Product and store tables start empty.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operating_regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  province text not null,
  country_code char(2) not null default 'ID',
  is_open_for_sellers boolean not null default false,
  is_open_for_buyers boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.operating_regions (code, name, province, country_code, is_open_for_sellers, is_open_for_buyers)
values ('ID-BA', 'Bali', 'Bali', 'ID', true, true)
on conflict (code) do nothing;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  region_id uuid not null references public.operating_regions(id),
  name text not null,
  slug text not null unique,
  business_type text not null check (business_type in ('PT','CV','UD')),
  business_legal_name text,
  description text,
  phone text not null,
  public_city text not null,
  public_area text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected','suspended')),
  store_status text not null default 'draft'
    check (store_status in ('draft','pending_review','active','temporarily_closed','suspended')),
  online_sales_enabled boolean not null default false,
  accepted_seller_terms_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager','catalog','orders','staff')),
  permissions jsonb not null default '{}'::jsonb,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);

create table if not exists public.store_private_locations (
  store_id uuid primary key references public.stores(id) on delete cascade,
  full_address text not null,
  latitude numeric(10,7) not null check (latitude between -90 and 90),
  longitude numeric(10,7) not null check (longitude between -180 and 180),
  pickup_instructions text,
  updated_at timestamptz not null default now()
);

create table if not exists public.store_operating_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  is_open boolean not null default true,
  opens_at time,
  closes_at time,
  order_cutoff_minutes integer not null default 0 check (order_cutoff_minutes >= 0),
  pickup_cutoff_minutes integer not null default 0 check (pickup_cutoff_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, weekday),
  check ((is_open = false) or (opens_at is not null and closes_at is not null))
);

create table if not exists public.store_delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  zone_geometry jsonb,
  minimum_order_amount numeric(14,2) not null default 0 check (minimum_order_amount >= 0),
  delivery_fee numeric(14,2) check (delivery_fee >= 0),
  free_delivery_minimum numeric(14,2) check (free_delivery_minimum >= 0),
  max_distance_km numeric(8,2) check (max_distance_km > 0),
  service_days smallint[] not null default array[1,2,3,4,5,6,7],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade,
  parent_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, slug)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  slug text not null,
  brand text,
  description text,
  product_code text,
  base_unit text not null default 'pcs',
  preparation_minutes integer not null default 0 check (preparation_minutes >= 0),
  minimum_quantity numeric(14,3) not null default 1 check (minimum_quantity > 0),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, slug)
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  name text not null,
  attributes jsonb not null default '{}'::jsonb,
  sale_unit text not null default 'pcs',
  online_price numeric(14,2) not null check (online_price >= 0),
  offline_price numeric(14,2) check (offline_price >= 0),
  discount_price numeric(14,2) check (discount_price >= 0),
  stock_quantity numeric(14,3) not null default 0 check (stock_quantity >= 0),
  weight_value numeric(14,3) check (weight_value >= 0),
  weight_unit text,
  length_value numeric(14,3) check (length_value >= 0),
  width_value numeric(14,3) check (width_value >= 0),
  height_value numeric(14,3) check (height_value >= 0),
  dimension_unit text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, sku),
  check (discount_price is null or discount_price <= online_price)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  movement_type text not null check (movement_type in ('opening','restock','sale','adjustment','return','damage')),
  quantity_change numeric(14,3) not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.store_audit_logs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_stores_region_status on public.stores(region_id, store_status);
create index if not exists idx_store_members_user on public.store_members(user_id, store_id);
create index if not exists idx_products_store_status on public.products(store_id, status);
create index if not exists idx_variants_product_active on public.product_variants(product_id, is_active);
create index if not exists idx_inventory_movements_variant_date on public.inventory_movements(variant_id, created_at desc);
create index if not exists idx_delivery_zones_store_active on public.store_delivery_zones(store_id, is_active);

-- RLS: every exposed table is protected. Exact shop addresses are never public.
alter table public.profiles enable row level security;
alter table public.operating_regions enable row level security;
alter table public.stores enable row level security;
alter table public.store_members enable row level security;
alter table public.store_private_locations enable row level security;
alter table public.store_operating_hours enable row level security;
alter table public.store_delivery_zones enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.store_audit_logs enable row level security;

-- Membership helpers live outside exposed schemas. SECURITY DEFINER is narrowly
-- scoped, checks auth.uid(), and reads only membership rows to avoid RLS recursion.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_store_member(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select (select auth.uid()) is not null and exists (
    select 1 from public.store_members sm
    where sm.store_id = target_store_id
      and sm.user_id = (select auth.uid())
  );
$;

create or replace function private.is_store_owner(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select (select auth.uid()) is not null and exists (
    select 1 from public.store_members sm
    where sm.store_id = target_store_id
      and sm.user_id = (select auth.uid())
      and sm.role = 'owner'
  );
$;

revoke all on function private.is_store_member(uuid) from public, anon;
revoke all on function private.is_store_owner(uuid) from public, anon;
grant execute on function private.is_store_member(uuid), private.is_store_owner(uuid) to authenticated;

create policy "profiles_select_own" on public.profiles
for select to authenticated using (id = (select auth.uid()));
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "regions_read_open" on public.operating_regions
for select to anon, authenticated using (is_open_for_buyers or is_open_for_sellers);

create policy "stores_read_active_or_member" on public.stores
for select to authenticated using (
  store_status = 'active' or owner_user_id = (select auth.uid()) or private.is_store_member(id)
);
create policy "stores_public_read_active" on public.stores
for select to anon using (store_status = 'active');
create policy "stores_create_as_owner" on public.stores
for insert to authenticated with check (
  owner_user_id = (select auth.uid())
  and exists (
    select 1 from public.operating_regions r
    where r.id = region_id and r.is_open_for_sellers = true
  )
);
create policy "stores_update_owner" on public.stores
for update to authenticated using (private.is_store_owner(id)) with check (private.is_store_owner(id));

create policy "store_members_read_self_or_owner" on public.store_members
for select to authenticated using (user_id = (select auth.uid()) or private.is_store_owner(store_id));
create policy "store_members_insert_owner_self" on public.store_members
for insert to authenticated with check (
  user_id = (select auth.uid()) and role = 'owner'
  and exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = (select auth.uid()))
);
create policy "store_members_update_owner" on public.store_members
for update to authenticated using (private.is_store_owner(store_id)) with check (private.is_store_owner(store_id));
create policy "store_members_delete_owner" on public.store_members
for delete to authenticated using (private.is_store_owner(store_id));

create policy "private_location_members_only" on public.store_private_locations
for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));

create policy "hours_read_active_or_member" on public.store_operating_hours
for select to anon, authenticated using (
  exists (select 1 from public.stores s where s.id = store_id and s.store_status = 'active')
  or private.is_store_member(store_id)
);
create policy "hours_manage_members" on public.store_operating_hours
for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));

create policy "zones_read_active_or_member" on public.store_delivery_zones
for select to anon, authenticated using (
  (is_active and exists (select 1 from public.stores s where s.id = store_id and s.store_status = 'active'))
  or private.is_store_member(store_id)
);
create policy "zones_manage_members" on public.store_delivery_zones
for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));

create policy "categories_read_active" on public.product_categories
for select to anon, authenticated using (
  is_active and (store_id is null or exists (
    select 1 from public.stores s where s.id = store_id and s.store_status = 'active'
  ))
  or (store_id is not null and private.is_store_member(store_id))
);
create policy "categories_manage_members" on public.product_categories
for all to authenticated using (store_id is not null and private.is_store_member(store_id))
with check (store_id is not null and private.is_store_member(store_id));

create policy "products_read_published" on public.products
for select to anon, authenticated using (
  (status = 'published' and exists (
    select 1 from public.stores s where s.id = store_id and s.store_status = 'active'
  )) or private.is_store_member(store_id)
);
create policy "products_manage_members" on public.products
for all to authenticated using (private.is_store_member(store_id)) with check (private.is_store_member(store_id));

create policy "variants_read_published_product" on public.product_variants
for select to anon, authenticated using (
  (is_active and exists (
    select 1 from public.products p join public.stores s on s.id = p.store_id
    where p.id = product_id and p.status = 'published' and s.store_status = 'active'
  )) or exists (
    select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id)
  )
);
create policy "variants_manage_members" on public.product_variants
for all to authenticated using (
  exists (select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id))
) with check (
  exists (select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id))
);

create policy "images_read_published_product" on public.product_images
for select to anon, authenticated using (
  exists (select 1 from public.products p join public.stores s on s.id = p.store_id
    where p.id = product_id and p.status = 'published' and s.store_status = 'active')
  or exists (select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id))
);
create policy "images_manage_members" on public.product_images
for all to authenticated using (
  exists (select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id))
) with check (
  exists (select 1 from public.products p where p.id = product_id and private.is_store_member(p.store_id))
);

create policy "inventory_read_members" on public.inventory_movements
for select to authenticated using (private.is_store_member(store_id));
create policy "inventory_insert_members" on public.inventory_movements
for insert to authenticated with check (
  private.is_store_member(store_id) and exists (
    select 1 from public.product_variants v join public.products p on p.id = v.product_id
    where v.id = variant_id and p.store_id = store_id
  )
);

create policy "audit_read_members" on public.store_audit_logs
for select to authenticated using (private.is_store_member(store_id));

-- Restrict table privileges; RLS remains the row-level boundary.
grant select on public.operating_regions, public.stores, public.store_operating_hours,
  public.store_delivery_zones, public.product_categories, public.products,
  public.product_variants, public.product_images to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant insert, update on public.stores to authenticated;
grant select, insert, update, delete on public.store_members,
  public.store_private_locations, public.store_operating_hours,
  public.store_delivery_zones, public.product_categories, public.products,
  public.product_variants, public.product_images to authenticated;
grant select, insert on public.inventory_movements to authenticated;
grant select on public.store_audit_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;
