# MASTER MODEL BISNIS — BAGUS LOAD & DELIVERY
**Versi:** 0.2 | **Pembaruan:** 7 November 2026
**Status:** Dokumen induk model bisnis; acuan sebelum penyusunan paket dan spesifikasi teknis.

> Dokumen ini menjadi sumber acuan utama. Hal yang belum diputuskan ditandai sebagai terbuka dan bukan kebijakan final.

## 1. Visi
Bagus Load & Delivery bertujuan mendigitalkan ekosistem kebutuhan konstruksi dan proyek. Platform menghubungkan toko/supplier material, pekerja dan tenaga ahli, penyedia jasa, arsitek/perencana, pemilik proyek/pembeli, serta penyedia kendaraan dan pengiriman. Visi jangka panjangnya adalah satu ekosistem digital untuk menemukan barang, tenaga, jasa, dan dukungan logistik proyek dengan proses transparan dan dapat ditelusuri.

## 2. Masalah yang diselesaikan
- Harga material dan jasa tersebar dan sulit dibandingkan secara setara.
- Pembeli harus menghubungi banyak toko untuk mengetahui stok, MOQ, ongkir, dan jadwal.
- Harga barang terendah belum tentu menghasilkan biaya akhir terendah setelah pengiriman.
- Pencarian pekerja/tenaga ahli sering bergantung pada rekomendasi informal dan perantara.
- Toko, supplier, pekerja, dan penyedia angkutan belum terhubung dalam satu alur digital.
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
Fokus awal adalah marketplace material multi-toko. Pengguna dapat menjelajahi kategori dan produk, melihat identitas/lokasi toko, spesifikasi, satuan, harga, stok, ketentuan pembelian, membandingkan penjual dengan produk sebanding, melihat MOQ dan ongkir, lalu mengirim permintaan atau memesan melalui alur tercatat.

Filter dan pengurutan perlu mendukung:
- Harga barang dan total biaya sampai tujuan.
- Jarak atau area layanan.
- Gratis ongkir beserta syaratnya.
- Minimum order (MOQ).
- Ketersediaan dan jadwal pickup/pengiriman.

Perbandingan harus mempertimbangkan ukuran, mutu, spesifikasi, satuan, dan kondisi penawaran agar tidak membandingkan barang berbeda.

## 6. Mesin perbandingan harga
Tujuannya menemukan penawaran paling efisien sesuai kebutuhan, bukan sekadar harga barang terendah.

Faktor perbandingan: harga satuan, kuantitas, total barang, ongkir, jarak, MOQ, jadwal, gratis ongkir dan syaratnya, kapasitas muatan, serta biaya tambahan wajib.

**Estimasi total = total harga barang + ongkos kirim + biaya wajib lain yang diungkapkan.**

Jika ongkir belum dapat dihitung otomatis, tampilkan sebagai estimasi atau minta penawaran—jangan membuat angka seolah pasti. Gratis ongkir harus mencantumkan syarat seperti minimum belanja, batas jarak, atau kuota jika berlaku.

## 7. Fase 2 — Operasional toko
Dashboard toko perlu mengelola:
- Profil dan dokumen usaha, alamat toko, dan titik pemuatan barang.
- Jam buka dan jam layanan.
- Katalog, variasi, harga, stok, dan MOQ.
- Zona/wilayah pengiriman.
- Kapasitas pemrosesan pesanan dan kapasitas/loading.
- Hari dan slot pickup/pengiriman.
- Pilihan pemenuhan: pengiriman sendiri atau mitra/layanan Route & Delivery jika tersedia.
- Status pesanan dan kesiapan barang.

Opsi pengiriman ditampilkan sesuai wilayah, jenis barang, kapasitas, dan jadwal.

## 8. Fase 3 — Bagus Route & Delivery
Lapisan logistik menghubungkan pesanan dengan kendaraan dan kapasitas yang sesuai. Arah kapabilitas: pencocokan kendaraan berdasarkan volume/berat/jenis barang dan lokasi; perhitungan atau permintaan penawaran ongkir; pengelolaan jadwal pickup, titik muat, titik antar, dan status; pengiriman toko ke lokasi proyek; serta pilihan Route & Delivery bagi toko jika layanan tersedia.

Detail armada, tarif, skema mitra, pembagian pendapatan, SLA, asuransi, dan tanggung jawab kerusakan/kehilangan belum diputuskan.

## 9. Fase 4 — Ekosistem jasa konstruksi
Perluasan mempertemukan pengguna dengan pekerja dan penyedia jasa: tukang bangunan, plumbing, spesialis kolam renang, listrik, pengecatan, plafon, keramik, atap, kontraktor, arsitek, desainer, dan tenaga profesional lainnya.

Profil dapat memuat keahlian, area layanan, pengalaman, portofolio, ketersediaan, cakupan pekerjaan, dan cara penawaran harga. Sistem harus membedakan harga tetap, harga per satuan, harga per hari, dan harga berdasarkan survei/penawaran. Jangan menyamakan estimasi dengan harga final.

## 10. Urutan pengembangan
| Fase | Fokus | Hasil |
|---|---|---|
| 1 | Marketplace material | Katalog multi-toko, profil supplier, pencarian, filter, perbandingan, alur pesanan |
| 2 | Operasional toko | Dashboard, harga/stok, jam buka, zona, MOQ, kapasitas, jadwal |
| 3 | Bagus Route & Delivery | Pilihan angkut, pencocokan kendaraan, ongkir/rute, pickup, status |
| 4 | Ekosistem jasa | Profil pekerja/tenaga ahli, penyedia jasa, arsitek, permintaan, penawaran, ulasan |

Bangun dan validasi bertahap. Fitur fase berikutnya tidak boleh menghambat pengujian kebutuhan inti fase sebelumnya.

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

## 14. Keputusan terbuka
- Wilayah peluncuran dan kategori material awal.
- Dokumen/prosedur verifikasi PT/CV/UD.
- Kebijakan verifikasi pekerja dan penyedia jasa.
- Apakah dan kapan pembayaran diproses di dalam platform.
- Sumber data ongkir, perhitungan rute, dan integrasi armada.
- Model pendapatan, komisi, langganan, dan layanan berbayar.
- Aturan pembatalan, refund, garansi, sengketa, dan tanggung jawab pengiriman.
- Struktur paket, batas fitur, dan harga.

## 15. Aturan dokumen master
1. Dokumen ini menjadi acuan utama diskusi bisnis dan penyusunan paket Bagus Load & Delivery.
2. Keputusan terbuka tidak boleh dianggap final tanpa persetujuan dan pencatatan.
3. Perubahan visi, prinsip anti-calo, syarat toko PT/CV/UD, atau urutan fase harus dicatat di sini.
4. Spesifikasi teknis, SOP, kebijakan legal, dan rincian paket dibuat sebagai dokumen turunan di folder MASTER atau folder dokumentasi terkait.
5. Setiap paket harus konsisten dengan harga transparan, penyedia yang jelas, dan tanpa perantara tersembunyi.
6. Dokumen ini menjelaskan arah dan keputusan bisnis; bukan pengganti spesifikasi teknis atau implementasi kode.

---
**Status berikutnya:** Model bisnis versi 0.2 menjadi dasar penyusunan paket. Tahap lanjutan adalah menerjemahkan tiap kelompok pengguna menjadi paket dan benefit yang dapat diuji, tanpa menetapkan harga sebelum struktur biaya dan nilai manfaat dianalisis.
