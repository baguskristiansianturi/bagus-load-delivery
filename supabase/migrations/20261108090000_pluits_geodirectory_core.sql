-- Pluits GeoDirectory core: global-ready schema, local-first rollout.
-- PostGIS is installed in the non-exposed extensions schema.
create extension if not exists postgis with schema extensions;

create table if not exists public.directory_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.directory_categories(id) on delete set null,
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  entity_types text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.directory_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('place','organization','provider','event','community','public_service','address')),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(trim(name)) between 2 and 180),
  summary text not null default '' check (length(summary) <= 500),
  description text not null default '',
  website_url text,
  status text not null default 'draft' check (status in ('draft','published','archived','merged')),
  verification_status text not null default 'unclaimed' check (verification_status in ('unclaimed','pending','verified','rejected','suspended')),
  created_by uuid references auth.users(id) on delete set null,
  merged_into uuid references public.directory_entities(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.directory_entity_categories (
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  category_id uuid not null references public.directory_categories(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (entity_id, category_id)
);

create table if not exists public.directory_locations (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  label text not null default 'Lokasi utama',
  address text not null default '',
  locality text,
  district text,
  city text,
  region text,
  postal_code text,
  country_code char(2) not null default 'ID',
  geom extensions.geography(Point,4326) not null,
  is_primary boolean not null default false,
  is_public boolean not null default true,
  location_source text not null default 'community' check (location_source in ('owner','community','open_data','official_api','manual_review')),
  location_accuracy_m integer check (location_accuracy_m is null or location_accuracy_m between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists directory_locations_one_primary_per_entity
  on public.directory_locations(entity_id) where is_primary;
create index if not exists directory_locations_geom_gix
  on public.directory_locations using gist (geom);
create index if not exists directory_locations_city_idx
  on public.directory_locations(country_code, region, city);
create index if not exists directory_entities_public_type_idx
  on public.directory_entities(status, entity_type, published_at desc);
create index if not exists directory_entities_name_trgm_idx
  on public.directory_entities using gin (name gin_trgm_ops);

create table if not exists public.directory_entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  source_name text not null,
  external_id text,
  source_url text,
  license_name text,
  attribution text,
  imported_at timestamptz not null default now(),
  last_checked_at timestamptz,
  source_metadata jsonb not null default '{}'::jsonb,
  unique(source_name, external_id)
);

create table if not exists public.directory_claims (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  applicant_role text not null check (applicant_role in ('owner','authorized_manager','staff','representative')),
  evidence_note text not null check (length(trim(evidence_note)) between 20 and 3000),
  evidence_paths text[] not null default '{}',
  status text not null default 'submitted' check (status in ('submitted','under_review','approved','rejected','disputed','withdrawn')),
  reviewer_user_id uuid references auth.users(id) on delete set null,
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists directory_claims_one_open_per_user_entity
  on public.directory_claims(entity_id, applicant_user_id)
  where status in ('submitted','under_review');

create table if not exists public.directory_memberships (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','staff','contributor')),
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('pending','active','revoked')),
  granted_by uuid references auth.users(id) on delete set null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  unique(entity_id, user_id, role)
);
create index if not exists directory_memberships_user_idx on public.directory_memberships(user_id, status);

create table if not exists public.user_discovery_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_city text,
  preferred_region text,
  country_code char(2) not null default 'ID',
  search_radius_m integer not null default 10000 check (search_radius_m between 500 and 50000),
  use_personalization boolean not null default true,
  allow_nearby_location boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_interest_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.directory_categories(id) on delete cascade,
  preference smallint not null check (preference in (-1,1)),
  source text not null default 'explicit' check (source in ('explicit','behavioral')),
  updated_at timestamptz not null default now(),
  unique(user_id, category_id, source)
);
create index if not exists user_interest_preferences_user_idx on public.user_interest_preferences(user_id);

create table if not exists public.user_activity_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid references public.directory_entities(id) on delete set null,
  category_id uuid references public.directory_categories(id) on delete set null,
  action text not null check (action in ('view','search','save','follow','click','hide','check_in','share','report')),
  created_at timestamptz not null default now()
);
create index if not exists user_activity_events_user_time_idx on public.user_activity_events(user_id, created_at desc);
create index if not exists user_activity_events_entity_idx on public.user_activity_events(entity_id, created_at desc);

create table if not exists public.user_recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid references public.directory_entities(id) on delete cascade,
  category_id uuid references public.directory_categories(id) on delete cascade,
  feedback text not null check (feedback in ('relevant','not_interested','show_less','report')),
  created_at timestamptz not null default now(),
  check (entity_id is not null or category_id is not null)
);
create index if not exists user_recommendation_feedback_user_idx on public.user_recommendation_feedback(user_id, created_at desc);

create table if not exists public.user_saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('entity','product','service','post','event')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);
create index if not exists user_saved_items_user_idx on public.user_saved_items(user_id, created_at desc);

create table if not exists public.user_recent_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('entity','product','service','post','event')),
  target_id uuid not null,
  viewed_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);
create index if not exists user_recent_items_user_idx on public.user_recent_items(user_id, viewed_at desc);

-- RLS is enabled on every new table in the exposed public schema.
alter table public.directory_categories enable row level security;
alter table public.directory_entities enable row level security;
alter table public.directory_entity_categories enable row level security;
alter table public.directory_locations enable row level security;
alter table public.directory_entity_sources enable row level security;
alter table public.directory_claims enable row level security;
alter table public.directory_memberships enable row level security;
alter table public.user_discovery_preferences enable row level security;
alter table public.user_interest_preferences enable row level security;
alter table public.user_activity_events enable row level security;
alter table public.user_recommendation_feedback enable row level security;
alter table public.user_saved_items enable row level security;
alter table public.user_recent_items enable row level security;

create policy directory_categories_public_read on public.directory_categories
for select to anon, authenticated using (is_active);
create policy directory_entities_public_read on public.directory_entities
for select to anon, authenticated using (status = 'published');
create policy directory_entity_categories_public_read on public.directory_entity_categories
for select to anon, authenticated using (
  exists (select 1 from public.directory_entities e where e.id = entity_id and e.status = 'published')
);
create policy directory_locations_public_read on public.directory_locations
for select to anon, authenticated using (
  is_public and exists (select 1 from public.directory_entities e where e.id = entity_id and e.status = 'published')
);
-- Sources are deliberately not granted to API roles and have no client policies.

create policy directory_claims_applicant_read on public.directory_claims
for select to authenticated using (applicant_user_id = (select auth.uid()));
create policy directory_claims_applicant_insert on public.directory_claims
for insert to authenticated with check (
  applicant_user_id = (select auth.uid())
  and status = 'submitted'
  and reviewer_user_id is null
  and reviewed_at is null
  and exists (select 1 from public.directory_entities e where e.id = entity_id and e.status = 'published')
);

create policy directory_memberships_self_read on public.directory_memberships
for select to authenticated using (user_id = (select auth.uid()));

create policy user_discovery_preferences_owner_all on public.user_discovery_preferences
for all to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy user_interest_preferences_owner_all on public.user_interest_preferences
for all to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy user_activity_events_owner_read on public.user_activity_events
for select to authenticated using (user_id = (select auth.uid()));
create policy user_activity_events_owner_insert on public.user_activity_events
for insert to authenticated with check (user_id = (select auth.uid()));
create policy user_activity_events_owner_delete on public.user_activity_events
for delete to authenticated using (user_id = (select auth.uid()));
create policy user_recommendation_feedback_owner_all on public.user_recommendation_feedback
for all to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy user_saved_items_owner_all on public.user_saved_items
for all to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy user_recent_items_owner_all on public.user_recent_items
for all to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Explicit grants are required because new public tables are no longer auto-exposed.
grant usage on schema extensions to anon, authenticated;
grant select on public.directory_categories, public.directory_entities,
  public.directory_entity_categories, public.directory_locations to anon, authenticated;
grant select, insert on public.directory_claims to authenticated;
grant select on public.directory_memberships to authenticated;
grant select, insert, update, delete on public.user_discovery_preferences,
  public.user_interest_preferences, public.user_recommendation_feedback,
  public.user_saved_items, public.user_recent_items to authenticated;
grant select, insert, delete on public.user_activity_events to authenticated;

create or replace function public.directory_nearby(
  p_lat double precision,
  p_lon double precision,
  p_radius_m integer default 10000,
  p_limit integer default 30,
  p_category_slug text default null,
  p_query text default null
)
returns table (
  id uuid,
  entity_type text,
  slug text,
  name text,
  summary text,
  category_slugs text[],
  locality text,
  district text,
  city text,
  region text,
  country_code char(2),
  latitude double precision,
  longitude double precision,
  distance_m double precision,
  verification_status text
)
language sql
stable
security invoker
set search_path = ''
as $$
  with origin as (
    select extensions.st_setsrid(extensions.st_makepoint(p_lon, p_lat), 4326)::extensions.geography as point
  )
  select
    e.id, e.entity_type, e.slug, e.name, e.summary,
    coalesce((
      select array_agg(c.slug order by c.sort_order, c.name)
      from public.directory_entity_categories ec
      join public.directory_categories c on c.id = ec.category_id and c.is_active
      where ec.entity_id = e.id
    ), '{}'::text[]) as category_slugs,
    l.locality, l.district, l.city, l.region, l.country_code,
    extensions.st_y(l.geom::extensions.geometry) as latitude,
    extensions.st_x(l.geom::extensions.geometry) as longitude,
    extensions.st_distance(l.geom, o.point) as distance_m,
    e.verification_status
  from public.directory_entities e
  join public.directory_locations l on l.entity_id = e.id and l.is_public
  cross join origin o
  where e.status = 'published'
    and p_lat between -90 and 90
    and p_lon between -180 and 180
    and extensions.st_dwithin(l.geom, o.point, least(greatest(coalesce(p_radius_m,10000),500),50000))
    and (p_category_slug is null or exists (
      select 1 from public.directory_entity_categories ec
      join public.directory_categories c on c.id = ec.category_id
      where ec.entity_id = e.id and c.slug = p_category_slug and c.is_active
    ))
    and (nullif(trim(p_query),'') is null or (
      e.name ilike '%' || left(trim(p_query),80) || '%'
      or e.summary ilike '%' || left(trim(p_query),80) || '%'
      or l.city ilike '%' || left(trim(p_query),80) || '%'
      or l.locality ilike '%' || left(trim(p_query),80) || '%'
    ))
  order by distance_m asc, e.name asc
  limit least(greatest(coalesce(p_limit,30),1),50);
$$;
grant execute on function public.directory_nearby(double precision,double precision,integer,integer,text,text) to anon, authenticated;

insert into public.directory_categories(slug,name,entity_types,sort_order) values
 ('beach','Pantai',array['place'],10),
 ('tourist-attraction','Destinasi Wisata',array['place'],20),
 ('landmark','Monumen & Landmark',array['place'],30),
 ('nature','Alam & Taman',array['place'],40),
 ('place-of-worship','Tempat Ibadah',array['place','organization'],50),
 ('mosque','Masjid',array['place','organization'],51),
 ('church','Gereja',array['place','organization'],52),
 ('temple','Pura & Kuil',array['place','organization'],53),
 ('school','Sekolah & Pendidikan',array['place','organization'],60),
 ('healthcare','Kesehatan',array['place','provider'],70),
 ('public-facility','Fasilitas Publik',array['place','public_service'],80),
 ('restaurant','Restoran',array['place','provider'],90),
 ('cafe','Kafe',array['place','provider'],100),
 ('accommodation','Akomodasi',array['place','provider'],110),
 ('retail-store','Toko & Ritel',array['place','provider'],120),
 ('construction-supplier','Supplier Konstruksi',array['provider'],130),
 ('professional-service','Jasa Profesional',array['provider'],140),
 ('construction-service','Jasa Konstruksi',array['provider'],150),
 ('transport','Transportasi',array['provider','place'],160),
 ('tour-activity','Aktivitas & Tur',array['provider','event'],170),
 ('event','Acara & Event',array['event'],180),
 ('community','Komunitas',array['community','organization'],190),
 ('foundation','Yayasan',array['organization'],200),
 ('charity','Donasi & Sosial',array['organization'],210),
 ('sports','Olahraga',array['place','community','event'],220),
 ('arts-culture','Seni & Budaya',array['place','event','community'],230),
 ('address','Alamat',array['address'],240)
on conflict (slug) do update set name=excluded.name, entity_types=excluded.entity_types, sort_order=excluded.sort_order, is_active=true;
