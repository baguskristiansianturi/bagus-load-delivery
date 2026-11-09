import { supabase as db } from '../../lib/supabase/client.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function moderationPage(){
 return `<main class="pl-mod"><header><a href="#/">PLUITS <span>MODERATION</span></a><a href="#/account/profile">Kembali ke akun</a></header><section><small>TRUST & SAFETY</small><h1>Moderation Center</h1><p>Antrean laporan konten, akun, entitas GeoDirectory, dan pengumuman resmi Pluits.</p>
 <div class="pl-mod-section"><h2>Pembaruan sistem Pluits</h2><div id="pl-mod-announcements">Memuat pengumuman…</div></div>
 <div class="pl-mod-section"><h2>Verifikasi toko</h2><div id="pl-mod-stores">Memuat permohonan toko…</div></div>
 <div class="pl-mod-section"><h2>Laporan konten</h2><div id="pl-mod-list">Memuat laporan…</div></div></section></main>`;
}
export async function bindModerationPage(){
 const el=document.querySelector('#pl-mod-list');if(!el)return;
 const {data:{user}}=await db.auth.getUser(),role=user?.app_metadata?.role;
 if(!['admin','moderator'].includes(role)){
  el.innerHTML='<div class="pl-mod-empty">Akses moderator diperlukan. Halaman ini tidak tersedia untuk akun biasa.</div>';
  document.querySelector('#pl-mod-announcements').textContent='Akses moderator diperlukan.';
  document.querySelector('#pl-mod-stores').textContent='Akses moderator diperlukan.';
  return;
 }
 await loadSystemAnnouncements(user);
 const storesEl=document.querySelector('#pl-mod-stores');
 const {data:stores,error:storeError}=await db.from('stores').select('id,name,username,legal_name,email,phone,full_address,public_city,store_status,verification_status').eq('store_status','pending_review').eq('verification_status','pending').order('created_at',{ascending:true});
 if(storeError)storesEl.textContent=storeError.message;
 else{
  storesEl.innerHTML=stores?.length?stores.map(st=>'<article class="pl-mod-report"><header><b>'+esc(st.name)+' · @'+esc(st.username)+'</b><span>Menunggu verifikasi</span></header><p>'+esc(st.legal_name)+' · '+esc(st.email)+' · '+esc(st.phone)+'</p><p>'+esc(st.full_address)+' · '+esc(st.public_city)+'</p><footer><button data-store-review="'+st.id+'" data-decision="verified">Verifikasi toko</button><button data-store-review="'+st.id+'" data-decision="rejected">Tolak permohonan</button></footer></article>').join(''):'<div class="pl-mod-empty">Tidak ada toko yang menunggu verifikasi.</div>';
  storesEl.querySelectorAll('[data-store-review]').forEach(button=>button.onclick=async()=>{
   const note=prompt('Catatan pemeriksaan (opsional):')||'';
   const {error}=await db.rpc('review_store_verification',{p_store_id:button.dataset.storeReview,p_decision:button.dataset.decision,p_note:note});
   if(error)alert(error.message);else bindModerationPage();
  });
 }
 const {data,error}=await db.from('content_reports').select('id,reporter_user_id,target_type,target_id,reason,details,status,moderator_note,created_at').order('created_at',{ascending:false}).limit(100);
 if(error){el.textContent=error.message;return;}
 el.innerHTML=data?.length?data.map(x=>'<article class="pl-mod-report"><header><b>'+esc(x.target_type)+' · '+esc(x.reason)+'</b><span>'+esc(x.status)+'</span></header><p>ID target: <code>'+esc(x.target_id)+'</code></p><p>'+esc(x.details||'Tidak ada detail tambahan.')+'</p><small>'+new Date(x.created_at).toLocaleString('id-ID')+'</small><footer>'+(x.status==='pending'?'<button data-mod="'+x.id+'" data-decision="reviewing">Tinjau</button>':'')+(['pending','reviewing'].includes(x.status)?'<button data-mod="'+x.id+'" data-decision="dismissed">Tutup laporan</button><button data-mod="'+x.id+'" data-decision="actioned">Tindak konten</button>':'')+'</footer></article>').join(''):'<div class="pl-mod-empty">Belum ada laporan.</div>';
 el.querySelectorAll('[data-mod]').forEach(button=>button.onclick=async()=>{
  const note=prompt('Catatan moderator (opsional):')||'';
  const {error}=await db.rpc('review_content_report',{p_report_id:button.dataset.mod,p_decision:button.dataset.decision,p_note:note});
  if(error)alert(error.message);else bindModerationPage();
 });
}
async function loadSystemAnnouncements(user){
 const box=document.querySelector('#pl-mod-announcements');if(!box)return;
 const {data,error}=await db.from('pluits_system_announcements').select('id,title,body,language,severity,status,published_at,expires_at').order('created_at',{ascending:false}).limit(50);
 if(error){box.textContent=error.message;return;}
 box.innerHTML='<form id="pl-mod-announcement-form" class="pl-mod-announcement-form"><label>Judul<input name="title" maxlength="160" required></label><label>Isi pengumuman<textarea name="body" rows="4" maxlength="8000" required></textarea></label><div class="pl-mod-announcement-grid"><label>Bahasa<select name="language"><option value="id">Bahasa Indonesia</option><option value="en">English</option></select></label><label>Jenis<select name="severity"><option value="info">Informasi</option><option value="important">Pembaruan penting</option><option value="critical">Penting / kritis</option></select></label><label>Status<select name="status"><option value="draft">Simpan draft</option><option value="published">Terbitkan sekarang</option></select></label><label>Kedaluwarsa (opsional)<input type="datetime-local" name="expires_at"></label></div><button type="submit">Simpan pengumuman</button><p id="pl-mod-announcement-note" role="status"></p></form>'+
  '<div class="pl-mod-announcement-list">'+(data||[]).map(item=>'<article class="pl-mod-report"><header><b>'+esc(item.title)+'</b><span>'+esc(item.status)+' · '+esc(item.language)+' · '+esc(item.severity)+'</span></header><p>'+esc(item.body)+'</p><small>'+esc(item.published_at?new Date(item.published_at).toLocaleString('id-ID'):'Belum diterbitkan')+(item.expires_at?' · Berakhir '+new Date(item.expires_at).toLocaleString('id-ID'):'')+'</small>'+(item.status!=='archived'?'<footer><button type="button" data-announcement-archive="'+item.id+'">Arsipkan</button></footer>':'')+'</article>').join('')+'</div>';
 const form=box.querySelector('#pl-mod-announcement-form');
 form.onsubmit=async event=>{
  event.preventDefault();const data=new FormData(form),status=String(data.get('status')),expires=String(data.get('expires_at')||''),note=box.querySelector('#pl-mod-announcement-note'),button=form.querySelector('button[type=submit]');
  const payload={title:String(data.get('title')).trim(),body:String(data.get('body')).trim(),language:String(data.get('language')),severity:String(data.get('severity')),status,created_by:user.id,published_at:status==='published'?new Date().toISOString():null,expires_at:expires?new Date(expires).toISOString():null};
  if(payload.expires_at&&payload.published_at&&new Date(payload.expires_at)<=new Date(payload.published_at)){note.textContent='Waktu kedaluwarsa harus setelah waktu terbit.';return;}
  button.disabled=true;const result=await db.from('pluits_system_announcements').insert(payload);button.disabled=false;
  if(result.error){note.textContent=result.error.message;return;}
  note.textContent=status==='published'?'Pengumuman diterbitkan.':'Draft disimpan.';await loadSystemAnnouncements(user);
 };
 box.querySelectorAll('[data-announcement-archive]').forEach(button=>button.onclick=async()=>{
  if(!confirm('Arsipkan pengumuman ini?'))return;
  const {error}=await db.from('pluits_system_announcements').update({status:'archived'}).eq('id',button.dataset.announcementArchive);
  if(error)alert(error.message);else await loadSystemAnnouncements(user);
 });
}
