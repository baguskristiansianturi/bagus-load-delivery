import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {store} from '../../app/store.js';
import {shell,card,bind,pageHeading,icon} from '../../app/ui.js';
const db=createClient('https://ytndswhqxayqpftszwfh.supabase.co','sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function bindDirectorySaved(){
 const target=document.querySelector('#pl-saved-directory');if(!target)return;
 const {data:auth}=await db.auth.getUser();
 if(!auth?.user){target.innerHTML='<p>Masuk untuk menyimpan dan menyinkronkan tempat ke akun Pluits.</p><a href="#/account/login">Masuk ke Pluits →</a>';return;}
 const {data:saved,error}=await db.from('user_saved_items').select('target_id,created_at').eq('user_id',auth.user.id).eq('target_type','entity').order('created_at',{ascending:false});
 if(error){target.textContent='Tempat tersimpan belum dapat dimuat.';return;}
 const ids=(saved||[]).map(x=>x.target_id);
 if(!ids.length){target.innerHTML='<p>Tempat yang Anda simpan akan tampil di sini.</p>';return;}
 const {data:places}=await db.from('directory_entities').select('id,name,slug,summary').in('id',ids).eq('status','published');
 target.innerHTML=(places||[]).map(x=>'<a class="pl-saved-place" href="#/place/'+encodeURIComponent(x.slug)+'"><b>'+esc(x.name)+'</b><span>'+esc(x.summary||'Tempat di GeoDirectory Pluits')+'</span><i>→</i></a>').join('')||'<p>Belum ada tempat tersimpan.</p>';
}
export function wishlist(){
 const a=store.getWishlist();
 const h=shell(
  '<div class="wishlist-page">'+
  pageHeading('SAVED','Your wishlist','Save materials and places you want to return to.','<a class="primary-button" href="#/material">'+icon.arrow+' Continue shopping</a>')+
  (a.length?'<div class="wishlist-toolbar"><b>'+a.length+' saved item'+(a.length>1?'s':'')+'</b><span>Compare price, supplier and availability on each product page.</span></div><div class="catalog-grid wishlist-grid">'+a.map(card).join('')+'</div>':'<div class="empty-state large"><h2>Your product wishlist is empty</h2><p>Tap the heart on a product to save it here.</p><a class="primary-button" href="#/material">Explore materials</a></div>')+
  '<section class="pl-saved-directory-section"><h2>Tempat tersimpan</h2><div id="pl-saved-directory"><p>Memuat tempat tersimpan…</p></div></section>'+
  '</div>','Wishlist');
 queueMicrotask(()=>{bind();bindDirectorySaved();});
 return h;
}