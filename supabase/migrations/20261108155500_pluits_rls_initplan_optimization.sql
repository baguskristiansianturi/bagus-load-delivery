-- Keep existing authorization predicates while evaluating auth helpers once per statement.
alter policy stores_admin_review_read on public.stores
using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = any (array['admin','moderator']));

alter policy content_reports_reporter_or_moderator_read on public.content_reports
using (
  reporter_user_id = (select auth.uid())
  or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = any (array['admin','moderator'])
);

alter policy post_media_read_visible on public.post_media
using (
  exists (
    select 1
    from public.user_posts p
    where p.id = post_media.post_id
      and p.visibility = 'public'
      and p.moderation_status = 'published'
      and (
        (p.profile_context = 'personal' and exists (
          select 1 from public.user_profiles up
          where up.id = p.user_id and up.visibility = 'public'
        ))
        or (p.profile_context = 'professional' and exists (
          select 1 from public.professional_profiles pp
          where pp.id = p.professional_profile_id
            and pp.profile_status = 'active'
            and pp.visibility = 'public'
        ))
        or (p.profile_context = 'business' and private.is_store_publicly_verified(p.business_store_id))
      )
  )
  or (
    (select auth.uid()) is not null
    and exists (
      select 1 from public.user_posts p
      where p.id = post_media.post_id and p.user_id = (select auth.uid())
    )
  )
);