# MASTER MODEL BISNIS — BAGUS LOAD & DELIVERY
**Versi:** 0.8 | **Pembaruan:** 7 November 2026
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

### 5.12 Struktur owner dan staff toko
Akun yang mendaftarkan toko otomatis menjadi **owner utama** toko tersebut. Akun owner adalah identitas pribadi, bukan akun bersama. Owner dapat mengundang staff menggunakan akun masing-masing sehingga staff dapat login dari komputer/perangkatnya sendiri tanpa memakai kata sandi owner. Setiap staff terikat pada toko tertentu dan memiliki jabatan serta izin yang ditentukan owner. Satu pengguna dapat menjadi staff di satu toko dan owner di toko lain.

Owner memegang kendali tertinggi: kepemilikan toko, undangan/pencabutan akses, perubahan rekening penerima, penarikan/pencairan dana, pengaturan keamanan dan perubahan sensitif lain. Owner dapat mengerjakan pengelolaan dari handphone. Staff dapat diberi izin operasional seperti katalog, stok, harga, diskon, pemrosesan pesanan, layanan pelanggan, pengaturan jam/zona, dan analisis penjualan. Hak accounting dapat mencakup pencatatan biaya, rekonsiliasi, membaca laporan, dan mengunduh PDF, tetapi tidak otomatis mencakup pengubahan rekening atau penarikan dana. Izin harus dapat dipisahkan per tindakan; jabatan bukan satu-satunya dasar otorisasi.

Sistem harus menolak tindakan yang tidak diizinkan di backend, bukan hanya menyembunyikan tombol di UI. Perubahan rekening, penerima dana, penarikan, transfer kepemilikan, penunjukan owner, dan perubahan keamanan kritis memerlukan autentikasi ulang owner, notifikasi, serta catatan audit. Staff tidak boleh mengubah dirinya menjadi owner atau memberi izin owner kepada dirinya sendiri. Penggunaan akun bersama dilarang. Rincian MFA, masa tunggu perubahan rekening, dan verifikasi transaksi bernilai tinggi masih perlu ditetapkan sebelum uang sungguhan diproses.

### 5.13 Username toko, URL publik, dan website katalog
Setiap toko mempunyai **nama tampilan** dan **username/slug publik** yang berbeda. Nama tampilan toko boleh sama dengan toko lain; username harus unik secara global, tidak peka huruf besar-kecil, memiliki aturan karakter dan panjang, serta tidak dapat dipakai toko lain setelah terdaftar. Username menjadi alamat permanen halaman toko, misalnya `https://domain-platform/t/username-toko` (format final mengikuti domain platform yang dipilih). Owner dapat membagikan URL tersebut ke Instagram, Facebook, WhatsApp, dan kanal lain.

Setiap toko otomatis memperoleh website katalog publik yang responsif pada URL tersebut. Halaman menampilkan identitas toko, katalog dan kategori, detail produk/varian, harga yang boleh dipublikasikan, status ketersediaan, jam layanan, area layanan, serta tombol kontak/aksi sesuai kebijakan platform. Website tidak menampilkan alamat privat, koordinat presisi, data staff, data rekening, laporan internal, atau informasi pelanggan. Produk hanya tampil jika toko aktif, produk dipublikasikan, dan varian memenuhi aturan ketersediaan. Website katalog adalah manfaat utama pendaftaran toko, bukan proyek website terpisah untuk setiap penjual.

Username harus dapat diubah melalui proses aman dengan redirect dari URL lama agar tautan media sosial lama tidak langsung mati. Username lama sebaiknya masuk masa karantina dan tidak langsung diberikan kepada toko lain. Domain khusus milik toko dapat dipertimbangkan sebagai fitur lanjutan; bukan syarat tahap pertama.

### 5.14 Keuangan, histori permanen, dan laporan PDF
Setiap toko mempunyai catatan keuangan dan histori operasional yang terpisah. Sistem menyimpan transaksi, item pesanan, harga pada saat transaksi, diskon, biaya, pajak bila berlaku, pembayaran, refund, penyesuaian, dan pencairan sebagai catatan historis yang tidak ditimpa ketika harga produk berubah. Perubahan harga hanya berlaku untuk transaksi berikutnya; histori lama tetap menggunakan snapshot harga dan rincian saat pesanan dibuat.

Data penjualan tidak dihapus atau diganti setiap pergantian tahun. Tahun berjalan dan tahun-tahun sebelumnya tetap tersedia untuk pencarian, filter, analisis, dan audit. Laporan dapat dipilih berdasarkan bulan, rentang tiga bulan, delapan bulan, satu tahun, atau rentang tanggal khusus, serta diekspor menjadi PDF. Laporan dapat memuat ringkasan penjualan, jumlah pesanan, produk terjual, pembatalan/refund, diskon, biaya, dan nilai bersih sesuai definisi akuntansi yang disepakati. Hak melihat, mencatat, mengubah, dan mengekspor laporan ditetapkan terpisah; PDF untuk laporan internal tidak otomatis berarti staff boleh mencairkan dana.

Catatan keuangan harus memakai ledger/riwayat append-only: koreksi dibuat sebagai entri pembalik atau penyesuaian yang merujuk catatan asal, bukan menghapus atau menulis ulang transaksi lama. Laporan lama dapat dibuat ulang dari data sumber yang sama dan periode yang sama. Retensi, backup, akses, serta format ekspor harus dirancang agar data lintas tahun tetap dapat diakses. Ketentuan pajak, pembukuan formal, dan masa retensi legal perlu dikonfirmasi sebelum sistem dipakai sebagai pembukuan resmi.

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

### 7.3 Operasional staff, keuangan, dan pelaporan
Dashboard toko harus mendukung beberapa pengguna dan sesi perangkat secara bersamaan. Owner mengelola akses dari handphone; staff dapat bekerja dari komputer masing-masing dengan akun personal. Menu dan tindakan yang tersedia menyesuaikan izin. Owner dapat melihat aktivitas staff, mengundang, menonaktifkan, dan mencabut akses kapan saja. Aktivitas penting tercatat dengan pelaku, waktu, perangkat/sesi bila tersedia, serta data sebelum/sesudah.

Staff operasional dapat mengelola stok, produk, harga, diskon, pesanan, dan analisis sesuai izin. Staff accounting dapat membaca dan mengekspor laporan, serta melakukan pencatatan biaya/rekonsiliasi jika diberi hak. Rekening bank, metode pencairan, penerima dana, penarikan, dan perubahan kepemilikan tetap khusus owner. Sistem tidak boleh menganggap semua staff accounting berhak memindahkan uang.

Laporan harus mendukung filter periode bulanan, triwulan/3 bulan, 8 bulan, tahunan, dan rentang kustom. Data lintas tahun disimpan terus-menerus; pergantian tahun hanya membuat periode laporan baru, bukan menghapus atau mengosongkan histori. Ekspor PDF harus menyertakan identitas toko, periode, waktu pembuatan, filter, ringkasan dan rincian yang relevan, serta penanda bahwa laporan berasal dari sistem. Angka pada PDF harus bersumber dari query laporan yang sama dengan dashboard.

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
- Format final URL toko dan domain platform; kebijakan perubahan username, redirect, dan masa karantina username lama.
- Matriks izin rinci untuk owner, manager, catalog, inventory, order, accounting, customer service, dan staff lainnya.
- Mekanisme MFA/autentikasi ulang, notifikasi keamanan, masa tunggu perubahan rekening, serta batas verifikasi pencairan.
- Definisi laporan keuangan/penjualan, metode pengakuan penjualan, biaya, pajak, refund, dan format PDF.
- Kebijakan retensi, backup, pemulihan, dan akses histori lintas tahun.

## 17. Aturan dokumen master
1. Dokumen ini menjadi acuan utama diskusi bisnis dan penyusunan paket Bagus Load & Delivery.
2. Keputusan terbuka tidak boleh dianggap final tanpa persetujuan dan pencatatan.
3. Perubahan visi, prinsip anti-calo, syarat toko PT/CV/UD, atau urutan fase harus dicatat di sini.
4. Spesifikasi teknis, SOP, kebijakan legal, dan rincian paket dibuat sebagai dokumen turunan di folder MASTER atau folder dokumentasi terkait.
5. Setiap paket harus konsisten dengan harga transparan, penyedia yang jelas, dan tanpa perantara tersembunyi.
6. Dokumen ini menjelaskan arah dan keputusan bisnis; bukan pengganti spesifikasi teknis atau implementasi kode.

---
**Status berikutnya:** Versi 0.6 menambahkan struktur owner/staff, kontrol keuangan owner, histori transaksi lintas tahun, laporan PDF, username unik, dan website katalog otomatis untuk setiap toko. Tahap berikutnya adalah menyelaraskan skema backend dan menguji otorisasi owner/staff sebelum menghubungkan UI. Bagus Load & Delivery tetap menunggu validasi kebutuhan.


## 18. Akun universal pengguna, komunikasi, saldo, dan jejaring sosial

### 18.1 Prinsip akun universal
Pluits menggunakan satu identitas akun untuk seluruh aktivitas pengguna. Setiap akun otomatis memiliki fasilitas pengguna/pembeli. Pengguna tidak diarahkan untuk membuat toko setelah login dan tidak diberi promosi pembuatan toko sebagai bagian wajib dashboard. Menu **Buat Toko** tersedia sebagai salah satu pilihan di dashboard; keputusan untuk menjadi penjual sepenuhnya berasal dari pengguna.

Dashboard pengguna sekurang-kurangnya menyediakan:
- Ringkasan akun dan aktivitas.
- Transaksi/pesanan.
- Chat.
- Saldo.
- Wishlist.
- Keranjang.
- Ulasan.
- Alamat.
- Profil dan identitas sosial.
- Postingan, Story, dan Reels.
- Pengaturan akun dan privasi.
- Buat Toko (akses terpisah menuju onboarding Seller Center).

### 18.2 Transaksi pembeli
Riwayat transaksi harus lengkap dan dapat dibuka per pesanan: nomor dan tanggal transaksi, toko, item, foto, variasi, kuantitas, snapshot harga satuan, diskon, subtotal, biaya, ongkos kirim, total, alamat pengiriman saat checkout, metode dan status pembayaran, bukti/invoice, status pemenuhan, informasi kurir/pelacakan, serta kronologi perubahan status dengan timestamp.

Catatan transaksi harus immutable untuk data historis penting. Perubahan harga katalog, nama produk, atau alamat profil tidak boleh mengubah snapshot transaksi yang sudah terjadi. Sistem perlu mendukung pembatalan, refund, komplain/sengketa, dan unduhan invoice sesuai kebijakan yang akan ditetapkan.

### 18.3 Chat dan pusat bantuan
Akun menyediakan inbox percakapan dengan:
- Toko/penjual tertentu, dengan konteks produk atau pesanan.
- Pusat bantuan resmi Pluits.
- Riwayat percakapan, daftar pesan, timestamp, status terkirim/terbaca, dan lampiran yang diizinkan.
- Hubungan dari halaman produk, toko, dan transaksi ke percakapan yang relevan.
- Kategori bantuan dan nomor tiket untuk kasus yang memerlukan penanganan.

Otorisasi percakapan wajib berbasis peserta. Toko hanya dapat mengakses percakapan yang melibatkan toko tersebut; percakapan pengguna dengan toko lain atau bantuan Pluits tidak boleh terbuka. Retensi, pelaporan penyalahgunaan, blokir, dan moderasi akan dirinci pada spesifikasi teknis.

### 18.4 Saldo / Pluits Balance
Antarmuka akun menyiapkan ringkasan saldo, saldo tersedia, saldo tertahan/dalam proses, top up, penarikan, riwayat mutasi, biaya, status, dan bukti transaksi. Fitur dapat ditampilkan dalam keadaan nonaktif selama fase uji UI.

Saldo uang sungguhan tidak boleh dibuat hanya sebagai angka frontend atau saldo demo yang tampak dapat dicairkan. Sebelum aktivasi diperlukan ledger double-entry/append-only yang dapat direkonsiliasi, idempotensi transaksi, kontrol fraud, autentikasi kuat, verifikasi rekening penerima, proses refund/chargeback, integrasi penyedia pembayaran yang sesuai, serta kajian persyaratan hukum dan regulasi yang berlaku. Top up, pembayaran, refund, penahanan, pelepasan, dan penarikan harus memiliki catatan mutasi terpisah dan dapat diaudit. Aktivasi dompet/penyimpanan dana merupakan keputusan terbuka sampai model hukum dan mitra penyedia disetujui.

### 18.5 Profil pengguna dan privasi
Profil memiliki foto/avatar, nama tampilan, username unik, bio, jumlah pengikut/mengikuti, serta halaman konten. Nama tampilan merupakan identitas publik dan tidak harus sama dengan nama legal. Username menjadi identitas unik. Nama legal, email, nomor telepon, alamat, data verifikasi, rekening, dan informasi transaksi tetap privat secara default.

Pengguna dapat mengatur akun publik atau privat. Sistem perlu mendukung permintaan mengikuti, persetujuan pengikut untuk akun privat, blokir, mute, pelaporan, serta kontrol siapa yang dapat mengirim pesan dan melihat Story/konten tertentu. Pengaturan privasi harus berlaku konsisten di feed, profil, pencarian, Story, komentar, dan hasil berbagi.

### 18.6 Jejaring sosial: feed, postingan, Story, dan Reels
Pluits menyiapkan lapisan sosial yang mencakup:
- Feed konten dari akun yang diikuti dan rekomendasi yang dikendalikan preferensi.
- Postingan foto/video dengan caption dan galeri profil berbentuk grid.
- Story dengan masa tayang dan pengaturan audiens.
- Reels/video pendek vertikal.
- Like, komentar, bagikan, simpan, follow/unfollow, dan pelaporan konten.
- Profil sosial untuk pengguna dan, pada fase berikutnya, toko/penyedia.
- Moderasi, hak cipta, kontrol konten, dan keamanan pengguna.

Konten tidak boleh dipublikasikan otomatis tanpa tindakan dan persetujuan pengguna. Konten yang dibuat dari transaksi harus melalui tindakan eksplisit seperti **Bagikan ke Story** atau **Buat Postingan**. Jika asal konten benar-benar terkait transaksi yang valid, Pluits dapat menampilkan label **Pembelian Terverifikasi** tanpa membocorkan nomor pesanan, alamat, harga privat, bukti pembayaran, atau data personal. Pengguna dapat memilih gambar produk katalog, menambahkan foto/video sendiri, menulis pengalaman, dan memilih audiens. Menghapus postingan tidak menghapus catatan transaksi asli.

### 18.7 Pemisahan data dan akses
Lapisan sosial tidak boleh mengubah akses data operasional marketplace. Data transaksi privat, alamat, saldo, rekening, chat privat, dan data verifikasi tidak boleh ikut masuk ke feed atau profil publik. Setiap objek sosial memiliki pemilik, status visibilitas, dan kebijakan akses yang diperiksa di backend, bukan hanya disembunyikan melalui UI.

### 18.8 Tahapan implementasi
1. **Fondasi akun:** satu autentikasi, profil, username, nama tampilan, avatar, pengaturan privasi, dan dashboard navigasi.
2. **Fasilitas pembeli:** wishlist, keranjang, alamat, transaksi, dan ulasan yang terhubung ke backend.
3. **Komunikasi:** inbox, chat toko, dan pusat bantuan.
4. **UI saldo:** tampilan dan status nonaktif untuk pengujian; ledger dan integrasi uang sungguhan hanya setelah keputusan legal/penyedia dan kontrol keamanan siap.
5. **Sosial dasar:** profil publik/privat, feed, postingan foto, follow, like, komentar, dan Story.
6. **Sosial lanjutan:** Reels, rekomendasi, moderasi lanjutan, dan konten berbasis pengalaman pembelian terverifikasi.

Setiap fase diuji di perangkat mobile. Fitur yang belum terhubung harus diberi status belum aktif dengan jelas; tidak boleh menampilkan data transaksi, saldo, percakapan, atau postingan palsu seolah-olah nyata.



### 18.9 Nama tampilan, username, dan lokasi publik
Identitas profil membedakan tiga hal:
- **Nama tampilan:** nama yang terlihat oleh orang lain; boleh sama dengan nama pengguna lain.
- **Username:** identitas akun yang unik secara global, tidak peka huruf besar-kecil, dan menjadi alamat profil. Username tidak boleh dipakai dua akun sekaligus.
- **Lokasi publik:** label wilayah ringkas dengan ikon pin, ditampilkan dalam format dua tingkat seperti `Denpasar, Bali`, `Badung, Bali`, `Gianyar, Bali`, atau `Banjarmasin, Kalimantan Selatan`. Lokasi ini bukan alamat jalan dan bukan koordinat presisi.

Pengguna dapat mengubah lokasi publik sesuai aturan validasi. Profil tidak boleh menampilkan alamat lengkap, nomor rumah, patokan pribadi, atau titik peta presisi secara otomatis. Jika pengguna ingin membagikan alamat atau detail tambahan, ia dapat memilih menuliskannya sendiri di bio/konten publik dengan pemahaman bahwa informasi tersebut akan terlihat oleh audiens yang dipilih.

### 18.10 Pendaftaran alamat dan titik peta pengguna
Pada pendaftaran atau saat menambahkan alamat, sistem mengumpulkan data alamat yang cukup lengkap untuk layanan: nama penerima, nomor kontak yang diperlukan untuk pengiriman, provinsi, kota/kabupaten, kecamatan, kelurahan/desa, kode pos, alamat jalan/detail, catatan kurir opsional, serta titik peta/koordinat jika pengguna memilih atau mengizinkannya. Formulir harus memandu pengguna mengisi wilayah secara bertingkat dan memvalidasi kode pos serta kecocokan lokasi sejauh data referensi tersedia.

Alamat lengkap dan koordinat presisi merupakan data privat. Pengguna dapat menyimpan beberapa alamat, memberi label (rumah, kantor, proyek, dan sebagainya), memilih alamat utama, mengubah atau menghapus alamat, serta memilih alamat tertentu saat checkout. Lokasi publik profil disimpan sebagai pilihan terpisah dari alamat pengiriman. Jangan pernah menyimpulkan bahwa alamat checkout harus menjadi lokasi publik profil.

Titik peta membantu pengguna memilih titik antar yang tepat, mengurangi kesalahan alamat, dan memudahkan pemesanan berikutnya. Akses lokasi perangkat harus meminta izin secara eksplisit; jika izin ditolak, pengguna tetap dapat mencari wilayah dan memasang pin secara manual. Koordinat hanya dibagikan kepada pihak yang memerlukan untuk pemenuhan pesanan yang sah, sesuai kebijakan privasi dan tahap transaksi. Tidak boleh ditampilkan di profil publik secara default.

### 18.11 Toko yang ditampilkan pada profil pengguna
Pengguna yang juga merupakan owner toko dapat memilih apakah toko miliknya ditampilkan pada profil sosial pribadinya. Pengaturan ini bersifat opt-in dan dapat diubah kapan saja. Jika diaktifkan, profil pengguna menampilkan kartu/tautan toko yang dipilih, sehingga pengunjung dapat membuka halaman toko publik. Jika dinonaktifkan, toko tidak ditampilkan pada profil pribadi, tetapi status ini tidak menghapus atau menonaktifkan toko maupun website katalog publiknya.

Profil toko dan profil pribadi tetap dua entitas berbeda. Toko memiliki branding sendiri—nama tampilan, username toko, logo/avatar, sampul, deskripsi, bio, kategori, foto, katalog, jam layanan, dan informasi promosi yang diizinkan. Owner dapat membuat materi branding dan promosi, mengunggah foto/video, serta mengelola konten toko melalui dashboard dengan kontrol akses owner/staff. Konten promosi harus mengikuti kebijakan platform dan tidak boleh membuat klaim harga, stok, diskon, atau layanan yang menyesatkan.

Owner juga dapat mengunggah bukti transaksi atau dokumentasi penjualan untuk membantu membangun portofolio dan edukasi toko, khususnya bagi pengguna yang belum terbiasa memakai sistem digital. Sistem harus membedakan:
- Bukti/dokumentasi yang diunggah sendiri oleh toko (belum diverifikasi oleh Pluits).
- Transaksi yang benar-benar tercatat dalam sistem Pluits.
- Transaksi yang telah diverifikasi melalui proses resmi dan dapat diberi label verifikasi.

Unggahan bukti transaksi tidak otomatis menjadi transaksi Pluits dan tidak boleh dipakai untuk memanipulasi angka penjualan, rating, atau label pembelian terverifikasi. Sebelum dipublikasikan, pengguna harus dapat menyunting atau menutupi data sensitif seperti nama pelanggan, nomor telepon, alamat, nomor pesanan eksternal, tanda tangan, rekening, dan bukti pembayaran. Materi yang mengandung data pihak ketiga memerlukan dasar/izin yang sesuai. Bukti privat untuk administrasi toko harus disimpan terpisah dari konten promosi publik.



## 19. Pengalaman pengguna baru dan Explore
Pluits harus dapat digunakan terlebih dahulu sebagai platform pengguna biasa sebelum pengguna memutuskan membuka toko. Akun pertama pada tahap pengujian akan dipakai untuk memvalidasi perjalanan pengguna dari registrasi hingga publikasi konten. Tidak boleh memaksa pengguna membuat toko atau mengisi data usaha untuk menikmati fitur pengguna.

### 19.1 Profil pengguna dan onboarding
Pengguna dapat melengkapi profil secara bertahap:
- Foto profil/avatar.
- Foto sampul/cover profil.
- Nama tampilan (boleh sama dengan pengguna lain).
- Username unik.
- Bio.
- Lokasi publik ringkas dua tingkat wilayah dengan ikon pin, misalnya Denpasar, Bali.
- Preferensi privasi akun publik atau privat.
- Alamat tersimpan yang lengkap, termasuk kode pos dan titik peta, untuk kebutuhan pemesanan/pengiriman; data ini tidak otomatis menjadi lokasi publik.

Pengguna dapat menguji ganti foto profil dan sampul, mengubah bio, mengatur username, menambah alamat, memilih titik peta, dan mengatur privasi tanpa harus menjadi owner toko.

### 19.2 Unggah foto dan video
Pengguna dapat membuat postingan foto dan video dari perangkat mobile. Alur minimum mencakup memilih media, pratinjau, menambahkan caption, mengatur audiens/privasi, menerbitkan, lalu melihat hasil pada profil dan Explore. Status upload, progres, kegagalan, dan percobaan ulang harus jelas. Validasi format, ukuran, durasi, rasio, batas unggahan, penyimpanan, serta moderasi ditentukan dalam spesifikasi teknis.

Media yang berhasil dipublikasikan harus benar-benar tersimpan dan dapat dimuat kembali; jangan menganggap upload berhasil hanya karena preview lokal terlihat. Konten milik pengguna baru harus terlihat pada profilnya dan dapat ditemukan pada Explore selama memenuhi aturan visibilitas dan moderasi. Untuk menguji alur cold-start, Explore dapat menyertakan konten milik akun sendiri dengan penandaan wajar sebagai konten sendiri; ini bukan manipulasi angka viral atau engagement.

### 19.3 Explore dan pemeringkatan konten
Explore menyajikan campuran foto dan video dalam satu aliran, bukan tab terpisah yang memaksa format tertentu. Urutan dapat mempertimbangkan relevansi, minat, kebaruan, kualitas, interaksi yang sah, dan popularitas/viralitas. Popularitas bukan satu-satunya faktor; konten baru dari akun kecil tetap memiliki peluang ditemukan. Jangan membuat likes, komentar, view, atau angka viral palsu. Konten privat, diblokir, dihapus, diturunkan moderator, atau tidak memenuhi syarat visibilitas tidak boleh muncul.

### 19.4 Interaksi pada setiap konten
Setiap postingan foto/video menyediakan aksi yang konsisten:
- Suka/like dan batalkan suka.
- Komentar dan balasan.
- Bagikan/share melalui mekanisme berbagi yang aman.
- Simpan/tandai/bookmark ke koleksi pribadi.
- Tandai akun lain dan, bila relevan, tandai produk/toko.
- Laporkan konten dan kontrol pemilik untuk menghapus atau mengubah postingan.

Aksi hanya boleh tercatat setelah backend mengonfirmasi. Jumlah interaksi dihitung dari data nyata dan harus konsisten antara Explore, profil, serta detail postingan. Privasi akun dan aturan blokir berlaku pada seluruh interaksi.

### 19.5 Kriteria lulus pengalaman akun pertama
Uji pengguna pertama dinyatakan lulus apabila pengguna dapat mendaftar/login, mengganti foto profil dan sampul, mengisi bio, menetapkan username, mengatur privasi, menambah alamat lengkap dan kode pos, memasang titik peta, mengunggah foto dan video, melihat hasil unggahan pada profil dan Explore, serta menggunakan like, komentar, share, simpan/tandai dan tag tanpa data contoh palsu. Pengujian ini mendahului pengujian fitur toko dan tidak menandakan fitur sosial sudah selesai sebelum benar-benar diuji.


## 21. Arsitektur sosial sebagai beranda utama dan marketplace sebagai ruang terpisah

Keputusan produk: **Pluits adalah platform sosial-komunitas yang memiliki marketplace terintegrasi, bukan marketplace yang hanya diberi fitur sosial.** Beranda utama harus berfungsi sebagai social feed yang dapat dilihat pengunjung tanpa login. Halaman katalog belanja bukan halaman pembuka utama.

### 21.1 Beranda publik (visitor-first social feed)
- URL utama `/` menampilkan linimasa komunitas Pluits.
- Pengunjung tanpa akun dapat melihat konten publik yang memenuhi aturan visibilitas dan moderasi, membaca caption, melihat profil publik, serta menjelajahi konten.
- Feed dapat memuat foto dan video dari pengguna, aktivitas komunitas, inspirasi proyek, dokumentasi pekerjaan, pengalaman penggunaan produk/jasa, dan konten relevan lain.
- Konten baru dari akun kecil tetap memperoleh peluang tampil; ranking dapat mempertimbangkan relevansi, minat, kebaruan dan interaksi yang sah tanpa angka palsu.
- Cerita/Stories dan video pendek/Reels merupakan pengembangan tersendiri; jangan menganggap placeholder stories sebagai fitur yang sudah berfungsi.
- Pengunjung tidak perlu login untuk mengenal aplikasi. Login/registrasi diminta secara kontekstual ketika melakukan aksi yang membutuhkan identitas, misalnya like, komentar, follow, menyimpan, membuat postingan, chat, checkout, atau transaksi.
- Jangan menampilkan produk contoh, toko fiktif, angka engagement palsu, atau saldo/transaksi simulasi sebagai data nyata.

### 21.2 Marketplace sebagai area khusus
Marketplace diakses melalui navigasi tersendiri. Di dalamnya pengguna dapat mencari dan menelusuri:
- Material dan produk konstruksi.
- Toko, supplier, distributor, dan penyedia resmi yang memenuhi persyaratan.
- Jasa tukang dan tenaga profesional lintas bidang konstruksi (misalnya tukang bangunan, ledeng/plumbing, listrik, kolam renang, renovasi, dan layanan terkait).
- Angkutan dan delivery material.
- Kategori layanan/produk lain yang disetujui dalam roadmap.

Marketplace harus mendukung pencarian, kategori, filter, detail produk/jasa/toko, perbandingan informasi, kontak/chat, keranjang, checkout, dan transaksi sesuai fase implementasi. Persyaratan legalitas toko PT/CV/UD serta prinsip mengurangi perantara/calo dan transparansi harga tetap berlaku di marketplace.

### 21.3 Navigasi produk
Navigasi utama yang konsisten:
1. **Beranda** — feed sosial publik.
2. **Marketplace** — katalog material, produk, toko, supplier, jasa, dan logistik.
3. **Explore** — penemuan konten komunitas, termasuk foto dan video.
4. **Buat postingan** — untuk pengguna yang login.
5. **Aktivitas/Notifikasi** — interaksi sosial dan aktivitas akun.
6. **Profil** — identitas sosial pribadi, terpisah dari profil toko.
7. **Akun** — transaksi, wishlist, keranjang, alamat, chat, saldo, pengaturan, dan opsi Buat Toko.

Pada mobile, navigasi dapat diringkas menjadi bottom navigation yang tetap memprioritaskan Beranda, Explore, Buat, Marketplace, dan Profil. Menu akun/aktivitas dapat ditempatkan pada area sekunder sesuai hasil uji UX.

### 21.4 Prinsip identitas dan akses
- Feed publik dapat dibaca tanpa akun selama kebijakan RLS dan Storage mengizinkan konten publik.
- Interaksi yang memerlukan identitas harus meminta login/registrasi pada saat aksi dilakukan, bukan memblokir pengunjung sejak halaman pertama.
- Akun privat, konten privat, konten terhapus, konten yang diblokir, atau konten yang tidak lolos moderasi tidak boleh tampil kepada pengunjung umum.
- Data alamat lengkap, koordinat privat, nomor telepon, bukti pembayaran, dan data transaksi tidak boleh terekspos pada feed.
- Marketplace dan feed berbagi identitas akun yang sama, tetapi keduanya tetap memiliki fungsi, navigasi, dan pengalaman yang berbeda.

### 21.5 Perubahan keputusan terhadap desain beranda sebelumnya
Konsep beranda katalog/landing page yang menonjolkan kategori material, jasa, dan supplier sebagai isi utama halaman pertama **digantikan** oleh beranda social feed. Kategori dan penjelasan marketplace tetap ada, tetapi dipindahkan ke halaman Marketplace serta tautan/komponen sekunder pada feed. Keputusan ini mengubah arsitektur informasi dan navigasi, bukan menghapus kebutuhan marketplace.

## 20. Aturan sinkronisasi model bisnis, checkpoint, dan PR
Model bisnis ini menyimpan keputusan dan arah produk; ia bukan satu-satunya catatan status implementasi. Status pekerjaan harus dikelola dalam dokumen **PROJECT-STATUS-ROADMAP.md** yang menjadi pasangan wajib dokumen ini.

Setiap perubahan besar hasil diskusi harus:
1. Ditambahkan pada bagian yang sesuai atau sebagai subbagian baru tanpa menghapus keputusan lama yang masih berlaku.
2. Jika keputusan lama berubah, tandai sebagai digantikan/deprecated dan catat keputusan baru serta alasannya; jangan menimpa sejarah tanpa jejak.
3. Diperiksa dampaknya terhadap skema data, UI, keamanan, alur pengguna, dan fase roadmap.
4. Memperbarui checkpoint dan daftar PR: apa yang selesai, apa yang belum, bukti commit, status pengujian, dependensi, dan langkah berikutnya.
5. Tidak menandai pekerjaan selesai hanya karena dokumen atau mockup selesai. Implementasi, deploy, dan pengujian dicatat sebagai status yang berbeda.
6. Memulai sesi kerja baru dengan membaca model bisnis, status/roadmap, spesifikasi teknis yang relevan, serta status repo/backend terkini.

Setiap checkpoint harus memiliki kriteria penerimaan dan bukti. Setiap PR harus menjelaskan prioritas, dependensi, ruang lingkup, serta cara pengujian. Dokumen status tidak boleh mengklaim deploy atau tes berhasil tanpa bukti aktual.

---
**Riwayat revisi:** v0.8 menambahkan pengalaman onboarding pengguna baru, profil publik, unggah foto/video, Explore campuran, interaksi konten, dan kewajiban sinkronisasi checkpoint/PR. Rincian progres dan pekerjaan tertunda dilacak pada dokumen status proyek, bukan dengan menghapus riwayat model bisnis.
