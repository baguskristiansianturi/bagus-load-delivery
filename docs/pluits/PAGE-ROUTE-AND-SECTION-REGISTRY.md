# PLUITS Page, Route and Section Registry

Status: Initial inventory from repository branch `main`; update whenever routes/pages change.  
Audit basis: `src/app/router.js`, `src/components/social/navigation-routes.js`, `src/pages/**` and current source tree.

## 1. How to read this registry

- **Implemented** means a route handler and current page/module owner exist in source.
- **Alias** means an alternate URL redirects to or renders the same canonical page. It is not a second page.
- **Partial / dynamic** means the route uses a shared controller or only some states are implemented.
- **Reserved placeholder** means a folder exists for future ownership, but no route or functional page is registered.
- A route name is not proof that every user journey on that page is complete.

## 2. Current page and route inventory

| Page / area | Canonical route(s) | Current code owner | Current status / notes |
|---|---|---|---|
| Public Beranda | `#/` | `src/pages/home/index.js` | Implemented public feed shell; uses shared social navigation |
| Beranda aliases | `#/home`, `#/feed`, `#/beranda` | `src/main.js` normalizes to `#/` | Alias, not duplicate pages |
| Signed-in Beranda / Feed | `#/account/explore` | `src/pages/account/index.js` | Implemented inside account controller; target feature owner is feed |
| Profil pengguna by username | `#/@username` | `src/pages/account/index.js` | Dynamic profile route |
| Account pages/states | `#/account/*` | `src/pages/account/index.js` | Shared controller; exact states depend on route arguments |
| Login / Register | `#/login`, `#/register`, plus account aliases | `src/pages/account/index.js` | Shared account/auth controller; inspect before splitting |
| Account settings | `#/account/settings` | `src/pages/account/index.js` | Implemented route state |
| Edit profile | `#/account/profile/edit` | `src/pages/account/index.js` | Implemented route state; not a separate HTML document |
| Followers / Saved / Reels / Activity / Create | `#/account/followers`, `#/account/saved`, `#/account/reels`, `#/account/activity`, `#/account/create` | `src/pages/account/index.js` plus feature modules | Route states; inspect individual completeness |
| Inbox | `#/inbox` | `src/pages/messages/index.js` | Current inbox implementation |
| Legacy Inbox URL | `#/messages` | Router redirects to `#/inbox` | Alias, not duplicate page |
| Inbox settings | `#/inbox/settings` | `src/pages/messages/settings.js` | Separate settings page state |
| Jelajah / Search | `#/search?q=...` | `src/pages/search/discovery.js` | Implemented route |
| Directory | `#/places` | `src/pages/directory/index.js` | Implemented directory page |
| Place detail / claim | `#/place/:slug`, `#/place/:slug/claim` | `src/pages/directory/index.js` | Dynamic route states |
| Marketplace | `#/marketplace` | `src/pages/marketplace/index.js` | Implemented route |
| Storefront | `#/shop/:slug` | `src/pages/marketplace/index.js` | Store state within marketplace controller |
| Product detail | `#/market-product/:id` | `src/pages/marketplace/index.js` | Product detail state |
| Cart | `#/market-cart` | `src/pages/marketplace/index.js` | Implemented route |
| Checkout | `#/market-checkout` | `src/pages/marketplace/index.js` | Implemented route |
| Orders / Order detail | `#/market-orders`, `#/market-order/:id` | `src/pages/marketplace/index.js` | Implemented route states |
| Marketplace aliases | `#/cart`, `#/checkout`, `#/orders`, `#/order/:id`, `#/materials`, `#/material`, `#/logistik`, `#/delivery` | Router redirects or maps to marketplace | Alias, not duplicate pages |
| Provider aliases | `#/provider`, `#/suppliers`, `#/jasa` | `src/pages/directory/index.js` | Alias to directory |
| Trip | `#/trip` | `src/pages/trip/index.js` | Implemented route |
| Trip itinerary | `#/trip/itinerary/:id` | `src/pages/trip/index.js` | Dynamic route state |
| Seller Center | `#/seller` | `src/pages/seller/index.js` | Implemented route shell; feature completeness requires separate UAT |
| Admin moderation | `#/admin/moderation` | `src/pages/admin/moderation.js` | Implemented route |
| Blog / Guides / Article | `#/blog`, `#/guides`, `#/article/:slug` | `src/pages/blog/index.js` | Shared blog controller |
| Help / FAQ | `#/help`, `#/faq` | `src/pages/help/index.js` | Shared help controller |
| Legal pages | `#/terms`, `#/privacy`, `#/guidelines` | `src/pages/help/index.js` | Shared legal-page controller |
| Misc information | `#/promo`, `#/about`, `#/contact`, `#/reviews`, `#/recent` | `src/pages/misc/index.js` | Shared miscellaneous page controller |

## 3. Known route aliases and duplicate prevention

These are known aliases from the router and must not be created as duplicate page modules:
- `#/home`, `#/feed`, `#/beranda` → public home `#/`.
- `#/messages` → Inbox `#/inbox`.
- `#/cart` → `#/market-cart`.
- `#/checkout` → `#/market-checkout`.
- `#/orders` → `#/market-orders`.
- `#/order/:id` → `#/market-order/:id`.
- `#/materials`, `#/material`, `#/logistik`, `#/delivery` → Marketplace.
- `#/provider`, `#/suppliers`, `#/jasa` → Directory.
- `#/faq` → Help page.

Before adding a page, search this registry and the router for an existing canonical route or alias. Add a redirect/alias only when backward compatibility is needed.

## 4. Page anatomy registry — first pass

The following is a structural checklist to complete by inspecting rendered pages and their source. It is not a claim that every listed section is currently implemented.

### Public Beranda — `src/pages/home/index.js`
Known composition in source:
- Social header.
- Main social layout.
- Left sidebar navigation.
- Feed introduction and story shortcuts.
- Nearby/directory section.
- Public feed container.
- Right-side discovery cards.
- Social footer.
- Social mobile navigation.

### Signed-in Feed — `src/pages/account/index.js`
Current owner: account controller. Target feature: `features/feed`.
- Feed page shell and header/navigation context.
- Feed filters and story/post areas (verify current markup before editing).
- Post card and post-action features where imported.
- Loading, empty, error and signed-in states (verify actual implementation).

### Inbox — `src/pages/messages/index.js`
Current owner: messages page module; stylesheet: `src/pages/messages/messages.css`.
- Header and page controls.
- Search / conversation filtering.
- Inbox tabs and request/block states where present.
- Conversation list and conversation items.
- Active conversation/message panel and composer where present.
- Shared mobile navigation.
Exact section selectors and component boundaries must be confirmed from the current source before a targeted edit.

### Marketplace — `src/pages/marketplace/index.js`
- Marketplace/catalog page.
- Storefront state.
- Product detail state.
- Cart state.
- Checkout state.
- Orders and order-detail states.
These are route states currently owned by one page module; they are not automatically separate folders/pages today.

### Profile — `src/pages/account/index.js`
- Profile header/hero.
- Profile identity and actions.
- Profile tabs/content.
- Profile edit states.
The profile hero has an isolated feature stylesheet at `src/features/profile/profile-hero.css`; other profile responsibilities remain partly in account controller/CSS.

## 5. Missing, planned and reserved page areas

Do not invent routes or add navigation links for a page that has not been approved. A reserved folder is a planning marker only.

| Page area | Current state | Preparation |
|---|---|---|
| Inbox Personal | Current Inbox implementation is `#/inbox` in `pages/messages`; ownership is not yet split into a dedicated page folder | Reserved directory added; do not register a second route until migration is planned |
| Inbox Toko | No separate route/page module confirmed in current router | Reserved directory added; empty, not routed |
| Notifications as a dedicated page | Activity currently belongs to account controller; Inbox context changes navigation slot | Do not create a second page until route and ownership are agreed |
| Other future pages | Not inferred from business/product documents in this registry | Add only after explicit route/page decision |

## 6. Page folder readiness rule

A page folder may start with a README only. Before it becomes active, it must declare:
- canonical route and route owner;
- page purpose and workspace/layout;
- section/component list;
- public entry point;
- stylesheet namespace and JS binding entry point;
- services/API contracts;
- loading/empty/error/permission states;
- responsive and accessibility expectations;
- tests and migration/alias plan.

An empty placeholder must not be imported by the router and must not display a fake functional page.

## 7. Updating this registry

Update this file in the same change that adds/removes/renames a canonical route or moves page ownership. Record aliases separately. Never label an alias as a second page. Mark page completeness separately from route existence.


## 7. Page/component ownership standard
The route inventory above must be read together with [PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md](./PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md). The audit defines the page layout, sidebar and feature ownership boundaries, plus the required process for adding a new page. A route alias must never receive a duplicate page controller.


## 8. Page directory and roadmap scaffold

The physical page-folder roadmap is tracked in [`src/pages/README.md`](../../src/pages/README.md). The broader rationale, status vocabulary, migration order and deletion-safety rules are documented in [PLUITS-PAGE-DIRECTORY-AND-ROADMAP.md](./PLUITS-PAGE-DIRECTORY-AND-ROADMAP.md). README-only folders are reserved ownership markers; they are not runtime pages and must not be imported by the router.
