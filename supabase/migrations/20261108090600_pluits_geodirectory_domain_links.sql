-- Connect GeoDirectory entities to the existing Social and Marketplace domains.
alter table public.stores
  add column if not exists directory_entity_id uuid
  references public.directory_entities(id) on delete set null;
create index if not exists stores_directory_entity_idx on public.stores(directory_entity_id)
  where directory_entity_id is not null;

create table if not exists public.directory_relationships (
  id uuid primary key default gen_random_uuid(),
  from_entity_id uuid not null references public.directory_entities(id) on delete cascade,
  to_entity_id uuid not null references public.directory_entities(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('branch_of','managed_by','located_in','related_to','event_at','organized_by','part_of')),
  status text not null default 'draft' check (status in ('draft','published','rejected')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (from_entity_id <> to_entity_id),
  unique(from_entity_id,to_entity_id,relationship_type)
);
create index if not exists directory_relationships_from_idx on public.directory_relationships(from_entity_id,status);
create index if not exists directory_relationships_to_idx on public.directory_relationships(to_entity_id,status);
alter table public.directory_relationships enable row level security;
create policy directory_relationships_public_read on public.directory_relationships
for select to anon, authenticated using (
  status='published'
  and exists(select 1 from public.directory_entities e where e.id=from_entity_id and e.status='published')
  and exists(select 1 from public.directory_entities e where e.id=to_entity_id and e.status='published')
);
revoke all on public.directory_relationships from public;
grant select on public.directory_relationships to anon, authenticated;

create table if not exists public.directory_media (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  storage_path text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  alt_text text not null default '',
  attribution text,
  rights_status text not null check (rights_status in ('owner_provided','licensed','public_domain')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending','published','rejected')),
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(entity_id,storage_path)
);
create index if not exists directory_media_entity_order_idx on public.directory_media(entity_id,moderation_status,sort_order);
alter table public.directory_media enable row level security;
create policy directory_media_public_read on public.directory_media
for select to anon, authenticated using (
  moderation_status='published'
  and exists(select 1 from public.directory_entities e where e.id=entity_id and e.status='published')
);
create policy directory_media_manager_insert on public.directory_media
for insert to authenticated with check (
  uploaded_by=(select auth.uid())
  and exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
);
create policy directory_media_manager_update on public.directory_media
for update to authenticated
using (exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff')))
with check (
  uploaded_by=(select auth.uid())
  and exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
);
create policy directory_media_manager_delete on public.directory_media
for delete to authenticated using (
  exists(select 1 from public.directory_memberships m where m.entity_id=entity_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','manager','staff'))
);
revoke all on public.directory_media from public, anon;
grant select on public.directory_media to anon, authenticated;
grant insert, update, delete on public.directory_media to authenticated;

create table if not exists public.user_post_directory_entities (
  post_id uuid not null references public.user_posts(id) on delete cascade,
  entity_id uuid not null references public.directory_entities(id) on delete cascade,
  tagged_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(post_id,entity_id)
);
create index if not exists user_post_directory_entities_entity_idx on public.user_post_directory_entities(entity_id,created_at desc);
alter table public.user_post_directory_entities enable row level security;
create policy user_post_directory_entities_public_read on public.user_post_directory_entities
for select to anon, authenticated using (
  exists(select 1 from public.user_posts p where p.id=post_id and p.visibility='public')
  and exists(select 1 from public.directory_entities e where e.id=entity_id and e.status='published')
);
create policy user_post_directory_entities_owner_insert on public.user_post_directory_entities
for insert to authenticated with check (
  tagged_by=(select auth.uid())
  and exists(select 1 from public.user_posts p where p.id=post_id and p.user_id=(select auth.uid()))
  and exists(select 1 from public.directory_entities e where e.id=entity_id and e.status='published')
);
create policy user_post_directory_entities_owner_delete on public.user_post_directory_entities
for delete to authenticated using (
  tagged_by=(select auth.uid())
  or exists(select 1 from public.user_posts p where p.id=post_id and p.user_id=(select auth.uid()))
);
revoke all on public.user_post_directory_entities from public;
grant select on public.user_post_directory_entities to anon, authenticated;
grant insert, delete on public.user_post_directory_entities to authenticated;
