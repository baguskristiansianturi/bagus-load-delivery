import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('resumable upload fingerprints include the destination object path', async () => {
  const source = await readFile(new URL('../../src/features/media/storage-upload.js', import.meta.url), 'utf8');
  assert.match(source, /fingerprint:\(selected,options\)=>Promise\.resolve\(\[options\.endpoint,bucket,path/);
  assert.match(source, /findPreviousUploads\(\)/);
});

test('transient resumable failures clean the scoped path before standard fallback', async () => {
  const source = await readFile(new URL('../../src/features/media/storage-upload.js', import.meta.url), 'utf8');
  assert.match(source, /status>=400&&status<500\)throw error/);
  assert.match(source, /storage\.from\(bucket\)\.remove\(\[path\]\)/);
  assert.match(source, /return standardUpload\(supabase,bucket,path,file,contentType,onProgress\)/);
});
