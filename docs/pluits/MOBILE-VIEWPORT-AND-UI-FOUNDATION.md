# PLUITS Mobile Viewport, Layout & Reuse Foundation

**Status:** Active structural baseline, 15 November 2026  
**Scope:** All current and future routes, mobile web, installed/PWA browser mode and desktop workspaces.

## 1. Mobile canvas contract

A phone screen is a responsive viewport, not a fixed design canvas. Do not hardcode a device model's physical resolution. CSS layout uses the available CSS-pixel viewport and adapts continuously.

Reference QA widths:
- 320 CSS px: narrow-device regression.
- 360 CSS px: compact Android baseline.
- 390 CSS px: common modern-phone baseline.
- 430 CSS px: large-phone baseline.
- 760 CSS px: existing mobile/tablet navigation boundary to be retained until a controlled responsive migration.
- 768–1024 CSS px: tablet checks.
- 1200+ CSS px: desktop content/container checks.

The reference Beranda is fluid at 100% available width. At mobile widths it uses 12–16px horizontal gutters depending on width; content must not exceed the viewport or create page-level horizontal overflow. A full-bleed media viewer is an explicit named layout variant, not the default page container.

Use dynamic viewport height (`100dvh`) with a fallback to `100vh`. Respect `env(safe-area-inset-*)` for fixed headers, bottom navigation, full-screen media, sheets and composers. The browser's changing address/status bars and on-screen keyboard must not cover essential controls.

## 2. Canonical geometry tokens

Runtime tokens live in `src/design-system/tokens/foundation.css`:
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px.
- Mobile page gutter: 16px; compact <=360px: 12px.
- Content max: 1200px; reading max: 720px; workspace max: 1440px.
- Standard controls: 44px; dense documented controls: 40px.
- Search: 44px.
- Radius scale: 8, 12, 16, 24px.
- Icon artwork: 16, 18, 20, 22, 24, 28px.

Do not choose a new value for one page when an existing token/variant fits. Add a token only when it expresses a stable semantic role and record its consumers.

## 3. Page layout patterns

Every route chooses a named layout:
- `public-page`: public header, fluid content container, sections and footer.
- `social-workspace`: social header, scrollable page content and fixed mobile navigation.
- `immersive-media`: full-viewport media with safe-area overlays; no inherited social bottom nav unless explicitly required.
- `workspace`: desktop/sidebar and mobile workspace navigation owned by that feature.
- `form-flow`: focused task flow; chrome may be omitted only when the flow specification says so.

Pages reuse the layout primitive, not another page's entire navigation or business behavior. Each route has one page controller. Page composition stays in `src/pages/<page>/`; behavior-rich sections stay in their owning `src/features/<domain>/`.

## 4. Component contract

A reusable component must document: stable ID, owner, public API, state owner, data/service dependencies, CSS namespace, consumers, responsive variants, accessibility, loading/empty/error/disabled states and tests.

Shared foundation components may include buttons, inputs, icon buttons, avatars, badges, dividers, surfaces, search visuals and dialog primitives. Feature wrappers retain their own query/data/action semantics.

CSS ownership:
- `src/style.css`: legacy global base currently under migration; do not add new page-specific rules.
- `src/design-system/tokens/`: tokens only.
- `src/styles/`: reset, truly global behavior and shared component namespaces.
- `src/features/<feature>/`: feature-owned component styles.
- `src/pages/<page>/`: page-only composition.
- Root `styles/home-layout.css`: legacy stylesheet; its public-home and social-home selectors must be audited before relocation.

Never fix one page with a broad selector that changes another workspace. Avoid append-only overrides; edit the owning declaration and add a consumer regression test.

## 5. Icon and asset policy

Use local repository-owned inline SVG through `src/design-system/icons/index.js`. No external icon CDN, icon font or remote runtime icon renderer. Inline SVG avoids a separate icon network request and gives stable artwork and size. SVG files are appropriate for logos/illustrations; raster images are for photographic content and must use responsive dimensions, modern formats where available, lazy loading below the fold and explicit dimensions/aspect ratio to reduce layout shift.

New icon additions must be registered, locally stored where appropriate, licensed, named semantically and tested at standard icon sizes. Do not introduce a second icon library without a measured gap.

## 6. Runtime/performance rules

- Route-level dynamic imports remain the primary page code-splitting boundary.
- Feature code is imported by its owning page; do not load every feature from app bootstrap.
- Avoid eager network work for pages not visited.
- Images below the fold use lazy loading and stable aspect ratios; video sources load only near/when active and offscreen videos pause.
- Do not preload multiple large videos or large image galleries by default.
- Use bounded database/storage requests and deduplicate repeated signed URLs.
- Avoid long main-thread tasks, repeated DOM-wide scans, unnecessary timers/listeners and duplicated subscriptions.
- Event listeners, observers, timers and realtime channels need cleanup when their page/feature unmounts.
- Measure real built chunks and network waterfalls before declaring performance improvements. Build size is not a device latency benchmark.

## 7. Change / page creation SOP

1. Identify canonical route and page controller.
2. Read the page/component ownership audit and route registry.
3. Search the component, token, layout, icon and asset registries.
4. Trace exact consumers, CSS selectors, imports, services and state ownership.
5. Reuse the existing primitive/variant. Create a new one only with a documented gap.
6. Keep behavior in the feature that owns it; keep shared components data-agnostic.
7. Use the mobile canvas and token scale; test 320/360/390/430 widths, then tablet/desktop.
8. Test keyboard, safe areas, reduced motion, focus, touch targets, loading/empty/error states and horizontal overflow.
9. Run `npm test`, `npm run build`; inspect route chunks and CSS output.
10. Verify target route and sibling consumers; record commit, CI, deployment and device-UAT status.
11. Update the relevant registry and this SOP when a shared foundation changes.

## 8. Current audit findings and migration debt

Verified from repository source on 15 November 2026:
- `src/style.css` is approximately 286 KB and `src/pages/account/user-account.css` approximately 202 KB. These are high-priority stylesheet decomposition candidates, but must be split by ownership rather than mass-moved.
- `src/pages/account/index.js` is approximately 168 KB: the account controller remains a large legacy composition despite extracted posts, profile, media and Reels modules.
- `src/pages/account/circle-experience.css` is approximately 67 KB and needs section-level ownership mapping.
- `styles/home-layout.css` is approximately 27 KB and is imported from app bootstrap; it contains home-specific selectors and some social icon rules. This is an eager CSS coupling candidate.
- General icons and social icons currently have separate maps. The new design-system facade provides one preferred import path, but legacy maps are not yet deduplicated.
- `src/design-system/tokens/README.md` previously described tokens as planned; the foundation runtime stylesheet now provides the first structural token layer. Existing color/typography values remain legacy until separately reconciled.
- Route-level dynamic imports already exist in `src/app/router.js`; retain them and avoid regressing code splitting.
- The root bootstrap currently imports global styles and starts global presence. Audit realtime lifecycle and initial CSS separately; do not remove presence behavior without product requirements.

## 9. Migration sequence

P0 — Add/maintain structural tokens, icon facade, route/page ownership and CSS namespace checks.  
P1 — Split the account controller and account stylesheet into owned feature sections with compatibility exports.  
P1 — Split `src/style.css` by actual selector consumers; keep only reset/base/tokens globally.  
P1 — Move public-home CSS out of bootstrap and load it with the public-home route where safe.  
P2 — Consolidate icon maps after all consumers are mapped and visual regressions are tested.  
P2 — Audit asset dimensions, image formats, lazy loading, video preloading and service-worker caching.  
P2 — Add automated viewport/layout and bundle-budget checks.  
P3 — Add device-level performance budgets and repeatable Android UAT.

Do not claim all routes are fully modularized until each migration item is implemented and route regression evidence exists.
