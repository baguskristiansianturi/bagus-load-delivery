# PLUITS — DECISION LOG

**Fungsi:** indeks keputusan founder yang sudah disetujui. Dokumen ini append-only; koreksi dilakukan dengan entri baru yang merujuk keputusan sebelumnya, bukan menghapus histori.

## Aturan pencatatan
- Catat hanya keputusan eksplisit founder atau keputusan historis yang sudah jelas tertulis dalam Business Model Master.
- Bedakan DECIDED, PROPOSED, PARKED, dan REJECTED. Diskusi/ide tidak otomatis menjadi keputusan.
- Setiap keputusan mencantumkan tanggal, konteks, dampak, dokumen otoritatif yang diperbarui, dan status implementasi.
- Jika keputusan berubah, buat entri baru dengan `Supersedes: D-XXX`; jangan menimpa sejarah.
- Business Model Master tetap sumber aturan bisnis aktif. Decision Log adalah indeks jejak keputusan, bukan dokumen tandingan.
- Setelah keputusan baru disetujui, ikuti `SOP/PRODUCT-CHANGE-CONTROL.md`.

## Keputusan aktif yang dikonsolidasikan

### D-001 — Pluits sebagai identitas tunggal platform
- **Tanggal keputusan:** 7 November 2026
- **Status:** DECIDED
- **Keputusan:** Pluits menjadi satu-satunya identitas aktif produk/repository/backend; arah produk menghubungkan Social Media, Local Marketplace, Trip/Travel, dan GeoDirectory.
- **Rujukan otoritatif:** `MASTER/BUSINESS-MODEL-MASTER.md`, bagian 23 dan bagian aktif terkait.
- **Dampak:** Jangan menghidupkan kembali identitas atau produk lama sebagai platform paralel.
- **Status implementasi:** Identitas repository dan aplikasi menggunakan Pluits; audit lanjutan tetap mengikuti roadmap.

### D-002 — Social Media sebagai P0 dan release gate
- **Tanggal keputusan:** 8 November 2026
- **Status:** DECIDED
- **Keputusan:** Selesaikan dan validasi Social Media terlebih dahulu. Café, Resto, Marketplace expansion, dan vertical pengalaman lain tetap ditunda sampai founder menerima Social Media melalui UAT.
- **Rujukan otoritatif:** `MASTER/BUSINESS-MODEL-MASTER.md` bagian 31; `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md`.
- **Dampak:** Prioritas roadmap, testing, dan release harus berpusat pada Social Media.
- **Status implementasi:** Fondasi sosial telah diimplementasikan dan beberapa kali dideploy; founder UAT belum ACCEPTED.

### D-003 — Aplikasi live diperlakukan sebagai production
- **Tanggal keputusan:** 8 November 2026
- **Status:** DECIDED
- **Keputusan:** Akun, profil, postingan, media, pesan, pengaturan, dan data pengguna yang sudah ada adalah data produksi.
- **Rujukan otoritatif:** `AGENTS.md`, `MASTER/AI-START-HERE.md`, dan `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md`.
- **Dampak:** Tidak boleh reset, seed data palsu, menghapus data, atau melakukan perubahan berisiko tanpa otorisasi eksplisit dan rencana rollback.
- **Status implementasi:** Berlaku untuk seluruh pekerjaan.

## D-007 — Logo gambar asli sebagai identitas visual kanonis PLUITS
- **Tanggal keputusan:** 11 November 2026
- **Status:** DECIDED
- **Founder approval:** eksplisit dalam arahan founder 11 November 2026.
- **Konteks:** Identitas PLUITS perlu konsisten di seluruh halaman tanpa mengandalkan tulisan wordmark pada setiap header.
- **Keputusan final:** Gunakan file gambar logo PLUITS asli yang diberikan founder sebagai satu-satunya simbol logo aplikasi. Pertahankan bentuk dan warna gambar; gunakan PNG berlatar transparan agar dapat ditempatkan di permukaan terang maupun gelap. Header, shell, navigasi merek, favicon, dan ikon instalasi PWA memakai aset gambar terpusat. Tulisan “PLUITS” hanya digunakan saat konteks memang membutuhkan nama merek sebagai teks, misalnya judul, metadata, deskripsi, atau penyebutan produk.
- **Dampak frontend:** Aset disimpan di `public/assets/brand/pluits-logo.png`; renderer bersama di `src/components/common/brand.js`; styling bersama di `src/styles/brand.css`. Semua header merek menggunakan renderer yang sama. Backend/Supabase tidak menyimpan aset statis ini.
- **Batas:** Tidak menggambar ulang, memodifikasi bentuk, mengganti warna, atau membuat versi huruf P generik. Tidak mengubah warna seluruh aplikasi secara otomatis; warna logo menjadi aksen identitas, bukan alasan untuk mewarnai semua permukaan.
- **Status implementasi:** DEPLOYED pada commit `24f9a848f0a2d0c9c326cfa05f8686000da32766`; GitHub Actions #1271 sukses (test, Vite build, artifact, Pages deploy). Android UAT: NOT TESTED.

## Template entri baru

Salin untuk keputusan berikutnya:

```md
### D-XXX — [Judul keputusan]
- **Tanggal keputusan:**
- **Status:** DECIDED | SUPERSEDED
- **Founder approval:** eksplisit / referensi percakapan dan tanggal
- **Konteks dan masalah:**
- **Keputusan final:**
- **Alternatif yang ditolak/ditunda:**
- **Dampak ke produk/user journey:**
- **Dampak frontend/backend/data/security/operasi:**
- **Dokumen yang diperbarui:**
- **Supersedes:** D-XXX / tidak ada
- **Status implementasi:** NOT STARTED / IN PROGRESS / IMPLEMENTED / DEPLOYED / TESTED / ACCEPTED / BLOCKED
```


## D-004 — Narrative-first business model, familiar social UX, and local-life ecosystem
- **Tanggal:** 9 November 2026.
- **Status:** DECIDED — prinsip arah produk dan model bisnis; bukan persetujuan implementasi seluruh modul.
- **Sumber:** arahan founder dalam sharing tentang Ibu Nia, kebiasaan Instagram, GeoDirectory, usaha lokal, organisasi/komunitas, kontribusi, layanan publik, dan rollout Bali-first.
- **Keputusan:**
  1. Cerita manusia dan masalah nyata menjadi fondasi model bisnis serta proposal investor. Cerita Ibu Nia menjadi alur penjelas utama, bukan sekadar contoh pemasaran.
  2. Social UX harus familiar bagi pengguna media sosial visual agar tidak memaksa kebiasaan baru. Ambil pola interaksi umum yang dikenal, bukan menyalin identitas/asset proprietary Instagram.
  3. Social Media tetap memberi nilai bagi pengguna yang tidak bertransaksi.
  4. GeoDirectory diposisikan sebagai peta entitas dan kehidupan lokal, termasuk usaha, tempat ibadah, sekolah, komunitas, organisasi, dan fasilitas publik; bukan hanya direktori toko.
  5. Identitas personal, profesional, bisnis, dan organisasi saling terhubung dengan role dan otorisasi yang jelas.
  6. Bali menjadi wilayah awal pengujian sebelum ekspansi bertahap; region gate dan operasional lapangan harus dibuktikan sebelum dinyatakan siap.
  7. Algoritma sosial, discovery/search, economic attribution, dan trust/integrity memiliki tujuan serta aturan terpisah.
- **Batas:** D-004 tidak menetapkan tarif komisi, biaya SaaS, fitur wallet/donasi, legal/payment provider, jumlah kantor/staf, target ROI, market size, atau tanggal ekspansi. Tidak mengubah Social First Release P0 dan tidak menyetujui implementasi semua domain secara paralel.
- **Sinkronisasi:** Business Model Master Bagian 32; investor proposal; business/product/technology blueprint; roadmap dan audit terkait.


## D-005 — Pendaftaran toko terbuka untuk berbagai bentuk usaha dengan lokasi fisik
- **Tanggal keputusan:** 9 November 2026
- **Status:** DECIDED
- **Founder approval:** eksplisit dalam arahan founder: toko tidak harus PT/CV; yang penting memiliki keberadaan fisik.
- **Konteks:** onboarding Seller Center membatasi PT/CV/UD dan meminta data legal seolah wajib, sehingga menutup akses individu, UMKM, usaha keluarga/rumahan dan usaha lokal lainnya.
- **Keputusan final:** PLUITS menerima berbagai bentuk usaha. Jenis/profil operasional dipisahkan dari bentuk hukum opsional. Penanggung jawab dan lokasi fisik/operasional harus dapat diverifikasi. Alamat privat dapat diverifikasi tanpa otomatis diekspos ke publik. Pendaftaran tidak otomatis berarti verified, active, atau online sales enabled.
- **Dampak user journey:** satu akun personal dapat membuat beberapa toko/cabang, melengkapi lokasi dan profil, mengajukan verifikasi, lalu mengatur katalog/operasional sesuai status.
- **Dampak frontend/backend/data/security/operasi:** perluasan CHECK constraint dan create_store RPC melalui migration baru; revisi verifikasi agar tidak mewajibkan nama legal bagi semua usaha; model privasi alamat; relasi lokasi/cabang; dashboard per store/location; URL publik berbasis slug + ID kanonis; uji RLS/owner permissions.
- **Dokumen otoritatif:** Business Model Master Bagian 32.14 dan `docs/pluits/SELLER-CENTER-STORE-LIFECYCLE-AND-URL-SPEC-2026-11-09.md`.
- **Supersedes:** tidak ada; mengoreksi pembatasan teknis lama PT/CV/UD.
- **Status implementasi:** DECIDED; schema/RPC migration NOT STARTED; frontend full flow NOT IMPLEMENTED; production DDL NOT APPLIED.


## D-006 — Social Media frontend-first, discovery global, content integrity, dan perlindungan pengguna
- **Tanggal keputusan:** 10 November 2026
- **Status:** DECIDED untuk arah produk; detail teknis/legal dan implementasi bertahap.
- **Founder approval:** eksplisit dalam arahan percakapan 10 November 2026.
- **Konteks:** pengalaman sosial akan berubah melalui pengujian. Backend terlalu jauh sebelum journey matang berisiko tidak sesuai kebutuhan.
- **Keputusan:** (1) Social Media tetap P0 dan frontend-first; backend disiapkan sebagai kontrak mengikuti UAT. (2) Top 10 global dipisah negara/kategori, terbuka untuk akun personal, kreator, bisnis, organisasi, organik dan tidak dapat dibeli. (3) Akun bisnis dikelola owner/tim; tautan eksternal promosi maksimal satu unggahan per hari per akun bisnis. (4) Video manusia/kejadian sintetis AI dilarang; foto AI-assisted editing/avatar tetap diperbolehkan. (5) Moderasi kontekstual membedakan akting/komedi/olahraga dari kekerasan nyata; kritik, berita, dan kepentingan publik tidak otomatis dihapus; bullying, ancaman, doxxing, persekusi, dan pelecehan ditangani proporsional. (6) Distribusi dapat dibatasi sementara, dengan alasan dan banding; kasus ambigu/berisiko tinggi memerlukan human review. (7) Duplicate detection tidak boleh menyamakan rekaman independen kejadian yang sama dengan pencurian; takedown memerlukan bukti hak/kewenangan. (8) Musik mengikuti lisensi wilayah; audio dapat dibisukan/diganti tanpa merusak visual bila memungkinkan. (9) Proteksi media berlapis dan watermark pemilik + Pluits; screenshot tidak dijamin terblokir 100% di web. (10) Badge verifikasi berbeda dari Premium; akun unverified tidak otomatis palsu; identity takedown diprioritaskan. (11) Inbox friend-first, status online sesuai preferensi, carousel kontak aktif, chat inline. (12) Help Center dan kebijakan dikembangkan bertahap; dokumen legal tidak dipublikasikan final sebelum review.
- **Batas:** penghapusan akun setelah 12 bulan tidak aktif masih dipertimbangkan; belum disetujui. Definisi friend, SLA takedown/banding, retensi bukti, metode/vendor deteksi, dan detail hukum perlu spesifikasi.
- **Dokumen otoritatif:** Business Model Master Bagian 33; SOP Social Content & Trust Operations; Social Content Trust Technical Spec.
- **Status implementasi:** dokumentasi dan Help Center frontend dimulai; backend trust/safety NOT STARTED; dokumen legal DRAFT/LEGAL REVIEW REQUIRED.


## D-008 — Blog mobile-first sebagai format karya Social Media
- **Tanggal keputusan:** 11 November 2026
- **Status:** DECIDED
- **Founder approval:** eksplisit dalam arahan founder 11 November 2026 untuk mulai membuat dan menguji Blog di mobile.
- **Konteks:** PLUITS perlu memberi ruang bagi blogger, penulis puisi, diary, catatan singkat, dan penikmat tulisan, tanpa memaksa mereka menjadi kreator komersial. Penulisan harus mudah dari handphone.
- **Keputusan final:** Blog menjadi format konten di dalam Social Media dan masuk melalui tombol Buat (+). Modul Blog memiliki Postingan, Draft, dan Pengaturan. Setiap tulisan mempunyai judul, deskripsi kartu maksimal 85 kata, cover utama, isi tulisan tanpa batas minimum kata, dan gambar pendukung yang terpisah dari cover. Cover menjadi thumbnail feed/katalog dan hero tulisan; ringkasan kartu yang terpotong menawarkan “Baca selengkapnya”. Identitas blog tetap mengikuti akun PLUITS, dengan nama/deskripsi ruang blog yang dapat diatur secara opsional. Audience blog/tulisan dirancang untuk publik, pengikut, dan privat.
- **Batas:** tidak ada perubahan schema, RLS, Storage, Auth, atau publikasi backend dalam increment uji awal. Penyimpanan lokal harus diberi label lokal; tidak boleh mengklaim terbit ke feed/search publik. Aturan Premium/entitlement ditunda.
- **Dampak:** frontend mobile-first Blog Studio; kontrak data artikel, Storage, privacy/RLS, pencarian, feed cards, profil Blog, dan publikasi backend menjadi tahap lanjutan setelah validasi UX.
- **Dokumen otoritatif:** Business Model Master Bagian 33.13.
- **Status implementasi:** frontend Blog Studio uji lokal IMPLEMENTED dan DEPLOYED; backend publication NOT IMPLEMENTED; Android founder UAT NOT TESTED; ACCEPTANCE PENDING.


## D-009 — Circle dan Jelajah sebagai pengalaman utama Social Media
- Tanggal keputusan: 12 November 2026
- Status: DECIDED
- Founder approval: eksplisit sebelum implementasi pada sesi 12 November 2026.
- Konteks: Istilah Beranda terasa seperti halaman website. Pengguna membutuhkan ruang personal yang berbeda dari penemuan konten publik.
- Keputusan final:
  1. Feed pengguna yang masuk bernama Circle. Isinya menggabungkan teman/following, Story circle, rekomendasi orang, postingan, lokasi/lingkungan, usaha/produk lokal, layanan, artikel/blog, dan minat.
  2. Circle menampilkan urutan judul/deskripsi, Story teman, Orang yang Mungkin Anda Kenal, lalu postingan. Toolbar Semua/Terbaru/Acak/Kategori tetap sticky. Circle tidak menampilkan tombol membuat Story sendiri pada baris Story.
  3. Jelajah menjadi feed publik lintas akun dan entitas. Konten publik dapat ditemukan; alasan ranking dan aturan kelayakan membedakan distribusi Circle dan Jelajah.
  4. Social proof pada kartu tempat/produk/layanan hanya boleh menyatakan kunjungan, pembelian, atau penggunaan jasa jika ada bukti yang sesuai dan izin berbagi. Sinyal GPS tidak cukup.
  5. Peristiwa penting dan bencana membutuhkan ranking khusus yang mempertimbangkan kepentingan publik dan verifikasi. Materi grafis/eksploitasi korban tetap dibatasi.
  6. Ranking live tidak boleh menggunakan data demo. Top 10 demo-only disembunyikan sampai sumber ranking nyata tersedia.
  7. Trust, keamanan, dan UX lebih penting daripada pertumbuhan akun tanpa kontrol; AI moderasi harus dilengkapi review manusia, alasan tindakan, dan jalur banding.
- Batas implementasi: deployment ini mengimplementasikan layout Circle, Story publik dari akun yang diikuti, filter, rekomendasi orang, dan mixed public feed Jelajah. Story receipts/metrics/replies, social-proof labels, area Top 10, important-event ranking, AI moderation pipeline, Business operations, dan feedback center belum diimplementasikan.
- Dampak teknis: pisahkan strategi ranking Circle/Jelajah/important events; pertahankan satu sumber konten kanonis; pisahkan service, ranking, data, dan presentation; gunakan RLS dan consent untuk social proof.
- Dokumen otoritatif: Business Model Master Bagian 33.14 dan docs/pluits/CIRCLE-AND-JELAJAH-EXPERIENCE-2026-11-12.md.
- Status implementasi: Circle/Jelajah UI IMPLEMENTED/DEPLOYED; Android UAT NOT TESTED; founder acceptance PENDING.


## 2026-11-13 — Profile image framing is presentation metadata

- DECIDED: PLUITS keeps the original uploaded profile image unchanged and stores independent framing metadata for the circular avatar and Circle recommendation card.
- IMPLEMENTED: `user_profile_image_frames` with bounded focus coordinates and zoom for avatar/card; owner-only writes; public read limited to public profiles; profile editor previews and independent sliders; Circle reads card framing only for recommended public profiles.
- CONSTRAINT: use the original signed Storage object URL and browser-side framing. Supabase Storage image transformation is not a dependency for this flow because it is plan-gated.
- NOT TESTED: Android device UAT, multiple source-image aspect ratios, and two-account RLS verification. GitHub Actions and database advisors must be checked against the implementation commit before marking DEPLOYED.


## D-009 — Public Blog as a shareable personal landing page
- **Tanggal keputusan:** 14 November 2026
- **Status:** DECIDED
- **Founder approval:** eksplisit dalam arahan founder pada percakapan 14 November 2026.
- **Konteks:** ruang Blog harus menjadi tujuan publik yang dapat dibagikan ke sosial media, Google Maps/profil bisnis, dan kanal lain; bukan hanya daftar artikel di dalam akun.
- **Keputusan final:** halaman utama Blog memakai hero editorial, carousel kategori, identitas penulis, daftar artikel, dan kredit Pluits. Halaman artikel menampilkan metadata penulis/tanggal, berbagi, artikel terkait, rekomendasi, dan tautan profil. Pemilik dapat mengatur urutan artikel (terbaru/terlama) dan memilih artikel utama hero. URL tetap berada pada namespace Pluits dan identitas Pluits dicantumkan secara elegan. Tab profil menjadi Feed, Reels, Trip, Blog dengan ikon.
- **Batas:** tidak membuat domain atau aplikasi terpisah per penulis; tidak mempublikasikan draft/privat; tidak mengubah kontrol follow/privasi; fitur ini tidak menjadikan Blog akun terpisah.
- **Dampak:** halaman publik Blog menjadi landing page personal/kreator/bisnis; struktur dan aturan aktif dicatat pada Business Model Master Bagian 33.15.
- **Status implementasi:** PR #23 terbuka; CI success pada run #1863; migration presentasi belum diterapkan; Pages deployment dan Android UAT belum dilakukan.


## D-010 — Personal Blog template customization, profile blocks, and social-account comments
- **Tanggal keputusan:** 14 November 2026
- **Status:** DECIDED
- **Founder approval:** eksplisit dalam arahan founder pada pembahasan Personal Blogging System dan permintaan implementasi 14 November 2026.
- **Keputusan final:**
  1. Pemilik blog dapat mengganti template kapan saja tanpa mengubah artikel, kategori, media, URL blog, URL artikel, atau aturan privasi.
  2. Personal Blog memulai dengan lima template: AURELIA, STAVERO, BREWNOX, ROVANTA, dan LUNELLE. PRESSORA, NEWSTERA, EDITORA, dan INFONARA merupakan konsep kategori News & Media terpisah dan tidak dicampurkan ke pemilih Personal Blog.
  3. Pemilik dapat menyesuaikan warna aksen, tipografi, urutan blok, dan visibilitas Profile Blocks. Menyembunyikan blok tidak menghapus konten.
  4. Blog adalah permukaan publikasi, bukan akun sosial tersendiri. Komentar dan balasan memakai identitas akun personal PLUITS yang menulisnya.
  5. Menerbitkan artikel tidak menghasilkan notifikasi otomatis kepada pengikut. Notifikasi komentar/balasan merupakan preferensi terpisah dan tidak boleh disamakan dengan notifikasi publikasi.
  6. Konten privat tidak boleh muncul pada rute publik, feed pencarian publik, sitemap, media publik, atau preview berbagi.
- **Batas:** lima template awal berlaku untuk Personal Blog. News & Media memerlukan identitas organisasi terverifikasi, role editor/delegasi, dan aturan moderasi tersendiri sebelum diaktifkan. Reorder dan theme customization tidak mengubah skema isi artikel.
- **Status implementasi:** migration template/layout dan blog_comments telah diterapkan pada Supabase production; PR #24 merged ke main pada commit 8e41d5850df184299ac6faf30ddc9a2b2e7d5a82; CI run #1873 SUCCESS (70/70 tests, Vite build, Pages deploy). Android UAT dan founder acceptance masih pending.
- **Dokumen turunan:** docs/pluits/PERSONAL-BLOG-TEMPLATE-AND-BLOCK-SPEC.md, src/pages/blog-studio/README.md, dan checkpoint CP-082.
