import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSocialHeader,renderSocialMobileNav} from '../../src/components/social/navigation.js';
import {ROUTES} from '../../src/components/social/navigation-routes.js';
import {readFile} from 'node:fs/promises';

test('canonical destinations keep home, inbox and profile on separate routes',()=>{
 assert.equal(ROUTES.home,'#/account/explore');
 assert.equal(ROUTES.inbox,'#/messages');
 assert.equal(ROUTES.profile,'#/account/profile');
 assert.notEqual(ROUTES.home,ROUTES.profile);
 assert.notEqual(ROUTES.inbox,ROUTES.profile);
});

test('signed-in social bottom navigation points to the intended pages',()=>{
 const html=renderSocialMobileNav({active:'home',user:{id:'u1'}});
 assert.match(html,/href="#\/account\/explore"[^>]*aria-label="Beranda"/);
 assert.match(html,/href="#\/messages"[^>]*aria-label="Inbox"/);
 assert.match(html,/href="#\/account\/profile"[^>]*aria-label="Profil"/);
});

test('Inbox replaces its fourth slot with notifications but keeps profile separate',()=>{
 const html=renderSocialMobileNav({active:'messages',user:{id:'u1'}});
 assert.match(html,/href="#\/account\/activity"[^>]*aria-label="Notifikasi"/);
 assert.match(html,/href="#\/account\/profile"[^>]*aria-label="Profil"/);
 assert.doesNotMatch(html,/aria-label="Inbox"/);
});

test('shared header does not render a second profile avatar target',()=>{
 const html=renderSocialHeader({active:'profile',profileView:true,user:{id:'u1'}});
 assert.match(html,/href="#\/account\/profile"/);
 assert.doesNotMatch(html,/class="ua-header-profile"/);
});

test('home sidebar activity and create actions use their own canonical destinations',async()=>{
 const source=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 assert.match(source,/href="\$\{ROUTES\.activity\}">♡ <span>Aktivitas/);
 assert.match(source,/href="\$\{ROUTES\.create\}">＋ <span>Buat postingan/);
});

test('profile hero has isolated responsive layouts for desktop, mobile and narrow phones',async()=>{
 const css=await (await import('node:fs/promises')).readFile(new URL('../../src/features/profile/profile-hero.css',import.meta.url),'utf8');
 assert.match(css,/grid-template-columns:112px minmax\(0,1fr\)/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:380px\)/);
});
