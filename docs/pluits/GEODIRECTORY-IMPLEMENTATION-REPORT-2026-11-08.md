# PLUITS — GeoDirectory Implementation & Evaluation Report

**Tanggal:** 8 November 2026  
**Status:** Core database and first mobile web experience implemented; build verified. Real-device UAT and operational moderation still required.  
**Scope:** local-first Bali/Denpasar, global-ready data model.

## 1. Delivered

### Database and spatial search
- Enabled PostGIS and pg_trgm in the non-exposed `extensions` schema.
- Added canonical directory entities, categories, entity-category links, geographic locations, source provenance, claims, memberships, discovery preferences, interest preferences, activity events, recommendation feedback, saved items, and recent items.
- Added GiST spatial index and public `directory_nearby` RPC using geography distance/radius filtering.
- Added relationships, directory media metadata, a Marketplace store-to-entity link, and Social post-to-entity tags.
- Enabled RLS on every new public table. Explicit grants restrict private tables to authenticated users; source provenance has an explicit deny policy and no API grants.
- Claim submission changes the entity to pending. Approval creates a role membership and marks the entity verified. Only one open claim is allowed per entity.

### Initial Bali directory data
Four curated place records were inserted with OSM provenance:
1. Museum Bali
2. Lapangan Puputan Badung
3. Pantai Pandawa
4. Pura Luhur Uluwatu

The data is a starter set, not a complete Bali directory. It is not a Google Maps scrape. Each record stores a source reference, attribution, and ODbL license metadata. No third-party photographs, reviews, or Google Maps database content were copied.

### Frontend
- Home includes a nearby GeoDirectory section.
- `#/places`: directory search, category filters, area selection, radius, list/map toggle, opt-in device location, and adaptive interest controls.
- `#/place/:slug`: public place detail and save-to-wishlist.
- `#/place/:slug/claim`: claim form for owners/authorized managers/staff/representatives.
- Map loads Leaflet and OpenStreetMap tiles on demand with attribution.
- Directory places are added to the existing Wishlist and Baru Dilihat pages.
- Mobile layout collapses to a single-column card list and horizontal category chips.

### Recommendation model
MVP uses deterministic ranking, not paid AI/ML:
- Explicit user category interests.
- Recent activity signals (view, click, save, follow, share, check-in, hide, report) over a rolling 90-day window.
- Nearby distance.
- User feedback to reduce unwanted recommendations.
- Users can turn personalization off and choose another area.
- Exact device coordinates are used only after a user action and are not persisted as a location trail.

## 2. Migrations applied to Supabase

- `20261108040323_pluits_geodirectory_core`
- `20261108040459_seed_bali_geodirectory_starter`
- `20261108040647_pluits_directory_claim_review_sync`
- `20261108040806_pluits_directory_claim_single_open`
- `20261108040842_pluits_directory_api_privileges`
- `20261108040850_pluits_directory_user_policy_hardening`
- `20261108040926_pluits_geodirectory_domain_links`
- `20261108040936_pluits_geodirectory_media_policy`
- `20261108041053_pluits_directory_sources_deny_client`

The exact live migration history is authoritative; the timestamp above for the final policy migration is provisional in this report.

## 3. Verification performed

### Database checks
- PostGIS and pg_trgm installed in `extensions`.
- 27 active directory categories.
- 4 published entities and 4 public locations.
- Nearby query under the `anon` role returned 2 records within 15 km and 4 within 50 km of the Denpasar test point.
- Category filter for `beach` returned 1 record.
- Invalid latitude returned 0 records.
- GiST index `directory_locations_geom_gix` exists.
- All 16 new public tables checked have RLS enabled.
- Source, claim, and personal preference tables are not readable by `anon`.
- Authenticated user has insert permission on saved items, subject to RLS.
- Private claim trigger function is not executable by anon or authenticated roles.

### Frontend deployment
- GitHub Actions Pages workflow run #506 succeeded on commit `2432e4a81d8588eb46c62c9e3a10b18fafd00a03`.
- This confirms the Vite production build and Pages deploy job succeeded for that commit.
- Subsequent database-only migrations do not change frontend source. A fresh workflow for the latest commit should still be checked before closing this report.
- GitHub Pages URL remains `https://baguskristiansianturi.github.io/bagus-load-delivery/`; repository has not been renamed to `pluits`.

## 4. Not yet complete

1. Directory coverage is only four curated places. A repeatable, licensed OSM/open-data import pipeline with deduplication, refresh, and attribution UI is not yet implemented.
2. No admin review dashboard exists for claims, entity corrections, source imports, or moderation. Claim approvals currently require a trusted server-side/admin process.
3. Directory media metadata exists, but upload UI, Storage bucket policies, and media moderation console are not yet connected.
4. Social post-to-place and store-to-entity database links exist, but their authoring/linking UI and existing store backfill are not yet complete.
5. Trip module has not yet been connected to GeoDirectory because its complete backend lifecycle is not yet implemented.
6. Existing product wishlist/cart/orders still use localStorage in the legacy marketplace flow. Directory saved/recent items are server-side; the whole commerce cart has not yet been migrated.
7. No real account claim test was performed; no dummy identity or fake business owner was created in production.
8. No Android browser visual test, GPS permission test on a physical device, Lighthouse/Core Web Vitals, low-bandwidth test, or load test has been performed by the assistant. These require real-device UAT.
9. Leaflet/OSM tiles are loaded from external services; map availability depends on network and provider policies.
10. Full global rollout, address geocoding, official organization verification, legal identity verification, and large-scale trust/safety moderation are future stages.

## 5. Security findings outside this implementation

- Existing `public.create_store` and `public.update_store_profile` remain SECURITY DEFINER functions. Their current definitions require `auth.uid()`; the update function also checks `private.is_store_owner`. They were not rewritten because doing so without end-to-end seller regression tests could break store onboarding/profile updates. Supabase Security Advisor continues to flag authenticated execution; perform a dedicated authorization test and consider moving privileged routines to a non-exposed schema with explicit grants.
- Supabase Auth leaked-password protection remains disabled. Enable it in Supabase Authentication password/security settings and test signup/password-change UX.
- Existing performance advisor findings for legacy tables/foreign keys remain outside this GeoDirectory change. Add indexes only after workload-specific review.

## 6. Product impact and recommendations

### Positive impact
- A place can exist in the directory before an owner account is registered.
- One canonical place identity can later be connected to a manager, social content, store, event, or trip destination.
- Public discovery no longer depends on users manually creating a business page first.
- User location permission is optional, and location history is not retained as a tracking stream.
- Personalization is explainable and controllable rather than opaque AI ranking.

### Risks and mitigations
- **Incorrect/duplicate places:** preserve source provenance, add community correction, deduplication review, and merge audit.
- **False claims:** one open claim per entity, manual evidence review, audit log, appeal/dispute, and revoke access.
- **Fake trust badges:** keep identity verification, place verification, business verification, transaction verification, and visit verification separate.
- **Sensitive profiling:** never infer religion, politics, health, orientation, or other sensitive attributes from browsing behavior.
- **Unfair moderation:** do not auto-ban people based only on popularity, complaints, or unverified reputation. Use policy-based evidence, proportionate sanctions, notice, appeal, and human review.
- **Data licensing:** import only open/licensed data or authorized APIs; keep ODbL attribution and comply with share-alike requirements. Do not scrape/copy Google Maps listings, photos, or reviews without permission.
- **Over-personalization:** keep Following and category controls, allow reset/disable, and ensure diversity so local recommendations do not become a narrow filter bubble.

## 7. Suggested real-device UAT

1. Open the Home page on Android and verify nearby cards.
2. Open `#/places`; test Denpasar, Badung, radius changes, category chips, and search.
3. Test List and Map; verify map attribution and fallback when tiles fail.
4. Deny GPS permission; confirm manual area selection works.
5. Grant GPS permission only after tapping the location button; confirm the app does not ask continuously.
6. Register/login with a real test account; select interests and turn personalization off/on.
7. Open Museum Bali; save it; check Wishlist and Baru Dilihat.
8. Open a place and submit a claim using a real authorized test organization only after the owner has reviewed the evidence.
9. Test two accounts to verify one account cannot see another account's saved/recent/preferences/claims.
10. Test at 360 px width, 2G/slow network, and Android back navigation.
