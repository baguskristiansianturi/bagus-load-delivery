# IDEAS — Future Product & Engineering Backlog

Repository/product saat ini: Pluits. Nama/domain masa depan yang disebut founder: fluids.com; hubungan brand perlu dikonfirmasi.
Terakhir diperbarui: 8 November 2026.
Status: wadah ide dan hipotesis, bukan keputusan produk atau daftar pekerjaan yang disetujui.

## Aturan penggunaan
- Masukan founder yang belum diputuskan disimpan di sini, bukan otomatis dimasukkan ke Business Model Master atau roadmap implementasi.
- Diskusi dan contoh platform lain bukan persetujuan untuk membangun.
- Setiap ide ditinjau dari kebutuhan pengguna, model bisnis aktif, alasan platform besar mengambil keputusan berbeda, biaya, risiko, privasi, keamanan, skalabilitas, dan alternatif.
- Promosi ide ke model bisnis/roadmap memerlukan keputusan eksplisit founder. Catat tanggal, alasan, dampak, dan dokumen yang diperbarui.
- Jangan hapus ide lama; tandai PARKED, REJECTED, MERGED, atau PROMOTED dengan alasan.

## Checklist evaluasi ide
- [ ] Masalah pengguna jelas.
- [ ] Hipotesis nilai dan penerima manfaat jelas.
- [ ] Dianalisis mengapa platform besar mungkin tidak melakukan hal yang sama.
- [ ] Alternatif dan konsekuensi jika tidak dibangun dibandingkan.
- [ ] Dampak UX, feed quality, privasi, keamanan, moderasi, biaya, dan skala dinilai.
- [ ] Risiko penyalahgunaan dan mitigasi dinilai.
- [ ] Keputusan founder dicatat: lanjut / tunda / tolak.
- [ ] Jika disetujui: spesifikasi, acceptance criteria, dependency, rollback, dan UAT dibuat.

## IDEA-001 — Identitas resmi platform dan pengumuman kepada pengguna
Status: PARKED / NEEDS PRODUCT RESEARCH
Sumber: diskusi founder, 8 November 2026.

### Gagasan
Mungkin platform memiliki identitas resmi untuk menerbitkan pembaruan fitur, pengumuman layanan, panduan, kebijakan, dan informasi penting. Distribusi mungkin tidak bergantung pada follower.

### Belum boleh diasumsikan
- Belum diputuskan apakah berupa akun sosial, system notice, inbox, pusat pembaruan, banner, atau kombinasi.
- Belum diputuskan apakah tampil ke semua Beranda, target, frekuensi, atau durasi.
- Belum diputuskan apakah pengguna dapat follow, mute, berkomentar, atau mengatur preferensi.
- Belum diputuskan nama dan identitas visual kanal.

### Pertanyaan riset terbalik
- Mengapa platform sosial besar tidak selalu menempatkan akun resmi platform di semua feed?
- Apakah konten resmi mengganggu relevansi feed, terasa seperti iklan, atau mengurangi rasa kepemilikan komunitas?
- Bagaimana platform besar menyampaikan perubahan produk, insiden, dan pengumuman kebijakan?
- Mana yang perlu masuk feed dan mana yang lebih tepat di notifikasi sistem, inbox, help center, atau changelog?
- Bagaimana mencegah kelelahan notifikasi dan menjaga kepercayaan pengguna?

### Risiko awal
Feed clutter, announcement fatigue, kesan promosi diri, penyalahgunaan kanal, pengumuman tidak relevan lintas wilayah/bahasa, dan kebingungan antara akun sosial dengan pesan sistem.

### Next action
Belum dijadwalkan. Lakukan riset kompetitor dan pola komunikasi produk jika founder meminta.

## IDEA-002 — Modular architecture, safe growth, and compatibility
Status: IDEA / LONG-TERM ENGINEERING PRINCIPLE
- Aplikasi perlu dipisah menjadi modul dengan batas domain, kontrak, dependency, dan tanggung jawab yang jelas.
- Perubahan satu modul tidak boleh merusak modul yang sudah digunakan. Prioritaskan backward compatibility, migration bertahap, automated tests, feature flags bila sesuai, dan rollback.
- Sebelum memilih bahasa/framework baru, bandingkan runtime, biaya hosting, performa, ekosistem, keamanan, pemeliharaan solo, dan workflow Android.
- Pilihan bahasa dan arsitektur belum diputuskan; jangan memilih karena tren atau asumsi skala.
- Rencanakan observability, capacity/load testing, backup/recovery, incident response, abuse protection, dan release controls.

## IDEA-003 — AI-assisted operations and security agents
Status: IDEA / FUTURE RESEARCH — NOT IMPLEMENTED

### Kandidat peran
- Security monitoring dan vulnerability/dependency review.
- Bug/error triage dari logs, stack traces, error IDs, dan laporan pengguna.
- Availability, latency, resource, dan performance monitoring.
- Incident correlation, impact assessment, dan rekomendasi mitigasi.
- Laporan harian, mingguan, bulanan untuk founder.

### Standar laporan
Setiap temuan menyertakan waktu, komponen terdampak, severity, bukti/log/error ID, kemungkinan dampak, langkah reproduksi bila ada, rekomendasi, confidence/ketidakpastian, dan status tindak lanjut. Laporan periodik merangkum tren dan temuan terbuka.

### Batas keamanan agent
- Least privilege dan akses terpisah per tugas.
- Secret tidak boleh dimasukkan ke prompt/log atau dibaca tanpa kebutuhan sah.
- Agent boleh mendeteksi, menganalisis, membuat laporan, dan mengusulkan patch.
- Perubahan production, permission, penghapusan data, rotasi credential, dan tindakan berisiko memerlukan persetujuan manusia serta audit trail.
- Agent tidak boleh mengklaim sistem aman hanya karena tidak menemukan alert.
- Evaluasi false positive/negative, audit log, dan prosedur saat monitoring gagal wajib dirancang.

## IDEA-004 — Domain sendiri dan repository privacy
Status: IDEA / FUTURE DEPLOYMENT & SECURITY PLANNING

### Masukan founder
Founder menyebut target domain masa depan fluids.com dan menginginkan pengguna mengakses domain produk secara langsung, tanpa mudah menemukan repository GitHub atau akar implementasi.

### Klarifikasi wajib
Nama produk/repository saat ini adalah Pluits. Hubungan Pluits dengan fluids.com belum dikonfirmasi. Jangan rename repo, brand, app metadata, atau URL sebelum keputusan eksplisit.

### Fakta dan risiko
- Custom domain hanya mengubah alamat yang digunakan pengguna; custom domain tidak menyembunyikan repository, source map, bundle JavaScript, asset, endpoint, metadata, atau riwayat commit yang memang publik.
- Repository public tetap dapat ditelusuri meskipun website memakai domain sendiri.
- Repository private membatasi akses source di GitHub, tetapi tidak membuat kode frontend yang dikirim ke browser menjadi rahasia.
- API keys client-side, endpoint, dan schema yang terekspos harus dianggap dapat ditemukan. Secret server-side harus disimpan di secret manager/environment dan dilindungi policy backend.
- Kelayakan private repository pada GitHub Pages bergantung pada paket dan batasan layanan saat migrasi dilakukan. Hosting produksi dapat dipindah ke layanan yang sesuai sebelum menutup atau memindahkan repository.

### Sebelum migrasi
- Audit visibility, secrets, Actions permissions, logs, source maps, frontend bundles, Supabase RLS, public buckets, API exposure, DNS, TLS, backup, rollback, dan vendor lock-in.
- Pilih hosting berdasarkan biaya, backend/runtime, deploy dari ponsel, observability, dan privasi.
- Siapkan DNS, HTTPS, redirects, email, environment separation, monitoring, dan recovery plan.
- Jangan menjanjikan domain sendiri membuat sistem tidak bisa ditiru atau diganggu; keamanan berasal dari desain, kontrol akses, dan operasi.
- Jangan ubah visibility repository atau deployment tanpa persetujuan founder dan rencana transisi teruji.

## Log keputusan
Belum ada ide dalam dokumen ini yang disetujui sebagai fitur implementasi.
