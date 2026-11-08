-- Consolidate Marketplace SELECT policies per database role while preserving
-- public catalog visibility and authenticated store-member access.
-- Split former ALL member policies into explicit write policies so SELECT
-- no longer overlaps with a permissive ALL policy.

-- PRODUCTS
drop policy if exists products_member_all on public.products;
drop policy if exists products_public_verified_read on public.products;
create policy products_anon_public_read on public.products
for select to anon
using (
  status='published'
  and exists (
    select 1 from public.stores s
    where s.id=products.store_id
      and s.store_status='active'
      and s.verification_status='verified'
  )
);
create policy products_authenticated_read on public.products
for select to authenticated
using (
  private.is_store_member(store_id)
  or (
    status='published'
    and exists (
      select 1 from public.stores s
      where s.id=products.store_id
        and s.store_status='active'
        and s.verification_status='verified'
    )
  )
);
create policy products_member_insert on public.products
for insert to authenticated
with check (private.is_store_member(store_id));
create policy products_member_update on public.products
for update to authenticated
using (private.is_store_member(store_id))
with check (private.is_store_member(store_id));
create policy products_member_delete on public.products
for delete to authenticated
using (private.is_store_member(store_id));

-- PRODUCT VARIANTS
drop policy if exists variants_member_all on public.product_variants;
drop policy if exists variants_public_verified_read on public.product_variants;
create policy variants_anon_public_read on public.product_variants
for select to anon
using (
  is_active=true
  and exists (
    select 1
    from public.products p
    join public.stores s on s.id=p.store_id
    where p.id=product_variants.product_id
      and p.status='published'
      and s.store_status='active'
      and s.verification_status='verified'
  )
);
create policy variants_authenticated_read on public.product_variants
for select to authenticated
using (
  exists (
    select 1 from public.products p
    where p.id=product_variants.product_id
      and private.is_store_member(p.store_id)
  )
  or (
    is_active=true
    and exists (
      select 1
      from public.products p
      join public.stores s on s.id=p.store_id
      where p.id=product_variants.product_id
        and p.status='published'
        and s.store_status='active'
        and s.verification_status='verified'
    )
  )
);
create policy variants_member_insert on public.product_variants
for insert to authenticated
with check (
  exists (select 1 from public.products p
    where p.id=product_variants.product_id
      and private.is_store_member(p.store_id))
);
create policy variants_member_update on public.product_variants
for update to authenticated
using (
  exists (select 1 from public.products p
    where p.id=product_variants.product_id
      and private.is_store_member(p.store_id))
)
with check (
  exists (select 1 from public.products p
    where p.id=product_variants.product_id
      and private.is_store_member(p.store_id))
);
create policy variants_member_delete on public.product_variants
for delete to authenticated
using (
  exists (select 1 from public.products p
    where p.id=product_variants.product_id
      and private.is_store_member(p.store_id))
);

-- PRODUCT IMAGES
drop policy if exists images_member_all on public.product_images;
drop policy if exists product_images_public_catalog_read on public.product_images;
create policy product_images_anon_public_read on public.product_images
for select to anon
using (
  exists (
    select 1
    from public.products p
    join public.stores s on s.id=p.store_id
    where p.id=product_images.product_id
      and p.status='published'
      and s.store_status='active'
      and s.verification_status='verified'
      and s.online_sales_enabled=true
  )
);
create policy product_images_authenticated_read on public.product_images
for select to authenticated
using (
  exists (
    select 1 from public.products p
    where p.id=product_images.product_id
      and private.is_store_member(p.store_id)
  )
  or exists (
    select 1
    from public.products p
    join public.stores s on s.id=p.store_id
    where p.id=product_images.product_id
      and p.status='published'
      and s.store_status='active'
      and s.verification_status='verified'
      and s.online_sales_enabled=true
  )
);
create policy images_member_insert on public.product_images
for insert to authenticated
with check (
  exists (select 1 from public.products p
    where p.id=product_images.product_id
      and private.is_store_member(p.store_id))
);
create policy images_member_update on public.product_images
for update to authenticated
using (
  exists (select 1 from public.products p
    where p.id=product_images.product_id
      and private.is_store_member(p.store_id))
)
with check (
  exists (select 1 from public.products p
    where p.id=product_images.product_id
      and private.is_store_member(p.store_id))
);
create policy images_member_delete on public.product_images
for delete to authenticated
using (
  exists (select 1 from public.products p
    where p.id=product_images.product_id
      and private.is_store_member(p.store_id))
);

-- STORES: one SELECT policy for each role, with unchanged public, member,
-- owner, and admin/moderator visibility boundaries.
drop policy if exists stores_admin_review_read on public.stores;
drop policy if exists stores_owner_member_read on public.stores;
drop policy if exists stores_public_verified_read on public.stores;
create policy stores_anon_public_read on public.stores
for select to anon
using (store_status='active' and verification_status='verified');
create policy stores_authenticated_read on public.stores
for select to authenticated
using (
  (store_status='active' and verification_status='verified')
  or owner_user_id=(select auth.uid())
  or private.is_store_member(id)
  or coalesce(((select auth.jwt())->'app_metadata'->>'role'),'') in ('admin','moderator')
);