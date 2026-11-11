# PLUITS — Page & Component Ownership Audit
**Date:** 12 November 2026  
**Branch:** main

## 1. Non-negotiable ownership rule

Every canonical route belongs to one page controller. Each page controller composes its own layout and feature components. A sidebar, header, tab bar, toolbar, list, panel or modal belongs to the workspace/feature that owns its behavior. Similar appearance is not permission to share behavior.

- Seller Center / Brand workspace navigation belongs to features/seller.
- Inbox conversation sidebar belongs to features/inbox.
- Social global navigation belongs to components/social and uses the canonical route registry.
- Marketplace navigation/layout belongs to Marketplace; Trip navigation/layout belongs to Trip. Neither reuses a Seller or Inbox sidebar.
- Shared components are allowed only when purpose, behavior, accessibility and contract are genuinely the same. Reuse a primitive, not another page's complete sidebar.
- Page-specific CSS stays in that page/feature namespace. No global selector or cross-page override to fix a local issue.
- A page may import a shared component; shared components may not import page controllers or fetch page data.
- One feature must not import another feature's private implementation. Cross-feature integration uses a documented public export/contract.

## 2. Current route-to-owner inventory

The canonical route registry remains the source for route names and aliases. This table identifies implementation owners and the next modular boundary.

| Navigation/page area | Canonical route | Page controller | Layout / feature ownership | Audit state |
|---|---|---|---|---|
| Public Beranda | #/ | pages/home | Public home layout; shared social navigation; feed/discovery features | Page exists; composition needs decomposition |
| Signed-in Beranda / Feed | #/account/explore | pages/account | Social shell; feed, Top 10, stories, post cards | Account controller remains a large legacy composition |
| Jelajah | #/search | pages/search | Discovery layout, filters, result cards | Page module exists; feature boundaries need audit |
| Buat / Composer | account compose routes | pages/account | features/media, features/posts, features/reels | Media primitives partly extracted; composer remains in account |
| Profil | #/account/profile*, #/@username | pages/account | features/profile owns profile hero and profile-specific UI | Hero partly extracted; remaining behavior needs decomposition |
| Inbox | #/inbox | pages/messages | features/inbox owns conversation sidebar; social bottom nav remains shared | Sidebar renderer extracted in this change; controller retains data/events |
| Inbox settings | #/inbox/settings | pages/messages/settings | Inbox-settings page and styles | Separate page controller exists |
| Notifikasi / Activity | #/account/activity | pages/account | features/notifications target; canonical social nav | Still a route state in account controller |
| Marketplace | #/marketplace | pages/marketplace | Marketplace shell, catalog, seller cards | Controller owns multiple subroutes; needs feature split |
| Storefront / Product detail | #/shop/:slug, #/market-product/:id | pages/marketplace | Storefront and product-detail features | Route states in Marketplace controller |
| Cart / Checkout / Orders | #/market-cart, #/market-checkout, #/market-orders, #/market-order/:id | pages/marketplace | Separate cart, checkout and order features/layout states | Must remain isolated from social saved items and social navigation |
| Seller Center / Brand workspace | #/seller and seller subroutes | pages/seller | features/seller owns Seller navigation/sidebar, store switcher, dashboard widgets and seller forms | Navigation renderer extracted; dashboard/data controller remains large |
| GeoDirectory | #/places, #/place/:slug* | pages/directory | Directory search, place profile, claim and provider components | Page module exists; section-level audit required |
| Trip | #/trip, #/trip/itinerary/:id | pages/trip | Trip shell, itinerary, provider requests and destination cards | Controller owns multiple sections; needs feature split |
| Blog / Guides | #/blog, #/guides, #/article/:slug | pages/blog | Blog listing, guide, article layouts | Page module exists; section-level audit required |
| Help / Legal | #/help, #/faq, #/terms, #/privacy, #/guidelines | pages/help | Help center and legal article layouts | Page module exists; section-level audit required |
| Misc information | #/about, #/contact, #/promo, etc. | pages/misc | Each page state has a named section/layout owner | Shared controller; inspect before adding more states |
| Admin moderation | #/admin/moderation | pages/admin | Moderation workspace and review components | Page module exists; isolated admin layout required |

Aliases are not new pages. Follow PAGE-ROUTE-AND-SECTION-REGISTRY.md; do not create duplicate controllers for aliases.

## 3. Target folder convention

Keep the current Vite / ES module architecture. Do not mass-move files or introduce a new framework.

    src/
      app/                         # bootstrap, router, guards, lifecycle
      pages/
        <page>/
          index.js                 # route composition only
          layout.js                # page/workspace frame when needed
          page.css                 # page-level composition only
      features/
        <domain>/
          components/              # domain-specific UI components
          sections/                # substantial page sections
          <component>.js           # public component renderer/controller
          <component>.css          # component-owned styles
          index.js                 # public feature exports where useful
          README.md                # ownership/API/dependencies for complex features
      components/
        common/                    # true cross-workspace primitives
        social/                    # canonical social navigation and route registry
      services/                    # backend, storage, realtime, cache, offline
      styles/                      # tokens/reset/truly global styles only

For a new page, create src/pages/<page>/index.js and its layout first. Put behavior-rich sections in src/features/<domain>/. A simple text-only section does not need a folder. Extract a component when it has independent behavior/state, meaningful complexity, reuse, dedicated styling, or needs independent tests.

## 4. Sidebar and layout isolation

| Component | Sole owner | Must not own / import |
|---|---|---|
| Seller Center sidebar + mobile workspace tabs | features/seller/seller-navigation.js | Inbox tabs, social nav, Supabase queries, page controller |
| Inbox conversation sidebar | features/inbox/inbox-sidebar.js | Seller navigation, global route definitions, Supabase client |
| Social header / bottom navigation | components/social/navigation.js | Seller/Marketplace/Trip workspace navigation or page-specific queries |
| Marketplace header and commerce shell | Marketplace feature/page | Social saved posts, Inbox tabs, Seller Center sidebar |
| Trip header and itinerary layout | Trip feature/page | Marketplace cart state, Inbox sidebar, Seller Center sidebar |
| Admin navigation/layout | Admin feature/page | User-facing workspace navigation |

The extracted sidebar renderers are presentational. Parent page controllers retain data fetching, state transitions and event binding. This prevents extraction from changing business behavior.

## 5. Change-scope contract

Before editing any page:
1. Name the exact route and page controller.
2. Name the section/component owner and its public export.
3. Trace imports, route callers, CSS selectors and backend/service dependencies.
4. List sibling workspaces that could be affected by shared components/styles.
5. Change only the owner module unless a shared contract change is necessary.
6. If a shared component changes, inspect every consumer and run route regression checks for all consumers.
7. Preserve route aliases, markup hooks, data attributes, accessibility semantics and API contracts unless the task explicitly changes them.
8. Add/update tests proving one page's component is not rendered/modified by another page.
9. Run npm test, npm run build, inspect changed files and verify the affected route plus sibling routes.
10. Record commit, CI, deployment and UAT independently.

Never claim every page is fully modular solely because each has a folder. A page is modular only when page composition, layout, feature behavior, component styles and service dependencies have clear owners.

## 6. Incremental migration order

1. Protect the existing route registry and global social navigation.
2. Finish Inbox decomposition: conversation sidebar, conversation list, chat panel, composer, online contacts, Inbox header/menu; keep each under features/inbox.
3. Finish Seller Center decomposition: sidebar/navigation, store switcher, overview widgets, products, categories, inventory, delivery, profile and settings; keep each under features/seller.
4. Decompose Account controller into feed, profile, activity/notifications, composer, saved and account-settings feature modules.
5. Decompose Marketplace into catalog, storefront, product detail, cart, checkout and orders, each with a focused shell/feature.
6. Decompose Trip into itinerary, destination discovery and provider-request features.
7. Audit Directory, Blog, Help, Misc and Admin section/layout ownership.
8. Add route-level smoke tests and visual regression coverage; only then remove compatibility code.

Do one owner at a time. No mass rewrite, no unrelated visual redesign, no route changes as part of a component extraction.
