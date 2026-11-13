# PLUITS — Complete Source Structure & Component Map

**Audit date:** 13 November 2026  
**Repository:** `baguskristiansianturi/pluits`  
**Audited source baseline:** `main` at `4ef9fb96e8e942511879303f355a7336860c287f`  
**Documentation branch:** `docs/component-ownership-language-contract`  
**Purpose:** Give the product owner a complete, human-readable map of the current repository structure, route ownership, shared components, design foundations, known duplication and the target modular structure. This is a map and migration plan—not a visual redesign.

> **Important accuracy distinction**
> - **Current / verified** means the file or behavior was found in the source tree or inspected source.
> - **Partial** means the file exists but the full component contract, every consumer or complete extraction is not yet verified.
> - **Target / proposed** means a future organizational standard, not a claim that those folders or components already exist.
> - No production files were moved or visually changed during this audit.

---

## 1. Repository snapshot

| Area | Verified count / size | Meaning |
|---|---:|---|
| Tracked repository blobs | 269 | Files returned by the recursive Git tree |
| Source CSS | 24 files / ~759,742 bytes | Raw CSS source, not compressed transfer size |
| Source JavaScript | 61 files / ~571,904 bytes | Includes app code and source-side modules; not a production bundle measurement |
| Tests | 8 files | Current automated test files under `tests/` |
| Supabase migrations | 60+ migration files | Database schema, policies and RPC evolution |
| Brand logo asset | 1 canonical SVG | `public/assets/brand/pluits-logo.svg` |

**Performance note:** raw source size does not equal the bytes downloaded by a user. We still need a production build, chunk inspection, route-level network analysis and mobile browser measurements before making a bundle-performance claim.

### Largest source files that deserve follow-up analysis

| File | Raw size | Current role |
|---|---:|---|
| `src/style.css` | ~286 KB | Root/global stylesheet; currently carries a large amount of styling |
| `src/pages/account/user-account.css` | ~187 KB | Account/Social styling; large legacy stylesheet |
| `src/pages/account/circle-experience.css` | ~54 KB | Circle experience styles |
| `src/pages/account/index.js` | ~170 KB | Account controller and legacy composition |
| `src/pages/messages/index.js` | ~37 KB | Inbox controller |
| `src/pages/blog-studio/index.js` | ~34 KB | Blog Studio controller |
| `src/pages/seller/index.js` | ~34 KB | Seller Center controller |
| `src/pages/directory/index.js` | ~33 KB | GeoDirectory controller |

These files are candidates for careful ownership/import/selector analysis, not automatic splitting targets.

---

## 2. Current repository structure — verified

This is the current source organization. It is intentionally not presented as the future target; some page controllers still contain large compositions.

```text
pluits/
├── src/
│   ├── main.js
│   ├── style.css
│   ├── app/
│   │   ├── models.js
│   │   ├── router.js
│   │   └── ui.js
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── brand.js
│   │   │   ├── icons.js
│   │   │   └── social-icons.js
│   │   └── social/
│   │       ├── navigation-routes.js
│   │       └── navigation.js
│   ├── features/
│   │   ├── app-download/
│   │   │   ├── app-download.js
│   │   │   └── app-download.css
│   │   ├── auth/
│   │   │   ├── README.md
│   │   │   ├── auth.js
│   │   │   ├── register.js
│   │   │   └── register.css
│   │   ├── discovery/
│   │   │   ├── nearby-card.js
│   │   │   ├── people-recommendations.js
│   │   │   ├── people-recommendations.css
│   │   │   └── top-ten-cards.js
│   │   ├── inbox/
│   │   │   └── inbox-sidebar.js
│   │   ├── media/
│   │   │   ├── media-types.js
│   │   │   └── storage-upload.js
│   │   ├── posts/
│   │   │   ├── post-actions.js
│   │   │   └── post-actions.css
│   │   ├── profile/
│   │   │   ├── image-framing.js
│   │   │   ├── image-framing.css
│   │   │   └── profile-hero.css
│   │   ├── public-home/
│   │   │   ├── README.md
│   │   │   ├── layout.js
│   │   │   ├── navbar.js
│   │   │   ├── navbar.css
│   │   │   ├── hero.js
│   │   │   ├── discovery.js
│   │   │   ├── nearby.js
│   │   │   ├── stories.js
│   │   │   ├── marketplace.js
│   │   │   ├── join.js
│   │   │   ├── footer.js
│   │   │   └── public-home.css
│   │   ├── reels/
│   │   │   ├── reel-card.js
│   │   │   └── reels.css
│   │   └── seller/
│   │       └── seller-navigation.js
│   ├── lib/
│   │   └── supabase/
│   │       └── client.js
│   ├── pages/
│   │   ├── seo.js
│   │   ├── account/
│   │   │   ├── index.js
│   │   │   ├── user-account.css
│   │   │   ├── circle-experience.css
│   │   │   ├── account-context.js
│   │   │   ├── drafts.js
│   │   │   └── security-settings.js
│   │   ├── admin/
│   │   │   └── moderation.js
│   │   ├── blog/
│   │   │   └── index.js
│   │   ├── blog-studio/
│   │   │   ├── index.js
│   │   │   └── blog-studio.css
│   │   ├── directory/
│   │   │   ├── index.js
│   │   │   └── directory.css
│   │   ├── help/
│   │   │   ├── index.js
│   │   │   └── help.css
│   │   ├── home/
│   │   │   └── index.js
│   │   ├── inbox-personal/
│   │   │   └── README.md
│   │   ├── inbox-toko/
│   │   │   └── README.md
│   │   ├── marketplace/
│   │   │   └── index.js
│   │   ├── messages/
│   │   │   ├── index.js
│   │   │   ├── messages.css
│   │   │   ├── settings.js
│   │   │   └── settings.css
│   │   ├── misc/
│   │   │   └── index.js
│   │   ├── search/
│   │   │   ├── discovery.js
│   │   │   └── discovery.css
│   │   ├── seller/
│   │   │   ├── index.js
│   │   │   └── seller.css
│   │   └── trip/
│   │       └── index.js
│   ├── services/
│   │   └── storage/
│   │       └── signed-urls.js
│   └── styles/
│       ├── brand.css
│       ├── page-transitions.css
│       ├── social-components.css
│       └── social-navigation.css
├── styles/
│   └── home-layout.css
├── public/
│   ├── assets/brand/pluits-logo.svg
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── sw.js
├── tests/
│   ├── app/
│   │   ├── auth-registration-routing.test.js
│   │   ├── brand-profile-settings.test.js
│   │   ├── router-loading.test.js
│   │   └── social-navigation.test.js
│   ├── features/
│   │   ├── app-download.test.js
│   │   ├── media-types.test.js
│   │   └── people-recommendations.test.js
│   └── services/
│       └── signed-urls.test.js
├── supabase/
│   ├── README.md
│   ├── migrations/
│   └── archive/
├── docs/pluits/
├── SOP/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── AGENTS.md
└── README.md
```

### Folder responsibilities

| Folder | Current responsibility | Rule going forward |
|---|---|---|
| `src/app/` | Bootstrap support, router, generic UI shell/helpers | Own application lifecycle and routing; do not become a feature component dumping ground |
| `src/components/common/` | Brand renderer and icon helpers | Only truly cross-workspace primitives/assets |
| `src/components/social/` | Social navigation and route definitions | Social shell only; not Seller/Inbox/Marketplace navigation |
| `src/features/<domain>/` | Extracted domain features/components | Canonical owner for reusable feature behavior and its component styles |
| `src/pages/<page>/` | Route controllers and page compositions | Own page orchestration/data binding; progressively move independent UI to features |
| `src/lib/` | Third-party client setup | Client initialization and library wrappers |
| `src/services/` | Backend-facing service helpers | Data/storage/network helpers; no page markup |
| `src/styles/` | Shared brand/navigation/base feature styles | Keep only truly shared styles/tokens; do not put page-only selectors here |
| `public/` | Static assets and browser metadata | Canonical static assets; avoid duplicate brand copies |
| `tests/` | Automated tests | Add component contract and consumer regression tests as modules are extracted |
| `supabase/` | Database migrations and archived drafts | Database changes remain separate from visual component work |

---

## 3. App startup and route ownership

### Startup chain

```text
index.html
  └── src/main.js
      ├── imports root styles and shared style sheets
      ├── initializes Supabase client
      ├── imports app/router.js
      └── starts route(home)
            └── app/router.js
                ├── resolves hash route
                ├── lazy-imports the matching page controller
                ├── renders page markup
                ├── schedules page data/event binding
                └── calls pages/seo.js
```

The router uses dynamic imports for multiple page controllers. That is a useful foundation for route-level code splitting, but actual chunk boundaries and download size must be verified from a production build.

### Route → page controller map (from `src/app/router.js`)

| User-facing area | Canonical route(s) / aliases | Current page owner | Current status |
|---|---|---|---|
| Public Home | `#/`, `#/home`, `#/feed`, `#/beranda`, `#/guest` | `pages/home/index.js` | Page controller composes Public Home feature layout |
| Personal profile | `#/@username` | `pages/account/index.js` | Account controller handles profile mount |
| Public user blog | `#/@username/blog/...` | `pages/blog-studio/index.js` | Public blog mount |
| Account / Social sections | `#/account/*` | `pages/account/index.js` | Large legacy controller; section extraction ongoing |
| Login / Register / recovery | `#/login`, `#/register`, `#/account/auth`, recovery state | `pages/account/index.js` + `features/auth` | Auth feature partly extracted |
| Account settings | `#/account/settings` | `pages/account/index.js` + `security-settings.js` | Partial extraction |
| GeoDirectory | `#/places`, aliases `provider`, `suppliers`, `jasa` | `pages/directory/index.js` | Listing controller |
| Place profile / claim | `#/place/:slug`, `#/place/:slug/claim` | `pages/directory/index.js` | Async page mount |
| Marketplace catalog | `#/marketplace`, aliases `material`, `materials`, `logistik`, `delivery` | `pages/marketplace/index.js` | Several commerce states in one controller |
| Storefront | `#/shop/:username` | `pages/marketplace/index.js` | Same Marketplace controller |
| Product detail | `#/market-product/:id` | `pages/marketplace/index.js` | Same Marketplace controller |
| Cart | `#/market-cart`, alias `#/cart` | `pages/marketplace/index.js` | Same Marketplace controller |
| Checkout | `#/market-checkout`, alias `#/checkout` | `pages/marketplace/index.js` | Same Marketplace controller |
| Orders / order detail | `#/market-orders`, `#/market-order/:id`, aliases `#/orders`, `#/order/:id` | `pages/marketplace/index.js` | Same Marketplace controller |
| Trip home | `#/trip` | `pages/trip/index.js` | Itinerary and provider request flows |
| Trip itinerary | `#/trip/itinerary/:id` | `pages/trip/index.js` | Same Trip controller |
| Inbox | `#/inbox`, legacy `#/messages` redirects here | `pages/messages/index.js` | Inbox controller; sidebar extracted |
| Inbox settings | `#/inbox/settings` | `pages/messages/settings.js` | Separate settings page module |
| Admin moderation | `#/admin/moderation` | `pages/admin/moderation.js` | Isolated controller |
| Discovery Search | `#/search?q=...` | `pages/search/discovery.js` | Separate search page; search intent contract needs audit |
| Blog / Guides / Article | `#/blog`, `#/guides/:slug`, `#/article/:slug` | `pages/blog/index.js` | Public editorial page |
| Help / FAQ | `#/help`, `#/faq` | `pages/help/index.js` | Help center |
| Terms / Privacy / Guidelines | `#/terms`, `#/privacy`, `#/guidelines` | `pages/help/index.js` | Legal content |
| About / Contact / Promo / Reviews / Recent | matching route names | `pages/misc/index.js` | Shared misc controller |
| Seller Center | `#/seller` | `pages/seller/index.js` | Seller navigation extracted; controller still large |
| Blog Studio | `#/account/blog` | `pages/blog-studio/index.js` | Authoring workspace |

**Route ownership rule:** aliases must resolve to the canonical route/controller. Do not create a duplicate page or component just because a route alias exists.

---

## 4. Current component and feature catalogue

This catalogue separates actual extracted modules from markup still living inside page controllers.

### 4.1 Brand and shared UI

| Canonical user-facing name | Current source | Responsibility | Status |
|---|---|---|---|
| PLUITS Brand Logo | `components/common/brand.js` + `styles/brand.css` + `public/assets/brand/pluits-logo.svg` | Brand mark renderer; optional wordmark | Existing canonical renderer; call-site sizing inconsistent |
| Shared Icon Registry | `components/common/social-icons.js` | Named SVG icon renderer | Existing; inspect overlap with other icon sources |
| Legacy UI Icon Map | `components/common/icons.js` and `app/ui.js` | Existing icon maps/helpers | Duplicate icon sources need semantic audit |
| Generic App Shell | `app/ui.js` | Header, footer, bottom navigation, page heading, hero, toast | Existing helper; not a universal workspace shell |
| Page Transition | `styles/page-transitions.css` | Route entrance/loading transition styling | Existing global behavior |

### 4.2 Social / Circle

| Canonical user-facing name | Current source | Responsibility | Status |
|---|---|---|---|
| Social Navigation | `components/social/navigation.js` | Social header/mobile nav variants | Existing; shared consumers need full audit |
| Social Route Registry | `components/social/navigation-routes.js` | Canonical social destinations | Existing |
| Social Post Actions | `features/posts/post-actions.js` + CSS | Like/comment/share/save controls | Extracted actions only; not the full post |
| Instagram Post Card | `pages/account/index.js` + `pages/account/user-account.css` | Full post composition | No verified single canonical public component yet |
| Reel Card | `features/reels/reel-card.js` + CSS | Video post/card rendering | Existing feature module |
| Story Card / Story Rail | Account/Public Home compositions and Circle CSS | Story identity/media presentation and rail | Canonical card boundary not verified |
| Top Ten Card | `features/discovery/top-ten-cards.js` | Top Ten discovery cards | Existing renderer |
| People Recommendation Card | `features/discovery/people-recommendations.js` + CSS | Person recommendation cards and ranking helper | Existing renderer and ranking logic; split API/visual ownership if necessary |
| Profile Hero | `features/profile/profile-hero.css` + Account controller | Profile identity/hero | Partial CSS extraction; markup/state still in Account |
| Profile Image Framing | `features/profile/image-framing.js` + CSS | Crop/frame settings and CSS helper | Existing helper |

### 4.3 Public Home

Owner: `features/public-home/`; page controller: `pages/home/index.js`.

| Section / component | Current source | Status |
|---|---|---|
| Public Home Layout | `layout.js` | Extracted composition |
| Public Navbar | `navbar.js` + `navbar.css` | Extracted |
| Hero | `hero.js` | Extracted |
| Discovery | `discovery.js` | Extracted |
| Nearby | `nearby.js` | Extracted; data integration crosses Directory |
| Stories | `stories.js` | Extracted section shell; underlying story card contract needs audit |
| Marketplace Preview | `marketplace.js` | Extracted section |
| Join CTA | `join.js` | Extracted |
| Footer | `footer.js` | Extracted |
| Public Home section styles | `public-home.css` plus legacy `styles/home-layout.css` | CSS ownership/import graph needs cleanup audit |

### 4.4 Inbox / Messages

| Component | Current source | Status |
|---|---|---|
| Inbox Page Controller | `pages/messages/index.js` | Owns conversation data/events and much markup |
| Inbox Sidebar | `features/inbox/inbox-sidebar.js` | Renderer extracted; data and tab state remain with controller |
| Contact Search | Inside Inbox controller | Canonical search component not extracted/verified |
| Conversation Row | Inside Inbox controller | Audit/extraction required |
| Chat Panel / Message List | Inside Inbox controller | Audit/extraction required |
| Message Composer | Inside Inbox controller | Audit/extraction required |
| Inbox Header / Contact Strip | Inside Inbox controller | Audit/extraction required |
| Inbox Settings | `pages/messages/settings.js` + CSS | Separate page module |

Personal Inbox and Store Inbox README placeholders exist under `pages/inbox-personal/` and `pages/inbox-toko/`; they are not yet proof of two implemented inbox products.

### 4.5 Seller Center

| Component | Current source | Status |
|---|---|---|
| Seller Page Controller | `pages/seller/index.js` | Existing; still substantial page composition/data |
| Seller Navigation | `features/seller/seller-navigation.js` | Renderer extracted |
| Store Switcher | Seller controller | Audit/extraction required |
| Dashboard Widgets | Seller controller | Audit/extraction required |
| Product Management | Seller controller | Audit/extraction required |
| Category Management | Seller controller | Audit/extraction required |
| Inventory | Seller controller | Audit/extraction required |
| Delivery | Seller controller | Audit/extraction required |
| Store Profile / Settings | Seller controller | Audit/extraction required |

### 4.6 Marketplace

Current route states are implemented in `pages/marketplace/index.js`. They are not all independent feature modules yet.

- Marketplace Catalog
- Storefront
- Product Detail
- Cart
- Checkout
- Order List
- Order Detail
- Product Card / Seller Card / Gallery / Filter / Cart Line / Checkout Form / Order Summary: audit and extraction required

Do not merge Marketplace navigation with Social, Seller Center or Trip navigation. Reuse only verified shared primitives.

### 4.7 GeoDirectory and Trip

**GeoDirectory** — `pages/directory/index.js` + `directory.css`:
- Nearby section/card integration
- Place discovery
- Place detail
- Provider claim
- Destination Card / Service Card / Place Search / filter controls: audit required

**Trip** — `pages/trip/index.js`:
- Trip landing
- Itinerary list/detail
- Itinerary creation
- Provider service requests
- Destination discovery
- Itinerary Stop / Destination Card / Provider Card / Trip shell: audit required

### 4.8 Other workspaces

| Workspace | Current owner | Main extraction needs |
|---|---|---|
| Auth | `features/auth/` + Account page | Auth forms, session states, shared field controls |
| Blog | `pages/blog/index.js` | Article card, author block, tag/topic, related content |
| Blog Studio | `pages/blog-studio/index.js` + CSS | Editor panels, media picker, publishing controls |
| Help / Legal | `pages/help/index.js` + CSS | FAQ row, help search, article layout |
| Admin Moderation | `pages/admin/moderation.js` | Moderation queue, review item, action panel |
| App Download | `features/app-download/` | Existing app-download UI |
| Media | `features/media/` | Media types and upload service helper |
| Storage | `services/storage/signed-urls.js` | Signed URL mapping helper |

---

## 5. Design system — current source facts and gaps

### 5.1 Brand

- Canonical SVG: `public/assets/brand/pluits-logo.svg`.
- Favicon currently uses the same SVG source.
- Renderer: `src/components/common/brand.js`.
- Shared style: `src/styles/brand.css`.
- Renderer API: `renderBrandLogo({ href, className, size, label, wordmark })`.
- Existing wordmark mode outputs the text “PLUITS”. Public Home also has a separate wordmark markup path; that means the two intended brand modes are not yet controlled through one consistent placement contract.

**Verified current mark sizing calls:**
- Social header: 38px renderer argument.
- Circle header: 34px renderer argument.
- Other Social header: 38px renderer argument.
- Message header: 36px renderer argument.
- Public Home navbar: 30px mark plus separate wordmark.
- Social/Circle mobile selectors reduce specific classes to 30px; Message uses a different class not covered by the same override. This is a verified source-level reason the Circle and Message logo sizes differ.

**Target naming for brand placements (names only; values need visual approval):**
- `Brand Mark / Compact`
- `Brand Mark / Navigation`
- `Brand Lockup / Compact` (mark + wordmark)
- `Brand Lockup / Header` (mark + wordmark)
All must use the same canonical SVG and wordmark treatment; context-specific size roles may differ intentionally.

### 5.2 Typography

Current root family declaration in `src/style.css`:
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Existing values observed:
- Shared label token: 12px.
- Shared caption token: 11px.
- Social body: 13px.
- Social label: 11px.
- Social mobile nav label: 9px.
- Post metadata: 10px.
- Profile identity: 13px.
- Profile tabs: 12px desktop, 10px mobile, 9px narrow.
- Public navbar register label: 12px.
- Local weights include 400/450, 550/600, 650/700, 750/800/850.

These are current implementation observations, not the final approved type scale. Need complete line-height, letter-spacing, heading and actual font asset/loading audit. Avoid adding another font family before that is done.

### 5.3 Color families

Observed source groups:
- Social: navy ink `#172b45`, muted `#738092`, border `#e8edf1`.
- Public Home teal accent: `#168f87`.
- Public navbar/wordmark neutrals: `#34474c`, `#65757a`, `#7c898d`.
- Root legacy green family: `#0b6b55`, `#075541`, `#e9f5f0`.
- Root legacy general ink/muted/line: `#17221f`, `#68746f`, `#e4e9e6`.
- Existing semantic warning/danger: `#f4b740`, `#d94b45`.

Do not assume these are one approved palette. Need resolve brand roles and semantic tokens after call-site/contrast audit.

### 5.4 Geometry and effects

Current global tokens found in `src/style.css`:
- General icon 20px; nav icon 22px.
- Touch target 44px.
- Search height 46px.
- Public header 60px mobile / 68px wide.
- Radius: 10px / 16px / 24px.
- Main container 1200px.
- Existing small and regular shadow tokens.

Local dimensions exist for avatars, cards, rails, profile and feature controls. They must be classified by role rather than indiscriminately replaced with one number.

### 5.5 Icon sources

Current icon sources:
- `components/common/social-icons.js` — named SVG path registry.
- `components/common/icons.js` — another icon map.
- `app/ui.js` — another icon helper.
- `public/icons.svg` — SVG sprite.
- `features/posts/post-actions.js` — action SVG implementation.

This is a potential duplication cluster. It needs a semantic name/call-site/stroke/accessibility audit before consolidation. No icon set should be replaced during the mapping phase.

### 5.6 Avatar role catalogue — observed sizes

| Role name for future requests | Current context | Observed current size |
|---|---|---:|
| Story Avatar | Circle story ring | 66px outer ring |
| People Recommendation Avatar | People recommendation card | 68px |
| Inbox Contact Strip Avatar | Message contact strip | 48px |
| Inbox Conversation Avatar | Conversation/contact row | 38px |
| Reel Author Avatar | Reel header | 36px |
| Profile Avatar | Profile hero | 104px desktop / 72px mobile / 60px narrow |

These are context-specific sizes, not one-size-fits-all. Future shared Avatar primitive should own image/fallback/accessibility; named wrappers or size roles own the intended geometry.

---

## 6. Carousel and horizontal-rail catalogue

“Carousel” is not one component name. The current repository contains several scroll structures with different content and layout contracts.

| Canonical pattern name | Current selector / owner | Content and behavior |
|---|---|---|
| Story Ring Rail | `.ua-circle-story-track` / Account Circle | Circular story identities; horizontal swipe/scroll |
| People Card Rail | `.ua-people-track` / People Recommendations | Person cards; horizontal scroll and mandatory snap |
| Inbox Contact Rail | `.pl-msg-people-strip` / Messages | Contact avatars; horizontal scroll |
| Nearby Place Rail | `.pl-home-map-results` / Directory | Place cards |
| Nearby Topic Rail | `.pl-nearby-topic-carousel` / Directory | Topic chips/cards; separate content contract from place cards |
| Seller Product Rail | `.pluits-product-list` / Seller Center | Horizontal product list with snap |
| Product Gallery Rail | `.pluits-product-gallery` / Seller Center | Product image/gallery strip with responsive behavior |
| Topic Content Rail | `.ua-home-topic-carousel` / Account Circle | Topic/content cards |
| Vertical Reel Feed | `.ua-reels-feed` / Reels | Vertical 9:16 video feed; not a horizontal carousel |

**Layout modes to register:**
- **Contained Horizontal Rail** — rail stays inside the parent content width/padding.
- **Full-Bleed Horizontal Rail** — rail reaches the viewport edge; card track scrolls within the visible screen boundary.
- **Centered Card Carousel** — cards are centered/positioned with explicit slide state or controls, only if current source confirms that behavior.

Full-Bleed and Contained are layout modes, not permission to fork the scroll implementation. Preserve the approved Circle full-width behavior when touching that owner.

Each rail contract must record: content type, card component, card width rules, gap, start/end edge padding, snap mode, scroll behavior, navigation controls, mobile/desktop behavior, accessibility and reduced motion.

---

## 7. Search ownership catalogue

Search is separated by intent even if the input field looks similar:

| Canonical name | Owner | Owns |
|---|---|---|
| Friends Search / People Search | Discovery / People | Person query, friend filters and people results |
| Content Search | Social Feed / Discovery | Posts, stories and other content |
| Product Search | Marketplace | Product catalogue, categories, price and commerce filters |
| Contact Search | Inbox | Conversation/contact lookup |

A low-level Search Input may be shared only when its contract matches. Do not share query semantics, filters, result state or data access across domains.

---

## 8. Current stylesheet inventory — all 24 CSS files

| File | Current scope / owner |
|---|---|
| `src/style.css` | Root/global baseline; large legacy CSS inventory |
| `styles/home-layout.css` | Public Home legacy/layout styles |
| `src/styles/brand.css` | Shared brand logo styling |
| `src/styles/page-transitions.css` | Global route transitions |
| `src/styles/social-components.css` | Social shared component styling |
| `src/styles/social-navigation.css` | Social navigation |
| `src/features/app-download/app-download.css` | App Download feature |
| `src/features/auth/register.css` | Registration UI |
| `src/features/discovery/people-recommendations.css` | People recommendation cards/rail |
| `src/features/posts/post-actions.css` | Post action controls |
| `src/features/profile/image-framing.css` | Profile image framing |
| `src/features/profile/profile-hero.css` | Profile hero styles |
| `src/features/public-home/navbar.css` | Public Home navbar |
| `src/features/public-home/public-home.css` | Public Home feature styles |
| `src/features/reels/reels.css` | Reels |
| `src/pages/account/user-account.css` | Account/Social legacy styles |
| `src/pages/account/circle-experience.css` | Circle experience |
| `src/pages/blog-studio/blog-studio.css` | Blog Studio |
| `src/pages/directory/directory.css` | GeoDirectory |
| `src/pages/help/help.css` | Help/Legal |
| `src/pages/messages/messages.css` | Inbox/Messages |
| `src/pages/messages/settings.css` | Inbox settings |
| `src/pages/search/discovery.css` | Discovery Search |
| `src/pages/seller/seller.css` | Seller Center |

**CSS ownership debt:** `src/style.css` and `src/pages/account/user-account.css` are large. `styles/home-layout.css` sits outside `src/styles`. Some page controllers import feature CSS directly. Next audit must trace every import, selector namespace, override and actual route consumer before moving styles. No mass stylesheet relocation.

---

## 9. Current JavaScript inventory — grouped by ownership

### App / bootstrap
- `src/main.js`
- `src/app/models.js`
- `src/app/router.js`
- `src/app/ui.js`

### Common / Social components
- `src/components/common/brand.js`
- `src/components/common/icons.js`
- `src/components/common/social-icons.js`
- `src/components/social/navigation.js`
- `src/components/social/navigation-routes.js`

### Feature modules
- App Download: `features/app-download/app-download.js`
- Auth: `features/auth/auth.js`, `features/auth/register.js`
- Discovery: `features/discovery/nearby-card.js`, `people-recommendations.js`, `top-ten-cards.js`
- Inbox: `features/inbox/inbox-sidebar.js`
- Media: `features/media/media-types.js`, `storage-upload.js`
- Posts: `features/posts/post-actions.js`
- Profile: `features/profile/image-framing.js`
- Public Home: `features/public-home/layout.js`, `navbar.js`, `hero.js`, `discovery.js`, `nearby.js`, `stories.js`, `marketplace.js`, `join.js`, `footer.js`
- Reels: `features/reels/reel-card.js`
- Seller: `features/seller/seller-navigation.js`

### Page controllers
- Account: `pages/account/index.js`, `account-context.js`, `drafts.js`, `security-settings.js`
- Admin: `pages/admin/moderation.js`
- Blog: `pages/blog/index.js`
- Blog Studio: `pages/blog-studio/index.js`
- Directory: `pages/directory/index.js`
- Help: `pages/help/index.js`
- Public Home: `pages/home/index.js`
- Marketplace: `pages/marketplace/index.js`
- Messages: `pages/messages/index.js`, `settings.js`
- Misc: `pages/misc/index.js`
- Search: `pages/search/discovery.js`
- Seller: `pages/seller/index.js`
- SEO: `pages/seo.js`
- Trip: `pages/trip/index.js`

### Library and service modules
- `src/lib/supabase/client.js`
- `src/services/storage/signed-urls.js`

---

## 10. Tests currently present

| Test file | Area covered |
|---|---|
| `tests/app/auth-registration-routing.test.js` | Auth/registration routing |
| `tests/app/brand-profile-settings.test.js` | Brand/profile/settings |
| `tests/app/router-loading.test.js` | Router loading behavior |
| `tests/app/social-navigation.test.js` | Social navigation |
| `tests/features/app-download.test.js` | App Download |
| `tests/features/media-types.test.js` | Media type helpers |
| `tests/features/people-recommendations.test.js` | People recommendations |
| `tests/services/signed-urls.test.js` | Signed URL helper |

Current test coverage is concentrated in routing, navigation, auth, selected features and storage. There are no verified dedicated tests yet for the full Instagram Post, Story Rail, Message components, Marketplace cards/rails, Seller components or all design-token consumers.

---

## 11. Target modular structure — proposed, not yet implemented

This is the recommended destination for gradual extraction. It deliberately separates design foundations, shared primitives, reusable patterns, domain components, page composition and services. It does not require a framework migration.

```text
src/
├── app/                         # startup, router, guards, lifecycle
├── design-system/
│   ├── tokens/                  # semantic color/type/space/radius/shadow/motion
│   ├── brand/                   # canonical mark, wordmark, lockup rules
│   ├── icons/                   # one semantic icon registry + sprite policy
│   └── foundations/             # typography, surfaces, interaction states
├── components/
│   ├── primitives/              # Button, Icon, Avatar, Badge, Input, Divider
│   ├── patterns/                # SearchInput, Tabs, Dialog, HorizontalRail
│   └── social/                  # Social Navigation + route registry
├── features/
│   ├── social/
│   │   ├── posts/               # canonical Instagram Post + post actions
│   │   ├── stories/             # Story Card + Story Ring Rail
│   │   ├── profile/             # Profile Hero and profile identity
│   │   ├── people/              # Friends Search + People Cards
│   │   └── reels/               # Reel Card + vertical feed
│   ├── inbox/                   # Contact Search, conversation row, chat panel
│   ├── marketplace/             # Product Search, Product Card, cart/checkout
│   ├── seller/                  # Seller Navigation, product management
│   ├── directory/               # Place/Destination/Service cards and search
│   ├── trip/                    # itinerary stops, provider cards and trip flow
│   ├── auth/
│   ├── media/
│   ├── discovery/
│   └── public-home/
├── pages/                       # route controllers; compose features only
├── services/                    # Supabase, storage, media, notifications, etc.
├── lib/                         # external library/client wrappers
└── styles/                      # reset and truly global entry styles only
```

### Migration rules

1. Do not move every file to match this drawing immediately.
2. First create a verified registry: canonical name, owner, current path, public export, consumers, CSS namespace, data/state owner, tests.
3. Extract the complete Instagram Post from Account composition before building another post implementation.
4. Establish the canonical Avatar/Brand/Icon contracts without forcing all contexts to one physical size.
5. Extract Story Card and Story Ring Rail separately; card and rail have different responsibilities.
6. Consolidate horizontal rail mechanics only where contracts match; preserve Full-Bleed vs Contained layout modes.
7. Extract Inbox, Seller, Marketplace, Directory and Trip components workspace by workspace.
8. Migrate tokens only after the source values and all consumers have been audited.
9. Use lazy imports and route-level chunks; avoid loading unrelated workspace code on first page.
10. Keep business/data/auth logic in page/domain/service layers, not inside generic presentation primitives.

---

## 12. User-facing request dictionary

These are the names the product owner can use in voice notes. Each name must resolve to exactly one canonical component or one clearly scoped pattern.

| User says | Engineering resolves to |
|---|---|
| “Logo PLUITS” | Brand Logo; ask mark-only or mark + wordmark only if context is not clear |
| “Avatar Story” | Story Avatar size role |
| “Avatar Message” | Inbox Contact / Conversation Avatar according to placement |
| “Post Instagram” | Canonical Instagram Post Card |
| “Story” | Story Card; if rail behavior is requested, Story Ring Rail |
| “Carousel Circle full width” | Full-Bleed Horizontal Rail in Circle context |
| “Carousel biasa dalam kontainer” | Contained Horizontal Rail |
| “Carousel produk” | Product Rail / Product Gallery Rail; clarify which when ambiguous |
| “Reels” | Reel Card or Vertical Reel Feed according to requested part |
| “Pencarian teman” | Friends Search / People Search |
| “Pencarian konten” | Content Search |
| “Pencarian produk” | Product Search |
| “Pencarian pesan/kontak” | Contact Search |
| “Sidebar Inbox” | Inbox Sidebar |
| “Sidebar Seller” | Seller Navigation |
| “Sidebar” alone | Ambiguous; ask which workspace |

A voice request naming a canonical component must update its owner and all consumers. Never patch only the page currently visible if the component is shared.

---

## 13. Remaining audit work before calling the component catalogue exhaustive

The source file tree is enumerated above. The semantic component map still has these work items:

- [ ] Trace all imports and call sites for brand/logo, including wordmark and mobile overrides.
- [ ] Audit every icon registry and icon consumer; identify exact duplicate paths and stroke/size differences.
- [ ] Extract the full Instagram Post markup, styles, actions, media, states and every render site.
- [ ] Map Story Card and Story Rail separately, including Circle and Public Home consumers.
- [ ] Complete Avatar source/call-site map and define role-based contracts.
- [ ] Enumerate all CSS custom properties and literal color/font/spacing/radius/shadow values across all 24 stylesheets.
- [ ] Trace CSS import order, selector collisions and cross-page leakage.
- [ ] Map every horizontal rail's card, gap, width, snap, edge padding, full-bleed and responsive behavior.
- [ ] Audit hover/active/focus/disabled/loading/error/reduced-motion per canonical component.
- [ ] Extract Inbox components and identify personal/store inbox boundaries.
- [ ] Extract Seller Center widgets and forms.
- [ ] Extract Marketplace product/seller cards, search, gallery, cart and checkout modules.
- [ ] Extract GeoDirectory and Trip cards/forms.
- [ ] Add consumer regression tests and visual screenshots for shared components.
- [ ] Run production build and inspect route chunks/network payload on mobile.

**This is the complete current file/folder and route map from the audited repository tree. It is not a false claim that every component has already been fully extracted or that every CSS declaration has been normalized. The remaining checklist is the exact work required to finish that deeper semantic audit.**

---

## 14. Change-scope statement

This document is documentation only. It does not change:
- any page layout;
- logo dimensions or wordmark rendering;
- fonts, font sizes or weights;
- colors, borders, shadows, spacing or radius;
- carousel/scroll behavior;
- JavaScript runtime behavior;
- Supabase schema or policies.

Any production changes must be proposed and reviewed as a separate, narrowly scoped implementation after the inventory and design-system contract are accepted.
