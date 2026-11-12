import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('public app download section presents Android and iOS as coming soon without fake store links',async()=>{
 const source=await readFile(new URL('../../src/features/app-download/app-download.js',import.meta.url),'utf8');
 for (const label of ['Download on the','App Store','Google Play','Untuk iPhone &amp; iPad','Untuk perangkat Android']) assert.ok(source.includes(label),`Missing platform label: ${label}`);
 assert.equal((source.match(/Coming soon/g)||[]).length,2);
 const cards=source.slice(source.indexOf('pl-app-download-platforms'));
 assert.equal(cards.includes('<a '),false,'Unpublished store listings must not be clickable.');
 assert.equal(cards.includes('<button'),false,'Unpublished store listings must not be clickable.');
 assert.equal(cards.includes('href='),false,'Unpublished store listings must not have fake links.');
});

test('guest homepage places the modular app download section after the signup CTA and before footer',async()=>{
 const home=await readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 assert.ok(home.includes("import {renderAppDownload} from '../../features/app-download/app-download.js';"));
 const cta=home.indexOf('class="pl-public-join"');
 const download=home.indexOf('${renderAppDownload()}');
 const footer=home.indexOf('<footer class="pl-social-footer">');
 assert.ok(cta>=0&&download>cta&&footer>download,'Download section must sit after join CTA and before the public footer.');
});
