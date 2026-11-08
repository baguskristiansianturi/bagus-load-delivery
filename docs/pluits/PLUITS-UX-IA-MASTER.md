# PLUITS — MASTER UX / INFORMATION ARCHITECTURE
**Tanggal:** 8 November 2026  
**Status:** Design baseline derived from `MASTER/BUSINESS-MODEL-MASTER.md` sections 24–29 and CP-026/CP-029.  
**Rule:** This document translates approved business decisions into interface structure. It does not mark unbuilt backend capabilities as implemented.

## 1. Product structure — three spaces, one identity

Pluits is one platform with one human identity and three connected product spaces:

1. **Social** — feed, profiles, Stories, Reels, Explore, communities, interactions, messaging, activity, privacy and moderation.
2. **Local Marketplace** — local goods and services, merchant/provider profiles, catalog, variations, availability, cart, checkout, orders, fulfillment, refunds, disputes and transaction-based reviews.
3. **Trip** — destination and activity discovery, itinerary, visit planning, reservation/booking where applicable, availability, check-in/visit evidence and Trip Experience.

**GeoDirectory is a shared discovery and entity/location layer**, not a fourth transaction cycle. A canonical place or organization can be discovered from Social, Marketplace or Trip without duplicating its identity. A place is not automatically a merchant, and not every destination is bookable.

One human login can operate Personal, Professional and Business contexts. Organization/place roles are scoped memberships with permissions and audit history; they are not separate human accounts.

## 2. Global navigation

### Phone — primary target
Keep the five-slot bottom navigation consistent across signed-in social screens:
- **Beranda** — hybrid social feed, followed content and selected nearby discovery.
- **Jelajah** — unified Explore entry with tabs/filters for people, posts, places, businesses, products, services, communities and events.
- **Buat** — compact creation menu: post, Story, Reel/video, community item or (when authorized) business listing.
- **Tempat** — GeoDirectory map/list, nearby and area selection.
- **Profil** — personal profile and account switcher.

Activity/notifications remain reachable from a persistent top-bar inbox icon and Profile/Activity. Marketplace and Trip are first-class spaces reached through the Explore hub, contextual cards, profile modules and a clearly labeled Spaces switcher; do not overload the bottom bar. The signed-in user must be able to enter Marketplace and Trip in no more than two deliberate taps.

### Tablet / desktop
Use a persistent top or side navigation with explicit Social, Marketplace, Trip and Places destinations. Keep a readable centered feed, optional contextual rail, and multi-column workspaces for Seller/Business Center and account settings. Do not stretch the phone layout across a wide screen.

### Visitor state
Visitors can browse public Social content, public GeoDirectory entries, public merchant/provider pages and public Trip information. Actions requiring identity (follow, save, comment, claim, order, booking, post) lead to the relevant sign-in/onboarding step and preserve the intended destination.

## 3. Social screen hierarchy

- **Home:** hybrid feed with followed/friend posts as a core stream, selected local discovery, place/activity/event recommendations and contextual marketplace/trip cards. Cards must not interrupt or disguise ordinary social posts.
- **Explore:** searchable discovery with clear content types and filters; include people, posts, Reels, places, businesses, products/services, communities and events.
- **Post detail:** media/caption, author context, audience-appropriate comments and replies, like counts, share/repost attribution, save and report.
- **Stories:** 24-hour viewer/composer, audience and privacy defaults from settings.
- **Reels:** vertical video discovery with filters, playback controls and privacy-aware ranking.
- **Profile:** Personal / Professional / Business context, bio, follow state, posts/media, optional modules and public information controls.
- **Activity:** grouped social, message, commerce, trip and security notifications.
- **Composer:** choose media → compose → audience → optional place/topic/product/service association → publish. Keep default composer compact; advanced defaults live in Settings.
- **Settings hub:** identity/account switcher; privacy and content audience; interaction controls; notifications; security; blocked accounts; sessions; preferences; help and information.

## 4. Local Marketplace hierarchy

Marketplace is a separate shopping/merchant workflow, not a renamed construction catalog.

- **Marketplace home:** local discovery, categories, nearby merchants, products and services, curated collections and search.
- **Category/search results:** filters for location/distance, price, availability, provider status, delivery/pickup and relevant category attributes.
- **Merchant/provider page:** canonical entity identity, claim/verification status, public area, hours, catalog/services, reviews and contact/action.
- **Product/service detail:** accurate variants, price, availability, seller identity, fulfillment, terms and eligible reviews.
- **Cart and checkout:** server-validated price, stock/availability, address/area, fulfillment, payment and final confirmation.
- **Orders:** status, communication, proof, refund/dispute path and permanent transaction snapshot.
- **Business Center:** owner onboarding, verification, catalog, variations, stock, pricing, schedules, delivery zones, orders, staff roles, analytics and financial history.
- **Public mini-website:** stable business username/URL; public catalog and service information without exposing private address, staff, customer or financial data.

The former static/demo construction catalog has been removed. Any future Marketplace catalog data must originate from real, authorized Pluits backend records and use the universal Marketplace taxonomy. Do not seed demo products or make construction the default identity of Pluits.

## 5. Trip hierarchy

- **Trip home:** nearby destinations, activities, stays, transport, events and curated trip ideas.
- **Destination/place detail:** canonical GeoDirectory entity, visitor information, media, hours, access, related experiences and provider/booking actions only where supported.
- **Activity/provider detail:** inclusions, schedule, availability, price breakdown, provider verification and cancellation terms.
- **Itinerary:** saved places and time-ordered plans; private by default, shareable by user choice.
- **Reservation/booking:** separate booking lifecycle with request/confirmation, availability, payment state, cancellation and provider/customer communication.
- **Visit / Trip Experience:** optional check-in or evidence-based visit record; a location tag or booking alone must not be represented as proof of attendance.
- **Trip journal / Moments:** user-controlled memories by date/place, with explicit audience and export controls.

Do not reuse Marketplace cart/order statuses for restaurant reservations, accommodation, tickets or visits. Define each Trip transaction lifecycle before enabling real payments.

## 6. GeoDirectory shared layer

- Search/map/list for canonical places, organizations, providers, events and relevant entities.
- Nearby uses device coordinates only after explicit permission; fallback order: manual area, user-selected profile area, then unpersonalized browsing.
- Filters, category, distance/radius, status, open hours where reliable, and source/provenance.
- Detail page shows unclaimed/imported/claimed/verified status accurately.
- **Claim this place** starts a review process; clicking claim never grants ownership.
- One canonical entity may link to a merchant profile, Trip destination, community, event, social posts and reviews.
- Keep private user/home coordinates, exact sensitive addresses and private entity data out of public cards.
- Provide correction, duplicate report and claim dispute paths; moderation decisions require audit and appeal.

## 7. Identity and context switching

- Registration creates Personal identity.
- Personal users may create/claim a Professional profile or Business/organization page without replacing their Personal profile.
- Account switcher changes the active posting/management context; it does not log out or create another human identity.
- Posts must record the chosen context and audience.
- Business owner and staff use individual logins and scoped permissions. Sensitive owner-only operations are enforced in backend.
- Badges explain exactly what was verified; personal accounts must not appear as official providers by implication.

## 8. Cross-module design rules

- A canonical place/entity ID links social content, merchant, Trip, reviews, events and directory records.
- Public posts remain valid without a transaction or trip.
- A place tag is not proof of a visit; a booking is not proof of attendance; payment does not publish content automatically.
- Reviews and reputation claims must disclose their evidence level and eligibility.
- On-platform transaction protection applies only to flows actually processed and recorded on Pluits.
- Media preserves original aspect ratio and composition; derivatives may resize/compress but not silently crop.
- Mobile-first means touch-friendly, swipeable horizontal rails for wide collections, concise forms, clear upload progress/retry, and no horizontal page overflow.
- Tablet/desktop receive intentional layouts with the same data and permissions.
- Loading, empty, error, offline and permission-denied states are designed, not left as browser errors.

## 9. Current implementation gaps verified from repository

The following are structural gaps, not just styling issues:

1. The signed-in account shell still exposes a Social-only header/bottom bar; GeoDirectory, Marketplace and Trip are not coherently represented in the shared app navigation.
2. Historical baseline before CP-038: the public home still linked to legacy material/provider/services/logistics pages. This finding is superseded; current shortcuts now route to Social, GeoDirectory, Marketplace and Trip.
3. Historical baseline before CP-038: the router exposed legacy material/procurement routes. This finding is superseded; old demo route imports and modules have been removed and Trip routes are active.
4. `src/app/services.js` still contains in-memory catalog/search, hard-coded procurement/delivery estimates and payment placeholders. These are not production Marketplace/Trip transaction services.
5. GeoDirectory is the most advanced cross-module discovery layer, but current audit records only four starter places; admin review, broader licensed data ingestion, merchant links and Trip lifecycle integration remain incomplete.
6. Marketplace seller/catalog scaffolding exists, but the live audit says checkout is disabled; cart/wishlist are not yet fully synchronized server-side, and there is no verified payment/refund/fulfillment lifecycle.
7. Trip has product decisions but no complete route, data lifecycle or tested booking implementation.
8. Social has a useful foundation, but follow graph, messaging, moderation/report/appeal, and full Android UAT remain incomplete; public-home engagement is not equivalent to signed-in interaction capability.
9. The latest CSS-only homepage pass cannot resolve any of the information-architecture or domain-workflow gaps above.

## 10. Delivery order and acceptance gates

### UX/IA foundation
- Align shared shell, navigation, page naming and account context switching to this document.
- Preserve working Social, Seller Center and GeoDirectory features; no destructive replacement.
- Acceptance: every major destination has a coherent route, navigation state, visitor/authenticated state and mobile layout.

### Social completion
- Finish compact composer, settings defaults, media reliability, threaded comments, follow/friend semantics, activity, privacy, block/report/appeal and profile context.
- Acceptance: two real accounts, public/private cases, upload failure/retry and Android device test.

### Marketplace normalization
- Reconcile old catalog taxonomy; implement real merchant/provider context, variants, stock, server cart/checkout/order and transaction records.
- Acceptance: seller-owner/staff permissions, buyer checkout, price/stock validation, fulfillment and refund tests. No fake payment success.

### GeoDirectory integration
- Complete entity/merchant links, claims/admin review, provenance, correction and moderation.
- Acceptance: imported/unclaimed vs claimed/verified states and cross-module links verified.

### Trip foundation
- Define destination/activity/provider, itinerary, availability, reservation/booking and visit lifecycles separately.
- Build Trip UI only against real supported data and clearly label non-bookable destinations.
- Acceptance: end-to-end test for each enabled booking type, cancellation and data isolation.

### Release
- Each increment: regression, narrow Android viewport, tablet/desktop, anonymous/authenticated, RLS negative tests, storage access, build/deploy, commit and rollback recorded.
- DECIDED, DESIGNED, IMPLEMENTED, DEPLOYED, TESTED and ACCEPTED are separate states.


## 13. Alignment audit update — 8 November 2026
See docs/pluits/BUSINESS-FRONTEND-BACKEND-ALIGNMENT-AUDIT-2026-11-08.md for the code-level route/service/backend audit. The active router has been disconnected from former static/demo procurement and operations pages. Demo-only modules, data files, localStorage order state, and legacy page modules have been physically removed after route imports were disconnected. Marketplace cart is still local-only and must be migrated to server-owned state; order creation is server-validated. Trip service requests are inquiries, not confirmed bookings. Wallet is non-operational and staged. Seller staff permission enforcement remains a security gate.
