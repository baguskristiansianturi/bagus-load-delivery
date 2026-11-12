import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('all app icon references resolve to the one public canonical PLUITS SVG',async()=>{
 const [brand,index,manifest,logo,oldSvg]=await Promise.all([
  readFile(new URL('../../src/components/common/brand.js',import.meta.url),'utf8'),
  readFile(new URL('../../index.html',import.meta.url),'utf8'),
  readFile(new URL('../../public/manifest.webmanifest',import.meta.url),'utf8'),
  readFile(new URL('../../public/assets/brand/pluits-logo.svg',import.meta.url),'utf8'),
  readFile(new URL('../../assets/brand/pluits-logo.svg',import.meta.url),'utf8').catch(()=>null)
 ]);
 assert.match(brand,/BRAND_LOGO_SRC = '\/pluits\/assets\/brand\/pluits-logo\.svg'/);
 assert.match(index,/rel="icon"[^>]+\/pluits\/assets\/brand\/pluits-logo\.svg/);
 assert.match(manifest,/"src": "\/pluits\/assets\/brand\/pluits-logo\.svg"/);
 assert.match(logo,/<svg[\s\S]*<path[\s\S]*#18c8b5[\s\S]*<\/svg>/);
 assert.equal(oldSvg,null,'The old root-level logo copy must not remain in the repository.');
});

test('profile settings menu is rendered as a direct child of each profile card',async()=>{
 const source=await readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../src/pages/account/user-account.css',import.meta.url),'utf8');
 assert.match(source,/function profileMenuMarkup\(\)/);
 assert.ok((source.match(/\$\{profileMenuMarkup\(\)\}/g)||[]).length>=2,'Both profile and preview must render the shared menu.');
 assert.match(source,/href="#\/account\/settings"/);
 assert.match(source,/href="#\/account\/profile\/edit"/);
 assert.match(css,/\.ua-profile-card>\.ua-profile-menu\{position:absolute/);
 assert.match(css,/\.ua-profile-card>\.ua-profile-menu \.pl-social-menu-panel\[hidden\]\{display:none!important\}/);
});
