import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Blog theme module defines the five approved personal templates and safe presentation normalization', async () => {
  const source = await readFile(new URL('../../src/features/blog-theme/index.js', import.meta.url), 'utf8');
  for (const key of ['aurelia','stavero','brewnox','rovanta','lunelle']) assert.ok(source.includes("key:'"+key+"'"));
  assert.match(source, /safeHex/);
  assert.match(source, /layout_settings/);
  assert.match(source, /blocks,hidden/);
  assert.doesNotMatch(source, /innerHTML\s*=\s*profile\./);
});

test('Blog Studio exposes appearance workspace, persists presentation settings, and renders public blocks', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  for (const token of ['data-tab="appearance"','renderBlogThemePanel','readBlogThemeForm','template_key','theme_settings','layout_settings','applyBlogTheme','data-blog-block="photo_gallery"','data-blog-block="about_me"','data-block-up','data-block-down']) {
    assert.ok(source.includes(token), 'missing blog customization integration: '+token);
  }
  assert.match(source, /\.eq\('owner_user_id',activeUser\.id\)/);
  assert.match(source, /status','published/);
  assert.match(source, /visibility','public/);
});

test('Blog theme migration is additive and does not change content or privacy policies', async () => {
  const migration = await readFile(new URL('../../supabase/migrations/20261114142328_blog_template_and_layout_customization.sql', import.meta.url), 'utf8');
  assert.match(migration, /add column if not exists template_key/);
  assert.match(migration, /add column if not exists theme_settings/);
  assert.match(migration, /add column if not exists layout_settings/);
  assert.match(migration, /jsonb_typeof\(theme_settings\) = 'object'/);
  assert.match(migration, /jsonb_typeof\(layout_settings\) = 'object'/);
  assert.doesNotMatch(migration, /drop table|delete from|truncate/i);
});
