import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutPresets, getLayoutPreset } from '../../src/design-system/layouts/presets.js';
import { searchBarRegistry, getSearchBar } from '../../src/design-system/components/search-bar/registry.js';
import { logoRegistry, getLogoAsset } from '../../src/design-system/assets/logo-registry.js';
import { pageLayoutRegistry } from '../../src/pages/page-layout-registry.js';

test('all layout presets resolve to named shared geometry', () => {
  for (const id of ['content','standard','fullWidth','hybrid','reading','workspace','immersive']) assert.ok(layoutPresets[id]);
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
  for (const page of Object.values(pageLayoutRegistry)) assert.ok(known.has(page.layout));
  assert.ok(pageLayoutRegistry.publicHome);
  assert.ok(pageLayoutRegistry.reels);
  assert.ok(pageLayoutRegistry.inbox);
});

test('route registry covers canonical route families and labels legacy migrations honestly', () => {
  const required = [
    'publicHome','signedInFeed','profile','accountAuth','accountSettings','accountSections',
    'accountPost','accountUser','reels','inbox','inboxSettings','marketplace','storefront',
    'marketProduct','marketCart','checkout','marketOrders','marketOrder','seller','directory',
    'placeDetail','placeClaim','trip','tripItinerary','discoverySearch','blog','publicBlog',
    'blogStudio','help','legal','misc','adminModeration'
  ];
  for (const key of required) assert.ok(pageLayoutRegistry[key], 'missing route layout: '+key);
  for (const [key,page] of Object.entries(pageLayoutRegistry)) {
    assert.ok(page.owner, key+' must declare an owner');
    assert.ok(page.route, key+' must declare a canonical route');
    assert.ok(['complete','partial','legacy-markup'].includes(page.migration), key+' must declare migration status');
  }
  assert.deepEqual(pageLayoutRegistry.signedInFeed.migration,'legacy-markup');
});

test('search bar registry preserves distinct feature ownership', () => {
  const expected = {
    'home-search-bar':'public-home',
    'social-search-bar':'social',
    'reels-search-bar':'reels',
    'marketplace-search-bar':'marketplace',
    'seller-search-bar':'seller',
    'directory-search-bar':'directory'
  };
  for (const [id,owner] of Object.entries(expected)) assert.equal(searchBarRegistry[id]?.owner,owner);
});

import { readFileSync } from 'node:fs';
import { renderPublicStories } from '../../src/features/public-home/stories.js';

test('public home adopts shared container and a viewport-wide community feed region', () => {
  const source = readFileSync(new URL('../../src/features/public-home/layout.js', import.meta.url), 'utf8');
  assert.match(source, /class="pl-public-shell plds-container"/);
  assert.match(html, /class="pl-public-feed-region plds-section--full-bleed"/);
  assert.match(html, /id="pl-public-feed"/);
  assert.ok(html.indexOf('pl-public-feed-region') > html.indexOf('pl-public-story-feature'));
});

test('public community feed region is outside the constrained stories section', () => {
  const html = renderPublicStories(id => '/images/'+id);
  assert.match(html, /<\/section><section class="pl-public-feed-region/);
  assert.match(html, /aria-label="Postingan publik komunitas"/);
});

test('editorial route registry includes article deep links handled by the router', () => {
  assert.match(pageLayoutRegistry.blog.route, /#\/article\/:slug/);
});

test('Inbox adopts the shared wide container and workspace geometry tokens', () => {
  const inboxSource = readFileSync(new URL('../../src/pages/messages/index.js', import.meta.url), 'utf8');
  const inboxCss = readFileSync(new URL('../../src/pages/messages/messages.css', import.meta.url), 'utf8');
  assert.match(inboxSource, /pl-msg-content plds-container plds-container--wide/);
  assert.match(inboxCss, /--pl-layout-workspace-max:1120px/);
  assert.match(inboxCss, /width:min\(var\(--pl-layout-workspace-max,1120px\),100%\)/);
});
