const paths = {
  like: '<path d="M20.4 8.8c0 5-8.4 10-8.4 10s-8.4-5-8.4-10A4.7 4.7 0 0 1 8.3 4c1.5 0 2.9.8 3.7 2.1A4.4 4.4 0 0 1 15.7 4a4.7 4.7 0 0 1 4.7 4.8Z"/>',
  comment: '<path d="M20 11.3a7.3 7.3 0 0 1-7.3 7.3H5l1-3.2a7.3 7.3 0 1 1 14-4.1Z"/>',
  share: '<path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z"/><path d="m10.3 13.7 4.8-4.8"/>',
  save: '<path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4V4.8Z"/>'
};
function icon(name) {
  return '<svg class="pl-post-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths[name] + '</svg>';
}
export function renderPostActions({ user, liked = false, likes = 0, comments = 0, saved = false } = {}) {
  if (!user) return '<div class="ua-post-actions pl-post-actions"><a class="ua-login-action" href="#/account/login">Masuk untuk berinteraksi</a></div>';
  return '<div class="ua-post-actions pl-post-actions">' +
    '<button type="button" data-action="like" class="' + (liked ? 'is-liked' : '') + '" aria-label="Suka">' + icon('like') + '<b>' + Number(likes || 0) + '</b></button>' +
    '<button type="button" data-action="comments" aria-label="Komentar">' + icon('comment') + '<b>' + Number(comments || 0) + '</b></button>' +
    '<button type="button" data-action="share" aria-label="Bagikan">' + icon('share') + '</button>' +
    '<button type="button" data-action="save" class="' + (saved ? 'is-saved' : '') + '" aria-label="Simpan">' + icon('save') + '</button>' +
  '</div>';
}
