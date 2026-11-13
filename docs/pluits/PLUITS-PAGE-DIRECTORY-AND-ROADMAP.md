# PLUITS — Current Page Directory & Runtime Ownership

**Audit basis:** router and source files on branch `docs/component-ownership-language-contract`.  
**Purpose:** show only the pages/routes that exist in the current application, identify their real runtime owners, and make route aliases and non-page features easy to distinguish.

## Directory policy

This directory is a map of the current implementation, not a speculative product sitemap. Do not create source folders or README placeholders for unbuilt ideas. Future ideas remain in `IDEAS/IDEA-BACKLOG.md` or the approved product roadmap. Add a page folder only when a canonical page/route is approved and implementation begins.

A route can exist inside a shared controller. In that case, record it as a route state and name the actual controller. Do not imply that a dedicated page module already exists.

## Status vocabulary

- **IMPLEMENTED:** route and renderer/controller exist in source.
- **PARTIAL:** route or page shell exists, but some journeys/states remain incomplete.
- **LEGACY OWNER:** current implementation is still inside a larger shared controller.
- **ALIAS:** alternate URL to a canonical route, not a separate page.
- **FEATURE / COMPONENT, NOT PAGE:** reusable UI or behavior without a standalone route.

## Three distinct Home pages

- **Public Home** — `#/`, rendered by `src/pages/home/index.js`.
- **Social Home / Feed** — `#/account/explore`, rendered by `src/pages/account/index.js`.
- **Marketplace Home / Catalog** — `#/marketplace`, rendered by `src/pages/marketplace/index.js`.

These names must always be qualified by workspace. Never use the ambiguous label “Home” alone in a change request.

## Current page inventory

The complete current route inventory and aliases live in [src/pages/README.md](../../src/pages/README.md) and [PAGE-ROUTE-AND-SECTION-REGISTRY.md](./PAGE-ROUTE-AND-SECTION-REGISTRY.md).

The current implementation includes Public Home, Social/account route states, Auth, Inbox, Search, Directory, Marketplace commerce route states, Trip, Seller Center, Blog, Help/Legal, Misc and Admin Moderation.

**Marketplace is already present in the current source:** `src/pages/marketplace/index.js` renders the catalog, storefront, product detail, cart, checkout, orders and order-detail route states. Their completeness is a separate product/UAT question; do not classify them as nonexistent or create duplicate routes.

## What is not a Page

Post Card, Story Card, Story Rail, Profile Header, People Recommendations, Reel Card, Inbox Contact Strip, Product Card, sidebars, icons, avatars, tabs and other reusable UI are feature/component/section boundaries. They belong in their actual feature/component owner and are not automatically route-level pages.

## Physical source tree rule

Only current source owners and confirmed route/page boundaries belong under `src/pages/`. Do not add empty directories for planned Marketplace expansions, future Inbox workspaces, speculative Social screens, or ideas that have not entered implementation. When an actual new page is approved, create its folder and map its runtime, CSS, components, services and tests as part of that implementation.

## Migration and deletion safety

Before splitting a route out of a shared controller, first map its renderer, event binding, CSS selectors, data/service calls, imports, route aliases and tests. Keep one canonical runtime owner throughout migration. Before deletion, prove that no route, link, import, dynamic import, test or user journey still depends on the old implementation. Preserve redirects for aliases where needed.

## Related technical maps

- [Complete Source Structure and Component Map](./PLUITS-COMPLETE-SOURCE-STRUCTURE-AND-COMPONENT-MAP.md)
- [Technical Terminology and Runtime Map](./PLUITS-TECHNICAL-TERMINOLOGY-AND-RUNTIME-MAP.md)
- [Page, Route and Section Registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md)
- [Page & Component Ownership Audit](./PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md)
- [Design System and Component Inventory](./PLUITS-DESIGN-SYSTEM-AND-COMPONENT-INVENTORY.md)
