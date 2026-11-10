import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('route page modules are lazy-loaded instead of statically bundled at app startup',async()=>{
 const source=await readFile(new URL('../../src/app/router.js',import.meta.url),'utf8');
 const home=await readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 const staticPageImports=[...source.matchAll(/^import .* from ['"]\.\.\/pages\/(?!seo\.js)[^'"]+['"];?$/gm)];
 assert.equal(staticPageImports.length,0,'router should not statically import route-level page modules');
 assert.ok((source.match(/import\(['"]\.\.\/pages\//g)||[]).length>=10,'route modules should be loaded on demand');
});
