# PLUITS System Architecture Audit — 13 November 2026

**Repository:** `baguskristiansianturi/pluits`  
**Audited source baseline:** `main` at `4ef9fb96e8e942511879303f355a7336860c287f`  
**Backend project:** Supabase `pluits`, region `ap-southeast-1`, PostgreSQL 17  
**Audit type:** repository structure, frontend/backend boundaries, external dependencies/assets, and live backend inventory  
**Change policy:** audit only. No application source, database schema, migration history, or production deployment was changed by this audit.

## 1. Executive result

PLUITS is currently a Vite application using native JavaScript ES modules and a hash-based router. Its backend is Supabase: PostgreSQL, Auth, Row Level Security, database functions/RPC, Realtime, and Storage. There is no separate application server and no deployed Supabase Edge Function at the time of this audit.

The repository already has most conventional frontend and backend building blocks:
- `src/app`, `src/pages`, `src/features`, `src/components`, `src/services`, `src/lib`, `src/styles`, `src/assets`;
- `public/` for static files;
- `supabase/migrations/` for database changes;
- `tests/`, `scripts/`, and `.github/workflows/`.

The main structural problem is not a lack of folders. It is that responsibilities are not consistently kept inside their owners. Several page modules create their own Supabase clients and contain direct data access; the same integration is already represented by `src/lib/supabase/client.js`. A second global stylesheet directory exists outside `src`. CSS and page controllers have grown very large. Some third-party runtime dependencies are loaded directly from CDNs instead of being declared and locked in the package manifest.

**Critical backend source-of-truth issue:** the live database reports 97 migration records, while the repository contains 90 migration SQL files. 67 live migration names match repository basenames exactly; 19 of those have different timestamps. Another 30 live names have no exact basename match: 21 have candidate repository files documented in an older manifest, while 9 Blog migrations have no corresponding source file in the current repository. The repository has 23 files without an exact live-name match; 21 are candidates for those aliases and 2 remain unmatched. The older PR #3 manifest is stale and must not be used for replay. See [Security and Migration Reconciliation Audit](./PLUITS-SECURITY-AND-MIGRATION-RECONCILIATION-AUDIT-2026-11-13.md). Do not replay, rename, delete, or regenerate migrations until the mapping is verified.

## 2. Inventory measured from GitHub and Supabase

### Repository

| Item | Observed count |
|---|---:|
| Git-tracked files (blobs) | 269 |
| JavaScript / MJS / TypeScript files | 62 |
| CSS files | 24 |
| Markdown documents | 66 |
| Supabase migration SQL files | 90 |
| Archived SQL drafts | 8 |
| Automated test files | 8 |

### Live Supabase

| Item | Observed state |
|---|---|
| Project status | ACTIVE_HEALTHY |
| PostgreSQL | 17.11 |
| Public tables | 68 |
| Tables with RLS enabled | 68 of 68 |
| Public views | 3 |
| Public database functions | 32 |
| SECURITY DEFINER functions | 23 |
| Applied migration records | 97 |
| Deployed Edge Functions | 0 |
| Private Storage buckets | 3 |

The three private Storage buckets are `pluits-user-media`, `pluits-store-media`, and `pluits-message-media`. Their live bucket settings differ by media type and size limit; retain those controls as backend configuration, not frontend constants.

### Main product domains represented in the database

- Accounts and identity: `profiles`, `user_profiles`, addresses, account preferences, profile image frames and verification.
- Social: posts, post media, stories, likes, comments, saves, tags, follows, blocks, notifications and messages.
- Business and seller: stores, store members, settings, operating hours, delivery zones, categories, products, variants, images, inventory and audit logs.
- GeoDirectory: categories, entities, locations, claims, memberships, media, relationships and source records.
- Marketplace: orders, order items, payment records and order events.
- Trips: itineraries, itinerary items and service requests.
- Blog: blog profiles, posts and categories.
- Entitlements and wallet scaffolding: feature entitlements, wallet accounts and wallet requests.

A table existing in the database does not prove its feature is complete or production-ready. Wallet tables, for example, are not proof of a complete real-money payment, settlement, withdrawal and accounting system.

## 3. Correct placement using conventional names

Use the existing conventional locations below. Do not create a second parallel folder system.

| Responsibility | Correct location | What belongs there |
|---|---|---|
| HTML application entry | `index.html` | Document metadata, app mount element and entry script |
| Build configuration | repository root | `package.json`, lockfile, `vite.config.js` |
| Application bootstrap | `src/main.js` | Start the application and register app-level lifecycle; no duplicated data client |
| Routing and app-wide state | `src/app/` | Hash router, route resolution, app models and shared application UI |
| Route-level screens | `src/pages/` | Page composition, route-specific rendering and event binding |
| Domain features | `src/features/` | Feature-owned UI and feature interaction modules that can be reused by pages |
| Shared UI components | `src/components/` | Generic shared components such as brand mark, icons, buttons, fields and navigation primitives |
| Frontend data/API access | `src/services/` | Browser-side query functions, repositories, storage operations and realtime adapters |
| External SDK adapters | `src/lib/` | One configured Supabase client and thin wrappers around third-party libraries |
| Global and shared CSS | `src/styles/` | Design tokens, reset, typography, global layout and shared component styles |
| Page/feature CSS | Beside the owning page or feature | CSS that is only used by that page or feature |
| Bundled frontend assets | `src/assets/` | Images/fonts imported by modules and processed by Vite |
| Static public files | `public/` | Favicon, manifest, robots, sitemap, service worker and static public assets |
| Database source | `supabase/migrations/` | Ordered, immutable SQL schema and policy changes |
| Supabase project configuration | `supabase/` | Supabase CLI configuration and project-level backend files |
| Server-side functions | `supabase/functions/` | Only functions that genuinely need a trusted server runtime, secrets, webhooks or external server integrations |
| Automated tests | `tests/` | Unit, integration, contract and regression tests |
| Build/deployment automation | `.github/workflows/` | CI checks, build, preview and production deployment workflows |
| Developer automation | `scripts/` | Repeatable local/CI validation scripts |
| Product and engineering documentation | `docs/` | Product, architecture, operations, decisions and audit documentation |

### Existing placement decisions

1. `styles/home-layout.css` is a frontend source stylesheet imported by `src/main.js`. It belongs under `src/styles/`, beside the other application styles. Move it only in a controlled refactor that updates its import and verifies the built output.
2. `src/lib/supabase/client.js` is already the correct owner for the shared browser Supabase client. Existing page-level clients should be migrated to this one client; do not create another client file.
3. `src/services/storage/signed-urls.js` and `src/features/media/storage-upload.js` are frontend-side integrations with Supabase Storage. Keep UI presentation in the feature/page, and keep storage access in service/adapter modules.
4. `src/pages/*` should not own authentication setup, database authorization rules, or duplicate client construction. It may call frontend services; the database remains authoritative for authorization.
5. `supabase/archive/` is historical/unapplied SQL material. It is not an active migration directory and must never be run as part of normal deployment.
6. The root `MASTER/`, `SOP/`, and `IDEAS/` directories contain documentation, not application runtime code. Their eventual canonical home should be `docs/` using conventional documentation groupings. Preserve history and links during any move; do not create duplicate copies.
7. Do not introduce React, another framework, a new router, or a second design system as part of this audit. The existing implementation is Vite + native JavaScript modules.

## 4. Frontend and backend boundary

### Frontend responsibilities

The browser is responsible for:
- rendering screens and reusable UI;
- handling local interaction state and form input;
- calling Supabase through the shared client and frontend service modules;
- displaying loading, empty, error and success states;
- requesting uploads and signed media URLs;
- subscribing to allowed Realtime channels;
- client-side validation for usability, without treating it as security enforcement.

### Backend responsibilities

Supabase/PostgreSQL is responsible for:
- identity records and authentication;
- ownership, membership and permission enforcement;
- RLS policies on exposed tables;
- validation of business invariants and state transitions;
- trusted database functions/RPC for atomic operations;
- data relationships, constraints, indexes, triggers and views;
- private Storage bucket policies and object ownership;
- trusted audit records and financial integrity.

Use Edge Functions only when a real requirement needs server-side secrets, third-party webhooks, trusted outbound API calls, scheduled/long-running work, or a server-only integration. None are currently deployed, so do not add an Edge Function merely to make the architecture look more complete.

### Current boundary violations or coupling to address

- Multiple page modules instantiate their own Supabase clients despite the existing shared client module. Confirmed examples include `src/main.js`, `src/pages/account/index.js`, `src/pages/account/account-context.js`, `src/pages/home/index.js`, `src/pages/messages/index.js`, `src/pages/marketplace/index.js`, `src/pages/directory/index.js`, `src/pages/trip/index.js`, `src/pages/seller/index.js`, `src/pages/admin/moderation.js`, and `src/pages/blog-studio/index.js`.
- Query and mutation code is embedded directly in large page controllers. Gradually move data-access operations into existing `src/services/` by domain, keeping the pages as UI controllers.
- Global presence lifecycle currently starts in `src/main.js`; it is a realtime service concern and should be owned by a frontend realtime service, while bootstrap only starts/stops it.
- Authorization must not be moved into frontend services. RLS and trusted database functions remain authoritative.

## 5. External libraries, services and visual assets

The status below distinguishes a third-party runtime dependency from a visual asset. A remote URL is not part of the PLUITS local asset library.

| External item | Current use found | Current location | In PLUITS repository library? | Audit recommendation |
|---|---|---|---|---|
| Supabase JS SDK | Database/Auth/Realtime/Storage client | Imported from `https://esm.sh/@supabase/supabase-js@2` in multiple modules | No; loaded remotely | Declare a pinned package version in `package.json` and lockfile, then import through the shared client |
| tus-js-client 4.3.1 | Resumable upload path | Dynamic import from esm.sh in `src/features/media/storage-upload.js` | No; loaded remotely | Keep only if resumable upload is required; pin as a package dependency and load on demand |
| MapLibre GL JS 6.17.0 and CSS | Interactive GeoDirectory map | Loaded from unpkg in `src/pages/directory/index.js` | No; loaded remotely | Bundle a pinned version through Vite; load the map module only on map routes |
| OpenStreetMap raster tiles | Map tile imagery | `tile.openstreetmap.org` | No; external map data/service | Keep external unless a suitable tile provider/hosting plan is selected; preserve attribution and review usage policy |
| Unsplash image URLs | Hero, promotional and legacy guide imagery | `src/style.css`, `src/pages/home/index.js`, `src/pages/blog/index.js` | No; remote URLs only | Inventory each image and intended owner; replace with approved local assets when licensing/provenance is confirmed and performance testing supports it |
| Inter font family name | Font stack declaration | `src/style.css` | No bundled font file identified | Confirm actual rendered font. If consistent typography is required across devices, approve a licensed font source and decide local versus hosted delivery before adding it |

### External Unsplash images identified

- `photo-1541888946425-d81bb19240f5` — repeated legacy/global hero background in `src/style.css`.
- `photo-1518837695005-2083093ee35b` — public home hero image selected by `src/pages/home/index.js`.
- `photo-1504307651254-35680f356dfd` — static legacy guide cover.
- `photo-1601584115197-04ecc0da31d8` — static legacy guide cover.
- `photo-1505693416388-ac5ce068fe85` — static legacy guide cover.

The three static guide images are referenced by `src/pages/blog/index.js`, whose current copy includes legacy “Bali Bagus” and construction-guide content. Confirm whether that page is still an intended PLUITS route before investing in those images.

### Assets already stored in the repository

| Local asset | Location | Library status |
|---|---|---|
| PLUITS logo SVG | `public/assets/brand/pluits-logo.svg` | Local repository asset; brand-owned source is present |
| Favicon SVG | `public/favicon.svg` | Local repository asset; inspect for duplication with the logo before changing |
| SVG icon sprite | `public/icons.svg` | Local repository asset; symbol-to-consumer registry is incomplete |
| Hero image | `src/assets/hero.png` | Local repository asset; source/license and current usage still need verification |

These files exist locally, but that does not mean every asset is fully registered in a curated asset library. In particular, `hero.png` still needs source, license and consumer verification. No external image listed above has been copied into the repository as part of this audit.

### Asset and performance decision rule

- Prefer a local, approved asset when it is stable brand/UI artwork and local delivery produces a predictable render without a third-party request.
- Prefer a third-party service when the content is inherently live or dynamic (for example map tiles), or when its optimized delivery clearly outweighs the extra network dependency.
- For photos, evaluate actual file size, dimensions, format, cache headers, responsive variants, lazy loading and Largest Contentful Paint before choosing local versus CDN delivery.
- For JavaScript/CSS libraries, prefer pinned dependencies in the lockfile and Vite bundling over unpinned or remotely loaded modules.
- Do not download, vendor, replace or install any external asset until its source, license, version, format and user approval are recorded.
- Performance has not yet been benchmarked in this audit. No claim is made that a local or external option is faster without measurement on the deployed mobile experience.

## 6. Design system and component ownership

Existing design-related locations:
- `src/components/common/icons.js`
- `src/components/common/social-icons.js`
- `src/components/common/brand.js`
- `public/icons.svg`
- `src/styles/brand.css`
- `src/styles/social-components.css`
- `src/styles/social-navigation.css`
- `src/style.css`
- page and feature stylesheets beside their owners.

Findings:
- Icon artwork is spread across multiple JavaScript files and an SVG sprite. Similar semantic names (including heart, search, cart, user, location, menu, truck, arrow and check) occur in more than one source; identical names do not guarantee identical paths or visual output.
- `src/style.css` is approximately 286 KB and contains legacy and broad page styles, including repeated remote hero backgrounds. It is not yet a clean token/base stylesheet.
- `src/pages/account/user-account.css` is approximately 187 KB and `src/pages/account/circle-experience.css` approximately 54 KB. These are large page-level stylesheets and require selector ownership and dependency mapping before extraction.
- `styles/home-layout.css` is approximately 27 KB and is outside the normal Vite source tree despite being imported by the app.
- Existing CSS is not yet a single source of truth for every runtime component. Values declared in root CSS must be treated as observed source declarations until their rendered use is measured.

Required next audit output: map each visual asset and icon to its actual consumers; map each token and component to its owning source; record page/feature variants; identify duplicate selectors and styles that leak between pages. Do not normalize visual differences during this baseline inventory.

## 7. Application routes and frontend modules

The app shell is `index.html`; `src/main.js` bootstraps it; `src/app/router.js` dispatches hash routes and dynamically imports page modules. This is a single-page application, not a collection of independent HTML pages.

Major current page/feature owners include:
- public home and feed: `src/pages/home/` and `src/features/public-home/`;
- account, profile and settings: `src/pages/account/`;
- Inbox: `src/pages/messages/` and `src/features/inbox/`;
- Marketplace/storefront/cart/checkout/orders: `src/pages/marketplace/`;
- GeoDirectory: `src/pages/directory/` and `src/features/discovery/`;
- Trip: `src/pages/trip/`;
- Seller Center: `src/pages/seller/` and `src/features/seller/`;
- Blog and Blog Studio: `src/pages/blog/` and `src/pages/blog-studio/`;
- Help/legal: `src/pages/help/`;
- moderation: `src/pages/admin/`;
- app download: `src/features/app-download/`.

Some route aliases intentionally point to the same canonical page. Keep the router and page-route registry aligned; do not create duplicate routes or page modules for aliases.

Large modules such as `src/pages/account/index.js` (~170 KB) and `src/pages/marketplace/index.js` (~25 KB) should be decomposed by existing domain ownership, not split mechanically by file size. First map render functions, bind functions, queries, state, CSS and consumers.

## 8. Build, test and deployment

- Build tool: Vite 8.
- Runtime source format: native JavaScript ES modules.
- Package manifest currently lists Vite as the only dependency/devDependency; the remotely loaded SDKs are therefore not represented as pinned npm dependencies.
- Automated tests: 8 files using Node's test runner.
- `npm test` runs production-surface verification and the Node tests.
- GitHub Pages deployment workflow: `.github/workflows/deploy.yml`.
- Production deployment is triggered by pushes to `main` or manual workflow dispatch.
- No branch-preview deployment workflow was found in `.github/workflows/`.
- Vite base path is `/pluits/`; HTML metadata and public asset paths also refer to that Pages path.
- Service worker is `public/sw.js`; its cache lifecycle and scope should be included in any asset/deployment refactor.

A branch build is not a hosted preview. Do not tell the owner a full-site preview exists until a preview workflow and exact URL have been successfully verified.

## 9. Live backend advisory findings — 13 November 2026

### Security

- 22 public `SECURITY DEFINER` functions are reported as callable by the authenticated role.
- Leaked-password protection is disabled.
- The 22-function advisor notice is not by itself proof of an exploitable vulnerability. Each function must be reviewed for its body, explicit caller authorization, fixed `search_path`, grants and intended public API surface. The audit did observe two functions (`create_store` and `update_store_profile`) configured with an empty search path; verify their fully qualified object references and execution grants.
- Do not indiscriminately revoke all RPCs: several are deliberate user actions (such as creating a store, placing an order, blocking a user or starting a conversation). Review by function purpose and privilege boundary.

### Performance

- 1 unindexed foreign key finding.
- 2 RLS initialization-plan warnings.
- 86 unused-index notices.
- 2 multiple-permissive-policy warnings.

Unused-index notices are informational and must be evaluated against real workload and query plans; do not drop indexes simply because current usage counters are zero. Review the RLS and policy warnings individually.

## 10. Audit findings and priority

| Priority | Finding | Why it matters | Required next action |
|---|---|---|---|
| P0 | Repository migration history does not line up exactly with 97 live applied migrations | Future schema deployments could be unsafe or unreproducible | Build a migration reconciliation map; recover missing applied SQL from trusted history/source before any DDL |
| P1 | Multiple independent Supabase clients | Session/realtime state can diverge and configuration is duplicated | Standardize imports on the existing shared client |
| P1 | External SDKs loaded directly from CDNs and not pinned in package manifest | Runtime availability, version control and render behavior depend on third parties | Pin compatible dependencies and bundle with Vite |
| P1 | Direct database access in large page controllers | UI, data access and domain rules are tightly coupled | Extract frontend data-access functions into existing `src/services/` by domain |
| P1 | 22 callable SECURITY DEFINER RPC warnings and leaked-password protection disabled | Requires a deliberate security review | Review grants/body/search_path for each function; configure Auth password protection after owner review |
| P1 | CSS ownership is fragmented and global CSS is very large | Inconsistent visuals, regressions and unnecessary CSS loading risk | Map selectors and imports before any stylesheet migration |
| P2 | Root-level `styles/` duplicates `src/styles/` | Source ownership and build conventions are unclear | Move the imported home layout stylesheet into `src/styles/` in an isolated refactor |
| P2 | Icon sources overlap and consumers are not fully mapped | Same semantic icon can render differently across pages | Inventory symbols, paths, variants, sizes and consumers |
| P2 | Local asset provenance is incomplete; remote imagery is unregistered | Licensing, reuse and performance cannot be decided reliably | Complete asset inventory and approval/provenance records |
| P2 | Only 8 automated test files | Shared UI, route and backend contract coverage may be incomplete | Map test coverage to route and domain inventory |
| P2 | No hosted branch preview workflow | Owner cannot review all routes on a separate URL before production | Design a safe full-site preview process and isolate test data/backend |

## 11. Recommended audit and remediation sequence

No production code or database changes should be made until the relevant audit stage is complete and reviewed.

1. **Migration reconciliation:** compare every live migration version to repository SQL, identify renamed timestamps, recover missing Blog migration source, verify schema state and document the canonical migration history. No migrations are to be applied during this step.
2. **Frontend dependency and client inventory:** map every Supabase client, SDK import, remote script, CSS URL and external image; select pinned versions only after compatibility review.
3. **Route and page ownership audit:** verify each canonical route, aliases, page renderers, event binders, feature imports, loading/empty/error states and page CSS.
4. **Component, icon and design-token audit:** capture current baseline as-is; map asset IDs, sizes, colors, variants, consumers and exact ownership.
5. **Frontend service boundary audit:** map each direct table/RPC/storage/realtime call to the page/feature and intended service owner; keep authorization and invariants in the backend.
6. **Backend security and performance audit:** review RLS, grants, all 22 advisor-listed RPCs, storage policies, indexes and query plans.
7. **Asset provenance and performance audit:** establish local-library status, source/license/version, file sizes, image formats, caching and mobile render metrics.
8. **Preview and test audit:** establish route-wide preview, test-data isolation, automated regression coverage and mobile/desktop UAT.

## 12. Audit limits

This report is a repository-wide structural inventory plus live Supabase metadata/advisor inspection. It is not yet a complete pixel-level runtime audit of every page at every breakpoint, a full line-by-line review of all 90 migration files, a formal penetration test, or a measured performance benchmark. Those are explicit follow-up audit tasks. No missing detail has been guessed or presented as verified.

## 13. Change safety

- Production branch `main` was read as the application baseline.
- The audit did not edit frontend source, database schema, policies, storage settings or production data.
- Do not merge the audit branch or deploy production as part of this audit without explicit approval.
- Any future source move must preserve the existing behavior and be verified with tests, build and route-wide preview.


## 14. Deep audit addendum — 13 November 2026

A read-only follow-up reviewed the live RLS definitions, the 22 public SECURITY DEFINER function bodies callable by authenticated users, private helper functions, Storage policies, the current migration-history comparison, and the frontend Supabase client/import graph.

### Confirmed security findings

1. Four `directory_media` policies contain the self-comparison `m.entity_id = m.entity_id`. This fails to bind membership to the media row's entity and creates cross-entity read/write/delete exposure. The repository migration source contains the same unqualified reference and needs a corrected forward migration after migration history is reconciled.
2. Public and authenticated non-member read branches for `products` and `product_variants` do not require `stores.online_sales_enabled = true`, although the public marketplace view and product-image policy do. Direct table reads can therefore expose products/variants from stores that have disabled online sales.
3. Live `user_post_directory_entities_public_read` does not filter the parent post to public visibility and published moderation status. The repository migration source includes a visibility check, so live/source drift also needs reconciliation.
4. `private.get_user_profile_directory_by_ids` allows a reverse-follow relationship to expose fields of a private profile, while `private.get_user_profile_directory` requires the viewer to be an accepted follower. Product privacy semantics need confirmation.

Detailed policy names, observed impact, recommended tests and priorities are recorded in [PLUITS Security and Migration Reconciliation Audit](./PLUITS-SECURITY-AND-MIGRATION-RECONCILIATION-AUDIT-2026-11-13.md).

### Additional frontend findings

- 11 page/bootstrap modules still create independent Supabase clients despite the shared client module.
- `src/pages/search/discovery.js` already uses the shared client; `src/pages/account/account-context.js` has an unused Supabase SDK import.
- Domain-level data services are not yet consistently separated from page controllers.
- The source tree has 62 JS/MJS/TS files, 24 CSS files (759,742 raw bytes), 8 test files and 90 migration files.
- `public/icons.svg`, `src/components/common/icons.js`, and `src/assets/hero.png` have no references in the inspected JS/TS/HTML source; do not delete them until the complete runtime/asset registry is approved.
- Static Top Ten demo entries do not carry a visible DEMO label; legacy Blog content still names “Bali Bagus Editorial”.
- The only workflow on `main` is the GitHub Pages deployment workflow. It runs tests and build before deployment but does not provide a separate branch preview environment.

### Validation status

This addendum does not claim a full runtime, browser, pixel, Android, performance or penetration test. No production database change, source-code change, PR merge, Pages deployment, test run or build was performed. Remaining validation gates are listed in §7 of the Security and Migration Reconciliation Audit.
