import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('public app download section presents Android and iOS as coming soon without fake store links',async()=>{
 const source=await readFile(new URL('../../src/features/app-download/app-download.js',import.meta.url),'utf8');
 assert.match(source,/Download on the/);
 assert.match(source,/App Store/);
 assert.match(source,/Google Play/);
 assert.match(source,/Untuk iPhone &amp; iPad/);
 assert.match(source,/Untuk perangkat Android/);
 assert.equal((source.match(/Coming soon/g)||[]).length,2);
 const cards=source.slice(source.indexOf('pl-app-download-platforms'));
 assert.doesNotMatch(cards,/<a\\b|<button\\b|href=/i,'Unpublished store listings must not be clickable.');
});

test('guest homepage places the modular app download section after the signup CTA and before footer',async()=>{
 const home=await readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 assert.match(home,/import \\{renderAppDownload\\} from ['"]\\.\\.\\/\\.\\.\\/features\\/app-download\\/app-download\\.js['"]/);
 const cta=home.indexOf('class="pl-public-join"');
 const download=home.indexOf('${renderAppDownload()}');
 const footer=home.indexOf('<footer class="pl-social-footer">');
 assert.ok(cta>=0&&download>cta&&footer>download,'Download section must sit after join CTA and before the public footer.');
});
