-- Public blog presentation preferences are owner-controlled and do not affect post visibility.
alter table public.blog_profiles
  add column if not exists public_post_order text not null default 'newest',
  add column if not exists featured_post_id uuid null references public.blog_posts(id) on delete set null;

alter table public.blog_profiles
  drop constraint if exists blog_profiles_public_post_order_check;
alter table public.blog_profiles
  add constraint blog_profiles_public_post_order_check
  check (public_post_order in ('newest','oldest'));

create index if not exists blog_posts_public_category_order_idx
  on public.blog_posts (blog_id, category_id, published_at desc)
  where status = 'published' and visibility = 'public';
