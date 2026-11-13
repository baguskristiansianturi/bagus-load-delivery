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




### 2.4 Pencarian sumber migrasi Blog

Pemeriksaan tambahan mencakup seluruh branch GitHub yang tersedia, direktori `supabase/archive/`, dan riwayat commit pada `supabase/migrations/`. Tidak ditemukan berkas SQL untuk sembilan migrasi Blog di branch aktif, branch kerja lain, arsip SQL, atau riwayat perubahan folder migrasi yang diperiksa.

Schema live Blog tetap dapat diinventarisasi secara read-only: terdapat tabel `blog_profiles`, `blog_posts`, `blog_categories`; view `blog_public_routes`; tiga trigger auto-slug; dan policy Storage khusus media Blog. Pemeriksaan struktur live ini tidak menggantikan sumber migration historis dan tidak boleh dipakai untuk mengarang ulang sembilan file tersebut.

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

### 3.4 Tinggi — post Blog tetap dapat dibaca saat blog diatur privat

Policy live `Public published blog posts readable` pada `blog_posts` mengizinkan SELECT anon/authenticated ketika `status = 'published'` dan `visibility = 'public'`, tanpa memeriksa `blog_profiles.default_visibility`. Hak SELECT anon pada tabel `blog_posts` memang aktif.

Sebaliknya:
- view `blog_public_routes` hanya menampilkan blog dengan `default_visibility = 'public'` (atau kepada pemilik);
- halaman publik `mountPublicBlog()` harus menemukan blog melalui view tersebut dan menolak blog yang tidak public;
- policy Storage untuk media blog juga mensyaratkan `blog_profiles.default_visibility = 'public'`;
- fungsi frontend `saveSettings()` hanya mengubah `blog_profiles.default_visibility`, tidak mengubah visibilitas post yang sudah ada.

Akibatnya, ketika pemilik mengubah blog menjadi privat, halaman publik dan media tersembunyi, tetapi teks post yang sebelumnya berstatus published/public masih dapat dibaca langsung melalui Data API. Ini tidak konsisten dengan perilaku UI dan berpotensi membocorkan konten blog privat.

**Prioritas:** tinggi / privacy release-blocking.  
**Tindakan:** tentukan aturan canonical—blog privat harus menutup seluruh post, atau post public memang boleh tetap terbuka. Jika blog privat harus menutup semuanya, tambahkan pemeriksaan `EXISTS` terhadap `blog_profiles.default_visibility = 'public'` pada cabang public policy (atau lakukan transisi visibilitas post yang atomik). Uji anon, authenticated non-owner, owner, dan perubahan public → private. Belum ada policy yang diubah.

### 3.5 Perlu keputusan produk — visibilitas profil privat tidak konsisten

Fungsi `private.get_user_profile_directory_by_ids` mengembalikan bio, avatar, cover, kota, dan provinsi untuk profil privat ketika:

- viewer mengikuti pemilik profil; **atau**
- pemilik profil mengikuti viewer.

Fungsi `private.get_user_profile_directory` hanya membuka bidang tersebut ketika viewer adalah accepted follower, pemilik profil, atau profil bersifat public.

Perbedaan arah relasi ini perlu dibandingkan dengan aturan privasi PLUITS yang disetujui. Jangan menganggap hubungan satu arah otomatis memberi hak melihat profil privat tanpa keputusan produk.

**Prioritas:** sedang; keputusan kebijakan privasi diperlukan sebelum perubahan.

## 4. Pemeriksaan fungsi, grant, dan storage

### 4.1 SECURITY DEFINER

Pemeriksaan isi dilakukan terhadap 22 public SECURITY DEFINER function yang dapat dipanggil role authenticated. Pemeriksaan grant pada seluruh 23 public SECURITY DEFINER function memastikan tidak satu pun memiliki EXECUTE untuk role anon; fungsi ke-23, `create_wallet_account_for_new_user`, tidak dapat dipanggil langsung oleh anon/authenticated dan digunakan sebagai trigger function.

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

Hitungan berikut adalah jumlah pemanggilan API yang tampak pada source (bukan metrik traffic/runtime):

| Modul | `.from()` occurrences (table/storage) | `.rpc()` | Storage calls | Realtime channel / Postgres listener |
|---|---:|---:|---:|---:|
| `pages/account/index.js` | 127 | 5 | 9 | 1 / 2 |
| `pages/account/account-context.js` | 11 | 1 | 0 | 0 |
| `pages/admin/moderation.js` | 5 | 2 | 0 | 0 |
| `pages/blog-studio/index.js` | 20 | 0 | melalui uploader/helper | 0 |
| `pages/directory/index.js` | 22 | 1 | 1 | 0 |
| `pages/home/index.js` | 9 | 1 | 0 | 0 |
| `pages/marketplace/index.js` | 11 | 3 | 1 | 0 |
| `pages/messages/index.js` | 16 | 6 | 4 | 2 / 2 |
| `pages/misc/index.js` | 2 | 0 | 0 | 0 |
| `pages/search/discovery.js` | 7 | 0 | 1 | 0 |
| `pages/seller/index.js` | 25 | 8 | 3 | 0 |
| `pages/trip/index.js` | 9 | 3 | 0 | 0 |
| `main.js` | 0 | 0 | 0 | 1 / 0 (presence) |

`account-context.js` menerima client sebagai parameter dari `account/index.js`; ia tidak membuat client sendiri. Import SDK pada file itu tidak terpakai dan dapat dihapus saat refactor terkontrol.

`home/index.js` mengambil `homeNearbySection` dan binder-nya dari `pages/directory/index.js`. Ini adalah coupling antar-page controller; pemilik komponen Nearby perlu dipindahkan ke feature module yang sesuai hanya setelah consumer dan kontraknya diverifikasi.

CSS import ownership yang terverifikasi:
- Bootstrap global: `src/style.css`, `src/styles/brand.css`, `page-transitions.css`, `social-navigation.css`, serta `styles/home-layout.css` yang masih berada di luar `src/`.
- Account mengimpor delapan stylesheet page/feature; Home mendapatkan `navbar.css` dan `public-home.css` dari `features/public-home/layout.js`.
- Directory, Help, Inbox, Inbox Settings, Search, Seller Center, dan Blog Studio masing-masing mengimpor stylesheet page sendiri.
- Marketplace, Trip, public Blog, Misc, Admin Moderation, dan Home controller tidak mengimpor stylesheet page secara langsung; styling-nya berada pada global CSS atau feature/shared styles.

### 5.2 Dependency eksternal

| Dependency / provider | Exact source/version | Format | License / terms | Local status |
|---|---|---|---|---|
| Supabase JS | `https://esm.sh/@supabase/supabase-js@2` | ESM JavaScript | MIT | Remote import; major version floating, not in package dependency/lockfile |
| tus-js-client | `https://esm.sh/tus-js-client@4.3.1` | ESM JavaScript | MIT | Remote import; version pinned in URL, not in package lock |
| Leaflet | `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` + CSS | JavaScript + CSS | BSD-2-Clause | Remote import in Account; not bundled locally |
| MapLibre GL JS | `https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.mjs` + CSS | ESM JavaScript + CSS | BSD-3-Clause | Remote import in GeoDirectory; not bundled locally |
| OpenStreetMap raster tiles | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | PNG tiles | ODbL data; OSMF Tile Usage Policy | Remote; Directory uses official host and contributors attribution |
| Nominatim | `https://nominatim.openstreetmap.org/reverse` | JSON response | OSMF Nominatim Usage Policy | Remote reverse geocoding; no persistent result cache/throttle found |
| Unsplash | `https://images.unsplash.com/photo-{id}...` | `auto=format` image response; negotiated format | Unsplash License; commercial/noncommercial use generally allowed, but not for compiling images to imitate a competing service; model/property rights still matter | Remote image URLs; no local asset copy registered |
| Random User / UI Faces | `https://randomuser.me/api/portraits/{gender}/{id}.jpg` | JPEG | Site says photos were selected from an authorized UI Faces section; no separate per-photo license was found in source | Remote demo portraits; not real verified user accounts and not in local assets |

Rujukan lisensi dan kebijakan resmi:
- [Unsplash License](https://unsplash.com/license) dan [Unsplash releases/trademarks guidance](https://help.unsplash.com/en/articles/2612329-releases-and-trademarks).
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) dan [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/).
- [MapLibre GL JS BSD-3-Clause](https://github.com/maplibre/maplibre-gl-js), [Leaflet BSD-2-Clause](https://github.com/Leaflet/Leaflet/blob/main/LICENSE), [tus-js-client MIT](https://github.com/tus/tus-js-client), [Supabase JS MIT](https://github.com/supabase/supabase-js/blob/master/LICENSE).

### 5.2.1 Pemetaan aset gambar eksternal

Semua URL di bawah ini remote dan tidak tersimpan sebagai aset PLUITS lokal:

- Global/legacy hero CSS: `photo-1541888946425-d81bb19240f5` (diulang pada beberapa selector).
- Public Home hero: `photo-1518837695005-2083093ee35b`.
- Public Home discovery/stories/marketplace: `photo-1507525428034-b723cf961d3e`, `photo-1517248135467-4c7edcad34c4`, `photo-1441986300917-64674bd600d8`, `photo-1521737711867-e3b97375f902`, `photo-1470252649378-9c29740c9fa8`, `photo-1542838132-92c53300491e`, `photo-1552566626-52f8b828add9`, `photo-1530789253388-582c481c54b0`.
- Top Ten static cards: `photo-1555939594-58d7cb561ad1`, `photo-1607623814075-e51df1bdc82f`, `photo-1510414842594-a61c69b5ae57`, `photo-1544551763-46a013bb70d5`, `photo-1537996194471-e657df975ab4`, `photo-1514525253161-7a46d19cd819`, `photo-1507525428034-b723cf961d3e`, `photo-1523275335684-37898b6baf30`, `photo-1521737711867-e3b97375f902`, `photo-1500530855697-b586d89ba3ee`.
- Legacy public Blog: `photo-1504307651254-35680f356dfd`, `photo-1541888946425-d81bb19240f5`, `photo-1601584115197-04ecc0da31d8`, `photo-1505693416388-ac5ce068fe85`.
- People Recommendations demo portraits: Random User portrait IDs `women/12`, `men/32`, `women/44`, `men/46`, `women/49`, `men/51`, `women/56`, `men/60`, `women/65`, `men/68`.

### 5.2.2 Map provider compliance observations

- GeoDirectory MapLibre uses the official `tile.openstreetmap.org` host and visible “© OpenStreetMap contributors” attribution.
- Account's Leaflet map uses `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` and attribution text `© OpenStreetMap`. Update it to the exact official tile URL and full “© OpenStreetMap contributors” attribution before production scale.
- The Nominatim reverse-geocoding call sends `Accept-Language: id`; browser requests provide browser User-Agent/Referer, but source has no explicit request throttling or persistent response cache. Nominatim's public policy sets an absolute maximum of one request per second and requires identifying headers/attribution. Add a rate guard and cache before traffic increases.
- Account uses Leaflet and GeoDirectory uses MapLibre. These are two map engines with different page contracts; do not replace either until the address-picker and GeoDirectory interaction requirements are compared.

Font stack menyebut Inter, tetapi file font/provider yang dibundel tidak ditemukan pada pemeriksaan source ini. Tidak ada klaim performa yang dibuat tanpa pengukuran.

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

Delapan test file yang ada saat ini mencakup:
- auth registration dan routing;
- brand/profile settings;
- lazy route loading;
- social navigation dan beberapa source-level assertions untuk Home, Circle, Inbox, dan GeoDirectory;
- app-download section;
- media MIME/extension validation;
- people recommendation ranking/rendering;
- signed URL batching/fallback.

Cakupan tersebut berguna, tetapi belum mencakup integration test RLS lintas-role, SQL RPC lifecycle, Storage authorization, Realtime delivery, Marketplace/Seller/Trip/Blog controller behavior, atau browser end-to-end route journeys. Sebagian besar test menggunakan Node test runner dan pembacaan source; itu bukan pengganti UAT browser atau Supabase local integration.
- Workflow `.github/workflows/deploy.yml` menjalankan install, test, build, pemeriksaan `dist/index.html`, lalu deploy GitHub Pages pada push `main` atau manual dispatch.
- Tidak ditemukan workflow preview terpisah untuk branch. Menjalankan workflow Pages secara manual pada branch kerja dapat mengganti situs Pages yang sama; jangan gunakan itu sebagai preview.
- Audit ini belum menjalankan `npm test`, `npm run build`, browser UAT, pixel inspection, atau pengukuran mobile. Percobaan clone repository untuk menjalankan tes lokal gagal karena environment eksekusi tidak dapat me-resolve `github.com`; karena itu tidak ada klaim bahwa tes/build lulus.
- Branch `work/production-design-inventory` berisi dokumentasi saja, 23 commit di depan `main`, 0 di belakang. Belum ada perubahan source app atau deployment.
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