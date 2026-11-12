import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('route page modules are lazy-loaded instead of statically bundled at app startup',async()=>{
 const source=await readFile(new URL('../../src/app/router.js',import.meta.url),'utf8');
 const home=await readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 const staticPageImports=[...source.matchAll(/^import .* from ['"]\.\.\/pages\/(?!seo\.js)[^'"]+['"];?$/gm)];
 assert.equal(staticPageImports.length,0,'router should not statically import route-level page modules');
 assert.ok((source.match(/import\(['"]\.\.\/pages\//g)||[]).length>=10,'route modules should be loaded on demand');
 assert.doesNotMatch(home,/from ['"]\.\.\/account\/index\.js['"]/,'the public homepage must not eagerly load the signed-in account workspace');
 assert.doesNotMatch(home,/account\/index\.js/,'the public homepage must remain isolated from the signed-in account workspace.');
 const routes=await readFile(new URL('../../src/components/social/navigation-routes.js',import.meta.url),'utf8');
 assert.match(home,/renderPublicNavbar\(\)/,'The root route must render the standalone public homepage with its dedicated guest navbar.');
 assert.match(home,/stillOnRequestedHome/,'A delayed public-home auth lookup must not overwrite a page opened afterward.');
 assert.match(source,/else if\(r==='account'\)/,'The signed-in workspace must be entered only through its explicit account route.');
 assert.match(routes,/home:\s*'#\/account\/explore'/,'The signed-in Beranda destination must be the current Explore workspace.');
});
