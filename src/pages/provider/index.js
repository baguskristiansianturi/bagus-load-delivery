import {shell,hero,card} from '../../app/ui.js';
import {PRODUCTS} from '../../data/catalog.js';
import {SUPPLIERS} from '../../data/marketplace.js';
const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function supplierPage(slug=''){
 const s=SUPPLIERS.find(x=>x.id===slug)||SUPPLIERS.find(x=>slugify(x.name)===String(slug||'').toLowerCase());
 if(s)return shell(`${hero('SUPPLIER',s.name,'Supplier marketplace demo. Rating, area layanan dan produk ditampilkan sebagai data contoh sampai backend aktif.')}<div class="supplier-profile"><div class="supplier-profile-card"><strong>★ ${s.rating}</strong><span>Verified supplier demo</span><span>${s.areas.join(' · ')}</span></div><div><h2>Products from this supplier</h2><div class="catalog-grid">${PRODUCTS.slice(0,4).map(card).join('')}</div></div></div>`,'Supplier');
 return shell(`${hero('SUPPLIERS','Find verified project suppliers','Compare supplier coverage, rating and product availability before ordering.')}<div class="supplier-grid">${SUPPLIERS.map(x=>`<a class="supplier-card" href="#/provider/${slugify(x.name)}"><span class="supplier-avatar">B</span><div><h3>${x.name}</h3><p>★ ${x.rating} · Verified demo</p><small>Service area: ${x.areas.join(', ')}</small></div><b>View ${x.areas.length} area →</b></a>`).join('')}</div>`,'Suppliers');
}