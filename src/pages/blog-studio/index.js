import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../../lib/supabase/client.js';
import { createMediaUploader } from '../../features/media/storage-upload.js';
import { renderSocialHeader, renderSocialMobileNav } from '../../components/social/navigation.js';
import { renderBrandLogo } from '../../components/common/brand.js';
import { createSignedUrlMap } from '../../services/storage/signed-urls.js';
import { getMediaMime, getMediaExtension, validateMediaFile } from '../../features/media/media-types.js';
import { renderBlogThemePanel, readBlogThemeForm, applyBlogTheme } from '../../features/blog-theme/index.js';
import './blog-studio.css';


const BUCKET='pluits-user-media';
const uploadMedia=createMediaUploader({supabase,bucket:BUCKET,supabaseUrl:SUPABASE_URL,publishableKey:SUPABASE_PUBLISHABLE_KEY});
let blogProfile=null,categories=[],savedBodyRange=null;
let activeUser=null,activeProfile=null,activeTab='posts',activeView='dashboard',editingId=null,coverObjectUrl='',selectedCoverFile=null,galleryItems=[],supportingObjectUrls=[],pendingSupportingFiles=[],previewObjectUrls=[],toastTimer=null;
let autoSaveTimer=null,autoSaveInFlight=false,autoSaveQueued=false,pendingManualStatus=null,editorRevision=0,editorDirty=false;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const wordCount=value=>String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').trim().split(/\s+/).filter(Boolean).length;
const MAX_BODY_WORDS=1200;
function renderStoredBody(value,urls=new Map(),pendingUrls=[]){let html=safeBlogHtml(value);html=html.replace(/data-blog-media-path="([^"]+)"/g,(_,path)=>{const url=urls.get(path);return url?'src="'+esc(url)+'"':'';}).replace(/\sdata-blog-media-path="[^"]+"/g,'');html=html.replace(/<figure([^>]*?)data-blog-pending-index="(\d+)"([^>]*)>/g,(_,a,index,b)=>{const media=pendingUrls[Number(index)]||{};return '<figure'+a+b+'>'+(media.video?'<video src="'+esc(media.url||'')+'" controls playsinline></video>':'<img src="'+esc(media.url||'')+'" alt="Media dalam tulisan">');});return html.replace(/\sdata-blog-pending-index="\d+"/g,'');}
function safeBlogHtml(value){const template=document.createElement('template');template.innerHTML=String(value||'');const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','UL','OL','LI','BLOCKQUOTE','H2','H3','HR','FIGURE','FIGCAPTION','IMG','VIDEO']);const clean=node=>{for(const child of [...node.childNodes]){if(child.nodeType===Node.ELEMENT_NODE){if(!allowed.has(child.tagName)){child.replaceWith(document.createTextNode(child.textContent||''));continue;}for(const attr of [...child.attributes])if(!['src','alt','controls','playsinline','data-blog-media-path','data-blog-pending-index'].includes(attr.name))child.removeAttribute(attr.name);if(child.tagName==='IMG'||child.tagName==='VIDEO'){const src=child.getAttribute('src')||'';if(!src.startsWith('https://'))child.removeAttribute('src');}clean(child);}else if(child.nodeType!==Node.TEXT_NODE)child.remove();}};clean(template.content);return template.innerHTML;}
const uid=()=>crypto.randomUUID();
const ext=file=>(file?.name?.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,6)||'jpg';
const isVideoPath=path=>/\.(mp4|m4v|mov|webm|3gp|3gpp|3g2|3gp2)$/i.test(String(path||''));
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
async function getSettings(){return blogProfile?{blogTitle:blogProfile.display_title,blogDescription:blogProfile.description,visibility:blogProfile.default_visibility,publicPostOrder:blogProfile.public_post_order||'newest',featuredPostId:blogProfile.featured_post_id||'',templateKey:blogProfile.template_key||'aurelia',themeSettings:blogProfile.theme_settings||{},layoutSettings:blogProfile.layout_settings||{}}:{ };}
async function saveSettings(v){const {data,error}=await supabase.from('blog_profiles').update({display_title:v.blogTitle??blogProfile.display_title,description:v.blogDescription??blogProfile.description,default_visibility:v.visibility??blogProfile.default_visibility,public_post_order:v.publicPostOrder??blogProfile.public_post_order??'newest',featured_post_id:v.featuredPostId!==undefined?(v.featuredPostId||null):(blogProfile.featured_post_id||null),template_key:v.templateKey||blogProfile.template_key||'aurelia',theme_settings:v.themeSettings||blogProfile.theme_settings||{},layout_settings:v.layoutSettings||blogProfile.layout_settings||{blocks:['profile_header','featured_story','recent_stories','categories','photo_gallery','about_me','footer'],hidden:[]}}).eq('id',blogProfile.id).eq('owner_user_id',activeUser.id).select('*').single();if(error)throw error;blogProfile=data;}
async function deleteItem(id){return supabase.from('blog_posts').delete().eq('id',id).eq('owner_user_id',activeUser.id);}
async function uploadBlogImage(file,kind){if(!file)return null;const mime=getMediaMime(file);if(!mime?.startsWith('image/'))throw Error('Cover harus berupa gambar JPG, PNG, WebP, atau GIF.');if(file.size>12*1024*1024)throw Error('Gambar cover maksimal 12 MB.');const path=activeUser.id+'/blog/'+blogProfile.id+'/'+uid()+'-'+kind+'.'+getMediaExtension(file,mime);await uploadMedia(file,path,mime);return path;}
async function uploadBlogSupportingMedia(file,kind){const check=validateMediaFile(file);if(!check.valid)throw Error(check.reason==='too-large'?'Media pendukung maksimal 50 MB per file.':'Format media tidak didukung. Gunakan gambar, MP4, MOV, WebM, atau 3GP.');const path=activeUser.id+'/blog/'+blogProfile.id+'/'+uid()+'-'+kind+'.'+getMediaExtension(file,check.mime);await uploadMedia(file,path,check.mime);return path;}
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
    '<button type="button" data-tab="settings" class="' + (activeTab === 'settings' ? 'active' : '') + '">Pengaturan</button>' +
    '<button type="button" data-tab="appearance" class="' + (activeTab === 'appearance' ? 'active' : '') + '">Tampilan</button></nav>';
}
async function dashboardPage() {
  activeView = 'dashboard';
  const [items, settings] = await Promise.all([getAllItems(), getSettings()]);
  const visible = items.filter(item => activeTab === 'drafts' ? item.status === 'draft' : activeTab === 'posts' ? item.status === 'published' : false).sort((a,b)=>activeTab==='posts'?(new Date(b.published_at||b.updated_at)-new Date(a.published_at||a.updated_at)):(b.updatedAt-a.updatedAt));
  const name = activeProfile?.display_name || 'Penulis Pluits';
  const blogTitle = settings.blogTitle || ('Blog ' + name);
  const description = settings.blogDescription || 'Ruang untuk menyimpan cerita, pengalaman, dan karya.';
  const latestPublished=items.filter(item=>item.status==='published').sort((a,b)=>new Date(b.published_at||b.updated_at)-new Date(a.published_at||a.updated_at))[0];
  const heroCover=latestPublished?.cover_url?'<img class="pl-blog-hero-image" src="'+esc(latestPublished.cover_url)+'" alt="">':'';
  const publicBlogUrl='#/@'+encodeURIComponent(activeProfile?.username||'')+'/blog/'+encodeURIComponent(blogProfile?.slug||'');
  const profile = '<section class="pl-blog-hero">'+heroCover+'<div class="pl-blog-hero-content"><span class="pl-blog-hero-kicker">BLOG SAYA · PLUITS</span><div class="pl-blog-profile-row">' + avatarMarkup() + '<div><h2>' + esc(name) + '</h2><span>@' + esc(activeProfile?.username || 'akun-pluits') + '</span></div></div><h3>' + esc(blogTitle) + '</h3><p>' + esc(description) + '</p><div class="pl-blog-hero-actions"><button type="button" class="pl-blog-secondary" data-tab="settings">Pengaturan Blog</button>'+(blogProfile?.default_visibility==='public'?'<a class="pl-blog-hero-link" href="'+publicBlogUrl+'">Blog Saya ↗</a>':'<span class="pl-blog-private-label">Blog privat</span>')+'</div></div></section>';
  let body = '';
  if (activeTab === 'settings') {
    body = '<form id="pl-blog-settings-form" class="pl-blog-settings-form">' +
      '<label>Nama ruang blog<input name="blogTitle" required minlength="2" maxlength="40" value="' + esc(settings.blogTitle || '') + '" placeholder="Contoh: Catatan Perjalanan"><small>2–40 karakter. URL otomatis mengikuti nama blog.</small></label>' +
      '<label>Deskripsi blog<textarea name="blogDescription" rows="3" maxlength="220">' + esc(settings.blogDescription || '') + '</textarea><small>Deskripsi ruang blog, bukan deskripsi setiap tulisan.</small></label>' +
      '<label>Visibilitas default<select name="visibility"><option value="public" ' + ((settings.visibility || 'public') === 'public' ? 'selected' : '') + '>Publik</option><option value="private" ' + (settings.visibility === 'private' ? 'selected' : '') + '>Privat</option></select></label>' +
      '<label>Urutan artikel publik<select name="publicPostOrder"><option value="newest" ' + ((settings.publicPostOrder || 'newest') === 'newest' ? 'selected' : '') + '>Terbaru lebih dahulu</option><option value="oldest" ' + (settings.publicPostOrder === 'oldest' ? 'selected' : '') + '>Terlama lebih dahulu</option></select><small>Pengaturan ini mengatur urutan daftar artikel pada halaman publik.</small></label>' +
      '<label>Artikel utama / Hero<select name="featuredPostId"><option value="">Otomatis memakai artikel terbaru</option>' + items.filter(item=>item.status==='published').map(item=>'<option value="' + item.id + '" ' + (settings.featuredPostId===item.id?'selected':'') + '>' + esc(item.title) + '</option>').join('') + '</select><small>Artikel pilihan akan menjadi tampilan utama pada halaman blog.</small></label>' +
      '<p class="pl-blog-local-note">Alamat: ' + esc(location.origin + '/#/@' + (activeProfile?.username || '') + '/blog/' + (blogProfile?.slug || '')) + '. URL otomatis mengikuti username dan nama blog.</p><button class="pl-blog-primary" type="submit">Simpan pengaturan</button></form><section class="pl-blog-settings-form"><strong>Kategori tulisan</strong><div class="pl-blog-category-list">'+(categories.map(x=>'<span>'+esc(x.name)+'</span>').join('')||'<small>Belum ada kategori.</small>')+'</div><form id="pl-blog-category-form"><label>Tambah kategori<input name="name" maxlength="40" required></label><button class="pl-blog-secondary" type="submit">Tambah Kategori</button></form></section>';
  } else if (activeTab === 'appearance') {
    body = renderBlogThemePanel(blogProfile || {});
  } else if (!visible.length) {
    body = '<section class="pl-blog-empty"><div class="pl-blog-empty-icon">✎</div><h3>' + (activeTab === 'drafts' ? 'Belum ada draft' : 'Belum ada tulisan') + '</h3><p>' + (activeTab === 'drafts' ? 'Tulisan yang kamu simpan sebagai draft akan muncul di sini.' : 'Mulai dengan menulis cerita, puisi, pengalaman, atau catatan singkat pertamamu.') + '</p><button type="button" class="pl-blog-primary" data-action="new">Tulis Blog</button></section>';
  } else {
    body = '<div class="pl-blog-list">' + visible.map(item => {
      const cover = item.cover_url || '';
      const desc = esc(item.description || '');
      return '<article class="pl-blog-item" data-item-id="' + item.id + '">' +
        (cover ? '<img class="pl-blog-item-cover" src="' + cover + '" alt="Cover ' + esc(item.title) + '">' : '<div class="pl-blog-item-cover pl-blog-no-cover">Belum ada cover</div>') +
        '<div class="pl-blog-item-copy"><span class="pl-blog-item-status">' + (item.status === 'draft' ? 'DRAFT' : 'DITERBITKAN') + '</span><h3>' + esc(item.title === 'Draft tanpa judul' ? 'Tanpa judul' : item.title) + '</h3><p>' + desc + '</p><span class="pl-blog-read-more">Baca selengkapnya</span><small>' + new Date(item.updatedAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) + '</small>' +
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
    '<label class="pl-blog-field">Judul tulisan<input name="title" maxlength="140" required value="' + esc(item?.title === 'Draft tanpa judul' ? '' : item?.title || '') + '" placeholder="Tuliskan judul blog kamu"></label>' + '<details class="pl-blog-optional-settings"><summary>Pengaturan tambahan (opsional)</summary>' + '<div class="pl-blog-category-inline"><label class="pl-blog-field">Kategori<select name="category_id"><option value="">Pilih kategori</option>' + categories.map(c => '<option value="' + c.id + '" ' + (item?.category_id===c.id?'selected':'') + '>' + esc(c.name) + '</option>').join('') + '</select></label><button type="button" class="pl-blog-secondary" data-action="add-category-inline">＋ Buat kategori</button></div>' + '<label class="pl-blog-field">Visibilitas tulisan<select name="visibility"><option value="public" ' + ((item?.visibility || blogProfile?.default_visibility || 'public') === 'public' ? 'selected' : '') + '>Publik</option><option value="private" ' + (item?.visibility === 'private' || (!item && blogProfile?.default_visibility === 'private') ? 'selected' : '') + '>Privat</option></select></label>' +
    '<label class="pl-blog-field">Deskripsi untuk kartu feed<textarea name="description" id="pl-blog-description" rows="3" placeholder="Ringkas isi tulisan agar orang tertarik membacanya.">' + esc(item?.description || '') + '</textarea><small><span id="pl-blog-word-count">' + wordCount(item?.description || '') + '</span>/85 kata · Ditampilkan pada kartu feed dan dipotong dengan “Baca selengkapnya”.</small></label>' + '</details>' +
    '<section class="pl-blog-cover-field"><div><strong>Gambar utama / cover</strong><small>Dipakai sebagai thumbnail di feed, katalog Blog, dan hero tulisan.</small></div>' +
    '<div class="pl-blog-cover-actions"><button type="button" class="pl-blog-secondary" data-open-gallery>Galeri PLUITS</button><label class="pl-blog-secondary pl-blog-phone-picker" for="pl-blog-cover-input">Galeri HP<input id="pl-blog-cover-input" type="file" accept="image/*"></label></div><div class="pl-blog-cover-picker" id="pl-blog-cover-preview-wrap">' + (coverObjectUrl ? '<img id="pl-blog-cover-preview" src="' + coverObjectUrl + '" alt="Pratinjau cover">' : '<span id="pl-blog-cover-placeholder">＋</span><b>Belum ada gambar utama</b><small>Pilih dari Galeri PLUITS atau Galeri HP</small>') + '</div></section>' +
    '<section class="pl-blog-field"><span>Isi tulisan</span><div class="pl-blog-format-toolbar" role="toolbar" aria-label="Format tulisan"><button type="button" data-format="bold"><b>B</b></button><button type="button" data-format="italic"><i>I</i></button><button type="button" data-format="underline"><u>U</u></button><button type="button" data-format="insertUnorderedList" aria-label="Daftar berpoin">• Daftar</button><button type="button" data-format="insertOrderedList" aria-label="Daftar bernomor">1. Daftar</button><button type="button" data-format="formatBlock" data-value="blockquote">❝ Kutipan</button><button type="button" data-format="insertHorizontalRule">Garis</button><button type="button" data-action="insert-caption">Caption</button></div><div id="pl-blog-body-editor" class="pl-blog-rich-editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Mulai menulis cerita kamu di sini…">' + safeBlogHtml(item?.body || '') + '</div><small><span id="pl-blog-body-word-count">' + wordCount(item?.body || '') + '</span>/1.200 kata</small></section>' +
    '<section class="pl-blog-support-field"><div><strong>Foto dan video di dalam tulisan</strong><small>Letakkan kursor di bagian tulisan yang diinginkan, lalu sisipkan foto atau video. Tidak ada batas jumlah yang ditetapkan editor.</small></div><label class="pl-blog-support-picker" for="pl-blog-support-input">＋ Sisipkan foto atau video<input id="pl-blog-support-input" type="file" accept="image/*,video/*,.mp4,.m4v,.mov,.webm,.3gp,.3gpp,.3g2,.3gp2" multiple></label><div class="pl-blog-support-grid" id="pl-blog-support-grid">' + images + '</div></section>' +
    '<div id="pl-blog-save-state" class="pl-blog-save-state" data-state="muted" role="status" aria-live="polite">Perubahan tersimpan otomatis saat kamu mengetik.</div><div class="pl-blog-editor-note">Draft disimpan otomatis ke akun PLUITS. Judul dan cover bisa dilengkapi nanti.</div>' +
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
    '<h1>' + esc(item.title) + '</h1>' + (item.description ? '<p class="pl-blog-reading-description">' + esc(item.description) + '</p>' : '') + '<div class="pl-blog-reading-body">' + renderStoredBody(item.body,item.media_urls,item.pending_media_urls) + '</div>' +
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
function setEditorSaveState(message,kind='muted'){
 const el=document.querySelector('#pl-blog-save-state');if(!el)return;el.textContent=message;el.dataset.state=kind;
}
function scheduleEditorAutoSave(){
 if(activeView!=='editor')return;
 editorRevision++;editorDirty=true;setEditorSaveState('Perubahan belum tersimpan','pending');
 clearTimeout(autoSaveTimer);
 autoSaveTimer=setTimeout(()=>persistEditor('draft',{silent:true,stay:true}).catch(error=>{console.error('PLUITS Blog autosave:',error);setEditorSaveState('Belum tersimpan · periksa koneksi lalu coba lagi','error');}),1400);
}
async function persistEditor(status,options={}){
 const form=document.querySelector('#pl-blog-editor-form');if(!form)return;
 if(autoSaveInFlight){autoSaveQueued=true;if(!options.silent){pendingManualStatus=status;notify('Sedang menyimpan perubahan. Draft akan diselesaikan sesaat lagi.');}return;}
 autoSaveInFlight=true;const revisionAtStart=editorRevision;
 try{
  const d=new FormData(form),rawTitle=String(d.get('title')||'').trim(),description=String(d.get('description')||'').trim();
  let body=String(document.querySelector('#pl-blog-body-editor')?.innerHTML||'').trim();
  const isDraft=status==='draft';
  if(!isDraft&&!rawTitle)return notify('Judul tulisan wajib diisi.','error');
  if(wordCount(description)>85)return notify('Deskripsi maksimal 85 kata.','error');
  if(wordCount(body)>MAX_BODY_WORDS)return notify('Isi tulisan maksimal 1.200 kata.','error');
  const title=rawTitle||'Draft tanpa judul';
  const descriptionForDb=description||' ';
  let old=null;
  if(editingId){const r=await supabase.from('blog_posts').select('*').eq('id',editingId).eq('owner_user_id',activeUser.id).single();if(r.error)throw r.error;old=r.data;}
  const file=readFormFile(document.querySelector('#pl-blog-cover-input'))||selectedCoverFile;
  let coverPath=old?.cover_path||null;
  if(file){coverPath=await uploadBlogImage(file,'cover');selectedCoverFile=null;}
  if(!isDraft&&!coverPath)return notify('Pilih gambar utama sebelum menerbitkan tulisan.','error');
  const support=[...(old?.supporting_paths||[])];
  for(let i=0;i<pendingSupportingFiles.length;i++){
   const f=pendingSupportingFiles[i],path=await uploadBlogSupportingMedia(f,'body');support.push(path);
   const editor=document.createElement('div');editor.innerHTML=body;
   const pending=editor.querySelector('[data-blog-pending-index="'+i+'"]');
   if(pending){const media=document.createElement(isVideoPath(path)?'video':'img');media.setAttribute('data-blog-media-path',path);if(media.tagName==='VIDEO'){media.controls=true;media.playsInline=true;}else media.alt='Foto dalam artikel';const figure=document.createElement('figure');figure.append(media);pending.replaceWith(figure);body=editor.innerHTML;}
  }
  const payload={blog_id:blogProfile.id,owner_user_id:activeUser.id,title,description:descriptionForDb,body:body||'<p></p>',cover_path:coverPath,supporting_paths:support,status,visibility:blogProfile.default_visibility==='private'?'private':String(d.get('visibility')||'public'),category_id:String(d.get('category_id')||'')||null,updated_at:new Date().toISOString(),published_at:status==='published'?(old?.published_at||new Date().toISOString()):old?.published_at||null};
  const q=editingId?supabase.from('blog_posts').update(payload).eq('id',editingId).eq('owner_user_id',activeUser.id):supabase.from('blog_posts').insert(payload);
  const {data,error}=await q.select('*').single();if(error)throw error;
  editingId=data.id;window.__plBlogEditingItem=data;pendingSupportingFiles=[];
  if(options.stay){
   const bodyEditor=document.querySelector('#pl-blog-body-editor');
  document.querySelector('#pl-blog-editor-form')?.addEventListener('input',scheduleEditorAutoSave);
  document.querySelector('#pl-blog-editor-form')?.addEventListener('change',scheduleEditorAutoSave);if(bodyEditor&&body!==String(bodyEditor.innerHTML||'').trim())bodyEditor.innerHTML=body;
   if(editorRevision===revisionAtStart){editorDirty=false;setEditorSaveState('Draft tersimpan otomatis · '+new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}),'saved');}
   return data;
  }
  notify(status==='draft'?'Draft tersimpan di Blog Saya.':'Tulisan berhasil diterbitkan.');
  activeTab=status==='draft'?'drafts':'posts';activeView='dashboard';editorDirty=false;window.__plBlogEditingItem=null;
  previewObjectUrls.forEach(url=>URL.revokeObjectURL(url));previewObjectUrls=[];revokePreviews();await render();return data;
 } finally {
  autoSaveInFlight=false;
  const manualStatus=pendingManualStatus;pendingManualStatus=null;
  if(manualStatus){autoSaveQueued=false;setTimeout(()=>persistEditor(manualStatus).catch(error=>{console.error('PLUITS Blog draft:',error);notify(error?.message||'Draft belum berhasil disimpan.','error');}),0);}
  else if(autoSaveQueued||editorDirty){autoSaveQueued=false;if(activeView==='editor'){clearTimeout(autoSaveTimer);autoSaveTimer=setTimeout(()=>persistEditor('draft',{silent:true,stay:true}).catch(error=>{console.error('PLUITS Blog autosave:',error);setEditorSaveState('Belum tersimpan · periksa koneksi lalu coba lagi','error');}),500);}}
 }
}

function bind() {
  document.querySelector('#pl-blog-create-form')?.addEventListener('submit',async e=>{e.preventDefault();const d=new FormData(e.currentTarget),title=String(d.get('title')||'').trim();if(title.length<2||title.length>40)return notify('Nama blog harus 2–40 karakter.','error');const {data,error}=await supabase.from('blog_profiles').insert({owner_user_id:activeUser.id,display_title:title,description:String(d.get('description')||'').trim(),default_visibility:String(d.get('visibility')||'public')}).select('*').single();if(error)throw error;blogProfile=data;const migrated=await migrateLegacyDrafts();activeView='dashboard';notify(migrated?migrated+' draft lama berhasil dipindahkan.':'Ruang blog berhasil dibuat.');await render();});
  document.querySelector('#pl-blog-settings-form')?.addEventListener('submit',async e=>{e.preventDefault();const d=new FormData(e.currentTarget);const title=String(d.get('blogTitle')||'').trim();if(title.length<2||title.length>40)return notify('Nama blog harus 2–40 karakter.','error');try{await saveSettings({blogTitle:title,blogDescription:String(d.get('blogDescription')||'').trim(),visibility:String(d.get('visibility')||'public'),publicPostOrder:String(d.get('publicPostOrder')||'newest'),featuredPostId:String(d.get('featuredPostId')||'')});notify('Pengaturan blog tersimpan.');await render();}catch(error){notify(error.message||'Pengaturan belum tersimpan.','error');}});
  document.querySelector('#pl-blog-theme-form')?.addEventListener('submit',async e=>{e.preventDefault();try{const value=readBlogThemeForm(e.currentTarget);await saveSettings({blogTitle:blogProfile.display_title,blogDescription:blogProfile.description,visibility:blogProfile.default_visibility,publicPostOrder:blogProfile.public_post_order||'newest',featuredPostId:blogProfile.featured_post_id||'',...value});notify('Tampilan blog berhasil disimpan.');await render();}catch(error){notify(error.message||'Tampilan belum berhasil disimpan.','error');}});
  document.querySelectorAll('#pl-blog-theme-form input[name="templateKey"]').forEach(input=>input.addEventListener('change',()=>{document.querySelectorAll('.pl-blog-template-option').forEach(label=>label.classList.toggle('is-selected',label.contains(input)&&input.checked));}));
  document.querySelectorAll('#pl-blog-theme-form [data-block-up],#pl-blog-theme-form [data-block-down]').forEach(button=>button.addEventListener('click',()=>{const form=document.querySelector('#pl-blog-theme-form'),list=form?.querySelector('.pl-blog-block-list'),row=button.closest('[data-block-key]');if(!list||!row)return;const next=button.hasAttribute('data-block-up')?row.previousElementSibling:row.nextElementSibling;if(next){if(button.hasAttribute('data-block-up'))list.insertBefore(row,next);else list.insertBefore(next,row);}const order=form.querySelector('[name="blockOrder"]');if(order)order.value=[...list.children].map(item=>item.dataset.blockKey).join(',');}));
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
  document.querySelector('[data-action="save-draft"]')?.addEventListener('click', () => persistEditor('draft').catch(error=>{console.error('PLUITS Blog draft:',error);notify(error?.message||'Draft belum berhasil disimpan. Coba lagi.','error');setEditorSaveState('Draft belum tersimpan','error');}));
  document.querySelector('[data-action="preview"]')?.addEventListener('click', async () => {
    const form=document.querySelector('#pl-blog-editor-form'),data=new FormData(form);
    const title=String(data.get('title')||'').trim(),description=String(data.get('description')||'').trim(),body=String(document.querySelector('#pl-blog-body-editor')?.innerHTML||'').trim();
    const old=editingId?(await supabase.from('blog_posts').select('cover_path,supporting_paths').eq('id',editingId).single()).data:null;
    const file=readFormFile(document.querySelector('#pl-blog-cover-input'))||selectedCoverFile;
    let coverUrl=file?URL.createObjectURL(file):'';
    if(file&&coverUrl)previewObjectUrls.push(coverUrl);
    if(!coverUrl&&old?.cover_path)coverUrl=(await createSignedUrlMap(supabase.storage,BUCKET,[old.cover_path],3600)).get(old.cover_path)||'';
    if(!title||!coverUrl)return notify('Judul dan gambar utama wajib tersedia untuk pratinjau.','error');if(wordCount(body)>MAX_BODY_WORDS)return notify('Isi tulisan maksimal 1.200 kata.','error');
    if(wordCount(description)>85)return notify('Deskripsi maksimal 85 kata.','error');
    const oldPaths=old?.supporting_paths||[],oldUrls=oldPaths.length?await createSignedUrlMap(supabase.storage,BUCKET,oldPaths,1800):new Map();
    const pendingUrls=pendingSupportingFiles.map(file=>{const url=URL.createObjectURL(file);previewObjectUrls.push(url);return {url,video:getMediaMime(file).startsWith('video/')};});
    const supporting_media=oldPaths.filter(path=>oldUrls.has(path)&&!body.includes('data-blog-media-path="'+path+'"')).map(path=>({path,url:oldUrls.get(path)}));
    window.__plBlogPreviewItem={title,description,body,cover_url:coverUrl,supporting_media,media_urls:oldUrls,pending_media_urls:pendingUrls};
    setView('preview');
  });
  document.querySelector('#pl-blog-editor-form')?.addEventListener('submit', event => { event.preventDefault(); persistEditor('published').catch(showError); });
  const bodyEditor=document.querySelector('#pl-blog-body-editor');
  document.querySelectorAll('[data-format]').forEach(button=>{button.addEventListener('pointerdown',event=>{const selection=window.getSelection();if(selection?.rangeCount&&bodyEditor?.contains(selection.anchorNode))savedBodyRange=selection.getRangeAt(0).cloneRange();event.preventDefault();});button.addEventListener('click',()=>{bodyEditor?.focus();if(savedBodyRange){const selection=window.getSelection();selection.removeAllRanges();selection.addRange(savedBodyRange);}const command=button.dataset.format;if(command==='formatBlock')document.execCommand(command,false,button.dataset.value||'blockquote');else document.execCommand(command,false,null);bodyEditor?.dispatchEvent(new Event('input',{bubbles:true}));});});
  document.querySelector('[data-action="insert-caption"]')?.addEventListener('click',()=>{bodyEditor?.focus();document.execCommand('insertHTML',false,'<figure><figcaption>Tulis caption gambar di sini…</figcaption></figure>');bodyEditor?.dispatchEvent(new Event('input',{bubbles:true}));});
  bodyEditor?.addEventListener('input',()=>{const count=wordCount(bodyEditor.innerHTML),output=document.querySelector('#pl-blog-body-word-count');if(output)output.textContent=String(count);output?.classList.toggle('is-over',count>MAX_BODY_WORDS);});
  document.querySelector('[data-action="add-category-inline"]')?.addEventListener('click',async()=>{const name=window.prompt('Nama kategori baru:');if(!name?.trim())return;const {error}=await supabase.from('blog_categories').insert({blog_id:blogProfile.id,owner_user_id:activeUser.id,name:name.trim().slice(0,40)});if(error)throw error;await loadBlogProfile();await render();notify('Kategori berhasil dibuat.');});
  document.querySelector('#pl-blog-description')?.addEventListener('input', event => {
    const count = wordCount(event.target.value);
    const output = document.querySelector('#pl-blog-word-count');
    if (output) output.textContent = String(count);
    output?.classList.toggle('is-over', count > 85);
  });
  document.querySelector('[data-action="apply-cover-crop"]')?.addEventListener('click',async()=>{const source=selectedCoverFile;if(!source)return notify('Pilih gambar cover terlebih dahulu.','error');const image=new Image(),url=URL.createObjectURL(source);image.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=900;const ctx=canvas.getContext('2d');const scale=Math.max(canvas.width/image.width,canvas.height/image.height),w=image.width*scale,h=image.height*scale,x=(canvas.width-w)*(Number(document.querySelector('#pl-blog-crop-x')?.value||50)/100),y=(canvas.height-h)*(Number(document.querySelector('#pl-blog-crop-y')?.value||50)/100);ctx.drawImage(image,x,y,w,h);canvas.toBlob(blob=>{if(!blob){notify('Potongan gambar gagal dibuat.','error');return;}selectedCoverFile=new File([blob],'pluits-blog-cover.jpg',{type:'image/jpeg'});if(coverObjectUrl)URL.revokeObjectURL(coverObjectUrl);coverObjectUrl=URL.createObjectURL(selectedCoverFile);const preview=document.querySelector('#pl-blog-cover-preview');if(preview)preview.src=coverObjectUrl;URL.revokeObjectURL(url);notify('Potongan cover berhasil diterapkan.');},'image/jpeg',0.9);}catch(error){URL.revokeObjectURL(url);notify('Tidak dapat memproses crop gambar.','error');}};image.onerror=()=>{URL.revokeObjectURL(url);notify('Gambar tidak dapat dibuka untuk crop.','error');};image.src=url;});
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
      scheduleEditorAutoSave();
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
  document.querySelector('#pl-blog-body-editor')?.addEventListener('keyup',()=>{const selection=window.getSelection();if(selection?.rangeCount)savedBodyRange=selection.getRangeAt(0).cloneRange();});
  document.querySelector('#pl-blog-support-input')?.addEventListener('pointerdown',()=>{const selection=window.getSelection();if(selection?.rangeCount&&bodyEditor?.contains(selection.anchorNode))savedBodyRange=selection.getRangeAt(0).cloneRange();});
  document.querySelector('#pl-blog-support-input')?.addEventListener('change', event => {
    const files = Array.from(event.target.files || []);
    const existingCount=(window.__plBlogEditingItem?.supporting_paths||[]).length;
    const invalid=files.find(file=>!validateMediaFile(file).valid);
    if(invalid){event.target.value='';return notify(invalid.size>50*1024*1024?'Media maksimal 50 MB per file.':'Format media tidak didukung. Gunakan foto atau video MP4, MOV, WebM, atau 3GP.','error');}
    
    const startIndex=pendingSupportingFiles.length;pendingSupportingFiles=[...pendingSupportingFiles,...files];
    const fileUrls=files.map(file=>{const url=URL.createObjectURL(file);supportingObjectUrls.push(url);return url;});
    const editor=document.querySelector('#pl-blog-body-editor');if(editor){editor.focus();if(savedBodyRange){const selection=window.getSelection();selection.removeAllRanges();selection.addRange(savedBodyRange);}files.forEach((file,index)=>{const mime=getMediaMime(file),media=mime.startsWith('video/')?'<video src="'+fileUrls[index]+'" controls playsinline></video>':'<img src="'+fileUrls[index]+'" alt="Foto dalam tulisan">';const marker='<figure data-blog-pending-index="'+(startIndex+index)+'">'+media+'<figcaption>Media: '+esc(file.name)+'</figcaption></figure>';document.execCommand('insertHTML',false,marker);});editor.dispatchEvent(new Event('input',{bubbles:true}));}
    const grid=document.querySelector('#pl-blog-support-grid');
    if(grid)files.forEach((file,index)=>{
      const tile=document.createElement('div');tile.className='pl-blog-support-tile';
      const mime=getMediaMime(file),media=mime.startsWith('video/')?document.createElement('video'):document.createElement('img');
      media.src=fileUrls[index];
      if(media.tagName==='VIDEO'){media.controls=true;media.playsInline=true;media.preload='metadata';}
      else media.alt='Gambar pendukung '+(grid.children.length+1);
      tile.append(media);grid.append(tile);
    });
    event.target.value='';
    if(files.length){notify(files.length+' media ditambahkan.');scheduleEditorAutoSave();}
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
    if(!window.__plBlogLifecycleBound){window.__plBlogLifecycleBound=true;document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&activeView==='editor'&&editorDirty)persistEditor('draft',{silent:true,stay:true}).catch(error=>console.error('PLUITS Blog final autosave:',error));});window.addEventListener('pagehide',()=>{if(activeView==='editor'&&editorDirty)persistEditor('draft',{silent:true,stay:true}).catch(error=>console.error('PLUITS Blog pagehide autosave:',error));});}
    activeTab='posts';activeView=blogProfile?'dashboard':'setup';editingId=null;
    await render();
  } catch (error) { showError(error); }
}

export async function mountPublicBlog(username,blogSlug,postSlug=''){
 try{
  const {data:route,error}=await supabase.from('blog_public_routes').select('*').eq('username',username).eq('slug',blogSlug).maybeSingle();
  if(error)throw error;
  if(!route||route.default_visibility!=='public')throw Error('Blog tidak ditemukan.');
  const [{data:blog,error:blogError},{data:categories,error:categoryError},{data:author,error:authorError}]=await Promise.all([
   supabase.from('blog_profiles').select('id,owner_user_id,display_title,description,featured_post_id,public_post_order,template_key,theme_settings,layout_settings').eq('id',route.blog_id).maybeSingle(),
   supabase.from('blog_categories').select('id,name,sort_order').eq('blog_id',route.blog_id).order('sort_order',{ascending:true}).order('name',{ascending:true}),
   supabase.from('user_profiles').select('id,display_name,username,avatar_path,bio').eq('username',username).maybeSingle()
  ]);
  if(blogError||categoryError||authorError)throw blogError||categoryError||authorError;
  if(!blog||!author||blog.owner_user_id!==author.id)throw Error('Identitas blog tidak tersedia.');
  const ascending=blog.public_post_order==='oldest';
  const {data:rows,error:postError}=await supabase.from('blog_posts').select('id,title,slug,description,body,cover_path,supporting_paths,published_at,created_at,category_id').eq('blog_id',route.blog_id).eq('owner_user_id',blog.owner_user_id).eq('status','published').eq('visibility','public').order('published_at',{ascending}).limit(80);
  if(postError)throw postError;
  const posts=rows||[];
  if(postSlug&&!posts.some(post=>post.slug===postSlug))throw Error('Tulisan tidak ditemukan.');
  const featured=posts.find(post=>post.id===blog.featured_post_id)||posts[0]||null;
  const selected=postSlug?posts.find(post=>post.slug===postSlug):null;
  const paths=posts.flatMap(post=>[post.cover_path,...(post.supporting_paths||[])]).concat(author.avatar_path||'').filter(Boolean);
  const urls=await createSignedUrlMap(supabase.storage,BUCKET,paths,3600);
  const base='#/@'+encodeURIComponent(username)+'/blog/'+encodeURIComponent(blogSlug);
  const authorUrl='#/@'+encodeURIComponent(username);
  const authorAvatar=urls.get(author.avatar_path)||'';
  const authorBlock='<a class="pl-blog-author" href="'+authorUrl+'">'+(authorAvatar?'<img src="'+esc(authorAvatar)+'" alt="">':'<span class="pl-blog-author-fallback">'+esc((author.display_name||'P').slice(0,1).toUpperCase())+'</span>')+'<span><strong>'+esc(author.display_name||'Penulis Pluits')+'</strong><small>@'+esc(author.username)+' · Penulis</small></span></a>';
  const categoryName=id=>(categories||[]).find(category=>category.id===id)?.name||'Cerita';
  const card=post=>'<article class="pl-blog-public-card" data-blog-category="'+esc(post.category_id||'')+'"><a class="pl-blog-public-card-cover" href="'+base+'/'+encodeURIComponent(post.slug)+'">'+(urls.get(post.cover_path)?'<img src="'+esc(urls.get(post.cover_path))+'" alt="'+esc(post.title)+'" loading="lazy">':'<span>PLUITS BLOG</span>')+'</a><div class="pl-blog-public-card-copy"><small>'+esc(categoryName(post.category_id))+' · '+new Date(post.published_at||post.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})+'</small><h2><a href="'+base+'/'+encodeURIComponent(post.slug)+'">'+esc(post.title)+'</a></h2><p>'+esc(post.description||'')+'</p><a class="pl-blog-public-read" href="'+base+'/'+encodeURIComponent(post.slug)+'">Baca artikel <span aria-hidden="true">↗</span></a></div></article>';
  const categoriesBar='<nav data-blog-block="categories" class="pl-blog-category-carousel" aria-label="Kategori artikel"><button type="button" class="is-active" data-blog-filter="all">Semua tulisan</button>'+(categories||[]).map(category=>'<button type="button" data-blog-filter="'+esc(category.id)+'">'+esc(category.name)+'</button>').join('')+'</nav>';
  const galleryBlock='<section data-blog-block="photo_gallery" class="pl-blog-related"><h2>Galeri Foto</h2><div class="pl-blog-public-grid">'+posts.filter(post=>urls.get(post.cover_path)).slice(0,12).map(post=>'<a class="pl-blog-public-card" href="'+base+'/'+encodeURIComponent(post.slug)+'"><img class="pl-blog-public-card-cover" src="'+esc(urls.get(post.cover_path))+'" alt="'+esc(post.title)+'" loading="lazy"><div class="pl-blog-public-card-copy"><strong>'+esc(post.title)+'</strong></div></a>').join('')+'</div></section>';
  const aboutBlock='<section data-blog-block="about_me" class="pl-blog-public-intro"><div><span class="pl-blog-public-kicker">TENTANG PENULIS</span><h2>'+esc(author.display_name||'Penulis')+'</h2><p>'+esc(author.bio||'Ruang personal untuk berbagi cerita dan pengalaman.')+'</p></div>'+authorBlock+'</section>';
  let content='',shareUrl=selected?(location.origin+location.pathname+base+'/'+encodeURIComponent(selected.slug)):'';
  if(selected){
   const related=posts.filter(post=>post.id!==selected.id&&selected.category_id&&post.category_id===selected.category_id).slice(0,3);
   const recommendations=posts.filter(post=>post.id!==selected.id&&!related.some(item=>item.id===post.id)).slice(0,3);
   const supporting=(selected.supporting_paths||[]).filter(path=>!String(selected.body||'').includes('data-blog-media-path="'+path+'"')).map(path=>urls.get(path)?(isVideoPath(path)?'<video class="pl-blog-public-support-video" src="'+esc(urls.get(path))+'" controls playsinline preload="metadata"></video>':'<img class="pl-blog-public-support" src="'+esc(urls.get(path))+'" alt="">'):'').join('');
   content='<article class="pl-blog-article"><a class="pl-blog-article-back" href="'+base+'">← Kembali ke '+esc(blog.display_title)+'</a>'+(urls.get(selected.cover_path)?'<img class="pl-blog-article-cover" src="'+esc(urls.get(selected.cover_path))+'" alt="'+esc(selected.title)+'">':'')+'<div class="pl-blog-article-meta"><span>'+esc(categoryName(selected.category_id))+'</span><time>'+new Date(selected.published_at||selected.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})+'</time></div><h1>'+esc(selected.title)+'</h1><p class="pl-blog-article-description">'+esc(selected.description||'')+'</p>'+authorBlock+'<div class="pl-blog-reading-body">'+renderStoredBody(selected.body,urls)+'</div>'+supporting+'<div class="pl-blog-article-share"><span>Bagikan cerita ini</span><button type="button" data-share-blog>Bagikan <span aria-hidden="true">↗</span></button></div>'+(related.length?'<section class="pl-blog-related"><h2>Artikel terkait</h2><div class="pl-blog-public-grid">'+related.map(card).join('')+'</div></section>':'')+(recommendations.length?'<section class="pl-blog-related"><h2>Rekomendasi lainnya</h2><div class="pl-blog-public-grid">'+recommendations.map(card).join('')+'</div></section>':'')+'</article>';
  }else{
   content='<section data-blog-block="featured_story" class="pl-blog-public-hero">'+(featured&&urls.get(featured.cover_path)?'<img class="pl-blog-public-hero-image" src="'+esc(urls.get(featured.cover_path))+'" alt="">':'<div class="pl-blog-public-hero-placeholder"></div>')+'<div class="pl-blog-public-hero-overlay"><span class="pl-blog-public-kicker">RUANG CERITA · PLUITS</span><h1>'+esc(blog.display_title)+'</h1><p>'+esc(blog.description||'Cerita, pengalaman, dan pemikiran dari '+author.display_name+'.')+'</p><a href="'+(featured?base+'/'+encodeURIComponent(featured.slug):'#blog-articles')+'">'+(featured?'Baca cerita pilihan':'Jelajahi tulisan')+' <span aria-hidden="true">↗</span></a></div></section>'+categoriesBar+'<section data-blog-block="profile_header" class="pl-blog-public-intro"><div><span class="pl-blog-public-kicker">MENGENAL BLOG INI</span><h2>'+esc(blog.display_title)+'</h2><p>'+esc(blog.description||'Ruang berbagi cerita dan pengalaman.')+'</p></div>'+authorBlock+'</section><section data-blog-block="recent_stories" class="pl-blog-public-section" id="blog-articles"><div class="pl-blog-public-section-head"><div><span class="pl-blog-public-kicker">DARI PENULIS</span><h2>Jelajahi tulisan</h2></div><span>'+posts.length+' artikel</span></div><div class="pl-blog-public-grid">'+posts.map(card).join('')+'</div>'+(posts.length?'':'<p class="pl-blog-public-empty">Belum ada artikel yang diterbitkan.</p>')+'</section>'+galleryBlock+aboutBlock;
  }
  const html='<main class="pl-blog-public '+(selected?'is-reading':'')+'"><header class="pl-blog-public-header">'+renderBrandLogo({href:base,className:'pl-blog-public-brand',size:32,label:'Halaman utama blog',wordmark:true})+'<a class="pl-blog-public-profile-link" href="'+authorUrl+'">Profil penulis <span aria-hidden="true">↗</span></a></header>'+content+'<footer data-blog-block="footer" class="pl-blog-public-footer"><span>'+esc(blog.display_title)+' · '+esc(author.display_name)+'</span><a href="#/">Didukung oleh <strong>PLUITS</strong></a></footer></main>';
  document.querySelector('#app').innerHTML=html;
  applyBlogTheme(document.querySelector('.pl-blog-public'),blog);
  document.querySelectorAll('[data-blog-filter]').forEach(button=>button.addEventListener('click',()=>{
   document.querySelectorAll('[data-blog-filter]').forEach(item=>item.classList.toggle('is-active',item===button));
   document.querySelectorAll('.pl-blog-public-card[data-blog-category]').forEach(item=>{item.hidden=button.dataset.blogFilter!=='all'&&item.dataset.blogCategory!==button.dataset.blogFilter;});
  }));
  const shareButton=document.querySelector('[data-share-blog]');
  if(shareButton)shareButton.addEventListener('click',async()=>{
   const shareData={title:selected.title,text:selected.description||blog.display_title,url:shareUrl};
   try{if(navigator.share)await navigator.share(shareData);else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareUrl);shareButton.textContent='Tautan disalin';}else window.prompt('Salin tautan tulisan ini:',shareUrl);}
   catch(error){if(error?.name!=='AbortError')window.prompt('Salin tautan tulisan ini:',shareUrl);}
  });
 }catch(error){const app=document.querySelector('#app');if(app)app.innerHTML='<main class="pl-blog-public pl-blog-public-error"><a href="#/">PLUITS</a><h1>Blog tidak tersedia</h1><p>'+esc(error.message)+'</p></main>';}
}
