/* Semantic logo asset variants; both use the same PLUITS brand identity. */
export const logoRegistry = Object.freeze({
  'logo-mark': Object.freeze({ id:'logo-mark', src:'/assets/brand/pluits-logo.svg', variant:'symbol-only', sizeToken:'--pl-logo-mark-size', usage:['avatar','compact-navigation','app-icon'] }),
  'logo-lockup': Object.freeze({ id:'logo-lockup', src:'/assets/brand/pluits-logo.svg', variant:'symbol-and-wordmark', sizeToken:'--pl-logo-lockup-size', usage:['public-header','footer','brand-introduction'], note:'A dedicated approved lockup artwork is required before rendering symbol plus wordmark as a single asset.' })
});
export function getLogoAsset(id) { return logoRegistry[id] || null; }
