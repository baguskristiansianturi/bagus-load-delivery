# PLUITS — AI GOVERNANCE & CHANGE CONTROL
**Versi:** 1.0 | **Tanggal:** 8 November 2026 | **Status:** Aturan kerja wajib

## 1. Tujuan dan urutan otoritas
Untuk setiap chat baru, baca `MASTER/AI-START-HERE.md`, lalu baca seluruh `MASTER/BUSINESS-MODEL-MASTER.md` terlebih dahulu. Setelah memahami model bisnis, baca dokumen tata kelola ini sebelum analisis atau implementasi.

Urutan sumber: (1) Business Model Master untuk keputusan bisnis aktif; (2) Idea Backlog untuk gagasan belum diputuskan; (3) Project Status & Roadmap untuk pekerjaan yang disetujui dan status bukti; (4) spesifikasi teknis untuk kontrak implementasi; (5) kode/schema/runtime untuk kondisi aktual; (6) audit/UAT untuk bukti hasil.

## 2. Satu sumber kebenaran
- Satu dokumen Model Bisnis Master.
- Satu backlog ide.
- Satu roadmap implementasi.
- Satu dokumen orientasi AI dan satu tata kelola.
- Dokumen arsitektur, security, UAT, help/legal, dan laporan audit boleh terpisah karena fungsi spesifik, tetapi tidak boleh menjadi sumber tandingan keputusan bisnis.
- Dokumen yang digabung harus diberi penanda SUPERSEDED atau dihapus setelah isi uniknya dipindahkan.

## 3. Alur temuan → ide → keputusan → implementasi
1. Temuan dari percakapan, UAT, analisis kompetitor, bug report, atau eksplorasi desain yang belum disetujui dicatat di `IDEAS/IDEA-BACKLOG.md`.
2. Klasifikasikan UX/UI, user journey, business model, pricing/revenue, strategy/growth, trust/safety, architecture, operations, legal/compliance, atau research.
3. Bedakan fakta terverifikasi, observasi, asumsi, hipotesis, dan pendapat.
4. Evaluasi masalah, penerima manfaat, alternatif, biaya, risiko, privasi, keamanan, skala, dependency, dan alasan untuk tidak membangun.
5. Founder memutuskan APPROVE, PARK, REJECT, atau NEEDS RESEARCH. Ide tidak otomatis masuk roadmap.
6. Jika disetujui dan mengubah keputusan bisnis, update bagian Business Model Master, catat tanggal/alasan/dampak, dan tandai ide PROMOTED/MERGED.
7. Turunkan keputusan ke spesifikasi backend/frontend, lalu tambahkan pekerjaan ke roadmap.
8. Setelah implementasi, catat bukti commit, migration, test, deployment, dan UAT.

## 3A. Decision Log dan SOP
- Keputusan founder yang sudah disetujui dicatat append-only di `MASTER/DECISION-LOG.md`; Business Model Master tetap otoritas isi keputusan bisnis.
- Ide yang belum disetujui tetap di `IDEAS/IDEA-BACKLOG.md`; jangan menaikkannya menjadi keputusan atau pekerjaan.
- Gunakan `SOP/PRODUCT-CHANGE-CONTROL.md` untuk sharing/ide/perubahan model bisnis/planning; `SOP/ENGINEERING-DELIVERY.md` untuk implementasi; `SOP/RELEASE-UAT.md` untuk deploy, UAT, dan handoff.
- Setiap perubahan dokumen harus menjaga tautan dan status konsisten. Jika keputusan berubah, tambahkan entri baru yang merujuk keputusan sebelumnya; jangan menghapus sejarah.

## 4. Kontrak wajib bisnis → backend → frontend
Setiap fitur harus punya traceability: business rule dan rujukan; persona/journey/state machine/acceptance criteria; domain data ownership/schema/constraints/RLS/Storage/RPC/API/error semantics; frontend route/page/component/service dan loading/empty/error/retry/offline states; test matrix; deployment dan UAT evidence.
Backend menegakkan aturan dan akses. Frontend mencerminkan izin/status backend. UI tidak boleh mengarang keberhasilan, harga, saldo, stok, transaksi, verifikasi, atau izin.

## 5. Struktur dan modularitas
- Satu fungsi/route/komponen punya satu implementasi kanonis.
- Hindari backup lama, dead code, route duplikat, dua cart/checkout yang bersaing, dan service mock yang menyamar sebagai backend aktif.
- Sebelum menghapus file, telusuri import, route, dynamic references, build scripts, tests, docs, workflows, dan deployment.
- Pindahkan data/dokumen unik sebelum menghapus sumber lama.
- Perubahan sekecil mungkin, backward-compatible, dites, dan punya rollback.
- Migration yang sudah diterapkan tidak diubah/dihapus; buat migration baru.

## 6. Status dan bukti
Gunakan PROPOSED, DECIDED, SPECIFIED, IMPLEMENTED, DEPLOYED, TESTED, ACCEPTED, BLOCKED, FAILED, NOT TESTED, NOT VERIFIED. Commit bukan bukti deploy; build bukan bukti runtime; deploy bukan bukti UAT. Founder hanya dapat menerima fitur setelah menguji dan menyatakan menerima.

## 7. Identitas dan keamanan
- Produk/repository/backend bernama Pluits. Tidak boleh ada identitas produk atau repository kedua untuk proyek yang sama.
- Bagusin dan Bali Trans adalah proyek terpisah.
- Jangan mengekspos secret, data pribadi, akun uji, atau data privat.
- Jangan mengubah repository visibility, domain, hosting, Supabase project, atau credential tanpa persetujuan dan rencana transisi.
- Tindakan production berisiko, penghapusan data, perubahan permission, dan credential memerlukan otorisasi serta approval manusia.
- Jangan membuat data bisnis/engagement palsu.

## 8. Checklist sebelum release
- [ ] Rujukan Business Model Master dan status keputusan jelas.
- [ ] Backlog item ditandai dan dihubungkan bila relevan.
- [ ] Kontrak backend/frontend sinkron.
- [ ] Route/komponen/service duplikat ditelusuri.
- [ ] RLS, ownership, privacy, abuse, negative authorization tests.
- [ ] Migration compatibility dan rollback.
- [ ] Build + automated tests lulus.
- [ ] GitHub Actions/hosting sukses pada commit yang tepat.
- [ ] Android/mobile UAT tercatat atau NOT TESTED.
- [ ] Roadmap, security review, docs map, dan AI start guide diperbarui.
