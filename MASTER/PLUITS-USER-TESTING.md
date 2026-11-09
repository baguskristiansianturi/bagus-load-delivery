# Pluits — Panduan Uji Pengguna Pertama (Mobile)

**Tujuan:** menguji Pluits sebagai pengguna biasa sebelum membuat toko.  
**Halaman uji:** https://baguskristiansianturi.github.io/pluits/#/account/register  
**Profil:** https://baguskristiansianturi.github.io/pluits/#/account/profile  
**Explore:** https://baguskristiansianturi.github.io/pluits/#/account/explore  
**Alamat:** https://baguskristiansianturi.github.io/pluits/#/account/addresses

## Sebelum mulai
- Pastikan Supabase Dashboard → Authentication → URL Configuration mengizinkan redirect `https://baguskristiansianturi.github.io/pluits/` (tambahkan URL tersebut pada Redirect URLs; gunakan Site URL yang sesuai untuk tahap GitHub Pages).
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


### 5. Uji Stories 24 jam
1. Pastikan profil Publik bila ingin menguji Story publik.
2. Buka Explore. Di bagian Stories, pilih Buat Story.
3. Unggah satu foto, tambahkan caption singkat, pilih Publik, lalu Bagikan Story.
4. Pastikan Story muncul di strip horizontal; ketuk untuk membuka viewer.
5. Ulangi dengan video MP4/WebM dan pastikan video dapat diputar serta tidak dipotong/diregangkan.
6. Ubah profil menjadi Privat, buka kembali Explore, lalu pastikan pilihan Publik dinonaktifkan. Bagikan Story sebagai Hanya saya.
7. Buka Pluits dari browser privat/perangkat lain tanpa login. Story publik dari profil publik boleh terlihat; Story privat tidak boleh terlihat.
8. Setelah 24 jam, Story harus hilang dari daftar aktif. Penghapusan permanen/arsip media otomatis belum tersedia pada build ini.

**Lulus jika:** unggah, tampil, buka, rasio media, audience, dan batas 24 jam sesuai. Tes ini masih harus dilakukan dengan akun nyata; uji database rollback saja bukan pengganti UAT.


### 6. Uji Reels
1. Dari Explore, tekan Lihat Reels.
2. Jika belum ada video, kembali ke Buat postingan dan unggah video MP4/WebM.
3. Buka Reels lagi dan pastikan video tampil di aliran vertikal.
4. Putar video, jeda, lanjutkan, dan periksa kontrol pemutar.
5. Pastikan video portrait, landscape, dan square tetap memakai rasio sumber; tidak dipaksa crop atau stretch.
6. Uji suka, komentar, simpan, dan bagikan pada kartu video.
7. Pastikan video privat hanya terlihat oleh pemilik sesuai aturan RLS.

**Lulus jika:** daftar video terbuka, pemutar bekerja, interaksi tersimpan, dan rasio video tidak berubah. Full-screen swipe/autoplay belum menjadi bagian build ini.

### 7. Uji interaksi pada postingan
- Suka dan batalkan suka.
- Buka komentar dan kirim komentar.
- Bagikan tautan postingan.
- Tandai/simpan postingan lalu batalkan.
- Pada postingan milik sendiri, pilih Tag dan masukkan username akun lain yang sudah terdaftar.
- Refresh halaman dan pastikan hasil interaksi tetap tersimpan.

### 8. Uji privasi dasar
- Ubah profil menjadi Privat dan simpan.
- Masuk dengan akun lain untuk memastikan postingan akun privat tidak muncul pada Explore.
- Kembali ke akun pertama dan ubah lagi menjadi Publik bila ingin melanjutkan tes feed.

## Catatan batas fitur pada build ini
- Chat pribadi, followers/following, notifikasi tag, moderasi/report/block, edit/hapus postingan, halaman profil publik yang dapat dibuka lewat username, dan tampilan toko di profil masih menjadi PR. Stories dan feed Reels dasar sudah tersedia; upload/view nyata dan uji perangkat masih menunggu. Full-screen swipe/autoplay Reels belum dibuat.
- Share menggunakan native share sheet Android bila tersedia; browser lain menggunakan salin tautan.
- Peta menggunakan OpenStreetMap/Leaflet dan membutuhkan koneksi internet. Jika peta gagal dimuat, koordinat tetap dapat dimasukkan manual.
- Saldo/wallet dan transaksi uang sungguhan tidak diaktifkan.
- Pengujian end-to-end dengan akun nyata masih harus dilakukan oleh pemilik akun; jangan menandai alur lulus sebelum semua langkah diuji.

## Jika terjadi masalah
Catat halaman, langkah, pesan error persis, tipe file/ukuran file, dan waktu kejadian. Jangan kirim password, OTP, access token, atau data alamat lengkap ke percakapan.


## Status akses feed publik
- Pengunjung tanpa login dapat membaca profil publik dan postingan publik yang berstatus published.
- Alamat, profil privat, postingan privat, Story privat, dan media yang tidak direferensikan oleh konten publik tetap dilindungi RLS. Story publik hanya dapat dibaca jika profil pemilik juga publik dan Story belum kedaluwarsa.
- Explore dengan interaksi (suka, komentar, simpan, tag, dan membuat postingan) tetap membutuhkan login.
- Media disimpan pada bucket privat; signed URL anonim hanya dapat dibuat untuk media yang terhubung dengan postingan publik yang diterbitkan atau avatar/sampul profil publik.

## 9. Uji profil publik dan follow

Gunakan dua akun nyata berbeda (A dan B). Jangan memakai akun orang lain tanpa izin.

1. Login akun A dan buka postingan publik akun B.
2. Ketuk nama/username B. Pastikan profil publik B terbuka melalui URL hash username.
3. Dari A, tekan **Ikuti**. Pastikan tombol berubah menjadi **Mengikuti** dan jumlah mengikuti/pengikut berubah setelah halaman dimuat ulang.
4. Buka profil A dan pastikan daftar Pengikut memuat A/B sesuai hubungan yang benar.
5. Ubah akun B menjadi privat. Pastikan pengunjung anonim hanya melihat username, nama tampilan, dan status privat; bio, avatar, cover, wilayah, Story, serta postingan tidak terbuka.
6. Dari A, tekan **Minta mengikuti**. Pastikan status menjadi **Permintaan terkirim** dan konten privat tetap terkunci.
7. Login B, buka **Profil → Permintaan**, lalu pilih **Terima**. Pastikan hubungan menjadi diterima.
8. Login A kembali. Pastikan konten publik pada profil privat B dapat dibuka setelah persetujuan; konten ber-audience **Hanya saya** tetap tidak terlihat.
9. Uji **Tolak**, **Batalkan**, **Berhenti mengikuti**, dan **Hapus pengikut**. Refresh setelah setiap tindakan.
10. Pastikan akun tidak dapat mengikuti dirinya sendiri dan pengguna yang tidak terkait tidak dapat menyetujui permintaan orang lain.
11. Uji profil/post publik sebagai pengunjung tanpa login. Tombol interaksi harus mengarahkan ke login, bukan terlihat aktif tetapi tidak bekerja.
12. Ulangi seluruh alur di Android: lebar layar kecil, keyboard terbuka, tombol tidak terpotong, daftar dapat discroll, dan tidak ada horizontal overflow.

**Lulus jika:** semua status relasi konsisten setelah refresh; profil privat tidak membocorkan bio/media sebelum persetujuan; hanya target yang dapat menyetujui; penghapusan hubungan berlaku dua arah; profil publik dan postingan publik tetap dapat dijelajahi sebagai tamu.

## 10. Social-first founder UAT — build 8 November 2026

### A. Media and feed
1. Login with an existing account. Do not register repeatedly if email confirmation/rate limiting is active.
2. Open Create and select a real photo from the Android gallery. Check preview, publish, refresh, and open the post.
3. Repeat with a short MP4 or WebM video. Confirm it plays, preserves the original aspect ratio, and remains available after refresh.
4. Try a carousel with mixed images/video. Check swipe, media order, and layout on narrow screens.
5. Open the post menu, edit caption/visibility, add/remove media, save, then reopen the post. Confirm changes persist.
6. Double-tap a photo once; expect one like and one heart animation. Tap again only after the like state changes to unlike.
7. Delete only a test post you created and confirm media is no longer displayed. Never test destructive actions on important user content.

### B. Social interactions
1. Use a second account you control for cross-account tests.
2. Like/unlike, comment, reply, and like a comment. Refresh both accounts and compare state/counts.
3. Follow a public account, unfollow it, then follow a private account and verify pending/accept flow.
4. Check follower/following lists and profile privacy. A private account must not expose private posts/media to an unapproved viewer.
5. Verify notifications for follow request, accepted follow, new follower, unfollow, like, and comment. Confirm the unread count appears in the mobile header and desktop navigation, then decreases after marking items read.

### C. DM and offline outbox
1. Open Messages while online and allow Pluits to load contacts/inbox metadata once.
2. Start a DM with the second account and send a short message. Verify the recipient receives it without manual refresh while the chat is open.
3. With an existing conversation open, enable Airplane Mode. Send a clearly non-sensitive test message.
4. Confirm the message is labeled as saved on this device / waiting for connection, not sent or delivered.
5. Re-enable internet. Wait for the outbox to sync and confirm the recipient sees exactly one copy.
6. Reload Messages and verify the queue is empty. If the message remains pending, do not repeatedly submit the same text; report the error/time.
7. While offline, confirm previously cached contacts and thread metadata remain visible. Select a cached contact not yet messaged, draft a short test message, and confirm it is labeled as a local draft. Reconnect and confirm Pluits creates the conversation and sends exactly one copy.
8. Remote history cannot be fetched while offline.
9. Offline outbox is stored in browser localStorage on this device; do not test with confidential messages or shared/public devices.

### D. Account and device settings
1. Open Pusat Pengaturan → Keamanan & perangkat.
2. Test public/private visibility only with a second account; confirm private content remains private.
3. Change username only if you intend to keep the new username; verify duplicate username is rejected.
4. Test password change only when you can securely retain the new password.
5. Phone OTP depends on configured SMS provider. If SMS fails, capture the visible error without sharing the OTP.
6. TOTP test: enroll an authenticator, verify a six-digit code, then verify the factor status. Do not share QR/secret/OTP.
7. Change language preference. Current build stores the preference; the entire interface is not yet translated to English.
8. Test location permission through the user-initiated button. Confirm denial is handled and no coordinates are saved by this permission check.
9. Open the photo/video picker. Selecting a file in this settings check does not upload it.

### E. System notices
1. Moderator/admin role is required to open #/admin/moderation and publish a system notice.
2. Publish a non-sensitive test announcement with a short expiry; verify it appears in Activity → Informasi Pluits for a regular account.
3. Mark it read and confirm it stays read after refresh. Archive the test announcement after the check.
4. Do not create fake system notices or impersonate official external organizations.

### F. Responsive and performance matrix
Check the same core flows at viewport widths 320, 360, 390, 430, 768, 1024, and 1440 px:
- No horizontal page overflow or clipped action menus.
- Buttons and inputs remain thumb-friendly on mobile.
- Image/video ratio remains correct.
- Inbox composer remains visible and usable on mobile.
- Settings cards and groups reflow to one column on narrow screens.
- Browser back/forward and route changes do not duplicate event listeners or messages.
- Record load time, image/video size, upload duration, errors, device model, Android version, and browser version. Do not report performance as passed without measurements.

**Important:** A successful GitHub Pages deployment is not an acceptance test. Record exact device/browser, steps, observed result, and screenshot/error text. Never share passwords, OTP, MFA QR/secret, auth tokens, or private message content.

## 11. Uji draf postingan privat — frontend lokal

1. Login dengan akun yang Anda kendalikan dan buka Profil → Draf postingan.
2. Buat postingan baru, pilih satu foto atau video pendek, tulis caption, lalu pilih **Simpan draf**.
3. Pastikan status menyatakan draf tersimpan pada browser/perangkat ini; jangan menganggapnya tersinkron ke cloud.
4. Refresh halaman, buka Profil → Draf postingan, lalu pilih **Lanjutkan**.
5. Pastikan caption dan lampiran dipulihkan ke composer. Uji juga draf teks tanpa lampiran.
6. Pastikan draf tidak muncul di profil publik, feed, Explore, pencarian, atau halaman pengunjung tanpa login.
7. Buat draf pada akun A, logout, lalu login akun B pada browser yang sama. Pastikan draf A tidak tampil pada daftar B.
8. Kembali ke akun A, hapus satu draf dan pastikan hanya draf yang dipilih yang hilang.
9. Terbitkan satu draf uji yang memang ingin dipublikasikan. Pastikan postingan muncul sesuai audience dan draf tersebut hilang dari daftar.
10. Jangan menghapus data browser selama masih membutuhkan draf; penyimpanan saat ini lokal dan belum memiliki sinkronisasi lintas perangkat.

**Lulus jika:** draf terpisah per user_id, dapat disimpan/dipulihkan/dihapus, lampiran dipulihkan pada browser yang mendukung DataTransfer, dan tidak pernah diterbitkan sebelum pengguna menekan Bagikan. Android runtime UAT masih harus dilakukan founder.
