import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutPresets, getLayoutPreset } from '../../src/design-system/layouts/presets.js';
import { searchBarRegistry, getSearchBar } from '../../src/design-system/components/search-bar/registry.js';
import { logoRegistry, getLogoAsset } from '../../src/design-system/assets/logo-registry.js';
import { pageLayoutRegistry } from '../../src/pages/page-layout-registry.js';

test('all layout presets resolve to named shared geometry', () => {
  for (const id of ['standard','fullWidth','hybrid','reading','workspace','immersive']) assert.ok(layoutPresets[id]);
  assert.equal(getLayoutPreset('unknown').id,'standard');
  assert.match(layoutPresets.fullWidth.className,/full-bleed/);
  assert.equal(layoutPresets.hybrid.id,'hybrid');
});

test('search bar variants have explicit owners and shared geometry tokens', () => {
  for (const [id, item] of Object.entries(searchBarRegistry)) {
    assert.equal(item.id,id);
    assert.ok(item.owner);
    assert.equal(item.height,'var(--pl-search-height, 44px)');
    assert.equal(item.iconSize,'var(--pl-icon-md, 20px)');
  }
  assert.equal(getSearchBar('not-a-search-bar'),null);
});

test('logo variants are semantic and separately sized', () => {
  assert.equal(logoRegistry['logo-mark'].variant,'symbol-only');
  assert.equal(logoRegistry['logo-lockup'].variant,'symbol-and-wordmark');
  assert.notEqual(logoRegistry['logo-mark'].sizeToken,logoRegistry['logo-lockup'].sizeToken);
  assert.equal(getLogoAsset('missing'),null);
});

test('every registered page uses a known canonical layout preset', () => {
  const known = new Set(Object.values(layoutPresets).map(x=>x.id));
  for (const page of Object.values(pageLayoutRegistry)) assert.ok(known.has(page.layout) || page.layout==='content');
  assert.ok(pageLayoutRegistry.publicHome);
  assert.ok(pageLayoutRegistry.reels);
  assert.ok(pageLayoutRegistry.inbox);
});
