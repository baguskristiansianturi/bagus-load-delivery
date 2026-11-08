# PLUITS — Store Lifecycle, Seller Center & URL Specification
**Tanggal:** 9 November 2026  
**Status:** DECIDED BUSINESS RULES / TECHNICAL DESIGN — DATABASE DAN UAT BELUM DIIMPLEMENTASIKAN  
**Scope:** onboarding, lokasi fisik, verifikasi, cabang, Seller Center, katalog, transaksi, dan URL.

## 1. Aturan pendaftaran usaha
PLUITS menerima toko perorangan, UMKM, usaha keluarga/rumahan, koperasi, badan usaha, dan bentuk usaha lain yang diperbolehkan. **PT/CV/UD bukan syarat pendaftaran.** Jenis usaha/profil operasional dan bentuk hukum harus menjadi dua data berbeda:
- Profil operasional: perorangan, UMKM, usaha keluarga, perusahaan, koperasi/organisasi, lainnya.
- Bentuk hukum: opsional; PT, CV, UD, PT Perorangan, koperasi, yayasan, persekutuan, perorangan/tidak berbadan hukum, lainnya.
Nama legal dan dokumen hukum hanya diminta bila relevan dengan bentuk usaha, kategori, risiko, atau ketentuan hukum. Jangan memaksa pemilik mengarang PT/CV/UD.

Syarat dasar toko adalah penanggung jawab yang dapat diidentifikasi dan **keberadaan fisik/lokasi operasional nyata yang dapat diverifikasi**. Usaha rumahan boleh mendaftar; alamat lengkap dapat disembunyikan dari publik sementara area umum ditampilkan. Alamat/pin lokasi fisik berbeda dari wilayah pengantaran/layanan. PLUITS verification bukan izin pemerintah, sertifikasi produk, atau jaminan kualitas.

## 2. Status harus dipisahkan
- Pendaftaran: draft → submitted/pending_review → approved atau rejected.
- Verifikasi PLUITS: unverified → pending → verified / rejected / suspended.
- Operasional: draft → active → temporarily_closed / suspended / archived.
- Penjualan online: disabled/enabled, terpisah dari status di atas.
- Lokasi/cabang: draft → pending_verification → verified / rejected / inactive.
Pembuatan toko tidak otomatis mempublikasikan toko atau mengaktifkan penjualan online. Aktivasi online hanya melalui RPC owner-guarded setelah persyaratan terpenuhi.

## 3. Alur owner
1. Masuk dengan satu akun personal PLUITS → Buat toko/usaha.
2. Isi nama toko, username, kategori, profil operasional, penanggung jawab, telepon, email, kota/area, deskripsi.
3. Pilih jenis lokasi (toko/outlet, usaha rumahan, kantor/ruang praktik, showroom/gudang, lokasi operasional lain), alamat fisik dan pin.
4. Pilih privasi alamat publik dan layanan (pelanggan datang/pickup, delivery lokal, layanan di lokasi pelanggan, kombinasi).
5. Simpan draft; akun pembuat menjadi owner melalui satu transaksi database yang atomik.
6. Lengkapi logo/banner, kontak, deskripsi, jam, kategori, lokasi, dan area layanan.
7. Ajukan verifikasi dengan checklist bukti sesuai kategori/risiko. Moderator dapat menyetujui, menolak dengan alasan, meminta perbaikan, atau meminta pemeriksaan tambahan. Sediakan review ulang/banding dan audit log.
8. Setelah verified/active, owner mengatur jam, kapasitas, cutoff, minimum order, pickup/delivery dan zona layanan.
9. Buat kategori → produk/jasa → varian → harga → stok/ketersediaan → foto. Produk awal berstatus draft.
10. Publish hanya jika toko aktif, verified, online sales enabled, data produk valid, serta harga/stok/kapasitas tersedia.
11. Order, payment, fulfillment, cancellation/refund/dispute memiliki lifecycle backend tersendiri.

## 4. Struktur Seller Center
1. Ringkasan: status, kelengkapan profil, produk, stok rendah, order perlu tindakan.
2. Profil & storefront: nama, username, deskripsi, kategori, logo, banner, website/social, kontak, preview/share URL, privasi alamat.
3. Lokasi & cabang: lokasi utama, cabang/outlet, alamat/pin, jam, kontak, status masing-masing.
4. Verifikasi: checklist, bukti, status, catatan moderator, ajukan ulang/banding.
5. Katalog: kategori, produk/jasa, foto, varian, harga/diskon, SKU, draft/published/archived.
6. Persediaan: stok dan movement (restock, sale, adjustment, return, damage), ketersediaan layanan.
7. Pesanan: baru, pembayaran, proses, pickup/delivery, selesai, batal, refund/dispute.
8. Area layanan & fulfillment: zona, jarak/coverage, biaya, minimum order, pickup, waktu persiapan, kapasitas, cutoff, instant/same-day bila benar-benar didukung.
9. Jam operasional: jadwal mingguan, hari libur, jam khusus, jeda dan cutoff.
10. Pembayaran & laporan: metode, status rekonsiliasi, ringkasan order. Jangan tampilkan wallet/payout siap pakai sebelum ledger, settlement dan compliance lulus.
11. Ulasan & reputasi: hanya review yang memenuhi syarat, respons, laporan dan banding.
12. Staf & akses: role granular, invitation, masa berlaku, audit dan revoke; jangan aktifkan sebelum UAT owner-vs-staff.
13. Notifikasi: email/in-app/WhatsApp setelah integrasi dan consent tersedia.
14. Pengaturan & keamanan: owner, akses, bahasa, mata uang, timezone, privasi, penutupan sementara.

Semua data dashboard harus selalu dibatasi dan diotorisasi berdasarkan store_id dan location_id di backend. URL/ID pada browser tidak memberikan hak akses.

## 5. Mobile UX
- Mobile-first, ringan untuk Android low-memory dan koneksi tidak stabil.
- Navigasi utama ringkas; bagian administratif masuk ke menu “Lainnya”, jangan memaksa 8–15 tab dalam satu baris.
- Form satu kolom, label terlihat, target sentuh minimal 44px, tombol submit tidak tertutup keyboard.
- Upload menampilkan preview, progress, retry dan batas ukuran.
- Tabel berubah menjadi kartu; error dekat field; tersedia loading/empty/error/offline/success/disabled state.
- Uji lebar 320, 360, 390, 430px dan Android nyata. Build/CSS saja bukan bukti responsive UAT.

## 6. URL dan ID
UUID database adalah ID stabil. Slug/username adalah alamat publik yang dapat berubah dengan alias/redirect lama. URL publik selalu resolve ke ID kanonis dan memeriksa status/RLS. Jangan memakai nomor telepon, email atau alamat privat pada slug.

### Rute aktif saat ini di GitHub Pages
- Storefront: `https://baguskristiansianturi.github.io/pluits/#/shop/{store_username}`
- Product detail saat ini: `https://baguskristiansianturi.github.io/pluits/#/market-product/{variant_id}` (route mengidentifikasi varian, bukan product UUID; perlu diperbaiki sebelum URL produk final).
- Seller Center: `https://baguskristiansianturi.github.io/pluits/#/seller`
- Marketplace: `https://baguskristiansianturi.github.io/pluits/#/marketplace`

### Target URL kanonis
- Toko: `/shop/{store_slug}--{store_public_id}`
- Cabang: `/shop/{store_slug}--{store_public_id}/location/{location_slug}--{location_public_id}`
- Produk: `/product/{product_slug}--{product_public_id}`
- Kategori: `/shop/{store_slug}--{store_public_id}/category/{category_slug}`
- Seller dashboard: `/seller/{store_id}/{section}` (route selection only; backend tetap memeriksa owner/member permissions).
GitHub Pages saat ini memakai hash router, sehingga target tersebut harus dipetakan menjadi `#/` routes. Jangan menampilkan `pluits.id` sebagai URL aktif sebelum domain dimiliki dan hosting dikonfigurasi.

Store username saat ini unik. Perubahan username harus membuat alias lama. Setiap cabang, produk, dan kategori memiliki ID sendiri. Produk memakai product UUID; varian memakai variant UUID sebagai pilihan pembelian, bukan identitas utama produk. Public ID pendek dapat ditambahkan setelah desain collision/alias disepakati. Open Graph/share preview crawler perlu solusi prerender/server path; hash URL mungkin tidak memberi preview yang konsisten.

## 7. Live schema facts (read-only audit, 9 Nov 2026)
- `stores.business_type` CHECK hanya PT/CV/UD; live `create_store` RPC juga menolak nilai lain.
- `legal_name` nullable di database tetapi frontend profile mewajibkannya.
- `full_address` nullable; onboarding tidak mewajibkannya, sementara submit verification meminta legal_name, phone, email dan alamat.
- `stores.directory_entity_id` tersedia; `directory_locations` sudah mendukung banyak lokasi per entity. Link/backfill dan RLS store-location belum terbukti.
- Store public route saat ini `#/shop/{username}`; product route memakai variant UUID.
- Belum ada cabang di Seller Center, upload logo/banner, full hours, staff invitations, storefront preview, owner-guarded online-sales activation, dan laporan keuangan lengkap.
- Audit ini read-only. Tidak ada DDL, data atau migration produksi yang diubah.

## 8. UAT acceptance
1. Individu/UMKM/usaha keluarga dan PT/CV/UD bisa mendaftar tanpa memalsukan bentuk hukum.
2. Toko tidak bisa submit verification tanpa lokasi fisik/alamat dan kontak yang cukup.
3. Alamat privat bisa diverifikasi tanpa harus ditampilkan presisi ke publik.
4. Create store atomik membuat owner membership, default settings, audit log.
5. Satu akun dapat mengelola beberapa toko; data tiap dashboard terisolasi.
6. Store, branch, product, category mempunyai URL/ID yang konsisten; slug lama dialihkan.
7. Status draft/review/verified/active/closed/suspended akurat; online sales off sebelum syarat.
8. Katalog, upload, stok, jam, area, order, pembayaran dan fulfillment menggunakan backend terotorisasi.
9. Akun non-owner/non-staff tidak dapat membaca/mengubah dashboard privat.
10. Publik hanya melihat storefront/lokasi/katalog yang layak dipublikasikan.
11. Android 320–430px lulus onboarding, upload, dashboard, katalog dan order tanpa overflow/tombol terpotong.

## 9. Tahapan delivery
- S0: schema/RPC alignment, tipe usaha dan bentuk hukum terpisah, lokasi fisik/privacy, backward compatibility.
- S1: onboarding, lokasi utama, verifikasi, review/appeal.
- S2: store/branch/product/category ID dan URL, alias, SEO/share preview.
- S3: dashboard, multi-store/branch, media, hours, settings.
- S4: katalog, inventory, local fulfillment, orders.
- S5: staff, roles, reviews, disputes, reporting.
- S6: staging negative tests, Android UAT, deploy exact SHA, founder acceptance.

## 10. Release gate
Dokumen ini tidak mengizinkan DDL production. Cocokkan migration history, data existing, constraints, RPC, grants, RLS, ACL dan Storage. Buat migration baru melalui workflow Supabase CLI, validasi di staging/disposable DB, jalankan advisors serta positive/negative tests, siapkan rollback, lalu minta persetujuan eksplisit sebelum production. Jangan mengubah migration yang sudah diterapkan.