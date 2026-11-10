# PLUITS Frontend Module Contracts

**Status:** Active engineering contract  
**Applies to:** All frontend changes, especially shared navigation, account, social feed, inbox, notifications, marketplace, GeoDirectory, Trip and seller modules.

## Why this exists

PLUITS is a modular application, not a collection of isolated pages. A change to a shared header, stylesheet, route or icon registry can silently remove functionality from several pages. The missing mobile DM shortcut and inconsistent notification affordances are examples of cross-module regressions this contract is intended to prevent.

## Module ownership and boundaries

| Module | Canonical files | Owns | Must not silently change |
|---|---|---|---|
| App bootstrap and routing | `src/main.js`, `src/app/router.js` | Route parsing, page mounting, SEO, service worker | Page-specific business rules |
| Shared social navigation | `src/components/social/navigation.js`, `src/styles/social-navigation.css` | Social header, signed-in/public mobile navigation, shared route shortcuts | Inbox data, notification persistence, profile data |
| Shared social icons | `src/components/common/social-icons.js` | SVG paths and consistent icon output | Navigation layout or page behavior |
| Account and profile | `src/pages/account/index.js`, `account-context.js`, `security-settings.js` | Profile, account center, preferences, account actions | Global route/nav contracts |
| Direct messages | `src/pages/messages/index.js`, `messages.css` | Conversation list, DM, voice notes, offline outbox, presence | Shared social navigation registry |
| Public home | `src/pages/home/index.js` | Public landing/feed and public navigation state | Signed-in account state |
| Search and discovery | `src/pages/search/*` | Search, discovery filters and results | Shared icon definitions |
| GeoDirectory | `src/pages/directory/*` | Place/provider discovery and claims | Account and DM state |
| Marketplace | `src/pages/marketplace/*` | Product catalog, cart, checkout, orders | Social navigation contracts |
| Trip | `src/pages/trip/*` | Trip requests and itineraries | Marketplace and account internals |
| Seller | `src/pages/seller/*` | Seller/store workflows | Social header and notification logic |
| Design tokens | `src/styles/social-components.css`, `src/style.css` | Shared tokens and base styles | Page-specific layout selectors |

## Navigation contract

1. Social navigation is rendered from `src/components/social/navigation.js`; do not hand-build a second social header or mobile bar in a social page.
2. A signed-in user must have visible, reachable routes for Home, Discover, Create, Reels, Inbox/DM, Activity/Notifications and Profile on mobile.
3. The mobile header must retain direct-message, contacts, saved items, notification bell, the profile three-dot menu, and the profile avatar. The bell badge must continue to update from the existing unread-notification source.
4. Desktop navigation must retain the equivalent routes and visible labels.
5. Inbox may keep its focused conversation layout, but its icon affordances must use the shared `socialIcon` SVG registry and must provide a clear route to Activity and Profile.
6. Public/anonymous navigation must not expose private inbox or account-only actions.
7. Every icon-only link/button requires an accessible `aria-label`; current-page links should expose `aria-current` where appropriate.

## CSS isolation rules

- Shared social navigation styles may target only `.pl-social-*` and explicitly scoped `.ua-social-app` descendants.
- Page styles must use a page namespace (for example `.pl-msg`, `.pl-market`, `.pl-trip`, `.ua-account`). Avoid unscoped `header`, `nav`, `button`, `a`, `main` or broad element rules in module CSS.
- Do not use a generic class name for a new feature if it can collide with another page.
- Do not hide a shared element with a page-wide selector. Add a narrowly scoped rule and verify desktop and mobile.
- Keep mobile breakpoints and safe-area handling consistent; test narrow widths (320, 360, 390 px) as well as desktop.

## Change-impact procedure

Before editing:
1. Identify the owning module and its public exports.
2. Search all imports, route mounts, shared CSS selectors, and tests that depend on the touched contract.
3. Record which sibling modules can be affected. Shared navigation/icons/tokens/router changes require a multi-page impact check.
4. Prefer a small, additive change in the owning module. Do not replace an entire shared component to make a local page change.

After editing:
1. Run `npm test` (production-surface contracts).
2. Run `npm run build`.
3. Inspect the final diff and ensure no unrelated modules were changed.
4. Verify the relevant routes: public home, signed-in feed, profile, profile editor, account settings, Inbox, Activity, Search, Marketplace, GeoDirectory and Trip.
5. Verify mobile and desktop; specifically inspect icon visibility, route destinations, active states, badge placement, overflow, sticky/fixed behavior and safe-area spacing.
6. Deploy only after all automated gates pass; confirm the GitHub Pages workflow completes successfully before reporting deployment.

## Required regression assertions

The production verifier must check both source contracts and rendered shared-navigation output for:
- mobile DM shortcut and message SVG;
- notification bell and unread badge hook;
- signed-in Inbox and Activity bottom navigation;
- public navigation without private shortcuts;
- icon labels/accessibility;
- inbox-specific notification and profile shortcuts;
- route and CSS breakpoint/safe-area contracts.

A page's successful build alone does not prove the navigation is visible or usable. Any change to shared navigation requires all sibling-route checks above.
