/* Canonical design-system icon entry point.
 * Existing icon artwork remains the source of truth during the consolidation.
 * New consumers should import from this file, not the legacy common paths.
 */
import { icon as legacyGeneralIcons } from './registry.js';
import { icon as appIcons } from './app-registry.js';
import { socialIcon } from './social-registry.js';

export { socialIcon };

/** Render a repository-owned inline SVG. No external font, CDN or runtime request. */
export function renderIcon(name, { size = 20, className = '' } = {}) {
  const safeSize = Number.isFinite(Number(size)) ? Math.max(12, Math.min(48, Number(size))) : 20;
  const socialMarkup = socialIcon(name, { size: safeSize, className });
  if (socialMarkup) return socialMarkup;

  const legacyMarkup = legacyGeneralIcons[name] || appIcons[name];
  if (!legacyMarkup) return '';
  const classes = ['pl-icon', className].filter(Boolean).join(' ').replace(/["<>]/g, '');
  return legacyMarkup.replace('<svg ', '<svg class="' + classes + '" width="' + safeSize + '" height="' + safeSize + '" ');
}
