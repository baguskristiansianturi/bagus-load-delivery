export function renderReelCard(p,{user,avatar,esc,socialIcon}){
 const owner=p.owner||{},media=p.media?.[0];if(!media||media.media_type!=='video'||!media.url)return '';
 const href='#/@'+encodeURIComponent(owner.username||'');
 const menu=p.user_id===user?.id
  ? `<button type="button" data-action="delete-post"><span>×</span><span>Hapus Reel</span></button>`
  : `<button type="button" data-action="share">${socialIcon('send',{size:16})}<span>Bagikan Reel</span></button><button type="button" data-action="report">${socialIcon('shield',{size:16})}<span>Laporkan Reel</span></button>`;
 const actions=user
  ? `<div class="ua-reel-actions"><button type="button" data-action="like" class="${p.liked?'is-liked':''}" aria-label="Sukai Reel">${socialIcon('pluits-like',{size:26})}<b>${Number(p.likes||0)}</b></button><button type="button" data-action="comments" aria-label="Komentar Reel">${socialIcon('pluits-comment',{size:25})}<b>${Number(p.comments||0)}</b></button><button type="button" data-action="share" aria-label="Bagikan Reel">${socialIcon('pluits-share',{size:24})}<b>Bagikan</b></button><button type="button" data-action="save" class="${p.saved?'is-saved':''}" aria-label="Simpan Reel">${socialIcon('pluits-mark',{size:24})}<b>Simpan</b></button></div>`
  : '<a class="ua-login-action" href="#/account/login">Masuk untuk berinteraksi</a>';
 return `<article class="ua-post-card ua-reel-card" data-post-id="${esc(p.id)}" data-owner-id="${esc(p.user_id)}" data-reel-post-id="${esc(p.id)}">
  <div class="ua-reel-stage">
   <video class="ua-reel-video" data-reel-video data-reel-src="${esc(media.url)}" playsinline muted loop preload="none" aria-label="Reel oleh ${esc(owner.display_name||'Pengguna Pluits')}"></video>
   <button type="button" class="ua-reel-play-toggle" data-reel-toggle aria-label="Jeda video">Ⅱ</button>
   <header class="ua-reel-topline"><a class="ua-reel-back" href="#/account/explore" aria-label="Kembali ke Circle">‹</a><div class="ua-post-menu-wrap"><button type="button" class="ua-post-more" aria-label="Menu Reel" aria-expanded="false" data-post-menu>${socialIcon('more',{size:21})}</button><div class="ua-post-menu" hidden>${menu}</div></div></header>
   <div class="ua-reel-actions-wrap">${actions}</div>
   <div class="ua-reel-bottomline"><a class="ua-reel-author" href="${href}">${avatar(p.avatarUrl,owner.display_name||'P')}<span><strong>@${esc(owner.username||'pengguna')}</strong><small>${esc(owner.display_name||'Pengguna Pluits')}</small></span></a><p>${esc(p.caption||'')}</p><div class="ua-reel-audio" aria-label="Audio asli"><span aria-hidden="true">♫</span><span>Audio asli · @${esc(owner.username||'pengguna')}</span><button type="button" class="ua-reel-sound" data-reel-sound aria-label="Aktifkan suara">Suara mati</button></div></div>
  </div>
  <span class="ua-like-count" hidden>${Number(p.likes||0)} suka</span>
  <section class="ua-comments ua-reel-comments" hidden></section>
 </article>`;
}
