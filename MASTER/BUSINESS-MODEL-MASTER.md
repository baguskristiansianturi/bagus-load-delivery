# MASTER MODEL BISNIS — BAGUS LOAD & DELIVERY
**Versi:** 0.3 | **Pembaruan:** 7 November 2026
**Status:** Dokumen induk model bisnis; acuan sebelum penyusunan paket dan spesifikasi teknis.

> Dokumen ini menjadi sumber acuan utama. Hal yang belum diputuskan ditandai sebagai terbuka dan bukan kebijakan final.

## 1. Visi
Prioritas utama adalah mendigitalkan toko material bangunan menjadi marketplace multi-toko: toko bangunan, toko besi, toko cat, toko semen, dan pemasok material lainnya dapat menampilkan katalog dan melayani pembeli secara digital. Platform membantu pembeli melihat toko dan membandingkan produk/harga tanpa harus mendatangi toko satu per satu. Dalam jangka panjang ekosistem dapat diperluas ke pekerja, jasa konstruksi, dan logistik. Bagus Load & Delivery sebagai layanan pengiriman tersendiri bukan fokus awal dan baru dipertimbangkan setelah kebutuhan serta modelnya diuji.

## 2. Masalah yang diselesaikan
- Harga material dan jasa tersebar dan sulit dibandingkan secara setara.
- Pembeli harus menghubungi banyak toko untuk mengetahui stok, MOQ, ongkir, dan jadwal.
- Harga barang terendah belum tentu menghasilkan biaya akhir terendah setelah pengiriman.
- Pencarian pekerja/tenaga ahli sering bergantung pada rekomendasi informal dan perantara.
- Marketplace umum belum cukup mendukung karakter material konstruksi yang berdimensi panjang, berat, bervolume besar, memiliki variasi satuan, dan membutuhkan koordinasi pengiriman khusus. Contohnya besi ulir panjang yang sulit diproses dengan ongkir paket standar.
- Banyak pembeli masih harus berkeliling atau menghubungi toko satu per satu karena katalog, harga, stok, dan kemampuan pengiriman toko belum tersedia dalam satu tempat.
- Informasi wilayah layanan, jam operasional, kapasitas, dan kesiapan pengiriman kurang jelas.

## 3. Prinsip bisnis
### Harga kompetitif dan transparan
Pengguna dapat membandingkan penawaran yang setara. Sistem memprioritaskan total biaya sampai tujuan, bukan sekadar harga barang. Jangan menyebut suatu penawaran termurah tanpa dasar perhitungan yang jelas.

### Tanpa calo/perantara tersembunyi
Pembeli diarahkan berhubungan dan bertransaksi dengan toko atau penyedia terdaftar melalui alur resmi. Tidak boleh ada perantara tersembunyi yang menaikkan harga tanpa kejelasan. Jika ada biaya layanan atau komisi platform, mekanisme dan nilainya harus diungkapkan. Besaran komisi belum diputuskan.

### Identitas penyedia jelas
Toko/supplier yang mendaftar sebagai penjual wajib berbentuk usaha **PT, CV, atau UD**, dengan identitas dan legalitas yang dapat diverifikasi. Pekerja, tenaga ahli, arsitek, dan penyedia jasa memiliki proses profil serta verifikasi sesuai kategori. Rincian dokumen dan tingkat verifikasi masih perlu ditetapkan.

### Efisien bagi semua pihak
Platform membantu pembeli menemukan penawaran dan membantu penyedia mengelola permintaan, jangkauan pasar, dan pemenuhan pesanan secara terukur.

## 4. Pihak dalam ekosistem
| Pihak | Peran |
|---|---|
| Pembeli/pemilik proyek | Mencari, membandingkan, memesan, dan memantau kebutuhan proyek |
| Toko/supplier material | Mengelola usaha, katalog, harga, stok, MOQ, wilayah, dan pengiriman |
| Pekerja/tenaga ahli | Menawarkan keahlian, area kerja, ketersediaan, dan portofolio |
| Penyedia jasa/kontraktor | Menawarkan layanan atau lingkup pekerjaan |
| Arsitek/perencana | Menawarkan desain, perencanaan, dan konsultasi profesional |
| Mitra transportasi | Menyediakan kendaraan, kapasitas, jadwal, dan pengiriman |
| Platform/operator | Mengelola standar, sistem, transaksi, moderasi, dukungan, dan kualitas |

Contoh tenaga/pekerjaan: tukang bangunan, tukang ledeng/plumbing, pembuat kolam renang, tukang listrik, pengecatan, plafon, keramik, atap, dan spesialis konstruksi lainnya.

## 5. Fase 1 — Marketplace material
Fokus awal adalah marketplace material multi-toko yang benar-benar dapat diuji. Toko yang lolos verifikasi dapat membuat profil dan mengunggah katalog; pembeli dapat mencari produk, melihat toko yang menjualnya, membandingkan harga dan spesifikasi, lalu memilih cara pemenuhan yang ditawarkan toko. Produk tidak perlu diisi sebagai data katalog bawaan oleh pengembang: katalog awal sengaja kosong dan baru terisi ketika toko mendaftar serta mengunggah produknya. Pada uji coba pertama, hanya satu toko uji milik pendiri yang aktif sehingga hasil pencarian hanya menampilkan toko tersebut. Setelah alur toko berjalan, akun pengguna lain dipakai untuk menguji pengalaman pembeli.

Filter dan pengurutan perlu mendukung:
- Harga barang dan total biaya sampai tujuan.
- Jarak atau area layanan.
- Gratis ongkir beserta syaratnya.
- Minimum order (MOQ).
- Ketersediaan dan jadwal pickup/pengiriman.

Perbandingan harus mempertimbangkan ukuran, mutu, spesifikasi, satuan, panjang/volume/berat, dan kondisi penawaran agar tidak membandingkan barang berbeda. Pengiriman toko sendiri merupakan opsi normal yang ditampilkan sebagai bagian dari penawaran toko. Platform tidak boleh mengasumsikan semua toko menggunakan armada bersama.

## 6. Mesin perbandingan harga
Tujuannya menemukan penawaran paling efisien sesuai kebutuhan, bukan sekadar harga barang terendah.

Faktor perbandingan: harga satuan, kuantitas, total barang, ongkir, jarak, MOQ, jadwal, gratis ongkir dan syaratnya, kapasitas muatan, serta biaya tambahan wajib.

**Estimasi total = total harga barang + ongkos kirim + biaya wajib lain yang diungkapkan.**

Jika ongkir belum dapat dihitung otomatis, tampilkan sebagai estimasi atau minta penawaran—jangan membuat angka seolah pasti. Gratis ongkir harus mencantumkan syarat seperti minimum belanja, batas jarak, atau kuota jika berlaku.

## 7. Fase 2 — Operasional toko
Backend dan dashboard toko adalah pekerjaan teknis pertama setelah fondasi marketplace. Pengujian dilakukan dengan pendiri sebagai pemilik satu toko uji: mendaftarkan/melengkapi profil usaha, mengunggah berbagai jenis produk (termasuk berbagai ukuran besi), mengatur harga dan stok, lalu memeriksa bagaimana produk muncul pada pencarian dan halaman produk dari akun pembeli terpisah.

Dashboard toko perlu mengelola:
- Profil dan dokumen usaha, alamat toko, dan titik pemuatan barang.
- Jam buka dan jam layanan.
- Katalog, variasi, harga, stok, dan MOQ.
- Zona/wilayah pengiriman.
- Kapasitas pemrosesan pesanan dan kapasitas/loading.
- Hari dan slot pickup/pengiriman.
- Pilihan pemenuhan: pengiriman sendiri oleh toko sebagai opsi utama; layanan/mitra Route & Delivery hanya sebagai alternatif jika tersedia dan telah diuji.
- Status pesanan dan kesiapan barang.

Opsi pengiriman ditampilkan sesuai wilayah, jenis barang, kapasitas, dan jadwal.

## 8. Fase 3 — Uji kebutuhan Bagus Load & Delivery
Setiap toko pada dasarnya dapat memiliki kendaraan dan mengatur pengirimannya sendiri. Karena itu, pengiriman toko sendiri adalah alur normal marketplace, bukan alasan untuk memaksa semua pesanan memakai armada platform.

Bagus Load & Delivery diposisikan sebagai alternatif yang perlu diuji, terutama ketika pembeli membutuhkan barang dalam jumlah kecil dari beberapa toko berbeda dan memerlukan satu driver untuk mengambil serta mengantarkan beberapa pesanan. Pengembangan layanan ini dilakukan setelah marketplace toko berjalan dan data kebutuhan nyata tersedia. Jangan membangun sistem logistik kompleks atau menetapkan tarif sebelum uji kebutuhan, jenis kendaraan, kapasitas, rute, biaya, dan tanggung jawab operasional.

Detail armada, tarif, skema mitra, pembagian pendapatan, SLA, asuransi, dan tanggung jawab kerusakan/kehilangan belum diputuskan.

## 9. Fase 4 — Ekosistem jasa konstruksi
Perluasan mempertemukan pengguna dengan pekerja dan penyedia jasa: tukang bangunan, plumbing, spesialis kolam renang, listrik, pengecatan, plafon, keramik, atap, kontraktor, arsitek, desainer, dan tenaga profesional lainnya.

Profil dapat memuat keahlian, area layanan, pengalaman, portofolio, ketersediaan, cakupan pekerjaan, dan cara penawaran harga. Sistem harus membedakan harga tetap, harga per satuan, harga per hari, dan harga berdasarkan survei/penawaran. Jangan menyamakan estimasi dengan harga final.

## 10. Urutan pengembangan
| Fase | Fokus | Hasil |
|---|---|---|
| 1 | Marketplace toko material | Fondasi backend, akun toko, verifikasi usaha, katalog kosong yang diisi penjual, pencarian, halaman toko/produk, perbandingan dan alur pesanan |
| 2 | Penguatan operasional toko | Dashboard, harga/stok, jam buka, zona, MOQ, kapasitas, jadwal, pengiriman mandiri toko |
| 3 | Validasi Bagus Load & Delivery | Uji kebutuhan penggabungan belanja lintas toko, driver, kendaraan, ongkir/rute, pickup, dan status |
| 4 | Ekosistem jasa | Profil pekerja/tenaga ahli, penyedia jasa, arsitek, permintaan, penawaran, ulasan |

Bangun dan validasi bertahap. Fokus implementasi saat ini adalah backend marketplace toko material, bukan sistem armada. Fitur logistik lintas toko tidak boleh menghambat pengujian katalog, toko, pencarian, perbandingan, dan pesanan.

## 11. Kerangka paket bisnis — harga belum ditetapkan
Paket dianalisis berdasarkan segmen pengguna, masalah, manfaat, fitur, batas penggunaan, biaya, dan nilai yang diterima.

Kelompok paket yang perlu dianalisis:
1. **Pembeli/pemilik proyek:** pencarian, perbandingan, permintaan, dan pengelolaan kebutuhan.
2. **Toko/supplier:** kehadiran toko, katalog, pesanan, dan fitur operasional.
3. **Pekerja/penyedia jasa:** profil keahlian, portofolio, wilayah layanan, dan permintaan pekerjaan.
4. **Mitra transportasi:** profil armada, kapasitas, wilayah, jadwal, dan order.
5. **Layanan tambahan/transaksional:** layanan berbayar yang memberi manfaat jelas.

Daftar ini adalah kerangka analisis, bukan keputusan bahwa semua pihak wajib berlangganan. Model pendapatan dapat berupa fitur gratis, langganan, biaya transaksi, atau layanan tambahan; keputusan harus diuji terhadap biaya, manfaat, dan prinsip transparansi. **Belum ada harga paket, komisi, atau biaya transaksi yang disahkan.**

## 12. Kepercayaan dan tata kelola
- Verifikasi identitas/legalitas penyedia sesuai kategori.
- Transparansi harga, satuan, ongkir, MOQ, dan biaya tambahan.
- Jejak perubahan harga, penawaran, status pesanan, dan komunikasi penting.
- Kanal pelaporan, keluhan, dan moderasi.
- Ulasan terkait transaksi/pekerjaan terverifikasi sejauh memungkinkan.
- Perlindungan data pribadi dan dokumen usaha.
- Aturan pembatalan, refund, keterlambatan, barang rusak, dan sengketa sebelum transaksi skala besar.

## 13. Indikator keberhasilan
Jumlah toko terverifikasi dan produk aktif; pencarian yang menghasilkan perbandingan relevan; penawaran dengan total biaya jelas; rasio permintaan menjadi pesanan; waktu pencarian hingga penawaran; ketepatan pemenuhan/pengiriman; pembatalan dan keluhan; retensi toko/pembeli; serta transaksi berulang. Target angka ditetapkan setelah baseline uji coba tersedia.

## 14. Skenario uji coba awal
1. Sistem dimulai dengan katalog kosong; tidak ada produk contoh yang membuat hasil pencarian tampak seolah sudah memiliki banyak penjual.
2. Pendiri mendaftar dan mengelola satu toko uji sebagai pelaku usaha penjual.
3. Pendiri mengunggah beberapa jenis produk material, termasuk besi dengan variasi ukuran/panjang, satuan, harga, dan stok.
4. Pengguna pembeli dari akun berbeda mencari produk dan hanya menemukan toko uji tersebut selama belum ada toko lain yang aktif menjual produk itu.
5. Uji alur melihat toko, detail produk, membandingkan penawaran ketika toko lain kelak bergabung, dan memahami pilihan pengiriman dari toko.
6. Setelah alur toko dan pembeli stabil, rekrut toko lain untuk menguji marketplace multi-toko. Uji Bagus Load & Delivery dilakukan terpisah berdasarkan kebutuhan nyata pembelian dari beberapa toko.

## 15. Keputusan terbuka
- Wilayah peluncuran dan kategori material awal.
- Dokumen/prosedur verifikasi PT/CV/UD.
- Kebijakan verifikasi pekerja dan penyedia jasa.
- Apakah dan kapan pembayaran diproses di dalam platform.
- Sumber data ongkir, perhitungan rute, dan integrasi armada.
- Model pendapatan, komisi, langganan, dan layanan berbayar.
- Aturan pembatalan, refund, garansi, sengketa, dan tanggung jawab pengiriman.
- Struktur paket, batas fitur, dan harga.

## 16. Aturan dokumen master
1. Dokumen ini menjadi acuan utama diskusi bisnis dan penyusunan paket Bagus Load & Delivery.
2. Keputusan terbuka tidak boleh dianggap final tanpa persetujuan dan pencatatan.
3. Perubahan visi, prinsip anti-calo, syarat toko PT/CV/UD, atau urutan fase harus dicatat di sini.
4. Spesifikasi teknis, SOP, kebijakan legal, dan rincian paket dibuat sebagai dokumen turunan di folder MASTER atau folder dokumentasi terkait.
5. Setiap paket harus konsisten dengan harga transparan, penyedia yang jelas, dan tanpa perantara tersembunyi.
6. Dokumen ini menjelaskan arah dan keputusan bisnis; bukan pengganti spesifikasi teknis atau implementasi kode.

---
**Status berikutnya:** Versi 0.3 menetapkan marketplace toko material sebagai prioritas implementasi. Langkah teknis pertama adalah merancang dan membangun backend toko serta alur uji satu toko milik pendiri, lalu menguji sisi pembeli melalui akun berbeda. Paket bisnis dan layanan logistik dibahas setelah validasi marketplace.
