import { socialIcon } from '../common/social-icons.js';

export function renderSocialHeader({ active = 'explore', profileView = false, showEditProfile = profileView, user, profile, userAvatar = '', notificationCount = 0, publicHome = false } = {}) {
  const profileHref = user ? '#/account/profile' : '#/account/login';

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
        <a href='#/account/followers' aria-label='Kontak'>${socialIcon('users', { size: 17 })}<span>Kontak</span></a>
        <a href='#/account/saved' aria-label='Tersimpan'>${socialIcon('bookmark', { size: 17 })}<span>Tersimpan</span></a>
        <a class="${active === 'activity' ? 'active' : ''} pl-nav-activity" href="#/account/activity" aria-label="Aktivitas">${socialIcon('bell', { size: 17 })}<span>Aktivitas</span>${notificationCount ? '<i class="pl-nav-unread">'+(notificationCount>99?'99+':notificationCount)+'</i>' : ''}</a>
        <a class="${profileView ? 'active' : ''}" href="#/account/profile">Profil</a>
      </nav>
      <div class="pl-social-header-menu">
        <button class="pl-social-menu-trigger" type="button" aria-label="Menu profil" aria-expanded="false" aria-controls="pl-account-menu"><span aria-hidden="true">•••</span></button>
        <div class="pl-social-menu-panel" id="pl-account-menu" hidden>
          ${showEditProfile?'<a href="#/account/profile/edit">'+socialIcon('edit',{size:17})+'<span>Edit profil</span></a>':''}
          <a href="#/account/settings">${socialIcon('settings',{size:17})}<span>Pusat Pengaturan</span></a>
        </div>
      </div>
      <a class="ua-header-profile" href="${user ? '#/account/profile' : '#/account/login'}" aria-label="Profil">${userAvatar || socialIcon('user', { size: 22 })}</a>
    </header>`;
}

export function renderSocialMobileNav({ active = 'explore', profileView = false, user, profile, userAvatar = '', notificationCount = 0, publicHome = false } = {}) {
  const profileHref = user ? '#/account/profile' : '#/account/login';
  const activeKey = active === 'home' || active === 'explore' ? 'home' : active === 'profile-edit' || active === 'profile' || active === 'preview' ? '' : active;
  const items = [
    { key: 'home', href: publicHome ? '#/' : '#/account/explore', label: 'Beranda', icon: 'home' },
    { key: 'discover', href: '#/search', label: 'Jelajah', icon: 'compass' },
    { key: 'create', href: user ? '#/account/create' : '#/account/login', label: 'Buat', icon: 'plus' },
    { key: 'activity', href: user ? '#/account/activity' : '#/account/login', label: 'Notifikasi', icon: 'bell' },
    { key: 'messages', href: user ? '#/messages' : '#/account/login', label: 'Inbox', icon: 'message' },
  ];
  return `
    <nav class="pl-home-mobile-nav pl-social-mobile-nav" aria-label="Navigasi utama Pluits">
      ${items.map(item => `
        <a class="${[item.key === 'create' ? 'pl-home-create' : activeKey === item.key ? 'active' : '',item.key === 'activity' ? 'pl-mobile-activity' : '',item.key === 'messages' ? 'pl-mobile-inbox' : ''].filter(Boolean).join(' ')}"
           href="${item.href}" aria-label="${item.label}">
          ${item.key === 'create' ? '<span class="pl-create-orb">'+socialIcon(item.icon,{size:25})+'</span>' : socialIcon(item.icon, { size: 22 })}
          <small>${item.label}</small>
          ${item.key === 'activity' && notificationCount ? '<i class="pl-nav-unread">'+(notificationCount>99?'99+':notificationCount)+'</i>' : ''}
        </a>`).join('')}
    </nav>`;
}
