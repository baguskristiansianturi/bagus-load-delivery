# PLUITS — Spesifikasi Arsitektur GeoDirectory

**Status:** DECIDED / DESIGNED; belum IMPLEMENTED.  
**Tanggal:** 8 November 2026  
**Cakupan awal:** Bali, Denpasar sebagai area uji pertama.  
**Arah jangka panjang:** direktori global, local-first rollout.

## 1. Keputusan
| Dimensi | Keputusan |
|---|---|
| Lokasi | Nearby |
| Beranda | Hybrid: social + places + activities + commerce |
| Cakupan | Local-first: Bali/Denpasar, schema global-ready |
| Personalisasi | Adaptive, dikendalikan pengguna |

## 2. Tujuan dan jenis entitas
GeoDirectory adalah indeks kanonis entitas yang memiliki konteks lokasi. Satu entitas dapat digunakan Social, Trip, Marketplace, Event, dan organisasi tanpa duplikat. Jenis entitas: Place (pantai, destinasi, monumen, rumah ibadah, sekolah, fasilitas, alamat); Organization (yayasan, komunitas, lembaga, badan usaha); Provider (toko, restoran, produsen, distributor, jasa); Event/activity (kegiatan dan pengalaman). Alamat bukan otomatis bisnis; tempat bukan otomatis dapat dipesan.

## 3. Target model data
Nama tabel rancangan; rekonsiliasi dengan schema aktif sebelum migration.

| Tabel | Tanggung jawab |
|---|---|
| directory_entities | ID kanonis, tipe, slug, nama, deskripsi, status |
| directory_entity_categories | Banyak kategori per entitas |
| directory_locations | geography(Point,4326), alamat, area administratif |
| directory_entity_sources | Provenance, source ID, lisensi, pembaruan |
| directory_claims | Klaim dan review bukti |
| directory_memberships | Pengelola, role, permission |
| directory_media | Media, hak penggunaan, atribusi, moderasi |
| directory_relationships | Cabang, dikelola oleh, berada di dalam, terkait |
| user_interest_preferences | Minat eksplisit, area, jarak, personalisasi |
| user_activity_events | Sinyal interaksi minimum |
| user_recommendation_feedback | Not interested, show less, relevant, report |
| user_saved_items | Wishlist/tersimpan lintas tipe |
| user_recent_items | Baru dilihat lintas tipe |

Jangan menduplikasi stores/products/posts yang sudah ada. Cart dan order tetap domain Marketplace; booking tetap domain Trip.

## 4. Nearby dan data geografis
Gunakan PostGIS geography(Point,4326), GiST index, ST_DWithin untuk radius, ST_Distance untuk jarak. Simpan alamat administratif terstruktur dan country_code. GPS hanya dengan izin. Jika ditolak, fallback ke area manual, lalu area profil yang dipilih, atau mode jelajah. Jangan menyimpan tracking presisi terus-menerus. Map/list menggunakan query yang sama. Radius dapat diubah pengguna dan perlu diuji. PostGIS tersedia sebagai extension tetapi belum terpasang di database pada audit 8 Nov 2026.

## 5. Beranda hybrid dan rekomendasi adaptive
Candidate pool: posting sosial publik, akun diikuti, entitas direktori, produk/layanan, event, komunitas. Ranking MVP deterministic dan explainable: minat eksplisit, jarak/area, interaksi disengaja, freshness/jadwal, kualitas data/status verifikasi relevan, diversity, safety/visibility, dan penalti untuk konten disembunyikan/dilaporkan. Bobot diuji, bukan final. Jangan mengandalkan popularitas mentah, memancing kemarahan/polarisasi, atau menyamarkan iklan.

Sediakan tab Untuk Anda dan Mengikuti. Kontrol pengguna: minat, area, kategori tersembunyi, feedback, reset rekomendasi, matikan personalisasi. Jangan menyimpulkan agama, pandangan politik, kesehatan, orientasi, atau atribut sensitif dari aktivitas.

## 6. Klaim dan role
Halaman entitas yang belum diklaim dapat menawarkan “Klaim tempat ini”. Verifikasi bukti kewenangan, cek duplikasi/sengketa, audit log, role berbeda, dan pencabutan akses. Klik klaim bukan persetujuan. Bedakan owner, authorized manager, staff, contributor, unclaimed.

## 7. Relasi lintas modul
Social post menautkan entity_id. Trip destination mengacu ke GeoDirectory; itinerary/booking/visit tetap domain Trip. Marketplace menghubungkan store/provider dan lokasi ke entity; produk/offers/orders tetap domain Marketplace. Event menautkan organizer dan place. View bukan bukti visit; posting bukan bukti transaksi.

## 8. Wishlist, recent, cart
Wishlist/recent tersinkron server-side dengan RLS. Guest state lokal sementara boleh digabung aman setelah login. Cart Marketplace disimpan server-side; harga/stok/ongkir/pajak divalidasi server saat checkout. LocalStorage bukan sumber kebenaran transaksi. Cart Trip terpisah bila lifecycle booking berbeda.

## 9. Sumber data
Gunakan data sendiri, kontribusi komunitas termoderasi, sumber terbuka berlisensi, dan API resmi. Jangan scraping atau menyalin Google Maps data/foto/reviews tanpa hak/izin. Simpan provenance, lisensi, waktu pembaruan, dan status verifikasi. Import bukan klaim atau verifikasi.

## 10. Keamanan
RLS pada tabel exposed. Preferensi/activity/saved/recent hanya dapat diakses pemilik. Claim/membership punya authorization terpisah. Jangan gunakan user_metadata untuk otorisasi; jangan ekspos service_role. Media memerlukan validasi hak penggunaan dan moderasi. Deduplikasi perlu review; sediakan koreksi, laporan, audit, soft delete, dan banding.

## 11. Tahapan
1. Audit schema, RLS, RPC, storage, frontend, taxonomy My Bali.
2. Finalisasi entity/category/area model.
3. Install PostGIS melalui migration yang direview; buat entity/location/source, GiST, nearby RPC, RLS.
4. UI map/list/detail dan search/filter.
5. Claims/memberships/roles/audit.
6. Integrasi Social/Trip/Marketplace/Event.
7. Preferences/activity/feedback dan ranking deterministic.
8. Migrasi wishlist/recent/cart ke backend.
9. Uji mobile, RLS lintas akun, GPS granted/denied, duplikasi/klaim palsu, koneksi lambat, performa radius.

## 12. Audit baseline 8 November 2026
- Frontend Vite/JavaScript modular dengan hash routing; home saat ini social feed + shortcut Marketplace, belum nearby directory.
- services.js masih memakai katalog lokal untuk search; categoryService.list() kosong.
- store.js menyimpan cart, wishlist, recent, orders, dan user cache di localStorage.
- Supabase memiliki social/profile/follow dan store/product; GeoDirectory universal/claims/location/source belum ditemukan.
- PostGIS dan vector belum terpasang; PostGIS prioritas, vector tidak dibutuhkan untuk MVP.
- Audit tidak mengubah schema, frontend, atau deployment.

## 13. Kriteria penerimaan
- Pengunjung dapat menjelajah direktori lokal tanpa klaim pengelola.
- GPS ditolak tetap menghasilkan pengalaman jelajah yang layak.
- Nearby map/list konsisten dan jarak akurat.
- Satu entitas dapat dipakai lintas modul tanpa duplikasi.
- Klaim tidak memberi akses sebelum diverifikasi; role dapat dicabut dan diaudit.
- Saved/recent/preferences tidak bocor lintas akun.
- Rekomendasi dapat dijelaskan dan dikendalikan.
- Sumber eksternal memiliki provenance dan dasar penggunaan sah.


## 14. Implementasi tahap pertama (8 November 2026)
- PostGIS/pg_trgm aktif di schema `extensions`; tabel inti, RLS, grants, nearby RPC, GiST, claims, memberships, preferences, activity, feedback, saved/recent, relationships, media metadata, social post tags, dan store-to-entity link telah diterapkan.
- 27 kategori dan 4 starter records Bali telah dimasukkan dengan provenance/attribution. Data bukan hasil scraping Google Maps.
- Frontend memiliki Home nearby, list/map, filter, area/radius, GPS opt-in, detail, claim, adaptive interest, feedback, Wishlist dan Baru Dilihat untuk entitas direktori.
- Ranking menggunakan minat eksplisit + sinyal aktivitas 90 hari, jarak, dan feedback. Bukan model AI/ML.
- SQL verification: anon 15 km=2, 50 km=4, beach filter=1, invalid latitude=0; RLS aktif untuk semua 16 tabel publik baru; source/claim/preferences tidak dapat dibaca anon; GiST tersedia.
- Build Pages run #506 sukses pada commit `2432e4a`. UAT perangkat Android belum dilakukan.
- Batasan: cakupan data hanya empat tempat; tidak ada import/dedup pipeline, admin claims/media dashboard, Storage upload, UI pengaitan store/social, Trip link, atau migrasi commerce cart/product wishlist.
- Lihat `docs/pluits/GEODIRECTORY-IMPLEMENTATION-REPORT-2026-11-08.md` untuk detail, hasil evaluasi, risiko, dan UAT checklist.
