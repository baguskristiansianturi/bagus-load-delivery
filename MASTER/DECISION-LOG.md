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
