# PLUITS Frontend Module Map

Read before editing. Existing owners remain during incremental migration; target ownership is explicit.

| Area | Route | Current owner | Target owner |
|---|---|---|---|
| Public Home | `#/` | `pages/home` | public shell + `features/feed` |
| Signed-in Feed | `#/account/explore` | `pages/account` | `features/feed` |
| Explore | `#/search` | `pages/search` | `features/discovery` |
| Profile/Edit | `#/account/profile*` | `pages/account` | `features/profile` |
| Inbox | `#/messages` | `pages/messages` | `features/inbox` |
| Activity | `#/account/activity` | `pages/account` | `features/notifications` |
| Media composer | account compose routes | account + media | media/posts/reels features |
| Store | marketplace routes | `pages/marketplace` | `features/store` |
| Checkout | `#/market-checkout` | marketplace controller | `features/checkout` |
| Seller | seller routes | `pages/seller` | `features/seller` |
| Directory | place routes | `pages/directory` | `features/directory` |
| Trip | trip routes | `pages/trip` | `features/trips` |

## Shared ownership
- Canonical destinations: `components/social/navigation-routes.js`; all shared nav hrefs use this registry.
- Social header + bottom nav: `components/social/navigation.js`; compatibility renderer to split incrementally.
- SVG icon paths: `components/common/social-icons.js`; paths only, no route/data behavior.
- Profile hero: account controller + legacy CSS; target `features/profile/profile-hero.*`.
- Inbox layout: `pages/messages/*`; Inbox owns content, shared nav stays shared.
- Media validation/upload: `features/media/*`; pure detection separated from transport.
- Reels: `features/reels/*`; dedicated markup and scoped styling.
- Post actions: `features/posts/*`; action UI and styles isolated.

## Boundaries
- Page controllers compose features; they do not redefine global destinations.
- Shared navigation never queries Supabase or imports page controllers.
- Feature styles are scoped to feature roots.
- Store wishlist and social saved posts are different concepts.
- Checkout is focused transaction shell and must not mutate social navigation.
- Preserve legacy entry points until every importer and route test migrates.

See `docs/pluits/PLUITS-APPLICATION-ARCHITECTURE.md` and `docs/pluits/FRONTEND-MODULE-CONTRACTS.md`.

## Page/component ownership audit — 12 November 2026

See [PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md](./PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md) for the complete route-to-page inventory, layout/sidebar ownership matrix, target folder convention, change-scope contract and incremental migration order.

Current concrete extractions:
- Seller Center / Brand workspace navigation: `src/features/seller/seller-navigation.js`. Seller page owns data/state and binds the returned `data-tab` controls.
- Inbox conversation sidebar: `src/features/inbox/inbox-sidebar.js`. Messages page owns conversation data/state and binds `data-inbox-tab`.
- Social global navigation remains `src/components/social/navigation.js`; do not duplicate it inside page workspaces.

Important: this is an incremental migration. Account, Marketplace, Trip, Seller Center and Inbox controllers still contain substantial page-level composition/behavior. A folder existing does not mean that page is fully modular. Follow the audit's migration order and do not mass-move files.

## Public homepage composition — 12 November 2026

`src/features/public-home/layout.js` is the page-owned composition layer. `src/pages/home/index.js` owns route/auth/data behavior only. See `src/features/public-home/README.md` and `docs/pluits/PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md` for the component ownership table. Public navbar/search behavior must not leak into Marketplace, Trip, Directory or signed-in social workspaces.

## Canonical module scaffolding — 13 November 2026

The following folders now exist as tracked architecture scaffolding. A README in these folders records target ownership; it does **not** claim that a runtime feature has been implemented.

| Module/folder | Current status | Current runtime owner |
|---|---|---|
| `src/config/` | Reserved; extraction not started | Existing route/config owners |
| `src/design-system/` | Reserved; existing styles remain authoritative | `src/styles/`, `src/style.css` |
| `src/platform/` | Reserved; browser adapters not extracted | Existing browser-facing owners |
| `src/components/layout/` | Planned shared layout primitives | Existing page/workspace shells |
| `src/components/feedback/` | Planned loading/empty/error/toast components | Existing page and feature states |
| `src/components/primitives/` | Planned reusable controls | `components/common/` and feature-local controls |
| `src/services/auth/` | Planned auth/session services | `features/auth/`, `app/`, page controllers |
| `src/services/realtime/` | Planned subscription lifecycle | `main.js`, `pages/messages/`, `pages/account/` |
| `src/services/offline/` | Planned local persistence/outbox | `pages/messages/`, `pages/blog-studio/` |
| `src/services/repositories/` | Planned domain data-access modules | Existing page controllers |
| `src/services/storage/` | Implemented signed URL/storage helpers | `services/storage/`
| `src/features/feed/` | Planned extraction | `pages/home`, `pages/account`, `features/public-home` |
| `src/features/notifications/` | Planned extraction | `pages/account` |
| `src/features/store/` | Planned extraction | `pages/marketplace` |
| `src/features/checkout/` | Planned extraction | `pages/marketplace` |
| `src/features/directory/` | Planned extraction | `pages/directory` |
| `src/features/trips/` | Planned extraction | `pages/trip` |

The enforcement gate is `npm run verify:module-boundaries`, included in `npm test`. It blocks upward imports from shared components/services/library adapters, private direct cross-feature imports, and new Supabase client instances outside `src/lib/supabase/client.js`. Eleven runtime client instances now use that singleton. Data access remains in some page controllers and is the next incremental service-extraction task. Existing runtime files remain in place until each extraction is covered by route and behavior tests.
