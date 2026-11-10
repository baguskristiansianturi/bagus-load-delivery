# Inbox Personal — reserved page ownership

Status: RESERVED / NOT ROUTED.

The current live Inbox route is `#/inbox`, owned by `src/pages/messages/index.js` with styles in `src/pages/messages/messages.css`. This folder is a future ownership placeholder only.

Do not import this folder from the router, add a second Inbox route, or duplicate the current Inbox implementation yet.

Before migration, map the current page sections and consumers, define the Personal Inbox contract, then move code incrementally with a compatibility export and route/regression tests.

Planned ownership:
- Page composition: this folder (after approved migration).
- Feature behavior: dedicated feature modules under `src/features/inbox/` (only as extracted).
- Shared UI: `src/components/` or design system.
- Data access: `src/services/`.
