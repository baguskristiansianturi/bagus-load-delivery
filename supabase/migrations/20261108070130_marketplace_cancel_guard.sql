create or replace function public.cancel_marketplace_order(p_order_id uuid,p_reason text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_order public.marketplace_orders;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select * into v_order from public.marketplace_orders where id=p_order_id and buyer_user_id=auth.uid() for update;
 if not found then raise exception 'Order not found'; end if;
 if v_order.status<>'pending_payment' or v_order.payment_status<>'unpaid' then raise exception 'Only unpaid orders can be cancelled directly. Contact the seller if a transfer was already submitted.'; end if;
 update public.marketplace_orders set status='cancelled',updated_at=now() where id=v_order.id;
 insert into public.marketplace_order_events(order_id,actor_user_id,event_type,note) values(v_order.id,auth.uid(),'order_cancelled',trim(coalesce(p_reason,'')));
 return jsonb_build_object('order_id',v_order.id,'status','cancelled');
end $$;
revoke all on function public.cancel_marketplace_order(uuid,text) from public,anon;
grant execute on function public.cancel_marketplace_order(uuid,text) to authenticated;
