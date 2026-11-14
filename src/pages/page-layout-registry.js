/* Canonical route families and required layout presets.
 * Aliases are intentionally excluded; see PAGE-ROUTE-AND-SECTION-REGISTRY.md.
 */
export const pageLayoutRegistry = Object.freeze({
  publicHome:{ route:'#/', owner:'pages/home', experience:'public', layout:'hybrid', sections:['header','hero-search','discovery','nearby','stories','public-feed','marketplace-preview','join','footer'] },
  signedInFeed:{ route:'#/account/explore', owner:'pages/account', experience:'social', layout:'hybrid', sections:['social-header','stories','feed-controls','post-feed','social-navigation'] },
  profile:{ route:'#/@username', owner:'pages/account', experience:'social', layout:'standard', sections:['social-header','profile-cover','profile-identity','profile-tabs','profile-content'] },
  reels:{ route:'#/account/reels', owner:'pages/account', experience:'social-immersive', layout:'immersive', sections:['reels-search','media-viewer','creator-meta','action-rail','comments-sheet'] },
  inbox:{ route:'#/inbox', owner:'pages/messages', experience:'inbox', layout:'workspace', sections:['inbox-header','conversation-list','conversation-panel','composer'] },
  marketplace:{ route:'#/marketplace', owner:'pages/marketplace', experience:'marketplace', layout:'content', sections:['marketplace-header','marketplace-search','categories','catalog'] },
  storefront:{ route:'#/shop/:slug', owner:'pages/marketplace', experience:'marketplace', layout:'content', sections:['store-header','store-profile','store-search','product-grid'] },
  checkout:{ route:'#/market-checkout', owner:'pages/marketplace', experience:'checkout', layout:'reading', sections:['checkout-progress','contact-form','delivery','payment','order-summary'] },
  seller:{ route:'#/seller', owner:'pages/seller', experience:'seller', layout:'workspace', sections:['seller-navigation','seller-header','seller-dashboard'] },
  directory:{ route:'#/places', owner:'pages/directory', experience:'directory', layout:'content', sections:['directory-header','directory-search','filters','results'] },
  trip:{ route:'#/trip', owner:'pages/trip', experience:'trip', layout:'content', sections:['trip-header','trip-search','itineraries','service-requests'] },
  blog:{ route:'#/blog', owner:'pages/blog', experience:'editorial', layout:'reading', sections:['editorial-header','article-list'] },
  help:{ route:'#/help', owner:'pages/help', experience:'help', layout:'reading', sections:['help-header','topic-navigation','article-content'] },
  blogStudio:{ route:'#/account/blog', owner:'pages/blog-studio', experience:'blog-studio', layout:'workspace', sections:['studio-navigation','editor','preview'] },
  adminModeration:{ route:'#/admin/moderation', owner:'pages/admin', experience:'admin', layout:'workspace', sections:['admin-navigation','moderation-queue','review-panel'] }
});
