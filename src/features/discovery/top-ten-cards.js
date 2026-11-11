const TOP_TEN_DEMO_ITEMS=[
 {className:'ua-topten-card-1',href:'#/places?category=restaurant',image:'photo-1555939594-58d7cb561ad1',width:1000,title:'Babi Guling Bu Coco',location:'Kuta',category:'Kuliner',alt:'Hidangan kuliner khas',priority:true},
 {className:'ua-topten-card-2',href:'#/places?category=restaurant',image:'photo-1607623814075-e51df1bdc82f',width:1000,title:'Beef Slab',location:'Seminyak',category:'Kuliner',alt:'Hidangan beef steak'},
 {className:'ua-topten-card-3',href:'#/places?category=beach',image:'photo-1510414842594-a61c69b5ae57',width:850,title:'Atlas Beach Club',location:'Canggu',category:'Destinasi',alt:'Suasana pantai'},
 {className:'ua-topten-card-4',href:'#/trip',image:'photo-1544551763-46a013bb70d5',width:850,title:'Diving Nusa Penida',location:'Nusa Penida',category:'Aktivitas',alt:'Aktivitas menyelam di laut'},
 {className:'ua-topten-card-5',href:'#/places',image:'photo-1537996194471-e657df975ab4',width:850,title:'Jelajah Ubud',location:'Ubud',category:'Destinasi',alt:'Pemandangan Ubud dan Bali'},
 {className:'ua-topten-card-6',href:'#/places',image:'photo-1514525253161-7a46d19cd819',width:850,title:'Tari Kecak Uluwatu',location:'Uluwatu',category:'Hiburan',alt:'Hiburan dan musik'},
 {className:'ua-topten-card-7',href:'#/trip',image:'photo-1507525428034-b723cf961d3e',width:850,title:'Lovina Dolphin Tour',location:'Lovina',category:'Aktivitas',alt:'Laut biru dan pantai'},
 {className:'ua-topten-card-8',href:'#/marketplace',image:'photo-1523275335684-37898b6baf30',width:850,title:'Casio Vintage Watch',location:'Denpasar',category:'Produk',alt:'Produk jam tangan'},
 {className:'ua-topten-card-9',href:'#/places',image:'photo-1521737711867-e3b97375f902',width:850,title:'Private Bali Driver',location:'Bali',category:'Layanan',alt:'Layanan dan komunitas'},
 {className:'ua-topten-card-10',href:'#/trip',image:'photo-1500530855697-b586d89ba3ee',width:850,title:'Air Terjun Sekumpul',location:'Buleleng',category:'Pengalaman',alt:'Perjalanan alam'}
];
export function renderTopTenSection(items=TOP_TEN_DEMO_ITEMS){
 const cards=items.map(item=>'<a class="ua-topten-card '+item.className+'" href="'+item.href+'"><img src="https://images.unsplash.com/'+item.image+'?auto=format&fit=crop&w='+item.width+'&q=85" alt="'+item.alt+'" '+(item.priority?'fetchpriority="high"':'loading="lazy"')+'><span class="ua-topten-copy"><strong>'+item.title+'</strong><em>⌖ '+item.location+'</em><small>'+item.category+'</small></span></a>').join('');
 return '<section class="ua-home-trends ua-home-topten" aria-label="Top 10 Trending"><div class="ua-home-section-heading"><div><span class="ua-eyebrow">EXPLORE PLUITS</span><h2>Top 10 Trending</h2></div><a href="#/search">Lihat semua <b>↗</b></a></div><div class="ua-topten-grid" id="ua-home-topten-grid">'+cards+'</div></section>';
}
export {TOP_TEN_DEMO_ITEMS};
