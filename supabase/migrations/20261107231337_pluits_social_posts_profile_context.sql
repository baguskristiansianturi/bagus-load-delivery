alter table public.user_posts
 add column if not exists profile_context text not null default 'personal'
 check (profile_context in ('personal','professional','business'));
alter table public.user_posts
 add column if not exists professional_profile_id uuid references public.professional_profiles(id) on delete set null;
alter table public.user_posts
 add column if not exists business_store_id uuid references public.stores(id) on delete set null;
alter table public.user_posts
 add constraint user_posts_context_target_check check (
  (profile_context='personal' and professional_profile_id is null and business_store_id is null)
  or (profile_context='professional' and professional_profile_id is not null and business_store_id is null)
  or (profile_context='business' and business_store_id is not null and professional_profile_id is null)
);
create index if not exists user_posts_context_created_idx on public.user_posts(profile_context,created_at desc);
create index if not exists user_posts_professional_idx on public.user_posts(professional_profile_id) where professional_profile_id is not null;
create index if not exists user_posts_business_store_idx on public.user_posts(business_store_id) where business_store_id is not null;

drop policy if exists user_posts_insert_self on public.user_posts;
create policy user_posts_insert_self on public.user_posts
for insert to authenticated with check (
 user_id=(select auth.uid()) and (
  (profile_context='personal' and professional_profile_id is null and business_store_id is null)
  or (profile_context='professional' and business_store_id is null and exists (
    select 1 from public.professional_profiles p where p.id=professional_profile_id and p.user_id=(select auth.uid())
  ))
  or (profile_context='business' and professional_profile_id is null and exists (
    select 1 from public.stores s where s.id=business_store_id and (
      s.owner_user_id=(select auth.uid()) or exists (
        select 1 from public.store_members sm where sm.store_id=s.id and sm.user_id=(select auth.uid()) and sm.member_status='active'
      )
    )
  ))
 )
);
drop policy if exists user_posts_update_self on public.user_posts;
create policy user_posts_update_self on public.user_posts
for update to authenticated using (user_id=(select auth.uid()))
with check (
 user_id=(select auth.uid()) and (
  (profile_context='personal' and professional_profile_id is null and business_store_id is null)
  or (profile_context='professional' and business_store_id is null and exists (
    select 1 from public.professional_profiles p where p.id=professional_profile_id and p.user_id=(select auth.uid())
  ))
  or (profile_context='business' and professional_profile_id is null and exists (
    select 1 from public.stores s where s.id=business_store_id and (
      s.owner_user_id=(select auth.uid()) or exists (
        select 1 from public.store_members sm where sm.store_id=s.id and sm.user_id=(select auth.uid()) and sm.member_status='active'
      )
    )
  ))
 )
);
drop policy if exists user_posts_read_public_anon on public.user_posts;
create policy user_posts_read_public_anon on public.user_posts
for select to anon using (
 visibility='public' and moderation_status='published' and (
  (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
  or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
  or (profile_context='business' and exists (select 1 from public.stores s where s.id=user_posts.business_store_id and s.store_status='active' and s.verification_status='verified'))
 )
);
drop policy if exists user_posts_read_visible on public.user_posts;
create policy user_posts_read_visible on public.user_posts
for select to authenticated using (
 user_id=(select auth.uid()) or (
  visibility='public' and moderation_status='published' and (
   (profile_context='personal' and exists (select 1 from public.user_profiles up where up.id=user_posts.user_id and up.visibility='public'))
   or (profile_context='professional' and exists (select 1 from public.professional_profiles pp where pp.id=user_posts.professional_profile_id and pp.profile_status='active' and pp.visibility='public'))
   or (profile_context='business' and exists (select 1 from public.stores s where s.id=user_posts.business_store_id and s.store_status='active' and s.verification_status='verified'))
  )
 )
);