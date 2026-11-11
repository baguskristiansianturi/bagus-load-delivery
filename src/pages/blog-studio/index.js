import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { renderSocialHeader, renderSocialMobileNav } from '../../components/social/navigation.js';
import './blog-studio.css';

const DB_URL = 'https://ytndswhqxayqpftszwfh.supabase.co';
const DB_KEY = 'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65';
const supabase = createClient(DB_URL, DB_KEY);
const DB_NAME = 'pluits-blog-studio-v1';
const STORE = 'items';
const SETTINGS = 'settings';
let activeUser = null;
let activeProfile = null;
let activeTab = 'posts';
let activeView = 'dashboard';
let editingId = null;
let coverObjectUrl = '';
let supportingObjectUrls = [];
let toastTimer = null;

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const wordCount = value => String(value || '').trim().split(/\s+/).filter(Boolean).length;
const uid = () => crypto.randomUUID();

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(SETTINGS)) db.createObjectStore(SETTINGS, { keyPath: 'userId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function storeRecord(storeName, mode, action) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const request = action(tx.objectStore(storeName));
    tx.oncomplete = () => { db.close(); resolve(request?.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
const getAllItems = async () => (await storeRecord(STORE, 'readonly', store => store.getAll()) || []).filter(item => item.userId === activeUser.id);
const saveItem = item => storeRecord(STORE, 'readwrite', store => store.put(item));
const deleteItem = id => storeRecord(STORE, 'readwrite', store => store.delete(id));
const getSettings = async () => (await storeRecord(SETTINGS, 'readonly', store => store.get(activeUser.id))) || {};
const saveSettings = settings => storeRecord(SETTINGS, 'readwrite', store => store.put({ ...settings, userId: activeUser.id }));

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
  const visible = items.filter(item => activeTab === 'drafts' ? item.status === 'draft' : activeTab === 'posts' ? item.status === 'published' : false).sort((a,b) => b.updatedAt - a.updatedAt);
  const name = activeProfile?.display_name || 'Penulis Pluits';
  const blogTitle = settings.blogTitle || ('Blog ' + name);
  const description = settings.blogDescription || 'Ruang untuk menyimpan cerita, pengalaman, dan karya.';
  const profile = '<section class="pl-blog-identity"><div class="pl-blog-profile-row">' + avatarMarkup() + '<div><h2>' + esc(name) + '</h2><span>@' + esc(activeProfile?.username || 'akun-pluits') + '</span></div><span class="pl-blog-owner-chip">Blog saya</span></div><h3>' + esc(blogTitle) + '</h3><p>' + esc(description) + '</p></section>';
  let body = '';
  if (activeTab === 'settings') {
    body = '<form id="pl-blog-settings-form" class="pl-blog-settings-form">' +
      '<label>Nama ruang blog<input name="blogTitle" maxlength="70" value="' + esc(settings.blogTitle || '') + '" placeholder="Contoh: Catatan Perjalanan"></label>' +
      '<label>Deskripsi blog<textarea name="blogDescription" rows="3" maxlength="220">' + esc(settings.blogDescription || '') + '</textarea><small>Deskripsi ruang blog, bukan deskripsi setiap tulisan.</small></label>' +
      '<label>Visibilitas default<select name="visibility"><option value="public" ' + ((settings.visibility || 'public') === 'public' ? 'selected' : '') + '>Publik</option><option value="followers" ' + (settings.visibility === 'followers' ? 'selected' : '') + '>Pengikut saja</option><option value="private" ' + (settings.visibility === 'private' ? 'selected' : '') + '>Privat</option></select></label>' +
      '<p class="pl-blog-local-note">Pengaturan ini masih tersimpan lokal di perangkat untuk tahap pengujian editor.</p><button class="pl-blog-primary" type="submit">Simpan pengaturan</button></form>';
  } else if (!visible.length) {
    body = '<section class="pl-blog-empty"><div class="pl-blog-empty-icon">✎</div><h3>' + (activeTab === 'drafts' ? 'Belum ada draft' : 'Belum ada tulisan') + '</h3><p>' + (activeTab === 'drafts' ? 'Tulisan yang kamu simpan sebagai draft akan muncul di sini.' : 'Mulai dengan menulis cerita, puisi, pengalaman, atau catatan singkat pertamamu.') + '</p><button type="button" class="pl-blog-primary" data-action="new">Tulis Blog</button></section>';
  } else {
    body = '<div class="pl-blog-list">' + visible.map(item => {
      const cover = item.cover ? URL.createObjectURL(item.cover) : '';
      const desc = esc(item.description || '');
      return '<article class="pl-blog-item" data-item-id="' + item.id + '">' +
        (cover ? '<img class="pl-blog-item-cover" src="' + cover + '" alt="Cover ' + esc(item.title) + '">' : '<div class="pl-blog-item-cover pl-blog-no-cover">Belum ada cover</div>') +
        '<div class="pl-blog-item-copy"><span class="pl-blog-item-status">' + (item.status === 'draft' ? 'DRAFT' : 'TERBITAN UJI LOKAL') + '</span><h3>' + esc(item.title) + '</h3><p>' + desc + '</p><span class="pl-blog-read-more">Baca selengkapnya</span><small>' + new Date(item.updatedAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) + '</small>' +
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
  if (item?.cover) coverObjectUrl = URL.createObjectURL(item.cover);
  const supporting = item?.supportingImages || [];
  supportingObjectUrls = supporting.map(file => URL.createObjectURL(file));
  const images = supporting.map((file, index) => '<div class="pl-blog-support-tile"><img src="' + supportingObjectUrls[index] + '" alt="Gambar pendukung ' + (index + 1) + '"><button type="button" data-remove-support="' + index + '" aria-label="Hapus gambar">×</button></div>').join('');
  return header(item ? 'Lanjutkan tulisan' : 'Tulis Blog', 'Buat cerita dengan nyaman dari handphone.') +
    '<form id="pl-blog-editor-form" class="pl-blog-editor-form">' +
    '<label class="pl-blog-field">Judul tulisan<input name="title" maxlength="140" required value="' + esc(item?.title || '') + '" placeholder="Tuliskan judul blog kamu"></label>' +
    '<label class="pl-blog-field">Deskripsi untuk kartu feed<textarea name="description" id="pl-blog-description" rows="3" required placeholder="Ringkas isi tulisan agar orang tertarik membacanya.">' + esc(item?.description || '') + '</textarea><small><span id="pl-blog-word-count">' + wordCount(item?.description || '') + '</span>/85 kata · Ditampilkan pada kartu feed dan dipotong dengan “Baca selengkapnya”.</small></label>' +
    '<section class="pl-blog-cover-field"><div><strong>Gambar utama / cover</strong><small>Dipakai sebagai thumbnail di feed, katalog Blog, dan hero tulisan.</small></div>' +
    '<label class="pl-blog-cover-picker" for="pl-blog-cover-input">' + (coverObjectUrl ? '<img id="pl-blog-cover-preview" src="' + coverObjectUrl + '" alt="Pratinjau cover">' : '<span id="pl-blog-cover-placeholder">＋</span><b>Pilih gambar utama</b><small>JPG, PNG, atau WebP</small>') + '<input id="pl-blog-cover-input" type="file" accept="image/jpeg,image/png,image/webp"></label></section>' +
    '<label class="pl-blog-field">Isi tulisan<textarea name="body" rows="9" required placeholder="Mulai menulis di sini. Tidak ada batas minimal kata.">' + esc(item?.body || '') + '</textarea></label>' +
    '<section class="pl-blog-support-field"><div><strong>Gambar pendukung</strong><small>Gambar ini menjadi bagian isi tulisan, bukan cover.</small></div><label class="pl-blog-support-picker" for="pl-blog-support-input">＋ Tambah gambar pendukung<input id="pl-blog-support-input" type="file" accept="image/*" multiple></label><div class="pl-blog-support-grid" id="pl-blog-support-grid">' + images + '</div></section>' +
    '<div class="pl-blog-editor-note">Draf disimpan di perangkat ini. Terbitan pada tahap uji belum tampil di feed publik atau pencarian PLUITS.</div>' +
    '<div class="pl-blog-editor-actions"><button type="button" class="pl-blog-secondary" data-action="save-draft">Simpan Draft</button><button type="submit" class="pl-blog-primary" data-submit-publish>Terbitkan</button></div></form>';
}
async function previewPage(item) {
  activeView = 'preview';
  revokePreviews();
  const cover = item.cover ? URL.createObjectURL(item.cover) : '';
  const support = (item.supportingImages || []).map(file => '<img src="' + URL.createObjectURL(file) + '" alt="Gambar pendukung">').join('');
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
  if (activeView === 'editor') content = editorPage(window.__plBlogEditingItem || null);
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
async function persistEditor(status) {
  const form = document.querySelector('#pl-blog-editor-form');
  if (!form) return;
  const data = new FormData(form);
  const title = String(data.get('title') || '').trim();
  const description = String(data.get('description') || '').trim();
  const body = String(data.get('body') || '').trim();
  const coverInput = document.querySelector('#pl-blog-cover-input');
  const supportInput = document.querySelector('#pl-blog-support-input');
  const old = editingId ? (await getAllItems()).find(item => item.id === editingId) : null;
  const cover = readFormFile(coverInput) || old?.cover || null;
  const supportingImages = [...(old?.supportingImages || [])];
  if (supportInput?.files?.length) supportingImages.push(...Array.from(supportInput.files));
  if (!title) return notify('Judul tulisan wajib diisi.', 'error');
  if (!description) return notify('Deskripsi untuk kartu feed wajib diisi.', 'error');
  if (wordCount(description) > 85) return notify('Deskripsi maksimal 85 kata.', 'error');
  if (!cover) return notify('Pilih gambar utama sebelum menyimpan tulisan.', 'error');
  if (!body) return notify('Isi tulisan belum boleh kosong.', 'error');
  if (cover.size > 12 * 1024 * 1024) return notify('Cover maksimal 12 MB untuk tahap uji.', 'error');
  if (supportingImages.some(file => file.size > 12 * 1024 * 1024)) return notify('Setiap gambar pendukung maksimal 12 MB.', 'error');
  const now = Date.now();
  const item = { id: editingId || uid(), userId: activeUser.id, title, description, body, cover, supportingImages, status, updatedAt: now, createdAt: old?.createdAt || now };
  await saveItem(item);
  editingId = item.id;
  window.__plBlogEditingItem = item;
  notify(status === 'draft' ? 'Draft tersimpan di perangkat ini.' : 'Terbitan uji tersimpan di perangkat ini. Belum tampil di feed publik.');
  if (status === 'published') { activeTab = 'posts'; activeView = 'dashboard'; revokePreviews(); }
  else { activeTab = 'drafts'; activeView = 'dashboard'; revokePreviews(); }
  await render();
}
function bind() {
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { activeTab = button.dataset.tab; activeView = 'dashboard'; render().catch(showError); }));
  document.querySelectorAll('[data-action="new"]').forEach(button => button.addEventListener('click', () => { editingId = null; window.__plBlogEditingItem = null; revokePreviews(); setView('editor'); }));
  document.querySelectorAll('[data-action="edit"]').forEach(button => button.addEventListener('click', async () => {
    const item = (await getAllItems()).find(row => row.id === button.dataset.id);
    if (!item) return notify('Tulisan tidak ditemukan.', 'error');
    window.__plBlogEditingItem = item; editingId = item.id; setView('editor');
  }));
  document.querySelectorAll('[data-action="delete"]').forEach(button => button.addEventListener('click', async () => {
    if (!confirm('Hapus tulisan uji ini dari perangkat?')) return;
    await deleteItem(button.dataset.id); notify('Tulisan dihapus dari perangkat.'); render().catch(showError);
  }));
  document.querySelector('[data-action="save-draft"]')?.addEventListener('click', () => persistEditor('draft').catch(showError));
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
    if (!file.type.startsWith('image/')) return notify('Pilih file gambar.', 'error');
    if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl);
    coverObjectUrl = URL.createObjectURL(file);
    const picker = document.querySelector('.pl-blog-cover-picker');
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
  document.querySelector('#pl-blog-support-input')?.addEventListener('change', event => {
    const files = Array.from(event.target.files || []);
    if (files.some(file => !file.type.startsWith('image/'))) return notify('Hanya gambar yang dapat ditambahkan.', 'error');
    if (files.length) notify(files.length + ' gambar dipilih. Gambar akan tersimpan saat draft disimpan.');
  });
  document.querySelector('#pl-blog-settings-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await saveSettings({ blogTitle: String(data.get('blogTitle') || '').trim(), blogDescription: String(data.get('blogDescription') || '').trim(), visibility: String(data.get('visibility') || 'public') });
    notify('Pengaturan blog tersimpan di perangkat ini.');
  });
  document.querySelector('[data-action="back-editor"]')?.addEventListener('click', () => setView('editor'));
}
export async function mountBlogStudio() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.hash = '#/account/login'; return; }
    activeUser = user;
    const { data: profile, error } = await supabase.from('user_profiles').select('display_name,username,avatar_path').eq('id', user.id).maybeSingle();
    if (error) throw error;
    activeProfile = profile || { display_name: user.email?.split('@')[0] || 'Pengguna', username: 'pengguna' };
    activeTab = 'posts'; activeView = 'dashboard'; editingId = null;
    await render();
  } catch (error) { showError(error); }
}
