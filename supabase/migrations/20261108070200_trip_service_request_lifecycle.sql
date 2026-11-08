create table if not exists public.trip_service_requests (
 id uuid primary key default gen_random_uuid(),
 requester_user_id uuid not null references auth.users(id) on delete restrict,
 provider_entity_id uuid not null references public.directory_entities(id) on delete restrict,
 requested_date date not null,
 party_size integer not null check(party_size between 1 and 50),
 message text not null default '',
 status text not null default 'requested' check(status in ('requested','accepted','declined','cancelled','completed')),
 provider_response text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists trip_service_requests_requester_idx on public.trip_service_requests(requester_user_id,created_at desc);
create index if not exists trip_service_requests_provider_idx on public.trip_service_requests(provider_entity_id,status,created_at desc);
alter table public.trip_service_requests enable row level security;
revoke all on public.trip_service_requests from anon,authenticated;
grant select on public.trip_service_requests to authenticated;
create policy trip_service_requests_participant_read on public.trip_service_requests for select to authenticated using(requester_user_id=(select auth.uid()) or exists(select 1 from public.directory_memberships dm where dm.entity_id=trip_service_requests.provider_entity_id and dm.user_id=(select auth.uid()) and dm.status='active' and (dm.ends_at is null or dm.ends_at>now())));
create or replace function public.request_trip_service(p_provider_entity_id uuid,p_requested_date date,p_party_size integer,p_message text default '')
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v_id uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if p_requested_date<current_date then raise exception 'Requested date cannot be in the past';end if;
 if p_party_size<1 or p_party_size>50 then raise exception 'Party size must be between 1 and 50';end if;
 if not exists(select 1 from public.directory_entities where id=p_provider_entity_id and entity_type in ('provider','organization') and status='published' and verification_status='verified') then raise exception 'Provider is not verified or publicly available';end if;
 insert into public.trip_service_requests(requester_user_id,provider_entity_id,requested_date,party_size,message)
 values(auth.uid(),p_provider_entity_id,p_requested_date,p_party_size,left(trim(coalesce(p_message,'')),2000)) returning id into v_id;
 return v_id;
end $$;
revoke all on function public.request_trip_service(uuid,date,integer,text) from public,anon;
grant execute on function public.request_trip_service(uuid,date,integer,text) to authenticated;
create or replace function public.respond_trip_service_request(p_request_id uuid,p_decision text,p_response text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_req public.trip_service_requests;v_allowed boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if p_decision not in ('accepted','declined','completed') then raise exception 'Invalid response';end if;
 select * into v_req from public.trip_service_requests where id=p_request_id for update;
 if not found then raise exception 'Request not found';end if;
 select exists(select 1 from public.directory_memberships where entity_id=v_req.provider_entity_id and user_id=auth.uid() and status='active' and (ends_at is null or ends_at>now()) and role in ('owner','manager','staff')) into v_allowed;
 if not v_allowed then raise exception 'Not authorized for this provider';end if;
 if (p_decision in ('accepted','declined') and v_req.status<>'requested') or (p_decision='completed' and v_req.status<>'accepted') then raise exception 'Invalid request state transition';end if;
 update public.trip_service_requests set status=p_decision,provider_response=left(trim(coalesce(p_response,'')),2000),updated_at=now() where id=v_req.id;
 return jsonb_build_object('request_id',v_req.id,'status',p_decision);
end $$;
revoke all on function public.respond_trip_service_request(uuid,text,text) from public,anon;
grant execute on function public.respond_trip_service_request(uuid,text,text) to authenticated;
create or replace function public.cancel_trip_service_request(p_request_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_req public.trip_service_requests;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 select * into v_req from public.trip_service_requests where id=p_request_id and requester_user_id=auth.uid() for update;
 if not found then raise exception 'Request not found';end if;
 if v_req.status not in ('requested','accepted') then raise exception 'Request cannot be cancelled';end if;
 update public.trip_service_requests set status='cancelled',updated_at=now() where id=v_req.id;
 return jsonb_build_object('request_id',v_req.id,'status','cancelled');
end $$;
revoke all on function public.cancel_trip_service_request(uuid) from public,anon;
grant execute on function public.cancel_trip_service_request(uuid) to authenticated;
