# SOP — ENGINEERING DELIVERY

## 1. Audit sebelum mengubah
- Baca aturan repository dan model bisnis penuh sesuai `MASTER/AI-START-HERE.md`.
- Periksa branch, HEAD commit, file yang berubah, test scripts, workflow terbaru, deployment, dan migration history bila pekerjaan menyentuh backend.
- Baca modul dan dependency terkait; cari route/import/callers/tests sebelum refactor atau delete.
- Identifikasi kondisi live dan risiko data produksi. Jangan menebak dari checkpoint lama.

## 2. Turunkan scope
- Hubungkan setiap perubahan dengan Business Model Master, Decision Log bila ada, roadmap item, dan acceptance criteria.
- Tentukan ownership data, API/RPC, authorization/RLS, storage, error/retry/offline behavior, accessibility, responsive states, dan telemetry.
- Pisahkan implementasi baru dari cleanup/refactor yang tidak diperlukan.

## 3. Implementasi modular
- Satu tanggung jawab per modul; gunakan komponen, service, token desain, dan kontrak bersama yang sudah ada.
- Jangan duplikasi route, business logic, design tokens, atau akses database.
- Backend menegakkan permission dan business rules; UI hanya mencerminkan hasil backend.
- Migration terapan tidak boleh dihapus/ditulis ulang. Migration baru harus kompatibel, dapat diaudit, dan memiliki rollback plan yang sesuai.
- Jangan gunakan data palsu, placeholder yang tampak seperti hasil nyata, atau hardcode status/angka transaksi.
- Jangan mengekspos secrets, personal data, access token, atau private test records.

## 4. Pengujian
- Jalankan automated tests dan production-surface guard.
- Tambahkan regression test untuk bug yang diperbaiki; uji positive dan negative authorization bila menyentuh akses/data.
- Jalankan production build.
- Periksa error handling, loading, empty, success, retry, keyboard/focus, screen size, dan media aspect ratio.
- Jika tidak tersedia browser/device test, tulis NOT TESTED; jangan menyamakan static test dengan runtime UAT.

## 5. Commit dan deployment
- Commit perubahan dalam unit logis dengan pesan yang jelas.
- Tunggu workflow pada commit tersebut selesai.
- Periksa semua job/step; hanya conclusion SUCCESS yang dapat dicatat sebagai deploy sukses.
- Cocokkan head SHA workflow dengan commit yang dimaksud.
- Buka URL Pages dengan cache-busting commit untuk memverifikasi konten yang dipublikasikan bila memungkinkan.
- Catat commit SHA, workflow run ID/nomor, hasil tes/build, deployment, dan batas verifikasi.

## 6. Dokumentasi
- Update checkpoint roadmap dan hanya dokumen yang terdampak.
- Catat migration yang diterapkan, risiko tersisa, rollback, dan langkah berikutnya.
- Jangan mengklaim UAT oleh founder. Status ACCEPTED hanya setelah founder menyatakan menerima.


## Audit dampak modul sebelum perubahan

Sebelum mengubah komponen bersama, rujuk `docs/pluits/FRONTEND-MODULE-CONTRACTS.md`. Perubahan pada router, header, navigasi mobile, ikon, token desain, atau CSS global wajib mengaudit seluruh pemanggil dan halaman saudara, bukan hanya halaman yang sedang dibuka. Setelah perubahan, jalankan `npm test` dan `npm run build`, tinjau diff, lalu periksa rute publik, feed, profil, pengaturan, DM, notifikasi, pencarian, GeoDirectory, Marketplace, dan Trip pada mobile serta desktop. Deployment tidak boleh dinyatakan selesai sebelum workflow Pages sukses.
