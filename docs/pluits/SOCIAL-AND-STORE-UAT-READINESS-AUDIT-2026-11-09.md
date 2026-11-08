# PLUITS — Social Media & Store UAT Readiness Audit
**Tanggal:** 9 November 2026  
**Repository:** `baguskristiansianturi/pluits` · branch `main`  
**Commit diperiksa:** `ee05def9f4f03d66c9d961d4e325e3ec564d7978`  
**Supabase:** `ytndswhqxayqpftszwfh` · production  
**Status:** AUDIT SNAPSHOT TERKINI SELESAI; RELEASE/UAT MASIH BLOCKED  
**Perubahan saat audit:** read-only. Tidak ada migration, policy, row, akun, media, atau kode aplikasi yang diubah.

## 1. Tujuan dan keputusan ruang lingkup
Founder ingin menguji dua perjalanan pada satu identitas Pluits:
1. Social Media sebagai pengalaman utama.
2. Pendaftaran dan pengelolaan dasar toko melalui Seller Center.

Toko adalah pilihan opsional setelah pengguna menjadi member. Pembuatan toko tidak boleh membuat identitas Auth kedua. Tahap UAT awal hanya mencakup pembuatan toko, kepemilikan, profil, kategori, produk draft, dan area layanan dasar. Jangan menganggap checkout, pembayaran, payout, staf, atau fulfillment siap operasional.

## 2. Bukti repository dan deployment
- Repo dan branch aktif cocok: `baguskristiansianturi/pluits`, `main`.
- Commit terakhir saat audit: `ee05def9f4f03d66c9d961d4e325e3ec564d7978`.
- GitHub Actions run #1032 (`42532464974`) untuk commit tersebut berstatus SUCCESS.
- Job build sukses; langkah production-surface guard, production build, build-output verification, upload artifact, dan deploy Pages seluruhnya SUCCESS.
- URL: https://baguskristiansianturi.github.io/pluits/
- Commit terakhir hanya checkpoint dokumentasi; keberhasilan deploy ini bukan bukti bahwa alur frontend telah lulus Android UAT.
- Tidak ditemukan Supabase development branch pada saat audit.

## 3. Bukti live database
Snapshot read-only:
- 62 public tables; 62/62 mengaktifkan RLS; tidak ada public base table yang ditemukan tanpa RLS.
- Migration history live tersedia dan telah diperiksa terhadap konteks audit sebelumnya.
- Security Advisor: 20 temuan fungsi SECURITY DEFINER yang dapat dipanggil authenticated, serta 1 peringatan leaked-password protection disabled.
- Performance Advisor: 84 unused-index notices (INFO); jangan menghapus index tanpa workload evidence.
- Health Advisor: 0 lints.
- Bucket `pluits-user-media`: private, batas 50 MB, foto dan format video yang didukung.
- Bucket `pluits-store-media`: private, batas 10 MB, JPEG/PNG/WebP.
- Snapshot jumlah baris saat audit: 5 user_posts, 4 post_media, 1 store, 1 product, 1 product category, 0 delivery zones. Angka ini hanya snapshot database; bukan bukti fitur lulus UAT dan bukan data contoh yang boleh dipresentasikan sebagai aktivitas pengguna.

## 4. Temuan keamanan yang memblokir Social First Release

### SOC-01 — Read komentar/like tidak selalu memeriksa akses ke parent post
Policy live `post_comments_read_visible`, `post_likes_read_visible`, dan `post_comment_likes_read_visible` hanya memeriksa keberadaan parent/komentar. Policy belum secara konsisten mewajibkan viewer berhak melihat postingan induk.

**Severity: HIGH.** Perlu satu predicate akses post yang konsisten untuk post, media, komentar, likes, comment likes, saves, dan Storage.

### SOC-02 — Insert interaksi belum selalu memeriksa akses parent
Policy insert komentar, like, dan comment-like belum konsisten memeriksa hak viewer terhadap parent post. Identitas pembuat sendiri saja tidak cukup.

**Severity: HIGH.** Uji direct API, bukan hanya tombol UI.

### SOC-03 — Block belum diterapkan konsisten pada read post
Policy authenticated untuk `user_posts` tidak mengecualikan pasangan yang saling block. Penyaringan di UI/Reels tidak menggantikan otorisasi backend.

**Severity: HIGH.** Uji kedua arah block pada feed, deep link, komentar, media, dan pencarian.

### SOC-04 — Media private account dan accepted follower tidak selaras
Policy media belum sepenuhnya memakai aturan parent post yang sama, sehingga accepted follower berpotensi dapat membaca metadata post tetapi tidak media terkait.

**Severity: MEDIUM.** Samakan predicate parent dan media; jangan memperluas media secara terpisah.

### GDT-01 — Membership GeoDirectory tidak terikat pada entity media
Empat policy live `directory_media` menggunakan kondisi `m.entity_id = m.entity_id`. Kondisi tersebut tautologis, bukan pembatasan terhadap `directory_media.entity_id` pada baris aktif.

**Severity: HIGH.** Harus diperbaiki dan diuji lintas entitas, termasuk membership aktif, kedaluwarsa, dan role berbeda.

### RLS remediation
SQL candidate ada di [RLS Remediation Plan](./RLS-REMEDIATION-PLAN-AND-SQL-2026-11-09.md), tetapi belum diterapkan dan belum lulus staging tests. Jangan jalankan kandidat langsung di production. Periksa ulang nama kolom, fungsi, ACL, policy, dan migration history sebelum migration baru dibuat.

## 5. Review awal SECURITY DEFINER
Advisor menampilkan 20 RPC yang dapat dipanggil authenticated. Peringatan ini bukan bukti otomatis bahwa seluruh fungsi exploitable. Review definisi menunjukkan fungsi-fungsi tersebut melakukan pemeriksaan identitas `auth.uid()` atau pemeriksaan pemilik/anggota/role yang sesuai dengan fungsi masing-masing. Beberapa fungsi memang dirancang sebagai RPC terkontrol.

Catatan hardening:
- `create_store` menggunakan `search_path = ''`, memerlukan `auth.uid()`, memeriksa wilayah Bali yang dibuka untuk seller, dan membuat store, owner membership, settings, serta audit log secara atomik.
- `update_store_profile` menggunakan `search_path = ''` dan membatasi perubahan kepada owner.
- `update_store_verification_details` dan `submit_store_for_verification` memeriksa owner.
- `review_store_verification` memeriksa role `admin` atau `moderator` dari `app_metadata`.
- Sebagian besar RPC lain menggunakan `search_path = public, pg_temp`. Hak CREATE untuk anon/authenticated pada schema public dan private terdeteksi false, sehingga shadowing melalui schema tersebut tidak terbukti dapat dilakukan oleh kedua role; namun search_path kosong dan fully-qualified references tetap menjadi hardening yang disarankan.
- Leaked-password protection masih disabled. Perlu ditinjau dan diaktifkan melalui pengaturan Auth sebelum rilis publik yang lebih luas.
- Review ini adalah first-pass authorization review. Setiap RPC sensitif tetap membutuhkan positive/negative tests dengan akun berbeda sebelum dinyatakan aman.

## 6. Audit alur Social Media
### Alur produk yang harus diuji
1. Daftar/login dengan identitas Auth tunggal.
2. Lengkapi profil personal, username, avatar, cover, bio, dan privasi.
3. Unggah foto dan video; preview, progress, error/retry, dan publikasi.
4. Konten muncul pada profil dan feed/Explore sesuai audience.
5. Like/unlike, double-tap like, komentar/balasan, save, share, tag.
6. Follow/unfollow; private follow request; accept/decline; block/unblock.
7. Stories 24 jam, Reels, DM/realtime/offline outbox, notifikasi dan pengaturan.
8. Refresh, logout/login, lalu uji akses dari akun kedua dan guest.

### Status bukti
Spesifikasi dan source menunjukkan banyak fungsi dasar telah diimplementasikan. Namun upload media dari Android nyata, dua akun, private follower, block, Stories/Reels, DM/reconnect, notification routing, dan runtime responsive belum dibuktikan lulus. Karena SOC-01–04 belum diperbaiki dan diuji, Social First Release belum boleh ACCEPTED.

## 7. Audit alur Buat Toko / Seller Center

### Jalur yang sudah tersedia
- Account Settings Hub memiliki menu **Toko dan organisasi** yang menuju `#/seller`.
- Router memiliki route Seller Center; halaman memakai Supabase Auth project yang sama.
- Pengguna tanpa sesi diarahkan ke login/daftar Seller Center. Pengguna dengan sesi akan melihat toko yang dimiliki/diikuti; jika belum ada toko, form pembuatan toko tampil.
- Frontend memanggil RPC `create_store`.
- Live function membuat store, owner membership, default settings, dan audit log dalam satu transaksi database.
- Store baru berstatus awal `draft` dan `unverified`; penjualan online tetap nonaktif.
- Dashboard dasar menyediakan ringkasan, pesanan, produk, kategori, persediaan, area layanan, profil toko, dan pengaturan.
- Product baru dibuat sebagai `draft`; publikasi mensyaratkan store aktif, verified, dan online sales enabled.
- Storage foto produk tetap private dan hanya dapat dibaca publik ketika relasi produk/toko memenuhi aturan publikasi.

### Ketidaksesuaian bisnis yang wajib diperbaiki
Business Model Master bagian 23.6 menyatakan persyaratan badan usaha harus mengikuti kategori dan ketentuan hukum; PT/CV/UD tidak boleh dipaksakan kepada UMKM, individu, driver, guide, atau penyedia jasa. Tetapi:
- Form frontend hanya menyediakan PT/CV/UD.
- Constraint kolom `stores.business_type` hanya menerima PT/CV/UD.
- RPC `create_store` juga menolak selain PT/CV/UD.

Ini adalah ketidaksesuaian nyata antara keputusan bisnis aktif dan implementasi. Perlu migration baru yang menyesuaikan kategori bentuk usaha, validasi backend, dan UI bersama-sama. Jangan hanya menambah pilihan frontend karena RPC dan CHECK constraint akan menolaknya.

### Bug/gap frontend yang ditemukan
1. Query `renderSeller()` tidak memuat `phone`, `public_area`, dan `description`, padahal `profilePanel()` menggunakannya. Form dapat menampilkan field kosong; menyimpan profil berpotensi menghapus nilai `public_area` dan `description` yang sudah ada.
2. Tombol **Ajukan verifikasi toko** dirender, tetapi tidak ditemukan event handler pada `bindPanel()`. Tombol belum berfungsi.
3. Tombol **Publikasikan/Arsipkan produk**, **Verifikasi/Tolak pembayaran**, dan transisi status pesanan dirender, tetapi tidak ditemukan handler terkait. Jangan tampilkan seolah aksi ini aktif.
4. Pengaturan penjualan online mencoba melakukan UPDATE langsung ke `stores`, sedangkan policy live yang diperiksa hanya memberi SELECT pada tabel `stores`. Tidak ditemukan policy UPDATE owner untuk jalur tersebut. Aksi ini kemungkinan ditolak RLS; perlu RPC owner-guarded, bukan membuka UPDATE langsung.
5. Penyimpanan profil memanggil dua RPC berurutan. Jika RPC pertama berhasil dan kedua gagal, profil tersimpan sebagian. Perlu satu jalur atomik atau penanganan status parsial yang jelas.
6. UI memilih `stores[0]` sebagai `activeStore`; belum ada pemilih toko meskipun model bisnis mendukung satu akun mengelola beberapa toko.
7. Kolom logo dan banner toko ada di database, tetapi UI Seller Center saat ini belum menyediakan alur unggah/ubah logo dan sampul.
8. Area layanan saat ini berupa nama/deskripsi teks, biaya, minimum order, dan jarak maksimum. Belum ada geometri zona yang tervalidasi, jam operasional, cut-off, kapasitas, atau penilaian kemampuan instant/same-day. Jangan tampilkan janji fulfillment yang belum dihitung.
9. Dashboard memiliki delapan tab. Navigasi mobile dibuat horizontal scroll pada breakpoint 800 px dan 390 px; ini baru inspeksi CSS, belum pengujian perangkat nyata.

### Alur bisnis toko yang benar untuk UAT
1. Pengguna mendaftar/login sebagai member Pluits menggunakan akun yang sama dengan Social Media.
2. Dari Account Settings, pilih **Toko dan organisasi / Buat Toko**. Ini pilihan opsional; jangan memaksa setiap member membuat toko.
3. Pilih kategori usaha dan bentuk usaha yang relevan. Persyaratan dokumen mengikuti kategori/risiko; jangan memaksa PT/CV/UD kepada UMKM/perorangan.
4. Isi identitas toko, username, kontak, lokasi operasional, dan data publik yang aman dibagikan.
5. Sistem membuat store berstatus draft/unverified, menetapkan owner membership, membuat default settings, dan menulis audit log secara atomik.
6. Owner melengkapi profil, logo/sampul, kategori, jam operasional, lokasi dan area layanan nyata.
7. Owner mengirim permohonan verifikasi. Status menjadi pending; toko belum aktif untuk penjualan online.
8. Tim verifikasi/admin memeriksa identitas/otoritas, kategori, lokasi/area, dan dokumen yang diwajibkan. Keputusan dan alasan dicatat.
9. Setelah verified dan active, owner dapat mengaktifkan penjualan online. Backend tetap memeriksa wilayah pembeli, ketersediaan, stok, dan kemampuan fulfillment pada setiap pencarian/checkout/order.
10. Owner membuat produk draft, varian, harga, stok, dan gambar. Produk baru dapat dipublikasikan setelah seluruh syarat toko dan produk terpenuhi.
11. Pembeli hanya dapat memesan produk dalam area layanan lokal yang valid. Tidak ada pengiriman parcel antardaerah sebagai jalan pintas.
12. Staff/invitations, pembayaran sungguhan, payout, dan akuntansi tidak termasuk UAT dasar saat ini.

## 8. UAT matrix — wajib sebelum ACCEPTED
### Social (minimal dua akun)
- Owner vs guest; owner vs unrelated authenticated user.
- Public/private profile; accepted/pending/revoked follower.
- Block A→B dan B→A; direct post/media/comment query.
- Foto/video upload, retry, refresh, logout/login.
- Like/unlike/double-tap, comment/reply, save/share/tag.
- Story expiry/audience, Reels playback/aspect ratio.
- DM send/read, reconnect/offline queue, no duplicate.
- Notifications only to intended recipient.

### Store (akun owner dan akun unrelated)
- Existing account login ke Seller Center; jangan membuat Auth kedua untuk owner yang sama.
- New store creation; duplicate username; invalid input; unsupported region.
- Store starts draft/unverified/online disabled.
- Owner can read/update own store; unrelated account cannot read or mutate private store/catalog/media.
- Category, product draft, variant, image upload, cleanup after partial failure.
- Verification submit; pending state; unauthorized account cannot approve.
- Verified/active gate; online sales toggle via authorized backend path.
- Delivery area is explicit and does not claim unvalidated same-day/instant availability.
- Mobile form keyboard, picker, upload progress, sticky navigation, and overflow.

### Responsive viewport
Static layout review must be followed by Android browser testing at 320, 360, 390, and 430 CSS px, plus tablet and desktop. Check keyboard-open forms, safe-area insets, scrollable tabs, long labels, validation errors, loading, empty, success, and retry states. No Android runtime test has been claimed by this audit.

## 9. Release gates and next work
1. Create/confirm a safe Supabase staging environment and cost before any RLS DDL. No staging branch currently exists.
2. Revalidate the RLS SQL candidate against exact live schema and migration history; apply only as a new migration after staged positive/negative tests and explicit approval.
3. Fix SOC-01–04 and GDT-01; rerun security/performance/health advisors.
4. Align store business-type rules in schema, `create_store` RPC, frontend validation, and tests.
5. Fix Seller Center profile data loading, verification submit handler, settings RPC, inert controls, multi-store selection, and branding fields.
6. Build a deterministic store UAT flow that does not create fake stores/products or bypass verification.
7. Run production guard, build, deploy exact SHA, then founder Android UAT with two accounts.
8. Mark ACCEPTED only after founder confirms both Social and Store journeys.

## 10. Status
- Repository and live database audit snapshot: **UPDATED**.
- Security remediation: **PREPARED, NOT APPLIED; staging tests pending**.
- Social runtime/two-account UAT: **NOT TESTED / BLOCKED by RLS findings**.
- Store onboarding frontend: **PARTIALLY IMPLEMENTED; known functional blockers above**.
- Store business-type alignment: **BLOCKED pending coordinated migration and frontend change**.
- Android responsive UAT: **NOT TESTED**.
- Production database: **UNCHANGED by this audit**.


## 11. Frontend remediation increment — 9 November 2026
**Commit:** `e1a9d558bf9e3e6906e3b4837dfb9e8b6621b97c`  
**GitHub Actions:** run #1043 (`42533355048`) SUCCESS; production-surface guard, Vite build, build-output verification, artifact upload, and Pages deployment all passed.  
**Production database:** unchanged.

Implemented in this increment:
- Seller store query now loads `phone`, `public_area`, `description`, and store logo/banner path fields used by the profile UI.
- Store verification submission button now calls `submit_store_for_verification`.
- Product publish uses `publish_marketplace_product`; product archive uses a permission-checked product update.
- Payment review and order fulfillment controls now call the existing guarded RPCs.
- Online-sales state is no longer updated directly from the browser. The settings screen shows the state; an owner-guarded activation RPC remains a backend task.
- A signed-in owner can start creating another store; the new store is selected after creation, and a store selector appears when multiple stores exist.
- Seller Center mobile bottom navigation now uses a two-row/four-column layout on narrow viewports.

Remaining blockers:
- Business type is still PT/CV/UD in frontend, CHECK constraint, and `create_store` RPC. This conflicts with the active business model for UMKM/individual providers.
- Store logo/banner upload UI and public-safe storefront rendering are not implemented.
- Store profile update still uses two RPC calls; partial success needs an atomic RPC or explicit recovery UX.
- Online-sales activation requires a dedicated owner-guarded RPC.
- Delivery zones remain text-based and do not validate real geometry, operating hours, cutoff, capacity, or instant/same-day feasibility.
- Android runtime testing, two-account authorization testing, and real media upload tests remain NOT TESTED.
- The successful workflow is build/deploy evidence only, not founder acceptance.
