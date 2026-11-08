create or replace function public.place_marketplace_order(p_store_id uuid,p_items jsonb,p_buyer_name text,p_buyer_phone text,p_delivery_method text default 'pickup',p_delivery_address text default '',p_buyer_note text default '',p_delivery_zone_id uuid default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid();v_order public.marketplace_orders;v_item jsonb;v_variant public.product_variants;v_product public.products;v_qty numeric;v_price numeric;v_subtotal numeric:=0;v_reserved numeric;v_delivery_fee numeric:=0;v_zone public.store_delivery_zones;v_zone_name text:='';v_store_minimum numeric:=0;
begin
 if v_user is null then raise exception 'Sign in required';end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>30 then raise exception 'Cart must contain 1 to 30 items';end if;
 if (select count(distinct value->>'variant_id') from jsonb_array_elements(p_items))<>jsonb_array_length(p_items) then raise exception 'Duplicate product option in cart';end if;
 if length(trim(coalesce(p_buyer_name,'')))<2 or length(trim(coalesce(p_buyer_phone,'')))<6 then raise exception 'Buyer name and phone are required';end if;
 if p_delivery_method not in ('pickup','delivery') then raise exception 'Invalid delivery method';end if;
 if not exists(select 1 from public.stores s where s.id=p_store_id and s.store_status='active' and s.verification_status='verified' and s.online_sales_enabled=true) then raise exception 'Store is not accepting online orders';end if;
 select coalesce(minimum_order_amount,0) into v_store_minimum from public.store_settings where store_id=p_store_id;
 update public.marketplace_orders set status='cancelled',updated_at=now() where store_id=p_store_id and status='pending_payment' and payment_status='unpaid' and reserved_until<=now();
 if p_delivery_method='pickup' then
  if not exists(select 1 from public.store_settings where store_id=p_store_id and allow_pickup=true) then raise exception 'Store does not offer pickup';end if;
 else
  if length(trim(coalesce(p_delivery_address,'')))<8 then raise exception 'Delivery address is required';end if;
  if p_delivery_zone_id is null then raise exception 'Choose a delivery area';end if;
  select * into v_zone from public.store_delivery_zones where id=p_delivery_zone_id and store_id=p_store_id and is_active=true for share;
  if not found then raise exception 'Delivery area is unavailable';end if;
  if not exists(select 1 from public.store_settings where store_id=p_store_id and allow_delivery=true) then raise exception 'Store does not offer delivery';end if;
  if v_zone.delivery_fee is null then raise exception 'Delivery fee requires manual confirmation';end if;
  v_delivery_fee:=v_zone.delivery_fee;v_zone_name:=v_zone.name;
 end if;
 for v_item in select value from jsonb_array_elements(p_items) loop
  v_qty:=nullif(v_item->>'quantity','')::numeric;
  if v_qty is null or v_qty<=0 or v_qty>10000 then raise exception 'Invalid item quantity';end if;
  select pv.* into v_variant from public.product_variants pv join public.products p on p.id=pv.product_id where pv.id=(v_item->>'variant_id')::uuid and p.store_id=p_store_id and p.status='published' and pv.is_active=true for update of pv;
  if not found then raise exception 'Product option is unavailable';end if;
  select * into v_product from public.products where id=v_variant.product_id;
  if v_qty<v_product.minimum_quantity then raise exception 'Minimum quantity for % is %',v_product.name,v_product.minimum_quantity;end if;
  v_price:=coalesce(v_variant.discount_price,v_variant.online_price);
  if v_price is null or v_price<=0 then raise exception 'Product price is unavailable';end if;
  select coalesce(sum(oi.quantity),0) into v_reserved from public.marketplace_order_items oi join public.marketplace_orders o on o.id=oi.order_id where oi.variant_id=v_variant.id and o.status in ('pending_payment','payment_review') and o.reserved_until>now();
  if v_variant.stock_quantity-v_reserved<v_qty then raise exception 'Insufficient stock for %',v_product.name;end if;
  v_subtotal:=v_subtotal+(v_price*v_qty);
 end loop;
 if v_subtotal<v_store_minimum then raise exception 'Minimum order amount is %',v_store_minimum;end if;
 if p_delivery_method='delivery' and v_subtotal<v_zone.minimum_order_amount then raise exception 'Minimum order for delivery area is %',v_zone.minimum_order_amount;end if;
 if p_delivery_method='delivery' and v_zone.free_delivery_minimum is not null and v_subtotal>=v_zone.free_delivery_minimum then v_delivery_fee:=0;end if;
 insert into public.marketplace_orders(buyer_user_id,store_id,subtotal,delivery_fee,total_amount,buyer_name,buyer_phone,delivery_method,delivery_address,delivery_zone_id,delivery_zone_name,buyer_note)
 values(v_user,p_store_id,v_subtotal,v_delivery_fee,v_subtotal+v_delivery_fee,trim(p_buyer_name),trim(p_buyer_phone),p_delivery_method,trim(coalesce(p_delivery_address,'')),p_delivery_zone_id,v_zone_name,trim(coalesce(p_buyer_note,''))) returning * into v_order;
 for v_item in select value from jsonb_array_elements(p_items) loop
  v_qty:=(v_item->>'quantity')::numeric;select pv.* into v_variant from public.product_variants pv where pv.id=(v_item->>'variant_id')::uuid;select * into v_product from public.products where id=v_variant.product_id;v_price:=coalesce(v_variant.discount_price,v_variant.online_price);
  insert into public.marketplace_order_items(order_id,product_id,variant_id,product_name,variant_name,quantity,unit_price,line_total) values(v_order.id,v_product.id,v_variant.id,v_product.name,v_variant.variant_name,v_qty,v_price,v_price*v_qty);
 end loop;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,v_user,'order_created','Order created; awaiting manual bank transfer');
 return jsonb_build_object('order_id',v_order.id,'order_number',v_order.order_number,'status',v_order.status,'subtotal',v_order.subtotal,'delivery_fee',v_order.delivery_fee,'total_amount',v_order.total_amount,'reserved_until',v_order.reserved_until);
end $$;
revoke all on function public.place_marketplace_order(uuid,jsonb,text,text,text,text,text,uuid) from public,anon;grant execute on function public.place_marketplace_order(uuid,jsonb,text,text,text,text,text,uuid) to authenticated;
