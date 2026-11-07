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

