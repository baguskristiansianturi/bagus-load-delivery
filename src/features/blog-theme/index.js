import './blog-theme.css';

const TEMPLATES = [
  {key:'aurelia',name:'AURELIA',kind:'Soft Personal Diary',description:'Lembut, hangat, dan personal.',colors:{background:'#fffaf8',surface:'#ffffff',text:'#3e3036',muted:'#927f86',accent:'#c77f91',border:'#f0e2e4'}},
  {key:'stavero',name:'STAVERO',kind:'Personal Studio',description:'Minimal, editorial, dan tegas.',colors:{background:'#f7f8fa',surface:'#ffffff',text:'#202630',muted:'#78818d',accent:'#52677e',border:'#e3e7ec'}},
  {key:'brewnox',name:'BREWNOX',kind:'Coffee & Daily Notes',description:'Nuansa kopi dan catatan harian.',colors:{background:'#faf6ef',surface:'#fffdf8',text:'#45352a',muted:'#8c796b',accent:'#98704f',border:'#e9dfd1'}},
  {key:'rovanta',name:'ROVANTA',kind:'Journey Diary',description:'Jurnal perjalanan yang lapang.',colors:{background:'#f6f8f9',surface:'#ffffff',text:'#273746',muted:'#748391',accent:'#547b91',border:'#dfe7eb'}},
  {key:'lunelle',name:'LUNELLE',kind:'Memory & Lifestyle',description:'Lembut, terang, dan penuh kenangan.',colors:{background:'#faf8ff',surface:'#ffffff',text:'#393347',muted:'#847b98',accent:'#9482bd',border:'#e9e3f3'}}
];
const BLOCKS = [
  ['profile_header','Profile Header','Foto profil, nama, dan deskripsi blog'],
  ['featured_story','Featured Story','Cerita pilihan pada bagian pembuka'],
  ['recent_stories','Recent Stories','Daftar tulisan terbaru'],
  ['categories','Categories','Navigasi kategori tulisan'],
  ['photo_gallery','Photo Gallery','Kumpulan foto dari tulisan publik'],
  ['about_me','About Me','Perkenalan singkat pemilik blog'],
  ['footer','Footer','Kredit dan tautan bagian bawah']
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeHex = value => /^#[0-9a-f]{6}$/i.test(String(value||'')) ? String(value) : '';
export function getBlogTemplate(key='aurelia') { return TEMPLATES.find(x=>x.key===key) || TEMPLATES[0]; }
export function normalizeBlogPresentation(profile={}) {
  const template=getBlogTemplate(profile.template_key);
  const theme=profile.theme_settings && typeof profile.theme_settings==='object' ? profile.theme_settings : {};
  const layout=profile.layout_settings && typeof profile.layout_settings==='object' ? profile.layout_settings : {};
  const validKeys=BLOCKS.map(x=>x[0]);
  const blocks=Array.isArray(layout.blocks) ? layout.blocks.filter((x,i,a)=>validKeys.includes(x)&&a.indexOf(x)===i) : validKeys.slice();
  for(const key of validKeys) if(!blocks.includes(key)) blocks.push(key);
  const hidden=Array.isArray(layout.hidden) ? layout.hidden.filter(x=>validKeys.includes(x)) : [];
  return {templateKey:template.key,theme:{accent:safeHex(theme.accent)||template.colors.accent,font:theme.font==='sans'?'sans':'serif'},layout:{blocks,hidden}};
}
export function renderBlogThemePanel(profile={}) {
  const state=normalizeBlogPresentation(profile);
  return '<section class="pl-blog-theme-workspace"><div class="pl-blog-theme-intro"><span class="pl-blog-theme-eyebrow">BLOG DESIGN STUDIO</span><h2>Jadikan blog terasa seperti milikmu.</h2><p>Ganti tampilan kapan saja. Tulisan, foto, kategori, dan alamat blog tetap aman.</p></div>'+
    '<form id="pl-blog-theme-form"><input type="hidden" name="blockOrder" value="'+state.layout.blocks.join(',')+'"><section class="pl-blog-theme-section"><div class="pl-blog-theme-section-head"><h3>Pilih template</h3><p>Setiap template punya karakter visual sendiri.</p></div><div class="pl-blog-template-grid">'+TEMPLATES.map(t=>'<label class="pl-blog-template-option '+(t.key===state.templateKey?'is-selected':'')+'"><input type="radio" name="templateKey" value="'+t.key+'" '+(t.key===state.templateKey?'checked':'')+'><span class="pl-blog-template-preview" style="--preview-bg:'+t.colors.background+';--preview-accent:'+t.colors.accent+';--preview-text:'+t.colors.text+'"><i></i><b></b><em></em><small></small></span><strong>'+t.name+'</strong><span>'+t.kind+'</span><small>'+t.description+'</small></label>').join('')+'</div></section>'+
    '<section class="pl-blog-theme-section"><div class="pl-blog-theme-section-head"><h3>Warna dan tipografi</h3><p>Aksen bisa diubah lagi kapan saja.</p></div><div class="pl-blog-theme-controls"><label>Warna aksen<input type="color" name="accent" value="'+state.theme.accent+'"></label><label>Gaya huruf<select name="font"><option value="serif" '+(state.theme.font==='serif'?'selected':'')+'>Editorial / Serif</option><option value="sans" '+(state.theme.font==='sans'?'selected':'')+'>Modern / Sans serif</option></select></label></div></section>'+
    '<section class="pl-blog-theme-section"><div class="pl-blog-theme-section-head"><h3>Profile Blocks</h3><p>Tentukan bagian yang ingin ditampilkan. Konten tidak dihapus ketika blok disembunyikan.</p></div><div class="pl-blog-block-list">'+state.layout.blocks.map(key=>{const item=BLOCKS.find(x=>x[0]===key);return item?'<div class="pl-blog-block-option" data-block-key="'+key+'"><label><span><strong>'+item[1]+'</strong><small>'+item[2]+'</small></span><input type="checkbox" name="block_'+key+'" value="1" '+(!state.layout.hidden.includes(key)?'checked':'')+'></label><div class="pl-blog-block-order"><button type="button" data-block-up="'+key+'" aria-label="Naikkan '+item[1]+'">↑</button><button type="button" data-block-down="'+key+'" aria-label="Turunkan '+item[1]+'">↓</button></div></div>':'';}).join('')+'</div></section><div class="pl-blog-theme-actions"><button class="pl-blog-primary" type="submit">Simpan tampilan</button><span>Perubahan hanya memengaruhi tampilan publik, bukan privasi tulisan.</span></div></form></section>';
}
export function readBlogThemeForm(form) {
  const data=new FormData(form);
  const template=getBlogTemplate(data.get('templateKey'));
  const accent=safeHex(data.get('accent'))||template.colors.accent;
  const hidden=BLOCKS.filter(([key])=>!data.get('block_'+key)).map(([key])=>key);
  const requested=String(data.get('blockOrder')||'').split(',');
  const valid=BLOCKS.map(([key])=>key);
  const blocks=requested.filter((key,i)=>valid.includes(key)&&requested.indexOf(key)===i);
  for(const key of valid)if(!blocks.includes(key))blocks.push(key);
  return {templateKey:template.key,themeSettings:{accent,font:data.get('font')==='sans'?'sans':'serif'},layoutSettings:{blocks,hidden}};
}
export function applyBlogTheme(root, profile={}) {
  if(!root)return;
  const state=normalizeBlogPresentation(profile);
  const template=getBlogTemplate(state.templateKey);
  root.dataset.blogTemplate=template.key;
  root.style.setProperty('--blog-bg',template.colors.background);
  root.style.setProperty('--blog-surface',template.colors.surface);
  root.style.setProperty('--blog-text',template.colors.text);
  root.style.setProperty('--blog-muted',template.colors.muted);
  root.style.setProperty('--blog-accent',state.theme.accent);
  root.style.setProperty('--blog-border',template.colors.border);
  root.dataset.blogFont=state.theme.font;
  root.querySelectorAll('[data-blog-block]').forEach(block=>{
    block.hidden=state.layout.hidden.includes(block.dataset.blogBlock);
    block.style.order=String(state.layout.blocks.indexOf(block.dataset.blogBlock));
  });
}
