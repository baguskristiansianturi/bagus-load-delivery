import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('layout foundation exposes a consistent page composition vocabulary', () => {
  const css = readFileSync(new URL('../../src/design-system/layouts/foundation.css', import.meta.url), 'utf8');
  for (const selector of ['.plds-page', '.plds-container', '.plds-section', '.plds-page-header', '.plds-stack', '.plds-cluster', '.plds-grid', '.plds-surface', '.plds-icon-button']) {
    assert.ok(css.includes(selector), 'Missing layout primitive: ' + selector);
  }
  assert.match(css, /minmax\(0, 1fr\)/);
  assert.match(css, /max-width: 760px/);
  assert.match(css, /max-width: 420px/);
});
