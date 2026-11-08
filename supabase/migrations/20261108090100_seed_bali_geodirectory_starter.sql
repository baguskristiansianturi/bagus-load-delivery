-- Initial curated Bali directory records. Coordinates sourced from OpenStreetMap
-- references via Mapcarta; retain attribution and ODbL provenance per record.
with seed(entity_type,slug,name,summary,lat,lon,locality,district,city,region,osm_ref,source_url) as (
 values
 ('place','pantai-pandawa','Pantai Pandawa','Pantai di kawasan Kutuh, Badung.',-8.84586,115.18417,'Kutuh','Kuta Selatan','Badung','Bali','way/284984714','https://mapcarta.com/W284984714'),
 ('place','pura-luhur-uluwatu','Pura Luhur Uluwatu','Kompleks pura dan destinasi budaya di kawasan Uluwatu.',-8.82939,115.08441,'Pecatu','Kuta Selatan','Badung','Bali','way/707659668','https://mapcarta.com/W707659668'),
 ('place','museum-bali','Museum Bali','Museum sejarah dan budaya di pusat Denpasar.',-8.65756,115.21868,'Dangin Puri','Denpasar Timur','Denpasar','Bali','way/311676978','https://mapcarta.com/W311676978'),
 ('place','lapangan-puputan-badung','Lapangan Puputan Badung','Ruang publik dan landmark di pusat Kota Denpasar.',-8.66982,115.22,'Dangin Puri','Denpasar Utara','Denpasar','Bali','node/6949442','https://mapcarta.com/26244562')
),
entities as (
 insert into public.directory_entities(entity_type,slug,name,summary,status,verification_status,published_at)
 select entity_type,slug,name,summary,'published','unclaimed',now() from seed
 on conflict (slug) do update set
  name=excluded.name,
  summary=excluded.summary,
  status='published'
 returning id,slug
),
all_entities as (
 select id,slug from entities
 union all
 select e.id,e.slug from public.directory_entities e join seed s using(slug)
),
loc as (
 insert into public.directory_locations(entity_id,label,address,locality,district,city,region,country_code,geom,is_primary,is_public,location_source,location_accuracy_m)
 select e.id,'Lokasi utama',concat_ws(', ',s.locality,s.district,s.city,s.region,'Indonesia'),s.locality,s.district,s.city,s.region,'ID',
  extensions.st_setsrid(extensions.st_makepoint(s.lon,s.lat),4326)::extensions.geography,true,true,'open_data',100
 from seed s join all_entities e using(slug)
 where not exists(select 1 from public.directory_locations l where l.entity_id=e.id and l.is_primary)
 returning entity_id
)
insert into public.directory_entity_categories(entity_id,category_id)
select e.id,c.id from seed s
join all_entities e using(slug)
join public.directory_categories c on c.slug = case s.slug
 when 'pantai-pandawa' then 'beach'
 when 'pura-luhur-uluwatu' then 'place-of-worship'
 when 'museum-bali' then 'arts-culture'
 else 'landmark' end
on conflict do nothing;

insert into public.directory_entity_sources(entity_id,source_name,external_id,source_url,license_name,attribution)
select e.id,'OpenStreetMap (referensi melalui Mapcarta)',s.osm_ref,s.source_url,'Open Data Commons Open Database License (ODbL) 1.0','© OpenStreetMap contributors; koordinat referensi ditampilkan melalui Mapcarta'
from (
 values
 ('pantai-pandawa','way/284984714','https://mapcarta.com/W284984714'),
 ('pura-luhur-uluwatu','way/707659668','https://mapcarta.com/W707659668'),
 ('museum-bali','way/311676978','https://mapcarta.com/W311676978'),
 ('lapangan-puputan-badung','node/6949442','https://mapcarta.com/26244562')
) s(slug,osm_ref,source_url)
join public.directory_entities e on e.slug=s.slug
on conflict (source_name,external_id) do nothing;
