alter table public.user_posts
  add column if not exists content_kind text not null default 'post'
  check (content_kind in ('post','reel'));

create index if not exists user_posts_public_reels_created_idx
  on public.user_posts (created_at desc)
  where content_kind = 'reel'
    and visibility = 'public'
    and moderation_status = 'published';
