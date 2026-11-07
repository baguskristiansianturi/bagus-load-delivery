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

Database schema is applied in Supabase. Confirm the live migration list and advisors before further DDL. Do not assume a migration file in GitHub has been applied unless it appears in the Supabase migration history.

## User media storage
Private bucket: `pluits-user-media`.
- Maximum file size: 50 MB.
- Allowed MIME: JPEG, PNG, WebP, GIF, MP4, WebM.
- Object path starts with the authenticated user's UUID.
- RLS restricts uploads/deletes to the owner and reads to the owner or content allowed by public profile/post visibility.
- The frontend uses short-lived signed URLs for rendering. Never expose a service-role key in the browser.

## Security
- RLS is enabled on all user profile, address, post, interaction and tag tables.
- Address rows are owner-only.
- Username is unique case-insensitively.
- Profile display name is not unique.
- The public profile location contains only city/regency and province.
- Exact address and coordinates must never be returned in public profile/feed queries.
- Wallet and real money operations are not enabled.
- Storage upload for video is currently standard upload with a 50 MB cap; resumable/TUS upload remains future work.
- Run security/performance advisors after each schema change. Current known advisor warnings from earlier seller migrations include authenticated SECURITY DEFINER store RPCs and missing FK indexes; review before production.

## Project handoff
- [Business model master](../MASTER/BUSINESS-MODEL-MASTER.md)
- [Project checkpoints and PR roadmap](../MASTER/PROJECT-STATUS-ROADMAP.md)
- [Mobile first-user test guide](../MASTER/PLUITS-USER-TESTING.md)
- [Security review](../MASTER/PLUITS-SECURITY-REVIEW.md)
