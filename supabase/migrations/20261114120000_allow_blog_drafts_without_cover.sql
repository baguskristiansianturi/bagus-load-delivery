-- Allow an unfinished Blog Studio draft to be saved before a cover is selected.
-- Published articles still require a cover, and every non-null cover remains owner-scoped.
alter table public.blog_posts
  alter column cover_path drop not null;

alter table public.blog_posts
  drop constraint if exists blog_posts_cover_owner_path;

alter table public.blog_posts
  add constraint blog_posts_cover_owner_path
  check (
    cover_path is null
    or cover_path like owner_user_id::text || '/blog/%'
  );

alter table public.blog_posts
  add constraint blog_posts_published_cover_required
  check (status <> 'published' or cover_path is not null);
