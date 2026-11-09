import { socialIcon } from '../common/social-icons.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

/** Shared PLUITS identity mark. Keep logo markup in one place for every surface. */
export function renderPluitsLogo({ href = '#/', compact = false, className = '' } = {}) {
  return `<a class="pl-brand-lockup ${esc(className)}" href="${esc(href)}" aria-label="PLUITS — Beranda">
    <span class="pl-brand-symbol" aria-hidden="true">P</span>
    <span class="pl-brand-wordmark">PLUITS${compact ? '' : '<small>INDONESIA</small>'}</span>
  </a>`;
}

export function renderBrandIcon(name, options = {}) {
  return socialIcon(name, options);
}
