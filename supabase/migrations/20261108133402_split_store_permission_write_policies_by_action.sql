-- Split write policies by operation so the SELECT policies stay unambiguous.
-- Applied to live Supabase as migration 20261108133402_split_store_permission_write_policies_by_action.

drop policy if exists settings_member_write on public.store_settings;
create policy settings_member_insert on public.store_settings for insert to authenticated
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy settings_member_update on public.store_settings for update to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy settings_member_delete on public.store_settings for delete to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists hours_member_write on public.store_operating_hours;
create policy hours_member_insert on public.store_operating_hours for insert to authenticated
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy hours_member_update on public.store_operating_hours for update to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy hours_member_delete on public.store_operating_hours for delete to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists zones_member_write on public.store_delivery_zones;
create policy zones_member_insert on public.store_delivery_zones for insert to authenticated
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy zones_member_update on public.store_delivery_zones for update to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));
create policy zones_member_delete on public.store_delivery_zones for delete to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists categories_member_write on public.product_categories;
create policy categories_member_insert on public.product_categories for insert to authenticated
  with check (private.has_store_permission(store_id,'catalog.manage'));
create policy categories_member_update on public.product_categories for update to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'))
  with check (private.has_store_permission(store_id,'catalog.manage'));
create policy categories_member_delete on public.product_categories for delete to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'));

drop policy if exists products_member_write on public.products;
create policy products_member_insert on public.products for insert to authenticated
  with check (private.has_store_permission(store_id,'catalog.manage'));
create policy products_member_update on public.products for update to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'))
  with check (private.has_store_permission(store_id,'catalog.manage'));
create policy products_member_delete on public.products for delete to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'));

drop policy if exists variants_member_write on public.product_variants;
create policy variants_member_insert on public.product_variants for insert to authenticated
  with check (exists (
    select 1 from public.products p
    where p.id=product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));
create policy variants_member_update on public.product_variants for update to authenticated
  using (exists (
    select 1 from public.products p
    where p.id=product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ))
  with check (exists (
    select 1 from public.products p
    where p.id=product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));
create policy variants_member_delete on public.product_variants for delete to authenticated
  using (exists (
    select 1 from public.products p
    where p.id=product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));

drop policy if exists images_member_write on public.product_images;
create policy images_member_insert on public.product_images for insert to authenticated
  with check (exists (
    select 1 from public.products p
    where p.id=product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));
create policy images_member_update on public.product_images for update to authenticated
  using (exists (
    select 1 from public.products p
    where p.id=product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ))
  with check (exists (
    select 1 from public.products p
    where p.id=product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));
create policy images_member_delete on public.product_images for delete to authenticated
  using (exists (
    select 1 from public.products p
    where p.id=product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));
