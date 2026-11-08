# PLUITS — PROJECT STATUS, CHECKPOINTS & ROADMAP

**Perusahaan:** Pluits Indonesia  
**Produk:** Pluits  
**Repository:** https://github.com/baguskristiansianturi/bagus-load-delivery  
**Branch:** `main`  
**Dokumen model bisnis:** [BUSINESS-MODEL-MASTER.md](./BUSINESS-MODEL-MASTER.md)  
**Dokumen ini:** sumber status implementasi, checkpoint, dan PR; bukan pengganti model bisnis.

> **Aturan kerja:** jangan menimpa sejarah checkpoint. Tambahkan entri baru. Pisahkan status dokumentasi, kode, database, deployment, dan pengujian. "Selesai" hanya jika ada bukti. Pada awal sesi baru, baca dokumen model bisnis ini, dokumen status ini, spesifikasi teknis terkait, lalu verifikasi repo/backend sebelum mengerjakan PR.

## 1. Ringkasan kondisi proyek

| Area | Status terakhir yang diketahui | Catatan |
|---|---|---|
| Identitas Pluits | Ditetapkan | Produk Pluits, perusahaan Pluits Indonesia; terpisah dari Bagusin dan Bali Trans |
| Repository dan branch | Ada | `baguskristiansianturi/bagus-load-delivery`, `main` |
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
- **URL akun:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/register
- **URL profil:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/profile
- **URL Explore:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/explore
- **URL alamat:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/addresses
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
- Confirmed the application repository is `baguskristiansianturi/bagus-load-delivery`, Vite frontend, branch `main`.
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
