# PLUITS Layout Foundation

This module provides opt-in, namespaced layout primitives. It is intentionally not a global reset and does not target legacy page selectors.

## Page composition hierarchy
1. **Application shell** — route host, global error/loading handling, global services and route transitions.
2. **Experience shell** — one product-area frame (Social, Public, Marketplace, Trip, Inbox, Seller, Directory, Blog Studio).
3. **Page shell** — page width, page-level padding, scroll behavior and background.
4. **Page header** — title, description, breadcrumb/context and page-level actions.
5. **Section** — semantic page region, section spacing and section heading.
6. **Content layout** — container, stack, cluster, grid, rail or split panel.
7. **Component** — card, row, form control, menu, dialog, media item and other reusable UI.
8. **Content / state** — data-driven content and loading, empty, error, disabled and permission states.

## Canonical class vocabulary
- `plds-page`, `plds-container`, `plds-section`
- `plds-page-header`, `plds-page-header__copy`, `plds-page-header__title`, `plds-page-header__description`
- `plds-stack`, `plds-cluster`, `plds-grid`, `plds-surface`, `plds-divider`
- `plds-icon`, `plds-icon-button`, `plds-text-*`

The full-bleed media viewer is an explicit layout variant; do not force it into a contained page shell.

## Rules
- Layout primitives are data-agnostic. Feature modules own their content, state, API calls and interactions.
- Experience shells own their navigation and global chrome. A page must not borrow another experience's complete navbar or sidebar.
- Pages choose a named width variant: reading (720px), content (1200px), workspace (1440px), or full-bleed.
- Use CSS grid/flex with `minmax(0,1fr)` and `min-width:0` to prevent mobile overflow.
- Page gutter is tokenized (16px; 12px on narrow screens). The viewport is fluid; no physical device resolution is hardcoded.
- Existing pages migrate one at a time after their selectors and consumers are inventoried. Importing this file alone changes no legacy layout.
