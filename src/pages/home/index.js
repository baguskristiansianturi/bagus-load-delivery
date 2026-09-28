import {icon,header,footer,nav} from '../../app/ui.js';
import {PRODUCTS} from '../../data/catalog.js';
import {store} from '../../app/store.js';

const categories=[
 ['Besi & Baja','besi-baja','https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=82'],
 ['Semen & Beton','semen-beton','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=82'],
 ['Pasir & Batu','pasir-batu','https://images.unsplash.com/photo-1590579491624-f98f36d4c763?auto=format&fit=crop&w=800&q=82'],
 ['Kayu & Multiplek','kayu-multiplek','https://images.unsplash.com/photo-1531835551805-16d864c8d1c6?auto=format&fit=crop&w=800&q=82'],
 ['Cat & Finishing','cat-pelapis','https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=82'],
 ['Listrik','listrik','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=82'],
 ['Plumbing','pipa-plumbing','https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=82'],
 ['Atap','atap','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=82']
];
const areas=[
 ['Denpasar','Urban projects','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=82'],
 ['Badung','Villa & hospitality','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=82'],
 ['Gianyar','Renovation','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82'],
 ['Ubud','Villa projects','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=82']
];
const guides=[
 ['cara-memilih-besi-beton','Material Guide','Cara memilih besi beton yang tepat untuk proyek','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=82'],
 ['hitung-kebutuhan-semen','Construction','Cara menghitung kebutuhan semen sebelum membeli','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=82'],
 ['pilih-truck-material','Delivery','Memilih truck sesuai jenis dan volume material','https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=1000&q=82'],
 ['checklist-renovasi','Project Planning','Checklist kebutuhan material untuk renovasi','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=82']
];

function deal(p){return `<a href="#/detail/${p.id}" class="deal-card"><div class="deal-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span>DEMO DEAL</span><button type="button" class="deal-heart" data-wish="${p.id}">${icon.heart}</button></div><div class="deal-body"><small>Construction material</small><h3>${p.title}</h3><div class="deal-rating">★ ${p.rating||4.8} <span>(demo)</span></div><strong>Rp ${new Intl.NumberFormat('id-ID').format(p.price)}</strong><p>3 supplier · Delivery tersedia</p></div></a>`}
export function home(){
 const slides=[
  ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2200&q=88'],
  ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=88'],
  ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=2200&q=88']
 ];
 return `${header()}<section class="klook-hero hero-carousel"><div class="hero-slides">${slides.map((s,i)=>`<article class="hero-slide ${i===0?'is-active':''}" style="--hero-image:url('${s[0]}')"><div class="klook-hero-overlay"></div><div class="klook-hero-inner"><span class="hero-label">BALI BAGUS LOAD & DELIVERY</span><div class="hero-location" id="hero-location">Untuk kebutuhan proyek di Indonesia</div><h1>Everything your project needs.<br><em>In one place.</em></h1><p>Temukan material, bandingkan supplier, atur delivery, dan kelola kebutuhan proyek dari satu marketplace.</p><form class="hero-search klook-search hero-slide-search"><span>${icon.search}</span><input placeholder="Besi Ulir" aria-label="Cari kebutuhan proyek"><button>Cari</button></form></div></article>`).join('')}</div><button class="hero-arrow hero-prev" aria-label="Sebelumnya">‹</button><button class="hero-arrow hero-next" aria-label="Berikutnya">›</button><div class="hero-dots">${slides.map((_,i)=>`<button class="${i===0?'is-active':''}" aria-label="Slide ${i+1}"></button>`).join('')}</div></section>
${c.slice(c.indexOf("<main>"),c.indexOf("</main>")+7)}${footer()}${nav()}`;
}export function bindHome(){
 const hero=document.querySelector('.klook-hero');if(hero&&!hero.dataset.ready){hero.dataset.ready='1';const slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('.hero-dots button')];let n=0,t;const show=i=>{n=(i+slides.length)%slides.length;slides.forEach((s,j)=>s.classList.toggle('is-active',j===n));dots.forEach((d,j)=>d.classList.toggle('is-active',j===n))};const restart=()=>{clearInterval(t);t=setInterval(()=>show(n+1),5500)};hero.querySelector('.hero-prev').onclick=()=>{show(n-1);restart()};hero.querySelector('.hero-next').onclick=()=>{show(n+1);restart()};dots.forEach((d,i)=>d.onclick=()=>{show(i);restart()});restart()}
 const searchSuggestions=['Besi Ulir','Triplek','Jasa Mobil Angkutan','Besi Beton 12mm','Semen Portland','Pipa PVC','Truck Material'];
 fetch('https://ipapi.co/json/').then(r=>r.ok?r.json():null).then(g=>{if(!g)return;const city=g.city||g.region||'Indonesia';document.querySelectorAll('.hero-location').forEach(x=>x.textContent='Untuk kebutuhan proyek di '+city);window.__BLD_VISITOR_AREA=city}).catch(()=>{});
 document.querySelectorAll('.hero-slide-search').forEach((f,index)=>{const input=f.querySelector('input');let suggestionIndex=index%searchSuggestions.length;const setPlaceholder=()=>{input.placeholder=searchSuggestions[suggestionIndex];suggestionIndex=(suggestionIndex+1)%searchSuggestions.length};setPlaceholder();setInterval(()=>{if(document.activeElement!==input&&!input.value.trim())setPlaceholder()},2600);f.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim()||input.placeholder;const area=window.__BLD_VISITOR_AREA||'Indonesia';if(q)location.hash='#/search?q='+encodeURIComponent(q)+'&area='+encodeURIComponent(area)})});
 document.querySelectorAll('[data-wish]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const x=PRODUCTS.find(p=>p.id===b.dataset.wish);if(x){store.toggleWishlist(x);b.classList.toggle('is-saved',store.isWishlisted(x.id))}}));
}
