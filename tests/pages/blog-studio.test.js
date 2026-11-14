import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Blog Studio supports image and video media inside public articles', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(source, /accept="image\/\*,video\/\*/);
  assert.match(source, /uploadBlogSupportingMedia/);
  assert.match(source, /pl-blog-public-support-video/);
  assert.match(source, /supporting_paths/);
});

test('Blog Studio creation does not depend on a Premium entitlement', async () => {
  const [studio, account] = await Promise.all([
    readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../../src/pages/account/index.js', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(studio, /account_feature_entitlements/);
  assert.doesNotMatch(account.slice(account.indexOf('async function createPage()'), account.indexOf('function upgradePage()')), /account_feature_entitlements|PREMIUM/);
});

test('free blog profile RLS migration keeps blog ownership enforced', async () => {
  const migration = await readFile(new URL('../../supabase/migrations/20261114110929_allow_free_user_blog_profiles.sql', import.meta.url), 'utf8');
  assert.match(migration, /drop policy if exists "Premium users create their blog profile"/);
  assert.match(migration, /with check \(\(select auth\.uid\(\)\) = owner_user_id\)/);
});

test('Blog cover and supporting media paths match the database owner-path constraint', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(source, /activeUser\.id\s*\+\s*'\/blog\/'/);
  assert.doesNotMatch(source, /activeUser\.id\s*\+\s*'\/blogs\/'/);
});

test('Blog editor enforces 1200 words and exposes basic rich-text tools', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(source, /MAX_BODY_WORDS=1200/);
  assert.match(source, /pl-blog-body-editor/);
  assert.match(source, /data-format="bold"/);
  assert.match(source, /data-format="italic"/);
  assert.match(source, /data-format="underline"/);
  assert.match(source, /data-action="insert-caption"/);
  assert.match(source, /data-blog-pending-index/);
});

test('Blog editor allows categories to be created from the writing screen', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(source, /add-category-inline/);
  assert.match(source, /blog_categories.*insert/);
});

test('Blog editor does not impose a fixed 15-item supporting media limit', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Maksimal 15 media/);
  assert.match(source, /Sisipkan foto atau video/);
});

test('Blog cover has adjustable client-side crop controls', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(source, /pl-blog-crop-x/);
  assert.match(source, /pl-blog-crop-y/);
  assert.match(source, /apply-cover-crop/);
  assert.match(source, /canvas\.toBlob/);
});
