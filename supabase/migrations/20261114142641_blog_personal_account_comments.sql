create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  parent_comment_id uuid null references public.blog_comments(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  status text not null default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_comments_post_created_idx
  on public.blog_comments (blog_post_id, created_at)
  where status = 'visible';
create index if not exists blog_comments_parent_idx
  on public.blog_comments (parent_comment_id)
  where parent_comment_id is not null;

alter table public.blog_comments enable row level security;

drop policy if exists blog_comments_public_read on public.blog_comments;
create policy blog_comments_public_read
on public.blog_comments for select
to anon, authenticated
using (
  status = 'visible'
  and exists (
    select 1 from public.blog_posts p
    join public.blog_profiles b on b.id = p.blog_id
    where p.id = blog_comments.blog_post_id
      and p.status = 'published'
      and p.visibility = 'public'
      and b.default_visibility = 'public'
  )
);

drop policy if exists blog_comments_authenticated_insert on public.blog_comments;
create policy blog_comments_authenticated_insert
on public.blog_comments for insert
to authenticated
with check (
  author_user_id = (select auth.uid())
  and exists (
    select 1 from public.blog_posts p
    join public.blog_profiles b on b.id = p.blog_id
    where p.id = blog_comments.blog_post_id
      and p.status = 'published'
      and p.visibility = 'public'
      and b.default_visibility = 'public'
  )
  and (
    parent_comment_id is null
    or exists (
      select 1 from public.blog_comments parent
      where parent.id = blog_comments.parent_comment_id
        and parent.blog_post_id = blog_comments.blog_post_id
        and parent.status = 'visible'
    )
  )
);

drop policy if exists blog_comments_author_or_owner_delete on public.blog_comments;
create policy blog_comments_author_or_owner_delete
on public.blog_comments for delete
to authenticated
using (
  author_user_id = (select auth.uid())
  or exists (
    select 1 from public.blog_posts p
    where p.id = blog_comments.blog_post_id
      and p.owner_user_id = (select auth.uid())
  )
);

grant select on public.blog_comments to anon, authenticated;
grant insert, delete on public.blog_comments to authenticated;
comment on table public.blog_comments is 'Comments on public PLUITS blog articles. Comment authors use their personal PLUITS account identity; blog publication does not emit notifications.';
