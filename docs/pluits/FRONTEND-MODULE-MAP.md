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

## Canonical module structure — 13 November 2026

All planned folders are tracked with a README so Git records the directory. A README-only folder is a roadmap marker, not an implemented feature or route. Existing runtime files remain with their current owner until a tested extraction is completed.

### Frontend layers

| Layer | Canonical location | Responsibility | Current state |
|---|---|---|---|
| App | `src/app/` | Bootstrap, router, guards, app lifecycle | Active |
| Configuration | `src/config/` | Environment parsing and non-secret flags | Scaffolded; current sources must be consolidated before moving |
| Pages | `src/pages/` | Route-level screen composition; one controller per canonical route | Active; some controllers still contain feature/data logic |
| Features | `src/features/` | User-facing capability, state, sections and scoped styles | Mixed: active and planned modules |
| Shared components | `src/components/` | Reusable accessible UI; no domain data fetching | Active and scaffolded |
| Design system | `src/design-system/` | Tokens, typography, icons, motion | Scaffolded; current CSS remains authoritative |
| Services | `src/services/` | Repositories, Auth, Storage, Realtime, cache and offline operations | Storage active; other domain services planned |
| Library adapters | `src/lib/` | SDK initialization and low-level wrappers | Active; one shared Supabase client |
| Platform adapters | `src/platform/` | Browser APIs and future native bridges | Scaffolded; no native runtime |
| Global styles/assets | `src/styles/`, `src/assets/`, `public/` | Global CSS, bundled assets and static public files | Active |

### Feature ownership

| Feature | Current runtime owner | Target module | Status |
|---|---|---|---|
| Authentication | `features/auth`, Account page | `features/auth` + `services/auth` | Partially implemented |
| Public Home | `features/public-home`, Home page | `features/public-home` | Implemented composition; legacy CSS remains |
| Feed | Home and Account pages | `features/feed` | Planned extraction |
| Posts | Account page; post actions extracted | `features/posts` | Partially implemented |
| Stories | Account/feed owners | `features/stories` | Planned extraction |
| Reels | Reel card/style extracted; page owns flows | `features/reels` | Partially implemented |
| Media | Media feature + storage helper | `features/media`, `services/storage` | Partially implemented |
| Profile | Account page; hero/image framing extracted | `features/profile` | Partially implemented |
| Inbox | Messages page; sidebar extracted | `features/inbox` | Partially implemented |
| Notifications | Account page | `features/notifications` | Planned extraction |
| Discovery | Search and public-home owners | `features/discovery` | Partially implemented |
| GeoDirectory | Directory page | `features/directory` | Planned extraction |
| Store/catalog | Marketplace page | `features/store/{catalog,storefront,product,wishlist}` | Planned extraction |
| Cart | Marketplace page | `features/cart` | Planned extraction |
| Checkout | Marketplace page | `features/checkout` | Planned extraction |
| Orders | Marketplace page | `features/orders` | Planned extraction |
| Seller Center | Seller page; navigation extracted | `features/seller/{dashboard,store-switcher,products,categories,inventory,delivery,store-profile,settings}` | Partially implemented |
| Trip | Trip page | `features/trips/{itinerary,destinations,service-requests}` | Planned extraction |
| Account Settings | Account page | `features/account-settings` | Planned extraction |
| Moderation | Admin page | `features/moderation` | Planned extraction |
| App Download | Feature module | `features/app-download` | Implemented |

### Services and platform modules

| Module | Target ownership | Status |
|---|---|---|
| `services/auth` | Session, recovery and identity operations | Planned extraction |
| `services/repositories/{accounts,social,messaging,notifications,directory,marketplace,seller,trips,blog}` | Domain data access; no HTML/DOM | Planned extraction |
| `services/realtime/{presence,messages,notifications}` | Subscription lifecycle and cleanup | Planned extraction |
| `services/storage` | Signed URLs and Storage operations | Implemented helpers |
| `services/offline/{outbox,cache}` | Per-user queue, cache and retry | Planned extraction |
| `design-system/{tokens,typography,icons,motion}` | Visual foundations | Planned extraction; current styles remain source of truth |
| `platform/{browser,native}` | Browser adapters and future native bridge | Planned; native runtime not installed |

### Page and route rule

Page folders correspond to canonical route ownership, not every tab or UI state. Marketplace subflows remain route states owned by `pages/marketplace` until safely extracted into features. `pages/inbox-personal` and `pages/inbox-toko` remain reserved planning folders; no new route is registered for them. Aliases never create duplicate page controllers.

### Enforcement

`npm run verify:module-boundaries` is included in `npm test`. It blocks upward imports from shared lower-level modules, private direct cross-feature imports and independent Supabase client construction outside `src/lib/supabase/client.js`. Eleven runtime modules now use that singleton. Data-access extraction from page controllers remains incremental and must include consumer/route tests.
