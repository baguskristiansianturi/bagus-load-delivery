create policy "pluits_media_insert_own_folder"
on storage.objects for insert to authenticated
with check (
 bucket_id = 'pluits-user-media'
 and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "pluits_media_select_owner_or_public_post"
on storage.objects for select to anon, authenticated
using (
 bucket_id = 'pluits-user-media'
 and (
   (select auth.uid())::text = (storage.foldername(name))[1]
   or exists (
     select 1
     from public.user_posts p
     join public.user_profiles up on up.id = p.user_id
     where p.media_path = storage.objects.name
       and p.visibility = 'public'
       and p.moderation_status = 'published'
       and up.visibility = 'public'
   )
 )
);

create policy "pluits_media_update_own_folder"
on storage.objects for update to authenticated
using (
 bucket_id = 'pluits-user-media'
 and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
 bucket_id = 'pluits-user-media'
 and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "pluits_media_delete_own_folder"
on storage.objects for delete to authenticated
using (
 bucket_id = 'pluits-user-media'
 and (storage.foldername(name))[1] = (select auth.uid()::text)
);