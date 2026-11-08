drop view if exists public.public_marketplace_products;
grant select (online_sales_enabled) on public.stores to anon,authenticated;
create view public.public_marketplace_products with(security_invoker=true) as
select p.id,p.store_id,s.name as store_name,s.username as store_username,p.name,p.description,p.brand,p.base_unit,p.minimum_quantity,
v.id as variant_id,v.variant_name,v.sale_unit,v.online_price,v.discount_price,v.stock_quantity
from public.products p join public.stores s on s.id=p.store_id join public.product_variants v on v.product_id=p.id
where p.status='published' and s.store_status='active' and s.verification_status='verified' and s.online_sales_enabled=true and v.is_active=true and v.online_price>0;
revoke all on public.public_marketplace_products from anon,authenticated;
grant select on public.public_marketplace_products to anon,authenticated;
create or replace function public.publish_marketplace_product(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_store public.stores; v_ok boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select s.* into v_store from public.stores s join public.products p on p.store_id=s.id where p.id=p_product_id for update of s;
 if not found then raise exception 'Product not found'; end if;
 if not exists(select 1 from public.store_members where store_id=v_store.id and user_id=auth.uid() and member_status='active' and role in ('owner','manager','catalog')) then raise exception 'Not authorized'; end if;
 if v_store.store_status<>'active' or v_store.verification_status<>'verified' or not v_store.online_sales_enabled then raise exception 'Store must be active, verified, and accepting online sales'; end if;
 select exists(select 1 from public.product_variants where product_id=p_product_id and is_active=true and online_price>0 and stock_quantity>0) into v_ok;
 if not v_ok then raise exception 'At least one active variant needs a price and available stock'; end if;
 update public.products set status='published',updated_at=now() where id=p_product_id;
 return jsonb_build_object('product_id',p_product_id,'status','published');
end $$;
revoke all on function public.publish_marketplace_product(uuid) from public,anon;
grant execute on function public.publish_marketplace_product(uuid) to authenticated;