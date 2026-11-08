# SOP — PRODUCT CHANGE CONTROL

## Tujuan
Menjaga setiap pembahasan baru, hasil sharing, ide, perubahan model bisnis, dan planning tetap tercatat serta konsisten di repository.

## Alur wajib
1. **Tangkap:** catat masukan founder/UAT/riset sebagai fakta, observasi, asumsi, hipotesis, atau usulan.
2. **Klasifikasikan:** tentukan domain produk dan dampak ke pengguna, model bisnis, UX, data, keamanan, operasi, biaya, serta dependensi.
3. **Analisis:** bandingkan kondisi sekarang, masalah, manfaat, alternatif, risiko, biaya, dan alasan untuk tidak membangun.
4. **Catat sebelum lupa:** masukan yang belum disetujui masuk ke `IDEAS/IDEA-BACKLOG.md` dengan ID unik dan status PROPOSED/NEEDS RESEARCH/PARKED. Jangan masukkan ke roadmap sebagai pekerjaan yang disetujui.
5. **Minta keputusan hanya jika diperlukan:** perubahan arah bisnis, biaya/risiko material, data produksi, keamanan, legal, atau scope yang belum jelas membutuhkan persetujuan eksplisit founder. Jangan meminta persetujuan untuk keputusan teknis kecil yang sudah berada dalam ruang lingkup.
6. **Rekam keputusan:** setelah founder menyetujui, tambahkan entri append-only di `MASTER/DECISION-LOG.md`.
7. **Sinkronkan otoritas:** jika keputusan mengubah model bisnis, perbarui bagian relevan di `MASTER/BUSINESS-MODEL-MASTER.md`; ubah backlog menjadi PROMOTED/MERGED dan tautkan decision ID.
8. **Turunkan ke delivery:** tulis user journey, acceptance criteria, backend contract/security, frontend scope, dependency, tests, rollback, dan UAT. Baru setelah itu tambahkan/ubah prioritas di `MASTER/PROJECT-STATUS-ROADMAP.md`.
9. **Sinkronkan dokumen turunan:** update spesifikasi, security review, help/legal, UX/IA, documentation map, dan SOP yang terdampak. Jangan mengubah dokumen yang tidak terdampak.
10. **Verifikasi konsistensi:** tidak boleh ada status yang bertentangan, keputusan tanpa sumber, atau backlog APPROVED tanpa decision ID.

## Aturan ID dan status
- Gunakan ID berurutan: IDEA-XXX untuk backlog, D-XXX untuk keputusan, CP-XXX untuk checkpoint.
- Status ide: PROPOSED, NEEDS RESEARCH, PARKED, APPROVED, REJECTED, PROMOTED, MERGED.
- Status keputusan: DECIDED atau SUPERSEDED.
- Status delivery: NOT STARTED, IN PROGRESS, IMPLEMENTED, DEPLOYED, TESTED, ACCEPTED, BLOCKED, NOT TESTED, NOT VERIFIED.
- IMPLEMENTED bukan DEPLOYED; DEPLOYED bukan TESTED; TESTED bukan ACCEPTED.

## Jika founder berbagi temuan baru
- Jangan hanya menjawab di chat. Simpan sebagai ide/temuan di backlog dengan sumber dan tanggal.
- Bila masukan adalah kritik atas fitur yang sedang diuji, catat sebagai UAT finding dan buat acceptance criteria/perbaikan di roadmap.
- Jangan menganggap screenshot, contoh kompetitor, atau brainstorming sebagai persetujuan meniru atau membangun.
- Jika founder menyatakan persetujuan dengan jelas, rekam keputusan dan sinkronkan seluruh dokumen terdampak.
- Pertahankan riwayat lama; jangan menghapus atau menimpa keputusan sebelumnya.

## Checklist penutupan
- [ ] Backlog diperbarui.
- [ ] Founder approval tercatat jika keputusan diperlukan.
- [ ] Decision Log diperbarui jika keputusan dibuat.
- [ ] Business Model Master diperbarui hanya jika keputusan bisnis berubah.
- [ ] Roadmap dan spesifikasi diperbarui jika pekerjaan disetujui.
- [ ] SOP/help/security/docs map diperbarui jika terdampak.
