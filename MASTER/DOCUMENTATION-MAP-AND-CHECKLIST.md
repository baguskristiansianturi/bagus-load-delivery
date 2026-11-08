# PLUITS — DOCUMENTATION MAP & ENGINEERING CHECKLIST
**Pembaruan:** 8 November 2026

Dokumen ini memetakan satu sumber kebenaran per area. Semua dokumen turunan wajib konsisten dengan Business Model Master.

## Urutan baca AI
1. `MASTER/AI-START-HERE.md`
2. `MASTER/BUSINESS-MODEL-MASTER.md` — baca keseluruhan terlebih dahulu.
3. `MASTER/PLUITS-AI-GOVERNANCE.md`.
4. `MASTER/PROJECT-STATUS-ROADMAP.md`
5. `MASTER/PLUITS-USER-TESTING.md`
6. `MASTER/PLUITS-SECURITY-REVIEW.md` dan `MASTER/BACKEND-FOUNDATION-SPEC.md`
7. `supabase/README.md`
8. Audit live terbaru di `docs/pluits/`
9. Spesifikasi arsitektur modul yang relevan.
10. `IDEAS/IDEA-BACKLOG.md` — terakhir, agar ide tidak dianggap keputusan.

## Sumber kebenaran tunggal
| Area | Sumber kanonis | Batas |
|---|---|---|
| Visi, model bisnis, keputusan produk, aturan bisnis | `MASTER/BUSINESS-MODEL-MASTER.md` | Satu-satunya otoritas keputusan bisnis |
| Ide dan hipotesis belum disetujui | `IDEAS/IDEA-BACKLOG.md` | Tidak otomatis boleh dibangun |
| Checkpoint, prioritas, implementasi, deploy, UAT | `MASTER/PROJECT-STATUS-ROADMAP.md` | Satu-satunya roadmap delivery |
| Tata kelola AI dan alur perubahan | `MASTER/PLUITS-AI-GOVERNANCE.md` | Wajib setiap sesi AI |
| Arsitektur dan kontrak teknis | Spesifikasi di `MASTER/`, `docs/`, dan `supabase/` | Menjelaskan implementasi, bukan mengubah keputusan bisnis |
| Kondisi aktual dan risiko | Audit/security review terbaru | Harus bertanggal dan berbukti |
| Uji pengguna | `MASTER/PLUITS-USER-TESTING.md` | Hanya hasil nyata |

Dokumen Master Product Vision dan Product Roadmap lama telah digabungkan lalu dihapus. Riwayat model bisnis awal dipindahkan ke docs/pluits/archive/BUSINESS-MODEL-HISTORY-LEGACY.md; arsip ini bukan sumber aktif dan tidak dibaca sebagai instruksi implementasi. Dokumen arsitektur UX/IA, GeoDirectory, keamanan, help/legal, dan UAT tetap dipakai sesuai fungsi teknisnya.

## Alur temuan → ide → keputusan → implementasi
1. Temuan dari percakapan, UAT, analisis kompetitor, atau eksplorasi desain → catat di Backlog Ide dengan tanggal/sumber.
2. Klasifikasikan UX/UI, journey, model bisnis, harga/revenue, strategi, trust/safety, arsitektur, operasi, legal, atau riset.
3. Bedakan fakta, observasi, asumsi, hipotesis, dan keputusan.
4. Evaluasi masalah, manfaat, alternatif, biaya, risiko, privasi, keamanan, skala, dependency, dan alasan tidak membangun.
5. Founder memutuskan lanjut/tunda/tolak/riset.
6. Jika disetujui: update Business Model Master, tandai ide PROMOTED/MERGED, dan catat alasan/dampak.
7. Turunkan ke spesifikasi backend/frontend, lalu tambahkan pekerjaan ke roadmap.
8. Uji, deploy, dan catat bukti/status.

## Engineering checklist
- [ ] Keputusan bisnis dan rujukannya jelas.
- [ ] Persona, journey, acceptance criteria, edge cases.
- [ ] Modul, dependency, kontrak, ownership data, route/komponen kanonis.
- [ ] Permission matrix, RLS, Storage, privacy, abuse cases.
- [ ] Migration kompatibel dan rollback jika ada perubahan DB.
- [ ] Loading, empty, success, error, retry, offline, accessibility.
- [ ] Automated/integration/negative authorization/regression tests.
- [ ] Build, commit SHA, workflow/deployment run.
- [ ] Android/mobile UAT dan hasil founder.
- [ ] Dokumentasi, help, security review, backlog diperbarui.

## Status
PROPOSED → DECIDED → SPECIFIED → IMPLEMENTED → DEPLOYED → TESTED → ACCEPTED.
BLOCKED, FAILED, NOT TESTED, dan NOT VERIFIED wajib dicatat. Satu status tidak membuktikan status berikutnya.

## Perlindungan
- Satu fungsi/route/komponen = satu sumber kanonis.
- Jangan hapus migration terapan, data pengguna, atau histori keputusan.
- Tidak ada secret/data pribadi/data uji privat di repository publik.
- Backend menegakkan akses; frontend merefleksikan izin/status.
- Terapkan least privilege, audit trail, observability, backup/restore, rate limits, dan human approval untuk tindakan AI berisiko.
