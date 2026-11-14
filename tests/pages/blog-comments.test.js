import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Blog comments use personal account identity and public published-post scope', async () => {
  const migration = await readFile(new URL('../../supabase/migrations/20261114142641_blog_personal_account_comments.sql', import.meta.url), 'utf8');
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  assert.match(migration, /author_user_id uuid not null references auth\.users/);
  assert.match(migration, /p\.status = 'published'/);
  assert.match(migration, /p\.visibility = 'public'/);
  assert.match(migration, /b\.default_visibility = 'public'/);
  assert.match(migration, /author_user_id = \(select auth\.uid\(\)\)/);
  assert.match(source, /from\('blog_comments'\)/);
  assert.match(source, /from\('user_profiles'\)/);
  assert.match(source, /data-blog-reply/);
  assert.match(source, /data-blog-comment-delete/);
});

test('Blog publishing does not create follower-style publication notifications', async () => {
  const migration = await readFile(new URL('../../supabase/migrations/20261114142641_blog_personal_account_comments.sql', import.meta.url), 'utf8');
  assert.doesNotMatch(migration, /create trigger|insert into public\.user_notifications/i);
});
