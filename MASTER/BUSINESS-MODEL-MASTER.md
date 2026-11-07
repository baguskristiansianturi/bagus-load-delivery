# MASTER MODEL BISNIS — BAGUS LOAD & DELIVERY
**Versi:** 0.4 | **Pembaruan:** 7 November 2026
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
Fokus awal adalah marketplace material multi-toko yang benar-benar dapat diuji. Pengembangan dimulai dari sisi penjual: pendaftaran akun, pembuatan toko, dashboard, dan pengelolaan katalog. Katalog awal sengaja kosong dan hanya terisi ketika toko mendaftar serta mengunggah produknya sendiri. Pada uji coba pertama, pendiri mengoperasikan satu toko uji; setelah pengalaman penjual stabil, akun lain digunakan untuk menguji sisi pembeli. Toko bebas menjual berbagai jenis produk yang diizinkan kebijakan platform, bukan hanya material konstruksi tertentu.

Filter dan pengurutan perlu mendukung:
- Harga barang dan total biaya sampai tujuan.
- Jarak atau area layanan.
- Gratis ongkir beserta syaratnya.
- Minimum order (MOQ).
- Ketersediaan dan jadwal pickup/pengiriman.

Perbandingan harus mempertimbangkan ukuran, mutu, spesifikasi, satuan, panjang/volume/berat, dan kondisi penawaran agar tidak membandingkan barang berbeda. Pengiriman toko sendiri merupakan opsi normal yang ditampilkan sebagai bagian dari penawaran toko. Platform tidak boleh mengasumsikan semua toko menggunakan armada bersama.

### 5.1 Akun pengguna dan peran toko
Satu akun pengguna dapat berfungsi sebagai pembeli sekaligus pemilik/pengelola toko. Pengguna tidak perlu membuat identitas akun terpisah hanya untuk berpindah peran. Untuk membuka toko, pengguna mengajukan aktivasi/pendaftaran toko dan memenuhi syarat serta ketentuan penjual, termasuk verifikasi badan usaha sesuai kebijakan platform. Pendaftaran toko bukan berarti setiap akun otomatis menjadi penjual.

### 5.2 Pembuatan toko dan lokasi
Sebelum toko diaktifkan, pemilik wajib mengisi alamat toko, titik lokasi/pin peta, dan informasi wilayah operasional. Data lokasi toko menjadi dasar pencarian lokal, estimasi jarak, area layanan, dan perhitungan logistik di masa depan. Dashboard toko harus memungkinkan pemilik mengelola informasi toko sesuai hak aksesnya.

### 5.3 Katalog fleksibel dan atribut fisik
Toko bebas menambahkan kategori dan jenis barangnya sendiri dalam batas kebijakan platform. Sistem menyediakan kategori/atribut yang terstruktur tetapi tidak membatasi toko hanya pada daftar produk awal. Setiap produk memiliki data dasar seperti nama, merek bila ada, deskripsi, foto, SKU/kode internal opsional, satuan jual, harga, stok, dan status.

Untuk barang fisik, skema produk/variasi harus dapat menyimpan berat dan dimensi terukur—panjang, lebar, tinggi, serta satuan ukur—dan bila relevan diameter, volume, bentuk/kemasan, atau jumlah per ikat/pack. Atribut yang wajib diisi bergantung pada jenis produk; jangan memaksa atribut yang tidak relevan. Data ini disimpan sejak awal untuk kalkulator kebutuhan ruang/muatan dan rekomendasi kendaraan di masa depan, bukan berarti kalkulator armada harus dibangun sekarang.

### 5.4 Produk dengan variasi dan harga tampil
Satu halaman produk dapat memiliki beberapa variasi, misalnya “Besi Ulir” dengan pilihan diameter/ukuran 10, 12, dan 13. Setiap variasi dapat memiliki SKU, foto bila diperlukan, satuan, berat/dimensi, harga, diskon, dan stok masing-masing. Pengguna memilih variasi sebelum memasukkan barang ke keranjang atau membuat pesanan.

Pada kartu hasil pencarian atau katalog, sistem dapat menampilkan harga mulai dari atau harga variasi termurah yang benar-benar tersedia dan dapat dibeli. Harga termurah tidak boleh berasal dari variasi kosong, stok habis, atau syarat yang disembunyikan. Pengelompokan variasi dalam satu halaman produk juga membantu pencarian internal dan SEO; judul, atribut, dan konten harus tetap akurat serta tidak membuat halaman duplikat yang menyesatkan.

### 5.5 Dashboard toko dan pembaruan katalog
Dashboard penjual harus menjadi pusat operasional toko, bukan sekadar halaman profil. Pemilik dapat mengelola profil toko, katalog, variasi, foto, harga normal, diskon, stok, pesanan, jam operasional, dan pengaturan pengiriman sesuai hak akses. Perubahan stok, harga, dan diskon harus tersimpan dengan benar dan tercermin pada katalog setelah proses penyimpanan berhasil; status pembaruan harus jelas agar penjual tidak mengira perubahan sudah aktif padahal gagal.

Sistem perlu mencatat waktu perubahan dan pelakunya untuk data penting. Pengelolaan stok harus mengurangi risiko overselling ketika beberapa pembeli memesan bersamaan. Realtime berarti pembaruan tersinkron sesuai kemampuan sistem dan tidak menampilkan data lama sebagai data terkini; implementasi teknis dan batas latensinya ditetapkan dalam spesifikasi.

### 5.6 Kartu katalog dan label promosi
Kartu produk dapat menampilkan label ringkas seperti diskon, gratis ongkir, atau pengiriman hari yang sama. Label hanya muncul jika penawaran memenuhi syarat yang sudah dikonfigurasi dan dapat dibuktikan. Contohnya gratis ongkir memiliki cakupan, minimum belanja, atau batas jarak; same-day memiliki cut-off, wilayah, stok, dan kapasitas layanan. Jangan menampilkan badge promosi sebagai dekorasi atau janji yang tidak dapat dipenuhi.

## 6. Mesin perbandingan harga
Tujuannya menemukan penawaran paling efisien sesuai kebutuhan, bukan sekadar harga barang terendah.

Faktor perbandingan: harga satuan, kuantitas, total barang, ongkir, jarak, MOQ, jadwal, gratis ongkir dan syaratnya, kapasitas muatan, serta biaya tambahan wajib. Untuk produk bervariasi, perbandingan harus memakai variasi dan satuan yang setara.

**Estimasi total = total harga barang + ongkos kirim + biaya wajib lain yang diungkapkan.**

Jika ongkir belum dapat dihitung otomatis, tampilkan sebagai estimasi atau minta penawaran—jangan membuat angka seolah pasti. Gratis ongkir harus mencantumkan syarat seperti minimum belanja, batas jarak, atau kuota jika berlaku.

## 7. Fase 2 — Operasional toko
Backend toko dan dashboard penjual adalah pekerjaan implementasi pertama. Fokus pengujian awal adalah pengalaman pemilik toko (seller UX/UI): mendaftar sebagai pengguna, mengajukan pembuatan toko, mengisi data usaha dan alamat, masuk ke dashboard, membuat produk dan variasi, mengatur dimensi/berat, stok, harga, diskon, serta memeriksa status penyimpanan dan pembaruan katalog. Pengujian sisi pembeli dilakukan setelah alur toko cukup stabil.

Dashboard toko perlu mengelola:
- Profil usaha, dokumen verifikasi, alamat, titik lokasi/pin peta, dan titik pemuatan barang.
- Jam buka, jam layanan, dan status toko.
- Kategori toko dan katalog yang fleksibel.
- Produk, foto, SKU, variasi, atribut fisik, satuan, berat, dimensi, harga, diskon, dan stok.
- Status publikasi produk serta riwayat perubahan penting.
- MOQ dan ketentuan pembelian.
- Zona/wilayah pengiriman, kapasitas, hari dan slot pengiriman.
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
| 1 | Backend dan pengalaman pemilik toko | Akun multi-peran, pendaftaran/aktivasi toko, verifikasi, alamat toko, dashboard, katalog kosong, produk/variasi, atribut fisik, stok, harga, diskon |
| 2 | Pengalaman pembeli dan marketplace | Pencarian, halaman toko/produk, variasi, harga mulai dari, lokasi relevan, perbandingan, keranjang/pesanan, label promosi yang memenuhi syarat |
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

## 14. Lokasi dan relevansi pencarian
Lokasi toko wajib dimasukkan saat proses pembuatan toko, sebelum toko dapat dipublikasikan. Untuk pembeli, sistem meminta izin lokasi perangkat secara jelas. Jika izin diberikan, koordinat perangkat dapat digunakan untuk memprioritaskan toko terdekat atau toko yang melayani area tersebut. Jika izin ditolak/tidak tersedia, sistem menggunakan pilihan lokasi manual; alamat IP hanya boleh menjadi petunjuk perkiraan tingkat wilayah, bukan dianggap sebagai koordinat akurat.

Strategi awal bersifat lokal: peluncuran dan pengujian dimulai dari Bali. Hasil pencarian default memprioritaskan toko di Bali dan area layanan yang relevan, bukan mencampur hasil jauh seperti Surabaya tanpa alasan. Namun, pengguna tetap dapat memperluas wilayah pencarian atau mencari toko dari wilayah lain secara sengaja. Relevansi lokasi tidak boleh menghilangkan pilihan pengguna.

## 15. Skenario uji coba awal
1. Sistem dimulai dengan katalog kosong; tidak ada produk contoh yang membuat hasil pencarian tampak seolah sudah memiliki banyak penjual.
2. Pendiri mendaftar dan mengelola satu toko uji sebagai pelaku usaha penjual.
3. Pendiri mengunggah beberapa jenis produk material, termasuk besi dengan variasi ukuran/panjang, satuan, harga, dan stok.
4. Pengguna pembeli dari akun berbeda mencari produk dan hanya menemukan toko uji tersebut selama belum ada toko lain yang aktif menjual produk itu.
5. Uji alur melihat toko, detail produk, membandingkan penawaran ketika toko lain kelak bergabung, dan memahami pilihan pengiriman dari toko.
6. Setelah alur toko dan pembeli stabil, rekrut toko lain untuk menguji marketplace multi-toko. Uji Bagus Load & Delivery dilakukan terpisah berdasarkan kebutuhan nyata pembelian dari beberapa toko.

## 16. Keputusan terbuka
- Wilayah peluncuran dan kategori material awal.
- Dokumen/prosedur verifikasi PT/CV/UD.
- Kebijakan verifikasi pekerja dan penyedia jasa.
- Apakah dan kapan pembayaran diproses di dalam platform.
- Sumber data ongkir, perhitungan rute, dan integrasi armada.
- Model pendapatan, komisi, langganan, dan layanan berbayar.
- Aturan pembatalan, refund, garansi, sengketa, dan tanggung jawab pengiriman.
- Struktur paket, batas fitur, dan harga.

## 17. Aturan dokumen master
1. Dokumen ini menjadi acuan utama diskusi bisnis dan penyusunan paket Bagus Load & Delivery.
2. Keputusan terbuka tidak boleh dianggap final tanpa persetujuan dan pencatatan.
3. Perubahan visi, prinsip anti-calo, syarat toko PT/CV/UD, atau urutan fase harus dicatat di sini.
4. Spesifikasi teknis, SOP, kebijakan legal, dan rincian paket dibuat sebagai dokumen turunan di folder MASTER atau folder dokumentasi terkait.
5. Setiap paket harus konsisten dengan harga transparan, penyedia yang jelas, dan tanpa perantara tersembunyi.
6. Dokumen ini menjelaskan arah dan keputusan bisnis; bukan pengganti spesifikasi teknis atau implementasi kode.

---
**Status berikutnya:** Versi 0.4 menetapkan backend dan dashboard pemilik toko sebagai pekerjaan implementasi pertama. Setelah seller UX/UI dan pengelolaan produk tervalidasi dengan satu toko uji, pengujian dilanjutkan ke akun pembeli, pencarian lokal Bali, dan alur marketplace. Bagus Load & Delivery tetap menunggu validasi kebutuhan.
