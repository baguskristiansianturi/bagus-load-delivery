# PLUITS — Change Boundary and Dependency Audit

**Audit date:** 13 November 2026  
**Repository:** `baguskristiansianturi/pluits`  
**Branch:** `docs/component-ownership-language-contract`  
**Purpose:** turn a feature request into a controlled change boundary. This document records source-backed ownership and known dependencies so a change to one page or component does not silently spread into another workspace.

> **Accuracy rule:** a dependency is recorded as verified only when supported by an import, function call, route dispatch, markup selector, CSS import, or other direct source reference. “Audit required” means the relationship has not been exhaustively enumerated. A filename alone does not prove CSS isolation or component independence.

## 1. Change-boundary contract

Every implementation task must begin with a change-boundary record before editing source.

| Contract field | Required answer |
|---|---|
| User-facing target | Workspace → Route/Page → Section → Component |
| Canonical route(s) | Exact route and aliases from `src/app/router.js` |
| Page controller | Exact module that renders the route |
| Template renderer | Function that returns/inserts the target markup |
| Runtime / event owner | Function(s) that bind interactions, load data and update state |
| Data dependencies | Supabase tables, RPCs, storage, browser storage, external APIs used by this path |
| Stylesheet chain | Global imports + page/feature stylesheets + dynamically added styles |
| Selector boundary | Target root class/ID, descendant selectors, global selectors and responsive overrides |
| Component dependencies | Imported renderers, helper functions, icon sources, child components |
| Consumers | Other pages/routes importing or rendering the same module/class/component |
| Allowed files | Exact source files permitted to change for this task |
| Protected files | Shared/global files and unrelated routes that must not change |
| Regression checks | Tests and route-level manual checks required after the change |

A request is **not ready to edit** if the target cannot be distinguished from another component with a similar name. Resolve the workspace/context first.

## 2. Verified application lifecycle and CSS entry points

### Startup and route lifecycle

```text
index.html
  └── src/main.js
      ├── imports src/style.css
      ├── imports src/styles/brand.css
      ├── imports src/styles/page-transitions.css
      ├── imports src/styles/social-navigation.css
      ├── imports styles/home-layout.css
      ├── imports Public Home module
      └── listens for hashchange and calls route()
          └── src/app/router.js
              ├── parses hash path and query
              ├── dispatches route to page module
              ├── calls page template renderer
              ├── inserts HTML into #app
              ├── schedules bind/load function
              └── updates SEO metadata
```

The app is a hash-routed SPA. A route may have a renderer and a separate binder, but several route states can intentionally share one page controller. Do not create a duplicate controller merely because a new URL state is requested.

### CSS entry-point observations

| Entry point | Verified relationship | Boundary warning |
|---|---|---|
| `src/main.js` | Imports the five CSS files listed above | Global imports can affect multiple routes |
| `src/pages/messages/index.js` | Imports `./messages.css` | Inbox CSS is loaded with the Inbox controller; selector scope still needs full audit |
| `src/pages/account/index.js` | Imports `user-account.css`, `circle-experience.css`, `social-components.css`, feature CSS for posts, discovery, profile framing/hero and reels | This controller has a broad shared stylesheet graph; a CSS edit here is high risk |
| `src/pages/marketplace/index.js` | Controller source does not import a dedicated Marketplace stylesheet at its top | Marketplace visual rules are currently found in global CSS; exact selector inventory and all consumers remain audit work |

**Important:** import location is not the same as selector isolation. A page stylesheet can still contain generic selectors; a global stylesheet can contain selectors scoped under a page root. Before editing CSS, inspect the complete selector and its matching markup across the repository.

## 3. Current page / workspace change contracts

### 3.1 Public Home

| Field | Current verified owner |
|---|---|
| Route | `#/` (legacy home aliases are normalized by `src/main.js` / router) |
| Controller / renderer | `src/pages/home/index.js` — `home()` |
| Runtime | `bindHome()` from `src/pages/home/index.js`; startup invokes route/render flow |
| Global CSS | `src/style.css`, brand, page transitions, social navigation, `styles/home-layout.css` |
| Feature modules | `src/features/public-home/*` (layout, navbar, hero, discovery, nearby, stories, marketplace preview, join, footer) |
| Shared dependencies | Brand renderer; navigation/icon helpers where imported |
| Boundary rule | A Public Home-only visual change should prefer the owning `public-home` module and its scoped selectors. Do not change Social Home or Marketplace merely because they share a word such as “home”. |
| Regression | Public root route, mobile and desktop layout, navigation links, feed section, story rail, marketplace preview, footer and route transitions |

**Status:** controller/feature-module ownership is documented; complete selector-by-selector CSS and all downstream consumers remain **Audit required**.

### 3.2 Social / Account

| Field | Current verified owner |
|---|---|
| Route family | `#/account/*`, `#/@username`, plus account auth/settings and route states dispatched by `src/app/router.js` |
| Controller | `src/pages/account/index.js` |
| Template / runtime | Multiple render functions and bind/mount functions inside the large Account controller |
| Direct imports | Supabase client; Auth feature; `socialIcon()`; Brand renderer; Post Actions; Top Ten; People Recommendations + CSS; Social Navigation; SEO; account and Circle CSS; Public Join; App Download; profile image framing/hero; Reels CSS; shared Social component CSS; account context; drafts; media types/upload; signed URLs; Directory nearby section |
| CSS | `src/pages/account/user-account.css`, `src/pages/account/circle-experience.css`, `src/styles/social-components.css`, plus feature styles listed in imports |
| Important component boundary | Full Post Card and several profile/story compositions remain in Account controller; Post Action Bar, Reel Card, People Recommendation Card and image-framing helper have separate feature modules |
| Boundary rule | Do not treat every `#/account/*` state as a separate controller. A request for Profile Header must not automatically change Post Card, Story Tray, Reels or Account Settings. Check the exact route state and render function first. |
| Regression | Requested route state, adjacent profile tabs, feed/post actions, mobile nav, profile header, auth state, media/gallery behavior and relevant feature consumers |

**Risk:** high. The controller is large and imports several feature stylesheets and other page functionality. CSS selectors in the two Account stylesheets require selector-scope and consumer mapping before broad edits.

### 3.3 Inbox

| Field | Current verified owner |
|---|---|
| Canonical route | `#/inbox` |
| Legacy alias | `#/messages` redirects to `#/inbox` |
| Settings route | `#/inbox/settings` |
| Main controller | `src/pages/messages/index.js` |
| Renderer / runtime | `messagesPage()` and `bindMessagesPage()` |
| Settings controller | `src/pages/messages/settings.js` |
| Page stylesheet | `src/pages/messages/messages.css` (main Inbox controller import) |
| Direct shared dependencies | `socialIcon()`, Brand renderer, Social Mobile Navigation, `renderInboxSidebar()`, Supabase |
| Extracted child | `src/features/inbox/inbox-sidebar.js` renders the conversation sidebar |
| Still composed in controller | Contact/online contact strip, contact search/results, conversation data and event binding, active chat panel, message composer and message sending |
| Browser state | Inbox code uses localStorage for cached thread/outbox state and online/offline browser events |
| Boundary rule | Contact List, Online Contact Strip, Conversation List, active Conversation and Message Composer are separate UI/data concepts. A change to one must not rewrite the others by default. People Recommendations are not Inbox Contacts. |
| Regression | Inbox route and settings route; contact search; online/offline counts; opening a conversation; sending a message; offline queue; audio/voice message controls; mobile chat back behavior; sidebar selection |

**Risk:** medium-high. The controller owns multiple interaction surfaces and uses broad root/document selectors. Audit event delegation and selector roots before moving code.

### 3.4 Marketplace

| Field | Current verified owner |
|---|---|
| Catalog route | `#/marketplace` |
| Storefront route | `#/shop/:username` |
| Product detail route | `#/market-product/:variantId` |
| Cart route | `#/market-cart`; legacy `#/cart` redirects here |
| Checkout route | `#/market-checkout`; legacy `#/checkout` redirects here |
| Orders route | `#/market-orders`; legacy `#/orders` redirects here |
| Order detail | `#/market-order/:id`; legacy `#/order/:id` redirects here |
| Shared controller | `src/pages/marketplace/index.js` |
| Renderer/binder pairs | `marketplacePage/bindMarketplacePage`, `storePage/bindStorePage`, `marketProductPage/bindMarketProductPage`, `marketCartPage/bindMarketCartPage`, `marketCheckoutPage/bindMarketCheckoutPage`, `marketOrdersPage/bindMarketOrdersPage`, `marketOrderPage/bindMarketOrderPage` |
| Shared UI | `nav()`, `productCard()` and cart/wishlist helpers in the same controller |
| Data dependencies | Supabase public store/product views, cart/wishlist browser storage, checkout/order/payment RPCs and order tables |
| Boundary rule | These are separate route states, not seven separate Page folders/controllers. A Product Card change can affect catalog, storefront and potentially product-related previews; inspect every call site before editing it. |
| Regression | Catalog, store profile, product detail, wishlist, add/remove/update cart, checkout pickup/delivery, order creation, payment reference submission, order list and order detail |

**Status:** route/controller presence is verified. Do not infer that every checkout/payment workflow is complete or UAT-passed from route existence.

## 4. Icon system — current source ownership and safe-change rules

There are at least three overlapping JavaScript SVG sources plus one static SVG sprite asset. They are not yet a unified canonical icon system.

| Source | Verified API / role | Known overlap |
|---|---|---|
| `src/components/common/social-icons.js` | `socialIcon(name, { size, className })`; renders inline SVG with `.pl-icon` | Social icon names include search, heart, bookmark, user, message, settings, map-pin, store, shopping-cart and others |
| `src/components/common/icons.js` | Exports `icon` object with SVG strings | search, heart, cart, user, location, menu, truck, check, star, app |
| `src/app/ui.js` | Exports another `icon` object used by legacy shell helpers | location, truck, store, box, menu, search, cart, heart, back, arrow, user, check |
| `public/icons.svg` | Static SVG symbol sprite | Symbol IDs and every `<use>` consumer have not yet been exhaustively mapped |

### Direct consumers verified in inspected files

- `src/pages/messages/index.js` imports and calls `socialIcon()` for Inbox search controls.
- `src/pages/account/index.js` imports and calls `socialIcon()` in Account settings/profile UI.
- Other imports/call sites must be checked before declaring this list exhaustive.

### Safe icon change checklist

1. Identify which registry actually renders the target icon (do not assume the similarly named `icon` objects are interchangeable).
2. Find the exact icon key and all import/call sites.
3. Identify whether the icon is inline SVG, static sprite symbol, CSS pseudo-element, Unicode glyph or image.
4. Check SVG viewBox/path, stroke/fill attributes and accessibility attributes.
5. Check CSS sizing, color inheritance, stroke width, alignment and mobile overrides.
6. Check every consumer, including route navigation and any reused feature card.
7. Change only the intended source and consumer styles; do not consolidate registries as part of a one-icon visual request.
8. Verify all affected consumers at narrow mobile width and desktop.

**Audit status:** registry source definitions are verified. Full repository-wide consumer inventory, sprite symbol IDs, and selector overrides remain **Audit required**.

## 5. Component ownership and consumer matrix

| Component | Current owner | Known consumers / boundary | Extraction status |
|---|---|---|---|
| Brand Logo | `src/components/common/brand.js` | Public Home, Social/Account, Inbox, Marketplace and shared shell call sites; responsive sizing differs by context | Canonical renderer exists; all call-site sizing contract still needs audit |
| Post Card | `src/pages/account/index.js` | Social Feed, profile post surfaces and detail-related render paths must be checked per renderer | Full card is not one extracted canonical module |
| Post Action Bar | `src/features/posts/post-actions.js` | Imported by Account controller | Extracted action renderer/behavior, not full Post Card |
| Story Tray / Story Viewer | Social/Account composition | Exact renderer and consumers need audit | Not verified as canonical extracted component |
| Profile Header | `src/pages/account/index.js`; partial CSS in `src/features/profile/profile-hero.css` | Profile route states; do not assume all account surfaces share identical header | Partial extraction |
| User Avatar | Contextual markup in Account and Inbox | Story, profile, people card and inbox avatar contexts may have different sizing/semantics | No single canonical renderer verified |
| People Recommendation Card | `src/features/discovery/people-recommendations.js` | Discovery and Account imports | Extracted; not an Inbox contact |
| Reel Card | `src/features/reels/reel-card.js` | Account/Reels composition | Extracted card; feed composition remains elsewhere |
| Contact List / Online Contact Strip | `src/pages/messages/index.js` | Inbox only, based on inspected source | Still controller-owned |
| Conversation List | Messages controller + `src/features/inbox/inbox-sidebar.js` | Inbox sidebar | Partial extraction |
| Message Composer | `src/pages/messages/index.js` | Active Inbox conversation | Still controller-owned |
| Product Card | `src/pages/marketplace/index.js` | Marketplace catalog and storefront render paths | Shared renderer in controller; not separately extracted |

## 6. CSS impact audit — required procedure

Before modifying a selector, capture:

- Exact selector text (including comma-separated selector groups).
- Owning stylesheet and import chain.
- Every matching class/ID in template renderers.
- Whether the selector is rooted under a workspace class or global.
- Media queries, pseudo-states, descendant/child combinators and specificity.
- CSS custom properties read by the selector and where those properties are defined/overridden.
- Other routes that render the same class.
- Visual regression surfaces at mobile, tablet and desktop widths.

### Risk levels

| Risk | Typical example | Required approach |
|---|---|---|
| Low | Component-specific class under one page root, one known renderer | Confirm all consumers and test target route |
| Medium | Shared feature class imported by multiple pages | Enumerate imports and call sites; test each consumer |
| High | Generic selector, root token, `src/style.css`, Account legacy CSS, or global shell | Map all matches and routes; require broader regression pass |
| Critical | Shared token, global reset, router/bootstrap, auth/data service, database contract | Explicitly scope the task; test every dependent workspace and relevant backend contract |

No CSS selector should be labelled “isolated” based only on the stylesheet filename.

## 7. Required delivery gate for every scoped change

1. **Before edit:** write the target contract (Section 1) and allowed/protected file list.
2. **During edit:** keep the diff inside allowed files. If a dependency requires a protected file, stop and document why before expanding scope.
3. **After edit:** inspect `git diff --name-only` and the complete diff; confirm no unrelated files or route states changed.
4. **Dependency check:** re-run import/call-site/selector checks for the edited symbol or class.
5. **Automated checks:** run the relevant tests and production build where available.
6. **Runtime checks:** verify target route and each known consumer on mobile-first viewport; verify desktop if responsive CSS changed.
7. **Report:** state exact files, commit SHA, tests/build/deploy status, known gaps and whether GitHub Pages was actually verified.

A clean file diff is necessary but not sufficient: it does not prove CSS or shared-component impact isolation.

## 8. Remaining audit backlog (explicitly not yet complete)

| Audit item | Current status | Evidence needed to close |
|---|---|---|
| Full `socialIcon()` import/call-site list | Partial | Repository-wide symbol search and route/consumer list |
| Legacy `icon` object imports and property consumers | Partial | Search all imports and each used key |
| `public/icons.svg` symbol IDs and consumers | Audit required | Enumerate symbol IDs and all `<use href="#…">` references |
| Brand renderer call sites and responsive size contracts | Partial | Full import/call-site list + CSS matching each logo class |
| All CSS imports and dynamic stylesheet insertion | Partial | Import graph from every page/feature plus runtime link injection |
| CSS selector-to-markup mapping for 24 stylesheets | Audit required | Selector inventory, matches, media overrides and specificity |
| CSS custom properties / literal color-spacing-radius inventory | Audit required | Token and literal-value report with definitions and consumers |
| Post Card / Story / Avatar exact renderers and consumers | Partial | Render function and call-site graph |
| Marketplace Product Card consumers | Partial | All `productCard()` call sites, related previews and CSS matches |
| Route-level visual regression coverage | Partial | Mobile and desktop screenshots/checklists per route |
| Build chunks and actual network payload | Audit required | Production build and mobile network measurements |

## 9. Request template (voice-friendly)

Use plain language; no code syntax is required:

> **Workspace:** Inbox  
> **Page:** Inbox  
> **Section:** Contact List  
> **Component:** Contact List  
> **Change:** make the contact rows more compact on mobile  
> **Do not change:** Online Contact Strip, Conversation List, Message Composer, other pages

The engineering workflow must translate this into the exact source-level contract and allowed file list before editing.

---

**Current scope of this audit:** documentation only. No production frontend behavior, route, stylesheet, asset, service, database schema, or user data was changed by creating this document.