# PLUITS — SOCIAL CONTENT TRUST TECHNICAL SPEC
**Tanggal:** 10 November 2026 · **Status:** SPECIFICATION / NO PRODUCTION MIGRATION AUTHORIZED

## 1. Batas
Dokumen ini menyiapkan kontrak backend untuk Trust & Safety. Tidak mengizinkan migration, perubahan RLS/Storage, RPC production, atau automation. Frontend Social Media tetap prioritas; backend diimplementasikan setelah journey dan acceptance criteria diuji.

## 2. Domain konseptual
- Moderation: satu record per content revision dengan status, policy version, reason code, confidence, reviewer, dan timestamps.
- Reports: reporter, target type/id, category, description, evidence reference, state, decision, dan appeal linkage.
- Copyright claims: claimant, authority, source URL, original fingerprint, reported content, evidence, territory, counter-notice, resolution.
- Media provenance: upload source, first-seen timestamp, original asset reference, perceptual/video/audio fingerprints, transformations. Metadata hanya sinyal.
- Music rights: owner, license/version, territory, allowed use, attribution, start/end, revocation, proof.
- Identity verification: subject type, evidence vault reference, reviewer, badge scope, expiry/revocation, appeal.
- Online presence: ephemeral state dengan visibility preference dan expiry.
- Business link quota: business identity, timezone/day boundary, accepted link publication, idempotent quota enforcement.
- Audit events: append-only records untuk moderation, takedowns, appeals, identity, dan tindakan admin.

## 3. Moderation state machine
pending_review → published / distribution_limited / removed; distribution_limited → restored / removed / appeal_pending; removed → appeal_pending → restored atau tetap removed; laporan dapat berakhir rejected_report. Semua transisi harus authorized dan auditable. Frontend tidak boleh mengubah status secara mandiri. Konten dibatasi tidak boleh masuk Explore/Top 10.

## 4. Deteksi dan konteks
Synthetic AI video memakai gabungan visual, temporal, audio, provenance, dan model signals. Violence perlu klasifikasi sequence/context. Harassment harus memeriksa target dan konteks, tanpa inferensi identitas sensitif. Duplicate media membandingkan frame, temporal sequence, audio, dan transformed clips; rekaman independen kejadian yang sama tidak boleh otomatis dianggap copy. Copyright claim perlu bukti hak dan kewenangan. Music entitlement diperiksa per wilayah saat delivery/playback.

## 5. Rights dan distribusi
Decision record menyimpan policy version, scope, reason, evidence, actor, timestamp, dan appeal state. Takedown content-specific dimulai pada konten, bukan otomatis seluruh akun. Counter-notice dan public-interest review memerlukan human workflow dan proses hukum yang sesuai. Distribution-limited dikecualikan dari rekomendasi dan Top 10.

## 6. Media delivery dan watermark
Source asset privat; rendition publik memakai access control atau signed URL berumur pendek. Watermark memuat @username pemilik dan identitas Pluits. Fingerprint tersembunyi dapat diteliti dengan safeguards. Screenshot prevention best-effort dan tidak boleh dijanjikan absolut. Download UI bukan security; kontrol akses server adalah otoritas.

## 7. Identity, inbox, Top 10, quota
Badge scope harus eksplisit: personal, official/public figure, business, organization. Premium bukan verifikasi. DM eligibility ditegakkan server-side; block override message eligibility. Presence bersifat ephemeral. Top 10 dipartisi negara/kategori, scoring model versioned, normalized, anti-bot, tidak dipengaruhi paid membership, dan menyimpan historical achievement terpisah. External promotional-link post dibatasi satu per business account per hari dengan timezone-aware idempotent enforcement.

## 8. Privacy dan keamanan
RLS melindungi report evidence, identity documents, private media, messages, dan reviewer notes. Gunakan minimisasi data, retention schedule, least privilege, dan audit log. Jangan simpan evidence privat di bucket publik. Jangan lakukan production DDL sebelum audit migrasi/RLS/Storage dan rollback plan.

## 9. Account inactivity
Penghapusan otomatis setelah 12 bulan belum disetujui. Jangan membuat scheduled deletion job. Jika kelak disetujui, definisikan inactivity, warning, recovery, business accounts, transaction/audit retention, legal holds, export, dan deletion scope.
