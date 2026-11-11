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
