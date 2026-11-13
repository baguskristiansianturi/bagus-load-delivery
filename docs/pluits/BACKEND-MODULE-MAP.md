# PLUITS Backend Module Map

**Backend platform:** Supabase (PostgreSQL, Auth, RLS, SQL functions/RPC, Realtime and Storage).  
**Status:** live backend exists; isolation, migration reconciliation and security remediation remain release gates.

## Backend domains and frontend consumers

| Backend domain | Authoritative backend responsibilities | Frontend consumer |
|---|---|---|
| Identity & Accounts | Auth identity, account/profile records, ownership, privacy and preferences | Auth, Profile, Account Settings |
| Social | Posts, media references, Stories, follows, likes, comments, saves, blocks and reports | Feed, Posts, Stories, Profile, Discovery |
| Messaging | Conversation membership, messages, block/request rules, private media and realtime access | Inbox |
| Notifications | Notification records, unread state, preferences and authorized events | Notifications, global navigation |
| GeoDirectory | Entities, categories, locations, claims, memberships, media and source records | Directory, Discovery, Trips |
| Seller & Store | Stores, members, roles, profile, settings, categories, products, variants, images and inventory | Seller Center, Storefront |
| Marketplace | Public catalog eligibility, orders, order items, payment records, order events and atomic lifecycle | Catalog, Product, Cart, Checkout, Orders |
| Trips | Itineraries, itinerary items and service requests | Trip |
| Blog | Blog profiles, posts, categories and published/draft visibility | Blog, Blog Studio |
| Entitlements & Wallet | Entitlements and wallet account/request scaffolding only | Future gated UI; not an operational real-money wallet |

## Correct backend locations

- `supabase/migrations/`: chronological, immutable schema/policy/function changes. Keep migration files flat and ordered; do not make per-domain migration subfolders.
- `supabase/functions/<function-name>/`: trusted Edge Functions only when secrets, webhooks, scheduled tasks or trusted outbound integrations require server execution. Currently zero are deployed.
- `supabase/tests/`: isolated pgTAP/SQL tests for RLS, RPC and Storage contracts.
- Supabase Auth: authentication identity and session issuance.
- PostgreSQL RLS, constraints, triggers and SQL functions/RPC: authoritative authorization, validation, atomic state transitions and data integrity.
- Supabase Storage policies: private object ownership and access.
- Supabase Realtime: authorized subscriptions; frontend lifecycle is coordinated through services.

PLUITS does not currently have a separate Node.js/Go/VPS application server. Do not create a `backend/` server or move SQL migrations into frontend `src/services/` unless the product explicitly adopts a custom server.

## Environment and safety gates

- Production project: `ytndswhqxayqpftszwfh`, Singapore.
- No Supabase development branch was created because the quoted cost was US$0.01344/hour and the owner declined paid setup.
- Do not connect preview builds/local work to production data by default.
- Live migration history has 97 records; repository has 90 migration SQL files. Nine Blog SQL sources remain unavailable. Do not invent or replay them.
- Critical RLS findings are in `PLUITS-SECURITY-AND-MIGRATION-RECONCILIATION-AUDIT-2026-11-13.md`. Fix through forward migrations and role-based tests, not direct production edits.

## Backend module definition of ready

Each module records migration/table/function references, authentication and actor permissions, RLS/Storage behavior, request/RPC schema and stable errors, transaction/state transitions, realtime side effects, positive/negative tests, deployment and rollback evidence.

See `supabase/README.md` and `FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md`.
