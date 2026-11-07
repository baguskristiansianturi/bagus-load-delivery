# Pluits — Panduan Uji Pengguna Pertama (Mobile)

**Tujuan:** menguji Pluits sebagai pengguna biasa sebelum membuat toko.  
**Halaman uji:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/register  
**Profil:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/profile  
**Explore:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/explore  
**Alamat:** https://baguskristiansianturi.github.io/bagus-load-delivery/#/account/addresses

## Sebelum mulai
- Gunakan browser Android dengan koneksi internet.
- Siapkan email yang bisa dibuka untuk konfirmasi jika Supabase Auth meminta verifikasi email.
- Siapkan satu foto profil, satu foto sampul, satu foto postingan, dan satu video pendek MP4/WebM.
- Jangan mengunggah dokumen identitas, bukti pembayaran, atau alamat rumah sebagai konten publik.
- Akun pertama tetap akun pengguna biasa. Tidak perlu membuat toko untuk menjalankan tes ini.

## Langkah pengujian

### 1. Daftar dan masuk
1. Buka halaman uji dan pilih Daftar.
2. Masukkan nama tampilan, email, dan password minimal 8 karakter.
3. Buka email yang didaftarkan dan tekan tautan konfirmasi Pluits. Jika belum masuk, periksa folder spam atau gunakan tombol kirim ulang pada layar pendaftaran.
4. Setelah konfirmasi, kembali ke halaman Pluits. Jika sesi belum terbuka otomatis, masuk dengan email/password yang sama.
5. Pastikan halaman Profil Saya terbuka dan profil awal otomatis terbentuk.

**Lulus jika:** akun nyata tercatat di Supabase Auth, profil awal otomatis terbentuk, email terkonfirmasi, login berhasil, dan refresh halaman tidak mengeluarkan akun.

### 2. Lengkapi profil
1. Unggah foto profil JPG/PNG/WebP maksimal 8 MB.
2. Unggah foto sampul JPG/PNG/WebP maksimal 8 MB.
3. Isi nama tampilan dan bio.
4. Pilih username unik 3–30 karakter (huruf kecil, angka, titik, garis bawah).
5. Coba username yang sudah dipakai bila ada akun lain untuk memastikan sistem menolaknya.
6. Isi kota/kabupaten dan provinsi untuk lokasi publik.
7. Pilih profil Publik terlebih dahulu agar postingan dapat diuji di Explore.
8. Simpan perubahan.

**Lulus jika:** foto, nama, username, bio, dan lokasi tampil kembali setelah refresh. Nama tampilan boleh sama; username harus unik.

### 3. Tambahkan alamat privat
1. Buka menu Alamat.
2. Isi label, penerima, telepon, provinsi, kota/kabupaten, kecamatan, kelurahan/desa, kode pos lima digit, dan alamat lengkap.
3. Ketuk peta untuk memasang pin, atau pilih Gunakan lokasi saya lalu berikan izin lokasi kepada browser.
4. Periksa latitude dan longitude sebelum menyimpan.
5. Simpan sebagai alamat utama.
6. Tambahkan alamat kedua untuk menguji beberapa alamat.

**Lulus jika:** alamat muncul di daftar dan bisa diedit/dihapus. Alamat lengkap dan koordinat tidak muncul pada profil publik.

### 4. Unggah foto dan video
1. Buka Explore lalu pilih Buat postingan.
2. Pilih satu foto, tulis caption, tambahkan tag/kata kunci, dan pilih Publik.
3. Terbitkan postingan dan tunggu konfirmasi berhasil.
4. Ulangi dengan video pendek MP4/WebM.
5. Buka Profil Saya dan pastikan kedua unggahan tampil di galeri.
6. Buka Explore dan pastikan kedua unggahan akun pertama muncul.
7. Kembali ke Beranda utama. Postingan publik seharusnya tampil pada feed publik; postingan privat tidak boleh tampil.
8. Buka Beranda dari browser privat/perangkat lain tanpa login untuk memeriksa bahwa hanya postingan dan media yang memang publik yang dapat dilihat.

**Batas MVP:** foto/video maksimal 50 MB per file. Video yang sangat besar atau format lain belum didukung pada tahap ini.

### 5. Uji interaksi pada postingan
- Suka dan batalkan suka.
- Buka komentar dan kirim komentar.
- Bagikan tautan postingan.
- Tandai/simpan postingan lalu batalkan.
- Pada postingan milik sendiri, pilih Tag dan masukkan username akun lain yang sudah terdaftar.
- Refresh halaman dan pastikan hasil interaksi tetap tersimpan.

### 6. Uji privasi dasar
- Ubah profil menjadi Privat dan simpan.
- Masuk dengan akun lain untuk memastikan postingan akun privat tidak muncul pada Explore.
- Kembali ke akun pertama dan ubah lagi menjadi Publik bila ingin melanjutkan tes feed.

## Catatan batas fitur pada build ini
- Chat pribadi, Story/Reels terpisah, followers/following, notifikasi tag, moderasi/report/block, edit/hapus postingan, halaman profil publik yang dapat dibuka lewat username, dan tampilan toko di profil masih menjadi PR.
- Share menggunakan native share sheet Android bila tersedia; browser lain menggunakan salin tautan.
- Peta menggunakan OpenStreetMap/Leaflet dan membutuhkan koneksi internet. Jika peta gagal dimuat, koordinat tetap dapat dimasukkan manual.
- Saldo/wallet dan transaksi uang sungguhan tidak diaktifkan.
- Pengujian end-to-end dengan akun nyata masih harus dilakukan oleh pemilik akun; jangan menandai alur lulus sebelum semua langkah diuji.

## Jika terjadi masalah
Catat halaman, langkah, pesan error persis, tipe file/ukuran file, dan waktu kejadian. Jangan kirim password, OTP, access token, atau data alamat lengkap ke percakapan.


## Status akses feed publik
- Pengunjung tanpa login dapat membaca profil publik dan postingan publik yang berstatus published.
- Alamat, profil privat, postingan privat, dan media yang tidak direferensikan oleh konten publik tetap dilindungi RLS.
- Explore dengan interaksi (suka, komentar, simpan, tag, dan membuat postingan) tetap membutuhkan login.
- Media disimpan pada bucket privat; signed URL anonim hanya dapat dibuat untuk media yang terhubung dengan postingan publik yang diterbitkan atau avatar/sampul profil publik.
