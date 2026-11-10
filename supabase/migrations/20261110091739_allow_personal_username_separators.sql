-- The trigger now owns the format/domain validation and supports hyphens.
-- Keep the existing unique index so usernames remain globally reserved.
alter table public.user_profiles
  drop constraint if exists user_profiles_username_format;
