import { socialIcon } from '../common/social-icons.js';
import { ROUTES, getRoute } from './navigation-routes.js';

export function renderSocialHeader({ active = 'explore', profileView = false, showEditProfile = profileView, user, profile, userAvatar = '', notificationCount = 0, publicHome = false, navClass = 'pl-home-mobile-nav pl-social-mobile-nav' } = {}) {
  if (publicHome) {
    return `
      <header class="pl-social-header">
        <a class="pl-social-brand" href="#/">PLUITS</a>
        <nav aria-label="Navigasi Pluits">
          <a class="${active === 'home' ? 'selected' : ''}" href="#/">Beranda</a>
          <a href="${ROUTES.places}">Tempat</a>
          <a href="${ROUTES.marketplace}">Marketplace</a>
          <a href="${ROUTES.trip}">Trip</a>
          <a href="${ROUTES.reels}">Reels</a>
        </nav>
        <div class="pl-social-header-actions">
          <a href="#/account/login">Masuk</a>
          <a class="pl-social-signup" href="#/account/register">Daftar</a>
        </div>
      </header>`;
  }

  return `
    <header class="ua-header pl-social-header">
      <a class="ua-brand" href="${ROUTES.home}">PLUITS<span>INDONESIA</span></a>
      <nav aria-label="Navigasi Pluits">
        <a class="${active === 'explore' ? 'active' : ''}" href="${ROUTES.home}">Beranda</a>
        <a href="${ROUTES.places}">Tempat</a>
        <a href="${ROUTES.marketplace}">Marketplace</a>
        <a href="${ROUTES.trip}">Trip</a>
        <a class="${active === 'reels' ? 'active' : ''}" href="${ROUTES.reels}">Reels</a>
        <a href='${ROUTES.inbox}'>${socialIcon('message', { size: 17 })}<span>Pesan</span></a>
        <a href='${ROUTES.contacts}' aria-label='Kontak'>${socialIcon('users', { size: 17 })}<span>Kontak</span></a>
        <a href='${ROUTES.saved}' aria-label='Tersimpan'>${socialIcon('bookmark', { size: 17 })}<span>Tersimpan</span></a>
        <a class="${active === 'activity' ? 'active' : ''} pl-nav-activity" href="${ROUTES.activity}" aria-label="Aktivitas">${socialIcon('bell', { size: 17 })}<span>Aktivitas</span>${notificationCount ? '<i class="pl-nav-unread">'+(notificationCount>99?'99+':notificationCount)+'</i>' : ''}</a>
        <a class="${profileView ? 'active' : ''}" href="${ROUTES.profile}">Profil</a>
      </nav>
      <div class="pl-social-header-menu">
        <button class="pl-social-menu-trigger" type="button" aria-label="Menu profil" aria-expanded="false" aria-controls="pl-account-menu"><span aria-hidden="true">•••</span></button>
        <div class="pl-social-menu-panel" id="pl-account-menu" hidden>
          ${showEditProfile?`<a href="${ROUTES.editProfile}">${socialIcon('edit',{size:17})}<span>Edit profil</span></a>`:''}
          <a href="${ROUTES.settings}">${socialIcon('settings',{size:17})}<span>Pusat Pengaturan</span></a>
        </div>
      </div>
    </header>`;
}

export function renderSocialMobileNav({ active = 'home', profileView = false, user, profile, userAvatar = '', notificationCount = 0, messageCount = 0, publicHome = false } = {}) {
  const isInbox = active === 'messages';
  const activeKey = active === 'home' || active === 'explore' ? 'home' : active === 'discover' ? 'discover' : active === 'profile-edit' || active === 'profile' || active === 'preview' ? 'profile' : active;
  const profileHref = getRoute('profile', Boolean(user));
  const items = [
    { key: 'home', href: publicHome ? ROUTES.publicHome : getRoute('home', Boolean(user)), label: 'Beranda', icon: 'home' },
    { key: 'discover', href: ROUTES.discover, label: 'Jelajah', icon: 'compass' },
    { key: 'create', href: getRoute('create', Boolean(user)), label: 'Buat', icon: 'plus' },
    isInbox ? { key: 'activity', href: getRoute('activity', Boolean(user)), label: 'Notifikasi', icon: 'bell' } : { key: 'messages', href: getRoute('inbox', Boolean(user)), label: 'Inbox', icon: 'message' },
    { key: 'profile', href: profileHref, label: 'Profil', icon: 'user', avatar: userAvatar }
  ];
  return `<nav class="${navClass}" aria-label="Navigasi utama Pluits">${items.map(item => {
    const iconMarkup = item.avatar || socialIcon(item.icon, { size: 22 });
    const badge = item.key === 'activity' ? notificationCount : item.key === 'messages' ? messageCount : 0;
    const isActive = activeKey === item.key;
    return `<a class="${[item.key === 'create' ? 'pl-home-create' : isActive ? 'active' : '',item.key === 'activity' ? 'pl-mobile-activity' : '',item.key === 'messages' ? 'pl-mobile-inbox' : '',item.key === 'profile' ? 'pl-mobile-profile' : ''].filter(Boolean).join(' ')}" href="${item.href}" aria-label="${item.label}" ${isActive?'aria-current="page"':''}>${item.key === 'create' ? '<span class="pl-create-orb">'+socialIcon(item.icon,{size:25})+'</span>' : iconMarkup}<small>${item.label}</small>${badge ? '<i class="pl-nav-unread">'+(badge>99?'99+':badge)+'</i>' : ''}</a>`;
  }).join('')}</nav>`;
}
