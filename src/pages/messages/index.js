import { supabase as db } from '../../lib/supabase/client.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let currentUser = null;
let currentConversation = null;
let conversationCache = [];
let realtimeChannel = null;
let sendingQueue = false;
let networkListenersBound = false;

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
function messageMarkup(row, pending = false) {
  return '<article class="pl-msg-bubble '+(row.sender_id===currentUser.id?'mine':'')+(pending?' is-pending':'')+'">'+
    esc(row.body)+'<small>'+formatTime(row.created_at)+(pending?' · Tersimpan di perangkat, menunggu koneksi':'')+'</small></article>';
}
export function messagesPage() {
  return `<main class="pl-msg">
    <header class="pl-msg-head"><a href="#/account/profile" class="pl-msg-brand">PLUITS <span>MESSAGES</span></a>
      <nav><a href="#/account/explore">Beranda</a><a href="#/account/activity">Notifikasi</a><a href="#/account/profile">Profil</a></nav>
    </header>
    <section class="pl-msg-content">
      <div class="pl-msg-heading"><div><small>PRIVATE CONVERSATIONS</small><h1>Pesan</h1><p>Pesan pribadi antar akun Pluits.</p></div><span id="pl-msg-network" class="pl-msg-network" role="status">Memeriksa koneksi…</span></div>
      <div class="pl-msg-layout">
        <aside class="pl-msg-sidebar">
          <form id="pl-msg-search"><label>Cari akun berdasarkan username<input name="q" placeholder="Ketik username…" autocomplete="off"></label><button type="submit">Cari akun</button></form>
          <div id="pl-msg-search-results"></div>
          <div class="pl-msg-list-title">Kontak Anda</div><div id="pl-msg-contacts"><p class="pl-msg-empty">Memuat kontak…</p></div>
          <div class="pl-msg-list-title">Kotak masuk</div><div id="pl-msg-conversations"><p>Memuat percakapan…</p></div>
        </aside>
        <section class="pl-msg-chat" id="pl-msg-chat"><div class="pl-msg-empty">Pilih percakapan atau kontak untuk memulai pesan.</div></section>
      </div>
      <p class="pl-msg-offline-note">Jika koneksi terputus, pesan yang Anda kirim disimpan sementara di perangkat ini dan otomatis dicoba kirim saat online kembali. Pesan belum terkirim sampai server mengonfirmasi.</p>
    </section>
  </main>`;
}
function updateNetworkStatus() {
  const node = document.querySelector('#pl-msg-network');
  if (node) { node.textContent = navigator.onLine ? '● Online' : '○ Offline'; node.classList.toggle('is-offline', !navigator.onLine); }
}
async function loadContacts() {
  const box = document.querySelector('#pl-msg-contacts');
  const {data:rows,error} = await db.from('user_follows').select('follower_id,following_id,status')
    .eq('status','accepted').or('follower_id.eq.'+currentUser.id+',following_id.eq.'+currentUser.id);
  if (error) {
    try { const cached=JSON.parse(localStorage.getItem(contactsKey())||'[]'); box.innerHTML=cached.length?cached.map(person=>'<button class="pl-msg-contact" data-start-chat="'+person.id+'"><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small><span>Kontak tersimpan · mulai saat online</span></button>').join(''):'<p class="pl-msg-empty">Kontak belum tersimpan di perangkat ini. Hubungkan internet untuk memuat kontak pertama kali.</p>'; bindStartChat(box); }
    catch { box.textContent='Kontak offline belum tersedia.'; }
    return;
  }
  const ids = [...new Set((rows||[]).map(row => row.follower_id===currentUser.id?row.following_id:row.follower_id).filter(id=>id!==currentUser.id))];
  if (!ids.length) { box.innerHTML='<p class="pl-msg-empty">Kontak akan muncul dari akun yang saling terhubung. Anda juga dapat mencari username di atas.</p>'; return; }
  const {data:profiles,error:profileError} = await db.rpc('get_user_profile_directory_by_ids',{p_ids:ids});
  if (profileError) { box.textContent=profileError.message; return; }
  box.innerHTML=(profiles||[]).map(person=>'<button class="pl-msg-contact" data-start-chat="'+person.id+'"><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small><span>Pesan →</span></button>').join('') || '<p class="pl-msg-empty">Belum ada kontak yang dapat ditampilkan.</p>';
  bindStartChat(box);
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
  await Promise.all([loadContacts(),loadConversations()]);
  const requestedConversation=new URLSearchParams((location.hash.split('?')[1]||'')).get('conversation');
  if(requestedConversation&&conversationCache.some(item=>item.id===requestedConversation)) await openConversation(requestedConversation);
  const search=app.querySelector('#pl-msg-search');
  search.onsubmit=async event=>{
    event.preventDefault();
    const query=String(new FormData(search).get('q')||'').trim().replace(/^@/,'');
    const box=app.querySelector('#pl-msg-search-results');
    if(query.length<2){box.textContent='Masukkan minimal dua karakter username.';return;}
    const {data,error}=await db.from('user_profiles').select('id,display_name,username').ilike('username','%'+query+'%').neq('id',user.id).limit(8);
    if(error){box.textContent=error.message;return;}
    box.innerHTML=data?.length?data.map(person=>'<button class="pl-msg-contact" data-start-chat="'+person.id+'"><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small><span>Pesan →</span></button>').join(''):'<p class="pl-msg-empty">Akun tidak ditemukan.</p>';
    bindStartChat(box);
  };
  updateNetworkStatus();
  if(!networkListenersBound){window.addEventListener('online',onOnline);window.addEventListener('offline',updateNetworkStatus);networkListenersBound=true;}
  realtimeChannel=db.channel('pluits-dm-'+user.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'user_messages'},payload=>{
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
  const queued=queueFor(currentConversation);
  chat.innerHTML='<header class="pl-msg-chat-head"><div><b>'+esc(person.display_name||person.username)+'</b><small>@'+esc(person.username)+'</small></div><span>Draft offline</span></header>'+
    '<div class="pl-msg-stream"><div class="pl-msg-empty">Percakapan baru akan dibuat saat koneksi kembali. Riwayat pesan belum tersedia offline.</div>'+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="submit">Simpan pesan</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+queued.length+' pesan menunggu koneksi. Draft hanya tersimpan di perangkat ini.</p>';
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
    db.from('user_conversation_members').select('conversation_id,user_id').in('conversation_id',ids),
    db.from('user_messages').select('conversation_id,body,sender_id,created_at').in('conversation_id',ids).order('created_at',{ascending:false}).limit(200)
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
    return {...conversation,other:pmap.get(other?.user_id)||{display_name:'Akun Pluits',username:'akun'},last:latest.get(conversation.id)};
  });
  try { localStorage.setItem(threadsKey(),JSON.stringify(conversationCache.map(item=>({id:item.id,updated_at:item.updated_at,other:item.other})))); } catch {}
  list.innerHTML=conversationCache.length?conversationCache.map(conversation=>{
    const pending=queueFor(conversation.id).length;
    return '<button class="pl-msg-thread '+(currentConversation===conversation.id?'active':'')+'" data-open-chat="'+conversation.id+'"><b>'+esc(conversation.other.display_name||conversation.other.username)+'</b><small>@'+esc(conversation.other.username)+'</small><p>'+esc(conversation.last?.body||'Belum ada pesan')+(pending?' · '+pending+' menunggu':'')+'</p></button>';
  }).join(''):'<div class="pl-msg-empty">Belum ada percakapan. Pilih kontak atau cari username untuk memulai.</div>';
  list.querySelectorAll('[data-open-chat]').forEach(button=>button.onclick=()=>openConversation(button.dataset.openChat));
}
async function openConversation(id) {
  if(String(id).startsWith('draft:'))return openDraftConversation(String(id).slice(6));
  currentConversation=id;
  const chat=document.querySelector('#pl-msg-chat'); if(!chat)return;
  chat.innerHTML='<div class="pl-msg-empty">Memuat pesan…</div>';
  const thread=conversationCache.find(item=>item.id===id);
  const [messages,members]=await Promise.all([
    db.from('user_messages').select('id,sender_id,body,created_at,deleted_at').eq('conversation_id',id).order('created_at',{ascending:true}).limit(150),
    db.from('user_conversation_members').select('last_read_at').eq('conversation_id',id).eq('user_id',currentUser.id).maybeSingle()
  ]);
  if((messages.error||members.error)&&navigator.onLine){chat.textContent=(messages.error||members.error).message;return;}
  const queued=queueFor(id);
  chat.innerHTML='<header class="pl-msg-chat-head"><div><b>'+esc(thread?.other.display_name||thread?.other.username||'Percakapan')+'</b><small>@'+esc(thread?.other.username||'')+'</small></div><span>'+ (navigator.onLine?'Terhubung':'Offline · pesan antrean')+'</span></header>'+
    '<div class="pl-msg-stream">'+(messages.data||[]).map(message=>messageMarkup({...message,body:message.deleted_at?'Pesan dihapus':message.body})).join('')+queued.map(row=>messageMarkup(row,true)).join('')+'</div>'+
    '<form id="pl-msg-compose"><textarea name="body" rows="2" maxlength="5000" placeholder="Tulis pesan…" required></textarea><button type="submit">Kirim</button></form>'+
    '<p class="pl-msg-chat-status" role="status">'+(queued.length?queued.length+' pesan menunggu koneksi.':'Pesan tersinkron dengan server.')+'</p>';
  const readAt=members.data?.last_read_at;
  if(navigator.onLine&&(!readAt||new Date(readAt)<new Date())) await db.rpc('mark_conversation_read',{p_conversation_id:id});
  const form=chat.querySelector('#pl-msg-compose');
  form.onsubmit=async event=>{
    event.preventDefault();
    const body=String(new FormData(form).get('body')||'').trim(); if(!body)return;
    const item={client_message_id:crypto.randomUUID(),conversation_id:id,sender_id:currentUser.id,body,created_at:new Date().toISOString()};
    const button=form.querySelector('button'); button.disabled=true;
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
