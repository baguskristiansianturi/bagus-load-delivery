# PLUITS Component, Asset & Location Map

> Status: inventory baseline / living document. This document records verified repository paths and ownership rules. A path's existence does not by itself prove every runtime consumer; consumer links must be traced before moving or deleting files.

## Purpose

This map is the shared reference for Bagus and contributors to answer:
- What is this element called?
- Which exact folder/file owns it?
- Which page or feature uses it?
- Is it global, shared-foundation, feature-specific, or page-specific?
- Which visual and behavioral contract must remain consistent?
- What may be changed without affecting unrelated screens?

**No unrelated changes:** a task must name its target page/feature/component. Do not edit neighboring feature files, global styles, shared tokens, navigation, or assets unless the task requires it and the impact is explicitly checked.

## Repository map (verified paths)

| Concern | Current path | Initial ownership / notes |
|---|---|---|
| Brand logo asset | `public/assets/brand/pluits-logo.svg` | Canonical brand asset candidate; verify all references before declaring exclusive source of truth. |
| Browser favicon | `public/favicon.svg` | Browser/app-tab icon; currently same reported size as logo asset, verify contents and usage. |
| SVG icon sprite | `public/icons.svg` | Public SVG sprite; inventory symbols and consumers before consolidating. |
| Brand component | `src/components/common/brand.js` | Shared brand rendering entry point candidate. |
| Common icons | `src/components/common/icons.js` | Existing icon helper/registry candidate. |
| Social icons | `src/components/common/social-icons.js` | Social-specific icon set; do not merge blindly with general icon registry. |
| Design tokens | `src/design-system/tokens/` | Shared visual primitives/tokens. |
| Design typography | `src/design-system/typography/` | Typography standards and reusable definitions. |
| Design icons | `src/design-system/icons/` | Icon-system documentation/implementation area; reconcile with common icons and public sprite. |
| Shared components | `src/components/common/`, `src/components/primitives/`, `src/components/feedback/` | Existing shared component areas; inspect contents and actual imports before reassignment. |
| Layout components | `src/components/layout/` | Layout ownership area; README currently present. |
| Social navigation | `src/components/social/navigation.js`, `navigation-routes.js` | Social navigation feature ownership. |
| Public-home navigation | `src/features/public-home/navbar.js`, `navbar.css` | Public landing/home navbar; not automatically the owner of authenticated app navigation. |
| Inbox feature | `src/features/inbox/` | Inbox feature root; subfolders include composer, contacts, conversations, requests. |
| Marketplace page | `src/pages/marketplace/` | Marketplace page entry area. |
| Store feature | `src/features/store/` | Store domain; catalog, product, storefront, wishlist sub-areas. |
| Directory feature/page | `src/features/directory/`, `src/pages/directory/` | Separate domain and page entry; map consumers before deciding boundaries. |
| Discovery feature | `src/features/discovery/` | Discovery-related components including people recommendations. |
| Search page | `src/pages/search/` | Current search/discovery page files. |
| Account/Circle page | `src/pages/account/` | Includes Circle experience and story layout styles. |
| Global stylesheet | `src/style.css` | Large global stylesheet (~286 KB at inventory time); high regression risk. Do not add unrelated page rules here. |
| Shared style sheets | `src/styles/brand.css`, `page-transitions.css`, `social-components.css`, `social-navigation.css` | Shared scope must be documented by selector and consumer. |
| Home layout stylesheet | `styles/home-layout.css` | Separate root-level stylesheet; import order and selector overlap require audit. |

## Search controls: separate by intent

Search is a family of controls, not one universal search box. Do not reuse a feature's behavior merely because the visual shape is similar.

| Search type | Owning feature | Expected responsibility | Isolation rule |
|---|---|---|---|
| Find people/friends | `src/features/inbox/` | Search people/contacts relevant to Inbox; own its query scope, result rows, empty/loading states and selection behavior. | Inbox changes must not alter Marketplace or global Search. |
| Find products | `src/features/store/` and/or `src/pages/marketplace/` | Product/catalog search, category/filter/sort semantics and product result navigation. Confirm actual runtime owner before moving. | Product search behavior and styling are isolated from people search. |
| Find places/providers | `src/features/directory/` | Place/provider discovery, location and category semantics. | Directory changes must not alter Inbox or product search. |
| Find posts/content | `src/features/discovery/` and/or `src/pages/search/` | Content/person/topic discovery; confirm current routing and query ownership. | Search page owns its result experience, not every search field in the app. |
| Global search (if present) | App-level only after verification | Cross-domain search entry point. | Must be a distinct contract; do not assume it exists or route all search controls through it. |

A search control may share low-level primitives (input, icon, clear button, focus ring) but must own its own:
- query state and submit/clear behavior;
- data source and result type;
- filters, suggestions and recent searches;
- keyboard/mobile interaction;
- loading, no-results and error states;
- dimensions/placement variants;
- accessibility labels and analytics events.

## Component classification and placement rules

1. **Design-system foundation** — color, typography, spacing, sizing, radius, elevation, motion and icon conventions. These are tokens/rules, not page components.
2. **Shared primitive** — input, button, avatar frame, badge, divider, spinner. Reuse only when behavior and accessibility contract match.
3. **Shared component** — a composed component intentionally used by multiple features, with documented variants and stable API.
4. **Feature-owned component** — business behavior belongs to one feature (Inbox people search, Marketplace product search, Directory place search).
5. **Page-owned composition** — layout and assembly specific to one page. Keep its styles and state local unless proven reusable.

Do not promote a feature component to global shared status just to reduce file count. Do not duplicate a genuinely shared primitive just to change its color or size; use explicit, documented variants.

## Component specification template

Every important reusable component should have a short record:
- **Name / ID**
- **Owner and exact path**
- **Consumers (pages/features)**
- **Purpose and behavior**
- **Variants** (e.g. compact, full-width, mobile)
- **Typography** (family, size, weight, line-height)
- **Dimensions** (height, width rules, icon size)
- **Spacing** (padding, gap, margins)
- **Surface** (background, border, radius, shadow)
- **States** (default, hover, focus, active, disabled, loading, empty, error)
- **Responsive rules**
- **Dependencies / imports**
- **Allowed change scope**
- **Tests / visual regression checks**

## Safe change protocol

Before editing:
1. Identify the exact page/feature and component requested.
2. Find its source file, styles, assets, imports, and runtime consumers.
3. Classify every touched file as feature-owned, page-owned, shared, or global.
4. Search for all consumers of any shared selector, token, icon, or asset being changed.
5. Prefer a local class/variant over broad selectors or global CSS.
6. Record any unavoidable cross-feature impact before changing it.

After editing:
1. Review the diff; revert unrelated file changes.
2. Run the repository's build, tests and module-boundary checks where available.
3. Verify the target page and at least one neighboring page that could be affected.
4. Do not merge/deploy until checks and requested visual review are complete.
5. Update this map when a component is moved, renamed, added, removed, or gains a new consumer.

## CSS isolation rules

- Avoid generic selectors (for example `.search`, `.header`, `.card`, `.active`) for feature-specific styling.
- Feature CSS must use a feature namespace or root scope.
- Page-specific layout rules stay with that page/feature.
- Global styles are reserved for true app-wide reset/tokens/base behavior.
- Do not extract rules from `src/style.css` or `styles/home-layout.css` until selector usage, import order, and visual effects have been audited.
- Never change a shared token to solve a one-page issue if a local variant is the correct fix.

## Inventory status / next audit

This is a verified starting map, not yet a complete dependency graph. Remaining audit work:
- trace logo references and decide canonical asset vs favicon/PWA variants;
- enumerate every icon symbol and each consumer across `public/icons.svg`, common icon helpers and design-system icons;
- trace all search inputs by source file, selector, handler, data source and consuming page;
- inventory navbars, tabs, headers, bottom navigation and page shells by application context;
- map every CSS file to imports, selector namespaces and affected routes;
- inventory image/media assets and document intended crop/aspect-ratio/placement;
- identify orphaned/duplicate files only after proving no runtime or documentation consumer.

**Do not move, rename, delete, or visually redesign components as part of this inventory pass.** First produce the complete map; structural changes should be separate, reviewable commits.


## Verified source findings — 14 November 2026

### Important authority conflict: logo asset
- Runtime renderer: `src/components/common/brand.js` exports `renderBrandLogo()` and `BRAND_LOGO_SRC`.
- Current renderer path: `/pluits/assets/brand/pluits-logo.svg`.
- Existing files: `public/assets/brand/pluits-logo.svg` and `public/favicon.svg`.
- However, approved decision D-007 in `MASTER/DECISION-LOG.md` specifies `public/assets/brand/pluits-logo.png` as the canonical image asset, with the shared renderer and `src/styles/brand.css`.
- **Do not move, replace, rename, or convert the logo during this pass.** This is a source-vs-decision discrepancy requiring reconciliation against the actual current main/live commit before any asset operation. Favicon/PWA references must also be traced.

### Verified icon renderers (do not consolidate yet)
- `src/components/common/icons.js`: general HTML SVG fragment map (`icon`).
- `src/components/common/social-icons.js`: social SVG path registry and `socialIcon()`.
- `src/app/ui.js`: another inline icon map used by the legacy app shell helpers.
- `public/icons.svg`: static SVG sprite.
- `src/design-system/icons/README.md` explicitly says this is a planned extraction and current paths remain authoritative in `src/components/common/`.
- The icon systems are overlapping, but their consumers/contracts have not yet been exhaustively mapped. No consolidation or file move until each symbol and import is traced.

### Verified search/page ownership (current vs target)
| Search experience | Current runtime file(s) | Target owner | Status |
|---|---|---|---|
| Inbox people/friend search | `src/pages/messages/index.js` (Inbox page controller currently owns markup/behavior; feature root is `src/features/inbox/`) | `src/features/inbox/` with a dedicated search component/module | Not yet extracted; keep behavior isolated from other searches. |
| Marketplace product search | `src/pages/marketplace/index.js` | `src/features/store/` or a Marketplace-owned search module after tracing the controller and route contract | Not yet extracted; do not share Inbox behavior. |
| Jelajah/content search | `src/pages/search/discovery.js`, `src/pages/search/discovery.css` | `src/features/discovery/` for reusable discovery behavior; page remains the route composition owner | Page module exists; feature boundary needs consumer audit. |
| Public Home search | `src/features/public-home/` composition and navbar/search styling | Public-home feature only | Must remain separate from authenticated Inbox and Marketplace search. |

Search inputs are currently embedded in page/feature controllers rather than exposed as four clean standalone modules. The next safe step is to extract each one separately behind its own feature contract, not to point them all at one generic search component.

### Verified ownership and layout notes
- `src/features/public-home/navbar.js` imports `socialIcon` and `renderBrandLogo`; this is the public-home navbar, not the universal authenticated social header.
- `src/pages/messages/index.js` imports `socialIcon`, `renderBrandLogo`, shared social mobile navigation, and `renderInboxSidebar` from `src/features/inbox/inbox-sidebar.js`. Inbox page still owns significant markup/data/event behavior.
- `src/pages/marketplace/index.js` is the route controller for Marketplace, Storefront, product, cart and checkout states. Keep these states distinct; do not relocate them as a single generic shell.
- `src/components/social/navigation.js` and `navigation-routes.js` own shared social navigation and canonical route references. Workspace navigation remains feature-owned.
- `src/app/ui.js` contains a legacy shell/header/footer/mobile nav and a second icon map. It is a high-impact dependency candidate; do not move it until all importers and route usage are enumerated.

### CSS risk baseline
- `src/style.css` is approximately 286 KB and is a high-risk legacy/global stylesheet.
- `styles/home-layout.css` is a separate root-level stylesheet.
- Scoped styles already exist beside several page/feature modules, including public-home, search, messages, seller, directory, account, profile and reels.
- Do not relocate or rewrite CSS until import order, selector namespaces, route consumers and collisions are mapped. Placement-only work must preserve selectors, specificity, cascade order and rendered output.

## Current execution boundary

This branch currently contains documentation-only commits. The source audit has identified ownership and placement discrepancies, but has not yet produced a complete import/consumer graph or visual regression evidence. Therefore no runtime source file, asset, stylesheet, route, component behavior or design has been changed. This is intentional: moving files before tracing every import and dynamic reference would violate the repository's own modularization and production-safety rules.

The next implementation slices should be small and independently testable:
1. Finish exact import/consumer map for logo, icons, global shells and CSS.
2. Extract Inbox people search into its Inbox-owned module, preserving markup, class names, selectors, event behavior and appearance.
3. Extract Marketplace product search separately, preserving its own behavior and appearance.
4. Extract or formalize Discovery search separately.
5. Move only files with complete import and test coverage; update imports atomically and run `npm test` + `npm run build` after each slice.
