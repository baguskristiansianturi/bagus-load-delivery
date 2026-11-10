# PLUITS Application Architecture — Mobile-first foundation

**Status:** Active engineering baseline  
**Target:** Android/iOS mobile browsers first; PWA/Capacitor-ready after browser flows stabilize.

## Product and workspace model
PLUITS is one application with distinct workspaces. A workspace chooses its shell; a page composes its content. Pages must not create competing global navigation systems.

### Social workspace
Signed-in mobile navigation has five equal destinations: **Beranda → Jelajah → Buat (+) → Inbox → Profil**. On `#/messages`, slot four becomes **Notifikasi** because Inbox is already open. Other slots, positions and sizes remain fixed. Message unread counts and activity-notification counts are separate data sources.

Home/Explore header uses a logo asset slot (not hard-coded brand text), a quiet search affordance and notification bell. Inbox header uses friend search, online contacts and notification shortcut. Profile header exposes identity/avatar and profile actions. These are configurations of a shared header system, not unrelated headers copied into pages.

### Store and checkout workspaces
Store catalog, product detail, product wishlist, cart and checkout have their own shell variants. Product wishlist is not social saved posts. Checkout is a focused transaction flow and may omit global social navigation. Do not invent routes before they are registered.

## Architecture layers and dependency direction
- App shell: bootstrap, router, authentication/session lifecycle, error handling.
- Route registry: canonical URLs and protected-route fallback. Shared navigation consumes it.
- Design system: tokens, typography, spacing, breakpoints, safe-area and icon registry; no page layouts.
- Shared components: reusable accessible UI; no data fetching.
- Feature modules: feature markup, state transitions, namespaced styles and tests.
- Page controllers: compose features and connect data; no global CSS ownership.
- Services: Supabase repositories, Storage, Realtime, cache and offline queue; no HTML.
- Platform adapters: browser media/file APIs now; native Capacitor bridges later.

Dependency direction: `page → feature → shared component/design system`; `page/feature → service → platform adapter`. Shared components never import pages. Services never import UI. Feature A cannot access Feature B's private implementation.

## Target repository structure
```text
src/
  app/                 # bootstrap, router, route guards, lifecycle
  config/              # routes, feature flags, environment config
  design-system/       # tokens, typography, motion, icons
  components/           # navigation, layout, feedback, accessible primitives
  features/             # feed, posts, reels, media, profile, inbox, notifications
                         # discovery, store, checkout, directory, trips, seller
  services/             # supabase, realtime, storage, offline
  platform/             # browser adapters; future capacitor adapters
  pages/                # route-level composition only
  styles/               # reset and global token consumption only
tests/                  # contracts, features, route regression
docs/architecture/      # decisions, module contracts and diagrams
```

This is the target ownership map, not a risky mass-move of legacy code. Migrate incrementally, preserve compatibility exports, and test sibling routes after each extraction.

## Feature module contract
Every feature documents purpose/non-goals, public entry points, inputs/outputs/events, state owner, service dependencies, stylesheet namespace, composed routes, loading/empty/error/offline/permission states, accessibility, responsive rules and tests.

Feature CSS must be rooted in its namespace. No generic element selectors, global side effects, `!important` patches or append-only overrides to repair another module. If a legacy exception is unavoidable, record its reason and removal task.

## Mobile baseline
- Design and test 320, 360, 390 and 430 CSS-pixel widths first; then tablet and desktop.
- Use fluid grids, `minmax(0,1fr)`, intrinsic sizing and aspect ratios.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- Aim for 44 CSS-pixel touch targets; reserve content space for fixed bars.
- Use `100dvh` with fallback. Full-screen hero is an explicit variant, not a universal rule.
- Preserve native vertical scrolling and `prefers-reduced-motion`.
- Verify Android Chrome and iOS Safari keyboard, viewport resize, file picker, video playback and safe-area behavior.

## Change control
1. Define the user journey and acceptance criteria.
2. Name the owning module, public contract and impacted siblings.
3. Change only the owner and explicit public contracts.
4. Add route, state-transition and responsive regression checks.
5. Run `npm test` and `npm run build`; review changed-file scope.
6. Check Home, Explore, Profile, Edit Profile, Inbox, Activity, Search, Store, Wishlist, Cart, Checkout, Seller, Directory and Trip.
7. Deploy only after CI and Pages deployment pass. Separate automated checks from real-device QA.

## Migration sequence
1. Canonical route registry (started).
2. Split social header and bottom nav with compatibility exports.
3. Design tokens and layout primitives.
4. Extract Profile Hero from account controller/legacy CSS.
5. Extract Inbox layout, tabs and conversation list.
6. Decompose account controller by feature.
7. Introduce Store/Wishlist/Checkout shell variants.
8. Add route/component and visual regression coverage.
9. Add Capacitor adapter after browser auth/media/offline flows are stable.
