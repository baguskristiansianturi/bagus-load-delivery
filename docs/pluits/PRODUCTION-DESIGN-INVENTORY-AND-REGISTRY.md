# PLUITS Production Design Inventory & Canonical Registry

Status: **Active baseline inventory — not yet a complete visual sign-off**
Baseline source: `main` at `4ef9fb96e8e942511879303f355a7336860c287f`
Inventory started: 2026-11-13
Purpose: Record the existing production-facing design and implementation as-is before normalizing or refactoring it.

> Important: this document does not declare every current implementation detail to be a good design decision. It declares the current online product the baseline that must first be recorded faithfully. Differences and defects remain visible in the inventory until the product owner decides what to standardize.

## 1. Non-negotiable operating rule

Every design request must begin by looking up the existing PLUITS registry and the exact page/component ownership.

1. Identify the requested page, section and component instance.
2. Find its registry record and approved specification.
3. Find the exact source file, renderer, stylesheet, assets, state and consumers.
4. Check whether the requested asset, layout or variant already exists.
5. If it exists, reuse it. Do not create a near-duplicate.
6. If it does not exist, report the gap and present external references/options for owner approval. Do not add, download, render or install an external asset without approval.
7. Apply only the requested property changes. Preserve all unrelated properties.
8. Test the owning page and all known consumers; record the change and update the registry after approval.

The registry is the PLUITS warehouse. A component found in the warehouse must be retrieved by ID, not recreated from memory.

## 2. Baseline and approval are separate concepts

Every record must distinguish:

- **Observed baseline** — measured or read from the current online implementation/source.
- **Approved specification** — the value/behavior explicitly accepted by the product owner.
- **Current implementation** — what the checked-out branch currently renders.
- **Proposed change** — a candidate not yet approved.
- **History** — previous approved values and the change that replaced them.

The word "final" must never be inferred only from a file existing or a page being online. For this inventory, online means **baseline reference**. Product-owner confirmation makes a value an approved specification. When the owner changes a value, the newly approved value supersedes the previous value and the old value remains in history.

## 3. Scope of the inventory

The inventory covers the whole product, not icons alone.

### 3.1 Foundations
- Brand identity and logo variants
- Color palette and semantic color tokens
- Typography: family, roles, sizes, weights, line heights and responsive rules
- Spacing scale and actual page/section gaps
- Sizing, radii, borders, shadows and elevation
- Breakpoints, container widths, grid rules and safe areas
- Motion, transitions, focus, hover, active, disabled, loading and error states

### 3.2 Assets
- Brand marks, favicon, logos and wordmarks
- Interface icons and icon sprites
- Illustrations, photos, empty-state art and decorative assets
- Font files and external font providers
- Image/video placeholders and media treatments

### 3.3 Layouts and components
- Global and product-area headers/navbars
- Sidebars, drawers, bottom navigation and tabs
- Page shells, content containers and section layouts
- Cards, rows, tiles, badges, buttons, inputs, menus and dialogs
- Carousel/rail variants, galleries, story rails and vertical feeds
- Profile, post, reel, product, seller, inbox and directory components
- Footer and responsive/mobile compositions

### 3.4 Page usage and behavior
- Canonical route and route aliases
- Page owner and section order
- Component instance IDs and component variants
- Login/logout and other authentication-dependent states
- Data/service dependencies and permission states
- Responsive differences and interaction behavior
- All known consumers of shared components

## 4. Existing source inventory — confirmed from repository

This is an initial source-level inventory from the `main` baseline. It is not yet a claim that every listed source is used on every online route.

### 4.1 Existing icon sources (overlap to resolve, not silently replace)

| Source | Current role / evidence | Registry status |
|---|---|---|
| `src/components/common/icons.js` | Object of inline SVG strings; includes search, heart, cart, user, location, chevron, arrow, menu, truck, check, star and app | Existing source; consumers and exact rendered sizes still need mapping |
| `src/components/common/social-icons.js` | Social icon path registry and `socialIcon(name, options)` renderer; includes generic and PLUITS-specific marks/actions | Existing source; full name inventory and consumers need mapping |
| `src/app/ui.js` | Application-level `icon` map; duplicates names such as location, truck, store, menu, search, cart, heart, arrow, user and check | Existing source; overlaps with common icon maps and must be mapped before consolidation |
| `src/app/ui.js` | Another icon map/helper exists in the application UI layer | Existing source; overlap and call sites need mapping |
| `public/icons.svg` | SVG symbol sprite, 5,031 bytes at baseline | Existing asset; enumerate every symbol and every `<use>` consumer |
| `public/assets/brand/pluits-logo.svg` | Canonical brand SVG file is present | Existing brand asset; compare exact usage and variants |
| `public/favicon.svg` | Favicon path is present and currently has the same blob as the logo asset | Existing asset; confirm whether intentional |

**Observed duplication:** the semantic name `heart` exists in at least `icons.js`, `social-icons.js` and `app/ui.js`, but the path geometry is not identical. Therefore, a name match does not prove the assets are visually identical. The current source inventory also contains duplicate semantic names for search, cart, user, location, menu, truck, arrow and check.\n\n**Rule:** Do not consolidate or replace these sources until every symbol/name, SVG geometry, default stroke/fill, rendered dimensions, color behavior, consumer and dependency has been inventoried. A semantic icon name must resolve to one documented approved asset or an explicitly documented variant.

### 4.2 Global style and current source-level tokens

The baseline `src/style.css` defines these root values:

| Token | Observed value |
|---|---|
| `--primary` | `#0b6b55` |
| `--primary-dark` | `#075541` |
| `--primary-soft` | `#e9f5f0` |
| `--ink` | `#17221f` |
| `--muted` | `#68746f` |
| `--line` | `#e4e9e6` |
| `--surface` | `#ffffff` |
| `--soft` | `#f6f8f7` |
| `--soft-2` | `#eef3f0` |
| `--accent` | `#f4b740` |
| `--danger` | `#d94b45` |
| `--radius-sm` | `10px` |
| `--radius` | `16px` |
| `--radius-lg` | `24px` |
| `--container` | `1200px` |
| `--ui-icon-size` | `20px` |
| `--ui-icon-size-nav` | `22px` |
| `--ui-touch-target` | `44px` |
| `--ui-search-height` | `46px` |
| `--ui-public-header-height` | `60px` |
| `--ui-public-header-height-wide` | `68px` |
| `--ui-font-label` | `0.75rem` |
| `--ui-font-caption` | `0.6875rem` |

The root font stack begins with Inter and falls back to system UI fonts. This source-level declaration does not by itself prove that Inter is locally bundled or that every page uses this root stack.

These are **observed source values**, not yet a universal approval that every page must use them. Page-specific overrides and other CSS roots must be inventoried before the tokens can be treated as globally authoritative.

### 4.3 Current stylesheet ownership map

| Source | Initial ownership description | Required next audit |
|---|---|---|
| `src/style.css` | Global baseline plus substantial legacy/public layout styles | Split base/tokens from page-specific rules only after selector and import map |
| `src/styles/brand.css` | Brand presentation | Enumerate logo consumers, dimensions and variants |
| `src/styles/social-components.css` | Shared social components | List selectors, renderers and consumers |
| `src/styles/social-navigation.css` | Social navigation | Map each navigation variant and route consumer |
| `src/styles/page-transitions.css` | Route/page transition behavior | Record states and reduced-motion behavior |
| `styles/home-layout.css` | Home layout styles | Confirm import path and all home section consumers |
| `src/pages/account/user-account.css` | Account/profile/feed presentation | Inventory every account page/section and its local variants |
| `src/pages/account/circle-experience.css` | Circle experience presentation | Map Circle-specific card, rail and layout variants |
| `src/pages/messages/messages.css` | Messages/inbox presentation | Separate personal inbox, store inbox and shared primitives |
| Feature styles under `src/features/**` | Feature-owned styles | Map feature root, components and consumer routes |

A filename is not proof of selector isolation. Each stylesheet must be checked for selector scope, imports, duplicate rules and cross-page effects.

## 5. Required registry data contracts

Create/maintain the following registries as structured, reviewable files. Use stable IDs so a prompt can target an exact item without ambiguity.

### 5.1 Component Registry

Required fields:
- `component_id` — stable unique ID, e.g. `nav.social.primary.desktop`
- `display_name`
- `component_type` — primitive, composite, feature, layout or page section
- `owner_path` — canonical implementation file
- `style_path` — canonical stylesheet/token source
- `asset_ids` — referenced assets
- `variant_ids` — supported variants
- `consumer_routes` and `consumer_components`
- `state_contract` and `service_dependencies`
- `responsive_contract`
- `observed_baseline`
- `approved_specification`
- `status`, `evidence`, `last_verified`, `history`

### 5.2 Asset Registry

Required fields:
- `asset_id`, semantic name, type and preview
- exact repository path and file format
- source/provider and direct source URL
- version, license and attribution/redistribution terms
- viewBox/intrinsic dimensions and file hash where applicable
- default stroke/fill and whether color is token/currentColor driven
- approved usage, excluded usage and consumers
- rendered-size tokens or explicit context dimensions
- approval state and history

### 5.3 Layout / Variant Registry

Required fields:
- stable `layout_id` or `variant_id`
- exact layout type (e.g. full-bleed horizontal rail vs contained rail)
- owning page/feature and consumer routes
- container width, columns, gaps, padding, alignment and overflow
- responsive behavior per viewport range
- scroll/snap/drag behavior for rails and carousels
- actual CSS/JS implementation paths
- observed baseline and approved values
- allowed configuration properties and protected properties

### 5.4 Page Composition Registry

Every route must map to:
- route ID, canonical path/hash and aliases
- page owner/controller
- page shell/layout
- ordered sections
- exact component IDs and variants used by each section
- page-specific configuration
- auth/permission state variants
- stylesheet and service dependencies
- mobile/tablet/desktop composition
- known gaps and QA status

This is how a request such as "change the sidebar on the store inbox" maps to the store-inbox sidebar, not a different sidebar elsewhere.

## 6. Change scope and property-level protection

A request to change one property must not cause other properties to drift.

Examples:
- "Make this page background red" changes only the page background token/configuration; it does not change card dimensions, spacing, typography or icon size.
- "Replace the Love icon" changes the selected asset ID only; it preserves rendered size, color token, placement, accessible label, count and click behavior.
- "Increase the Love icon to 18px" changes the approved size property only; it does not replace the asset.
- "Use the dark tile" selects an existing approved dark variant; it does not invent new radii, padding or typography.
- "Move this sidebar below the header" changes composition/order only; it does not alter the sidebar's internal dimensions or behavior.

Every change request must record:
1. target page/section/component IDs;
2. requested properties allowed to change;
3. properties explicitly protected;
4. expected consumer impact;
5. tests and visual comparisons required.

If the target cannot be uniquely identified, stop and ask one concise clarification rather than guessing.

## 7. External asset procurement / approval gate

When an asset is missing:
1. Search the complete local Asset Registry and repository assets first.
2. Report "not found" with the searches/locations checked.
3. Find professional external candidates and compare visual fit, exact asset page, direct URL, format, source, version, license, attribution and local-download/redistribution permissions.
4. Present candidate links to the owner. No external asset may be installed, embedded or rendered before explicit selection/approval.
5. After approval, add the downloaded source file to the approved local asset library when the license permits; otherwise document the approved runtime dependency and its failure/performance implications.
6. Record the asset ID, source URL, license, file hash/version, default geometry and approved usages.
7. Implement with existing size/color/placement tokens. Do not change unrelated component properties.

## 8. Page and component location rules

- Global reusable primitives live in the shared design-system/components area.
- Domain behavior and domain-specific compositions remain with their owning feature.
- Page composition and section ordering remain with the route/page owner.
- An identical-looking component is not automatically shared if its behavior, data source, permission model or lifecycle differs.
- A shared component change requires an explicit consumer list and regression pass.
- Never create a generic "sidebar" or "carousel" record when the product has multiple distinct types. Record domain and purpose, e.g. `sidebar.inbox.personal`, `sidebar.inbox.store`, `rail.story.avatars`, `rail.marketplace.products`, `gallery.product.detail`.

## 9. Current repository facts and known gaps

Confirmed from the baseline tree/source:
- Runtime is Vite with native JavaScript ES modules and a hash router; pages are composed by route modules, not individual standalone HTML documents.
- Repository has `src/pages`, `src/features`, `src/components`, `src/services`, `src/lib`, `public/assets`, and Supabase migrations.
- Icon logic is distributed across at least three JavaScript sources plus an SVG sprite.
- Root CSS currently declares several global visual tokens, while page and feature styles are distributed across multiple directories.
- Existing extracted modules include social navigation, brand rendering, post actions, reel card, inbox sidebar and selected discovery/profile/home components. Extraction does not yet prove every component has a complete registry contract.

Known gaps before claiming the inventory is complete:
- Full symbol-by-symbol inventory for every icon source and all rendered call sites.
- Runtime-measured dimensions and screenshots for each header, sidebar, card, rail, footer and page shell.
- Complete page → section → component instance mapping across all routes.
- Every page-specific CSS override and the exact responsive result.
- Source/license/version evidence for third-party or copied assets.
- Exact ownership of duplicate/overlapping components and icon renderers.
- Full consumer and regression map for shared components.

## 10. Inventory completion workflow

Work in this order; do not skip to mass refactoring:

1. Freeze the source baseline SHA and confirm which commit is currently deployed.
2. Enumerate all routes and inspect the online product route by route at mobile, tablet and desktop widths.
3. Capture screenshots and measure actual rendered geometry; label each value with viewport, route, state and evidence.
4. Enumerate repository assets and icon symbols; map each to rendered call sites and page consumers.
5. Map page shells, navigation variants, sidebars, cards, rails, forms, dialogs, footers and page sections.
6. Compare source CSS values with runtime-rendered values; record both when they differ.
7. Mark accidental inconsistencies and intentional variants separately; do not normalize them during inventory.
8. Present the baseline inventory for owner review.
9. Convert owner-approved values into canonical tokens and component contracts.
10. Refactor incrementally into the modular architecture, preserving visual parity unless a specific design change is approved.
11. Add a full-site component/layout workshop and responsive preview after the canonical contracts are stable.
12. Keep production protected; all changes are made in isolated branches and validated in a complete preview environment before release.

## 11. Evidence and confidence labels

Each measured or inferred record must include one of:
- **Runtime verified** — measured on the deployed site with route, viewport and screenshot evidence.
- **Source verified** — read directly from a source file; runtime effect not yet confirmed.
- **Inferred** — likely mapping, requires confirmation.
- **Unknown** — not yet inspected.

Do not present source values as runtime measurements. Do not present inferred ownership as confirmed. A blank field is preferable to an invented value.

## 12. Relationship to existing standards

This inventory extends, rather than replaces:
- `DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md`
- `ENGINEERING-ARCHITECTURE-PLAYBOOK.md`
- `PAGE-ROUTE-AND-SECTION-REGISTRY.md`
- `PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md`
- `PLUITS-TECHNICAL-TERMINOLOGY-AND-RUNTIME-MAP.md` (if present on the active documentation branch)

Keep this file as the entry point for the production design baseline and registries. Detailed inventories should live in dedicated registries, not as an ever-growing narrative document.


## 13. Source-usage verification — 13 November 2026

This follow-up searched the tracked JS/MJS/TS/HTML source at the baseline commit. It records source references only; it does not claim runtime visual verification.

### 13.1 Icon and asset usage

| Source | Verified usage finding | Handling |
|---|---|---|
| `src/components/common/social-icons.js` | Shared `socialIcon(name, options)` renderer is imported by Account, Inbox and shared navigation/feature code | Keep as the current shared icon registry; map each icon name and rendered consumer before changing geometry |
| `src/app/ui.js` | App-level SVG/icon helper is imported by Help, Misc and Blog; the `icon` map is used by Misc | Keep as an application-shell helper for its current consumers; do not assume it is interchangeable with Social icons |
| `src/components/common/icons.js` | No import or reference found in the tracked JS/MJS/TS/HTML source scan | Candidate orphan. Do not delete until CSS/runtime references and any external use are checked |
| `src/features/posts/post-actions.js` | Contains post-action SVG rendering with overlapping semantics such as like/comment/share/save | Treat as a domain action renderer; compare actual SVG geometry and accessibility contract before any consolidation |
| `public/icons.svg` | No `<use>` or direct reference found in the tracked JS/MJS/TS/HTML source scan | Candidate unused sprite; retain until CSS/runtime and deployed-page checks are complete |
| `src/assets/hero.png` | No import or direct reference found in the tracked JS/MJS/TS/HTML source scan | Candidate unused local image; provenance/license and any runtime consumer remain unverified |
| `public/assets/brand/pluits-logo.svg` / `public/favicon.svg` | Both files have the same Git blob SHA; the HTML shell references the brand asset path for the favicon | Keep one canonical logo source; decide separately whether the duplicate path is needed for compatibility |

A missing source reference is not permission to delete an asset. Removal requires a final consumer/runtime check and owner approval.

### 13.2 Icon ownership rule

The current sources have overlapping semantic names, but they do not necessarily share identical path geometry, fill/stroke behavior, default size or accessible label. In particular, a `heart` name across `social-icons.js`, `app/ui.js`, `common/icons.js` and post actions does not prove a visually equivalent asset.

Before consolidating, record:
- icon semantic name and source asset;
- exact path geometry, stroke/fill and `currentColor` behavior;
- default and rendered dimensions;
- accessible label/hidden state;
- every importing/rendering module and route;
- whether the icon is a control action, status indicator, brand mark or decoration.

### 13.3 Demo and legacy content

- People Recommendations uses static demo people with remote Random User portraits and visibly labels the area `DEMO UI`.
- Top Ten uses static place/business entries and Unsplash imagery without a similarly visible demo label. Do not treat these records as verified user/provider content.
- The public Blog source still contains legacy “Bali Bagus Editorial” and construction-guide content. Confirm editorial ownership and whether it should remain visible in PLUITS before redesigning or sourcing replacement imagery.

### 13.4 Design-system baseline warning

The source contains multiple palette families: legacy green root tokens in `src/style.css`, Social navy values, and Public Home teal values. The HTML theme color and web manifest also use navy. These are source-level observations, not a finalized universal palette. Keep the current rendered baseline intact until all consumers, route contexts and runtime screenshots are reviewed.
