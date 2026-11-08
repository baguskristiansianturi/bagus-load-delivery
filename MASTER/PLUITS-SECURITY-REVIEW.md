> **NOTICE — HISTORICAL SNAPSHOT, NOT CURRENT LIVE STATUS (7 November 2026):** Section 1 below records an earlier review state that said the database was empty and no migration had been deployed. Later project work notes report that seller workspace migrations `202611070002` and `202611070003` were applied. That later report has not been independently re-verified in this checkpoint. Do not use the old "database empty" statement as the current state. Reconcile this document against live Supabase migration history, schema, RLS, Storage, grants, and advisors before the next backend change. Track the verified result in [PROJECT-STATUS-ROADMAP.md](./PROJECT-STATUS-ROADMAP.md).

# Pluits — Security Review of Backend Foundation v1

**Company:** Pluits Indonesia  
**Platform:** Pluits  
**Supabase project:** `pluits` (`ytndswhqxayqpftszwfh`)  
**Review date:** 7 November 2026  
**Status:** Pre-deployment review — initial migration is NOT approved for application.

## 1. Verified environment

- Dedicated Supabase project `pluits` exists in the Bagus Kristian organization.
- Region: Singapore (`ap-southeast-1`).
- Project status at review: `ACTIVE_HEALTHY`.
- Database engine: PostgreSQL 17.
- Database migration history is empty.
- No tables exist yet in `public` or `private`.
- Security and performance advisors currently return no lints because the database is empty.
- No application schema has been deployed.

## 2. Blocking findings in the proposed initial migration

### 2.1 Staff permissions are not enforced granularly

The current generic `private.is_store_member(store_id)` checks membership only. Multiple mutation policies use that check for catalog, prices, stock, delivery zones, operating hours, and other operational data.

**Required correction:** use a permission-checking helper such as `private.has_store_permission(store_id, permission_key)`. Owners may pass all store-scoped permissions; staff must have an explicit grant for each action. A missing permission must deny access. Permissions must be checked in database policies or trusted server-side operations, not only in the UI.

### 2.2 Membership and ownership mutations need stronger invariants

The current owner update policy allows an owner to update membership rows without constraining protected columns. The database must not permit staff to self-promote, alter their own grants, create another primary owner, or modify the primary owner identity through a generic row update.

**Required correction:** separate safe member profile/status changes from permission grants and ownership transfer. Use narrowly scoped owner-only server-side functions for invitations, role/permission changes, deactivation, and ownership transfer. Add database constraints/triggers to protect the primary owner invariant. No client may directly write elevated permission grants.

### 2.3 Store creation needs an atomic owner bootstrap

A store row and its initial owner membership must be created as one trusted operation. A client-side two-step insert can leave an ownerless store if the second operation fails.

**Required correction:** implement a narrowly scoped registration RPC or trusted backend transaction that verifies `auth.uid()`, confirms the seller region is open, inserts the store, sets `owner_user_id`, and inserts the initial owner membership atomically. The function must validate all inputs, use a fixed search path, and have tightly scoped execute grants.

### 2.4 Audit history must not be client-forgeable

The current migration grants audit-log reads but does not provide a complete trusted write path. A client must not be able to invent or overwrite audit events.

**Required correction:** write audit events through database triggers or trusted server-side functions; deny direct insert/update/delete to client roles. Record actor, store, action, entity, timestamp, and safe before/after snapshots where appropriate.

### 2.5 Inventory mutations need a single controlled path

The current design allows a member to insert inventory movement records but does not yet guarantee that stock balances and movement history stay consistent transactionally.

**Required correction:** implement stock adjustments through a trusted transaction that locks the variant row, validates the quantity and permission, writes an immutable movement, and updates the stock balance atomically. Prevent direct client writes to the stock balance.

### 2.6 Public/private data boundary needs a dedicated storefront surface

Do not expose raw store rows as the public storefront contract. Private street address, precise coordinates, member records, internal notes, and future financial information must remain private.

**Required correction:** create an explicit public storefront view or RPC with only approved fields, using `security_invoker = true` where applicable and a tested RLS boundary. Public visibility must require an active store and published product. Validate view grants and Data API exposure separately from RLS.

### 2.7 Data API exposure must be checked explicitly

New Supabase projects created after the October 2026 Data API change do not automatically expose new public-schema tables by default. SQL grants and Data API exposure settings are separate controls.

**Required correction:** decide which public tables/views are exposed, enable RLS on all exposed tables, and verify role grants plus the project's Data API settings. Do not expose private schemas.

## 3. Other required design work before production

- Unique public store usernames with reservation/history and safe rename/redirect behavior.
- Staff invitation lifecycle with expiry, acceptance, revocation, and store-scoped membership.
- Owner-only payout/bank-account custody operations.
- Order and order-item immutable snapshots.
- Payment, refund, payout, expense, reconciliation, and append-only financial ledger.
- Private PDF report storage and signed download URLs.
- Storage bucket policies and file ownership validation.
- Security-event logging and owner notifications for sensitive changes.
- Automated tests for anonymous, buyer, unrelated user, owner, and staff permission boundaries.

## 4. Required test matrix

Before enabling seller onboarding, test at minimum:

| Actor | Expected access |
|---|---|
| Anonymous visitor | Read only explicitly public active storefront data |
| Buyer account | Public catalog; no private store or staff data |
| Unrelated authenticated user | No access to another store's private data |
| Store owner | Full authority within their own store; owner-only custody actions |
| Catalog staff | Catalog actions only when explicitly granted |
| Inventory staff | Stock operations only when explicitly granted |
| Order staff | Order operations only when explicitly granted |
| Accounting staff | Only granted accounting/report actions; no payout or bank-account control |
| Revoked staff | No further store access after revocation/session policy takes effect |

## 5. Deployment gate

The initial migration must be revised and reviewed before application. After schema deployment, run Supabase security and performance advisors, then run authorization tests with real test identities. Do not claim the backend is production-ready until these checks pass.

## 6. Immediate next implementation sequence

1. Revise the foundation migration: granular permissions, atomic owner bootstrap, membership invariants, trusted audit writes, controlled inventory writes.
2. Add a public storefront contract and username routing model.
3. Add automated RLS/authorization tests.
4. Apply the reviewed migration to the dedicated Pluits project.
5. Run advisors and verify the schema and test results.
6. Continue with orders and immutable financial records as a separate milestone.



## 2026-11-07 — Anonymous public social feed policy (CP-012)
- Applied migration: `20261107142901_pluits_public_social_read`.
- Anonymous role can SELECT only public profiles and published public posts from public profiles.
- Anonymous Storage SELECT is limited to objects referenced by published public posts or avatar/cover paths on public profiles.
- The `pluits-user-media` bucket remains private. Public media is served through short-lived signed URLs after RLS checks. Private posts, private profiles, addresses, and unrelated media remain inaccessible to anonymous users.
- Explore interactions and all write operations remain authenticated-only.
- This policy requires UAT from a logged-out browser: public post and media should load; private content and addresses must not load.
- Existing advisor warning about authenticated SECURITY DEFINER store RPCs is unchanged; it relates to seller functions, not this public feed migration. Existing FK index performance notices also remain.


## 2026-11-08 — Live security and schema reconciliation

This section records an earlier live snapshot and is superseded by the timestamped live snapshot at the end of this document.

### Verified live environment
- Supabase project `ytndswhqxayqpftszwfh` (`pluits`) is ACTIVE_HEALTHY, Singapore region, PostgreSQL 17.
- Live migration history contains 19 entries.
- All 28 tables in the exposed `public` schema have RLS enabled.
- No Edge Functions are deployed.
- Security and performance advisors were run on 8 November 2026; health advisor returned no lints.

### Current security findings
1. **Authenticated SECURITY DEFINER RPCs (WARN):** `public.create_store` and `public.update_store_profile` are executable by authenticated users. Both functions check `auth.uid()`, use a fixed empty search_path, and `update_store_profile` checks store-owner membership. Anonymous execution is denied. These are privileged boundaries and must receive negative tests for unauthenticated, unrelated user, store member, and owner before production. Do not blindly convert to SECURITY INVOKER because the current store write policies and helper functions have deliberate privilege boundaries.
2. **Leaked-password protection disabled (WARN):** enable Supabase Auth's leaked-password protection in the Auth security settings before public launch. This setting was not changed during this audit.
3. **Media path ownership (FIXED):** validated CHECK constraints on `user_posts` and `user_stories` now require media paths to begin with the owning user's UUID folder. Rollback-only adversarial tests prove foreign-folder paths are rejected and same-user paths pass.
4. **Story policy overlap (FIXED):** role-specific Stories SELECT policies replaced the overlapping authenticated policies; the advisor warning is cleared. A rollback-only test confirmed public Stories are visible to anon and private Stories are not.
5. **RLS coverage:** all 28 public tables have RLS enabled. This is a positive baseline, not proof that each policy is correct. Policies still need actor-by-actor tests.

### Advisor snapshot
- Security: 2 SECURITY DEFINER warnings; 1 leaked-password-protection warning.
- Performance after hardening: 14 unindexed foreign keys; 12 unused-index notices. Wallet RLS init-plan warnings and multiple-permissive Stories warning are cleared.
- Health: no lints.
- Unused-index notices should not trigger immediate index deletion; the database is new and query usage is still low.

### Migration history reconciliation — resolved 8 November 2026

The active GitHub migration directory contains 19 files, matching all 19 live Supabase migration records by version and name. Five missing SQL definitions were recovered from `supabase_migrations.schema_migrations.statements`; early filenames and divergent drafts were corrected. The unapplied legacy `202611070001_initial_marketplace.sql` is archived outside the active migration directory. Two additional hardening migrations were applied and committed. No production reset or migration replay was performed.

### Release gate
- Enable leaked-password protection.
- Maintain exact migration parity; do not reset or replay the live project.
- Run two-account and anonymous tests for private profiles/posts, media, Stories, addresses, store membership, owner-only RPCs and wallet requests.
- Keep the media-path ownership CHECK constraints in place and retain their negative/positive regression tests.
- Review staff permission boundaries and audit-log write path.
- Re-run advisors after fixes.
- Confirm GitHub Pages deployment and Android UAT. No claim of production readiness until these pass.

### 2026-11-08 — Migration reconciliation completed
- Active migration files: 19.
- Live migration history records: 19.
- Missing version/name pairs: 0.
- Active files not represented in live history: 0.
- SQL recovered from live migration history: exact statements were used; prior divergent drafts were archived.
- Unapplied legacy migration `202611070001_initial_marketplace.sql` is archived and excluded from active migration discovery.

## 2026-11-08 — Media ownership and RLS performance hardening
- Applied migration `20261108011806_enforce_social_media_owner_paths`; validated CHECK constraints now require social post/story media paths to start with the owning user's UUID folder.
- A controlled rollback test demonstrated the old foreign-path insert was accepted before the constraint. After the migration, foreign-folder paths were rejected for both `user_posts` and `user_stories`; valid same-user paths were accepted. No probe rows were committed.
- Applied migration `20261108011838_optimize_story_and_wallet_rls_policies`; Stories read policies are now split by role and wallet policies use `(select auth.uid())`.
- Advisors after changes: 2 authenticated-callable SECURITY DEFINER warnings remain; leaked-password protection remains disabled. Performance: 14 unindexed FK notices and 12 unused-index notices; the three wallet init-plan warnings and duplicate Stories policy warning are cleared. Health: no lints.
- Live migration history and active GitHub migration directory now both contain 19 exact version/name entries.

## 2026-11-08 — Follow graph dan profil privat

- Ditambahkan `public.user_follows` dengan RLS, trigger status otomatis, indeks relasi, dan batas perubahan status hanya oleh target permintaan.
- Akun publik menerima follow langsung; akun privat memerlukan persetujuan.
- Helper `private.is_user_following` menghindari rekursi policy. Helper directory dan follow counts ditempatkan di schema private; public RPC wrapper memakai `SECURITY INVOKER`.
- Policy profil, post, Story, dan Storage mengizinkan akses follower yang diterima sesuai audience; pending requester hanya mendapat identitas dasar melalui directory RPC.
- Pengujian rollback: public follow accepted, private follow pending, target acceptance, self-follow ditolak, private directory anon redacted, private avatar anonim ditolak, accepted follower avatar/post dapat diakses.
- Migration CP-023: 10 file baru cocok dengan 10 statements live; baseline 19 sebelumnya tetap dipertahankan. Jangan reset/replay database.
- Advisor security tetap: dua SECURITY DEFINER RPC toko lama (`create_store`, `update_store_profile`) dan leaked-password protection nonaktif. Tidak ada peringatan baru untuk helper private CP-023.
- Advisor performance masih melaporkan 14 foreign key tanpa covering index dan sejumlah unused-index notices. Jangan menghapus index hanya karena belum terpakai pada database dengan trafik rendah.
- Frontend follow/profile dan responsive CSS telah diubah. GitHub Pages run #465 pada commit `fc2314e81f21d5edd55d99108da8777198d7d6f4` sukses build dan deploy. Dua akun nyata dan Android UAT setelah CP-023 masih pending.
- Build bundle: JS 172.94 kB (gzip 49.59 kB), CSS 258.32 kB (gzip 44.57 kB). Lighthouse/runtime performance belum diukur.


## 2026-11-08 — Live security/schema snapshot refreshed (12:37 UTC)
This snapshot supersedes earlier live counts in this document.
- Supabase project: ytndswhqxayqpftszwfh, PostgreSQL 17, ACTIVE_HEALTHY.
- Public schema: 60 base tables; all 60 have RLS enabled.
- Migration history: 73 entries (the repository currently contains 73 migration SQL files; exact SQL equivalence must be verified by version/name and content, not count alone).
- No public base table with a name matching cart exists. Marketplace cart is currently localStorage-only; this is a known product/backend alignment gap.
- Security Advisor: 20 authenticated-callable SECURITY DEFINER function warnings and 1 leaked-password-protection warning. A warning is not by itself proof of exploitability; each function requires body, grants, authorization and negative-test review.
- Performance Advisor: 84 unused-index notices (informational; do not drop indexes without workload evidence).
- Health Advisor: 0 lints.
- Store staff granular permission enforcement remains a release blocker until policies and privileged functions enforce permission grants and negative cross-store tests pass.
- No schema, permission, Auth setting, or production data was changed by this read-only snapshot.


## 2026-11-08 13:30 UTC — Store permission grant enforcement (live migration)

- **Applied migration:** `20261108132935_enforce_store_member_permission_grants`.
- **Repository migration file:** `supabase/migrations/20261108132935_enforce_store_member_permission_grants.sql`.
- Added `private.has_store_permission(store_id, permission)`. Active owners retain full store access; non-owner members must have an explicit JSON boolean grant for the requested permission.
- Replaced membership-only write policies for store settings, operating hours, delivery zones, product categories, products, product variants, product images, and store-media insert/update/delete with permission-aware policies.
- Read access for active store members remains separate from write permission. Existing owner behavior was verified against the live helper.
- **Rollback-only helper tests:** owner → catalog/settings allowed; non-member → both denied; temporary staff-role test → explicit `catalog.manage=true` allowed while missing `store.settings.manage` remained denied. Temporary role/grant mutation was rolled back; no test row or account change was committed.
- **Policy inspection:** live `pg_policies` confirms the new write policies reference `private.has_store_permission`. This is not yet a full authenticated REST/RLS negative test.
- **Still open:** staff invitation/grant management UI is not implemented; do not invite staff or claim end-to-end staff authorization acceptance until two-account REST tests cover read, write, storage, and RPC paths.
- **Advisor snapshot after migration:** 20 authenticated-callable SECURITY DEFINER warnings remain and require per-function review; leaked-password protection remains disabled. Performance advisor reports 84 unused-index notices (informational); Health advisor reports 0 lints. The new helper is in the private schema and does not add another exposed public RPC warning.
- **No existing store, product, order, payment, or user rows were deleted or rewritten.**
