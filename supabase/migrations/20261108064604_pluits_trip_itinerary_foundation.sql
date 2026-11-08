create table if not exists public.trip_itineraries (
 id uuid primary key default gen_random_uuid(), owner_user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(trim(title)) between 2 and 120), summary text not null default '',
 start_date date, end_date date, visibility text not null default 'private' check(visibility in ('private','unlisted','public')),
 status text not null default 'draft' check(status in ('draft','planned','completed','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint trip_itinerary_dates_check check(end_date is null or start_date is null or end_date>=start_date)
);
create table if not exists public.trip_itinerary_items (
 id uuid primary key default gen_random_uuid(), itinerary_id uuid not null references public.trip_itineraries(id) on delete cascade,
 entity_id uuid references public.directory_entities(id) on delete set null, day_number integer not null default 1 check(day_number between 1 and 60),
 title text not null check(char_length(trim(title)) between 1 and 160), note text not null default '', planned_at time,
 duration_minutes integer check(duration_minutes is null or duration_minutes between 1 and 1440), sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create index if not exists trip_itineraries_owner_updated_idx on public.trip_itineraries(owner_user_id,updated_at desc);
create index if not exists trip_itinerary_items_itinerary_order_idx on public.trip_itinerary_items(itinerary_id,day_number,sort_order);
create index if not exists trip_itinerary_items_entity_idx on public.trip_itinerary_items(entity_id) where entity_id is not null;
alter table public.trip_itineraries enable row level security; alter table public.trip_itinerary_items enable row level security;
revoke all on public.trip_itineraries from anon,authenticated; revoke all on public.trip_itinerary_items from anon,authenticated;
grant select,insert,update,delete on public.trip_itineraries to authenticated; grant select,insert,update,delete on public.trip_itinerary_items to authenticated;
create policy "trip itinerary owner or public read" on public.trip_itineraries for select to authenticated using(owner_user_id=(select auth.uid()) or visibility='public');
create policy "trip itinerary owner insert" on public.trip_itineraries for insert to authenticated with check(owner_user_id=(select auth.uid()));
create policy "trip itinerary owner update" on public.trip_itineraries for update to authenticated using(owner_user_id=(select auth.uid())) with check(owner_user_id=(select auth.uid()));
create policy "trip itinerary owner delete" on public.trip_itineraries for delete to authenticated using(owner_user_id=(select auth.uid()));
create policy "trip item owner or public read" on public.trip_itinerary_items for select to authenticated using(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and (i.owner_user_id=(select auth.uid()) or i.visibility='public')));
create policy "trip item owner insert" on public.trip_itinerary_items for insert to authenticated with check(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and i.owner_user_id=(select auth.uid())));
create policy "trip item owner update" on public.trip_itinerary_items for update to authenticated using(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and i.owner_user_id=(select auth.uid()))) with check(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and i.owner_user_id=(select auth.uid())));
create policy "trip item owner delete" on public.trip_itinerary_items for delete to authenticated using(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and i.owner_user_id=(select auth.uid())));