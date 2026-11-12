# Public Home feature

Ownership: guest/public visitor homepage (`#/` and `#/guest`).

## Composition and behavior

- `layout.js` composes the page-owned visual layout only.
- `navbar.js` + `navbar.css` own public navbar markup, locale control, wishlist/cart indicators and action binding.
- `hero.js` owns hero and search form markup.
- `public-home.css` owns page-specific sticky search positioning below the public navbar.
- `discovery.js`, `nearby.js`, `stories.js`, `marketplace.js`, `join.js`, and `footer.js` each own their section markup.
- `pages/home/index.js` remains the route controller and owns authentication, Supabase queries, public feed data and event binding. It delegates page markup to this layout.
- Shared social bottom navigation is consumed as a configured variant; the public navbar is not reused by Marketplace or other workspaces.

## Sticky mobile behavior

The public navbar is the top sticky row. The search rail is a separate page-owned sticky element immediately below it. Both use shared geometry tokens `--ui-public-header-height`, `--ui-public-header-height-wide`, and `--ui-search-height`. The search stays within the public page's scroll context; it must not overlap the navbar or fixed bottom navigation.

## Shared visual contracts

Global interaction geometry lives in `src/style.css`: `--ui-icon-size`, `--ui-icon-size-nav`, `--ui-touch-target`, `--ui-search-height`, and public header heights. Page-specific colors, surface treatments and behavior remain owned here. A token is not permission to share a full navbar/search component when behavior differs.

## Component map

| Component | Owner |
|---|---|
| Public layout | `layout.js` |
| Public navbar | `navbar.js`, `navbar.css` |
| Hero + search markup | `hero.js` |
| Sticky search behavior | `public-home.css` |
| Discovery / nearby / stories / marketplace preview / join / footer | respective section modules |
| Auth, public feed queries, data binding | `src/pages/home/index.js` |
| Global social bottom navigation | `src/components/social/navigation.js` |

## CSS migration note

Older section styling still lives in `styles/home-layout.css`. It is shared with legacy social-home selectors and must be moved only after selector/import/consumer audit. Do not add page-specific overrides there. New public-home behavior belongs in this feature namespace.

## Change checklist

1. Confirm the exact route is the public guest homepage.
2. Edit only the owning component and its namespaced stylesheet.
3. Keep Marketplace, Trip, Directory and signed-in social headers independent.
4. Reuse design tokens for icon sizes, typography, search height, spacing and touch targets.
5. Preserve auth/data ownership in `pages/home/index.js`.
6. Run tests/build and inspect route consumers before deployment.