create or replace function public.review_marketplace_payment(p_payment_id uuid,p_decision text,p_note text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_payment public.marketplace_payment_records;v_order public.marketplace_orders;v_item record;v_member boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if p_decision not in ('verified','rejected') then raise exception 'Invalid review decision';end if;
 select * into v_payment from public.marketplace_payment_records where id=p_payment_id for update;
 if not found then raise exception 'Payment record not found';end if;
 select * into v_order from public.marketplace_orders where id=v_payment.order_id for update;
 select exists(select 1 from public.store_members where store_id=v_order.store_id and user_id=auth.uid() and member_status='active' and role in ('owner','accounting')) into v_member;
 if not v_member then raise exception 'Only store owner or accounting can review payments';end if;
 if v_payment.status<>'submitted' or v_order.status<>'payment_review' then raise exception 'Payment is not awaiting review';end if;
 if p_decision='verified' then
  for v_item in select oi.*,pv.stock_quantity from public.marketplace_order_items oi join public.product_variants pv on pv.id=oi.variant_id where oi.order_id=v_order.id for update of pv loop
   if v_item.stock_quantity<v_item.quantity then raise exception 'Insufficient stock at payment confirmation';end if;
   update public.product_variants set stock_quantity=stock_quantity-v_item.quantity,updated_at=now() where id=v_item.variant_id;
   insert into public.inventory_movements(store_id,variant_id,movement_type,quantity_change,note,created_by) values(v_order.store_id,v_item.variant_id,'sale',-v_item.quantity,'Marketplace order '||v_order.order_number,auth.uid());
  end loop;
  update public.marketplace_payment_records set status='verified',reviewed_by=auth.uid(),reviewed_at=now() where id=v_payment.id;
  update public.marketplace_orders set payment_status='verified',status='paid',updated_at=now() where id=v_order.id;
 else
  update public.marketplace_payment_records set status='rejected',reviewed_by=auth.uid(),reviewed_at=now() where id=v_payment.id;
  update public.marketplace_orders set payment_status='rejected',status='pending_payment',reserved_until=now()+interval '20 minutes',updated_at=now() where id=v_order.id;
 end if;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'payment_'||p_decision,trim(coalesce(p_note,'')));
 return jsonb_build_object('order_id',v_order.id,'status',case when p_decision='verified' then 'paid' else 'pending_payment' end);
end $$;
revoke all on function public.review_marketplace_payment(uuid,text,text) from public,anon;grant execute on function public.review_marketplace_payment(uuid,text,text) to authenticated;
create or replace function public.update_marketplace_fulfillment(p_order_id uuid,p_next_status text,p_note text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_order public.marketplace_orders;v_allowed boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 select * into v_order from public.marketplace_orders where id=p_order_id for update;
 if not found then raise exception 'Order not found';end if;
 select exists(select 1 from public.store_members where store_id=v_order.store_id and user_id=auth.uid() and member_status='active' and role in ('owner','manager','orders')) into v_allowed;
 if not v_allowed then raise exception 'Not authorized to update fulfilment';end if;
 if not ((v_order.status='paid' and p_next_status='processing') or (v_order.status='processing' and p_next_status in ('ready_for_pickup','shipped')) or (v_order.status in ('ready_for_pickup','shipped') and p_next_status='completed')) then raise exception 'Invalid fulfilment transition';end if;
 update public.marketplace_orders set status=p_next_status,updated_at=now() where id=v_order.id;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'fulfilment_'||p_next_status,trim(coalesce(p_note,'')));
 return jsonb_build_object('order_id',v_order.id,'status',p_next_status);
end $$;
revoke all on function public.update_marketplace_fulfillment(uuid,text,text) from public,anon;grant execute on function public.update_marketplace_fulfillment(uuid,text,text) to authenticated;
create or replace function public.cancel_marketplace_order(p_order_id uuid,p_reason text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_order public.marketplace_orders;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 select * into v_order from public.marketplace_orders where id=p_order_id and buyer_user_id=auth.uid() for update;
 if not found then raise exception 'Order not found';end if;
 if v_order.status<>'pending_payment' or v_order.payment_status<>'unpaid' then raise exception 'Only unpaid orders can be cancelled directly';end if;
 update public.marketplace_orders set status='cancelled',updated_at=now() where id=v_order.id;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'order_cancelled',trim(coalesce(p_reason,'')));
 return jsonb_build_object('order_id',v_order.id,'status','cancelled');
end $$;
revoke all on function public.cancel_marketplace_order(uuid,text) from public,anon;grant execute on function public.cancel_marketplace_order(uuid,text) to authenticated;
