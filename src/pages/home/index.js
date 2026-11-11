import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {renderSocialHeader,renderSocialMobileNav} from '../../components/social/navigation.js';
import {ROUTES} from '../../components/social/navigation-routes.js';
import {homeNearbySection,bindHomeNearby} from '../directory/index.js';
import {createSignedUrlMap} from '../../services/storage/signed-urls.js';
const db=createClient('https://ytndswhqxayqpftszwfh.supabase.co','sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const safe=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function home(){
 const guestMode=(location.hash||'').startsWith('#/guest');
 const image=(id)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=900&q=82';
 const destinations=[
  ['Pantai & alam','photo-1507525428034-b723cf961d3e','Temukan destinasi menarik'],
  ['Kuliner & kafe','photo-1517248135467-4c7edcad34c4','Jelajahi tempat makan'],
  ['Belanja & toko','photo-1441986300917-64674bd600d8','Temukan produk lokal'],
  ['Aktivitas & trip','photo-1476514525535-07fb3b4ae5f1','Rencanakan pengalaman']
 ];
 return `<div class="pl-social-home pl-public-home">
 ${renderSocialHeader({active:'home',publicHome:true})}
 <main class="pl-public-shell">
  <section class="pl-public-hero">
   <div class="pl-public-hero-copy"><span class="pl-public-eyebrow">SOCIAL · LOCAL · DISCOVERY</span><h1>Temukan dunia di sekitarmu.</h1><p>Jelajahi tempat, cerita, komunitas, produk, dan layanan. Semua terhubung dalam satu ruang.</p><form class="pl-public-search" action="#/search"><span>⌕</span><input aria-label="Cari di Pluits" placeholder="Cari tempat, orang, produk, atau cerita…"><button type="submit">Cari</button></form><div class="pl-public-hero-links"><a href="#/places">Jelajahi direktori</a><a href="#/search">Temukan cerita <span>→</span></a></div></div>
   <div class="pl-public-hero-visual"><img src="${image('photo-1518837695005-2083093ee35b')}" alt="Pemandangan pantai dan laut" fetchpriority="high"><div class="pl-public-hero-note"><b>Lebih dari sekadar sosial.</b><span>Orang · Tempat · Pengalaman · Usaha</span></div></div>
  </section>
  <section class="pl-public-section pl-public-discover"><div class="pl-public-section-head"><div><span class="pl-public-eyebrow">JELAJAHI PLUITS</span><h2>Ada banyak hal untuk ditemukan.</h2><p>Mulai dari tempat terdekat hingga pengalaman baru.</p></div><a href="#/places">Buka direktori →</a></div>
   <div class="pl-public-category-grid">${destinations.map(([label,id,desc])=>`<a class="pl-public-category" href="#/places"><img src="${image(id)}" alt="" loading="lazy"><span class="pl-public-category-shade"></span><span class="pl-public-category-copy"><b>${label}</b><small>${desc}</small></span></a>`).join('')}</div>
  </section>
  <section class="pl-public-section pl-public-nearby"><div class="pl-public-section-head"><div><span class="pl-public-eyebrow">GEO DIRECTORY</span><h2>Temukan yang dekat denganmu.</h2><p>Tempat, restoran, fasilitas umum, dan penyedia layanan.</p></div><a href="#/places">Lihat semua tempat →</a></div>${homeNearbySection()}</section>
  <section class="pl-public-section pl-public-stories"><div class="pl-public-section-head"><div><span class="pl-public-eyebrow">KONTEN KOMUNITAS</span><h2>Cerita dari berbagai sudut pandang.</h2><p>Foto, tulisan, video, dan pengalaman yang dibagikan komunitas.</p></div><a href="#/search">Jelajahi konten →</a></div><div class="pl-public-story-feature"><img src="${image('photo-1470252649378-9c29740c9fa8')}" alt="Pemandangan alam saat matahari terbit" loading="lazy"><div><span class="pl-public-eyebrow">STORY · POST · REEL</span><h3>Temukan inspirasi dari pengalaman nyata.</h3><p>Jelajahi konten publik sekarang. Bergabunglah untuk berbagi cerita dan berinteraksi.</p><a href="#/search">Mulai menjelajah →</a></div></div><div id="pl-public-feed"><div class="pl-feed-loading">Memuat postingan publik…</div></div></section>
  <section class="pl-public-section pl-public-market"><div class="pl-public-section-head"><div><span class="pl-public-eyebrow">LOCAL COMMERCE</span><h2>Usaha dan layanan dalam satu ekosistem.</h2><p>Kenali penyedia, lihat produk, dan temukan layanan yang kamu butuhkan.</p></div><a href="#/marketplace">Jelajahi marketplace →</a></div><div class="pl-public-market-grid"><a href="#/marketplace"><img src="${image('photo-1542838132-92c53300491e')}" alt="Produk bahan pangan segar" loading="lazy"><b>Toko & produk</b><small>Temukan produk dari berbagai usaha.</small></a><a href="#/places"><img src="${image('photo-1552566626-52f8b828add9')}" alt="Interior restoran" loading="lazy"><b>Restoran & kafe</b><small>Kenali tempat dan pengalaman kuliner.</small></a><a href="#/places"><img src="${image('photo-1530789253388-582c481c54b0')}" alt="Perjalanan dan destinasi" loading="lazy"><b>Transportasi & trip</b><small>Jelajahi perjalanan dan aktivitas.</small></a><a href="#/places"><img src="${image('photo-1521737711867-e3b97375f902')}" alt="Tim profesional bekerja" loading="lazy"><b>Jasa profesional</b><small>Temukan keahlian dan layanan.</small></a></div></section>
  <section class="pl-public-join"><div><span class="pl-public-eyebrow">JADILAH BAGIAN DARI PLUITS</span><h2>Punya cerita, tempat, atau usaha untuk dibagikan?</h2><p>Buat akun gratis dan mulai membangun kehadiranmu di PLUITS.</p></div><a href="#/account/register">Daftar gratis <span>→</span></a></section>
 </main><footer class="pl-social-footer">PLUITS INDONESIA · Social · Local Commerce · Discovery</footer>
 ${renderSocialMobileNav({active:'home',publicHome:true})}</div>`;
}
export async function bindHome(){
 const guestMode=(location.hash||'').startsWith('#/guest');
 const target=document.querySelector('#pl-public-feed');if(!target)return;
 bindHomeNearby();
 try{
  const {data:{user:actualViewer}}=await db.auth.getUser();
  const viewer=guestMode?null:actualViewer;
  // Authenticated users must use the canonical interactive feed, not the guest-only duplicate.
  if(viewer){history.replaceState(null,'',location.pathname+location.search+'#/account/explore');const {mountUserAccount}=await import('../account/index.js');await mountUserAccount('explore');return;}
  const headerActions=document.querySelector('.pl-social-header-actions');
  if(viewer&&!guestMode&&headerActions){
   const {data:me}=await db.from('user_profiles').select('display_name,username,avatar_path').eq('id',viewer.id).maybeSingle();
   const photo=await mediaUrl(me?.avatar_path);
   const label=safe(me?.display_name||viewer.email||'Profil');
   headerActions.innerHTML='<a class="pl-header-profile" href="#/account/profile" aria-label="Buka profil saya">' +(photo?'<img src="'+photo+'" alt="">':'<b>'+label.slice(0,1).toUpperCase()+'</b>')+'</a><a href="#/account/activity" aria-label="Aktivitas">♡</a><a class="pl-social-signup" href="#/account/settings">Pengaturan</a>';
  }

  const {data:rows,error}=await db.from('user_posts').select('id,user_id,caption,media_path,media_type,tags,created_at,profile_context,professional_profile_id,business_store_id').eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(30);
  if(error)throw error;
  if(!rows?.length){target.innerHTML='<div class="pl-feed-empty"><div>▧</div><h3>Pluits sedang membuka ruang untuk cerita pertamamu</h3><p>Di sini kamu akan menemukan foto, video, cerita, dan pengalaman dari komunitas. Jelajahi Pluits sebagai pengunjung, lalu buat akun jika ingin ikut berbagi dan berinteraksi.</p><a href="#/account/register">Buat akun Pluits</a></div>';return;}
  const ids=[...new Set(rows.map(x=>x.user_id))];
  const proIds=[...new Set(rows.map(x=>x.professional_profile_id).filter(Boolean))],storeIds=[...new Set(rows.map(x=>x.business_store_id).filter(Boolean))];
  const postIds=rows.map(p=>p.id);
  const [profiles,pros,stores,likes,saves]=await Promise.all([
   db.from('user_profiles').select('id,display_name,username,avatar_path,public_city,public_province,visibility').in('id',ids),
   proIds.length?db.from('professional_profiles').select('id,display_name,username,service_city,service_province').in('id',proIds):Promise.resolve({data:[]}),
   storeIds.length?db.rpc('get_public_business_profiles',{p_ids:storeIds}):Promise.resolve({data:[]}),
   viewer?db.from('post_likes').select('post_id,user_id').in('post_id',postIds):Promise.resolve({data:[]}),
   viewer?db.from('post_saves').select('post_id,user_id').in('post_id',postIds).eq('user_id',viewer.id):Promise.resolve({data:[]})
  ]);
  const queryError=profiles.error||pros.error||stores.error||likes.error||saves.error;
  if(queryError)throw queryError;
  const likeRows=likes.data||[],savedIds=new Set((saves.data||[]).map(x=>x.post_id));
  const pmap=new Map((profiles.data||[]).map(p=>[p.id,p])),promap=new Map((pros.data||[]).map(p=>[p.id,p])),smap=new Map((stores.data||[]).map(p=>[p.id,p]));
  const mediaUrls=await createSignedUrlMap(db.storage,'pluits-user-media',[...(profiles.data||[]).map(p=>p.avatar_path),...rows.map(p=>p.media_path)].filter(Boolean),1800);
  const cards=await Promise.all(rows.map(async post=>{
   const personal=pmap.get(post.user_id)||{display_name:'Pengguna Pluits',username:'pengguna'};
   if(post.profile_context==='personal'&&personal.visibility==='private')return '';
   const author=post.profile_context==='business'?(smap.get(post.business_store_id)||personal):post.profile_context==='professional'?(promap.get(post.professional_profile_id)||personal):personal;
   const name=author.name||author.display_name||'Pengguna Pluits',handle=author.username||'pengguna';
   const city=author.public_city||author.service_city||'',province=author.public_province||author.service_province||'';
   const avatar=mediaUrls.get(personal.avatar_path)||'',media=post.media_path?(mediaUrls.get(post.media_path)||''):'';if(post.media_path&&!media)return '';
   const initials=safe((name||'P').slice(0,1).toUpperCase()),kind=post.profile_context==='business'?'Business':post.profile_context==='professional'?'Professional':'';
   return `<article class="pl-public-post"><div class="pl-public-post-head"><a class="pl-feed-author-avatar" href="#/account/user/${encodeURIComponent(handle)}">${avatar?`<img src="${avatar}" alt="">`:`<b>${initials}</b>`}</a><div><a class="pl-feed-author-name" href="#/account/user/${encodeURIComponent(handle)}"><strong>${safe(name)}</strong></a> ${kind?`<em class="pl-post-context">${kind}</em>`:'' }<small>@${safe(handle)}${city?' · '+safe(city)+(province?', '+safe(province):''):''}</small></div><time>${new Date(post.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</time></div>${post.caption?`<p>${safe(post.caption)}</p>`:''}${post.media_path?`<div class="pl-public-post-media">${post.media_type==='video'?`<video src="${media}" controls playsinline preload="metadata"></video>`:`<img src="${media}" alt="Postingan komunitas Pluits" loading="lazy">`}</div>`:'<div class="pl-public-text-post">PLUITS</div>'}${post.tags?.length?`<div class="pl-public-post-tags">${post.tags.map(t=>'#'+safe(t)).join(' ')}</div>`:''}<div class="pl-public-post-actions">${viewer?'<button type="button" data-home-action="like" data-post-id="'+post.id+'" data-liked="'+likeRows.some(x=>x.post_id===post.id&&x.user_id===viewer.id)+'">♥ <span>'+(likeRows.some(x=>x.post_id===post.id&&x.user_id===viewer.id)?'Disukai':'Suka')+'</span> <b>'+likeRows.filter(x=>x.post_id===post.id).length+'</b></button>':'<a href="#/account/post/'+post.id+'">♡ Suka</a>'}<a href="#/account/post/${post.id}">Komentar</a><button type="button" data-home-action="share" data-post-id="${post.id}">↗ Bagikan</button>${viewer?'<button type="button" data-home-action="save" data-post-id="'+post.id+'" data-saved="'+savedIds.has(post.id)+'">'+(savedIds.has(post.id)?'Tersimpan':'Simpan')+'</button>':'<a href="#/account/login">Simpan</a>'}</div></article>`;
  }));
  const visible=cards.filter(Boolean);target.innerHTML=visible.length?visible.join(''):'<div class="pl-feed-empty"><h3>Belum ada cerita publik untuk ditampilkan</h3><p>Feed ini akan menampilkan postingan publik komunitas Pluits. Kamu tetap bisa menjelajahi bagian lain tanpa mendaftar.</p><a href="#/account/register">Buat akun Pluits</a></div>';
  target.querySelectorAll('[data-home-action]').forEach(button=>button.addEventListener('click',async()=>{
   const action=button.dataset.homeAction,postId=button.dataset.postId;
   if(!viewer){location.hash='/account/login';return;}
   button.disabled=true;
   try{
    if(action==='like'){
     const liked=button.dataset.liked==='true';
     const result=liked?await db.from('post_likes').delete().eq('post_id',postId).eq('user_id',viewer.id):await db.from('post_likes').insert({post_id:postId,user_id:viewer.id});
     if(result.error)throw result.error;
     const count=Number(button.querySelector('b')?.textContent||0)+(liked?-1:1);
     button.dataset.liked=String(!liked);button.classList.toggle('is-liked',!liked);
     button.querySelector('span').textContent=liked?'Suka':'Disukai';
     if(button.querySelector('b'))button.querySelector('b').textContent=String(Math.max(0,count));
    }else if(action==='save'){
     const saved=button.dataset.saved==='true';
     const result=saved?await db.from('post_saves').delete().eq('post_id',postId).eq('user_id',viewer.id):await db.from('post_saves').insert({post_id:postId,user_id:viewer.id});
     if(result.error)throw result.error;
     button.dataset.saved=String(!saved);button.textContent=saved?'Simpan':'Tersimpan';
    }else if(action==='share'){
     const url=location.origin+location.pathname+'#/account/post/'+postId;
     if(navigator.share)await navigator.share({title:'Postingan Pluits',url});
     else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);button.textContent='Tautan disalin';}
     else location.hash='/account/post/'+postId;
    }
   }catch(error){window.alert(error.message||'Aksi belum berhasil.');}
   finally{button.disabled=false;}
  }));
 }catch(err){target.innerHTML='<div class="pl-feed-empty"><h3>Feed belum dapat dimuat</h3><p>Silakan muat ulang halaman beberapa saat lagi.</p><a href="#/account/explore">Buka Explore setelah masuk</a></div>';}
}