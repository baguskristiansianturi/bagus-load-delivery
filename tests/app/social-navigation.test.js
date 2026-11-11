import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSocialHeader,renderSocialMobileNav} from '../../src/components/social/navigation.js';
import {ROUTES} from '../../src/components/social/navigation-routes.js';
import {readFile} from 'node:fs/promises';

test('canonical destinations keep home, inbox and profile on separate routes',()=>{
 assert.equal(ROUTES.home,'#/account/explore');
 assert.equal(ROUTES.inbox,'#/inbox');
 assert.equal(ROUTES.profile,'#/account/profile');
 assert.notEqual(ROUTES.home,ROUTES.profile);
 assert.notEqual(ROUTES.inbox,ROUTES.profile);
});

test('signed-in social bottom navigation points to the intended pages',()=>{
 const html=renderSocialMobileNav({active:'home',user:{id:'u1'}});
 assert.match(html,/href="#\/account\/explore"[^>]*aria-label="Beranda"/);
 assert.match(html,/href="#\/inbox"[^>]*aria-label="Pesan"/);
 assert.match(html,/href="#\/account\/profile"[^>]*aria-label="Profil"/);
});

test('Inbox replaces its fourth slot with notifications but keeps profile separate',()=>{
 const html=renderSocialMobileNav({active:'messages',user:{id:'u1'}});
 assert.match(html,/href="#\/account\/activity"[^>]*aria-label="Notifikasi"/);
 assert.match(html,/href="#\/account\/profile"[^>]*aria-label="Profil"/);
 assert.doesNotMatch(html,/aria-label="Messages"/);
});

test('shared header does not render a second profile avatar target',()=>{
 const html=renderSocialHeader({active:'profile',profileView:true,user:{id:'u1'}});
 assert.match(html,/href="#\/account\/profile"/);
 assert.doesNotMatch(html,/class="ua-header-profile"/);
});

test('public guest home and authenticated create/activity destinations remain separate',async()=>{
 const home=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 const account=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 const routes=await (await import('node:fs/promises')).readFile(new URL('../../src/components/social/navigation-routes.js',import.meta.url),'utf8');
 assert.ok(home.includes("renderSocialHeader({active:'home',publicHome:true})"));
 assert.ok(home.includes("renderSocialMobileNav({active:'home',publicHome:true})"));
 assert.ok(account.includes("href='#/account/compose'") && account.includes("aria-label='Buat postingan'"));
 assert.ok(routes.includes("activity: '#/account/activity'"));
 assert.ok(routes.includes("create: '#/account/create'"));
});
test('profile hero has isolated responsive layouts for desktop, mobile and narrow phones',async()=>{
 const css=await (await import('node:fs/promises')).readFile(new URL('../../src/features/profile/profile-hero.css',import.meta.url),'utf8');
 assert.match(css,/grid-template-columns:112px minmax\(0,1fr\)/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:380px\)/);
});


test('Inbox has a canonical inbox URL and legacy messages links normalize to it',async()=>{
 const router=await (await import('node:fs/promises')).readFile(new URL('../../src/app/router.js',import.meta.url),'utf8');
 assert.ok(router.includes("else if(r==='messages')") && router.includes("location.hash='#/inbox';return;"),'Legacy messages URL must redirect to canonical Inbox.');
 assert.ok(router.includes("else if(r==='inbox')") && router.includes("messagesPage()"),'Canonical Inbox URL must invoke the Inbox page.');
 assert.doesNotMatch(ROUTES.inbox,/messages/);
});

test('Inbox imports the shared mobile navigation renderer at runtime',async()=>{
 const source=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/messages/index.js',import.meta.url),'utf8');
 assert.match(source,/import\s*\{\s*renderSocialMobileNav\s*\}\s*from\s*['"]\.\.\/\.\.\/components\/social\/navigation\.js['"]/);
});


test('Inbox requests an isolated five-column navigation layout',async()=>{
 const page=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/messages/index.js',import.meta.url),'utf8');
 const nav=await (await import('node:fs/promises')).readFile(new URL('../../src/components/social/navigation.js',import.meta.url),'utf8');
 const css=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/messages/messages.css',import.meta.url),'utf8');
 assert.match(page,/navClass:'pl-msg-mobile-nav'/);
 assert.match(nav,/navClass = 'pl-home-mobile-nav pl-social-mobile-nav'/);
 assert.match(css,/\.pl-msg \.pl-msg-mobile-nav\{display:grid!important/);
 assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
});
