# SOP — RELEASE & FOUNDER UAT

## Release evidence
Untuk setiap release catat:
- Branch dan commit SHA persis.
- GitHub Actions run ID/nomor, status, conclusion, dan hasil tiap job.
- Regression test, build, output verification, artifact upload, dan deploy.
- URL Pages dengan query versi commit.
- Database migration yang diterapkan dan verifikasi relevan (jangan menyimpan secret atau data pribadi).
- Batas pengujian: static test, browser test, Android test, dua akun, dan UAT founder harus dibedakan.

## Status release
- **IMPLEMENTED:** kode tersedia di branch.
- **DEPLOYED:** workflow sukses dan commit SHA cocok dengan deployment.
- **TESTED:** pengujian yang disebutkan benar-benar dijalankan dan hasilnya dicatat.
- **ACCEPTED:** founder telah mencoba dan menyatakan menerima.
- **NOT TESTED / NOT VERIFIED:** bukti belum tersedia.
- **BLOCKED:** ada dependensi atau risiko yang mencegah release.

## Founder UAT
- Gunakan akun dan data uji yang memang dikendalikan founder; jangan memakai data pengguna lain tanpa izin.
- Jangan menghapus postingan, pesan, akun, atau media penting. Gunakan konten uji yang dibuat khusus dan hapus hanya setelah konfirmasi.
- Catat device, Android version, browser, viewport, langkah, expected result, actual result, dan error/screenshot yang tidak mengandung rahasia.
- Uji minimal alur inti, privacy/authorization, retry/failure, refresh persistence, dan responsive states.
- Setiap temuan baru masuk backlog atau daftar UAT finding dengan prioritas dan acceptance criteria.

## Handoff lintas chat
Sebelum sesi berakhir, tambahkan checkpoint berisi:
1. Commit dan deployment terkini.
2. Apa yang berubah dan file/modul terkait.
3. Tes yang dijalankan dan hasilnya.
4. Yang belum diuji/diterima.
5. Risiko/blocker dan rollback.
6. Satu langkah berikutnya yang paling bernilai.
Jangan mengandalkan ringkasan chat sebagai satu-satunya catatan.
