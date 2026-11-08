# PLUITS — PRODUCT ROADMAP & DELIVERY GATES
Version: 1.0 | 2026-11-08
Companion: docs/pluits/MASTER-PRODUCT-VISION.md

## Delivery rule
This roadmap is additive. It does not authorize overwriting existing features, schemas, data, or design decisions. First inventory what exists; mark each item as working, partial, broken, missing, or not applicable. Implement in small, reversible increments with tests.

## Phase 0 — Repository and product baseline (first)
- Identify actual application repository, hosting target, Supabase project and environments.
- Inventory routes, components, dependencies, build/deploy workflow and current release.
- Inventory Supabase tables, RLS policies, functions, buckets, triggers and auth settings.
- Capture mobile screenshots and test critical flows on narrow Android viewport.
- Record known bugs and current feature status.
Exit gate: documented baseline, no secrets exposed, backups/rollback plan identified.

## Phase 1 — Social foundation (highest priority)
- Mobile navigation and home feed.
- Profiles and account settings.
- Compact post composer and drafts.
- Photo/video upload reliability, progress/retry and media integrity.
- Feed post cards, carousel behavior, correct image/video ratio.
- Likes/reactions, comments/replies, share/repost attribution, save.
- Follow/friend behavior and notifications.
- Post-level audience and comment controls.
Exit gate: real-user flows work on mobile; media is not destructively cropped; authorization verified.

## Phase 2 — Trust, safety and account security
- Auth verification, recovery and optional MFA.
- Session/device visibility and revocation.
- RLS audit and negative permission tests for all exposed tables.
- Private storage policies and signed URL lifecycle.
- Block/restrict/report/appeal/moderation.
- Rate limits, anti-spam and audit events.
Exit gate: no critical/high authorization or privacy findings; moderation and recovery tested.

## Phase 3 — Social depth and discovery
- Stories and short video feed.
- Explore and unified search.
- Communities and group roles.
- Direct messaging and group conversations.
- Collaborative posts, polls and Q&A.
- Around You with opt-in location controls.
Exit gate: discovery respects privacy and ranking controls; messaging/reporting safeguards operate.

## Phase 4 — Marketplace integration
- Preserve current marketplace and store-owner model.
- Verified business profiles and scoped staff roles.
- Social product/service links.
- Catalog, cart, checkout, order status and customer support.
- Reviews tied to eligible completed transactions.
- Payment/refund reconciliation and fraud controls.
Exit gate: end-to-end order test; price and order state validated server-side; seller permissions tested.

## Phase 5 — Travel ecosystem
- Moments and travel journal.
- Destinations, activities, stays, rental and transport provider listings.
- Shared itineraries and booking flow.
- Availability, price breakdown, cancellation and provider verification.
- Reviews linked to completed bookings.
Exit gate: end-to-end booking and cancellation tests; provider and customer data isolation verified.

## Phase 6 — Intelligence and scale
- User-controlled recommendation system.
- Trust signals based on verifiable evidence.
- Memories recap and export.
- Performance optimization, caching, media delivery and observability.
- Localization and accessibility improvements.
Exit gate: measurable improvement without degrading safety, performance or user control.

## Release checklist (every phase)
- [ ] Existing feature regression test
- [ ] Mobile viewport and touch-target test
- [ ] Authenticated and anonymous behavior test
- [ ] RLS positive and negative tests
- [ ] Storage access test
- [ ] Upload failure/retry test where applicable
- [ ] Loading, empty, error and offline states
- [ ] Accessibility and contrast review
- [ ] No secrets or private test data in public repository
- [ ] Build/deploy result recorded
- [ ] Commit SHA and rollback path recorded

## Current status
No implementation status is asserted by this planning document. Repository and application audit must be completed before marking any phase item done.
