# PLUITS — Design System & Component Inventory

**Audit baseline:** 13 November 2026  
**Repository:** `baguskristiansianturi/pluits`  
**Purpose:** Establish a source-backed map of existing visual foundations, reusable components, feature/workspace ownership and known design inconsistencies. This document is an audit, not permission for a visual redesign.

> **Accuracy rule:** “Found in source” does not automatically mean “approved global standard”. Every value is classified as a global token, a scoped/local value, a legacy value, or an unverified item. Never promote a local value into a global token without checking all consumers and agreeing on its role.

## 1. Mandatory design check before every UI task

Before creating or editing any page, section or component:

1. Identify the canonical workspace and component owner from the component registry and module map.
2. Read the relevant design-system section below and inspect the current source/CSS for the exact component.
3. Reuse existing brand assets, typography, color roles, spacing, radius, icon and responsive rules where they are genuinely shared.
4. If no token exists, identify the nearest semantic token and propose a documented extension; do not invent a one-off value silently.
5. Check sibling components and all consumers before changing shared tokens.
6. Preserve approved page layout and component behavior unless the request explicitly changes them.
7. Record any unresolved inconsistency as audit debt instead of hiding it with another CSS override.

## 2. Brand ecosystem

### 2.1 Logo

| Item | Source-backed finding | Ownership |
|---|---|---|
| Canonical logo renderer | `src/components/common/brand.js` — `renderBrandLogo()` | Shared brand component |
| Canonical logo image path | `/pluits/assets/brand/pluits-logo.svg` | Brand asset |
| Shared logo CSS | `src/styles/brand.css` | Brand presentation |
| Supported sizing | Renderer accepts a size argument and sets `--brand-size`; current call sites use several sizes | Context may size the same mark; do not redraw it |
| Wordmark | Optional `wordmark` flag; separate text treatment | Use only where intended |

All brand placements should use the canonical renderer/asset or a documented equivalent that preserves the exact same asset. Do not recreate the mark with text, CSS or a new SVG drawing. Logo size can vary by placement, but its proportions, asset and visual identity must remain the same.

### 2.2 Brand color status

The source currently contains multiple color families. These are audit findings, not a finalized universal palette:

| Color role / value | Where found | Classification |
|---|---|---|
| `#172b45` | Social ink, active navigation and social controls | Scoped Social palette |
| `#738092` | Social muted text | Scoped Social palette |
| `#e8edf1` | Social borders | Scoped Social palette |
| `#168f87` | Public-home cart badge / teal interaction accent | Scoped public-home accent |
| `#34474c`, `#65757a`, `#7c898d` | Public navbar and brand wordmark treatment | Scoped public-home neutrals |
| `#0b6b55`, `#075541`, `#e9f5f0` | Root variables in `src/style.css` | Legacy green token family; audit before reuse |
| `#17221f`, `#68746f`, `#e4e9e6` | Root variables in `src/style.css` | Legacy general ink/muted/line tokens |
| `#f4b740`, `#d94b45` | Root accent/danger variables | Existing semantic values; consumer audit required |

**Important:** Do not apply the legacy green primary color to a new PLUITS social or marketplace component merely because it is named `--primary`. Confirm the workspace palette and brand role first. Consolidation into semantic tokens is a future controlled task; this audit does not change production colors.

## 3. Typography inventory

### 3.1 Font family

The root `:root` rule in `src/style.css` declares this font stack:

```css
Inter, ui-sans-serif, system-ui, -apple-system,
BlinkMacSystemFont, "Segoe UI", sans-serif
```

This is the current global font-family declaration found in source. Confirm whether all route-specific styles inherit it or override it before calling it universal. Do not introduce a new font family for an individual page without a documented reason.

### 3.2 Existing typography values

| Context | Current source value | Source / scope | Status |
|---|---:|---|---|
| Shared UI label token | `0.75rem` (12px at 16px root) | `src/style.css`, `--ui-font-label` | Existing global token |
| Shared UI caption token | `0.6875rem` (11px at 16px root) | `src/style.css`, `--ui-font-caption` | Existing global token |
| Social body token | `13px` | `src/styles/social-components.css`, `--pl-body-size` | Scoped Social token |
| Social label token | `11px` | Same file, `--pl-label-size` | Scoped Social token |
| Social mobile navigation label | `9px` | `src/styles/social-navigation.css` | Scoped responsive rule |
| Post date / post metadata | `10px` | `src/features/posts/post-actions.css` | Post metadata rule |
| Profile identity paragraph | `13px` | `src/features/profile/profile-hero.css` | Profile-local rule |
| Profile tabs | `12px` desktop; `10px` mobile; `9px` at narrow width | Same file | Profile-local responsive rules |
| Public navbar register label | `12px` | `src/features/public-home/navbar.css` | Public-home local rule |

### 3.3 Font-weight observations

The source includes local weights such as 400/450, 550/600, 650/700, 750/800/850 depending on component. These are observed values, not yet a normalized weight scale. In particular, do not assume every CTA should be 700 or every small label 600 without checking its semantic role and existing component.

**Next typography audit:** inspect all page and feature stylesheets, collect actual family/size/weight/line-height/letter-spacing by semantic role, then define a compact type scale (display, page title, section title, body, label, caption, micro-label) with approved weights. Keep component-specific exceptions documented.

## 4. Shared geometry and interaction tokens

Source: `src/style.css`.

| Token | Current value | Meaning / notes |
|---|---:|---|
| `--ui-icon-size` | 20px | General icon geometry |
| `--ui-icon-size-nav` | 22px | Navigation icon geometry |
| `--ui-touch-target` | 44px | Minimum interaction target |
| `--ui-search-height` | 46px | Search control height |
| `--ui-public-header-height` | 60px | Mobile public header baseline |
| `--ui-public-header-height-wide` | 68px | Wide public header baseline |
| `--radius-sm` | 10px | Root radius token |
| `--radius` | 16px | Root radius token |
| `--radius-lg` | 24px | Root radius token |
| `--container` | 1200px | Root content container |
| `--shadow-sm` | `0 4px 16px rgba(19,39,31,.06)` | Existing root shadow |
| `--shadow` | `0 12px 35px rgba(19,39,31,.09)` | Existing root shadow |

The mobile-first architecture additionally requires 320/360/390/430 CSS-pixel checks, safe-area handling, 44px touch targets, fluid sizing and reduced-motion support. See `PLUITS-APPLICATION-ARCHITECTURE.md`.

## 5. Icon ecosystem

| Component / source | Responsibility | Rule |
|---|---|---|
| `src/components/common/social-icons.js` | Shared SVG path registry and `socialIcon(name, options)` renderer | Reuse named paths where the meaning matches; do not fork icon geometry |
| `src/components/common/brand.js` | Brand image renderer | Brand mark is not a generic UI icon |
| `src/features/posts/post-actions.js` | Post-specific action SVGs (like/comment/share/save) | Currently duplicates some semantics found in shared icon registry; audit and consolidate only if visual and accessibility contracts match |
| `src/styles/social-navigation.css` | Social nav icon sizing | Uses 22px mobile navigation symbols |

Icon inventory, aliases, duplicates, stroke widths and accessibility labels still require a full call-site audit. A similar-looking icon is not automatically the same semantic control.

## 6. Component and workspace inventory

This is a source-backed first-pass inventory from the current architecture, page registry and inspected files. “Partial / audit required” means the component exists in some form but its complete boundary and all consumers have not yet been verified. This table must be expanded from source/import/caller inspection; it is not a claim that all PLUITS components have already been enumerated.

### 6.1 Brand and shared social shell

| Component | Current owner/source | Current boundary / status |
|---|---|---|
| Brand Logo | `components/common/brand.js`, `styles/brand.css` | Canonical mark renderer and asset |
| Shared Social Icon registry | `components/common/social-icons.js` | SVG paths and icon renderer |
| Social Header | `components/social/navigation.js` | Multiple configured variants; shared behavior needs continued decomposition |
| Social Mobile Navigation | `components/social/navigation.js`, `styles/social-navigation.css` | Five-slot social navigation; route registry remains canonical |
| Social Route Registry | `components/social/navigation-routes.js` | Canonical social destinations |
| Social Post Actions | `features/posts/post-actions.js`, `post-actions.css` | Like/comment/share/save action renderer only; not a complete post card |
| Social Post Card | Account controller / legacy composition | No verified single canonical full Post Card export yet; extraction audit required |
| Profile Hero | `features/profile/profile-hero.css` plus account controller | Partial extraction; markup/state boundary remains to audit |
| Story Card / Story Rail | Account/public-home compositions and feature targets | Canonical shared card boundary not yet verified |

### 6.2 Public Home ecosystem

Owner: `features/public-home`; page controller: `pages/home/index.js`.

| Component / section | Current owner |
|---|---|
| Public Home layout | `features/public-home/layout.js` |
| Public Navbar | `features/public-home/navbar.js`, `navbar.css` |
| Hero + search markup | `features/public-home/hero.js` |
| Sticky search rail | `features/public-home/public-home.css` |
| Discovery | `features/public-home/discovery.js` |
| Nearby | `features/public-home/nearby.js` |
| Stories + public feed slot | `features/public-home/stories.js` |
| Marketplace preview | `features/public-home/marketplace.js` |
| Join / guest registration CTA | `features/public-home/join.js` |
| Footer | `features/public-home/footer.js` |
| Authentication, public feed queries, data/event binding | `pages/home/index.js` |

The public navbar is not the Marketplace navbar. Share tokens/primitives only when the behavior and contract truly match.

### 6.3 Inbox ecosystem

| Component | Current owner | Status |
|---|---|---|
| Inbox page/controller | `pages/messages/index.js` | Current controller owns data/events |
| Inbox conversation sidebar | `features/inbox/inbox-sidebar.js` | Renderer extracted; controller owns data and tab state |
| Conversation search | Inbox page/controller | Separate canonical Search component not yet verified |
| Conversation list / row | Inbox page/controller | Further extraction audit required |
| Chat panel / message list | Inbox page/controller | Further extraction audit required |
| Message composer | Inbox page/controller | Further extraction audit required |
| Inbox header / online contacts | Inbox page/controller | Further extraction audit required |

### 6.4 Seller ecosystem

| Component | Current owner | Status |
|---|---|---|
| Seller page/controller | `pages/seller/index.js` | Current controller; still contains substantial behavior/composition |
| Seller navigation/sidebar | `features/seller/seller-navigation.js` | Renderer extracted; data/state remain in Seller controller |
| Store switcher | Seller page/controller | Audit required |
| Dashboard/stat widgets | Seller page/controller | Audit required |
| Product management | Seller page/controller | Audit required |
| Category management | Seller page/controller | Audit required |
| Inventory | Seller page/controller | Audit required |
| Delivery | Seller page/controller | Audit required |
| Store profile/settings | Seller page/controller | Audit required |

### 6.5 Marketplace, Directory and Trip

The route registry confirms the following distinct route states, but each is still substantially composed through its page controller. Do not treat route states as proof of extracted reusable components.

| Ecosystem | Known sections / states | Current owner / next audit |
|---|---|---|
| Marketplace | Catalog, storefront, product detail, cart, checkout, orders, order detail | `pages/marketplace/index.js`; audit Product Card, Seller Card, catalog filters, Product Search, cart line, checkout form and order summary separately |
| Directory | Place discovery, place detail, provider claim | `pages/directory/index.js`; audit Place/Destination/Service cards and search/filter modules |
| Trip | Trip home, itinerary, destination discovery, provider requests | `pages/trip/index.js`; audit destination cards, itinerary stops, provider cards and trip shell |
| Admin | Moderation workspace | `pages/admin/moderation.js`; audit admin shell, queue, review and moderation actions |

### 6.6 Other registered page families

| Page family | Current route/controller | Component audit |
|---|---|---|
| Account/Auth | `pages/account/index.js` | Large legacy composition; split Feed, Profile, Activity, Composer, Saved, settings and auth by ownership |
| Explore/Search | `pages/search/discovery.js` | Search intent and result-card boundaries need inspection |
| Blog/Guides | `pages/blog/index.js` | Listing, article, author, related content and tags |
| Help/Legal | `pages/help/index.js` | Help layout, FAQ rows, legal article sections |
| Misc information | `pages/misc/index.js` | Individual information-page sections |
| Inbox settings | `pages/messages/settings.js` | Settings-specific controls and forms |

## 7. Search components — separate by intent

Do not create one universal Search component that accumulates unrelated filters and behavior.

| Canonical component name | Domain owner | Owns |
|---|---|---|
| Friends Search / People Search | Discovery / People | People query, friend filters, person results and states |
| Content Search | Feed / Discovery | Post/story/content query, content filters and results |
| Product Search | Marketplace | Product query, category/price/stock/commerce filters and product results |
| Contact Search | Inbox | Conversation/contact query, inbox-specific filtering and results |

A low-level input primitive may be shared if its API, accessibility and interaction contract genuinely match. Search query semantics, filters, results and state remain with each domain.

## 8. Current design-system debt and decisions needed

1. Root `src/style.css` contains an older green primary palette while Social and public-home use other scoped color families. Decide semantic brand roles before replacing tokens.
2. Typography values are scattered across root tokens and feature styles. Build a verified semantic type scale before normalizing CSS.
3. Icon geometry is partly shared and partly duplicated. Inventory names/call sites before consolidation.
4. Radius and shadow tokens exist globally, but feature components also hardcode local values. Audit actual use and preserve purposeful differences.
5. The Post Actions renderer exists, but that is not proof a complete canonical Post Card exists. Audit the full markup, media, caption, profile identity, metadata, state and all render sites.
6. Account, Marketplace, Trip, Inbox and Seller controllers still contain legacy page composition. Extract incrementally; no mass rewrite.
7. Existing public-home sections and navigation have different behavior from other workspaces. Share only primitives/tokens, not whole workspace shells.

## 9. Required design-system governance

Every new or changed component must record:
- canonical name and owner;
- public API / inputs / callbacks;
- all consumers and route contexts;
- logo/icon source where applicable;
- font family, semantic size, weight, line-height and letter-spacing;
- semantic text/surface/border/accent/status colors;
- spacing, dimensions, radius, shadow and responsive rules;
- loading, empty, error, disabled, focus and active states;
- accessibility and reduced-motion behavior;
- stylesheet namespace and tests.

When a token is changed, inspect every consumer and all sibling workspaces before merging. Do not use global selectors or page CSS patches to compensate for a component-level inconsistency.

## 10. Audit completion plan

1. Complete a source/import/caller audit for the full Instagram Post and Story components.
2. Inventory all stylesheets and extract typography/color/spacing/radius/shadow/icon declarations into a machine-reviewable audit table.
3. Build the canonical semantic token proposal and resolve conflicting legacy palettes.
4. Map every reusable component to its actual file, public export, consumer list and test coverage.
5. Audit Search components by intent and separate their owners.
6. Continue workspace-by-workspace: Inbox, Seller, Marketplace, Directory, Trip, Account, Admin, Blog/Help.
7. Add design-token/component contract checks and responsive regression tests.
8. Only after the inventory and token proposal are reviewed, migrate CSS values incrementally. Do not redesign all pages as part of the inventory.

## 11. Source references reviewed for this baseline

- `src/style.css`
- `src/styles/brand.css`
- `src/styles/social-navigation.css`
- `src/styles/social-components.css`
- `src/components/common/brand.js`
- `src/components/common/social-icons.js`
- `src/components/social/navigation.js`
- `src/features/posts/post-actions.js`
- `src/features/posts/post-actions.css`
- `src/features/profile/profile-hero.css`
- `src/features/public-home/README.md`
- `src/features/public-home/layout.js`
- `src/features/public-home/navbar.js`
- `src/features/public-home/navbar.css`
- `src/features/public-home/public-home.css`
- `src/features/seller/seller-navigation.js`
- `src/features/inbox/inbox-sidebar.js`
- `src/pages/account/index.js`
- `src/pages/home/index.js`
- `src/pages/messages/index.js`
- `src/pages/marketplace/index.js`
- `src/pages/seller/index.js`
- `src/pages/directory/index.js`
- `src/pages/trip/index.js`
- `src/pages/admin/moderation.js`
- `docs/pluits/PLUITS-APPLICATION-ARCHITECTURE.md`
- `docs/pluits/FRONTEND-MODULE-MAP.md`
- `docs/pluits/PAGE-ROUTE-AND-SECTION-REGISTRY.md`
- `docs/pluits/PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md`
- `docs/pluits/CANONICAL-COMPONENT-OWNERSHIP-AND-REQUEST-LANGUAGE.md`
