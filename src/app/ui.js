import {renderBrandLogo} from '../components/common/brand.js';

export const icon={
 location:`<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg>`,
 truck:`<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="18" cy="18" r="1.8"/></svg>`,
 store:`<svg viewBox="0 0 24 24"><path d="M4 10h16v10H4zM3 10l2-6h14l2 6M8 20v-6h8v6"/></svg>`,
 box:`<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>`,
 menu:`<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
 search:`<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
 cart:`<svg viewBox="0 0 24 24"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>`,
 heart:`<svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.1-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 8 4c1.7 0 3.2.9 4 2.2C12.8 4.9 14.3 4 16 4a4.8 4.8 0 0 1 4.8 4.8Z"/></svg>`,
 back:`<svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>`,
 arrow:`<svg viewBox="0 0 24 24"><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></svg>`,
 user:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5"/></svg>`,
 check:`<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`
};
function header(title='Pluits'){
 return `<header class="site-header app-market-header sticky-header"><div class="topbar"><div class="header-inner">${renderBrandLogo({className:'brand',size:40,label:'Beranda PLUITS'})}<nav class="primary-links"><a href="#/">Social</a><a href="#/places">GeoDirectory</a><a href="#/marketplace">Marketplace</a><a href="#/trip">Trip</a><a href="#/account/profile">Akun</a></nav></div></div></header>`;
}
export function shell(content,title='Pluits',options={}){
 const pageTitle=String(title||'Pluits');
 const noHero=options.hero===false||options.hero==='none';
 const heroMarkup=noHero?'':`<section class="page-hero"><span class="eyebrow">PLUITS INDONESIA</span><h1>${pageTitle}</h1><p>Social, local discovery, commerce, and travel in one connected experience.</p></section>`;
 return `${header(title)}${heroMarkup}<main class="page-main">${content}</main>${footer()}${nav()}`;
}
export function nav(){
 return `<nav class="mobile-bottom-nav app-nav" aria-label="Navigasi utama mobile"><a href="#/"><span>⌂</span><small>Beranda</small></a><a href="#/places"><span>⌖</span><small>Tempat</small></a><a href="#/marketplace"><span>▦</span><small>Marketplace</small></a><a href="#/trip"><span>✦</span><small>Trip</small></a><a href="#/account/profile"><span>◉</span><small>Akun</small></a></nav>`;
}
export function pageHeading(k,t,p='',action=''){return `<section class="page-heading"><div class="page-heading-copy"><span class="eyebrow">${k}</span><h1>${t}</h1>${p?`<p>${p}</p>`:''}</div>${action}</section>`;}
export function hero(k,t,p=''){return `<section class="page-hero"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${p}</p></section>`;}
export function toast(t){const x=document.createElement('div');x.className='pluits-toast';x.textContent=t;document.body.append(x);setTimeout(()=>x.remove(),1800);}
export function footer(){return `<footer class="site-footer"><div class="footer-main"><div class="footer-container"><div class="footer-brand">${renderBrandLogo({className:'brand footer-logo',size:46,label:'Beranda PLUITS'})}<p>Temukan komunitas, tempat, usaha lokal, dan pengalaman perjalanan.</p></div><div class="footer-column"><h3>Jelajahi</h3><a href="#/places">GeoDirectory</a><a href="#/marketplace">Marketplace</a><a href="#/trip">Trip</a></div><div class="footer-column"><h3>Akun</h3><a href="#/account/profile">Profil</a><a href="#/market-orders">Pesanan</a><a href="#/messages">Pesan</a></div><div class="footer-column"><h3>Bantuan</h3><a href="#/help">Pusat Bantuan</a><a href="#/guidelines">Pedoman Komunitas</a><a href="#/terms">Syarat & Ketentuan</a><a href="#/privacy">Privasi</a></div></div></div><div class="footer-bottom"><div class="footer-container footer-bottom-inner"><strong>© 2026 Pluits Indonesia</strong><span>One identity · Connected experiences</span></div></div></footer>`;}
