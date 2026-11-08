
alter table public.user_posts
  add constraint user_posts_media_path_owner_check
  check (
    media_path is null
    or (
      split_part(media_path, '/', 1) = user_id::text
      and split_part(media_path, '/', 2) <> ''
    )
  ) not valid;

alter table public.user_posts
  validate constraint user_posts_media_path_owner_check;

alter table public.user_stories
  add constraint user_stories_media_path_owner_check
  check (
    split_part(media_path, '/', 1) = user_id::text
    and split_part(media_path, '/', 2) <> ''
  ) not valid;

alter table public.user_stories
  validate constraint user_stories_media_path_owner_check;
