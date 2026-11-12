import {socialIcon} from '../../components/common/social-icons.js';
import {renderBrandLogo} from '../../components/common/brand.js';

export function renderPublicNavbar(){
 const locale=localStorage.getItem('pluits-public-locale')==='en'?'en':'id';
 const flag=locale==='id'?'🇮🇩':'🇬🇧';
 return `<header class="pl-public-navbar" aria-label="PLUITS">
  <div class="pl-public-navbar-brand">${renderBrandLogo({className:'pl-public-navbar-mark',size:30,label:'PLUITS beranda'})}<span>pluits</span></div>
  <div class="pl-public-navbar-actions">
   <button class="pl-public-language" type="button" data-public-action="language" aria-label="Ganti bahasa" title="Bahasa"><span class="pl-public-flag" aria-hidden="true">${flag}</span><span data-public-locale-label>${locale.toUpperCase()}</span></button>
   <button class="pl-public-icon-action" type="button" data-public-action="wishlist" aria-label="Wishlist" title="Wishlist">${socialIcon('heart',{size:20})}</button>
   <button class="pl-public-icon-action pl-public-cart-action" type="button" data-public-action="cart" aria-label="Keranjang" title="Keranjang">${socialIcon('shopping-bag',{size:20})}<span class="pl-public-cart-count" data-public-cart-count hidden>0</span></button>
   <a class="pl-public-register" href="#/account/register"><span data-public-register-label>${locale==='id'?'Daftar':'Sign up'}</span></a>
  </div>
 </header>`;
}

export function bindPublicNavbar(){
 const header=document.querySelector('.pl-public-navbar');if(!header||header.dataset.bound==='true')return;
 header.dataset.bound='true';
 const readCart=()=>{try{const value=JSON.parse(localStorage.getItem('pluits-guest-cart')||'[]');return Array.isArray(value)?value.reduce((n,item)=>n+Math.max(0,Number(item.quantity)||0),0):0;}catch{return 0;}};
 const updateCart=()=>{const badge=header.querySelector('[data-public-cart-count]');if(!badge)return;const count=readCart();badge.textContent=count>99?'99+':String(count);badge.hidden=count<1;};
 const toast=message=>{let node=document.querySelector('.pl-public-toast');if(!node){node=document.createElement('div');node.className='pl-public-toast';node.setAttribute('role','status');node.setAttribute('aria-live','polite');document.body.append(node);}node.textContent=message;node.classList.add('is-visible');clearTimeout(node._hideTimer);node._hideTimer=setTimeout(()=>node.classList.remove('is-visible'),2200);};
 header.addEventListener('click',event=>{
  const action=event.target.closest('[data-public-action]')?.dataset.publicAction;if(!action)return;
  if(action==='language'){
   const next=(localStorage.getItem('pluits-public-locale')==='en'?'id':'en');localStorage.setItem('pluits-public-locale',next);document.documentElement.lang=next;
   const flag=header.querySelector('.pl-public-flag'),label=header.querySelector('[data-public-locale-label]'),register=header.querySelector('[data-public-register-label]');
   if(flag)flag.textContent=next==='id'?'🇮🇩':'🇬🇧';if(label)label.textContent=next.toUpperCase();if(register)register.textContent=next==='id'?'Daftar':'Sign up';
   toast(next==='id'?'Bahasa Indonesia dipilih':'English selected');
  }else if(action==='wishlist'||action==='cart'){location.hash='#/account/login';}
 });
 updateCart();
 window.addEventListener('pluits:guest-cart-updated',updateCart);
 window.addEventListener('storage',updateCart);
}
