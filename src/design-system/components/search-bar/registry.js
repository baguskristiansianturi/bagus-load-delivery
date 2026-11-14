/* Search bar variants share geometry; owners configure behavior and content. */
const shared = Object.freeze({
  height:'var(--pl-search-height, 44px)',
  iconSize:'var(--pl-icon-md, 20px)',
  radius:'var(--pl-radius-lg, 16px)',
  textSize:'var(--pl-text-body, 15px)',
  touchTarget:'var(--pl-touch-target, 44px)'
});
export const searchBarRegistry = Object.freeze({
  'home-search-bar': Object.freeze({ id:'home-search-bar', owner:'public-home', ...shared, behavior:'public-discovery' }),
  'social-search-bar': Object.freeze({ id:'social-search-bar', owner:'social', ...shared, behavior:'people-and-content' }),
  'reels-search-bar': Object.freeze({ id:'reels-search-bar', owner:'reels', ...shared, behavior:'video-user-topic-discovery' }),
  'marketplace-search-bar': Object.freeze({ id:'marketplace-search-bar', owner:'marketplace', ...shared, behavior:'product-catalog-search' }),
  'seller-search-bar': Object.freeze({ id:'seller-search-bar', owner:'seller', ...shared, behavior:'seller-data-search' }),
  'directory-search-bar': Object.freeze({ id:'directory-search-bar', owner:'directory', ...shared, behavior:'place-provider-search' })
});
export function getSearchBar(id) { return searchBarRegistry[id] || null; }
