import { socialIcon } from '../common/social-icons.js';

export function renderSocialHeader({ active = 'explore', profileView = false, user, profile, userAvatar = '' } = {}) {
  const profileHref = user
    ? '#/@' + encodeURIComponent(profile?.username || '')
    : '#/account/login';

  return `
    <header class="ua-header pl-social-header">
      <a class="ua-brand" href="#/account/explore">PLUITS<span>INDONESIA</span></a>
      <nav aria-label="Navigasi Pluits">
        <a class="${active === 'explore' ? 'active' : ''}" href="#/account/explore">Beranda</a>
        <a href="#/places">Tempat</a>
        <a href="#/marketplace">Marketplace</a>
        <a href="#/trip">Trip</a>
        <a class="${active === 'reels' ? 'active' : ''}" href="#/account/reels">Reels</a>
        <a class="${active === 'activity' ? 'active' : ''}" href="#/account/activity">Aktivitas</a>
        <a class="${profileView ? 'active' : ''}" href="#/account/profile">Profil</a>
      </nav>
      <a class="ua-header-profile" href="${profileHref}" aria-label="Buka profil saya">${userAvatar}</a>
      <a class="ua-header-create" href="#/account/compose" aria-label="Buat postingan">＋</a>
    </header>`;
}

export function renderSocialMobileNav({ active = 'explore', profileView = false, user, profile, userAvatar = '' } = {}) {
  const profileHref = user
    ? '#/@' + encodeURIComponent(profile?.username || '')
    : '#/account/login';

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
      <a class="${profileView ? 'active' : ''}" href="${profileHref}" aria-label="Profil">
        ${userAvatar}
        <small>Profil</small>
      </a>
    </nav>`;
}
