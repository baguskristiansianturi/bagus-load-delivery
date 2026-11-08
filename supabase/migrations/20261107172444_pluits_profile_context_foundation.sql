
create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  headline text not null default '',
  bio text not null default '',
  profession_category text not null,
  skills text[] not null default '{}',
  experience_years smallint not null default 0 check (experience_years between 0 and 80),
  service_city text,
  service_province text,
  service_radius_km integer check (service_radius_km is null or service_radius_km between 0 and 1000),
  price_from_minor bigint check (price_from_minor is null or price_from_minor >= 0),
  currency char(3) not null default 'IDR',
  contact_preferences jsonb not null default '{"pluits_chat": true}'::jsonb,
  visibility text not null default 'public' check (visibility in ('public','unlisted')),
  profile_status text not null default 'draft' check (profile_status in ('draft','submitted','active','rejected','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_username_format check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9-]{2,39}$')
);

create index if not exists professional_profiles_category_idx on public.professional_profiles (profession_category);
create index if not exists professional_profiles_public_idx on public.professional_profiles (profile_status, visibility);

create table if not exists public.professional_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  media_path text,
  external_url text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_media_or_link check (media_path is not null or external_url is not null or description <> '')
);
create index if not exists professional_portfolio_order_idx on public.professional_portfolio_items (professional_id, display_order, created_at desc);

create table if not exists public.account_context_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_context text not null default 'personal' check (active_context in ('personal','professional','business')),
  active_store_id uuid references public.stores(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint active_store_only_business check (active_context = 'business' or active_store_id is null)
);

create table if not exists public.profile_verification_cases (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('professional','store')),
  target_id uuid not null,
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  verification_scope text not null,
  status text not null default 'submitted' check (status in ('submitted','under_review','verified','rejected','expired','suspended')),
  evidence_paths jsonb not null default '[]'::jsonb,
  applicant_note text not null default '',
  reviewer_user_id uuid references auth.users(id) on delete set null,
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profile_verification_target_idx on public.profile_verification_cases (target_type, target_id, created_at desc);
create index if not exists profile_verification_applicant_idx on public.profile_verification_cases (applicant_user_id, created_at desc);

alter table public.professional_profiles enable row level security;
alter table public.professional_portfolio_items enable row level security;
alter table public.account_context_preferences enable row level security;
alter table public.profile_verification_cases enable row level security;

drop policy if exists professional_profiles_public_read on public.professional_profiles;
create policy professional_profiles_public_read on public.professional_profiles
for select to anon, authenticated
using (profile_status = 'active' and visibility = 'public');

drop policy if exists professional_profiles_owner_read on public.professional_profiles;
create policy professional_profiles_owner_read on public.professional_profiles
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists professional_profiles_owner_insert on public.professional_profiles;
create policy professional_profiles_owner_insert on public.professional_profiles
for insert to authenticated with check (user_id = (select auth.uid()) and profile_status in ('draft','submitted'));

drop policy if exists professional_profiles_owner_update on public.professional_profiles;
create policy professional_profiles_owner_update on public.professional_profiles
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and profile_status in ('draft','submitted'));

drop policy if exists professional_portfolio_public_read on public.professional_portfolio_items;
create policy professional_portfolio_public_read on public.professional_portfolio_items
for select to anon, authenticated
using (is_published and exists (
  select 1 from public.professional_profiles p
  where p.id = professional_id and p.profile_status = 'active' and p.visibility = 'public'
));

drop policy if exists professional_portfolio_owner_read on public.professional_portfolio_items;
create policy professional_portfolio_owner_read on public.professional_portfolio_items
for select to authenticated using (
  exists (select 1 from public.professional_profiles p where p.id = professional_id and p.user_id = (select auth.uid()))
);

drop policy if exists professional_portfolio_owner_insert on public.professional_portfolio_items;
create policy professional_portfolio_owner_insert on public.professional_portfolio_items
for insert to authenticated with check (
  exists (select 1 from public.professional_profiles p where p.id = professional_id and p.user_id = (select auth.uid()))
);

drop policy if exists professional_portfolio_owner_update on public.professional_portfolio_items;
create policy professional_portfolio_owner_update on public.professional_portfolio_items
for update to authenticated
using (exists (select 1 from public.professional_profiles p where p.id = professional_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.professional_profiles p where p.id = professional_id and p.user_id = (select auth.uid())));

drop policy if exists professional_portfolio_owner_delete on public.professional_portfolio_items;
create policy professional_portfolio_owner_delete on public.professional_portfolio_items
for delete to authenticated
using (exists (select 1 from public.professional_profiles p where p.id = professional_id and p.user_id = (select auth.uid())));

drop policy if exists account_context_preferences_owner_all on public.account_context_preferences;
create policy account_context_preferences_owner_all on public.account_context_preferences
for all to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (
    active_store_id is null
    or exists (
      select 1 from public.stores s
      where s.id = active_store_id
        and (s.owner_user_id = (select auth.uid()) or exists (
          select 1 from public.store_members sm
          where sm.store_id = s.id and sm.user_id = (select auth.uid()) and sm.member_status = 'active'
        ))
    )
  )
);

drop policy if exists profile_verification_applicant_read on public.profile_verification_cases;
create policy profile_verification_applicant_read on public.profile_verification_cases
for select to authenticated using (applicant_user_id = (select auth.uid()));

drop policy if exists profile_verification_applicant_insert on public.profile_verification_cases;
create policy profile_verification_applicant_insert on public.profile_verification_cases
for insert to authenticated with check (
  applicant_user_id = (select auth.uid())
  and status = 'submitted'
  and reviewer_user_id is null
  and reviewed_at is null
  and (
    (target_type = 'professional' and exists (
      select 1 from public.professional_profiles p
      where p.id = target_id and p.user_id = (select auth.uid())
    ))
    or
    (target_type = 'store' and exists (
      select 1 from public.stores s
      where s.id = target_id and (s.owner_user_id = (select auth.uid()) or exists (
        select 1 from public.store_members sm
        where sm.store_id = s.id and sm.user_id = (select auth.uid()) and sm.role = 'owner' and sm.member_status = 'active'
      ))
    ))
  )
);

drop trigger if exists professional_profiles_updated_at on public.professional_profiles;
create trigger professional_profiles_updated_at before update on public.professional_profiles
for each row execute function private.touch_updated_at();
drop trigger if exists professional_portfolio_updated_at on public.professional_portfolio_items;
create trigger professional_portfolio_updated_at before update on public.professional_portfolio_items
for each row execute function private.touch_updated_at();
drop trigger if exists account_context_preferences_updated_at on public.account_context_preferences;
create trigger account_context_preferences_updated_at before update on public.account_context_preferences
for each row execute function private.touch_updated_at();
drop trigger if exists profile_verification_cases_updated_at on public.profile_verification_cases;
create trigger profile_verification_cases_updated_at before update on public.profile_verification_cases
for each row execute function private.touch_updated_at();

grant select, insert, update on public.professional_profiles to authenticated;
grant select, insert, update, delete on public.professional_portfolio_items to authenticated;
grant select, insert, update on public.account_context_preferences to authenticated;
grant select, insert on public.profile_verification_cases to authenticated;
grant select on public.professional_profiles, public.professional_portfolio_items to anon;
