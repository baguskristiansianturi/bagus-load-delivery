# PLUITS — GeoDirectory Trust, Claim & Local Operations Audit
**Tanggal pemeriksaan:** 9 November 2026  
**Repository:** baguskristiansianturi/pluits · branch main  
**Supabase:** ytndswhqxayqpftszwfh · production snapshot  
**Sifat:** pemeriksaan read-only; tidak mengubah database, akun, media, atau deployment.

## 1. Mengapa audit ini dilakukan
Model bisnis founder menempatkan GeoDirectory sebagai peta kehidupan lokal dan bukti konteks fisik: pengguna perlu memahami siapa penyedia, di mana tempatnya, apakah dapat didatangi, serta apakah pickup atau pemenuhan lokal tersedia. Karena itu, pin peta tidak boleh disamakan dengan verifikasi kepemilikan, keberadaan terkini, atau kesiapan transaksi.

## 2. Kondisi data live yang diperiksa
- Tabel GeoDirectory yang ditemukan: `directory_categories`, `directory_claims`, `directory_entities`, `directory_entity_categories`, `directory_entity_sources`, `directory_locations`, `directory_media`, `directory_memberships`, dan `directory_relationships`.
- Data live saat pemeriksaan: **4 entitas published**, semuanya bertipe `place` dan berstatus `unclaimed`.
- Baris pada `directory_claims`: **0**.
- Karena data yang ada hanya empat tempat belum diklaim, ini belum membuktikan kepadatan direktori usaha/organisasi Bali atau kelancaran proses klaim di lapangan.
- UI peta menggunakan Leaflet/OpenStreetMap. Jangan mengambil atau menyalin basis data, foto, atau review Google Maps tanpa lisensi/izin yang sesuai.

## 3. Fondasi yang sudah tersedia
- Entitas kanonis memiliki jenis, slug, nama, status, dan verification status.
- Lokasi memiliki alamat, locality/district/city/region, geometri, status publik, sumber lokasi, dan tingkat akurasi.
- Klaim memiliki applicant, peran, catatan bukti, evidence paths, status, reviewer, dan waktu pemeriksaan.
- Membership menyimpan role, permission, status, masa berlaku, pemberi akses, dan referensi claim.
- Fungsi `directory_nearby` menghitung jarak, filter kategori/pencarian, dan hanya mengembalikan entitas published dengan lokasi publik.
- UI detail tempat menampilkan status unclaimed/pending/verified dan memberi akses ke form klaim.
- Form klaim meminta peran dan catatan kewenangan. Akses pengelolaan dinyatakan belum aktif sebelum pemeriksaan dan persetujuan.

## 4. Temuan yang menghalangi kepercayaan end-to-end

### GDT-01 — Kondisi RLS media berpotensi memberi akses lintas entitas
**Severity: HIGH — perlu perbaikan keamanan sebelum fitur media GeoDirectory dipakai luas.**

Policy insert/update/delete/read pada `directory_media` menggunakan pemeriksaan membership dengan kondisi `m.entity_id = m.entity_id`. Kondisi ini membandingkan kolom dengan dirinya sendiri, bukan mengikat membership ke `directory_media.entity_id`. Secara logika, pemeriksaan dapat berubah menjadi “pengguna memiliki membership aktif pada entitas apa pun”, bukan “pengguna memiliki izin atas entitas pada baris ini”.

Dampak yang mungkin: anggota/pengelola satu entitas dapat memperoleh akses ke media entitas lain melalui operasi langsung API, bergantung kombinasi policy dan grants. Ini belum dibuktikan dengan eksploitasi lintas akun; tetap harus diperlakukan sebagai blocker keamanan sampai query policy diperbaiki dan negative tests membuktikan isolasi.

**Tindakan yang disarankan:** siapkan migration baru (jangan edit migration yang sudah diterapkan), ganti semua kondisi dengan relasi eksplisit antara membership dan row entity, periksa permission granular/role, lalu uji owner A vs entity B, manager, staff, revoked membership, anon, dan unrelated authenticated user. Perubahan production/RLS memerlukan approval dan rollback plan sebelum diterapkan.

### GDT-02 — Klaim belum memiliki jalur bukti dan review yang siap operasional
- Policy insert `directory_claims` hanya mengizinkan applicant mengirim status submitted, belum memiliki reviewer atau reviewed_at, dan `cardinality(evidence_paths)=0`.
- UI hanya mengirim role dan evidence_note; tidak ada unggah dokumen/foto bukti pada form saat ini.
- Policy baca yang terlihat hanya applicant dapat membaca klaimnya sendiri. Belum terlihat jalur reviewer/admin berbasis role untuk membaca dan memutuskan klaim melalui client.
- Tidak ada claim row live, sehingga belum ada bukti end-to-end submission → review → approval/rejection → membership → revocation.
- Pilihan role pada form bukan bukti bahwa pemohon benar-benar pemilik/pengurus/staf.

**Tindakan yang disarankan:** desain evidence intake privat per kategori, reviewer queue dengan otorisasi backend, verifikasi kontak/otoritas, alasan keputusan, audit trail, masa berlaku kewenangan, pencabutan, dan appeal. Jangan memberi akses pengelolaan hanya karena form berhasil dikirim.

### GDT-03 — Belum ada laporan lokasi salah yang terlihat pada UI direktori
- Kartu direktori menampilkan aksi “Kurangi”, bukan laporan terstruktur atas pin/alamat tidak ditemukan, duplikat, atau entitas salah.
- `report_content` menerima target entity dan dapat membuat content report; namun pada halaman direktori yang diperiksa tidak ditemukan pemanggilan fungsi tersebut atau alur report lokasi.
- Fungsi review report dapat mengarsipkan entity jika moderator memilih actioned; itu belum menjadi prosedur khusus verifikasi alamat fisik, koreksi koordinat, merge duplikat, atau appeal.
- Laporan tidak boleh otomatis menghapus pin. Laporan massal dapat dipakai untuk menjatuhkan kompetitor.

**Tindakan yang disarankan:** buat jenis laporan terstruktur, batasi satu laporan aktif per pengguna/entitas/alasan, ukur independensi sinyal, minta bukti yang proporsional, sediakan hak jawab dan appeal, dan tetapkan moderator/field-verification SOP. Tindakan otomatis hanya boleh berupa pengurangan distribusi sementara dengan ambang terukur dan audit; penghapusan final memerlukan verifikasi.

### GDT-04 — Data lokasi tidak sama dengan bukti operasional
Schema menyimpan alamat dan geometri, tetapi belum membuktikan lokasi itu benar-benar beroperasi, dapat didatangi, memiliki staf, menerima pickup, atau melayani area tertentu. Listing harus membedakan tempat tetap, cabang, kantor, lokasi kegiatan, dan area layanan bergerak. Alamat rumah profesional tidak boleh dibuka tanpa persetujuan.

### GDT-05 — Data starter terlalu tipis untuk menguji network effect
Empat entitas published, semuanya unclaimed, belum cukup untuk menguji pencarian lintas kategori, persaingan toko, organisasi, tempat ibadah, fasilitas publik, klaim massal, atau local density. Jangan membuat seed palsu. Uji dengan entitas nyata yang didaftarkan/diotorisasi secara sah.

## 5. Hubungan dengan model bisnis founder
GeoDirectory harus mendukung:
1. pengguna melihat tempat dan penyedia di peta yang dapat digeser;
2. pengguna membedakan lokasi fisik, cabang, area layanan, dan status pengelola;
3. toko fisik menunjukkan titik yang bisa didatangi serta opsi pickup/pengantaran yang benar-benar tersedia;
4. laporan lokasi salah memicu verifikasi dan koreksi, bukan hukuman otomatis;
5. organisasi/komunitas/lembaga memiliki pengelola sah dan staff roles;
6. identitas personal/profesional terhubung ke organisasi dengan persetujuan dan verifikasi;
7. data lokasi mendukung discovery lokal, Trip, dan layanan, tetapi tidak membuat semua entitas otomatis menjadi penjual.

## 6. Urutan perbaikan yang direkomendasikan
| Urutan | Pekerjaan | Prasyarat / gate |
|---|---|---|
| G0 | Tinjau dan perbaiki RLS `directory_media` | Approval security change, migration baru, negative tests, rollback |
| G1 | Claim evidence + reviewer workflow | Role authority, evidence retention, privacy, appeal |
| G2 | Report location/entity + case management | Moderator/field SOP, anti-abuse, audit |
| G3 | Location provenance and physical-presence verification | Licensed sources, on-site checks where justified |
| G4 | Local entity density and category coverage | Real provider/community onboarding, no fake seed |
| G5 | Business/organization staff and branch operations | Authorization matrix and UAT |

Pekerjaan GeoDirectory lanjutan tidak boleh menggeser P0 Social First Release sampai founder UAT diterima. Namun temuan keamanan GDT-01 harus ditinjau sebagai isu produksi terpisah karena menyangkut isolasi data.

## 7. Bukti dan batasan
- Pemeriksaan schema/columns, RLS policies, function definitions, live row counts, serta frontend `src/pages/directory/index.js`.
- Fungsi `directory_nearby` bukan SECURITY DEFINER; report/review functions adalah SECURITY DEFINER dan harus terus diperiksa grant/authz-nya.
- Tidak dilakukan eksploitasi, upload, perubahan policy, migration, atau tindakan pada data pengguna.
- Tidak ada klaim bahwa Android UAT, claim review, field verification, atau regional support telah diuji.
