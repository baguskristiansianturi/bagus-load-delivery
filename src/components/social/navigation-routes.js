/** Canonical destinations. Navigation UI must never invent shared routes. */
export const ROUTES = Object.freeze({
  publicHome: '#/', home: '#/account/explore', discover: '#/search',
  create: '#/account/create', inbox: '#/messages', activity: '#/account/activity',
  profile: '#/account/profile', login: '#/account/login', contacts: '#/account/followers',
  saved: '#/account/saved', places: '#/places', marketplace: '#/marketplace',
  trip: '#/trip', reels: '#/account/reels', register: '#/account/register',
  settings: '#/account/settings', editProfile: '#/account/profile/edit'
});
export const NAVIGATION_CONTEXTS = Object.freeze({
  social: Object.freeze(['home','discover','create','inbox','profile']),
  inbox: Object.freeze(['home','discover','create','activity','profile']),
  store: Object.freeze(['storeHome','savedProducts','cart','account']),
  checkout: Object.freeze([])
});
const PROTECTED = new Set(['home','create','inbox','activity','profile','contacts','saved','settings','editProfile']);
export function getRoute(name, authenticated = true) {
  if (!Object.hasOwn(ROUTES, name)) throw new Error(`Unknown PLUITS route: ${name}`);
  return !authenticated && PROTECTED.has(name) ? ROUTES.login : ROUTES[name];
}
