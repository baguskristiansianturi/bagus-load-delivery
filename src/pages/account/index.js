import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import './user-account.css';
import {loadAccountContext,contextHeader,professionalPage,professionalFormPage,accountSettingsPage,bindAccountContext} from './account-context.js';

const SUPABASE_URL='https://ytndswhqxayqpftszwfh.supabase.co';
const SUPABASE_KEY='sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const BUCKET='pluits-user-media';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=v=>new Date(v).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const initials=v=>String(v||'P').trim().slice(0,1).toUpperCase();
let user=null,profile=null,addresses=[],noticeTimer=null,leafletMap=null,leafletMarker=null,accountContext={active:'personal',professional:null,stores:[],prefs:{}};

function notify(message,type='success'){
 const el=document.querySelector('#ua-toast');if(!el)return;
 el.textContent=message;el.className='ua-toast show '+type;
 clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('show'),3800);
}
function frame(content,active='explore',avatarUrl=''){
 const userAvatar=avatar(avatarUrl,profile?.display_name||user?.email||'P');
 return `<div class="ua-app ua-social-app">
  ${active==='profile'||active==='preview'?'':`  <header class="ua-header">
   <a class="ua-mobile-profile" href="#/account/profile" aria-label="Profil saya">${userAvatar}</a>
   <a class="ua-brand" href="#/account/explore">PLUITS<span>INDONESIA</span></a>
   <nav><a class="${active==='explore'?'active':''}" href="#/account/explore">Beranda</a><a class="${active==='profile'?'active':''}" href="#/account/profile">Profil</a><a class="${active==='addresses'?'active':''}" href="#/account/addresses">Alamat</a></nav>
   <a class="ua-header-create" href="#/account/compose" aria-label="Buat postingan">＋</a>
  </header>
  <main class="ua-main">${content}</main>
  <nav class="ua-mobile-nav" aria-label="Navigasi utama">
   <a class="${active==='explore'?'active':''}" href="#/account/explore"><span>⌂</span><small>Beranda</small></a>
   <a href="#/account/explore"><span>⌕</span><small>Jelajah</small></a>
   <a class="ua-mobile-create" href="#/account/compose" aria-label="Buat postingan"><span>＋</span></a>
   <a href="#/material"><span>▦</span><small>Marketplace</small></a>
   <a class="${active==='profile'?'active':''}" href="#/account/profile">${userAvatar}<small>Profil</small></a>
  </nav>
  <div id="ua-toast" class="ua-toast" role="status"></div>
  <footer class="ua-footer">PLUITS · Identitas pengguna dan aktivitas komunitas</footer>`}
  ${active==='profile'||active==='preview'?'<main class="ua-main ua-profile-main">'+content+'</main>':''}
  <div id="ua-toast" class="ua-toast" role="status"></div>
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
 return `<div class="ua-subnav"><a href="#/account/profile">Personal</a><a href="#/account/followers">Pengikut</a><a href="#/account/following">Mengikuti</a><a href="#/account/requests">Permintaan</a><a href="#/account/settings">Pengaturan</a><a href="#/account/wallet">Wallet</a><a href="#/account/addresses">Alamat</a><a href="#/account/explore">Explore</a></div>`;
}
const rupiah=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0));
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
  <div class="ua-cover" ${coverUrl?`style="background-image:url('${coverUrl}')"`:''}><span>FOTO SAMPUL</span><label class="ua-cover-edit">Ganti sampul<input id="ua-cover-file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
  <div class="ua-profile-content"><div class="ua-profile-avatar">${avatar(avatarUrl,profile.display_name,'large')}<label class="ua-avatar-edit">＋<input id="ua-avatar-file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
   <div class="ua-profile-identity"><div class="ua-profile-name-row"><div><h2>${esc(profile.display_name)}</h2><div class="ua-username">@${esc(profile.username)}</div></div><details class="ua-profile-menu"><summary aria-label="Menu profil">•••</summary><div class="ua-profile-menu-pop"><a href="#/account/settings">Pengaturan & privasi</a><a href="#/account/settings">Pengaturan postingan</a><a href="#/account/professional">Profil Professional</a><a href="#/account/wallet">Wallet</a><a href="#/account/addresses">Alamat</a><button id="ua-menu-logout" type="button">Keluar dari akun</button></div></details></div><p>${esc(profile.bio||'Bio belum ditambahkan.')}</p><div class="ua-location">${profile.public_city&&profile.public_province?'⌖ '+esc(profile.public_city)+', '+esc(profile.public_province):''}</div><div class="ua-profile-stats"><a href="#profile-posts"><strong>${ownPosts.length}</strong><span>Postingan</span></a><a href="#/account/followers"><strong>${followersCount.count||0}</strong><span>Pengikut</span></a><a href="#/account/following"><strong>${followingCount.count||0}</strong><span>Mengikuti</span></a></div></div>
  </div>
 </section>
 <nav class="ua-profile-tabs" role="tablist" aria-label="Konten profil">
  <button class="active" type="button" role="tab" aria-selected="true" data-profile-tab="posts">▦ <span>Postingan</span></button><button type="button" role="tab" aria-selected="false" data-profile-tab="trips">⌖ <span>Trip</span></button><button type="button" role="tab" aria-selected="false" data-profile-tab="labels">▤ <span>Label</span></button>
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
 const views={
  posts:postsMarkup,
  trips:'<div class="ua-profile-tab-empty"><span>⌖</span><strong>Trip</strong><p>Catatan perjalanan dan trip yang Anda bagikan akan tampil di sini.</p></div>',
  labels:'<div class="ua-profile-tab-empty"><span>▤</span><strong>Label</strong><p>Koleksi label dan topik yang Anda buat akan tampil di sini.</p></div>'
 };
 nav.addEventListener('click',e=>{
  const button=e.target.closest('[data-profile-tab]');if(!button)return;
  const tab=button.dataset.profileTab;if(!views[tab])return;
  nav.querySelectorAll('[data-profile-tab]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
  panel.innerHTML=views[tab];
  panel.dataset.activeTab=tab;
 });
}
function postGrid(posts){
 return `<div class="ua-post-grid">${posts.map(p=>`<a class="ua-post-thumb" href="#/account/post/${p.id}">${p.media_path?(p.media_type==='video'?'<span class="ua-video-mark">▶ VIDEO</span><video src="'+p.mediaUrl+'" muted playsinline preload="metadata"></video>':'<img src="'+p.mediaUrl+'" alt="'+esc(p.caption||'Postingan Pluits')+'">'):'<span class="ua-text-thumb">PLUITS</span>'}<span class="ua-thumb-caption">${esc(p.caption||'')}</span></a>`).join('')}</div>`;
}
async function hydratePosts(rows){
 if(!rows.length)return [];
 const postIds=rows.map(p=>p.id);
 const [tagRowsRes]=await Promise.all([supabase.from('post_tags').select('post_id,tagged_user_id').in('post_id',postIds)]);
 const taggedRows=tagRowsRes.data||[];
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
  return {...p,owner,tagged:taggedRows.filter(t=>t.post_id===p.id).map(t=>pmap.get(t.tagged_user_id)).filter(Boolean),mediaUrl:await signed(p.media_path),avatarUrl:await signed(owner.avatar_path),likes:likeRows.filter(x=>x.post_id===p.id).length,liked:!!user&&likeRows.some(x=>x.post_id===p.id&&x.user_id===user.id),comments:commentRows.filter(x=>x.post_id===p.id).length,saved:saved.has(p.id)};
 }));
}
async function feedPage(){
 const {data,error}=await supabase.from('user_posts').select('*').order('created_at',{ascending:false}).limit(60);
 if(error)throw error;
 const posts=await hydratePosts(data||[]);
 const sorted=posts.sort((a,b)=>(b.likes*3+b.comments)-(a.likes*3+a.comments)||new Date(b.created_at)-new Date(a.created_at));
 const {data:storyRows,error:storyError}=await supabase.from('user_stories').select('id,user_id,media_path,media_type,caption,visibility,created_at,expires_at').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false}).limit(30);
 if(storyError)throw storyError;
 const ownerIds=[...new Set((storyRows||[]).map(s=>s.user_id))];
 let storyProfiles=[];
 if(ownerIds.length){
  const profileResult=await supabase.from('user_profiles').select('id,display_name,username,avatar_path').in('id',ownerIds);
  if(profileResult.error)throw profileResult.error;
  storyProfiles=profileResult.data||[];
 }
 const profileMap=new Map(storyProfiles.map(p=>[p.id,p]));
 const stories=await Promise.all((storyRows||[]).map(async s=>{
  const owner=profileMap.get(s.user_id)||{};
  return {...s,owner,mediaUrl:await signed(s.media_path),avatarUrl:owner.avatar_path?await signed(owner.avatar_path):''};
 }));
 const storyCards=stories.map(s=>"<button type='button' class='ua-story-item' data-story-url='"+esc(s.mediaUrl||'')+"' data-story-type='"+esc(s.media_type)+"' data-story-owner='"+esc(s.owner.display_name||'Pengguna Pluits')+"' data-story-caption='"+esc(s.caption||"")+"'><span class='ua-story-ring'>"+(s.avatarUrl?"<img src='"+esc(s.avatarUrl)+"' alt=''>":"<b>PL</b>")+"</span><small>"+esc(s.owner.display_name||'Pluits')+"</small></button>").join('');
 const defaultStoryVisibility=profile.visibility==='public'?'public':'private';
 const storySection="<section class='ua-stories-block'><div class='ua-stories-head'><div><strong>Stories</strong><small>Foto atau video singkat yang hilang setelah 24 jam</small></div><details class='ua-story-create'><summary>＋ Buat Story</summary><form id='ua-story-form' class='ua-story-form'><label class='ua-story-upload'>Pilih foto atau video<input type='file' accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm' required></label><div id='ua-story-preview' class='ua-story-preview'></div><label>Caption (opsional)<textarea name='caption' rows='2' maxlength='220' placeholder='Tambahkan cerita singkat...'></textarea></label><label>Siapa yang dapat melihat?<select name='visibility'><option value='private' "+(defaultStoryVisibility==='private'?'selected':'')+">Hanya saya</option><option value='public' "+(defaultStoryVisibility==='public'?'selected':'')+(defaultStoryVisibility==='private'?' disabled':'')+">Publik</option></select></label><p id='ua-story-note' class='ua-story-note'></p><button class='ua-primary' type='submit'>Bagikan Story</button></form></details></div><div class='ua-story-strip'>"+(storyCards||"<div class='ua-story-empty'>Belum ada Story aktif. Bagikan momen pertama Anda.</div>")+"</div></section>";
 return "<div class='ua-page-heading'><div><span class='ua-eyebrow'>TEMUKAN KOMUNITAS</span><h1>Explore</h1><p>Foto dan video dari komunitas Pluits, dalam satu aliran.</p></div><div class='ua-heading-actions'><a class='ua-outline' href='#/account/reels'>Lihat Reels</a><a class='ua-primary ua-inline' href='#/account/compose'>＋ Buat postingan</a></div></div>"+storySection+
 "<div class='ua-explore-note'>Konten baru juga mendapat kesempatan ditemukan. Urutan Explore mempertimbangkan interaksi nyata dan kebaruan, bukan angka viral buatan.</div>"+
 "<section class='ua-feed'>"+(sorted.length?sorted.map(postCard).join(''):"<div class='ua-panel ua-empty'><strong>Explore masih menunggu cerita pertama.</strong><p>Jadilah pengguna pertama yang mengunggah foto atau video. Konten publik Anda akan muncul di sini setelah tersimpan.</p><a class='ua-primary ua-inline' href='#/account/compose'>Unggah foto atau video</a></div>")+"</section>";
}

async function reelsPage(){
 const {data,error}=await supabase.from('user_posts').select('*').eq('media_type','video').order('created_at',{ascending:false}).limit(40);
 if(error)throw error;
 const posts=await hydratePosts(data||[]);
 const sorted=posts.sort((x,y)=>(y.likes*3+y.comments)-(x.likes*3+x.comments)||new Date(y.created_at)-new Date(x.created_at));
 return "<div class='ua-page-heading'><div><span class='ua-eyebrow'>VIDEO KOMUNITAS</span><h1>Reels</h1><p>Video Pluits dalam aliran vertikal. Rasio asli video tetap dipertahankan.</p></div><a class='ua-outline' href='#/account/explore'>Kembali ke Explore</a></div><section class='ua-reels-feed'>"+(sorted.length?sorted.map(postCard).join(''):"<div class='ua-panel ua-empty'><strong>Belum ada Reels.</strong><p>Unggah video melalui Buat postingan untuk memulai.</p><a class='ua-primary ua-inline' href='#/account/compose'>＋ Unggah video</a></div>")+"</section>";
}

function postCard(p){
 return `<article class="ua-post-card" data-post-id="${p.id}"><div class="ua-post-head">${avatar(p.avatarUrl,p.owner.display_name)}<div><a class="ua-author-link" href="#/account/user/${encodeURIComponent(p.owner.username)}"><strong>${esc(p.owner.display_name)}</strong></a><small>@${esc(p.owner.username)} ${p.owner.public_city&&p.owner.public_province?'· ⌖ '+esc(p.owner.public_city)+', '+esc(p.owner.public_province):''}</small></div><time>${fmtDate(p.created_at)}</time></div>
 <p class="ua-caption">${esc(p.caption)}</p>${(p.tags?.length||p.tagged?.length)?'<div class="ua-tags">'+(p.tags||[]).map(t=>'<span>#'+esc(t)+'</span>').join(' ')+(p.tagged||[]).map(t=>'<span>＠'+esc(t.username)+'</span>').join(' ')+'</div>':''}
 ${p.media_path?'<div class="ua-media">'+(p.media_type==='video'?'<video src="'+p.mediaUrl+'" controls playsinline preload="metadata"></video>':'<img src="'+p.mediaUrl+'" alt="'+esc(p.caption||'Foto postingan')+'">')+'</div>':'<div class="ua-text-post-mark">PLUITS</div>'}
 <div class="ua-post-actions"><button data-action="like" class="${p.liked?'is-liked':''}">♥ <span>${p.liked?'Disukai':'Suka'}</span> <b>${p.likes}</b></button><button data-action="comments">◯ Komentar <b>${p.comments}</b></button><button data-action="share">↗ Bagikan</button><button data-action="save" class="${p.saved?'is-saved':''}">▱ ${p.saved?'Tersimpan':'Tandai'}</button><button data-action="tag" ${p.user_id===user?.id?'':'disabled title="Hanya pemilik postingan dapat menandai akun"'}>＠ Tag</button></div><div class="ua-comments" hidden></div>
 </article>`;
}
async function composePage(){
 const {data:contentPrefs}=await supabase.from('account_content_preferences').select('*').eq('user_id',user.id).maybeSingle();
 const defaultAudience=accountContext.active==='professional'?(contentPrefs?.professional_default_visibility==='unlisted'?'private':'public'):accountContext.active==='business'?(contentPrefs?.business_default_visibility==='unlisted'?'private':'public'):(contentPrefs?.personal_default_visibility||'public');
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">CERITAKAN SESUATU</span><h1>Buat postingan</h1><p>Bagikan tulisan, foto, atau video dari perangkat Anda.</p></div><a class="ua-outline" href="#/account/profile">Kembali ke profil</a></div>
 <section class="ua-panel ua-compose-panel"><form id="ua-post-form" class="ua-compose-form">
  <label class="ua-upload-zone" for="ua-post-file"><span class="ua-upload-icon">＋</span><strong>Tambahkan foto atau video (opsional)</strong><small>Anda juga bisa menerbitkan tulisan tanpa gambar atau video · Maksimal 50 MB</small><input id="ua-post-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"></label>
  <div id="ua-media-preview" class="ua-media-preview"></div>
  <label>Caption<textarea name="caption" rows="4" maxlength="2200" placeholder="Apa yang ingin Anda bagikan?"></textarea></label>
  <label>Tag / kata kunci<input name="tags" placeholder="contoh: proyek, inspirasi, pluits (pisahkan dengan koma)"></label>
  <label>Siapa yang dapat melihat?<select name="visibility"><option value="public" ${defaultAudience==='public'?'selected':''}>Publik — dapat tampil di Explore</option><option value="private" ${defaultAudience==='private'?'selected':''}>Hanya saya</option></select></label>
  <div class="ua-progress" id="ua-upload-progress" hidden><span></span></div>
  <button class="ua-primary" type="submit">Terbitkan postingan</button><p class="ua-form-note" id="ua-compose-note">Postingan baru akan tampil pada profil Anda. Postingan publik dapat muncul di Explore.</p>
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
 const [followers,following]=await Promise.all([
  supabase.from('user_follows').select('*',{count:'exact',head:true}).eq('following_id',target.id).eq('status','accepted'),
  supabase.from('user_follows').select('*',{count:'exact',head:true}).eq('follower_id',target.id).eq('status','accepted')
 ]);
 const avatarUrl=await signed(target.avatar_path),coverUrl=await signed(target.cover_path);
 let posts=[];
 if(target.visibility==='public'||isOwner||relation?.status==='accepted'){
  const {data:rows,error:pe}=await supabase.from('user_posts').select('*').eq('user_id',target.id).eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(60);
  if(pe)throw pe;posts=await hydratePosts(rows||[]);
 }
 const followLabel=isOwner?'Edit profil':relation?.status==='accepted'?'Mengikuti':relation?.status==='pending'?'Permintaan terkirim':target.visibility==='private'?'Minta mengikuti':'Ikuti';
 const canSeeCounts=target.visibility==='public'||isOwner;
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PROFIL PENGGUNA</span><h1>@${esc(target.username)}</h1></div><a class="ua-outline" href="#/account/explore">Kembali ke Explore</a></div>
 <section class="ua-profile-card ua-public-profile">
  <div class="ua-cover" ${coverUrl?`style="background-image:url('${coverUrl}')"`:''}><span>PLUITS PROFILE</span></div>
  <div class="ua-profile-content"><div class="ua-profile-avatar">${avatar(avatarUrl,target.display_name,'large')}</div>
   <div class="ua-profile-identity"><h2>${esc(target.display_name)}</h2><div class="ua-username">@${esc(target.username)}</div>
   <div class="ua-location">${target.public_city&&target.public_province?'⌖ '+esc(target.public_city)+', '+esc(target.public_province):''}</div>
   <p>${esc(target.bio||'')}</p>
   <div class="ua-profile-stats"><span><strong>${posts.length}</strong><span>Postingan</span></span><span><strong>${canSeeCounts?(followers.count||0):'—'}</strong><span>Pengikut</span></span><span><strong>${canSeeCounts?(following.count||0):'—'}</strong><span>Mengikuti</span></span></div>
   ${isOwner?`<a class="ua-primary ua-inline" href="#/account/profile">Edit profil</a>`:user?`<button type="button" class="ua-primary ua-inline" data-follow-target="${target.id}" data-follow-state="${relation?.status||''}" data-follow-username="${esc(target.username)}" ${relation?.status==='pending'&&relation.follower_id!==user.id?'disabled':''}>${followLabel}</button>`:`<a class="ua-primary ua-inline" href="#/account/login">Masuk untuk mengikuti</a>`}
   </div>
  </div>
 </section>
 <section class="ua-panel ua-posts-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">KONTEN PROFIL</span><h2>Postingan</h2></div></div>
 ${target.visibility==='private'&&!isOwner&&relation?.status!=='accepted'?'<div class="ua-empty"><strong>Akun ini privat</strong><p>Ajukan permintaan mengikuti untuk melihat postingan publik akun ini setelah disetujui.</p></div>':posts.length?postGrid(posts):'<div class="ua-empty"><strong>Belum ada postingan publik</strong><p>Postingan publik akan tampil di sini.</p></div>'}
 </section>`;
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
async function mountAccount(section='profile',parameter=''){
 const {data:{session}}=await supabase.auth.getSession();user=session?.user||null;
 if(!user&&section==='user'){
  try{const page=await publicProfilePage(parameter);document.querySelector('#app').innerHTML=frame(page,'explore');return;}
  catch(err){document.querySelector('#app').innerHTML='<div class="ua-panel ua-error"><h1>Profil tidak tersedia</h1><p>'+esc(err.message)+'</p><a href="#/">Kembali</a></div>';return;}
 }
 if(!user){authScreen(section==='register'?'register':'login');return;}
 try{
  await loadProfile();accountContext=await loadAccountContext(supabase,user);
  const page=section==='explore'?await feedPage():section==='reels'?await reelsPage():section==='compose'?await composePage():section==='addresses'?await addressPage():section==='wallet'?await walletPage():section==='post'?await postDetailPage(parameter||location.hash.split('/')[3]||''):section==='user'?await publicProfilePage(parameter):section==='followers'?await followListPage('followers'):section==='following'?await followListPage('following'):section==='requests'?await followListPage('followers'):section==='preview'?await profilePage(true):section==='professional'?professionalPage(accountContext,profile):section==='professional-create'?professionalFormPage(accountContext,profile):section==='settings'?await accountSettingsPage(supabase,user):await profilePage();
  const headerAvatar=await signed(profile.avatar_path);document.querySelector('#app').innerHTML=frame(page,section==='explore'||section==='reels'?'explore':section==='addresses'?'addresses':section==='compose'?'compose':section==='preview'?'profile':'profile',headerAvatar);
  document.querySelector('#ua-logout')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;profile=null;authScreen('login');});
  bindAccountContext({db:supabase,user,ctx:accountContext,profile,refresh:mountAccount});
  document.querySelector('#ua-edit-profile-link')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('#edit-profile')?.scrollIntoView({behavior:'smooth',block:'start'});});
  document.querySelector('#ua-menu-logout')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;profile=null;location.hash='/';});
  bindProfileTabs();
  bindProfile();bindCompose();bindStoryCompose();bindStories();bindAddresses();bindWallet();bindPostActions();bindFollowActions();if(section==='addresses')initMap();
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
function bindCompose(){
 const fileInput=document.querySelector('#ua-post-file'),preview=document.querySelector('#ua-media-preview');
 fileInput?.addEventListener('change',()=>{
  const f=fileInput.files?.[0];preview.innerHTML='';if(!f)return;
  const url=URL.createObjectURL(f);preview.innerHTML=f.type.startsWith('video/')?'<video controls playsinline src="'+url+'"></video>':'<img src="'+url+'" alt="Pratinjau foto">';
 });
 document.querySelector('#ua-post-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget,file=fileInput?.files?.[0]||null,note=document.querySelector('#ua-compose-note'),btn=form.querySelector('button[type=submit]'),progress=document.querySelector('#ua-upload-progress');
  const data=new FormData(form),caption=String(data.get('caption')||'').trim();
  if(!file&&!caption){note.textContent='Tulis caption atau pilih foto/video sebelum menerbitkan postingan.';return;}
  const isVideo=!!file&&file.type.startsWith('video/'),allowed=['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];
  if(file&&!allowed.includes(file.type)){note.textContent='Format file tidak didukung. Gunakan JPG, PNG, WebP, GIF, MP4, atau WebM.';return;}
  if(file&&file.size>50*1024*1024){note.textContent='Ukuran file maksimal 50 MB.';return;}
  btn.disabled=true;btn.textContent=file?'Mengunggah media…':'Menerbitkan tulisan…';note.textContent=file?'Mengunggah media ke penyimpanan Pluits…':'Menyimpan postingan teks…';
  if(file){progress.hidden=false;progress.querySelector('span').style.width='25%';}
  let uploadedPath=null;
  let storyInserted=false;
  try{
   if(file){
    const ext=file.name.split('.').pop().toLowerCase(),path=user.id+'/'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2))+'.'+ext;
    const {error:uploadError}=await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
    if(uploadError)throw new Error('Upload media gagal: '+uploadError.message);
    uploadedPath=path;progress.querySelector('span').style.width='75%';
   }
   const tags=String(data.get('tags')||'').split(',').map(x=>x.trim().replace(/^#/,'').toLowerCase()).filter(Boolean).slice(0,12);
   const postContext={profile_context:accountContext.active,professional_profile_id:accountContext.active==='professional'?accountContext.professional?.id||null:null,business_store_id:accountContext.active==='business'?(accountContext.prefs?.active_store_id||accountContext.stores[0]?.id||null):null};
   const {error:insertError}=await supabase.from('user_posts').insert({user_id:user.id,...postContext,caption,tags,media_path:uploadedPath,media_type:file?(isVideo?'video':'image'):'text',visibility:String(data.get('visibility'))});
   if(insertError)throw new Error('Media tersimpan tetapi postingan gagal dibuat: '+insertError.message);
   if(file)progress.querySelector('span').style.width='100%';
   notify(file?'Postingan dengan media berhasil diterbitkan.':'Postingan teks berhasil diterbitkan.');
   await mountAccount('explore');
  }catch(err){
   note.textContent=err.message||'Tidak dapat menerbitkan postingan.';
   btn.disabled=false;btn.textContent='Coba lagi';progress.hidden=true;
   if(uploadedPath)note.textContent+=' File media sudah terunggah; coba terbitkan ulang tanpa mengunggah file yang sama jika perlu.';
  }
 });
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
 const form=document.querySelector('#ua-story-form');
 if(!form)return;
 const fileInput=form.querySelector("input[type='file']");
 const preview=document.querySelector('#ua-story-preview');
 const note=document.querySelector('#ua-story-note');
 fileInput?.addEventListener('change',()=>{
  const file=fileInput.files?.[0];
  if(preview.dataset.objectUrl)URL.revokeObjectURL(preview.dataset.objectUrl);
  preview.dataset.objectUrl='';
  preview.innerHTML='';
  if(!file)return;
  const url=URL.createObjectURL(file);
  preview.dataset.objectUrl=url;
  preview.innerHTML=file.type.startsWith('video/')
   ?"<video controls playsinline src='"+url+"'></video>"
   :"<img src='"+url+"' alt='Pratinjau Story'>";
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const file=fileInput?.files?.[0];
  if(!file){note.textContent='Pilih foto atau video terlebih dahulu.';return;}
  const allowed=['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];
  if(!allowed.includes(file.type)){note.textContent='Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, MP4, atau WebM.';return;}
  if(file.size>50*1024*1024){note.textContent='Ukuran file maksimal 50 MB.';return;}
  const button=form.querySelector("button[type='submit']");
  const data=new FormData(form);
  const caption=String(data.get('caption')||'').trim();
  const visibility=String(data.get('visibility')||'private');
  button.disabled=true;
  button.textContent='Mengunggah Story…';
  note.textContent='Mengunggah media ke Pluits…';
  let uploadedPath=null;
  try{
   const extension=file.name.split('.').pop().toLowerCase();
   const unique=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);
   const path=user.id+'/'+unique+'.'+extension;
   const upload=await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
   if(upload.error)throw new Error('Upload gagal: '+upload.error.message);
   uploadedPath=path;
   const insert=await supabase.from('user_stories').insert({
    user_id:user.id,
    media_path:uploadedPath,
    media_type:file.type.startsWith('video/')?'video':'image',
    caption,
    visibility
   });
   if(insert.error)throw new Error('Story gagal disimpan: '+insert.error.message);
   storyInserted=true;
   notify('Story berhasil dibagikan dan akan hilang setelah 24 jam.');
   await mountAccount('explore');
  }catch(error){
   if(uploadedPath&&!storyInserted)await supabase.storage.from(BUCKET).remove([uploadedPath]);
   note.textContent=storyInserted?'Story sudah tersimpan. Buka ulang Explore jika belum terlihat.':(error.message||'Tidak dapat membagikan Story.');
   button.disabled=false;
   button.textContent='Coba lagi';
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
  const other=button.dataset.followRemove, incoming=location.hash.includes('/followers')||location.hash.includes('/requests');
  const {error}=await supabase.from('user_follows').delete().eq('follower_id',incoming?other:user.id).eq('following_id',incoming?user.id:other);
  if(error)notify(error.message,'error');else{notify(incoming?'Pengikut dihapus.':'Anda berhenti mengikuti akun ini.');await mountAccount(incoming?'followers':'following');}
 }));
}
function bindPostActions(){
 document.querySelectorAll('.ua-post-card').forEach(card=>{
  const id=card.dataset.postId;
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
 const {data,error}=await supabase.from('post_comments').select('*').eq('post_id',postId).order('created_at',{ascending:true});
 if(error){box.innerHTML='<p class="ua-muted">'+esc(error.message)+'</p>';return;}
 const comments=data||[],ids=[...new Set(comments.map(c=>c.user_id))];
 const pr=ids.length?await supabase.from('user_profiles').select('id,display_name,username').in('id',ids):{data:[]};
 const map=new Map((pr.data||[]).map(p=>[p.id,p]));
 box.innerHTML=(comments.length?comments.map(c=>{const p=map.get(c.user_id);return '<p><strong>'+esc(p?.display_name||'Pengguna Pluits')+'</strong> '+esc(c.body)+'<small>'+fmtDate(c.created_at)+'</small></p>';}).join(''):'<p class="ua-muted">Belum ada komentar.</p>')+
 '<form class="ua-comment-form"><input name="body" maxlength="1200" required placeholder="Tulis komentar…"><button>kirim</button></form>';
 box.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const body=new FormData(e.currentTarget).get('body');const {error}=await supabase.from('post_comments').insert({post_id:postId,user_id:user.id,body:String(body).trim()});if(error)notify(error.message,'error');else{const counter=document.querySelector('[data-post-id="'+postId+'"] [data-action="comments"] b');if(counter)counter.textContent=String(Number(counter.textContent||0)+1);await loadComments(postId,box);}});
}
export function mountUserAccount(section='profile',parameter=''){mountAccount(section,parameter);}
