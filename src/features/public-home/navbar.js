import {socialIcon} from '../../components/common/social-icons.js';
import {renderBrandLogo} from '../../components/common/brand.js';

export function renderPublicNavbar(){
 const locale=localStorage.getItem('pluits-public-locale')==='en'?'en':'id';
 return `<header class="pl-public-navbar" aria-label="PLUITS">
  <div class="pl-public-navbar-brand">${renderBrandLogo({className:'pl-public-navbar-mark',size:30,label:'PLUITS beranda'})}<span>Pluits</span></div>
  <div class="pl-public-navbar-actions">
   <button class="pl-public-language" type="button" data-public-action="language" aria-label="Ganti bahasa" title="Bahasa"><span class="pl-public-flag pl-public-flag-${locale}" aria-hidden="true"></span><span data-public-locale-label>${locale.toUpperCase()}</span></button>
   <button class="pl-public-icon-action pl-public-wishlist-action" type="button" data-public-action="wishlist" aria-label="Wishlist" title="Wishlist">${socialIcon('heart',{size:22})}<span class="pl-public-cart-count pl-public-wishlist-count" data-public-wishlist-count hidden>0</span></button>
   <button class="pl-public-icon-action pl-public-cart-action" type="button" data-public-action="cart" aria-label="Keranjang" title="Keranjang">${socialIcon('shopping-cart',{size:22,className:'pl-icon-cart-facing-in'})}<span class="pl-public-cart-count" data-public-cart-count hidden>0</span></button>
  </div>
 </header>`;
}

export function bindPublicNavbar(){
 const header=document.querySelector('.pl-public-navbar');if(!header||header.dataset.bound==='true')return;
 header.dataset.bound='true';
 const readItems=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return [];}};
 const readCart=()=>readItems('pluits_market_cart_v1').reduce((n,item)=>n+Math.max(0,Number(item.quantity)||0),0);
 const readWishlist=()=>readItems('pluits_market_wishlist_v1').length+readItems('pluits-guest-wishlist').length;
 const paintBadge=(selector,count)=>{const badge=header.querySelector(selector);if(!badge)return;badge.textContent=count>99?'99+':String(count);badge.hidden=count<1;};
 const updateCart=()=>{const cartCount=readCart(),wishlistCount=readWishlist();paintBadge('[data-public-cart-count]',cartCount);paintBadge('[data-public-wishlist-count]',wishlistCount);header.querySelector('.pl-public-cart-action')?.classList.toggle('has-items',cartCount>0);header.querySelector('.pl-public-wishlist-action')?.classList.toggle('has-saved',wishlistCount>0);};
 const toast=message=>{let node=document.querySelector('.pl-public-toast');if(!node){node=document.createElement('div');node.className='pl-public-toast';node.setAttribute('role','status');node.setAttribute('aria-live','polite');document.body.append(node);}node.textContent=message;node.classList.add('is-visible');clearTimeout(node._hideTimer);node._hideTimer=setTimeout(()=>node.classList.remove('is-visible'),2200);};
 header.addEventListener('click',event=>{
  const action=event.target.closest('[data-public-action]')?.dataset.publicAction;if(!action)return;
  if(action==='language'){
   const next=(localStorage.getItem('pluits-public-locale')==='en'?'id':'en');localStorage.setItem('pluits-public-locale',next);document.documentElement.lang=next;
   const languageButton=header.querySelector('.pl-public-language'),label=header.querySelector('[data-public-locale-label]');
   if(languageButton){languageButton.querySelector('.pl-public-flag')?.classList.toggle('pl-public-flag-id',next==='id');languageButton.querySelector('.pl-public-flag')?.classList.toggle('pl-public-flag-en',next==='en');}if(label)label.textContent=next.toUpperCase();
   toast(next==='id'?'Bahasa Indonesia dipilih':'English selected');
   }else if(action==='wishlist'||action==='cart'){location.hash='#/account/auth?mode=login';}
 });
 updateCart();
 window.addEventListener('pluits:guest-cart-updated',updateCart);
 window.addEventListener('pluits:market-cart-updated',updateCart);
 window.addEventListener('pluits:wishlist-updated',updateCart);
 window.addEventListener('storage',updateCart);
}

export function addPublicGuestCartItem(item){
 if(!item||item.id===undefined||item.id===null)return false;
 let items=[];try{items=JSON.parse(localStorage.getItem('pluits-guest-cart')||'[]');if(!Array.isArray(items))items=[];}catch{}
 const id=String(item.id),quantity=Math.max(1,Number(item.quantity)||1),existing=items.find(entry=>String(entry.id)===id);
 if(existing)existing.quantity=Math.max(0,Number(existing.quantity)||0)+quantity;
 else items.push({id,quantity});
 localStorage.setItem('pluits-guest-cart',JSON.stringify(items));
 window.dispatchEvent(new Event('pluits:guest-cart-updated'));
 let toast=document.querySelector('.pl-public-toast');if(!toast){toast=document.createElement('div');toast.className='pl-public-toast';toast.setAttribute('role','status');document.body.append(toast);}
 toast.textContent='Berhasil ditambahkan ke keranjang';toast.classList.add('is-visible');clearTimeout(toast._hideTimer);toast._hideTimer=setTimeout(()=>toast.classList.remove('is-visible'),2200);
 return true;
}
