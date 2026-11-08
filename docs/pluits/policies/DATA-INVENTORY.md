# Pluits — Data Inventory & Privacy Mapping

Tanggal pembaruan: 8 November 2026  
Status: INITIAL TECHNICAL INVENTORY — bukan Privacy Policy final. Hanya fakta yang sudah diperiksa dicatat sebagai terkonfirmasi; detail yang belum diaudit ditandai OPEN.

## Tujuan
Menjadi sumber teknis bagi penyusunan Kebijakan Privasi. Setiap fitur baru harus menambahkan atau memperbarui baris inventaris ini pada checkpoint implementasinya.

## Inventaris awal

| Domain | Data/objek yang diketahui | Tujuan produk | Kontrol/akses yang diketahui | Status dan hal yang belum dipastikan |
|---|---|---|---|---|
| Akun | Supabase Auth user identity, email/password credential handled by Auth; user profile | Registrasi, login, identitas akun | Auth provider dan profile policies; akun nyata harus mengendalikan aksesnya | Retensi Auth logs, backup deletion, vendor/subprocessor list, dan dasar hukum perlu dikonfirmasi |
| Profil | display name, username, bio, avatar/cover path, visibility, public city/area fields | Profil dan discovery sosial | RLS; public/private profile visibility; private media access follows approved relationship rules | Field wajib/opsional, export/delete lifecycle, dan retensi belum dipetakan lengkap |
| Alamat | alamat pengguna dan koordinat pada user_addresses | Pengiriman/layanan dan alamat pilihan | Private owner-scoped RLS; bukan profil publik | Retensi setelah akun ditutup, geocoding vendor, dan lokasi penyimpanan perlu audit |
| Postingan | user_posts, caption, media type/path, audience/visibility, timestamps, tags | Feed dan profil sosial | RLS berdasarkan pemilik, publikasi, visibilitas profil, dan hubungan follow | Edit/delete lifecycle, backup retention, dan content moderation retention perlu dipastikan |
| Media pengguna | object pada bucket privat pluits-user-media; avatar/cover/post/story media paths | Foto/video dan media profil | Private bucket, signed URLs, owner folder paths, media access policy | Log akses, signed URL expiry, orphan cleanup, upload retry, video metadata dan retention belum dipetakan lengkap |
| Interaksi | post_likes, post_comments, saves, follows | Like, komentar, simpan, follow | User-scoped policies; private follow request pending/accepted | Retensi setelah post/account deletion, abuse evidence retention, dan export perlu ditentukan |
| Stories | Story records, media path, audience, expiry fields | Konten sementara 24 jam | Public/private audience policy; private owner media paths | Apakah konten benar-benar dihapus atau hanya tidak ditampilkan setelah expiry perlu diverifikasi; backup retention OPEN |
| Reels | Video posts dari user_posts pada feed Reels | Penemuan video | Mengikuti kebijakan post dan media yang sama | Autoplay, analytics, transcoding, CDN dan retensi belum tersedia/terpetakan |
| Notifikasi | user_notifications: recipient, actor, event type, entity reference, message, created_at, read_at | Aktivitas follow, like, komentar | RLS per recipient; pengguna hanya dapat membaca notifikasinya dan mengubah read_at; insert dibuat trigger database | Push/email delivery belum ada; retention, deletion, notification preference belum ditentukan |
| GeoDirectory | entities, locations, categories, sources, claims, memberships, preferences, activity, feedback, saved/recent | Direktori, nearby, claim, rekomendasi | RLS; source/claim internals tidak terbaca anon; opt-in precise GPS di UI | Retensi GPS/activity, data source licensing, third-party geocoding/tiles, dan deletion rules perlu audit |
| Rekomendasi | user interest preferences, discovery preferences, activity events, recommendation feedback | Ranking nearby dan personalisasi | Preferensi eksplisit dan kontrol personalisasi; activity signals terbatas untuk ranking | Detail event retention, opt-out semantics, profiling explanation dan reset workflow perlu ditentukan |
| Toko/Marketplace | stores, products, order-related legacy structures | Katalog, penjualan dan pemenuhan lokal | Store-owner RPC dan RLS yang ada; dua legacy SECURITY DEFINER RPC masih perlu review | Data map pesanan, pelanggan, pembayaran, vendor, refund, retention, dan legal basis belum selesai |
| Trip | Belum diverifikasi sebagai booking data model aktif pada checkpoint ini | Trip booking dan pengalaman | Belum ada klaim kontrol aktif | Jangan publikasikan aturan booking/refund sebelum schema dan flow diuji |
| Wallet/payment | Wallet account/request structures pernah teridentifikasi; bukan bukti payment rail aktif | Rencana saldo/permintaan pembayaran | Tidak boleh diasumsikan sebagai saldo uang nyata | Ledger, settlement, provider, reconciliation, fraud controls dan regulatory review OPEN |
| Moderasi/Report/Block | Sebagian struktur/fitur belum lengkap | Keamanan komunitas | Tidak boleh mengklaim report/appeal workflow lengkap | Evidence access, retention, reviewer roles, appeal, SLA dan deletion rules OPEN |

## Lokasi dan geodata — aturan saat ini
- GeoDirectory UI menggunakan area default Denpasar sebagai titik uji, bukan klaim bahwa itu lokasi persis pengguna.
- GPS presisi diminta hanya setelah pengguna menekan kontrol “Gunakan lokasi saya”.
- Pengguna dapat memilih area secara manual.
- Tidak ada klaim bahwa lokasi presisi disimpan sebagai riwayat perjalanan pengguna.
- Data direktori pihak ketiga harus memiliki provenance, atribusi, dan dasar lisensi yang dapat diperiksa. Jangan mengimpor/scrape Google Maps.
- Peta/tile provider, geocoding, IP logs, analytics, dan CDN perlu masuk inventaris vendor bila benar-benar digunakan.

## Kontrol yang harus dipetakan sebelum Privacy Policy final
1. Tujuan dan kebutuhan setiap kategori data.
2. Apakah wajib atau opsional dan akibat bila tidak diberikan.
3. Dasar pemrosesan yang relevan menurut hukum yang berlaku.
4. Pihak internal dan eksternal yang dapat mengakses.
5. Penyedia layanan/subprocessor, lokasi pemrosesan, dan transfer lintas negara.
6. Retensi aktif, backup retention, penghapusan, dan pengecualian legal.
7. Mekanisme akses, koreksi, ekspor, penarikan persetujuan, dan penghapusan akun/data.
8. Keamanan: enkripsi saat transit/tersimpan, akses staf, audit log, backup, incident response — hanya dicatat sebagai fakta setelah diverifikasi.
9. Kontak pengendali data dan proses permintaan subjek data.
10. Proses notifikasi insiden dan perubahan kebijakan.

## Open questions — jangan diasumsikan
- Entitas hukum yang akan menjadi operator/pengendali data Pluits.
- Alamat/kontak resmi untuk permintaan privasi dan pengaduan.
- Daftar vendor/subprocessor dan lokasi data.
- Retensi database, storage, logs, backups, dan data setelah akun dihapus.
- Mekanisme ekspor akun dan penghapusan akun/data end-to-end.
- Dasar pemrosesan, consent dan usia minimum per wilayah.
- Analytics/telemetry, cookies, advertising SDK, push notification provider.
- Proses KYC dan dokumen identitas jika kelak diterapkan.
- Retensi laporan moderasi dan bukti transaksi/sengketa.
- Aturan transaksi Marketplace dan Trip, pembayaran, refund, serta pembagian peran pengendali/pemroses data.

## Update rule
Setiap migration, bucket/policy, RPC, analytics event, vendor, atau fitur baru yang mengumpulkan/menggunakan data harus menambahkan pembaruan ke dokumen ini. Catat checkpoint, sumber kode/migration, status verifikasi, dan tanggal. Privacy Policy publik hanya boleh disusun dari item terverifikasi dan harus melalui legal review sebelum diberlakukan.
