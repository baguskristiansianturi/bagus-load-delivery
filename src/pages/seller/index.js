import './seller.css';
import { supabase } from '../../lib/supabase/client.js';


const money = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeStore = null;
let activeTab = 'overview';

function shell(content,user=null){
 return `<main class="pluits-shell">
  <header class="pluits-top"><a class="pluits-brand" href="#/">PLUITS<span>INDONESIA</span></a><div>${user?'<a href="#/account/compose" class="pluits-ghost">Buat konten</a> <a href="#/account/profile" class="pluits-ghost">Akun Pluits</a> <button id="pluits-signout" class="pluits-ghost">Keluar</button>':'<a href="#/" class="pluits-ghost">Kembali ke beranda</a>'}</div></header>
  ${content}
  <footer class="pluits-foot">PLUITS · Platform perdagangan dan kebutuhan konstruksi</footer>
 </main>`;
}
function notice(msg,type='info'){const el=document.querySelector('#pluits-notice');if(el){el.textContent=msg;el.className='pluits-notice '+type;}}
function authView(mode='login'){
 const signup=mode==='register';
 document.querySelector('#app').innerHTML=shell(`
 <section class="pluits-auth">
  <div class="pluits-auth-intro"><span class="pluits-eyebrow">PLUITS SELLER CENTER</span><h1>${signup?'Buat akun Pluits':'Selamat datang kembali'}</h1><p>${signup?'Daftarkan akun pribadi Anda. Setelah masuk, Anda dapat membuat toko dan mengelola bisnisnya.':'Masuk untuk mengelola toko, katalog, persediaan, dan operasional bisnis Anda.'}</p><div class="pluits-auth-points"><span>✓ Akun pribadi pemilik toko</span><span>✓ Dashboard khusus setiap toko</span><span>✓ Kelola katalog dan gambar produk</span></div></div>
  <form id="pluits-auth-form" class="pluits-panel pluits-form">
   <h2>${signup?'Daftar akun':'Masuk akun'}</h2>
   ${signup?'<label>Nama lengkap<input name="full_name" autocomplete="name" required placeholder="Nama sesuai identitas"></label>':''}
   <label>Email<input name="email" type="email" autocomplete="email" required placeholder="nama@email.com"></label>
   <label>Password<input name="password" type="password" minlength="8" autocomplete="${signup?'new-password':'current-password'}" required placeholder="Minimal 8 karakter"></label>
   <button class="pluits-primary" type="submit">${signup?'Buat akun':'Masuk'}</button><p id="pluits-notice" class="pluits-notice"></p>
   <p class="pluits-switch">${signup?'Sudah punya akun?':'Belum punya akun?'} <a href="#/seller/${signup?'login':'register'}">${signup?'Masuk':'Daftar sekarang'}</a></p>
  </form>
 </section>`,null);
 document.querySelector('#pluits-auth-form').addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(e.currentTarget),email=f.get('email'),password=f.get('password');
  const btn=e.currentTarget.querySelector('button');btn.disabled=true;btn.textContent='Memproses…';
  try{
   let result;
   if(signup) result=await supabase.auth.signUp({email,password,options:{data:{full_name:f.get('full_name')}}});
   else result=await supabase.auth.signInWithPassword({email,password});
   if(result.error)throw result.error;
   if(signup && !result.data.session){notice('Akun berhasil dibuat. Periksa email untuk konfirmasi, lalu masuk kembali.','success');}
   else await renderSeller();
  }catch(err){notice(err.message||'Tidak dapat memproses akun.','error');}
  finally{btn.disabled=false;btn.textContent=signup?'Buat akun':'Masuk';}
 });
}
async function renderSeller(preferredStoreId=null){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){authView(location.hash.includes('register')?'register':'login');return;}
 const {data:stores,error}=await supabase.from('stores').select('id,name,username,business_type,store_status,verification_status,online_sales_enabled,legal_name,email,full_address,public_city,public_area,phone,description,store_logo_path,store_banner_path,created_at').order('created_at',{ascending:true});
 if(error){document.querySelector('#app').innerHTML=shell('<div class="pluits-panel"><h2>Dashboard belum dapat dimuat</h2><p>'+esc(error.message)+'</p></div>',session.user);return;}
 if(!stores?.length){storeOnboarding(session.user);return;}
 activeStore=stores.find(store=>store.id===preferredStoreId)||stores[0];
 await dashboard(session.user,stores);
}
function storeOnboarding(user,isAdditional=false){
 document.querySelector('#app').innerHTML=shell(`
 <section class="pluits-pagehead"><span class="pluits-eyebrow">LANGKAH 1 · PROFIL BISNIS</span><h1>${isAdditional?'Daftarkan toko baru':'Buat toko pertama Anda'}</h1><p>Akun ini otomatis menjadi pemilik toko. Anda dapat menambahkan staf setelah tahap pengujian awal.</p></section>
 <form id="pluits-store-form" class="pluits-panel pluits-store-form">
  <div class="pluits-form-grid">
   <label>Nama toko / nama dagang<input name="name" required placeholder="Contoh: Sinar Bangunan"></label>
   <label>Username toko<input name="username" required minlength="3" maxlength="40" pattern="[a-z0-9][a-z0-9-]{2,39}" placeholder="sinar-bangunan"><small>URL toko: pluits.id/t/username (alamat sementara akan disesuaikan)</small></label>
   <label>Jenis usaha<select name="business_type" required><option value="">Pilih jenis usaha</option><option value="individual">Usaha perorangan</option><option value="umkm">UMKM</option><option value="family_business">Usaha keluarga</option><option value="cooperative">Koperasi</option><option value="company">Perusahaan</option></select></label>
   <label>Bentuk hukum (opsional)<select name="legal_form"><option value="">Belum ada / tidak dicantumkan</option><option>PT</option><option>CV</option><option>UD</option><option>Koperasi</option><option>Yayasan</option><option>Lainnya</option></select></label>
   <label>Nama legal (opsional)<input name="legal_name" placeholder="Jika berbeda dari nama toko"></label>
   <label>Nomor WhatsApp / telepon<input name="phone" required type="tel" placeholder="08xxxxxxxxxx"></label>
   <label>Email toko<input name="email" type="email" placeholder="opsional"></label>
   <label>Kota<input name="city" required value="Denpasar"></label>
   <label>Kecamatan / area<input name="area" placeholder="Contoh: Denpasar Barat"></label>
   <label class="pluits-span">Alamat fisik / operasional<input name="address" required minlength="8" placeholder="Alamat lokasi usaha untuk verifikasi"></label>
  </div>
  <div class="pluits-form-actions"><p id="pluits-notice" class="pluits-notice"></p><button class="pluits-primary" type="submit">Buat toko dan buka dashboard <span>→</span></button></div>
 </form>`,user);
 document.querySelector('#pluits-store-form').addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(e.currentTarget),btn=e.currentTarget.querySelector('button');btn.disabled=true;btn.textContent='Membuat toko…';
  try{
   const {data,error}=await supabase.rpc('create_store',{p_name:f.get('name'),p_username:f.get('username').toLowerCase(),p_business_type:f.get('business_type'),p_phone:f.get('phone'),p_city:f.get('city'),p_area:f.get('area')||null,p_legal_name:f.get('legal_name')||null,p_email:f.get('email')||null,p_full_address:f.get('address')});
   if(error)throw error;await renderSeller(data);
  }catch(err){notice(err.message||'Toko belum dapat dibuat.','error');}
  finally{btn.disabled=false;btn.innerHTML='Buat toko dan buka dashboard <span>→</span>';}
 });
}
async function dashboard(user,stores){
 const tabs=[['overview','Ringkasan'],['orders','Pesanan'],['products','Produk & gambar'],['categories','Kategori'],['inventory','Persediaan'],['delivery','Pengiriman'],['profile','Profil toko'],['settings','Pengaturan']];
 const nav=tabs.map(([id,label])=>`<button data-tab="${id}" class="${activeTab===id?'active':''}">${label}</button>`).join('');
 const {count:productCount}=await supabase.from('products').select('*',{count:'exact',head:true}).eq('store_id',activeStore.id);
 const {count:categoryCount}=await supabase.from('product_categories').select('*',{count:'exact',head:true}).eq('store_id',activeStore.id);
 let body='';
 if(activeTab==='overview')body=`<div class="pluits-stat-grid"><article><span>Produk</span><strong>${productCount||0}</strong><small>Data katalog toko</small></article><article><span>Kategori</span><strong>${categoryCount||0}</strong><small>Pengelompokan produk</small></article><article><span>Status toko</span><strong class="pluits-status">${esc(activeStore.store_status)}</strong><small>Verifikasi: ${esc(activeStore.verification_status)}</small></article></div><div class="pluits-panel pluits-welcome"><span class="pluits-eyebrow">WORKSPACE TOKO</span><h2>${esc(activeStore.name)}</h2><p>Kelola data bisnis dari satu dashboard. Mulai dengan melengkapi profil, kategori, produk, harga, stok, dan foto produk.</p><div class="pluits-shortcuts"><button data-tab="profile">Lengkapi profil →</button><button data-tab="categories">Buat kategori →</button><button data-tab="products">Tambah produk →</button></div></div>`;
 if(activeTab==='orders')body=await ordersPanel();
  if(activeTab==='products')body=await productsPanel();
 if(activeTab==='categories')body=await categoriesPanel();
 if(activeTab==='inventory')body=await inventoryPanel();
 if(activeTab==='delivery')body=await deliveryPanel();
 if(activeTab==='profile')body=profilePanel();
 if(activeTab==='settings')body=await settingsPanel();
 document.querySelector('#app').innerHTML=shell(`
 <section class="pluits-dashboard-head"><div><span class="pluits-eyebrow">SELLER WORKSPACE</span><h1>${esc(activeStore.name)}</h1><p>@${esc(activeStore.username)} · ${esc(activeStore.business_type)} · ${esc(activeStore.public_city)}</p></div><span class="pluits-owner-pill">OWNER ACCOUNT</span></section><p id="pluits-notice" class="pluits-notice" role="status" aria-live="polite"></p>
 <div class="pluits-dashboard"><aside class="pluits-sidebar"><div class="pluits-user"><b>${esc(user.user_metadata?.full_name||user.email)}</b><small>${esc(user.email)}</small></div><nav>${nav}</nav><div class="pluits-sidebar-foot">PLUITS INDONESIA<br><small>Seller Center v0.1</small></div></aside><section class="pluits-content">${body}</section></div><nav class="pluits-mobile-tabs" aria-label="Menu Seller Center">${nav}</nav>`,user);
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.tab;dashboard(user,stores)}));
 const storeHead=document.querySelector('.pluits-dashboard-head');
 if(storeHead){
  const tools=document.createElement('div');tools.className='pluits-dashboard-tools';
  if(stores.length>1){
   const select=document.createElement('select');select.setAttribute('aria-label','Pilih toko');
   stores.forEach(store=>{const option=document.createElement('option');option.value=store.id;option.textContent=store.name;option.selected=store.id===activeStore.id;select.append(option);});
   select.addEventListener('change',()=>{const nextStore=stores.find(store=>store.id===select.value);if(nextStore){activeStore=nextStore;activeTab='overview';dashboard(user,stores);}});
   tools.append(select);
  }
  const addStore=document.createElement('button');addStore.type='button';addStore.className='pluits-ghost';addStore.textContent='+ Buat toko baru';
  addStore.addEventListener('click',()=>storeOnboarding(user,true));tools.append(addStore);storeHead.append(tools);
 }
 document.querySelector('#pluits-signout')?.addEventListener('click',async()=>{await supabase.auth.signOut();location.hash='/seller/login';renderSeller();});
 bindPanel(user,stores);
}
async function productsPanel(){
 const {data:products}=await supabase.from('products').select('id,name,status,created_at,product_variants(online_price,stock_quantity,sale_unit),product_images(storage_path)').eq('store_id',activeStore.id).order('created_at',{ascending:false});
 const rows=await Promise.all((products||[]).map(async p=>{
  const paths=(p.product_images||[]).map(image=>image.storage_path).filter(Boolean);
  const signedImages=await Promise.all(paths.map(async path=>{const {data}=await supabase.storage.from('pluits-store-media').createSignedUrl(path,1800);return data?.signedUrl||'';}));
  const galleryHtml=signedImages.filter(Boolean).map((image,index)=>'<img src="'+image+'" alt="'+esc(p.name)+' foto '+(index+1)+'" loading="lazy">').join('');
  return `<article class="pluits-product-row">${galleryHtml?'<div class="pluits-product-gallery" aria-label="Galeri foto produk">'+galleryHtml+'</div>':'<span class="pluits-thumb empty">＋</span>'}<div><b>${esc(p.name)}</b><small>${esc(p.status)} · ${p.product_variants?.length||0} varian · ${paths.length} foto</small></div><strong>${p.product_variants?.length?money(p.product_variants[0].online_price):'Belum ada harga'}</strong>${p.status==='published'?'<button data-product-archive="'+p.id+'">Arsipkan</button>':p.status==='archived'?'<span class="pluits-product-state">Diarsipkan</span>':'<button data-product-publish="'+p.id+'" '+(activeStore.store_status!=='active'||activeStore.verification_status!=='verified'||!activeStore.online_sales_enabled?'disabled':'')+'>Publikasikan</button>'}</article>`;
 })).then(x=>x.join(''));
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">CATALOG MANAGEMENT</span><h2>Produk & gambar</h2><p>Tambahkan produk, varian, harga, stok, dan foto.</p></div></div><details class="pluits-quick-add"><summary>＋ Tambah produk baru</summary><form id="pluits-product-form" class="pluits-panel pluits-form"><div class="pluits-form-grid"><label>Nama produk<input name="name" required placeholder="Contoh: Semen Portland 40 kg"></label><label>Kategori<select name="category_id" id="pluits-category-select"><option value="">Tanpa kategori</option></select></label><label>Harga jual (Rp)<input name="price" required type="number" min="0" step="1" value="0"></label><label>Stok awal<input name="stock" type="number" min="0" step="0.001" value="0"></label><label class="pluits-image-picker">Foto produk (maks. 15)<input id="pluits-product-images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple><small>Pilih hingga 15 foto · Maksimal 10 MB per foto.</small></label><div id="pluits-image-preview" class="pluits-image-preview" aria-live="polite"></div><label>Satuan<input name="unit" required value="pcs"></label><details class="pluits-advanced-fields"><summary>Detail tambahan (opsional)</summary><div class="pluits-form-grid"><label>SKU / kode produk<input name="sku" placeholder="SKU-001"></label><label>Harga offline (Rp)<input name="offline" type="number" min="0" step="1"></label><label class="pluits-span">Deskripsi<textarea name="description" rows="3" placeholder="Spesifikasi, ukuran, merek, dan keterangan produk"></textarea></label></div></details></div><div class="pluits-form-actions"><p id="pluits-notice" class="pluits-notice"></p><button class="pluits-primary" type="submit">Simpan produk</button></div></form></details><div class="pluits-list-head"><h3>Daftar produk</h3><span>${products?.length||0} produk</span></div><div class="pluits-product-list">${rows||'<div class="pluits-empty">Belum ada produk. Tambahkan produk pertama toko Anda.</div>'}</div>`;
}
async function categoriesPanel(){
 const {data}=await supabase.from('product_categories').select('id,name,is_active').eq('store_id',activeStore.id).order('name');
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">CATALOG STRUCTURE</span><h2>Kategori produk</h2><p>Susun kategori sesuai jenis material dan barang toko.</p></div></div><form id="pluits-category-form" class="pluits-panel pluits-inline-form"><label>Nama kategori<input name="name" required placeholder="Contoh: Besi & Baja"></label><button class="pluits-primary">Tambah kategori</button></form><div class="pluits-product-list">${(data||[]).map(c=>`<article class="pluits-product-row"><span class="pluits-category-icon">▦</span><div><b>${esc(c.name)}</b><small>${c.is_active?'Aktif':'Nonaktif'}</small></div></article>`).join('')||'<div class="pluits-empty">Belum ada kategori.</div>'}</div>`;
}
async function inventoryPanel(){
 const {data}=await supabase.from('products').select('id,name,product_variants(id,sku,variant_name,stock_quantity,sale_unit)').eq('store_id',activeStore.id);
 const rows=(data||[]).flatMap(p=>(p.product_variants||[]).map(v=>`<article class="pluits-product-row"><span class="pluits-category-icon">▤</span><div><b>${esc(p.name)} · ${esc(v.variant_name)}</b><small>${esc(v.sku||'Tanpa SKU')} · ${esc(v.sale_unit)}</small></div><strong>${v.stock_quantity}</strong></article>`)).join('');
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">INVENTORY</span><h2>Persediaan</h2><p>Pantau stok produk dan varian. Riwayat pergerakan stok akan dikembangkan pada tahap berikutnya.</p></div></div><div class="pluits-product-list">${rows||'<div class="pluits-empty">Belum ada varian produk untuk ditampilkan.</div>'}</div>`;
}
async function deliveryPanel(){
 const {data}=await supabase.from('store_delivery_zones').select('*').eq('store_id',activeStore.id);
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">FULFILLMENT</span><h2>Pengiriman & area layanan</h2><p>Atur cakupan area, minimum pesanan, ongkir, dan hari layanan toko.</p></div></div><form id="pluits-zone-form" class="pluits-panel pluits-form"><div class="pluits-form-grid"><label>Nama area layanan<input name="name" required placeholder="Denpasar dan sekitarnya"></label><label>Deskripsi cakupan<input name="coverage" placeholder="Denpasar Barat, Utara, Selatan"></label><label>Minimum pesanan (Rp)<input name="minimum" type="number" min="0" value="0"></label><label>Ongkos kirim (Rp)<input name="fee" type="number" min="0" placeholder="Kosongkan jika perlu konfirmasi"></label><label>Gratis ongkir mulai (Rp)<input name="free" type="number" min="0"></label><label>Maksimum jarak (km)<input name="distance" type="number" min="0" step="0.1"></label></div><div class="pluits-form-actions"><p id="pluits-notice" class="pluits-notice"></p><button class="pluits-primary">Simpan area pengiriman</button></div></form><div class="pluits-product-list">${(data||[]).map(z=>`<article class="pluits-product-row"><span class="pluits-category-icon">⌖</span><div><b>${esc(z.name)}</b><small>${esc(z.coverage_description||'')}</small></div><strong>${z.delivery_fee==null?'Konfirmasi':money(z.delivery_fee)}</strong></article>`).join('')||'<div class="pluits-empty">Belum ada area pengiriman.</div>'}</div>`;
}
function profilePanel(){
 const verification=activeStore.verification_status==='verified'?'Toko sudah terverifikasi.':activeStore.verification_status==='pending'?'Verifikasi toko sedang ditinjau.':'Lengkapi data legal lalu ajukan pemeriksaan manual.';
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">BUSINESS PROFILE</span><h2>Profil toko</h2><p>Informasi publik dan data legal untuk pemeriksaan Pluits.</p></div></div><form id="pluits-profile-form" class="pluits-panel pluits-form"><div class="pluits-form-grid"><label>Nama toko<input name="name" required value="${esc(activeStore.name)}"></label><label>Username toko<input value="${esc(activeStore.username)}" disabled></label><label>Kota<input name="public_city" required value="${esc(activeStore.public_city)}"></label><label>Area publik<input name="public_area" value="${esc(activeStore.public_area||"")}"></label><label>Telepon toko<input name="phone" required value="${esc(activeStore.phone||"")}"></label><label>Nama legal perusahaan<input name="legal_name" required value="${esc(activeStore.legal_name||"")}"></label><label>Email verifikasi<input name="verification_email" type="email" required value="${esc(activeStore.email||"")}"></label><label class="pluits-span">Alamat lengkap usaha<input name="full_address" required value="${esc(activeStore.full_address||"")}"></label><label>Status toko<input value="${esc(activeStore.store_status)}" disabled></label><label>Verifikasi<input value="${esc(activeStore.verification_status)}" disabled></label><label class="pluits-span">Deskripsi toko<textarea name="description" rows="3">${esc(activeStore.description||"")}</textarea></label></div><div class="pluits-form-actions"><p id="pluits-notice" class="pluits-notice"></p><button class="pluits-primary">Simpan profil</button></div></form><div class="pluits-panel pluits-note"><b>Status verifikasi</b><p>${verification}</p>${activeStore.verification_status==='pending'?'<small>Permohonan sedang menunggu pemeriksaan moderator.</small>':activeStore.verification_status==='verified'?'<small>Anda dapat mengaktifkan penjualan online dari Pengaturan toko.</small>':'<button type="button" class="pluits-primary" id="pluits-submit-verification">Ajukan verifikasi toko</button>'}</div>`;
}
async function settingsPanel(){
 const {data}=await supabase.from('store_settings').select('*').eq('store_id',activeStore.id).single();
 return `<div class="pluits-section-head"><div><span class="pluits-eyebrow">STORE SETTINGS</span><h2>Pengaturan toko</h2><p>Atur preferensi operasional dasar.</p></div></div><form id="pluits-settings-form" class="pluits-panel pluits-form"><div class="pluits-form-grid"><label>Mata uang<input value="IDR — Rupiah Indonesia" disabled></label><label>Zona waktu<input value="Asia/Makassar" disabled></label><label>Minimum transaksi (Rp)<input name="minimum" type="number" min="0" value="${data?.minimum_order_amount||0}"></label><label class="pluits-check"><input name="pickup" type="checkbox" ${data?.allow_pickup?'checked':''}> Melayani pengambilan langsung</label><label class="pluits-check"><input name="delivery" type="checkbox" ${data?.allow_delivery?'checked':''}> Melayani pengiriman</label><label>Status penjualan online<input value="${activeStore.online_sales_enabled?'Aktif':'Nonaktif'}" disabled><small>Aktivasi dikelola melalui RPC owner-guarded setelah toko aktif dan terverifikasi.</small></label></div><div class="pluits-form-actions"><p id="pluits-notice" class="pluits-notice"></p><button class="pluits-primary">Simpan pengaturan</button></div></form><div class="pluits-panel pluits-note"><b>Catatan aktivasi</b><p>Penjualan online hanya dapat diaktifkan setelah toko berstatus aktif dan terverifikasi oleh Pluits. Pembayaran saat ini diperiksa secara manual oleh pemilik atau bagian keuangan.</p></div>`;
}
async function ordersPanel(){
 const {data,error}=await supabase.from('marketplace_orders').select('id,order_number,status,payment_status,total_amount,buyer_name,buyer_phone,delivery_method,delivery_address,created_at,marketplace_order_items(product_name,variant_name,quantity,line_total),marketplace_payment_records(id,payment_method,payer_reference,status,created_at)').eq('store_id',activeStore.id).order('created_at',{ascending:false}).limit(50);
 if(error)return '<div class="pluits-panel"><h2>Pesanan belum dapat dimuat</h2><p>'+esc(error.message)+'</p></div>';
 const rows=(data||[]).map(o=>{const pay=o.marketplace_payment_records?.[0];let actions='';if(o.status==='payment_review'&&pay?.status==='submitted')actions='<button data-payment-verify="'+pay.id+'">Verifikasi pembayaran</button><button data-payment-reject="'+pay.id+'">Tolak pembayaran</button>';if(o.status==='paid')actions='<button data-order-next="'+o.id+'" data-next="processing">Proses pesanan</button>';if(o.status==='processing')actions='<button data-order-next="'+o.id+'" data-next="'+(o.delivery_method==='pickup'?'ready_for_pickup':'shipped')+'">'+(o.delivery_method==='pickup'?'Siap diambil':'Kirim pesanan')+'</button>';if(['ready_for_pickup','shipped'].includes(o.status))actions='<button data-order-next="'+o.id+'" data-next="completed">Tandai selesai</button>';return '<article class="pluits-order-card"><header><b>'+esc(o.order_number)+'</b><span>'+esc(o.status.replaceAll('_',' '))+'</span></header><p>'+esc(o.buyer_name)+' · '+esc(o.buyer_phone)+'</p><small>'+esc(o.delivery_method)+' · '+new Date(o.created_at).toLocaleString('id-ID')+'</small><div>'+((o.marketplace_order_items||[]).map(i=>'<p>'+esc(i.product_name)+' × '+esc(i.quantity)+' <b>'+money(i.line_total)+'</b></p>').join(''))+'</div><strong>'+money(o.total_amount)+'</strong>'+(pay?'<p class="pluits-order-payment">Pembayaran: '+esc(pay.payment_method)+' · '+esc(pay.payer_reference||'Tanpa referensi')+'</p>':'')+'<footer>'+actions+'</footer></article>';}).join('');
 return '<div class="pluits-section-head"><div><span class="pluits-eyebrow">ORDER MANAGEMENT</span><h2>Pesanan masuk</h2><p>Periksa referensi transfer sebelum mengesahkan pembayaran. Stok baru dikurangi setelah verifikasi berhasil.</p></div></div><div class="pluits-order-list">'+(rows||'<div class="pluits-empty">Belum ada pesanan masuk.</div>')+'</div>';
}
async function bindPanel(user,stores){
 const verifyButton=document.querySelector('#pluits-submit-verification');
 if(verifyButton)verifyButton.addEventListener('click',async()=>{
  verifyButton.disabled=true;verifyButton.textContent='Mengirim permohonan…';
  try{
   const {error}=await supabase.rpc('submit_store_for_verification',{p_store_id:activeStore.id});
   if(error)throw error;
   await renderSeller();
   notice('Permohonan verifikasi berhasil dikirim. Toko menunggu pemeriksaan Pluits.','success');
  }catch(err){notice(err.message||'Permohonan verifikasi belum dapat dikirim.','error');verifyButton.disabled=false;verifyButton.textContent='Ajukan verifikasi toko';}
 });
 const categorySelect=document.querySelector('#pluits-category-select');
 if(categorySelect){const {data}=await supabase.from('product_categories').select('id,name').eq('store_id',activeStore.id);(data||[]).forEach(c=>categorySelect.insertAdjacentHTML('beforeend',`<option value="${c.id}">${esc(c.name)}</option>`));}
 const form=document.querySelector('#pluits-product-form');
 const imageInput=document.querySelector('#pluits-product-images');
 const imagePreview=document.querySelector('#pluits-image-preview');
 let previewUrls=[];
 const clearImagePreview=()=>{previewUrls.forEach(url=>URL.revokeObjectURL(url));previewUrls=[];if(imagePreview)imagePreview.innerHTML='';};
 imageInput?.addEventListener('change',()=>{
  clearImagePreview();
  const files=Array.from(imageInput.files||[]);
  if(files.length>15){notice('Pilih maksimal 15 foto untuk satu produk.','error');imageInput.value='';return;}
  const invalid=files.find(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024);
  if(invalid){notice(invalid.size>10*1024*1024?'Setiap foto maksimal 10 MB.':'Gunakan foto JPG, PNG, atau WebP.','error');imageInput.value='';return;}
  if(!files.length)return;
  imagePreview.innerHTML=files.map((file,index)=>{
   const url=URL.createObjectURL(file);previewUrls.push(url);
   return '<figure><img src="'+url+'" alt="Pratinjau foto '+(index+1)+'"><figcaption>'+(index+1)+'. '+esc(file.name)+'</figcaption></figure>';
  }).join('');
  notice(files.length+' foto siap diunggah.','info');
 });
 if(form)form.addEventListener('submit',async e=>{
  e.preventDefault();
  const f=new FormData(form),btn=form.querySelector('button[type="submit"]'),files=Array.from(imageInput?.files||[]);
  if(files.length>15){notice('Pilih maksimal 15 foto.','error');return;}
  const invalid=files.find(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024);
  if(invalid){notice(invalid.size>10*1024*1024?'Setiap foto maksimal 10 MB.':'Format foto tidak didukung.','error');return;}
  btn.disabled=true;btn.textContent='Menyimpan produk…';
  let createdProductId=null,uploadedPaths=[];
  try{
   const {data:p,error}=await supabase.from('products').insert({store_id:activeStore.id,name:f.get('name'),category_id:f.get('category_id')||null,description:f.get('description')||null,status:'draft'}).select().single();
   if(error)throw error;createdProductId=p.id;
   const {error:ve}=await supabase.from('product_variants').insert({product_id:p.id,sku:f.get('sku')||null,variant_name:'Default',sale_unit:f.get('unit'),online_price:Number(f.get('price')),offline_price:f.get('offline')?Number(f.get('offline')):null,stock_quantity:Number(f.get('stock'))});
   if(ve)throw ve;
   for(let index=0;index<files.length;index++){
    const file=files[index],random=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);
    const path=activeStore.id+'/'+p.id+'/'+random+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const {error:up}=await supabase.storage.from('pluits-store-media').upload(path,file,{contentType:file.type,upsert:false});
    if(up)throw new Error('Foto ke-'+(index+1)+' gagal diunggah: '+up.message);
    uploadedPaths.push(path);
   }
   if(uploadedPaths.length){
    const imageRows=uploadedPaths.map((path,index)=>({product_id:p.id,storage_path:path,alt_text:String(f.get('name')),sort_order:index}));
    const {error:im}=await supabase.from('product_images').insert(imageRows);
    if(im)throw new Error('Foto sudah diunggah tetapi data galeri gagal disimpan: '+im.message);
   }
   notice(files.length?'Produk dan '+files.length+' foto berhasil disimpan.':'Produk berhasil disimpan tanpa foto.','success');
   activeTab='products';await dashboard(user,stores);
  }catch(err){
   let cleanupFailed=false;
   if(uploadedPaths.length){const {error}=await supabase.storage.from('pluits-store-media').remove(uploadedPaths);if(error)cleanupFailed=true;}
   if(createdProductId){
    await supabase.from('product_images').delete().eq('product_id',createdProductId);
    await supabase.from('product_variants').delete().eq('product_id',createdProductId);
    const {error}=await supabase.from('products').delete().eq('id',createdProductId);if(error)cleanupFailed=true;
   }
   notice((err.message||'Produk gagal disimpan.')+(cleanupFailed?' Pembersihan data parsial perlu diperiksa dari Seller Center.':' Data parsial berhasil dibersihkan.'),'error');
  }finally{
   btn.disabled=false;btn.textContent='Simpan produk';
  }
 }); const cf=document.querySelector('#pluits-category-form');if(cf)cf.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(cf);const {error}=await supabase.from('product_categories').insert({store_id:activeStore.id,name:f.get('name')});if(error)notice(error.message,'error');else await dashboard(user,stores);});
 const zf=document.querySelector('#pluits-zone-form');if(zf)zf.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(zf);const {error}=await supabase.from('store_delivery_zones').insert({store_id:activeStore.id,name:f.get('name'),coverage_description:f.get('coverage'),minimum_order_amount:Number(f.get('minimum')||0),delivery_fee:f.get('fee')===''?null:Number(f.get('fee')),free_delivery_minimum:f.get('free')===''?null:Number(f.get('free')),max_distance_km:f.get('distance')===''?null:Number(f.get('distance'))});if(error)notice(error.message,'error');else await dashboard(user,stores);});
 const pf=document.querySelector('#pluits-profile-form');if(pf)pf.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(pf);const {error}=await supabase.rpc('update_store_profile',{p_store_id:activeStore.id,p_name:f.get('name'),p_city:f.get('public_city'),p_area:f.get('public_area')||null,p_description:f.get('description')||null,p_phone:f.get('phone')||null});if(error){notice(error.message,'error');return;}const {error:ve}=await supabase.rpc('update_store_verification_details',{p_store_id:activeStore.id,p_legal_name:f.get('legal_name'),p_email:f.get('verification_email'),p_full_address:f.get('full_address')});if(ve){notice(ve.message,'error');return;}activeStore.name=f.get('name');activeStore.public_city=f.get('public_city');activeStore.public_area=f.get('public_area');activeStore.phone=f.get('phone');activeStore.description=f.get('description');activeStore.legal_name=f.get('legal_name');activeStore.email=f.get('verification_email');activeStore.full_address=f.get('full_address');notice('Profil toko diperbarui.','success');});
 const sf=document.querySelector('#pluits-settings-form');if(sf)sf.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(sf);const {error}=await supabase.from('store_settings').update({minimum_order_amount:Number(f.get('minimum')||0),allow_pickup:f.get('pickup')==='on',allow_delivery:f.get('delivery')==='on'}).eq('store_id',activeStore.id);if(error)notice(error.message,'error');else notice('Pengaturan operasional tersimpan. Status penjualan online tidak diubah dari formulir ini.','success');});
 const runAction=async(btn,operation,successMessage)=>{const label=btn.textContent;btn.disabled=true;btn.textContent='Memproses…';try{const {error,data}=await operation();if(error)throw error;if(data===null)throw new Error('Perubahan tidak tersimpan atau akses tidak diizinkan.');await dashboard(user,stores);notice(successMessage,'success');}catch(err){notice(err.message||'Aksi belum berhasil.','error');btn.disabled=false;btn.textContent=label;}};
 document.querySelectorAll('[data-product-publish]').forEach(btn=>btn.addEventListener('click',()=>runAction(btn,()=>supabase.rpc('publish_marketplace_product',{p_product_id:btn.dataset.productPublish}),'Produk berhasil dipublikasikan.')));
 document.querySelectorAll('[data-product-archive]').forEach(btn=>btn.addEventListener('click',()=>runAction(btn,()=>supabase.from('products').update({status:'archived'}).eq('id',btn.dataset.productArchive).select('id').maybeSingle(),'Produk berhasil diarsipkan.')));
 document.querySelectorAll('[data-payment-verify]').forEach(btn=>btn.addEventListener('click',()=>runAction(btn,()=>supabase.rpc('review_marketplace_payment',{p_payment_id:btn.dataset.paymentVerify,p_decision:'verified',p_note:''}),'Pembayaran ditandai terverifikasi.')));
 document.querySelectorAll('[data-payment-reject]').forEach(btn=>btn.addEventListener('click',()=>runAction(btn,()=>supabase.rpc('review_marketplace_payment',{p_payment_id:btn.dataset.paymentReject,p_decision:'rejected',p_note:''}),'Pembayaran ditolak.')));
 document.querySelectorAll('[data-order-next]').forEach(btn=>btn.addEventListener('click',()=>runAction(btn,()=>supabase.rpc('update_marketplace_fulfillment',{p_order_id:btn.dataset.orderNext,p_next_status:btn.dataset.next,p_note:''}),'Status pesanan berhasil diperbarui.')));
}
export async function sellerPage(){
 const path=location.hash.toLowerCase();
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){authView(path.includes('register')?'register':'login');return;}
 await renderSeller();
}
