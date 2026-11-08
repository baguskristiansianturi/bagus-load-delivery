# Pluits Backend Foundation — Owner, Staff, Storefront & Finance

**Project:** Pluits  
**Stage:** Foundation v1 + Access & Storefront design  
**Date:** 7 November 2026

## 1. Core account model
- One Auth user may act as buyer, owner of one or more stores, and staff member of other stores.
- The user who successfully registers a store is its initial and primary `owner`; do not create a generic seller role in place of ownership.
- The owner uses a personal account and can operate from a mobile phone.
- Staff must use separate personal accounts and are invited into a specific store. Never share owner credentials.
- Store access is scoped by `store_id`; staff in one store receive no access to another store by default.

## 2. Authorization model
Authorization is enforced in Postgres RLS and trusted server-side functions, not only by hiding UI controls. Every sensitive operation must check both store membership and an explicit permission.

### Owner-only operations
- Change payout bank account / beneficiary.
- Request or execute withdrawal / payout.
- Transfer store ownership, appoint another owner, or remove the primary owner.
- Change security-critical settings and grant/revoke elevated permissions.
- Approve sensitive changes that affect custody of funds.

Require owner re-authentication (and MFA when configured), audit records, and security notifications for critical operations. Staff cannot grant themselves permissions or elevate themselves to owner.

### Delegable staff permissions
Permissions should be granular, for example:
- `catalog.read/write`
- `inventory.read/write/adjust`
- `pricing.read/write`
- `orders.read/process/cancel`
- `delivery.read/write`
- `store_profile.read/write`
- `store_hours.read/write`
- `reports.sales.read/export`
- `accounting.entries.read/write`
- `accounting.reconciliation.read/write`
- `staff.invite/manage` (owner-controlled delegation)
- `finance.payout.read` (read-only; never implies withdrawal)
- `finance.bank_account.manage` and `finance.withdraw` are owner-only and must not be delegable.

Suggested presets: manager, catalog staff, warehouse/inventory staff, order staff, accounting staff, customer service. Presets are convenience templates; backend authorization uses explicit permissions. Until fine-grained RLS/RPC checks are complete, do not expose staff mutation flows.

## 3. Store identity and public website
- Store display name is not globally unique.
- Public username/slug is globally unique, case-insensitive, validated and reserved.
- Proposed stable route: `/t/{username}` on the platform domain; final domain and route remain a product decision.
- Every active store automatically has a responsive public catalog website at this route.
- Public pages expose store name, logo/description, public city/area, categories, published products/variants, public prices, operating status, delivery coverage and allowed contact/CTA.
- Never expose exact street address, precise coordinates, staff list, customer data, bank details, private accounting, or internal reports.
- Product publication and store activation gate public catalog visibility.
- Username changes require owner authorization, an audit event, redirect from the old route and a quarantine period before any old username can be reused.
- Custom domains per store are a later option, not a foundation dependency.

## 4. Financial data and historical retention
- Orders must store immutable snapshots of product/variant name, SKU, unit, quantity, online price, discount, fees, delivery quote and totals at order time. Later catalog price changes must not rewrite historical orders.
- Financial events should use append-only ledger entries. Corrections are reversal/adjustment entries referencing the original; do not silently edit or delete posted financial records.
- Store reports remain queryable across years. New calendar years create new reporting periods, not a reset of the underlying data.
- Define retention, backups, restore tests and access controls before production finance.
- Distinguish gross sales, discounts, refunds, fees, tax (if applicable), net sales, cash received, outstanding balance and payout. Do not label these as interchangeable.
- PDF exports support monthly, 3-month, 8-month, annual and custom date ranges. They should include store identity, report period, generation timestamp, filters, summary and relevant detail. Dashboard and PDF must use the same report definitions.
- Accounting staff may read/export reports and, if permitted, record expenses/reconciliations. They do not thereby gain bank-account or payout permissions.
- Tax/accounting treatment and statutory retention require professional review before treating reports as formal books.

## 5. Backend data entities — target model
Existing migration currently provides `profiles`, `operating_regions`, `stores`, `store_members`, private locations, hours, zones, categories, products, variants, image metadata, inventory movements and an audit foundation.

Additional entities to design in subsequent migrations:
- `store_user_permissions` or equivalent normalized permission grants.
- `store_username_history` for old route redirects and reserved-name quarantine.
- `store_bank_accounts` with owner-only write path and verification state.
- `orders`, `order_items` with immutable snapshots, and status history.
- `payments`, `refunds`, `payout_requests` and payout status history.
- `financial_ledger_entries` append-only with source references and reversal links.
- `accounting_entries` / expense records with permission-scoped writes.
- `report_jobs` and private generated PDF objects with signed, time-limited download access.
- `security_events` / owner notifications for sensitive changes.

## 6. Seller-first test flow
1. User registers and confirms their account.
2. User creates a store; creator becomes its owner automatically.
3. Owner completes PT/CV/UD identity, private address and public username.
4. Owner configures hours, delivery zones, categories, products, variants, prices and stock.
5. Owner invites a second test user as staff with limited inventory/catalog permissions.
6. Verify staff can perform only allowed actions from another device/browser.
7. Verify staff cannot change bank details, initiate withdrawal, transfer ownership or elevate permissions.
8. Owner changes a critical setting; verify re-authentication, notification and audit record.
9. Publish the store and verify its public catalog route shows only public data.
10. Change product price and verify old order snapshots and financial reports remain unchanged.
11. Generate PDF reports for monthly, 3-month, 8-month, annual and custom periods once order/finance modules exist.

## 7. Security and data integrity
- Do not rely on client-supplied role, permission, store owner ID or financial amount without server-side verification.
- No service-role key in browser/mobile client.
- Private address, coordinates, bank details, staff-only records and finance data must not be available through anonymous policies.
- Use transaction-safe RPCs for order placement, stock reservation, ledger posting and payouts.
- Audit records should be written by trusted database functions/triggers, not by a client that can fabricate before/after values.
- Use MFA/re-authentication for high-risk owner actions.
- Protect report PDFs in private storage; use signed URLs with expiry and authorization checks.
- Add concurrency, RLS and privilege-escalation tests before real users or funds.

## 8. Implementation sequence
1. Dedicated Supabase project for this repository, in the selected organization and Singapore region.
2. Review and apply initial schema only after hardening and testing all RLS policies.
3. Add owner bootstrap flow: store creator becomes owner in a single transaction.
4. Add normalized staff permissions and owner-controlled invitation/revocation.
5. Add public username reservation and storefront route/API.
6. Add audit/security events and owner notifications.
7. Add orders and immutable item snapshots; transaction-safe stock reservations.
8. Add financial ledger, bank account verification and owner-only payout workflow.
9. Add reporting queries and secure PDF generation/download.
10. Connect responsive owner mobile dashboard and staff desktop/mobile dashboard.

## 9. Open decisions
- Final platform domain and public store URL route.
- Username character/length policy, change limit, redirect duration and quarantine period.
- Exact role presets and per-action permission matrix.
- MFA and owner re-authentication requirements; bank-change cooling-off period.
- Payment provider, custody of funds, payout model and reconciliation rules.
- Accounting definitions, taxes, report templates, retention period and legal requirements.
- PDF storage/download expiry and export audit requirements.
