# PLUITS — AI START HERE

**Versi:** 1.0  
**Pembaruan:** 7 November 2026  
**Repository:** https://github.com/baguskristiansianturi/bagus-load-delivery  
**Produk:** Pluits  
**Perusahaan yang direncanakan:** Pluits Indonesia  
**GitHub Pages:** https://baguskristiansianturi.github.io/bagus-load-delivery/

## Tujuan
Baca dokumen ini sebelum melanjutkan pekerjaan Pluits di chat/sesi baru. Dokumen ini memberi urutan baca, batas produk, cara memahami status, dan aturan agar AI tidak mencampur proyek atau menganggap rencana sebagai fitur selesai.

## Urutan wajib membaca
1. MASTER/AI-START-HERE.md — orientasi dan aturan.
2. MASTER/BUSINESS-MODEL-MASTER.md — sumber kebenaran model bisnis. Baca visi/prinsip dan terutama bagian 23–24. Bagian 24 adalah arah terbaru untuk social experience commerce; pertanyaan terbuka di 24.17 belum menjadi keputusan final.
3. MASTER/PROJECT-STATUS-ROADMAP.md — checkpoint, PR, dependensi, tes, deployment.
4. MASTER/PLUITS-USER-TESTING.md — panduan UAT mobile.
5. supabase/README.md dan MASTER/PLUITS-SECURITY-REVIEW.md — backend, RLS, Storage, keamanan, temuan yang perlu diverifikasi.\n6. docs/pluits/LIVE-AUDIT-2026-11-08.md — audit live repository/database, migration reconciliation, dan status tes terbaru.\n7. docs/pluits/MASTER-PRODUCT-VISION.md dan PRODUCT-ROADMAP.md — arah produk dan inovasi sebagai dokumen pendamping, bukan pengganti Business Model Master.

Jika ada konflik, ikuti keputusan terbaru di Business Model Master. Jangan menghapus sejarah lama; tandai bagian lama sebagai superseded bila perlu.

## Identitas dan batas proyek
- Produk/backend bernama Pluits; perusahaan direncanakan Pluits Indonesia.
- Repository ini khusus Pluits: baguskristiansianturi/bagus-load-delivery.
- Jangan mencampur backend, desain, database, repository, atau identitas Pluits dengan Bagusin atau Bali Trans.
- Pluits diarahkan menjadi platform social-first + marketplace lokal + Trip/Travel dalam satu akun.
- Homepage utama adalah feed sosial. Halaman Marketplace tetap mempertahankan fondasi desain marketplace Pluits yang sudah ada.
- Katalog awal harus berasal dari pelaku usaha nyata. Jangan membuat toko, produk, transaksi, saldo, review, atau engagement palsu agar terlihat ramai.

## Prinsip produk
- Konten sosial biasa tetap diperbolehkan; feed bukan katalog iklan saja.
- Transaksi hanya disebut terverifikasi jika ada bukti transaksi sah dari backend.
- Sinyal lokasi, kunjungan terkonfirmasi, dan transaksi terverifikasi adalah tiga tingkat bukti berbeda.
- Foto, caption, geotag, dan geofence tidak membuktikan pembayaran.
- Review yang memenuhi syarat terhubung ke pengalaman/transaksi kanonis; merchant menerima notifikasi dan dapat merespons sesuai izin.
- URL eksternal bebas dibatasi; gunakan kartu internal Pluits untuk profil, merchant, produk, layanan, post, dan Trip.
- Username/halaman publik usaha berfungsi sebagai mini-website yang dapat dibagikan ke media sosial lain.
- Data transaksi, nominal, lokasi presisi/real-time, alamat, dan informasi pribadi tidak boleh dibuka tanpa persetujuan dan dasar yang sah.
- Jangan menjanjikan spam atau konten palsu bisa dihapus 100%; bangun pencegahan, bukti, pelaporan, moderasi, rate limit, dan banding.
- Toko resmi tidak menjual barang bekas menurut kebijakan yang sedang diuji; konten sosial pribadi harus dipisahkan dari listing toko.
- Pickup, pengiriman toko, Bagus Load & Delivery, dan integrasi pihak ketiga belum boleh diklaim tersedia sebelum benar-benar dibangun dan diuji.

## Cara membaca status
Setiap fitur harus memiliki status terpisah:
- PROPOSED: ide/hipotesis.
- DECIDED: keputusan produk yang disepakati.
- SPECIFIED: kebutuhan dan acceptance criteria ditulis.
- IMPLEMENTED: kode/schema dibuat.
- DEPLOYED: deployment berhasil.
- TESTED: tes nyata dilakukan dan hasil dicatat.
- ACCEPTED: founder menerima hasil setelah melihat/menguji.

Satu status tidak otomatis membuktikan status berikutnya. Dokumen bukan bukti implementasi. Commit bukan bukti deployment. Deployment bukan bukti UAT. Jika belum diuji, tulis NOT TESTED.

## Cara melanjutkan pekerjaan
1. Periksa branch dan commit terbaru.
2. Baca checkpoint terbaru di roadmap.
3. Audit file, route, schema, RLS, Storage, dan workflow aktual sebelum mengubah apa pun.
4. Cocokkan perubahan dengan Business Model Master dan pertanyaan terbuka.
5. Kerjakan bertahap; jangan merusak Marketplace saat membangun social feed.
6. Untuk perubahan database, baca skill Supabase dan audit RLS/security sebelum migration.
7. Setelah perubahan frontend, jalankan build dan periksa GitHub Actions/Pages; berikan link mobile untuk diuji.
8. Catat commit SHA, file, deployment run, tes nyata, masalah, dan pekerjaan tersisa di roadmap.
9. Jangan menandai fitur selesai jika hanya mockup, demo lokal, atau data dummy.
10. Jika founder memberi keputusan bisnis baru, integrasikan ke bagian yang tepat dengan menyesuaikan alur dan aturan lama, bukan menimpa seluruh dokumen.

## Fokus saat ini
Checkpoint model bisnis terbaru adalah CP-011 — Pluits Social Experience Commerce. Checkpoint implementasi terbaru adalah CP-012 — Real user registration & public social feed foundation. Model bisnis v1.0 mencatat transaksi menjadi konten, review dan respons merchant, kartu internal, username/mini-website, aturan toko/barang bekas, fulfillment, Trip Story, privasi, moderasi, dan hipotesis pendapatan.

Fondasi registrasi dan akses feed publik sudah disiapkan. Langkah berikutnya: founder mendaftar sendiri melalui GitHub Pages, mengonfirmasi email, melengkapi profil, mengunggah postingan publik, lalu memeriksa Explore dan Beranda publik. Catat semua error nyata. Jangan membuat akun atau postingan atas nama founder. Setelah UAT akun pertama, lakukan tes privasi menggunakan akun kedua sebelum mengundang lebih banyak tester.\n\nStatus yang belum selesai: leaked-password protection masih nonaktif; tes Android dan dua akun belum dilakukan; Story UI, follow graph, DM, notifikasi, report/block/moderasi, transaksi merchant, payment, dan wallet operasional belum lengkap. Security advisor masih melaporkan dua SECURITY DEFINER RPC yang perlu tes batas akses dan satu peringatan password bocor. Jangan klaim production-ready.

## Tautan utama
- Business Model Master: https://github.com/baguskristiansianturi/bagus-load-delivery/blob/main/MASTER/BUSINESS-MODEL-MASTER.md
- Project Status & Roadmap: https://github.com/baguskristiansianturi/bagus-load-delivery/blob/main/MASTER/PROJECT-STATUS-ROADMAP.md
- GitHub Pages: https://baguskristiansianturi.github.io/bagus-load-delivery/
\n\n## Audit dan status terbaru\n- Live audit: https://github.com/baguskristiansianturi/bagus-load-delivery/blob/main/docs/pluits/LIVE-AUDIT-2026-11-08.md\n- Master Product Vision: https://github.com/baguskristiansianturi/bagus-load-delivery/blob/main/docs/pluits/MASTER-PRODUCT-VISION.md\n- Product Roadmap: https://github.com/baguskristiansianturi/bagus-load-delivery/blob/main/docs/pluits/PRODUCT-ROADMAP.md\n