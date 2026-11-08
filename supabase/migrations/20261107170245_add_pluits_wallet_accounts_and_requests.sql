create table if not exists public.wallet_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade,
 balance_minor bigint not null default 0 check (balance_minor >= 0),
 currency text not null default 'IDR' check (currency = 'IDR'),
 updated_at timestamptz not null default now()
);
create table if not exists public.wallet_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 request_type text not null check (request_type in ('top_up','withdrawal')),
 amount_minor bigint not null check (amount_minor > 0),
 payment_method text,
 destination_details text,
 note text,
 status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
 created_at timestamptz not null default now(),
 processed_at timestamptz
);
create index if not exists wallet_requests_user_created_idx on public.wallet_requests(user_id, created_at desc);
alter table public.wallet_accounts enable row level security;
alter table public.wallet_requests enable row level security;
grant select on public.wallet_accounts to authenticated;
grant select, insert on public.wallet_requests to authenticated;
drop policy if exists wallet_accounts_read_own on public.wallet_accounts;
create policy wallet_accounts_read_own on public.wallet_accounts for select to authenticated using (auth.uid() = user_id);
drop policy if exists wallet_requests_read_own on public.wallet_requests;
create policy wallet_requests_read_own on public.wallet_requests for select to authenticated using (auth.uid() = user_id);
drop policy if exists wallet_requests_insert_own on public.wallet_requests;
create policy wallet_requests_insert_own on public.wallet_requests for insert to authenticated with check (auth.uid() = user_id and status = 'pending' and processed_at is null);
create or replace function public.create_wallet_account_for_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
 insert into public.wallet_accounts(user_id) values (new.id) on conflict (user_id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_wallet on auth.users;
create trigger on_auth_user_created_wallet after insert on auth.users
for each row execute procedure public.create_wallet_account_for_new_user();
insert into public.wallet_accounts(user_id)
select id from auth.users on conflict (user_id) do nothing;