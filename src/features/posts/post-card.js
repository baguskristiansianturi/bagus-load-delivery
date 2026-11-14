const escapeText=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function relativeTime(value){
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return '';
 const seconds=Math.max(0,Math.floor((Date.now()-date.getTime())/1000));
 if(seconds<60)return 'Baru saja';
 const units=[['tahun',31536000],['bulan',2592000],['minggu',604800],['hari',86400],['jam',3600],['menit',60]];
 for(const [label,size] of units){const count=Math.floor(seconds/size);if(count>=1)return count+' '+label+' yang lalu';}
 return 'Baru saja';
}
function shortCaption(value,maxWords=50){
 const words=String(value??'').trim().split(/\s+/).filter(Boolean);
 return words.length>maxWords?words.slice(0,maxWords).join(' ')+'…':words.join(' ');
}
/** Canonical social post card. Page controllers provide data and visual helpers; data loading stays outside this component. */
export function renderPostCard(post,{user,avatar,socialIcon,renderActions,esc=escapeText}={}){
 const profileHref='#/@'+encodeURIComponent(post.owner?.username||'');
 const caption=shortCaption(post.caption);
 const media=(post.media||[]).length>1
  ? `<div class="ua-media-gallery" data-gallery><div class="ua-gallery-track">${post.media.map((item,index)=>`<div class="ua-gallery-item">${item.media_type==='video'?`<video src="${esc(item.url)}" controls controlsList="nodownload" disablePictureInPicture playsinline preload="metadata"></video>`:`<img src="${esc(item.url)}" alt="Media ${index+1}" draggable="false" loading="lazy">`}</div>`).join('')}</div><span class="ua-gallery-count" data-gallery-count>1/${post.media.length}</span></div>`
  :(post.media?.length?`<div class="ua-media">${post.media[0].media_type==='video'?`<video src="${esc(post.media[0].url)}" controls controlsList="nodownload" disablePictureInPicture playsinline preload="metadata"></video>`:`<img src="${esc(post.media[0].url)}" alt="${esc(caption||'Foto postingan')}" draggable="false" loading="lazy">`}</div>`:'<div class="ua-text-post-mark">PLUITS</div>');
 const owner=post.owner||{};
 return `<article class="ua-post-card" data-post-id="${esc(post.id)}" data-owner-id="${esc(post.user_id)}">
 <div class="ua-post-head"><a class="ua-post-avatar-link" href="${profileHref}">${avatar(post.avatarUrl,owner.display_name,'post')}</a><div><a class="ua-author-link" href="${profileHref}"><strong>${esc(owner.display_name||'Pengguna Pluits')}</strong></a><small>@${esc(owner.username||'pengguna')} ${owner.public_city&&owner.public_province?'· '+esc(owner.public_city):''}</small><time class="ua-post-date" datetime="${esc(post.created_at)}">${relativeTime(post.created_at)}</time></div><div class="ua-post-menu-wrap"><button class="ua-post-more" type="button" aria-label="Menu postingan" aria-expanded="false" data-post-menu>${socialIcon("more",{size:21})}</button><div class="ua-post-menu" hidden>${post.user_id===user?.id?`<button type="button" data-action="edit">${socialIcon("edit",{size:16})}<span>Edit postingan</span></button><button type="button" data-action="delete-post"><span class="ua-menu-delete-icon">×</span><span>Hapus postingan</span></button>`:`<button type="button" data-action="hide-post">${socialIcon("eye-off",{size:16})}<span>Sembunyikan postingan ini</span></button><button type="button" data-action="mute-user">${socialIcon("user-round-x",{size:16})}<span>Jangan tampilkan dari ${esc(owner.display_name||'pengguna ini')}</span></button><button type="button" data-action="share">${socialIcon("send",{size:16})}<span>Bagikan postingan</span></button><button type="button" data-action="report">${socialIcon("flag",{size:16})}<span>Laporkan postingan</span></button>`}</div></div></div>
 ${media}
 ${renderActions({user,liked:post.liked,saved:post.saved})}
 <div class="ua-post-caption"><p><a href="${profileHref}"><b>@${esc(owner.username||'pengguna')}</b></a>${caption?' '+esc(caption):''}</p><div class="ua-post-engagement"><span>${Number(post.likes||0)} suka</span><button data-action="comments" class="ua-view-comments" type="button">${Number(post.comments||0)} komentar</button></div></div>
 ${user?(post.user_id===user.id?'<section class="ua-post-editor" hidden></section>':'')+'<div class="ua-comments" hidden></div>':''}
 </article>`;
}
