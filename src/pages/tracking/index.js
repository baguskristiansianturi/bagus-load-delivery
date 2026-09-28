import {store,money} from '../app/store.js';
import {shell,hero} from '../app/ui.js';

const stages=[
 ['Pesanan dibuat','Order tercatat dan menunggu konfirmasi pembayaran.'],
 ['Pembayaran dikonfirmasi','Pembayaran online akan diverifikasi oleh gateway/backend.'],
 ['Supplier menyiapkan','Masing-masing supplier menyiapkan item sesuai order.'],
 ['Pickup & loading','Bali Bagus mengoordinasikan pickup dan konsolidasi.'],
 ['Dalam perjalanan','Driver membawa material ke lokasi proyek.'],
 ['Selesai','Delivery diterima dan proof of delivery disimpan.']
];

function stageIndex(status){
 return ({pending:0,confirmed:1,processing:2,shipping:4,completed:5})[status]??0;
}

export function tracking(id=''){
 const orders=store.getOrders();
 const selected=id?store.getOrder(id):orders[0];
 const demo=!selected;
 const o=selected||{
   id:'BLD-DEMO-10291',status:'shipping',total:1815000,
   customer:{name:'Project Ubud'},delivery:{city:'Ubud',type:'same_day',date:'Today'},
   items:[{title:'Besi Beton 10 mm',quantity:20,price:78000},{title:'Semen Portland 40 kg',quantity:10,price:68500}]
 };
 const active=stageIndex(o.status);
 const html=shell(
   hero('TRACK ORDER',o.id,'Lacak tahapan procurement dan delivery dalam satu alur.')+
   `<div class="tracking-page">
      <form class="ops-card tracking-search" id="tracking-search">
        <label>Nomor pesanan<input name="id" value="${id||''}" placeholder="Contoh: BLD-12345678" required></label>
        <button class="primary-button">Lacak pesanan</button>
      </form>
      ${demo?'<div class="checkout-demo-note">Menampilkan order demo karena belum ada order lokal yang dipilih. Tracking GPS, ETA dan proof of delivery akan terhubung ke backend.</div>':''}
      <div class="tracking-grid">
        <section class="ops-card">
          <div class="ops-card-head"><div><span class="eyebrow">PROCUREMENT → DELIVERY</span><h2>Status perjalanan</h2></div><span class="status-pill">${o.status}</span></div>
          <div class="tracking-timeline">${stages.map((s,i)=>
            `<div class="tracking-step ${i<=active?'is-done':''} ${i===active?'is-current':''}">
              <span class="tracking-dot">${i<=active?'✓':i+1}</span>
              <div><b>${s[0]}</b><p>${s[1]}</p></div>
            </div>`).join('')}</div>
        </section>
        <aside class="summary-card">
          <h3>Order summary</h3>
          <p><b>${o.customer?.name||'Project customer'}</b><br>${o.delivery?.city||'Bali'} · ${o.delivery?.type||'scheduled'}</p>
          ${o.items.map(x=>`<div class="summary-item"><span>${x.title} × ${x.quantity}</span><b>Rp ${money(x.price*x.quantity)}</b></div>`).join('')}
          <hr><div class="summary-total"><span>Total</span><strong>Rp ${money(o.total)}</strong></div>
          <a class="primary-button wide-button" href="#/order/${o.id}">Open order detail</a>
        </aside>
      </div>
      <section class="ops-card tracking-notes">
        <h2>Delivery intelligence</h2>
        <div class="tracking-note-grid">
          <div><b>Supplier coordination</b><span>Multi-supplier pickup and consolidation are planned by Bali Bagus.</span></div>
          <div><b>Vehicle</b><span>Vehicle selection will use weight, volume, stops and access constraints.</span></div>
          <div><b>Live location</b><span>GPS, driver location, ETA and proof of delivery require the production backend.</span></div>
        </div>
      </section>
    </div>`,
   'Tracking'
 );
 queueMicrotask(()=>document.querySelector('#tracking-search')?.addEventListener('submit',e=>{
   e.preventDefault();
   const value=new FormData(e.target).get('id');
   location.hash='#/track-order/'+encodeURIComponent(String(value||''));
 }));
 return html;
}
