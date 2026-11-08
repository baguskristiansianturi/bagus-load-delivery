# PLUITS — Frontend Experience Completion Matrix

**Tanggal:** 9 November 2026  
**Status:** ACTIVE DELIVERY CONTRACT  
**Arah produk:** Frontend experience is built in parallel with backend contracts; backend gaps do not pause UI/UX delivery.

## 1. Founder direction

Every user-facing journey must be prepared end-to-end on the frontend even when its backend capability is incomplete. The UI must include its page structure, responsive layout, navigation, forms, field validation, interaction affordances, loading/empty/error/success/pending states, and clear next steps.

A missing backend capability is an integration dependency, not a reason to omit the screen or leave a dead button. Do not simulate persisted success, payment, verification, booking, message delivery, inventory, counts, or account permissions. Use truthful states such as "Belum tersedia", "Menunggu konfirmasi", "Gagal memuat", or "Perlu masuk", and preserve the user's input when safe.

## 2. Two parallel delivery tracks

### Track A — Frontend experience (must continue)
- Complete all user-visible routes and their page layouts.
- Complete mobile-first and desktop responsive behavior.
- Complete form labels, validation, disabled/loading states, feedback, empty states, retry controls and safe navigation.
- Complete modal, drawer, tabs, filters, sort, pagination/infinite scroll, upload previews, confirmation and back-navigation behavior.
- Ensure touch targets, focus visibility, semantic labels, keyboard access, contrast and device safe-area spacing.
- No inert controls. If an action is not integrated, it must explain why and identify the next available action.
- Preserve current working design and route behavior; refactor incrementally, not via a broad rewrite.

### Track B — Backend contracts and integration (maximize safely)
- Reuse the existing Supabase schema, RLS, RPC, Storage and Realtime where they are suitable.
- Map every UI action to a documented service contract and backend object.
- Implement local migration replay, schema assertions, role-context and negative tests before claiming a backend feature is ready.
- Add missing migrations/RPC/policies in the repository when justified; test on disposable local data first.
- Keep production read-only until a separate explicit release gate.
- When backend is not ready, mark the exact dependency and leave a stable integration boundary for later.

## 3. Route and experience coverage

| Area / route | Frontend experience required | Backend dependency / honest state |
|---|---|---|
| Home / | Public feed, navigation, stories entry points, nearby discovery, sign-in aware feed | Social feed visibility, public media, GeoDirectory RPC |
| Account /login, /register | Login, signup, confirmation pending, resend, errors, logout | Supabase Auth/email delivery |
| Profile /account/profile, /@username | Personal profile, edit, avatar/cover, privacy, public/private views | user_profiles, follows, Storage policies |
| Social /account/explore, /account/compose, /account/post/:id | Feed, post composer, upload preview/progress, edit/delete, double-tap like, comments/replies, saves, share, reports | Posts/media/interactions, parent visibility, RLS and Storage |
| Social graph /account/followers, /account/following, /account/requests, /account/blocked | Follow, accept/decline, remove, block/unblock, empty and pending states | Follow/block graph and access rules |
| Activity /account/activity | Notification list, unread states, mark read, announcement view | Recipient-scoped notifications and announcement reads |
| Messages /messages | Inbox, conversation, draft, offline outbox, retry, send state, realtime | Participant authorization, idempotent send, realtime |
| Account settings /account/settings, /account/security, /account/content-settings, /account/addresses, /account/wallet | Settings hub, security forms, MFA/phone flows, privacy, address CRUD, wallet request state | Auth MFA/phone, profile preferences, address RLS; wallet remains non-financial request-only |
| Seller /seller, /seller/register | Store onboarding, dashboard, catalog, inventory, team, verification and empty states | Store memberships, D-005 eligibility, product/storage policies |
| GeoDirectory /places, /place/:slug, /place/:slug/claim | Search, category/area filters, list/map, entity detail, claim flow, provider actions | Nearby RPC, entities, claims, media access, directory security |
| Marketplace /marketplace, /shop/:slug, /market-product/:id | Catalog, filters, product detail/gallery, wishlist/cart, quantity/stock feedback | Published catalog, product media, seller/stock visibility |
| Checkout /market-cart, /market-checkout, /market-orders, /market-order/:id | Cart, address, checkout validation, pending payment, order detail/history, cancel/retry states | Server-side price/stock validation, idempotent order RPC, payment lifecycle |
| Trip /trip, /trip/itinerary/:id | Itinerary creation/edit, place selection, service request, provider response and pending states | Itinerary persistence, provider verification, request lifecycle |
| Moderation /admin/moderation | Report queue, review detail, decisions, announcements, audit feedback | Server-side admin/moderator authorization and audit trail |
| Content/help /blog, /guides, /help, /faq, /about, /contact, /reviews, /terms, /privacy | Complete readable pages, links, contact guidance, policy and verified-review explanations | CMS/content backend may follow; no fabricated reviews or legal claims |

Routes in the table describe expected user experience, not a declaration that every route or backend operation is production-ready. Keep actual status in the roadmap and release checklist.

## 4. Required state model for every async surface

Each async UI must explicitly handle:
1. idle — no action started.
2. loading — request in progress; prevent accidental duplicate submission.
3. success — only after a successful backend acknowledgement or persisted response.
4. empty — valid response with no records and a useful next step.
5. validation_error — actionable field-level feedback.
6. unauthenticated — explain sign-in requirement and preserve safe return path.
7. forbidden — explain access restriction without leaking protected data.
8. offline — distinguish locally saved draft from server-delivered/persisted data.
9. retryable_error — safe retry only; idempotency for commands.
10. conflict — stale/concurrent state, ask user to refresh or resolve.
11. not_implemented — clear staged/unavailable message, never a fake success.

## 5. Definition of frontend completion

A route is not complete merely because it renders. It is complete when:
- Primary and secondary user journeys are reachable and coherent.
- Every visible control has a working action or an honest unavailable explanation.
- Form validation and all async states are designed and implemented.
- Mobile layout works at narrow viewport widths and does not overflow horizontally.
- Desktop layout remains coherent and uses available width appropriately.
- Navigation, browser back, refresh/deep links and signed-in/signed-out states behave correctly.
- Accessibility basics are present: labels, focus, semantic buttons/links, status announcements and contrast.
- No invented data or fake transaction/verification outcomes are displayed.
- Regression tests cover the changed behavior; Android UAT is recorded separately.

## 6. Definition of backend integration readiness

A frontend operation can be marked integrated only when:
- The matching table/view/RPC/Storage/Realtime contract is documented.
- Auth, ownership, membership, visibility and state transitions are enforced server-side.
- Local migration replay and positive/negative role-context tests pass.
- Errors are mapped to useful UI states without being swallowed.
- Duplicate submission/retry behavior is safe.
- Production rollout is separately authorized and verified.

## 7. Delivery order

1. Shared client/session/error boundary and route audit.
2. Social P0: account/session, public/private profile, feed, post/media, likes/comments, follow/block, activity, DM.
3. Supporting trust controls and GeoDirectory security.
4. Seller Center onboarding and operational dashboard.
5. Marketplace catalog/cart/checkout/orders.
6. Trip itinerary and service requests.
7. Help, legal, editorial, contact and supporting routes.
8. Full responsive, accessibility, regression and Android founder UAT.

The order prioritizes release risk and dependency, not permission to leave later areas without a frontend experience. Build and polish those screens in parallel where safe.

## 8. Status vocabulary

Use only explicit states: SPECIFIED, IMPLEMENTED, INTEGRATED, TESTED, UAT VERIFIED, BLOCKED, NOT IMPLEMENTED, NOT TESTED, NOT VERIFIED, NOT DEPLOYED. Never promote a route or capability to a stronger state based on appearance alone.
