import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderIcon } from '../../src/design-system/icons/index.js';

test('PLUITS structural tokens define the canonical mobile geometry', () => {
  const css = readFileSync(new URL('../../src/design-system/tokens/foundation.css', import.meta.url), 'utf8');
  for (const token of [
    '--pl-layout-mobile-gutter: 16px',
    '--pl-layout-mobile-gutter-compact: 12px',
    '--pl-icon-nav: 22px',
    '--pl-touch-target: 44px',
    '--pl-space-4: 16px'
  ]) assert.ok(css.includes(token), 'Missing token: ' + token);
  assert.match(css, /100dvh/);
  assert.match(css, /safe-area-inset-bottom/);
});

test('design-system icon facade renders repository-owned inline SVG', () => {
  const markup = renderIcon('search');
  assert.match(markup, /^<svg/);
  assert.match(markup, /width="20"/);
  assert.match(markup, /height="20"/);
  assert.doesNotMatch(markup, /https?:\/\//);
});

test('icon facade supports registered social icons at explicit dimensions', () => {
  const markup = renderIcon('heart', { size: 24, className: 'test-icon' });
  assert.match(markup, /width="24"/);
  assert.match(markup, /height="24"/);
  assert.match(markup, /test-icon/);
});
