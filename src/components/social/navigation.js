import { socialIcon } from '../common/social-icons.js';

export function renderSocialHeader({ active = 'explore', profileView = false, user, profile, userAvatar = '', notificationCount = 0, publicHome = false } = {}) {
  const profileHref = user
    ? '#/@' + encodeURIComponent(profile?.username || '')
    : '#/account/login';

  if (publicHome) {
    return `
      <header class="pl-social-header">
        <a class="pl-social-brand" href="#/">PLUITS</a>
        <nav aria-label="Navigasi Pluits">
          <a class="${active === 'home' ? 'selected' : ''}" href="#/">Beranda</a>
          <a href="#/places">Tempat</a>
          <a href="#/marketplace">Marketplace</a>
          <a href="#/trip">Trip</a>
          <a href="#/account/reels">Reels</a>
        </nav>
        <div class="pl-social-header-actions">
          <a href="#/account/login">Masuk</a>
          <a class="pl-social-signup" href="#/account/register">Daftar</a>
        </div>
      </header>`;
  }

  return `
    <header class="ua-header pl-social-header">
      <a class="ua-brand" href="#/account/explore">PLUITS<span>INDONESIA</span></a>
      <nav aria-label="Navigasi Pluits">
        <a class="${active === 'explore' ? 'active' : ''}" href="#/account/explore">Beranda</a>
        <a href="#/places">Tempat</a>
        <a href="#/marketplace">Marketplace</a>
        <a href="#/trip">Trip</a>
        <a class="${active === 'reels' ? 'active' : ''}" href="#/account/reels">Reels</a>
        <a href='#/messages'>${socialIcon('message', { size: 17 })}<span>Pesan</span></a>
        <a class="${active === 'activity' ? 'active' : ''} pl-nav-activity" href="#/account/activity">Aktivitas${notificationCount ? '<i class="pl-nav-unread">'+(notificationCount>99?'99+':notificationCount)+'</i>' : ''}</a>
        <a class="${profileView ? 'active' : ''}" href="#/account/profile">Profil</a>
      </nav>
      <div class='pl-social-mobile-actions'>
        <a href='#/messages' aria-label='Pesan'>${socialIcon('message', { size: 21 })}</a>
        <a class='pl-mobile-notice' href='#/account/activity' aria-label='Aktivitas'>${socialIcon('bell', { size: 21 })}${notificationCount ? '<i class="pl-nav-unread">'+(notificationCount>99?'99+':notificationCount)+'</i>' : ''}</a>
      </div>
      <a class="ua-header-profile" href="${profileHref}" aria-label="Buka profil saya">${userAvatar || socialIcon('user', { size: 22 })}</a>
      <a class="ua-header-create" href="#/account/compose" aria-label="Buat postingan">＋</a>
    </header>`;
}

export function renderSocialMobileNav({ active = 'explore', profileView = false, user, profile, userAvatar = '', notificationCount = 0, publicHome = false } = {}) {
  const profileHref = user
    ? '#/@' + encodeURIComponent(profile?.username || '')
    : '#/account/login';
  // One canonical five-item bottom navigation is shared by public home and
  // every authenticated social page so mobile navigation never changes shape.
  const activeKey = active === 'home' || active === 'explore' ? 'home' : active;
  const items = [
    { key: 'home', href: publicHome ? '#/' : '#/account/explore', label: 'Beranda', icon: 'home' },
    { key: 'discover', href: '#/search', label: 'Jelajah', icon: 'compass' },
    { key: 'create', href: '#/account/compose', label: 'Buat', icon: 'plus' },
    { key: 'reels', href: '#/account/reels', label: 'Reels', icon: 'reels' },
  ];
  return `
    <nav class="pl-home-mobile-nav pl-social-mobile-nav" aria-label="Navigasi utama Pluits">
      ${items.map(item => `
        <a class="${item.key === 'create' ? 'pl-home-create' : activeKey === item.key ? 'active' : ''}"
           href="${item.href}" aria-label="${item.label}">
          ${socialIcon(item.icon, { size: item.key === 'create' ? 25 : 22 })}
          <small>${item.label}</small>
        </a>`).join('')}
      <a class="${profileView ? 'active' : ''}" href="${profileHref}" aria-label="Profil">
        ${userAvatar || socialIcon('user', { size: 22 })}
        <small>Profil</small>
      </a>
    </nav>`;
}
