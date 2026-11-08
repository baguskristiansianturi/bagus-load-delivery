import {listing,search} from './page-factory.js';
import {categoryPage} from '../pages/category/index.js';
import {detail} from '../pages/product/detail.js';
import {cart} from '../pages/cart/index.js';
import {checkout} from '../pages/checkout/index.js';
import {orders,order} from '../pages/orders/index.js';
import {wishlist} from '../pages/wishlist/index.js';
import {misc} from '../pages/misc/index.js';
import {blog} from '../pages/blog/index.js';
import {supplierPage} from '../pages/provider/index.js';
import {projectsPage} from '../pages/project/index.js';
import {home} from '../pages/home/index.js';
import {operations} from '../pages/operations/index.js';
import {tracking} from '../pages/tracking/index.js';
import {sellerPage} from '../pages/seller/index.js';
import {mountUserAccount} from '../pages/account/index.js';
import {updateSEO} from '../pages/seo.js';
import {marketplacePage,bindMarketplacePage,storePage,bindStorePage,marketCartPage,bindMarketCartPage,marketCheckoutPage,bindMarketCheckoutPage,marketOrderPage,bindMarketOrderPage,marketOrdersPage,bindMarketOrdersPage} from '../pages/marketplace/index.js';
import {tripPage,bindTripPage,tripItineraryPage,bindTripItineraryPage} from '../pages/trip/index.js';
import {directoryPage,bindDirectoryPage,placePage,claimPage,bindPlacePage} from '../pages/directory/index.js';

export function route(homeFn=home){
 const raw=(location.hash||'#/').replace(/^#\/?/,'');
 const [path,q='']=raw.split('?');
 const s=path.split('/').filter(Boolean),r=s[0],v=s[1],p=new URLSearchParams(q);
 let h;
 if(!r)h=homeFn();
 else if(r==='places'){h=directoryPage();queueMicrotask(()=>bindDirectoryPage());}
 else if(r==='marketplace'){h=marketplacePage();queueMicrotask(()=>bindMarketplacePage());}
 else if(r==='shop'){h=storePage();queueMicrotask(()=>bindStorePage(v||''));}
 else if(r==='market-cart'){h=marketCartPage();queueMicrotask(()=>bindMarketCartPage());}
 else if(r==='market-checkout'){h=marketCheckoutPage();queueMicrotask(()=>bindMarketCheckoutPage());}
 else if(r==='market-orders'){h=marketOrdersPage();queueMicrotask(()=>bindMarketOrdersPage());}
 else if(r==='market-order'){h=marketOrderPage(v||'');queueMicrotask(()=>bindMarketOrderPage(v||''));}
 else if(r==='trip'){h=s[1]==='itinerary'?tripItineraryPage(s[2]||''):tripPage();queueMicrotask(()=>s[1]==='itinerary'?bindTripItineraryPage(s[2]||''):bindTripPage());}
 else if(r==='place'){
  h='<div class="pl-directory-loading">Membuka tempat…</div>';
  queueMicrotask(async()=>{
   const content=s[2]==='claim'?await claimPage(v||''):await placePage(v||'');
   const app=document.querySelector('#app');if(app){app.innerHTML=content;bindPlacePage();}
  });
 }
 else if(r==='search')h=search(p.get('q')||'');
 else if(r==='material'||r==='materials'){h=marketplacePage();queueMicrotask(()=>bindMarketplacePage());}
 else if(r==='jasa')h=v?categoryPage(v==='plumbing'?'plumbing-service':v):listing('service','');
 else if(r==='logistik'||r==='delivery')h=v?categoryPage(v):listing('logistics','');
 else if(r==='properti')h=listing('property',v||'');
 else if(r==='detail'||r==='product')h=detail(v);
 else if(r==='cart')h=cart();
 else if(r==='checkout')h=checkout();
 else if(r==='orders')h=orders();
 else if(r==='order')h=order(v);
 else if(r==='wishlist')h=wishlist();
 else if(r==='login'||r==='register'){h='<div class="pluits-loading">Membuka akun Pluits…</div>';queueMicrotask(()=>mountUserAccount(r));}
 else if(r==='blog'||r==='guides'||r==='article')h=blog(r==='article'||r==='guides'?v:'');
 else if(r==='provider'||r==='suppliers')h=supplierPage(v||'');
 else if(r==='proyek'||r==='projects')h=projectsPage(v||'');
 else if(['promo','help','faq','about','contact','reviews','terms','privacy','recent'].includes(r))h=misc(r);
 else if(r==='account'){h='<div class="pluits-loading">Membuka akun Pluits…</div>';queueMicrotask(()=>mountUserAccount(v||'explore',s[2]||''));}
 else if(r==='seller'){h='<div class="pluits-loading">Membuka Seller Center Pluits…</div>';queueMicrotask(()=>sellerPage());}
 else if(['driver','partner','admin'].includes(r))h=operations(r,v||'');
 else if(r==='track'||r==='track-order')h=tracking(v||p.get('id')||'');
 else h='<div class="empty-state large"><h1>Halaman tidak ditemukan</h1><p>Rute belum tersedia pada frontend ini.</p><a class="primary-button" href="#/">Kembali ke beranda</a></div>';
 document.querySelector('#app').innerHTML=h;
 updateSEO({title:document.querySelector('h1')?.textContent?document.querySelector('h1').textContent+' — Pluits Indonesia':'Pluits — Pluits Indonesia',description:'Jelajahi direktori tempat, layanan, komunitas, pengalaman, dan produk lokal di Pluits.',path:path});
 window.scrollTo(0,0);
}
