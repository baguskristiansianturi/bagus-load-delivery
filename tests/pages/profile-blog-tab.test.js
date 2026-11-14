import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Profile content tabs expose Feed, Reels, Trip and Blog with consistent SVG icons', async () => {
  const source = await readFile(new URL('../../src/pages/account/index.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../../src/pages/account/user-account.css', import.meta.url), 'utf8');
  for (const tab of ['posts', 'reels', 'trip', 'blog']) assert.match(source, new RegExp('data-profile-tab="' + tab + '"'));
  assert.match(source, /<svg viewBox="0 0 24 24" aria-hidden="true">/);
  assert.match(source, /async function profileBlogMarkup\(\)/);
  assert.match(source, /blog_public_routes/);
  assert.match(source, /Kunjungi Blog/);
  assert.doesNotMatch(source, /data-profile-tab="tagged"/);
  assert.match(css, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/);
  assert.match(css, /ua-profile-blog-card/);
});
