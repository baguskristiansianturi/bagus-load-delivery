# PLUITS — AI START HERE
**Versi:** 2.0 | **Pembaruan:** 8 November 2026
**Produk:** Pluits | **Repository:** https://github.com/baguskristiansianturi/pluits
**GitHub Pages:** https://baguskristiansianturi.github.io/pluits/
**Supabase project:** `ytndswhqxayqpftszwfh`

## Tujuan
Pintu masuk wajib untuk setiap chat/sesi AI baru yang mengerjakan Pluits. AI harus membaca Model Bisnis Master terlebih dahulu sebelum memberi analisis, rekomendasi, desain, atau perubahan frontend/backend/database/roadmap. Jangan mengandalkan ringkasan chat atau ingatan sebagai pengganti repository terkini.

## Urutan baca wajib
1. Dokumen ini.
2. `MASTER/BUSINESS-MODEL-MASTER.md` — baca seluruh dokumen terlebih dahulu; ini sumber tunggal visi, keputusan, dan aturan bisnis.
3. `MASTER/PLUITS-AI-GOVERNANCE.md` — aturan kerja setelah memahami model bisnis.
4. `MASTER/PROJECT-STATUS-ROADMAP.md` — satu-satunya roadmap delivery.
5. `MASTER/DOCUMENTATION-MAP-AND-CHECKLIST.md`.
6. `MASTER/PLUITS-USER-TESTING.md`.
7. `MASTER/PLUITS-SECURITY-REVIEW.md`, `MASTER/BACKEND-FOUNDATION-SPEC.md`, `supabase/README.md`, dan `docs/pluits/TECHNICAL-ARCHITECTURE-SECURITY.md`.
8. Audit live terbaru dan docs/pluits/BUSINESS-FRONTEND-BACKEND-ALIGNMENT-AUDIT-2026-11-08.md, lalu spesifikasi arsitektur modul yang relevan.
9. `IDEAS/IDEA-BACKLOG.md` — ide belum disetujui, bukan instruksi implementasi.

## Identitas proyek
- Produk, frontend, backend, repository: **Pluits**.
- Repo: `baguskristiansianturi/pluits`, branch `main`.
- Pages: `https://baguskristiansianturi.github.io/pluits/`.
- Supabase: `ytndswhqxayqpftszwfh`.
- Bagusin dan Bali Trans adalah proyek terpisah.
- Pluits adalah satu-satunya identitas aktif proyek ini. Jangan membuat atau mempertahankan identitas, repository, backend, atau roadmap kedua untuk produk yang sama. Audit dependency dan pindahkan informasi relevan sebelum menghapus artefak lama.
- Jangan mengganti brand, repo, hosting, domain, atau Supabase project tanpa keputusan eksplisit founder.

## Hierarki sumber kebenaran
1. Business Model Master: apa yang Pluits bangun dan aturan bisnis.
2. Idea Backlog: ide/hipotesis belum disetujui.
3. Project Status & Roadmap: apa yang disetujui untuk dikerjakan dan bukti statusnya.
4. Spesifikasi teknis: bagaimana keputusan diwujudkan.
5. Source code/schema/runtime: kondisi aktual, bukan otoritas untuk mengubah model bisnis.
6. Audit dan UAT: bukti hasil serta keterbatasan.

Jika dokumen bertentangan, jangan menebak. Ikuti keputusan aktif terbaru di Business Model Master, catat konflik, perbaiki dokumen turunan, dan jangan mengubah keputusan bisnis tanpa persetujuan founder.

## Aturan kerja
- Periksa branch/commit terbaru dan baca bagian model bisnis terkait sebelum coding.
- Setiap fitur harus memiliki traceability: keputusan bisnis → user journey/acceptance → backend contract/security → frontend → tests → deploy → UAT.
- Backend menegakkan authorization dan aturan bisnis; menyembunyikan tombol bukan kontrol keamanan.
- Satu fungsi/route/komponen memiliki satu implementasi kanonis.
- Jangan mengubah desain/fitur yang tidak diminta. Pertahankan modul berjalan; gunakan perubahan bertahap, kompatibel, dan rollback.
- Ide baru dicatat di backlog. Tidak otomatis menjadi keputusan atau pekerjaan.
- Migration yang sudah diterapkan tidak dihapus/ditulis ulang.
- Jangan seed toko, produk, review, transaksi, saldo, engagement, akun, atau postingan palsu.
- Pisahkan DECIDED, SPECIFIED, IMPLEMENTED, DEPLOYED, TESTED, ACCEPTED, BLOCKED, NOT TESTED, dan NOT VERIFIED.
- Build/deploy harus diverifikasi untuk commit yang tepat. Deploy sukses tidak sama dengan UAT.
- Catat commit, workflow run, hasil tes, migration, risiko, dan pekerjaan tersisa.
- Founder bekerja mobile-first; laporan harus mudah diuji dari Android.

## Baseline audit
Snapshot audit live 8 November 2026, 12:37 UTC: 60 public tables dengan RLS aktif, 73 migration history entries, 20 SECURITY DEFINER advisor warnings, leaked-password protection nonaktif, 84 unused-index notices, dan 0 Health Advisor lints. Tidak ditemukan tabel cart pada schema public. Angka ini bukan kondisi permanen; verifikasi ulang sebelum perubahan backend/security. Temuan authorization staff granular tetap prioritas sampai terbukti ditutup.
