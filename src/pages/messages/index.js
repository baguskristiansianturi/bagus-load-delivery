import { supabase as db } from '../../lib/supabase/client.js';
import './messages.css';
import { socialIcon } from '../../components/common/social-icons.js';
import {renderBrandLogo} from '../../components/common/brand.js';
import { renderSocialMobileNav } from '../../components/social/navigation.js';
import { renderInboxSidebar } from '../../features/inbox/inbox-sidebar.js';


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
    ? '<div class="pl-msg-voice-player"><audio controls preload="none" data-voice-path="'+esc(row.media_path)+'"></audio><span>Voice message · '+formatDuration(row.media_duration_seconds)+'</span></div>'
    : esc(row.body);
  return '<article class="pl-msg-bubble '+(row.sender_id===currentUser.id?'mine':'')+(pending?' is-pending':'')+'">'+
    content+'<small>'+formatTime(row.created_at)+(pending?' · Saved on this device · Waiting for connection':readByOther?' · ✓✓ Read':'')+'</small></article>';
}
async function hydrateVoicePlayers(container) {
  const players=[...container.querySelectorAll('audio[data-voice-path]')];
  await Promise.all(players.map(async player=>{
    const {data,error}=await db.storage.from('pluits-message-media').createSignedUrl(player.dataset.voicePath,3600);
    if(!error&&data?.signedUrl) player.src=data.signedUrl;
    else { const note=document.createElement('span');note.className='pl-msg-audio-error';note.textContent='Unable to load audio';player.replaceWith(note); }
  }));
}
function bindVoiceRecorder(chat, conversationId) {
  const button=chat.querySelector('[data-voice-record]');
  const status=chat.querySelector('.pl-msg-chat-status');
  if(!button)return;
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined') {
    button.disabled=true;button.title='Voice recording is not supported by this browser';return;
  }
  let recorder=null,stream=null,chunks=[],startedAt=0,limitTimer=null;
  button.onclick=async()=>{
    if(recorder?.state==='recording'){recorder.stop();return;}
    if(!navigator.onLine){status.textContent='Voice messages require an internet connection. Text messages can still be queued.';return;}
    try {
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const preferred=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus','audio/webm'];
      const mimeType=preferred.find(type=>MediaRecorder.isTypeSupported(type));
      recorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined);
      chunks=[];startedAt=Date.now();
      recorder.ondataavailable=event=>{if(event.data?.size)chunks.push(event.data);};
      recorder.onerror=()=>{status.textContent='Recording failed. Check microphone permissions and try again.';};
      recorder.onstop=async()=>{
        clearTimeout(limitTimer);stream?.getTracks().forEach(track=>track.stop());stream=null;
        button.disabled=true;button.textContent='Uploading…';button.classList.remove('is-recording');
        const duration=Math.min(180,Math.max(1,Math.round((Date.now()-startedAt)/1000)));
        const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});
        if(blob.size>10*1024*1024){status.textContent='Voice message exceeds the 10 MB limit.';button.disabled=false;button.textContent='🎙 Voice';return;}
        if(duration<1||!blob.size){status.textContent='Recording is too short. Please record for at least one second.';button.disabled=false;button.textContent='🎙 Voice';return;}
        const mime=blob.type.split(';')[0].toLowerCase();
        const ext=({'audio/webm':'webm','audio/mp4':'m4a','audio/ogg':'ogg','audio/mpeg':'mp3','audio/wav':'wav','audio/3gpp':'3gp'})[mime];
        if(!ext){status.textContent='This browser audio format is not supported.';button.disabled=false;button.textContent='🎙 Voice';return;}
        const path=conversationId+'/'+currentUser.id+'/'+crypto.randomUUID()+'.'+ext;
        status.textContent='Uploading voice message…';
        const uploaded=await db.storage.from('pluits-message-media').upload(path,blob,{contentType:mime,upsert:false});
        if(uploaded.error){status.textContent='Voice upload failed: '+uploaded.error.message;button.disabled=false;button.textContent='🎙 Voice';return;}
        const saved=await db.from('user_messages').insert({
          conversation_id:conversationId,sender_id:currentUser.id,body:'',
          message_type:'voice',media_path:path,media_duration_seconds:duration,
          media_mime_type:mime,client_message_id:crypto.randomUUID()
        });
        if(saved.error){
          await db.storage.from('pluits-message-media').remove([path]);
          status.textContent='Voice message was not sent: '+saved.error.message;
        } else {
          status.textContent='Voice message sent.';
          await openConversation(conversationId);await loadConversations();
        }
        button.disabled=false;button.textContent='🎙 Voice';
      };
      recorder.start(250);button.textContent='■ Selesai';button.classList.add('is-recording');
      status.textContent='Recording… tap Done to send. Maximum 3 minutes.';
      limitTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop();},180000);
    } catch(error) {
      stream?.getTracks().forEach(track=>track.stop());stream=null;
      status.textContent='Microphone unavailable. Allow microphone access in your browser.';
      button.textContent='🎙 Voice';button.classList.remove('is-recording');
    }
  };
}

function emptyStateMarkup({variant='message',title,description,action=''}) {
  const art = variant==='login'
    ? '<circle cx="60" cy="48" r="19" fill="#dce9f4"/><path d="M28 104c3-20 15-30 32-30s29 10 32 30" fill="#c8d9e9"/><rect x="76" y="14" width="34" height="25" rx="8" fill="#fff" stroke="#c5d6e5"/><path d="M84 23h18M84 29h12" stroke="#8ca8c2" stroke-width="2" stroke-linecap="round"/>'
    : variant==='requests'
    ? '<rect x="25" y="30" width="72" height="50" rx="12" fill="#fff" stroke="#c5d6e5" stroke-width="2"/><path d="m29 37 32 23 32-23" fill="none" stroke="#9db5ca" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="91" cy="23" r="10" fill="#d9e8f4"/><path d="M87 23h8M91 19v8" stroke="#6485a4" stroke-width="2" stroke-linecap="round"/>'
    : variant==='blocked'
    ? '<rect x="32" y="29" width="58" height="58" rx="16" fill="#fff" stroke="#c5d6e5" stroke-width="2"/><path d="M47 50v-7a14 14 0 0 1 28 0v7" fill="none" stroke="#8ca8c2" stroke-width="4" stroke-linecap="round"/><rect x="43" y="49" width="36" height="27" rx="7" fill="#dce9f4"/><path d="m53 58 16 10m0-10L53 68" stroke="#6f8ca8" stroke-width="2.5" stroke-linecap="round"/>'
    : '<rect x="20" y="28" width="67" height="47" rx="12" fill="#fff" stroke="#c5d6e5" stroke-width="2"/><path d="M29 39h46M29 48h30" stroke="#a5bacd" stroke-width="3" stroke-linecap="round"/><path d="m55 75 12 12 12-12" fill="#dce9f4"/><rect x="65" y="55" width="35" height="25" rx="9" fill="#dce9f4" stroke="#b7ccde"/><path d="M74 64h17M74 70h11" stroke="#6f8ca8" stroke-width="2" stroke-linecap="round"/>';
  return '<div class="pl-msg-empty-state pl-msg-empty-state-'+variant+'"><div class="pl-msg-empty-art" aria-hidden="true"><svg viewBox="0 0 120 112" role="img" focusable="false"><circle cx="60" cy="56" r="48" fill="#edf3f8"/><circle cx="17" cy="26" r="5" fill="#dce8f2"/><circle cx="105" cy="88" r="4" fill="#dce8f2"/>'+art+'</svg></div><strong>'+title+'</strong><p>'+description+'</p>'+action+'</div>';
}

export function messagesPage() {
  return `<main class="pl-msg ua-social-app">
    <header class="pl-msg-head">
      ${renderBrandLogo({href:'#/account/explore',className:'pl-msg-brand',size:36,label:'PLUITS Beranda'})}
      <form id="pl-msg-search" class="pl-msg-head-search" role="search">
        <div class="pl-msg-search-field"><span class="pl-msg-search-symbol">${socialIcon('search',{size:18})}</span><input name="q" type="search" placeholder="Cari orang…" autocomplete="off" aria-label="Cari berdasarkan nama atau nama pengguna"></div>
        <button type="submit" aria-label="Search">${socialIcon('search',{size:18})}</button>
        <div id="pl-msg-search-results" class="pl-msg-search-results" hidden></div>
      </form>
      <div class="pl-msg-head-menu">
        <button type="button" class="pl-msg-menu-toggle" aria-label="Pengaturan pesan" aria-expanded="false" aria-controls="pl-msg-head-menu">⋮</button>
        <nav class="pl-msg-head-menu-panel" id="pl-msg-head-menu" aria-label="Menu pesan" hidden>
          <a href="#/inbox/settings">Pengaturan pesan</a>
        </nav>
      </div>
    </header>
    <section class="pl-msg-content plds-container plds-container--wide">
      <section class="pl-msg-people" aria-label="Online contacts">
        <div class="pl-msg-people-heading"><div class="pl-msg-people-counts"><strong>Kontak</strong><small><span id="pl-msg-online-count">0 online</span><span aria-hidden="true"> · </span><span id="pl-msg-offline-count">0 offline</span></small></div><a href="#/account/followers">Lihat semua</a></div>
        <div id="pl-msg-people-strip" class="pl-msg-people-strip"><span class="pl-msg-people-loading">Memuat kontak…</span></div>
      </section>
      <div class="pl-msg-layout" id="pl-msg-layout">
        ${renderInboxSidebar()}
        <section class="pl-msg-chat" id="pl-msg-chat">${emptyStateMarkup({variant:'message',title:'Pesan Anda dimulai di sini',description:'Pilih percakapan di sebelah kiri atau cari seseorang untuk mulai mengirim pesan.'})}</section>
      </div>
      <p class="pl-msg-offline-note">If your connection drops, outgoing messages are saved on this device and retried when you are back online. A message is not sent until the server confirms it.</p>
      ${renderSocialMobileNav({active:'messages',user:{id:'inbox'},navClass:'pl-msg-mobile-nav'})}
    </section>
  </main>`;
}
function bindInboxTabs(root=document) {
  const tabs=[...root.querySelectorAll('[data-inbox-tab]')];
  const list=root.querySelector('#pl-msg-conversations');
  tabs.forEach(tab=>tab.onclick=()=>{
    activeInboxTab=tab.dataset.inboxTab;
    tabs.forEach(item=>{const active=item===tab;item.classList.toggle('is-active',active);item.setAttribute('aria-selected',String(active));});
    if(!list)return;
    list.hidden=false;
    if(activeInboxTab==='primary') {
      loadConversations();
      return;
    }
    list.innerHTML=activeInboxTab==='requests'
      ? emptyStateMarkup({variant:'requests',title:'Belum ada permintaan pesan',description:'Pesan dari orang yang belum terhubung dengan Anda akan muncul di sini.'})
      : emptyStateMarkup({variant:'blocked',title:'Belum ada akun yang diblokir',description:'Daftar akun yang Anda blokir akan ditampilkan di sini.'});
  });
  (tabs.find(tab=>tab.dataset.inboxTab===activeInboxTab)||tabs[0])?.click();
}
function updateNetworkStatus() {
  const node = document.querySelector('#pl-msg-network');
  if (node) { node.textContent = navigator.onLine ? '● Connected' : '○ Offline'; node.classList.toggle('is-offline', !navigator.onLine); }
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
    return '<a class="pl-msg-person" href="#/@'+encodeURIComponent(person.username||'')+'" aria-label="Open profile '+esc(person.display_name||person.username)+', online">'+contactAvatar(person,url)+'<span class="pl-msg-online-dot" aria-hidden="true"></span><small>'+esc(person.display_name||person.username||'Contact')+'</small></a>';
  }));
  strip.classList.toggle('has-many',onlinePeople.length>=5);
  strip.innerHTML=items.length?items.join(''):'<span class="pl-msg-online-empty">Contact yang online akan muncul di sini</span>';
}

function renderContactList(box,people,withSignedImages=false) {
  if(!box)return;
  box.innerHTML=(people||[]).map(person=>'<button type="button" class="pl-msg-contact" data-start-chat="'+person.id+'">'+contactAvatar(person,withSignedImages?person.avatar_url||'':'')+'<span><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small></span><span class="pl-msg-contact-action">Message</span></button>').join('')||'<p class="pl-msg-empty">No contacts to show yet. Search for a username to start a conversation.</p>';
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
      if(!cached.length&&box)box.innerHTML='<p class="pl-msg-empty">Contacts are not cached on this device. Connect to the internet to load them.</p>';
    } catch { if(box)box.textContent='Kontak offline tidak tersedia.'; }
    return;
  }
  const ids=[...new Set((rows||[]).map(row=>row.follower_id===currentUser.id?row.following_id:row.follower_id).filter(id=>id!==currentUser.id))];
  if(!ids.length) {
    contactsCache=[];
    try{localStorage.setItem(contactsKey(),'[]');}catch{}
    if(box)box.innerHTML='<p class="pl-msg-empty">Contacts appear when accounts are connected. You can also search for a username above.</p>';
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
  if(!user) { const layout=app.querySelector('#pl-msg-layout'); layout.classList.add('is-auth-empty'); layout.innerHTML=emptyStateMarkup({variant:'login',title:'Masuk untuk mulai berkirim pesan',description:'Hubungkan diri dengan teman dan komunitas Anda melalui percakapan pribadi.',action:'<a class="pl-msg-empty-action" href="#/account/login">Masuk ke PLUITS</a>'}); app.querySelector('.pl-msg-people')?.setAttribute('hidden',''); return; }
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
    if(query.length<2){box.hidden=false;box.innerHTML='<p class="pl-msg-search-hint">Type at least two characters to search.</p>';return;}
    const {data,error}=await db.from('user_profiles').select('id,display_name,username').or('username.ilike.%'+query+'%,display_name.ilike.%'+query+'%').neq('id',user.id).limit(8);
    if(error){box.hidden=false;box.textContent=error.message;return;}
    box.hidden=false;
    box.innerHTML=data?.length?data.map(person=>'<button class="pl-msg-contact" data-start-chat="'+person.id+'"><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small><span>Message</span></button>').join(''):'<p class="pl-msg-search-hint">No accounts found.</p>';
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
  if(!person){document.querySelector('#pl-msg-chat').innerHTML='<div class="pl-msg-empty">This contact is not cached. Load contacts while online before starting an offline DM.</div>';return;}
  const chat=document.querySelector('#pl-msg-chat');if(!chat)return;
  document.querySelector('#pl-msg-layout')?.classList.add('is-chat-open');
  const queued=queueFor(currentConversation);
  chat.innerHTML='<header class="pl-msg-chat-head"><button type="button" class="pl-msg-back" data-chat-back aria-label="Kembali ke Pesan">‹</button><div><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small></div><span>Offline draft</span></header>'+
    '<div class="pl-msg-stream"><div class="pl-msg-empty">A new conversation will be created when you reconnect. Message history is not available offline.</div>'+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="submit">Save message</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+queued.length+' messages waiting for connection. Drafts are saved only on this device.</p>';
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
    if(!writeQueue(queue)){chat.querySelector('.pl-msg-chat-status').textContent='The 50-message queue limit was reached or device storage is unavailable. Message was not saved.';return;}
    await openDraftConversation(recipientId);
  };
  chat.querySelector('.pl-msg-stream').scrollTop=chat.querySelector('.pl-msg-stream').scrollHeight;
}
async function loadConversations() {
  const list=document.querySelector('#pl-msg-conversations'); if(!list)return;
  const {data:members,error}=await db.from('user_conversation_members').select('conversation_id,last_read_at').eq('user_id',currentUser.id);
  if(activeInboxTab!=='primary')return;
  if(error){
    try { const cached=JSON.parse(localStorage.getItem(threadsKey())||'[]'); conversationCache=cached; list.innerHTML=cached.length?cached.map(item=>'<button class="pl-msg-thread" data-open-chat="'+item.id+'"><b>'+esc(item.other.display_name||item.other.username)+'</b><small>@'+esc(item.other.username)+'</small><p>History available when online</p></button>').join(''):'<div class="pl-msg-empty">No offline inbox cache. Connect to the internet to load conversations.</div>'; list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat)); }
    catch { list.textContent='Kotak masuk offline tidak tersedia.'; }
    return;
  }
  const ids=(members||[]).map(row=>row.conversation_id);
  if(!ids.length){list.innerHTML=emptyStateMarkup({variant:'message',title:'Belum ada percakapan',description:'Pilih kontak atau cari nama pengguna untuk memulai percakapan.'});conversationCache=[];return;}
  const [convs,memberRows,msgRows]=await Promise.all([
    db.from('user_conversations').select('id,title,updated_at').in('id',ids).order('updated_at',{ascending:false}),
    db.from('user_conversation_members').select('conversation_id,user_id,last_read_at').in('conversation_id',ids),
    db.from('user_messages').select('conversation_id,body,sender_id,created_at,message_type').in('conversation_id',ids).order('created_at',{ascending:false}).limit(200)
  ]);
  if(activeInboxTab!=='primary')return;
  if(convs.error||memberRows.error||msgRows.error){
    try { const cached=JSON.parse(localStorage.getItem(threadsKey())||'[]'); conversationCache=cached; list.innerHTML=cached.length?cached.map(item=>'<button class="pl-msg-thread" data-open-chat="'+item.id+'"><b>'+esc(item.other.display_name||item.other.username)+'</b><small>@'+esc(item.other.username)+'</small><p>History available when online</p></button>').join(''):'<div class="pl-msg-empty">No offline inbox cache. Connect to the internet to load conversations.</div>'; list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat)); }
    catch { list.textContent='Offline inbox is not available.'; }
    return;
  }
  const otherIds=[...new Set((memberRows.data||[]).map(row=>row.user_id).filter(id=>id!==currentUser.id))];
  const profiles=otherIds.length?await db.rpc('get_user_profile_directory_by_ids',{p_ids:otherIds}):{data:[],error:null};
  if(activeInboxTab!=='primary')return;
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
    return '<button class="pl-msg-thread '+(currentConversation===conversation.id?'active':'')+(conversation.unread?' is-unread':'')+'" data-open-chat="'+conversation.id+'"><span class="pl-msg-thread-head"><b>'+esc(conversation.other.display_name||conversation.other.username)+'</b>'+(conversation.unread?'<i aria-label="Unread message"></i>':'')+'</span><small>@'+esc(conversation.other.username)+'</small><p>'+esc(conversation.last?.message_type==='voice'?'🎙 Voice message':conversation.last?.body||'Belum ada pesan')+(pending?' · '+pending+' menunggu':'')+'</p></button>';
  }).join(''):emptyStateMarkup({variant:'message',title:'Belum ada percakapan',description:'Pilih kontak atau cari nama pengguna untuk memulai percakapan.'});
  list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat));
  list.hidden=false;
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
  chat.innerHTML='<header class="pl-msg-chat-head"><button type="button" class="pl-msg-back" data-chat-back aria-label="Kembali ke Pesan">‹</button><div><b>'+esc(thread?.other.display_name||thread?.other.username||'Conversation')+'</b><small>@'+esc(thread?.other.username||'')+'</small></div><span>'+ (navigator.onLine?'Connected':'Offline · messages queued')+'</span></header>'+
    '<div class="pl-msg-stream">'+((messages.data||[]).length? (messages.data||[]).map(message=>{
      const deleted=Boolean(message.deleted_at);
      const otherMember=(members.data||[]).find(member=>member.user_id!==currentUser.id);
      const readByOther=message.sender_id===currentUser.id&&Boolean(otherMember?.last_read_at)&&new Date(otherMember.last_read_at)>=new Date(message.created_at);
      return messageMarkup({...message,body:deleted?'Pesan dihapus':message.body,message_type:deleted?'text':message.message_type,media_path:deleted?null:message.media_path},false,readByOther);
    }).join('') : emptyStateMarkup({variant:'message',title:'Belum ada pesan',description:'Kirim pesan pertama untuk memulai percakapan.'}))+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="button" class="pl-msg-voice" data-voice-record aria-label="Record a voice message">🎙 Voice</button><button type="submit">Kirim</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+(queued.length?queued.length+' messages waiting for connection.':'Pesan tersinkron dengan server. Voice message maksimal 3 menit.')+'</p>';
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
