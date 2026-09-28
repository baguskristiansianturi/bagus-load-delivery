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

const guides=[
 ['cara-memilih-besi-beton','Material Guide','Cara memilih besi beton yang tepat untuk proyek','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=82'],
 ['hitung-kebutuhan-semen','Construction','Cara menghitung kebutuhan semen sebelum membeli','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=82'],
 ['pilih-truck-material','Delivery','Memilih truck sesuai jenis dan volume material','https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=1000&q=82'],
 ['checklist-renovasi','Project Planning','Checklist kebutuhan material untuk renovasi','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=82']
];

const money=n=>new Intl.NumberFormat('id-ID').format(n);
function deal(p){
 return `<article class="deal-card"><a href="#/detail/${p.id}" class="deal-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span>DEMO DEAL</span></a><button type="button" class="deal-heart" data-wish="${p.id}" aria-label="Simpan">${icon.heart}</button><div class="deal-body"><small>Construction material</small><h3>${p.title}</h3><div class="deal-rating">★ ${p.rating||4.8} <span>(demo)</span></div><strong>Rp ${money(p.price)}</strong><p>${p.provider} · ${p.stock}</p></div></article>`;
}

export function home(){
 const slides=[
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2200&q=88',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=88',
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=2200&q=88'
 ];
 const deals=PRODUCTS.slice(0,6);
 return `${header()}
<section class="klook-hero hero-carousel"><div class="hero-slides">${slides.map((img,i)=>`<article class="hero-slide ${i===0?'is-active':''}" style="--hero-image:url('${img}')"><div class="klook-hero-overlay"></div><div class="klook-hero-inner"><span class="hero-label">BALI BAGUS LOAD & DELIVERY</span><h1>Everything your project needs.<br><em>In one place.</em></h1><p>Temukan material, bandingkan supplier, atur delivery, dan kelola kebutuhan proyek dari satu marketplace.</p><form class="hero-search klook-search hero-slide-search"><span>${icon.search}</span><input placeholder="Besi Ulir" aria-label="Cari kebutuhan proyek"><button type="submit">Cari</button></form></div></article>`).join('')}</div><button class="hero-arrow hero-prev" aria-label="Sebelumnya">‹</button><button class="hero-arrow hero-next" aria-label="Berikutnya">›</button><div class="hero-dots">${slides.map((_,i)=>`<button class="${i===0?'is-active':''}" aria-label="Slide ${i+1}"></button>`).join('')}</div></section>

<main class="market-wrap">
<section class="home-section category-section"><div class="section-head"><div><span class="eyebrow">EXPLORE KATEGORI</span><h2>Belanja berdasarkan kategori</h2><p>Material dan kebutuhan proyek dalam satu tempat.</p></div><a href="#/material">Lihat semua ${icon.arrow}</a></div><div class="category-grid">${categories.map(c=>`<a class="home-category-card" href="#/material/${c[1]}"><img src="${c[2]}" alt="${c[0]}" loading="lazy"><span>${c[0]}</span></a>`).join('')}</div></section>

<section class="home-section trust-strip"><div class="trust-intro"><span class="eyebrow">WHY BALI BAGUS</span><h2>Pengadaan proyek, tanpa harus mengoordinasikan semuanya sendiri.</h2><p>Satu alur untuk mencari material, membandingkan supplier, mengatur delivery, dan memantau pesanan.</p></div><div class="trust-grid"><div><b>✓</b><strong>Transaksi terstruktur</strong><span>Pesanan dan pembayaran dicatat dalam satu alur.</span></div><div><b>✓</b><strong>Supplier terkurasi</strong><span>Status supplier dan ketersediaan ditampilkan secara transparan.</span></div><div><b>🚚</b><strong>Delivery terkoordinasi</strong><span>Multi-supplier dapat digabung dalam satu workflow pengiriman.</span></div><div><b>◉</b><strong>Bantuan manusia</strong><span>Hubungi tim jika kebutuhan proyek Anda kompleks.</span></div></div></section>

<section class="home-section"><div class="section-head"><div><span class="eyebrow">DEALS</span><h2>Material pilihan untuk proyek</h2><p>Contoh katalog frontend — harga dan stok akan terhubung ke backend supplier.</p></div><a href="#/material">Jelajahi produk ${icon.arrow}</a></div><div class="deal-grid">${deals.map(deal).join('')}</div></section>

<section class="home-section discovery-strip"><div><span class="eyebrow">ONE WORKFLOW</span><h2>Dari material sampai lokasi proyek.</h2><p>Bandingkan supplier, pilih jumlah, tentukan delivery, lalu kelola pesanan dalam satu alur.</p></div><div class="discovery-steps"><div><b>01</b><strong>Discover</strong><span>Cari material</span></div><div><b>02</b><strong>Decide</strong><span>Bandingkan supplier</span></div><div><b>03</b><strong>Order</strong><span>Atur delivery</span></div><div><b>04</b><strong>Track</strong><span>Pantau pesanan</span></div></div></section>

<section class="home-section"><div class="section-head"><div><span class="eyebrow">PROJECT GUIDES</span><h2>Panduan proyek</h2><p>Insight praktis sebelum membeli material dan mengatur pengiriman.</p></div><a href="#/blog">Lihat semua ${icon.arrow}</a></div><div class="guide-grid">${guides.map(g=>`<a class="guide-card" href="#/article/${g[0]}"><img src="${g[3]}" alt="${g[2]}" loading="lazy"><div><small>${g[1]}</small><h3>${g[2]}</h3><span>Baca panduan ${icon.arrow}</span></div></a>`).join('')}</div></section>

<section class="home-section final-cta"><div><span class="eyebrow">READY TO START?</span><h2>Bangun alur pengadaan proyek yang lebih sederhana.</h2><p>Mulai dari material yang Anda butuhkan. Fitur procurement, supplier, pembayaran, dan delivery akan terus dikembangkan.</p></div><div><a class="primary-button" href="#/material">Mulai belanja</a><a class="secondary-button" href="#/proyek">Kelola proyek</a></div></section>
</main>${footer()}${nav()}`;
}

export function bindHome(){
 const hero=document.querySelector('.klook-hero');
 if(hero&&!hero.dataset.ready){
  hero.dataset.ready='1';
  const slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('.hero-dots button')];
  let n=0,t;
  const show=i=>{n=(i+slides.length)%slides.length;slides.forEach((s,j)=>s.classList.toggle('is-active',j===n));dots.forEach((d,j)=>d.classList.toggle('is-active',j===n));};
  const restart=()=>{clearInterval(t);t=setInterval(()=>show(n+1),5500);};
  hero.querySelector('.hero-prev').onclick=()=>{show(n-1);restart()};
  hero.querySelector('.hero-next').onclick=()=>{show(n+1);restart()};
  dots.forEach((d,i)=>d.onclick=()=>{show(i);restart()});
  restart();
 }
 const searchSuggestions=['Besi Ulir','Triplek','Jasa Mobil Angkutan','Besi Beton 12mm','Semen Portland','Pipa PVC','Truck Material'];
 document.querySelectorAll('.hero-slide-search').forEach((f,index)=>{
  const input=f.querySelector('input'); let suggestionIndex=index%searchSuggestions.length;
  const setPlaceholder=()=>{input.placeholder=searchSuggestions[suggestionIndex];suggestionIndex=(suggestionIndex+1)%searchSuggestions.length};
  setPlaceholder(); setInterval(()=>{if(document.activeElement!==input&&!input.value.trim())setPlaceholder()},2600);
  f.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim()||input.placeholder;const area=window.__BLD_VISITOR_AREA||'Indonesia';location.hash='#/search?q='+encodeURIComponent(q)+'&area='+encodeURIComponent(area)});
 });
 document.querySelectorAll('[data-wish]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const x=PRODUCTS.find(p=>p.id===b.dataset.wish);if(x){store.toggleWishlist(x);b.classList.toggle('is-saved',store.isWishlisted(x.id));}}));

}
