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

test('public home layout CSS is owned by the lazy home route, not app bootstrap', () => {
  const main = readFileSync(new URL('../../src/main.js', import.meta.url), 'utf8');
  const home = readFileSync(new URL('../../src/pages/home/index.js', import.meta.url), 'utf8');
  assert.doesNotMatch(main, /styles\/home-layout\.css/);
  assert.doesNotMatch(main, /from ['"]\.\/pages\/home\/index\.js['"]/);
  assert.match(main, /import\(['"]\.\/pages\/home\/index\.js['"]\)/);
  assert.match(home, /styles\/home-layout\.css/);
});

test('application icon registry is the shared design-system source', async () => {
  const { renderIcon } = await import('../../src/design-system/icons/index.js');
  const { icon } = await import('../../src/design-system/icons/app-registry.js');
  assert.ok(icon.store);
  assert.match(renderIcon('store'), /^<svg/);
  assert.match(renderIcon('box'), /viewBox="0 0 24 24"/);
  const appUi = readFileSync(new URL('../../src/app/ui.js', import.meta.url), 'utf8');
  assert.match(appUi, /design-system\/icons\/app-registry\.js/);
  assert.doesNotMatch(appUi, /export const icon\s*=\s*\{/);
});

test('shared typography tokens define the documented roles', () => {
  const css = readFileSync(new URL('../../src/design-system/tokens/foundation.css', import.meta.url), 'utf8');
  for (const token of ['--pl-text-2xl: 28px', '--pl-font-family-ui:', '--pl-line-height-tight:', '--pl-line-height-relaxed:']) {
    assert.ok(css.includes(token), 'Missing typography token: ' + token);
  }
});
