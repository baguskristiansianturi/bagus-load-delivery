-- Extend the private user-media bucket for common Android 3G2 video files.
update storage.buckets
set allowed_mime_types = (
  select array_agg(distinct mime order by mime)
  from unnest(coalesce(allowed_mime_types, array[]::text[]) || array['video/3gpp2']) as mime
)
where id = 'pluits-user-media';
