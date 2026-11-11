# PLUITS Discovery: Card Ownership and Location Backend

## Visual contract — freeze
The current Explore home composition is the approved baseline. Do not redesign its hero, Top 10, nearby hero cards, post cards, spacing, typography, or navigation while implementing data services. Feature modules own data and behavior; page composition owns order and placement.

## Card modules
- `src/features/discovery/nearby-card.js`: one nearby place card. Owns image fill, image shade, category/title/location overlay and escaping. It does not fetch data or decide ranking.
- `src/features/discovery/top-ten-cards.js`: Top 10 section/card presentation. It accepts items and preserves the existing class hooks. The bundled items are demo-only and must be replaced by backend records before describing them as real trends.
- Page modules compose these cards. Do not duplicate their markup in page controllers.

## Nearby data flow
1. Request device geolocation with user permission. GPS coordinates are the precise source.
2. If GPS is unavailable, use a future server-side IP geolocation adapter only as a coarse city/region fallback. Never describe IP-derived location as exact or as GPS.
3. If neither source is available, show the location permission/empty state. Never silently default to Denpasar or Bali.
4. Call the existing `public.directory_nearby(p_lat,p_lon,p_radius_m,p_limit,p_category_slug,p_query)` RPC. It uses PostGIS geography distance and the public published directory records.
5. Build the nearby category strip from the union of `category_slugs` returned by that same radius query. A category with zero nearby published entities must not be rendered.
6. Render nearby cards from the returned entities and associated public posts. Do not create fallback category chips from a hard-coded list.

## Global location and privacy
- GPS is user-consented and should remain in memory for the active session unless a separate explicit preference is introduced.
- IP geolocation is approximate and may be wrong due to mobile carrier NAT, VPN, proxy, or ISP routing. Do not persist raw IP addresses for discovery.
- Store only coarse derived area when a durable preference is explicitly needed; never expose exact user coordinates to other users.
- Search radius is a product setting (home currently 5 km), not a country-specific constant. Keep distance calculation in PostGIS and use parameterized coordinates/radius.
- Resolve city names through a replaceable reverse-geocoding adapter; do not hard-code Bali as a global fallback.

## Top 10 ranking contract
The visual component is independent from ranking. The backend should eventually rank eligible published entities/posts using a documented time window and signals such as unique impressions, meaningful opens, saves, shares, verified transactions, recency, and quality/trust filters. Deduplicate by entity, protect against repeated/self-generated traffic, apply privacy/moderation constraints, and avoid fabricated counts. Until that pipeline is verified, bundled Top 10 items are visual fixtures only.

## Routing and lifecycle
- `src/app/router.js` increments `window.__pluitsRouteVersion` for every navigation.
- Async page controllers must check that route generation is still current before mutating `#app`. This prevents late profile/feed responses from overwriting the destination after the user navigates away.
- Keep aliases as redirects to one canonical route. Do not create parallel profile or home implementations.
- Archive old experiments only after proving there are no imports, route references, build dependencies, or required historical assets.

## Backend readiness already present
The connected Supabase project has the GeoDirectory tables, 27 active category records, published entity/location relations, user activity/preferences, and the PostGIS `directory_nearby` RPC. The current RPC is coordinate-driven and can serve any supported country once the directory has real coverage. Global discovery therefore needs global directory data and a safe coarse-location resolver, not a second nearby database.

## Next backend milestones
1. Implement a server-side location resolver with a provider-neutral contract: `{latitude, longitude, precision, source, city, region, country_code}`; GPS takes precedence over IP.
2. Add global region coverage and ingestion/verification pipelines for directory entities. Do not seed fake places.
3. Add an impression/event pipeline with deduplication and abuse controls.
4. Implement a Top 10 materialized/ranked query with transparent time windows and test data separated from production data.
5. Add RLS, rate-limit, performance and privacy tests before enabling global ranking.
