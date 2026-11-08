import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {shell,hero,card,pageHeading,icon} from '../../app/ui.js';
import {store} from '../../app/store.js';
const db=createClient('https://ytndswhqxayqpftszwfh.supabase.co','sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D={promo:['PROMO','Penawaran untuk proyek','Temukan penawaran demo untuk kebutuhan material dan delivery.'],help:['BANTUAN','Pusat Bantuan','Jawaban praktis tentang pencarian, supplier, checkout, pembayaran dan delivery.'],faq:['FAQ','Pertanyaan yang sering muncul','Jawaban singkat untuk hal yang paling sering ditanyakan pelanggan.'],about:['TENTANG KAMI','Tentang Pluits','Social, local marketplace, trip, dan GeoDirectory dalam satu ekosistem.'],contact:['KONTAK','Hubungi Pluits','Pilih kanal yang sesuai untuk kebutuhan dan bantuan.'],terms:['LEGAL','Syarat & Ketentuan','Aturan penggunaan marketplace.'],privacy:['LEGAL','Kebijakan Privasi','Informasi pengelolaan data pengguna.'],reviews:['REVIEWS','Ulasan pelanggan','Ringkasan feedback marketplace akan tampil di sini.']};
async function loadRecentDirectory(){
 const target=document.querySelector('#pl-recent-directory');if(!target)return;
 const {data:auth}=await db.auth.getUser();
 if(!auth?.user){target.innerHTML='<p>Masuk untuk menyinkronkan riwayat tempat yang baru dilihat.</p><a href="#/account/login">Masuk ke Pluits →</a>';return;}
 const {data:recent,error}=await db.from('user_recent_items').select('target_id,viewed_at').eq('user_id',auth.user.id).eq('target_type','entity').order('viewed_at',{ascending:false}).limit(20);
 if(error){target.textContent='Riwayat tempat belum dapat dimuat.';return;}
 const ids=(recent||[]).map(x=>x.target_id);
 if(!ids.length){target.innerHTML='<p>Tempat yang Anda buka akan tampil di sini.</p>';return;}
 const {data:places}=await db.from('directory_entities').select('id,name,slug,summary').in('id',ids).eq('status','published');
 const ordered=ids.map(id=>(places||[]).find(x=>x.id===id)).filter(Boolean);
 target.innerHTML=ordered.map(x=>'<a class="pl-saved-place" href="#/place/'+encodeURIComponent(x.slug)+'"><b>'+esc(x.name)+'</b><span>'+esc(x.summary||'Tempat di GeoDirectory Pluits')+'</span><i>→</i></a>').join('')||'<p>Belum ada riwayat tempat.</p>';
}
export function misc(k){
 if(k==='recent'){
  const a=store.getRecent();
  const h=shell(`${pageHeading('RECENT','Baru dilihat','Produk dan tempat yang terakhir Anda buka akan tersimpan di sini.','<a class="secondary-button" href="#/places">'+icon.arrow+' Jelajahi direktori</a>')}${a.length?`<div class="catalog-grid wishlist-grid">${a.map(card).join('')}</div>`:'<div class="empty-state large"><h2>Belum ada produk</h2><p>Buka detail produk untuk mulai mengisi riwayat.</p><a class="primary-button" href="#/material">Jelajahi produk</a></div>'}<section class="pl-saved-directory-section"><h2>Tempat baru dilihat</h2><div id="pl-recent-directory"><p>Memuat riwayat tempat…</p></div></section>`,'Baru dilihat');
  queueMicrotask(loadRecentDirectory);return h;
 }
 const d=D[k]||D.help;
 const marketing=['promo','about'].includes(k);const intro=marketing?hero(d[0],d[1],d[2]):pageHeading(d[0],d[1],d[2],k==='contact'?'<a class="secondary-button" href="#/help">'+icon.arrow+' Pusat bantuan</a>':'');
 return shell(`${intro}<div class="klook-info-page"><div class="info-lead"><span class="section-kicker">${d[0]}</span><h2>${d[1]}</h2><p>${d[2]}</p></div><div class="info-sections"><article><span>01</span><h3>Temukan yang Anda butuhkan</h3><p>Gunakan pencarian dan kategori untuk menemukan produk, layanan atau tempat. Detail menampilkan informasi penyedia dan lokasi yang tersedia.</p></article><article><span>02</span><h3>Bandingkan sebelum memilih</h3><p>Periksa informasi, status verifikasi, jarak, ketersediaan dan pilihan layanan sebelum bertransaksi.</p></article><article><span>03</span><h3>Gunakan satu akun</h3><p>Profil personal dapat terhubung dengan aktivitas sosial, tempat, organisasi, dan toko yang dikelola.</p></article></div><div class="faq-list"><details open><summary>Apakah harga dan stok sudah real-time?</summary><p>Harga, stok dan transaksi hanya dianggap terkonfirmasi jika diproses melalui alur backend Pluits.</p></details><details><summary>Apakah semua tempat dapat dipesan?</summary><p>Tidak. Sebagian entitas hanya berfungsi sebagai informasi direktori; booking hanya tersedia jika disediakan oleh entitas terkait.</p></details><details><summary>Bagaimana cara mengklaim tempat?</summary><p>Buka halaman tempat, pilih Klaim tempat ini, lalu kirim keterangan kewenangan. Akses pengelola baru aktif setelah ditinjau dan disetujui.</p></details></div></div>`,d[1]);
}
