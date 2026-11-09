# PLUITS — PROJECT STATUS, CHECKPOINTS & ROADMAP

**Perusahaan:** Pluits Indonesia  
**Produk:** Pluits  
**Repository:** https://github.com/baguskristiansianturi/pluits  
**Branch:** `main`  
**Dokumen model bisnis:** [BUSINESS-MODEL-MASTER.md](./BUSINESS-MODEL-MASTER.md)  
**Dokumen ini:** sumber status implementasi, checkpoint, dan PR; bukan pengganti model bisnis.

> **Aturan kerja:** jangan menimpa sejarah checkpoint. Tambahkan entri baru. Pisahkan status dokumentasi, kode, database, deployment, dan pengujian. "Selesai" hanya jika ada bukti. Pada awal sesi baru, baca dokumen model bisnis ini, dokumen status ini, spesifikasi teknis terkait, lalu verifikasi repo/backend sebelum mengerjakan PR.

## 1. Ringkasan kondisi proyek

| Area | Status terakhir yang diketahui | Catatan |
|---|---|---|
| Identitas Pluits | Ditetapkan | Produk Pluits, perusahaan Pluits Indonesia; terpisah dari Bagusin dan Bali Trans |
| Repository dan branch | Ada | `baguskristiansianturi/pluits`, `main` |
| Supabase Pluits | Project tersedia | Project ref `ytndswhqxayqpftszwfh`, region Singapore |
| Fondasi seller/backend | Pernah diimplementasikan | Ada migrasi seller workspace dan hardening; wajib diverifikasi ulang sebelum mengandalkan status database |
| Seller Center frontend | Ada | Pendaftaran/login dan workspace owner pernah dibuat; belum ada bukti end-to-end test lengkap |
| Akun universal pembeli | Implementasi awal tersedia | Rute akun baru memakai Supabase Auth yang sama dengan Seller Center; belum diuji end-to-end dengan akun nyata |
| Profil pengguna | Implementasi awal tersedia | Nama tampilan, username unik, avatar, cover, bio, lokasi publik, privasi; halaman profil publik berbasis username masih PR |
| Alamat dan titik peta pembeli | Implementasi awal tersedia | Form alamat privat, kode pos, Leaflet pin dan geolocation; belum diuji perangkat nyata |
| Upload sosial foto/video | Implementasi awal tersedia | Bucket privat 50 MB, foto/video, caption, tags, privasi; moderasi dan TUS upload besar masih PR |
| Explore | Implementasi awal tersedia | Feed campuran foto/video, akun sendiri tampil pada feed setelah upload; ranking sederhana berbasis like/comment dan tanggal |
| Like/comment/share/save/tag | Implementasi awal tersedia | Backend likes/comments/saves/account tags; share native/copy link; belum diuji lintas akun |
| Chat dan wallet | Belum diimplementasikan | Wallet UI dapat disiapkan nonaktif; jangan memproses uang sungguhan |
| Toko tampil di profil pengguna | Sudah diputuskan di model bisnis | Opt-in; profil toko dan profil pribadi tetap entitas terpisah |

**Peringatan konsistensi dokumen:** `PLUITS-SECURITY-REVIEW.md` memuat snapshot lama yang menyatakan database kosong/migrasi belum diterapkan, sedangkan catatan pekerjaan yang lebih baru menyebut migrasi `202611070002` dan `202611070003` telah diterapkan. Status live Supabase belum diverifikasi ulang pada checkpoint ini. Sebelum perubahan skema berikutnya, periksa migration history, tabel, RLS, Storage, dan advisor secara langsung lalu perbarui security review. Jangan menganggap salah satu catatan lama sebagai bukti status saat ini.

## 2. Checkpoint yang sudah tercatat

### CP-001 — Identitas produk dan pemisahan proyek
- **Status:** Selesai sebagai keputusan/dokumentasi.
- **Keputusan:** nama platform Pluits; perusahaan Pluits Indonesia; proyek/backend Pluits terpisah dari Bagusin dan Bali Trans.
- **Bukti:** dokumen model bisnis dan repository Pluits.
- **Tes:** bukan checkpoint implementasi.

### CP-002 — Fondasi Seller Center dan skema seller
- **Status:** Dibangun sebagian; belum lulus uji end-to-end.
- **Cakupan yang pernah dibuat:** Supabase project Pluits; migrasi seller workspace dan hardening; tabel profil, wilayah, toko, anggota toko, pengaturan, jam operasional, zona pengiriman, kategori, produk, variasi, gambar, pergerakan stok, audit; private Storage bucket; RPC pembuatan toko dan update profil; frontend Seller Center.
- **Bukti file:** `supabase/migrations/202611070002_pluits_seller_workspace.sql`, `supabase/migrations/202611070003_pluits_store_profile_hardening.sql`, `src/pages/seller/index.js`, `src/pages/seller/seller.css`.
- **Belum terbukti:** signup/login nyata, konfirmasi email, create store, upload foto dari ponsel, RLS seluruh role, dan deployment Pages.
- **Catatan keamanan:** granular permission staff, audit write path, stok atomik, serta tes lintas role masih menjadi pekerjaan wajib sebelum mengundang staff atau menerima transaksi nyata.

### CP-003 — Model akun universal dan sosial
- **Status:** Keputusan bisnis didokumentasikan; implementasi belum.
- **Cakupan keputusan:** satu akun sebagai pembeli/owner/staff; profil publik/privat; chat; wallet dengan pagar keamanan; feed, post, Story, Reels; konten transaksi hanya dibagikan atas persetujuan.
- **Bukti:** bagian 18 pada model bisnis.

### CP-004 — Profil publik, lokasi, branding toko, dan konten
- **Status:** Keputusan bisnis didokumentasikan; implementasi belum.
- **Cakupan keputusan:** nama tampilan boleh sama; username akun unik; lokasi publik dua tingkat wilayah dengan ikon pin; alamat lengkap, kode pos dan koordinat disimpan privat; toko dapat ditampilkan secara opt-in di profil; owner dapat membangun branding dan promosi toko; bukti transaksi yang diunggah sendiri tidak otomatis terverifikasi.
- **Bukti:** bagian 18.9–18.11 pada model bisnis.

### CP-005 — Perjalanan pengguna pertama dan Explore
- **Status:** Baru didokumentasikan; implementasi belum.
- **Cakupan:** onboarding pengguna biasa, avatar, cover, bio, username, alamat lengkap dan pin peta, upload foto/video, profil, Explore campuran, like, komentar, share, simpan/tandai dan tag.
- **Bukti:** bagian 19 pada model bisnis.
- **Kriteria:** lihat PR dan checkpoint CP-006 yang direncanakan di bawah.

## 3. PR dan urutan pekerjaan

### PR-001 — Audit kondisi aktual repository dan Supabase
**Prioritas:** P0 — sebelum mengubah backend.
- [ ] Periksa file aktual router, dashboard pengguna, auth, services, store, models dan CSS.
- [ ] Verifikasi branch, commit, deploy Pages dan jalur uji mobile.
- [ ] Verifikasi migration history Supabase, tabel, kolom, RLS, Storage bucket/policies, RPC, grants dan advisor.
- [ ] Cocokkan `PLUITS-SECURITY-REVIEW.md` dengan keadaan aktual; tandai temuan lama yang sudah diselesaikan dan temuan yang masih terbuka.
- [ ] Pastikan dashboard pengguna tidak lagi mengandalkan localStorage demo untuk identitas/sesi.
- **Acceptance:** laporan audit berisi bukti commit/file dan hasil query aktual; tidak ada asumsi status.

### PR-002 — Fondasi akun pengguna universal
**Prioritas:** P0 — dependensi semua fitur pengguna.
- [ ] Satu Supabase Auth identity dipakai oleh pembeli dan Seller Center.
- [ ] Dashboard pengguna normal setelah login; tidak memaksa atau mempromosikan pembuatan toko.
- [ ] Menu pengguna: Ringkasan, Transaksi, Ulasan, Wishlist, Keranjang, Alamat, Profil, Pengaturan, Chat, Saldo (nonaktif jika belum siap), Postingan, dan Buat Toko.
- [ ] Menu Buat Toko hanya pilihan opsional dan membuka Seller Center.
- [ ] Tidak ada pesanan, saldo, chat, postingan, atau angka contoh yang disajikan sebagai data nyata.
- **Acceptance:** akun yang sama bisa membuka dashboard pembeli dan Seller Center sesuai keanggotaan; logout/login konsisten.

### PR-003 — Profil publik dan pengaturan privasi
**Prioritas:** P0.
- [ ] Nama tampilan tidak unik; username unik case-insensitive dengan validasi dan aturan reserved words.
- [ ] Avatar, foto sampul, bio, pengaturan publik/privat.
- [ ] Lokasi publik terpisah dari alamat pengiriman; format wilayah dua tingkat (kota/kabupaten, provinsi) dengan ikon pin.
- [ ] Pilihan toko yang ditampilkan di profil bersifat opt-in.
- [ ] Toko tetap memiliki branding/halaman publik sendiri.
- **Acceptance:** perubahan tersimpan ke backend dan terlihat konsisten; alamat dan koordinat privat tidak bocor ke profil publik atau API anonim.

### PR-004 — Alamat pengguna dan titik peta privat
**Prioritas:** P0 sebelum checkout/pemesanan.
- [ ] Form alamat berjenjang: penerima, kontak, provinsi, kota/kabupaten, kecamatan, kelurahan/desa, kode pos, alamat detail, catatan kurir.
- [ ] Peta untuk memilih pin; izin lokasi perangkat opsional; input manual tetap tersedia.
- [ ] Banyak alamat, label rumah/kantor/proyek, alamat utama, edit/hapus.
- [ ] Data privat dan koordinat hanya diberikan kepada pihak yang perlu untuk pemenuhan pesanan yang sah.
- **Acceptance:** pengguna dapat menyimpan, memilih, mengubah, dan menghapus alamat; profil publik hanya menampilkan lokasi publik yang dipilih.

### PR-005 — Upload media dan profil konten
**Prioritas:** P1 setelah fondasi auth/profil.
- [ ] Storage bucket/policies untuk avatar, cover, foto postingan dan video dengan batas ukuran/format/durasi.
- [ ] Upload mobile dengan progress, preview, error, retry dan status publikasi.
- [ ] Metadata konten: owner, media, caption, visibility, timestamps, moderation state.
- [ ] Konten tampil pada profil pengguna setelah upload berhasil di backend.
- [ ] Pisahkan bukti transaksi privat dari media promosi/publik.
- **Acceptance:** upload foto dan video dari Android nyata, refresh halaman dan login ulang tetap memuat media; pengguna lain hanya melihat konten yang boleh mereka akses.

### PR-006 — Explore feed campuran
**Prioritas:** P1; bergantung PR-005.
- [ ] Satu aliran campuran foto dan video.
- [ ] Ranking relevansi, kebaruan, minat dan engagement nyata; popularitas bukan satu-satunya faktor.
- [ ] Cold-start: konten akun pertama terlihat di profil dan dapat muncul pada Explore untuk menguji alur, tanpa memalsukan viralitas/angka engagement.
- [ ] Privasi, blokir, moderasi dan konten terhapus dihormati.
- **Acceptance:** akun pertama mengunggah foto dan video, lalu keduanya dapat ditemukan di Explore dan profil; konten tidak muncul jika tidak memenuhi aturan akses.

### PR-007 — Interaksi sosial
**Prioritas:** P1; bergantung PR-005/006.
- [ ] Like/unlike.
- [ ] Komentar dan balasan.
- [ ] Share melalui native share/copy link sesuai dukungan perangkat.
- [ ] Save/bookmark/tandai ke koleksi pribadi.
- [ ] Tag akun lain dan produk/toko bila relevan.
- [ ] Report, block, moderation, hapus/edit konten.
- **Acceptance:** interaksi persisten setelah refresh/login ulang; hitungan konsisten; kontrol privasi berlaku; tidak ada angka palsu.

### PR-008 — Toko pada profil dan branding mandiri
**Prioritas:** P2 setelah profil pengguna dan Seller Center stabil.
- [ ] Owner memilih toko yang ditampilkan di profil.
- [ ] Profil toko memiliki logo, cover, nama, username toko, bio/deskripsi, kategori, media, promosi, katalog.
- [ ] Owner/staff mengunggah bukti/dokumentasi transaksi dengan label sumber yang jujur.
- [ ] Alat menyamarkan data pribadi pelanggan sebelum publikasi.
- **Acceptance:** pengaturan tampil/sembunyi tidak menghapus toko; konten unggahan sendiri tidak diberi label transaksi terverifikasi tanpa verifikasi sistem.

### PR-009 — Chat dan wallet
**Prioritas:** P2/P3.
- [ ] Chat pengguna dengan toko dan dukungan Pluits dengan RLS peserta.
- [ ] UI wallet dapat ditampilkan nonaktif untuk pengujian visual.
- [ ] Uang sungguhan baru setelah ledger, rekonsiliasi, idempotensi, antifraud, verifikasi rekening, payment provider dan kajian regulasi.
- **Acceptance:** isolasi chat teruji; wallet tidak mengklaim saldo atau transaksi uang sungguhan sebelum sistem siap.

## 4. Skenario uji akun pertama — pengguna biasa

Akun pertama digunakan sebagai pengguna biasa terlebih dahulu, bukan langsung sebagai owner toko.

1. Daftar dan login; verifikasi sesi dan email sesuai konfigurasi Auth.
2. Buka dashboard pengguna; pastikan tidak ada paksaan membuat toko.
3. Tambah/ganti foto profil.
4. Tambah/ganti foto sampul.
5. Isi bio dan nama tampilan.
6. Pilih username unik; uji penolakan username yang sudah dipakai.
7. Atur profil publik dan privat.
8. Isi alamat lengkap, kode pos dan titik peta; simpan sebagai alamat utama.
9. Tambahkan alamat kedua dan uji pemilihan alamat.
10. Unggah satu foto dengan caption; pastikan muncul pada profil dan Explore.
11. Unggah satu video dengan caption; pastikan muncul pada profil dan Explore.
12. Uji like, unlike, komentar, balasan, share, save/tandai dan tag.
13. Refresh, logout/login kembali; pastikan profil, alamat, media dan interaksi tetap tersimpan.
14. Uji akses dari akun kedua untuk memastikan konten privat dan data alamat tidak bocor.
15. Baru setelah alur pengguna lulus, lanjutkan pengujian Buat Toko dan Seller Center.

**Definisi lulus:** alur ini harus benar-benar bekerja dari Android/mobile browser. Screenshot/mockup atau preview lokal bukan bukti backend bekerja.

## 5. Aturan pencatatan checkpoint berikutnya

Gunakan format berikut untuk setiap checkpoint baru:

- **ID dan tanggal**
- **Tujuan**
- **Perubahan kode/database/dokumen**
- **Commit SHA dan file terkait**
- **Deployment URL dan status** (jika ada)
- **Tes yang dijalankan dan hasilnya**
- **Bukti/masalah yang ditemukan**
- **PR tersisa dan dependensi**
- **Keputusan model bisnis yang ikut berubah**

Jangan menutup PR hanya karena kode sudah ditulis. Pisahkan: `DRAFT`, `IMPLEMENTED`, `DEPLOYED`, `TESTED`, `ACCEPTED`. Bila tes belum dilakukan, tulis `NOT TESTED`.

## 6. Prioritas sesi berikutnya

1. Jalankan PR-001 audit repo/backend.
2. Perbaiki atau buat fondasi akun universal PR-002 tanpa merusak Seller Center.
3. Bangun profil publik PR-003 dan alamat privat PR-004.
4. Baru lanjut upload media PR-005, Explore PR-006, dan interaksi PR-007.
5. Setelah alur akun pertama lulus, lanjut toko/branding, chat, dan wallet sesuai dependensi.

**Status terakhir dokumen:** 7 November 2026. Build & deployment Pages untuk commit `3cf19546b0b13aa770a0f856e74cc289cd9693bd` terverifikasi sukses; UAT akun nyata masih menunggu.  
**Catatan:** daftar di atas adalah baseline dari riwayat pengerjaan dan keputusan yang tercatat. Kondisi aktual harus diverifikasi pada awal sesi berikutnya sebelum menandai item selesai atau memulai migrasi baru.


## 7. Checkpoint implementasi pengguna pertama — 7 November 2026

### CP-006 — Fondasi akun, profil, alamat, media dan Explore
- **Status kode:** IMPLEMENTED pada branch `main` hingga commit `3cf19546b0b13aa770a0f856e74cc289cd9693bd`.
- **Status database:** APPLIED dan diverifikasi melalui migration history serta query tabel.
- **Perubahan:**
  - `src/pages/account/index.js` — Supabase Auth signup/login, profil pengguna, avatar/cover, bio, username unik, lokasi publik, privacy, alamat, upload media, Explore, komentar, like, share, simpan, dan tag akun.
  - `src/pages/account/user-account.css` — UI responsif mobile.
  - `src/app/router.js` — `#/account/*` diarahkan ke dashboard pengguna; rute Seller Center dipisahkan dan diperbaiki agar tidak tertangkap route operations generik.
  - `index.html`, `src/main.js` — metadata dan SEO Pluits.
  - `supabase/migrations/202611070004_user_first_social_foundation.sql` — profil, alamat privat, postingan, likes, comments, saves, bucket privat dan policies.
  - `supabase/migrations/202611070005_post_account_tags.sql` — relasi tag akun.
- **Database live terverifikasi:** migrations `pluits_user_first_social_foundation` dan `pluits_post_account_tags` tercatat; tujuh tabel sosial/alamat/profil ada; bucket `pluits-user-media` privat, batas 50 MB, MIME image dan video; policies RLS tersedia.
- **Build & deployment:** GitHub Actions run `42376208078` pada commit `3cf19546b0b13aa770a0f856e74cc289cd9693bd` berhasil (`conclusion: success`); langkah Vite build, verifikasi `dist/index.html`, upload artifact, dan deploy Pages semuanya sukses. Commit berikutnya `3cf19546b0b13aa770a0f856e74cc289cd9693bd` hanya memperbaiki alur re-render interaksi pada detail post; workflow terbaru perlu tetap dipantau bila ada commit setelah checkpoint ini.
- **Belum diuji:** signup/login email nyata, upload media dari Android, geolocation/peta, RLS lintas dua akun, komentar/like/tag lintas akun, dan persistence setelah logout/login.
- **Keamanan yang diketahui:** alamat dan koordinat disimpan di `user_addresses` dengan RLS pemilik; media disimpan pada bucket privat; signed URL dibuat untuk tampilan. Jangan menyebut fitur lulus sebelum tes akun nyata.
- **Catatan cakupan:** video dibatasi 50 MB dan upload menggunakan standard Storage upload; resumable/TUS untuk file besar belum dibuat. Story/Reels, followers, notifikasi tag, moderasi, report/block, edit/hapus post, dan halaman profil publik masih PR.

### CP-007 — Deployment GitHub Pages untuk akun pengguna
- **Status:** DEPLOYED pada workflow run `42376208078`.
- **Build:** sukses; Vite menghasilkan `dist/index.html`.
- **URL akun:** https://baguskristiansianturi.github.io/pluits/#/account/register
- **URL profil:** https://baguskristiansianturi.github.io/pluits/#/account/profile
- **URL Explore:** https://baguskristiansianturi.github.io/pluits/#/account/explore
- **URL alamat:** https://baguskristiansianturi.github.io/pluits/#/account/addresses
- **Catatan:** workflow sukses terverifikasi pada commit `3cf1954...` yang sudah memuat perbaikan interaksi detail postingan.

### CP-008 — Panduan UAT mobile pengguna pertama
- **Status:** Dokumentasi dibuat.
- **Bukti:** `MASTER/PLUITS-USER-TESTING.md`.
- **Tujuan:** Mas Bagus bisa mendaftar sebagai pengguna biasa, menguji profil, alamat/pin, upload foto/video, Explore dan semua interaksi sebelum membuat toko.

### PR status setelah implementasi awal
- **PR-001 Audit repository/backend:** sebagian selesai; migrasi, tabel, RLS policy list, bucket, advisors diverifikasi. Perlu tes anon/authenticated/owner/staff dan pengecekan exposure Data API yang lebih lanjut.
- **PR-002 Akun universal:** IMPLEMENTED tahap pertama; perlu UAT login/logout dan sinkronisasi sesi dengan Seller Center.
- **PR-003 Profil publik:** IMPLEMENTED tahap pertama; halaman publik `/@username`, followers, dan store cards yang tampil di profil masih PR.
- **PR-004 Alamat privat:** IMPLEMENTED tahap pertama; perlu tes pin manual/geolocation dan validasi data alamat.
- **PR-005 Upload media:** IMPLEMENTED tahap pertama; perlu tes file nyata, ukuran, MIME, signed URL, retry dan pembersihan file yatim jika metadata gagal.
- **PR-006 Explore:** IMPLEMENTED tahap pertama; perlu tes akun pertama dan feed lintas akun.
- **PR-007 Interaksi sosial:** IMPLEMENTED tahap pertama; perlu tes likes/comments/share/save/tag lintas akun.
- **PR berikutnya:** UAT bersama pengguna pertama; perbaiki semua temuan; lanjutkan halaman profil publik dan store card; setelah itu Story/Reels, followers, notifikasi, dan moderasi.

### Deployment status note
Build dari commit `642a24bdbed4a85931271e7481f9880a04cc9fc3` berhasil. GitHub Pages deploy pada run `42376030372` gagal karena rerun job menghasilkan dua artefak bernama `github-pages`. Jangan menganggap deployment sukses hanya dari build. Periksa run terbaru setelah commit berikutnya, pastikan conclusion `success`, lalu buka URL Pages untuk verifikasi.

## CP-009 — Konsolidasi My Bali ke Pluits (7 November 2026)

- **Keputusan produk:** My Bali tidak lagi dikembangkan sebagai aplikasi terpisah. Arah bisnis dan pola UI/UX sosial yang relevan dikonsolidasikan ke Pluits.
- **Sumber yang ditinjau:** repository baguskristiansianturi/My-Bali; dokumen MASTER/BUSINESS-MODEL.md, MASTER/PRODUCTS/MY-BALI/PRODUCT-CONCEPT.md, MASTER/PRODUCTS/MY-BALI/SOCIAL-TRIP-AND-EXPERIENCE-FLOWS.md, MASTER/PRODUCTS/MY-BALI/UI-UX-FOUNDATIONS.md, serta prototype app/index.html.
- **Business model Pluits:** section 22 pada MASTER/BUSINESS-MODEL-MASTER.md mencatat elemen My Bali yang diadopsi, batas ruang lingkup konstruksi, verifikasi penyedia, direct-provider, transparansi harga, reputasi, komersial sebagai hipotesis, dan strategi migrasi.
- **Frontend Pluits:** src/pages/home/index.js tetap menggunakan feed publik Pluits dari Supabase; src/style.css mendapat adaptasi bahasa visual My Bali: neutral light background, soft sea-blue accents, story rings, rounded cards, compact header, readable feed, and responsive columns. Tidak menyalin akun/posting demo lokal My Bali.
- **Repository My Bali:** README ditandai sebagai produk yang dikonsolidasikan/retired sebagai produk terpisah. Repository dipertahankan sementara sebagai arsip sumber desain dan sejarah, bukan produk aktif. Penghapusan permanen belum dilakukan.
- **Batas migrasi:** kategori wisata Bali seperti hotel, trip, tiket, spa, dan restoran tidak otomatis masuk Pluits. Fokus Pluits tetap konstruksi dan layanan terkait.
- **Status implementasi:** perubahan dokumentasi Pluits tersimpan pada commit 473761af11a219898e5e971d55440e0560fca644; README arsip My Bali pada eb46120752496fd6085ffec7828109c30cc7c850; adaptasi CSS pada fdc1291e43276a6ed124e9e5b9ff1902c991b126.
- **Status deploy:** workflow run 42377669983 sedang berjalan saat checkpoint ini dicatat. Belum boleh menyatakan deployment selesai sebelum status workflow success.
- **Pekerjaan lanjutan:** audit seluruh fitur prototype My Bali terhadap Pluits, pindahkan komponen yang relevan secara bertahap, hilangkan simulasi/demo-only, uji guest browsing dan login-required actions, lalu validasi mobile UI. Story/Reels dan bottom navigation penuh tidak boleh dianggap selesai hanya dari adopsi styling.

## CP-010 — Perubahan arah Pluits menjadi platform universal lokal + social + Trip (7 November 2026)

- **Status:** KEPUTUSAN MODEL BISNIS DICATAT; audit teknis dan implementasi lanjutan BELUM dilakukan.
- **Arahan founder:** homepage mengikuti social-first model My Bali; Marketplace mempertahankan desain marketplace Pluits yang telah ada; Trip/Travel menjadi pilar ketiga dalam satu platform dan satu akun.
- **Perubahan identitas:** Pluits tidak lagi berfokus khusus pada konstruksi. Marketplace menjadi universal sesuai kategori yang disetujui: produk/retail lokal, makanan/layanan, transportasi lokal, serta kategori Trip seperti Stay, Rental, Activity, Tour, Event dan layanan perjalanan.
- **Pembeda Marketplace:** transaksi barang dibatasi berdasarkan area layanan lokal penyedia. Barang toko Bali tidak dapat di-checkout untuk alamat Jakarta melalui kurir parcel antardaerah seperti JNE/J&T. Checkout hanya aktif jika area tujuan cocok dan penyedia memiliki kapasitas pemenuhan lokal instant/same-day yang nyata. Tidak boleh mengklaim layanan same-day jika jam, stok, jarak, persiapan, atau kapasitas tidak mendukung.
- **Trip exception:** pengguna boleh merencanakan dan memesan akomodasi/aktivitas untuk tanggal mendatang dari luar wilayah karena layanan akan dipenuhi di destinasi penyedia. Ini bukan pengiriman barang antardaerah dan memakai booking workflow tersendiri.
- **Role adjustment:** satu akun lintas member/buyer/traveler, store/business owner, provider/operator, host/accommodation manager, driver/courier/field staff, dan platform admin/moderator/support. Pendaftaran toko/provider opsional; login biasa tidak otomatis menjadi owner.
- **Desain:** homepage social feed mengadopsi pola My Bali; halaman Marketplace mempertahankan desain Pluits lama. Kartu Marketplace ditingkatkan konsistensi dan informasinya, bukan diganti dengan kartu My Bali.
- **Sumber yang dibaca:** My Bali MASTER/BUSINESS-MODEL.md, MASTER/PRODUCT-VISION.md, MASTER/PRODUCTS/MY-BALI/PRODUCT-CONCEPT.md, PROVIDER-ECOSYSTEM.md, SOCIAL-TRIP-AND-EXPERIENCE-FLOWS.md, TRAVEL-JOURNEY.md, ROUTE-INTELLIGENCE.md, PUBLIC-WEB-AND-COMMUNITY-MVP.md, dan OPEN-QUESTIONS.md; dibandingkan dengan master bisnis dan roadmap Pluits.
- **Keputusan yang belum final:** daftar kategori fase pertama; apakah pickup toko menjadi opsi; definisi lokasi pengguna untuk transaksi; cakupan same-day/instant per kategori; provider verification checklist per kategori; kebijakan booking/deposit/refund; legalitas host/driver/guide; komisi dan biaya; metode pembayaran/settlement; dan batas wilayah awal yang siap diuji.
- **PR berikutnya:**
  1. Audit repo/frontend/backend terhadap bagian 23 tanpa merusak desain Marketplace Pluits.
  2. Revisi navigation dan homepage menjadi social-first; cek guest browsing dan login boundaries.
  3. Rancang location context + service area enforcement untuk pencarian, keranjang, checkout dan backend order.
  4. Rancang entity/role provider universal dan verifikasi per kategori; jangan menganggap semua kategori tunduk pada PT/CV/UD.
  5. Buat spesifikasi Trip terpisah: Trip Plan, Stay inventory/calendar/booking, activity/tour/rental/transport, Trip Experience.
  6. Petakan migrasi skema Supabase dan RLS sebelum menerapkan migration baru.
  7. Uji mobile-first dari Android dan catat commit/deploy/test secara terpisah.
- **Status implementasi:** tidak ada fitur baru yang dinyatakan selesai hanya karena model bisnis diperbarui. Kode, schema, deployment dan UAT belum diverifikasi pada checkpoint ini.


## CP-011 — Pluits Social Experience Commerce (7 November 2026)

- **Status:** ARAH MODEL BISNIS DIDOKUMENTASIKAN; implementasi fitur baru pada checkpoint ini BELUM dimulai/diuji.
- **Sumber keputusan:** MASTER/BUSINESS-MODEL-MASTER.md bagian 24.
- **Konsep yang dicatat:** social-first feed; transaksi sah dapat menjadi sumber postingan; foto katalog merchant dapat dipakai bila pengguna tidak mengambil foto; satu pengalaman kanonis untuk review/feed/Trip/arsip; pembedaan sinyal lokasi, kunjungan terkonfirmasi, dan transaksi terverifikasi; notifikasi review kepada owner/staff berizin dan fitur balasan; pembatasan URL eksternal bebas dan penggunaan kartu internal Pluits; username/halaman publik sebagai mini-website; promosi jasa yang diarahkan ke halaman penyedia; pembatasan barang bekas pada listing toko; pilihan pickup/pengiriman toko/mitra; Trip Story dengan kontrol privasi; moderasi, spam controls, dan hipotesis pendapatan.
- **Guardrail:** jangan menjanjikan tidak ada postingan palsu secara absolut. Label transaksi terverifikasi hanya jika ada bukti backend yang sah. Foto, caption, geotag, atau geofence saja tidak cukup. Jangan mempublikasikan nominal, lokasi real-time, atau detail transaksi tanpa kontrol privasi.
- **Belum dikerjakan:** skema transaksi/experience/review/notifikasi baru; respons merchant; halaman publik usaha; kartu internal; validasi link; Trip Story; peningkatan moderasi/rate limit; consent privasi; pembayaran/wallet; integrasi logistik.
- **Langkah berikutnya:** (1) buat panduan AI Start Here; (2) audit repo, Supabase schema/RLS, route dan feed terhadap bagian 24; (3) tulis PRD dan model data experience/review sebelum migration; (4) lanjutkan fondasi sosial dan halaman publik/username; (5) implementasikan notifikasi dan balasan merchant dengan authorization/RLS; (6) integrasikan transaksi hanya setelah payment flow nyata siap; (7) UAT Android lintas akun pengguna dan merchant.
- **Deployment:** perubahan checkpoint ini adalah dokumentasi. Tidak ada perubahan kode/database atau klaim fitur selesai. Status Pages tidak berubah karena dokumentasi saja.


## CP-012 — Real user registration & public social feed foundation (7 November 2026)

- **Status:** backend access policy applied; frontend registration UX updated; GitHub Pages workflow completed successfully for commit 190b2bc; real-user end-to-end UAT NOT TESTED.
- **Existing foundation audited:** Supabase Auth email/password, trigger creating `user_profiles`, private addresses, posts/interactions, private `pluits-user-media` bucket, profile/compose/Explore routes.
- **Gap found:** anonymous visitors had table grants but no anon RLS SELECT policies for public profiles/posts, so the homepage public feed could not reliably query public content. Storage signed URL creation also lacked an anon policy even for media referenced by public content.
- **Backend migration applied:** `20261107142901_pluits_public_social_read.sql` adds anon SELECT policies limited to public profiles and published public posts, plus anon Storage SELECT only for media referenced by those public posts or public profiles. Private addresses, private posts, and unrelated user media remain protected.
- **Frontend changes:** registration sends email confirmation back to the current GitHub Pages base URL; when confirmation is required, UI explains next steps and provides resend confirmation; account copy updated; homepage copy now describes local business/services instead of only construction; metadata updated.
- **Testing guide:** updated with account creation, email confirmation, first public/private post and anonymous public feed checks.
- **Not done:** actual user registration by founder, confirmation email delivery, password login, upload, Explore visibility, anonymous feed, cross-account RLS test, mobile UAT, and custom domain setup.
- **Security caution:** anon Storage signed URLs are intentionally limited to files referenced by public published posts or public profiles. Verify after deployment using an anonymous browser session; private media must not load.
- **Next step:** verify migration history and advisors; commit migration/frontend/docs; inspect GitHub Actions Pages deployment; then founder registers their own account through the normal UI. Never create an account or post on the founder's behalf.


## CP-013 — Homepage publik visitor-first (7 November 2026)

- **Keputusan UX:** pengunjung pertama kali harus mengenal dan menjelajahi Pluits tanpa dipaksa mendaftar. Signup/login hanya diminta ketika pengguna memilih aksi yang membutuhkan akun.
- **Perubahan frontend:** `src/pages/home/index.js` mengganti homepage feed-only menjadi landing page publik yang menjelaskan Pluits, marketplace lokal, jasa/layanan, usaha/penyedia, logistik lokal, pembeda pengalaman, cara mulai sebagai tamu, serta CTA eksplorasi. Feed publik tetap dipertahankan sebagai bagian komunitas dan membaca data nyata dari Supabase; tidak ada postingan/demo palsu yang ditambahkan.
- **Navigasi:** tautan homepage diarahkan ke rute yang tersedia, bukan anchor hash yang dapat mengganggu router SPA.
- **Belum diverifikasi:** hasil render di Android, seluruh rute tujuan, respons feed anon dan deployment GitHub Pages untuk commit CP-013.
- **Acceptance:** pengunjung dapat membuka homepage, memahami gambaran Pluits, menjelajahi halaman publik tanpa login, dan baru diminta daftar saat mencoba aksi yang memerlukan akun.


## CP-014 — Mobile commerce UX + backend integration audit (8 November 2026)

- **Status frontend:** mobile CSS committed for marketplace catalog, product detail, cart, checkout and Seller Center. Responsive rules include horizontal category/filter strips, two-column product grid, swipeable product galleries, sticky mobile purchase/checkout actions, compact cart rows, single-column checkout forms, and horizontally scrollable seller navigation/product photos.
- **Commits:** dd0024a88048573a178ba991cd15789c616d9991 (commerce mobile CSS); cf8c19beca7fff487d572413b4e02a8f06188118 (Seller Center mobile CSS).
- **Deployment:** GitHub Actions run 362 was queued/in progress at checkpoint creation. NOT DEPLOYED/NOT TESTED until run is successful and Android UAT is performed.
- **Backend audit:** active Supabase project is ytndswhqxayqpftszwfh (pluits, ap-southeast-1). Current schema has store, store_members, store_settings, categories, products, product_variants, product_images, inventory_movements, and audit logs. All these tables have RLS enabled.
- **Live data state:** one store exists (Toko Bagus) but remains draft and unverified; online sales are disabled. One product exists but remains draft. Do not expose it as a public live listing and do not fabricate stock, ratings, orders, reviews or sales.
- **Critical commerce gap:** no order, order-item, checkout, payment, refund, shipment/fulfillment or customer cart tables exist yet. Existing src/app/store.js, src/pages/cart/index.js and src/pages/checkout/index.js store cart/orders only in browser localStorage; checkout currently creates a local demo order, clears the local cart and labels payment as pending without a backend transaction. Existing marketplace listing/detail are built from static src/data/catalog.js and src/data/marketplace.js data, not live Pluits seller records.
- **Public storefront gap:** current seller RLS policies allow store members to manage catalog data but do not provide the complete verified-store/published-product public read contract. Store media bucket is private and needs a scoped public image delivery design before live storefront publication.
- **Required next backend milestone (do not skip):**
  1. Define and review the public storefront contract: only verified + active + online-sales-enabled stores and published/active products/variants; never expose private addresses or draft inventory.
  2. Add scoped public read policies for store public profile, categories, published products, active variants and product images; implement safe public media URLs for the private pluits-store-media bucket.
  3. Design canonical orders/order_items/store_orders or equivalent, immutable price snapshots, inventory reservation/decrement rules, status/event history, cancellation/refund states, and RLS by buyer/store membership.
  4. Decide delivery calculation and pickup rules from actual store settings/zones; remove hardcoded Rp95,000 delivery and 1% service fee until a real pricing rule is approved.
  5. Integrate checkout to an authenticated backend transaction/RPC with server-side totals and idempotency; do not mark payment successful until a real provider webhook/verified receipt confirms it.
  6. Replace static demo catalog and local-only cart/order flow with Supabase-backed public catalog, buyer cart persistence policy, and real order history. Preserve guest browsing; require login at checkout.
  7. Add staff permission checks for catalog/inventory/orders before enabling staff operations; review current SECURITY DEFINER warnings.
  8. Run advisors, RLS tests across anonymous/buyer/owner/other-store users, build, Pages deployment, and Android UAT.
- **UX acceptance:** app-first mobile layout; categories and filter controls swipe horizontally; cards fit two columns; detail gallery/add-to-cart is thumb-friendly; cart has persistent total/checkout action; checkout is a clean standalone flow without site header/footer; Seller Center is manageable by phone and product image selection is swipeable.
- **Known security warnings from live Supabase advisor:** create_store and update_store_profile SECURITY DEFINER functions are callable by authenticated users and require review; leaked-password protection is disabled. Do not ignore these before production.
- **Important truth label:** mobile CSS is IMPLEMENTED in repository; deployment and real-device appearance are NOT TESTED. Commerce backend integration is NOT IMPLEMENTED. The current demo/localStorage checkout must not be described as a working real transaction.


## CP-015 — Checkout safety gate (8 November 2026)

- Checkout no longer fabricates a local order, clears the user's cart, or shows a made-up delivery fee/service fee.
- The checkout form can still retain a local draft, but the submit action is intentionally disabled until the backend order, stock validation, delivery pricing, and payment flow are implemented.
- Subtotal is displayed as provisional only; delivery and service fee are explicitly marked as not yet calculated.
- This is a safety improvement, not completion of checkout. Do not enable the button until a server-side order transaction and RLS tests exist.
- Commit: 29a79b4fc246f829d888414f961cf017f0d0ce0a. Deployment workflow was in progress at checkpoint creation.


## CP-016 — Live Pluits audit + media-ratio correction (8 November 2026)

### Repository and deployment baseline
- Confirmed the application repository is `baguskristiansianturi/pluits`, Vite frontend, branch `main`.
- Confirmed Supabase project `pluits` / `ytndswhqxayqpftszwfh` is ACTIVE_HEALTHY in Singapore.
- The docs commit `104594df3946c054012354a6570aabfea4268f14` passed GitHub Pages workflow run 368.
- A direct CSS correction was committed as `07d81f76b8c46c9e81f53104263b1d91320daa5a`: mobile public social feed images and videos now use intrinsic height and `object-fit: contain`, avoiding the previous mobile `object-fit: cover` overrides. Workflow run 369 was in progress at the time of this checkpoint; do not mark deployed until it succeeds.

### Verified live backend
- 17 migrations in live history; 13 migration files currently tracked in GitHub.
- Five live migration files are missing from GitHub; one tracked initial migration is not in live history. See `docs/pluits/LIVE-AUDIT-2026-11-08.md`.
- All 28 public tables have RLS enabled.
- No Edge Functions deployed.
- Security advisor: two authenticated-callable SECURITY DEFINER RPC warnings and leaked-password protection disabled.
- Performance advisor: 14 unindexed foreign keys, three wallet RLS init-plan warnings, 14 unused-index notices and one duplicate permissive Stories SELECT policy.
- Health advisor returned no lints.
- Existing draft store and draft product must not be represented as public active listings.

### Frontend findings
- Social account module supports user registration/login, profiles, text/photo/video posts, Explore, likes, comments, share, save and tagging.
- Account feed media uses intrinsic proportions; profile-grid thumbnails intentionally use square crops.
- Public homepage feed had mobile CSS overrides forcing `object-fit: cover`; CP-016 corrects this.
- Public homepage feed action links currently navigate to Explore rather than performing anonymous likes/comments. Stories have a live table but the account UI does not yet provide a complete story creation/viewing experience.
- Explore uses a simple interaction-weighted sort; following graph, messaging, notifications, communities, report/block/moderation and threaded replies are not complete.
- Wallet UI and tables support request scaffolding only; no payment provider, verified settlement or real-money ledger is operational.
- Marketplace checkout remains intentionally disabled pending real server-side orders, inventory validation, delivery calculation and payment processing (CP-015).

### Next required work — ordered
1. Reconcile and restore the five missing applied migration SQL files from their authoritative source; verify the one tracked-but-unapplied initial migration. No database reset.
2. Enable leaked-password protection in Supabase Auth settings.
3. Complete adversarial RLS/storage tests with anonymous, owner and second user; specifically test foreign media-path attachment, private profile/post/story reads and store RPC authorization.
4. Review and narrow store staff permissions, audit writes and SECURITY DEFINER RPC grants.
5. Complete mobile social feed UAT, then implement Stories UI, functional public feed metrics/actions, follow graph, notifications, report/block and moderation.
6. Keep commerce and wallet claims disabled until their server-side transaction, ledger, settlement and refund paths are implemented and tested.

### Status labels
- **IMPLEMENTED:** media ratio CSS correction committed.
- **DEPLOYMENT PENDING:** workflow run 369 at checkpoint time.
- **AUDITED:** repository structure, live project status, migration history, public-table RLS coverage and Supabase advisors.
- **NOT TESTED:** two-account privacy/UAT, media ownership adversarial tests, Android device presentation.
- **NOT COMPLETE:** stories UI, follow graph, messaging, notifications, moderation, live checkout/payment, real wallet.


## CP-017 — Deployment and anonymous access smoke test (8 November 2026)

- GitHub Pages workflow run 374 completed successfully on commit `8d7f3b30b2c7bc85b7295090e55b94dbf9058651`.
- Confirmed `npm ci`, Vite production build, `dist/index.html` check, artifact upload and GitHub Pages deploy all passed.
- Anonymous SQL smoke test (rolled back): 2 public profiles and 1 public post visible; 0 private address rows and 0 active Stories visible.
- Anonymous Storage smoke test (rolled back): 2 of 4 user-media objects visible; 0 of 1 store-media objects visible.
- Current user_posts data check: 2 rows, 0 media paths with a first-folder UUID different from the post owner. This does not prove future writes are protected.
- Stories table currently has 0 rows.
- **Not tested:** Android handset rendering, registration email delivery, signed-in owner vs unrelated-user RLS, media upload/delete, and adversarial media path attempts.
- **Status:** build/deployment workflow verified; limited anonymous boundary smoke test passed; production readiness remains NOT APPROVED pending migration reconciliation and authenticated security tests.


## CP-018 — Migration history reconciliation (8 November 2026)

- Recovered five missing applied migration SQL definitions from `supabase_migrations.schema_migrations.statements`.
- Corrected four early migration filenames to the exact version/name recorded in the live database.
- Replaced five tracked migration files whose SQL differed from the applied live statements; previous drafts preserved under `supabase/archive/`.
- Archived the unapplied legacy `202611070001_initial_marketplace.sql` because it is absent from live history and conflicts with the later applied seller workspace migration.
- Verified active migration directory: 17 files; live history: 17 records; exact version/name set match; zero missing and zero extra active migrations.
- No DDL was applied and no live data/database was reset.
- **Status:** migration history reconciled. Future DDL may proceed only through the normal reviewed migration workflow, with RLS/security tests and advisors.


## CP-019 — Social media ownership security fix (8 November 2026)

- A rollback-only adversarial test proved the old `user_posts` insert policy accepted a public post whose `media_path` began with another UUID folder.
- Applied migration `20261108011806_enforce_social_media_owner_paths`: validated CHECK constraints now require post/story media paths to begin with the matching `user_id` UUID folder and include a non-empty object name.
- Re-tested: foreign-folder media paths are rejected for both posts and Stories; valid same-user paths pass. All probe inserts were rolled back.
- Created and committed the exact migration SQL recovered from live Supabase history.
- **Status:** media-path ownership invariant implemented and verified at database level.

## CP-020 — RLS policy/performance hardening (8 November 2026)

- Applied migration `20261108011838_optimize_story_and_wallet_rls_policies`.
- Consolidated Stories read policies: anonymous users see only active public Stories from public profiles; authenticated users see their own Stories plus active public Stories.
- Changed wallet RLS identity expressions to `(select auth.uid())`.
- Re-ran advisors: wallet RLS init-plan warnings (3) and duplicate permissive Stories policy warning (1) are cleared.
- Remaining performance notices: 14 unindexed foreign keys and 12 unused-index notices. No index was dropped.
- Security warnings still remaining: 2 authenticated-callable SECURITY DEFINER RPCs and leaked-password protection disabled.
- Live migrations and active GitHub migration files: 19 / 19, exact version/name match.
- **Status:** two backend hardening migrations applied and verified; production readiness remains NOT APPROVED pending Auth leaked-password setting, full account-level tests and remaining security review.


## CP-021 — Stories UI dan viewer (8 November 2026)

- Explore sekarang memuat strip Stories horizontal yang responsif untuk mobile.
- Pengguna login dapat membuat Story foto/video, menulis caption singkat, dan memilih audience.
- Profil privat tidak dapat memilih audience Publik; default mengikuti privasi profil.
- Viewer Story menampilkan foto/video dengan rasio intrinsik, tombol tutup, dan caption.
- Story rows memakai masa aktif 24 jam yang sudah ditentukan di database; UI hanya menampilkan Story yang belum kedaluwarsa.
- Upload memakai bucket privat `pluits-user-media` dan path folder UUID pemilik; constraint media owner dari CP-019 tetap berlaku.
- Database smoke test (transaksi rollback): Story publik dari profil publik terlihat oleh anon; Story privat tidak terlihat oleh anon.
- GitHub Pages workflow run 423: **SUCCESS**, Vite build, output check, artifact upload dan deploy berhasil.
- **Belum diuji:** upload Story dari akun nyata, viewer di perangkat Android, upload video besar, serta perilaku kedaluwarsa 24 jam secara langsung.
- **Status:** Stories UI implemented and deployed; UAT pending. Reels khusus, DM, follow graph, notifications, reporting/moderation, and public homepage engagement metrics remain incomplete.


## CP-022 — Dedicated Reels feed (8 November 2026)

- Explore now links to a dedicated `#/account/reels` route.
- Reels page loads video posts from the same `user_posts` table and uses the existing likes/comments/share/save actions.
- Video player keeps the original source ratio with `height:auto` and `object-fit:contain`; portrait, landscape and square sources are not forced into one crop.
- Mobile Reels cards use a tall vertical layout; playback remains user-controlled (no autoplay) to reduce surprise data/battery use.
- GitHub Pages workflow run 432: **SUCCESS**, Vite build, artifact upload and Deploy to GitHub Pages passed.
- **Not tested:** real video upload, Android playback, network/battery behavior, and interaction persistence on real accounts.
- **Status:** basic Reels feed implemented and deployed; UAT pending. Full-screen swipe/autoplay remains a future enhancement.


## CP-023 — Follow graph, profil publik, dan privasi akun (8 November 2026)

### Implementasi
- Backend menambahkan `public.user_follows` dengan pasangan follower/following unik, larangan follow diri sendiri, status `pending` atau `accepted`, indeks untuk daftar pengikut/mengikuti, dan RLS aktif.
- Trigger database menetapkan status berdasarkan visibilitas profil target: akun publik langsung `accepted`; akun privat menjadi `pending`. Klien tidak dapat memaksakan status accepted pada akun privat.
- Pemilik akun privat dapat menerima permintaan; follower dapat membatalkan permintaan atau berhenti mengikuti; pemilik dapat menolak/menghapus follower.
- Profil publik dapat dibuka melalui `#/account/user/<username>`. Nama pemilik postingan pada feed kini mengarah ke profil.
- Halaman profil sendiri menampilkan jumlah pengikut/mengikuti; daftar Pengikut, Mengikuti, dan Permintaan dapat dikelola dari UI.
- Pengunjung tanpa login dapat membuka profil dan postingan publik; tindakan follow memerlukan login.
- RPC directory dan follow-count menggunakan wrapper `SECURITY INVOKER` pada schema public dan helper terbatas di schema private. Profil privat hanya mengungkap username, nama tampilan, dan status privasi kepada pihak yang belum disetujui; bio, avatar, cover, dan wilayah baru diberikan sesuai aturan akses.
- Akses profil, postingan, Story publik, avatar/cover, dan media postingan privat diperluas hanya kepada follower yang sudah diterima. Story dengan audience "Hanya saya" tetap hanya untuk pemilik.
- UI daftar follow dibuat ringkas dan responsif untuk mobile.

### Pengujian backend yang berhasil
- Follow akun publik menghasilkan `accepted`.
- Follow akun privat menghasilkan `pending`; pemilik target dapat menerima dan mengubah status menjadi `accepted`.
- Akun yang mengirim permintaan belum dapat membaca baris profil privat secara langsung; directory RPC hanya mengembalikan identitas dasar tanpa bio/avatar.
- Pengunjung anonim tidak dapat membaca avatar media akun privat (0 object); follower yang sudah diterima dapat membaca avatar yang diizinkan (1 object).
- Follower yang sudah diterima dapat membaca postingan publik milik profil privat sesuai kebijakan; pengujian terkontrol menemukan 1 postingan terlihat.
- Follow diri sendiri ditolak oleh RLS.
- Seluruh probe lintas akun dijalankan dalam transaksi rollback; tidak ada data follow uji yang disimpan.
- Migration SQL CP-023 telah dibandingkan dengan `supabase_migrations.schema_migrations.statements`: 10/10 migration baru memiliki file dan SQL yang cocok dengan live history. Bersama baseline 19 migration sebelumnya, target parity adalah 29/29.

### Temuan dan batas
- Saat audit awal, policy recursion ditemukan pada hubungan antara RLS `user_profiles` dan `user_follows`; diperbaiki dengan helper relasi terbatas di schema private. Pengujian ulang tidak lagi memunculkan recursion.
- Riwayat migrasi CP-023 memuat beberapa pembaruan policy yang berulang akibat iterasi hardening. Jangan menghapus atau mengubah migration yang sudah diterapkan; rapikan hanya melalui migration baru bila benar-benar diperlukan.
- Notifikasi follow/request belum dibuat. UI menampilkan daftar permintaan secara langsung, tetapi belum ada inbox notifikasi, push, atau email.
- Blokir, mute, report, moderasi, banding, DM, dan kontrol anti-spam masih belum tersedia.
- GitHub Pages workflow run #465 (run ID 42435951991) pada commit `fc2314e81f21d5edd55d99108da8777198d7d6f4`: **SUCCESS**, termasuk Vite build, artifact upload, dan Deploy to GitHub Pages. Build output: JS 172.94 kB (gzip 49.59 kB), CSS 258.32 kB (gzip 44.57 kB), HTML 1.09 kB. Ini ukuran build, bukan skor Lighthouse atau pengukuran runtime. Android/real-account UAT masih pending.
- **Status:** backend follow + privacy rules implemented and rollback-tested; frontend follow/profile implemented in repository; deployment and real-account UAT pending.


## 2026-11-08 — Konsolidasi identitas dan arsitektur Pluits

- **Keputusan founder terbaru:** nama produk, frontend, backend, dan repository adalah Pluits. Fungsi delivery dapat menjadi layanan di dalam Pluits, bukan nama produk utama.
- Tiga ruang utama: Social Media/Community (fondasi sosial dari My Bali), Local Marketplace (berbagai produk/layanan lokal dengan siklus katalog-order-pembayaran-fulfillment tersendiri), dan Trip (tujuan, itinerary, reservasi/booking, kunjungan, dan pengalaman perjalanan).
- GeoDirectory adalah direktori universal/peta bersama untuk toko, restoran, tempat wisata, monumen, gereja, sekolah, fasilitas, alamat, layanan, komunitas, event, dan entitas lokasi lainnya. Satu entitas/lokasi kanonis dapat ditautkan lintas modul; tidak semua tempat adalah toko atau dapat dipesan.
- Taxonomy bisnis/tempat/aktivitas dari My Bali tetap menjadi referensi dan perlu dipetakan ke GeoDirectory, Trip, dan Marketplace tanpa menyamakan siklus ketiganya.
- **Repository:** `baguskristiansianturi/pluits`; URL Pages kanonis: `https://baguskristiansianturi.github.io/pluits/`. Status deployment terbaru tetap harus diverifikasi per commit.
- **Status implementasi:** catatan ini adalah keputusan/dokumentasi. Belum membuktikan audit kode, migrasi backend/frontend, rename repository, deployment, atau UAT selesai.
- **Checkpoint berikutnya:** audit seluruh asumsi konstruksi lama; petakan taxonomy My Bali; susun model universal GeoDirectory; pisahkan siklus Marketplace dan Trip; pertahankan fondasi social-first; kemudian implementasikan secara bertahap dan uji mobile.


## Keputusan produk — identitas, klaim direktori, dan kepercayaan (8 November 2026)
- Pluits diarahkan menjadi ekosistem identitas manusia dan entitas/tempat: satu identitas personal dapat memiliki banyak role yang diverifikasi dan dibatasi permission-nya.
- GeoDirectory harus menyediakan profil tempat sebelum pengelola mendaftar. Sumber data peta/direktori wajib legal dan berlisensi; scraping Google Maps tidak boleh diasumsikan diizinkan.
- Tambahkan alur “Klaim tempat ini” dengan verifikasi kewenangan, pencegahan klaim ganda, audit log, dan pencabutan role.
- Bedakan akun personal yang boleh menawarkan/menjual dari toko atau penyedia resmi yang mengklaim sebagai pihak langsung. Status dan bukti harus terlihat.
- Perlindungan transaksi dibatasi pada transaksi yang tercatat melalui Pluits; transaksi eksternal tidak otomatis memiliki bukti atau perlindungan Pluits.
- Pertahankan kamera dan pengalaman sosial My Bali sebagai fondasi Social Media Pluits. Moderasi konten harus kontekstual: konten pantai berbikini tidak otomatis dilarang; konten sensitif dapat diberi interstitial, sedangkan eksploitasi seksual, konten seksual anak, kekerasan grafis, dan pelanggaran berat ditangani tegas.
- Penegakan akun harus berdasarkan perilaku/pelanggaran yang terbukti, bukan identitas atau penampilan; sediakan alasan, banding, dan peninjauan.
- Direktori tempat/organisasi dapat menyediakan dukungan atau donasi hanya dengan transparansi penerima dan mekanisme pembayaran/penyaluran yang patuh hukum.
- Status: keputusan model bisnis terdokumentasi; fitur-fitur tersebut belum dinyatakan selesai di kode, backend, deployment, atau pengujian.


## GeoDirectory — keputusan dan arsitektur (8 November 2026)
- Keputusan pengguna: nearby; Beranda hybrid; cakupan local-first mulai Bali/Denpasar; personalisasi adaptive dengan kontrol privasi.
- GeoDirectory adalah lapisan entitas/lokasi kanonis lintas Social, Trip, Marketplace, dan event.
- Model target: entities, categories, locations, sources/provenance, claims, memberships/roles, media, relationships, user interests, minimal activity events, recommendation feedback, saved, recent.
- MVP memakai ranking deterministik yang dapat dijelaskan; ML/vector tidak dibutuhkan pada tahap pertama.
- Audit Supabase: fondasi social/profile/follow dan store/product tersedia; GeoDirectory universal belum ditemukan. PostGIS belum terpasang walau tersedia. Wishlist/cart/recent frontend masih localStorage.
- Tahap berikutnya: audit RLS/RPC/storage; finalisasi taxonomy Bali; migration PostGIS + entity/location/source core + GiST + nearby RPC + RLS; UI map/list/detail; claims; integrasi lintas modul.
- Belum ada perubahan schema, kode aplikasi, atau deployment dari analisis ini.


## GeoDirectory — implementasi dan evaluasi (8 November 2026)
- Database IMPLEMENTED: PostGIS, 27 kategori, 4 starter places, directory entities/locations/sources/claims/memberships, RLS, nearby RPC, saved/recent, preferences/activity/feedback, relationships, media metadata, social post tags, store entity link.
- Frontend IMPLEMENTED: home nearby, `#/places`, `#/place/:slug`, claim form, list/map, category/radius/area filters, opt-in GPS, explicit interest controls, activity-based deterministic ranking, feedback, saved/recent directory entities.
- Supabase verification: anon nearby 15 km = 2, 50 km = 4, beach filter = 1, invalid latitude = 0; all 16 new public tables checked have RLS; source/claim/preferences not readable by anon; GiST index exists.
- GitHub Actions Pages run #506 succeeded at commit `2432e4a`. Final documentation and SQL-only changes trigger a new build; verify latest run before final close.
- Not complete: four-place data coverage only; no import/dedup pipeline, claim/media admin dashboard, media Storage upload, store backfill/authoring UI, Trip link, full commerce cart/wishlist migration, Android device UAT, Lighthouse/load test.
- Security residuals: legacy `create_store` and `update_store_profile` remain SECURITY DEFINER (current definitions check auth.uid; update checks private.is_store_owner); Supabase leaked-password protection remains disabled. Do not change these without seller/auth regression testing and configuration access.
- Next: confirm latest Pages run; complete real-device UAT; build claim/media moderation and data import; connect Trip; migrate commerce cart and product wishlist; enable leaked-password protection and separately review legacy RPCs.

- Migration tambahan `20261108041216_pluits_directory_fk_indexes` menutup temuan indeks foreign key pada tabel GeoDirectory. Performance Advisor tersisa 14 FK legacy tanpa indeks dan 43 indeks belum digunakan pada fase tanpa trafik; evaluasi legacy terpisah, jangan hapus indeks terencana secara prematur.
- Security Advisor: policy sumber GeoDirectory sudah eksplisit deny dan tidak mendapat grants anon; peringatan tersisa berasal dari dua RPC toko SECURITY DEFINER lama serta leaked-password protection yang belum aktif.

- Ranking adaptive diperhalus dengan decay 90 hari dan batas skor per kategori. Bottom navigation mobile kini menyediakan pintasan GeoDirectory.

- Claim lifecycle diperketat: membership yang dibuat dari klaim memiliki `source_claim_id`; pencabutan/penolakan/sengketa setelah approval mencabut akses membership yang bersumber dari klaim tersebut.


## CP-024 — Social activity inbox and notification backend (8 November 2026)

- Backend: added `public.user_notifications` with recipient ownership, actor, notification type, linked post/profile, created/read timestamps, recipient/time and unread indexes, and RLS.
- Database triggers create notifications for follow requests, accepted follows, post likes, and post comments. Self-actions do not generate notifications.
- Security: clients cannot insert notifications or edit their content/actor/recipient; authenticated users can read only their own rows and update only `read_at`. Trigger function is isolated in the non-exposed `private` schema, uses a fixed `pg_catalog` search path, and is not executable by anon/authenticated roles.
- Frontend: added the Activity entry to the signed-in social navigation, an activity inbox with actor identity, event type, timestamp, unread state, mark-one-read and mark-all-read behavior.
- Verification: notification table RLS enabled; anon has no SELECT; authenticated has SELECT but no table-wide UPDATE; authenticated may update only `read_at`; 4 event triggers exist; anon/authenticated cannot execute the trigger function. Supabase Security Advisor no longer reports this new function; remaining 2 SECURITY DEFINER findings are legacy store RPCs, plus Auth leaked-password protection remains disabled.
- **Status:** backend schema/triggers and frontend inbox implemented; real two-account event-flow and Android visual UAT pending; deployment must be confirmed from the latest Pages workflow.
- **Next Phase 1 work:** media upload progress/retry and preserving original dimensions across every feed surface; then complete threaded comments, sharing/repost attribution, and post audience/comment controls before moving deeper into Phase 2 trust and safety.


## CP-025 — Help Center, Terms, Privacy & Policy Blueprint (8 November 2026)

- Founder clarification: bantuan, syarat penggunaan, privasi, pedoman komunitas, dan aturan tiap fitur harus berkembang seiring sharing, keputusan produk, dan pengujian; bukan pekerjaan dokumentasi yang ditunda sampai akhir.
- Blueprint dibuat di `docs/pluits/HELP-CENTER-LEGAL-CONTENT-BLUEPRINT.md`.
- Struktur mencakup Pusat Bantuan; Keamanan & Kepercayaan; Ketentuan & Kebijakan; Tentang & Kontak; artikel bantuan per domain; dokumen Terms, Privacy, Community Guidelines, Marketplace, Trip, Location/Directory, dan Verification.
- Setiap masukan wajib menjadi Decision Record dan dipetakan ke Master Business Model, Product Roadmap, PRD/architecture, UI copy, Help Center, Terms, Privacy, Guidelines, serta test cases.
- Status dipisah: PROPOSED, DECIDED, IMPLEMENTED, DEPLOYED, TESTED, PUBLISHED, LEGAL REVIEW REQUIRED, SUPERSEDED. Keputusan founder tidak otomatis menjadi kebijakan aktif.
- Privacy Policy harus mengikuti data inventory dan kontrol backend yang nyata. Dilarang menjanjikan fitur keamanan, retensi, penghapusan, enkripsi, atau perlindungan transaksi yang belum dibuktikan.
- **Status:** BLUEPRINT CREATED / COMMITTED. Belum ada halaman Help/Legal publik dan belum ada Terms/Privacy final yang diterbitkan. Draft legal memerlukan inventaris data dan review profesional sebelum diberlakukan.
- **Delivery gates:** H0 blueprint; H1 data map + account/social help and community baseline; H2 GeoDirectory/location; H3 Marketplace; H4 Trip; H5 Trust/Safety/Operations.
- **Aturan kerja ke depan:** setiap checkpoint fitur harus mengecek dampak ke bantuan, disclosure, Terms, Privacy, dan Guidelines. Konten yang menjelaskan perilaku pengguna harus diperbarui sebelum/bersamaan dengan rilis fitur terkait.


### CP-027 — Standar responsivitas lintas perangkat (8 November 2026)
- Pluits adalah platform sosial multi-perangkat. Mobile menjadi prioritas utama, tetapi tablet dan desktop/laptop harus memiliki tata letak yang memang dirancang untuk layar besar, bukan sekadar pembesaran tampilan mobile.
- Satu akun, fitur, data, dan hak akses yang konsisten; navigasi, kepadatan informasi, kolom, dan affordance menyesuaikan ukuran layar serta input sentuh/keyboard.
- Mobile: satu kolom, bottom navigation, kontrol sentuh, carousel horizontal untuk rail konten, media mempertahankan rasio aslinya.
- Tablet: navigasi adaptif, dua kolom bila membantu, feed tetap terbaca.
- Desktop: navigasi persisten yang sesuai, feed terpusat dengan contextual rail bila relevan, pengaturan multi-kolom, keyboard/focus/hover.
- Viewport QA: 360×800, 390×844, 768×1024, 1024×768, 1366×768, 1440×900; uji zoom 200%, label panjang, overflow, dan keyboard.
- Account Center telah mendapat pass CSS awal: satu kolom di mobile, dua kolom di tablet/desktop. Status deploy dan QA perangkat masih menunggu; standar ini berlaku untuk seluruh halaman, bukan hanya pengaturan.


## CP-028 — Functional social interactions & profile navigation (8 November 2026)

- Masukan UAT founder: Feed, Explore, upload media, komentar, interaksi komentar, dan navigasi profil harus benar-benar berfungsi sebagai satu pengalaman sosial; tombol dekoratif atau tautan yang hanya memindahkan ke layar lain bukan kriteria selesai.
- Home feed signed-in: like/unlike dan save/unsave langsung; Share memakai native share atau salin tautan; Komentar membuka detail postingan. Nama dan avatar penulis membuka profil pengguna.
- Explore/Reels/detail postingan: pemilik postingan tetap dapat menyukai dan mengomentari postingannya sendiri. Policy komentar memberi pengecualian bagi pemilik postingan walau preferensi komentar membatasi komentar dari pengguna lain.
- Threaded comments diterapkan melalui parent_comment_id dengan foreign key yang memastikan balasan tetap berada di postingan yang sama. Tabel post_comment_likes menyediakan like/unlike komentar dengan RLS authenticated dan satu like per akun per komentar.
- UI komentar menampilkan penulis, balasan bertingkat, tombol balas, like dan jumlah like. Navigasi desktop dan mobile tetap tersedia ketika membuka halaman profil; avatar profil menjadi tautan yang jelas.
- Migration DB: 20261108051829_pluits_post_comment_replies_and_likes.sql. Sudah diterapkan ke Supabase project pluits (ytndswhqxayqpftszwfh). Kolom, tabel, dan policy RLS telah diverifikasi melalui query schema.
- Status implementasi: DB APPLIED; frontend IMPLEMENTED; build/deploy harus mengikuti workflow terbaru; Android/two-account UAT BELUM DILAKUKAN.
- Video upload: frontend yang ada menerima MP4/WebM hingga 50 MB melalui Storage private bucket dan signed URL. Belum boleh dinyatakan lulus sampai tes upload dan playback dari Android nyata berhasil.
- Masih terbuka: validasi dua akun, like/komentar/balasan setelah refresh, private-profile access, laporan/moderasi, alur Stories/Reels, Explore discovery dan pemeriksaan responsif lintas perangkat.
- Acceptance test wajib: owner like dan komentar pada postingan sendiri; akun kedua like/komentar; balas komentar dan balas balasan; like komentar; refresh mempertahankan thread/counter; klik avatar/nama membuka profil yang benar; uji Home/Explore/Reels/Detail/Profile pada ponsel, tablet, desktop.
- Next: uji upload video nyata di Android dan dua akun; lengkapi discovery Explore serta report/block/moderasi dan pengalaman Stories/Reels sebelum menyatakan Social Core siap UAT penuh.


## CP-029 — Media upload reliability pass (8 November 2026)

- Perbaikan lanjutan setelah review kode upload sosial: Story composer sebelumnya menggunakan variabel `storyInserted` tanpa deklarasi lokal. Setelah insert Story berhasil, strict-mode JavaScript dapat melempar ReferenceError dan masuk ke jalur error. Variabel kini dideklarasikan pada scope submit yang benar.
- Upload Story dan postingan kini menentukan MIME dari ekstensi file hanya bila browser Android tidak mengirim `file.type`; MIME yang terisi tetapi tidak diizinkan tetap ditolak. Format yang didukung: JPG, JPEG, PNG, WebP, GIF, MP4, WebM.
- URL pratinjau lokal direvoke saat file diganti dan setelah berhasil diterbitkan, untuk mengurangi penggunaan memori pada perangkat dengan RAM terbatas.
- Jika upload media berhasil tetapi penyimpanan record postingan/Story gagal, aplikasi mencoba menghapus file sementara agar tidak meninggalkan objek yatim di Storage.
- Batas ukuran tetap 50 MB untuk postingan dan Story. Belum dilakukan tes upload/playback Android; founder melakukan UAT perangkat nyata. Progress UI masih indikator tahap, bukan persentase byte upload yang akurat.
- Status: CODE UPDATED; BUILD/DEPLOY MENUNGGU workflow commit; ANDROID UAT MENUNGGU founder.
- Acceptance test founder: upload JPG/PNG/WebP, MP4, dan WebM; ganti file saat preview aktif; batalkan/gagal submit; cek postingan dan Story tampil setelah refresh; cek playback; lakukan pada jaringan seluler dan Wi-Fi.


## CP-030 — Explore discovery controls (8 November 2026)

- Explore kini menyediakan empat aliran: Untuk Anda, Mengikuti, Terbaru, dan Populer.
- Mengikuti hanya menampilkan postingan publik yang diterbitkan akun yang diikuti dengan status accepted, serta postingan pemilik akun sendiri. Permintaan follow yang masih pending tidak dianggap sebagai hubungan mengikuti.
- Semua aliran Explore hanya mengambil postingan dengan visibility public dan moderation_status published; konten privat atau belum dipublikasikan tidak sengaja dimasukkan ke discovery feed.
- Story strip Explore hanya menampilkan Story publik yang belum kedaluwarsa. Story privat tetap tidak dipromosikan di Explore.
- Filter berupa segmented horizontal rail yang dapat digeser pada layar sempit; pilihan filter dipertahankan saat halaman Explore dirender ulang dalam sesi aplikasi.
- Status: FRONTEND CODE UPDATED; build/deploy menunggu workflow; UAT perangkat Android dan pengujian dua akun menunggu founder. Filter Mengikuti memerlukan relasi follow berstatus accepted.
- Acceptance test: (1) akun A mengikuti akun B dan B menerima; posting publik B muncul di filter Mengikuti A; (2) akun C yang tidak diikuti tidak muncul; (3) pending follow tidak muncul; (4) posting private tidak muncul di aliran publik; (5) Terbaru dan Populer mengubah urutan; (6) tab dapat digeser dan ditekan pada HP.


## CP-031 — Media campuran, editor postingan, dan Reels (8 November 2026)
- Maksimal 15 foto/video campuran per postingan. Caption, tag, dan audiens dapat diedit. Media yang sudah terbit tidak dapat diganti; hanya bisa dihapus satu per satu. Tidak ada penambahan media setelah terbit.
- Reels untuk video tunggal maksimal 60.000 ms; video lebih dari 60.000 ms tidak masuk Reels. Video dalam carousel campuran tetap bagian postingan, bukan Reels terpisah.
- Tabel `post_media` menyimpan urutan, tipe, path, durasi, pemilik; RLS, backfill media lama, dan trigger batas 15. Frontend: multi-upload, preview, carousel, editor, hapus media, Reels vertikal dan satu video aktif.
- Belum UAT Android: batas 15/16, edit/hapus, video 60 detik dan >60 detik, privasi, autoplay.


## CP-032 — Reels ranking, filter, and build repair (8 November 2026)
- Fixed a literal escaped newline that caused Vite parse failure and blocked deployment; build must pass before claiming deployed.
- Reels has Untuk Anda, Mengikuti, and Terbaru filters. Candidate pool is public, published, single-video posts only, with measured duration >0 and <=60,000 ms.
- Ranking uses accepted-follow affinity, recency decay, and capped likes/comments as lightweight signals. This is an initial transparent ranking, not machine-learning or watch-time personalization; watch duration, skips, reports/hides, and creator diversity need dedicated event telemetry before use.
- Deleting media synchronizes the parent post's primary path and media type so stale references are not left behind.
- UAT still required on Android for autoplay, filters, mixed media carousel, edit/delete and duration boundaries.

## Catatan tata kelola ide — 8 November 2026
- Ide Pluits Official dan distribusi pengumuman universal dipindahkan ke IDEAS/IDEA-BACKLOG.md; bukan keputusan produk, bukan checkpoint implementasi, dan tidak masuk model bisnis aktif.
- Jangan membuat fitur, schema, UI, notifikasi, atau akun sistem dari ide backlog tanpa evaluasi dan persetujuan eksplisit founder.
- Model bisnis aktif hanya memuat keputusan yang sudah disetujui. Perubahan keputusan dicatat dengan tanggal, alasan, dampak, dan status.

## CP-033 — Homepage source cleanup, navbar icon, and mobile feed spacing (8 November 2026)

- Retired duplicate root entry point `main.js` and obsolete legacy homepage backup `src/main.backup.js`. The canonical entry remains `index.html` → `src/main.js` → `src/pages/home/index.js`.
- Fixed the literal navbar search-icon interpolation in `src/app/ui.js` so SVG markup is rendered instead of the raw `${icon.search}` text.
- Bumped the service-worker shell cache from `pluits-shell-v1` to `pluits-shell-v2` so installed clients discard the previous shell cache during activation.
- Adjusted mobile home bottom padding to match the fixed navigation height and safe-area inset, removing the extra visible gap while preserving scroll clearance for the final feed content.
- Evidence: code commits `35e53b7`, `d5483b4`, `2ebb5a6`, `29939c2`, `558ecf7`, and final mobile-spacing correction `3b18a76`.
- GitHub Pages workflow run `42475956080` for commit `3b18a76e0444919693430c6dcd262612d6764905`: **SUCCESS**; Vite build, output verification, artifact upload, and Deploy to GitHub Pages all completed successfully.
- **Status:** IMPLEMENTED + DEPLOYED. Android visual UAT remains pending; founder should verify the navbar icon and the end-of-feed/bottom-navigation spacing on the live Pages link.


## CP-034 — Correct public-home navigation wiring and remove remaining legacy backups (8 November 2026)

- Audit found the previous navbar-icon correction targeted the marketplace header in `src/app/ui.js`, while the public homepage had separate hard-coded navigation in `src/pages/home/index.js`. Therefore that correction did not change the homepage navigation being viewed by the founder.
- Rewired the public homepage to use the shared social navigation component in `src/components/social/navigation.js`. Desktop links and the mobile navigation are now rendered from the shared component rather than duplicate inline markup.
- Mobile navigation uses the shared SVG icon set (Beranda, Jelajah, Buat, Reels, Profil) instead of text glyphs.
- Removed the unused legacy stylesheet `src/style.backup.css` and backup icon module `src/components-backup/common/icons.js`. Neither file was imported by the active application entry chain.
- Canonical route remains `index.html` → `src/main.js` → `src/pages/home/index.js`; account navigation retains its existing rendering path.
- **Status:** IMPLEMENTED + DEPLOYED. GitHub Actions run `42476646765` for commit `f0e176e926b57bee05b9784e4b4c5836db4d2e5a` completed successfully; Vite build, output verification, artifact upload, and Deploy to GitHub Pages all succeeded. The deployed Pages artifact contains the modular navigation bundle `assets/index-YeGyxrWa.js` and the SVG navigation component markers. Android visual UAT remains NOT TESTED until the founder checks the live site.


## CP-035 — Perbaikan fungsi postingan: edit, hapus, like, dan double-tap (8 November 2026)

- **Masalah yang dilaporkan founder:** menu edit postingan tidak bekerja dengan semestinya; interaksi gambar belum memiliki double-tap untuk memberi Love/Like.
- Memperbaiki alur editor agar menu ditutup, panel editor langsung terlihat dengan status memuat, error ditampilkan di dalam panel, dan pengguna dapat mencoba ulang jika pemuatan gagal.
- Form edit kini memuat caption, hashtag, visibilitas publik/privat, media saat ini, hapus media, tambah media, dan simpan perubahan. Update tetap dibatasi pada pemilik postingan melalui filter user ID dan RLS.
- Menambahkan tindakan hapus postingan pada menu titik tiga untuk pemilik. Penghapusan meminta konfirmasi, menghapus record postingan, lalu membersihkan file media terkait dari Storage.
- Tombol Like diperbarui tanpa memuat ulang seluruh halaman; status hati dan jumlah suka diperbarui setelah operasi database berhasil.
- Menambahkan double-tap pada gambar di feed dan galeri foto untuk memberi Like, disertai animasi hati. Double-tap tidak membatalkan Like yang sudah aktif.
- Mempertahankan komentar, bagikan, simpan, dan penandaan akun yang sudah ada.
- File utama: `src/pages/account/index.js`, `src/pages/account/user-account.css`. Kebijakan RLS yang ada mengizinkan pemilik memperbarui/menghapus postingan dan menghapus media miliknya; tidak ada migration database baru pada checkpoint ini.
- **Status:** IMPLEMENTED + DEPLOYED. GitHub Actions run `42477511469` untuk commit `146111aa97857094159cbe92aada8e15340a5384` berhasil pada seluruh langkah: install, build Vite, verify build output, upload artifact, dan deploy Pages. Artefak produksi `assets/index-CdQidmbD.js` dan `assets/index-CJBTnwHt.css` diperiksa dan memuat kode editor, hapus postingan, pointer double-tap, serta animasi hati. Pengujian klik nyata, double-tap di Android, dan uji dua akun belum dilakukan; status TESTED/ACCEPTED tetap terbuka.


## CP-036 — Database performance dan RLS initialization pass (8 November 2026)
- **Status:** IMPLEMENTED + DEPLOYED; verifikasi advisor tercatat.
- Menambahkan 30 covering indexes untuk foreign keys Social, Marketplace, Store, Messaging, dan Moderation; mengoptimalkan tiga RLS policies tanpa mengubah predicate otorisasi.
- Verifikasi saat checkpoint: seluruh 30 indeks ada; Performance Advisor tidak melaporkan unindexed_foreign_keys atau auth_rls_initplan; Health Advisor tanpa lint.
- GitHub Pages run #668 sukses pada commit `4a878b88d3c9805921d7a51f23515e91bdd8c642`.
- Snapshot warning saat itu: 20 SECURITY DEFINER advisor warnings dan leaked-password protection nonaktif. Periksa audit terbaru sebelum bertindak.

## CP-037 — Marketplace RLS policy consolidation (8 November 2026)
- **Status:** IMPLEMENTED + DEPLOYED; direct runtime/UAT belum lengkap.
- Migration live `20261108161000_pluits_marketplace_rls_policy_consolidation` mengganti overlapping SELECT policies pada products, product_variants, product_images, stores; memisahkan INSERT/UPDATE/DELETE member policies.
- Verifikasi pascamigrasi: empat multiple_permissive_policies warnings hilang; Performance Advisor tidak melaporkan WARN; Health Advisor tanpa findings.
- Security Advisor saat itu masih melaporkan 20 authenticated-callable SECURITY DEFINER RPCs dan leaked-password protection nonaktif. Ini bukan sertifikasi keamanan.
- Workflow #670 sukses untuk commit `f379083fccaec8a18aaed616be25c646f4fc779e`; dokumentasi lanjutan workflow #671 sukses.
- Masih wajib: buyer/seller dua akun, negative cross-store read/write, Android upload/playback, seller verification, end-to-end order/payment/fulfilment.

## Sumber tunggal roadmap
Mulai 8 November 2026, dokumen ini adalah satu-satunya roadmap implementasi, checkpoint, deployment, dan UAT Pluits. Dokumen `docs/pluits/PRODUCT-ROADMAP.md` telah digabungkan dan tidak lagi menjadi roadmap aktif.


## CP-038 — Konsolidasi model bisnis dan penghapusan alur legacy (8 November 2026)
- **Status:** DOCUMENTATION + ROUTER + LEGACY MODULE CLEANUP IMPLEMENTED + DEPLOYED; Android UAT NOT TESTED.
- Business Model Master kini satu-satunya sumber keputusan aktif. Bagian aktif adalah 1 dan 23–30; bagian 2–22 dipindahkan utuh ke arsip non-authoritative agar sejarah tetap ada tanpa menjadi instruksi aktif.
- Dokumen Master Product Vision dan Product Roadmap duplikat telah digabungkan ke sumber kanonis, lalu dihapus. CP-036 dan CP-037 dipindahkan ke roadmap kanonis.
- Menambahkan AI Governance & Change Control, memperbaiki urutan AI Start Here agar AI membaca Business Model Master sebelum spesifikasi lain, memperbarui Documentation Map, dan menambahkan alur penangkapan temuan ke Idea Backlog.
- Memperbaiki URL/repository references di dokumen audit, backend, Supabase, dan UAT ke Pluits.
- Router tidak lagi memuat page factory dan halaman demo material/product/cart/checkout/orders/wishlist/provider/project/driver/partner/tracking. Route pencarian menggunakan social discovery; rute cart/checkout/orders lama dialihkan ke Marketplace; provider/jasa ke GeoDirectory; delivery ke konteks fulfillment Marketplace.
- Menghapus source modules/data demo: app/page-factory.js, app/services.js, app/store.js, data/catalog.js, data/marketplace.js, dan halaman cart/category/checkout/orders/product/provider/project/operations/tracking/wishlist. Shared shell dan riwayat tempat dibersihkan dari localStorage demo; riwayat tempat memakai backend.
- Menghapus shortcut pengiriman sebagai produk mandiri; pengiriman tetap opsi fulfillment toko/Marketplace. Wallet ditandai staged, bukan layanan uang operasional.
- **Gap P1:** cart Marketplace masih localStorage dan belum sinkron lintas perangkat; granular staff permission enforcement belum terverifikasi. **Gap P2:** Supabase client belum dipusatkan/dipin; tidak ada automated test/lint script; repository masih PUBLIC; Android UAT dan full end-to-end masih harus dilakukan.
- Laporan audit: docs/pluits/BUSINESS-FRONTEND-BACKEND-ALIGNMENT-AUDIT-2026-11-08.md.
- **Deployment evidence:** GitHub Actions run #855, commit `f17da4e5e5321d67049ae3fa4516e706538328ad` — Vite production build, output verification, Pages artifact upload, dan Deploy to GitHub Pages seluruhnya SUCCESS. [Workflow #855](https://github.com/baguskristiansianturi/pluits/actions/runs/42481508462).
- Jangan menyatakan fitur production-ready atau ACCEPTED sebelum UAT nyata berhasil.


## CP-039 — Live production hardening and regression gate (8 November 2026)

- **Status:** BACKEND PERMISSION MIGRATION APPLIED + MIGRATION FILE COMMITTED + CI REGRESSION GUARD ADDED; Pages deploy pending verification; Android UAT NOT TESTED.
- Founder confirmed Pluits is published and has a registered account. Treat all existing user/account data as production data. No account data was inspected or altered.
- Applied Supabase migration `20261108132935_enforce_store_member_permission_grants`; committed matching migration SQL.
- Owner permissions remain intact. Non-owner staff write access to catalog/media and store settings/operating hours/delivery zones now requires explicit `permission_grants` JSON booleans. Active members retain read access.
- Rollback-only helper tests: owner allowed; non-member denied; explicit catalog grant allowed; missing settings grant denied. No test mutations were committed.
- Live RLS policy inspection confirms permission-aware write checks. Full authenticated REST/Storage negative tests with separate accounts remain NOT TESTED. Staff invitation UI remains blocked.
- Added `scripts/verify-production-surface.mjs`, `npm test`, `npm run verify:production`, and a CI step before Vite build to prevent retired demo modules from re-entering and to check Marketplace/Trip backend contracts.
- Marketplace cart remains localStorage-only; server persistence/guest merge remains P1. No cart data was touched.
- Latest live advisors: 20 SECURITY DEFINER warnings, 1 leaked-password-protection warning, 84 informational unused-index notices, 0 health lints.
- **Release gates:** verify latest Pages workflow including test step; implement server cart with merge and live price/stock refresh; review SECURITY DEFINER RPCs; enable leaked-password protection; run owner/staff and two-account API tests; complete Android UAT.
- **Deployment URL:** `https://baguskristiansianturi.github.io/pluits/` (use latest successful workflow commit once confirmed).


### CP-039 addendum — Permission matrix completed at SQL helper/RPC layer

- Applied `20261108133221_align_marketplace_rpcs_with_store_permission_grants` and committed matching migration SQL.
- `private.has_store_permission` now maps roles consistently: owner all; manager catalog/settings/orders/payments; catalog only catalog; orders only orders; accounting only payments; staff explicit grants only.
- Product publishing, order fulfilment and payment review RPCs now use that same helper as table RLS.
- Rollback-only permission matrix tests passed for all role presets and cross-permission denial cases.
- Real-account REST/Storage authorization tests and staff grant UI remain NOT TESTED / NOT IMPLEMENTED. Existing owner data was restored by transaction rollback.


### CP-039 addendum — RLS policy overlap cleanup

- Applied `20261108133402_split_store_permission_write_policies_by_action`; matching migration SQL committed.
- Split permission-aware writes into INSERT/UPDATE/DELETE policies, preserving separate read policies.
- Supabase advisor recheck cleared the 7 multiple-permissive-policy notices caused by the initial `FOR ALL` write policy design.
- Current advisor snapshot: 20 SECURITY DEFINER WARN, 1 leaked-password protection WARN, 84 unused-index INFO, 0 health lints.


### CP-039 addendum — Vite demo and orphaned legacy modules removed

- Deleted unused `src/counter.js` and unused `vite.svg` / `javascript.svg` starter assets.
- Deleted old unreferenced `src/pages/auth/index.js`, which still contained fake localStorage login/logout and “AKUN BAGUS” copy with an explicit “backend later” message.
- Deleted unreferenced logistics/material/property/service wrappers that depended on already-retired demo modules, plus redundant promo/not-found/search wrappers.
- Expanded the CI production-surface guard to block these files and old BLD/Bagus runtime markers from returning.
- Active router/main entry were inspected before deletion; no active route imports these files.


### CP-039 addendum — Legacy master-data module archived and removed

- Verified no active imports of `src/data/master-data.js`.
- Preserved its historical category/taxonomy reference as sanitized plain text in `docs/pluits/archive/legacy-master-data.snapshot.txt`; this archive is non-runtime and non-authoritative.
- Removed the old JavaScript module from `src/data`; CI now fails if it is reintroduced or imported.
- Old fulfillment/payment/commission/order rules and demo location data in the archive are not Pluits requirements and must not be revived without explicit founder approval.


### CP-039 final deployment evidence — 8 November 2026

- **Latest tested commit:** `b9f6bdf3553b17c56036ba0b372de02fb5fdd221`.
- **GitHub Actions run:** #897 / `42486221382` — SUCCESS.
- **CI checks:** production-surface regression test, Vite production build, build-output verification, Pages artifact upload, and Pages deployment all succeeded.
- **Live test URL:** `https://baguskristiansianturi.github.io/pluits/?v=b9f6bdf`.
- **Status:** IMPLEMENTED + DEPLOYED. Founder Android/mobile UAT and real owner/staff REST tests remain NOT TESTED / NOT ACCEPTED.


## CP-040 — Social-first production hardening and founder UAT scope (8 November 2026)

- **Founder decision:** Pluits is already published and has a registered account. Treat it as production, not demo/prototype. Social Media is P0; Café, Resto, Marketplace expansion and other experience verticals wait until Social Media passes founder UAT.
- **Canonical spec:** `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md`. It defines core social journeys, privacy/security acceptance, offline DM boundaries, notification types, music rights and FYP integrity, settings, responsive testing and release gate.
- **DM implementation:** `src/pages/messages/index.js` now has follow-contact list, username search, inbox, Supabase realtime message subscription, cached contact/thread metadata, device-local outbox, reconnect retry and idempotent `client_message_id`. This is not offline server delivery; new conversations and remote history require a network. Android/offline/two-account UAT NOT TESTED.
- **Live DB migration:** `20261108135647_pluits_social_realtime_offline_message_queue` adds idempotency key, message/unfollow notifications, notification types and realtime publication for messages/follows/notifications. Live publication and columns verified. Matching migration SQL is committed.
- **Account settings:** `src/pages/account/security-settings.js` is a separate module for username, public/private profile, password update, phone OTP, TOTP MFA, language preference, location permission and native media picker. Language preference is persisted, but complete English translation is NOT IMPLEMENTED. Phone OTP depends on configured SMS provider; TOTP, Auth and real-account UAT NOT TESTED.
- **Language migration:** `20261108140017_pluits_account_language_preference` applied live and matching SQL committed.
- **Notification UI:** activity center recognizes follow request/new follower/accepted/unfollow/post like/comment/new message/system update. New message and unfollow event triggers are live. System announcement publishing/admin management, realtime activity refresh/badge and actual system notice content remain NOT IMPLEMENTED.
- **Icons:** professional SVG icon set expanded and account settings navigation now uses SVG icons.
- **Regression guard:** `npm test` now checks retired demo modules remain absent, Marketplace/Trip backend contracts, DM realtime/offline contracts, account security settings, and notification type mappings. GitHub Actions runs this before Vite build.
- **Music/FYP:** no licensed music catalog or production-grade FYP/viral recommendation algorithm exists. The current Reels ordering is a simple heuristic. Rights and ranking requirements are specified; do not import or copy commercial tracks.
- **Optional personal verification:** NOT IMPLEMENTED. Current verification schema only covers professional/store; no personal identity badge should be issued.
- **Responsive/performance:** responsive CSS exists; device matrix, Android media upload/playback, accessibility and measured performance remain NOT TESTED.
- **Release status:** implementation increment committed; deploy and CI must be verified on the latest head. Not yet accepted by founder. Do not label social release complete.


## CP-041 — Social core implementation increment (8 November 2026)

- **Business decision:** added section 31 to BUSINESS-MODEL-MASTER.md. Social Media is P0; other experience verticals wait for founder UAT acceptance.
- **Canonical acceptance:** MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md.
- **DM:** contact list from accepted follow graph, username search, inbox, Supabase realtime, cached contacts/thread metadata, offline device-local outbox (maximum 50), reconnect retry and idempotency. Server owns canonical message timestamps. No offline remote history/new-conversation creation. NOT TESTED on Android or two real accounts.
- **Notifications:** follow/unfollow, like, comment, new message triggers; activity page recognizes all event types and refreshes from realtime. New inbox notification routes directly to its conversation.
- **System information:** applied migration 20261108140823_pluits_system_announcements. Added published/draft/archived announcements, language, severity, expiry, RLS, per-user read receipts, moderator publisher in Moderation Center, and activity-center display/realtime refresh. Admin/moderator role UAT and user read receipt UAT NOT TESTED.
- **Account settings:** modular page with username, public/private, password, phone OTP, TOTP MFA, language preference, location permission, and native photo/video picker. Complete English localization, SMS provider, TOTP and real account flow NOT TESTED.
- **Icons and consistency:** settings hub now renders professional SVG icons from shared icon library; responsive styling added.
- **Music/FYP:** recorded IDEA-007 for licensed/original audio and responsible recommendations. No music library or production-grade viral/FYP recommender implemented.
- **Personal verification:** explicitly unavailable; no fake verification badge or application form.
- **CI:** production regression guard expanded for DM, settings, notifications and announcement publisher. Pages workflow runs npm test before Vite build.
- **Remaining P0 acceptance:** Android photo/video upload/playback; two-account RLS and social action tests; DM offline/reconnect; notifications; Auth/SMS/TOTP; device matrix, accessibility and measured performance. Founder UAT not yet accepted.


## CP-042 — Social-first production deployment verified (8 November 2026)

- **Exact deployed commit:** `cc49e07785022e3270af934038220fcde4616ae6`.
- **GitHub Actions:** run #940 / `42488945266` — SUCCESS.
- **Steps verified:** dependency install, production surface/backend regression checks, Vite build, output verification, Pages artifact upload, GitHub Pages deployment.
- **Live URL:** `https://baguskristiansianturi.github.io/pluits/?v=cc49e077`.
- **Live Supabase:** Health Advisor 0 lints. Realtime publication includes `user_follows`, `user_messages`, `user_notifications`, and `pluits_system_announcements`.
- **Not accepted yet:** deployment success is not founder UAT. Android real-media upload/playback, two-account social/DM, offline reconnect, MFA/SMS, admin announcements, mobile/tablet/desktop rendering, accessibility and measured performance remain NOT TESTED.
- **Next work order:** founder tests the social build and reports UI/UX findings; fix all P0 regressions; add global unread notification indicator; complete media and two-account authorization tests; implement licensed/original audio and evaluated FYP only after rights and ranking requirements are satisfied. Café/Resto/experience verticals remain paused until Social Media is accepted.


## CP-043 — System announcement security/performance refinement (8 November 2026)

- Applied and committed migrations `20261108141720_optimize_system_announcement_rls_and_indexes` and `20261108141753_centralize_system_moderator_rls_check`.
- Added the missing announcement creator FK index and centralized admin/moderator authorization in a private invoker helper.
- Supabase Performance Advisor now clears the announcement FK and four announcement RLS initplan warnings. Remaining 87 unused-index INFO notices are informational; no indexes were dropped.
- Health Advisor: 0 lints. Security Advisor: 20 authenticated-callable SECURITY DEFINER warnings and leaked-password protection warning remain.
- Database-only hardening does not change frontend behavior. The previous frontend deploy remains valid; repository CI/deploy is triggered by the matching migration/docs commits.


## CP-044 — Inbox-first mobile navigation and offline new-DM drafts (8 November 2026)

- **Mobile navigation:** restored a compact sticky top header with direct Inbox and Activity shortcuts; retained a five-item bottom navigation (Beranda, Jelajah, Buat, Reels, Profil). Desktop header now exposes Inbox and Activity. Activity displays an unread notification count.
- **Offline DM:** cached contacts can now be selected offline to draft a new conversation. The local outbox stores recipient ID and message; on reconnect Pluits creates the direct conversation, sends with idempotent client message ID, and avoids sending the local timestamp to the database. This remains device-local, not encrypted by Pluits, and not actual delivery while offline.
- **Regression checks:** CI verifies inbox/activity navigation and offline new-conversation draft/reconnect contracts.
- **UAT update:** founder checklist now includes creating a new DM draft offline, reconnecting, and confirming exactly one delivered message.
- **Latest frontend commit:** `a3d37290d65d0fa3205030caaab0ac5eb5161b26`.
- **GitHub Actions:** run #958 / `42489770125` — SUCCESS; regression checks, Vite build, output verification, artifact upload and Pages deployment all succeeded.
- **Live test URL:** `https://baguskristiansianturi.github.io/pluits/?v=a3d37290`.
- **Not yet accepted:** real Android interaction, two-account realtime delivery, offline new-conversation flow, and 320–1440 px device matrix remain NOT TESTED by founder. Do not call the Social Media release complete.


## CP-045 — Social navigation, live unread badges, and final deployment (8 November 2026)

- **Navigation UX:** mobile now uses a compact sticky header with direct Inbox and Activity actions, plus a five-item bottom navigation. Desktop exposes Inbox and Activity in the primary header.
- **Unread state:** global Activity badge updates from realtime social notifications and system announcements; the count includes both unread notification rows and unread active system notices.
- **Offline DM:** users can select a previously cached contact while offline and draft a new DM locally. Reconnect creates the conversation and sends with idempotent client ID. This is not actual delivery without internet; remote history cannot be fetched offline. Outbox is device-local localStorage and not encrypted by Pluits.
- **Regression tests:** added checks for offline new-conversation drafts, Inbox/Activity navigation, live unread badge refresh, and announcement counts.
- **Latest deployed commit:** `b556b1102764133a39f43155b0005480b1fc8121`.
- **GitHub Actions:** run #966 / `42490027415` — SUCCESS. Dependency install, production regression checks, Vite build, build-output verification, Pages artifact upload and deploy all succeeded.
- **Live URL:** `https://baguskristiansianturi.github.io/pluits/?v=b556b110`.
- **Remaining P0 UAT:** Android photo/video upload/playback; two-account likes/comments/follow/privacy/DM; new-DM offline draft/reconnect; notification recipients and system notice; SMS/TOTP; device widths 320–1440 px, accessibility and measured performance.
- **Not implemented yet:** licensed/original audio library and FYP ranking; full English localization; personal identity verification. These remain clearly identified as open work, not simulated features.
- **Founder acceptance:** NOT TESTED / NOT ACCEPTED. Keep Café/Resto/other experience verticals paused until Social Media is accepted.


## CP-046 — Responsive/design regression guard and final social deploy (8 November 2026)

- Expanded CI static regression checks for mobile/desktop navigation breakpoints, Android safe-area spacing, keyboard focus visibility, and shared Social design tokens.
- Latest deployed commit: `281c2fbc2e513f3206167462a490c6d4f3a09686`.
- GitHub Actions run #968 / `42490137616` — SUCCESS. Regression checks, Vite build, output verification, Pages artifact upload and deploy succeeded.
- Live URL: `https://baguskristiansianturi.github.io/pluits/?v=281c2fbc`.
- This CI guard verifies responsive CSS contracts; it does not replace real rendering tests on Android, iOS, tablet or desktop. Those device checks and measured speed remain NOT TESTED.


## CP-047 — Repository change-control, decision log, and SOP system (8 November 2026)

- **Gap found:** the short new-chat prompt required a Decision Log and SOP, but neither `MASTER/DECISION-LOG.md` nor a `SOP/` directory existed in the repository.
- **Implemented:** created an append-only founder Decision Log with the currently documented active decisions; created SOP index plus Product Change Control, Engineering Delivery, and Release/UAT procedures.
- **Governance synchronized:** updated `AGENTS.md`, `MASTER/AI-START-HERE.md`, `MASTER/PLUITS-AI-GOVERNANCE.md`, and `MASTER/DOCUMENTATION-MAP-AND-CHECKLIST.md` so new sessions must read and use these documents.
- **Process rule:** new founder sharing/ideas are recorded in the Idea Backlog; only explicit approval creates a Decision Log entry; approved business changes update Business Model Master and downstream specifications/roadmap. Decision history is append-only.
- **Baseline deployment before documentation changes:** commit `6ef528980dc8ba62c6eeb72b01f603cc4a5a6672`; GitHub Actions run #969 / `42490201110` — SUCCESS, all 10 steps including Pages deployment passed.
- **Founder UAT:** Social Media remains NOT ACCEPTED. Android real-media upload/playback, two-account social/DM, offline reconnect, notification recipient tests, SMS/TOTP and real-device matrix remain open.
- **Next:** add automated checks that protect post edit/delete/double-tap interactions and verify the new governance documents are present; then run the exact commit through CI/Pages.


## CP-048 — Canonical authenticated homepage feed (8 November 2026)

- **Gap:** logged-in users opening `#/` received a separate public feed without the full owner post menu/edit/delete, canonical comments, or double-tap like behavior.
- **Correction:** authenticated homepage sessions now mount the canonical account Explore feed; logged-out visitors retain the public read-only homepage feed.
- **Regression guard:** CI checks that the signed-in homepage routes to `mountUserAccount('explore')` and protects the post menu, edit/delete/save and double-tap like contracts.
- **Specification/audit:** updated `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md` and the frontend/backend alignment audit.
- **Implementation commit:** `23ccf6504b4ac426eaa91be8cdb63859d4d5d18f`.
- **GitHub Actions:** run #983 / `42492769040` — SUCCESS; production regression checks, Vite build, output verification, artifact upload, and GitHub Pages deployment passed for the exact implementation commit.
- **Founder UAT:** NOT TESTED on Android; founder verification of logged-in homepage, edit menu, media interactions and double-tap remains open. Social release remains NOT ACCEPTED.


## CP-049 — GitHub Pages retry artifact collision hardening (8 November 2026)

- **Incident:** GitHub Actions run #986 (`42492867706`) passed regression checks, Vite build, output verification, and artifact upload, but the Pages deploy step failed because a failed-job retry left two artifacts named `github-pages` in the same workflow run.
- **Root cause:** the workflow used the same fixed Pages artifact name across workflow attempts; retrying only the failed deploy job uploaded a second artifact with the same name.
- **Correction:** `.github/workflows/deploy.yml` now names the Pages artifact with both `github.run_id` and `github.run_attempt`, and passes the matching name to `actions/deploy-pages@v4`.
- **Process sync:** `IDEAS/IDEA-BACKLOG.md` now requires every approved idea to reference its D-XXX Decision Log entry and to update Business Model Master before roadmap delivery.
- **Verification:** GitHub Actions run #989 / `42493030423` — SUCCESS for commit `ac0f9f92a0b2b036deaa4d19b39da89baea54a31`; regression checks, Vite build, output verification, artifact upload, and GitHub Pages deployment all passed using the unique artifact name.
- **Status:** workflow retry-artifact collision fix IMPLEMENTED and DEPLOYED. This does not change the separate founder Android UAT status.


## CP-050 — Narrative-first business model, investor proposal, and technology blueprint (9 November 2026)
- **Status:** DOCUMENTED; audit read-only dilakukan; bukan checkpoint implementasi produk.
- **Founder direction:** cerita Ibu Nia dan masalah manusia menjadi fondasi model bisnis; familiar social UX menurunkan hambatan adopsi; GeoDirectory menghubungkan entitas nyata dan kehidupan lokal; dampak menjangkau personal, bisnis, profesional, organisasi, komunitas, dan lembaga publik; rollout dimulai dari Bali.
- **Deliverables:** Business Model Master Bagian 32; D-004; IDEA-010 untuk workflow organisasi/kontribusi/hiring/operasi yang perlu riset; investor proposal; business/product/technology blueprint; audit live; enam visual SVG.
- **Live audit snapshot:** 62 public tables dengan RLS aktif pada 62; 81 migration entries; 20 authenticated-callable SECURITY DEFINER warnings; leaked-password protection disabled; 84 unused-index INFO notices; Health Advisor 0 lints; 0 Edge Functions deployed. Supabase PostgreSQL 17.11 di ap-southeast-1.
- **Repository evidence:** head yang diperiksa 7831da1d3f3bb44d12c718a7d92dcf305709cf0a; frontend Vite/JavaScript; Supabase; Leaflet/OpenStreetMap; GitHub Pages workflow.
- **Product gate:** Social First Release tetap P0 sampai founder UAT diterima. Tidak ada persetujuan untuk membangun seluruh domain masa depan sekaligus.
- **Belum selesai:** budget, headcount, CAC/LTV, market sizing, unit economics, payment/legal, ROI, kantor regional, SLA sengketa, Android UAT, two-account UAT, dan bukti deploy terbaru.
- **Perubahan produksi:** tidak ada database, Auth, user data, frontend, atau payment changes. Dokumentasi saja.
- **Langkah berikutnya:** review isi model/proposal oleh founder; setelah disetujui, turunkan P0 Social UAT dan P1 GeoDirectory trust backlog ke spesifikasi acceptance dan delivery terpisah.


## CP-051 — Audit GeoDirectory trust, claims, and physical-presence integrity
- **Tanggal:** 9 November 2026.
- **Status:** AUDIT COMPLETE (read-only); remediation NOT STARTED.
- **Dasar model bisnis:** Business Model Master Bagian 32.4–32.6 dan 32.10–32.13. GeoDirectory harus menghubungkan peta dengan entitas/lokasi nyata, transparansi penyedia, klaim berotoritas, pelaporan lokasi salah, dan dukungan lokal.
- **Bukti live:** 9 tabel GeoDirectory; 4 entitas published (semuanya place/unclaimed); 0 claim rows. Detail: `docs/pluits/GEODIRECTORY-TRUST-AND-CLAIM-AUDIT-2026-11-09.md`.
- **Temuan utama:** GDT-01 RLS `directory_media` memakai kondisi tautologis `m.entity_id = m.entity_id` dan berpotensi melemahkan isolasi antar-entitas; GDT-02 klaim belum memiliki evidence upload/reviewer workflow yang terbukti; GDT-03 belum ada report-location UI; GDT-04 alamat/geometri belum membuktikan operasi fisik/pickup; GDT-05 data live belum cukup untuk menguji kepadatan direktori.
- **Tindakan:** jangan gunakan media GeoDirectory secara luas sebelum GDT-01 ditinjau dan diuji. Migration security baru memerlukan approval founder dan rollback plan; migration terapan tidak boleh diubah. Claim/review, report/dispute, dan field verification tetap berada pada tahap spesifikasi setelah Social First Release gate.
- **Prioritas delivery:** P0 Social First Release tetap tidak berubah. Isu RLS GDT-01 adalah security review terpisah yang harus ditangani sebelum ekspansi GeoDirectory.
- **Tes:** pemeriksaan SQL read-only dan source review. Tidak ada migration, perubahan RLS, upload, atau Android UAT. Claim review, report flow, cross-entity negative tests: NOT TESTED.
- **Next action:** lakukan security remediation plan untuk GDT-01, kemudian selesaikan P0 Social UAT tanpa memperluas scope vertikal.


## CP-052 — Business, product & technology blueprint
- **Tanggal:** 9 November 2026.
- **Status:** DOCUMENTED / SPECIFIED AT CONCEPT LEVEL; implementation remains governed by existing release gates.
- **Dokumen:** `docs/pluits/PLUITS-BUSINESS-PRODUCT-TECH-BLUEPRINT.md`.
- **Dasar:** Business Model Master Bagian 1, 23–32; Decision Log D-004. Narasi Ibu Nia menjadi awal, lalu diturunkan menjadi nilai stakeholder, journey, GeoDirectory, identitas, Business Center, algoritma, frontend/backend, teknologi, dan tahapan delivery.
- **Prinsip UX:** bawa kebiasaan media sosial visual yang familier; jangan memaksa pengguna seperti Ibu Nia belajar pola baru. Nilai tambah PLUITS adalah konteks dunia nyata dan ekosistem lokal, bukan salinan merek/aset Instagram.
- **Stack yang didokumentasikan:** Vite/JavaScript ES modules, GitHub Pages, Supabase PostgreSQL/Auth/Storage/Realtime, Leaflet/OpenStreetMap, PWA. Tidak ada penggantian stack yang disetujui.
- **Tahapan:** Social P0; security hotfix track 0S; GeoDirectory Trust Bali; Identity & Organizations; Business Center; Local Commerce; Trip; Creator/contribution finance; community/public services; regional expansion.
- **Batas:** dokumen ini bukan bukti fitur selesai. GDT-01 RLS issue masih memerlukan persetujuan untuk perubahan production dan negative tests. Social First Release tetap menunggu founder UAT.
- **Next action:** jalankan P0 Social audit/UAT dan susun remediation plan terisolasi untuk GDT-01; jangan mulai vertical expansion.


## CP-053 — Social privacy and release audit
- **Tanggal:** 9 November 2026.
- **Status:** READ-ONLY AUDIT COMPLETE; remediation NOT STARTED; founder UAT NOT ACCEPTED.
- **Dokumen:** `docs/pluits/SOCIAL-PRIVACY-AND-RELEASE-AUDIT-2026-11-09.md`.
- **Temuan utama:** SOC-01 child-row RLS comments/likes tidak memeriksa akses parent post; SOC-02 insert like/comment tidak konsisten dengan akses parent; SOC-03 block belum tampak ditegakkan pada user_posts read policy; SOC-04 media post privat berpotensi tidak terbaca oleh accepted follower.
- **Bukti:** live `pg_policies` read-only dan source `src/pages/account/index.js`, `src/pages/home/index.js`, `src/pages/messages/index.js`. Static code presence bukan bukti runtime.
- **Tindakan:** perbaiki dengan migration baru setelah approval security change dan rollback plan; jangan ubah migration terapan. Terapkan predicate akses parent yang konsisten untuk post/media/comments/likes/storage dan uji negative authorization dua akun.
- **Prioritas:** Social First Release tetap P0. Android real-media, two-account, DM reconnect, notification, settings, privacy, dan founder UAT tetap NOT TESTED/NOT ACCEPTED.
- **Tidak dilakukan:** tidak ada migration, policy change, data edit, atau deployment.
- **Next action:** susun remediation SQL dan test matrix untuk SOC-01–SOC-04; minta persetujuan sebelum menerapkan perubahan RLS production.


## CP-054 — RLS remediation candidate prepared
- **Tanggal:** 9 November 2026.
- **Status:** PREPARED / NOT APPLIED; staging validation and production remediation remain pending.
- **Dokumen:** `docs/pluits/RLS-REMEDIATION-PLAN-AND-SQL-2026-11-09.md`.
- **Scope:** SOC-01–SOC-04 (post visibility, child rows, block behavior, media/Storage) dan GDT-01 (directory media membership row binding).
- **Perubahan yang dirancang:** predicate canonical `private.can_view_post`, helper untuk legacy/gallery media path, RLS comments/likes/comment-likes/saves/media, Storage read, serta perbaikan empat policy directory_media.
- **Data impact:** candidate hanya mengubah fungsi/policy; tidak mengubah row, akun, post, komentar, pesan, atau file media.
- **Belum dilakukan:** tidak ada migration file yang dihasilkan melalui Supabase CLI, tidak ada staging branch karena Supabase meminta konfirmasi biaya untuk membuat branch, tidak ada DDL production, tidak ada deploy.
- **Gate berikutnya:** siapkan environment staging/disposable; review SQL + policy names/ACL; uji dua akun founder-controlled dan anon; jalankan Supabase advisors. Production hanya setelah test lulus dan rollback siap.
- **Prioritas:** Social P0 tetap. Jangan mulai ekspansi fitur sebelum privacy gate lulus.


### CP-055 — Social & Store UAT readiness audit (9 November 2026)
- **Status:** Audit snapshot diperbarui; release gate masih BLOCKED.
- **Scope:** Social Media, Seller Center, live RLS, Storage, Security Advisor, responsive source review.
- **Evidence:** `docs/pluits/SOCIAL-AND-STORE-UAT-READINESS-AUDIT-2026-11-09.md`.
- **Repository commit saat audit:** `ee05def9f4f03d66c9d961d4e325e3ec564d7978`; Pages run #1032 SUCCESS. Audit doc committed separately; docs-only deploy does not prove frontend UAT.
- **Live DB:** 62/62 public tables have RLS; SOC-01–04 and GDT-01 still confirmed in live policies; 20 authenticated-callable SECURITY DEFINER advisor warnings, leaked-password protection disabled; 84 unused-index INFO; health lints 0.
- **Seller findings:** PT/CV/UD-only form and RPC conflict with active business model; profile query omits `phone`, `public_area`, `description`; verification submit and several product/order action buttons lack handlers; online-sales UI attempts direct UPDATE on `stores` without an owner UPDATE policy; multi-store selector and branding upload are absent.
- **Database changes:** none. RLS remediation candidate remains NOT APPLIED TO PRODUCTION; no Supabase dev branch exists.
- **Tests:** static source/live policy inspection only. Android, two-account, store creation RPC, upload and end-to-end UAT remain NOT TESTED.
- **Next:** secure staging/cost approval → validate and test RLS remediation → align store business type across schema/RPC/UI → fix Seller Center → build/deploy exact SHA → founder UAT.


### CP-056 — Seller Center UAT usability and action wiring (9 November 2026)
- **Status:** Frontend patch IMPLEMENTED and DEPLOYED; Android UAT NOT TESTED.
- **Commit:** `e1a9d558bf9e3e6906e3b4837dfb9e8b6621b97c`.
- **GitHub Actions:** run #1043 (`42533355048`) SUCCESS; guard, Vite build, output verification, and Pages deploy passed.
- **Changes:** complete store profile fields loaded; store verification submit wired; product publish/archive and order/payment actions wired to guarded backend paths; direct online-sales UPDATE removed; multiple-store create/select flow added; Seller Center mobile navigation changed to two-row layout.
- **Database:** unchanged. SOC-01–04 and GDT-01 remain open; no staging branch.
- **Business alignment blocker:** PT/CV/UD-only store form/RPC/constraint still conflicts with the active model for UMKM/individual providers.
- **Not tested:** Android, real store creation, media upload, two-account permissions, verification review, and public storefront.
- **Next:** staging approval → RLS remediation tests → business-type migration and owner-guarded online-sales RPC → founder UAT.


### CP-057 — Universal store onboarding, Seller Center lifecycle and URL specification (9 November 2026)
- **Status:** BUSINESS DECISION RECORDED; TECHNICAL SPECIFICATION PREPARED; implementation NOT STARTED.
- **Decision:** D-005 — PT/CV/UD are not mandatory. Individuals, UMKM, family/home businesses, cooperatives and companies may register. A responsible owner and real physical/operational location must be verifiable; legal form is optional and distinct from operational type.
- **Specification:** `docs/pluits/SELLER-CENTER-STORE-LIFECYCLE-AND-URL-SPEC-2026-11-09.md`.
- **Live schema confirmation:** stores CHECK and create_store RPC still PT/CV/UD only; submit_store_for_verification still requires legal_name, phone, email and full_address. Frontend profile still forces legal_name. Do not test a non-PT/CV/UD store until migration is staged.
- **URL facts:** current storefront `#/shop/{username}`; current product route `#/market-product/{variant_id}` (not product UUID). Target stable IDs/slugs and branch/product/category routes are specified; custom domain is not live.
- **Dashboard target:** overview, profile/storefront, locations/branches, verification, catalog, inventory, orders, fulfillment/zones, operating hours, payments/reconciliation, reviews, staff/permissions, notifications, settings/security.
- **Database:** read-only inspection only. No production DDL or migration applied.
- **Next:** stage schema/RPC alignment (separate operational type from optional legal form; require verifiable physical location while preserving address privacy), reconcile directory_locations and store memberships, add owner-guarded online-sales RPC, then build branch/store/product URLs and Seller Center modules; test on staging and Android.


### CP-058 — Seller Center UX/UI source audit (9 November 2026)
- **Status:** source audit COMPLETE; implementation remediation NOT STARTED; browser/Android UAT NOT TESTED.
- **Dokumen:** `docs/pluits/SELLER-CENTER-UX-UI-STATIC-AUDIT-2026-11-09.md`.
- **Temuan P0:** PT/CV/UD-only constraint + RPC masih menolak UMKM/individu; legal name masih diwajibkan pada profil/verifikasi; alamat verifikasi belum dijelaskan terpisah dari area publik.
- **Temuan UX:** URL helper menunjuk ke `pluits.id/t/{username}` yang belum aktif; footer masih menyebut kebutuhan konstruksi; mobile nav touch target 36 px (<44 px); profil disimpan melalui dua RPC non-atomik; beberapa query belum membedakan error dari empty.
- **Responsive source review:** form one-column, dashboard responsive, content min-width dan safe-area bottom nav ditemukan; 320/360/390/430 px browser rendering dan Android keyboard/picker tetap NOT TESTED.
- **Live database:** read-only inspection mengonfirmasi constraint, RPC, dan verification requirements masih belum sesuai D-005. Tidak ada DDL/data/Auth changes.
- **Tidak dilakukan:** tidak ada perubahan frontend, browser rendering, Android test, staging branch, atau deployment fitur. GitHub clone lokal gagal karena runtime tidak dapat menjangkau GitHub; tool browser/device automation tidak tersedia.
- **Next:** staging approval → schema/RPC alignment dan negative tests → onboarding UX + location/privacy → dashboard modules → automated build → Android founder UAT.


### CP-059 — Social Media frontend-first, Trust & Safety, dan Help Center (10 November 2026)
- **Rujukan:** D-006; Business Model Master Bagian 33.
- **Tujuan:** pisahkan model bisnis, SOP, frontend, dan kontrak backend agar Social Media dapat diuji tanpa membangun backend terlalu jauh sebelum journey stabil.
- **Dokumentasi:** model bisnis Bagian 33; SOP Social Content & Trust Operations; Social Content Trust Technical Spec; draft internal Privacy/Terms/Community Guidelines.
- **Frontend tahap pertama:** Help Center responsif dengan pencarian, kategori, artikel, deep link, status ketersediaan, serta halaman status dokumen Terms/Privacy/Guidelines.
- **Frontend berikutnya:** report/appeal, profil Hero/feed layout, Draft privat, immersive media, Explore/Top 10, inbox privacy/online presence, dan media protection UI. Jangan tampilkan kontrol palsu.
- **Backend preparation:** state machine moderation/report/appeal/copyright claim, media provenance/fingerprint, music rights per wilayah, watermark delivery, identity verification, business link quota, inbox relationship policy, online presence, dan audit trail.
- **Tidak dilakukan:** production DDL/migration, perubahan RLS/Storage, AI detector, fingerprint service, screenshot enforcement, copyright takedown automation, watermark pipeline, account auto-deletion, atau pesan baru.
- **Status awal:** Help Center frontend IMPLEMENTED dalam commit ini; build/deploy menunggu workflow; browser/Android UAT NOT TESTED; founder acceptance NOT ACCEPTED.
- **Batas:** penghapusan otomatis akun setelah 12 bulan tidak aktif tetap belum disetujui.
- **Next:** tunggu Pages workflow, uji Help Center dari Android, lalu lanjutkan frontend social core berdasarkan UAT tanpa mengubah area non-social.


### CP-060 — Verifikasi deployment Help Center dan status UAT (10 November 2026)
- **Commit:** 99c0246505a5347c32b8796e3c4e449e1108e7f4.
- **Workflow:** run 42665573505, #1088, conclusion SUCCESS.
- **Build:** production-surface verification SUCCESS; Vite production build SUCCESS; build output verification SUCCESS.
- **Deployment:** GitHub Pages deployment step SUCCESS untuk commit yang sama.
- **Frontend route:** https://baguskristiansianturi.github.io/pluits/#/help
- **Status:** IMPLEMENTED + DEPLOYED + BUILD TESTED. Browser runtime/Android UAT NOT TESTED; founder ACCEPTANCE NOT ACCEPTED.
- **Batas:** deployment berhasil bukan bukti seluruh fitur moderasi, report, banding, watermark, Top 10, atau pengaturan baru sudah bekerja.
