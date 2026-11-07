# PLUITS — MODEL AKUN & IDENTITAS
Versi 1.0 · 8 November 2026
Status: SPECIFIED — dasar implementasi bertahap.

## 1. Prinsip arsitektur

Pluits adalah platform sosial, marketplace, layanan, dan aktivitas ekonomi. Akun tidak boleh dikunci hanya sebagai pembeli atau penjual.

Keputusan rancangan: satu identitas login (satu Supabase Auth user) dapat memiliki beberapa konteks profil. Jenis profil tidak sama dengan role/izin operasional. Pengguna tidak perlu membuat login/password baru ketika ingin menjadi profesional atau mengelola bisnis.

Tiga jenis profil utama:
1. Personal
2. Professional
3. Business

Role seperti Buyer, Store Owner, Supplier Operator, Service Provider, Driver/Transport Partner, Host, Staff, Admin, Moderator, dan Support adalah izin/keanggotaan pada konteks yang sesuai, bukan jenis akun utama.

## 2. Perbandingan tiga profil

| Aspek | Personal | Professional | Business |
|---|---|---|---|
| Tujuan | Identitas individu dan aktivitas sosial | Reputasi individu berdasarkan keahlian, karya, atau jasa | Identitas toko, brand, perusahaan, organisasi |
| Pemilik | Satu orang | Satu orang/profesional | Entitas usaha/organisasi |
| Profil | Bio, avatar, lokasi publik opsional | Bio profesional, kategori, skill, pengalaman, portofolio, area layanan | Nama usaha, logo, kategori, deskripsi, lokasi/cakupan, jam operasional |
| Konten | Post, foto/video, Story, Reels | Karya, edukasi, portofolio, penawaran jasa | Konten brand, produk, layanan, pengumuman, promosi |
| Transaksi | Belanja, order, refund, ulasan | Inquiry, quotation, booking jasa, pendapatan profesional | Katalog, penjualan, pesanan, settlement |
| Analitik | Ringkasan aktivitas pribadi | Jangkauan, engagement, inquiry, performa portofolio | Kunjungan, leads, katalog, penjualan, performa toko |
| Privasi | Bisa publik atau privat | Halaman profesional publik; data privat tetap terlindungi | Halaman bisnis publik; data legal/rekening tetap privat |
| Verifikasi | Email/telepon; identitas untuk fitur berisiko | Identitas dan bukti keahlian sesuai kategori | Legalitas usaha, pemilik/otorisasi, rekening settlement |
| Tim | Tidak ada | Akses asisten opsional pada tahap lanjut | Multi-user dengan role berbeda |

### Personal
Dibuat otomatis saat pendaftaran. Menjadi identitas dasar pengguna. Mendukung profil publik/privat, follow, posting, Story/Status 24 jam, foto/video, Explore, belanja, wishlist, order, alamat, invoice, ulasan, chat, dan Pluits Balance. Pengguna dapat menautkan bisnis miliknya tanpa mengubah profil personal menjadi toko.

### Professional
Untuk freelancer, teknisi, tukang, konsultan, fotografer, kreator, instruktur, dan penyedia jasa individu. Memiliki kategori profesi, keahlian, pengalaman, portofolio, area layanan, ketersediaan, kisaran harga bila relevan, CTA hubungi/minta penawaran, inquiry, chat, quotation/booking, dan insight performa. Badge harus menjelaskan hal yang diverifikasi; jangan memberi kesan semua kemampuan dijamin Pluits.

### Business
Untuk toko, PT, CV, UD, brand, organisasi, dan entitas usaha sesuai kebijakan kategori. Memiliki halaman bisnis publik terpisah dari profil personal pemilik, katalog, harga/stok, order, promosi, ulasan, analitik, dan tim. Onboarding mencatat jenis badan usaha, nama legal dan publik, legalitas bila diwajibkan, alamat legal privat, lokasi/cakupan publik, kontak, rekening settlement, dan dokumen verifikasi. Membuat halaman bisnis tidak otomatis mengaktifkan penjualan; aktivasi menunggu verifikasi yang diperlukan. Satu pengguna dapat mengelola lebih dari satu bisnis sesuai aturan.

## 3. Satu login, beberapa konteks

Alur:
1. Daftar sekali → Personal Profile dibuat.
2. Dari Profil/Pengaturan pilih Buat Profil Profesional atau Buat Halaman Bisnis.
3. Profil/konteks tambahan tampil di account switcher.
4. Berpindah konteks tanpa logout atau password baru.
5. Postingan, chat, katalog, order, dan analitik dicatat pada konteks yang benar.
6. Identitas pemilik tetap terhubung untuk audit, keamanan, dan pemulihan.

Jangan mengubah profil personal secara destruktif saat mengaktifkan Professional atau Business. Buat entitas profil tambahan yang terhubung ke user yang sama.

## 4. Role dan permission

Model data konseptual:
- auth.users: identitas login.
- user_profiles: Personal Profile.
- professional_profiles: profil profesional milik user.
- stores: entitas Business yang sudah digunakan Pluits.
- store_members: hubungan user dengan bisnis dan role.
- profile_verification_cases: jenis verifikasi, status, bukti, reviewer, audit.
- business roles: owner, business_admin, catalog_manager, order_manager, finance, analyst, support_agent.

Jangan gunakan satu kolom role global untuk semua izin. Permission harus dibatasi berdasarkan resource dan business_id. Anggota bisnis hanya boleh mengakses data sesuai tugasnya.

## 5. Pengaturan profil dan konten

Sediakan satu pusat pengaturan untuk:
- Jenis profil dan account switcher.
- Privasi personal publik/privat.
- Audiens per posting/Story.
- Komentar, mention/tag, pesan, dan interaksi.
- Penempatan konten: profil personal, profesional, atau bisnis.
- Notifikasi, keamanan, sesi, dan blokir/laporan.

Form posting harus ringkas. Default audiens ditentukan dari pengaturan profil; pengguna dapat mengubah audiens per konten bila diperlukan.

## 6. Wallet / Pluits Balance

Wallet merupakan fasilitas lintas konteks, bukan akun login terpisah.
- Wallet personal untuk pembayaran, refund, dan saldo yang sah tersedia.
- Penghasilan profesional dan settlement bisnis harus memiliki sumber/ledger terpisah agar uang individu dan badan usaha tidak tercampur.
- Saldo dihitung dari ledger transaksi immutable, bukan diedit langsung.
- Top up, pembayaran, refund, komisi, pendapatan jasa, settlement, dan withdrawal adalah jenis transaksi terpisah.
- Setiap transaksi memiliki reference, amount, currency, status, timestamp, actor, dan sumber order/booking.
- Penarikan memerlukan rekening terverifikasi, pemeriksaan kepemilikan, status review, dan audit.
- Jangan menyebut saldo tersedia sebelum pembayaran/settlement terkonfirmasi.
- Payment provider, KYC, settlement, pajak, dan kepatuhan harus ditetapkan sebelum wallet menerima uang sungguhan.

## 7. Verifikasi

Personal: email/telepon; identitas tambahan hanya untuk fitur yang memerlukannya.
Professional: identitas + kategori; sertifikat/portofolio sesuai kategori.
Business: pemilik/otorisasi, legalitas (misalnya PT/CV/UD bila diwajibkan), data usaha, rekening, dan dokumen pendukung.

Status verifikasi: draft, submitted, under_review, verified, rejected, expired, suspended. Verifikasi profil tidak otomatis berarti semua transaksi/layanan aktif.

## 8. Matriks fitur

| Fitur | Personal | Professional | Business |
|---|---|---|---|
| Feed, Explore, follow, like, comment | Ya | Ya | Ya |
| Story/Status 24 jam | Ya | Ya | Ya |
| Profil privat | Ya | Tidak untuk halaman profesional publik | Tidak untuk halaman bisnis publik |
| Keahlian/portofolio | Opsional | Utama | Profil brand/layanan |
| Katalog produk | Simpan/favorit | Jika relevan | Utama |
| Jual barang | Perlu Business/store approval | Tidak otomatis | Setelah verifikasi |
| Tawarkan jasa | Upgrade Professional | Ya | Ya |
| Pesanan pembelian | Ya | Ya | Ya melalui anggota |
| Kelola order penjualan | Tidak | Sesuai izin layanan | Sesuai role |
| Analytics | Ringkasan | Insight profesional | Analytics bisnis |
| Kelola tim | Tidak | Opsional | Ya |
| Wallet | Personal | Ledger pendapatan profesional | Ledger settlement bisnis |

## 9. Perbandingan platform dan pelajaran

- Instagram: memisahkan personal dari professional; professional dibagi Creator dan Business sesuai tujuan pengguna.
- TikTok: membedakan Personal, Business, dan Organization; alat bisnis dan akses komersial disesuaikan dengan jenis akun.
- LinkedIn: Company Page dikelola melalui profil individu; admin mendapat role masing-masing, bukan berbagi password halaman.
- Rekomendasi Pluits: satu login manusia, profil Professional untuk individu penyedia keahlian/jasa, halaman Business untuk entitas usaha, dan membership/permission untuk tim. Model ini menggabungkan fleksibilitas sosial dengan kontrol bisnis.

## 10. Tambahan yang masuk roadmap

1. Account switcher Personal / Professional / Business.
2. Pusat pengaturan profil dan audiens konten.
3. Professional onboarding, portofolio, area layanan, inquiry dan quotation.
4. Business onboarding, dokumen, verifikasi, aktivasi, dan halaman publik.
5. Business team invitations dan permission matrix.
6. Public business landing page dengan username/slug, katalog, jasa, ulasan transaksi terverifikasi, jam, cakupan, CTA internal Pluits.
7. Chat/inbox yang jelas konteks penerimanya.
8. Analytics per profil.
9. Wallet ledger, payment references, refund, settlement, withdrawal, audit.
10. Badge verifikasi yang menjelaskan cakupan.
11. Moderation, report, block, appeal, dan audit log.

## 11. Urutan implementasi

P0 — Fondasi identitas: pertahankan Supabase Auth dan user_profiles personal; gunakan stores/store_members untuk Business; tambahkan professional_profiles, profile_verification_cases, account_context_preferences; definisikan RLS; buat account switcher dan pengaturan jenis profil.

P1 — Aktivasi profil: professional onboarding, portofolio, business onboarding, status verifikasi, halaman bisnis, dan role management. Hubungkan Seller Center dengan konteks Business.

P2 — Sosial dan komersial: feed/Story mengikuti konteks profil, ulasan pembelian terverifikasi, chat/inquiry/quotation/booking, analytics.

P3 — Uang: ledger immutable, payment provider, settlement, withdrawal, rekening terverifikasi, audit. Jangan aktifkan pencairan uang sungguhan sebelum pengujian dan kepatuhan selesai.

## 12. Status backend setelah fondasi 8 November 2026

- `professional_profiles` dan `professional_portfolio_items` sudah dibuat di Supabase dengan RLS pemilik dan pembacaan publik hanya untuk profil aktif/publik.
- `account_context_preferences` menyimpan konteks aktif Personal/Professional/Business dan memvalidasi akses ke toko melalui owner/anggota aktif.
- `profile_verification_cases` menerima pengajuan verifikasi profesional/toko; pemohon tidak dapat mengubah status review atau menetapkan dirinya verified. Keputusan reviewer harus dilakukan melalui jalur admin tepercaya.
- Entitas Business tetap menggunakan tabel `stores` yang sudah ada; keanggotaan tim tetap menggunakan `store_members`. Tidak dibuat tabel bisnis duplikat.
- Migrasi sumber disimpan sesuai dua versi yang tercatat di Supabase: `20261107172444_pluits_profile_context_foundation.sql` dan `20261107172504_pluits_profile_context_rls_tuning.sql`.
- Status: backend schema/RLS IMPLEMENTED dan pemeriksaan tabel/policy berhasil. Frontend switcher/onboarding belum IMPLEMENTED/DEPLOYED/TESTED.

## 13. Status aktual sebelum fondasi ini dibuat

- Frontend sudah memiliki user_profiles, postingan, Explore, likes/comments/saves/tags, alamat, dan autentikasi dasar.
- Tabel user_stories 24 jam disiapkan; UI upload/viewer belum terverifikasi selesai.
- Tabel wallet_accounts dan wallet_requests dibuat untuk permintaan manual; belum ada wallet ledger dan belum siap payment/settlement produksi.
- Status pekerjaan harus dibedakan: PROPOSED → DECIDED → SPECIFIED → IMPLEMENTED → DEPLOYED → TESTED → ACCEPTED.
