# PLUITS Application Architecture — Mobile-first foundation

Status: Active engineering baseline. Target: Android/iOS mobile browsers first; PWA/Capacitor-ready after browser flows stabilize.

## Product workspaces
PLUITS is one application with distinct workspaces. Workspace chooses its shell; page composes content. Pages must not create competing global navigation.

Social mobile navigation has five equal slots: **Beranda → Jelajah → Buat (+) → Inbox → Profil**. On `#/messages`, slot four becomes **Notifikasi** because Inbox is already open. Other slots, positions and sizes remain fixed. Message unread and activity-notification counts are separate data.

Home/Explore header uses a logo asset slot (not hard-coded wordmark), quiet search and notification bell. Inbox header uses friend search, online contacts and notification shortcut. Profile header exposes avatar and profile actions. These are configurations of a shared header system, not copied headers.

Store/catalog, product detail, product wishlist, cart and checkout are separate workspace variants. Product wishlist is not social saved posts. Checkout is a focused transaction flow and may omit social navigation. Never guess an unregistered route.

## Architecture layers
- App shell: bootstrap, router, auth/session lifecycle and error handling.
- Route registry: canonical URLs and protected-route fallback.
- Design system: tokens, typography, spacing, breakpoints, safe areas and icons; no page layouts.
- Shared components: reusable accessible UI; no data fetching.
- Feature modules: feature UI, state transitions, scoped styles and tests.
- Page controllers: compose features and connect data; no global CSS ownership.
- Services: Supabase repositories, Storage, Realtime, cache and offline queue; no HTML.
- Platform adapters: browser APIs now; Capacitor/native bridges later.

Dependency direction: `page → feature → shared component/design system`; `page/feature → service → platform adapter`. Shared components never import pages. Services never import UI. Feature A cannot access Feature B's private implementation.

## Target structure
```text
src/
  app/                 # bootstrap, router, guards, lifecycle
  config/              # route registry, flags, environment config
  design-system/       # tokens, typography, motion, icons
  components/           # navigation, layout, feedback, primitives
  features/             # feed, posts, reels, media, profile, inbox, notifications
                         # discovery, store, checkout, directory, trips, seller
  services/             # supabase, realtime, storage, offline
  platform/             # browser adapters; future capacitor adapters
  pages/                # route-level composition only
  styles/               # reset and global token consumption only
tests/                  # contracts, features, route regression
docs/architecture/      # decisions, module contracts and diagrams
```

This is target ownership, not a risky mass-move. Migrate incrementally with compatibility exports and sibling-route regression checks.

## Feature contract
Every feature documents purpose/non-goals, public entry points, inputs/outputs/events, state owner, service dependencies, stylesheet namespace, composed routes, loading/empty/error/offline/permission states, accessibility, responsive rules and tests.

Feature CSS is rooted in its namespace. No generic element selectors, global side effects, `!important` patches or append-only overrides to repair another module. Record any legacy exception and removal task.

## Mobile baseline
- Design/test 320, 360, 390 and 430 CSS-pixel widths first; then tablet and desktop.
- Use fluid grids, `minmax(0,1fr)`, intrinsic sizing and aspect ratios.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- Aim for 44 CSS-pixel touch targets; reserve content space for fixed bars.
- Use `100dvh` with fallback. Full-screen hero is explicit, not universal.
- Preserve native vertical scrolling and `prefers-reduced-motion`.
- Verify Android Chrome and iOS Safari keyboard, viewport resize, file picker, video and safe areas.

## Change control
1. Define user journey and acceptance criteria.
2. Name owner, public contract and impacted siblings.
3. Change only the owner and explicit public contracts.
4. Add route, state-transition and responsive regression checks.
5. Run `npm test` and `npm run build`; review changed-file scope.
6. Check Home, Explore, Profile, Edit Profile, Inbox, Activity, Search, Store, Wishlist, Cart, Checkout, Seller, Directory and Trip.
7. Deploy only after CI and Pages pass. Separate automated checks from physical device QA.

## Migration order
1. Canonical route registry (started). 2. Split social header/bottom nav with compatibility exports. 3. Design tokens/layout primitives. 4. Extract Profile Hero. 5. Extract Inbox. 6. Decompose account controller. 7. Store/Wishlist/Checkout shells. 8. Route and visual regression. 9. Capacitor adapter after browser auth/media/offline stabilize.
