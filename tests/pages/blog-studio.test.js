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
  const migration = await readFile(new URL('../../supabase/migrations/20261114100000_allow_free_user_blog_profiles.sql', import.meta.url), 'utf8');
  assert.match(migration, /drop policy if exists "Premium users create their blog profile"/);
  assert.match(migration, /with check \(\(select auth\.uid\(\)\) = owner_user_id\)/);
});
