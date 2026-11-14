import { supabase as db } from '../../lib/supabase/client.js';
import { renderSocialMobileNav } from '../../components/social/navigation.js';
import '../../styles/social-navigation.css';
import './discovery.css';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let activeCategory='all',sortMode='trending',loading=false,requestVersion=0;
const slug=value=>String(value||'').toLowerCase().replace(/^#/,'').trim().replace(/\s+/g,'-');
const initials=value=>String(value||'P').trim().slice(0,1).toUpperCase();
const dateLabel=value=>{const date=new Date(value);return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(date):''};

export function discoverySearch(q=''){
 return `<div class="ds-page">
  <header class="ds-top">
   <a href="#/account/explore" aria-label="Kembali ke Circle">‹</a>
   <div class="ds-title"><strong>Jelajah</strong><small>Temukan apa yang sedang terjadi di PLUITS</small></div>
   <form id="ds-form" class="ds-search"><span>⌕</span><input id="ds-query" value="${esc(q)}" placeholder="Cari konten, orang, atau topik…" aria-label="Cari"><button aria-label="Cari">⌕</button></form>
  </header>
  <main class="ds-main">
   <section class="ds-intro"><h1>Jelajah</h1><p>Konten publik dari personal, kreator, pemilik usaha, penyedia layanan, komunitas, dan berbagai entitas.</p></section>
   <nav class="ds-sort" id="ds-sort" aria-label="Urutan konten"><button data-sort="trending" class="selected">Sedang populer</button><button data-sort="latest">Terbaru</button><button data-sort="random">Acak</button></nav>
   <nav class="ds-chips" id="ds-chips" aria-label="Kategori konten"><button data-cat="all" class="selected">Semua</button></nav>
   <section class="ds-feed-wrap"><div class="ds-feed" id="ds-feed" aria-label="Feed publik"></div><div class="ds-loading" id="ds-loading" role="status">Memuat konten publik…</div></section>
  </main>
  ${renderSocialMobileNav({active:'discover'})}
 </div>`;
}

async function feed(){
 if(loading)return;
 loading=true;
 const version=++requestVersion;
 const el=document.querySelector('#ds-feed'),status=document.querySelector('#ds-loading');
 if(!el){loading=false;return;}
 if(status)status.textContent='Memuat konten publik…';
 try{
  const [{data:authData},{data:rows,error:postError}]=await Promise.all([
   db.auth.getUser(),
   db.from('user_posts').select('*').eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(80)
  ]);
  if(postError)throw postError;
  const viewer=authData?.user||null;
  let blockedIds=[];
  if(viewer){
   const blocked=await db.from('user_blocks').select('blocker_id,blocked_id').or('blocker_id.eq.'+viewer.id+',blocked_id.eq.'+viewer.id);
   if(blocked.error)throw blocked.error;
   blockedIds=(blocked.data||[]).map(row=>row.blocker_id===viewer.id?row.blocked_id:row.blocker_id);
  }
  let candidates=(rows||[]).filter(post=>!blockedIds.includes(post.user_id));
  const term=(document.querySelector('#ds-query')?.value||'').trim().toLowerCase();
  if(term)candidates=candidates.filter(post=>(post.caption||'').toLowerCase().includes(term)||(post.tags||[]).some(tag=>String(tag).toLowerCase().includes(term)));
  if(activeCategory!=='all')candidates=candidates.filter(post=>(post.tags||[]).some(tag=>slug(tag)===activeCategory));
  const ids=candidates.map(post=>post.id),ownerIds=[...new Set(candidates.map(post=>post.user_id))];
  const [mediaResult,profileResult,likesResult,commentsResult]=await Promise.all([
   ids.length?db.from('post_media').select('post_id,media_path,media_type,position').in('post_id',ids).order('position',{ascending:true}):Promise.resolve({data:[],error:null}),
   ownerIds.length?db.from('user_profiles').select('id,display_name,username,avatar_path,visibility').in('id',ownerIds):Promise.resolve({data:[],error:null}),
   ids.length?db.from('post_likes').select('post_id').in('post_id',ids).limit(5000):Promise.resolve({data:[],error:null}),
   ids.length?db.from('post_comments').select('post_id').in('post_id',ids).limit(5000):Promise.resolve({data:[],error:null})
  ]);
  if(mediaResult.error||profileResult.error||likesResult.error||commentsResult.error)throw mediaResult.error||profileResult.error||likesResult.error||commentsResult.error;
  const profiles=new Map((profileResult.data||[]).filter(profile=>profile.visibility==='public').map(profile=>[profile.id,profile]));
  const mediaByPost=new Map();
  (mediaResult.data||[]).forEach(media=>{if(!mediaByPost.has(media.post_id))mediaByPost.set(media.post_id,[]);mediaByPost.get(media.post_id).push(media);});
  const likeCounts=new Map(),commentCounts=new Map();
  (likesResult.data||[]).forEach(row=>likeCounts.set(row.post_id,(likeCounts.get(row.post_id)||0)+1));
  (commentsResult.data||[]).forEach(row=>commentCounts.set(row.post_id,(commentCounts.get(row.post_id)||0)+1));
  const mediaPaths=[...new Set([...(mediaResult.data||[]).map(media=>media.media_path),...candidates.map(post=>post.media_path),...(profileResult.data||[]).map(profile=>profile.avatar_path)].filter(Boolean))];
  const signedResult=mediaPaths.length?await db.storage.from('pluits-user-media').createSignedUrls(mediaPaths,3600):{data:[]};
  const signedUrls=new Map((signedResult.data||[]).map(item=>[item.path,item.signedUrl]));
  let hydrated=candidates.filter(post=>profiles.has(post.user_id)).map(post=>{
   const gallery=mediaByPost.get(post.id)||[];
   const media=gallery.length?gallery.map(item=>({...item,url:signedUrls.get(item.media_path)||''})).filter(item=>item.url):(post.media_path?[{media_path:post.media_path,media_type:post.media_type,url:signedUrls.get(post.media_path)||''}].filter(item=>item.url):[]);
   const owner=profiles.get(post.user_id);
   return {...post,owner,media,avatarUrl:signedUrls.get(owner.avatar_path)||'',likes:likeCounts.get(post.id)||0,comments:commentCounts.get(post.id)||0};
  });
  const topics=[...new Map(hydrated.flatMap(post=>(post.tags||[]).map(tag=>{const key=slug(tag);return key?[[key,key.replace(/-/g,' ').replace(/\b\w/g,char=>char.toUpperCase())]]:[];})).map(([key,label])=>[key,label])).entries()].slice(0,12);
  const chips=[['all','Semua'],...topics];
  const chipRoot=document.querySelector('#ds-chips');
  if(chipRoot)chipRoot.innerHTML=chips.map(([key,label])=>'<button type="button" data-cat="'+esc(key)+'" class="'+(activeCategory===key?'selected':'')+'">'+esc(label)+'</button>').join('');
  const now=Date.now();
  if(sortMode==='latest')hydrated.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  else if(sortMode==='random')hydrated.sort(()=>Math.random()-.5);
  else hydrated.sort((a,b)=>{
   const score=post=>{const age=Math.max(0,(now-new Date(post.created_at).getTime())/3600000);return Math.min(80,post.likes*2+post.comments*3)+28*Math.exp(-age/36);};
   return score(b)-score(a)||new Date(b.created_at)-new Date(a.created_at);
  });
  if(version!==requestVersion)return;
  const cards=hydrated.map(post=>{
   const media=post.media[0],owner=post.owner,name=esc(owner.display_name||'Pengguna PLUITS');
   const avatar=post.avatarUrl?'<img src="'+esc(post.avatarUrl)+'" alt="" loading="lazy">':'<b>'+esc(initials(owner.display_name))+'</b>';
   const mediaMarkup=media?(media.media_type==='video'?'<video class="ds-tile-video" src="'+esc(media.url)+'" muted playsinline preload="auto" aria-label="Pratinjau Reel"></video><span class="ds-tile-play" aria-hidden="true">▶</span>':'<img src="'+esc(media.url)+'" loading="lazy" alt="Pratinjau postingan">'):'<span class="ds-text-tile">'+esc((post.caption||'PLUITS').slice(0,110))+'</span>';
   const context=post.profile_context==='business'?'Bisnis':post.profile_context==='professional'?'Profesional':'';
   const target=post.content_kind==='reel'?'#/account/reels/'+encodeURIComponent(post.id):'#/account/post/'+encodeURIComponent(post.id);
   return '<article class="ds-grid-tile'+(media?.media_type==='video'?' is-video':'')+(post.content_kind==='reel'?' is-reel':'')+'"><a class="ds-tile-link" href="'+target+'" aria-label="'+(post.content_kind==='reel'?'Tonton Reel':'Buka postingan')+' dari '+name+'"><div class="ds-tile-media">'+mediaMarkup+'</div><div class="ds-tile-overlay"><span class="ds-tile-author">'+avatar+'</span><span class="ds-tile-stats">♡ '+post.likes+'　◯ '+post.comments+'</span></div>'+(post.content_kind==='reel'?'<span class="ds-tile-reel-mark" aria-label="Reel">▶</span>':'')+(context?'<span class="ds-tile-context">'+context+'</span>':'')+'</a></article>';
  }).join('');
  el.innerHTML=cards||'';
  // Decode only visible Reel tiles; use the first decoded frame as an in-memory cover.
  const tileVideos=[...el.querySelectorAll('.ds-tile-video')];
  if('IntersectionObserver'in window){
   const covers=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const video=entry.target;covers.unobserve(video);video.preload='auto';
    video.addEventListener('loadeddata',()=>{
     try{
      if(video.videoWidth&&video.videoHeight){
       const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;
       const context=canvas.getContext('2d');context.drawImage(video,0,0,canvas.width,canvas.height);
       video.poster=canvas.toDataURL('image/jpeg',.82);
      }
     }catch(error){console.debug('PLUITS Reel tile cover frame unavailable',error);}
     video.pause();
    },{once:true});
   }),{rootMargin:'240px 0px',threshold:.01});
   tileVideos.forEach(video=>covers.observe(video));
  }else tileVideos.slice(0,6).forEach(video=>{video.preload='auto';});
  if(status)status.textContent=cards?'':'Belum ada konten publik yang cocok. Coba kategori atau kata kunci lain.';
 }catch(error){
  if(status)status.textContent='Jelajah belum dapat dimuat. Periksa koneksi lalu coba lagi.';
  console.warn('PLUITS public discovery feed',error);
 }finally{if(version===requestVersion)loading=false;}
}

export function bindDiscoverySearch(){
 document.querySelector('#ds-form')?.addEventListener('submit',event=>{event.preventDefault();feed();});
 document.querySelector('#ds-sort')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-sort]');if(!button)return;
  sortMode=button.dataset.sort;
  document.querySelectorAll('#ds-sort [data-sort]').forEach(item=>item.classList.toggle('selected',item===button));
  feed();
 });
 document.querySelector('#ds-chips')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-cat]');if(!button)return;
  activeCategory=button.dataset.cat;
  document.querySelectorAll('#ds-chips [data-cat]').forEach(item=>item.classList.toggle('selected',item===button));
  feed();
 });
 const refresh=()=>{const el=document.querySelector('#ds-feed');if(el)el.innerHTML='';loading=false;feed();};
 let y=0;
 document.querySelector('.ds-page')?.addEventListener('touchstart',event=>{if(window.scrollY===0)y=event.touches[0].clientY;},{passive:true});
 document.querySelector('.ds-page')?.addEventListener('touchend',event=>{if(y&&event.changedTouches[0].clientY-y>75&&window.scrollY===0)refresh();y=0;},{passive:true});
 feed();
}
