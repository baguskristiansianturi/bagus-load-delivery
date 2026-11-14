/* PLUITS asset warehouse — repository-owned assets only.
 * External assets require product-owner approval and a license record before entry.
 */
export const assetRegistry = Object.freeze({
  icons: Object.freeze({
    general: Object.freeze({ path:'src/design-system/icons/registry.js', names:Object.freeze(['search','heart','cart','user','location','chevron','arrow','menu','truck','check','star','app']) }),
    social: Object.freeze({ path:'src/design-system/icons/social-registry.js', names:Object.freeze(['search','heart','heart-crack','pluits-like','pluits-comment','pluits-share','pluits-mark','comment','send','bookmark','more','camera','image','radio','edit','plus','home','compass','reels','user','bell','message','settings','shield','globe','map-pin','store','briefcase','users','shopping-bag','shopping-cart','wallet','help','book','lock','logout']) }),
    application: Object.freeze({ path:'src/design-system/icons/app-registry.js', names:Object.freeze(['location','truck','store','box','menu','search','cart','heart','back','arrow','user','check']) }),
    sprite: Object.freeze({ path:'public/icons.svg', names:Object.freeze(['bluesky-icon','discord-icon','documentation-icon','github-icon','social-icon','x-icon']) })
  }),
  brand: Object.freeze([
    Object.freeze({ id:'brand.pluits.logo', path:'public/assets/brand/pluits-logo.svg', format:'svg', role:'primary-brand-mark' }),
    Object.freeze({ id:'brand.pluits.favicon', path:'public/favicon.svg', format:'svg', role:'favicon', review:'Confirm whether byte-identical logo is intentional before replacement' })
  ]),
  imagery: Object.freeze([
    Object.freeze({ id:'image.hero.primary', path:'src/assets/hero.png', format:'png', role:'hero-image' })
  ]),
  fonts: Object.freeze({ localFilesFound:false, policy:'Use system UI stack until a locally licensed font is approved and bundled; do not add a remote font request implicitly.' })
});
export function findIconAsset(name) {
  return Object.entries(assetRegistry.icons)
    .filter(([kind, entry]) => kind !== 'sprite' && entry.names.includes(name))
    .map(([kind, entry]) => ({ kind, path: entry.path, name }));
}
