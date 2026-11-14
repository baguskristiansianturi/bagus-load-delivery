/* Canonical PLUITS route-family layout registry.
 * Route patterns mirror src/app/router.js. Dynamic child routes are listed explicitly.
 * "migration" describes actual markup adoption, not merely preset assignment.
 */
const legacy = 'legacy-markup';
export const pageLayoutRegistry = Object.freeze({
  publicHome:{ route:'#/', owner:'pages/home + features/public-home', experience:'public', layout:'hybrid', migration:'partial', sections:['public-header','hero-search','discovery','nearby','stories','public-feed','marketplace-preview','join','footer'] },
  signedInFeed:{ route:'#/account/explore', owner:'pages/account', experience:'social', layout:'hybrid', migration:'partial', sections:['social-header','stories','feed-controls','post-feed','social-navigation'] },
  profile:{ route:'#/@username', owner:'pages/account', experience:'social', layout:'standard', migration:'partial', sections:['social-header','profile-cover','profile-identity','profile-tabs','profile-content'] },
  accountAuth:{ route:'#/account/auth?mode=:mode', owner:'features/auth + pages/account', experience:'account', layout:'reading', migration:legacy, sections:['auth-brand','auth-form','auth-support'] },
  accountSettings:{ route:'#/account/settings', owner:'pages/account', experience:'account', layout:'workspace', migration:'partial', sections:['account-navigation','settings-sections','settings-form'] },
  accountSections:{ route:'#/account/:section', owner:'pages/account', experience:'account', layout:'standard', migration:'partial', sections:['account-navigation','section-header','section-content'] },
  accountPost:{ route:'#/account/post/:postId', owner:'pages/account', experience:'social', layout:'standard', migration:'partial', sections:['post-detail','comments'] },
  accountUser:{ route:'#/account/user/:username', owner:'pages/account', experience:'social', layout:'standard', migration:'partial', sections:['profile-cover','profile-identity','profile-content'] },
  reels:{ route:'#/account/reels', owner:'pages/account', experience:'social-immersive', layout:'immersive', migration:legacy, sections:['reels-search','media-viewer','creator-meta','action-rail','comments-sheet'] },
  inbox:{ route:'#/inbox', owner:'pages/messages', experience:'inbox', layout:'workspace', migration:'partial', sections:['inbox-header','conversation-list','conversation-panel','composer'] },
  inboxSettings:{ route:'#/inbox/settings', owner:'pages/messages/settings', experience:'inbox-settings', layout:'workspace', migration:legacy, sections:['settings-header','settings-navigation','settings-content'] },
  marketplace:{ route:'#/marketplace', owner:'pages/marketplace', experience:'marketplace', layout:'content', migration:'partial', sections:['marketplace-header','marketplace-search','categories','catalog'] },
  storefront:{ route:'#/shop/:slug', owner:'pages/marketplace', experience:'marketplace', layout:'content', migration:'partial', sections:['store-header','store-profile','store-search','product-grid'] },
  marketProduct:{ route:'#/market-product/:productId', owner:'pages/marketplace', experience:'marketplace-detail', layout:'content', migration:'partial', sections:['product-gallery','product-information','seller-summary','reviews'] },
  marketCart:{ route:'#/market-cart', owner:'pages/marketplace', experience:'cart', layout:'reading', migration:'partial', sections:['cart-items','price-summary','checkout-action'] },
  checkout:{ route:'#/market-checkout', owner:'pages/marketplace', experience:'checkout', layout:'reading', migration:'partial', sections:['checkout-progress','contact-form','delivery','payment','order-summary'] },
  marketOrders:{ route:'#/market-orders', owner:'pages/marketplace', experience:'orders', layout:'standard', migration:'partial', sections:['orders-header','order-filters','order-list'] },
  marketOrder:{ route:'#/market-order/:orderId', owner:'pages/marketplace', experience:'order-detail', layout:'reading', migration:'partial', sections:['order-status','order-items','payment-summary','delivery-details'] },
  seller:{ route:'#/seller', owner:'pages/seller', experience:'seller', layout:'workspace', migration:'partial', sections:['seller-navigation','seller-header','seller-dashboard'] },
  directory:{ route:'#/places', owner:'pages/directory', experience:'directory', layout:'content', migration:'partial', sections:['directory-header','directory-search','filters','results'] },
  placeDetail:{ route:'#/place/:slug', owner:'pages/directory', experience:'place-detail', layout:'content', migration:legacy, sections:['place-header','place-profile','place-information','provider-actions'] },
  placeClaim:{ route:'#/place/:slug/claim', owner:'pages/directory', experience:'place-claim', layout:'reading', migration:legacy, sections:['claim-header','claim-form','verification-information'] },
  trip:{ route:'#/trip', owner:'pages/trip', experience:'trip', layout:'content', migration:'partial', sections:['trip-header','trip-search','itineraries','service-requests'] },
  tripItinerary:{ route:'#/trip/itinerary/:id', owner:'pages/trip', experience:'trip-detail', layout:'reading', migration:'partial', sections:['itinerary-header','day-plan','places','sharing-controls'] },
  discoverySearch:{ route:'#/search?q=:query', owner:'pages/search/discovery', experience:'discovery', layout:'content', migration:'partial', sections:['search-header','search-controls','results'] },
  blog:{ route:'#/blog, #/guides, #/article/:slug', owner:'pages/blog', experience:'editorial', layout:'reading', migration:'partial', sections:['editorial-header','article-list'] },
  publicBlog:{ route:'#/@username/blog/:slug', owner:'pages/blog-studio', experience:'editorial', layout:'reading', migration:legacy, sections:['blog-header','article-content','comments'] },
  blogStudio:{ route:'#/account/blog', owner:'pages/blog-studio', experience:'blog-studio', layout:'reading', migration:'partial', sections:['studio-navigation','editor','preview'] },
  help:{ route:'#/help and #/faq', owner:'pages/help', experience:'help', layout:'reading', migration:'partial', sections:['help-header','topic-navigation','article-content'] },
  legal:{ route:'#/terms, #/privacy, #/guidelines', owner:'pages/help', experience:'legal', layout:'reading', migration:'partial', sections:['legal-header','legal-content'] },
  misc:{ route:'#/promo, #/about, #/contact, #/reviews, #/recent', owner:'pages/misc', experience:'public-information', layout:'reading', migration:'partial', sections:['page-header','page-content'] },
  adminModeration:{ route:'#/admin/moderation', owner:'pages/admin', experience:'admin', layout:'workspace', migration:legacy, sections:['admin-navigation','moderation-queue','review-panel'] }
});

/* Route aliases normalized by router; these are not separate page implementations. */
export const routeAliases = Object.freeze({
  '#/cart':'#/market-cart',
  '#/checkout':'#/market-checkout',
  '#/orders':'#/market-orders',
  '#/order/:id':'#/market-order/:id',
  '#/messages':'#/inbox',
  '#/material':'#/marketplace',
  '#/materials':'#/marketplace',
  '#/provider':'#/places',
  '#/suppliers':'#/places',
  '#/jasa':'#/places',
  '#/logistik':'#/marketplace',
  '#/delivery':'#/marketplace',
  '#/login':'#/account/auth',
  '#/register':'#/account/auth'
});

export const pageLayoutMigrationStatus = Object.freeze({
  complete: [],
  partial: ['publicHome'],
  pending: Object.keys(pageLayoutRegistry).filter(key => pageLayoutRegistry[key].migration === legacy)
});
