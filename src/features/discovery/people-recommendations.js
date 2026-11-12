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
export function renderPeopleRecommendations({people=[],avatarUrls=new Map()}={}){
 const cards=people.map(person=>{
  const name=escapeHtml(person.display_name||'Pengguna Pluits'),username=escapeHtml(person.username||'pengguna');
  const avatarUrl=avatarUrls.get(person.avatar_path)||'';
  const initials=escapeHtml((person.display_name||'P').trim().slice(0,1).toUpperCase());
  const mutual=person.mutualCount?'<small>'+person.mutualCount+' koneksi dalam jaringan yang sama</small>':person.isNew?'<small>Baru bergabung di PLUITS</small>':'<small>Rekomendasi untuk Anda</small>';
  return '<article class="ua-people-card"><a class="ua-people-profile" href="#/@'+encodeURIComponent(person.username||'')+'"><span class="ua-people-avatar">'+(avatarUrl?'<img src="'+escapeHtml(avatarUrl)+'" alt="" loading="lazy">':'<b>'+initials+'</b>')+'</span><strong>'+name+'</strong><small>@'+username+'</small></a>'+(person.isNew?'<span class="ua-people-new">Baru bergabung</span>':'<span class="ua-people-reason">'+(person.mutualCount?'Jaringan serupa':'Kenalan baru')+'</span>')+'<div class="ua-people-meta">'+mutual+'</div><button type="button" class="ua-people-follow" data-people-follow="'+escapeHtml(person.id)+'" data-profile-visibility="'+escapeHtml(person.visibility||'public')+'" data-follow-state="" aria-pressed="false">Ikuti</button></article>';
 }).join('');
 return '<section class="ua-people-recommendations" aria-labelledby="ua-people-recommendations-title"><div class="ua-people-heading"><div><h2 id="ua-people-recommendations-title">Orang yang Mungkin Anda Kenal</h2><p>Temukan orang baru dan perluas koneksi Anda.</p></div><a href="#/search">Lihat semua</a></div>'+(cards?'<div class="ua-people-track" role="list">'+cards+'</div>':'<div class="ua-people-empty">Belum ada rekomendasi akun baru. Coba lagi nanti saat lebih banyak orang bergabung.</div>')+'</section>';
}
