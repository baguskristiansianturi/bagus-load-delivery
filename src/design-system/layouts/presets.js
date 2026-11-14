/* Canonical PLUITS layout presets.
 * Presets describe geometry only; page content and feature behavior stay page-owned.
 */
export const layoutPresets = Object.freeze({
  standard: Object.freeze({ id:'standard', className:'plds-page plds-page--content', container:'plds-container', gutter:'tokenized', width:'content' }),
  fullWidth: Object.freeze({ id:'full-width', className:'plds-page plds-page--full-bleed', container:'plds-container plds-container--full', gutter:'none', width:'fluid' }),
  hybrid: Object.freeze({ id:'hybrid', className:'plds-page plds-page--content', container:'plds-container', sectionFullWidth:'plds-section--full-bleed', gutter:'section-defined', width:'mixed' }),
  reading: Object.freeze({ id:'reading', className:'plds-page plds-page--reading', container:'plds-container plds-container--reading', gutter:'tokenized', width:'reading' }),
  workspace: Object.freeze({ id:'workspace', className:'plds-page plds-page--workspace', container:'plds-container plds-container--wide', gutter:'tokenized', width:'workspace' }),
  immersive: Object.freeze({ id:'immersive', className:'plds-page plds-page--full-bleed plds-page--immersive', container:'plds-container plds-container--full', gutter:'none', width:'viewport' })
});
export function getLayoutPreset(id) { return layoutPresets[id] || layoutPresets.standard; }
