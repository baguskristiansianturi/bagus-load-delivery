import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import './directory.css';

const supabase = createClient(
  'https://ytndswhqxayqpftszwfh.supabase.co',
  'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65'
);

const AREAS = {
  denpasar: { label: 'Denpasar', lat: -8.65, lon: 115.2167 },
  badung: { label: 'Badung', lat: -8.58, lon: 115.177 },
  gianyar: { label: 'Gianyar', lat: -8.54, lon: 115.325 },
  tabanan: { label: 'Tabanan', lat: -8.54, lon: 115.125 },
  singaraja: { label: 'Buleleng', lat: -8.112, lon: 115.088 }
};
const state = { lat: null, lon: null, area: '', radius: 15000, category: '', query: '', rows: [], categories: [], map: null, mapTarget: null, markers: [], mode: 'map', personalization: true };
let homeNearbyRequest=0;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const distance = value => value < 1000 ? Math.round(value) + ' m' : (value / 1000).toFixed(1).replace('.', ',') + ' km';
const placeUrl = slug => '#/place/' + encodeURIComponent(slug);

export function homeNearbySection() {
  return `<section class="pl-nearby-home" aria-label="Tempat terdekat">
    <div class="pl-nearby-heading"><h2>Di sekitar Anda</h2><a href="#/places">Lihat semua <b>↗</b></a></div>
    <nav class="pl-nearby-topic-carousel" id="pl-home-nearby-topics" aria-label="Kategori di sekitar Anda"><a href="#/places">Semua</a></nav>
    <div class="pl-home-map-results" id="pl-home-nearby-results"><span class="pl-directory-loading">Mencari tempat di sekitar Anda…</span></div>
  </section>`;
}

async function getNearby({lat=state.lat,lon=state.lon,category=state.category,query=state.query,radius=state.radius,limit=12}={}) {
  if(!Number.isFinite(Number(lat))||!Number.isFinite(Number(lon)))return [];
  const {data,error}=await supabase.rpc('directory_nearby',{
    p_lat:lat,p_lon:lon,p_radius_m:radius,p_limit:limit,
    p_category_slug:category||null,p_query:query||null
  });
  if(error) throw error;
  return data||[];
}
async function getInterestMap() {
  const {data:userData}=await supabase.auth.getUser();
  if(!userData?.user || !state.personalization) return new Map();
  const userId=userData.user.id;
  const [explicit,events]=await Promise.all([
    supabase.from('user_interest_preferences').select('category_id,preference,directory_categories(slug)').eq('user_id',userId).eq('source','explicit'),
    supabase.from('user_activity_events').select('category_id,action,created_at').eq('user_id',userId).gte('created_at',new Date(Date.now()-90*86400000).toISOString()).not('category_id','is',null).order('created_at',{ascending:false}).limit(500)
  ]);
  const scores=new Map();
  (events.data||[]).forEach(event=>{const slug=state.categories.find(x=>x.id===event.category_id)?.slug;if(!slug)return;const weight={view:.15,search:.2,click:.35,save:1.1,follow:1,share:.7,check_in:1.2,hide:-1.2,report:-2}[event.action]||0;const ageDays=Math.max(0,(Date.now()-new Date(event.created_at).getTime())/86400000);const decay=Math.max(.1,1-ageDays/90);const next=Math.max(-3,Math.min(3,(scores.get(slug)||0)+weight*decay));scores.set(slug,next);});
  (explicit.data||[]).forEach(item=>{const slug=item.directory_categories?.slug;if(slug)scores.set(slug,item.preference*3);});
  return scores;
}
function ranked(rows, interests=new Map()) {
  return rows.map(row=>{
    const interest=(row.category_slugs||[]).reduce((score,slug)=>score+(interests.get(slug)||0),0);
    const distanceScore=Math.max(0,1-(Number(row.distance_m||0)/Math.max(state.radius,1)));
    return {...row,_rank:interest*3+distanceScore};
  }).sort((a,b)=>b._rank-a._rank || a.distance_m-b.distance_m);
}
function card(row) {
  const category=(row.category_slugs||[]).slice(0,2).map(esc).join(' · ');
  return `<article class="pl-directory-card">
    <a class="pl-directory-card-main" href="${placeUrl(row.slug)}">
      <div class="pl-directory-card-icon" aria-hidden="true">${row.entity_type==='place'?'⌖':row.entity_type==='organization'?'◎':row.entity_type==='provider'?'▦':row.entity_type==='event'?'◷':'◇'}</div>
      <div class="pl-directory-card-copy"><div class="pl-directory-card-meta">${category||'Direktori Pluits'} · ${distance(Number(row.distance_m)||0)}</div><h3>${esc(row.name)}</h3><p>${esc([row.locality,row.district,row.city,row.region].filter(Boolean).join(', ')||'Lokasi terdaftar')}</p></div>
    </a>
    <div class="pl-directory-card-foot"><span>${row.verification_status==='verified'?'✓ Terverifikasi':row.verification_status==='pending'?'Klaim ditinjau':'Belum diklaim'}</span><button type="button" class="pl-directory-feedback" data-feedback="${row.id}">Kurangi</button><a href="${placeUrl(row.slug)}">Lihat detail →</a></div>
  </article>`;
}
function renderCards(target, rows) {
  if(!rows.length) {
    target.innerHTML='<div class="pl-directory-empty"><b>Belum ada tempat yang cocok.</b><p>Perluas radius atau ubah kata pencarian dan kategori.</p></div>';
    return;
  }
  target.innerHTML=rows.map(card).join('');
}
async function loadCategories() {
  const {data,error}=await supabase.from('directory_categories').select('id,slug,name,sort_order').eq('is_active',true).order('sort_order');
  if(error) throw error;
  state.categories=data||[];
  return state.categories;
}
function categoryChips() {
  const chosen=['beach','tourist-attraction','restaurant','cafe','place-of-worship','mosque','church','school','public-facility','retail-store','professional-service','event'];
  const items=state.categories.filter(x=>chosen.includes(x.slug));
  return '<button class="pl-category-chip '+(!state.category?'active':'')+'" data-category="">Semua</button>'+items.map(x=>'<button class="pl-category-chip '+(state.category===x.slug?'active':'')+'" data-category="'+esc(x.slug)+'">'+esc(x.name)+'</button>').join('');
}
async function logActivity(action,entityId=null) {
  const {data}=await supabase.auth.getUser();
  if(!data?.user)return;
  let categoryId=null;
  if(entityId){const {data:category}=await supabase.from('directory_entity_categories').select('category_id').eq('entity_id',entityId).limit(1).maybeSingle();categoryId=category?.category_id||null;}
  await supabase.from('user_activity_events').insert({user_id:data.user.id,entity_id:entityId,category_id:categoryId,action});
}
async function loadMapLibre() {
  if(window.__pluitsMapLibre)return window.__pluitsMapLibre;
  if(!document.querySelector('#pl-maplibre-css')) {
    const link=document.createElement('link');link.id='pl-maplibre-css';link.rel='stylesheet';link.href='https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.css';document.head.append(link);
  }
  const lib=await import('https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.mjs');
  window.__pluitsMapLibre=lib;
  return lib;
}
function geoMapStyle() {
  return {
    version:8,
    projection:{type:'globe'},
    sources:{pluits_osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'© OpenStreetMap contributors',maxzoom:19}},
    layers:[{id:'pluits-osm-raster',type:'raster',source:'pluits_osm'}]
  };
}
function clearGeoMap() {
  state.markers.forEach(marker=>marker.remove());state.markers=[];
  if(state.map){state.map.remove();state.map=null;}
  state.mapTarget=null;
}
async function drawMap(rows,targetId='pl-directory-map',{zoom=11.7,fit=true}={}) {
  const target=document.getElementById(targetId);if(!target)return;
  try {
    const lib=await loadMapLibre();
    if(state.map&&(state.mapTarget!==targetId||state.map.getContainer()!==target))clearGeoMap();
    if(!state.map) {
      state.map=new lib.Map({container:target,style:geoMapStyle(),center:[state.lon,state.lat],zoom,pitch:22,bearing:-12,dragRotate:true,touchZoomRotate:true,scrollZoom:false,attributionControl:true,maxPitch:58});
      state.mapTarget=targetId;
      state.map.addControl(new lib.NavigationControl({showCompass:true,showZoom:true,visualizePitch:true}),'bottom-right');
      state.map.on('style.load',()=>{try{state.map?.setProjection({type:'globe'});}catch{}});
    } else {
      state.map.jumpTo({center:[state.lon,state.lat],zoom,pitch:22,bearing:-12});
    }
    state.markers.forEach(marker=>marker.remove());state.markers=[];
    rows.filter(row=>row.latitude!==null&&row.latitude!==undefined&&row.longitude!==null&&row.longitude!==undefined&&Number.isFinite(Number(row.latitude))&&Number.isFinite(Number(row.longitude))).forEach(row=>{
      const pin=document.createElement('button');pin.type='button';pin.className='pl-geo-pin';pin.setAttribute('aria-label','Lihat '+row.name);pin.innerHTML='<span></span>';
      const popup=new lib.Popup({offset:22,closeButton:true,closeOnClick:false,maxWidth:'230px'}).setHTML('<div class="pl-geo-popup"><strong>'+esc(row.name)+'</strong><small>'+esc([row.locality,row.city].filter(Boolean).join(', '))+'</small><a href="'+placeUrl(row.slug)+'">Lihat tempat <b>→</b></a></div>');
      const marker=new lib.Marker({element:pin,anchor:'bottom'}).setLngLat([Number(row.longitude),Number(row.latitude)]).setPopup(popup).addTo(state.map);
      state.markers.push(marker);
    });
    if(fit&&rows.length>1) {
      const bounds=new lib.LngLatBounds();
      rows.forEach(row=>{if(Number.isFinite(Number(row.latitude))&&Number.isFinite(Number(row.longitude)))bounds.extend([Number(row.longitude),Number(row.latitude)]);});
      if(!bounds.isEmpty())state.map.fitBounds(bounds,{padding:48,maxZoom:13.5,duration:0});
    }
    requestAnimationFrame(()=>state.map?.resize());
  } catch(error) {
    target.innerHTML='<div class="pl-directory-empty">Peta interaktif belum dapat dimuat pada perangkat ini. Daftar tempat tetap tersedia. <small>'+esc(error.message||'')+'</small></div>';
    if(targetId==='pl-directory-map'){
      const stage=target.closest('.pl-directory-map-stage'),list=document.querySelector('#pl-directory-results');
      if(stage)stage.hidden=true;if(list)list.hidden=false;
      state.mode='list';
      document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view==='list'));
    }
  }
}
function showGlobe(targetId='pl-directory-map') {
  if(!state.map||state.mapTarget!==targetId)return;
  if(!state.map.isStyleLoaded()){state.map.once('load',()=>showGlobe(targetId));return;}
  state.map.setProjection({type:'globe'});
  state.map.flyTo({center:[115.2167,-8.65],zoom:2.4,pitch:0,bearing:0,duration:850});
}
async function refreshDirectory() {
  const target=document.querySelector('#pl-directory-results');
  const map=document.querySelector('#pl-directory-map');
  if(!target)return;
  target.innerHTML='<div class="pl-directory-loading">Mencari tempat…</div>';
  try {
    const [rows,interests]=await Promise.all([getNearby(),getInterestMap()]);
    state.rows=ranked(rows,interests);
    renderCards(target,state.rows);
    if(map&&state.mode==='map')await drawMap(state.rows,'pl-directory-map',{zoom:11.7,fit:true});
    const count=document.querySelector('#pl-directory-count');if(count)count.textContent=state.rows.length+' tempat ditemukan';
  } catch(error) {
    target.innerHTML='<div class="pl-directory-empty"><b>Direktori belum dapat dimuat.</b><p>Periksa koneksi lalu coba kembali.</p><small>'+esc(error.message||'')+'</small></div>';
  }
}
function setArea(value) {
  if(value==='current'){requestLocation();return;}
  const selected=AREAS[value];if(!selected)return;
  state.area=value;state.lat=selected.lat;state.lon=selected.lon;
  const label=document.querySelector('#pl-directory-area-label');if(label)label.textContent=selected.label;
  saveDiscoveryPreferences({preferred_city:selected.label,preferred_region:'Bali',country_code:'ID',search_radius_m:state.radius,allow_nearby_location:false});
  refreshDirectory();
}
function setMode(mode) {
  state.mode=mode;
  const list=document.querySelector('#pl-directory-results'),map=document.querySelector('#pl-directory-map'),stage=map?.closest('.pl-directory-map-stage');
  document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===mode));
  if(list)list.hidden=mode!=='list';if(stage)stage.hidden=mode!=='map';
  if(mode==='map')drawMap(state.rows,'pl-directory-map',{zoom:11.7,fit:true});
}
async function requestLocation() {
  if(!navigator.geolocation){alert('Perangkat ini tidak mendukung lokasi. Pilih area secara manual.');return;}
  navigator.geolocation.getCurrentPosition(position=>{
    state.lat=position.coords.latitude;state.lon=position.coords.longitude;state.area='';
    const label=document.querySelector('#pl-directory-area-label');if(label)label.textContent='Lokasi saya';
    const areaSelect=document.querySelector('#pl-directory-area');if(areaSelect)areaSelect.value='current';
    saveDiscoveryPreferences({allow_nearby_location:true,search_radius_m:state.radius});
    refreshDirectory();
  },()=>alert('Izin lokasi tidak diberikan. Direktori tetap dapat digunakan dengan memilih area.'),{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}
export function directoryPage() {
  return `<div class="pl-directory-page">
    <header class="pl-directory-top"><a href="#/" class="pl-directory-brand">PLUITS</a><nav><a href="#/">Beranda</a><a class="active" href="#/places">Direktori</a><a href="#/account/explore">Komunitas</a><a href="#/marketplace">Marketplace</a></nav><a class="pl-directory-profile" href="#/account/profile">Akun</a></header>
    <main class="pl-directory-main">
      <section class="pl-directory-intro"><div><span>GEODIRECTORY PLUITS</span><h1>Temukan tempat di sekitarmu.</h1><p>Jelajahi tempat, usaha, layanan, komunitas, dan kegiatan dalam satu direktori.</p></div><div class="pl-directory-intro-actions"><button id="pl-use-location" type="button">⌖ Gunakan lokasi saya</button><label>Area<select id="pl-directory-area"><option value="denpasar">Denpasar</option><option value="current">Lokasi saya</option><option value="badung">Badung</option><option value="gianyar">Gianyar</option><option value="tabanan">Tabanan</option><option value="singaraja">Buleleng</option></select></label></div></section>
      <section class="pl-directory-search"><form id="pl-directory-search-form"><input id="pl-directory-query" type="search" placeholder="Cari pantai, masjid, restoran, sekolah, toko…" aria-label="Cari direktori"><button type="submit">Cari</button></form><div class="pl-directory-categories" id="pl-directory-categories"></div></section>
      <details class="pl-interest-settings"><summary>Atur minat rekomendasi</summary><label class="pl-personalization-toggle"><input id="pl-personalization-toggle" type="checkbox" checked> Gunakan personalisasi adaptif</label><div id="pl-interest-options" class="pl-interest-options">Masuk untuk menyimpan minat.</div></details><section class="pl-directory-toolbar"><div><h2>Jelajahi sekitar <span id="pl-directory-area-label">Denpasar</span></h2><p id="pl-directory-count">Memuat direktori…</p></div><div class="pl-directory-view"><button type="button" data-view="list">Daftar</button><button type="button" class="active" data-view="map">Peta</button><select id="pl-directory-radius" aria-label="Jangkauan pencarian"><option value="5000">5 km</option><option value="10000">10 km</option><option value="15000" selected>15 km</option><option value="25000">25 km</option><option value="50000">50 km</option></select></div></section>
      <div class="pl-directory-map-shell"><div class="pl-map-stage pl-directory-map-stage"><div id="pl-directory-map" class="pl-geo-map" role="region" aria-label="Peta GeoDirectory interaktif"></div><div class="pl-map-floating-top"><span>Jelajahi titik lokasi</span><button type="button" data-map-globe="pl-directory-map">◎ Lihat Bumi</button></div><div class="pl-map-touch-hint">Geser · Zoom dengan dua jari · Putar peta dengan dua jari</div></div><section id="pl-directory-results" class="pl-directory-results" hidden></section></div>
      <p class="pl-directory-attribution">Data lokasi ditampilkan berdasarkan sumber dan status verifikasinya. Peta &copy; OpenStreetMap contributors.</p>
    </main>
    <footer class="pl-directory-footer">PLUITS · Social · Local Marketplace · Trip · GeoDirectory</footer>
  </div>`;
}
async function saveDiscoveryPreferences(patch){
 const {data:auth}=await supabase.auth.getUser();if(!auth?.user)return;
 await supabase.from('user_discovery_preferences').upsert({user_id:auth.user.id,...patch},{onConflict:'user_id'});
}
async function loadDiscoveryPreferences(){
 const {data:auth}=await supabase.auth.getUser();if(!auth?.user)return;
 const {data}=await supabase.from('user_discovery_preferences').select('preferred_city,search_radius_m,use_personalization').eq('user_id',auth.user.id).maybeSingle();
 if(!data)return false;
 state.radius=data.search_radius_m||state.radius;state.personalization=data.use_personalization!==false;
 const match=Object.entries(AREAS).find(([,area])=>area.label.toLowerCase()===String(data.preferred_city||'').toLowerCase());
 if(match){state.area=match[0];state.lat=match[1].lat;state.lon=match[1].lon;const select=document.querySelector('#pl-directory-area');if(select)select.value=match[0];const label=document.querySelector('#pl-directory-area-label');if(label)label.textContent=match[1].label;const homeLabel=document.querySelector('#pl-home-nearby-area');if(homeLabel)homeLabel.textContent='⌖ '+match[1].label;}
 const radius=document.querySelector('#pl-directory-radius');if(radius)radius.value=String(state.radius);
 const toggle=document.querySelector('#pl-personalization-toggle');if(toggle)toggle.checked=state.personalization;
 return Boolean(match);
}
async function bindInterestSettings(){
 const target=document.querySelector('#pl-interest-options');if(!target)return;
 const {data:auth}=await supabase.auth.getUser();
 if(!auth?.user){target.innerHTML='<p>Masuk untuk menyimpan minat dan menyinkronkan rekomendasi ke akunmu.</p><a href="#/account/login">Masuk ke Pluits →</a>';return;}
 const {data:selected}=await supabase.from('user_interest_preferences').select('category_id').eq('user_id',auth.user.id).eq('source','explicit').eq('preference',1);
 const selectedIds=new Set((selected||[]).map(x=>x.category_id));
 const available=state.categories.filter(x=>['beach','tourist-attraction','restaurant','cafe','place-of-worship','mosque','church','school','public-facility','retail-store','construction-supplier','professional-service','construction-service','transport','tour-activity','event','community','foundation','sports','arts-culture'].includes(x.slug));
 target.innerHTML=available.map(x=>'<label><input type="checkbox" data-interest="'+esc(x.id)+'" '+(selectedIds.has(x.id)?'checked':'')+'> '+esc(x.name)+'</label>').join('');
 target.querySelectorAll('[data-interest]').forEach(input=>input.addEventListener('change',async()=>{
  const payload={user_id:auth.user.id,category_id:input.dataset.interest,preference:1,source:'explicit'};
  if(input.checked){const {error}=await supabase.from('user_interest_preferences').upsert(payload,{onConflict:'user_id,category_id,source'});if(error)input.checked=false;}
  else {const {error}=await supabase.from('user_interest_preferences').delete().eq('user_id',auth.user.id).eq('category_id',input.dataset.interest).eq('source','explicit');if(error)input.checked=true;}
  refreshDirectory();
 }));
}
export async function bindDirectoryPage() {
  const area=document.querySelector('#pl-directory-area');if(!area)return;
  try {await loadCategories();const params=new URLSearchParams((location.hash.split('?')[1]||''));const requested=params.get('category')||'';state.category=state.categories.some(x=>x.slug===requested)?requested:'';document.querySelector('#pl-directory-categories').innerHTML=categoryChips();}
  catch(error){console.error('Pluits directory categories',error);}
  area.addEventListener('change',event=>setArea(event.target.value));
  document.querySelector('#pl-use-location')?.addEventListener('click',requestLocation);
  document.querySelectorAll('[data-map-globe]').forEach(button=>button.addEventListener('click',()=>showGlobe(button.dataset.mapGlobe||'pl-directory-map')));
  document.querySelector('#pl-directory-radius')?.addEventListener('change',event=>{state.radius=Number(event.target.value)||15000;saveDiscoveryPreferences({search_radius_m:state.radius});refreshDirectory();});
  document.querySelector('#pl-directory-categories')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-category]');if(!button)return;
    state.category=button.dataset.category;document.querySelector('#pl-directory-categories').innerHTML=categoryChips();refreshDirectory();
  });
  document.querySelector('#pl-directory-search-form')?.addEventListener('submit',event=>{event.preventDefault();state.query=document.querySelector('#pl-directory-query').value.trim().slice(0,80);logActivity('search');refreshDirectory();});
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.view)));
  document.querySelector('#pl-directory-results')?.addEventListener('click',async event=>{
    const feedback=event.target.closest('[data-feedback]');
    if(feedback){
      const {data:auth}=await supabase.auth.getUser();
      if(!auth?.user){location.hash='#/account/login';return;}
      const entityId=feedback.dataset.feedback;
      const {error}=await supabase.from('user_recommendation_feedback').insert({user_id:auth.user.id,entity_id:entityId,feedback:'not_interested'});
      if(!error){await logActivity('hide',entityId);state.rows=state.rows.filter(row=>row.id!==entityId);renderCards(document.querySelector('#pl-directory-results'),state.rows);}
      return;
    }
    const link=event.target.closest('a[href^="#/place/"]');if(!link)return;
    const row=state.rows.find(item=>placeUrl(item.slug)===link.getAttribute('href'));if(row)logActivity('click',row.id);
  });
  await loadDiscoveryPreferences();
  await bindInterestSettings();
  document.querySelector('#pl-personalization-toggle')?.addEventListener('change',event=>{state.personalization=event.target.checked;saveDiscoveryPreferences({use_personalization:state.personalization});refreshDirectory();});
  await refreshDirectory();
}
export function bindHomeNearby({personalize=true,location=null}={}) {
  const resultTarget=document.querySelector('#pl-home-nearby-results');if(!resultTarget)return;
  const requestId=++homeNearbyRequest,routeHash=window.location.hash;
  const isCurrent=()=>requestId===homeNearbyRequest&&resultTarget.isConnected&&window.location.hash===routeHash;
  state.radius=5000;state.category='';state.query='';
  if(location&&Number.isFinite(location.latitude)&&Number.isFinite(location.longitude)){state.lat=location.latitude;state.lon=location.longitude;state.area='';}
  const prepare=location?Promise.resolve(true):personalize?loadDiscoveryPreferences():Promise.resolve(false);
  prepare.then(hasSavedArea=>{
    if(!isCurrent())return null;
    if(!location&&!hasSavedArea){resultTarget.innerHTML='<div class="pl-directory-empty">Izinkan lokasi perangkat untuk melihat tempat terdekat dengan jarak yang akurat.</div>';return null;}
    return getNearby({lat:state.lat,lon:state.lon,limit:24,radius:5000});
  }).then(async rows=>{
    if(!rows||!isCurrent())return;
    const presentSlugs=new Set(rows.flatMap(row=>Array.isArray(row.category_slugs)?row.category_slugs:[]));
    const categories=await loadCategories();if(!isCurrent())return;
    const nearbyCategories=categories.filter(category=>presentSlugs.has(category.slug));
    const topicTarget=document.querySelector('#pl-home-nearby-topics');
    if(topicTarget)topicTarget.innerHTML='<a class="is-active" href="#/places">Semua</a>'+nearbyCategories.map(category=>'<a href="#/places?category='+encodeURIComponent(category.slug)+'">'+esc(category.name)+'</a>').join('');
    if(!rows.length){resultTarget.innerHTML='<div class="pl-directory-empty">Belum ada tempat terdaftar dalam radius 5 km.</div>';return;}
    const interests=personalize?await getInterestMap():new Map();if(!isCurrent())return;
    const items=ranked(rows,interests),nearbyIds=items.slice(0,8).map(row=>row.id);
    const {data:links,error:linksError}=await supabase.from('user_post_directory_entities').select('entity_id,post_id,created_at').in('entity_id',nearbyIds).order('created_at',{ascending:false}).limit(40);
    if(linksError)throw linksError;if(!isCurrent())return;
    const postIds=[...new Set((links||[]).map(link=>link.post_id))];
    const {data:posts,error:postsError}=postIds.length?await supabase.from('user_posts').select('id,user_id,caption,media_path,media_type,profile_context,business_store_id,created_at').in('id',postIds).eq('visibility','public').eq('moderation_status','published').order('created_at',{ascending:false}).limit(24):{data:[],error:null};
    if(postsError)throw postsError;if(!isCurrent())return;
    const entityById=new Map(items.map(row=>[row.id,row]));
    const linked=(posts||[]).map(post=>({...post,entity:entityById.get((links||[]).find(link=>link.post_id===post.id)?.entity_id)})).filter(post=>post.entity);
    const userIds=[...new Set(linked.filter(post=>post.profile_context!=='business').map(post=>post.user_id))],storeIds=[...new Set(linked.filter(post=>post.profile_context==='business'&&post.business_store_id).map(post=>post.business_store_id))];
    const [profiles,stores]=await Promise.all([
      userIds.length?supabase.from('user_profiles').select('id,display_name,username').in('id',userIds):Promise.resolve({data:[],error:null}),
      storeIds.length?supabase.from('public_business_profiles').select('id,name,username').in('id',storeIds):Promise.resolve({data:[],error:null})
    ]);
    if(profiles.error)throw profiles.error;if(stores.error)throw stores.error;if(!isCurrent())return;
    const owners=new Map([...(profiles.data||[]).map(owner=>[owner.id,owner]),...(stores.data||[]).map(owner=>[owner.id,owner])]);
    const mediaPaths=linked.map(post=>post.media_path).filter(Boolean),signed=mediaPaths.length?await supabase.storage.from('pluits-user-media').createSignedUrls(mediaPaths,3600):{data:[]};
    if(!isCurrent())return;
    const imageByPath=new Map((signed.data||[]).map(file=>[file.path,file.signedUrl])),postByEntity=new Map();
    linked.forEach(post=>{if(!postByEntity.has(post.entity.id))postByEntity.set(post.entity.id,post);});
    resultTarget.innerHTML=items.slice(0,8).map(entity=>{
      const post=postByEntity.get(entity.id),image=post?imageByPath.get(post.media_path)||'':'';
      const itemName=post?String(post.caption||'').trim().split(/\n/)[0].slice(0,76)||entity.name:entity.name;
      const distanceLabel=distance(Number(entity.distance_m)||0),category=(entity.category_slugs||[]).slice(0,2).join(' · ');
      const typeLabel=entity.entity_type==='place'?'TEMPAT':entity.entity_type==='provider'?'JASA':entity.entity_type==='event'?'ACARA':'PLUITS';
      const locationText=distanceLabel+(location?' dari Anda':' dari lokasi tersimpan');
      return '<a class="pl-nearby-item-card" href="'+placeUrl(entity.slug)+'"><span class="pl-nearby-item-visual">'+(image?'<img src="'+esc(image)+'" alt="'+esc(itemName)+'" loading="lazy">':'<span class="pl-nearby-item-placeholder">'+typeLabel+'</span>')+'<span class="pl-nearby-item-shade"></span><span class="pl-nearby-item-overlay"><small>'+esc(category||typeLabel)+'</small><b>'+esc(itemName)+'</b><em><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10.2c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg> '+locationText+'</em></span></span></a>';
    }).join('');
  }).catch(error=>{if(isCurrent()){console.error('PLUITS nearby discovery failed',error);resultTarget.innerHTML='<div class="pl-directory-empty">Tempat terdekat belum dapat dimuat.</div>'; }});
}
export async function placePage(slug) {
  const {data:entity,error}=await supabase.from('directory_entities').select('id,entity_type,slug,name,summary,description,status,verification_status,created_at').eq('slug',slug).eq('status','published').maybeSingle();
  if(error||!entity)return '<div class="pl-directory-page"><main class="pl-directory-main"><a href="#/places">← Kembali ke direktori</a><h1>Tempat tidak ditemukan</h1><p>Tempat ini tidak tersedia di direktori publik.</p></main></div>';
  const [{data:locations},{data:cats}] = await Promise.all([
    supabase.from('directory_locations').select('address,locality,district,city,region,country_code,is_primary').eq('entity_id',entity.id).eq('is_public',true).order('is_primary',{ascending:false}),
    supabase.from('directory_entity_categories').select('directory_categories(name,slug)').eq('entity_id',entity.id)
  ]);
  const loc=locations?.[0],cat=(cats||[]).map(x=>x.directory_categories?.name).filter(Boolean);
  const {data:userData}=await supabase.auth.getUser();
  if(userData?.user){await supabase.from('user_recent_items').upsert({user_id:userData.user.id,target_type:'entity',target_id:entity.id,viewed_at:new Date().toISOString()},{onConflict:'user_id,target_type,target_id'});await logActivity('view',entity.id);}
  const claimButton=entity.verification_status==='verified'?'':entity.verification_status==='pending'?'<span class="pl-directory-secondary">Klaim sedang ditinjau</span>':`<a class="pl-directory-primary" href="#/place/${encodeURIComponent(slug)}/claim">Klaim tempat ini</a>`;
  return `<div class="pl-directory-page"><header class="pl-directory-top"><a href="#/" class="pl-directory-brand">PLUITS</a><nav><a href="#/">Beranda</a><a class="active" href="#/places">Direktori</a><a href="#/marketplace">Marketplace</a></nav><a class="pl-directory-profile" href="#/account/profile">Akun</a></header><main class="pl-directory-main pl-place-detail">
  <a class="pl-directory-back" href="#/places">← Direktori</a><span class="pl-directory-eyebrow">${esc(cat.join(' · ')||'DIREKTORI PLUITS')}</span><h1>${esc(entity.name)}</h1><div class="pl-place-status">${entity.verification_status==='verified'?'✓ Pengelola terverifikasi':entity.verification_status==='pending'?'Klaim sedang ditinjau':'Belum diklaim'}</div>
  <p class="pl-place-summary">${esc(entity.summary)}</p><section class="pl-place-panel"><h2>Informasi tempat</h2><p>${esc([loc?.address,loc?.locality,loc?.district,loc?.city,loc?.region].filter(Boolean).join(', ')||'Alamat belum dicantumkan')}</p><p>${esc(entity.description)}</p></section>
  <div class="pl-place-actions">${claimButton}<button class="pl-directory-secondary" id="pl-save-place" type="button">♡ Simpan ke wishlist</button></div>
  </main></div>`;
}
export async function claimPage(slug) {
  const {data:entity}=await supabase.from('directory_entities').select('id,name,slug,verification_status').eq('slug',slug).eq('status','published').maybeSingle();
  if(!entity)return '<div class="pl-directory-page"><main class="pl-directory-main"><h1>Tempat tidak ditemukan</h1><a href="#/places">Kembali ke direktori</a></main></div>';
  if(entity.verification_status==='verified'||entity.verification_status==='pending')return '<div class="pl-directory-page"><main class="pl-directory-main pl-claim-page"><a href="'+placeUrl(slug)+'">← '+esc(entity.name)+'</a><h1>'+(entity.verification_status==='verified'?'Tempat sudah terverifikasi':'Klaim sedang ditinjau')+'</h1><p>Permohonan pengelolaan baru tidak dapat dibuat pada status ini. Hubungi dukungan Pluits jika Anda memiliki informasi tambahan.</p></main></div>';
  return `<div class="pl-directory-page"><main class="pl-directory-main pl-claim-page"><a href="${placeUrl(slug)}">← ${esc(entity.name)}</a><span class="pl-directory-eyebrow">PENGELOLA TEMPAT</span><h1>Klaim tempat ini</h1><p>Ajukan permintaan sebagai pemilik atau pengelola yang berwenang. Akses tidak aktif sebelum bukti ditinjau dan disetujui.</p><form id="pl-claim-form" data-entity="${entity.id}"><label>Peran<select name="applicant_role" required><option value="owner">Pemilik</option><option value="authorized_manager">Pengelola resmi</option><option value="staff">Staf yang diberi wewenang</option><option value="representative">Perwakilan organisasi</option></select></label><label>Jelaskan kewenangan dan bukti Anda<textarea name="evidence_note" minlength="20" maxlength="3000" required placeholder="Contoh: jabatan, hubungan dengan tempat, dan jenis bukti yang dapat diverifikasi."></textarea></label><button class="pl-directory-primary" type="submit">Kirim permohonan</button><p id="pl-claim-status" role="status"></p></form></main></div>`;
}
export function bindPlacePage() {
  document.querySelector('#pl-save-place')?.addEventListener('click',async()=>{
    const {data}=await supabase.auth.getUser();if(!data?.user){location.hash='#/account/login';return;}
    const slug=decodeURIComponent(location.hash.split('/')[2]||'');
    const {data:entity}=await supabase.from('directory_entities').select('id').eq('slug',slug).maybeSingle();if(!entity)return;
    const {error}=await supabase.from('user_saved_items').upsert({user_id:data.user.id,target_type:'entity',target_id:entity.id},{onConflict:'user_id,target_type,target_id'});
    const button=document.querySelector('#pl-save-place');if(button)button.textContent=error?'Tidak dapat menyimpan':'✓ Tersimpan';
    if(!error)logActivity('save',entity.id);
  });
  document.querySelector('#pl-claim-form')?.addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget,button=form.querySelector('button'),status=document.querySelector('#pl-claim-status');
    const {data}=await supabase.auth.getUser();if(!data?.user){location.hash='#/account/login';return;}
    const values=new FormData(form);button.disabled=true;button.textContent='Mengirim…';
    const {error}=await supabase.from('directory_claims').insert({entity_id:form.dataset.entity,applicant_user_id:data.user.id,applicant_role:values.get('applicant_role'),evidence_note:String(values.get('evidence_note')||'').trim(),status:'submitted'});
    if(error){status.textContent=error.code==='23505'?'Sudah ada permohonan klaim yang sedang ditinjau untuk tempat ini.':error.message;button.disabled=false;button.textContent='Kirim permohonan';return;}
    status.textContent='Permohonan diterima dan menunggu pemeriksaan.';button.textContent='Terkirim';
  });
}
