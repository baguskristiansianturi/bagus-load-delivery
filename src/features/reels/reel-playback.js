export function bindReelsPlayback(){
 const feed=document.querySelector('.ua-reels-feed');if(!feed)return;
 const searchForm=document.querySelector('[data-reel-search-form]');
 const searchInput=searchForm?.querySelector('input[name="query"]');
 const applyReelSearch=()=>{
  const query=String(searchInput?.value||'').trim().toLocaleLowerCase('id');
  const cards=[...feed.querySelectorAll('[data-reel-post-id]')];
  let visible=0;
  cards.forEach(card=>{
   const matches=!query||card.textContent.toLocaleLowerCase('id').includes(query);
   card.hidden=!matches;if(matches)visible++;
  });
  let empty=feed.querySelector('.ua-reel-search-empty');
  if(!visible&&query){
   if(!empty){empty=document.createElement('div');empty.className='ua-reel-search-empty';empty.setAttribute('role','status');feed.append(empty);}
   empty.textContent='Belum ada video, orang, atau topik yang cocok. Coba kata kunci lain.';
  }else empty?.remove();
  feed.scrollTo({top:0,behavior:'smooth'});
 };
 searchForm?.addEventListener('submit',event=>{event.preventDefault();applyReelSearch();});
 searchForm?.addEventListener('reset',()=>{requestAnimationFrame(()=>{applyReelSearch();searchInput?.focus();});});
 searchInput?.addEventListener('input',applyReelSearch);
 feed.querySelectorAll('[data-reel-toggle]').forEach(button=>button.addEventListener('click',()=>{
  const video=button.closest('.ua-reel-stage')?.querySelector('[data-reel-video]');if(!video)return;
  if(video.paused)video.play().catch(()=>{});else video.pause();
 }));
 feed.querySelectorAll('[data-reel-sound]').forEach(button=>button.addEventListener('click',()=>{
  const video=button.closest('.ua-reel-stage')?.querySelector('[data-reel-video]');if(!video)return;
  ensureReelSource(video);
  video.muted=!video.muted;button.textContent=video.muted?'Suara mati':'Suara aktif';button.setAttribute('aria-label',video.muted?'Aktifkan suara':'Matikan suara');
 }));
 const ensureReelSource=video=>{
  if(!video||video.src||!video.dataset.reelSrc)return;
  video.src=video.dataset.reelSrc;video.load();
 };
 feed.querySelectorAll('[data-reel-video]').forEach(video=>{
  video.addEventListener('click',()=>{ensureReelSource(video);if(video.paused)video.play().catch(()=>{});else video.pause();});
  video.addEventListener('play',()=>{const button=video.closest('.ua-reel-stage')?.querySelector('[data-reel-toggle]');if(button){button.textContent='Ⅱ';button.setAttribute('aria-label','Jeda video');}});
  video.addEventListener('pause',()=>{const button=video.closest('.ua-reel-stage')?.querySelector('[data-reel-toggle]');if(button){button.textContent='▶';button.setAttribute('aria-label','Putar video');}});
 });
 const videos=[...feed.querySelectorAll('[data-reel-video]')];let active=null;
 const activate=video=>{ensureReelSource(video);video.muted=true;video.loop=true;video.playsInline=true;video.play().catch(()=>{});};
 if(!('IntersectionObserver'in window)){
  if(videos[0])activate(videos[0]);
 }else{
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
   const video=entry.target;
   if(entry.isIntersecting&&entry.intersectionRatio>=.72){
    if(active&&active!==video)active.pause();active=video;activate(video);
   }else if(entry.intersectionRatio<.25){video.pause();if(active===video)active=null;}
  }),{threshold:[0,.25,.72,1]});
  videos.forEach(video=>io.observe(video));
 }
}
