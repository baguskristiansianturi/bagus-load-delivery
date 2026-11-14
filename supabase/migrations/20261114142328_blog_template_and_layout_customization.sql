-- Additive owner-controlled blog presentation settings.
-- Content, post slugs, URLs, and privacy policies remain unchanged.
alter table public.blog_profiles
  add column if not exists template_key text not null default 'aurelia',
  add column if not exists theme_settings jsonb not null default '{}'::jsonb,
  add column if not exists layout_settings jsonb not null default '{"blocks":["profile_header","featured_story","recent_stories","categories","photo_gallery","about_me","footer"],"hidden":[]}'::jsonb;

alter table public.blog_profiles
  drop constraint if exists blog_profiles_template_key_check,
  drop constraint if exists blog_profiles_theme_settings_object_check,
  drop constraint if exists blog_profiles_layout_settings_object_check;

alter table public.blog_profiles
  add constraint blog_profiles_template_key_check
    check (template_key in ('aurelia','stavero','brewnox','rovanta','lunelle','pressora','newstera','editora','infonara')),
  add constraint blog_profiles_theme_settings_object_check
    check (jsonb_typeof(theme_settings) = 'object'),
  add constraint blog_profiles_layout_settings_object_check
    check (jsonb_typeof(layout_settings) = 'object');

create index if not exists blog_profiles_featured_post_id_idx
  on public.blog_profiles (featured_post_id);

comment on column public.blog_profiles.template_key is 'Selected PLUITS blog template identifier; changing templates never alters content or URLs.';
comment on column public.blog_profiles.theme_settings is 'Owner-controlled presentation preferences only; never HTML, scripts, or arbitrary CSS.';
comment on column public.blog_profiles.layout_settings is 'Owner-selected presentation block visibility and order; it does not change content access policy.';
