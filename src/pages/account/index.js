import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Upload as TusUpload } from 'https://esm.sh/tus-js-client@4.3.1';
import './user-account.css';
import {loadAccountContext,contextHeader,professionalPage,professionalFormPage,accountSettingsPage,bindAccountContext} from './account-context.js';

const SUPABASE_URL='https://ytndswhqxayqpftszwfh.supabase.co';
const SUPABASE_KEY='sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const BUCKET='pluits-user-media';
const uploadMime=file=>{const declared=String(file?.type||'').toLowerCase();const ext=String(file?.name||'').split('.').pop().toLowerCase();const byExt=({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',mp4:'video/mp4',m4v:'video/mp4',webm:'video/webm','3gp':'video/3gpp','3gpp':'video/3gpp',mov:'video/quicktime'})[ext]||'';const mime=declared||byExt;const allowed=['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/3gpp','video/quicktime'];return allowed.includes(mime)?mime:'';};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=v=>new Date(v).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const initials=v=>String(v||'P').trim().slice(0,1).toUpperCase();
let user=null,profile=null,profileReels=[],addresses=[],noticeTimer=null,leafletMap=null,leafletMarker=null,exploreFilter='recommended',reelsFilter='recommended',accountContext={active:'personal',professional:null,stores:[],prefs:{}};

function notify(message,type='success'){
 const el=document.querySelector('#ua-toast');if(!el)return;
 el.textContent=message;el.className='ua-toast show '+type;
 clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('show'),3800);
}
function frame(content,active='explore',avatarUrl=''){
 const userAvatar=avatar(avatarUrl,profile?.display_name||user?.email||'P');
 const profileView=active==='profile'||active==='preview';
 return `<div class="ua-app ua-social-app">
  <header class="ua-header">
   <a class="ua-brand" href="#/account/explore">PLUITS<span>INDONESIA</span></a>
   <nav>
    <a class="${active==='explore'?'active':''}" href="#/account/explore">Beranda</a>
    <a href="#/places">Tempat</a>
    <a href="#/marketplace">Marketplace</a>
    <a href="#/trip">Trip</a>
    <a class="${active==='reels'?'active':''}" href="#/account/reels">Reels</a>
    <a class="${active==='activity'?'active':''}" href="#/account/activity">Aktivitas</a>
    <a class="${profileView?'active':''}" href="#/account/profile">Profil</a>
   </nav>
   <a class="ua-header-profile" href="#/account/profile" aria-label="Buka profil saya">${userAvatar}</a>
   <a class="ua-header-create" href="#/account/compose" aria-label="Buat postingan">＋</a>
  </header>
  <main class="ua-main ${profileView?'ua-profile-main':''}">${content}</main>
  <nav class="ua-mobile-nav" aria-label="Navigasi utama">
   <a class="${active==='explore'?'active':''}" href="#/account/explore" aria-label="Beranda"><span>⌂</span><small>Beranda</small></a>
   <a class="${active==='discover'?'active':''}" href="#/places" aria-label="Jelajah"><span>⌕</span><small>Jelajah</small></a>
   <a class="ua-mobile-create" href="#/account/compose" aria-label="Buat postingan"><span>＋</span><small>Buat</small></a>
   <a class="${active==='reels'?'active':''}" href="#/account/reels" aria-label="Reels"><span>▣</span><small>Reels</small></a>
   <a class="${profileView?'active':''}" href="#/account/profile" aria-label="Profil">${userAvatar}<small>Profil</small></a>
  </nav>
  <div id="ua-toast" class="ua-toast" role="status"></div>
  <footer class="ua-footer">PLUITS · Identitas pengguna dan aktivitas komunitas</footer>
 </div>`;
}
function authScreen(mode='login'){
 const signup=mode==='register';
 document.querySelector('#app').innerHTML=`<div class="ua-app ua-auth-app"><header class="ua-header"><a class="ua-brand" href="#/">PLUITS<span>INDONESIA</span></a><a href="#/" class="ua-logout">Kembali</a></header>
 <main class="ua-auth-wrap"><section class="ua-auth-copy"><span class="ua-eyebrow">PLUITS COMMUNITY</span><h1>Belanja, berbagi, dan membangun reputasi dalam satu akun.</h1><p>Mulai sebagai pengguna Pluits. Daftar dengan email aktif, konfirmasi akun, lengkapi profil, lalu bagikan cerita pertama Anda.</p><div class="ua-auth-points"><span>Profil pribadi dan privasi</span><span>Alamat tersimpan secara privat</span><span>Foto, video, dan Explore</span></div></section>
 <form id="ua-auth-form" class="ua-panel ua-auth-form"><span class="ua-eyebrow">${signup?'BUAT AKUN':'SELAMAT DATANG'}</span><h2>${signup?'Daftar Pluits':'Masuk ke Pluits'}</h2>
 ${signup?'<label>Nama tampilan<input name="full_name" required maxlength="80" autocomplete="name" placeholder="Nama yang ingin ditampilkan"></label>':''}
 <label>Email<input name="email" type="email" required autocomplete="email" placeholder="nama@email.com"></label>
 <label>Password<input name="password" type="password" required minlength="8" autocomplete="${signup?'new-password':'current-password'}" placeholder="Minimal 8 karakter"></label>
 <button class="ua-primary" type="submit">${signup?'Buat akun':'Masuk'}</button><p id="ua-auth-notice" class="ua-form-note"></p>
 <p class="ua-auth-switch">${signup?'Sudah punya akun?':'Belum punya akun?'} <a href="#/account/${signup?'login':'register'}">${signup?'Masuk':'Daftar'}</a></p>
 </form></main><footer class="ua-footer">PLUITS INDONESIA</footer></div>`;
 document.querySelector('#ua-auth-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=new FormData(e.currentTarget),btn=e.currentTarget.querySelector('button'),note=document.querySelector('#ua-auth-notice');
  btn.disabled=true;btn.textContent=signup?'Mengirim pendaftaran…':'Memeriksa akun…';note.className='ua-form-note is-loading';note.setAttribute('role','status');note.setAttribute('aria-live','polite');note.textContent=signup?'Menghubungi server Pluits dan meminta email konfirmasi. Mohon tunggu, jangan tekan tombol lagi.':'Sedang memeriksa email dan password…';
  try{
   const email=String(form.get('email')).trim().toLowerCase(),password=String(form.get('password'));
   if(signup){
    const full_name=String(form.get('full_name')).trim();
    const emailRedirectTo=window.location.origin+window.location.pathname;
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name},emailRedirectTo}});
    if(error)throw error;
    if(!data.session){
     note.className='ua-form-note is-pending';
     note.innerHTML='<strong>Pendaftaran diterima — konfirmasi masih menunggu.</strong><span>Server menerima permintaan pendaftaran. Ini belum membuktikan email sudah sampai ke inbox. Periksa alamat email, Inbox, Spam, dan Promosi.</span><span id="ua-resend-status" class="ua-resend-status">Status: menunggu email konfirmasi.</span><button type="button" id="ua-resend-confirm" class="ua-link-button">Kirim ulang email konfirmasi</button>';
     btn.textContent='Menunggu konfirmasi';
     const resend=document.querySelector('#ua-resend-confirm');
     resend?.addEventListener('click',async()=>{
      if(!resend||resend.disabled)return;
      resend.disabled=true;resend.textContent='Sedang meminta pengiriman…';
      const status=document.querySelector('#ua-resend-status');
      if(status)status.textContent='Status: permintaan pengiriman ulang sedang diproses.';
      try{
       const {error:resendError}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo}});
       if(resendError)throw resendError;
       if(status)status.textContent='Status: permintaan diterima server. Email belum dapat dipastikan sampai; periksa Inbox dan Spam.';
       resend.textContent='Permintaan terkirim ke server';
      }catch(err){
       const msg=String(err?.message||'').toLowerCase();
       if(status)status.textContent=msg.includes('rate limit')||msg.includes('too many')?'Status: dibatasi sementara oleh server. Tunggu sebelum mencoba lagi.':('Status: belum berhasil meminta email — '+(err.message||'kesalahan tidak diketahui'));
       resend.textContent='Coba lagi nanti';
       if(!msg.includes('rate limit')&&!msg.includes('too many'))resend.disabled=false;
      }
     });
     return;
    }
   }else{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}
   const requestedSection=(location.hash.split('/')[2]||'explore');await mountAccount(['login','register'].includes(requestedSection)?'explore':requestedSection);
  }catch(err){
   const msg=String(err?.message||'');
   note.className='ua-form-note is-error';note.textContent=(/rate limit|too many requests|over_email_send_rate_limit/i.test(msg)?'Pengiriman email sedang dibatasi oleh server. Jangan daftar ulang berkali-kali; tunggu sampai batas kirim berakhir. ': '')+(msg||'Tidak dapat memproses akun.');
   btn.disabled=false;btn.textContent=signup?'Buat akun':'Masuk';
  }
 });
}
async function signed(path){
 if(!path)return '';
 const {data,error}=await supabase.storage.from(BUCKET).createSignedUrl(path,3600);
 return error?'':data.signedUrl;
}
async function loadProfile(){
 const {data,error}=await supabase.from('user_profiles').select('*').eq('id',user.id).maybeSingle();
 if(error)throw error;
 if(data){profile=data;return;}
 const seed='user_'+user.id.replaceAll('-','').slice(0,12);
 const {data:created,error:insertError}=await supabase.from('user_profiles').insert({id:user.id,display_name:user.user_metadata?.full_name||'Pengguna Pluits',username:seed}).select().single();
 if(insertError)throw insertError;profile=created;
}
async function loadAddresses(){
 const {data,error}=await supabase.from('user_addresses').select('*').eq('user_id',user.id).order('is_default',{ascending:false}).order('created_at',{ascending:false});
 if(error)throw error;addresses=data||[];
}
function avatar(url,name,size=''){
 return url?`<img class="ua-avatar ${size}" src="${url}" alt="Foto profil">`:`<span class="ua-avatar ua-avatar-fallback ${size}">${esc(initials(name))}</span>`;
}
function navProfile(){
 return `<div class="ua-subnav"><a href="#/account/profile">Personal</a><a href="#/account/followers">Pengikut</a><a href="#/account/following">Mengikuti</a><a href="#/account/requests">Permintaan</a><a href="#/messages">Pesan</a><a href="#/account/settings">Pengaturan</a><a href="#/account/wallet">Wallet</a><a href="#/account/addresses">Alamat</a><a href="#/account/explore">Explore</a></div>`;
}
const rupiah=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0));
async function blockedAccountsPage(){
 const {data:rows,error}=await supabase.from('user_blocks').select('blocked_id,created_at').eq('blocker_id',user.id).order('created_at',{ascending:false});
 if(error)return '<div class="ua-panel"><h2>Daftar blokir belum dapat dimuat</h2><p>'+esc(error.message)+'</p></div>';
 const ids=(rows||[]).map(x=>x.blocked_id),{data:profiles}=ids.length?await supabase.from('user_profiles').select('id,display_name,username,avatar_path').in('id',ids):{data:[]};
 const people=new Map((profiles||[]).map(x=>[x.id,x]));
 return '<div class="ua-page-heading"><div><span class="ua-eyebrow">PRIVASI DAN KEAMANAN</span><h1>Akun yang diblokir</h1><p>Akun yang Anda blokir tidak akan muncul di Explore Anda.</p></div></div><section class="ua-panel ua-blocked-list">'+((rows||[]).map(x=>{const p=people.get(x.blocked_id)||{display_name:'Akun Pluits',username:'akun'};return '<article><div><b>'+esc(p.display_name)+'</b><small>@'+esc(p.username)+'</small></div><button data-unblock-user="'+x.blocked_id+'">Buka blokir</button></article>';}).join('')||'<div class="ua-empty">Anda belum memblokir akun apa pun.</div>')+'</section>';
}
function bindBlockedAccounts(){document.querySelectorAll('[data-unblock-user]').forEach(b=>b.onclick=async()=>{const {error}=await supabase.rpc('unblock_user',{p_blocked_user_id:b.dataset.unblockUser});if(error)notify(error.message,'error');else{notify('Blokir akun dibuka.');await mountAccount('blocked');}});}
function settingsHubPage(){
 const groups=[
  ['Akun Anda','Kelola identitas dan peran di Pluits',[
   ['◎','Pusat Akun','Informasi profil, username, dan identitas personal','/account/profile','ready'],
   ['♙','Profil profesional','Keahlian, portofolio, dan area layanan','/account/professional','ready'],
   ['▣','Toko dan organisasi','Kelola toko, tim, dan identitas organisasi','/seller','ready'],
   ['⌖','Alamat dan lokasi','Alamat pengiriman dan lokasi tersimpan','/account/addresses','ready']]],
  ['Cara Anda menggunakan Pluits','Atur pengalaman komunitas dan penemuan lokal',[
   ['◉','Privasi dan audiens','Siapa yang dapat melihat postingan dan berinteraksi','/account/content-settings','ready'],
   ['♡','Pengikut dan permintaan','Kelola hubungan dan permintaan mengikuti','/account/followers','ready'],
   ['✉','Pesan','Percakapan pribadi antar akun Pluits','/messages','ready'],
   ['⊘','Akun diblokir','Kelola akun yang Anda blokir','/account/blocked','ready'],
   ['⌕','Jelajah dan GeoDirectory','Tempat, layanan, komunitas, dan penyedia lokal','/places','ready'],
   ['▤','Marketplace','Toko, produk, layanan, dan pesanan','/marketplace','ready'],
   ['⌁','Trip dan perjalanan','Temukan tempat dan rencanakan pengalaman','/trip','ready'],
   ['▱','Wallet','Permintaan dan informasi saldo akun','/account/wallet','ready']]],
  ['Interaksi dan dukungan','Aktivitas akun, panduan, dan informasi layanan',[
   ['◷','Aktivitas dan notifikasi','Pemberitahuan suka, komentar, dan pengikut','/account/activity','ready'],
   ['?','Pusat Bantuan','Panduan dan jawaban penggunaan Pluits','/help','staged'],
   ['⚑','Pedoman Komunitas','Aturan konten dan interaksi yang aman','/guides','staged'],
   ['§','Ketentuan dan Privasi','Ketentuan layanan dan penggunaan data','/privacy','staged']]]
 ];
 const rows=groups.map(g=>'<section class="ua-ac-group"><div class="ua-ac-group-head"><h2>'+g[0]+'</h2><p>'+g[1]+'</p></div><div class="ua-ac-list">'+g[2].map(x=>'<a class="ua-ac-row" href="#'+x[3]+'"><span class="ua-ac-icon">'+x[0]+'</span><span class="ua-ac-copy"><strong>'+x[1]+'</strong><small>'+x[2]+'</small></span>'+(x[4]==='staged'?'<span class="ua-ac-stage">Bertahap</span>':'')+'<span class="ua-ac-arrow">›</span></a>').join('')+'</div></section>').join('');
 return '<div class="ua-account-center"><header class="ua-ac-header"><a class="ua-ac-back" href="#/account/profile" aria-label="Kembali ke profil">‹</a><div><span>PLUITS ACCOUNT</span><h1>Pusat Pengaturan</h1></div></header><section class="ua-ac-identity">'+avatar(profile?.avatar_url,profile?.display_name||user?.email||'P','large')+'<div class="ua-ac-identity-copy"><strong>'+esc(profile?.display_name||'Pengguna Pluits')+'</strong><span>@'+esc(profile?.username||'')+'</span><small>'+esc(user?.email||'')+'</small></div><a href="#/account/profile" aria-label="Edit profil">Edit</a></section><div class="ua-ac-intro"><strong>Semua kendali akun Anda dalam satu tempat.</strong><p>Atur identitas, privasi, aktivitas sosial, dan layanan Pluits sesuai kebutuhan.</p></div>'+rows+'<section class="ua-ac-logout"><div><strong>Login dan keamanan</strong><small>Kelola sesi akun dan keluar dari Pluits.</small></div><button id="ua-settings-logout" type="button">Keluar dari akun</button></section><p class="ua-ac-version">PLUITS INDONESIA · Pusat Akun</p></div>';
}
async function walletPage(){
 const [a,r]=await Promise.all([
  supabase.from('wallet_accounts').select('balance_minor,currency,updated_at').eq('user_id',user.id).maybeSingle(),
  supabase.from('wallet_requests').select('id,request_type,amount_minor,payment_method,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20)
 ]);
 if(a.error)throw a.error;if(r.error)throw r.error;
 const balance=a.data?.balance_minor||0,items=r.data||[];
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">KEUANGAN AKUN</span><h1>Wallet</h1><p>Kelola saldo, ajukan top up, dan tarik saldo Pluits.</p></div></div>
 ${navProfile()}
 <section class="ua-wallet-balance"><span>Saldo tersedia</span><strong>${rupiah(balance)}</strong><small>Saldo hanya berubah setelah transaksi diverifikasi dan diproses Pluits.</small></section>
 <section class="ua-wallet-actions"><form id="ua-wallet-form" class="ua-panel ua-wallet-form">
  <div class="ua-section-title"><div><span class="ua-eyebrow">AJUKAN TRANSAKSI</span><h2>Top Up atau Tarik Saldo</h2></div></div>
  <label>Jenis transaksi<select name="request_type"><option value="top_up">Top Up saldo</option><option value="withdrawal">Tarik saldo</option></select></label>
  <label>Nominal (Rp)<input name="amount" type="number" min="10000" step="1000" required placeholder="Contoh: 100000"></label>
  <label>Metode pembayaran / bank<input name="payment_method" maxlength="80" placeholder="Contoh: Transfer BCA"></label>
  <label>Detail rekening / referensi<textarea name="destination_details" rows="2" maxlength="500" placeholder="Isi detail yang diperlukan"></textarea></label>
  <label>Catatan tambahan<textarea name="note" rows="2" maxlength="300" placeholder="Opsional"></textarea></label>
  <p class="ua-wallet-disclaimer">Permintaan berstatus menunggu dan diproses manual untuk saat ini. Saldo tidak langsung berubah ketika formulir dikirim.</p>
  <button class="ua-primary" type="submit">Kirim permintaan</button><p id="ua-wallet-note" class="ua-form-note"></p>
 </form><aside class="ua-panel ua-wallet-info"><span class="ua-eyebrow">INFORMASI</span><h2>Transaksi tercatat</h2><p>Setiap permintaan tersimpan di riwayat akun. Jangan pernah membagikan password atau kode OTP.</p><p>Pembayaran otomatis dan verifikasi transfer akan dihubungkan pada tahap payment gateway.</p></aside></section>
 <section class="ua-panel ua-wallet-history"><div class="ua-section-title"><div><span class="ua-eyebrow">RIWAYAT</span><h2>Permintaan transaksi</h2></div></div>
 ${items.length?items.map(x=>`<div class="ua-wallet-row"><div><strong>${x.request_type==='top_up'?'Top Up':'Tarik Saldo'}</strong><small>${fmtDate(x.created_at)} · ${esc(x.payment_method||'Metode belum diisi')}</small></div><b>${rupiah(Number(x.amount_minor))}</b><span class="ua-wallet-status ${esc(x.status)}">${x.status==='pending'?'Menunggu':x.status==='approved'?'Disetujui':x.status==='rejected'?'Ditolak':'Dibatalkan'}</span></div>`).join(''):'<div class="ua-empty"><strong>Belum ada transaksi</strong><p>Riwayat permintaan top up dan penarikan akan tampil di sini.</p></div>'}
 </section>`;
}
async function profilePage(preview=false){
 const [avatarUrl,coverUrl,postsResult,storesResult]=await Promise.all([
  signed(profile.avatar_path),signed(profile.cover_path),
  supabase.from('user_posts').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
  supabase.from('stores').select('id,name,username,public_city,public_area,store_status').eq('owner_user_id',user.id)
 ]);
 if(postsResult.error)throw postsResult.error;
 const ownPosts=await hydratePosts(postsResult.data||[]);
  profileReels=ownPosts.filter(p=>p.media?.length===1&&p.media[0].media_type==='video'&&Number(p.media[0].duration_ms||0)>0&&Number(p.media[0].duration_ms||0)<=60000);
 const [followersCount,followingCount,pendingCount]=await Promise.all([
  supabase.from('user_follows').select('*',{count:'exact',head:true}).eq('following_id',user.id).eq('status','accepted'),
  supabase.from('user_follows').select('*',{count:'exact',head:true}).eq('follower_id',user.id).eq('status','accepted'),
  supabase.from('user_follows').select('*',{count:'exact',head:true}).eq('following_id',user.id).eq('status','pending')
 ]);
 if(followersCount.error||followingCount.error||pendingCount.error)throw followersCount.error||followingCount.error||pendingCount.error;
 const stores=storesResult.error?[]:(storesResult.data||[]);
 if(preview){
  const visiblePosts=profile.visibility==='public'?ownPosts.filter(p=>p.visibility==='public'&&p.moderation_status==='published'):[];
  return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PRATINJAU PROFIL</span><h1>Begini profil Anda terlihat</h1><p>Ini adalah simulasi tampilan profil bagi pengunjung Pluits.</p></div><a class="ua-outline" href="#/account/profile">← Kembali ke Edit Profil</a></div>
  <div class="ua-preview-status">${profile.visibility==='public'?'Profil Anda bersifat publik.':'Profil Anda privat. Pengunjung lain tidak dapat melihat postingan Anda.'}</div>
  <section class="ua-profile-card ua-public-profile">
   <div class="ua-cover" ${coverUrl?`style="background-image:url('${coverUrl}')"`:''}><span>PLUITS PROFILE</span></div>
   <div class="ua-profile-content"><div class="ua-profile-avatar">${avatar(avatarUrl,profile.display_name,'large')}</div>
    <div class="ua-profile-identity"><h2>${esc(profile.display_name)}</h2><div class="ua-username">@${esc(profile.username)}</div><div class="ua-location">${profile.public_city&&profile.public_province?'⌖ '+esc(profile.public_city)+', '+esc(profile.public_province):''}</div><p>${esc(profile.bio||'Bio belum ditambahkan.')}</p></div>
    <div class="ua-profile-count"><strong>${visiblePosts.length}</strong><span>Postingan publik</span></div>
   </div>
  </section>
  <section class="ua-panel ua-posts-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">KONTEN PROFIL</span><h2>Postingan</h2></div></div>
   ${profile.visibility!=='public'?'<div class="ua-empty"><strong>Akun ini privat</strong><p>Postingan hanya dapat dilihat oleh pemilik akun.</p></div>':visiblePosts.length?postGrid(visiblePosts):'<div class="ua-empty"><strong>Belum ada postingan publik</strong><p>Postingan yang Anda atur sebagai privat tidak ditampilkan di profil publik.</p></div>'}
  </section>`;
 }
 return ` <section class="ua-profile-card">
  <div class="ua-cover" ${coverUrl?`style="background-image:url('${coverUrl}')"`:''}><label class="ua-cover-edit"><span>Ubah foto sampul</span><input id="ua-cover-file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
  <div class="ua-profile-content"><div class="ua-profile-avatar">${avatar(avatarUrl,profile.display_name,'large')}<label class="ua-avatar-edit" aria-label="Ubah foto profil" title="Ubah foto profil"><span>Ubah foto</span><input id="ua-avatar-file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
   <div class="ua-profile-identity"><div class="ua-profile-name-row"><div><h2>${esc(profile.display_name)}</h2><div class="ua-username">@${esc(profile.username)}</div></div><details class="ua-profile-menu"><summary aria-label="Menu profil">•••</summary><div class="ua-profile-menu-pop"><a href="#/account/settings">Pengaturan & privasi</a><a href="#/account/settings">Pengaturan postingan</a><a href="#/account/professional">Profil Professional</a><a href="#/account/wallet">Wallet</a><a href="#/account/addresses">Alamat</a><button id="ua-menu-logout" type="button">Keluar dari akun</button></div></details></div><p>${esc(profile.bio||'Bio belum ditambahkan.')}</p><div class="ua-location">${profile.public_city&&profile.public_province?'⌖ '+esc(profile.public_city)+', '+esc(profile.public_province):''}</div><div class="ua-profile-stats"><a href="#profile-posts"><strong>${ownPosts.length}</strong><span>Postingan</span></a><a href="#/account/followers"><strong>${followersCount.count||0}</strong><span>Pengikut</span></a><a href="#/account/following"><strong>${followingCount.count||0}</strong><span>Mengikuti</span></a></div></div>
  </div>
 </section>
 <nav class="ua-profile-tabs" role="tablist" aria-label="Konten profil">
  <button class="active" type="button" role="tab" aria-selected="true" data-profile-tab="posts">▦ <span>Postingan</span></button><button type="button" role="tab" aria-selected="false" data-profile-tab="reels">▣ <span>Reels</span></button><button type="button" role="tab" aria-selected="false" data-profile-tab="tagged">♙ <span>Ditandai</span></button>
 </nav>
 <section id="ua-profile-tab-content" class="ua-profile-tab-content" role="tabpanel">
  <div class="ua-section-title"><strong>Postingan</strong><a class="ua-outline" href="#/account/compose">＋ Buat</a></div>
  ${ownPosts.length?postGrid(ownPosts):'<div class="ua-empty"><strong>Belum ada postingan</strong><p>Bagikan foto, video, atau cerita pertama Anda.</p><a class="ua-primary ua-inline" href="#/account/compose">Buat postingan</a></div>'}
 </section>
`;
}

function bindProfileTabs(){
 const nav=document.querySelector('.ua-profile-tabs'),panel=document.querySelector('#ua-profile-tab-content');
 if(!nav||!panel)return;
 const postsMarkup=panel.innerHTML;
 const reelsMarkup='<div class="ua-section-title"><strong>Reels</strong><a class="ua-outline" href="#/account/compose">＋ Buat Reel</a></div>'+(profileReels.length?postGrid(profileReels):'<div class="ua-empty"><strong>Belum ada Reels</strong><p>Video tunggal berdurasi hingga 60 detik akan muncul di sini.</p><a class="ua-primary ua-inline" href="#/account/compose">Unggah video</a></div>');
 const views={
  posts:postsMarkup,
  reels:reelsMarkup,
  tagged:'<div class="ua-profile-tab-empty"><span>♙</span><strong>Foto dan video bersama Anda</strong><p>Konten yang menandai akun Anda akan tampil di sini.</p></div>'
 };
 nav.addEventListener('click',e=>{
  const button=e.target.closest('[data-profile-tab]');if(!button)return;
  const tab=button.dataset.profileTab;if(!views[tab])return;
  nav.querySelectorAll('[data-profile-tab]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
  panel.innerHTML=views[tab];
  panel.dataset.activeTab=tab;
 });
}

function postGrid(posts){return `<div class="ua-post-grid">${posts.map(p=>`<a class="ua-post-thumb" href="#/account/post/${p.id}">${p.media?.length?(p.media[0].media_type==='video'?'<span class="ua-video-mark">▶ VIDEO</span><video src="'+p.media[0].url+'" muted playsinline preload="metadata"></video>':'<img src="'+p.media[0].url+'" alt="'+esc(p.caption||'Postingan Pluits')+'">'):'<span class="ua-text-thumb">PLUITS</span>'}<span class="ua-thumb-caption">${esc(p.caption||'')}</span></a>`).join('')}</div>`;}
async function hydratePosts(rows){
 if(!rows.length)return [];
 const postIds=rows.map(p=>p.id);
 const [tagRowsRes,mediaRowsRes]=await Promise.all([supabase.from('post_tags').select('post_id,tagged_user_id').in('post_id',postIds),supabase.from('post_media').select('id,post_id,user_id,media_path,media_type,position,duration_ms').in('post_id',postIds).order('position',{ascending:true})]);if(mediaRowsRes.error)throw mediaRowsRes.error;const taggedRows=tagRowsRes.data||[],mediaRows=mediaRowsRes.data||[];
 const ids=[...new Set([...rows.map(p=>p.user_id),...taggedRows.map(t=>t.tagged_user_id)])];
 const [profilesRes,likesRes,commentsRes,savesRes]=await Promise.all([
  supabase.from('user_profiles').select('id,display_name,username,avatar_path,public_city,public_province,visibility').in('id',ids),
  supabase.from('post_likes').select('post_id,user_id').in('post_id',postIds),
  supabase.from('post_comments').select('post_id').in('post_id',postIds),
  user?.id?supabase.from('post_saves').select('post_id,user_id').in('post_id',postIds).eq('user_id',user.id):Promise.resolve({data:[]})
 ]);
 const pmap=new Map((profilesRes.data||[]).map(x=>[x.id,x]));
 const likeRows=likesRes.data||[],commentRows=commentsRes.data||[],saved=new Set((savesRes.data||[]).map(x=>x.post_id));
 return Promise.all(rows.map(async p=>{
  const owner=pmap.get(p.user_id)||{display_name:'Pengguna Pluits',username:'pengguna',visibility:'private'};
  const gallery=mediaRows.filter(m=>m.post_id===p.id),media=gallery.length?await Promise.all(gallery.map(async m=>({...m,url:await signed(m.media_path)}))):(p.media_path?[{media_path:p.media_path,media_type:p.media_type,position:0,duration_ms:null,url:await signed(p.media_path)}]:[]);return {...p,owner,media,tagged:taggedRows.filter(t=>t.post_id===p.id).map(t=>pmap.get(t.tagged_user_id)).filter(Boolean),mediaUrl:media[0]?.url||'',avatarUrl:await signed(owner.avatar_path),likes:likeRows.filter(x=>x.post_id===p.id).length,liked:!!user&&likeRows.some(x=>x.post_id===p.id&&x.user_id===user.id),comments:commentRows.filter(x=>x.post_id===p.id).length,saved:saved.has(p.id)};
 }));
}
async function feedPage(){
 const {data,error}=await supabase.from('user_posts').select('*').eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(100);
 if(error)throw error;
 let source=data||[],followingIds=[],blockedIds=[];
 if(user?.id){
  const {data:blocks,error:blockError}=await supabase.from('user_blocks').select('blocker_id,blocked_id').or('blocker_id.eq.'+user.id+',blocked_id.eq.'+user.id);
  if(blockError)throw blockError;
  blockedIds=(blocks||[]).map(x=>x.blocker_id===user.id?x.blocked_id:x.blocker_id);
  source=source.filter(post=>!blockedIds.includes(post.user_id));
 }
 if(exploreFilter==='following'){
  if(user?.id){
   const {data:follows,error:followError}=await supabase.from('user_follows').select('following_id').eq('follower_id',user.id).eq('status','accepted');
   if(followError)throw followError;
   followingIds=(follows||[]).map(x=>x.following_id);
   const visibleIds=new Set([...followingIds,user.id]);source=source.filter(post=>visibleIds.has(post.user_id));
  }else source=[];
 }
 const posts=await hydratePosts(source);
 const sorted=posts.sort((a,b)=>{
  if(exploreFilter==='latest')return new Date(b.created_at)-new Date(a.created_at);
  if(exploreFilter==='popular')return (b.likes*3+b.comments)-(a.likes*3+a.comments)||new Date(b.created_at)-new Date(a.created_at);
  const af=followingIds.includes(a.user_id)?1:0,bf=followingIds.includes(b.user_id)?1:0;
  return (bf-af)||new Date(b.created_at)-new Date(a.created_at);
 });
 const {data:storyRows,error:storyError}=await supabase.from('user_stories').select('id,user_id,media_path,media_type,caption,visibility,created_at,expires_at').gt('expires_at',new Date().toISOString()).eq('visibility','public').order('created_at',{ascending:false}).limit(30);
 if(storyError)throw storyError;
 const visibleStories=(storyRows||[]).filter(s=>!blockedIds.includes(s.user_id)),ownerIds=[...new Set(visibleStories.map(s=>s.user_id))];
 let storyProfiles=[];
 if(ownerIds.length){const r=await supabase.from('user_profiles').select('id,display_name,username,avatar_path').in('id',ownerIds);if(r.error)throw r.error;storyProfiles=r.data||[];}
 const pmap=new Map(storyProfiles.map(p=>[p.id,p]));
 const stories=await Promise.all(visibleStories.map(async s=>{const owner=pmap.get(s.user_id)||{};return {...s,owner,mediaUrl:await signed(s.media_path),avatarUrl:owner.avatar_path?await signed(owner.avatar_path):''};}));
 const storyCards=stories.map(s=>"<button type='button' class='ua-story-item' data-story-url='"+esc(s.mediaUrl||'')+"' data-story-type='"+esc(s.media_type)+"' data-story-owner='"+esc(s.owner.display_name||'Pengguna Pluits')+"' data-story-caption='"+esc(s.caption||"")+"'><span class='ua-story-ring'>"+(s.avatarUrl?"<img src='"+esc(s.avatarUrl)+"' alt=''>":"<b>PL</b>")+"</span><small>"+esc(s.owner.display_name||'Pluits')+"</small></button>").join('');
 const filters=[['recommended','Untuk Anda'],['following','Mengikuti'],['latest','Terbaru']];
 const filterBar="<nav class='ua-explore-filters' aria-label='Feed'>"+filters.map(([k,v])=>"<button type='button' data-explore-filter='"+k+"' class='"+(exploreFilter===k?'active':'')+"' aria-pressed='"+(exploreFilter===k?'true':'false')+"'>"+v+"</button>").join('')+"</nav>";
 const empty=exploreFilter==='following'?'Belum ada postingan dari akun yang Anda ikuti.':'Belum ada postingan publik. Bagikan foto atau video pertama Anda.';
 const storySection="<section class='ua-stories-block'><div class='ua-stories-head'><strong>Stories</strong><a href='#/account/compose' aria-label='Buat postingan'>＋</a></div><div class='ua-story-strip'><a class='ua-story-item ua-story-own' href='#/account/compose'><span class='ua-story-ring'>"+avatar(await signed(profile?.avatar_path),profile?.display_name||'Anda')+"<i>＋</i></span><small>Cerita Anda</small></a>"+(storyCards||"<span class='ua-story-empty'>Belum ada cerita baru</span>")+"</div></section>";
 return "<div class='ua-social-home'><header class='ua-feed-top'><a class='ua-feed-wordmark' href='#/account/explore'>pluits</a><div><a href='#/account/activity' aria-label='Aktivitas'>♡</a><a href='#/messages' aria-label='Pesan'>↗</a></div></header>"+storySection+filterBar+"<section class='ua-feed'>"+(sorted.length?sorted.map(postCard).join(''):"<div class='ua-feed-empty'><strong>"+empty+"</strong><a href='#/account/compose'>Bagikan foto atau video</a></div>")+"</section></div>";
}

async function reelsPage(){
 const {data:vm,error:me}=await supabase.from('post_media').select('post_id,duration_ms').eq('media_type','video').lte('duration_ms',60000).order('created_at',{ascending:false}).limit(160);if(me)throw me;
 const ids=[...new Set((vm||[]).map(x=>x.post_id))];let rows=[];
 if(ids.length){const q=await supabase.from('user_posts').select('*').in('id',ids).eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(100);if(q.error)throw q.error;rows=q.data||[];}
 let followingIds=[],blockedIds=[];
 if(user?.id){const b=await supabase.from('user_blocks').select('blocker_id,blocked_id').or('blocker_id.eq.'+user.id+',blocked_id.eq.'+user.id);if(b.error)throw b.error;blockedIds=(b.data||[]).map(x=>x.blocker_id===user.id?x.blocked_id:x.blocker_id);rows=rows.filter(p=>!blockedIds.includes(p.user_id));const f=await supabase.from('user_follows').select('following_id').eq('follower_id',user.id).eq('status','accepted');if(f.error)throw f.error;followingIds=(f.data||[]).map(x=>x.following_id);}
 const posts=await hydratePosts(rows),eligible=posts.filter(p=>p.media?.length===1&&p.media[0].media_type==='video'&&Number(p.media[0].duration_ms||0)>0&&Number(p.media[0].duration_ms)<=60000);
 const now=Date.now(),sorted=eligible.filter(p=>reelsFilter!=='following'||followingIds.includes(p.user_id)).sort((x,y)=>{
  if(reelsFilter==='latest')return new Date(y.created_at)-new Date(x.created_at);
  const score=p=>{const age=Math.max(0,(now-new Date(p.created_at).getTime())/3600000),follow=followingIds.includes(p.user_id)?45:0,recency=24*Math.exp(-age/48),engagement=Math.min(30,p.likes*1.5+p.comments*2.5);return follow+recency+engagement;};
  return score(y)-score(x)||new Date(y.created_at)-new Date(x.created_at);
 });
 return "<div class='ua-page-heading'><div><span class='ua-eyebrow'>VIDEO KOMUNITAS</span><h1>Reels</h1><p>Video tunggal hingga 60 detik. Geser ke atas untuk video berikutnya.</p></div><a class='ua-outline' href='#/account/explore'>Kembali ke Explore</a></div><nav class='ua-reels-filters' aria-label='Urutan Reels'><button data-reels-filter='recommended' class='"+(reelsFilter==='recommended'?'is-active':'')+"'>Untuk Anda</button><button data-reels-filter='following' class='"+(reelsFilter==='following'?'is-active':'')+"'>Mengikuti</button><button data-reels-filter='latest' class='"+(reelsFilter==='latest'?'is-active':'')+"'>Terbaru</button></nav><section class='ua-reels-feed'>"+(sorted.length?sorted.map(postCard).join(''):"<div class='ua-panel ua-empty'><strong>Belum ada Reels.</strong><p>Reels berisi video tunggal maksimal 60 detik. Video yang lebih panjang tetap ada di postingan biasa.</p><a class='ua-primary ua-inline' href='#/account/compose'>＋ Unggah video</a></div>")+"</section>";
}

function postCard(p){
 const profileHref='#/account/user/'+encodeURIComponent(p.owner.username);
 const mediaMarkup=(p.media||[]).length>1?`<div class="ua-media-gallery" data-gallery><div class="ua-gallery-track">${p.media.map((m,i)=>`<div class="ua-gallery-item">${m.media_type==='video'?`<video src="${m.url}" controls playsinline preload="metadata"></video>`:`<img src="${m.url}" alt="Media ${i+1}">`}</div>`).join('')}</div><span class="ua-gallery-count">1/${p.media.length}</span></div>`:(p.media?.length?`<div class="ua-media">${p.media[0].media_type==='video'?`<video src="${p.media[0].url}" controls playsinline preload="metadata"></video>`:`<img src="${p.media[0].url}" alt="${esc(p.caption||'Foto postingan')}">`}</div>`:'<div class="ua-text-post-mark">PLUITS</div>');
 return `<article class="ua-post-card" data-post-id="${p.id}" data-owner-id="${p.user_id}">
 <div class="ua-post-head"><a class="ua-post-avatar-link" href="${profileHref}">${avatar(p.avatarUrl,p.owner.display_name)}</a><div><a class="ua-author-link" href="${profileHref}"><strong>${esc(p.owner.display_name)}</strong></a><small>@${esc(p.owner.username)} ${p.owner.public_city&&p.owner.public_province?'· '+esc(p.owner.public_city):''}</small></div><button class="ua-post-more" type="button" aria-label="Opsi postingan">•••</button></div>
 ${mediaMarkup}
 ${user?`<div class="ua-post-actions"><button data-action="like" class="${p.liked?'is-liked':''}" aria-label="Suka">♥ <b>${p.likes}</b></button><button data-action="comments" aria-label="Komentar">◯ <b>${p.comments}</b></button><button data-action="share" aria-label="Bagikan">↗</button><button data-action="save" class="${p.saved?'is-saved':''}" aria-label="Simpan">▱</button></div>`:`<div class="ua-post-actions"><a class="ua-login-action" href="#/account/login">Masuk untuk berinteraksi</a></div>`}
 <div class="ua-post-caption">${p.likes?'<strong>'+p.likes+' suka</strong>':''}<p><a href="${profileHref}"><b>${esc(p.owner.username)}</b></a> ${esc(p.caption||'')}</p>${p.comments?'<button data-action="comments" class="ua-view-comments">Lihat semua '+p.comments+' komentar</button>':''}</div>
 ${user?(p.user_id===user.id?'<section class="ua-post-editor" hidden></section>':'')+'<div class="ua-comments" hidden></div>':''}
 </article>`;
}

async function composePage(){
 const {data:contentPrefs}=await supabase.from('account_content_preferences').select('*').eq('user_id',user.id).maybeSingle();
 const defaultAudience=accountContext.active==='professional'?(contentPrefs?.professional_default_visibility==='unlisted'?'private':'public'):accountContext.active==='business'?(contentPrefs?.business_default_visibility==='unlisted'?'private':'public'):(contentPrefs?.personal_default_visibility||'public');
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">BAGIKAN MOMEN</span><h1>Buat postingan</h1></div><a class="ua-outline" href="#/account/explore">Batal</a></div>
 <section class="ua-panel ua-compose-panel"><form id="ua-post-form" class="ua-compose-form" data-default-visibility="${defaultAudience}">
  <label class="ua-upload-zone" for="ua-post-file"><span class="ua-upload-icon">＋</span><strong>Pilih foto atau video</strong><small>Pilih satu atau beberapa media dari galeri</small><input id="ua-post-file" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/*"></label>
  <div id="ua-media-preview" class="ua-media-preview"></div>
  <label class="ua-compose-caption-label"><textarea name="caption" rows="4" maxlength="2200" placeholder="Tulis caption..." aria-label="Tulis caption"></textarea></label>
  <div class="ua-progress" id="ua-upload-progress" hidden><span></span></div>
  <button class="ua-primary" type="submit">Bagikan</button><p class="ua-form-note" id="ua-compose-note"></p>
 </form></section>`;
}
async function addressPage(){
 await loadAddresses();
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">DATA PENGIRIMAN PRIVAT</span><h1>Alamat tersimpan</h1><p>Alamat lengkap dan titik peta hanya untuk akun Anda dan kebutuhan pemenuhan pesanan.</p></div></div>
 ${navProfile()}
 <section class="ua-grid-layout ua-address-layout"><div class="ua-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">ALAMAT SAYA</span><h2>${addresses.length} alamat tersimpan</h2></div></div>
 ${addresses.length?addresses.map(a=>`<article class="ua-address-card"><div><strong>${esc(a.label)} ${a.is_default?'<span class="ua-default">UTAMA</span>':''}</strong><p>${esc(a.recipient_name)} · ${esc(a.phone)}</p><p>${esc(a.address_line)}, ${esc(a.village||'')}, ${esc(a.district)}, ${esc(a.city)}, ${esc(a.province)} ${esc(a.postal_code)}</p><small>${a.latitude!==null&&a.longitude!==null?'⌖ Titik peta tersimpan':'Titik peta belum ditentukan'}</small></div><div class="ua-address-actions"><button data-edit-address="${a.id}">Edit</button><button data-delete-address="${a.id}">Hapus</button></div></article>`).join(''):'<div class="ua-empty"><strong>Belum ada alamat</strong><p>Tambahkan alamat rumah, kantor, atau lokasi proyek agar pemesanan berikutnya lebih mudah.</p></div>'}
 </div><div class="ua-panel"><span class="ua-eyebrow">TAMBAH LOKASI</span><h2 id="ua-address-form-title">Tambah alamat</h2>
 <form id="ua-address-form" class="ua-address-form">
 <input type="hidden" name="id">
 <label>Label alamat<input name="label" required value="Rumah" placeholder="Rumah, kantor, proyek"></label>
 <label>Nama penerima<input name="recipient_name" required></label><label>Nomor telepon<input name="phone" type="tel" required></label>
 <label>Provinsi<input name="province" required placeholder="Bali"></label><label>Kota / Kabupaten<input name="city" required placeholder="Denpasar"></label>
 <label>Kecamatan<input name="district" required></label><label>Kelurahan / Desa<input name="village"></label>
 <label>Kode pos<input name="postal_code" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required placeholder="802xx"></label>
 <label>Alamat lengkap<textarea name="address_line" rows="3" required placeholder="Nama jalan, nomor, banjar, patokan…"></textarea></label>
 <label>Catatan kurir (opsional)<input name="delivery_note" placeholder="Petunjuk tambahan"></label>
 <div class="ua-map-head"><strong>Titik peta</strong><button type="button" id="ua-use-location" class="ua-outline">Gunakan lokasi saya</button></div>
 <div id="ua-address-map" class="ua-map"></div>
 <div class="ua-coordinates"><label>Latitude<input name="latitude" id="ua-lat" inputmode="decimal" placeholder="-8.65"></label><label>Longitude<input name="longitude" id="ua-lng" inputmode="decimal" placeholder="115.21"></label></div>
 <small class="ua-muted">Ketuk peta untuk memasang pin. Koordinat tidak ditampilkan di profil publik.</small>
 <label class="ua-checkbox"><input type="checkbox" name="is_default"> Jadikan alamat utama</label>
 <button class="ua-primary" type="submit">Simpan alamat</button><button class="ua-outline ua-full" type="button" id="ua-reset-address">Kosongkan formulir</button><p class="ua-form-note" id="ua-address-note"></p>
 </form></div></section>`;
}
async function loadLeaflet(){
 if(window.L)return;
 await new Promise((resolve,reject)=>{
  if(!document.querySelector('#ua-leaflet-css')){const l=document.createElement('link');l.id='ua-leaflet-css';l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(l);}
  const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
 });
}
async function initMap(){
 const el=document.querySelector('#ua-address-map');if(!el)return;
 if(leafletMap){leafletMap.remove();leafletMap=null;leafletMarker=null;}
 try{
  await loadLeaflet();if(!document.querySelector('#ua-address-map'))return;
  leafletMap=window.L.map(el).setView([-8.65,115.2167],11);
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(leafletMap);
  const latInput=document.querySelector('#ua-lat'),lngInput=document.querySelector('#ua-lng');
  const setPin=(lat,lng)=>{latInput.value=Number(lat).toFixed(6);lngInput.value=Number(lng).toFixed(6);if(leafletMarker)leafletMarker.setLatLng([lat,lng]);else leafletMarker=window.L.marker([lat,lng]).addTo(leafletMap);};
  leafletMap.on('click',e=>setPin(e.latlng.lat,e.latlng.lng));
  if(latInput.value&&lngInput.value){const lat=Number(latInput.value),lng=Number(lngInput.value);leafletMap.setView([lat,lng],16);setPin(lat,lng);}
  latInput.addEventListener('change',()=>{if(latInput.value&&lngInput.value){const ll=[Number(latInput.value),Number(lngInput.value)];setPin(...ll);leafletMap.setView(ll,16);}});
  lngInput.addEventListener('change',()=>{if(latInput.value&&lngInput.value){const ll=[Number(latInput.value),Number(lngInput.value)];setPin(...ll);leafletMap.setView(ll,16);}});
  setTimeout(()=>leafletMap.invalidateSize(),250);
 }catch{el.innerHTML='<p class="ua-muted">Peta tidak dapat dimuat. Anda tetap dapat memasukkan koordinat secara manual atau memakai lokasi perangkat.</p>';}
}
async function publicProfilePage(username){
 const {data,error}=await supabase.rpc('get_user_profile_directory',{p_username:username});
 if(error)throw error;
 const target=Array.isArray(data)?data[0]:data;
 if(!target)throw new Error('Profil tidak ditemukan atau tidak tersedia.');
 const isOwner=!!user&&target.id===user.id;
 let relation=null;
 if(user&&!isOwner){
  const {data:r,error:re}=await supabase.from('user_follows').select('follower_id,following_id,status').eq('follower_id',user.id).eq('following_id',target.id).maybeSingle();
  if(re)throw re;relation=r;
 }
 const {data:countsData,error:countsError}=await supabase.rpc('get_user_follow_counts',{p_user_id:target.id});
 if(countsError)throw countsError;
 const counts=Array.isArray(countsData)?countsData[0]:(countsData||{});

 const avatarUrl=await signed(target.avatar_path),coverUrl=await signed(target.cover_path);
 let posts=[];
 if(target.visibility==='public'||isOwner||relation?.status==='accepted'){
  const {data:rows,error:pe}=await supabase.from('user_posts').select('*').eq('user_id',target.id).eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(60);
  if(pe)throw pe;posts=await hydratePosts(rows||[]);
 }
 const followLabel=isOwner?'Edit profil':relation?.status==='accepted'?'Mengikuti':relation?.status==='pending'?'Permintaan terkirim':target.visibility==='private'?'Minta mengikuti':'Ikuti';
 const canSeeCounts=target.visibility==='public'||isOwner||relation?.status==='accepted';
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PROFIL PENGGUNA</span><h1>@${esc(target.username)}</h1></div><a class="ua-outline" href="#/account/explore">Kembali ke Explore</a></div>
 <section class="ua-profile-card ua-public-profile">
  <div class="ua-cover" ${coverUrl?`style="background-image:url('${coverUrl}')"`:''}><span>PLUITS PROFILE</span></div>
  <div class="ua-profile-content"><div class="ua-profile-avatar">${avatar(avatarUrl,target.display_name,'large')}</div>
   <div class="ua-profile-identity"><h2>${esc(target.display_name)}</h2><div class="ua-username">@${esc(target.username)}</div>
   <div class="ua-location">${target.public_city&&target.public_province?'⌖ '+esc(target.public_city)+', '+esc(target.public_province):''}</div>
   <p>${esc(target.bio||'')}</p>
   <div class="ua-profile-stats"><span><strong>${posts.length}</strong><span>Postingan</span></span><span><strong>${canSeeCounts?(counts.followers_count??0):'—'}</strong><span>Pengikut</span></span><span><strong>${canSeeCounts?(counts.following_count??0):'—'}</strong><span>Mengikuti</span></span></div>
   ${isOwner?`<a class="ua-primary ua-inline" href="#/account/profile">Edit profil</a>`:user?`<button type="button" class="ua-primary ua-inline" data-follow-target="${target.id}" data-follow-state="${relation?.status||''}" data-follow-username="${esc(target.username)}" ${relation?.status==='pending'&&relation.follower_id!==user.id?'disabled':''}>${followLabel}</button>`:`<a class="ua-primary ua-inline" href="#/account/login">Masuk untuk mengikuti</a>`}
   </div>
  </div>
 </section>
 <section class="ua-panel ua-posts-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">KONTEN PROFIL</span><h2>Postingan</h2></div></div>
 ${target.visibility==='private'&&!isOwner&&relation?.status!=='accepted'?'<div class="ua-empty"><strong>Akun ini privat</strong><p>Ajukan permintaan mengikuti untuk melihat postingan publik akun ini setelah disetujui.</p></div>':posts.length?postGrid(posts):'<div class="ua-empty"><strong>Belum ada postingan publik</strong><p>Postingan publik akan tampil di sini.</p></div>'}
 </section>`;
}
async function notificationPage(){
 const {data,error}=await supabase.from('user_notifications').select('id,actor_user_id,notification_type,entity_type,entity_id,message,created_at,read_at').order('created_at',{ascending:false}).limit(60);
 if(error)throw error;
 const rows=data||[],ids=[...new Set(rows.map(n=>n.actor_user_id).filter(Boolean))];
 const profiles=ids.length?await supabase.rpc('get_user_profile_directory_by_ids',{p_ids:ids}):{data:[],error:null};
 if(profiles.error)throw profiles.error;
 const people=new Map((profiles.data||[]).map(p=>[p.id,p]));
 const unread=rows.filter(n=>!n.read_at).length;
 const labels={follow_request:'Permintaan mengikuti',new_follower:'Pengikut baru',follow_accepted:'Permintaan diterima',post_like:'Suka postingan',post_comment:'Komentar'};
 const items=rows.map(n=>{const actor=people.get(n.actor_user_id),name=actor?.display_name||'Pengguna Pluits';const href=n.entity_type==='post'&&n.entity_id?'#/account/post/'+n.entity_id:actor?.username?'#/account/user/'+encodeURIComponent(actor.username):'#/account/profile';return '<a class="ua-notification-row '+(n.read_at?'':'is-unread')+'" href="'+href+'" data-notification-id="'+n.id+'" data-notification-href="'+href+'"><span class="ua-notification-avatar">'+esc(name.slice(0,1).toUpperCase())+'</span><span class="ua-notification-copy"><strong>'+esc(name)+'</strong><span>'+esc(n.message||labels[n.notification_type]||'Aktivitas baru')+'</span><small>'+esc(labels[n.notification_type]||'Aktivitas')+' · '+fmtDate(n.created_at)+'</small></span>'+(n.read_at?'':'<i aria-label="Belum dibaca"></i>')+'</a>';}).join('');
 return '<div class="ua-page-heading"><div><span class="ua-eyebrow">AKTIVITAS AKUN</span><h1>Aktivitas</h1><p>'+(unread?unread+' pemberitahuan belum dibaca':'Semua aktivitas sudah dibaca')+'</p></div>'+(unread?'<button type="button" class="ua-outline" data-notifications-read-all>Tandai semua dibaca</button>':'')+'</div><section class="ua-panel ua-notification-list">'+(items||'<div class="ua-empty"><strong>Belum ada aktivitas</strong><p>Permintaan mengikuti, suka, dan komentar akan muncul di sini.</p></div>')+'</section>';
}
function bindNotificationActions(){
 document.querySelectorAll('[data-notification-id]').forEach(link=>link.addEventListener('click',async e=>{e.preventDefault();const id=link.dataset.notificationId,href=link.dataset.notificationHref;if(link.classList.contains('is-unread')){const {error}=await supabase.from('user_notifications').update({read_at:new Date().toISOString()}).eq('id',id);if(error){notify('Status pemberitahuan belum dapat diperbarui.','error');return;}}location.hash=href;}));
 document.querySelector('[data-notifications-read-all]')?.addEventListener('click',async()=>{const {error}=await supabase.from('user_notifications').update({read_at:new Date().toISOString()}).is('read_at',null);if(error)notify(error.message,'error');else await mountAccount('activity');});
}
async function followListPage(kind='followers'){
 const incoming=kind==='followers';
 const {data,error}=await supabase.from('user_follows').select('follower_id,following_id,status,created_at')
  .eq(incoming?'following_id':'follower_id',user.id).order('created_at',{ascending:false}).limit(100);
 if(error)throw error;
 const rows=data||[],ids=[...new Set(rows.map(r=>incoming?r.follower_id:r.following_id))];
 const profiles=ids.length?await supabase.rpc('get_user_profile_directory_by_ids',{p_ids:ids}):{data:[],error:null};
 if(profiles.error)throw profiles.error;
 const map=new Map((profiles.data||[]).map(p=>[p.id,p]));
 const title=incoming?'Pengikut':'Mengikuti';
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">JARINGAN KOMUNITAS</span><h1>${title}</h1><p>${incoming?'Kelola pengikut dan permintaan mengikuti akun Anda.':'Akun yang Anda ikuti dan permintaan yang masih menunggu.'}</p></div><a class="ua-outline" href="#/account/profile">Kembali ke profil</a></div>
 ${navProfile()}
 <section class="ua-panel ua-follow-list">${rows.length?rows.map(r=>{
  const id=incoming?r.follower_id:r.following_id,p=map.get(id);
  if(!p)return '';
  const pending=r.status==='pending';
  return `<article class="ua-follow-row"><a href="#/account/user/${encodeURIComponent(p.username)}" class="ua-follow-person">${avatar('',p.display_name)}<span><strong>${esc(p.display_name)}</strong><small>@${esc(p.username)}</small></span></a><div class="ua-follow-actions">${pending?incoming?`<button class="ua-primary ua-inline" data-follow-accept="${id}">Terima</button><button class="ua-outline" data-follow-remove="${id}">Tolak</button>`:`<span class="ua-follow-pending">Menunggu</span><button class="ua-outline" data-follow-remove="${id}">Batalkan</button>`: `<span class="ua-follow-pending">Mengikuti</span><button class="ua-outline" data-follow-remove="${id}">${incoming?'Hapus':'Berhenti'}</button>`}</div></article>`;
 }).join(''):'<div class="ua-empty"><strong>Belum ada data</strong><p>Aktivitas mengikuti akun akan tampil di sini.</p></div>'}</section>`;
}
async function postDetailPage(id){
 const {data,error}=await supabase.from('user_posts').select('*').eq('id',id).single();if(error)throw error;
 const [p]=await hydratePosts([data]);if(!p)throw new Error('Postingan tidak tersedia.');
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">POSTINGAN</span><h1>Detail postingan</h1></div><a class="ua-outline" href="#/account/explore">Kembali ke Explore</a></div>${postCard(p)}`;
}
function normalizeFeedMediaFrames(root=document){
 const mediaNodes=root.querySelectorAll('.ua-social-home .ua-media img,.ua-social-home .ua-media video,.ua-social-home .ua-gallery-item img,.ua-social-home .ua-gallery-item video');
 const dimensions=el=>({w:el.naturalWidth||el.videoWidth,h:el.naturalHeight||el.videoHeight});
 const boundedRatio=(w,h)=>Math.min(3/4,Math.max(1/1.91,w/h));
 const apply=el=>{
  const gallery=el.closest('.ua-media-gallery');
  if(gallery){
   const first=gallery.querySelector('.ua-gallery-item img,.ua-gallery-item video');
   if(!first)return;
   const {w,h}=dimensions(first);if(!w||!h)return;
   const ratio=boundedRatio(w,h);
   gallery.querySelectorAll('.ua-gallery-item').forEach(frame=>{
    frame.style.aspectRatio=String(ratio);
    frame.dataset.mediaRatio=ratio.toFixed(4);
   });
   return;
  }
  const {w,h}=dimensions(el);if(!w||!h)return;
  const ratio=boundedRatio(w,h);
  const frame=el.closest('.ua-media');
  if(!frame)return;
  frame.style.aspectRatio=String(ratio);
  frame.dataset.mediaRatio=ratio.toFixed(4);
 };
 mediaNodes.forEach(el=>{
  if(el.tagName==='VIDEO'){
   if(el.readyState>=1)apply(el);else el.addEventListener('loadedmetadata',()=>apply(el),{once:true});
  }else{
   if(el.complete)apply(el);else el.addEventListener('load',()=>apply(el),{once:true});
  }
 });
}
async function mountAccount(section='profile',parameter=''){
 const {data:{session}}=await supabase.auth.getSession();user=session?.user||null;
 if(!user&&(section==='user'||section==='post')){
  try{
   const page=section==='user'?await publicProfilePage(parameter):await postDetailPage(parameter||location.hash.split('/')[3]||'');
   document.querySelector('#app').innerHTML=frame(page,'explore');return;
  }catch(err){document.querySelector('#app').innerHTML='<div class="ua-panel ua-error"><h1>Konten tidak tersedia</h1><p>'+esc(err.message)+'</p><a href="#/">Kembali</a></div>';return;}
 }
 if(!user){authScreen(section==='register'?'register':'login');return;}
 try{
  await loadProfile();accountContext=await loadAccountContext(supabase,user);
  const page=section==='explore'?await feedPage():section==='activity'?await notificationPage():section==='reels'?await reelsPage():section==='compose'?await composePage():section==='addresses'?await addressPage():section==='wallet'?await walletPage():section==='post'?await postDetailPage(parameter||location.hash.split('/')[3]||''):section==='user'?await publicProfilePage(parameter):section==='followers'?await followListPage('followers'):section==='following'?await followListPage('following'):section==='requests'?await followListPage('followers'):section==='preview'?await profilePage(true):section==='professional'?professionalPage(accountContext,profile):section==='professional-create'?professionalFormPage(accountContext,profile):section==='settings'?settingsHubPage():section==='blocked'?await blockedAccountsPage():section==='content-settings'?await accountSettingsPage(supabase,user):await profilePage();
  const headerAvatar=await signed(profile.avatar_path);document.querySelector('#app').innerHTML=frame(page,section==='explore'||section==='reels'?'explore':section==='activity'?'activity':section==='addresses'?'addresses':section==='compose'?'compose':section==='preview'?'profile':'profile',headerAvatar);
  document.querySelector('#ua-logout')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;profile=null;authScreen('login');});
  bindAccountContext({db:supabase,user,ctx:accountContext,profile,refresh:mountAccount});
  document.querySelector('#ua-settings-logout')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;profile=null;location.hash='/account/login';});
  document.querySelector('#ua-edit-profile-link')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('#edit-profile')?.scrollIntoView({behavior:'smooth',block:'start'});});
  document.querySelector('#ua-menu-logout')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;profile=null;location.hash='/';});
  normalizeFeedMediaFrames(document);
  bindProfileTabs();
  bindNotificationActions();
  bindProfile();bindCompose();bindStoryCompose();bindStories();bindExploreFilters();bindAddresses();bindWallet();bindPostActions();bindFollowActions();if(section==='blocked')bindBlockedAccounts();if(section==='reels')bindReelsPlayback();if(section==='addresses')initMap();
 }catch(err){document.querySelector('#app').innerHTML=frame('<div class="ua-panel ua-error"><h1>Ada kendala memuat akun</h1><p>'+esc(err.message)+'</p><button class="ua-primary" onclick="location.reload()">Coba lagi</button></div>');document.querySelector('#ua-logout')?.addEventListener('click',()=>supabase.auth.signOut());}
}
function bindWallet(){
 const form=document.querySelector('#ua-wallet-form');if(!form)return;
 form.addEventListener('submit',async e=>{
  e.preventDefault();const d=new FormData(form),amount=Number(d.get('amount')),type=String(d.get('request_type')),note=document.querySelector('#ua-wallet-note'),btn=form.querySelector('button[type=submit]');
  if(!Number.isSafeInteger(amount)||amount<10000){note.textContent='Nominal minimum Rp10.000.';return;}
  if(type==='withdrawal'&&!String(d.get('destination_details')||'').trim()){note.textContent='Isi detail rekening tujuan untuk penarikan.';return;}
  btn.disabled=true;note.textContent='Mengirim permintaan…';
  const {error}=await supabase.from('wallet_requests').insert({user_id:user.id,request_type:type,amount_minor:amount,payment_method:String(d.get('payment_method')||'').trim()||null,destination_details:String(d.get('destination_details')||'').trim()||null,note:String(d.get('note')||'').trim()||null});
  if(error){note.textContent=error.message;btn.disabled=false;return;}
  notify('Permintaan transaksi berhasil dikirim.');await mountAccount('wallet');
 });
}
function bindProfile(){
 const form=document.querySelector('#ua-profile-form');
 form?.addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(form),note=document.querySelector('#ua-profile-note');
  const username=String(f.get('username')).trim().toLowerCase();
  if(!/^[a-z0-9][a-z0-9._]{2,29}$/.test(username)){note.textContent='Username 3–30 karakter, huruf kecil, angka, titik, atau garis bawah.';return;}
  const payload={id:user.id,display_name:String(f.get('display_name')).trim(),username,bio:String(f.get('bio')||'').trim(),public_city:String(f.get('public_city')||'').trim()||null,public_province:String(f.get('public_province')||'').trim()||null,visibility:String(f.get('visibility')),show_store:f.get('show_store')==='on',avatar_path:profile.avatar_path,cover_path:profile.cover_path,updated_at:new Date().toISOString()};
  const btn=form.querySelector('button');btn.disabled=true;note.textContent='Menyimpan…';
  const {data,error}=await supabase.from('user_profiles').upsert(payload).select().single();
  btn.disabled=false;if(error){note.textContent=error.code==='23505'?'Username sudah digunakan. Pilih username lain.':error.message;return;}
  profile=data;note.textContent='Profil berhasil disimpan.';notify('Profil diperbarui.');setTimeout(()=>mountAccount('profile'),450);
 });
 bindImageUpload('ua-avatar-file','avatar_path','avatar');bindImageUpload('ua-cover-file','cover_path','cover');
}
function bindImageUpload(inputId,column,label){
 const input=document.getElementById(inputId);input?.addEventListener('change',async()=>{
  const file=input.files?.[0];if(!file)return;
  if(file.size>8*1024*1024){notify('Foto maksimal 8 MB.', 'error');return;}
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){notify('Gunakan JPG, PNG, atau WebP.','error');return;}
  try{notify('Mengunggah '+label+'…','info');const ext=file.name.split('.').pop().toLowerCase(),path=user.id+'/'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2))+'.'+ext;
   const {error}=await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;
   const {data,error:updateError}=await supabase.from('user_profiles').update({[column]:path,updated_at:new Date().toISOString()}).eq('id',user.id).select().single();if(updateError)throw updateError;
   profile=data;notify(label==='avatar'?'Foto profil diperbarui.':'Foto sampul diperbarui.');await mountAccount('profile');
  }catch(err){notify(err.message||'Upload gagal.','error');}
 });
}

async function uploadMediaFile(file,path,mime,onProgress=()=>{}){
 if(file.size<=6*1024*1024){
  const result=await supabase.storage.from(BUCKET).upload(path,file,{contentType:mime,upsert:false});
  if(result.error)throw result.error;
  onProgress(100);return result;
 }
 const {data:{session},error:sessionError}=await supabase.auth.getSession();
 if(sessionError)throw sessionError;
 if(!session?.access_token)throw new Error('Sesi login berakhir. Silakan masuk kembali.');
 return new Promise((resolve,reject)=>{
  const upload=new TusUpload(file,{
   endpoint:'https://ytndswhqxayqpftszwfh.storage.supabase.co/storage/v1/upload/resumable',
   retryDelays:[0,3000,5000,10000,20000],
   headers:{authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'x-upsert':'false'},
   uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,chunkSize:6*1024*1024,
   metadata:{bucketName:BUCKET,objectName:path,contentType:mime,cacheControl:'3600'},
   onProgress:(sent,total)=>onProgress(total?sent/total*100:0),
   onError:error=>reject(error),
   onSuccess:()=>resolve({data:{path},error:null})
  });
  upload.findPreviousUploads().then(previous=>{if(previous.length)upload.resumeFromPreviousUpload(previous[0]);upload.start();}).catch(reject);
 });
}

function bindCompose(){
 const input=document.querySelector('#ua-post-file'),preview=document.querySelector('#ua-media-preview'),note=msg=>{const n=document.querySelector('#ua-compose-note');if(n)n.textContent=msg;};
 input?.addEventListener('change',()=>{(JSON.parse(preview.dataset.urls||'[]')).forEach(URL.revokeObjectURL);preview.dataset.urls='';preview.innerHTML='';const files=[...(input.files||[])];if(!files.length)return;if(files.length>15){note('Maksimal 15 media.');input.value='';return;}const bad=files.find(f=>!uploadMime(f)||f.size>50*1024*1024);if(bad){note(!uploadMime(bad)?'Format tidak didukung.':'Maksimal 50 MB per file.');input.value='';return;}const urls=files.map(URL.createObjectURL);preview.dataset.urls=JSON.stringify(urls);preview.innerHTML=files.map((f,i)=>uploadMime(f).startsWith('video/')?'<video controls playsinline preload="metadata" src="'+urls[i]+'"></video>':'<img src="'+urls[i]+'" alt="Media '+(i+1)+'">').join('');});
 document.querySelector('#ua-post-form')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,files=[...(input?.files||[])],d=new FormData(form),caption=String(d.get('caption')||'').trim(),button=form.querySelector('button[type=submit]'),progress=document.querySelector('#ua-upload-progress');if(!files.length&&!caption){note('Tulis caption atau pilih media.');return;}if(files.length>15){note('Maksimal 15 media.');return;}const bad=files.find(f=>!uploadMime(f)||f.size>50*1024*1024);if(bad){note(!uploadMime(bad)?'Format tidak didukung.':'Maksimal 50 MB per file.');return;}button.disabled=true;button.textContent='Mengunggah…';const uploaded=[];try{for(let i=0;i<files.length;i++){const f=files[i],mime=uploadMime(f),ext=f.name.split('.').pop().toLowerCase(),token=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2),path=user.id+'/'+token+'.'+ext,up=await uploadMediaFile(f,path,mime,pct=>{progress.hidden=false;progress.querySelector('span').style.width=Math.round((i+pct/100)/files.length*65)+'%';});if(up.error)throw up.error;let duration=null;if(mime.startsWith('video/'))duration=await new Promise(resolve=>{const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>{const n=Number.isFinite(v.duration)?Math.round(v.duration*1000):null;URL.revokeObjectURL(v.src);resolve(n);};v.onerror=()=>resolve(null);v.src=URL.createObjectURL(f);});uploaded.push({media_path:path,media_type:mime.startsWith('video/')?'video':'image',position:i,duration_ms:duration});progress.hidden=false;progress.querySelector('span').style.width=Math.round(65*uploaded.length/files.length)+'%';}const tags=[],ctx={profile_context:accountContext.active,professional_profile_id:accountContext.active==='professional'?accountContext.professional?.id||null:null,business_store_id:accountContext.active==='business'?(accountContext.prefs?.active_store_id||accountContext.stores[0]?.id||null):null},first=uploaded[0],ins=await supabase.from('user_posts').insert({user_id:user.id,...ctx,caption,tags,media_path:first?.media_path||null,media_type:uploaded.length?(uploaded.length===1?first.media_type:'mixed'):'text',visibility:form.dataset.defaultVisibility==='private'?'private':'public'}).select('id').single();if(ins.error)throw ins.error;if(uploaded.length){const link=await supabase.from('post_media').insert(uploaded.map(x=>({...x,post_id:ins.data.id,user_id:user.id})));if(link.error){await supabase.from('user_posts').delete().eq('id',ins.data.id);throw link.error;}}progress.querySelector('span').style.width='100%';JSON.parse(preview.dataset.urls||'[]').forEach(URL.revokeObjectURL);notify('Postingan berhasil diterbitkan.');await mountAccount('explore');}catch(err){if(uploaded.length)await supabase.storage.from(BUCKET).remove(uploaded.map(x=>x.media_path));note(err.message||'Upload gagal.');button.disabled=false;button.textContent='Coba lagi';progress.hidden=true;}});
}
function bindStories(){
 document.querySelectorAll('.ua-story-item').forEach(button=>{
  button.addEventListener('click',()=>{
   const url=button.dataset.storyUrl||'';
   if(!url)return;
   const type=button.dataset.storyType||'image';
   const owner=button.dataset.storyOwner||'Pengguna Pluits';
   const caption=button.dataset.storyCaption||'';
   const media=type==='video'
    ?"<video src='"+esc(url)+"' controls playsinline preload='metadata'></video>"
    :"<img src='"+esc(url)+"' alt='Story dari "+esc(owner)+"'>";
   const overlay=document.createElement('div');
   overlay.className='ua-story-viewer';
   overlay.innerHTML="<div class='ua-story-viewer-card'><button type='button' class='ua-story-viewer-close' data-story-close aria-label='Tutup Story'>×</button><div class='ua-story-viewer-media'>"+media+"</div><div class='ua-story-viewer-caption'><strong>"+esc(owner)+"</strong>"+(caption?"<p>"+esc(caption)+"</p>":"")+"</div></div>";
   document.body.appendChild(overlay);
   overlay.addEventListener('click',event=>{
    if(event.target===overlay||event.target.closest('[data-story-close]'))overlay.remove();
   });
  });
 });
}
function bindStoryCompose(){
 const form=document.querySelector('#ua-story-form');if(!form)return;
 const fileInput=form.querySelector("input[type='file']"),preview=document.querySelector('#ua-story-preview'),note=document.querySelector('#ua-story-note');
 fileInput?.addEventListener('change',()=>{
  if(preview.dataset.objectUrl)URL.revokeObjectURL(preview.dataset.objectUrl);
  preview.dataset.objectUrl='';preview.innerHTML='';
  const file=fileInput.files?.[0];if(!file)return;
  const mime=uploadMime(file);
  if(!mime){note.textContent='Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, MP4, atau WebM.';fileInput.value='';return;}
  const url=URL.createObjectURL(file);preview.dataset.objectUrl=url;
  preview.innerHTML=mime.startsWith('video/')?"<video controls playsinline preload='metadata' src='"+url+"'></video>":"<img src='"+url+"' alt='Pratinjau Story'>";
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const file=fileInput?.files?.[0];
  if(!file){note.textContent='Pilih foto atau video terlebih dahulu.';return;}
  const mime=uploadMime(file);
  if(!mime){note.textContent='Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, MP4, atau WebM.';return;}
  if(file.size>50*1024*1024){note.textContent='Ukuran file maksimal 50 MB.';return;}
  const button=form.querySelector("button[type='submit']"),data=new FormData(form),caption=String(data.get('caption')||'').trim(),visibility=String(data.get('visibility')||'private');
  button.disabled=true;button.textContent='Mengunggah Story…';note.textContent='Mengunggah media ke Pluits…';
  let uploadedPath=null,storyInserted=false;
  try{
   const extension=file.name.split('.').pop().toLowerCase(),unique=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2),path=user.id+'/'+unique+'.'+extension;
   const upload=await supabase.storage.from(BUCKET).upload(path,file,{contentType:mime,upsert:false});
   if(upload.error)throw new Error('Upload gagal: '+upload.error.message);
   uploadedPath=path;
   const insert=await supabase.from('user_stories').insert({user_id:user.id,media_path:uploadedPath,media_type:mime.startsWith('video/')?'video':'image',caption,visibility});
   if(insert.error)throw new Error('Story gagal disimpan: '+insert.error.message);
   storyInserted=true;uploadedPath=null;
   if(preview.dataset.objectUrl)URL.revokeObjectURL(preview.dataset.objectUrl);
   notify('Story berhasil dibagikan dan akan hilang setelah 24 jam.');
   await mountAccount('explore');
  }catch(error){
   if(uploadedPath&&!storyInserted){
    const cleanup=await supabase.storage.from(BUCKET).remove([uploadedPath]);
    if(cleanup.error)note.textContent='Story gagal disimpan dan file sementara tidak dapat dibersihkan: '+cleanup.error.message;
   }
   note.textContent=error.message||'Tidak dapat membagikan Story.';
   button.disabled=false;button.textContent='Coba lagi';
  }
 });
}

function bindAddresses(){
 const form=document.querySelector('#ua-address-form');if(!form)return;
 form.addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(form),id=String(f.get('id')||''),note=document.querySelector('#ua-address-note');
  const payload={user_id:user.id,label:String(f.get('label')).trim(),recipient_name:String(f.get('recipient_name')).trim(),phone:String(f.get('phone')).trim(),province:String(f.get('province')).trim(),city:String(f.get('city')).trim(),district:String(f.get('district')).trim(),village:String(f.get('village')||'').trim()||null,postal_code:String(f.get('postal_code')).trim(),address_line:String(f.get('address_line')).trim(),delivery_note:String(f.get('delivery_note')||'').trim()||null,latitude:f.get('latitude')?Number(f.get('latitude')):null,longitude:f.get('longitude')?Number(f.get('longitude')):null,is_default:f.get('is_default')==='on'};
  if((payload.latitude===null)!==(payload.longitude===null)){note.textContent='Isi latitude dan longitude bersama-sama.';return;}
  const btn=form.querySelector('button[type=submit]');btn.disabled=true;note.textContent='Menyimpan alamat…';
  try{
   if(payload.is_default)await supabase.from('user_addresses').update({is_default:false}).eq('user_id',user.id);
   const result=id?await supabase.from('user_addresses').update(payload).eq('id',id).select().single():await supabase.from('user_addresses').insert(payload).select().single();
   if(result.error)throw result.error;notify('Alamat berhasil disimpan.');await mountAccount('addresses');
  }catch(err){note.textContent=err.message;btn.disabled=false;}
 });
 document.querySelector('#ua-reset-address')?.addEventListener('click',()=>{form.reset();form.elements.id.value='';document.querySelector('#ua-address-form-title').textContent='Tambah alamat';});
 document.querySelector('#ua-use-location')?.addEventListener('click',()=>{
  if(!navigator.geolocation){notify('Browser tidak mendukung lokasi perangkat.','error');return;}
  notify('Meminta izin lokasi perangkat…','info');
  navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude,lng=pos.coords.longitude;form.elements.latitude.value=lat.toFixed(6);form.elements.longitude.value=lng.toFixed(6);if(leafletMap){leafletMap.setView([lat,lng],17);if(leafletMarker)leafletMarker.setLatLng([lat,lng]);else leafletMarker=window.L.marker([lat,lng]).addTo(leafletMap);}notify('Titik lokasi berhasil diambil. Periksa pin sebelum menyimpan.');},err=>notify(err.message,'error'),{enableHighAccuracy:true,timeout:12000});
 });
 document.querySelectorAll('[data-edit-address]').forEach(btn=>btn.addEventListener('click',()=>{
  const a=addresses.find(x=>x.id===btn.dataset.editAddress);if(!a)return;
  Object.entries(a).forEach(([k,v])=>{if(form.elements[k]){if(form.elements[k].type==='checkbox')form.elements[k].checked=!!v;else form.elements[k].value=v??'';}});
  document.querySelector('#ua-address-form-title').textContent='Edit alamat';document.querySelector('#ua-address-form').scrollIntoView({behavior:'smooth',block:'start'});
  if(leafletMap&&a.latitude!==null&&a.longitude!==null){leafletMap.setView([a.latitude,a.longitude],16);if(leafletMarker)leafletMarker.setLatLng([a.latitude,a.longitude]);else leafletMarker=window.L.marker([a.latitude,a.longitude]).addTo(leafletMap);}
 }));
 document.querySelectorAll('[data-delete-address]').forEach(btn=>btn.addEventListener('click',async()=>{
  if(!confirm('Hapus alamat ini?'))return;const {error}=await supabase.from('user_addresses').delete().eq('id',btn.dataset.deleteAddress);if(error)notify(error.message,'error');else{notify('Alamat dihapus.');await mountAccount('addresses');}
 }));
}
function bindFollowActions(){
 document.querySelectorAll('[data-follow-target]').forEach(button=>button.addEventListener('click',async()=>{
  if(button.disabled)return;
  const target=button.dataset.followTarget,state=button.dataset.followState,username=button.dataset.followUsername;
  button.disabled=true;
  try{
   if(state==='accepted'||state==='pending'){
    const {error}=await supabase.from('user_follows').delete().eq('follower_id',user.id).eq('following_id',target);
    if(error)throw error;
    notify(state==='pending'?'Permintaan mengikuti dibatalkan.':'Anda berhenti mengikuti akun ini.');
   }else{
    const {error}=await supabase.from('user_follows').insert({follower_id:user.id,following_id:target});
    if(error&&error.code!=='23505')throw error;
    notify('Permintaan mengikuti berhasil dikirim.');
   }
   await mountAccount('user',username);
  }catch(err){notify(err.message||'Tidak dapat memperbarui hubungan.','error');button.disabled=false;}
 }));
 document.querySelectorAll('[data-follow-accept]').forEach(button=>button.addEventListener('click',async()=>{
  const follower=button.dataset.followAccept;button.disabled=true;
  const {error}=await supabase.from('user_follows').update({status:'accepted'}).eq('follower_id',follower).eq('following_id',user.id).eq('status','pending');
  if(error){notify(error.message,'error');button.disabled=false;}else{notify('Permintaan mengikuti diterima.');await mountAccount('followers');}
 }));
 document.querySelectorAll('[data-follow-remove]').forEach(button=>button.addEventListener('click',async()=>{
  const other = button.dataset.followRemove;
  const incoming = location.hash.includes("/followers") || location.hash.includes("/requests");
  const followerId = incoming ? other : user.id;
  const followingId = incoming ? user.id : other;
  const result = await supabase.from("user_follows").delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (result.error) {
   notify(result.error.message, "error");
   return;
  }
  notify(incoming ? "Pengikut dihapus." : "Anda berhenti mengikuti akun ini.");
  await mountAccount(incoming ? "followers" : "following");
 }));
}
function bindExploreFilters(){
 document.querySelectorAll('[data-explore-filter]').forEach(button=>button.addEventListener('click',async()=>{
  const next=button.dataset.exploreFilter;if(!['recommended','following','latest','popular'].includes(next)||next===exploreFilter)return;
  exploreFilter=next;await mountAccount('explore');
 }));
}
function bindReelsPlayback(){document.querySelectorAll('[data-reels-filter]').forEach(btn=>btn.addEventListener('click',()=>{reelsFilter=btn.dataset.reelsFilter;mountAccount('reels');}));const feed=document.querySelector('.ua-reels-feed');if(!feed||!('IntersectionObserver' in window))return;const videos=[...feed.querySelectorAll('video')];let active=null;const io=new IntersectionObserver(entries=>entries.forEach(e=>{const v=e.target;if(e.isIntersecting&&e.intersectionRatio>=.7){if(active&&active!==v)active.pause();active=v;v.muted=true;v.loop=true;v.play().catch(()=>{v.controls=true;});}else if(e.intersectionRatio<.25){v.pause();if(active===v)active=null;}}),{threshold:[0,.25,.7,1]});videos.forEach(v=>{v.playsInline=true;v.preload='metadata';io.observe(v);});}
function bindPostActions(){
 document.querySelectorAll('.ua-post-card').forEach(card=>{
  const id=card.dataset.postId;
  card.querySelector('[data-action="edit"]')?.addEventListener('click',async()=>{const box=card.querySelector('.ua-post-editor');if(!box)return;box.hidden=!box.hidden;if(box.dataset.ready)return;const q=await supabase.from('user_posts').select('caption,tags,visibility').eq('id',id).eq('user_id',user.id).single();if(q.error){notify(q.error.message,'error');return;}const mr=await supabase.from('post_media').select('id,media_path,media_type,position').eq('post_id',id).order('position');if(mr.error){notify(mr.error.message,'error');return;}const media=await Promise.all((mr.data||[]).map(async x=>({...x,url:await signed(x.media_path)})));box.innerHTML='<label>Caption<textarea name="caption" rows="4" maxlength="2200">'+esc(q.data.caption||'')+'</textarea></label><label>Tag<input name="tags" value="'+esc((q.data.tags||[]).join(', '))+'"></label><label>Audiens<select name="visibility"><option value="public" '+(q.data.visibility==='public'?'selected':'')+'>Publik</option><option value="private" '+(q.data.visibility==='private'?'selected':'')+'>Hanya saya</option></select></label><strong>Media tidak dapat diganti; hapus satu per satu</strong><div class="ua-edit-media-list">'+media.map(x=>'<div class="ua-edit-media">'+(x.media_type==='video'?'<video src="'+esc(x.url)+'" muted playsinline preload="metadata"></video>':'<img src="'+esc(x.url)+'" alt="Media">')+'<button type="button" data-remove-media="'+x.id+'">×</button></div>').join('')+'</div><div class="ua-edit-actions"><button type="button" class="ua-primary" data-save-post>Simpan</button><button type="button" data-close-post>Tutup</button></div>';box.dataset.ready='1';box.querySelector('[data-save-post]').onclick=async()=>{const u=await supabase.from('user_posts').update({caption:box.querySelector('[name=caption]').value.trim(),tags:box.querySelector('[name=tags]').value.split(',').map(x=>x.trim().replace(/^#/,'').toLowerCase()).filter(Boolean).slice(0,12),visibility:box.querySelector('[name=visibility]').value}).eq('id',id).eq('user_id',user.id);if(u.error)notify(u.error.message,'error');else{notify('Postingan diperbarui.');await mountAccount('profile');}};box.querySelector('[data-close-post]').onclick=()=>box.hidden=true;box.querySelectorAll('[data-remove-media]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Hapus media ini? Tidak bisa diganti.'))return;const item=media.find(x=>x.id===btn.dataset.removeMedia),del=await supabase.from('post_media').delete().eq('id',item.id).eq('post_id',id);if(del.error){notify(del.error.message,'error');return;}const remaining=media.filter(x=>x.id!==item.id).sort((x,y)=>x.position-y.position),primary=remaining[0]||null,parentUpdate=await supabase.from('user_posts').update({media_path:primary?.media_path||null,media_type:remaining.length>1?'mixed':primary?.media_type||'text'}).eq('id',id).eq('user_id',user.id);if(parentUpdate.error){notify('Media terhapus, metadata postingan perlu diperiksa: '+parentUpdate.error.message,'error');return;}const rm=await supabase.storage.from(BUCKET).remove([item.media_path]);if(rm.error)notify(rm.error.message,'error');await mountAccount('profile');});});

  card.querySelector('[data-action="like"]')?.addEventListener('click',async()=>{
   const p=await supabase.from('post_likes').select('post_id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
   const result=p.data?await supabase.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_likes').insert({post_id:id,user_id:user.id});
   if(result.error)notify(result.error.message,'error');else await mountAccount(location.hash.includes('/explore')?'explore':location.hash.split('/')[2]==='post'?'post':'profile');
  });
  card.querySelector('[data-action="save"]')?.addEventListener('click',async()=>{
   const p=await supabase.from('post_saves').select('post_id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
   const result=p.data?await supabase.from('post_saves').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_saves').insert({post_id:id,user_id:user.id});
   if(result.error)notify(result.error.message,'error');else{notify(p.data?'Tanda disimpan dibatalkan.':'Postingan disimpan.');await mountAccount(location.hash.includes('/explore')?'explore':location.hash.split('/')[2]==='post'?'post':'profile');}
  });
  card.querySelector('[data-action="share"]')?.addEventListener('click',async()=>{
   const url=location.origin+location.pathname+'#/account/post/'+id;
   try{if(navigator.share)await navigator.share({title:'Postingan Pluits',url});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);notify('Tautan disalin.');}else{prompt('Salin tautan postingan ini:',url);}}catch{}
  });
  card.querySelector('[data-action="tag"]')?.addEventListener('click',async()=>{
   const handle=prompt('Masukkan username akun yang ingin ditandai (tanpa @):');if(!handle)return;
   const username=handle.trim().replace(/^@/,'').toLowerCase();
   const {data:target,error:lookupError}=await supabase.from('user_profiles').select('id,username').eq('username',username).maybeSingle();
   if(lookupError||!target){notify(lookupError?.message||'Username tidak ditemukan.','error');return;}
   const {error}=await supabase.from('post_tags').insert({post_id:id,tagged_user_id:target.id,tagged_by:user.id});
   if(error)notify(error.code==='23505'?'Akun tersebut sudah ditandai.':error.message,'error');
   else{notify('@'+target.username+' berhasil ditandai.');await mountAccount(location.hash.includes('/explore')?'explore':location.hash.split('/')[2]==='post'?'post':'profile');}
  });
  card.querySelector('[data-action="comments"]')?.addEventListener('click',async()=>{
   const box=card.querySelector('.ua-comments');box.hidden=!box.hidden;if(!box.hidden)await loadComments(id,box);
  });
 });
}
async function loadComments(postId,box){
 box.innerHTML='<p class="ua-muted">Memuat komentar…</p>';
 const {data,error}=await supabase.from('post_comments').select('id,post_id,user_id,body,created_at,parent_comment_id').eq('post_id',postId).order('created_at',{ascending:true});
 if(error){box.innerHTML='<p class="ua-muted">'+esc(error.message)+'</p>';return;}
 const comments=data||[],ids=[...new Set(comments.map(c=>c.user_id))],commentIds=comments.map(c=>c.id);
 const [pr,likesRes]=await Promise.all([
  ids.length?supabase.from('user_profiles').select('id,display_name,username').in('id',ids):Promise.resolve({data:[],error:null}),
  commentIds.length?supabase.from('post_comment_likes').select('comment_id,user_id').in('comment_id',commentIds):Promise.resolve({data:[],error:null})
 ]);
 if(pr.error||likesRes.error){box.innerHTML='<p class="ua-muted">'+esc((pr.error||likesRes.error).message)+'</p>';return;}
 const people=new Map((pr.data||[]).map(p=>[p.id,p])),likes=likesRes.data||[];
 const children=new Map();
 comments.forEach(c=>{const parent=c.parent_comment_id||'root';if(!children.has(parent))children.set(parent,[]);children.get(parent).push(c);});
 const render=(c,depth=0)=>{
  const person=people.get(c.user_id),username=person?.username||'pengguna',liked=likes.some(x=>x.comment_id===c.id&&x.user_id===user.id),count=likes.filter(x=>x.comment_id===c.id).length;
  const replies=(children.get(c.id)||[]).map(x=>render(x,Math.min(depth+1,3))).join('');
  return '<article class="ua-comment-item" data-comment-id="'+c.id+'" style="--comment-depth:'+Math.min(depth,3)+'"><div class="ua-comment-copy"><a href="#/account/user/'+encodeURIComponent(username)+'" class="ua-comment-author">'+esc(person?.display_name||'Pengguna Pluits')+'</a><p>'+esc(c.body)+'</p><small>'+fmtDate(c.created_at)+'</small><div class="ua-comment-actions"><button type="button" data-comment-like="'+c.id+'" class="'+(liked?'is-liked':'')+'">♥ '+(liked?'Disukai':'Suka')+' <b>'+count+'</b></button><button type="button" data-comment-reply="'+c.id+'">Balas</button></div><form class="ua-reply-form" data-reply-form="'+c.id+'" hidden><input name="body" maxlength="1200" required placeholder="Balas komentar…"><button type="submit">Kirim</button></form></div>'+replies+'</article>';
 };
 box.innerHTML='<div class="ua-comment-thread">'+(children.get('root')||[]).map(c=>render(c)).join('')+'</div>'+'<form class="ua-comment-form"><input name="body" maxlength="1200" required placeholder="Tulis komentar…"><button type="submit">Kirim</button></form>';
 box.querySelectorAll('[data-comment-like]').forEach(button=>button.addEventListener('click',async()=>{
  const commentId=button.dataset.commentLike;button.disabled=true;
  const exists=likes.some(x=>x.comment_id===commentId&&x.user_id===user.id);
  const result=exists?await supabase.from('post_comment_likes').delete().eq('comment_id',commentId).eq('user_id',user.id):await supabase.from('post_comment_likes').insert({comment_id:commentId,user_id:user.id});
  if(result.error){notify(result.error.message,'error');button.disabled=false;}else await loadComments(postId,box);
 }));
 box.querySelectorAll('[data-comment-reply]').forEach(button=>button.addEventListener('click',()=>{
  const form=box.querySelector('[data-reply-form="'+button.dataset.commentReply+'"]');if(form){form.hidden=!form.hidden;if(!form.hidden)form.querySelector('input')?.focus();}
 }));
 const submitComment=async(form,parentId=null)=>{
  const body=String(new FormData(form).get('body')||'').trim();if(!body)return;
  const submit=form.querySelector('button');submit.disabled=true;
  const {error:insertError}=await supabase.from('post_comments').insert({post_id:postId,user_id:user.id,body,parent_comment_id:parentId});
  if(insertError){notify(insertError.message,'error');submit.disabled=false;}else{
   const counter=document.querySelector('[data-post-id="'+postId+'"] [data-action="comments"] b');if(counter)counter.textContent=String(Number(counter.textContent||0)+1);
   await loadComments(postId,box);
  }
 };
 box.querySelector('.ua-comment-form')?.addEventListener('submit',e=>{e.preventDefault();submitComment(e.currentTarget);});
 box.querySelectorAll('[data-reply-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();submitComment(form,form.dataset.replyForm);}));
}
export function mountUserAccount(section='profile',parameter=''){mountAccount(section,parameter);}
