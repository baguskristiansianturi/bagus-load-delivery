# PLUITS Frontend Module Map

Read this map before editing. Existing owners are retained during incremental migration; target ownership is explicit below.

## Screen ownership
| Area | Route | Current owner | Target owner |
|---|---|---|---|
| Public Home | `#/` | `pages/home` | public shell + `features/feed` |
| Signed-in Feed | `#/account/explore` | `pages/account` | `features/feed` |
| Explore | `#/search` | `pages/search` | `features/discovery` |
| Profile/Edit | `#/account/profile*` | `pages/account` | `features/profile` |
| Inbox | `#/messages` | `pages/messages` | `features/inbox` |
| Activity | `#/account/activity` | `pages/account` | `features/notifications` |
| Media composer | account compose routes | account + `features/media` | media/posts/reels features |
| Store | marketplace routes | `pages/marketplace` | `features/store` |
| Checkout | `#/market-checkout` | marketplace controller | `features/checkout` |
| Seller | seller routes | `pages/seller` | `features/seller` |
| Directory | place routes | `pages/directory` | `features/directory` |
| Trip | trip routes | `pages/trip` | `features/trips` |

## Shared component ownership
| Component | Current owner | Rule |
|---|---|---|
| Canonical destinations | `components/social/navigation-routes.js` | All shared nav hrefs come from this registry |
| Social header + bottom nav | `components/social/navigation.js` | Compatibility renderer; split incrementally |
| SVG icon paths | `components/common/social-icons.js` | Paths only, no routing or data behavior |
| Profile hero | account controller + legacy CSS | Extract to `features/profile/profile-hero.*` |
| Inbox layout | `pages/messages/*` | Inbox owns content; shared nav remains shared |
| Media validation/upload | `features/media/*` | Pure detection vs transport separation |
| Reels | `features/reels/*` | Dedicated markup and scoped styling |
| Post actions | `features/posts/*` | Action UI and styles isolated |

## Boundaries
- Page controllers compose features; they do not redefine global navigation destinations.
- Shared navigation never queries Supabase or imports page controllers.
- Feature styles are scoped to the feature root.
- Store wishlist and social saved posts are different concepts.
- Checkout is a focused transaction shell and must not mutate social navigation.
- Preserve legacy entry points until every importer and route test has migrated.

See `docs/pluits/PLUITS-APPLICATION-ARCHITECTURE.md` and `docs/pluits/FRONTEND-MODULE-CONTRACTS.md` for full contracts.
