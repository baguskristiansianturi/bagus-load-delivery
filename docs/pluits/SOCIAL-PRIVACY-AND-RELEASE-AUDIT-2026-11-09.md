# PLUITS — Social Privacy & Release Audit
**Tanggal:** 9 November 2026  
**Repository:** baguskristiansianturi/pluits · branch main  
**Supabase:** ytndswhqxayqpftszwfh · live production snapshot  
**Sifat:** read-only policy/source inspection; no data, policy, migration, or deployment changed.

## 1. Tujuan
Social Media adalah P0 dan pintu masuk PLUITS. Karena targetnya pengguna seperti Ibu Nia, pengalaman harus mudah dan familiar, tetapi privasi akun, konten, komentar, pesan, dan media harus tetap benar di backend. Menyembunyikan konten di frontend tidak cukup.

## 2. Status source dan data yang diperiksa
- Feed utama: `src/pages/home/index.js`; pengguna login diarahkan ke feed interaktif kanonis melalui `mountUserAccount('explore')`.
- Social account/feed/actions: `src/pages/account/index.js`.
- DM/realtime/offline queue: `src/pages/messages/index.js`.
- Regression guard: `scripts/verify-production-surface.mjs`.
- Live row counts saat pemeriksaan: 5 user_posts, 4 post_media, 0 user_follows, 0 user_messages. Angka agregat ini bukan bukti UAT dan tidak boleh dipakai untuk mengarang aktivitas pengguna.
- Kode memiliki menu edit/hapus postingan, double-tap like, save/share, Stories/Reels, serta DM outbox. Static code presence tidak membuktikan runtime berhasil.

## 3. Temuan RLS yang perlu ditangani sebelum Social First Release diterima

### SOC-01 — Komentar dan like pada post dapat dibaca tanpa memeriksa akses parent post
**Severity: HIGH — potensi kebocoran metadata konten privat.**

Policy live:
- `post_comments_read_visible` hanya memeriksa bahwa parent `user_posts` dengan ID tersebut ada.
- `post_likes_read_visible` juga hanya memeriksa keberadaan parent post.
- `post_comment_likes_read_visible` hanya memeriksa keberadaan komentar dan parent post.

Policy tersebut tidak menerapkan syarat visibility, moderation status, profile visibility, accepted follower, atau block terhadap pembaca. Akibatnya authenticated user yang tidak berhak membaca parent post berpotensi tetap membaca komentar/like rows melalui API langsung.

**Perbaikan yang diperlukan:** gunakan satu predicate backend kanonis untuk “viewer can read this post” dan terapkan pada child rows. Uji anon, owner, accepted follower, unrelated authenticated user, private account, blocked pair, removed/unpublished post, serta post profesional/bisnis.

### SOC-02 — Like dan comment insert belum mengikat aksi ke hak melihat parent post
**Severity: HIGH — integritas interaksi dan privasi.**

- `post_likes_insert_self` hanya memastikan post ID ada dan user_id adalah auth.uid.
- `post_comments_insert_self` memeriksa bahwa post ada dan pengaturan allow_comments mengizinkan, tetapi tidak secara eksplisit mewajibkan pembaca memiliki akses ke post.
- `post_comment_likes_insert_self` memeriksa keberadaan komentar dan identitas user, bukan akses ke parent post.

**Perbaikan yang diperlukan:** semua insert harus menggunakan predicate visibilitas parent yang sama, serta aturan comment permission, block, moderation, dan rate limit. Uji API langsung, bukan hanya tombol UI.

### SOC-03 — Block relationship belum tampak ditegakkan pada read policy user_posts
**Severity: HIGH — safety expectation mismatch.**

Policy `user_posts_read_visible` memberi akses owner atau konten public/eligible dan accepted follower. Policy yang diperiksa tidak mengecualikan pasangan yang saling block. UI Reels memang menyaring blocked IDs, tetapi itu bukan pengaman API dan tidak menjamin direct query, deep link, atau media access menghormati block.

**Perbaikan yang diperlukan:** definisikan perilaku block secara konsisten untuk profil, feed, post detail, comments, likes, search, Reels, media storage, dan messaging. Backend harus menegakkan aturan tersebut. Uji kedua arah block dan data lama.

### SOC-04 — Media post privat berpotensi tidak tampil kepada accepted follower
**Severity: MEDIUM — potensi ketidaksesuaian fitur private account.**

Policy `post_media_read_visible` yang terlihat mengizinkan owner dan post public/eligible, tetapi tidak tampak memasukkan accepted follower untuk post privat. Sementara policy parent `user_posts_read_visible` mengizinkan accepted follower melihat post privat personal. Ini dapat menyebabkan follower melihat metadata post tetapi tidak dapat membaca baris media terkait.

**Perbaikan yang diperlukan:** samakan predicate parent dan media; jangan memperluas akses tanpa aturan privasi yang sama. Uji akun privat dengan follower diterima dan non-follower.

## 4. Pemeriksaan positif yang terlihat
- `user_posts` memiliki policy insert/update/delete self dan memeriksa konteks personal/professional/business.
- `post_media` insert/delete memeriksa user_id dan kepemilikan parent post.
- Storage bucket `pluits-user-media` memiliki policy folder ownership untuk insert/update/delete.
- DM message insert/read menggunakan helper conversation membership dan can-send.
- Policy di atas belum menggantikan uji negative authorization dua akun.

## 5. Kualitas implementasi frontend — belum menjadi bukti UAT
- Home login diarahkan ke satu feed interaktif; ini menghindari dua implementasi feed.
- Menu edit/hapus post dan double-tap like ditemukan pada source.
- Editor media melakukan beberapa operasi database/storage terpisah. Kegagalan di tengah urutan dapat meninggalkan file yatim atau parent metadata yang perlu rekonsiliasi; acceptance test harus mencakup partial failure.
- DM offline queue menyimpan draft lokal dan mengandalkan idempotency; reconnect harus diuji dua akun dan tidak boleh menandai pesan terkirim sebelum server mengonfirmasi.
- Stories/Reels dan notifikasi tetap memerlukan Android real-device UAT.

## 6. Gate sebelum menerima Social First Release
1. Tinjau dan perbaiki SOC-01 sampai SOC-04 melalui migration baru; jangan edit migration yang sudah diterapkan.
2. Buat satu predicate akses parent post yang dapat dipakai oleh parent, media, comments, likes, saves, dan storage.
3. Jalankan negative tests untuk anon/owner/follower/non-follower/blocked/revoked/moderator dan profile contexts.
4. Jalankan dua akun nyata untuk post, edit, delete, double tap, comment/reply, follow/private request, block, Story, Reels, DM, offline/reconnect, notifications, dan settings.
5. Jalankan regression guard, production build, deploy exact SHA, dan verifikasi Pages.
6. Founder melakukan UAT Android dan menyatakan ACCEPTED.

## 7. Batas perubahan
Audit ini tidak mengubah policy live. Karena perubahan RLS produksi memengaruhi privasi dan hak akses akun yang sudah terdaftar, migration remediation harus memiliki approval eksplisit, review SQL, rollback plan, dan test matrix sebelum diterapkan.
