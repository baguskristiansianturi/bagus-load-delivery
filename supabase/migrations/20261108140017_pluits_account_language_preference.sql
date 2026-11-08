alter table public.user_profiles
  add column if not exists preferred_language text not null default 'id';
alter table public.user_profiles
  drop constraint if exists user_profiles_preferred_language_check;
alter table public.user_profiles
  add constraint user_profiles_preferred_language_check
  check (preferred_language in ('id','en'));
