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
