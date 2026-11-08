# MASTER MODEL BISNIS — PLUITS
**Versi:** 2.0 | **Pembaruan:** 8 November 2026
**Status:** SATU-SATUNYA SUMBER KEBENARAN untuk visi, model bisnis, keputusan produk, prinsip pengalaman, dan aturan bisnis Pluits.
**Produk:** Pluits | **Perusahaan yang direncanakan:** Pluits Indonesia
**Repository:** https://github.com/baguskristiansianturi/pluits
**Aplikasi:** https://baguskristiansianturi.github.io/pluits/

> Dokumen ini adalah acuan utama seluruh analisis dan pengembangan Pluits. Frontend, backend, database, API, kebijakan, desain UX, dan roadmap wajib diturunkan dari keputusan di sini. Dokumen teknis boleh menjelaskan cara implementasi, tetapi tidak boleh menciptakan atau mengubah keputusan bisnis secara diam-diam.
>
> **Arah aktif:** Pluits adalah platform social-first yang menghubungkan Social Media, Local Marketplace, Trip/Travel, dan GeoDirectory melalui satu identitas pengguna dan data entitas kanonis. Bagian 1 dan 23–30 merupakan arah aktif terkonsolidasi. Bagian 2–22 dipertahankan sebagai riwayat keputusan/operasional terdahulu dan tidak boleh dipakai untuk menghidupkan kembali arah yang sudah ditinggalkan. Jika ada konflik, bagian aktif terbaru dan keputusan bertanggal paling baru yang berlaku.
>
 > **Larangan identitas ganda:** Pluits adalah satu-satunya identitas aktif proyek ini. Jangan membuat brand, repository, backend, atau roadmap kedua untuk produk yang sama. Artefak historis yang tidak lagi dipakai hanya boleh dipertahankan sebagai catatan migrasi yang tidak aktif.

## 1. Visi Pluits — arah aktif
Pluits adalah ekosistem digital mobile-first yang menghubungkan manusia, komunitas, konten, tempat, pelaku usaha, perdagangan lokal, dan perjalanan. Social Media menjadi pintu masuk utama; Local Marketplace dan Trip/Travel menjadi ruang produk dengan alur transaksi/layanan masing-masing; GeoDirectory menjadi lapisan identitas tempat dan entitas bersama. Keunggulan Pluits adalah kesinambungan dari menemukan, mengenal, mengambil tindakan, hingga membagikan pengalaman nyata—dengan identitas terpadu, bukti yang jelas, dan kendali privasi pengguna.

Pluits bukan tiruan satu platform tertentu. Produk harus sederhana untuk tindakan umum, kuat pada pengalaman media, relevan secara lokal, dapat berkembang secara internasional, serta menjaga keamanan dan kualitas data.


## Riwayat keputusan awal — arsip nonaktif
Bagian 2–22 dari versi sebelumnya dipindahkan tanpa dihapus ke [arsip riwayat model bisnis](../docs/pluits/archive/BUSINESS-MODEL-HISTORY-LEGACY.md). Arsip tersebut hanya untuk konteks sejarah, bukan sumber keputusan. Model bisnis aktif dimulai pada Bagian 23 dan dirangkum pada Bagian 30.


## 23. Arah bisnis terbaru — Pluits sebagai platform sosial, marketplace lokal, dan Trip

**Keputusan founder, 7 November 2026:** Pluits tidak lagi dibatasi sebagai marketplace konstruksi. Identitas Pluits menjadi platform universal yang menggabungkan tiga ruang utama dalam satu akun dan satu ekosistem:

1. **Social Media / Community** — beranda utama untuk melihat dan menerbitkan foto/video, mengikuti orang dan penyedia, berteman/berinteraksi, memberi suka, komentar, membagikan konten, menyimpan, membuat Story/Status, menemukan komunitas, serta chat.
2. **Local Marketplace** — ruang khusus untuk menemukan dan membeli produk serta layanan dari penyedia lokal di wilayah tempat pengguna berada atau yang dipilihnya sebagai area kunjungan. Desain marketplace Pluits yang sudah ada dipertahankan; pengembangan dilakukan pada kategori, kartu, filter, detail, ketersediaan, dan aturan pemenuhan, bukan mengganti seluruh desainnya dengan tampilan marketplace My Bali.
3. **Trip / Travel** — ruang untuk merencanakan perjalanan, menemukan destinasi, akomodasi, aktivitas, tur, rental, transportasi, event, dan penyedia perjalanan lokal; termasuk alur penginapan dan pemesanan yang memiliki pola fungsi seperti platform akomodasi (misalnya Airbnb), tetapi menggunakan identitas dan rancangan Pluits sendiri.

Pluits harus mempunyai alasan penggunaan sepanjang hari. Ketika pengguna tidak sedang berbelanja atau bepergian, mereka tetap dapat membuka feed, melihat aktivitas teman, berbagi konten, mencari inspirasi, mengikuti penyedia, dan mengobrol. Ketika membutuhkan sesuatu, mereka dapat berpindah ke Marketplace atau Trip tanpa berpindah aplikasi maupun akun.

### 23.1 Prioritas beranda dan navigasi

- URL utama Pluits menampilkan **social feed** sebagai homepage utama, mengikuti model bisnis dan pola pengalaman sosial My Bali.
- Homepage bukan katalog produk dan bukan landing page konstruksi.
- Feed dapat berisi konten umum pengguna, teman/following, penyedia lokal, tempat, perjalanan, aktivitas, dan konten komunitas yang relevan. Konten tidak harus terkait transaksi atau perjalanan.
- Konten bisnis dapat ditautkan ke profil penyedia, toko, produk, layanan, destinasi, akomodasi, atau aktivitas. Konten sponsor harus diberi label jelas.
- Pengunjung dapat membaca konten publik tanpa login. Login diminta ketika melakukan tindakan yang membutuhkan identitas seperti follow, berteman, like, komentar, posting, chat, menyimpan, booking, atau checkout.
- Stories/Status bersifat permukaan konten tersendiri dan tidak otomatis menjadi postingan permanen. Reels/video pendek dapat dikembangkan sebagai format tersendiri.
- Navigasi utama sekurang-kurangnya: **Beranda, Marketplace, Trip, Explore, Buat, Aktivitas/Notifikasi, Chat, dan Profil/Akun**. Susunan desktop/mobile ditetapkan melalui pengujian UX. Marketplace tetap mudah dijangkau dari homepage.

### 23.2 Marketplace lokal berbasis wilayah — pembeda utama Pluits

**Keputusan founder:** Pluits tidak menjadi marketplace pengiriman nasional seperti Shopee yang memungkinkan produk dari satu pulau/daerah dikirim bebas ke daerah lain menggunakan kurir paket antarkota. Pluits memprioritaskan transaksi lokal dan pemenuhan cepat di wilayah operasional penyedia.

Contoh aturan: produk dari toko di Bali tidak dapat dipesan oleh pembeli di Jakarta untuk dikirim menggunakan JNE, J&T, atau layanan parcel antardaerah. Produk tersebut hanya dapat dipesan jika pembeli berada/menetapkan alamat tujuan di area layanan lokal toko dan toko benar-benar sanggup memenuhi pesanan secara **instant atau same-day** sesuai kapasitas dan jam operasionalnya.

Aturan inti:
- Setiap penyedia wajib menetapkan lokasi operasional dan wilayah layanan yang nyata serta dapat diverifikasi.
- Setiap produk/layanan harus memiliki cakupan pemenuhan yang jelas: area/zona, jam operasional, waktu persiapan, kapasitas, cut-off, ketersediaan, dan jenis pemenuhan.
- Sistem memeriksa kecocokan wilayah pembeli dengan wilayah layanan penyedia sebelum tombol pesan/checkout diaktifkan.
- Jika alamat tujuan berada di luar wilayah layanan atau penyedia tidak mampu memenuhi instant/same-day pada slot yang tersedia, produk tidak dapat dipesan untuk alamat tersebut. Tampilkan alasan yang jelas; jangan menerima order lalu berharap penyedia mencari kurir.
- Tidak boleh menawarkan pengiriman nasional/antardaerah untuk barang Marketplace sebagai opsi checkout standar. Kurir parcel antarkota seperti JNE/J&T tidak digunakan untuk mengakali batas wilayah lokal.
- Same-day/instant bukan janji otomatis. Waktu nyata harus dihitung dari jarak, traffic bila tersedia, jam buka, stok, waktu persiapan, kapasitas kurir/armada, dan batas operasional.
- Penyedia dapat menggunakan armada sendiri atau mitra lokal yang memenuhi standar Pluits. Tanggung jawab pemenuhan, pelacakan, serah terima, dan bukti penerimaan harus tercatat.
- Pickup di lokasi penyedia dapat dipertimbangkan sebagai opsi tambahan hanya setelah aturan operasionalnya ditetapkan; bukan alasan untuk mengaktifkan pengiriman antardaerah.
- Pengguna lokal tetap dapat menggunakan marketplace untuk kebutuhan sehari-hari di wilayahnya. Wisatawan dapat menemukan dan membeli produk khas/lokal ketika berada di area tujuan, dengan pemenuhan lokal yang cepat.
- Pengguna yang sudah meninggalkan wilayah asal tetap dapat melihat konten dan profil penyedia, tetapi tidak otomatis dapat memesan barang untuk dikirim ke kota/daerah lain. Pengecualian lintas wilayah memerlukan keputusan founder terpisah dan tidak boleh diselundupkan sebagai fitur kurir biasa.

**Dampak terhadap eksklusivitas:** nilai Pluits bukan menjanjikan semua barang bisa dikirim ke mana saja, melainkan menghubungkan pengguna dengan produk, penyedia, dan pengalaman lokal yang benar-benar dapat diakses di wilayah tersebut. Batas wilayah harus ditegakkan backend pada pencarian yang dapat dipesan, validasi keranjang, checkout, pembuatan order, dan pemilihan fulfillment—bukan hanya menyembunyikan kartu di frontend.

### 23.3 Wilayah operasional dan pengalaman wisatawan

- Pluits dapat mempunyai banyak wilayah operasional, tetapi tiap wilayah harus diaktifkan berdasarkan kesiapan provider, fulfillment, dukungan, dan standar kualitas.
- Model data perlu mendukung negara, provinsi, kota/kabupaten, kecamatan/area, dan zona layanan penyedia sesuai kebutuhan. Wilayah yang dipilih pengguna menjadi konteks discovery dan transaksi.
- Pengguna dapat memilih lokasi secara manual; izin lokasi perangkat dapat membantu mendeteksi area saat ini. Jangan memaksa akses GPS.
- Pengguna lokal melihat penyedia di area tempat tinggal/aktivitasnya. Wisatawan domestik maupun internasional dapat mengganti konteks lokasi ke destinasi yang sedang atau akan dikunjungi.
- Konten sosial dapat ditemukan secara luas, sedangkan hasil Marketplace dan ketersediaan transaksi diprioritaskan menurut area aktif yang dipilih.
- Bahasa, mata uang, zona waktu, format tanggal, dan informasi harga perlu disiapkan untuk pengguna lokal serta wisatawan internasional. Harga dan ketentuan penyedia harus transparan; aturan harga khusus wisatawan tidak boleh dibuat tanpa dasar hukum/keputusan yang sah.
- Alamat lengkap, nomor telepon, koordinat presisi, detail akomodasi privat, dan data transaksi tetap dilindungi. Lokasi publik cukup berupa wilayah umum kecuali pengguna/penyedia secara sadar memilih membagikan detail lain.

### 23.4 Trip / Travel sebagai pilar produk ketiga

Trip mengadopsi arah My Bali, bukan sekadar kategori produk tambahan. Ruang ini membantu pengguna dari tahap inspirasi hingga pengalaman perjalanan:
- **Discover:** destinasi, tempat menarik, restoran, event, aktivitas, dan rekomendasi komunitas.
- **Trip Plan / Bali Plan:** rencana perjalanan masa depan, tanggal, rute, tempat yang ingin dikunjungi, akomodasi, aktivitas, minat, catatan, dan estimasi anggaran. Rencana harus diberi label rencana, bukan booking atau kunjungan yang sudah terjadi.
- **Stay:** hotel, villa, guesthouse, homestay, dan akomodasi lain. Provider dapat mengelola profil properti/unit, fasilitas, foto, aturan, kalender ketersediaan, harga, kapasitas, permintaan reservasi, konfirmasi, pembayaran, check-in/check-out, pembatalan, dan ulasan sesuai fase dan aturan kategori.
- **Trip & Activity:** tur, guide, atraksi, tiket, watersport, diving, snorkeling, trekking, aktivitas budaya, dan pengalaman lokal.
- **Rental:** kendaraan dan perlengkapan yang disewakan, dengan persyaratan identitas, ketersediaan, deposit, serah-terima, dan perlindungan sesuai kategori.
- **Transport:** airport/port transfer, taxi, kendaraan dengan sopir, perjalanan lokal, dan layanan mobilitas lain dari operator yang memenuhi verifikasi.
- **Trip Experience:** catatan perjalanan yang benar-benar terjadi, dibuat pengguna secara sukarela, dan dapat ditautkan ke booking/aktivitas yang memenuhi syarat bukti.

Trip Plan, pencarian, booking request, booking confirmed, pembayaran, layanan selesai, check-in, dan pengalaman yang dibagikan harus menjadi status/entitas berbeda. Pembayaran tidak otomatis membuktikan kehadiran; booking tidak otomatis membuktikan layanan selesai; GPS atau unggahan foto saja tidak otomatis menjadi bukti transaksi.

Pemesanan Trip dapat dilakukan sebelum wisatawan tiba di wilayah tujuan, karena yang dipesan adalah layanan/akomodasi yang akan dipenuhi di wilayah penyedia pada tanggal tertentu. Ini berbeda dari pengiriman barang Marketplace lintas daerah. Batas lokal Marketplace tidak boleh secara keliru memblokir pemesanan akomodasi atau aktivitas masa depan yang memang berlokasi di destinasi tersebut.

### 23.5 Pemisahan desain dan pengalaman Marketplace

- Pertahankan desain Marketplace Pluits yang sudah ada sebelum konsolidasi My Bali sebagai dasar halaman Marketplace.
- Jangan mengganti kartu, susunan katalog, dan pola belanja Pluits dengan desain katalog My Bali.
- Pengembangan berikutnya berfokus pada konsistensi kartu antar-homepage Marketplace, katalog, produk serupa, rekomendasi, detail produk, filter lokasi, label instant/same-day yang valid, dan checkout berbasis area.
- Bahasa visual social feed/homepage mengambil prinsip My Bali: feed bersih, konten visual, stories, composer, explore, dan layout responsif. Identitas visual tetap Pluits.
- Trip dapat memakai pola discovery dan detail yang sesuai kebutuhan akomodasi/aktivitas, tetapi tidak boleh mengubah marketplace menjadi satu katalog campur-aduk. Produk, layanan lokal, akomodasi, dan booking Trip mempunyai model data serta alur transaksi yang berbeda.

### 23.6 Peran dan otorisasi yang disesuaikan

Satu akun Pluits tetap satu identitas lintas seluruh modul. Role bukan akun terpisah dan seseorang dapat mempunyai beberapa keanggotaan sesuai kewenangannya.

| Peran/konteks | Hak dan batas utama |
|---|---|
| Visitor/guest | Melihat feed publik, Explore, profil publik, listing publik, destinasi, dan informasi umum; tidak melakukan aksi yang membutuhkan identitas |
| Member/user | Mengelola profil, posting, follow/pertemanan, chat, wishlist, Trip Plan, dan interaksi sesuai privasi |
| Local buyer/customer | Mencari dan memesan produk/layanan lokal hanya jika area tujuan cocok dengan cakupan pemenuhan; mengelola alamat, keranjang, pembayaran, dan transaksi sendiri |
| Traveler/guest | Menjelajahi destinasi, membuat Trip Plan, meminta/mengonfirmasi booking Stay/Trip/Activity/Rental/Transport sesuai ketersediaan dan aturan wilayah |
| Store/business owner | Mengelola profil penyedia, katalog, harga, stok, jam, wilayah layanan, pesanan, staf, dan laporan sesuai kategori serta verifikasi |
| Provider/operator | Mengelola layanan, jadwal, kapasitas, harga, ketersediaan, pemesanan, dan pemenuhan untuk kategori yang disetujui |
| Host/accommodation manager | Mengelola properti/unit, fasilitas, kalender, tarif, reservasi, aturan, check-in/out, dan komunikasi tamu |
| Driver/courier/field staff | Menjalankan penugasan yang diberikan, melihat data minimum untuk tugas, memperbarui status, dan mengunggah bukti serah terima; tidak otomatis memiliki hak keuangan atau owner |
| Store/provider staff | Akun individual dengan izin per tindakan dan per penyedia; tidak menggunakan kredensial owner bersama |
| Platform admin/moderator/support | Verifikasi, moderasi, dukungan, sengketa, dan tindakan platform berdasarkan role terpisah, alasan, audit, serta pembatasan akses data |

Ketentuan:
- Login tidak otomatis menjadikan pengguna sebagai owner toko atau provider. Setelah login, pengguna masuk ke pengalaman member biasa; menu **Buat Toko / Daftarkan Penyedia** adalah pilihan opsional.
- Pendaftaran toko/penyedia membuat pendaftar menjadi owner utama untuk entitas yang didaftarkan, setelah proses penerimaan sesuai kategori. Satu akun dapat menjadi buyer, owner di satu entitas, staff di entitas lain, host, atau provider lain tanpa membuat akun baru.
- Owner dapat mengundang staff menggunakan akun masing-masing. Hak sensitif—rekening, settlement, refund tertentu, penarikan, transfer ownership, dan keamanan—dibatasi untuk owner/otorisasi khusus serta autentikasi ulang.
- Kategori usaha tidak lagi dibatasi pada konstruksi. Persyaratan badan usaha dan dokumen harus ditentukan berdasarkan jenis penyedia dan ketentuan hukum kategori. Persyaratan PT/CV/UD dari model konstruksi lama tidak boleh otomatis diberlakukan pada semua host, UMKM, individu, driver, guide, atau penyedia jasa; verifikasi tetap wajib dan disesuaikan dengan risikonya.
- Admin platform, moderator konten, tim verifikasi, customer support, dan finance/settlement harus memiliki izin terpisah. Tidak semua admin boleh mengakses alamat privat, dokumen legal, percakapan pribadi, atau data pembayaran.
- Semua otorisasi harus ditegakkan di backend/RLS/API; menyembunyikan tombol pada UI tidak cukup.

### 23.7 Trust, kualitas, konten, dan komunikasi

- Utamakan penyedia langsung atau operator yang benar-benar berwenang. Agen/reseller hanya boleh jika hubungan dan otorisasinya jelas; jangan menampilkan perantara seolah penyedia langsung.
- Verifikasi mencakup identitas/otoritas, lokasi atau area layanan nyata, kategori, izin yang diwajibkan, produk/layanan, dan pembaruan data. Verifikasi dapat ditinjau ulang; status dan batasnya harus transparan.
- Pisahkan profil sosial pribadi dan halaman bisnis/provider. Owner dapat memilih menampilkan toko/provider pada profil pribadi (opt-in).
- Postingan umum tidak membutuhkan transaksi. Postingan pengalaman dapat ditautkan secara sukarela ke booking/order yang benar-benar ada; fakta sistem tidak dapat diedit seolah-olah fakta tersebut berasal dari pengguna.
- Chat mendukung percakapan pengguna dengan teman, provider, host, driver pada konteks tugas, dan dukungan Pluits. Akses percakapan dibatasi pada peserta/role yang sah; data kontak dan transaksi tidak dibuka ke pihak lain.
- Sediakan report, block, mute, moderasi, banding, kontrol privasi, dan perlindungan terhadap spam, penipuan, pelecehan, impersonasi, serta konten yang melanggar hak cipta.
- Review harus terkait pengalaman yang relevan dan tidak boleh dibuat seolah transaksi terverifikasi jika tidak ada bukti sistem.
- Rekomendasi tidak boleh diam-diam dibeli. Sponsored placement wajib ditandai dan tidak menggantikan ranking organik secara menyesatkan.

### 23.8 Keputusan yang tidak otomatis ikut berubah

- Hipotesis komisi 2% UMKM dan hingga 5% bisnis besar dari My Bali **bukan tarif Pluits**. Belum ada tarif final yang disetujui.
- Prinsip equal local/foreign provider pricing dari My Bali menjadi arah transparansi, tetapi implementasi per kategori harus mematuhi hukum dan aturan resmi yang berlaku.
- Domisili awal Bali pada backend adalah konfigurasi wilayah awal, bukan pembatas permanen identitas produk. Aktivasi wilayah baru memerlukan kesiapan nyata.
- Wallet, pembayaran, escrow, settlement, refund, asuransi, jaminan perjalanan, dan perlindungan konsumen tidak boleh diklaim tersedia sebelum desain, mitra, regulasi, dan pengujian selesai.
- Kategori berisiko tinggi seperti properti, kendaraan bekas, produk teregulasi, dan layanan yang memerlukan izin khusus membutuhkan kebijakan terpisah sebelum diterima.

### 23.9 Dampak pada roadmap dan data model

Sebelum memperluas implementasi, lakukan audit dampak atas:
- Hierarki wilayah dan pemilihan lokasi aktif pengguna.
- Provider entity generik dengan tipe/kategori dan verifikasi khusus.
- Service area polygon/zone, jam, kapasitas, cut-off, fulfillment mode, dan validasi lokal pada cart/checkout/order.
- Pemisahan order barang lokal dari booking Stay/Trip/Activity/Rental/Transport.
- Calendar/inventory untuk akomodasi dan aktivitas; Trip Plan dan Trip Experience sebagai entitas berbeda.
- Profil sosial, follow/friend, chat, notifikasi, media, moderasi, dan public discovery.
- Role/permission matrix untuk owner, staff, host, driver, moderator, support, dan finance.
- Keamanan data pribadi, transaksi, itinerary, alamat, dan komunikasi.
- Analitik ketersediaan, pemenuhan instant/same-day, pembatalan, keterlambatan, keluhan, serta kualitas penyedia.

Urutan implementasi perlu direvisi setelah audit. Jangan menganggap perubahan model bisnis ini berarti seluruh kategori, booking engine, chat, atau fulfillment sudah dibuat. Setiap modul tetap mempunyai status DECIDED, DESIGNED, IMPLEMENTED, DEPLOYED, TESTED, dan ACCEPTED yang terpisah.

### 23.10 Bagian lama yang digantikan

Untuk menghindari dua arah bisnis yang saling bertentangan:
- Visi konstruksi pada bagian 1 dan batas vertikal konstruksi pada bagian 22.1–22.4 tidak lagi menjadi arah utama Pluits; bagian tersebut dipertahankan sebagai sejarah konsep awal.
- Bagian 21 tentang social-first homepage tetap berlaku, tetapi marketplace tidak lagi khusus konstruksi dan harus mengikuti batas transaksi lokal pada bagian 23.2.
- Bagian 22.3 yang menyatakan kategori wisata/akomodasi tidak otomatis masuk Pluits dinyatakan **digantikan** oleh bagian 23.4.
- Bagian 22.4 tentang ekspansi lintas Indonesia diperjelas: ekspansi boleh lintas wilayah sebagai jaringan area lokal, tetapi tidak berarti barang dapat dikirim bebas lintas daerah.
- Detail Seller Center, owner/staff, katalog, variasi, stok, audit, keamanan, dan histori pada bagian lama tetap dipakai sepanjang tidak bertentangan dengan model provider universal dan pemenuhan lokal.



## 24. Pluits Social Experience Commerce — media sosial berbasis pengalaman nyata (7 November 2026)

**Status:** Arah strategis hasil diskusi founder; keputusan konsep dicatat. Spesifikasi rinci, kebijakan privasi final, implementasi, dan pengujian belum selesai. Bagian ini menjadi acuan terbaru untuk evolusi sosial Pluits. Jangan menganggap fitur yang dijelaskan di sini sudah tersedia di aplikasi.

### 24.1 Posisi produk
Pluits adalah platform social-first yang menghubungkan empat lapisan: (1) Social—ekspresi diri, personal branding, foto/video, teks, opini, hashtag, percakapan, dan inspirasi; (2) Verified Experience—kunjungan, aktivitas, review, dan transaksi dengan tingkat bukti berbeda; (3) Local Commerce & Services—restoran, kafe, toko, freelancer, vendor, dan penyedia jasa lokal; (4) Trip—perjalanan, itinerary, booking, aktivitas, dan pengalaman perjalanan. Pluits bukan sekadar salinan Facebook, Instagram, Twitter, atau marketplace. Pembeda utamanya adalah pengalaman sosial yang dapat terhubung dengan aktivitas nyata dan halaman usaha/layanan.

### 24.2 Social-first feed
Homepage utama memprioritaskan feed sosial dan harus tetap menarik walaupun pengguna tidak sedang berbelanja. Konten dapat berupa foto/video dan caption pribadi, cerita, opini, aktivitas, personal branding, pengalaman tempat/perjalanan, serta postingan yang berasal dari transaksi Pluits. Konten biasa tetap diperbolehkan; feed tidak boleh berubah menjadi katalog iklan yang monoton. Promosi jasa/produk harus mengikuti aturan platform dan tidak menjadi spam.

### 24.3 Postingan yang berasal dari transaksi
Setelah transaksi berhasil melalui alur Pluits (misalnya QR/barcode dan saldo Pluits ketika pembayaran benar-benar tersedia), sistem dapat menawarkan pembuatan postingan pengalaman. Pembayaran tidak berarti otomatis mempublikasikan riwayat belanja. Pengguna memilih berbagi atau mengaktifkan pengaturan berbagi otomatis yang jelas dan dapat dicabut.

Jika pengguna tidak mengambil foto, postingan dapat memakai foto resmi item/menu dari katalog merchant sesuai izin dan pengaturan. Jika pengguna memiliki foto pribadi, ia dapat memilih foto tersebut sebagai media utama atau tambahan. Merchant terdorong menjaga kualitas foto, katalog, deskripsi, harga, dan promo karena materi katalog dapat tampil pada postingan pelanggan.

Postingan dapat memuat nama merchant/item, foto pribadi atau katalog, caption opsional, hashtag, serta kartu internal menuju item/merchant. Nominal transaksi adalah pilihan tampilan pengguna, bukan informasi yang otomatis dibuka. Bukti bayar mentah, nomor transaksi internal, metode pembayaran sensitif, saldo, dan data pelanggan tidak boleh bocor ke publik.

### 24.4 Tingkat bukti yang berbeda
Sistem harus membedakan:
1. **Sinyal lokasi:** perangkat mendeteksi pengguna di sekitar tempat. Ini bukan bukti kunjungan pasti atau transaksi.
2. **Kunjungan terkonfirmasi:** dapat didukung check-in/QR merchant, booking yang dipenuhi, atau mekanisme lain yang ditetapkan.
3. **Transaksi terverifikasi:** catatan transaksi sah yang berhasil dan terhubung ke akun, merchant, serta item. Hanya bukti backend ini yang dapat mendukung label transaksi terverifikasi.

Foto, caption, hashtag, geotag, klaim pengguna, dan geofence saja tidak cukup untuk label transaksi terverifikasi.

### 24.5 Satu pengalaman, beberapa tampilan
Gunakan satu objek pengalaman kanonis yang dapat ditampilkan sebagai review merchant, postingan feed, entri Trip/timeline, atau arsip privat. Hindari data pengalaman ganda yang tidak sinkron. Mengubah caption sosial tidak boleh mengubah fakta transaksi historis. Data internal transaksi tetap privat.

### 24.6 Review dan respons merchant
Review yang memenuhi syarat tampil di halaman merchant dengan label bukti yang sesuai. Owner dan staff yang memiliki izin menerima notifikasi review baru dan dapat membalas atau berkomentar dalam thread review; pengguna dapat menerima notifikasi balasan. Merchant tidak boleh menghapus atau memanipulasi review negatif secara sepihak. Pelaporan, moderasi, hak jawab, banding, dan penanganan review palsu perlu dirancang adil. Review memberi promosi organik sekaligus insentif menjaga layanan, produk, dan harga.

### 24.7 Kartu internal dan aturan tautan
Caption/komentar membatasi URL eksternal bebas. Teks dan hashtag diperbolehkan. Sistem menyediakan kartu internal terstruktur menuju profil pengguna/merchant, toko, item/menu, layanan, postingan, pengalaman, Trip, atau itinerary Pluits. Kartu transaksi membuka halaman item/merchant Pluits. Halaman tersebut menampilkan informasi terkini seperti harga, variasi, stok/status, promo, lokasi publik, layanan, dan review. Harga historis pada transaksi harus dibedakan dari harga saat ini.

### 24.8 Username dan mini-website
Pengguna dan entitas usaha/penyedia yang memenuhi syarat dapat memiliki username/slug unik dan URL publik Pluits. Pelaku usaha dapat membagikannya ke Instagram, Facebook, WhatsApp, dan kanal luar lainnya. Klik membuka halaman publik responsif seperti landing page/mini-website tanpa mengharuskan pengunjung memasang aplikasi atau login. Halaman usaha dapat menampilkan profil, kategori, foto, katalog/menu/layanan, harga publik, area layanan, jam operasional, review, serta tindakan kontak/pemesanan. Data privat tidak ditampilkan.

Username harus unik, case-insensitive, memiliki aturan karakter/panjang dan reserved names, serta perlindungan impersonasi. Nama tokoh publik, merek, dan institusi memerlukan kebijakan verifikasi, klaim identitas, pelaporan, dan penyelesaian sengketa. Hak username, perubahan, pemulihan, dan masa karantina belum ditetapkan final.

### 24.9 Promosi jasa dan vendor
Pengguna dapat membagikan pengalaman atau menawarkan jasa, misalnya rental mobil, freelancer, vendor, dan layanan lokal. Calon pelanggan diarahkan ke profil/halaman penyedia yang menampilkan layanan, cakupan lokasi, harga atau permintaan penawaran, status verifikasi, review, ketersediaan, dan cara memesan. Tidak semua penyedia harus berbentuk PT/CV/UD; verifikasi mengikuti kategori dan risiko layanan.

### 24.10 Barang bekas dan listing toko
Toko resmi pada marketplace tidak diperuntukkan bagi jual-beli barang bekas sesuai kebijakan yang sedang diuji. Barang bekas mungkin dapat disebut atau ditampilkan sebagai konten sosial pribadi, tetapi bukan otomatis listing katalog toko. Batas antara konten sosial, iklan, dan listing komersial harus diuji agar tidak menjadi celah spam atau perdagangan terselubung.

### 24.11 Pickup dan pengiriman
Halaman merchant dan checkout menjelaskan pilihan pemenuhan yang benar-benar tersedia: ambil sendiri/pickup, pengiriman oleh toko, atau pengiriman melalui mitra yang terintegrasi dan tersedia di wilayah tersebut. Layanan pengiriman pihak ketiga hanya dapat dipertimbangkan jika ada keputusan founder, integrasi resmi, dan kontrak backend yang jelas; penyedia lain tetap merupakan kemungkinan masa depan, bukan fitur yang sudah tersedia. Biaya, estimasi, cakupan, dan tanggung jawab harus transparan.

### 24.12 Trip Story
Trip menghubungkan perpindahan wilayah, itinerary, booking, aktivitas, dan pengalaman. Deteksi perjalanan lintas kota/negara dapat memicu draft Trip Story atau permintaan konfirmasi. Sistem membedakan perjalanan direncanakan, dipesan, dikunjungi, dan diselesaikan. Pengguna memilih apakah entri hanya tersimpan di Trip, dibagikan ke feed, atau keduanya. Deteksi lokasi latar belakang memerlukan izin eksplisit. Lokasi real-time, waktu persis, penginapan, teman perjalanan, dan rute privat tidak boleh otomatis dipublikasikan. Itinerary hanya dapat dibagikan/disalin sesuai pengaturan pemilik. Pilihan final draft, prompt, auto-share dan feed/Trip masih terbuka.

### 24.13 Kualitas, spam, dan moderasi
Kurangi beban moderasi dengan aturan produk yang dapat ditegakkan: pembatasan URL eksternal bebas, review terverifikasi hanya dari transaksi sah, promosi diarahkan ke halaman penyedia, rate limit, deteksi pola spam, report, block, mute, moderasi, banding, dan label jujur untuk konten berbayar/promosi/kunjungan/transaksi. Tidak ada sistem yang dapat menjamin 100% tidak ada postingan palsu. Tujuannya membuat klaim transaksi palsu jauh lebih sulit, memberi label tingkat bukti secara benar, dan menangani spam/penyalahgunaan.

### 24.14 Privasi dan pilihan berbagi
Nominal transaksi, nama item, tanggal, merchant, foto, dan lokasi harus memiliki aturan visibilitas jelas. Pengguna mengendalikan default berbagi dan pilihan per-posting. Pengguna dapat menarik izin berbagi konten sosial tanpa mengubah catatan transaksi historis yang wajib disimpan untuk operasional/sengketa/kepatuhan. Dasar hukum, retensi, persetujuan, pemrosesan lokasi, dan kebijakan data final harus ditinjau sebelum peluncuran.

### 24.15 Hipotesis pendapatan
Sumber pendapatan yang perlu diuji: biaya/komisi transaksi merchant atau booking; paket merchant/penyedia untuk fitur operasional, analitik, katalog, atau branding; promosi berbayar berlabel; biaya layanan transaksi/fulfillment jika ada nilai tambah; dan kemitraan logistik/perjalanan. Pendapatan tidak boleh mendorong review palsu, ranking berbayar tanpa label, atau feed yang didominasi iklan. Tarif, settlement, wallet, payment gateway, pajak, dan regulasi masih terbuka.

### 24.16 Urutan pembangunan yang disarankan
1. Sempurnakan fondasi sosial: profil publik, feed, post, komentar/balasan, like, share, save, hashtag, notifikasi, report/block, dan aturan tautan.
2. Bangun username dan halaman publik responsif untuk pengguna serta merchant/penyedia.
3. Bangun entity pengalaman, review, dan notifikasi merchant.
4. Integrasikan katalog/menu dan transaksi agar posting pengalaman berasal dari sumber transaksi sah.
5. Bangun kartu internal Pluits menuju item/merchant/layanan.
6. Bangun Trip timeline/Story dengan persetujuan dan kontrol privasi.
7. Kembangkan pickup/pengiriman dan integrasi mitra setelah alur inti tervalidasi.
8. Uji pendapatan setelah kualitas sosial dan pengalaman pengguna terbukti.

Ini rekomendasi produk; prioritas sprint aktual mengikuti audit kode/backend dan dependensi.

### 24.17 Pertanyaan terbuka
- Trip Story dibuat sebagai draft, meminta konfirmasi, atau auto-share setelah pengguna mengaktifkannya?
- Pengalaman transaksi default privat, Trip-only, feed, atau mengikuti pengaturan per akun?
- Nominal transaksi ditampilkan, disembunyikan, atau dipilih per posting?
- Foto katalog merchant menjadi default atau pengguna memilih terlebih dahulu?
- Merchant dapat memilih item mana yang boleh dipakai untuk posting pengalaman?
- Kapan transaksi memenuhi syarat review: pembayaran sukses, pesanan selesai, atau setelah masa komplain?
- Bagaimana menangani refund, partial refund, pembatalan, chargeback, dan review setelah transaksi dibatalkan?
- Apa bukti kunjungan terkonfirmasi tanpa transaksi?
- Bagaimana reserved username, verified identity, impersonasi, public figures, dan brand claims ditangani?
- Apa kebijakan final barang bekas, promosi jasa, tautan, spam, konten berbayar, dan iklan?
- Apa cakupan pickup, pengiriman merchant, layanan logistik terpisah yang pernah dipertimbangkan, dan integrasi pihak ketiga?
- Apa model monetisasi, komisi, biaya, dan mekanisme saldo/pembayaran?
- Apa persetujuan, retensi, dan batas pemrosesan lokasi serta data transaksi?



## 25. Pengalaman Sosial Berbasis Transaksi, Kehadiran Bersama, dan Reputasi Entitas — 8 November 2026

**Status:** Konsep bisnis tambahan dicatat dari arahan founder. Prinsip pengalaman sosial yang tersambung ke transaksi dan entitas resmi menjadi arah yang harus dirancang. Rincian UI, skema data, aturan persetujuan tag, kebijakan review, verifikasi merchant, pembayaran QR, dan implementasi masih memerlukan desain serta pengujian. Bagian ini melengkapi Bagian 24 dan tidak menghapus riwayat sebelumnya.

### 25.1 Prinsip utama: aktivitas nyata menjadi konten sosial
Pluits harus memberi cara yang alami bagi pengguna untuk membagikan pengalaman dari aktivitas yang benar-benar dilakukan, bukan mendorong orang membuat postingan promosi yang terasa dipaksakan. Contohnya makan di restoran, membeli produk, pergi ke barbershop atau salon, mengunjungi tempat wisata, menggunakan jasa teknisi, menghadiri acara, dan aktivitas lain yang terjadi melalui ekosistem Pluits.

Konten yang berasal dari transaksi atau kunjungan terkonfirmasi dapat menjadi tontonan sosial yang menarik bagi teman-teman pengguna. Namun postingan biasa tetap diperbolehkan. Sistem wajib membedakan postingan biasa, klaim lokasi, kehadiran yang dikonfirmasi, dan transaksi yang benar-benar diverifikasi. Tidak boleh memberi kesan seseorang membeli atau mengunjungi tempat jika bukti sistem tidak mendukungnya.

### 25.2 Siapa yang dapat membuat postingan pengalaman transaksi
Dalam satu kelompok teman yang makan bersama, orang yang melakukan pembayaran melalui Pluits dan memiliki transaksi sah dapat memulai postingan pengalaman berbasis transaksi tersebut. Pengguna lain yang ikut hadir dapat ditandai sebagai teman yang menyertai melalui mekanisme tag/undangan.

Contoh: empat teman makan bersama; tiga orang melakukan pembayaran melalui Pluits. Salah satu pembayar dapat membuat satu postingan pengalaman restoran dan mengundang teman-temannya untuk ditandai. Sistem menghubungkan postingan dengan transaksi yang relevan tanpa mengungkap bukti pembayaran mentah atau data sensitif.

Penandaan teman tidak boleh otomatis mengubah status teman tersebut menjadi pembeli atau pemilik transaksi. Teman yang ditandai perlu dapat menerima/menolak atau mengonfirmasi keikutsertaannya. Label transaksi terverifikasi melekat pada transaksi dan pembayar yang tercatat; status hadir bersama harus memakai bukti/konfirmasi yang sesuai. Satu transaksi tidak boleh digandakan menjadi beberapa transaksi hanya karena beberapa orang tampil pada satu postingan.

### 25.3 Kartu pengalaman pada feed
Kartu pengalaman di feed dapat menggunakan gambar utama resmi dari restoran/merchant/tempat sebagai latar atau cover, dengan identitas visual tempat yang konsisten dengan halaman publik/mini-website entitas. Di atas kartu dapat tampil beberapa gelembung foto profil pengguna yang hadir atau dikonfirmasi ikut, misalnya tiga avatar kecil yang terhubung secara visual ke lokasi tersebut.

Elemen kartu yang direncanakan:
- Foto utama merchant/tempat, diprioritaskan dari media resmi yang diizinkan.
- Nama merchant/tempat dalam ukuran ringkas.
- Alamat atau area publik yang relevan; jangan membuka alamat privat atau koordinat sensitif.
- Avatar pengguna yang membuat postingan dan teman yang telah menerima/terkonfirmasi ditandai.
- Ringkasan item/menu/layanan yang relevan, misalnya “Menikmati lobster bersama …”.
- Tautan internal ke merchant dan rincian item yang tercatat pada transaksi.
- Review/rating pengalaman jika pengguna memilih mengisinya.
- Nilai transaksi dapat ditampilkan secara opsional oleh pengguna; default dan kontrol privasinya harus dirancang jelas.

Kalimat ringkas seperti “Yanti menikmati lobster di [Restoran] bersama dua teman” dapat dibantu sistem berdasarkan item transaksi dan tag yang sudah dikonfirmasi. Teks otomatis harus faktual, dapat ditinjau pengguna sebelum dipublikasikan, tidak mengarang item atau peserta, dan tidak membocorkan informasi yang tidak disetujui.

### 25.4 Tautan ke rincian transaksi dan katalog merchant
Tautan pada kartu pengalaman mengarah ke halaman internal Pluits yang relevan. Pengguna yang membuka tautan dapat melihat merchant dan item/menu yang terkait dengan pengalaman tersebut, misalnya lobster dan item lain yang tercatat. Harga historis dan total transaksi hanya ditampilkan jika pemilik transaksi mengizinkan dan kebijakan privasi memperbolehkan.

Rincian transaksi yang ditampilkan harus merupakan snapshot historis yang berasal dari catatan transaksi sah, bukan harga katalog terbaru yang dianggap sebagai harga pembelian lama. Halaman merchant juga dapat menampilkan katalog/menu terkini secara terpisah. Data sensitif seperti nomor referensi pembayaran internal, token, detail rekening, kredensial, dan bukti bayar mentah tidak pernah ditampilkan sebagai konten publik.

### 25.5 Satu sumber data untuk postingan, review, dan profil merchant
Pengalaman yang sama harus memakai satu objek pengalaman kanonis dan dapat ditampilkan pada beberapa permukaan:
- Feed pengguna yang membuat postingan.
- Profil pengguna sebagai riwayat pengalaman yang dibagikan.
- Halaman merchant sebagai review/aktivitas pelanggan yang memenuhi syarat.
- Katalog atau halaman item terkait sebagai ringkasan review yang relevan.
- Notifikasi merchant dan thread respons.

Jika pengguna mengedit caption, media pilihan, visibilitas, atau bagian sosial yang diizinkan, tampilan yang berasal dari pengalaman yang sama harus tersinkron sesuai aturan. Perubahan sosial tidak boleh mengubah fakta transaksi, identitas merchant, item yang dibeli, waktu pembayaran, jumlah yang dibayar, atau status penyelesaian. Fakta transaksi bersifat immutable/append-only; koreksi transaksi hanya melalui mekanisme pembalik/penyesuaian resmi dengan audit, bukan edit postingan.

Jika pengguna menghapus atau menyembunyikan postingan, konten sosial dapat dihapus/disembunyikan sesuai kebijakan dan retensi. Catatan transaksi tetap ada untuk kebutuhan operasional, akuntansi, sengketa, keamanan, dan kewajiban hukum. Penghapusan postingan tidak boleh menghapus transaksi atau menghapus review yang wajib dipertahankan tanpa proses kebijakan yang sah. Pengguna perlu memahami dampak tindakan hapus/sembunyikan terhadap review merchant dan arsipnya.

### 25.6 Review merchant, kualitas pengalaman, dan batas rating
Review yang dibuat dari pengalaman/transaksi yang memenuhi syarat dapat tersinkron ke halaman merchant secara konsisten dan real-time atau mendekati real-time sesuai kemampuan sistem. Review harus menampilkan tingkat bukti yang benar: transaksi terverifikasi, kunjungan terkonfirmasi, atau feedback komunitas biasa.

Pengguna dapat memberi komentar pengalaman dan rating sesuai kebijakan yang akan ditetapkan. Founder mengusulkan pembatasan agar review publik tidak dapat memberi bintang 1 atau 2 dan nilai terendah yang dapat diberikan adalah 3, dengan tujuan menjaga komunitas tetap relevan dan tidak menjadi ruang serangan buruk. **Usulan batas minimum tiga bintang ini dicatat sebagai PROPOSED / perlu evaluasi, belum menjadi aturan final.** Sebelum disahkan, evaluasi risiko distorsi reputasi, hilangnya informasi kualitas, perlindungan konsumen, kewajiban hukum, dan kepercayaan pengguna. Alternatif yang perlu dikaji termasuk review privat untuk keluhan serius, jalur komplain/sengketa, moderasi terhadap penyalahgunaan, dan pemisahan rating publik dari laporan keselamatan/layanan.

Rating merchant harus dihitung dari review yang memenuhi syarat dan tidak boleh dimanipulasi oleh merchant, staf, pembayaran, atau promosi berbayar. Review palsu, transaksi mandiri yang direkayasa, tekanan kepada pelanggan, imbalan untuk rating positif, dan penghapusan kritik secara sepihak harus dicegah.

### 25.7 Respons merchant pada postingan dan halaman resmi
Ketika pengalaman/review baru dipublikasikan dan memenuhi aturan, owner serta staff merchant yang memiliki izin menerima notifikasi. Notifikasi dapat membuka langsung postingan feed pelanggan agar merchant bisa membalas secara kontekstual, misalnya mengucapkan terima kasih atau menjawab pertanyaan.

Respons merchant juga dapat tampil pada halaman merchant/review yang tersinkron dengan pengalaman yang sama. Respons harus memiliki identitas entitas dan pengelola yang jelas. Merchant tidak boleh mengubah postingan pelanggan, menghapus review, atau mengedit fakta pengalaman. Pengguna tetap mengendalikan postingan pribadinya; merchant hanya mengelola balasan dari sisi entitas.

### 25.8 Jenis entitas dan identitas pengelolanya
Model harus mendukung berbagai entitas fisik dan penyedia layanan, bukan hanya restoran: toko, restoran, kafe, barbershop, salon, tempat wisata, hotel, fasilitas, penyelenggara acara, komunitas, penyedia jasa, dan merchant lokal lainnya.

Entitas mempunyai profil resmi sendiri, lokasi/area, kategori, foto utama seperti homepage, katalog/menu/layanan, jadwal, pengumuman, promo, event, pemesanan/tiket, dan pengikut sesuai jenisnya. Entitas bukan akun manusia. Satu atau beberapa identitas personal dapat ditautkan sebagai owner, pengelola, atau staff dengan izin berbeda. Akun personal pengelola tetap terpisah dari profil resmi entitas; pengunjung dapat mengikuti entitas tanpa harus mengikuti kehidupan pribadi owner.

### 25.9 GeoDirectory, penemuan lokal, dan verifikasi keberadaan
Pluits diarahkan menjadi GeoDirectory: pengguna dapat mengeksplorasi tempat, merchant, layanan, komunitas, dan acara di sekitar wilayahnya berdasarkan kategori, lokasi, kebutuhan, dan minat. Profil entitas harus terhubung ke titik/area lokasi yang tepat dengan kontrol privasi sesuai jenis entitas.

Verifikasi dapat mencakup identitas pengelola, kewenangan mengelola entitas, dokumen usaha/izin sesuai kategori dan risiko, bukti lokasi fisik atau area layanan, serta validasi lapangan jika diperlukan. Tingkat verifikasi harus dijelaskan; badge tidak boleh menyiratkan hal yang belum diperiksa. Laporan pengguna tentang lokasi palsu, impersonasi, entitas fiktif, atau informasi menyesatkan masuk ke alur investigasi, bukti, hak jawab/banding, pembatasan sementara jika berisiko, dan penghapusan bila pelanggaran terbukti. Keberadaan tempat tidak boleh hanya diasumsikan benar karena pin peta atau klaim pemilik.

### 25.10 QR merchant dan pembayaran yang dapat digunakan lintas merchant
Arah jangka panjang adalah pembayaran merchant yang mudah digunakan di banyak merchant terdaftar—dari toko kecil hingga bisnis besar—melalui QR/barcode dan integrasi penyedia pembayaran yang sesuai. Pluits tidak harus menjadi wallet transfer antarbank atau transfer antarindividu. Fokusnya adalah memfasilitasi pembayaran pembelian/layanan merchant dan menerima konfirmasi transaksi yang sah untuk menghubungkan aktivitas ke akun, merchant, dan item.

Alur target:
1. Pengguna memilih merchant/item/layanan atau memindai QR merchant.
2. Sistem membuat konteks pembayaran yang terikat ke merchant dan rincian order yang benar.
3. Pembayaran diproses oleh penyedia pembayaran/kanal yang berizin dan sesuai skema yang dipilih.
4. Status berhasil dikonfirmasi melalui callback/API tepercaya dan direkonsiliasi; screenshot atau klaim pengguna tidak cukup.
5. Pluits mencatat transaksi dan snapshot item/nominal/status secara aman.
6. Setelah memenuhi syarat, pengguna dapat memilih membuat postingan pengalaman, review, atau bukti aktivitas.
7. Settlement merchant, refund, pembatalan, sengketa, rekonsiliasi, fraud, biaya, pajak, dan kepatuhan ditangani dengan desain tersendiri.

Dukungan QRIS atau metode pembayaran tertentu harus melalui penyedia/mitra berizin dan kajian teknis serta regulasi. Jangan menyatakan Pluits sebagai penerbit, wallet, penyelenggara jasa pembayaran, atau pemegang dana sebelum status dan izin modelnya dipastikan. Saldo/wallet transfer bukan bagian yang otomatis disetujui oleh arah ini.

### 25.11 Prinsip keamanan, privasi, dan anti-penyalahgunaan
- Berbagi pengalaman tidak otomatis aktif hanya karena pembayaran berhasil; pengguna mengendalikan publikasi dan detail yang ditampilkan.
- Tag teman memerlukan kontrol penerimaan/penolakan, pembatalan tag, dan pelaporan. Tag bukan bukti transaksi teman tersebut.
- Pengguna dapat menyembunyikan nominal, item tertentu, atau seluruh detail pembelian sesuai aturan; informasi sensitif tidak boleh bocor melalui kartu feed, metadata gambar, notifikasi, atau URL.
- Merchant tidak dapat mengubah transaksi atau postingan pelanggan; pengelola hanya membalas dan mengelola profil/katalog miliknya.
- Satu pengalaman kanonis mencegah jumlah review, konten, dan ringkasan katalog tidak sinkron.
- Sediakan report, block, mute, moderation, appeal, rate limits, deteksi transaksi palsu, review palsu, tag spam, lokasi palsu, dan penyalahgunaan identitas.
- Geolokasi perangkat hanya sinyal tambahan; jangan menyatakan kehadiran pasti dari GPS/geofence saja.
- Perubahan konten sosial dan status transaksi harus dipisahkan secara teknis, memiliki audit trail, dan mematuhi retensi serta permintaan privasi yang sah.

### 25.12 Status keputusan dan pertanyaan yang masih terbuka
**Arah yang dicatat:** pengalaman sosial dari transaksi nyata; pembayar yang sah dapat memulai postingan; teman dapat ditandai dengan persetujuan; kartu feed terhubung ke merchant dan item; pengalaman/review tersinkron ke halaman merchant; merchant dapat merespons; entitas mempunyai profil resmi yang dikelola identitas manusia; GeoDirectory lokal; pembayaran merchant melalui QR/barcode dan mitra pembayaran; fakta transaksi tidak dapat diedit melalui editor postingan.

**Masih perlu diputuskan/desain:** apakah satu atau beberapa pembayar dapat menjadi co-author; bagaimana membagi item/menu di antara peserta; apakah teman yang ditandai perlu QR/konfirmasi merchant; kapan review memenuhi syarat (paid, fulfilled, atau setelah masa komplain); aturan edit/hapus postingan dan review; model rating minimum tiga bintang (masih usulan); apakah review buruk diarahkan ke komplain privat atau tetap ada rating rendah yang jujur; cara menghitung rating merchant; verifikasi lokasi dan kewenangan pengelola; skema QR/payment provider, settlement, refund, biaya, pajak, dan regulasi; serta retensi data transaksi dan persetujuan berbagi.


## 26. Konsolidasi final identitas produk, Local Marketplace, Trip, dan GeoDirectory — 8 November 2026

**Status:** Keputusan founder terbaru. Bagian ini memperjelas dan menggantikan bagian terdahulu yang masih membatasi Pluits pada konstruksi atau memisahkan kategori My Bali dari cakupan Pluits. Sejarah keputusan lama tetap dipertahankan; jika ada pertentangan, Bagian 26 menjadi acuan terbaru.

### 26.1 Identitas produk
Nama produk dan ekosistem adalah **Pluits**. Arah marketplace khusus konstruksi telah digantikan oleh ekosistem Pluits yang mencakup Social Media, Local Marketplace, Trip, dan GeoDirectory. Fungsi logistik/delivery, jika kelak dibutuhkan, menjadi salah satu kemampuan layanan di dalam Pluits, bukan identitas atau produk terpisah.

Repository kanonis telah menggunakan nama `baguskristiansianturi/pluits`. Referensi repository dan URL lama telah dipensiunkan; seluruh dokumentasi, workflow, dan integrasi aktif harus memakai repository dan Pages Pluits.

### 26.2 Tiga ruang produk dengan siklus yang berbeda
Pluits mempunyai tiga ruang utama yang terhubung melalui satu identitas dan ekosistem, tetapi masing-masing memiliki tujuan, model data, siklus pengguna, serta alur operasional sendiri:

1. **Social Media / Community:** pengalaman sosial yang diadopsi dari konsep My Bali menjadi fondasi utama Pluits. Meliputi feed, profil, Stories/Status, Reels/video, Explore, follow/pertemanan, like, komentar, share, save, chat, notifikasi, privasi, dan moderasi. Konten umum tetap menjadi inti; tidak harus berasal dari transaksi atau perjalanan.
2. **Local Marketplace:** ruang jual-beli berbagai produk dan layanan lokal. Kategori bisnis, kategori produk, serta pola discovery lokal yang dikembangkan dalam My Bali tetap menjadi referensi dan diadopsi sesuai kebutuhan. Marketplace bukan khusus konstruksi. Namun siklusnya berdiri sendiri: onboarding seller/provider, katalog, kategori, harga, variasi, stok/ketersediaan, area layanan, cart/checkout, pembayaran, order, fulfillment/pickup/delivery, refund, sengketa, dan review. Kebijakan pemenuhan lokal/same-day berlaku sesuai keputusan dan konfigurasi kategori; jangan menyamakan siklus Marketplace dengan Trip.
3. **Trip:** ruang untuk menemukan, merencanakan, memesan, dan mendokumentasikan perjalanan/kunjungan. Cakupannya termasuk restoran, kafe, destinasi wisata, monumen, gereja, sekolah, tempat budaya, fasilitas publik, akomodasi, event, aktivitas, rental, dan transportasi. Trip berpusat pada tujuan kunjungan, itinerary, tanggal, booking/reservasi bila relevan, ketersediaan, check-in/kunjungan, dan Trip Experience. Tidak semua tempat yang tercantum harus dapat dipesan; sebagian hanya merupakan tujuan/informasi yang dapat dikunjungi.

Ketiga ruang tersebut tidak boleh dilebur menjadi satu siklus transaksi generik. Produk barang Marketplace, layanan lokal, reservasi restoran, tiket/aktivitas, akomodasi, dan kunjungan tanpa booking dapat memiliki entitas, status, persyaratan, pembayaran, dan fulfillment yang berbeda.

### 26.3 GeoDirectory sebagai direktori universal dan lapisan peta bersama
**GeoDirectory adalah direktori lokasi universal**, bukan hanya fitur Trip dan bukan hanya daftar merchant Marketplace. Satu sistem direktori menyatukan entitas/tempat yang memiliki lokasi atau area relevan, termasuk toko, restoran, kafe, tempat wisata, monumen, gereja, sekolah, hotel, fasilitas, alamat, penyedia layanan, komunitas, event, dan kategori lain yang disetujui.

Setiap entri yang memenuhi syarat dapat ditampilkan sebagai pin pada peta. Pin dapat dibedakan melalui kategori/jenis entitas, ikon, filter, status, dan tingkat verifikasi. Pengguna dapat mencari, memfilter, membuka detail, melihat informasi publik, dan berpindah ke tindakan yang sesuai: membuka katalog Marketplace, melihat informasi Trip, membuat itinerary, meminta reservasi, menghubungi penyedia, atau sekadar melihat lokasi.

GeoDirectory menjadi lapisan discovery bersama yang menghubungkan Social, Marketplace, dan Trip, tetapi tidak menggantikan ketiganya. Satu entitas dapat muncul di beberapa konteks tanpa membuat data tempat duplikat. Contoh: restoran yang sama memiliki satu profil entitas dan satu lokasi kanonis; ia dapat ditemukan melalui GeoDirectory, menjadi tujuan Trip, dan menyediakan katalog/order melalui Marketplace jika merchant mengaktifkan fungsi tersebut.

Model data harus membedakan entitas, kategori, lokasi fisik, area layanan, alamat publik, koordinat/pin, jam operasional, status verifikasi, dan kapabilitas yang tersedia. Tidak semua alamat otomatis menjadi bisnis, tidak semua tempat menyediakan transaksi, dan tidak semua entitas harus mempunyai katalog.

### 26.4 Adopsi kategori dan konsep My Bali
Kategori bisnis, tempat, aktivitas, dan layanan dari My Bali tetap digunakan sebagai bahan dasar taxonomy Pluits. Kategori tersebut harus disusun ulang menjadi taxonomy universal yang dapat dipakai oleh GeoDirectory, Trip, dan Local Marketplace dengan pemetaan yang sesuai. Satu kategori dapat digunakan lintas modul, tetapi tindakan dan siklusnya ditentukan oleh modul yang bersangkutan.

Contoh: restoran dapat menjadi tempat pada GeoDirectory, tujuan kunjungan/reservasi pada Trip, dan merchant katalog makanan pada Marketplace. Gereja, sekolah, atau monumen dapat menjadi lokasi dan tujuan Trip/GeoDirectory tanpa harus diperlakukan sebagai toko. Toko dapat memiliki pin GeoDirectory dan katalog Marketplace, tanpa otomatis menjadi destinasi Trip berfitur booking.

### 26.5 Prinsip identitas, data, dan pengalaman terpadu
Satu akun manusia tetap berlaku lintas Social, Marketplace, Trip, dan GeoDirectory. Entitas resmi mempunyai profil terpisah yang dikelola owner/staff dengan izin. Satu lokasi/entitas kanonis dapat ditautkan ke konten sosial, listing Marketplace, itinerary, booking, review, dan pengalaman kunjungan melalui relasi data yang konsisten.

Feed sosial mengambil fondasi pengalaman sosial My Bali, tetapi Pluits memakai identitas, nama, dan desain produknya sendiri. Postingan biasa tetap diperbolehkan. Tag lokasi atau pin tidak otomatis membuktikan kunjungan; booking tidak otomatis membuktikan kehadiran; pembayaran tidak otomatis memublikasikan konten.

### 26.6 Prioritas audit dan perubahan implementasi
Sebelum mengubah struktur aplikasi secara luas, audit repo/backend untuk menemukan identitas dan asumsi produk lama, asumsi khusus konstruksi, kategori lama, model toko, navigasi, route, database, storage, auth redirect, environment, workflow, dan konfigurasi Pages. Buat migrasi bertahap agar data historis dan URL yang masih dipakai tidak rusak.

Urutan kerja: (1) tetapkan Pluits sebagai nama produk di UI dan dokumentasi; (2) petakan taxonomy My Bali ke GeoDirectory, Trip, dan Marketplace; (3) pisahkan siklus transaksi Marketplace dari siklus itinerary/booking/kunjungan Trip; (4) rancang GeoDirectory universal dengan pin dan filter; (5) pertahankan fondasi sosial My Bali sebagai pengalaman utama; (6) audit dan migrasikan backend/frontend berdasarkan dependensi; (7) rename repository menjadi `pluits` saat dapat dilakukan, lalu perbarui Pages dan integrasi; (8) uji di perangkat mobile dan akun nyata.

Tidak ada fitur yang boleh ditandai selesai hanya karena arah bisnis telah diputuskan. DECIDED, DESIGNED, IMPLEMENTED, DEPLOYED, TESTED, dan ACCEPTED tetap merupakan status yang berbeda.


## 27. Identitas manusia, klaim direktori, penyedia resmi, dan moderasi seimbang
**Tanggal keputusan: 8 November 2026**

Bagian ini memperjelas dan melengkapi Bagian 23–26. Pluits bukan sekadar media sosial dengan direktori dan toko tambahan. Pluits dibangun sebagai ekosistem identitas yang menghubungkan manusia, tempat, organisasi, penyelenggara, komunitas, dan penyedia barang/jasa dalam satu platform global dengan pengalaman lokal.

### 27.1 Direktori tersedia sebelum pengelola mendaftar
GeoDirectory harus dapat menampilkan entitas tempat sebelum pemilik atau pengelolanya memiliki akun Pluits. Pengguna dapat menemukan tempat berdasarkan lokasi, kategori, dan kebutuhan: pantai, destinasi, restoran, hotel, masjid, gereja, sekolah, yayasan, fasilitas umum, monumen, komunitas, penyelenggara acara, dan entitas lain yang relevan.

Data awal dapat berasal dari sumber peta/direktori pihak ketiga atau sumber terbuka yang sah. Pengambilan data, scraping, penyimpanan, penayangan, atribusi, dan pembaruan wajib mematuhi lisensi, API terms, hak basis data, privasi, dan ketentuan sumber. Jangan mengasumsikan data Google Maps bebas di-scrape atau disalin. Prioritaskan integrasi resmi atau sumber dengan izin yang jelas. Data impor harus memiliki provenance/sumber, waktu pembaruan, status verifikasi, dan mekanisme koreksi/penghapusan.

Direktori awal bukan bukti kepemilikan, keaslian, kualitas, atau dukungan resmi terhadap suatu tempat. Profil yang belum diklaim harus diberi status yang jujur, dan pengguna dapat mengusulkan koreksi atau melaporkan duplikasi.

### 27.2 Klaim tempat dan pengelola terverifikasi
Pada halaman tempat tersedia tindakan **Klaim tempat ini**. Pemohon masuk menggunakan identitas personal, lalu mengajukan bukti hubungan dan kewenangan atas tempat/organisasi tersebut. Proses klaim dapat meminta dokumen, email/domain resmi, bukti operasional, surat kuasa, atau verifikasi lain sesuai kategori dan risiko.

Klaim tidak otomatis disetujui hanya karena pemohon membuat akun atau mengklik tombol. Pluits memeriksa duplikasi klaim, konflik pengelola, bukti kewenangan, dan risiko pengambilalihan akun. Setelah disetujui, identitas personal pemohon memperoleh role pengelola pada entitas terkait dengan permission yang terbatas dan dapat dicabut. Riwayat perubahan dan pergantian pengelola harus tercatat.

Tidak semua tempat memiliki pemilik komersial. Tempat ibadah, fasilitas publik, monumen, sekolah, komunitas, yayasan, dan lokasi alam dapat memiliki pengelola, badan penanggung jawab, otoritas, atau kontributor informasi yang berbeda. Label role harus akurat: pemilik, pengelola resmi, admin yang diberi kuasa, kontributor, atau pihak yang belum diverifikasi tidak boleh disamakan.

### 27.3 Satu identitas manusia, banyak peran
Satu manusia menggunakan satu identitas personal utama. Dari identitas itu ia dapat memiliki atau memperoleh peran berbeda: individu, pendiri/pemilik usaha, staf toko, pengelola tempat, pengurus yayasan, penyelenggara acara, penyedia layanan, kreator, atau anggota komunitas. Peran tidak memerlukan pembuatan akun manusia terpisah, tetapi akses organisasi harus memakai role-based permissions, persetujuan, audit log, dan mekanisme pencabutan.

Pluits dapat membangun reputasi dan kepercayaan berbasis bukti, tetapi bukan memberi cap bahwa seseorang selalu baik atau buruk. Identitas terverifikasi, kewenangan pengelola, kepatuhan komunitas, dan rekam transaksi adalah sinyal berbeda yang harus dijelaskan terpisah.

### 27.4 Donasi dan dukungan untuk tempat/organisasi
Halaman tempat atau organisasi dapat menyediakan informasi cara mendukung, berdonasi, menjadi relawan, atau mengikuti kegiatan. Untuk donasi uang, penerima, tujuan, biaya, bukti penerimaan, status penyaluran, dan pihak pemroses harus transparan. Pemrosesan dana perlu menggunakan penyedia pembayaran/mitra yang sesuai ketentuan hukum; Pluits tidak boleh mengklaim menampung atau mengelola dana sebagai lembaga berizin jika model dan izinnya belum tersedia. Donasi tidak boleh diaktifkan sebagai fitur pembayaran langsung sebelum due diligence penerima, perlindungan donor, dan kepatuhan diselesaikan.

### 27.5 Akun personal versus penyedia/toko resmi
Akun personal boleh membagikan, mempromosikan, menawarkan, atau menjual barang dan jasa sebagai aktivitas individu sesuai kebijakan kategori. Namun, UI harus menjelaskan bahwa akun tersebut adalah akun personal, bukan otomatis toko resmi, pemilik merek, produsen, distributor, atau penyedia langsung. Pengguna harus dapat melihat siapa pihak yang menawarkan dan apa status verifikasinya.

Toko/penyedia resmi memiliki profil entitas dan proses verifikasi sesuai jenis usaha serta risiko. Konsep inti Marketplace adalah membantu pengguna menemukan sumber yang benar-benar bertanggung jawab atas produk atau layanan—bukan rantai perantara yang menyamarkan asal barang. Klaim produsen, pemilik, distributor resmi, atau penyedia langsung harus dibuktikan dan tidak boleh diberikan hanya karena akun membayar biaya atau mengisi profil.

### 27.6 Perlindungan transaksi di dalam dan di luar Pluits
Transaksi yang dibuat dan diproses melalui alur Pluits harus memiliki catatan yang dapat diaudit: pihak, item/layanan, harga, persetujuan, status pembayaran melalui mitra, pemenuhan, komunikasi relevan, dan bukti sengketa sesuai kebijakan privasi/retensi. Perlindungan yang dijanjikan harus dibatasi pada cakupan program dan proses yang benar-benar tersedia.

Jika pengguna bertransaksi di luar Pluits, transaksi itu tidak otomatis tercatat, diverifikasi, atau dilindungi oleh sistem Pluits. UI wajib menyampaikan hal ini secara jelas dan tidak menjanjikan penanganan sengketa untuk transaksi yang tidak memiliki bukti di platform. Pluits juga tidak boleh menyimpulkan bahwa semua transaksi di luar platform pasti penipuan.

### 27.7 Moderasi konten yang proporsional dan kontekstual
Pluits mempertahankan pengalaman sosial dan alat pembuatan konten yang ringkas dari konsep My Bali: kamera, unggah foto/video, Stories/Status, Reels, feed, profil, interaksi, privasi, dan pengaturan distribusi konten. Pengalaman ini menjadi bagian inti Pluits, bukan modul terpisah.

Moderasi harus membedakan ketelanjangan/eksploitasi seksual, konten seksual eksplisit, kekerasan grafis, pelecehan, eksploitasi, dan konten berbahaya dari konten non-eksplisit yang sah dalam konteks sosial, budaya, olahraga, kesehatan, atau wisata. Contoh: foto orang berbikini di pantai tidak otomatis diklasifikasikan sebagai konten seksual terlarang. Konten tertentu dapat diberi label/peringatan sensitif dan interstitial “Apakah Anda ingin melihat?” dengan pengaturan pengguna dan pembatasan usia yang sesuai. Label sensitif bukan pengganti penghapusan untuk konten yang memang dilarang.

Konten seksual yang melibatkan anak, eksploitasi seksual, kekerasan seksual, dan kategori ilegal/berbahaya harus ditangani dengan standar perlindungan tertinggi. Penilaian mempertimbangkan konteks, bukan semata-mata deteksi kulit atau bentuk tubuh. Sistem perlu menyediakan pelaporan, moderasi manusia untuk kasus penting, penjelasan tindakan, banding, dan audit kesalahan.

### 27.8 Penegakan perilaku, bukan diskriminasi identitas
Pembatasan akun harus didasarkan pada perilaku dan pelanggaran kebijakan yang dapat dibuktikan—misalnya penipuan, pelecehan, ancaman, spam terkoordinasi, eksploitasi, atau pelanggaran keselamatan—bukan penampilan fisik, agama, etnis, kebangsaan, status sosial, atau pandangan pribadi yang dilindungi. Gunakan tindakan bertingkat: peringatan, pembatasan fitur/jangkauan, penghapusan konten, suspensi sementara, hingga penghentian akun untuk pelanggaran berat atau berulang. Sediakan alasan yang jelas, jalur banding, peninjauan manusia, dan perlindungan dari laporan palsu/serangan massal. Hindari skor “manusia baik/buruk” yang tidak transparan atau keputusan otomatis tanpa akuntabilitas.

### 27.9 Prinsip lintas modul
GeoDirectory adalah lapisan entitas dan lokasi universal. Sebuah tempat dapat ditemukan di peta, menjadi destinasi Trip, memiliki profil komunitas, mengadakan event, menerima dukungan/donasi yang sah, atau menghubungkan katalog Marketplace jika memang menawarkan barang/jasa. Tidak semua tempat adalah toko, tidak semua organisasi menerima donasi, dan tidak semua lokasi dapat dipesan.

Marketplace tetap memiliki siklus onboarding penyedia, katalog, pesanan, pembayaran, pemenuhan, pengembalian, dan sengketa. Trip tetap memiliki siklus penemuan destinasi, itinerary, jadwal, reservasi bila relevan, kunjungan, dan pengalaman. Social Media tetap dapat memuat ekspresi personal biasa yang tidak harus berasal dari transaksi atau perjalanan.

### 27.10 Status keputusan dan pekerjaan lanjutan
Keputusan produk di bagian ini berstatus DECIDED sebagai arah model bisnis. Belum berarti fitur direktori pra-pendaftaran, klaim tempat, verifikasi role, donasi, moderasi, atau perlindungan transaksi telah IMPLEMENTED, DEPLOYED, TESTED, atau ACCEPTED.

Prioritas desain/implementasi: (1) model canonical place/entity dan sumber/provenance data; (2) alur klaim tempat dan verifikasi pengelola; (3) identitas personal dan role organisasi; (4) label akun personal versus penyedia resmi; (5) bukti transaksi on-platform; (6) kebijakan moderasi kontekstual dan banding; (7) kebijakan donasi dan mitra pembayaran; (8) integrasi pengalaman kamera/sosial My Bali ke Pluits. Semua perubahan harus diuji pada perangkat mobile.


## 28. Spesifikasi final GeoDirectory lokal-first dan personalisasi adaptif
**Tanggal keputusan: 8 November 2026**

### 28.1 Keputusan produk
- Prioritas lokasi **nearby**: rekomendasi mengutamakan tempat dekat pengguna jika izin lokasi diberikan; fallback ke area pilihan atau area profil yang memang dipilih pengguna.
- Beranda **hybrid**: gabungan feed sosial, rekomendasi tempat, aktivitas lokal, produk, layanan, komunitas, dan event. Feed akun yang diikuti tetap mendapat ruang.
- Cakupan **local-first**: peluncuran data dimulai dari Bali/Denpasar, lalu diperluas bertahap. Skema tetap global-ready, tidak dikunci pada struktur wilayah Indonesia.
- Personalisasi **adaptive**: sistem belajar dari minat dan interaksi yang wajar dengan kontrol, transparansi, dan opsi reset/nonaktif.
Keputusan ini DECIDED, bukan bukti fitur telah dibangun.

### 28.2 Prinsip GeoDirectory
GeoDirectory adalah lapisan identitas entitas dan lokasi universal, bukan direktori Trip saja atau Marketplace saja. Satu entitas kanonis dapat muncul di peta, pencarian, Beranda, Trip, profil komunitas, dan Marketplace tanpa menggandakan identitas.

Jenis entitas: tempat fisik (pantai, destinasi, monumen, rumah ibadah, sekolah, fasilitas, taman, alamat); organisasi/pengelola (yayasan, komunitas, lembaga, badan usaha); penyedia (toko, restoran, produsen, distributor, jasa); serta kegiatan (event, aktivitas, pengalaman). Tidak semua tempat adalah bisnis atau dapat dipesan.

### 28.3 Wilayah dan fallback lokasi
Area uji pertama Denpasar, lalu Bali secara bertahap. Setiap permintaan nearby menggunakan urutan fallback: (1) koordinat perangkat dengan izin, (2) area pilihan manual, (3) kota/provinsi profil yang dipilih untuk personalisasi, (4) jelajah tanpa personalisasi lokasi. GPS bukan kewajiban. Jangan menyimpan tracking lokasi presisi terus-menerus atau mengekspos koordinat rumah/pengguna.

### 28.4 Model data target
Nama tabel adalah rancangan dan wajib direkonsiliasi dengan schema aktif sebelum migration:
- `directory_entities`: ID kanonis, slug, entity_type, nama, deskripsi, status publikasi/verifikasi.
- `directory_entity_categories`: banyak kategori per entitas.
- `directory_locations`: entity_id, alamat terstruktur, country_code, area administratif, koordinat geography(Point,4326), akurasi dan sumber.
- `directory_entity_sources`: external source ID, provenance, lisensi/ketentuan, waktu impor/pembaruan, confidence.
- `directory_claims`: applicant, bukti, status pending/approved/rejected/disputed, reviewer, alasan, timestamps.
- `directory_memberships`: entity, user, role, permission, status, masa berlaku, pemberi akses.
- `directory_media`: foto/video, hak penggunaan, atribusi, moderasi, pemilik upload.
- `directory_relationships`: cabang dari, dikelola oleh, berada di dalam, terkait event.
- `user_interest_preferences`: minat eksplisit, kategori diikuti/disembunyikan, area, jarak, personalisasi on/off.
- `user_activity_events`: sinyal minimum seperti view, search, save, follow, click, hide, check-in.
- `user_recommendation_feedback`: not interested, show less, relevant, report.
- `user_saved_items` dan `user_recent_items`: wishlist/tersimpan dan baru dilihat lintas domain.
Keranjang/pesanan tetap berada di domain transaksi Marketplace; Trip memiliki lifecycle booking tersendiri. Jangan menggandakan tabel stores/products/posts yang telah ada.

### 28.5 Relasi lintas modul
Social post dapat menautkan entity; Trip destination mengacu ke entity GeoDirectory tetapi itinerary/booking/visit tetap domain Trip; Marketplace menghubungkan store/provider dan lokasi/cabang ke entity, sementara produk/offers/orders tetap domain Marketplace; event dapat menghubungkan organizer dan place. View bukan bukti kunjungan; posting di lokasi bukan bukti transaksi. Gunakan foreign key/ID kanonis.

### 28.6 Pencarian spasial
Gunakan PostGIS dengan geography(Point,4326), jarak meter, radius filter, dan GiST index. Query: filter publikasi/kategori/area → radius → deduplikasi → ranking. Map dan list memakai sumber hasil yang sama. Jarak boleh ditampilkan secara pembulatan tanpa membocorkan koordinat pengguna. Radius awal perlu diuji dan dapat diubah pengguna. PostGIS tersedia sebagai extension tetapi pada audit 8 November 2026 belum terpasang di database proyek; instalasi dan migration belum dilakukan.

### 28.7 Rekomendasi hybrid/adaptive
MVP tidak membutuhkan machine learning atau AI berbiaya tinggi. Gunakan ranking deterministik yang dapat dijelaskan dan diuji. Candidate pool: posting publik, akun diikuti, entitas direktori, produk/layanan, event, komunitas. Sinyal ranking: minat eksplisit, jarak/area, interaksi disengaja (follow/save/detail/click), freshness/jadwal, kualitas data/status verifikasi yang relevan, diversity kreator/kategori, serta penalti untuk konten disembunyikan/dilaporkan/bermasalah. Bobot awal harus diuji, bukan dianggap final. Hindari popularitas mentah sebagai satu-satunya ranking, engagement bait, kemarahan, dan polarisasi. Konten promosi harus diberi label.

Sediakan mode Untuk Anda dan Mengikuti. Pengguna dapat mengatur minat/area, menyembunyikan kategori, memberi feedback, reset rekomendasi, dan mematikan personalisasi. Jangan menyimpulkan agama, pandangan politik, kesehatan, orientasi, atau atribut sensitif dari aktivitas. Jangan membuat profil sensitif tanpa pilihan eksplisit pengguna.

### 28.8 Wishlist, recent, dan cart
Wishlist/tersimpan dan baru dilihat harus tersinkron lintas perangkat dengan RLS per pemilik. Guest state boleh lokal sementara dan digabung aman setelah login. Cart Marketplace harus memiliki state server-side; harga, stok, ongkir, pajak, dan ketersediaan divalidasi ulang server saat checkout. LocalStorage hanya cache UI, bukan sumber kebenaran transaksi. Cart Trip dipisah bila lifecycle booking berbeda.

### 28.9 Keamanan dan kualitas data
Semua tabel exposed memakai RLS. Preferensi, activity, saved, recent hanya dapat diakses pemilik sesuai kebijakan. Claim/membership memiliki authorization terpisah. Jangan gunakan user_metadata sebagai otorisasi; jangan ekspos service_role. Media memerlukan pemeriksaan kepemilikan/hak penggunaan dan moderasi. Deduplikasi memakai source ID yang sah, kemiripan nama/alamat/koordinat dan review; jangan otomatis menggabungkan entitas hanya karena berdekatan. Sediakan koreksi, laporan, audit, soft-delete, dan banding klaim.

### 28.10 Sumber data
Gunakan data sendiri, kontribusi komunitas termoderasi, sumber terbuka berlisensi, dan API resmi yang mengizinkan penggunaan. Jangan scraping atau menyalin Google Maps data/foto/reviews tanpa hak/izin. Simpan provenance dan ketentuan setiap sumber. Data impor bukan bukti klaim atau verifikasi.

### 28.11 Tahapan implementasi
1. Audit schema, RLS, RPC, bucket, frontend, dan taxonomy My Bali.
2. Finalisasi entity/category/area model dan strategi deduplikasi.
3. Pasang PostGIS melalui migration yang direview; buat entity/location/source core, GiST index, nearby RPC, RLS.
4. Bangun UI map/list/detail dan search/filter.
5. Bangun claims/memberships/roles/audit.
6. Hubungkan entitas ke Trip, Marketplace, event, social posts.
7. Bangun preferences/activity/feedback dan deterministic ranking.
8. Migrasikan wishlist/recent/cart ke backend dengan guest merge dan validasi server.
9. Uji mobile, RLS lintas akun, GPS granted/denied, duplikasi/klaim palsu, koneksi lambat, dan performa radius.

### 28.12 Audit baseline 8 November 2026
- Frontend memakai Vite/JavaScript modular dan hash routing; Beranda aktif masih berupa feed sosial dan shortcut Marketplace, belum nearby directory.
- `src/app/services.js` masih memakai katalog lokal untuk pencarian; `categoryService.list()` mengembalikan array kosong.
- `src/app/store.js` menyimpan cart, wishlist, recent, orders, dan user cache di localStorage; belum sinkron lintas perangkat atau menjadi sumber kebenaran transaksi.
- Supabase memiliki fondasi social/profile/follow, store/product, operating_regions, dan account preferences; belum ditemukan tabel GeoDirectory universal, entity locations/sources, claims, atau manager memberships.
- PostGIS dan pgvector tersedia sebagai extension tetapi belum terpasang pada database. PostGIS prioritas untuk nearby; vector/AI tidak diperlukan untuk MVP.
- Audit ini tidak mengubah schema, extension, frontend, atau deployment.


## 29. Implementasi inti GeoDirectory dan evaluasi tahap pertama
**Tanggal: 8 November 2026**

Bagian ini mencatat implementasi aktual setelah keputusan Bagian 28. Status yang dicatat hanya yang telah diverifikasi.

### 29.1 Status implementasi
- **DECIDED:** nearby, hybrid home, local-first Bali/Denpasar, adaptive personalization.
- **DESIGNED:** skema kanonis, RLS, PostGIS, claim, relationship, source provenance, user preferences, activity and feedback.
- **IMPLEMENTED (database):** PostGIS, kategori, entitas/lokasi, provenance, claims, memberships, preferences, activity, feedback, saved/recent, relationships, media metadata, social post links, dan Marketplace store link.
- **IMPLEMENTED (frontend):** home nearby preview, direktori list/map, search/category/radius/area, opt-in GPS, detail tempat, claim form, adaptive interest controls, feedback, saved places dan recent places.
- **DEPLOYED:** GitHub Actions Pages run #506 sukses pada commit `2432e4a81d8588eb46c62c9e3a10b18fafd00a03`. Migration SQL sesudahnya tidak mengubah frontend; workflow terbaru harus tetap diverifikasi setelah pembaruan dokumen.
- **TESTED (database):** query publik/anon, radius, kategori, invalid latitude, RLS, grants, private trigger execute, dan GiST index berhasil diperiksa.
- **ACCEPTED / UAT:** belum. Pengujian visual pada perangkat Android, akun nyata, GPS, klaim nyata, dan koneksi lambat masih menunggu pengujian pengguna.

### 29.2 Data awal dan sumber
Empat entitas awal yang dimasukkan: Museum Bali, Lapangan Puputan Badung, Pantai Pandawa, dan Pura Luhur Uluwatu. Referensi koordinat berbasis OpenStreetMap yang ditampilkan melalui Mapcarta; provenance, atribusi, dan ODbL metadata disimpan. Ini hanya starter set, bukan direktori Bali yang lengkap. Tidak ada scraping atau penyalinan Google Maps.

### 29.3 Keamanan klaim dan data
- RLS aktif pada seluruh tabel publik baru.
- Tabel sumber provenance, klaim, dan preferensi pribadi tidak dapat dibaca anon.
- Klaim hanya satu yang aktif per entitas. Trigger internal menandai klaim pending dan membuat membership setelah reviewer menyetujui.
- Client tidak dapat menyetujui klaim, mengubah role, atau memublikasikan media direktori.
- Media baru berstatus pending; alur upload Storage dan moderation console belum selesai.
- Lokasi perangkat hanya dipakai setelah tombol lokasi ditekan dan tidak disimpan sebagai tracking trail.

### 29.4 Batasan yang wajib dipertahankan
- Ranking tahap pertama deterministic, bukan AI/ML. Sinyal meliputi minat eksplisit dan aktivitas 90 hari, jarak, serta feedback.
- Wishlist dan baru dilihat untuk entitas GeoDirectory sudah server-side. Wishlist produk, keranjang, dan pesanan marketplace lama masih menggunakan localStorage dan belum dimigrasikan.
- Relasi stores dan social posts ke entitas sudah tersedia di schema, tetapi UI pengaitan dan backfill toko belum selesai.
- Trip belum terhubung karena lifecycle Trip belum selesai.
- Direktori baru memiliki empat data tempat; import terbuka yang berlisensi, deduplikasi, correction workflow, dan perluasan Bali masih diperlukan.
- Belum ada dashboard admin klaim, media, laporan data, dan banding.

### 29.5 Evaluasi dampak dan saran
1. GeoDirectory membuat halaman tempat tersedia sebelum pengelola mendaftar; ini membuka peluang klaim resmi tanpa mengharuskan setiap pengunjung membuat tempat baru.
2. Satu ID entitas mengurangi duplikasi tempat lintas Social, Marketplace, Event, dan Trip.
3. Data sumber dan status klaim harus selalu terlihat; imported/unclaimed tidak sama dengan official/verified.
4. Jangan membuat skor moral atau blacklist otomatis dari popularitas dan laporan tanpa bukti. Terapkan moderasi berbasis pelanggaran kebijakan, pemeriksaan manusia, alasan sanksi, dan banding.
5. Jangan menyimpulkan agama, politik, kesehatan, orientasi, atau atribut sensitif dari minat dan riwayat.
6. Bangun dashboard admin dan alur koreksi/deduplikasi sebelum memperbesar import data.
7. Prioritaskan UAT Android dan sinkronisasi commerce cart sebelum mengundang pengguna luas.

### 29.6 Referensi implementasi
- `docs/pluits/GEODIRECTORY-ARCHITECTURE.md`
- `docs/pluits/GEODIRECTORY-IMPLEMENTATION-REPORT-2026-11-08.md`
- `supabase/migrations/20261108040323_pluits_geodirectory_core.sql` dan migration lanjutan sampai `20261108041053_pluits_directory_sources_deny_client.sql`

### 29.7 Pemeriksaan performa dan keamanan tambahan
- Migration `20261108041216_pluits_directory_fk_indexes` menambahkan indeks untuk foreign key GeoDirectory yang ditemukan belum terindeks.
- Supabase Performance Advisor masih menunjukkan 14 foreign key tidak terindeks, semuanya berada pada tabel legacy Social/Marketplace (bukan tabel GeoDirectory baru). Perbaikannya perlu regresi dan review beban kerja terpisah.
- Advisor menampilkan 43 indeks belum digunakan; ini wajar pada tahap awal sebelum trafik nyata. Jangan menghapus indeks yang disiapkan untuk query/rencana fitur hanya berdasarkan statistik awal.
- Security Advisor tidak lagi melaporkan tabel sumber GeoDirectory tanpa policy. Dua peringatan SECURITY DEFINER lama (create_store/update_store_profile) dan leaked-password protection tetap ada; lihat laporan implementasi.

### 29.8 Penyempurnaan rekomendasi dan navigasi mobile
- Sinyal perilaku 90 hari memakai decay berdasarkan recency dan batas skor kategori agar satu kategori tidak mendominasi tanpa batas.
- UI mobile memiliki akses langsung ke GeoDirectory dari bottom navigation.
- Event follow/share/check-in/report sudah disiapkan pada schema tetapi integrasinya ke seluruh modul belum selesai; sinyal aktif saat ini terutama view/click/save/hide.

### 29.9 Pencabutan akses klaim
- Migration live `20261108041421_pluits_directory_claim_revocation` menautkan membership ke `source_claim_id`.
- Jika klaim yang sudah disetujui kemudian ditolak, disengketakan, atau ditarik, membership yang berasal dari klaim tersebut dicabut. Status verifikasi entitas tetap mempertimbangkan klaim lain yang masih disetujui.
- Trigger tetap berada di schema private, SECURITY DEFINER internal, tanpa EXECUTE untuk anon/authenticated.

## CP-026 — Pusat Pengaturan dan Aktivitas Pluits (8 November 2026)

- **Keputusan produk:** pusat pengaturan menjadi satu hub mobile-first yang terinspirasi pola navigasi Instagram, tetapi domain menu mengikuti model bisnis Pluits: identitas personal/profesional/bisnis, privasi, aktivitas sosial, GeoDirectory, Marketplace, Trip, Wallet, bantuan, dan kebijakan.
- **UI:** daftar menu berkelompok, deskripsi singkat, ikon monokrom, chevron, pembatas antarbagian, serta aksi Tambahkan akun/Keluar.
- **Rute:** `#/account/settings` menjadi hub; `#/account/content-settings` menjadi halaman pengaturan audiens yang sudah terhubung ke `account_content_preferences`.
- **Batas kemampuan:** kontrol sesi/perangkat, MFA, ekspor/penghapusan akun, dan status verifikasi tidak ditampilkan sebagai fitur aktif sebelum backend dan pengujian tersedia. Trip sementara mengarah ke GeoDirectory; bukan klaim modul Trip telah selesai.
- **Dokumentasi:** `docs/pluits/help/ACCOUNT-SETTINGS.md` menjadi panduan awal dan wajib diperbarui saat menu/fitur berubah.
- **Status:** kode di-commit; deployment dan Android UAT harus diverifikasi dari workflow serta perangkat pengguna.


## 30. Model bisnis Pluits terkonsolidasi — sumber acuan aktif (8 November 2026)

Bagian ini menyatukan visi produk dan prinsip lintas modul yang sebelumnya tersebar di Business Model Master, Master Product Vision, keputusan Social Experience Commerce, GeoDirectory, dan UX architecture. Rincian keputusan aktif pada bagian 23–29 tetap berlaku sebagai detail normatif.

### 30.1 Proposisi nilai dan ruang produk
1. **Social Media — ruang utama:** pengguna membuat dan menemukan konten foto, video, carousel, Stories, Reels, percakapan, komunitas, profil, dan interaksi. Konten personal biasa tetap diperbolehkan; feed bukan katalog iklan.
2. **Local Marketplace — ruang perdagangan:** pengguna menemukan penyedia, toko, produk, jasa, membandingkan penawaran, memesan, membayar melalui mekanisme yang didukung, dan memantau pemenuhan. Marketplace memiliki lifecycle katalog, cart, order, payment, fulfilment, cancellation/refund/dispute yang terpisah dari Social.
3. **Trip / Travel — ruang perjalanan:** pengguna menemukan destinasi, aktivitas, pengalaman, penyedia, membuat itinerary, mengajukan layanan, dan kelak melakukan reservasi/booking sesuai tipe produk. Permintaan layanan bukan booking terkonfirmasi.
4. **GeoDirectory — lapisan bersama:** identitas kanonis untuk tempat, organisasi, penyedia, dan kegiatan. Satu entitas dapat dihubungkan ke Social, Marketplace, Trip, peta, pencarian, dan profil tanpa menggandakan identitas. GeoDirectory bukan pengganti lifecycle transaksi atau Trip.

### 30.2 Identitas, peran, dan trust
- Satu akun Auth dan satu identitas manusia lintas modul. Peran pengguna (personal, owner, staff, creator, provider, organizer, moderator) bersifat kontekstual, terverifikasi sesuai risiko, dan tidak otomatis diberikan hanya karena memiliki akun.
- Profil personal dan profil toko/organisasi/penyedia adalah entitas berbeda yang dapat saling ditautkan secara eksplisit.
- Status imported, claimed, submitted, verified, published, suspended, atau rejected harus berbeda dan tidak boleh disamarkan.
- Tidak boleh ada toko, produk, review, transaksi, saldo, engagement, kunjungan, atau verifikasi palsu untuk menciptakan kesan ramai.
- Transaksi/kunjungan hanya boleh disebut terverifikasi jika ada bukti backend yang sah. Foto, caption, geotag, GPS, check-in, atau kedekatan lokasi sendiri bukan bukti pembayaran.

### 30.3 Prinsip pengalaman dan desain
- Mobile-first, responsif, installable web experience, dan hemat sumber daya untuk perangkat Android kelas rendah serta jaringan tidak stabil.
- Navigasi dan arsitektur informasi harus mengikuti ruang produk Pluits, bukan menyalin struktur platform lain secara membabi buta.
- UI konsisten, sederhana, aksesibel, kontras jelas, target sentuh memadai, status loading/empty/error/offline jelas, dan kontrol lanjutan ditempatkan secara kontekstual.
- Media asli tidak boleh diubah/crop destruktif. Pertahankan rasio/aspek dan komposisi; optimasi turunan boleh dibuat untuk delivery.
- Komponen, halaman, service, dan domain frontend harus modular dengan satu implementasi kanonis per fungsi. Hindari duplikasi komponen, route, source of truth, dan CSS yang saling menimpa.
- Setiap elemen interaktif harus terhubung ke aksi nyata; tombol dekoratif, mock data, dan link yang tidak menyelesaikan tugas tidak boleh dianggap selesai.

### 30.4 Prinsip backend dan data
- Backend adalah penjaga aturan bisnis dan sumber kebenaran data. Frontend tidak boleh menjadi otoritas harga, stok, saldo, hak akses, status transaksi, verifikasi, lokasi privat, atau keputusan moderasi.
- Setiap domain memiliki ownership data dan lifecycle yang jelas. Integrasi lintas domain menggunakan ID/foreign key kanonis dan kontrak terdokumentasi; jangan menggandakan data hanya untuk memudahkan UI.
- RLS, server-side authorization, validasi input, ownership checks, audit trail, rate limits, privacy boundaries, dan least privilege wajib diterapkan pada jalur yang relevan.
- Data pribadi, alamat lengkap, koordinat privat, transaksi, nominal, dan aktivitas sensitif hanya dibuka sesuai consent dan kebutuhan sah.
- Satu aturan bisnis harus didefinisikan sekali dan ditegakkan di backend; frontend menampilkan affordance dan state yang sesuai. Menyembunyikan tombol bukan kontrol keamanan.
- Perubahan schema harus melalui migration bertahap, kompatibel, dapat diuji, dan memiliki rencana rollback. Migration yang sudah diterapkan tidak dihapus atau ditulis ulang.

### 30.5 Kontrak sinkronisasi bisnis → backend → frontend
Setiap fitur/perubahan wajib mencatat: (1) bagian model bisnis dan status keputusan; (2) persona, masalah, user journey, aturan bisnis, edge cases, acceptance criteria; (3) entitas/data domain, state transitions, permission matrix, API/RPC contract, error semantics; (4) rute/halaman/komponen frontend serta loading, empty, success, error, retry, offline, accessibility; (5) test matrix untuk anon/roles, ownership, invalid state, privacy, concurrency, abuse, mobile, regression; (6) bukti implementasi, migration, commit, CI/deploy, test, UAT.
Jika UI meminta tindakan yang tidak didukung backend, jangan membuat simulasi seolah berhasil. Tandai belum tersedia/blocked dan masukkan ke roadmap setelah keputusan produk.

### 30.6 Prinsip keamanan, privasi, dan kualitas
- Privacy by design; lokasi presisi hanya jika dibutuhkan dan diizinkan, tanpa tracking terus-menerus secara default.
- Jangan menyimpulkan atau membuat profil atribut sensitif dari perilaku pengguna.
- Moderasi proporsional, berbasis perilaku/bukti/kebijakan, menyediakan alasan dan jalur banding; hindari diskriminasi identitas.
- External source harus memiliki provenance, lisensi, dan atribusi yang sah.
- Agent AI boleh menganalisis dan mengusulkan, tetapi tindakan production, permission, penghapusan data, credential, dan perubahan berisiko memerlukan persetujuan manusia serta audit trail.

### 30.7 Status keputusan
Bagian 30 adalah prinsip dan kontrak kerja yang disetujui sebagai aturan arah. Ia tidak menyatakan semua fitur telah diimplementasikan, dideploy, diuji, atau diterima. Status aktual hanya boleh diambil dari Project Status & Roadmap, Security Review, Live Audit, test evidence, dan UAT terbaru.
