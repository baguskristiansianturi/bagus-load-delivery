import {discoverySearch,bindDiscoverySearch} from '../pages/search/discovery.js';
import {misc} from '../pages/misc/index.js';
import {helpPage,bindHelpPage,legalPage} from '../pages/help/index.js';
import {blog} from '../pages/blog/index.js';
import {home} from '../pages/home/index.js';
import {sellerPage} from '../pages/seller/index.js';
import {mountUserAccount} from '../pages/account/index.js';
import {updateSEO} from '../pages/seo.js';
import {marketplacePage,bindMarketplacePage,storePage,bindStorePage,marketCartPage,bindMarketCartPage,marketCheckoutPage,bindMarketCheckoutPage,marketOrderPage,bindMarketOrderPage,marketOrdersPage,bindMarketOrdersPage,marketProductPage,bindMarketProductPage} from '../pages/marketplace/index.js';
import {tripPage,bindTripPage,tripItineraryPage,bindTripItineraryPage} from '../pages/trip/index.js';
import {messagesPage,bindMessagesPage} from '../pages/messages/index.js';
import {moderationPage,bindModerationPage} from '../pages/admin/moderation.js';
import {directoryPage,bindDirectoryPage,placePage,claimPage,bindPlacePage} from '../pages/directory/index.js';

export function route(homeFn=home){
 const raw=(location.hash||'#/').replace(/^#\/?/,'');
 const [path,q='']=raw.split('?');
 const s=path.split('/').filter(Boolean),r=s[0],v=s[1],p=new URLSearchParams(q);
 let h;
 if(!r || ['home','feed','beranda'].includes(r))h=homeFn();
 else if(r.startsWith('@')){h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka profil</span></div>';queueMicrotask(()=>mountUserAccount('user',decodeURIComponent(r.slice(1))));}
 else if(r==='places'){h=directoryPage();queueMicrotask(()=>bindDirectoryPage());}
 else if(r==='marketplace'){h=marketplacePage();queueMicrotask(()=>bindMarketplacePage());}
 else if(r==='shop'){h=storePage();queueMicrotask(()=>bindStorePage(v||''));}
 else if(r==='market-product'){h=marketProductPage();queueMicrotask(()=>bindMarketProductPage(v||''));}
 else if(r==='market-cart'){h=marketCartPage();queueMicrotask(()=>bindMarketCartPage());}
 else if(r==='market-checkout'){h=marketCheckoutPage();queueMicrotask(()=>bindMarketCheckoutPage());}
 else if(r==='cart'){location.hash='#/market-cart';return;}
 else if(r==='checkout'){location.hash='#/market-checkout';return;}
 else if(r==='orders'){location.hash='#/market-orders';return;}
 else if(r==='order'){location.hash='#/market-order/'+encodeURIComponent(v||'');return;}
 else if(r==='market-orders'){h=marketOrdersPage();queueMicrotask(()=>bindMarketOrdersPage());}
 else if(r==='market-order'){h=marketOrderPage(v||'');queueMicrotask(()=>bindMarketOrderPage(v||''));}
 else if(r==='trip'){h=s[1]==='itinerary'?tripItineraryPage(s[2]||''):tripPage();queueMicrotask(()=>s[1]==='itinerary'?bindTripItineraryPage(s[2]||''):bindTripPage());}
 else if(r==='messages'){h=messagesPage();queueMicrotask(()=>bindMessagesPage());}
 else if(r==='admin'&&v==='moderation'){h=moderationPage();queueMicrotask(()=>bindModerationPage());}
 else if(r==='place'){
  h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Membuka tempat</span></div>';
  queueMicrotask(async()=>{
   const content=s[2]==='claim'?await claimPage(v||''):await placePage(v||'');
   const app=document.querySelector('#app');if(app){app.classList.remove('pl-page-enter');app.innerHTML=content;bindPlacePage();requestAnimationFrame(()=>app.classList.add('pl-page-enter'));}
  });
 }
 else if(r==='search'){h=discoverySearch(p.get('q')||'');queueMicrotask(()=>bindDiscoverySearch());}
 else if(r==='material'||r==='materials'){h=marketplacePage();queueMicrotask(()=>bindMarketplacePage());}
 else if(r==='provider'||r==='suppliers'){h=directoryPage();queueMicrotask(()=>bindDirectoryPage());}
 else if(r==='jasa'){h=directoryPage();queueMicrotask(()=>bindDirectoryPage());}
 else if(r==='logistik'||r==='delivery'){h=marketplacePage();queueMicrotask(()=>bindMarketplacePage());}
 
       else if(r==='login'||r==='register'){h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';queueMicrotask(()=>mountUserAccount(r));}
 else if(r==='blog'||r==='guides'||r==='article')h=blog(r==='article'||r==='guides'?v:'');
   else if(r==='help'||r==='faq'){h=helpPage(p.get('topic')||'');queueMicrotask(()=>bindHelpPage());}
   else if(['terms','privacy','guidelines'].includes(r))h=legalPage(r);
   else if(['promo','about','contact','reviews','recent'].includes(r))h=misc(r);
 else if(r==='account'&&v==='settings'){h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan pengaturan</span></div>';queueMicrotask(()=>mountUserAccount('settings'));}
 else if(r==='account'){h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan halaman</span></div>';queueMicrotask(()=>mountUserAccount(v||'explore',s[2]||''));}
 else if(r==='seller'){h='<div class="pl-page-loading" role="status" aria-live="polite"><span class="pl-page-spinner" aria-hidden="true"></span><span class="pl-page-loading-label">Menyiapkan Seller Center</span></div>';queueMicrotask(()=>sellerPage());}
   else h='<div class="empty-state large"><h1>Halaman tidak ditemukan</h1><p>Rute belum tersedia pada frontend ini.</p><a class="primary-button" href="#/">Kembali ke beranda</a></div>';
 const app=document.querySelector('#app');app.classList.remove('pl-page-enter');app.innerHTML=h;requestAnimationFrame(()=>app.classList.add('pl-page-enter'));
 updateSEO({title:document.querySelector('h1')?.textContent?document.querySelector('h1').textContent+' — Pluits Indonesia':'Pluits — Pluits Indonesia',description:'Jelajahi direktori tempat, layanan, komunitas, pengalaman, dan produk lokal di Pluits.',path:path});
 window.scrollTo(0,0);
}
