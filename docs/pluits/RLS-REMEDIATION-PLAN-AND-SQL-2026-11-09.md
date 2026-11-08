# PLUITS — RLS Remediation Plan & Reviewed SQL Candidate
**Tanggal:** 9 November 2026  
**Project:** Supabase `ytndswhqxayqpftszwfh`  
**Scope:** Social privacy findings SOC-01–SOC-04 and GeoDirectory finding GDT-01  
**Status:** PREPARED FOR REVIEW — NOT APPLIED TO PRODUCTION  
**Safety:** no rows, policies, functions, storage objects, or user accounts were changed while preparing this document.

## 1. Ringkasan keputusan teknis

Perbaikan dibuat dengan satu predicate backend untuk membaca postingan, lalu digunakan secara konsisten oleh parent post, gallery media, comments, likes, comment likes, saves, dan Storage. Predicate menghormati status publikasi, konteks profil, follower yang diterima, dan block dua arah.

GeoDirectory media policies diperbaiki agar membership yang diuji harus berasal dari `directory_media.entity_id` pada baris yang sedang diakses. Perubahan tidak mengubah status entitas, file, atau data membership.

**Tidak termasuk scope:** claim workflow, report-location UI, booking, wallet, affiliate, perubahan frontend, atau perluasan fitur.

## 2. Dasar bukti live

Diperiksa langsung pada database:
- PostgreSQL 17.11.0.018; Supabase region ap-southeast-1.
- `user_posts_read_visible` mengizinkan owner atau public/published yang memenuhi konteks profil/follower, tetapi tidak mengecualikan block.
- `post_comments_read_visible`, `post_likes_read_visible`, dan `post_comment_likes_read_visible` hanya mengecek keberadaan parent, bukan akses viewer terhadap parent.
- Insert comment/like/comment-like hanya mengecek keberadaan parent/identitas, bukan seluruh aturan akses parent.
- `post_media_read_visible` memiliki logika sendiri dan perlu disatukan dengan parent predicate.
- Storage policy `pluits_user_media_read_allowed` mengizinkan owner, konten public, follower tertentu, story, dan avatar/cover, tetapi jalur postingan tidak sepenuhnya mengikuti block dan gallery `post_media`.
- Empat policy `directory_media_manager_insert/update/delete` dan `directory_media_public_read` memakai `m.entity_id = m.entity_id`, bukan hubungan dengan `directory_media.entity_id`.
- `private.is_user_following` dan `private.is_store_publicly_verified` sudah ada. Schema `private` sudah memberi USAGE kepada anon dan authenticated.

## 3. SQL candidate — Social

> SQL berikut adalah kandidat migration. Review terlebih dahulu pada salinan/staging atau transaction test harness. Jangan jalankan potongan terpisah secara manual di production.

### 3.1 Predicate canonical: siapa yang boleh melihat post

```sql
create or replace function private.can_view_post(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.user_posts p
    where p.id = p_post_id
      and (
        p.user_id = (select auth.uid())
        or (
          p.visibility = 'public'
          and p.moderation_status = 'published'
          and (
            (select auth.uid()) is null
            or not exists (
              select 1
              from public.user_blocks b
              where (b.blocker_id = (select auth.uid()) and b.blocked_id = p.user_id)
                 or (b.blocker_id = p.user_id and b.blocked_id = (select auth.uid()))
            )
          )
          and (
            (
              p.profile_context = 'personal'
              and exists (
                select 1
                from public.user_profiles up
                where up.id = p.user_id
                  and (
                    up.visibility = 'public'
                    or private.is_user_following((select auth.uid()), p.user_id, 'accepted')
                  )
              )
            )
            or (
              p.profile_context = 'professional'
              and exists (
                select 1
                from public.professional_profiles pp
                where pp.id = p.professional_profile_id
                  and pp.profile_status = 'active'
                  and pp.visibility = 'public'
              )
            )
            or (
              p.profile_context = 'business'
              and private.is_store_publicly_verified(p.business_store_id)
            )
          )
        )
      )
  );
$function$;

revoke all on function private.can_view_post(uuid) from public;
grant execute on function private.can_view_post(uuid) to anon, authenticated;
```

The function is `SECURITY DEFINER` only to read the parent row without recursive RLS evaluation. It uses an empty search path and fully qualified object names. It accepts no viewer ID from the client; identity is derived from `auth.uid()`. Owner access is retained even when a post is private/unpublished. Public access still requires published status and the existing profile-context rules. Block is checked in both directions for non-owner viewers.

### 3.2 Predicate for legacy and gallery media paths

```sql
create or replace function private.can_view_post_media_path(p_media_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.user_posts p
    where p.media_path = p_media_path
      and private.can_view_post(p.id)
  )
  or exists (
    select 1
    from public.post_media pm
    where pm.media_path = p_media_path
      and private.can_view_post(pm.post_id)
  );
$function$;

revoke all on function private.can_view_post_media_path(text) from public;
grant execute on function private.can_view_post_media_path(text) to anon, authenticated;
```

This preserves the legacy `user_posts.media_path` path and adds gallery media paths. The helper is read-only and does not reveal media metadata beyond the boolean needed by RLS.

### 3.3 Parent post and child table policies

```sql
drop policy if exists user_posts_read_visible on public.user_posts;
create policy user_posts_read_visible
on public.user_posts
for select to authenticated
using (
  user_id = (select auth.uid())
  or private.can_view_post(id)
);

drop policy if exists post_media_read_visible on public.post_media;
create policy post_media_read_visible
on public.post_media
for select to anon, authenticated
using (private.can_view_post(post_id));

drop policy if exists post_comments_read_visible on public.post_comments;
create policy post_comments_read_visible
on public.post_comments
for select to authenticated
using (private.can_view_post(post_id));

drop policy if exists post_comments_insert_self on public.post_comments;
create policy post_comments_insert_self
on public.post_comments
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.can_view_post(post_id)
  and exists (
    select 1
    from public.user_posts p
    where p.id = post_comments.post_id
      and (
        p.user_id = (select auth.uid())
        or coalesce((
          select pref.allow_comments
          from public.account_content_preferences pref
          where pref.user_id = p.user_id
        ), true) = true
      )
  )
  and (
    parent_comment_id is null
    or exists (
      select 1
      from public.post_comments parent
      where parent.id = post_comments.parent_comment_id
        and parent.post_id = post_comments.post_id
    )
  )
);

drop policy if exists post_likes_read_visible on public.post_likes;
create policy post_likes_read_visible
on public.post_likes
for select to authenticated
using (private.can_view_post(post_id));

drop policy if exists post_likes_insert_self on public.post_likes;
create policy post_likes_insert_self
on public.post_likes
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.can_view_post(post_id)
);

drop policy if exists post_comment_likes_read_visible on public.post_comment_likes;
create policy post_comment_likes_read_visible
on public.post_comment_likes
for select to authenticated
using (
  exists (
    select 1
    from public.post_comments c
    where c.id = post_comment_likes.comment_id
      and private.can_view_post(c.post_id)
  )
);

drop policy if exists post_comment_likes_insert_self on public.post_comment_likes;
create policy post_comment_likes_insert_self
on public.post_comment_likes
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.post_comments c
    where c.id = post_comment_likes.comment_id
      and private.can_view_post(c.post_id)
  )
);

drop policy if exists post_saves_insert_self on public.post_saves;
create policy post_saves_insert_self
on public.post_saves
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.can_view_post(post_id)
);
```

Delete-self and select-self policies for `post_saves`, plus delete-self policies for likes/comments, are not changed. Existing anonymous parent-post policy is not changed; the new helper is used by anonymous media access.

### 3.4 Storage read policies

```sql
drop policy if exists pluits_user_media_read_allowed on storage.objects;
create policy pluits_user_media_read_allowed
on storage.objects
for select to authenticated
using (
  bucket_id = 'pluits-user-media'
  and (
    (storage.foldername(name))[1] = ((select auth.uid())::text)
    or private.can_view_post_media_path(name)
    or exists (
      select 1
      from public.user_stories s
      join public.user_profiles up on up.id = s.user_id
      where s.media_path = objects.name
        and s.visibility = 'public'
        and s.expires_at > now()
        and (
          up.visibility = 'public'
          or private.is_user_following((select auth.uid()), s.user_id, 'accepted')
        )
        and not exists (
          select 1
          from public.user_blocks b
          where (b.blocker_id = (select auth.uid()) and b.blocked_id = s.user_id)
             or (b.blocker_id = s.user_id and b.blocked_id = (select auth.uid()))
        )
    )
    or exists (
      select 1
      from public.user_profiles up
      where (up.avatar_path = objects.name or up.cover_path = objects.name)
        and (
          up.visibility = 'public'
          or private.is_user_following((select auth.uid()), up.id, 'accepted')
        )
        and not exists (
          select 1
          from public.user_blocks b
          where (b.blocker_id = (select auth.uid()) and b.blocked_id = up.id)
             or (b.blocker_id = up.id and b.blocked_id = (select auth.uid()))
        )
    )
  )
);

drop policy if exists pluits_user_media_read_public_anon on storage.objects;
create policy pluits_user_media_read_public_anon
on storage.objects
for select to anon
using (
  bucket_id = 'pluits-user-media'
  and (
    private.can_view_post_media_path(name)
    or exists (
      select 1
      from public.user_profiles up
      where up.visibility = 'public'
        and (up.avatar_path = objects.name or up.cover_path = objects.name)
    )
  )
);
```

Existing separate story anonymous policy `pluits_story_media_read_anon` is retained. Upload, update, and delete Storage policies are not changed. Before applying, verify policy names and compare the exact current definitions again because production may have changed since this snapshot.

## 4. SQL candidate — GeoDirectory media policies

```sql
drop policy if exists directory_media_manager_insert on public.directory_media;
create policy directory_media_manager_insert
on public.directory_media
for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and moderation_status = 'pending'
  and exists (
    select 1
    from public.directory_memberships m
    where m.entity_id = directory_media.entity_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'manager', 'staff')
      and (m.starts_at is null or m.starts_at <= now())
      and (m.ends_at is null or m.ends_at > now())
  )
);

drop policy if exists directory_media_manager_update on public.directory_media;
create policy directory_media_manager_update
on public.directory_media
for update to authenticated
using (
  moderation_status = 'pending'
  and exists (
    select 1
    from public.directory_memberships m
    where m.entity_id = directory_media.entity_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'manager', 'staff')
      and (m.starts_at is null or m.starts_at <= now())
      and (m.ends_at is null or m.ends_at > now())
  )
)
with check (
  uploaded_by = (select auth.uid())
  and moderation_status = 'pending'
  and exists (
    select 1
    from public.directory_memberships m
    where m.entity_id = directory_media.entity_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'manager', 'staff')
      and (m.starts_at is null or m.starts_at <= now())
      and (m.ends_at is null or m.ends_at > now())
  )
);

drop policy if exists directory_media_manager_delete on public.directory_media;
create policy directory_media_manager_delete
on public.directory_media
for delete to authenticated
using (
  exists (
    select 1
    from public.directory_memberships m
    where m.entity_id = directory_media.entity_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'manager', 'staff')
      and (m.starts_at is null or m.starts_at <= now())
      and (m.ends_at is null or m.ends_at > now())
  )
);

drop policy if exists directory_media_public_read on public.directory_media;
create policy directory_media_public_read
on public.directory_media
for select to anon, authenticated
using (
  (
    moderation_status = 'published'
    and exists (
      select 1
      from public.directory_entities e
      where e.id = directory_media.entity_id
        and e.status = 'published'
    )
  )
  or exists (
    select 1
    from public.directory_memberships m
    where m.entity_id = directory_media.entity_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and (m.starts_at is null or m.starts_at <= now())
      and (m.ends_at is null or m.ends_at > now())
  )
);
```

Role list preserves the existing owner/manager/staff rule. The time-window check prevents expired/future membership from granting media access. If the product intends a different role/permission model, revise it before migration.

## 5. Important review questions before production

1. Confirm whether `post_media.media_path` always stores the exact Storage object key and whether any rows use a different bucket/path convention.
2. Confirm whether the owner should still see their own post media when moderation is pending/removed. Candidate preserves owner access, consistent with the current parent policy.
3. Confirm whether blocking should hide content mutually in both directions. Candidate applies mutual hiding to the viewer and author.
4. Confirm whether accepted followers should see Stories and profile avatar/cover after either side blocks. Candidate denies.
5. Confirm whether directory membership `starts_at/ends_at` should be enforced. Candidate enforces it.
6. Check all policy names, grants, function ownership, schema USAGE, and function ACLs against the live project immediately before application.

## 6. Required test matrix — not yet executed

Use two founder-controlled test accounts A and B, plus an anonymous session. Do not use unrelated customer accounts or production content.

| Case | Setup | Expected |
|---|---|---|
| Public post | A public/published; B unrelated | B/anon can read post and media |
| Private profile accepted follower | A private; B accepted follower | B can read post, gallery, comments, likes and allowed media |
| Private profile non-follower | A private; B not accepted | B cannot read post, child rows, media, or signed storage object |
| Block A → B | A blocks B | B cannot read A's post/children/media; A retains own access |
| Block B → A | B blocks A | Same mutual restriction |
| Pending/removed post | A owns non-published post | Other users cannot read; owner behavior preserved |
| Comment disabled | A disables comments | B cannot insert comment; owner behavior unchanged |
| Child-row direct API | B guesses a comment/like UUID on hidden post | Zero rows returned |
| Gallery path | Post has media only in post_media | Access matches parent post visibility |
| Storage traversal | B requests object path for A's private media | Denied |
| Directory member same entity | A has active membership on entity X | A can manage permitted pending media on X |
| Directory member other entity | A belongs to X; attempts row for Y | Insert/update/delete/read pending media on Y denied |
| Expired/future membership | Membership not currently active by dates | No management/read privilege |
| Public directory media | Published media under published entity | Public read allowed |
| Pending directory media | Unpublished media under published entity | Public read denied; valid same-entity member may read |

Run tests as real role contexts with actual JWT claims in a disposable/staging database or controlled transaction harness. A SQL query executed as postgres is not proof of RLS behavior.

## 7. Verification and rollout plan

1. Re-read current live policies, table definitions, grants, and migration history.
2. Create a new migration through the project’s normal Supabase CLI workflow; never edit an applied migration.
3. Review SQL and rollback strategy; run migration in staging/disposable environment.
4. Run the test matrix for anon, owner, accepted follower, unrelated authenticated, blocked pair, same-entity manager, and cross-entity member.
5. Run Supabase security/performance advisors; review any new finding.
6. Apply to production only with founder authorization, backup/rollback readiness, and a low-risk release window.
7. Re-query `pg_policies`, function definitions/ACLs, and Storage policies. Confirm the tautological predicates are gone.
8. Re-run two-account Android social flows and production-surface regression. Record failures honestly.

## 8. Rollback and incident handling

- No table rows or media objects are modified by this SQL.
- Before production, capture current definitions of every replaced policy and helper ACL in a secure change record.
- Prefer a forward-fix if the candidate causes a legitimate access regression. Reinstating the old vulnerable policies is not the default rollback.
- If emergency rollback is unavoidable, it requires explicit incident approval, a time limit, restricted exposure, and immediate follow-up fix. Do not silently restore the tautological GeoDirectory policies or child-row access bypass.
- A rollback must not drop user data, storage objects, accounts, or migration history.

## 9. Current status

- [x] Live source and policy inspection.
- [x] Candidate SQL drafted.
- [x] Test matrix and rollout/rollback plan drafted.
- [ ] Migration file generated by Supabase CLI.
- [ ] Staging/disposable migration test.
- [ ] Negative RLS tests with two controlled accounts.
- [ ] Supabase advisors after migration.
- [ ] Production application.
- [ ] Production policy re-verification.
- [ ] Founder Android UAT.

**No production policy has been changed.** The SQL is a reviewed candidate, not evidence of a fix already deployed.
