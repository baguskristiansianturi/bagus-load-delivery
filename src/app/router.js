import {updateSEO} from '../pages/seo.js';

let routeVersion=0;

function showRouteFailure(error, version, retry) {
 if(version!==routeVersion)return;
 const app=document.querySelector('#app');
 if(!app)return;
 app.innerHTML='<section class="pl-page-loading" role="alert"><strong>Halaman belum dapat dimuat.</strong><p data-route-error></p><button class="primary-button" type="button" data-route-retry>Coba muat lagi</button><a class="primary-button" href="#/">Kembali ke beranda</a></section>';
 const detail=app.querySelector('[data-route-error]');
 if(detail)detail.textContent=String(error?.message||error||'Kesalahan tidak diketahui');
 app.querySelector('[data-route-retry]')?.addEventListener('click',retry);
}
function defer(task, version, retry) {
 queueMicrotask(async()=>{
  if(version!==routeVersion)return;
  try { await task(); }
  catch(error) { showRouteFailure(error,version,retry); }
 });
}

export async function route(homeFn){
 const version=++routeVersion;
 window.__pluitsRouteVersion=version;
 try{
  const raw=(location.hash||'#/').replace(/^#\/?/,'');
  const [path,q='']=raw.split('?');
  const s=path.split('/').filter(Boolean),r=s[0],v=s[1],p=new URLSearchParams(q);
  let h;

  if(!r||['home','feed','beranda','guest'].includes(r)){
   const renderHome=homeFn||(await import('../pages/home/index.js')).home;
   h=renderHome();
  }
  else if(r.startsWith('@') && s[1]==='blog'){
   h='<div class="pl-page-loading" role="status">Membuka Blog…</div>';
   defer(async()=>{const mod=await import('../pages/blog-studio/index.js');await mod.mountPublicBlog(decodeURIComponent(r.slice(1)),decodeURIComponent(s[2]||''),decodeURIComponent(s[3]||''));},version,()=>route(homeFn));
  }
  else if(r.startsWith('@')){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka profil</span></div>';
   defer(async()=>{const {mountUserAccount}=await import('../pages/account/index.js');await mountUserAccount('user',decodeURIComponent(r.slice(1)));},version,()=>route(homeFn));
  }
  else if(r==='places'){
   const mod=await import('../pages/directory/index.js');h=mod.directoryPage();defer(()=>mod.bindDirectoryPage(),version,()=>route(homeFn));
  }
  else if(r==='marketplace'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();defer(()=>mod.bindMarketplacePage(),version,()=>route(homeFn));
  }
  else if(r==='shop'){
   const mod=await import('../pages/marketplace/index.js');h=mod.storePage();defer(()=>mod.bindStorePage(v||''),version,()=>route(homeFn));
  }
  else if(r==='market-product'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketProductPage();defer(()=>mod.bindMarketProductPage(v||''),version,()=>route(homeFn));
  }
  else if(r==='market-cart'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketCartPage();defer(()=>mod.bindMarketCartPage(),version,()=>route(homeFn));
  }
  else if(r==='market-checkout'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketCheckoutPage();defer(()=>mod.bindMarketCheckoutPage(),version,()=>route(homeFn));
  }
  else if(r==='cart'){location.hash='#/market-cart';return;}
  else if(r==='checkout'){location.hash='#/market-checkout';return;}
  else if(r==='orders'){location.hash='#/market-orders';return;}
  else if(r==='order'){location.hash='#/market-order/'+encodeURIComponent(v||'');return;}
  else if(r==='market-orders'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketOrdersPage();defer(()=>mod.bindMarketOrdersPage(),version,()=>route(homeFn));
  }
  else if(r==='market-order'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketOrderPage(v||'');defer(()=>mod.bindMarketOrderPage(v||''),version,()=>route(homeFn));
  }
  else if(r==='trip'){
   const mod=await import('../pages/trip/index.js');
   h=s[1]==='itinerary'?mod.tripItineraryPage(s[2]||''):mod.tripPage();
   defer(()=>{if(s[1]==='itinerary')mod.bindTripItineraryPage(s[2]||'');else mod.bindTripPage();},version,()=>route(homeFn));
  }
  else if(r==='messages'){
   // Legacy deep links are normalized to the public Inbox route.
   location.hash='#/inbox';return;
  }
  else if(r==='inbox'&&v==='settings'){
   const mod=await import('../pages/messages/settings.js');h=mod.messageSettingsPage();defer(()=>mod.bindMessageSettingsPage(),version,()=>route(homeFn));
  }
  else if(r==='inbox'){
   const mod=await import('../pages/messages/index.js');h=mod.messagesPage();defer(()=>mod.bindMessagesPage(),version,()=>route(homeFn));
  }
  else if(r==='admin'&&v==='moderation'){
   const mod=await import('../pages/admin/moderation.js');h=mod.moderationPage();defer(()=>mod.bindModerationPage(),version,()=>route(homeFn));
  }
  else if(r==='place'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka tempat</span></div>';
   defer(async()=>{
    const mod=await import('../pages/directory/index.js');
    const content=s[2]==='claim'?await mod.claimPage(v||''):await mod.placePage(v||'');
    const app=document.querySelector('#app');
    if(app&&version===routeVersion){app.classList.remove('pl-page-enter');app.innerHTML=content;await mod.bindPlacePage();requestAnimationFrame(()=>app.classList.add('pl-page-enter'));}
   },version,()=>route(homeFn));
  }
  else if(r==='search'){
   const mod=await import('../pages/search/discovery.js');h=mod.discoverySearch(p.get('q')||'');defer(()=>mod.bindDiscoverySearch(),version,()=>route(homeFn));
  }
  else if(['material','materials'].includes(r)){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();defer(()=>mod.bindMarketplacePage(),version,()=>route(homeFn));
  }
  else if(['provider','suppliers','jasa'].includes(r)){
   const mod=await import('../pages/directory/index.js');h=mod.directoryPage();defer(()=>mod.bindDirectoryPage(),version,()=>route(homeFn));
  }
  else if(['logistik','delivery'].includes(r)){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();defer(()=>mod.bindMarketplacePage(),version,()=>route(homeFn));
  }
  else if(['login','register'].includes(r)){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';
   defer(async()=>{const {mountUserAccount}=await import('../pages/account/index.js');await mountUserAccount(r);},version,()=>route(homeFn));
  }
  else if(['blog','guides','article'].includes(r)){
   const mod=await import('../pages/blog/index.js');h=mod.blog(['article','guides'].includes(r)?v:'');
  }
  else if(['help','faq'].includes(r)){
   const mod=await import('../pages/help/index.js');h=mod.helpPage(p.get('topic')||'');defer(()=>mod.bindHelpPage(),version,()=>route(homeFn));
  }
  else if(['terms','privacy','guidelines'].includes(r)){
   const mod=await import('../pages/help/index.js');h=mod.legalPage(r);
  }
  else if(['promo','about','contact','reviews','recent'].includes(r)){
   const mod=await import('../pages/misc/index.js');h=mod.misc(r);
  }
  else if(r==='account'&&v==='settings'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan pengaturan</span></div>';
   defer(async()=>{const {mountUserAccount}=await import('../pages/account/index.js');await mountUserAccount('settings');},version,()=>route(homeFn));
  }
  else if(r==='account'&&v==='blog'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka Blog</span></div>';
   defer(async()=>{const mod=await import('../pages/blog-studio/index.js');await mod.mountBlogStudio();},version,()=>route(homeFn));
  }
  else if(r==='account'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';
   defer(async()=>{const {mountUserAccount}=await import('../pages/account/index.js');await mountUserAccount(v||'explore',s[2]||'');},version,()=>route(homeFn));
  }
  else if(r==='seller'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan Seller Center</span></div>';
   defer(async()=>{const {sellerPage}=await import('../pages/seller/index.js');sellerPage();},version,()=>route(homeFn));
  }
  else h='<div class="empty-state large"><h1>Halaman tidak ditemukan</h1><p>Rute belum tersedia pada frontend ini.</p><a class="primary-button" href="#/">Kembali ke beranda</a></div>';

  const app=document.querySelector('#app');
  if(!app||version!==routeVersion)return;
  app.classList.remove('pl-page-enter');app.innerHTML=h;requestAnimationFrame(()=>{if(version===routeVersion)app.classList.add('pl-page-enter');});
  updateSEO({title:document.querySelector('h1')?.textContent?document.querySelector('h1').textContent+' — Pluits Indonesia':'Pluits — Pluits Indonesia',description:'Jelajahi direktori tempat, layanan, komunitas, pengalaman, dan produk lokal di Pluits.',path:path});
  window.scrollTo(0,0);
 }catch(error){
  if(version!==routeVersion)return;
  console.error('Pluits route failed:',error);
  const app=document.querySelector('#app');
  showRouteFailure(error,version,()=>route(homeFn));
 }
}
