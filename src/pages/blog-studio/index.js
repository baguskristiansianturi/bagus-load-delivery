import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../../lib/supabase/client.js';
import { createMediaUploader } from '../../features/media/storage-upload.js';
import { renderSocialHeader, renderSocialMobileNav } from '../../components/social/navigation.js';
import { createSignedUrlMap } from '../../services/storage/signed-urls.js';
import { getMediaMime, getMediaExtension, validateMediaFile } from '../../features/media/media-types.js';
import './blog-studio.css';


const BUCKET='pluits-user-media';
const uploadMedia=createMediaUploader({supabase,bucket:BUCKET,supabaseUrl:SUPABASE_URL,publishableKey:SUPABASE_PUBLISHABLE_KEY});
let blogProfile=null,categories=[];
let activeUser=null,activeProfile=null,activeTab='posts',activeView='dashboard',editingId=null,coverObjectUrl='',selectedCoverFile=null,galleryItems=[],supportingObjectUrls=[],pendingSupportingFiles=[],previewObjectUrls=[],toastTimer=null;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const wordCount=value=>String(value||'').trim().split(/\s+/).filter(Boolean).length;
const uid=()=>crypto.randomUUID();
const ext=file=>(file?.name?.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,6)||'jpg';
const isVideoPath=path=>/\\.(mp4|m4v|mov|webm|3gp|3gpp|3g2|3gp2)$/i.test(String(path||''));
const LEGACY_DB='pluits-blog-studio-v1',LEGACY_STORE='items';
function legacyDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(LEGACY_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(LEGACY_STORE))req.result.createObjectStore(LEGACY_STORE,{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function migrateLegacyDrafts(){
 if(!blogProfile)return 0;
 const db=await legacyDb();
 const rows=await new Promise((resolve,reject)=>{const tx=db.transaction(LEGACY_STORE,'readonly'),req=tx.objectStore(LEGACY_STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});
 let count=0;
 for(const item of rows.filter(x=>x.userId===activeUser.id&&!x.migratedAt)){
  if(!item.cover||!item.title||!item.body)continue;
  const description=String(item.description||item.title).trim().split(/\s+/).slice(0,85).join(' ');
  const cover_path=await uploadBlogImage(item.cover,'legacy-cover'),supporting_paths=[];
  for(const file of item.supportingImages||[])supporting_paths.push(await uploadBlogSupportingMedia(file,'legacy-body'));
  const {error}=await supabase.from('blog_posts').insert({blog_id:blogProfile.id,owner_user_id:activeUser.id,title:String(item.title).slice(0,240),description,body:String(item.body),cover_path,supporting_paths,status:'draft',visibility:'private'});
  if(error)throw error;
  item.migratedAt=Date.now();
  await new Promise((resolve,reject)=>{const tx=db.transaction(LEGACY_STORE,'readwrite');tx.objectStore(LEGACY_STORE).put(item);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  count++;
 }
 db.close();return count;
}

async function loadBlogProfile(){const {data,error}=await supabase.from('blog_profiles').select('*').eq('owner_user_id',activeUser.id).maybeSingle();if(error)throw error;blogProfile=data;categories=[];if(blogProfile){const r=await supabase.from('blog_categories').select('*').eq('blog_id',blogProfile.id).order('sort_order').order('name');if(r.error)throw r.error;categories=r.data||[];}}
async function getAllItems(){if(!blogProfile)return[];const {data,error}=await supabase.from('blog_posts').select('*').eq('blog_id',blogProfile.id).eq('owner_user_id',activeUser.id).order('updated_at',{ascending:false});if(error)throw error;const paths=(data||[]).flatMap(p=>[p.cover_path,...(p.supporting_paths||[])]).filter(Boolean);const urls=await createSignedUrlMap(supabase.storage,BUCKET,paths,3600);return(data||[]).map(p=>({...p,cover_url:urls.get(p.cover_path)||'',updatedAt:new Date(p.updated_at).getTime(),createdAt:new Date(p.created_at).getTime()}));}
async function getSettings(){return blogProfile?{blogTitle:blogProfile.display_title,blogDescription:blogProfile.description,visibility:blogProfile.default_visibility}:{};}
async function saveSettings(v){const {data,error}=await supabase.from('blog_profiles').update({display_title:v.blogTitle,description:v.blogDescription,default_visibility:v.visibility}).eq('id',blogProfile.id).eq('owner_user_id',activeUser.id).select('*').single();if(error)throw error;blogProfile=data;}
async function deleteItem(id){return supabase.from('blog_posts').delete().eq('id',id).eq('owner_user_id',activeUser.id);}
async function uploadBlogImage(file,kind){if(!file)return null;const mime=getMediaMime(file);if(!mime?.startsWith('image/'))throw Error('Cover harus berupa gambar JPG, PNG, WebP, atau GIF.');if(file.size>12*1024*1024)throw Error('Gambar cover maksimal 12 MB.');const path=activeUser.id+'/blogs/'+blogProfile.id+'/'+uid()+'-'+kind+'.'+getMediaExtension(file,mime);await uploadMedia(file,path,mime);return path;}
async function uploadBlogSupportingMedia(file,kind){const check=validateMediaFile(file);if(!check.valid)throw Error(check.reason==='too-large'?'Media pendukung maksimal 50 MB per file.':'Format media tidak didukung. Gunakan gambar, MP4, MOV, WebM, atau 3GP.');const path=activeUser.id+'/blogs/'+blogProfile.id+'/'+uid()+'-'+kind+'.'+getMediaExtension(file,check.mime);await uploadMedia(file,path,check.mime);return path;}
async function setupPage(){return header('Buat ruang blog','Buat ruang blog terlebih dahulu sebelum mulai menulis.')+'<form id="pl-blog-create-form" class="pl-blog-settings-form"><label>Nama blog<input name="title" required minlength="2" maxlength="40" placeholder="Contoh: Catatan Harianku"><small>2–40 karakter. URL otomatis dibuat dari nama blog.</small></label><label>Deskripsi blog<textarea name="description" rows="3" maxlength="180"></textarea></label><label>Visibilitas<select name="visibility"><option value="public">Publik</option><option value="private">Privat</option></select></label><button class="pl-blog-primary" type="submit">Buat Blog</button></form>';}

function notify(message, type = 'success') {
  const el = document.querySelector('#pl-blog-toast');
  if (!el) return;
  el.textContent = message;
  el.className = 'pl-blog-toast is-visible ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3600);
}
function revokePreviews() {
  if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl);
  coverObjectUrl = '';
  supportingObjectUrls.forEach(url => URL.revokeObjectURL(url));
  supportingObjectUrls = [];
}
function avatarMarkup() {
  const name = activeProfile?.display_name || activeUser?.email || 'Pengguna';
  return '<span class="pl-blog-avatar">' + esc(name.slice(0, 1).toUpperCase()) + '</span>';
}
function shell(content) {
  return '<div class="ua-app ua-social-app pl-blog-studio">' +
    renderSocialHeader({ active: 'create', user: activeUser, profile: activeProfile, userAvatar: '' }) +
    '<main class="ua-main pl-blog-main">' + content + '</main>' +
    renderSocialMobileNav({ active: 'create', user: activeUser, profile: activeProfile }) +
    '<div id="pl-blog-toast" class="pl-blog-toast" role="status" aria-live="polite"></div>' +
    '<footer class="ua-footer">PLUITS · Ruang karya dan cerita</footer></div>';
}
function header(title, subtitle) {
  return '<div class="pl-blog-page-head"><a href="#/account/create" class="pl-blog-back" aria-label="Kembali">‹</a><div><span>PLUITS BLOG</span><h1>' + title + '</h1>' + (subtitle ? '<p>' + subtitle + '</p>' : '') + '</div></div>';
}
function tabs() {
  return '<nav class="pl-blog-tabs" aria-label="Menu Blog">' +
    '<button type="button" data-tab="posts" class="' + (activeTab === 'posts' ? 'active' : '') + '">Postingan</button>' +
    '<button type="button" data-tab="drafts" class="' + (activeTab === 'drafts' ? 'active' : '') + '">Draft</button>' +
    '<button type="button" data-tab="settings" class="' + (activeTab === 'settings' ? 'active' : '') + '">Pengaturan</button></nav>';
}
async function dashboardPage() {
  activeView = 'dashboard';
  const [items, settings] = await Promise.all([getAllItems(), getSettings()]);
  const visible = items.filter(item => activeTab === 'drafts' ? item.status === 'draft' : activeTab === 'posts' ? item.status === 'published' : false);
  const name = activeProfile?.display_name || 'Penulis Pluits';
  const blogTitle = settings.blogTitle || ('Blog ' + name);
  const description = settings.blogDescription || 'Ruang untuk menyimpan cerita, pengalaman, dan karya.';
  const profile = '<section class="pl-blog-identity"><div class="pl-blog-profile-row">' + avatarMarkup() + '<div><h2>' + esc(name) + '</h2><span>@' + esc(activeProfile?.username || 'akun-pluits') + '</span></div><span class="pl-blog-owner-chip">Blog saya</span></div><h3>' + esc(blogTitle) + '</h3><p>' + esc(description) + '</p></section>';
  let body = '';
  if (activeTab === 'settings') {
    body = '<form id="pl-blog-settings-form" class="pl-blog-settings-form">' +
      '<label>Nama ruang blog<input name="blogTitle" required minlength="2" maxlength="40" value="' + esc(settings.blogTitle || '') + '" placeholder="Contoh: Catatan Perjalanan"><small>2–40 karakter. URL otomatis mengikuti nama blog.</small></label>' +
      '<label>Deskripsi blog<textarea name="blogDescription" rows="3" maxlength="220">' + esc(settings.blogDescription || '') + '</textarea><small>Deskripsi ruang blog, bukan deskripsi setiap tulisan.</small></label>' +
      '<label>Visibilitas default<select name="visibility"><option value="public" ' + ((settings.visibility || 'public') === 'public' ? 'selected' : '') + '>Publik</option><option value="private" ' + (settings.visibility === 'private' ? 'selected' : '') + '>Privat</option></select></label>' +
      '<p class="pl-blog-local-note">Alamat: ' + esc(location.origin + '/#/@' + (activeProfile?.username || '') + '/blog/' + (blogProfile?.slug || '')) + '. URL otomatis mengikuti username dan nama blog.</p><button class="pl-blog-primary" type="submit">Simpan pengaturan</button></form><section class="pl-blog-settings-form"><strong>Kategori tulisan</strong><div class="pl-blog-category-list">'+(categories.map(x=>'<span>'+esc(x.name)+'</span>').join('')||'<small>Belum ada kategori.</small>')+'</div><form id="pl-blog-category-form"><label>Tambah kategori<input name="name" maxlength="40" required></label><button class="pl-blog-secondary" type="submit">Tambah Kategori</button></form></section>';
  } else if (!visible.length) {
    body = '<section class="pl-blog-empty"><div class="pl-blog-empty-icon">✎</div><h3>' + (activeTab === 'drafts' ? 'Belum ada draft' : 'Belum ada tulisan') + '</h3><p>' + (activeTab === 'drafts' ? 'Tulisan yang kamu simpan sebagai draft akan muncul di sini.' : 'Mulai dengan menulis cerita, puisi, pengalaman, atau catatan singkat pertamamu.') + '</p><button type="button" class="pl-blog-primary" data-action="new">Tulis Blog</button></section>';
  } else {
    body = '<div class="pl-blog-list">' + visible.map(item => {
      const cover = item.cover_url || '';
      const desc = esc(item.description || '');
      return '<article class="pl-blog-item" data-item-id="' + item.id + '">' +
        (cover ? '<img class="pl-blog-item-cover" src="' + cover + '" alt="Cover ' + esc(item.title) + '">' : '<div class="pl-blog-item-cover pl-blog-no-cover">Belum ada cover</div>') +
        '<div class="pl-blog-item-copy"><span class="pl-blog-item-status">' + (item.status === 'draft' ? 'DRAFT' : 'DITERBITKAN') + '</span><h3>' + esc(item.title) + '</h3><p>' + desc + '</p><span class="pl-blog-read-more">Baca selengkapnya</span><small>' + new Date(item.updatedAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) + '</small>' +
        '<div class="pl-blog-item-actions"><button type="button" data-action="edit" data-id="' + item.id + '">Lanjutkan</button><button type="button" data-action="delete" data-id="' + item.id + '">Hapus</button></div></div></article>';
    }).join('') + '</div>';
  }
  return header('Blog saya', 'Kelola tulisan dan ruang blog kamu.') + profile + tabs() +
    (activeTab !== 'settings' ? '<div class="pl-blog-toolbar"><span>' + (activeTab === 'drafts' ? 'Tulisan yang belum diterbitkan' : 'Tulisan yang sudah diterbitkan') + '</span><button type="button" class="pl-blog-primary pl-blog-compact" data-action="new">＋ Tulis Blog</button></div>' : '') + body;
}
function editorPage(item = null) {
  activeView = 'editor';
  editingId = item?.id || null;
  revokePreviews();
  selectedCoverFile = null;
  if (item?.cover_url) coverObjectUrl = item.cover_url;
  const supporting = item?.supporting_urls || [];
  supportingObjectUrls = supporting.map(media => media.url).filter(Boolean);
  const existingMediaMarkup=supporting.map((media,index)=>'<div class="pl-blog-support-tile">'+(isVideoPath(media.path)?'<video src="'+media.url+'" controls playsinline preload="metadata"></video>':'<img src="'+media.url+'" alt="Media pendukung '+(index+1)+'">')+'</div>');
  const pendingMediaMarkup=pendingSupportingFiles.map((file,index)=>{const url=URL.createObjectURL(file);supportingObjectUrls.push(url);const mime=getMediaMime(file);return '<div class="pl-blog-support-tile">'+(mime.startsWith('video/')?'<video src="'+url+'" controls playsinline preload="metadata"></video>':'<img src="'+url+'" alt="Media pendukung '+(existingMediaMarkup.length+index+1)+'">')+'</div>';});
  const images=[...existingMediaMarkup,...pendingMediaMarkup].join('');
  return header(item ? 'Lanjutkan tulisan' : 'Tulis Blog', 'Buat cerita dengan nyaman dari handphone.') +
    '<form id="pl-blog-editor-form" class="pl-blog-editor-form">' +
    '<label class="pl-blog-field">Judul tulisan<input name="title" maxlength="140" required value="' + esc(item?.title || '') + '" placeholder="Tuliskan judul blog kamu"></label>' + '<label class="pl-blog-field">Kategori<select name="category_id"><option value="">Tanpa kategori</option>' + categories.map(c => '<option value="' + c.id + '" ' + (item?.category_id===c.id?'selected':'') + '>' + esc(c.name) + '</option>').join('') + '</select></label>' + '<label class="pl-blog-field">Visibilitas tulisan<select name="visibility"><option value="public" ' + ((item?.visibility || blogProfile?.default_visibility || 'public') === 'public' ? 'selected' : '') + '>Publik</option><option value="private" ' + (item?.visibility === 'private' || (!item && blogProfile?.default_visibility === 'private') ? 'selected' : '') + '>Privat</option></select></label>' +
    '<label class="pl-blog-field">Deskripsi untuk kartu feed<textarea name="description" id="pl-blog-description" rows="3" required placeholder="Ringkas isi tulisan agar orang tertarik membacanya.">' + esc(item?.description || '') + '</textarea><small><span id="pl-blog-word-count">' + wordCount(item?.description || '') + '</span>/85 kata · Ditampilkan pada kartu feed dan dipotong dengan “Baca selengkapnya”.</small></label>' +
    '<section class="pl-blog-cover-field"><div><strong>Gambar utama / cover</strong><small>Dipakai sebagai thumbnail di feed, katalog Blog, dan hero tulisan.</small></div>' +
    '<div class="pl-blog-cover-actions"><button type="button" class="pl-blog-secondary" data-open-gallery>Galeri PLUITS</button><label class="pl-blog-secondary pl-blog-phone-picker" for="pl-blog-cover-input">Galeri HP<input id="pl-blog-cover-input" type="file" accept="image/jpeg,image/png,image/webp"></label></div><div class="pl-blog-cover-picker" id="pl-blog-cover-preview-wrap">' + (coverObjectUrl ? '<img id="pl-blog-cover-preview" src="' + coverObjectUrl + '" alt="Pratinjau cover">' : '<span id="pl-blog-cover-placeholder">＋</span><b>Belum ada gambar utama</b><small>Pilih dari Galeri PLUITS atau Galeri HP</small>') + '</div></section>' +
    '<label class="pl-blog-field">Isi tulisan<textarea name="body" rows="9" required placeholder="Mulai menulis di sini. Tidak ada batas minimal kata.">' + esc(item?.body || '') + '</textarea></label>' +
    '<section class="pl-blog-support-field"><div><strong>Media pendukung</strong><small>Tambahkan foto atau video ke dalam isi tulisan. Maksimal 15 media, 50 MB per file.</small></div><label class="pl-blog-support-picker" for="pl-blog-support-input">＋ Tambah foto atau video<input id="pl-blog-support-input" type="file" accept="image/*,video/*,.mp4,.m4v,.mov,.webm,.3gp,.3gpp,.3g2,.3gp2" multiple></label><div class="pl-blog-support-grid" id="pl-blog-support-grid">' + images + '</div></section>' +
    '<div class="pl-blog-editor-note">Draft dan tulisan disimpan di akun PLUITS melalui Supabase.</div>' +
    '<button type="button" class="pl-blog-preview-action" data-action="preview">Lihat pratinjau tulisan</button>' +
    '<div class="pl-blog-editor-actions"><button type="button" class="pl-blog-secondary" data-action="save-draft">Simpan Draft</button><button type="submit" class="pl-blog-primary" data-submit-publish>Terbitkan</button></div></form>';
}
async function previewPage(item) {
  activeView = 'preview';
  const cover = item.cover_url || '';
  const support = (item.supporting_media || []).map(media => isVideoPath(media.path) ? '<video class="pl-blog-support-video" src="' + media.url + '" controls playsinline preload="metadata"></video>' : '<img src="' + media.url + '" alt="Gambar pendukung">').join('');
  return header('Pratinjau tulisan', 'Tampilan lokal sebelum dibagikan.') +
    '<article class="pl-blog-reading-preview">' + (cover ? '<img class="pl-blog-reading-cover" src="' + cover + '" alt="">' : '') +
    '<div class="pl-blog-reading-meta">' + avatarMarkup() + '<div><b>' + esc(activeProfile?.display_name || 'Penulis') + '</b><small>@' + esc(activeProfile?.username || 'akun-pluits') + '</small></div></div>' +
    '<h1>' + esc(item.title) + '</h1><p class="pl-blog-reading-description">' + esc(item.description) + '</p><div class="pl-blog-reading-body">' + esc(item.body).replace(/\n/g, '<br>') + '</div>' +
    (support ? '<div class="pl-blog-reading-support">' + support + '</div>' : '') +
    '<button type="button" class="pl-blog-secondary" data-action="back-editor">Kembali ke editor</button></article>';
}
async function render() {
  const app = document.querySelector('#app');
  if (!app) return;
  let content = '';
  if (activeView === 'setup') content = await setupPage();
  else if (activeView === 'editor') content = editorPage(window.__plBlogEditingItem || null);
  else if (activeView === 'preview') content = await previewPage(window.__plBlogPreviewItem);
  else content = await dashboardPage();
  app.innerHTML = shell(content);
  bind();
}
function setView(view) { activeView = view; render().catch(showError); }
function showError(error) {
  console.error('PLUITS Blog Studio:', error);
  const app = document.querySelector('#app');
  if (app) app.innerHTML = '<div class="pl-blog-error"><h1>Blog belum dapat dibuka</h1><p>' + esc(error?.message || 'Terjadi kesalahan.') + '</p><a href="#/account/create">Kembali</a></div>';
}
function readFormFile(input) { return input?.files?.[0] || null; }
async function persistEditor(status){
 const form=document.querySelector('#pl-blog-editor-form');if(!form)return;const d=new FormData(form),title=String(d.get('title')||'').trim(),description=String(d.get('description')||'').trim(),body=String(d.get('body')||'').trim();
 if(!title||!description||!body)return notify('Judul, deskripsi, dan isi wajib diisi.','error');if(wordCount(description)>85)return notify('Deskripsi maksimal 85 kata.','error');
 let old=null;if(editingId){const r=await supabase.from('blog_posts').select('*').eq('id',editingId).eq('owner_user_id',activeUser.id).single();if(r.error)throw r.error;old=r.data;}
 const file=readFormFile(document.querySelector('#pl-blog-cover-input'))||selectedCoverFile;let coverPath=old?.cover_path||null;if(file)coverPath=await uploadBlogImage(file,'cover');if(!coverPath)return notify('Pilih gambar utama sebelum menyimpan.','error');
 const support=[...(old?.supporting_paths||[])];for(const f of pendingSupportingFiles)support.push(await uploadBlogSupportingMedia(f,'body'));
 const now=new Date().toISOString(),payload={blog_id:blogProfile.id,owner_user_id:activeUser.id,title,description,body,cover_path:coverPath,supporting_paths:support,status,visibility:blogProfile.default_visibility==='private'?'private':String(d.get('visibility')||'public'),category_id:String(d.get('category_id')||'')||null,updated_at:now,published_at:status==='published'?(old?.published_at||now):old?.published_at||null};
 const q=editingId?supabase.from('blog_posts').update(payload).eq('id',editingId).eq('owner_user_id',activeUser.id):supabase.from('blog_posts').insert(payload);const {data,error}=await q.select('*').single();if(error)throw error;
 editingId=data.id;notify(status==='draft'?'Draft tersimpan di akun PLUITS.':'Tulisan berhasil diterbitkan.');activeTab=status==='draft'?'drafts':'posts';activeView='dashboard';pendingSupportingFiles=[];window.__plBlogEditingItem=null;previewObjectUrls.forEach(url=>URL.revokeObjectURL(url));previewObjectUrls=[];revokePreviews();await render();
}

function bind() {
  document.querySelector('#pl-blog-create-form')?.addEventListener('submit',async e=>{e.preventDefault();const d=new FormData(e.currentTarget),title=String(d.get('title')||'').trim();if(title.length<2||title.length>40)return notify('Nama blog harus 2–40 karakter.','error');const {data,error}=await supabase.from('blog_profiles').insert({owner_user_id:activeUser.id,display_title:title,description:String(d.get('description')||'').trim(),default_visibility:String(d.get('visibility')||'public')}).select('*').single();if(error)throw error;blogProfile=data;const migrated=await migrateLegacyDrafts();activeView='dashboard';notify(migrated?migrated+' draft lama berhasil dipindahkan.':'Ruang blog berhasil dibuat.');await render();});
  document.querySelector('#pl-blog-category-form')?.addEventListener('submit',async e=>{e.preventDefault();const name=String(new FormData(e.currentTarget).get('name')||'').trim();if(!name)return;const {error}=await supabase.from('blog_categories').insert({blog_id:blogProfile.id,owner_user_id:activeUser.id,name});if(error)throw error;await loadBlogProfile();notify('Kategori ditambahkan.');await render();});

  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { activeTab = button.dataset.tab; activeView = 'dashboard'; render().catch(showError); }));
  document.querySelectorAll('[data-action="new"]').forEach(button => button.addEventListener('click', () => { editingId = null; window.__plBlogEditingItem = null; pendingSupportingFiles=[]; revokePreviews(); setView('editor'); }));
  document.querySelectorAll('[data-action="edit"]').forEach(button => button.addEventListener('click', async () => {
    const {data:item,error}=await supabase.from('blog_posts').select('*').eq('id',button.dataset.id).eq('owner_user_id',activeUser.id).single();if(error)throw error;const urls=await createSignedUrlMap(supabase.storage,BUCKET,[item.cover_path,...(item.supporting_paths||[])],3600);item.cover_url=urls.get(item.cover_path)||'';item.supporting_urls=(item.supporting_paths||[]).map(path=>({path,url:urls.get(path)||''})).filter(media=>media.url);window.__plBlogEditingItem=item;editingId=item.id;pendingSupportingFiles=[];setView('editor');
  }));
  document.querySelectorAll('[data-action="delete"]').forEach(button => button.addEventListener('click', async () => {
    if (!confirm('Hapus tulisan ini dari akun PLUITS?')) return;
    const result=await deleteItem(button.dataset.id);if(result.error)throw result.error;notify('Tulisan dihapus.');render().catch(showError);
  }));
  document.querySelector('[data-action="save-draft"]')?.addEventListener('click', () => persistEditor('draft').catch(showError));
  document.querySelector('[data-action="preview"]')?.addEventListener('click', async () => {
    const form=document.querySelector('#pl-blog-editor-form'),data=new FormData(form);
    const title=String(data.get('title')||'').trim(),description=String(data.get('description')||'').trim(),body=String(data.get('body')||'').trim();
    const old=editingId?(await supabase.from('blog_posts').select('cover_path,supporting_paths').eq('id',editingId).single()).data:null;
    const file=readFormFile(document.querySelector('#pl-blog-cover-input'))||selectedCoverFile;
    let coverUrl=file?URL.createObjectURL(file):'';
    if(!coverUrl&&old?.cover_path)coverUrl=(await createSignedUrlMap(supabase.storage,BUCKET,[old.cover_path],3600)).get(old.cover_path)||'';
    if(!title||!description||!body||!coverUrl)return notify('Lengkapi judul, deskripsi, isi, dan cover untuk pratinjau.','error');
    if(wordCount(description)>85)return notify('Deskripsi maksimal 85 kata.','error');
    const oldPaths=old?.supporting_paths||[],oldUrls=oldPaths.length?await createSignedUrlMap(supabase.storage,BUCKET,oldPaths,1800):new Map();
    previewObjectUrls.forEach(url=>URL.revokeObjectURL(url));previewObjectUrls=[];
    const supporting_media=[...oldPaths.filter(path=>oldUrls.has(path)).map(path=>({path,url:oldUrls.get(path)})),...pendingSupportingFiles.map(file=>{const url=URL.createObjectURL(file);previewObjectUrls.push(url);return {path:file.name,url};})];
    window.__plBlogPreviewItem={title,description,body,cover_url:coverUrl,supporting_media};
    setView('preview');
  });
  document.querySelector('#pl-blog-editor-form')?.addEventListener('submit', event => { event.preventDefault(); persistEditor('published').catch(showError); });
  document.querySelector('#pl-blog-description')?.addEventListener('input', event => {
    const count = wordCount(event.target.value);
    const output = document.querySelector('#pl-blog-word-count');
    if (output) output.textContent = String(count);
    output?.classList.toggle('is-over', count > 85);
  });
  document.querySelector('#pl-blog-cover-input')?.addEventListener('change', event => {
    const file = readFormFile(event.target);
    if (!file) return;
    if (!getMediaMime(file)?.startsWith('image/')) return notify('Pilih file gambar JPG, PNG, WebP, atau GIF.', 'error');
    if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl);
    selectedCoverFile = file;
    coverObjectUrl = URL.createObjectURL(file);
    const picker = document.querySelector('#pl-blog-cover-preview-wrap');
    if (picker) {
      let preview = picker.querySelector('#pl-blog-cover-preview');
      if (!preview) {
        preview = document.createElement('img');
        preview.id = 'pl-blog-cover-preview';
        preview.alt = 'Pratinjau cover';
        picker.prepend(preview);
      }
      preview.src = coverObjectUrl;
      picker.querySelector('#pl-blog-cover-placeholder')?.remove();
      picker.querySelector('b')?.remove();
      picker.querySelector('small')?.remove();
    }
  });
  document.querySelector('[data-open-gallery]')?.addEventListener('click', async () => {
    const existing = document.querySelector('#pl-blog-gallery-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'pl-blog-gallery-modal';
    modal.className = 'pl-blog-gallery-modal';
    modal.innerHTML = '<section class="pl-blog-gallery-panel"><header><div><strong>Galeri PLUITS</strong><small>Pilih foto dari postingan milik akunmu</small></div><button type="button" data-close-gallery aria-label="Tutup">×</button></header><div class="pl-blog-gallery-grid" id="pl-blog-gallery-grid"><p>Memuat foto…</p></div></section>';
    document.body.append(modal);
    modal.querySelector('[data-close-gallery]').addEventListener('click',()=>modal.remove());
    modal.addEventListener('click',event=>{if(event.target===modal)modal.remove();});
    try {
      const [posts, media] = await Promise.all([
        supabase.from('user_posts').select('id,media_path,media_type,created_at').eq('user_id',activeUser.id).not('media_path','is',null).order('created_at',{ascending:false}).limit(100),
        supabase.from('post_media').select('id,post_id,media_path,media_type,created_at').eq('user_id',activeUser.id).order('created_at',{ascending:false}).limit(150)
      ]);
      if(posts.error) throw posts.error;
      if(media.error) throw media.error;
      const candidates = [
        ...(posts.data||[]).filter(row=>!row.media_type || row.media_type==='image').map(row=>({path:row.media_path,created_at:row.created_at})),
        ...(media.data||[]).filter(row=>!row.media_type || row.media_type==='image').map(row=>({path:row.media_path,created_at:row.created_at}))
      ];
      const unique = [...new Map(candidates.filter(row=>row.path).map(row=>[row.path,row])).values()];
      const urls = await createSignedUrlMap(supabase.storage,'pluits-user-media',unique.map(row=>row.path),1800);
      galleryItems = unique.filter(row=>urls.has(row.path)).map(row=>({...row,url:urls.get(row.path)}));
      const grid = modal.querySelector('#pl-blog-gallery-grid');
      grid.innerHTML = galleryItems.length ? galleryItems.map((row,index)=>'<button type="button" class="pl-blog-gallery-item" data-gallery-index="'+index+'"><img src="'+row.url+'" alt="Foto dari postingan saya" loading="lazy"><span>Pilih foto</span></button>').join('') : '<p class="pl-blog-gallery-empty">Belum ada foto dari postingan akun ini. Kamu bisa memilih gambar dari Galeri HP.</p>';
      grid.querySelectorAll('[data-gallery-index]').forEach(button=>button.addEventListener('click',async()=>{
        const chosen=galleryItems[Number(button.dataset.galleryIndex)];
        try{
          const response=await fetch(chosen.url);
          if(!response.ok)throw new Error('Foto tidak dapat dibuka.');
          const blob=await response.blob();
          selectedCoverFile=new File([blob],'pluits-gallery-'+Date.now()+'.'+((blob.type.split('/')[1]||'jpg').replace('jpeg','jpg')),{type:blob.type||'image/jpeg'});
          if(coverObjectUrl)URL.revokeObjectURL(coverObjectUrl);
          coverObjectUrl=URL.createObjectURL(selectedCoverFile);
          const wrap=document.querySelector('#pl-blog-cover-preview-wrap');
          wrap.innerHTML='<img id="pl-blog-cover-preview" src="'+coverObjectUrl+'" alt="Pratinjau cover">';
          document.querySelector('#pl-blog-cover-input').value='';
          modal.remove();
          notify('Foto dari Galeri PLUITS dipilih untuk cover blog.');
        }catch(error){notify(error.message||'Foto gagal dipilih.','error');}
      }));
    } catch(error) {
      modal.querySelector('#pl-blog-gallery-grid').innerHTML='<p class="pl-blog-gallery-empty">Galeri PLUITS belum dapat dimuat. Kamu masih bisa memilih gambar dari Galeri HP.</p>';
      console.error('PLUITS media gallery:',error);
    }
  });
  document.querySelector('#pl-blog-support-input')?.addEventListener('change', event => {
    const files = Array.from(event.target.files || []);
    const existingCount=(window.__plBlogEditingItem?.supporting_paths||[]).length;
    const invalid=files.find(file=>!validateMediaFile(file).valid);
    if(invalid){event.target.value='';return notify(invalid.size>50*1024*1024?'Media maksimal 50 MB per file.':'Format media tidak didukung. Gunakan foto atau video MP4, MOV, WebM, atau 3GP.','error');}
    if(existingCount+pendingSupportingFiles.length+files.length>15){event.target.value='';return notify('Maksimal 15 media pendukung per tulisan.','error');}
    pendingSupportingFiles=[...pendingSupportingFiles,...files];
    const grid=document.querySelector('#pl-blog-support-grid');
    if(grid)files.forEach((file,index)=>{
      const url=URL.createObjectURL(file);supportingObjectUrls.push(url);
      const tile=document.createElement('div');tile.className='pl-blog-support-tile';
      const mime=getMediaMime(file),media=mime.startsWith('video/')?document.createElement('video'):document.createElement('img');
      media.src=url;
      if(media.tagName==='VIDEO'){media.controls=true;media.playsInline=true;media.preload='metadata';}
      else media.alt='Gambar pendukung '+(grid.children.length+1);
      tile.append(media);grid.append(tile);
    });
    event.target.value='';
    if(files.length)notify(files.length+' media ditambahkan. Simpan draft agar media tersimpan.');
  });
  document.querySelector('[data-action="back-editor"]')?.addEventListener('click', () => {previewObjectUrls.forEach(url=>URL.revokeObjectURL(url));previewObjectUrls=[];setView('editor');});
}
export async function mountBlogStudio() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.hash = '#/account/login'; return; }
    activeUser = user;
    const { data: profile, error } = await supabase.from('user_profiles').select('display_name,username,avatar_path').eq('id', user.id).maybeSingle();
    if (error) throw error;
    activeProfile = profile || { display_name: user.email?.split('@')[0] || 'Pengguna', username: 'pengguna' };
    await loadBlogProfile();
    if(blogProfile){const migrated=await migrateLegacyDrafts();if(migrated)notify(migrated+' draft lama berhasil dipindahkan ke akun PLUITS.');}
    activeTab='posts';activeView=blogProfile?'dashboard':'setup';editingId=null;
    await render();
  } catch (error) { showError(error); }
}

export async function mountPublicBlog(username,blogSlug,postSlug=''){
 try{
  const {data:route,error}=await supabase.from('blog_public_routes').select('*').eq('username',username).eq('slug',blogSlug).maybeSingle();if(error)throw error;if(!route||route.default_visibility!=='public')throw Error('Blog tidak ditemukan.');
  let q=supabase.from('blog_posts').select('id,title,slug,description,body,cover_path,supporting_paths,published_at').eq('blog_id',route.blog_id).eq('status','published').eq('visibility','public');if(postSlug)q=q.eq('slug',postSlug);
  const {data,error:pe}=await q.order('published_at',{ascending:false});if(pe)throw pe;if(postSlug&&!data?.length)throw Error('Tulisan tidak ditemukan.');
  const rows=data||[],paths=rows.flatMap(x=>[x.cover_path,...(x.supporting_paths||[])]),urls=await createSignedUrlMap(supabase.storage,BUCKET,paths,3600),base='/@'+encodeURIComponent(username)+'/blog/'+encodeURIComponent(blogSlug);
  const html='<main class="pl-blog-public"><header><a href="#/">PLUITS</a><a href="#/@'+encodeURIComponent(username)+'">@'+esc(username)+' · Lihat profil & ikuti</a></header><section class="pl-blog-public-head"><span>RUANG BLOG</span><h1>'+esc(route.display_title)+'</h1><p>'+esc(route.description||'')+'</p></section>'+(postSlug?(()=>{const p=rows[0];return '<article class="pl-blog-public-article">'+(urls.get(p.cover_path)?'<img class="pl-blog-reading-cover" src="'+urls.get(p.cover_path)+'" alt="">':'')+'<h1>'+esc(p.title)+'</h1><p>'+esc(p.description)+'</p><div class="pl-blog-reading-body">'+esc(p.body).replace(/\n/g,'<br>')+'</div>'+(p.supporting_paths||[]).map(path=>urls.get(path)?(isVideoPath(path)?'<video class="pl-blog-public-support-video" src="'+urls.get(path)+'" controls playsinline preload="metadata"></video>':'<img class="pl-blog-public-support" src="'+urls.get(path)+'" alt="">'):'').join('')+'<a href="#'+base+'">Semua tulisan</a></article>';})():'<section class="pl-blog-public-list">'+(rows.map(p=>'<a class="pl-blog-public-card" href="#'+base+'/'+encodeURIComponent(p.slug)+'">'+(urls.get(p.cover_path)?'<img src="'+urls.get(p.cover_path)+'" alt="">':'')+'<div><h2>'+esc(p.title)+'</h2><p>'+esc(p.description)+'</p><span>Baca selengkapnya</span></div></a>').join('')||'<p>Belum ada tulisan publik.</p>')+'</section>')+'<footer>PLUITS · '+esc(route.display_title)+'</footer></main>';
  document.querySelector('#app').innerHTML=html;
 }catch(error){const app=document.querySelector('#app');if(app)app.innerHTML='<main class="pl-blog-public"><a href="#/">PLUITS</a><h1>Blog tidak tersedia</h1><p>'+esc(error.message)+'</p></main>';}
}
