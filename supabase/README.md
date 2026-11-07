# Backend — Bagus Load & Delivery

Backend foundation for the Bali-first construction-material marketplace.

## Current architecture
- Supabase Auth: user identity and sessions.
- Supabase Postgres: marketplace data, protected by Row Level Security (RLS).
- Supabase Storage: product and business-document files (policies to be added before uploads are enabled).
- One account can be both buyer and store owner; store access is granted through `store_members`.
- Exact shop address and coordinates are isolated in `store_private_locations`; public store records only expose city/area.
- Region onboarding is configuration-driven. Bali (`ID-BA`) is seeded as the initial open region.
- Catalog is intentionally empty. No demo shops, products, or variants are inserted.

## Apply
1. Create a dedicated Supabase project for this repository in the agreed organization and region.
2. Review `supabase/migrations/202611070001_initial_marketplace.sql`.
3. Apply it to the dedicated project using the Supabase migration workflow.
4. Run security/performance advisors and verify RLS policies before connecting a client.
5. Configure Auth redirect URLs and Storage buckets/policies separately. Never place a service-role key in browser code.

## Current scope
This first migration establishes profiles, operating regions, store membership, private locations, store hours, delivery zones, flexible categories, products, variants, images metadata, inventory movement records, and audit-log storage.

Orders, checkout, payments, automated stock reservation, product-specific preparation rules, map polygon validation, seller document workflow, and admin authorization are intentionally subsequent milestones. They must be added with explicit business rules and tests rather than guessed.

## Security notes
- Public reads are limited to active stores, published products, active variants, and public operational data.
- Exact addresses and precise coordinates have no anonymous read policy.
- RLS is enabled on every table in this migration.
- Store staff roles are stored now; fine-grained permission enforcement is a follow-up before inviting staff.
- Audit log reads are scoped to store members; trusted write path/triggers are a follow-up before relying on audit history.
- Do not use user-editable Auth metadata as an authorization source.
