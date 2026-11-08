import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {renderSocialHeader,renderSocialMobileNav} from '../../components/social/navigation.js';
import {homeNearbySection,bindHomeNearby} from '../directory/index.js';
const db=createClient('https://ytndswhqxayqpftszwfh.supabase.co','sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const safe=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
async function mediaUrl(path){if(!path)return '';const {data}=await db.storage.from('pluits-user-media').createSignedUrl(path,1800);return data?.signedUrl||'';}
export function home(){return `<div class="pl-social-home">${renderSocialHeader({active:'home',publicHome:true})}<main class="pl-social-layout"><aside class="pl-social-sidebar"><a class="active" href="#/">⌂ <span>Beranda</span></a><a href="#/places">⌖ <span>Direktori</span></a><a href="#/marketplace">▦ <span>Marketplace</span></a><a href="#/account/explore">⌕ <span>Explore</span></a><a href="#/trip">✦ <span>Trip</span></a><a href="#/account/compose">＋ <span>Buat postingan</span></a><a href="#/account/explore">♡ <span>Aktivitas</span></a><a href="#/account/profile">◎ <span>Profil</span></a><div class="pl-side-market"><small>PLUITS MARKETPLACE</small><strong>Temukan usaha dan layanan lokal</strong><p>Jelajahi toko, layanan, cerita komunitas, dan pengalaman dari berbagai tempat.</p><a href="#/marketplace">Jelajahi marketplace →</a></div></aside><section class="pl-social-feed"><div class="pl-feed-intro"><div><small>PLUITS COMMUNITY</small><h1>Beranda</h1><p>Lihat cerita, foto, video, dan pengalaman komunitas Pluits. Jelajahi dulu tanpa harus masuk.</p></div><a href="#/account/compose">＋ Bagikan cerita</a></div><div class="pl-feed-stories"><a href="#/account/compose"><b>＋</b><span>Tambahkan cerita</span></a><a href="#/account/explore"><b>▣</b><span>Jelajahi komunitas</span></a><a href="#/marketplace"><b>▦</b><span>Marketplace</span></a></div><section class="pl-home-shortcuts" aria-label="Jelajahi Pluits">
 <a href="#/marketplace"><b>▦</b><span>Semua toko</span></a><a href="#/marketplace"><b>⌕</b><span>Produk</span></a><a href="#/jasa"><b>✦</b><span>Jasa</span></a><a href="#/provider"><b>▤</b><span>Penyedia</span></a><a href="#/logistik"><b>↗</b><span>Pengiriman</span></a><a href="#/trip"><b>✦</b><span>Trip</span></a>
 </section>${homeNearbySection()}<div id="pl-public-feed"><div class="pl-feed-loading">Memuat cerita komunitas…</div></div></section><aside class="pl-social-right"><div class="pl-right-card"><small>JELAJAHI PLUITS</small><h3>Marketplace</h3><p>Temukan produk dan kebutuhan lokal dari penyedia di wilayah layanan mereka.</p><a href="#/marketplace">Buka marketplace →</a><div class="pl-right-links"><a href="#/marketplace">Toko & produk</a><a href="#/jasa">Jasa & layanan</a><a href="#/provider">Usaha & penyedia</a><a href="#/logistik">Pengiriman lokal</a></div></div><div class="pl-right-card pl-community-card"><small>GABUNG KOMUNITAS</small><h3>Punya cerita untuk dibagikan?</h3><p>Buat akun Pluits untuk memposting foto, video, dan berinteraksi dengan pengguna lain.</p><a href="#/account/register">Buat akun gratis →</a></div></aside></main><footer class="pl-social-footer">PLUITS INDONESIA · Social experience, local commerce & trip</footer>${renderSocialMobileNav({active:'home',publicHome:true})}</div>`;}
export async function bindHome(){
 const target=document.querySelector('#pl-public-feed');if(!target)return;
 bindHomeNearby();
 try{
  const {data:{user:viewer}}=await db.auth.getUser();
  const headerActions=document.querySelector('.pl-social-header>div');
  if(viewer&&headerActions){
   const {data:me}=await db.from('user_profiles').select('display_name,username,avatar_path').eq('id',viewer.id).maybeSingle();
   const photo=await mediaUrl(me?.avatar_path);
   const label=safe(me?.display_name||viewer.email||'Profil');
   headerActions.innerHTML='<a class="pl-header-profile" href="#/account/profile" aria-label="Buka profil saya">' +(photo?'<img src="'+photo+'" alt="">':'<b>'+label.slice(0,1).toUpperCase()+'</b>')+'</a><a href="#/account/activity" aria-label="Aktivitas">♡</a><a class="pl-social-signup" href="#/account/settings">Pengaturan</a>';
  }

  const {data:rows,error}=await db.from('user_posts').select('id,user_id,caption,media_path,media_type,tags,created_at,profile_context,professional_profile_id,business_store_id').eq('visibility','public').order('created_at',{ascending:false}).limit(30);
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
  const likeRows=likes.data||[],savedIds=new Set((saves.data||[]).map(x=>x.post_id));
  const pmap=new Map((profiles.data||[]).map(p=>[p.id,p])),promap=new Map((pros.data||[]).map(p=>[p.id,p])),smap=new Map((stores.data||[]).map(p=>[p.id,p]));
  const cards=await Promise.all(rows.map(async post=>{
   const personal=pmap.get(post.user_id)||{display_name:'Pengguna Pluits',username:'pengguna'};
   if(post.profile_context==='personal'&&personal.visibility==='private')return '';
   const author=post.profile_context==='business'?(smap.get(post.business_store_id)||personal):post.profile_context==='professional'?(promap.get(post.professional_profile_id)||personal):personal;
   const name=author.name||author.display_name||'Pengguna Pluits',handle=author.username||'pengguna';
   const city=author.public_city||author.service_city||'',province=author.public_province||author.service_province||'';
   const [avatar,media]=await Promise.all([mediaUrl(personal.avatar_path),post.media_path?mediaUrl(post.media_path):Promise.resolve('')]);if(post.media_path&&!media)return '';
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