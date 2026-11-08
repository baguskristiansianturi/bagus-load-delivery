# Pusat Pengaturan dan Aktivitas Pluits

Status: IMPLEMENTED; deployment dan UAT Android harus diverifikasi.
Terakhir diperbarui: 8 November 2026.

Pusat Pengaturan dan Aktivitas adalah satu tempat untuk mengelola identitas, privasi, aktivitas sosial, konteks profesional/bisnis, layanan Pluits, dan informasi bantuan.

## Bagian pusat pengaturan
- **Akun dan identitas:** profil pribadi, profil profesional, Seller Center, dan alamat.
- **Privasi dan keamanan:** pengaturan audiens konten, inbox aktivitas, serta pengikut dan permintaan.
- **Pluits untuk kebutuhan Anda:** GeoDirectory, Marketplace, Trip, dan Wallet.
- **Bantuan dan informasi:** Pusat Bantuan, Pedoman Komunitas, Ketentuan Penggunaan, Kebijakan Privasi, dan Tentang Pluits.

## Batas kemampuan saat ini
Pusat pengaturan hanya menjadi pintu menuju rute aplikasi. Kontrol sesi/perangkat, autentikasi dua langkah, ekspor data, penghapusan akun, dan status verifikasi tidak boleh dianggap tersedia sebelum backend serta pengujiannya selesai. Trip sementara diarahkan ke GeoDirectory; ini bukan pernyataan bahwa modul Trip telah selesai. Marketplace kembali ke beranda aplikasi.

## Privasi dan audiens
Halaman Privasi dan Audiens menyimpan preferensi default personal, professional, business, Story, komentar, mention, dan pesan melalui `account_content_preferences`. Pengaturan default tidak menggantikan pilihan audiens per konten jika pilihan tersebut tersedia.

## Pemeliharaan dokumentasi
Perubahan menu atau kemampuan harus diselaraskan dengan backend, bantuan, ketentuan, kebijakan privasi, pedoman komunitas, dan tes penerimaan. Draft kebijakan bukan dokumen legal final dan memerlukan review sebelum diberlakukan.