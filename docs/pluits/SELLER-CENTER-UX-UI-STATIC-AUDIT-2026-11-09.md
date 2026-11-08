# PLUITS — Seller Center UX/UI Static Audit
**Tanggal:** 9 November 2026  
**Repository:** baguskristiansianturi/pluits · branch main  
**Commit yang diperiksa:** df58ff1e3abb7b1f5837dff6c3feb4bc960c08f2  
**Modul:** `src/pages/seller/index.js`, `src/pages/seller/seller.css`, live Supabase schema/RPC  
**Jenis pemeriksaan:** source review + read-only schema inspection. Bukan browser rendering test atau Android UAT.

## 1. Kesimpulan
Seller Center sudah mempunyai workspace dasar, autentikasi, multi-store selector, ringkasan, produk, kategori, persediaan, area layanan, profil, pengaturan, pesanan, dan beberapa aksi backend. Namun alur universal store onboarding yang diputuskan pada D-005 belum dapat dinyatakan siap.

**Status:** UX/UI source audit COMPLETE; implementation remediation NOT STARTED; browser/device UAT NOT TESTED; founder acceptance NOT ACCEPTED.

Tidak ada perubahan source frontend, database, Auth, Storage, atau data produksi pada audit ini.

## 2. Temuan prioritas

| ID | Prioritas | Temuan | Dampak pengguna | Perbaikan yang diperlukan |
|---|---|---|---|---|
| SCUX-01 | P0 | Form onboarding hanya menerima PT/CV/UD; live CHECK constraint dan RPC `create_store` juga hanya menerima tiga nilai tersebut. | Individu, UMKM dan usaha keluarga tidak dapat mendaftar sesuai keputusan D-005. | Pisahkan kategori operasional dari bentuk legal opsional pada schema, RPC dan UI. Uji backward compatibility. |
| SCUX-02 | P0 | Profil mewajibkan `legal_name`; RPC pengajuan verifikasi juga mewajibkan legal name, phone, email dan full address. | Pendaftaran individu/UMKM tanpa nama legal perusahaan tidak dapat menyelesaikan verifikasi. | Definisikan persyaratan berbasis kategori; legal form/name opsional kecuali diwajibkan kategori atau hukum. |
| SCUX-03 | P0 | Alamat lengkap hanya menjadi syarat pada tahap submit; form belum menjelaskan pemisahan alamat verifikasi privat dengan area publik. | Pengguna dapat ragu memasukkan alamat rumah atau salah mengira alamat lengkap akan dipublikasikan. | Jelaskan penggunaan alamat untuk verifikasi, simpan akses privat, tampilkan hanya locality/area yang memang dipilih publik. |
| SCUX-04 | P1 | Petunjuk URL onboarding menyebut `pluits.id/t/{username}`. | Pengguna menerima alamat yang belum aktif dan format yang tidak cocok dengan route saat ini. | Tampilkan preview rute aktif `https://baguskristiansianturi.github.io/pluits/#/shop/{username}`; ganti hanya setelah route/domain target benar-benar live. |
| SCUX-05 | P1 | Footer Seller Center menyebut “Platform perdagangan dan kebutuhan konstruksi”. | Tidak konsisten dengan Pluits sebagai ekosistem sosial dan lokal lintas kategori. | Ganti copy menjadi deskripsi Pluits yang netral dan sesuai Business Model Master. |
| SCUX-06 | P1 | Bottom navigation mobile memiliki delapan tombol dalam grid empat kolom dan dua baris; CSS menetapkan tinggi minimum 36 px. | Target sentuh lebih kecil dari standar 44 px dan label dapat terasa padat pada Android kecil. | Pertahankan akses cepat untuk bagian utama; kelompokkan bagian administratif ke “Lainnya”; target sentuh minimum 44 px. |
| SCUX-07 | P1 | Simpan profil menjalankan `update_store_profile` dan `update_store_verification_details` secara berurutan. | Jika RPC kedua gagal, sebagian data telah tersimpan tanpa hasil keseluruhan yang atomik. | Sediakan RPC atomik setelah kontrak backend disepakati; sebelum itu tampilkan status partial-save secara eksplisit dan muat ulang data kanonis. |
| SCUX-08 | P1 | Error pada beberapa query kategori, area layanan, dan ringkasan belum dibedakan konsisten dari kondisi kosong. | Gangguan jaringan/izin dapat terlihat seperti toko belum memiliki data. | Bedakan loading, empty, error, retry dan success untuk setiap panel. |
| SCUX-09 | P1 | Belum ada UI cabang/lokasi, jam operasional, branding upload, review, staf/role, dan notifikasi Seller Center. | Dashboard belum memenuhi lifecycle toko multi-lokasi yang dispesifikasikan. | Bangun bertahap dengan prioritas lokasi utama/cabang dan profil toko; jangan tampilkan tab yang belum berfungsi. |
| SCUX-10 | P2 | Label status menggunakan nilai teknis database seperti `pending_review` / `unverified` di sebagian tampilan. | Pemilik toko awam tidak selalu memahami arti status dan tindakan berikutnya. | Gunakan label bahasa Indonesia dan penjelasan “apa artinya / apa yang perlu dilakukan”. |

## 3. Pemeriksaan responsive dari source

| Area | Bukti source | Hasil source review |
|---|---|---|
| Form | Breakpoint <=540 px mengubah grid menjadi satu kolom | PASS secara struktur |
| Dashboard | Breakpoint <=800 px menyembunyikan sidebar desktop dan menampilkan bottom navigation | PASS secara struktur |
| Konten panjang | `.pluits-content` memiliki `min-width:0`; product list berubah menjadi satu kolom pada mobile | PASS secara struktur |
| Safe area | Bottom navigation menggunakan `env(safe-area-inset-bottom)` | PASS secara struktur |
| Target sentuh | Tombol bottom nav minimum 36 px | FAIL terhadap standar 44 px |
| Lebar 320/360/390/430 px | Belum ada browser screenshot/DOM measurement pada viewport tersebut | NOT TESTED |
| Keyboard Android, scroll, focus, screen reader, upload picker | Tidak tersedia bukti perangkat/browser | NOT TESTED |

**Batas penting:** CSS source review bukan bukti bahwa halaman benar-benar tampil dan berfungsi pada Android. Tidak tersedia browser/device automation dalam sesi audit ini; clone repository dan menjalankan browser lokal juga tidak berhasil karena koneksi GitHub dari runtime tidak tersedia. Karena itu tidak ada klaim visual rendering atau Android pass.

## 4. Live backend facts (read-only)
- `stores.business_type` CHECK masih menerima PT/CV/UD.
- `create_store` RPC masih memvalidasi PT/CV/UD.
- `submit_store_for_verification` mewajibkan legal name, telepon, email dan alamat lengkap.
- `stores` memiliki `directory_entity_id`; `directory_locations` mendukung banyak lokasi dan memiliki `is_primary` serta `is_public`. Namun relasi lifecycle, kebijakan akses, sinkronisasi alamat, dan alur cabang belum dibuktikan siap digunakan Seller Center.
- `review_store_verification` membatasi admin/moderator dan memindahkan store ke active ketika verified; online sales tetap false.
- Tidak ada DDL, migration, data atau Auth setting yang diubah.

## 5. Rencana remediasi yang aman

### Gate A — staging dan kontrak backend
1. Siapkan staging/disposable database yang sesuai prosedur Supabase dan persetujuan biaya.
2. Cocokkan seluruh migration history, constraint, RPC signature/body, grants, RLS, Storage, dan data existing.
3. Pisahkan `business_type` operasional dari `legal_form` opsional; pertahankan kompatibilitas toko lama.
4. Tentukan pemetaan satu toko ke directory entity dan primary `directory_locations`; verifikasi akses owner dan publik.
5. Buat jalur atomik untuk create store + owner membership + settings + audit + entity/location.
6. Buat RPC owner-guarded untuk aktivasi online sales; jangan membuka UPDATE langsung.
7. Jalankan positive/negative tests dan Supabase advisors. Production tetap memerlukan persetujuan eksplisit setelah staging lulus.

### Gate B — onboarding dan UX
1. Step 1: kategori usaha/operasional (toko retail, grosir, usaha rumahan, produsen, dan kategori lain yang disetujui).
2. Step 2: identitas dagang dan username; preview URL menggunakan route aktif.
3. Step 3: bentuk legal opsional, dengan keterangan dokumen tambahan hanya jika kategori mewajibkan.
4. Step 4: kontak dan lokasi fisik/operasional; bedakan alamat verifikasi privat dan area publik.
5. Step 5: ringkasan, persetujuan, dan status draft.
6. Sesudah dibuat: checklist dashboard untuk profil, lokasi, verifikasi, jam operasional, katalog, dan area layanan.

### Gate C — dashboard
- Navigasi mobile tidak boleh memaksa delapan item dalam ruang sempit; gunakan navigasi utama dan kelompok “Lainnya”.
- Semua aksi harus memiliki loading/disabled, error/retry, success, empty dan permission-denied state.
- Cabang menggunakan model lokasi kanonis yang telah diuji, bukan tabel duplikat tanpa alasan.
- URL publik memakai slug yang dapat dibaca dan alias untuk perubahan slug; URL tidak memberikan hak akses.
- Jangan tampilkan fitur staff, laporan, review, atau aktivasi online seolah siap sebelum backend dan UAT lulus.

## 6. UAT matrix berikutnya
- Viewport: 320, 360, 390, 430, 768, 1024, 1440 px.
- Device: Android nyata dengan browser yang digunakan founder; catat model, versi Android, browser dan ukuran viewport.
- Alur: login, create store draft, multi-store switch, profile save/failure, lokasi utama, submit verification, moderator review, product draft/upload, kategori, stock view, service area, orders.
- Security: owner vs unrelated account; store A vs store B; anon vs private address; non-owner attempts; revoked membership.
- Resilience: offline/slow network, failed upload, duplicate submit, refresh, back navigation, keyboard open, session expiry.
- Uji data hanya dengan akun dan toko uji yang dikendalikan founder; jangan membuat atau menghapus data produksi tanpa izin.

## 7. Keputusan release
Seller Center belum dapat dinyatakan selesai atau lulus UAT. Jalur berikutnya adalah staging schema/RPC alignment terlebih dahulu, kemudian frontend onboarding/dashboard, automated regression/build, lalu Android founder UAT. Jangan deploy perubahan frontend yang menawarkan pendaftaran UMKM sebelum backend benar-benar menerima model tersebut.
