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
 assert.match(html,/href="#\/account\/explore"[^>]*aria-label="Circle"/);
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

test('guest root stays public while signed-in root opens the canonical Explore workspace',async()=>{
 const home=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 const account=await (await import('node:fs/promises')).readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 const routes=await (await import('node:fs/promises')).readFile(new URL('../../src/components/social/navigation-routes.js',import.meta.url),'utf8');
 const layout=await (await import('node:fs/promises')).readFile(new URL('../../src/features/public-home/layout.js',import.meta.url),'utf8');
 assert.ok(home.includes('renderPublicHomeLayout('));
 assert.ok(home.includes('bindPublicNavbar()'));
 assert.ok(home.includes("import {renderPublicHomeLayout} from '../../features/public-home/layout.js';"));
 assert.ok(layout.includes("import {renderPublicNavbar} from './navbar.js';")&&layout.includes('renderPublicNavbar()'));
 assert.ok(layout.includes("renderSocialMobileNav({active:'home',publicHome:true})"));
 assert.ok(home.includes('stillOnRequestedHome'),'A delayed public-home auth response must not overwrite a route the visitor opened afterward.');
 assert.ok(home.includes('requestHash')&&home.includes('routeVersion'),'Public-home auth routing must be bound to the original route generation.');
  assert.match(home,/if\(actualViewer&&!guestMode\)/,'A signed-in visitor at the root must be sent to the authenticated workspace.');
  assert.match(home,/location\.hash='#\/account\/explore'/,'Signed-in root must use the canonical Explore route.');
 assert.ok(account.includes('id="ua-story-form"') && account.includes("from('user_stories')"), "Story creation must remain available outside the Explore feed.");
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
 const home=await readFile(new URL('../../src/pages/home/index.js',import.meta.url),'utf8');
 assert.ok(main.includes("import './styles/social-navigation.css'"),'Shared navigation stylesheet must be loaded from the application entry point.');
 const navbarCss=await readFile(new URL('../../src/features/public-home/navbar.css',import.meta.url),'utf8');
 assert.ok(navbarCss.includes('.pl-public-home>.pl-public-navbar'),'Public guest navbar must have one explicit isolated surface.');
 assert.ok(css.includes('.pl-public-home .pl-social-mobile-nav>a .pl-icon'),'Public mobile navigation SVG icons must have explicit dimensions and visibility.');
 const navbar=await readFile(new URL('../../src/features/public-home/navbar.js',import.meta.url),'utf8');
 assert.ok(navbar.includes("const locale=localStorage.getItem('pluits-public-locale')==='en'?'en':'id'")&&navbar.includes('pl-public-flag-id')&&navbar.includes('pl-public-flag-en'),'Guest navbar must default to Indonesian and offer English with rectangular flag controls.');
 assert.ok(!navbar.includes('Daftar')&&!navbar.includes('Sign up'),'Guest navbar must not duplicate registration links already available in bottom navigation.');
 assert.ok(navbar.includes("data-public-action=\"wishlist\"")&&navbar.includes("data-public-action=\"cart\""),'Wishlist and cart must be actionable controls.');
 assert.ok(navbar.includes("location.hash='#/account/login'"),'Opening wishlist or cart as a guest must request login.');
 assert.ok(navbarCss.includes('.pl-public-home>.pl-public-navbar')&&navbarCss.includes('border:0'),'Guest navbar must use one clean surface without borders.');
 assert.ok(home.includes("localStorage.setItem('pluits-guest-wishlist'"),'Guest post saves must persist locally without requiring login.');
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


test('signed-in home leads with Bali experiences, search, wishlist and the personal feed',async()=>{
 const account=await readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 const navigation=await readFile(new URL('../../src/components/social/navigation.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../src/pages/account/user-account.css',import.meta.url),'utf8');
 const topTen=await readFile(new URL('../../src/features/discovery/top-ten-cards.js',import.meta.url),'utf8');
 assert.ok(topTen.includes('Top 10 Trending')&&topTen.includes('ua-topten-grid')&&((topTen.match(/className:'ua-topten-card-/g)||[]).length===10),'Explore must show ten individual trending subjects, not category tiles.');
 assert.ok(account.includes('function bindToptenSlider()')&&account.includes('scheduleAuto(3600)')&&account.includes('pointerdown')&&account.includes('pointerup')&&account.includes('setTimeout(()=>{'),'Mobile Top 10 must rotate automatically, follow direct pointer control and wait before resuming after interaction.');
 assert.ok(account.includes("exploreFilter='all'")&&account.includes("ua-home-following")&&account.includes("['all','Semua']")&&account.includes("['latest','Terbaru']"),'Circle feed must default to all posts and offer latest ordering.');
 assert.ok(account.includes('ua-home-topic-carousel')&&account.includes('ua-home-compose-prompt')&&!account.includes('REKOMENDASI PERSONAL')&&!account.includes('Atur minat')&&!account.includes('Pilih minat'),'Untukmu must show automatic recommendation cards without setup instructions or extra explanatory copy.');
 assert.ok(account.includes('circleHeading+storiesSection+peopleSection+homeHeading'),'Circle hierarchy must place stories, people recommendations, and post controls before the feed.');

 assert.ok(topTen.includes("title:'Beef Slab'")&&topTen.includes("href:'#/places?category=restaurant'"),'Tapping a trending food item must open its matching directory category.');
 const directorySource=await readFile(new URL('../../src/pages/directory/index.js',import.meta.url),'utf8');
 assert.ok(directorySource.includes('params.get(\'category\')')&&directorySource.includes('state.categories.some(x=>x.slug===requested)'),'Directory must activate the category selected by a trending card.');
 assert.ok(!account.includes('"+discoverySection+'),'Home feed must not reference the removed category-card section.');
 assert.ok(!account.includes('BERDASARKAN AKTIVITAS NYATA')&&!account.includes('aktivitas pengguna cukup terkumpul'),'Internal ranking explanations must never appear in visitor-facing copy.');
 assert.ok(navigation.includes('ua-home-searchbar')&&navigation.includes('ua-home-wishlist')&&navigation.includes('ua-home-search-prompt')&&navigation.includes('ua-home-profile')&&navigation.includes('user?ROUTES.profile:ROUTES.login'),'Home header must show search, saved items and a right-side profile/login action.');
 assert.ok(account.includes("startHomeSearchPrompt('Welcome to '+city)")&&account.includes('nominatim.openstreetmap.org/reverse'),'Search prompt must welcome users using their detected current city.');
 assert.ok(account.includes('navigator.geolocation.getCurrentPosition'),'Home must request device location when no current location is available.');
 assert.ok(account.includes('window.__pluitsHomeLocation'),'Detected device location must be kept separate from profile location.');
 assert.ok(account.includes('ua-explore-filters')&&!account.includes(')+trendSection+homeNearbySection()'),'Circle must use sticky post filters; demo-only Top 10 content must not be presented as live trending.');
 assert.ok(account.includes('homeNearbySection')&&account.includes('bindHomeNearby'),'Home must use live nearby results.');
 assert.ok(account.includes('Temukan Lebih Banyak')&&account.includes('Produk Lokal')&&account.includes('Kumpulan')&&account.includes('Layanan PLUITS'),'Home must continue from the 30-post feed into discovery, product recommendations, service collections and PLUITS service filters.');
 assert.ok(account.includes('circleHeading+storiesSection+peopleSection+homeHeading'),'People recommendations must appear after Circle stories and before the post feed.');
 assert.ok(account.includes('.slice(0,30)'),'The signed-in home must cap rendered post hydration at 30 items.');
 assert.ok(topTen.includes('⌖ ')&&topTen.includes('ua-topten-copy')&&topTen.includes('TOP_TEN_DEMO_ITEMS'),'Top 10 cards must be an isolated, explicitly demo-only image presentation module.');
 const nearbySource=await readFile(new URL('../../src/pages/directory/index.js',import.meta.url),'utf8');
 const nearbyCards=await readFile(new URL('../../src/features/discovery/nearby-card.js',import.meta.url),'utf8');
 assert.ok(nearbySource.includes('Di sekitar Anda')&&nearbySource.includes('radius=5000')&&nearbySource.includes('user_post_directory_entities')&&nearbySource.includes('presentSlugs')&&nearbySource.includes('nearbyCategories'),'Nearby categories must be derived from published entities actually returned inside the radius.');
 assert.ok(nearbySource.includes('renderNearbyHeroCard')&&nearbyCards.includes('pl-nearby-item-card'),'Nearby hero cards must use their isolated presentation component.');
 assert.ok(!nearbySource.includes("lat=AREAS.denpasar.lat")&&!nearbySource.includes("'denpasar', radius=15000"),'Nearby discovery must not silently default to Denpasar coordinates.');
 assert.ok(account.includes('enableHighAccuracy:true'),'Home must request precise GPS for accurate nearby distance.');
 const directory=await readFile(new URL('../../src/pages/directory/index.js',import.meta.url),'utf8');
 assert.ok(directory.includes('Tempat terdekat')&&directory.includes('distance(Number(row.distance_m)'),'Nearby places must be displayed as distance cards, not a map.');
 assert.ok(css.includes('.ua-topten-card')&&css.includes('.ua-home-searchbar')&&css.includes('.pl-home-map-chip'),'Experience cards, animated search and nearby cards must have responsive styles.');
 assert.ok(css.includes('scroll-snap-type:x mandatory')&&css.includes('flex:0 0 100%')&&css.includes('max-width:380px'),'Mobile trending slider must fit narrow screens and support swipe snapping.');
 assert.ok(!directory.includes('id="pl-home-nearby-map"'),'Home must not render the GeoDirectory map.');
});


test('profile keeps the three-dot settings menu visible on the profile card on mobile',async()=>{
 const nav=await readFile(new URL('../../src/components/social/navigation.js',import.meta.url),'utf8');
 const account=await readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../src/pages/account/user-account.css',import.meta.url),'utf8');
 assert.ok(nav.includes("${profileView?'':"),'Profile view must not render a duplicate header menu.');
 assert.ok(account.includes('ua-profile-menu')&&account.includes('Pengaturan profil'),'Profile card must contain its own settings trigger.');
 assert.ok(account.includes('Pusat Pengaturan')&&account.includes('Edit profil'),'The three-dot menu must retain both settings destinations.');
 assert.ok(css.includes('.ua-profile-card>.ua-profile-menu{position:absolute'),'Profile menu must be anchored directly to the visible profile card.');
 assert.ok(css.includes('@media(max-width:760px)'),'Profile menu must have a mobile layout rule.');
});

test('Circle feed controls expose all, latest, random and category filtering',async()=>{
 const account=await readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 assert.ok(account.includes("['all','Semua']")&&account.includes("['latest','Terbaru']")&&account.includes("['random','Acak']")&&account.includes('data-explore-category'));
 assert.ok(account.includes("exploreCategory=String(event.currentTarget.value||'all')"));
});

test('Circle header exposes desktop Circle and Jelajah links while retaining mobile bottom navigation',async()=>{
 const nav=await readFile(new URL('../../src/components/social/navigation.js',import.meta.url),'utf8');
 const css=await readFile(new URL('../../src/styles/social-navigation.css',import.meta.url),'utf8');
 assert.ok(nav.includes('ua-home-desktop-nav')&&nav.includes('Circle</a>')&&nav.includes('Jelajah</a>'));
 assert.match(css,/\.ua-social-app \.ua-home-desktop-nav/);
});


test('Circle category filtering normalizes tags with spaces to the same slug as category options',async()=>{
 const account=await readFile(new URL('../../src/pages/account/index.js',import.meta.url),'utf8');
 assert.match(account,/replace\(\/\\s\+\/g,'-'\)===exploreCategory/);
 assert.ok(account.includes("const slug=String(raw||'').toLowerCase().replace(/^#/,'').trim().replace(/\\s+/g,'-')"));
});
