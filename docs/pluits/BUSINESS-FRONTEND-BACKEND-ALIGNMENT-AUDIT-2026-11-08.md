# PLUITS — BUSINESS / FRONTEND / BACKEND ALIGNMENT AUDIT
**Tanggal:** 8 November 2026  
**Repository:** baguskristiansianturi/pluits  
**Branch:** main  
**Supabase:** ytndswhqxayqpftszwfh  
**Scope:** dokumentasi produk, route, frontend service/data ownership, Marketplace, Trip, GeoDirectory, Seller Center, dan jalur legacy.  
**Jenis audit:** code/documentation inspection; bukan penetration test atau Android UAT.

## 1. Sumber acuan setelah konsolidasi
- Business model: MASTER/BUSINESS-MODEL-MASTER.md (satu-satunya otoritas keputusan bisnis).
- Ide: IDEAS/IDEA-BACKLOG.md.
- Delivery: MASTER/PROJECT-STATUS-ROADMAP.md.
- AI rules: MASTER/PLUITS-AI-GOVERNANCE.md.
- UX IA: docs/pluits/PLUITS-UX-IA-MASTER.md.
- Technical/security/UAT: spesifikasi backend, security review, Supabase README, dan user testing.
- Duplicate product vision and product roadmap documents have been merged and removed.

## 2. Frontend-to-backend mapping observed

| Product space | Frontend | Backend observed | Status / gap |
|---|---|---|---|
| Social | src/pages/home/index.js, src/pages/account/index.js, shared social navigation | Supabase Auth, profiles, posts/media, follows, likes/comments, notifications, messages, reports/block foundations | Banyak alur sudah terhubung, tetapi real-device UAT, moderation completeness, and some social interactions remain open in roadmap. |
| Local Marketplace | src/pages/marketplace/index.js, src/pages/seller/index.js | Public catalog views, stores/products/variants, order/payment tables and RPC lifecycle | Checkout/order flow calls backend RPC; payment is manual bank-transfer reference, not gateway. Seller/staff authorization and real seller UAT remain gates. |
| Trip | src/pages/trip/index.js | trip_itineraries, trip_itinerary_items, trip_service_requests, request/respond/cancel RPCs | Itinerary and service request foundation exists. Service request is not a confirmed reservation/paid booking. |
| GeoDirectory | src/pages/directory/index.js | Canonical entities, locations, categories, claims, memberships, preferences, activity, saved/recent | Core list/map/detail/claim and nearby foundation exists; coverage, admin review UI, cross-domain linking and UAT remain incomplete. |
| Seller Center | src/pages/seller/index.js | Store, members, catalog, delivery zones, orders, verification | Owner flow exists; granular staff permission enforcement was identified as a gap and must remain blocked until verified fixed. |

## 3. Confirmed alignment gaps

### P1 — Legacy demo procurement flow still existed in the router
Before this audit increment, src/app/router.js exposed demo material/category/product/cart/checkout/order/provider/project/driver/partner/tracking routes. Those routes depended on src/app/page-factory.js, src/app/services.js, src/app/store.js, src/data/catalog.js, and src/data/marketplace.js, which contain static/demo catalogue data, localStorage-only order state, fabricated ratings/reviews, and placeholder payment/delivery estimates. The old operations console also used sample BLD order IDs and fake rows.

**Action in this increment:** disconnected the legacy procurement/demo pages from the active router; search now calls the Supabase-backed social discovery page; legacy cart/checkout/orders routes redirect to the Pluits Marketplace routes; material aliases open the Pluits Marketplace; provider aliases open GeoDirectory. Former page files and data modules were removed after their route imports were disconnected; shared account and recent-directory behavior is retained through backend-backed Pluits pages. Do not reintroduce their demo data.

### P1 — Marketplace cart remains local-only
src/pages/marketplace/index.js stores the cart in browser localStorage (pluits_market_cart_v1). Checkout calls place_marketplace_order, and the backend revalidates item variants, price, stock, seller, minimum order and delivery rules. This protects order creation, but the cart is not yet server-side/cross-device as required by Business Model Master section 28.8. Treat local cart as a temporary draft/cache, not a canonical cart.

**Required next step:** design a user-owned server cart and merge policy for guest carts; validate stock/price at checkout; test concurrency, stale carts, logout/login, and cross-device synchronization. Do not migrate or drop local cart data until compatibility and merge behavior are specified.

### P1 — Delivery/service discovery taxonomy needs one route contract
The homepage previously linked Jasa, Penyedia and Pengiriman to legacy routes. The current increment routes Jasa/Penyedia to GeoDirectory and removes the separate standalone delivery shortcut; store delivery remains a Marketplace fulfilment option. The product model does not currently define a separate consumer logistics marketplace or live fleet booking.

### P1 — Seller staff permissions
Earlier live security audit found store write policies using membership-only checks rather than granular permission grants. Seller testing docs say staff mutations are not enabled. Do not expose/invite staff or claim granular staff access until database policies and RPCs are tested per permission.

### P2 — Frontend Supabase client consistency
Multiple modules instantiate Supabase clients directly and import @supabase/supabase-js@2 from esm.sh with a floating major version. Centralize the client and pin/bundle a reviewed version after dependency/build audit. No service-role key should ever enter the browser.

### P2 — Wallet state
Wallet is a foundation/request screen only; not a real-money wallet, payment balance, payout or withdrawal system. Settings now labels it staged rather than ready.

### P2 — Historical seller backend spec
The seller foundation spec is now explicitly labeled as a historical baseline and points to current model/status/security documents. Its requirements must be reconciled with current schema and live authorization before implementation.

## 4. Changes in this alignment increment
- Router no longer imports old demo category/product/cart/checkout/order/wishlist/provider/project/operations/tracking modules.
- Search route now mounts the Pluits discovery feed directly.
- Old #/cart, #/checkout, #/orders, #/order/:id paths redirect to Marketplace cart/checkout/orders/order.
- Material aliases route to Marketplace; provider aliases route to GeoDirectory; jasa route to GeoDirectory; logistik/delivery route to Marketplace fulfilment context.
- Homepage shortcuts no longer promote a standalone logistics product; jasa/provider links point to GeoDirectory.
- GeoDirectory navigation links use the Pluits Marketplace route.
- Wallet settings state is staged, not ready.
- Replaced the old generic shell/navigation and removed its demo catalogue/store dependency; recent-place history now reads user_recent_items and directory_entities.
- Backend foundation spec identifies Pluits and its historical status.

## 5. Physical deletion still gated
Demo-only procurement modules and localStorage order state were not a canonical business database. The modules were deleted; no real order history was migrated from demo keys.

## 6. Required next gates
1. Maintain a regression check that prevents demo-only catalog/store modules from returning to the active import graph.
2. Implement server-side Marketplace cart and guest-to-account merge.
3. Complete granular seller permission enforcement and negative authorization tests.
4. Centralize/pin Supabase JS client and standardize error handling.
5. Reconcile every active frontend screen with a backend capability and permission matrix.
6. Run build, Pages deploy, Android UAT, and two-account tests.
7. Update this report with commit, CI run, actual test results, and remaining blockers.

## 7. Verification limits
This audit inspected source and docs. It does not prove that browser flows work on Android, that a real purchase can complete, or that staff permissions are fixed. Those remain NOT TESTED / NOT VERIFIED until evidence is recorded.


## 8. Refreshed live Supabase evidence — 8 November 2026, 12:37 UTC
- Public schema contains 60 base tables and every listed table has RLS enabled.
- Read-only information_schema query returned no public base table with a cart-related name.
- Security Advisor: 20 authenticated-callable SECURITY DEFINER warnings; 1 leaked-password-protection warning.
- Performance Advisor: 84 unused-index notices (informational); Health Advisor: 0 lints.
- These counts are a timestamped snapshot. The SECURITY DEFINER notices require individual review; they are not automatically confirmed vulnerabilities.
- No database schema, permissions, Auth settings, or user data were changed in this documentation/router cleanup.


## 9. Additional repository and engineering governance findings
- GitHub repository visibility is currently PUBLIC. Source code, documentation, commit history, and browser-delivered frontend assets are publicly inspectable. No visibility change was made because GitHub Pages availability and plan constraints must be checked before any private-repository migration.
- This task did not perform a full credential/secret-scanning certification. A publishable Supabase client key is expected in a browser app; service-role/secret keys must never be committed or bundled. Run GitHub secret scanning and review the complete history before claiming the repository contains no leaked secrets.
- package.json currently has dev/build/preview scripts but no automated test or lint script. CI verifies production build output and deploy; it does not prove route behavior, authorization, checkout, media upload, or Android UX.
- src/style.css remains a large shared stylesheet with historical selectors. Legacy pages are removed from routing and source, but unused CSS cleanup should be a separate measured task to avoid breaking active layouts.


## 10. Live production hardening increment — 8 November 2026, 13:30 UTC

### Confirmed user-facing production context
Founder reports that Pluits is already published and has at least one registered account. Treat all current user records and sessions as production data. This audit did not inspect account identity, email, profile content, or private user data.

### Seller authorization — permission enforcement applied
- Applied live migration `20261108132935_enforce_store_member_permission_grants` and committed its matching SQL file.
- Owner remains fully authorized. Other active members can read their store workspace but writes to catalog/product/media require explicit `catalog.manage=true`; store settings, operating hours and delivery zones require `store.settings.manage=true`.
- Verified helper behavior with rollback-only SQL probes: owner positive, non-member negative, explicit staff catalog grant positive, absent settings grant negative. The temporary staff-role/grant change was rolled back.
- Inspected live `pg_policies`: write policies now reference `private.has_store_permission`.
- **Not yet tested:** authenticated REST/API access with separate real owner/staff accounts, Storage operations from the browser, and privileged RPC authorization. Staff invitation/grant management UI remains unavailable; do not invite staff yet.

### Demo/placeholder regression protection
- Added `scripts/verify-production-surface.mjs`.
- Added `npm test` and `npm run verify:production` scripts.
- GitHub Pages workflow now runs `npm test` before the production Vite build.
- The guard checks that retired demo procurement modules remain absent and that Marketplace catalog/order and Trip itinerary/request flows retain backend integration.
- This is a scoped regression guard, not a certification that every visible placeholder label, all historical files, secrets, or every frontend screen has been audited. The earlier legacy procurement demo modules and their fake order/review data were removed from active source/router. Empty states and form placeholders are legitimate UX text, not demo data.

### Marketplace cart — still open
- Live schema still has no canonical server-side cart tables; current `src/pages/marketplace/index.js` uses `localStorage` key `pluits_market_cart_v1`.
- Checkout calls backend `place_marketplace_order`, which revalidates the order. The browser cart itself is not synchronized across devices or account sessions.
- No local cart values were migrated or deleted. A server-cart migration still requires an explicit guest/account merge contract and stale price/stock refresh behavior.

### Current security/advisor evidence
- Security: 20 authenticated-callable SECURITY DEFINER warnings and 1 leaked-password-protection warning remain.
- Performance: 84 unused-index notices (informational; do not drop indexes without workload evidence).
- Health: 0 lints.
- Repository remains PUBLIC. No visibility change or credential rotation was performed.
- Full Android UAT, two-account API tests, end-to-end order/payment, and full secret-history scan remain NOT TESTED / NOT VERIFIED.


## 11. Permission matrix and privileged Marketplace RPC alignment — 8 November 2026, 13:33 UTC

- Applied `20261108133221_align_marketplace_rpcs_with_store_permission_grants`.
- Permission helper now implements explicit role capabilities and additional grants consistently:
  - owner: all store permissions;
  - manager: catalog, store settings, orders, and payments;
  - catalog: catalog only;
  - orders: fulfilment only;
  - accounting: payment review only;
  - staff: only explicitly granted permissions.
- Updated product publishing, order fulfilment, and payment review RPCs to use the same permission helper as RLS.
- Rollback-only SQL matrix tests passed for all listed roles and denied cross-role capabilities. No membership changes were committed.
- Remaining: test actual REST/RLS and Storage requests as distinct real accounts, add a staff invitation/grant management UI with audit trail, and complete individual review of remaining SECURITY DEFINER functions.


## 12. RLS policy shape and advisor recheck — 8 November 2026, 13:34 UTC

- Applied migration `20261108133402_split_store_permission_write_policies_by_action` and committed its SQL file.
- Write policies are now operation-specific (INSERT/UPDATE/DELETE), avoiding accidental extra SELECT policies from a permissive `FOR ALL` policy.
- Re-ran advisors: no multiple-permissive-policy warnings remain; 20 SECURITY DEFINER warnings, 1 leaked-password warning, 84 informational unused-index notices, and 0 Health lints remain.
- The 84 unused-index notices are not grounds for deletion while query traffic is low. Preserve the indexes until real workload evidence exists.


## 13. Vite starter and orphaned legacy modules removed — 8 November 2026

- Removed unused Vite counter script `src/counter.js`.
- Removed unused Vite starter assets `src/assets/vite.svg` and `src/assets/javascript.svg` after checking the active JS/CSS/HTML references.
- Removed orphaned legacy modules that were not imported by the active router or main entry: old localStorage-only `src/pages/auth/index.js` (which displayed “AKUN BAGUS” and claimed OTP/backend would be connected later), stale logistics/material/property/service wrappers pointing to deleted `page-factory.js` or missing product detail modules, and redundant promo/not-found/search wrappers.
- Confirmed the active entry and router use Pluits Auth/account, Seller Center, Marketplace, Trip, GeoDirectory, Social, messages and moderation modules; no active route imports the deleted legacy files.
- Expanded `scripts/verify-production-surface.mjs` to fail CI if these retired files return or old Bagus/BLD account/cart markers appear in key runtime files.
- This is source-level cleanup and regression protection. It does not certify every external integration or all Android behavior.
