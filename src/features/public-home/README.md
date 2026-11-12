# Public Home feature

Modul ini memiliki kepemilikan khusus untuk halaman publik pengunjung tanpa login (route `#/` dan `#/guest`). Setiap section presentasional berada di file terpisah: hero, discovery, nearby, stories, marketplace, join, dan footer. 

Page controller `src/pages/home/index.js` tetap menjadi komposer route serta pemilik autentikasi, query Supabase, feed publik, dan event binding. Modul section tidak mengakses backend atau mengubah route guard. CSS visual tetap dipertahankan pada stylesheet lama selama tahap ekstraksi agar tampilan tidak berubah; pemindahan CSS dilakukan setelah audit consumer dan regression visual.
