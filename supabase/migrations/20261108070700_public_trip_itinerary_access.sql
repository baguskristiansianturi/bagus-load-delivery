grant select on public.trip_itineraries,public.trip_itinerary_items to anon;
drop policy if exists trip_itinerary_public_anon_read on public.trip_itineraries;
create policy trip_itinerary_public_anon_read on public.trip_itineraries for select to anon using(visibility='public');
drop policy if exists trip_item_public_anon_read on public.trip_itinerary_items;
create policy trip_item_public_anon_read on public.trip_itinerary_items for select to anon using(exists(select 1 from public.trip_itineraries i where i.id=itinerary_id and i.visibility='public'));
