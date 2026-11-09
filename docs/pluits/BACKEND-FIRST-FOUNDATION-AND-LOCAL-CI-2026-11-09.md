# PLUITS — Backend-first Foundation & Local CI

**Tanggal:** 9 November 2026  
**Status:** DECIDED DIRECTION / IMPLEMENTATION IN PROGRESS  
**Production project:** `ytndswhqxayqpftszwfh` — read-only during this foundation phase  
**Local project id:** `pluits-local-ci` — disposable local Supabase only  
**Billing rule:** no Supabase Pro upgrade, hosted branch, or additional hosted project is required for this phase.

## 1. Founder direction

Build the complete system flow and backend structure first, then align the frontend to the backend contracts. Do not buy additional quota or increase the Supabase plan before the product is ready to open and actual demand justifies it.

This direction does not authorize production DDL, production data changes, a hosted Supabase branch, a new hosted project, or a plan upgrade.

## 2. Environment boundaries

| Environment | Purpose | Data | Billing / safety |
|---|---|---|---|
| Production Supabase | Existing live PLUITS accounts and application | Real user data | No destructive tests or casual DDL |
| Local Supabase (developer) | Reproduce schema and test behavior | Synthetic local data only | No hosted compute |
| GitHub Actions local Supabase | Replay migrations and automated backend checks | Fresh ephemeral database per run | No Supabase project/branch/credentials |
| GitHub Pages | Current frontend distribution | Public app assets | Existing deployment flow; not a backend staging environment |
| Hosted staging | Not provisioned | None | Revisit only when ongoing online UAT is needed and cost is approved |

The local CI config uses the sentinel `project_id = "pluits-local-ci"`. It must never be linked to the production project. The backend workflow has read-only GitHub permissions, does not receive Supabase secrets, and explicitly replays migrations against the local stack.

Supabase CLI v3 changed command defaults: local database commands should be explicitly invoked with `--local`; hosted changes require explicit confirmation and `--yes` in unattended environments. Pin CLI v3.0.0 for this workflow and review CLI changelog before upgrades. Never add `--remote`, `--linked`, project refs, access tokens, or production DB passwords to the local CI job.

## 3. Canonical backend layers

### 3.1 Identity and authorization
- Supabase Auth is the only identity source.
- A person has one account identity. Personal, professional, business/store and organizational contexts are related profiles/roles, not separate login identities.
- Client-editable user metadata is not an authorization source.
- Server-side permissions come from database-owned membership/role records and trusted app metadata where applicable.
- Frontend visibility is not authorization; every data operation is protected by grants, RLS and/or validated RPC.

### 3.2 Data domains

| Domain | Canonical ownership | Release order |
|---|---|---|
| Account/profile/privacy | User identity, personal profile, preferences, private addresses | P0 foundation |
| Social | Posts, media metadata, likes, comments/replies, saves, follows, blocks, reports | P0 release gate |
| Professional profile | Professional identity, skills, service areas, portfolio | After social gate unless needed for existing account journey |
| Seller Center | Stores, locations, memberships, roles, products, inventory, verification | Existing foundation; align to D-005 without production rollout yet |
| GeoDirectory | Canonical entities, categories, locations, claims, memberships, media, sources | Existing foundation; security remediation before broad rollout |
| Messaging/activity | Conversations, participants, messages, notifications, system announcements | P0 social support |
| Marketplace | Catalog, cart, order lifecycle, payment records, fulfillment, reviews | Existing schema; not expanded before Social UAT |
| Trip | Itineraries, service requests, booking state | Existing schema; later rollout |
| Wallet/settlement | Account/request scaffolding only | Not real-money enabled; separate financial design/review required |
| Operations/trust | Moderation, reports, verification, audit events, support | Cross-domain controls |

The table is a domain map, not a claim that every domain is release-ready.

### 3.3 PostgreSQL schema boundaries
- `public`: only objects intentionally exposed through Supabase Data API; every exposed table must have RLS and explicit grants.
- `private`: internal authorization predicates and helpers; not a client-facing data namespace.
- `auth` and `storage`: Supabase-managed schemas; access through supported Auth/Storage APIs and carefully scoped policies.
- Use SECURITY INVOKER by default. SECURITY DEFINER is exceptional, narrowly scoped, owned/reviewed, uses an empty/fixed safe search_path, fully qualified names, explicit auth checks, and restricted EXECUTE grants.
- Views exposed to clients use `security_invoker = true` unless a reviewed exception is required.
- No new public RPC is created merely to bypass a policy error.

### 3.4 Storage
- Store object keys and metadata; never make a private bucket public to solve a rendering issue.
- Upload path is bound to authenticated ownership.
- Read access follows the parent entity/post visibility and block/follow rules.
- Signed URLs are short-lived delivery artifacts, not a replacement for authorization.
- Photo/video limits, MIME types, retention and cleanup must be explicit.
- Never copy production media into local CI.

### 3.5 Realtime and asynchronous work
- Realtime is for authorized live updates, not an independent source of truth.
- Persist first; notify/subcribe second. Realtime subscriptions must respect participant/recipient authorization.
- Idempotency keys are required for retryable sends/commands.
- Edge Functions are introduced only for work needing server secrets, external webhooks, scheduled jobs, or trusted integrations. The current live project had zero deployed Edge Functions in the latest recorded audit; do not imply these exist.
- Scheduled jobs and media cleanup remain future work until separately implemented and tested.

## 4. Backend request lifecycle

1. User action begins in a frontend page/component.
2. A domain service validates the input shape and current session; it does not make authorization decisions.
3. Supabase Auth provides the signed user identity.
4. Data API/RPC invokes a table/view/function with explicit grants.
5. RLS and server-side business rules validate ownership, membership, state transition, visibility and abuse constraints.
6. Database constraints/transactions enforce integrity and atomicity.
7. Persisted state is returned to the service.
8. UI renders the persisted result, or an explicit loading/empty/error/retry state.
9. Realtime updates are consumed only after the backend has persisted the event.
10. Audit/notification events are emitted only where required and scoped to intended recipients.

Never optimistically display an irreversible success for a failed/unknown backend response. Optimistic interaction is allowed only when it has a clear rollback/error state.

## 5. Frontend architecture to align to backend

Current code is a Vite application with hash routing. Page modules currently make some Supabase calls directly. Refactor incrementally; do not replace the entire app or create duplicate routes.

Target structure (introduced by domain, not as a giant one-time rewrite):

```text
src/
  app/
    router.js
    session.js
    permissions.js
    errors.js
  lib/
    supabase/
      client.js
      result.js
  services/
    account/
    social/
    messaging/
    directory/
    seller/
    marketplace/
    trip/
  components/
    common/
    social/
    forms/
    feedback/
  pages/
    account/
    home/
    messages/
    directory/
    seller/
    marketplace/
    trip/
    admin/
  styles/
    tokens.css
    ...
```

Rules:
- One Supabase client/session owner for the app; no page-specific competing clients.
- Services encapsulate domain queries/RPCs and normalize errors. Pages do not contain repeated permission or lifecycle rules.
- Reuse the existing hash routes and page modules while extracting services.
- Each service function maps to a documented table/view/RPC contract and typed input/output shape.
- No mock service may silently replace production data. If an operation is not implemented, label it unavailable rather than simulate success.
- Route guards improve navigation only; RLS/RPC remains the security boundary.
- UI states must include loading, empty, error, retry, offline, unauthorized and success where applicable.
- Mobile-first controls, accessible labels, focus states, keyboard/touch behavior and safe-area handling remain mandatory.

## 6. Delivery phases and gates

### Phase A — Reproducible backend foundation
- [x] Add local-only Supabase config with a sentinel project ID.
- [x] Add isolated GitHub Actions workflow to replay all 81 tracked migrations from empty local DB.
- [ ] Confirm the workflow completes successfully on GitHub Actions.
- [ ] Add structural SQL assertions for required schemas, RLS, grants, policies and functions.
- [ ] Add role-context RLS tests using synthetic users/claims (anon, owner, follower, unrelated user, blocked user, store member, admin).
- [ ] Verify migration history and schema drift against production using read-only inspection; never auto-pull or push production in CI.

### Phase B — Backend security and contract stabilization (P0 Social first)
- [ ] Revalidate SOC-01–SOC-04 and GDT-01 against current live schema and policies.
- [ ] Run the remediation candidate against disposable local DB and negative tests.
- [ ] Review every SECURITY DEFINER function, grants, search_path and callability.
- [ ] Validate Storage paths, private media, block/follow behavior and signed URL scope.
- [ ] Add RPC input validation, idempotency and transaction tests where needed.
- [ ] Align account/profile, notifications and DM behavior with Social First Release spec.
- [ ] Do not apply remediation migrations to production without explicit release authorization and rollback evidence.

### Phase C — Frontend/backend alignment
- [x] Establish one shared Supabase browser client module and move eight page modules to it.
- [ ] Establish one auth-session subscription owner and prove listener deduplication.
- [ ] Extract domain service modules in priority order: account/session, social posts/interactions/follows, messaging/activity, then supporting modules.
- [ ] Replace duplicate page-level query logic with service calls without changing unrelated design.
- [ ] Align every action to real backend response and state transition.
- [ ] Add frontend contract tests for required RPC/view names and error/empty/loading states.
- [ ] Verify Android UAT with two founder-controlled accounts.

### Phase D — Controlled opening
- [ ] Social First Release founder UAT accepted.
- [ ] Trust, moderation, support and operational readiness.
- [ ] Performance/availability baseline and observed demand.
- [ ] Only then evaluate quota, hosting plan, permanent staging and cost/ROI.
- [ ] Capacity changes require a separate cost estimate and explicit approval.

## 7. Current audit baselines and cautions
- Repository baseline observed: commit `8bb79e378c112f4713abbdd3ad1468210d169ac8`.
- Tracked migration files: 81.
- Production project was previously observed ACTIVE_HEALTHY in ap-southeast-1, PostgreSQL 17.11.0.018.
- Previous audit found social child-table access gaps and four tautological GeoDirectory media policies; revalidate before deciding they remain live.
- Previous audit found authenticated-callable SECURITY DEFINER functions requiring function-by-function review; this is not proof every function is exploitable.
- Do not treat old README counts or older security snapshots as current live evidence.
- No production DDL is authorized by this document.

## 8. Acceptance vocabulary
Use separate statuses: SPECIFIED, IMPLEMENTED, MIGRATION-REPLAYED, SECURITY-TESTED, DEPLOYED, FOUNDER-UAT, ACCEPTED, BLOCKED, NOT TESTED, NOT VERIFIED. A passing migration replay does not prove RLS correctness. A passing CI workflow does not prove Android UAT or production readiness.


## 9. Production migration-history alignment discovered during local replay
- The first native filename-ordered replay failed at `20261108041100_pluits_directory_fk_indexes.sql` because the GeoDirectory core tables had not yet been created in that filename order.
- A read-only query of the live production migration history showed all 81 tracked SQL files have corresponding production migration entries, but multiple filenames in the repository have different version prefixes/order from the versions recorded in production. For example, production records GeoDirectory core as version `20261108040323`, while the repository file is named `20261108090000_pluits_geodirectory_core.sql`.
- Production history confirms GeoDirectory core and its dependent migrations were recorded before the directory index and claim-revocation migrations. The repository filename order did not preserve that sequence.
- Do not rename, delete, rewrite, or repair historical migration files merely to make local reset pass. Their production history is already recorded.
- `supabase/migration-order-overrides.json` records only the filename-to-production-version/name differences. `scripts/prepare-local-migrations.mjs` creates a disposable ignored workspace at `.supabase-ci/`, copies the original SQL files unchanged, and gives those copies the version names/order recorded in the live migration history.
- CI runs Supabase only from this disposable workspace. No production project ref, credentials, live data, or hosted branch is used. The source migration files and production database remain unchanged.
- The preparer currently asserts 82 migrations (81 historical migrations plus the forward D-005 seller eligibility migration). When a new migration is added, review production version assignment and update the manifest/count deliberately before the next replay.
- This solves ordering reproducibility only; a successful replay still needs to be followed by schema/RLS/role-context tests and frontend npm test/build.
