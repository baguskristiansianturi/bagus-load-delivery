-- Align privileged Marketplace operations with the store permission matrix.
-- Applied to live Supabase as migration 20261108133221_align_marketplace_rpcs_with_store_permission_grants.
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
        or (m.role = 'manager' and p_permission = any (array[
          'store.settings.manage','catalog.manage','orders.manage','payments.manage'
        ]))
        or (m.role = 'catalog' and p_permission = 'catalog.manage')
        or (m.role = 'orders' and p_permission = 'orders.manage')
        or (m.role = 'accounting' and p_permission = 'payments.manage')
        or (
          p_permission = any (array[
            'store.settings.manage','catalog.manage','orders.manage','payments.manage'
          ])
          and (m.permission_grants -> p_permission) = 'true'::jsonb
        )
      )
  );
$function$;

create or replace function public.publish_marketplace_product(p_product_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare v_store public.stores; v_ok boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select s.* into v_store from public.stores s join public.products p on p.store_id=s.id where p.id=p_product_id for update of s;
 if not found then raise exception 'Product not found'; end if;
 if not private.has_store_permission(v_store.id,'catalog.manage') then raise exception 'Not authorized'; end if;
 if v_store.store_status<>'active' or v_store.verification_status<>'verified' or not v_store.online_sales_enabled then raise exception 'Store must be active, verified, and accepting online sales'; end if;
 select exists(select 1 from public.product_variants where product_id=p_product_id and is_active=true and online_price>0 and stock_quantity>0) into v_ok;
 if not v_ok then raise exception 'At least one active variant needs a price and available stock'; end if;
 update public.products set status='published',updated_at=now() where id=p_product_id;
 return jsonb_build_object('product_id',p_product_id,'status','published');
end $function$;

create or replace function public.update_marketplace_fulfillment(p_order_id uuid, p_next_status text, p_note text default '')
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare v_order public.marketplace_orders; v_allowed boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select * into v_order from public.marketplace_orders where id=p_order_id for update;
 if not found then raise exception 'Order not found'; end if;
 v_allowed := private.has_store_permission(v_order.store_id,'orders.manage');
 if not v_allowed then raise exception 'Not authorized to update fulfilment'; end if;
 if not ((v_order.status='paid' and p_next_status='processing') or (v_order.status='processing' and p_next_status in ('ready_for_pickup','shipped')) or (v_order.status in ('ready_for_pickup','shipped') and p_next_status='completed')) then raise exception 'Invalid fulfilment transition'; end if;
 update public.marketplace_orders set status=p_next_status,updated_at=now() where id=v_order.id;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'fulfilment_'||p_next_status,trim(coalesce(p_note,'')));
 return jsonb_build_object('order_id',v_order.id,'status',p_next_status);
end $function$;

create or replace function public.review_marketplace_payment(p_payment_id uuid, p_decision text, p_note text default '')
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare v_payment public.marketplace_payment_records; v_order public.marketplace_orders; v_item record;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if p_decision not in ('verified','rejected') then raise exception 'Invalid review decision'; end if;
 select * into v_payment from public.marketplace_payment_records where id=p_payment_id for update;
 if not found then raise exception 'Payment record not found'; end if;
 select * into v_order from public.marketplace_orders where id=v_payment.order_id for update;
 if not private.has_store_permission(v_order.store_id,'payments.manage') then raise exception 'Only store owner or accounting can review payments'; end if;
 if v_payment.status<>'submitted' or v_order.status<>'payment_review' then raise exception 'Payment is not awaiting review'; end if;
 if p_decision='verified' then
  for v_item in select oi.*,pv.stock_quantity from public.marketplace_order_items oi join public.product_variants pv on pv.id=oi.variant_id where oi.order_id=v_order.id for update of pv loop
   if v_item.stock_quantity<v_item.quantity then raise exception 'Insufficient stock at payment confirmation'; end if;
   update public.product_variants set stock_quantity=stock_quantity-v_item.quantity,updated_at=now() where id=v_item.variant_id;
   insert into public.inventory_movements(store_id,variant_id,movement_type,quantity_change,note,created_by)
   values(v_order.store_id,v_item.variant_id,'sale',-v_item.quantity,'Marketplace order '||v_order.order_number,auth.uid());
  end loop;
  update public.marketplace_payment_records set status='verified',reviewed_by=auth.uid(),reviewed_at=now() where id=v_payment.id;
  update public.marketplace_orders set payment_status='verified',status='paid',updated_at=now() where id=v_order.id;
 else
  update public.marketplace_payment_records set status='rejected',reviewed_by=auth.uid(),reviewed_at=now() where id=v_payment.id;
  update public.marketplace_orders set payment_status='rejected',status='pending_payment',reserved_until=now()+interval '20 minutes',updated_at=now() where id=v_order.id;
 end if;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'payment_'||p_decision,trim(coalesce(p_note,'')));
 return jsonb_build_object('order_id',v_order.id,'status',case when p_decision='verified' then 'paid' else 'pending_payment' end);
end $function$;
