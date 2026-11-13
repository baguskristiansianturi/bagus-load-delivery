# PLUITS — Page Directory, Workspace Structure & Roadmap

**Status:** Initial route-backed page scaffold  
**Runtime impact:** None. README placeholders and documentation only; no router, UI, CSS, service, database or behavior changed.

## Purpose
The page tree is both an engineering navigation map and a visible roadmap. It records pages that exist, pages still owned by legacy controllers, reserved boundaries and features that are not standalone pages. Git does not track empty folders, so reserved folders contain README markers. A README-only folder is not an implemented page.

## Status vocabulary
- **IMPLEMENTED:** canonical route and current runtime owner exist; does not imply full product acceptance.
- **PARTIAL:** route/controller exists but some journeys or states are incomplete.
- **RESERVED:** README-only folder; no runtime page and no router registration.
- **LEGACY OWNER:** current code remains in a shared controller; folder marks a future boundary, not a second implementation.
- **ALIAS:** alternate URL to a canonical route, not a second page.
- **FEATURE, NOT PAGE:** section, overlay or reusable UI without a standalone route.

## Three different Home pages
- `src/pages/home` = **Public Home** (`#/`).
- `src/pages/social/home` = **Social Home / signed-in feed** (`#/account/explore`), currently rendered by `src/pages/account/index.js`.
- `src/pages/marketplace/home` = **Marketplace Home** (`#/marketplace`), currently rendered by `src/pages/marketplace/index.js`.

## Marketplace page boundaries
Storefront, Product Detail, Cart, Checkout, Orders and Order Detail each have their own folder marker even though the current runtime owner is still one Marketplace controller. This makes target boundaries visible without pretending migration has happened.

## Features that are not pages
Story Rail, Story Viewer, Post Card, Post Actions, People Recommendations, Reel Card, Vertical Reel Feed and Circle UI are not automatically separate pages. They remain feature/section/component boundaries unless a canonical route is explicitly confirmed.

## Alias and duplicate cleanup
Known aliases include:
- `#/home`, `#/feed`, `#/beranda` → Public Home `#/`
- `#/messages` → Inbox `#/inbox`
- `#/cart` → `#/market-cart`
- `#/checkout` → `#/market-checkout`
- `#/orders` → `#/market-orders`
- `#/order/:id` → `#/market-order/:id`
- `#/materials`, `#/material`, `#/logistik`, `#/delivery` → Marketplace
- `#/provider`, `#/suppliers`, `#/jasa` → Directory
- `#/faq` → Help

If a click opens an unexpected or old page, trace the clicked link → router branch → canonical route/alias → page controller → mount. Do not delete a file based on its name alone.

## Migration roadmap
1. Keep existing routes stable and use the directory as the naming reference.
2. Finish Social First Release P0 and founder UAT before Marketplace expansion or other deferred vertical expansion.
3. Decompose the account controller incrementally into social home, profile, activity, saved and other approved page owners.
4. Decompose Marketplace route states into focused page modules only when its roadmap gate allows; preserve one canonical implementation per route.
5. Split Inbox Personal and Inbox Toko only after their distinct journeys and canonical routes are approved.
6. Audit Directory, Trip, Seller, Blog, Help, Admin and Misc ownership without unrelated redesign.
7. For each migration, add route/sibling regression tests, run `npm test` and `npm run build`, then record deployment and founder UAT separately.

## Deletion safety
Before removing an old page/module, inspect router conditions, hrefs, programmatic navigation, route helpers, dynamic imports, direct imports, CSS selectors, tests, workflows and docs. Confirm no canonical route, alias target or user journey depends on it. Preserve unique behavior or add a tested redirect. A RESERVED folder does not authorize deleting its current legacy owner.

Update both `src/pages/README.md` and `docs/pluits/PAGE-ROUTE-AND-SECTION-REGISTRY.md` whenever route or ownership changes.
