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

test('public home loads the real navigation layer and exposes visible mobile icons',async()=>{
 const main=await readFile(new URL('../../src/main.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../styles/home-layout.css',import.meta.url),'utf8');
 assert.ok(main.includes("import './styles/social-navigation.css'"),'Shared navigation stylesheet must be loaded from the application entry point.');
 assert.ok(css.includes('.pl-public-home>.pl-social-header'),'Public header must have an explicit visible layout.');
 assert.ok(css.includes('.pl-public-home .pl-social-mobile-nav>a .pl-icon'),'Public mobile navigation SVG icons must have explicit dimensions and visibility.');
 assert.ok(css.includes('.pl-public-home .pl-public-hero-visual{order:-1}'),'Mobile public home must lead with imagery rather than a wall of text.');
});
test('GeoDirectory is map-first with a touch-enabled globe and clickable real place pins',async()=>{
 const directory=await readFile(new URL('../../src/pages/directory/index.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../src/pages/directory/directory.css',import.meta.url),'utf8');
 assert.ok(directory.includes("import('https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.mjs')"),'MapLibre v6 must load through its supported ESM CDN entry.');
 assert.ok(directory.includes("projection:{type:'globe'}"),'GeoDirectory must use a globe projection.');
 assert.ok(directory.includes('touchZoomRotate:true') && directory.includes('dragRotate:true'),'Map must support touch zoom/rotation and map rotation.');
 assert.ok(directory.includes("new lib.Marker") && directory.includes("new lib.Popup"),'Directory results must render tappable pins with place details.');
 assert.ok(directory.includes('data-map-globe="pl-directory-map"'),'Directory must expose a control to zoom out to the globe.');
 assert.ok(directory.includes('pl-directory-map-stage'),'The map must be the default primary directory surface.');
 assert.ok(css.includes('.pl-directory-page .pl-geo-pin'),'Place pins must have a visible, high-contrast marker style.');
});
