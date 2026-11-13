# PLUITS — Security & Migration Reconciliation Audit

**Tanggal pemeriksaan:** 13 November 2026  
**Baseline kode:** `main` — `4ef9fb96e8e942511879303f355a7336860c287f`  
**Branch dokumentasi:** `work/production-design-inventory`  
**Status:** Audit read-only; temuan sudah dicatat, perbaikan produksi belum dilakukan.

> Dokumen ini mencatat hasil pemeriksaan langsung terhadap metadata Supabase, definisi RLS, fungsi SQL, dan berkas migrasi di GitHub. Tidak ada DDL, perubahan data, perubahan policy, deployment, atau merge PR yang dilakukan.

## 1. Ringkasan hasil

- Database publik memiliki **68 tabel**, seluruhnya mengaktifkan RLS.
- Ada **3 public view** dan ketiganya memakai `security_invoker=true`.
- Ada **32 public function**, termasuk **23 SECURITY DEFINER**. Sebanyak 22 fungsi publik SECURITY DEFINER terdaftar sebagai dapat dipanggil role authenticated.
- Ada **3 private Storage bucket** dan 18 policy pada `storage.objects`.
- Ada **97 catatan migrasi live**, sedangkan repository `main` berisi **90 berkas migrasi**.
- Ditemukan empat policy `directory_media` yang memiliki kondisi relasi salah dan membuka akses lintas-entitas.
- Policy baca publik `products` dan `product_variants` tidak konsisten dengan syarat `online_sales_enabled` yang sudah diterapkan pada public catalog view.
- Policy baca relasi post–GeoDirectory di database live lebih longgar daripada definisi pada migration SQL yang ada di repository.
- Pemeriksaan isi 22 public SECURITY DEFINER function tidak menemukan pola umum bahwa semua fungsi tersebut otomatis rentan; izin dan pemeriksaan pemilik/role perlu dibaca per fungsi. Peringatan advisor bukan bukti eksploitasi dengan sendirinya.

## 2. Rekonsiliasi riwayat migrasi

### 2.1 Angka yang terverifikasi

| Ukuran | Jumlah |
|---|---:|
| Migration SQL di repository `main` | 90 |
| Catatan migrasi di database live | 97 |
| Nama migrasi live yang cocok persis dengan basename repository | 67 |
| Dari 67 nama tersebut, timestamp live berbeda dari timestamp file | 19 |
| Catatan live tanpa basename yang cocok persis | 30 |
| File repository tanpa nama live yang cocok persis | 23 |

Tiga puluh catatan live yang tidak cocok persis dapat diuraikan menjadi:

- **21 catatan non-Blog** memiliki kandidat file repository dengan nama yang berbeda. Kandidat-kandidat ini tercantum dalam manifest lama di PR #3, tetapi belum boleh dianggap sebagai pemetaan final tanpa verifikasi isi dan urutan.
- **9 migrasi Blog** tidak memiliki berkas sumber yang sesuai di repository `main`.

Sembilan nama migrasi Blog yang tidak ditemukan sebagai file di repository:

1. `create_blog_profiles_and_persistent_posts`
2. `blog_auto_slug_categories_and_username_routes`
3. `blog_post_slugs_and_public_media`
4. `secure_public_blog_routes_and_private_profiles`
5. `harden_blog_slug_functions_and_indexes`
6. `auto_slug_blog_categories`
7. `validate_blog_content_slugs`
8. `consolidate_blog_category_rls_policies`
9. `enforce_private_blog_media_visibility`

Dua file repository yang tidak mempunyai pasangan nama live atau override pada manifest lama:

- `20261110090000_submit_professional_profile.sql`
- `20261110111500_allow_android_3gpp2_video_upload.sql`

Efek sebagian perubahan mungkin sudah tercakup dalam migrasi lain, tetapi itu belum membuktikan asal dan urutan migrasinya.

### 2.2 Manifest lama di PR #3

PR #3 memiliki `supabase/migration-order-overrides.json` dengan 38 override, bersumber dari snapshot 9 November 2026:

- 17 override untuk nama file yang cocok tetapi timestamp live berbeda;
- 21 override untuk kandidat nama file yang berbeda;
- dua timestamp yang berbeda pada catatan live lebih baru tidak tercakup oleh snapshot tersebut;
- sembilan migrasi Blog yang muncul sesudah snapshot tidak memiliki file sumber.

Script pada branch PR #3 juga mengunci jumlah file migrasi menjadi **82**. Repository `main` sekarang memiliki 90 file. Karena itu, manifest dan script tersebut **sudah kedaluwarsa dan tidak boleh dipakai untuk replay saat ini**.

Status PR #3:
- masih open;
- branch `work/backend-first-flow-foundation`;
- 641 commit di belakang `main`;
- GitHub melaporkan PR tidak mergeable;
- workflow replay lokal di PR tersebut belum menjadi bukti bahwa 97 migrasi live dapat direproduksi.

### 2.3 Aturan keselamatan migrasi

Sampai rekonsiliasi sumber selesai:

- jangan menjalankan `supabase db reset` dengan manifest lama;
- jangan menjalankan `db push`, `migration up`, atau DDL ke project live;
- jangan mengganti timestamp, menghapus, menamai ulang, atau membuat ulang file migrasi historis;
- jangan menganggap nama yang mirip sebagai bukti isi SQL identik;
- pulihkan sembilan file Blog dari sumber Git yang tepercaya atau ekspor SQL yang tervalidasi;
- verifikasi 21 kandidat pemetaan terhadap SQL dan keadaan schema live;
- buat satu manifest canonical yang mencatat file, versi live, nama live, dasar pemetaan, status verifikasi, dan sumber bukti;
- baru setelah itu jalankan replay pada database lokal kosong dan bandingkan hasil schema.

**Kesimpulan:** rekonsiliasi migrasi belum selesai. Database produksi tidak diubah.

## 3. Temuan keamanan RLS

### 3.1 Kritis — policy `directory_media` tidak mengikat membership ke entity yang sedang diakses

Empat policy live menggunakan kondisi:

```sql
m.entity_id = m.entity_id
```

Kondisi tersebut selalu benar untuk baris membership yang dievaluasi. Kondisi itu tidak menghubungkan membership ke `directory_media.entity_id`. Bentuk korelasi yang diharapkan perlu merujuk secara eksplisit ke baris luar, misalnya `m.entity_id = directory_media.entity_id`.

Policy terdampak:

| Policy | Operasi | Dampak logis dari kondisi saat ini |
|---|---|---|
| `directory_media_public_read` | SELECT | Anggota aktif dari entitas mana pun dapat melewati cabang membership dan membaca media entitas lain, termasuk media yang belum berstatus published |
| `directory_media_manager_insert` | INSERT | Owner/manager/staff dari entitas mana pun dapat membuat baris media untuk entitas lain |
| `directory_media_manager_update` | UPDATE | Pengelola dari entitas mana pun dapat mengubah baris media pending milik entitas lain |
| `directory_media_manager_delete` | DELETE | Pengelola dari entitas mana pun dapat menghapus media milik entitas lain |

Masalah ini juga terlihat pada file repository `20261108090700_pluits_geodirectory_media_policy.sql`: referensi `entity_id` di subquery tidak dikualifikasi sehingga dapat mengikat kolom milik alias `m` sendiri. Jadi, ini bukan sekadar perbedaan metadata; definisi migration sumber yang ada juga perlu diperbaiki melalui migrasi forward setelah sejarah migrasi direkonsiliasi.

**Prioritas:** kritis / release-blocking untuk fitur pengelolaan media GeoDirectory.  
**Tindakan:** buat policy correction yang mengikat setiap membership ke entity pada baris media; tambahkan regression test lintas dua entitas untuk anon, anggota nonanggota, owner, manager, staff, dan pengguna tanpa membership. Belum ada policy yang diubah.

### 3.2 Tinggi — katalog produk melewati syarat online sales pada akses tabel langsung

Policy live berikut tidak memeriksa `stores.online_sales_enabled = true`:

- `products_anon_public_read`
- cabang publik pada `products_authenticated_read`
- `variants_anon_public_read`
- cabang publik pada `variants_authenticated_read`

Sementara itu, view `public_marketplace_products` dan policy baca gambar produk sudah membatasi katalog ke toko aktif, terverifikasi, dan menerima online sales.

Akibatnya, pembatasan yang diterapkan pada view katalog dapat dilewati dengan membaca tabel `products` atau `product_variants` secara langsung melalui Data API. Data produk/varian toko yang menonaktifkan penjualan online berpotensi tetap terbaca.

**Prioritas:** tinggi.  
**Tindakan:** selaraskan cabang publik pada policy tabel dengan syarat view; pertahankan akses internal anggota toko sesuai permission; uji akses anon dan authenticated untuk toko dengan online sales aktif/nonaktif. Belum ada policy yang diubah.

### 3.3 Sedang–tinggi — relasi post ke GeoDirectory tidak membatasi visibilitas post

Policy live `user_post_directory_entities_public_read` hanya memastikan bahwa post ada dan entitas direktori berstatus published. Policy tersebut tidak memeriksa:

- `user_posts.visibility = 'public'`;
- `user_posts.moderation_status = 'published'`.

Migration repository `20261108090600_pluits_geodirectory_domain_links.sql` memiliki pemeriksaan `p.visibility = 'public'`, sehingga definisi live dan file repository tidak sejalan. Relasi tag antara post dan tempat dapat mengungkap keberadaan hubungan dari post yang seharusnya privat atau belum diterbitkan.

**Prioritas:** sedang–tinggi, bergantung pada data relasi yang tersedia.  
**Tindakan:** pastikan hanya relasi dari post yang benar-benar publik dan diterbitkan yang dapat dibaca anon; tambahkan tes untuk private, pending, rejected, dan public published post. Telusuri migrasi yang menyebabkan perbedaan live sebelum membuat koreksi.

### 3.4 Perlu keputusan produk — visibilitas profil privat tidak konsisten

Fungsi `private.get_user_profile_directory_by_ids` mengembalikan bio, avatar, cover, kota, dan provinsi untuk profil privat ketika:

- viewer mengikuti pemilik profil; **atau**
- pemilik profil mengikuti viewer.

Fungsi `private.get_user_profile_directory` hanya membuka bidang tersebut ketika viewer adalah accepted follower, pemilik profil, atau profil bersifat public.

Perbedaan arah relasi ini perlu dibandingkan dengan aturan privasi PLUITS yang disetujui. Jangan menganggap hubungan satu arah otomatis memberi hak melihat profil privat tanpa keputusan produk.

**Prioritas:** sedang; keputusan kebijakan privasi diperlukan sebelum perubahan.

## 4. Pemeriksaan fungsi, grant, dan storage

### 4.1 SECURITY DEFINER

Pemeriksaan isi dilakukan terhadap 22 public SECURITY DEFINER function yang dilaporkan dapat dipanggil role authenticated.

Hasil pemeriksaan source:

- fungsi aksi pengguna memeriksa `auth.uid()` dan kepemilikan, membership, atau permission yang sesuai;
- fungsi review/moderasi memeriksa trusted `app_metadata` atau permission toko;
- fungsi messaging memeriksa keanggotaan conversation dan aturan block;
- fungsi order memeriksa buyer, status transaksi, stok, dan transisi lifecycle;
- tidak ditemukan alasan untuk mencabut seluruh EXECUTE grant secara massal.

Dua fungsi, `create_store` dan `update_store_profile`, memakai `SET search_path = ''`. Referensi tabel/fungsi di body yang diperiksa dikualifikasi dengan schema (`public` atau `private`), sehingga konfigurasi search path kosong tersebut tidak dengan sendirinya menjadi bukti kerentanan.

Peringatan advisor bahwa 22 fungsi dapat dipanggil authenticated tetap harus dibaca bersama grant dan isi setiap fungsi; SECURITY DEFINER bukan otomatis celah keamanan.

### 4.2 Private helper

Helper `private.has_store_permission`, `private.is_store_owner`, `private.is_store_member`, `private.can_send_conversation_message`, dan `private.is_conversation_member` menggunakan identitas/membership server-side. Helper profil publik membatasi bidang yang dikembalikan, dengan catatan ketidakkonsistenan fungsi profil privat pada §3.4.

### 4.3 Storage

Tiga bucket live seluruhnya private:

- `pluits-user-media`
- `pluits-store-media`
- `pluits-message-media`

Terdapat 18 policy pada `storage.objects`. Policy yang diperiksa mengikat voice note ke anggota conversation, media toko ke permission membership toko, dan media pengguna ke folder/visibilitas konten. Tidak ditemukan bucket yang disetel public pada metadata yang diperiksa.

### 4.4 Pengaturan Auth dan advisor

- Leaked-password protection dilaporkan nonaktif oleh security advisor; aktifkan setelah pemilik proyek menyetujui perubahan konfigurasi Auth.
- Satu foreign key belum memiliki covering index: `public.account_feature_entitlements.granted_by`.
- Dua RLS initialization-plan warning berada pada `profile_verification_cases` dan `professional_profiles`.
- Dua multiple-permissive-policy warning berada pada SELECT policy untuk dua tabel tersebut; keduanya tampak menggabungkan akses applicant dan admin, sehingga harus diuji, bukan dihapus membabi buta.
- 86 unused-index notices bersifat informasional. Jangan menghapus index hanya berdasarkan counter yang belum menunjukkan beban produksi representatif.

## 5. Batas frontend/backend dan dependency yang diverifikasi

### 5.1 Supabase client dan data access

Satu client bersama sudah tersedia di `src/lib/supabase/client.js`, tetapi 11 modul masih membuat client sendiri:

- `src/main.js`
- `src/pages/account/index.js`
- `src/pages/admin/moderation.js`
- `src/pages/blog-studio/index.js`
- `src/pages/directory/index.js`
- `src/pages/home/index.js`
- `src/pages/marketplace/index.js`
- `src/pages/messages/index.js`
- `src/pages/misc/index.js`
- `src/pages/seller/index.js`
- `src/pages/trip/index.js`

`src/pages/search/discovery.js` sudah memakai client bersama. `src/pages/account/account-context.js` mengimpor SDK tetapi tidak membuat client; import itu tampak tidak terpakai.

Sebagian besar page controller masih menjalankan query `.from()`, RPC, Storage, atau Realtime langsung. Folder `src/services/` saat ini baru memiliki helper signed URL; service domain belum terbentuk merata. Jangan memindahkan authorization ke frontend service—RLS dan backend tetap otoritatif.

### 5.2 Dependency eksternal

| Dependency / provider | Pemakaian source | Status pinning / catatan |
|---|---|---|
| Supabase JS | Auth, Data API, Storage, Realtime | `https://esm.sh/@supabase/supabase-js@2`; major version floating dan tidak tercantum sebagai package dependency |
| tus-js-client | Resumable upload | `4.3.1` dari esm.sh; tidak dikelola lewat package lock |
| Leaflet | Location picker/account | `1.9.4` dari unpkg |
| MapLibre GL JS | GeoDirectory map | `6.17.0` dari unpkg |
| OpenStreetMap tiles | Peta | Eksternal; attribution dan usage policy harus dipertahankan |
| Nominatim | Reverse geocoding | Eksternal; perlu rate limit/cache dan peninjauan usage policy |
| Unsplash | Hero, Top Ten, legacy blog imagery | URL remote; provenance/licence setiap foto belum diregistrasi lokal |
| Random User | Foto demo People Recommendations | URL remote; hanya untuk data demo, bukan identitas pengguna terverifikasi |

Font stack menyebut Inter, tetapi file font/provider yang dibundel tidak ditemukan pada pemeriksaan source ini. Tidak ada klaim performa atau lisensi yang dibuat tanpa pengukuran dan verifikasi provider.

### 5.3 Asset lokal yang belum terpakai/terverifikasi

- `public/assets/brand/pluits-logo.svg` dan `public/favicon.svg` memiliki SHA yang sama; `index.html` menggunakan path logo brand untuk favicon.
- Tidak ditemukan referensi source pada JS/TS/HTML untuk `public/icons.svg`, `src/components/common/icons.js`, atau `src/assets/hero.png`. Perlakukan sebagai kandidat tidak terpakai, jangan hapus sebelum audit final terhadap semua jalur runtime.
- `src/components/common/social-icons.js`, `src/app/ui.js`, dan `src/features/posts/post-actions.js` memiliki sumber ikon masing-masing; sebagian semantik tumpang tindih dan belum dinormalisasi.
- Top Ten menggunakan daftar nama tempat/usaha statis dengan foto Unsplash tanpa label DEMO yang jelas. People Recommendations memakai data demo yang diberi label DEMO UI. Blog statis masih memuat narasi “Bali Bagus Editorial” dan panduan konstruksi; perlu keputusan apakah halaman itu masih menjadi konten PLUITS.

### 5.4 Design-system debt

- Root `src/style.css` masih memiliki keluarga token hijau legacy (`#0b6b55`), sementara Social menggunakan navy (`#172b45`) dan Public Home memakai aksen teal (`#168f87`).
- `index.html` dan manifest memakai theme color navy.
- Nilai-nilai tersebut adalah fakta source, bukan keputusan palette final. Jangan melakukan normalisasi token atau penggantian warna massal sebelum seluruh consumer dan keputusan brand disetujui.
- `src/style.css` sekitar 286 KB; `src/pages/account/user-account.css` sekitar 187 KB; `src/pages/account/circle-experience.css` sekitar 54 KB. Jangan membagi file secara mekanis.
- `styles/home-layout.css` berada di luar `src/styles/` dan diimpor oleh bootstrap. Perpindahan harus memperbarui import dan diuji terpisah.

## 6. Test, preview, dan release

- Repository memiliki 8 test file berbasis Node test runner.
- `npm test` menjalankan production-surface verification dan test runner.
- `npm run build` menjalankan Vite build.
- Workflow `.github/workflows/deploy.yml` menjalankan install, test, build, pemeriksaan `dist/index.html`, lalu deploy GitHub Pages pada push `main` atau manual dispatch.
- Tidak ditemukan workflow preview terpisah untuk branch. Menjalankan workflow Pages secara manual pada branch kerja dapat mengganti situs Pages yang sama; jangan gunakan itu sebagai preview.
- Audit ini belum menjalankan `npm test`, `npm run build`, browser UAT, pixel inspection, atau pengukuran mobile. Tidak ada klaim bahwa tes tersebut lulus.
- Branch `work/production-design-inventory` berisi dokumentasi saja, 7 commit di depan `main`, 0 di belakang. Belum ada perubahan source app atau deployment.
- PR #7 dan PR #3 tetap open dan belum digabung. Tidak ada merge yang dilakukan.

## 7. Gerbang audit yang masih wajib diselesaikan

1. Pulihkan dan verifikasi sembilan sumber migrasi Blog; verifikasi 21 kandidat alias dan dua file repository tanpa pasangan live; buat manifest terkini.
2. Jalankan migration replay hanya pada Supabase lokal kosong setelah manifest disetujui dan seluruh file historis tersedia.
3. Tambahkan tes RLS lintas-entitas untuk empat policy `directory_media`, tes online-sales visibility untuk tabel dan view Marketplace, serta tes visibility post–GeoDirectory.
4. Konfirmasi aturan visibilitas profil privat satu arah vs dua arah.
5. Jalankan role-context regression tests untuk anon, authenticated non-owner, owner, store member, moderator, dan admin.
6. Lengkapi pemetaan route → controller → renderer → binder → query/RPC/storage/realtime → stylesheet → consumer.
7. Lengkapi audit seluruh consumer ikon, token, selector CSS, breakpoint, serta perilaku stylesheet setelah route berpindah.
8. Verifikasi provenance/lisensi aset eksternal dan lokal, serta keputusan untuk konten demo/legacy.
9. Sediakan jalur preview branch yang terpisah dari production Pages; jalankan build/test dan UAT Android serta desktop pada preview tersebut.
10. Catat hasil final, commit, test run, preview URL, dan persetujuan sebelum release.

**Status akhir dokumen:** temuan source dan live metadata yang tercantum di sini sudah diverifikasi secara read-only. Audit belum boleh diberi label selesai penuh sampai seluruh gerbang pada §7 ditutup.