# PLUITS — AI START HERE
**Versi:** 2.0 | **Pembaruan:** 8 November 2026
**Produk:** Pluits | **Repository:** https://github.com/baguskristiansianturi/pluits
**GitHub Pages:** https://baguskristiansianturi.github.io/pluits/
**Supabase project:** `ytndswhqxayqpftszwfh`

## Tujuan
Pintu masuk wajib untuk setiap chat/sesi AI baru yang mengerjakan Pluits. AI harus membaca Model Bisnis Master terlebih dahulu sebelum memberi analisis, rekomendasi, desain, atau perubahan frontend/backend/database/roadmap. Jangan mengandalkan ringkasan chat atau ingatan sebagai pengganti repository terkini.

## Urutan baca wajib
1. Dokumen ini dan `AGENTS.md`.
2. Seluruh `MASTER/BUSINESS-MODEL-MASTER.md` — otoritas tunggal keputusan bisnis.
3. `MASTER/PLUITS-AI-GOVERNANCE.md`, `MASTER/DECISION-LOG.md`, dan `MASTER/PROJECT-STATUS-ROADMAP.md`.
4. `SOP/README.md`, lalu SOP yang relevan dengan pekerjaan.
5. `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md` dan `MASTER/PLUITS-USER-TESTING.md` untuk pekerjaan Social Media.
6. `MASTER/DOCUMENTATION-MAP-AND-CHECKLIST.md`, security review, backend foundation spec, `supabase/README.md`, dan technical architecture/security.
7. Audit live terbaru, alignment audit, dan spesifikasi modul terkait.
8. `IDEAS/IDEA-BACKLOG.md` — ide belum disetujui, bukan instruksi implementasi.

## Identitas proyek
- Produk, frontend, backend, repository: **Pluits**.
- Repo: `baguskristiansianturi/pluits`, branch `main`.
- Pages: `https://baguskristiansianturi.github.io/pluits/`.
- Supabase: `ytndswhqxayqpftszwfh`.
- Bagusin dan Bali Trans adalah proyek terpisah.
- Pluits adalah satu-satunya identitas aktif proyek ini. Jangan membuat atau mempertahankan identitas, repository, backend, atau roadmap kedua untuk produk yang sama. Audit dependency dan pindahkan informasi relevan sebelum menghapus artefak lama.
- Jangan mengganti brand, repo, hosting, domain, atau Supabase project tanpa keputusan eksplisit founder.

## Prioritas produk saat ini
Pluits sudah dipublikasikan dan memiliki pengguna terdaftar. Perlakukan akun/data yang ada sebagai production. Fokus delivery saat ini adalah Social Media sampai founder menyatakan lulus UAT; jangan lanjut Café, Resto, Marketplace expansion, atau vertical pengalaman lain sebelum gate Social First Release terpenuhi. Baca `MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md`.

## Hierarki sumber kebenaran
1. Business Model Master: keputusan dan aturan bisnis aktif.
2. Decision Log: jejak append-only keputusan founder; bukan pengganti Business Model Master.
3. Idea Backlog: ide/hipotesis belum diputuskan.
4. Project Status & Roadmap: pekerjaan yang disetujui dan bukti delivery.
5. Spesifikasi teknis: cara mewujudkan keputusan.
6. Source code/schema/runtime: kondisi aktual, bukan otoritas untuk mengubah model bisnis.
7. SOP: cara menjalankan proses perubahan dan delivery.
8. Audit dan UAT: bukti hasil serta keterbatasan.
Jika dokumen bertentangan, jangan menebak. Ikuti keputusan aktif terbaru di Business Model Master, catat konflik, perbaiki dokumen turunan, dan jangan mengubah keputusan bisnis tanpa persetujuan founder.

## Aturan kerja
- Periksa branch/commit terbaru dan baca bagian model bisnis terkait sebelum coding.
- Setiap fitur harus memiliki traceability: keputusan bisnis → user journey/acceptance → backend contract/security → frontend → tests → deploy → UAT.
- Backend menegakkan authorization dan aturan bisnis; menyembunyikan tombol bukan kontrol keamanan.
- Satu fungsi/route/komponen memiliki satu implementasi kanonis.
- Jangan mengubah desain/fitur yang tidak diminta. Pertahankan modul berjalan; gunakan perubahan bertahap, kompatibel, dan rollback.
- Ide baru dicatat di backlog. Tidak otomatis menjadi keputusan atau pekerjaan.
- Keputusan eksplisit dicatat append-only di MASTER/DECISION-LOG.md; perubahan bisnis disinkronkan melalui SOP/PRODUCT-CHANGE-CONTROL.md.
- Setiap perubahan mengikuti SOP/ENGINEERING-DELIVERY.md dan SOP/RELEASE-UAT.md yang relevan.
- Migration yang sudah diterapkan tidak dihapus/ditulis ulang.
- Jangan seed toko, produk, review, transaksi, saldo, engagement, akun, atau postingan palsu.
- Pisahkan DECIDED, SPECIFIED, IMPLEMENTED, DEPLOYED, TESTED, ACCEPTED, BLOCKED, NOT TESTED, dan NOT VERIFIED.
- Build/deploy harus diverifikasi untuk commit yang tepat. Deploy sukses tidak sama dengan UAT.
- Catat commit, workflow run, hasil tes, migration, risiko, dan pekerjaan tersisa.
- Founder bekerja mobile-first; laporan harus mudah diuji dari Android.

## Baseline audit
Snapshot live 9 November 2026, sekitar 03:13 WITA:
- Supabase project ytndswhqxayqpftszwfh, ACTIVE_HEALTHY, PostgreSQL 17.11.0.018, region ap-southeast-1.
- 62 public base tables; seluruh 62 mengaktifkan RLS.
- Live migration history: 81 entries; cocokkan versi/nama/konten dengan folder migration sebelum DDL.
- 20 SECURITY DEFINER functions callable by authenticated users; periksa fungsi satu per satu, jangan menyimpulkan otomatis exploitable.
- Leaked-password protection disabled.
- Performance Advisor: 84 unused-index INFO notices; jangan hapus tanpa workload evidence.
- Health Advisor: 0 lints.
- Supabase Edge Functions deployed: 0.
- Marketplace cart masih localStorage; tidak ada public cart table.
- Wallet hanya scaffold account/request; belum ada ledger/payout/reconciliation siap uang sungguhan.
- Social First Release tetap P0 sampai founder UAT diterima.

Rincian dan batas bukti: docs/pluits/PLUITS-TECHNOLOGY-ROADMAP-AND-AUDIT-2026-11-09.md dan MASTER/PLUITS-SECURITY-REVIEW.md.

**Prinsip wajib:** cerita founder dan masalah manusia—terutama perjalanan Ibu Nia—adalah alasan PLUITS dibuat. UX harus familiar bagi pengguna media sosial visual; GeoDirectory menghubungkan kehidupan lokal. Turunkan keputusan teknis dari model bisnis, bukan sebaliknya.