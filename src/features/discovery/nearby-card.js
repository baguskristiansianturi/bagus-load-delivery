const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function renderNearbyHeroCard({href,image,name,category,distanceLabel,locationText,typeLabel='TEMPAT'}={}){
 const visual=image?'<img src="'+escapeHtml(image)+'" alt="'+escapeHtml(name)+'" loading="lazy">':'<span class="pl-nearby-item-placeholder">'+escapeHtml(typeLabel)+'</span>';
 return '<a class="pl-nearby-item-card" href="'+escapeHtml(href)+'"><span class="pl-nearby-item-visual">'+visual+'<span class="pl-nearby-item-shade"></span><span class="pl-nearby-item-overlay"><small>'+escapeHtml(category||typeLabel)+'</small><b>'+escapeHtml(name)+'</b><em><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10.2c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg> '+escapeHtml(locationText||distanceLabel||'')+'</em></span></span></a>';
}
