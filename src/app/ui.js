import {renderBrandLogo} from '../components/common/brand.js';

import { icon } from '../design-system/icons/app-registry.js';
export { icon };
function header(title='Pluits'){
 return `<header class="site-header app-market-header sticky-header"><div class="topbar"><div class="header-inner">${renderBrandLogo({className:'brand',size:40,label:'Beranda PLUITS'})}<nav class="primary-links"><a href="#/">Social</a><a href="#/places">GeoDirectory</a><a href="#/marketplace">Marketplace</a><a href="#/trip">Trip</a><a href="#/account/profile">Akun</a></nav></div></div></header>`;
}
export function shell(content,title='Pluits',options={}){
 const pageTitle=String(title||'Pluits');
 const noHero=options.hero===false||options.hero==='none';
 const heroMarkup=noHero?'':`<section class="page-hero"><span class="eyebrow">PLUITS INDONESIA</span><h1>${pageTitle}</h1><p>Social, local discovery, commerce, and travel in one connected experience.</p></section>`;
 return `${header(title)}${heroMarkup}<main class="page-main plds-container">${content}</main>${footer()}${nav()}`;
}
export function nav(){
 return `<nav class="mobile-bottom-nav app-nav" aria-label="Navigasi utama mobile"><a href="#/"><span>⌂</span><small>Beranda</small></a><a href="#/places"><span>⌖</span><small>Tempat</small></a><a href="#/marketplace"><span>▦</span><small>Marketplace</small></a><a href="#/trip"><span>✦</span><small>Trip</small></a><a href="#/account/profile"><span>◉</span><small>Akun</small></a></nav>`;
}
export function pageHeading(k,t,p='',action=''){return `<section class="page-heading"><div class="page-heading-copy"><span class="eyebrow">${k}</span><h1>${t}</h1>${p?`<p>${p}</p>`:''}</div>${action}</section>`;}
export function hero(k,t,p=''){return `<section class="page-hero"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${p}</p></section>`;}
export function toast(t){const x=document.createElement('div');x.className='pluits-toast';x.textContent=t;document.body.append(x);setTimeout(()=>x.remove(),1800);}
export function footer(){return `<footer class="site-footer"><div class="footer-main"><div class="footer-container"><div class="footer-brand">${renderBrandLogo({className:'brand footer-logo',size:46,label:'Beranda PLUITS'})}<p>Temukan komunitas, tempat, usaha lokal, dan pengalaman perjalanan.</p></div><div class="footer-column"><h3>Jelajahi</h3><a href="#/places">GeoDirectory</a><a href="#/marketplace">Marketplace</a><a href="#/trip">Trip</a></div><div class="footer-column"><h3>Akun</h3><a href="#/account/profile">Profil</a><a href="#/market-orders">Pesanan</a><a href="#/messages">Pesan</a></div><div class="footer-column"><h3>Bantuan</h3><a href="#/help">Pusat Bantuan</a><a href="#/guidelines">Pedoman Komunitas</a><a href="#/terms">Syarat & Ketentuan</a><a href="#/privacy">Privasi</a></div></div></div><div class="footer-bottom"><div class="footer-container footer-bottom-inner"><strong>© 2026 Pluits Indonesia</strong><span>One identity · Connected experiences</span></div></div></footer>`;}
