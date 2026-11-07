# MASTER MODEL BISNIS — BAGUS LOAD & DELIVERY
**Versi:** 0.5 | **Pembaruan:** 7 November 2026
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
Alamat dan lokasi toko wajib diisi ketika membuat toko. Sistem menyimpan alamat operasional dan titik koordinat yang cukup akurat untuk perhitungan jarak, zona layanan, dan peta di masa depan. Informasi publik tidak harus menampilkan alamat jalan atau titik persis toko: halaman toko dapat menampilkan nama wilayah/kota (misalnya Denpasar) dan perkiraan jarak dari pembeli. Alamat lengkap dan koordinat presisi hanya digunakan untuk kebutuhan operasional yang sah, seperti validasi zona, pickup, pengiriman, dan administrasi, dengan akses yang dibatasi.

Lokasi pembeli digunakan jika ia memberi izin perangkat; jika tidak, ia dapat memilih lokasi secara manual. IP hanya boleh menjadi perkiraan wilayah kasar, bukan sumber jarak presisi. Tujuan penyamaran alamat publik adalah menjaga transaksi tetap melalui platform, tanpa melarang toko dan pembeli menyepakati kunjungan langsung sesuai kebijakan yang kelak ditetapkan.

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

### 5.7 Harga online dan harga offline
Toko dapat menetapkan harga khusus kanal online yang berbeda dari harga penjualan langsung/offline. Harga yang tampil dan berlaku pada katalog, keranjang, dan checkout adalah harga online yang ditetapkan toko. Perbedaan harga bukan ditentukan sepihak oleh platform. Syarat harga harus jelas dan harga checkout harus dikunci/ditampilkan secara transparan sebelum pembeli mengonfirmasi pesanan.

### 5.8 Jam operasional, kesiapan pesanan, dan prioritas order
Toko mengatur sendiri hari dan jam buka, hari libur, status sementara tutup, serta batas waktu penerimaan pesanan. Jam buka toko tidak otomatis berarti semua barang dapat langsung diambil sampai menit terakhir. Setiap produk atau kelompok produk dapat memiliki waktu persiapan/pemuatan dan batas waktu order/pickup yang berbeda. Contohnya barang siap ambil seperti cat dapat memiliki aturan berbeda dari semen, pasir, atau material curah yang membutuhkan waktu menyiapkan dan memuat.

Sistem menyediakan rule dan pilihan konfigurasi; pemilik toko yang menetapkan nilai sesuai kemampuan operasionalnya. Sistem kemudian menggunakan aturan itu untuk menampilkan slot yang realistis, memperkirakan kesiapan, dan mencegah janji pickup/pengiriman yang tidak dapat dipenuhi.

Pesanan yang telah diterima dan dijadwalkan melalui platform harus masuk ke antrean kerja toko dan diproses sesuai komitmen jadwal. Toko perlu melihat prioritas, tenggat, serta konsekuensi performa jika berulang kali mengabaikan atau terlambat memenuhi pesanan yang sudah dikonfirmasi. Sistem mengukur kinerja berdasarkan data objektif—konfirmasi, waktu persiapan, kesiapan, pembatalan, dan ketepatan jadwal—bukan sekadar rating bebas. Ketentuan prioritas, pengecualian, dan sanksi perlu dirancang adil sebelum diberlakukan.

### 5.9 Pengiriman mandiri toko dan zona layanan
Toko tidak wajib mempublikasikan jenis atau jumlah armadanya. Toko cukup menyatakan layanan pengiriman yang benar-benar sanggup dipenuhi: zona tujuan, minimum pembelian, biaya atau skema gratis ongkir, batas jarak, hari/jam layanan, dan ketentuan barang. Contoh: gratis ongkir Denpasar untuk pembelian minimum Rp2.000.000 atau gratis ongkir seluruh Bali dengan syarat tertentu.

Sistem menyediakan alat untuk menggambar atau memilih zona layanan pada peta, menetapkan ketentuan tiap zona, dan memeriksa apakah alamat tujuan masuk cakupan. Detail kendaraan dan kalkulasi rekomendasi armada dapat dikembangkan kemudian menggunakan data berat/dimensi produk. Toko bertanggung jawab atas kebenaran layanan yang ditawarkannya.

### 5.10 Verifikasi toko bertahap
Status toko ditampilkan secara jelas, setidaknya sebagai belum diverifikasi dan terverifikasi. Pada tahap awal, toko dapat mulai berjualan setelah melengkapi data minimum dan menerima ketentuan platform, meskipun proses verifikasi dokumen belum selesai. Status belum diverifikasi tidak boleh disamarkan sebagai sudah terverifikasi. Platform dapat menerapkan batas atau penundaan untuk fitur berisiko lebih tinggi—misalnya pencairan dana melalui platform, promosi tertentu, atau batas transaksi—sampai verifikasi selesai. Persyaratan dokumen dapat ditingkatkan bertahap dan perubahan status harus memiliki jejak audit.

Data rekening penerima dan dokumen legal/foto berkas disiapkan sebagai bagian dari profil penjual, tetapi tidak harus menjadi penghalang untuk uji coba awal jika pembayaran/pencairan belum dikelola platform. Sebelum menerima atau menyalurkan dana atas nama platform, identitas penerima dan rekening wajib diverifikasi dengan kontrol yang memadai.

### 5.11 Perlindungan pengaturan toko
Perubahan profil, alamat, rekening, jam operasional, zona, harga, stok, diskon, dan aturan pesanan hanya boleh dilakukan oleh pemilik atau staf toko yang diberi hak. Sistem menyediakan peran/izin, konfirmasi untuk perubahan sensitif, riwayat perubahan (siapa, kapan, data sebelum/sesudah), serta notifikasi untuk perubahan penting. Operator platform tidak boleh diam-diam mengubah data komersial toko; koreksi oleh admin harus memiliki alasan dan jejak audit. Kredensial dan dokumen sensitif tidak ditampilkan ke publik.

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

### 7.1 Fitur minimum sisi pembeli dan checkout
Akun pembeli cukup mencakup registrasi/login, profil dasar, alamat atau lokasi tujuan tersimpan, pencarian dan filter, detail toko/produk, pemilihan variasi dan kuantitas, keranjang, pilihan pengiriman/pickup yang tersedia, ringkasan harga, konfirmasi pesanan, serta riwayat/status pesanan. Pembeli tidak perlu dashboard kompleks pada tahap pertama.

Checkout harus memvalidasi stok, variasi, minimum order, harga online, zona layanan, biaya kirim, jam operasional, waktu persiapan, dan slot pickup/pengiriman. Sebelum konfirmasi, pembeli melihat total biaya dan komitmen waktu. Jika ongkir belum dapat dihitung, tampilkan permintaan konfirmasi/penawaran, bukan biaya rekaan. Pembayaran online dapat menjadi tahap terpisah; metode pembayaran awal harus ditetapkan sebelum transaksi uang sungguhan dibuka.

### 7.2 Pengukuran kinerja penjual dan batas tanggung jawab platform
Rating dan ulasan utama melekat pada toko/penjual dan transaksi, bukan pada platform sebagai penyedia perangkat lunak. Platform tetap bertanggung jawab atas kualitas sistem, keamanan, keakuratan tampilan, dukungan, dan penanganan laporan. Kinerja toko diukur terpisah dari rating pembeli, misalnya tingkat penerimaan pesanan, waktu persiapan, ketepatan pickup/pengiriman, pembatalan oleh toko, dan respons. Data kinerja harus transparan dan memiliki konteks agar toko tidak dihukum atas kejadian di luar kendalinya.

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
Lokasi toko wajib dimasukkan saat proses pembuatan toko. Data lokasi presisi disimpan privat untuk perhitungan jarak, zona, dan operasional; kepada publik cukup tampilkan wilayah/kota dan jarak perkiraan, bukan alamat lengkap atau pin persis.

Untuk pembeli, sistem meminta izin lokasi perangkat secara jelas. Jika izin diberikan, koordinat perangkat dapat digunakan untuk memprioritaskan toko terdekat atau toko yang melayani area tersebut. Jika izin ditolak/tidak tersedia, sistem menggunakan pilihan lokasi manual; alamat IP hanya boleh menjadi petunjuk perkiraan tingkat wilayah, bukan dianggap sebagai koordinat akurat.

Peluncuran dan pendaftaran toko pada tahap uji coba dibatasi ke Bali. Pembatasan harus berupa konfigurasi wilayah operasional/onboarding di backend, bukan hard-code yang menyulitkan ekspansi. Pengguna dari luar Bali tidak dapat membuat toko atau mengaktifkan layanan penjual di luar wilayah yang dibuka. Perluasan wilayah dilakukan bertahap oleh operator setelah kesiapan operasional dinilai. Pencarian default memprioritaskan toko di Bali dan area layanan relevan; pengguna tetap dapat memperluas pencarian jika wilayah lain kelak dibuka.

## 15. Skenario uji coba awal
1. Sistem dimulai dengan katalog kosong; tidak ada produk contoh yang membuat hasil pencarian tampak seolah sudah memiliki banyak penjual.
2. Satu akun pendiri dapat berpindah peran sebagai pembeli dan pemilik toko; pendaftaran toko mengikuti syarat penjual.
3. Pendiri membuat satu toko uji dengan alamat privat, wilayah publik, jam operasional, dan aturan persiapan/pickup.
4. Pendiri mengunggah produk dan variasi, mengisi atribut fisik, harga online, diskon, serta stok.
5. Pendiri mengatur zona pengiriman dan ketentuan minimum belanja/gratis ongkir; sistem memeriksa tujuan terhadap zona.
6. Uji perubahan sensitif, hak akses, riwayat perubahan, dan status verifikasi toko.
7. Uji alur pesanan sesuai jam operasional, batas waktu order, waktu persiapan, antrean, dan prioritas pesanan terjadwal.
8. Setelah pengalaman penjual stabil, akun pembeli menguji pencarian lokal, detail produk, keranjang, checkout, total biaya, dan jadwal.
9. Pastikan toko belum diverifikasi ditandai jelas dan tidak ditampilkan seolah telah diverifikasi. Uji pembatasan pendaftaran toko di luar Bali.
10. Setelah alur toko dan pembeli stabil, rekrut toko lain untuk menguji marketplace multi-toko. Uji Bagus Load & Delivery dilakukan terpisah berdasarkan kebutuhan nyata.

## 16. Keputusan terbuka
- Daftar dokumen dan tahapan verifikasi toko PT/CV/UD, serta batas fitur untuk toko belum diverifikasi.
- Apakah pembayaran/pencairan uang dikelola platform dan kapan rekening penerima wajib diverifikasi.
- Aturan kunjungan langsung/offline dan cara mencegah penyalahgunaan informasi kontak/alamat publik.
- Formula performa penjual, bobot prioritas antrean, pengecualian, dan mekanisme keberatan.
- Rincian konfigurasi jam persiapan/pickup per produk atau kelompok produk.
- Model pemetaan zona pengiriman, biaya per zona, minimum order, dan gratis ongkir.
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
**Status berikutnya:** Versi 0.5 menetapkan alur dan rule operasional sebelum implementasi backend. Tahap berikutnya adalah menyusun spesifikasi backend secara berurutan: akun multi-peran, onboarding toko dan pembatasan wilayah Bali, profil/lokasi privat, verifikasi bertahap, dashboard, katalog, jam operasional dan kesiapan barang, zona pengiriman, lalu checkout. UI/UX dipoles setelah aturan dan alur inti tervalidasi. Bagus Load & Delivery tetap menunggu validasi kebutuhan.
