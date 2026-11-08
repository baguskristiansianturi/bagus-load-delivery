# PLUITS DOCUMENTATION MAP & ENGINEERING CHECKLIST

Dokumen ini adalah peta agar founder dan AI memahami sumber kebenaran, struktur dokumentasi, serta status pekerjaan sebelum menyentuh kode.

## Urutan baca wajib untuk AI
1. MASTER/AI-START-HERE.md — aturan proyek, identitas, dan alur kerja.
2. MASTER/DOCUMENTATION-MAP-AND-CHECKLIST.md — peta dokumen dan checklist.
3. MASTER/BUSINESS-MODEL-MASTER.md — baca keseluruhan model bisnis aktif dan keputusan yang disetujui.
4. MASTER/PROJECT-STATUS-ROADMAP.md — seluruh checkpoint, status deploy/test, blocker, dan pekerjaan tersisa.
5. MASTER/PLUITS-USER-TESTING.md — hasil/daftar UAT founder.
6. MASTER/PLUITS-SECURITY-REVIEW.md — security review dan temuan terbuka.
7. docs/pluits/LIVE-AUDIT-2026-11-08.md — baseline audit; cek apakah ada audit lebih baru.
8. Spesifikasi arsitektur dan laporan implementasi yang dirujuk checkpoint relevan.
9. IDEAS/IDEA-BACKLOG.md — ide masa depan saja; jangan anggap sebagai keputusan atau instruksi implementasi.

Jika dokumen panjang, baca per bagian sampai seluruh bagian relevan tercakup. Jangan mengandalkan memory percakapan sebagai pengganti repository.

## Sumber kebenaran
| Area | Dokumen utama | Aturan |
|---|---|---|
| Model bisnis aktif | MASTER/BUSINESS-MODEL-MASTER.md | Hanya keputusan founder yang disetujui |
| Ide masa depan | IDEAS/IDEA-BACKLOG.md | Tidak otomatis menjadi roadmap |
| Status pekerjaan | MASTER/PROJECT-STATUS-ROADMAP.md | Status harus punya bukti |
| Hasil uji pengguna | MASTER/PLUITS-USER-TESTING.md | Catat perangkat, akun, tanggal, hasil nyata |
| Security | MASTER/PLUITS-SECURITY-REVIEW.md | Temuan, mitigasi, residual risk |
| Arsitektur | docs/pluits/ dan dokumentasi modul | Kontrak/dependency konsisten |
| Orientasi AI | MASTER/AI-START-HERE.md | Wajib dibaca setiap sesi kerja baru |

## Status checklist
- DONE / VERIFIED — bukti dan cara verifikasi dicantumkan.
- IMPLEMENTED, NOT VERIFIED — kode/schema ada, tetapi belum diuji.
- DEPLOYED — workflow/hosting sukses pada commit yang tepat.
- TESTED — test otomatis/manual punya hasil yang dicatat.
- ACCEPTED — founder telah menguji dan menerima.
- TODO — belum dikerjakan.
- FAILED — uji gagal, sertakan error dan reproduksi.
- BLOCKED — terhalang dependency/akses/keputusan.
- NOT TESTED / UNKNOWN — jangan diasumsikan berhasil.

Setiap checkpoint:
- [ ] Scope dan alasan perubahan.
- [ ] Modul/file/schema terdampak.
- [ ] Dependency dan kontrak antar-modul.
- [ ] Migration dan rollback plan jika database berubah.
- [ ] Build/test result dan error output.
- [ ] Commit SHA serta workflow/deployment run.
- [ ] Security/RLS/privacy impact.
- [ ] Android/mobile UAT dan hasil founder.
- [ ] Dokumentasi/help/legal yang perlu diperbarui.
- [ ] TODO, FAILED, BLOCKED, dan risiko terbuka.

## Prinsip modular dan perlindungan pengguna aktif
- Jangan mengubah banyak domain sekaligus tanpa kebutuhan.
- Petakan modul, public interfaces, database ownership, shared components, dan dependency sebelum refactor.
- Pertahankan API/DB contract atau sediakan compatibility layer dan migration bertahap.
- Gunakan tests untuk mencegah regresi pada modul live.
- Rilis perubahan berisiko bertahap; gunakan feature flag/canary bila sesuai.
- Siapkan rollback, backup/restore, monitoring, dan incident notes.
- Jangan menambah dependency/framework/bahasa hanya karena populer; dokumentasikan alasan, biaya, risiko, dan kemampuan maintenance.

## Operasi dan keamanan masa depan — checklist, bukan klaim aktif
- [ ] Centralized structured logs dengan correlation/request ID.
- [ ] Error tracking dan alert frontend, API, database, Storage, deploy.
- [ ] Availability/latency/performance monitoring.
- [ ] Dependency scanning, secret scanning, vulnerability review.
- [ ] RLS/access-control regression tests dan abuse/rate-limit tests.
- [ ] Backup, restore drill, disaster recovery, incident response.
- [ ] AI-agent roles, least privilege, human approval gates, audit logs, evaluasi false positive/negative.
- [ ] Daily/weekly/monthly report dengan bukti, severity, tren, rekomendasi, dan status.

Semua item harus diverifikasi sebelum dicentang. Dokumen ini tidak menyatakan sistem telah memenuhi checklist.
