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

test('app download spacing and tablet layout stay responsive without excess mobile page clearance',async()=>{
 const css=await readFile(new URL('../../src/features/app-download/app-download.css',import.meta.url),'utf8');
 assert.ok(css.includes('@media (min-width:761px) and (max-width:900px)'), 'Tablet layout breakpoint must be present.');
 assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'), 'Tablet store cards must share a balanced two-column row.');
 assert.ok(css.includes('.pl-public-home{padding-bottom:0!important}'), 'Root padding must not duplicate the content clearance.');
 const layout=await readFile(new URL('../../styles/home-layout.css',import.meta.url),'utf8');
 assert.ok(layout.includes('.pl-public-home .pl-public-shell{padding:8px 0 calc(64px + env(safe-area-inset-bottom))}'), 'The homepage content must reserve one controlled clearance for the fixed bottom navigation.');
 assert.ok(css.includes('.pl-public-home .pl-app-download{padding-bottom:0}'), 'The app download section must not add a second navigation-sized blank area; the public shell owns that clearance.');
});


test('public guest homepage keeps a consistent mobile visual rhythm and light interaction states',async()=>{
 const layout=await readFile(new URL('../../styles/home-layout.css',import.meta.url),'utf8');
 assert.ok(layout.includes('--pl-public-space-4:16px'), 'Mobile spacing tokens must use a consistent scale.');
 assert.ok(layout.includes('.pl-public-home .pl-public-section-head h2{font-size:20px;line-height:1.24'), 'Section headings must have a deliberate mobile hierarchy.');
 assert.ok(layout.includes('.pl-public-home .pl-social-mobile-nav>a .pl-icon{width:22px!important;height:22px!important'), 'Mobile navigation icons must share one visual size.');
 assert.ok(layout.includes('.pl-public-category:active'), 'Cards must provide lightweight touch feedback.');
 assert.ok(layout.includes('@media(prefers-reduced-motion:reduce)'), 'Touch feedback must respect reduced-motion preferences.');
});

test('mobile join and download cards have breathing room above the fixed navigation',async()=>{
 const css=await readFile(new URL('../../src/features/app-download/app-download.css',import.meta.url),'utf8');
 const layout=await readFile(new URL('../../styles/home-layout.css',import.meta.url),'utf8');
 assert.ok(layout.includes('.pl-public-home .pl-public-join{margin-bottom:20px}'), 'The join card must be separated from the download card.');
 assert.ok(css.includes('padding-bottom:0}'), 'The download section must end with a normal gap; the shell already reserves navigation clearance.');
});
