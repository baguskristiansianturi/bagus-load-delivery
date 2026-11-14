import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Public blog homepage renders an editorial hero, category carousel, author and Pluits credit', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../../src/pages/blog-studio/blog-studio.css', import.meta.url), 'utf8');
  for (const token of ['pl-blog-public-hero', 'pl-blog-category-carousel', 'pl-blog-author', 'pl-blog-public-footer', 'Didukung oleh']) {
    assert.ok(source.includes(token), 'missing public blog element: ' + token);
  }
  assert.match(source, /blog_categories/);
  assert.match(source, /data-blog-filter/);
  assert.match(css, /\.pl-blog-public-hero/);
  assert.match(css, /@media\(max-width:760px\)/);
});

test('Public article page includes author, publication date, share, related and recommended articles', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  for (const token of ['pl-blog-article-meta', 'pl-blog-author', 'data-share-blog', 'Artikel terkait', 'Rekomendasi lainnya']) {
    assert.ok(source.includes(token), 'missing article feature: ' + token);
  }
  assert.match(source, /status','published/);
  assert.match(source, /visibility','public/);
  assert.match(source, /owner_user_id',blog\.owner_user_id/);
});

test('Blog owner can choose featured hero article and public article ordering', async () => {
  const source = await readFile(new URL('../../src/pages/blog-studio/index.js', import.meta.url), 'utf8');
  const migration = await readFile(new URL('../../supabase/migrations/20261114190000_blog_public_presentation_settings.sql', import.meta.url), 'utf8');
  assert.match(source, /name="publicPostOrder"/);
  assert.match(source, /name="featuredPostId"/);
  assert.match(source, /public_post_order:v\.publicPostOrder/);
  assert.match(source, /featured_post_id:v\.featuredPostId/);
  assert.match(migration, /public_post_order/);
  assert.match(migration, /featured_post_id/);
  assert.match(migration, /check \(public_post_order in \('newest','oldest'\)\)/);
});
