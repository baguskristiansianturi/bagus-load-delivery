import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {renderSocialHeader,renderSocialMobileNav} from '../../components/social/navigation.js';
import {ROUTES} from '../../components/social/navigation-routes.js';
import {homeNearbySection,bindHomeNearby} from '../directory/index.js';
import {createSignedUrlMap} from '../../services/storage/signed-urls.js';
import {renderAppDownload} from '../../features/app-download/app-download.js';
import {renderPublicHero} from '../../features/public-home/hero.js';
import {renderPublicDiscovery} from '../../features/public-home/discovery.js';
import {renderPublicNearby} from '../../features/public-home/nearby.js';
import {renderPublicStories} from '../../features/public-home/stories.js';
import {renderPublicMarketplace} from '../../features/public-home/marketplace.js';
import {renderPublicJoin} from '../../features/public-home/join.js';
import {renderPublicFooter} from '../../features/public-home/footer.js';
const db=createClient('https://ytndswhqxayqpftszwfh.supabase.co','sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const safe=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function home(){
 const guestMode=(location.hash||'').startsWith('#/guest');
 const image=(id)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=900&q=82';
 return `<div class="pl-social-home pl-public-home">
 ${renderSocialHeader({active:'home',publicHome:true})}
 <main class="pl-public-shell">
  ${renderPublicHero(image)}
  ${renderPublicDiscovery(image)}
  ${renderPublicNearby(homeNearbySection())}
  ${renderPublicStories(image)}
  ${renderPublicMarketplace(image)}
  ${renderPublicJoin()}
  ${renderAppDownload()}
 </main>${renderPublicFooter()}
 ${renderSocialMobileNav({active:'home',publicHome:true})}</div>`;
}
export async function bindHome(){
 const requestHash=location.hash||'#/';
 const routeVersion=window.__pluitsRouteVersion||0;
 const stillOnRequestedHome=()=>((location.hash||'#/')===requestHash)&&((window.__pluitsRouteVersion||0)===routeVersion);
 const guestMode=requestHash.startsWith('#/guest');
 const target=document.querySelector('#pl-public-feed');if(!target||!stillOnRequestedHome())return;
 try{
  const {data:{user:actualViewer}}=await db.auth.getUser();
  if(!stillOnRequestedHome())return;
  if(actualViewer&&!guestMode){
   // The root URL is the guest landing page; signed-in visitors continue to the canonical Explore workspace.
   if(stillOnRequestedHome())location.hash='#/account/explore';
   return;
  }
  bindHomeNearby({personalize:false});

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