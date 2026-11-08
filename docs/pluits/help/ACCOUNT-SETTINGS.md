# Pusat Pengaturan dan Aktivitas Pluits

Status: UI Account Center dibangun ulang; deployment dan UAT Android menunggu verifikasi.
Terakhir diperbarui: 8 November 2026.

## Tujuan
Pusat Pengaturan Pluits adalah satu pintu untuk mengelola identitas universal dan pengalaman pengguna lintas komunitas, GeoDirectory, Marketplace, layanan profesional, organisasi/toko, serta Trip. Pola navigasi mengambil inspirasi dari kesederhanaan Instagram, tetapi struktur dan kebijakan mengikuti model bisnis Pluits.

## Bagian Pusat Pengaturan
- **Akun Anda:** profil personal, profil profesional, toko/organisasi, alamat.
- **Cara Anda menggunakan Pluits:** privasi dan audiens, pengikut, GeoDirectory, Marketplace, Trip, Wallet.
- **Interaksi dan dukungan:** aktivitas/notifikasi, Pusat Bantuan, Pedoman Komunitas, Ketentuan dan Privasi.

## Status fungsi
- Profil, profil profesional, Seller Center, alamat, privasi/audiens, aktivitas, pengikut, GeoDirectory, Marketplace, dan Wallet memiliki rute yang sudah tersedia dalam tingkat implementasi berbeda; jangan menganggap seluruh alur telah lulus UAT.
- Trip saat ini diarahkan sementara ke GeoDirectory dan diberi penanda bertahap; ini bukan klaim bahwa modul Trip sudah selesai.
- Help Center, Pedoman Komunitas, Ketentuan, dan Kebijakan Privasi belum seluruhnya tersedia sebagai halaman publik di aplikasi. Menu tahap pengembangan tidak boleh dianggap sebagai fitur aktif.
- Kontrol sesi/perangkat, autentikasi dua langkah, ekspor data, penghapusan akun, dan status verifikasi tidak boleh dianggap tersedia sebelum backend serta pengujiannya selesai.

## Privasi dan audiens
Halaman Privasi dan Audiens menyimpan preferensi default personal, professional, business, Story, komentar, mention, dan pesan melalui `account_content_preferences`. Pengaturan default tidak menggantikan pilihan audiens per konten jika pilihan tersebut tersedia.

## Pemeliharaan dokumentasi
Perubahan menu atau kemampuan harus diselaraskan dengan backend, bantuan, ketentuan, kebijakan privasi, pedoman komunitas, dan tes penerimaan. Draft kebijakan bukan dokumen legal final dan memerlukan review sebelum diberlakukan.

## Pembaruan 8 November 2026 — Keamanan dan izin perangkat

Pusat Pengaturan sekarang memiliki menu **Keamanan & perangkat** (`#/account/security`) sebagai modul terpisah:
- Username akun dan visibilitas publik/pribadi.
- Password baru.
- Nomor HP dan verifikasi OTP SMS (bergantung konfigurasi penyedia SMS Supabase).
- Verifikasi dua langkah TOTP melalui aplikasi authenticator.
- Preferensi bahasa Indonesia/English. Penyimpanan preferensi tersedia, tetapi penerjemahan seluruh layar belum selesai.
- Permintaan izin lokasi berdasarkan aksi pengguna.
- Native photo/video picker. Browser/Android tetap mengelola izin galeri; Pluits tidak dapat memaksa atau memberi izin sebelum pengguna membuka pemilih media.
- Verifikasi akun personal masih belum tersedia. Tidak ada badge yang diberikan otomatis; proses pemeriksaan profesional/toko berbeda dari verifikasi identitas personal.

Status: kode dan backend preference telah diterapkan; SMS/TOTP dan seluruh pengaturan perlu diuji pada akun dan perangkat nyata. Jangan menyebutnya diterima sebelum UAT.