const paths = {
  like: '<path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.8 4.8 0 0 1 8 4a5.1 5.1 0 0 1 4 2.1A5.1 5.1 0 0 1 16 4a4.8 4.8 0 0 1 4.8 4.8Z"/>',
  comment: '<path d="M20.2 11.4a7.7 7.7 0 0 1-7.7 7.7 8 8 0 0 1-3.2-.7L4 20l1.6-4.3a7.7 7.7 0 1 1 14.6-4.3Z"/>',
  share: '<path d="M22 2 15 22l-4-8-8-4 19-8Z"/><path d="m22 2-11 12"/>',
  save: '<path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4V4.8Z"/>'
};
function icon(name) {
  return '<svg class="pl-post-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths[name] + '</svg>';
}
export function renderPostActions({ user, liked = false, saved = false } = {}) {
  if (!user) return '<div class="ua-post-actions pl-post-actions"><a class="ua-login-action" href="#/account/login">Masuk untuk berinteraksi</a></div>';
  return '<div class="ua-post-actions pl-post-actions">' +
    '<button type="button" data-action="like" class="' + (liked ? 'is-liked' : '') + '" aria-label="Suka" title="Suka">' + icon('like') + '</button>' +
    '<button type="button" data-action="comments" aria-label="Komentar" title="Komentar">' + icon('comment') + '</button>' +
    '<button type="button" data-action="share" aria-label="Bagikan" title="Bagikan">' + icon('share') + '</button>' +
    '<button type="button" data-action="save" class="' + (saved ? 'is-saved' : '') + '" aria-label="Simpan" title="Simpan">' + icon('save') + '</button>' +
  '</div>';
}
