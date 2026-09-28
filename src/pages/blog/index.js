import {shell} from '../../app/ui.js';
const posts=[
 ['cara-memilih-besi-beton','Material Guide','Cara memilih besi beton yang tepat untuk proyek','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85'],
 ['hitung-kebutuhan-semen','Construction','Cara menghitung kebutuhan semen sebelum membeli','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85'],
 ['pilih-truck-material','Delivery','Memilih truck sesuai jenis dan volume material','https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=1200&q=85']];
export function blog(slug=''){
 const p=posts.find(x=>x[0]===slug);
 if(p)return shell('<article class="article-page"><span class="eyebrow">'+p[1]+'</span><h1>'+p[2]+'</h1><img class="article-cover" src="'+p[3]+'" alt="'+p[2]+'"><div class="article-body"><p>Panduan Bali Bagus untuk membantu Anda merencanakan material, supplier, dan delivery proyek.</p><h2>Bandingkan sebelum membeli</h2><p>Periksa harga, stok, rating supplier, area layanan, waktu persiapan, dan pilihan pengiriman.</p><div class="article-callout"><b>Tip proyek</b><span>Simpan material penting ke wishlist sebelum checkout.</span></div></div></article>','Guide');
 return shell('<div class="blog-page"><div class="blog-hero"><span class="eyebrow">BALI BAGUS GUIDES</span><h1>Ideas, guides & stories for better projects.</h1><p>Informasi material, pembelian, perencanaan dan delivery.</p></div><div class="blog-grid">'+posts.map(p=>'<a class="blog-card" href="#/article/'+p[0]+'"><img src="'+p[3]+'" alt="'+p[2]+'"><div><small>'+p[1]+'</small><h3>'+p[2]+'</h3><span>Read guide →</span></div></a>').join('')+'</div></div>','Project Guides');
}