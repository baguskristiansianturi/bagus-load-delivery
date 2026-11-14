-- Blog is a Social Media content format. Premium entitlement was intentionally deferred
-- by product decision D-008; any authenticated account may create one own blog space.
drop policy if exists "Premium users create their blog profile" on public.blog_profiles;
create policy "Authenticated users create their own blog profile"
  on public.blog_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_user_id);
