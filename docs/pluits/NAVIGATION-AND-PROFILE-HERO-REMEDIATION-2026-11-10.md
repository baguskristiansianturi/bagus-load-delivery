# Navigation and profile hero remediation — 10 November 2026

## Scope
This change addresses navigation destinations and the personal profile identity hero only. It does not change the database schema, RLS policies, messaging lifecycle, marketplace or trip workflows.

## Canonical destinations
- Beranda (signed-in): `#/account/explore` → account router → `feedPage()`.
- Beranda (guest): `#/` → public community feed.
- Inbox: `#/messages` → `messagesPage()` and `bindMessagesPage()`.
- Profil: `#/account/profile` → `profilePage()`.
- Aktivitas/Notifikasi: `#/account/activity` → notification page.
- Create: `#/account/create` → composer.
- Explore/Jelajah: `#/search` → discovery search.
- Legacy direct `#/messages` remains supported.

## Changes
1. Shared social navigation uses the canonical route registry for profile and inbox destinations.
2. Removed the redundant profile-avatar link from the shared top header. Profile remains available through the desktop Profile navigation and the fifth mobile navigation slot; this prevents a second profile hit target above the profile hero.
3. Corrected the nested edit-profile menu link so it renders the actual edit route instead of a literal interpolation string.
4. Corrected public-home sidebar destinations: Jelajah, Buat postingan, Aktivitas and Profil now lead to their respective canonical routes. Previously the Aktivitas shortcut incorrectly pointed to Explore.
5. Added an isolated `src/features/profile/profile-hero.css` module. It owns desktop, standard mobile and narrow-phone profile hero layouts, including safe grid sizing, text wrapping, stats wrapping and four-column profile tabs. It is scoped to `.ua-profile-main` to avoid affecting other account screens.
6. Inbox bottom navigation keeps the established context rule: while inside Inbox, slot four becomes Notifikasi and slot five remains Profil.

## Automated verification
- Canonical home, inbox and profile routes are distinct.
- Signed-in mobile navigation renders Beranda → Explore, Inbox → messages, Profil → profile.
- Inbox context renders Notifikasi in slot four and Profil in slot five.
- Shared header no longer renders a second profile avatar target.
- Home sidebar activity and create destinations use their own canonical routes.
- Profile hero has desktop, mobile and narrow-phone layout rules.
- Full CI: `npm test` 14 passed, 0 failed; Vite production build succeeded; GitHub Pages deploy succeeded.

## Acceptance boundary
These checks verify route destinations, generated navigation markup and CSS module contracts. They do not replace founder touch-testing on the actual Android device or visual UX acceptance. If the founder still experiences a tap opening the wrong page after this deployment, capture the exact screen and tap target; investigate the hitbox/overlay at that specific viewport rather than changing unrelated routes.
