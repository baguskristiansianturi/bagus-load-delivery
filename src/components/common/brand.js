const BRAND_LOGO_SRC = `${import.meta.env.BASE_URL}assets/brand/pluits-logo.png`;

/**
 * Render the canonical PLUITS image mark.
 * The image is the brand asset; this helper never recreates it with text, CSS or SVG.
 */
export function renderBrandLogo({ href = '#/', className = '', size = 40, label = 'Beranda PLUITS' } = {}) {
  const classes = ['pluits-brand-mark', className].filter(Boolean).join(' ');
  return `<a class="${classes}" href="${href}" aria-label="${label}" style="--brand-size:${size}px"><img src="${BRAND_LOGO_SRC}" alt="" width="${size}" height="${size}" decoding="async" fetchpriority="high"></a>`;
}

export { BRAND_LOGO_SRC };
