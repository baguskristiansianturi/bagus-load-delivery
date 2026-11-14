import test from 'node:test';
import assert from 'node:assert/strict';
import { assetRegistry, findIconAsset } from '../../src/design-system/assets/registry.js';

test('asset warehouse inventories all local icon sources', () => {
  assert.equal(assetRegistry.icons.general.names.length, 12);
  assert.equal(assetRegistry.icons.social.names.length, 36);
  assert.equal(assetRegistry.icons.application.names.length, 12);
  assert.equal(assetRegistry.icons.sprite.names.length, 6);
  assert.ok(findIconAsset('search').length >= 3);
  assert.equal(findIconAsset('not-in-warehouse').length, 0);
});

test('asset warehouse records local font availability honestly', () => {
  assert.equal(assetRegistry.fonts.localFilesFound, false);
  assert.match(assetRegistry.fonts.policy, /system UI/);
});
