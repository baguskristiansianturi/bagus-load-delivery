import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=v=>String(v||'P').trim().slice(0,1).toUpperCase();
const rupiah=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0));
export async function loadAccountContext(db,user){
 const [pref,professional,owned,members]=await Promise.all([
  db.from('account_context_preferences').select('*').eq('user_id',user.id).maybeSingle(),
  db.from('professional_profiles').select('*').eq('user_id',user.id).maybeSingle(),
  db.from('stores').select('id,name,username,store_status,verification_status,owner_user_id').eq('owner_user_id',user.id),
  db.from('store_members').select('store_id,member_status').eq('user_id',user.id).eq('member_status','active')
 ]);
 if(pref.error)throw pref.error;if(professional.error)throw professional.error;
 let stores=owned.data||[];
 const ids=(members.data||[]).map(x=>x.store_id).filter(id=>!stores.some(s=>s.id===id));
 if(ids.length){const r=await db.from('stores').select('id,name,username,store_status,verification_status,owner_user_id').in('id',ids);if(!r.error)stores=stores.concat(r.data||[]);}
 const selected=['personal','professional','business'].includes(pref.data?.active_context)?pref.data.active_context:'personal';
 return {active:selected==='professional'&&!professional.data?'personal':selected==='business'&&!stores.length?'personal':selected,professional:professional.data||null,stores,prefs:pref.data||{}};
}
export function contextHeader(ctx){
 return `<div class="ua-context-switch"><label for="ua-context-select">KONTEKS AKUN</label><select id="ua-context-select"><option value="personal" ${ctx.active==='personal'?'selected':''}>Personal</option>${ctx.professional?'<option value="professional" '+(ctx.active==='professional'?'selected':'')+'>Professional</option>':''}${ctx.stores.length?'<option value="business" '+(ctx.active==='business'?'selected':'')+'>Business</option>':''}</select></div>`;
}
const nav=()=>`<a class="ua-account-back" href="#/account/settings">← Kembali ke Pusat Pengaturan</a>`;
export function professionalPage(ctx,profile){
 const p=ctx.professional;
 if(!p)return professionalFormPage(ctx,profile);
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PROFESSIONAL CENTER</span><h1>Profil Profesional</h1><p>Kelola reputasi, keahlian, portofolio, dan area layanan Anda.</p></div><span class="ua-review-pill">${p.profile_status==='submitted'?'Menunggu persetujuan':p.profile_status==='active'?'Disetujui':p.profile_status==='rejected'?'Perlu perbaikan':esc(p.profile_status)}</span></div>${nav()}
 <section class="ua-professional-card"><div class="ua-professional-avatar">${esc(initials(p.display_name))}</div><div><h2>${esc(p.display_name)}</h2><strong>${esc(p.headline||p.profession_category)}</strong><p>${esc(p.bio||'Lengkapi deskripsi profesional Anda.')}</p><small>${esc(p.service_city||'Area layanan belum diatur')}${p.service_province?', '+esc(p.service_province):''}</small></div></section>
 <section class="ua-panel ua-professional-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">KEAHLIAN & LAYANAN</span><h2>${esc(p.profession_category)}</h2></div>${p.profile_status==='active'?'<span class="ua-review-pill">Profil aktif · hubungi dukungan untuk perubahan</span>':'<a class="ua-outline" href="#/account/professional-create">Edit profil</a>'}</div>
 <div class="ua-skill-list">${(p.skills||[]).map(x=>'<span>'+esc(x)+'</span>').join('')||'<span>Belum ada keahlian</span>'}</div><div class="ua-professional-meta"><span>Pengalaman: ${Number(p.experience_years||0)} tahun</span><span>Mulai dari: ${p.price_from_minor?rupiah(p.price_from_minor):'Belum ditentukan'}</span></div>
 <p class="ua-muted">${p.profile_status==='submitted'?'Profil sudah dikirim dan sedang menunggu pemeriksaan tim PLUITS.':p.profile_status==='active'?'Profil telah disetujui dan dapat ditampilkan sesuai pengaturan visibilitas.':p.profile_status==='rejected'?'Profil perlu diperbaiki sebelum diajukan kembali.':'Profil belum dikirim untuk pemeriksaan dan belum ditampilkan kepada publik.'}</p></section>
 <section class="ua-panel ua-professional-panel"><div class="ua-section-title"><div><span class="ua-eyebrow">PORTOFOLIO</span><h2>Karya dan pengalaman</h2></div></div><div class="ua-empty"><strong>Portofolio menyusul</strong><p>Database portofolio sudah disiapkan. Upload karya dan publikasi akan diaktifkan pada tahap berikutnya.</p></div></section>`;
}
export function professionalFormPage(ctx,profile){
 const p=ctx.professional||{};
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PROFESSIONAL ONBOARDING</span><h1>${p.id?'Edit':'Buat'} Profil Profesional</h1><p>Untuk tenaga ahli, freelancer, teknisi, tukang, konsultan, kreator, dan penyedia jasa individu.</p></div><a class="ua-outline" href="#/account/profile">Kembali</a></div>${nav()}
 <form id="ua-professional-form" class="ua-panel ua-professional-form"><div class="ua-form-grid">
 <label>Nama profesional<input name="display_name" required maxlength="100" value="${esc(p.display_name||profile.display_name)}"></label>
 <label>Username profesional<input name="username" required minlength="3" maxlength="40" pattern="[a-z0-9][a-z0-9-]{2,39}" value="${esc(p.username||'')}" placeholder="contoh: baguskristian"></label>
 <label>Kategori profesi<input name="profession_category" required maxlength="80" value="${esc(p.profession_category||'')}" placeholder="Contoh: Tukang ledeng"></label>
 <label>Judul profesional<input name="headline" maxlength="120" value="${esc(p.headline||'')}" placeholder="Contoh: Teknisi instalasi dan perawatan"></label>
 <label class="ua-span-2">Deskripsi<textarea name="bio" rows="3" maxlength="1000">${esc(p.bio||'')}</textarea></label>
 <label class="ua-span-2">Keahlian (pisahkan dengan koma)<input name="skills" value="${esc((p.skills||[]).join(', '))}" placeholder="Instalasi pipa, perbaikan kebocoran, perawatan"></label>
 <label>Pengalaman (tahun)<input name="experience_years" type="number" min="0" max="80" value="${Number(p.experience_years||0)}"></label>
 <label>Harga mulai (Rp, opsional)<input name="price_from" type="number" min="0" step="1000" value="${p.price_from_minor??''}"></label>
 <label>Kota layanan<input name="service_city" value="${esc(p.service_city||'')}"></label><label>Provinsi layanan<input name="service_province" value="${esc(p.service_province||'')}"></label>
 <label>Radius layanan (km)<input name="service_radius_km" type="number" min="0" max="1000" value="${p.service_radius_km??''}"></label>
 <label>Visibilitas<select name="visibility"><option value="public" ${p.visibility!=='unlisted'?'selected':''}>Publik setelah diaktifkan</option><option value="unlisted" ${p.visibility==='unlisted'?'selected':''}>Tidak tercantum di pencarian</option></select></label>
 </div><p class="ua-professional-note">Saat disimpan, profil akan langsung dikirim ke antrean pemeriksaan PLUITS. Profil baru tampil setelah disetujui oleh tim. Pengiriman tidak berarti otomatis terverifikasi.</p>
 <div class="ua-form-actions"><button class="ua-primary" type="submit">${p.id?'Simpan & ajukan pemeriksaan':'Buat & ajukan profil'}</button><span id="ua-professional-note" class="ua-form-note"></span></div></form>`;
}
export async function accountSettingsPage(db,user){
 const {data,error}=await db.from('account_content_preferences').select('*').eq('user_id',user.id).maybeSingle();if(error)throw error;
 const p=data||{};
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">PUSAT PENGATURAN</span><h1>Privasi & audiens</h1><p>Atur pilihan bawaan agar proses posting lebih ringkas. Audiens masih dapat diubah per postingan.</p></div></div>${nav()}
 <form id="ua-content-settings-form" class="ua-panel ua-settings-form"><div class="ua-settings-section"><span class="ua-eyebrow">AUDIENS DEFAULT</span><h2>Siapa yang dapat melihat konten?</h2>
 <label>Postingan Personal<select name="personal_default_visibility"><option value="public" ${p.personal_default_visibility!=='private'?'selected':''}>Publik</option><option value="private" ${p.personal_default_visibility==='private'?'selected':''}>Hanya saya</option></select></label>
 <label>Konten Professional<select name="professional_default_visibility"><option value="public" ${p.professional_default_visibility!=='unlisted'?'selected':''}>Publik setelah profil aktif</option><option value="unlisted" ${p.professional_default_visibility==='unlisted'?'selected':''}>Tidak tercantum</option></select></label>
 <label>Konten Business<select name="business_default_visibility"><option value="public" ${p.business_default_visibility!=='unlisted'?'selected':''}>Publik</option><option value="unlisted" ${p.business_default_visibility==='unlisted'?'selected':''}>Tidak tercantum</option></select></label>
 <label>Story 24 jam<select name="story_default_visibility"><option value="public" ${p.story_default_visibility!=='private'?'selected':''}>Publik</option><option value="private" ${p.story_default_visibility==='private'?'selected':''}>Hanya saya</option></select></label></div>
 <div class="ua-settings-section"><span class="ua-eyebrow">INTERAKSI</span><h2>Kontrol interaksi</h2>
 <label class="ua-checkbox"><input type="checkbox" name="allow_comments" ${p.allow_comments!==false?'checked':''}> Izinkan komentar</label>
 <label class="ua-checkbox"><input type="checkbox" name="allow_mentions" ${p.allow_mentions!==false?'checked':''}> Izinkan akun lain menandai saya</label>
 <label>Siapa yang dapat mengirim pesan<select name="message_preference"><option value="everyone" ${(p.message_preference||'everyone')==='everyone'?'selected':''}>Semua pengguna</option><option value="followers" ${p.message_preference==='followers'?'selected':''}>Pengikut</option><option value="nobody" ${p.message_preference==='nobody'?'selected':''}>Tidak seorang pun</option></select></label></div>
 <div class="ua-form-actions"><button class="ua-primary" type="submit">Simpan pengaturan</button><span id="ua-settings-note" class="ua-form-note"></span></div></form>`;
}
export function bindAccountContext({db,user,ctx,profile,refresh}){
 const selector=document.querySelector('#ua-context-select');
 selector?.addEventListener('change',async()=>{
  const next=selector.value;
  if(next==='professional'&&!ctx.professional){location.hash='/account/professional-create';return;}
  const store=ctx.stores.find(s=>s.id===ctx.prefs?.active_store_id)||ctx.stores[0];
  const {error}=await db.from('account_context_preferences').upsert({user_id:user.id,active_context:next,active_store_id:next==='business'?store?.id:null});
  if(error){selector.value=ctx.active;alert(error.message);return;}
  if(next==='business'){location.hash='/seller';return;}
  location.hash=next==='professional'?'/account/professional':'/account/profile';
 });
 const form=document.querySelector('#ua-professional-form');
 form?.addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(form),note=document.querySelector('#ua-professional-note'),btn=form.querySelector('button');
  const username=String(f.get('username')).trim().toLowerCase();
  if(!/^[a-z0-9][a-z0-9-]{2,39}$/.test(username)){note.textContent='Username harus 3–40 karakter, huruf kecil, angka, atau tanda hubung.';return;}
  if(ctx.professional?.profile_status==='active'){note.textContent='Profil aktif tidak dapat diubah dari formulir ini. Hubungi dukungan Pluits.';return;}
  const payload={user_id:user.id,username,display_name:String(f.get('display_name')).trim(),profession_category:String(f.get('profession_category')).trim(),headline:String(f.get('headline')||'').trim(),bio:String(f.get('bio')||'').trim(),skills:String(f.get('skills')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,30),experience_years:Number(f.get('experience_years')||0),service_city:String(f.get('service_city')||'').trim()||null,service_province:String(f.get('service_province')||'').trim()||null,service_radius_km:f.get('service_radius_km')?Number(f.get('service_radius_km')):null,price_from_minor:f.get('price_from')?Number(f.get('price_from')):null,visibility:String(f.get('visibility')||'public'),profile_status:'draft'};
  btn.disabled=true;note.textContent='Menyimpan profil…';
  const r=ctx.professional?await db.from('professional_profiles').update(payload).eq('id',ctx.professional.id).select().single():await db.from('professional_profiles').insert(payload).select().single();
  if(r.error){btn.disabled=false;note.textContent=r.error.code==='23505'?'Username profesional sudah digunakan.':r.error.message;return;}
  const submitted=await db.rpc('submit_professional_profile',{p_profile_id:r.data.id});
  if(submitted.error){btn.disabled=false;note.textContent='Profil tersimpan, tetapi belum masuk antrean pemeriksaan: '+submitted.error.message;return;}
  const pref=await db.from('account_context_preferences').upsert({user_id:user.id,active_context:'professional',active_store_id:null});
  btn.disabled=false;if(pref.error){note.textContent='Profil sudah diajukan untuk pemeriksaan. Konteks akun belum berhasil diperbarui: '+pref.error.message;return;}
  note.textContent='Profil berhasil dikirim. Status: menunggu persetujuan PLUITS.';location.hash='/account/professional';
 });
 const settings=document.querySelector('#ua-content-settings-form');
 settings?.addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(settings),note=document.querySelector('#ua-settings-note'),btn=settings.querySelector('button');
  const payload={user_id:user.id,personal_default_visibility:String(f.get('personal_default_visibility')),professional_default_visibility:String(f.get('professional_default_visibility')),business_default_visibility:String(f.get('business_default_visibility')),story_default_visibility:String(f.get('story_default_visibility')),allow_comments:f.get('allow_comments')==='on',allow_mentions:f.get('allow_mentions')==='on',message_preference:String(f.get('message_preference'))};
  btn.disabled=true;const r=await db.from('account_content_preferences').upsert(payload);btn.disabled=false;note.textContent=r.error?r.error.message:'Pengaturan berhasil disimpan.';
 });
}
