# Pluits — Help Center, User Policies & Legal Content Blueprint

Tanggal: 8 November 2026  
Status: BLUEPRINT — struktur dan tata kelola untuk delivery bertahap. Bukan nasihat hukum dan bukan pernyataan bahwa semua kebijakan telah berlaku.

## 1. Tujuan

Pusat Bantuan, Syarat & Ketentuan, Kebijakan Privasi, Pedoman Komunitas, dan kebijakan fitur adalah bagian dari produk inti Pluits. Setiap hasil sharing founder, temuan UAT, perubahan model bisnis, dan perubahan teknis harus dipetakan ke dokumentasi pengguna pada checkpoint yang sama. Kebijakan tidak boleh menumpuk menjadi pekerjaan akhir menjelang peluncuran.

Prinsip:
- Satu keputusan dapat berdampak pada master bisnis, roadmap, spesifikasi, UI copy, bantuan pengguna, privacy disclosure, Terms, dan Community Guidelines.
- Catatan internal tidak otomatis menjadi ketentuan hukum. Hanya aturan relevan, jelas, disetujui, dan didukung implementasi yang boleh dipublikasikan sebagai kebijakan aktif.
- Jangan menjanjikan fitur yang belum tersedia. Status produk harus jelas: PLANNED, IN DEVELOPMENT, AVAILABLE, LIMITED, SUSPENDED, atau RETIRED.
- Bahasa bantuan harus sederhana, mobile-first, dan berisi langkah praktis.
- Setiap perubahan dapat ditelusuri: sumber keputusan, alasan, versi, tanggal efektif, commit, deployment, dan hasil uji.
- Privasi sejak desain: minimisasi data, tujuan yang jelas, kontrol pengguna, dan perlindungan lokasi presisi.

## 2. Navigasi publik yang harus disiapkan

### Pusat Bantuan
- Mulai menggunakan Pluits
- Akun, login, keamanan, konfirmasi email, dan pemulihan akun
- Profil, username, role, privasi, dan audience
- Foto/video, Stories, Reels, postingan, komentar, like, follow, notifikasi
- Direktori, lokasi, peta, sumber data, koreksi, dan klaim tempat
- Marketplace: toko, produk, area layanan, pesanan, pembayaran, pembatalan, pengembalian
- Trip: itinerary, penyedia, ketersediaan, booking, perubahan, refund
- Chat, pelaporan, pemblokiran, banding, dan dukungan
- Aksesibilitas dan pemecahan masalah aplikasi

### Keamanan & Kepercayaan
- Pedoman Komunitas
- Konten sensitif dan moderasi kontekstual
- Penipuan, impersonasi, spam, dan transaksi berisiko
- Laporkan konten, akun, tempat, toko, penyedia, atau transaksi
- Peninjauan keputusan dan banding
- Verifikasi akun, toko, penyedia, dan klaim tempat

### Ketentuan & Kebijakan
- Syarat dan Ketentuan Penggunaan
- Kebijakan Privasi
- Kebijakan Cookie/teknologi serupa bila digunakan
- Kebijakan Konten dan Lisensi Konten Pengguna
- Pedoman Komunitas dan Moderasi
- Ketentuan Marketplace dan Transaksi
- Ketentuan Trip dan Booking
- Pembayaran, pembatalan, refund, dan sengketa
- Lokasi, Direktori, dan Klaim Tempat
- Verifikasi dan Identitas
- Promosi/Iklan dan konten berbayar saat fitur tersedia

### Tentang & Kontak
- Tentang Pluits
- Hubungi dukungan
- Kontak privasi dan pengaduan
- Status layanan bila sistem status sudah tersedia

Jangan menampilkan tautan kebijakan kosong atau memberi kesan bahwa dokumen sudah berlaku. Konten yang belum siap diberi label draft/internal atau belum tersedia dan tidak ditampilkan sebagai aturan aktif.

## 3. Komponen standar setiap halaman

### Artikel Bantuan
- Judul, ringkasan, dan status fitur
- Siapa yang dapat menggunakan fitur dan prasyarat
- Langkah-langkah yang dapat dilakukan dari Android/mobile
- Apa yang terjadi setelah tindakan
- Batasan, biaya, waktu, dan pengecualian
- Pemecahan masalah
- Tautan ke pengaturan/fitur terkait dan artikel lain
- Tanggal terakhir diperbarui

### Dokumen Kebijakan
- Nama dokumen, versi, status, tanggal diterbitkan, dan tanggal efektif
- Ringkasan perubahan dalam bahasa sederhana
- Ruang lingkup dan definisi
- Hak, kewajiban, larangan, dan tanggung jawab para pihak
- Data yang diproses dan tujuan untuk kebijakan privasi
- Proses, pengecualian, dan batasan yang sah
- Cara menghubungi Pluits, mengajukan keberatan, dan pengaduan
- Riwayat versi dan versi sebelumnya

## 4. Matriks cakupan per domain

| Domain | Bantuan pengguna | Kebijakan/disclosure |
|---|---|---|
| Akun universal | daftar, login, konfirmasi, username, role, pemulihan | Terms, Privacy, Keamanan Akun |
| Social/Community | posting, audience, Stories, Reels, like, komentar, follow, notifikasi | Community Guidelines, Konten Pengguna, Privacy, Moderasi |
| Media/kamera | format, ukuran, upload, retry, penghapusan, hak cipta | Privacy, Lisensi Konten |
| Lokasi/GeoDirectory | izin lokasi, nearby, peta, sumber data, koreksi, klaim tempat | Privacy Lokasi, Kebijakan Direktori, Verifikasi/Klaim |
| Marketplace | akun personal vs toko, listing, stok, area layanan, order | Ketentuan Marketplace, Transaksi, Refund |
| Trip | penyedia, ketersediaan, jadwal, booking, perubahan | Ketentuan Trip/Booking, Pembayaran/Refund |
| Pembayaran/wallet | metode, status, bukti, settlement, sengketa | Ketentuan Pembayaran; jangan klaim wallet aktif sebelum ledger/provider siap |
| Chat/dukungan | komunikasi, lampiran, blokir, pelaporan | Privacy, Retensi, Keamanan, Moderasi |
| Personalisasi | minat, rekomendasi, kontrol, reset | Privacy dan Personalisasi |
| Verifikasi/trust | identitas, toko/provider, klaim tempat, lencana | Kebijakan Verifikasi, Privacy, Banding |

Domain yang belum tersedia tetap masuk blueprint. Artikel operasional dan ketentuan khusus baru diaktifkan ketika fitur benar-benar tersedia.

## 5. Protokol setiap hasil sharing dan pengujian

Setiap masukan baru dibuat sebagai Decision Record:
1. Tangkap masalah atau keputusan inti dari sharing.
2. Klasifikasikan: BUSINESS, UX, FEATURE, DATA, PRIVACY, SAFETY, LEGAL, OPERATIONS, atau gabungan.
3. Tandai sebagai keputusan final, hipotesis, atau pertanyaan terbuka.
4. Petakan dampaknya ke master bisnis, roadmap, PRD/arsitektur, UI copy, Help Center, Terms, Privacy, Guidelines, dan test cases.
5. Implementasikan perubahan kecil yang aman pada checkpoint berjalan; jangan hanya menambah backlog.
6. Perbarui bantuan/disclosure sebelum atau bersamaan dengan deployment yang mengubah pengalaman pengguna.
7. Catat versi, commit, migration, deployment, hasil tes, dan status publikasi.
8. Tandai LEGAL REVIEW REQUIRED bila ada implikasi hukum/regulasi atau pemrosesan data berisiko tinggi; jangan mengarang kepastian hukum.

### Status keputusan dan publikasi
- PROPOSED — masukan belum diputuskan.
- DECIDED — keputusan produk disetujui founder.
- IMPLEMENTED — perilaku/kontrol sudah ada di kode/backend.
- DEPLOYED — perubahan sudah dirilis.
- TESTED — perilaku diuji dengan hasil tercatat.
- PUBLISHED — konten bantuan/kebijakan diterbitkan untuk pengguna.
- LEGAL REVIEW REQUIRED — perlu tinjauan profesional sebelum berlaku.
- SUPERSEDED — digantikan keputusan/versi baru.

DECIDED tidak otomatis berarti PUBLISHED. Jangan menandai TESTED tanpa bukti. Jangan memublikasikan janji fitur yang belum tersedia.

## 6. Template Decision Record

- ID dan tanggal
- Sumber: sharing founder / UAT / insiden / audit / regulasi
- Masukan atau temuan
- Keputusan dan status
- Alasan
- Domain terdampak
- Perubahan frontend
- Perubahan backend/data
- Perubahan artikel bantuan
- Perubahan Terms/Privacy/Guidelines
- Disclosure/consent yang diperlukan
- Test case dan acceptance criteria
- Legal/security review
- Commit/migration/deploy
- Versi konten dan tanggal efektif

## 7. Inventaris data untuk Kebijakan Privasi

Privacy Policy harus mengikuti inventaris data nyata, bukan asumsi. Inventaris meliputi:
- Identitas dan kredensial akun
- Profil, username, role, dan pengaturan privasi
- Konten, media, komentar, pesan, dan interaksi
- Lokasi perangkat, lokasi pilihan, dan data GeoDirectory
- Aktivitas pencarian, rekomendasi, saved/recent, dan telemetry
- Data toko, penyedia, pelanggan, pesanan, booking, dan pembayaran
- Dokumen verifikasi/KYC bila kelak dikumpulkan
- Log keamanan, laporan, moderasi, dan banding
- Data pihak ketiga/API bila digunakan

Untuk setiap kategori catat sumber, tujuan, dasar pemrosesan yang perlu ditentukan, wajib/opsional, akses internal, vendor/penerima, lokasi penyimpanan, retensi/penghapusan, keamanan, dan kontrol pengguna. Lokasi presisi harus diminta secara eksplisit saat dibutuhkan; jelaskan fallback area manual dan apakah data lokasi disimpan. Jangan mengklaim enkripsi end-to-end, anonimisasi, penghapusan otomatis, atau tidak berbagi data tanpa bukti.

## 8. Ketentuan produk yang harus dibangun bertahap

- Peran Pluits sebagai platform dan batas tanggung jawab atas konten/penawaran pihak ketiga.
- Perbedaan akun personal, toko resmi, penyedia profesional, pengelola tempat, dan status verifikasinya.
- Perbedaan transaksi di Pluits dengan transaksi eksternal; perlindungan Pluits tidak boleh diklaim untuk transaksi di luar sistem.
- Area layanan Marketplace dan pengecualian booking Trip lintas wilayah.
- Hak atas konten dan lisensi terbatas untuk menampilkan konten sesuai pengaturan pengguna.
- Larangan eksploitasi, penipuan, impersonasi, spam, pelanggaran hak cipta, dan konten berbahaya.
- Moderasi kontekstual, alasan tindakan, banding, dan peninjauan manusia untuk kasus relevan.
- Akurasi direktori, sumber/provenance, koreksi, klaim tempat, dan pencabutan akses.
- Review dan label transaksi terverifikasi hanya jika backend memiliki bukti transaksi sah.
- Pembatalan, refund, komplain, dan sengketa mengikuti alur pembayaran/booking yang benar-benar tersedia.
- Batas usia, wilayah layanan, kewajiban penyedia, pajak, perlindungan konsumen, dan kepatuhan sektor perlu tinjauan profesional.

## 9. Struktur dokumen sumber

- MASTER/BUSINESS-MODEL-MASTER.md — keputusan bisnis kanonis.
- MASTER/PROJECT-STATUS-ROADMAP.md — status implementasi dan checkpoint.
- docs/pluits/PRODUCT-ROADMAP.md — urutan produk/fase.
- docs/pluits/HELP-CENTER-LEGAL-CONTENT-BLUEPRINT.md — blueprint, taxonomy, dan tata kelola.
- docs/pluits/policies/DATA-INVENTORY.md — inventaris data dan pemetaan privasi.
- docs/pluits/policies/TERMS-OF-USE.md — draft syarat penggunaan.
- docs/pluits/policies/PRIVACY-POLICY.md — draft privasi berbasis data map.
- docs/pluits/policies/COMMUNITY-GUIDELINES.md — pedoman komunitas dan moderasi.
- docs/pluits/policies/MARKETPLACE-TERMS.md — ketentuan Marketplace.
- docs/pluits/policies/TRIP-BOOKING-TERMS.md — ketentuan Trip.
- docs/pluits/help/<domain>/<article>.md — artikel bantuan per fitur.
- src/pages/help/ — halaman bantuan publik setelah konten siap.
- src/pages/legal/ — halaman kebijakan publik setelah review dan persetujuan.

Dokumen master adalah sumber konten. Frontend nantinya merender versi yang disetujui agar tidak ada salinan teks yang berbeda-beda di banyak komponen.

## 10. Urutan delivery

H0 — Governance & blueprint: struktur, status, template Decision Record, protokol sinkronisasi.

H1 — Data map & baseline account/social: inventaris Auth, profil, posting, media, Story/Reels, follow, notifikasi, saved/recent, personalisasi; draft bantuan akun/sosial, Guidelines awal, dan Privacy berbasis fakta.

H2 — GeoDirectory & location: bantuan izin lokasi, nearby, pencarian, sumber data, koreksi, klaim tempat, dan disclosure lokasi.

H3 — Marketplace: bantuan seller/buyer, area layanan, listing, checkout, order, sengketa, dan ketentuan setelah payment/fulfillment final.

H4 — Trip: bantuan provider, availability, itinerary, booking, cancellation/refund dan ketentuan setelah booking/payment teruji.

H5 — Trust, safety & operations: report, block, moderation, appeal, support, verification, abuse response. SLA hanya dipublikasikan bila operasional mampu memenuhinya.

## 11. Acceptance criteria

- Setiap sharing founder baru memiliki Decision Record dan peta dampak.
- Perubahan fitur tidak dirilis tanpa menilai dampak Help/Terms/Privacy/Guidelines.
- Halaman publik tidak mengiklankan kontrol yang belum tersedia.
- Privacy Policy cocok dengan inventaris data dan akses backend.
- Versi dan tanggal efektif terlihat oleh pengguna.
- Bantuan mobile-first, ringkas, dapat dicari, dan memiliki langkah yang bisa diikuti.
- Perubahan kebijakan material memicu pemberitahuan/consent ulang bila diwajibkan setelah kajian hukum.

## 12. Catatan kepatuhan

Blueprint ini adalah arsitektur produk dan dokumentasi internal. Draft legal harus disesuaikan dengan entitas operator Pluits, yurisdiksi, model pembayaran, kategori layanan, mitra pemroses data, dan praktik aktual. Sebelum diterbitkan sebagai ketentuan mengikat, minta tinjauan penasihat hukum Indonesia dan yurisdiksi terkait bila layanan lintas negara diluncurkan.


## 13. Social Media Trust & Safety — tambahan 10 November 2026
Topik bantuan yang disusun bertahap: larangan video manusia sintetis AI; foto AI-assisted editing; kekerasan dan konteks; bullying/pelecehan/doxxing; copyright dan rekaman independen kejadian sama; takedown/counter-notice; musik berlisensi per wilayah; impersonasi/verifikasi; watermark dan batas screenshot; inbox friend-first; Top 10 negara/kategori; tautan eksternal akun bisnis satu kali per hari.
Setiap artikel membedakan AVAILABLE, IN DEVELOPMENT, PLANNED, dan DRAFT/LEGAL REVIEW REQUIRED. Penghapusan akun setelah 12 bulan tidak aktif masih proposal dan tidak boleh ditampilkan sebagai aturan aktif.
Frontend awal berada pada route #/help. Route #/terms, #/privacy, dan #/guidelines menampilkan status dokumen secara transparan; draft legal internal tidak otomatis dipublikasikan sebagai dokumen final.
