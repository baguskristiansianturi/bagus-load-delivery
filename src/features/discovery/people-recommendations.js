const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const DAY=24*60*60*1000;
export function rankPeopleRecommendations({profiles=[],viewerId,followingIds=[],blockedIds=[],relationships=[],mutualCounts={},city='',province='',now=Date.now(),limit=10}={}){
 const related=new Set();
 relationships.forEach(row=>{
  if(row.follower_id===viewerId)related.add(row.following_id);
  if(row.following_id===viewerId)related.add(row.follower_id);
 });
 const followed=new Set(followingIds),blocked=new Set(blockedIds);
 return profiles.filter(person=>person&&person.id!==viewerId&&person.visibility==='public'&&!followed.has(person.id)&&!blocked.has(person.id)&&!related.has(person.id))
  .map(person=>{
   const created=Date.parse(person.created_at||'');
   const age=Number.isFinite(created)?Math.max(0,now-created):Infinity;
   const isNew=age<=14*DAY;
   const mutualCount=Number(mutualCounts[person.id]||0);
   const sameCity=!!city&&String(person.public_city||'').trim().toLocaleLowerCase('id')===String(city).trim().toLocaleLowerCase('id');
   const sameProvince=!!province&&String(person.public_province||'').trim().toLocaleLowerCase('id')===String(province).trim().toLocaleLowerCase('id');
   const freshness=Number.isFinite(age)?Math.max(0,20*(1-age/(30*DAY))):0;
   const score=mutualCount*70+(sameCity?24:0)+(sameProvince?12:0)+(isNew?42:0)+freshness;
   return {...person,mutualCount,isNew,recommendationScore:score};
  })
  .sort((a,b)=>b.recommendationScore-a.recommendationScore||Date.parse(b.created_at||0)-Date.parse(a.created_at||0))
  .slice(0,Math.max(0,Math.min(20,limit)));
}
export const CIRCLE_DEMO_PEOPLE=[{"name":"Alya Putri","username":"alyaputri","avatarUrl":"https://randomuser.me/api/portraits/women/12.jpg","city":"Denpasar","interests":"Fotografi · Kuliner"},{"name":"Raka Pratama","username":"rakapratama","avatarUrl":"https://randomuser.me/api/portraits/men/32.jpg","city":"Badung","interests":"Teknologi · Travel"},{"name":"Nadia Safitri","username":"nadiasafitri","avatarUrl":"https://randomuser.me/api/portraits/women/44.jpg","city":"Ubud","interests":"Seni · Lifestyle"},{"name":"Dimas Mahendra","username":"dimasmahendra","avatarUrl":"https://randomuser.me/api/portraits/men/46.jpg","city":"Gianyar","interests":"Bisnis · Komunitas"},{"name":"Keisha Anindya","username":"keishaanindya","avatarUrl":"https://randomuser.me/api/portraits/women/49.jpg","city":"Canggu","interests":"Fashion · Musik"},{"name":"Fajar Ramadhan","username":"fajarramadhan","avatarUrl":"https://randomuser.me/api/portraits/men/51.jpg","city":"Sanur","interests":"Olahraga · Kuliner"},{"name":"Mira Lestari","username":"miralestari","avatarUrl":"https://randomuser.me/api/portraits/women/56.jpg","city":"Denpasar","interests":"Parenting · Pendidikan"},{"name":"Ardi Wijaya","username":"ardiwijaya","avatarUrl":"https://randomuser.me/api/portraits/men/60.jpg","city":"Kuta","interests":"Desain · Fotografi"},{"name":"Salsa Maharani","username":"salsamaharani","avatarUrl":"https://randomuser.me/api/portraits/women/65.jpg","city":"Tabanan","interests":"Travel · Alam"},{"name":"Bima Aditya","username":"bimaaditya","avatarUrl":"https://randomuser.me/api/portraits/men/68.jpg","city":"Jimbaran","interests":"Bisnis · Teknologi"}];
export function renderPeopleRecommendations({people=[],avatarUrls=new Map(),demoPeople=[]}={}){
 const demoCards=demoPeople.map(person=>{
  const name=escapeHtml(person.name),city=escapeHtml(person.city);
  return '<article class="ua-people-card ua-people-card-demo"><div class="ua-people-cover"><img src="'+escapeHtml(person.avatarUrl)+'" alt="Foto profil '+name+'" loading="lazy" decoding="async"></div><span class="ua-people-new-badge">NEW</span><div class="ua-people-overlay"><div class="ua-people-copy"><div class="ua-people-profile"><strong title="'+name+'">'+name+'</strong></div><div class="ua-people-meta"><small>'+city+'</small></div></div></div><button type="button" class="ua-people-follow ua-people-demo-follow" data-people-demo-follow aria-label="Ikuti '+name+'" title="Ikuti" aria-pressed="false"><span aria-hidden="true">+</span></button></article>';
 }).join('');
 const cards=people.map(person=>{
  const name=escapeHtml(person.display_name||'Pengguna Pluits');
  const avatarUrl=avatarUrls.get(person.avatar_path)||'';
  const initials=escapeHtml((person.display_name||'P').trim().slice(0,1).toUpperCase());
  const city=escapeHtml(person.public_city||person.public_province||'');
  return '<article class="ua-people-card">'+(person.isNew?'<span class="ua-people-new-badge">NEW</span>':'')+'<div class="ua-people-cover">'+(avatarUrl?'<img src="'+escapeHtml(avatarUrl)+'" alt="Foto profil '+name+'" loading="lazy" decoding="async">':'<span class="ua-people-cover-fallback">'+initials+'</span>')+'</div><div class="ua-people-overlay"><div class="ua-people-copy"><a class="ua-people-profile" href="#/@'+encodeURIComponent(person.username||'')+'" aria-label="Lihat profil '+name+'"><strong title="'+name+'">'+name+'</strong></a>'+(city?'<div class="ua-people-meta"><small>'+city+'</small></div>':'')+'</div></div><button type="button" class="ua-people-follow" data-people-follow="'+escapeHtml(person.id)+'" data-profile-visibility="'+escapeHtml(person.visibility||'public')+'" data-follow-state="" aria-label="Ikuti '+name+'" title="Ikuti" aria-pressed="false"><span aria-hidden="true">+</span></button></article>';
 }).join('');
 return '<section class="ua-people-recommendations" aria-labelledby="ua-people-recommendations-title"><div class="ua-people-heading"><div><h2 id="ua-people-recommendations-title">Orang yang Mungkin Anda Kenal</h2><p>Temukan orang baru dan perluas koneksi Anda.</p></div>'+(demoCards?'<span class="ua-demo-tag">DEMO UI</span>':'')+'<a href="#/search">Lihat semua</a></div>'+(cards||demoCards?'<div class="ua-people-track" role="list">'+cards+demoCards+'</div>':'<div class="ua-people-empty">Belum ada rekomendasi akun baru. Coba lagi nanti saat lebih banyak orang bergabung.</div>')+'</section>';
}
