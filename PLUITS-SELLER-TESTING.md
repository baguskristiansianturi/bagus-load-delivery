# Pluits Seller Testing — v0.1

## Current test flow
1. Open the seller center route `#/seller/register`.
2. Create a personal account with an email and password (minimum 8 characters).
3. If email confirmation is enabled in Supabase Auth, confirm the email from the inbox and then sign in.
4. Complete the first-store form. The account creating the store is automatically assigned as its owner in the same database transaction.
5. Use the owner dashboard to create categories, products, variants, price, stock, upload product images, define delivery areas, and edit basic store settings.

## Database
- Supabase project: `pluits` (`ytndswhqxayqpftszwfh`), Singapore.
- Migration: `202611070002_pluits_seller_workspace`.
- Tables: profiles, operating_regions, stores, store_members, store_settings, store_operating_hours, store_delivery_zones, product_categories, products, product_variants, product_images, inventory_movements, store_audit_logs.
- Private Storage bucket: `pluits-store-media`, 10 MB max per image, JPEG/PNG/WebP only.
- Image path convention: `<store_uuid>/<product_uuid>/<generated_filename>`.

## Testing scope / limitations
- This is a founder-led early testing workspace, not production-ready commerce.
- Seller onboarding is currently open for Bali only and accepts PT/CV/UD business types.
- Store creation uses the authenticated `create_store` RPC; the database creates the owner membership and default settings atomically.
- Product/category/media write policies now use backend permission checks through `private.has_store_permission`. However, staff invitation/grant-management UI and real owner/staff negative authorization UAT are not complete. Do not invite staff until those tests pass.
- Backend foundations exist for orders and manual bank-transfer review, but seller-side action handlers and end-to-end order/payment UAT are incomplete. Payouts, complete accounting ledger, PDF reports, full operating-hours management, staff invitations, and operational public-store activation are not ready.
- Store images are private; storefront delivery/public image URLs are a later step.
- Supabase Auth email confirmation settings may require inbox confirmation before the first sign-in.

## Known advisor findings
- Security advisor flags the authenticated `SECURITY DEFINER` function `public.create_store`. This is intentional for atomic store-owner bootstrap; it validates `auth.uid()` and restricts execution to authenticated users. Revisit the RPC design before production.
- Performance advisor currently reports unindexed foreign keys and multiple permissive SELECT policies on stores. These are non-blocking for founder testing and should be tuned as usage grows.


## UAT readiness update — 9 November 2026
Read the current [Social & Store UAT Readiness Audit](docs/pluits/SOCIAL-AND-STORE-UAT-READINESS-AUDIT-2026-11-09.md) before testing.

Important current blockers:
- Store onboarding still accepts only PT/CV/UD in both UI and database RPC/constraint. This conflicts with the active business model for UMKM/individual providers and needs a coordinated new migration plus frontend change.
- The Seller Center store query omits `phone`, `public_area`, and `description`, even though the profile form uses them. Saving can clear some existing profile values.
- The verification-submit button and product/order action buttons are rendered without corresponding handlers.
- The online-sales setting attempts a direct `stores` UPDATE; the live policy set does not include an owner UPDATE policy. It needs an owner-guarded RPC.
- The dashboard currently selects the first store only; multi-store selection is not implemented.
- Android responsive and upload testing has not been performed. CSS inspection is not runtime UAT.

Safe founder UAT scope after blockers are fixed: same Auth account → create store → verify owner membership → complete store profile → submit verification → moderator review → enable online sales only after verified/active → create category and draft product. Do not use staff, real payments, payouts, or claim operational same-day delivery before their gates pass.


## Frontend patch deployed — 9 November 2026
- Commit `e1a9d558bf9e3e6906e3b4837dfb9e8b6621b97c`; GitHub Actions run #1043 SUCCESS.
- Existing Auth identity can enter Seller Center. If the account already owns a store, use **+ Buat toko baru** to register another store; after creation the new store is selected. A selector appears when multiple stores exist.
- Store profile fields now load phone, public area, and description. Verification submission calls the owner-guarded RPC.
- Product publish/archive and payment/order actions are connected to their backend permission-checked paths.
- Online-sales status is read-only in the current screen; no browser-side UPDATE is attempted. A dedicated owner-guarded activation RPC is still required.
- Mobile Seller Center navigation uses a two-row layout at narrow widths.

**Testing limit:** workflow build and deploy passed, but Android interaction, actual store creation, upload, and two-account authorization are still NOT TESTED. Current business type remains PT/CV/UD only; do not misrepresent an UMKM/individual business to bypass this limitation.
