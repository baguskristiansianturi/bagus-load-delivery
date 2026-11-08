# IDEAS — Future Product & Engineering Backlog

Identitas produk dan repository aktif: Pluits. Belum ada nama alternatif atau domain khusus yang disetujui founder; jangan menyimpulkan nama dari salah dengar/transkripsi.
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


## Template pencatatan ide/temuan baru
Salin blok ini untuk setiap temuan baru. Satu temuan dapat berasal dari percakapan founder, pengujian aplikasi, screenshot, analisis kompetitor, riset, atau audit.

### IDEA-XXX — [Judul singkat]
- **Tanggal ditemukan:**
- **Sumber/konteks:** chat, UAT, screenshot, kompetitor, audit, riset, atau lainnya.
- **Kategori:** UX/UI | User Journey | Business Model | Pricing/Revenue | Strategy/Growth | Trust/Safety | Technical Architecture | Operations | Legal/Compliance | Research.
- **Jenis:** FACT | OBSERVATION | ASSUMPTION | HYPOTHESIS | OPINION.
- **Status:** PROPOSED | NEEDS RESEARCH | PARKED | APPROVED | REJECTED | PROMOTED | MERGED.
- **Masalah yang ditemukan:**
- **Pengguna/pihak terdampak:**
- **Alur atau kondisi saat ini:**
- **Usulan/hipotesis solusi:**
- **Nilai/manfaat yang diharapkan:**
- **Alternatif dan alasan tidak membangun:**
- **Dampak ke Social / Marketplace / Trip / GeoDirectory:**
- **Dampak backend, data, permission, privasi, keamanan:**
- **Risiko, biaya, kompleksitas, dan dependency:**
- **Pertanyaan riset/validasi:**
- **Keputusan founder dan tanggal:**
- **Jika disetujui, bagian Business Model Master yang diperbarui:**
- **Spesifikasi/PR/checkpoint roadmap:**
- **Bukti UAT/hasil setelah dijalankan:**

Aturan: AI boleh membantu menyusun dan menganalisis ide. AI tidak boleh menandai APPROVED, mengubah Business Model Master, atau memasukkan ide ke roadmap tanpa keputusan eksplisit founder.

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
Founder mempertimbangkan domain milik sendiri pada masa depan dan menginginkan pengguna mengakses alamat produk secara langsung, tanpa mudah menemukan repository GitHub atau akar implementasi. Nama domain belum dipilih.

### Klarifikasi wajib
Nama produk/repository saat ini adalah Pluits. Belum ada domain khusus yang disetujui. Jangan menebak domain, rename repo, brand, app metadata, atau URL sebelum keputusan eksplisit.

### Fakta dan risiko
- Custom domain hanya mengubah alamat yang digunakan pengguna; custom domain tidak menyembunyikan repository, source map, bundle JavaScript, asset, endpoint, metadata, atau riwayat commit yang memang publik.
- Repository public tetap dapat ditelusuri meskipun website memakai domain sendiri.
- Repository private membatasi akses source di GitHub, tetapi tidak membuat kode frontend yang dikirim ke browser menjadi rahasia.
- API keys client-side, endpoint, dan schema yang terekspos harus dianggap dapat ditemukan. Secret server-side harus disimpan di secret manager/environment dan dilindungi policy backend.
- Repository Pluits saat pemeriksaan 8 November 2026 masih PUBLIC. Ini berarti source dan riwayat yang tersimpan di repository dapat dilihat publik.
- Menurut dokumentasi GitHub saat ini, GitHub Pages tersedia untuk repository publik pada GitHub Free; penggunaan repository private untuk Pages memerlukan paket berbayar yang mendukungnya. Pada GitHub Free personal, mengubah repository menjadi private akan membuat site Pages yang dipublikasikan otomatis tidak tersedia. Periksa ulang ketentuan sebelum migrasi.
- Jika repository public diubah menjadi private, public forks yang sudah dibuat tidak otomatis menjadi private dan akan dipisahkan dari jaringan repository asal.
- Hosting produksi dapat dipindah ke layanan yang sesuai sebelum menutup atau memindahkan repository.

### Sebelum migrasi
- Audit visibility, secrets, Actions permissions, logs, source maps, frontend bundles, Supabase RLS, public buckets, API exposure, DNS, TLS, backup, rollback, dan vendor lock-in.
- Pilih hosting berdasarkan biaya, backend/runtime, deploy dari ponsel, observability, dan privasi.
- Siapkan DNS, HTTPS, redirects, email, environment separation, monitoring, dan recovery plan.
- Jangan menjanjikan domain sendiri membuat sistem tidak bisa ditiru atau diganggu; keamanan berasal dari desain, kontrol akses, dan operasi.
- Jangan ubah visibility repository atau deployment tanpa persetujuan founder dan rencana transisi teruji.

## Log keputusan
Belum ada ide dalam dokumen ini yang disetujui sebagai fitur implementasi.


## IDEA-005 — Governance capture for new founder discoveries
Status: IDEA / PROCESS ENHANCEMENT — NOT A PRODUCT FEATURE
- Temuan dari percakapan, UAT, analisis kompetitor, bug report, atau eksplorasi desain dapat dicatat dengan tanggal, konteks, dan sumber.
- Klasifikasikan: UX/UI, user journey, business model, pricing/revenue, strategy/growth, trust/safety, technical architecture, operations, legal/compliance, research.
- Bedakan observasi, asumsi, hipotesis, dan keputusan founder.
- Catat masalah, pengguna terdampak, hipotesis nilai, contoh, alternatif, alasan tidak membangun, risiko, biaya/kompleksitas, dependency, dan pertanyaan terbuka.
- Ide yang disetujui dipromosikan secara eksplisit ke Business Model Master (bila mengubah keputusan bisnis), spesifikasi domain, lalu Project Status & Roadmap. Tandai ide PROMOTED dan tautkan checkpoint/keputusan.
- Ide yang belum cocok tetap PARKED, REJECTED, atau MERGED; jangan hapus jejak pembelajaran.
