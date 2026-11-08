import { socialIcon } from '../common/social-icons.js';

export function renderSocialHeader({ active = 'explore', profileView = false, user, profile, userAvatar = '', publicHome = false } = {}) {
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
        <a class="${active === 'activity' ? 'active' : ''}" href="#/account/activity">Aktivitas</a>
        <a class="${profileView ? 'active' : ''}" href="#/account/profile">Profil</a>
      </nav>
      <a class="ua-header-profile" href="${profileHref}" aria-label="Buka profil saya">${userAvatar || socialIcon('user', { size: 22 })}</a>
      <a class="ua-header-create" href="#/account/compose" aria-label="Buat postingan">＋</a>
    </header>`;
}

export function renderSocialMobileNav({ active = 'explore', profileView = false, user, profile, userAvatar = '', publicHome = false } = {}) {
  const profileHref = user
    ? '#/@' + encodeURIComponent(profile?.username || '')
    : '#/account/login';

  if (publicHome) {
    const items = [
      { key: 'home', href: '#/', label: 'Beranda', icon: 'home' },
      { key: 'discover', href: '#/account/explore', label: 'Jelajah', icon: 'compass' },
      { key: 'create', href: '#/account/compose', label: 'Buat', icon: 'plus' },
      { key: 'reels', href: '#/account/reels', label: 'Reels', icon: 'reels' },
    ];
    return `
      <nav class="pl-home-mobile-nav pl-social-mobile-nav" aria-label="Navigasi utama Pluits">
        ${items.map(item => `
          <a class="${item.key === 'create' ? 'pl-home-create' : active === item.key ? 'active' : ''}"
             href="${item.href}" aria-label="${item.label}">
            ${socialIcon(item.icon, { size: item.key === 'create' ? 25 : 22 })}
            <small>${item.label}</small>
          </a>`).join('')}
        <a href="${profileHref}" aria-label="Profil">
          ${userAvatar || socialIcon('user', { size: 22 })}
          <small>Profil</small>
        </a>
      </nav>`;
  }

  const items = [
    { key: 'explore', href: '#/account/explore', label: 'Beranda', icon: 'home' },
    { key: 'discover', href: '#/search', label: 'Jelajah', icon: 'compass' },
    { key: 'create', href: '#/account/compose', label: 'Buat', icon: 'plus' },
    { key: 'reels', href: '#/account/reels', label: 'Reels', icon: 'reels' },
  ];

  return `
    <nav class="ua-mobile-nav pl-social-mobile-nav" aria-label="Navigasi utama">
      ${items.map(item => `
        <a class="${item.key === 'create' ? 'ua-mobile-create' : active === item.key ? 'active' : ''}"
           href="${item.href}" aria-label="${item.label}">
          ${socialIcon(item.icon, { size: 22 })}
          <small>${item.label}</small>
        </a>`).join('')}
      <a href='#/messages' aria-label='Pesan'>${socialIcon('message', { size: 22 })}<small>Pesan</small></a>
      <a class='${active === 'activity' ? 'active' : ''}' href='#/account/activity' aria-label='Aktivitas'>${socialIcon('bell', { size: 22 })}<small>Aktivitas</small></a>
      <a class="${profileView ? 'active' : ''}" href="${profileHref}" aria-label="Profil">
        ${userAvatar || socialIcon('user', { size: 22 })}
        <small>Profil</small>
      </a>
    </nav>`;
}
