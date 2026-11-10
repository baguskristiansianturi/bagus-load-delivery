# PLUITS Frontend Module Contracts

Active engineering contract for all frontend and mobile-web changes.

## Core rules
PLUITS has distinct workspaces and strict ownership between app shell, route registry, design system, shared components, features, page controllers, services and platform adapters. Follow `docs/pluits/PLUITS-APPLICATION-ARCHITECTURE.md`.
- Pages compose features; they do not own shared destinations.
- Shared components do not fetch data or import page controllers.
- Feature modules own UI state, markup and namespaced styles.
- Services own Supabase, Storage, Realtime and offline transport; never render HTML.
- Browser/native APIs are isolated behind platform adapters.
- Do not append CSS patches to repair another module; change the owning rule.

## Canonical navigation
Canonical destinations live in `src/components/social/navigation-routes.js`. Shared navigation consumes the registry; pages must not invent shared hrefs.
Social mobile navigation: **Beranda · Jelajah · Buat (+) · Inbox · Profil**. On `#/messages`, slot four becomes Notifikasi; other four slots stay fixed. Message and notification badges are separate counts. Protected routes send anonymous users to login.
Store, product wishlist, cart and checkout are distinct shell variants. Product wishlist is not social saved posts. Checkout may omit social navigation. Never guess a route.

## Responsive and accessibility
- Scope selectors to module namespaces; avoid unscoped `header`, `nav`, `button`, `a`, `main`.
- Design at 320/360/390/430 CSS px, then tablet and desktop.
- Respect safe areas, keyboard/viewport resize, native scrolling and reduced motion.
- Icon-only controls require accessible labels and correct route/action semantics.
- Full-screen hero is explicit, never a global default.

## Change procedure
Before edits, identify owner, public contract, route consumers, CSS selectors, service dependencies and sibling impact. After edits run `npm test`, `npm run build`, inspect changed files, and check Home, Explore, Profile, Edit Profile, Inbox, Activity, Search, Store, Wishlist, Cart, Checkout, Seller, Directory and Trip. A build is not physical Android/iOS QA.

## Migration order
1. Canonical route registry. 2. Split social header and bottom nav with compatibility exports. 3. Design tokens/layout primitives. 4. Isolated Profile Hero. 5. Isolated Inbox. 6. Account controller decomposition. 7. Store/Wishlist/Checkout shells. 8. Route and visual regression. 9. Capacitor adapter when browser flows are stable.
