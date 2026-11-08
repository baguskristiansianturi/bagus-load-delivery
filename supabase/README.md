# Pluits — Backend

**Produk:** Pluits  
**Perusahaan:** Pluits Indonesia  
**Repository:** `baguskristiansianturi/bagus-load-delivery`  
**Supabase project:** `ytndswhqxayqpftszwfh` (Singapore)

## Prinsip
- Pluits adalah produk tersendiri, terpisah dari Bagusin dan Bali Trans.
- Satu Supabase Auth identity dipakai oleh pembeli, owner toko, dan staff yang diberi akses.
- Pengguna boleh menggunakan Pluits sebagai pembeli/anggota komunitas tanpa membuat toko.
- Owner toko mendaftarkan dan mengelola toko melalui Seller Center terpisah; profil toko dan profil pribadi tidak disatukan.
- Alamat lengkap dan titik peta pengguna disimpan privat dan tidak menjadi lokasi publik profil.
- Katalog kosong secara default. Jangan seed toko atau produk palsu.

## Frontend account routes
- `#/account/register` — daftar pengguna.
- `#/account/login` — login pengguna.
- `#/account/profile` — profil pengguna, avatar, cover, bio, username, lokasi publik, pengaturan privasi.
- `#/account/addresses` — alamat tersimpan privat, kode pos, titik peta.
- `#/account/compose` — unggah foto/video.
- `#/account/explore` — feed campuran foto dan video.
- `#/account/post/{id}` — detail postingan dan interaksi.
- `#/seller/register` — Seller Center; gunakan identitas Auth yang sama.

## Applied migrations
1. `202611070002_pluits_seller_workspace.sql` — seller onboarding/workspace.
2. `202611070003_pluits_store_profile_hardening.sql` — hardening store private/public boundary.
3. `202611070004_user_first_social_foundation.sql` — user profiles, private addresses, posts, likes, comments, saves, private user media bucket and RLS.
4. `202611070005_post_account_tags.sql` — account tags on posts.
5. `20261107142901_pluits_public_social_read.sql` — anonymous read-only access to public profiles/posts and tightly scoped signed URL creation for public media.

Database schema is applied in Supabase. Confirm the live migration list and advisors before further DDL. Do not assume a migration file in GitHub has been applied unless it appears in the Supabase migration history.

## User media storage
Private bucket: `pluits-user-media`.
- Maximum file size: 50 MB.
- Allowed MIME: JPEG, PNG, WebP, GIF, MP4, WebM.
- Object path starts with the authenticated user's UUID.
- RLS restricts uploads/deletes to the owner and reads to the owner or content allowed by public profile/post visibility.
- The frontend uses short-lived signed URLs for rendering. Anonymous read policy permits signed URLs only for media referenced by public published posts or public profiles; private posts and private profiles remain inaccessible. Never expose a service-role key in the browser.

## Security
- RLS is enabled on all user profile, address, post, interaction and tag tables.
- Address rows are owner-only.
- Username is unique case-insensitively.
- Profile display name is not unique.
- The public profile location contains only city/regency and province.
- Exact address and coordinates must never be returned in public profile/feed queries.
- Wallet tables and a user request screen are scaffolded, but no payment provider, verified settlement, withdrawal processing, or complete financial ledger is implemented. This is not an operational real-money wallet; do not advertise balance/top-up/withdrawal as available.
- Storage upload for video is currently standard upload with a 50 MB cap; resumable/TUS upload remains future work.
- Run security/performance advisors after each schema change. The latest 8 Nov 2026 audit reports two authenticated-callable SECURITY DEFINER store RPCs and leaked-password protection disabled. Performance notices: 14 unindexed foreign keys and 12 unused-index notices; wallet RLS init-plan and duplicate Stories SELECT warnings have been cleared. See MASTER/PLUITS-SECURITY-REVIEW.md.

## Project handoff
- [Business model master](../MASTER/BUSINESS-MODEL-MASTER.md)
- [Project checkpoints and PR roadmap](../MASTER/PROJECT-STATUS-ROADMAP.md)
- [Mobile first-user test guide](../MASTER/PLUITS-USER-TESTING.md)
- [Security review](../MASTER/PLUITS-SECURITY-REVIEW.md)


## First real-user test
- Use `#/account/register` to create a real Supabase Auth account.
- Email confirmation redirects to the GitHub Pages site root; then sign in if no session is present.
- An Auth trigger creates the initial user profile row. Username can be personalized in profile settings.
- A public post should appear in the signed-in Explore feed and the public homepage feed. A private post should remain visible only to its owner.
- No test user, sample post, fake review, or fake transaction has been inserted by this setup.


## Supabase Auth redirect for GitHub Pages testing
Set the GitHub Pages base URL as an allowed redirect URL in Supabase Authentication → URL Configuration:
`https://baguskristiansianturi.github.io/bagus-load-delivery/`
The registration flow uses the current GitHub Pages base path as `emailRedirectTo`. When a custom domain is purchased, add the new domain to Redirect URLs before switching the frontend callback target. Keep the GitHub Pages URL during transition until the custom domain is verified.

## Live audit snapshot — 8 November 2026

- Supabase project `pluits` is ACTIVE_HEALTHY in `ap-southeast-1`, PostgreSQL 17.
- All 28 tables in the public schema have RLS enabled.
- No Supabase Edge Functions are deployed.
- Security advisor: two warnings for authenticated execution of `public.create_store` and `public.update_store_profile` (both check `auth.uid()` and use an empty fixed search_path; anonymous execution is denied, but authorization tests and grant review remain required); leaked-password protection is disabled.
- Performance advisor after hardening: 14 unindexed foreign keys and 12 unused-index notices. Wallet RLS init-plan warnings and duplicate Stories SELECT policy warning are cleared. No health lints were returned.
- The live store/product seed state remains one draft unverified store and one draft product; do not present them as active public listings.
- Public feed media display was corrected in commit `07d81f76b8c46c9e81f53104263b1d91320daa5a` so mobile feed images/videos use intrinsic proportions rather than forced cover-cropping. Deployment run must be checked before claiming it is live.

### Anonymous access smoke test — 8 November 2026
Executed read-only queries as the PostgreSQL `anon` role inside a rolled-back transaction:
- Public profiles visible: 2.
- Public posts visible: 1.
- Private addresses visible: 0.
- Active Stories visible: 0.
- `pluits-user-media` objects visible: 2 of 4 total.
- `pluits-store-media` objects visible: 0 of 1 total.

This is a limited anonymous smoke test only. It does not replace signed-in owner/second-user tests, Storage upload/delete tests, or adversarial media-path tests.

### Media ownership hardening — 8 November 2026
- Migration `20261108011806_enforce_social_media_owner_paths` adds validated CHECK constraints to `user_posts` and `user_stories`: any referenced media path must start with the posting user's UUID folder and include a non-empty object name.
- Adversarial test before fix: a public post with another UUID's media path was accepted inside a rollback transaction.
- Adversarial tests after fix: foreign-folder media paths for posts and Stories were rejected; same-user folder paths were accepted. All probe rows were rolled back.
- Migration `20261108011838_optimize_story_and_wallet_rls_policies` consolidates Stories SELECT policies and changes wallet RLS identity calls to init-plan-safe `(select auth.uid())`.
- Re-run advisors: the Stories multiple-permissive warning and three wallet RLS init-plan warnings are no longer reported.

### Stories UI status — 8 November 2026
- Explore includes a responsive Stories strip, photo/video upload composer, audience selector, and viewer.
- Public Story visibility requires a public profile; private Story is owner-only.
- RLS smoke test confirmed public Story visible to anon and private Story hidden from anon.
- GitHub Pages workflow run 423 passed build and deploy. Real account and Android UAT still required.
- Story records expire from active reads after 24 hours; scheduled media cleanup/archive is not implemented.

### Reels UI status — 8 November 2026
- Explore links to a dedicated vertical Reels feed based on existing video posts.
- Likes/comments/share/save reuse the existing social post interaction flow.
- Video aspect ratio is preserved; autoplay/full-screen swipe are not enabled yet.
- GitHub Pages workflow run 432 passed build and deploy. Real video upload and Android UAT still required.

## Follow graph — backend dan frontend

- Live migration `20261108014153` sampai `20261108014743` menambah follow graph, privacy-aware requests, safe profile directory, safe follow counts, accepted-follower access, dan policy recursion hardening.
- Public profile directory dan follow-count tersedia melalui public wrapper `SECURITY INVOKER`; helper `SECURITY DEFINER` berada di schema private dan tidak menjadi endpoint public langsung.
- Private profile fields dan media tidak dibuka kepada pending requester atau anon.
- Frontend menyediakan profil publik berdasarkan username, follow/unfollow, permintaan follow, accept/decline, followers/following list, dan guest public profile/post view.
- Backend rollback tests passed. GitHub Pages run #465 passed build and deployment. Real user/Android UAT and Lighthouse/runtime performance measurement remain pending. Build bundle: JS 172.94 kB (gzip 49.59 kB), CSS 258.32 kB (gzip 44.57 kB).
