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
- Product and category operations are currently owner workspace basics. Fine-grained staff permission enforcement is not yet enabled; do not invite staff or use this for live operations yet.
- Orders, checkout, payments, payouts, accounting ledger, PDF reports, detailed operating hours, staff invitations, and public store activation are not implemented yet.
- Store images are private; storefront delivery/public image URLs are a later step.
- Supabase Auth email confirmation settings may require inbox confirmation before the first sign-in.

## Known advisor findings
- Security advisor flags the authenticated `SECURITY DEFINER` function `public.create_store`. This is intentional for atomic store-owner bootstrap; it validates `auth.uid()` and restricts execution to authenticated users. Revisit the RPC design before production.
- Performance advisor currently reports unindexed foreign keys and multiple permissive SELECT policies on stores. These are non-blocking for founder testing and should be tuned as usage grows.
