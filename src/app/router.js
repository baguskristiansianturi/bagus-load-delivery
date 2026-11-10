import {updateSEO} from '../pages/seo.js';

let routeVersion=0;

export async function route(homeFn){
 const version=++routeVersion;
 try{
  const raw=(location.hash||'#/').replace(/^#\/?/,'');
  const [path,q='']=raw.split('?');
  const s=path.split('/').filter(Boolean),r=s[0],v=s[1],p=new URLSearchParams(q);
  let h;

  if(!r||['home','feed','beranda'].includes(r)){
   const renderHome=homeFn||(await import('../pages/home/index.js')).home;
   h=renderHome();
  }
  else if(r.startsWith('@')){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka profil</span></div>';
   queueMicrotask(async()=>{
    if(version!==routeVersion)return;
    const {mountUserAccount}=await import('../pages/account/index.js');
    if(version===routeVersion)mountUserAccount('user',decodeURIComponent(r.slice(1)));
   });
  }
  else if(r==='places'){
   const mod=await import('../pages/directory/index.js');h=mod.directoryPage();queueMicrotask(()=>version===routeVersion&&mod.bindDirectoryPage());
  }
  else if(r==='marketplace'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketplacePage());
  }
  else if(r==='shop'){
   const mod=await import('../pages/marketplace/index.js');h=mod.storePage();queueMicrotask(()=>version===routeVersion&&mod.bindStorePage(v||''));
  }
  else if(r==='market-product'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketProductPage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketProductPage(v||''));
  }
  else if(r==='market-cart'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketCartPage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketCartPage());
  }
  else if(r==='market-checkout'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketCheckoutPage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketCheckoutPage());
  }
  else if(r==='cart'){location.hash='#/market-cart';return;}
  else if(r==='checkout'){location.hash='#/market-checkout';return;}
  else if(r==='orders'){location.hash='#/market-orders';return;}
  else if(r==='order'){location.hash='#/market-order/'+encodeURIComponent(v||'');return;}
  else if(r==='market-orders'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketOrdersPage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketOrdersPage());
  }
  else if(r==='market-order'){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketOrderPage(v||'');queueMicrotask(()=>version===routeVersion&&mod.bindMarketOrderPage(v||''));
  }
  else if(r==='trip'){
   const mod=await import('../pages/trip/index.js');
   h=s[1]==='itinerary'?mod.tripItineraryPage(s[2]||''):mod.tripPage();
   queueMicrotask(()=>{if(version===routeVersion){if(s[1]==='itinerary')mod.bindTripItineraryPage(s[2]||'');else mod.bindTripPage();}});
  }
  else if(r==='messages'){
   // Legacy deep links are normalized to the public Inbox route.
   location.hash='#/inbox';return;
  }
  else if(r==='inbox'&&v==='settings'){
   const mod=await import('../pages/messages/settings.js');h=mod.messageSettingsPage();queueMicrotask(()=>version===routeVersion&&mod.bindMessageSettingsPage());
  }
  else if(r==='inbox'){
   const mod=await import('../pages/messages/index.js');h=mod.messagesPage();queueMicrotask(()=>version===routeVersion&&mod.bindMessagesPage());
  }
  else if(r==='admin'&&v==='moderation'){
   const mod=await import('../pages/admin/moderation.js');h=mod.moderationPage();queueMicrotask(()=>version===routeVersion&&mod.bindModerationPage());
  }
  else if(r==='place'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka tempat</span></div>';
   queueMicrotask(async()=>{
    const mod=await import('../pages/directory/index.js');
    const content=s[2]==='claim'?await mod.claimPage(v||''):await mod.placePage(v||'');
    const app=document.querySelector('#app');
    if(app&&version===routeVersion){app.classList.remove('pl-page-enter');app.innerHTML=content;mod.bindPlacePage();requestAnimationFrame(()=>app.classList.add('pl-page-enter'));}
   });
  }
  else if(r==='search'){
   const mod=await import('../pages/search/discovery.js');h=mod.discoverySearch(p.get('q')||'');queueMicrotask(()=>version===routeVersion&&mod.bindDiscoverySearch());
  }
  else if(['material','materials'].includes(r)){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketplacePage());
  }
  else if(['provider','suppliers','jasa'].includes(r)){
   const mod=await import('../pages/directory/index.js');h=mod.directoryPage();queueMicrotask(()=>version===routeVersion&&mod.bindDirectoryPage());
  }
  else if(['logistik','delivery'].includes(r)){
   const mod=await import('../pages/marketplace/index.js');h=mod.marketplacePage();queueMicrotask(()=>version===routeVersion&&mod.bindMarketplacePage());
  }
  else if(['login','register'].includes(r)){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';
   queueMicrotask(async()=>{if(version!==routeVersion)return;const {mountUserAccount}=await import('../pages/account/index.js');if(version===routeVersion)mountUserAccount(r);});
  }
  else if(['blog','guides','article'].includes(r)){
   const mod=await import('../pages/blog/index.js');h=mod.blog(['article','guides'].includes(r)?v:'');
  }
  else if(['help','faq'].includes(r)){
   const mod=await import('../pages/help/index.js');h=mod.helpPage(p.get('topic')||'');queueMicrotask(()=>version===routeVersion&&mod.bindHelpPage());
  }
  else if(['terms','privacy','guidelines'].includes(r)){
   const mod=await import('../pages/help/index.js');h=mod.legalPage(r);
  }
  else if(['promo','about','contact','reviews','recent'].includes(r)){
   const mod=await import('../pages/misc/index.js');h=mod.misc(r);
  }
  else if(r==='account'&&v==='settings'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan pengaturan</span></div>';
   queueMicrotask(async()=>{if(version!==routeVersion)return;const {mountUserAccount}=await import('../pages/account/index.js');if(version===routeVersion)mountUserAccount('settings');});
  }
  else if(r==='account'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';
   queueMicrotask(async()=>{if(version!==routeVersion)return;const {mountUserAccount}=await import('../pages/account/index.js');if(version===routeVersion)mountUserAccount(v||'explore',s[2]||'');});
  }
  else if(r==='seller'){
   h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan Seller Center</span></div>';
   queueMicrotask(async()=>{if(version!==routeVersion)return;const {sellerPage}=await import('../pages/seller/index.js');if(version===routeVersion)sellerPage();});
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
  if(app)app.innerHTML='<section class="pl-page-loading" role="alert"><strong>Halaman belum dapat dimuat.</strong><p>Periksa koneksi internet lalu coba buka kembali.</p><a class="primary-button" href="#/">Kembali ke beranda</a></section>';
 }
}
