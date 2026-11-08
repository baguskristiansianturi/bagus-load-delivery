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
