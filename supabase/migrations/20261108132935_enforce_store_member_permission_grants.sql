-- Store owner and explicitly granted staff permissions.
-- Applied to live Supabase as migration 20261108132935_enforce_store_member_permission_grants.
create or replace function private.has_store_permission(p_store_id uuid, p_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.store_members m
    where m.store_id = p_store_id
      and m.user_id = (select auth.uid())
      and m.member_status = 'active'
      and (
        m.role = 'owner'
        or (
          p_permission = any (array['store.settings.manage','catalog.manage'])
          and (m.permission_grants -> p_permission) = 'true'::jsonb
        )
      )
  );
$function$;

revoke all on function private.has_store_permission(uuid,text) from public, anon;
grant execute on function private.has_store_permission(uuid,text) to authenticated;

drop policy if exists settings_member_all on public.store_settings;
create policy settings_member_read on public.store_settings
  for select to authenticated
  using (private.is_store_member(store_id));
create policy settings_member_write on public.store_settings
  for all to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists hours_member_all on public.store_operating_hours;
create policy hours_member_read on public.store_operating_hours
  for select to authenticated
  using (private.is_store_member(store_id));
create policy hours_member_write on public.store_operating_hours
  for all to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists zones_member_all on public.store_delivery_zones;
create policy zones_member_read on public.store_delivery_zones
  for select to authenticated
  using (private.is_store_member(store_id));
create policy zones_member_write on public.store_delivery_zones
  for all to authenticated
  using (private.has_store_permission(store_id,'store.settings.manage'))
  with check (private.has_store_permission(store_id,'store.settings.manage'));

drop policy if exists categories_member_all on public.product_categories;
create policy categories_member_read on public.product_categories
  for select to authenticated
  using (private.is_store_member(store_id));
create policy categories_member_write on public.product_categories
  for all to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'))
  with check (private.has_store_permission(store_id,'catalog.manage'));

drop policy if exists products_member_delete on public.products;
drop policy if exists products_member_insert on public.products;
drop policy if exists products_member_update on public.products;
create policy products_member_write on public.products
  for all to authenticated
  using (private.has_store_permission(store_id,'catalog.manage'))
  with check (private.has_store_permission(store_id,'catalog.manage'));

drop policy if exists variants_member_delete on public.product_variants;
drop policy if exists variants_member_insert on public.product_variants;
drop policy if exists variants_member_update on public.product_variants;
create policy variants_member_write on public.product_variants
  for all to authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ))
  with check (exists (
    select 1 from public.products p
    where p.id = product_variants.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));

drop policy if exists images_member_delete on public.product_images;
drop policy if exists images_member_insert on public.product_images;
drop policy if exists images_member_update on public.product_images;
create policy images_member_write on public.product_images
  for all to authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ))
  with check (exists (
    select 1 from public.products p
    where p.id = product_images.product_id
      and private.has_store_permission(p.store_id,'catalog.manage')
  ));

drop policy if exists pluits_media_owner_upload on storage.objects;
create policy pluits_media_owner_upload on storage.objects
  for insert to authenticated
  with check (
    bucket_id='pluits-store-media'
    and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and private.has_store_permission(((storage.foldername(name))[1])::uuid,'catalog.manage')
  );

drop policy if exists pluits_media_member_update on storage.objects;
create policy pluits_media_member_update on storage.objects
  for update to authenticated
  using (
    bucket_id='pluits-store-media'
    and private.has_store_permission(((storage.foldername(name))[1])::uuid,'catalog.manage')
  )
  with check (
    bucket_id='pluits-store-media'
    and private.has_store_permission(((storage.foldername(name))[1])::uuid,'catalog.manage')
  );

drop policy if exists pluits_media_member_delete on storage.objects;
create policy pluits_media_member_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id='pluits-store-media'
    and private.has_store_permission(((storage.foldername(name))[1])::uuid,'catalog.manage')
  );
