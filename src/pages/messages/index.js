import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import './messages.css';
import { socialIcon } from '../../components/common/social-icons.js';
import { renderSocialMobileNav } from '../../components/social/navigation.js';

const db = createClient('https://ytndswhqxayqpftszwfh.supabase.co', 'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let currentUser = null;
let currentProfile = null;
let currentConversation = null;
let conversationCache = [];
let realtimeChannel = null;
let presenceChannel = null;
let contactsCache = [];
let onlineUserIds = new Set();
let sendingQueue = false;
let networkListenersBound = false;
let activeInboxTab = 'primary';

const queueKey = () => 'pluits:dm:outbox:v1:' + currentUser.id;
const contactsKey = () => 'pluits:dm:contacts:v1:' + currentUser.id;
const threadsKey = () => 'pluits:dm:threads:v1:' + currentUser.id;
function readQueue() {
  try { const rows = JSON.parse(localStorage.getItem(queueKey()) || '[]'); return Array.isArray(rows) ? rows : []; }
  catch { return []; }
}
function writeQueue(rows) {
  try { if(rows.length>50)return false; localStorage.setItem(queueKey(), JSON.stringify(rows)); return true; }
  catch { return false; }
}
function queueFor(conversationId) { return readQueue().filter(row => row.conversation_id === conversationId || (String(conversationId).startsWith('draft:') && row.recipient_user_id === String(conversationId).slice(6))); }
function formatTime(value) {
  return new Date(value).toLocaleString('id-ID', {dateStyle:'short',timeStyle:'short'});
}
function formatDuration(value) {
  const seconds=Math.max(0,Number(value)||0);
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
function messageMarkup(row, pending = false, readByOther = false) {
  const voice=row.message_type==='voice'&&row.media_path&&!row.deleted_at;
  const content=voice
    ? '<div class="pl-msg-voice-player"><audio controls preload="none" data-voice-path="'+esc(row.media_path)+'"></audio><span>Pesan suara · '+formatDuration(row.media_duration_seconds)+'</span></div>'
    : esc(row.body);
  return '<article class="pl-msg-bubble '+(row.sender_id===currentUser.id?'mine':'')+(pending?' is-pending':'')+'">'+
    content+'<small>'+formatTime(row.created_at)+(pending?' · Tersimpan di perangkat, menunggu koneksi':readByOther?' · ✓✓ Dibaca':'')+'</small></article>';
}
async function hydrateVoicePlayers(container) {
  const players=[...container.querySelectorAll('audio[data-voice-path]')];
  await Promise.all(players.map(async player=>{
    const {data,error}=await db.storage.from('pluits-message-media').createSignedUrl(player.dataset.voicePath,3600);
    if(!error&&data?.signedUrl) player.src=data.signedUrl;
    else { const note=document.createElement('span');note.className='pl-msg-audio-error';note.textContent='Audio tidak dapat dimuat';player.replaceWith(note); }
  }));
}
function bindVoiceRecorder(chat, conversationId) {
  const button=chat.querySelector('[data-voice-record]');
  const status=chat.querySelector('.pl-msg-chat-status');
  if(!button)return;
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined') {
    button.disabled=true;button.title='Perekaman suara tidak didukung browser ini';return;
  }
  let recorder=null,stream=null,chunks=[],startedAt=0,limitTimer=null;
  button.onclick=async()=>{
    if(recorder?.state==='recording'){recorder.stop();return;}
    if(!navigator.onLine){status.textContent='Pesan suara membutuhkan koneksi internet. Pesan teks tetap dapat diantrekan.';return;}
    try {
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const preferred=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus','audio/webm'];
      const mimeType=preferred.find(type=>MediaRecorder.isTypeSupported(type));
      recorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined);
      chunks=[];startedAt=Date.now();
      recorder.ondataavailable=event=>{if(event.data?.size)chunks.push(event.data);};
      recorder.onerror=()=>{status.textContent='Perekaman gagal. Periksa izin mikrofon lalu coba lagi.';};
      recorder.onstop=async()=>{
        clearTimeout(limitTimer);stream?.getTracks().forEach(track=>track.stop());stream=null;
        button.disabled=true;button.textContent='Mengunggah…';button.classList.remove('is-recording');
        const duration=Math.min(180,Math.max(1,Math.round((Date.now()-startedAt)/1000)));
        const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});
        if(blob.size>10*1024*1024){status.textContent='File suara melebihi batas 10 MB.';button.disabled=false;button.textContent='🎙 Suara';return;}
        if(duration<1||!blob.size){status.textContent='Rekaman terlalu singkat. Coba rekam minimal satu detik.';button.disabled=false;button.textContent='🎙 Suara';return;}
        const mime=blob.type.split(';')[0].toLowerCase();
        const ext=({'audio/webm':'webm','audio/mp4':'m4a','audio/ogg':'ogg','audio/mpeg':'mp3','audio/wav':'wav','audio/3gpp':'3gp'})[mime];
        if(!ext){status.textContent='Format audio browser ini belum didukung.';button.disabled=false;button.textContent='🎙 Suara';return;}
        const path=conversationId+'/'+currentUser.id+'/'+crypto.randomUUID()+'.'+ext;
        status.textContent='Mengunggah pesan suara…';
        const uploaded=await db.storage.from('pluits-message-media').upload(path,blob,{contentType:mime,upsert:false});
        if(uploaded.error){status.textContent='Upload suara gagal: '+uploaded.error.message;button.disabled=false;button.textContent='🎙 Suara';return;}
        const saved=await db.from('user_messages').insert({
          conversation_id:conversationId,sender_id:currentUser.id,body:'',
          message_type:'voice',media_path:path,media_duration_seconds:duration,
          media_mime_type:mime,client_message_id:crypto.randomUUID()
        });
        if(saved.error){
          await db.storage.from('pluits-message-media').remove([path]);
          status.textContent='Pesan suara belum terkirim: '+saved.error.message;
        } else {
          status.textContent='Pesan suara terkirim.';
          await openConversation(conversationId);await loadConversations();
        }
        button.disabled=false;button.textContent='🎙 Suara';
      };
      recorder.start(250);button.textContent='■ Selesai';button.classList.add('is-recording');
      status.textContent='Merekam… tekan Selesai untuk mengirim. Maksimal 3 menit.';
      limitTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop();},180000);
    } catch(error) {
      stream?.getTracks().forEach(track=>track.stop());stream=null;
      status.textContent='Mikrofon tidak dapat diakses. Izinkan akses mikrofon di browser.';
      button.textContent='🎙 Suara';button.classList.remove('is-recording');
    }
  };
}
export function messagesPage() {
  return `<main class="pl-msg ua-social-app">
    <header class="pl-msg-head">
      <a href="#/account/explore" class="pl-msg-brand" aria-label="PLUITS Beranda">PLUITS</a>
      <form id="pl-msg-search" class="pl-msg-head-search" role="search">
        <div class="pl-msg-search-field"><span class="pl-msg-search-symbol">${socialIcon('search',{size:18})}</span><input name="q" type="search" placeholder="Cari teman…" autocomplete="off" aria-label="Cari nama atau username teman"></div>
        <button type="submit" aria-label="Cari">${socialIcon('search',{size:18})}</button>
        <div id="pl-msg-search-results" class="pl-msg-search-results" hidden></div>
      </form>
      <div class="pl-msg-head-menu">
        <button type="button" class="pl-msg-menu-toggle" aria-label="Pengaturan pesan" aria-expanded="false" aria-controls="pl-msg-head-menu">⋮</button>
        <nav class="pl-msg-head-menu-panel" id="pl-msg-head-menu" aria-label="Pengaturan Inbox" hidden>
          <a href="#/inbox/settings">Pengaturan pesan</a>
        </nav>
      </div>
    </header>
    <section class="pl-msg-content">
      <section class="pl-msg-people" aria-label="Teman yang sedang online">
        <div class="pl-msg-people-heading"><div class="pl-msg-people-counts"><strong>Teman</strong><small><span id="pl-msg-online-count">0 online</span><span aria-hidden="true"> · </span><span id="pl-msg-offline-count">0 offline</span></small></div><a href="#/account/followers">Lihat semua</a></div>
        <div id="pl-msg-people-strip" class="pl-msg-people-strip"><span class="pl-msg-people-loading">Menyiapkan teman…</span></div>
      </section>
      <div class="pl-msg-layout" id="pl-msg-layout">
        <aside class="pl-msg-sidebar">
          <nav class="pl-msg-inbox-tabs" aria-label="Kategori pesan" role="tablist">
            <button type="button" class="is-active" data-inbox-tab="primary" role="tab" aria-selected="true">Utama</button>
            <button type="button" data-inbox-tab="requests" role="tab" aria-selected="false">Permintaan</button>
            <button type="button" data-inbox-tab="blocked" role="tab" aria-selected="false">Diblokir</button>
          </nav>
          <div id="pl-msg-conversations"><p class="pl-msg-empty">Memuat percakapan…</p></div>
          <div id="pl-msg-category-empty" class="pl-msg-category-empty" hidden></div>
        </aside>
        <section class="pl-msg-chat" id="pl-msg-chat"><div class="pl-msg-empty">Pilih percakapan untuk mulai mengirim pesan.</div></section>
      </div>
      <p class="pl-msg-offline-note">Jika koneksi terputus, pesan yang Anda kirim disimpan sementara di perangkat ini dan otomatis dicoba kirim saat online kembali. Pesan belum terkirim sampai server mengonfirmasi.</p>
      ${renderSocialMobileNav({active:'messages',user:{id:'inbox'},navClass:'pl-msg-mobile-nav'})}
    </section>
  </main>`;
}
function bindInboxTabs(root=document) {
  const tabs=[...root.querySelectorAll('[data-inbox-tab]')];
  const list=root.querySelector('#pl-msg-conversations');
  const empty=root.querySelector('#pl-msg-category-empty');
  tabs.forEach(tab=>tab.onclick=()=>{
    activeInboxTab=tab.dataset.inboxTab;
    tabs.forEach(item=>{const active=item===tab;item.classList.toggle('is-active',active);item.setAttribute('aria-selected',String(active));});
    if(list)list.hidden=activeInboxTab!=='primary';
    if(empty){
      empty.hidden=activeInboxTab==='primary';
      empty.innerHTML=activeInboxTab==='requests'
        ? '<strong>Permintaan pesan</strong><p>Pesan dari orang yang belum terhubung akan tampil di sini. Anda dapat meninjau dan menyetujui permintaan sebelum percakapan masuk ke Utama.</p><small>Persiapan kategori · alur persetujuan akan diaktifkan bersama backend.</small>'
        : '<strong>Akun diblokir</strong><p>Daftar akun yang Anda blokir akan dikelola di sini.</p><small>Persiapan kategori · pengelolaan blokir belum diaktifkan.</small>';
    }
  });
  (tabs.find(tab=>tab.dataset.inboxTab===activeInboxTab)||tabs[0])?.click();
}
function updateNetworkStatus() {
  const node = document.querySelector('#pl-msg-network');
  if (node) { node.textContent = navigator.onLine ? '● Koneksi aktif' : '○ Tidak ada koneksi'; node.classList.toggle('is-offline', !navigator.onLine); }
}
function contactAvatar(person, imageUrl='') {
  const name=person.display_name||person.username||'P';
  const avatar=imageUrl?'<img src="'+esc(imageUrl)+'" alt="" loading="lazy">':'<span>'+esc(name.slice(0,1).toUpperCase())+'</span>';
  return '<span class="pl-msg-avatar">'+avatar+'</span>';
}
async function signedAvatar(path) {
  if(!path||!navigator.onLine)return '';
  const {data,error}=await db.storage.from('pluits-user-media').createSignedUrl(path,1800);
  return error?'':data?.signedUrl||'';
}
async function renderPeopleCounts(people=contactsCache) {
  const rows=Array.isArray(people)?people:[];
  const online=rows.filter(person=>onlineUserIds.has(person.id)).length;
  const offline=Math.max(0,rows.length-online);
  const onlineNode=document.querySelector('#pl-msg-online-count');
  const offlineNode=document.querySelector('#pl-msg-offline-count');
  if(onlineNode)onlineNode.textContent=online+' online';
  if(offlineNode)offlineNode.textContent=offline+' offline';
}
async function renderPeopleStrip(people=contactsCache, withSignedImages=false) {
  const strip=document.querySelector('#pl-msg-people-strip');if(!strip)return;
  const onlinePeople=(people||[]).filter(person=>onlineUserIds.has(person.id));
  renderPeopleCounts(people);
  const items=await Promise.all(onlinePeople.map(async person=>{
    const url=withSignedImages?await signedAvatar(person.avatar_path):'';
    return '<a class="pl-msg-person" href="#/@'+encodeURIComponent(person.username||'')+'" aria-label="Buka profil '+esc(person.display_name||person.username)+', sedang online">'+contactAvatar(person,url)+'<span class="pl-msg-online-dot" aria-hidden="true"></span><small>'+esc(person.display_name||person.username||'Teman')+'</small></a>';
  }));
  strip.classList.toggle('has-many',onlinePeople.length>=5);
  strip.innerHTML=items.length?items.join(''):'<span class="pl-msg-online-empty">Teman yang online akan muncul di sini</span>';
}

function renderContactList(box,people,withSignedImages=false) {
  if(!box)return;
  box.innerHTML=(people||[]).map(person=>'<button type="button" class="pl-msg-contact" data-start-chat="'+person.id+'">'+contactAvatar(person,withSignedImages?person.avatar_url||'':'')+'<span><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small></span><span class="pl-msg-contact-action">Pesan</span></button>').join('')||'<p class="pl-msg-empty">Belum ada kontak yang dapat ditampilkan. Cari username untuk memulai.</p>';
  bindStartChat(box);
}
async function loadContacts() {
  const box=document.querySelector('#pl-msg-contacts');
  const {data:rows,error}=await db.from('user_follows').select('follower_id,following_id,status')
    .eq('status','accepted').or('follower_id.eq.'+currentUser.id+',following_id.eq.'+currentUser.id);
  if(error) {
    try {
      const cached=JSON.parse(localStorage.getItem(contactsKey())||'[]');
      contactsCache=cached;
      renderContactList(box,cached,false);await renderPeopleStrip(cached,false);
      if(!cached.length&&box)box.innerHTML='<p class="pl-msg-empty">Kontak belum tersimpan di perangkat ini. Hubungkan internet untuk memuat kontak.</p>';
    } catch { if(box)box.textContent='Kontak offline belum tersedia.'; }
    return;
  }
  const ids=[...new Set((rows||[]).map(row=>row.follower_id===currentUser.id?row.following_id:row.follower_id).filter(id=>id!==currentUser.id))];
  if(!ids.length) {
    contactsCache=[];
    try{localStorage.setItem(contactsKey(),'[]');}catch{}
    if(box)box.innerHTML='<p class="pl-msg-empty">Kontak akan muncul dari akun yang saling terhubung. Anda juga dapat mencari username di atas.</p>';
    await renderPeopleStrip([],false);return;
  }
  const {data:profiles,error:profileError}=await db.rpc('get_user_profile_directory_by_ids',{p_ids:ids});
  if(profileError){if(box)box.textContent=profileError.message;return;}
  const people=profiles||[];
  contactsCache=people;
  try{localStorage.setItem(contactsKey(),JSON.stringify(people.map(({id,display_name,username,avatar_path})=>({id,display_name,username,avatar_path}))));}catch{}
  const enriched=await Promise.all(people.map(async person=>({...person,avatar_url:await signedAvatar(person.avatar_path)})));
  renderContactList(box,enriched,true);
  await renderPeopleStrip(people,true);
}
function bindStartChat(box) {
  box.querySelectorAll('[data-start-chat]').forEach(button=>button.onclick=async()=>{
    if(!navigator.onLine){await openDraftConversation(button.dataset.startChat);return;}
    button.disabled=true;
    const {data:id,error}=await db.rpc('start_direct_conversation',{p_other_user_id:button.dataset.startChat});
    if(error){alert(error.message);button.disabled=false;return;}
    await loadConversations(); await openConversation(id);
  });
}
export async function bindMessagesPage() {
  const app=document.querySelector('#app'); if(!app)return;
  const {data:{user},error:authError}=await db.auth.getUser();
  if(authError) { app.querySelector('#pl-msg-chat').textContent=authError.message; return; }
  currentUser=user;
  if(!user) { app.querySelector('#pl-msg-conversations').innerHTML='<div class="pl-msg-empty">Masuk ke akun Pluits untuk menggunakan pesan. <a href="#/account/login">Masuk →</a></div>'; return; }
  if(realtimeChannel) { await db.removeChannel(realtimeChannel); realtimeChannel=null; }
  if(presenceChannel) { await db.removeChannel(presenceChannel); presenceChannel=null; }
  onlineUserIds=new Set();contactsCache=[];
  const {data:ownProfile}=await db.from('user_profiles').select('id,display_name,username,avatar_path').eq('id',user.id).maybeSingle();
  currentProfile=ownProfile||{id:user.id,display_name:user.user_metadata?.full_name||'Anda',username:'akun'};
  await Promise.all([loadContacts(),loadConversations()]);
  presenceChannel=db.channel('pluits-online-v1',{config:{presence:{key:user.id}}})
    .on('presence',{event:'sync'},()=>{
      const state=presenceChannel?.presenceState?.()||{};
      onlineUserIds=new Set(Object.values(state).flat().map(entry=>entry.user_id).filter(Boolean));
      renderPeopleCounts(contactsCache);
      renderPeopleStrip(contactsCache,true);
    })
    .subscribe(async status=>{
      if(status==='SUBSCRIBED'){
        await presenceChannel.track({user_id:user.id,online_at:new Date().toISOString()});
      }
    });
  bindInboxTabs(app);
  const requestedConversation=new URLSearchParams((location.hash.split('?')[1]||'')).get('conversation');
  if(requestedConversation&&conversationCache.some(item=>item.id===requestedConversation)) await openConversation(requestedConversation);
  const search=app.querySelector('#pl-msg-search');
  search.onsubmit=async event=>{
    event.preventDefault();
    const query=String(new FormData(search).get('q')||'').trim().replace(/^@/,'').replace(/[(),]/g,' ').replace(/\s+/g,' ').trim();
    const box=app.querySelector('#pl-msg-search-results');
    if(query.length<2){box.hidden=false;box.innerHTML='<p class="pl-msg-search-hint">Ketik minimal dua karakter untuk mencari teman.</p>';return;}
    const {data,error}=await db.from('user_profiles').select('id,display_name,username').or('username.ilike.%'+query+'%,display_name.ilike.%'+query+'%').neq('id',user.id).limit(8);
    if(error){box.hidden=false;box.textContent=error.message;return;}
    box.hidden=false;
    box.innerHTML=data?.length?data.map(person=>'<button class="pl-msg-contact" data-start-chat="'+person.id+'"><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small><span>Pesan</span></button>').join(''):'<p class="pl-msg-search-hint">Akun tidak ditemukan.</p>';
    bindStartChat(box);
  };
  const headMenu=app.querySelector('.pl-msg-head-menu');
  const menuToggle=app.querySelector('.pl-msg-menu-toggle');
  const menuPanel=app.querySelector('#pl-msg-head-menu');
  const closeHeadMenu=()=>{
    if(!menuPanel||!menuToggle)return;
    menuPanel.hidden=true;
    menuToggle.setAttribute('aria-expanded','false');
  };
  const placeHeadMenu=()=>{
    if(!headMenu||!menuToggle||!menuPanel||menuPanel.hidden)return;
    const rect=menuToggle.getBoundingClientRect();
    const viewport=window.visualViewport;
    const width=Math.min(248,(viewport?.width||window.innerWidth)-24);
    const left=Math.max(12,Math.min(rect.right-width,(viewport?.width||window.innerWidth)-width-12));
    menuPanel.style.width=width+'px';
    menuPanel.style.left=left+'px';
    menuPanel.style.right='auto';
    menuPanel.style.maxHeight=Math.max(120,(viewport?.height||window.innerHeight)-24)+'px';
    menuPanel.style.top='auto';
    menuPanel.style.bottom='auto';
    const panelHeight=Math.min(menuPanel.scrollHeight,(viewport?.height||window.innerHeight)-24);
    const below=(viewport?.height||window.innerHeight)-rect.bottom-8;
    if(below>=Math.min(panelHeight,150)){
      menuPanel.style.top=(rect.bottom+8)+'px';
    }else{
      menuPanel.style.top=Math.max(12,rect.top-panelHeight-8)+'px';
    }
  };
  menuToggle?.addEventListener('click',()=>{
    const opening=menuPanel.hidden;
    if(!opening){closeHeadMenu();return;}
    menuPanel.hidden=false;
    menuToggle.setAttribute('aria-expanded','true');
    placeHeadMenu();
  });
  app.addEventListener('click',event=>{
    if(!event.target.closest('.pl-msg-head-search')){const results=app.querySelector('#pl-msg-search-results');if(results)results.hidden=true;}
    if(headMenu&&!headMenu.contains(event.target))closeHeadMenu();
  });
  window.addEventListener('resize',placeHeadMenu,{passive:true});
  window.addEventListener('scroll',placeHeadMenu,{passive:true,capture:true});
  window.visualViewport?.addEventListener('resize',placeHeadMenu,{passive:true});
  app.addEventListener('keydown',event=>{if(event.key==='Escape')closeHeadMenu();});
  updateNetworkStatus();
  if(!networkListenersBound){window.addEventListener('online',onOnline);window.addEventListener('offline',updateNetworkStatus);networkListenersBound=true;}
  realtimeChannel=db.channel('pluits-dm-'+user.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'user_messages'},payload=>{
      if(payload.new?.conversation_id===currentConversation) openConversation(currentConversation);
      else loadConversations();
    })
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'user_conversation_members'},payload=>{
      if(payload.new?.conversation_id===currentConversation) openConversation(currentConversation);
      else loadConversations();
    }).subscribe();
  await flushOutbox();
}
function onOnline() { updateNetworkStatus(); flushOutbox(); }
async function openDraftConversation(recipientId) {
  currentConversation='draft:'+recipientId;
  let person=null;
  try { person=(JSON.parse(localStorage.getItem(contactsKey())||'[]')).find(item=>item.id===recipientId)||null; } catch {}
  if(!person){document.querySelector('#pl-msg-chat').innerHTML='<div class="pl-msg-empty">Kontak ini belum tersimpan. Muat kontak saat online sebelum memulai DM offline.</div>';return;}
  const chat=document.querySelector('#pl-msg-chat');if(!chat)return;
  document.querySelector('#pl-msg-layout')?.classList.add('is-chat-open');
  const queued=queueFor(currentConversation);
  chat.innerHTML='<header class="pl-msg-chat-head"><button type="button" class="pl-msg-back" data-chat-back aria-label="Kembali ke daftar pesan">‹</button><div><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small></div><span>Draft offline</span></header>'+
    '<div class="pl-msg-stream"><div class="pl-msg-empty">Percakapan baru akan dibuat saat koneksi kembali. Riwayat pesan belum tersedia offline.</div>'+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="submit">Simpan pesan</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+queued.length+' pesan menunggu koneksi. Draft hanya tersimpan di perangkat ini.</p>';
  chat.querySelector('[data-chat-back]')?.addEventListener('click',()=>document.querySelector('#pl-msg-layout')?.classList.remove('is-chat-open'));
  chat.querySelector('#pl-msg-compose').onsubmit=async event=>{
    event.preventDefault();const form=event.currentTarget,body=String(new FormData(form).get('body')||'').trim();if(!body)return;
    if(navigator.onLine){
      const {data:id,error}=await db.rpc('start_direct_conversation',{p_other_user_id:recipientId});
      if(error){chat.querySelector('.pl-msg-chat-status').textContent=error.message;return;}
      await loadConversations();await openConversation(id);
      const liveForm=document.querySelector('#pl-msg-compose');if(liveForm){liveForm.querySelector('textarea').value=body;liveForm.requestSubmit();}
      return;
    }
    const queue=readQueue();queue.push({client_message_id:crypto.randomUUID(),conversation_id:null,recipient_user_id:recipientId,sender_id:currentUser.id,body,created_at:new Date().toISOString()});
    if(!writeQueue(queue)){chat.querySelector('.pl-msg-chat-status').textContent='Batas antrean 50 pesan tercapai atau penyimpanan perangkat tidak tersedia. Pesan belum disimpan.';return;}
    await openDraftConversation(recipientId);
  };
  chat.querySelector('.pl-msg-stream').scrollTop=chat.querySelector('.pl-msg-stream').scrollHeight;
}
async function loadConversations() {
  const list=document.querySelector('#pl-msg-conversations'); if(!list)return;
  const {data:members,error}=await db.from('user_conversation_members').select('conversation_id,last_read_at').eq('user_id',currentUser.id);
  if(error){
    try { const cached=JSON.parse(localStorage.getItem(threadsKey())||'[]'); conversationCache=cached; list.innerHTML=cached.length?cached.map(item=>'<button class="pl-msg-thread" data-open-chat="'+item.id+'"><b>'+esc(item.other.display_name||item.other.username)+'</b><small>@'+esc(item.other.username)+'</small><p>Riwayat tersedia saat online</p></button>').join(''):'<div class="pl-msg-empty">Inbox offline belum tersimpan. Hubungkan internet untuk memuat percakapan.</div>'; list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat)); }
    catch { list.textContent='Inbox offline belum tersedia.'; }
    return;
  }
  const ids=(members||[]).map(row=>row.conversation_id);
  if(!ids.length){list.innerHTML='<div class="pl-msg-empty">Belum ada percakapan. Pilih kontak atau cari username untuk memulai.</div>';conversationCache=[];return;}
  const [convs,memberRows,msgRows]=await Promise.all([
    db.from('user_conversations').select('id,title,updated_at').in('id',ids).order('updated_at',{ascending:false}),
    db.from('user_conversation_members').select('conversation_id,user_id,last_read_at').in('conversation_id',ids),
    db.from('user_messages').select('conversation_id,body,sender_id,created_at,message_type').in('conversation_id',ids).order('created_at',{ascending:false}).limit(200)
  ]);
  if(convs.error||memberRows.error||msgRows.error){
    try { const cached=JSON.parse(localStorage.getItem(threadsKey())||'[]'); conversationCache=cached; list.innerHTML=cached.length?cached.map(item=>'<button class="pl-msg-thread" data-open-chat="'+item.id+'"><b>'+esc(item.other.display_name||item.other.username)+'</b><small>@'+esc(item.other.username)+'</small><p>Riwayat tersedia saat online</p></button>').join(''):'<div class="pl-msg-empty">Inbox offline belum tersimpan. Hubungkan internet untuk memuat percakapan.</div>'; list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat)); }
    catch { list.textContent='Inbox offline belum tersedia.'; }
    return;
  }
  const otherIds=[...new Set((memberRows.data||[]).map(row=>row.user_id).filter(id=>id!==currentUser.id))];
  const profiles=otherIds.length?await db.rpc('get_user_profile_directory_by_ids',{p_ids:otherIds}):{data:[],error:null};
  if(profiles.error){list.textContent=profiles.error.message;return;}
  const pmap=new Map((profiles.data||[]).map(person=>[person.id,person]));
  const latest=new Map(); for(const message of msgRows.data||[]) if(!latest.has(message.conversation_id))latest.set(message.conversation_id,message);
  conversationCache=(convs.data||[]).map(conversation=>{
    const other=(memberRows.data||[]).find(row=>row.conversation_id===conversation.id&&row.user_id!==currentUser.id);
    const self=(memberRows.data||[]).find(row=>row.conversation_id===conversation.id&&row.user_id===currentUser.id);
    const last=latest.get(conversation.id);
    const unread=Boolean(last&&last.sender_id!==currentUser.id&&(!self?.last_read_at||new Date(last.created_at)>new Date(self.last_read_at)));
    return {...conversation,other:pmap.get(other?.user_id)||{display_name:'Akun Pluits',username:'akun'},last,unread};
  });
  try { localStorage.setItem(threadsKey(),JSON.stringify(conversationCache.map(item=>({id:item.id,updated_at:item.updated_at,other:item.other})))); } catch {}
  list.innerHTML=conversationCache.length?conversationCache.map(conversation=>{
    const pending=queueFor(conversation.id).length;
    return '<button class="pl-msg-thread '+(currentConversation===conversation.id?'active':'')+(conversation.unread?' is-unread':'')+'" data-open-chat="'+conversation.id+'"><span class="pl-msg-thread-head"><b>'+esc(conversation.other.display_name||conversation.other.username)+'</b>'+(conversation.unread?'<i aria-label="Pesan belum dibaca"></i>':'')+'</span><small>@'+esc(conversation.other.username)+'</small><p>'+esc(conversation.last?.message_type==='voice'?'🎙 Pesan suara':conversation.last?.body||'Belum ada pesan')+(pending?' · '+pending+' menunggu':'')+'</p></button>';
  }).join(''):'<div class="pl-msg-empty">Belum ada percakapan. Pilih kontak atau cari username untuk memulai.</div>';
  list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat));
  list.hidden=activeInboxTab!=='primary';
}
async function openConversation(id) {
  if(String(id).startsWith('draft:'))return openDraftConversation(String(id).slice(6));
  currentConversation=id;
  const chat=document.querySelector('#pl-msg-chat'); if(!chat)return;
  document.querySelector('#pl-msg-layout')?.classList.add('is-chat-open');
  chat.innerHTML='<div class="pl-msg-empty">Memuat pesan…</div>';
  const thread=conversationCache.find(item=>item.id===id);
  const [messages,members]=await Promise.all([
    db.from('user_messages').select('id,sender_id,body,created_at,deleted_at,message_type,media_path,media_duration_seconds').eq('conversation_id',id).order('created_at',{ascending:true}).limit(150),
    db.from('user_conversation_members').select('user_id,last_read_at').eq('conversation_id',id)
  ]);
  if((messages.error||members.error)&&navigator.onLine){chat.textContent=(messages.error||members.error).message;return;}
  const queued=queueFor(id);
  chat.innerHTML='<header class="pl-msg-chat-head"><button type="button" class="pl-msg-back" data-chat-back aria-label="Kembali ke daftar pesan">‹</button><div><b>'+esc(thread?.other.display_name||thread?.other.username||'Percakapan')+'</b><small>@'+esc(thread?.other.username||'')+'</small></div><span>'+ (navigator.onLine?'Terhubung':'Offline · pesan antrean')+'</span></header>'+
    '<div class="pl-msg-stream">'+(messages.data||[]).map(message=>{
      const deleted=Boolean(message.deleted_at);
      const otherMember=(members.data||[]).find(member=>member.user_id!==currentUser.id);
      const readByOther=message.sender_id===currentUser.id&&Boolean(otherMember?.last_read_at)&&new Date(otherMember.last_read_at)>=new Date(message.created_at);
      return messageMarkup({...message,body:deleted?'Pesan dihapus':message.body,message_type:deleted?'text':message.message_type,media_path:deleted?null:message.media_path},false,readByOther);
    }).join('')+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="button" class="pl-msg-voice" data-voice-record aria-label="Rekam pesan suara">🎙 Suara</button><button type="submit">Kirim</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+(queued.length?queued.length+' pesan menunggu koneksi.':'Pesan tersinkron dengan server. Pesan suara maksimal 3 menit.')+'</p>';
  chat.querySelector('[data-chat-back]')?.addEventListener('click',()=>document.querySelector('#pl-msg-layout')?.classList.remove('is-chat-open'));
  await hydrateVoicePlayers(chat);
  const selfMember=(members.data||[]).find(member=>member.user_id===currentUser.id);
  const readAt=selfMember?.last_read_at;
  if(navigator.onLine&&(!readAt||new Date(readAt)<new Date())) await db.rpc('mark_conversation_read',{p_conversation_id:id});
  bindVoiceRecorder(chat,id);
  const form=chat.querySelector('#pl-msg-compose');
  form.onsubmit=async event=>{
    event.preventDefault();
    const body=String(new FormData(form).get('body')||'').trim(); if(!body)return;
    const item={client_message_id:crypto.randomUUID(),conversation_id:id,sender_id:currentUser.id,body,created_at:new Date().toISOString()};
    const button=form.querySelector('[type="submit"]'); button.disabled=true;
    if(!navigator.onLine) {
      const queue=readQueue(); queue.push(item);
      if(!writeQueue(queue)){alert('Penyimpanan offline di perangkat tidak tersedia. Pesan belum disimpan.');button.disabled=false;return;}
      form.reset(); await openConversation(id); await loadConversations(); updateNetworkStatus(); return;
    }
    const {created_at,...messagePayload}=item;
    const {error}=await db.from('user_messages').upsert(messagePayload,{onConflict:'sender_id,client_message_id',ignoreDuplicates:true});
    if(error) {
      if(!navigator.onLine) {
        const queue=readQueue();queue.push(item);
        if(!writeQueue(queue)){alert('Pesan gagal dikirim dan tidak dapat disimpan offline: '+error.message);button.disabled=false;return;}
      } else {alert(error.message);button.disabled=false;return;}
    }
    form.reset(); await openConversation(id); await loadConversations();
  };
  const stream=chat.querySelector('.pl-msg-stream'); stream.scrollTop=stream.scrollHeight;
  await loadConversations();
}
async function flushOutbox() {
  if(sendingQueue||!currentUser||!navigator.onLine)return;
  sendingQueue=true; updateNetworkStatus();
  try {
    const queue=readQueue(),remaining=[];
    for(const item of queue) {
      if(!navigator.onLine){remaining.push(item,...queue.slice(queue.indexOf(item)+1));break;}
      let targetConversation=item.conversation_id;
      if(!targetConversation&&item.recipient_user_id){
        const started=await db.rpc('start_direct_conversation',{p_other_user_id:item.recipient_user_id});
        if(started.error){remaining.push(item);continue;}
        targetConversation=started.data;
        if(currentConversation==='draft:'+item.recipient_user_id)currentConversation=targetConversation;
      }
      const {created_at,recipient_user_id,...messagePayload}=item;
      messagePayload.conversation_id=targetConversation;
      const {error}=await db.from('user_messages').upsert(messagePayload,{onConflict:'sender_id,client_message_id',ignoreDuplicates:true});
      if(error) remaining.push({...item,conversation_id:targetConversation});
    }
    writeQueue(remaining);
    if(currentConversation) await openConversation(currentConversation);
    await loadConversations();
  } finally { sendingQueue=false; }
}
