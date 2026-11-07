# Backend Foundation — Implementation Notes

**Project:** Bagus Load & Delivery  
**Stage:** Foundation v1  
**Date:** 7 November 2026

## Goal
Provide a secure, incremental backend that lets the founder test the seller workflow first. The first live dataset must be entered by the founder; there is no seeded demo inventory.

## Data model
- `profiles`: one profile per Auth user.
- `operating_regions`: configurable regional launch gate; Bali is the initial open region.
- `stores`: public-safe store identity, business type, region, status, verification state.
- `store_members`: one user can belong to multiple stores and hold scoped roles.
- `store_private_locations`: full address and exact coordinates; never public.
- `store_operating_hours`: weekly operating and order/pickup cutoffs.
- `store_delivery_zones`: configurable delivery rules and zone geometry payload.
- `product_categories`: platform categories or seller-owned categories.
- `products`: flexible parent product record.
- `product_variants`: SKU, attributes, online/offline prices, discount, stock and physical dimensions.
- `product_images`: Storage object metadata.
- `inventory_movements`: stock change ledger.
- `store_audit_logs`: audit record foundation.

## Seller-first test sequence
1. Create account and profile.
2. Request a store under an open seller region.
3. Complete business identity and private address/location.
4. Accept seller terms and activate store after minimum checks.
5. Set hours and delivery zones.
6. Create flexible categories.
7. Create products and variants, including dimensions and weight where relevant.
8. Update stock, online price, discount, and publication status.
9. Confirm only active stores and published products are publicly discoverable.
10. Test ownership boundaries with a second account.

## Important implementation boundaries
- A store being `active` does not imply it is `verified`; public UI must show verification state accurately.
- No exact address/coordinate fields belong in public store APIs.
- One Auth account supports buyer and seller roles; buyer capability does not require a separate buyer role row.
- Variant stock is represented as a numeric quantity to support units beyond integer pieces.
- Discounts cannot exceed the online price.
- Order/checkout and stock reservation need a transaction-safe design in the next migration.
- Staff permissions are not yet production-ready; only owner-level flows should be exposed until granular policies are implemented.

## Next milestones
1. Dedicated Supabase project and apply migration.
2. Validate RLS with owner, unrelated authenticated user, and anonymous visitor.
3. Add secure onboarding RPC/Edge Function with server-side Bali region check and business eligibility checks.
4. Add seller dashboard APIs and Storage policies.
5. Add order, order-item snapshots, stock reservation, checkout validation and status transitions.
6. Add operating-hour and product preparation rules, zone evaluation and delivery quote flow.
7. Build mobile-first seller interface and run real-world testing with founder's shop.

## Open decisions
- Exact PT/CV/UD legal-document requirements and verification workflow.
- Seller onboarding activation policy and limits for unverified stores.
- Fine-grained staff permission matrix.
- Delivery zone geometry format and geospatial implementation.
- Product attribute templates by category.
- Payment model and payment provider.
