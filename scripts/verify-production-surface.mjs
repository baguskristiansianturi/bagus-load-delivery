import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { renderSocialHeader, renderSocialMobileNav } from '../src/components/social/navigation.js';
import { getMediaMime, getMediaExtension, validateMediaFile } from '../src/features/media/media-types.js';

const read = (path) => readFileSync(path, 'utf8');
const retiredFiles = [
  'src/app/page-factory.js',
  'src/app/services.js',
  'src/app/store.js',
  'src/data/catalog.js',
  'src/data/marketplace.js',
  'src/data/master-data.js',
  'src/counter.js',
  'src/assets/vite.svg',
  'src/assets/javascript.svg',
  'src/pages/auth/index.js',
  'src/pages/logistics/index.js',
  'src/pages/logistics/detail.js',
  'src/pages/material/index.js',
  'src/pages/property/index.js',
  'src/pages/property/detail.js',
  'src/pages/service/index.js',
  'src/pages/service/detail.js',
  'src/pages/promo/index.js',
  'src/pages/not-found/index.js',
  'src/pages/search/index.js',
];

for (const path of retiredFiles) {
  assert.equal(existsSync(path), false, `Retired demo module returned: ${path}`);
}

const androidVideoCases=[[{name:'VID_20261110.mp4',type:'application/octet-stream',size:1024},'video/mp4'],[{name:'VID_20261110.mp4',type:'image/jpeg',size:1024},'video/mp4'],[{name:'clip.m4v',type:'video/x-m4v',size:1024},'video/mp4'],[{name:'clip.mov',type:'video/quicktime',size:1024},'video/quicktime'],[{name:'clip.3gp',type:'',size:1024},'video/3gpp'],[{name:'clip.3g2',type:'application/octet-stream',size:1024},'video/3gpp2'],[{name:'clip.webm',type:'application/octet-stream',size:1024},'video/webm']];
for(const [file,expected] of androidVideoCases){assert.equal(getMediaMime(file),expected,'Android video MIME fallback must use filename extensions.');assert.equal(validateMediaFile(file).valid,true,'Supported mobile video must pass validation.');}
assert.equal(getMediaMime({name:'unknown.bin',type:'application/octet-stream',size:1}),'','Unknown binary files must remain rejected.');
assert.equal(getMediaExtension({name:'camera-no-extension',type:'video/mp4'},'video/mp4'),'mp4','Video files without extensions must receive a valid storage suffix.');
const accountMedia = read('src/pages/account/index.js');
assert.match(accountMedia, /uploadMediaFile\(file,path,mime,\(\)=>\{\}\)/, 'Story and post media must share the resumable upload pipeline.');
assert.match(accountMedia, /\.3gp2/, 'Android file pickers must explicitly accept common 3G2 extensions.');
assert.match(accountMedia, /getMediaExtension\(file,mime\)/, 'Media storage paths must use normalized extensions.');
const storageUploader = read('src/features/media/storage-upload.js');
assert.match(storageUploader, /import\('https:\/\/esm\.sh\/tus-js-client@4\.3\.1'\)/, 'TUS must load lazily so CDN failure cannot prevent the social module from loading.');
assert.match(storageUploader, /if\(!TusUpload\)/, 'Large-file upload must have a fallback when the TUS module CDN is unavailable.');
const mediaReadMigration = read('supabase/migrations/20261110115836_allow_post_media_storage_reads.sql');
assert.match(mediaReadMigration, /from public\.post_media pm/, 'Storage read policies must authorize media linked through post_media, not only the legacy first-media column.');

assert.equal(validateMediaFile({name:'large.mp4',type:'video/mp4',size:51*1024*1024}).reason,'too-large','The Free storage limit must be enforced.');
const router = read('src/app/router.js');
for (const retiredImport of ['page-factory.js', '../app/services.js', '../app/store.js', '../data/catalog.js', '../data/marketplace.js', '../data/master-data.js', '../pages/auth/index.js']) {
  assert.equal(router.includes(retiredImport), false, `Router references retired module: ${retiredImport}`);
}

const runtimeFiles = ['index.html', ...['src/app/router.js', 'src/main.js', 'src/pages/account/index.js', 'src/pages/home/index.js', 'src/pages/marketplace/index.js', 'src/pages/trip/index.js']];
for (const path of runtimeFiles) {
  const content = read(path);
  for (const legacyMarker of ['bld_user_v1', 'bld_cart_v1', 'AKUN BAGUS', 'Bali Bagus']) {
    assert.equal(content.includes(legacyMarker), false, `Legacy demo identity found in ${path}: ${legacyMarker}`);
  }
}

const marketplace = read('src/pages/marketplace/index.js');
assert.match(marketplace, /public_marketplace_products/, 'Marketplace catalog must read the backend catalog view.');
assert.match(marketplace, /place_marketplace_order/, 'Marketplace checkout must create orders through the backend RPC.');

const trip = read('src/pages/trip/index.js');
assert.match(trip, /trip_itineraries/, 'Trip itineraries must persist through the backend.');
assert.match(trip, /request_trip_service/, 'Trip service requests must use the backend lifecycle.');


const messages = read('src/pages/messages/index.js');
assert.match(messages, /postgres_changes/, 'DM inbox must subscribe to realtime messages.');
assert.match(messages, /client_message_id/, 'DM outbox must use idempotent message identifiers.');
assert.match(messages, /flushOutbox/, 'DM outbox must retry queued messages after connectivity returns.');
assert.match(messages, /contactsKey/, 'DM contacts must be cached for offline access.');
assert.match(messages, /openDraftConversation/, 'A new DM can be drafted offline from a cached contact.');
assert.match(messages, /recipient_user_id/, 'Offline new-conversation drafts must resolve their recipient when reconnecting.');
assert.match(messages, /pl-msg-menu-toggle/, 'Inbox header must expose the requested three-dot settings menu.');
assert.match(messages, /pl-msg-head-search/, 'Inbox header must keep friend search in the center.');
assert.match(messages, /renderSocialMobileNav\(\{active:'messages'/, 'Inbox must reuse the canonical social navigation component.');
assert.match(messages, /data-inbox-tab="primary"/, 'Inbox must expose the Primary category.');
assert.match(messages, /data-inbox-tab="requests"/, 'Inbox must expose the Requests category.');
assert.match(messages, /data-inbox-tab="blocked"/, 'Inbox must expose the Blocked category.');
assert.match(messages, /Cari berdasarkan nama atau nama pengguna/, 'Inbox header search must be discoverable.');
assert.match(messages, /display_name\.ilike/, 'Inbox search must match display names as well as usernames.');
assert.match(messages, /classList\.toggle\('has-many'/, 'Online carousel must switch to partial overlap for larger friend sets.');


const accountSettings = read('src/pages/account/security-settings.js');
assert.match(accountSettings, /auth\.mfa\.enroll/, 'Account settings must provide authenticator enrollment.');
assert.match(accountSettings, /auth\.updateUser\(\{password/, 'Account settings must support password updates.');
assert.match(accountSettings, /verifyOtp/, 'Account settings must verify phone ownership.');
assert.match(accountSettings, /preferred_language/, 'Account language preference must persist.');
assert.match(accountSettings, /visibility/, 'Account privacy setting must persist.');

const navigation = read('src/components/social/navigation.js');
assert.match(navigation, /ROUTES\.inbox|ROUTES\.activity/, 'Social navigation must consume the canonical route registry.');
assert.match(navigation, /getRoute\('inbox'/, 'Inbox destinations must resolve through the canonical route registry.');
assert.match(navigation, /label: 'Pesan'/, 'Mobile bottom navigation must label the messaging destination Pesan.');
assert.match(navigation, /label: 'Notifikasi'/, 'Inbox context must replace its own bottom slot with notifications.');
assert.match(navigation, /label: 'Profil'/, 'Profile must remain the fifth mobile destination.');
assert.match(navigation, /pl-create-orb/, 'The center Create action must have a dedicated visual treatment.');
assert.doesNotMatch(navigation, /label: 'Reels'/, 'Reels must be created from the central Create action, not consume a navigation slot.');

const signedInHeader = renderSocialHeader({ active: 'explore', user: { id: 'test-user' }, profile: {}, userAvatar: '<span>U</span>', notificationCount: 3 });
const signedInMobileNav = renderSocialMobileNav({ active: 'explore', user: { id: 'test-user' }, profile: {}, userAvatar: '<span>U</span>', notificationCount: 3 });
const publicMobileNav = renderSocialMobileNav({ active: 'home', publicHome: true });
assert.match(signedInHeader, /href="#\/account\/profile"/, 'Header avatar must open the signed-in profile.');
assert.match(signedInMobileNav, /href="#\/inbox"/, 'Rendered signed-in mobile navigation must expose Inbox.');
assert.match(signedInMobileNav, /<small>Profil<\/small>/, 'Profile must be the fifth bottom-navigation destination.');
assert.equal((signedInMobileNav.match(/<a class=/g) || []).length, 5, 'Signed-in mobile navigation must contain exactly five destinations.');
assert.match(signedInMobileNav, /pl-create-orb/, 'Rendered central Create action must use the dedicated center control.');
const inboxMobileNav = renderSocialMobileNav({ active: 'messages', user: { id: 'test-user' }, notificationCount: 3 });
assert.match(inboxMobileNav, /href="#\/account\/activity"/, 'Inbox context must replace the Inbox slot with notifications.');
assert.match(inboxMobileNav, /pl-mobile-activity/, 'Inbox-context notification item must expose its badge anchor.');
assert.match(inboxMobileNav, />3</, 'Inbox-context notification item must display its unread badge.');
assert.match(inboxMobileNav, /<small>Profil<\/small>/, 'Profile must remain available inside Inbox.');
assert.doesNotMatch(publicMobileNav, /href="#\/inbox"|href="#\/account\/activity"/, 'Public navigation must route private destinations through login.');
assert.equal((publicMobileNav.match(/<a class=/g) || []).length, 5, 'Public mobile navigation must keep the same five-slot structure.');
const account = read('src/pages/account/index.js');
assert.match(account, /unreadNotificationCount/, 'Social navigation must receive unread notification count.');
assert.match(account, /refreshUnreadBadge/, 'Realtime social events must refresh the unread badge.');
assert.match(account, /countUnreadActivity/, 'Unread badge must include system announcements as well as social notifications.');
for (const type of ['new_message', 'unfollow', 'system_update']) {
  assert.ok(account.includes(type), `Activity center missing notification type: ${type}`);
}
assert.ok(existsSync('supabase/migrations/20261108135647_pluits_social_realtime_offline_message_queue.sql'));
assert.ok(existsSync('supabase/migrations/20261108140017_pluits_account_language_preference.sql'));
assert.ok(existsSync('supabase/migrations/20261108140823_pluits_system_announcements.sql'));
const moderator = read('src/pages/admin/moderation.js');
assert.match(moderator, /pluits_system_announcements/, 'Moderators must be able to publish Pluits system announcements.');
assert.match(account, /pluits_system_announcement_reads/, 'Users must be able to read and mark system announcements.');


const postActions = read('src/pages/account/index.js');
assert.ok(postActions.includes('data-post-menu'), 'Feed cards must expose the post action menu.');
assert.ok(postActions.includes('data-action="edit"'), 'Owners must have a functional edit-post action.');
assert.ok(postActions.includes('data-action="delete-post"'), 'Owners must have a delete-post action.');
assert.ok(postActions.includes('data-save-post'), 'Post editor must expose a save action.');
assert.match(postActions, /pointerup/, 'Photo posts must support responsive pointer-based double-tap like.');
assert.match(postActions, /toggleLike\(img\.closest/, 'Double-tap must toggle like state on the exact photo that was tapped.');

for (const path of [
  'MASTER/DECISION-LOG.md',
  'SOP/README.md',
  'SOP/PRODUCT-CHANGE-CONTROL.md',
  'SOP/ENGINEERING-DELIVERY.md',
  'SOP/RELEASE-UAT.md',
]) {
  assert.ok(existsSync(path), 'Required project governance document missing: ' + path);
}

const publicHome = read('src/pages/home/index.js');
assert.match(publicHome, /await mountUserAccount\('explore'\)/, 'Signed-in homepage must use the canonical interactive social feed after lazy loading.');
assert.match(publicHome, /if\(viewer\)\{history\.replaceState\(null,'',location\.pathname\+location\.search\+'#\/account\/explore'\);const \{mountUserAccount\}=await import\('\.\.\/account\/index\.js'\);await mountUserAccount\('explore'\);return;\}/, 'Signed-in homepage must lazy-load and canonicalize to the interactive Explore feed.');

const inboxCss = read('src/pages/messages/messages.css');
assert.match(inboxCss, /pl-msg-head-search/, 'Inbox must own a compact top-bar search field.');
assert.match(inboxCss, /pl-msg-inbox-tabs/, 'Inbox categories must have dedicated scoped styling.');
assert.match(inboxCss, /pl-msg-people-strip\.has-many/, 'Large online contact sets must use the compact overlapping carousel.');

const navigationCss = read('src/styles/social-navigation.css');
assert.match(navigationCss, /max-width:\s*760px/, 'Social navigation must retain its mobile layout breakpoint.');
assert.match(navigationCss, /min-width:\s*761px/, 'Social navigation must retain its desktop layout breakpoint.');
assert.match(navigationCss, /safe-area-inset-bottom/, 'Mobile navigation must respect device safe areas.');
assert.match(navigationCss, /:focus-visible/, 'Navigation controls must expose keyboard focus.');
const sharedDesign = read('src/styles/social-components.css');
assert.match(sharedDesign, /--pl-color-ink/, 'Social UI must use shared design tokens.');
assert.match(sharedDesign, /--pl-color-line/, 'Social UI must use shared spacing/line tokens.');

const socialHome = read('src/pages/account/index.js');
const sharedHeader = read('src/components/social/navigation.js');
assert.ok(sharedHeader.includes("getRoute('profile', Boolean(user))"), 'Header avatar must resolve the canonical profile route.');
assert.ok(sharedHeader.includes('pl-social-menu-trigger') && sharedHeader.includes('Pusat Pengaturan') && sharedHeader.includes('ROUTES.settings'), 'Shared account menu must expose the canonical settings route.');
assert.ok(sharedHeader.includes("profileView?'':") && socialHome.includes('ua-profile-menu'), 'Profile settings must be anchored visibly to the profile cover, not duplicated in the global header.');
assert.ok(sharedHeader.includes('showEditProfile') && socialHome.includes("section==='profile'?(parameter==='edit'?'profile-edit':'profile')"), 'Edit profile must only appear in the three-dot menu on the profile view, not throughout settings pages.');
assert.ok(socialHome.includes('function createPage()') && socialHome.includes('function storyComposePage()'), 'Bottom create flow must expose Story/Post/Reel/Live entry selection.');
assert.ok(socialHome.includes("section==='saved'?await savedPage()"), 'Saved items route must be available to the signed-in owner.');
assert.doesNotMatch(socialHome, /<header class='ua-feed-top'>/, 'Signed-in feed must not render a duplicate second header.');
assert.ok(read('src/features/media/storage-upload.js').includes('storage/v1/upload/resumable'), 'Large video uploads must use the Supabase direct-storage TUS endpoint in the isolated storage module.');
assert.ok(socialHome.includes('accept="video/*,.mp4,.m4v,.mov,.webm,.3gp,.3gpp,.3g2,.3gp2"') && socialHome.includes('multiple accept="image/*,video/*,.mp4,.m4v,.mov,.webm,.3gp,.3gpp,.3g2,.3gp2"'), 'Reel picker must request videos only while Post accepts multiple photos and videos, including Android formats.');
assert.ok(socialHome.includes("uploadMediaFile(file,path,mime,()=>{})"), 'Story uploads must use the same resumable media uploader as posts.');
assert.ok(socialHome.includes('let selectedFiles=[]') && socialHome.includes('data-remove-media'), 'Composer must preserve selected files and allow removing individual media.');
assert.ok(socialHome.includes('name="visibility"') && socialHome.includes('class="ua-post-options"'), 'Post audience settings must be available inline in the compact composer.');
assert.ok(socialHome.includes('name="tagged_users"') && socialHome.includes("from('post_tags').insert"), 'Composer must support real account tagging through post_tags.');
assert.ok(socialHome.includes("files.length!==1||!getMediaMime(files[0]).startsWith('video/')"), 'Reel must require exactly one video file using the shared media-type module.');
assert.ok(socialHome.includes('const mediaRecord={media_path:path') && socialHome.includes("storage.from(BUCKET).remove(uploaded.map(media=>media.media_path))"), 'Failed video validation must clean up uploaded objects.');
const composerCss = read('src/styles/social-navigation.css');
assert.ok(composerCss.includes('.ua-clean-composer') && composerCss.includes('.ua-clean-media-item'), 'Composer must use the clean mobile media-picker and preview styles.');


const accountMobileCss = read('src/pages/account/user-account.css');
for (const selector of ['.ua-social-home .ua-stories-block', '.ua-social-home .ua-story-strip', '.ua-social-home .ua-post-head', '.ua-social-app .pl-social-mobile-nav']) {
  assert.ok(accountMobileCss.includes(selector), 'Mobile social layout missing responsive selector: ' + selector);
}
assert.match(accountMobileCss, /@media\s*\(max-width:\s*760px\)/, 'Social home must define a mobile breakpoint.');
assert.ok(accountMobileCss.includes('env(safe-area-inset-bottom)'), 'Social home must account for Android/iOS safe-area insets.');

const discovery = read('src/pages/search/discovery.js');
assert.ok(discovery.includes("renderSocialMobileNav({active:'discover'})"), 'Explore must reuse the shared five-item social navigation.');
assert.ok(discovery.includes('social-navigation.css'), 'Explore must load shared social navigation styles.');
const discoveryCss = read('src/pages/search/discovery.css');
assert.ok(discoveryCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'Explore must use a fluid three-column mobile grid.');
assert.ok(discoveryCss.includes('aspect-ratio: 1 / 1'), 'Explore media tiles must preserve a square responsive ratio.');
assert.match(discoveryCss, /safe-area-inset-bottom/, 'Explore bottom navigation must respect device safe areas.');

const profileSource = read('src/pages/account/index.js');
for (const tab of ['posts', 'reels', 'trip', 'tagged']) {
  assert.ok(profileSource.includes('data-profile-tab="' + tab + '"'), 'Profile must expose the ' + tab + ' tab.');
}
assert.ok(profileSource.includes('trip:\'<div class="ua-profile-tab-empty"'), 'Trip tab must render its own profile panel.');
assert.ok(profileSource.includes('Post/Feed'), 'Profile posts tab must be clearly labelled Post/Feed.');
assert.ok(profileSource.includes('id="ua-profile-form"') && profileSource.includes('function bindProfileMenu()'), 'Personal profile must expose a dedicated editor and functional profile menu.');
assert.ok(profileSource.includes('Simpan perubahan') && profileSource.includes('ua-profile-editor') && profileSource.includes('ua-editor-save'), 'Profile editing must use a dedicated polished editor page with clear save actions.');
assert.ok(profileSource.includes("parameter==='edit'") && profileSource.includes('href="#/account/profile/edit"') && profileSource.includes('ua-profile-menu'), 'Profile editing must open only on its dedicated canonical route from the profile three-dot menu.');
assert.ok(!profileSource.includes('ua-profile-savebar'), 'Profile view must not render a sticky save bar.');
assert.ok(profileSource.includes('validatePersonalUsername') && profileSource.includes('validatePersonalDisplayName'), 'Personal identity must enforce username and display-name rules.');
assert.ok(profileSource.includes(".update(payload).eq('id',user.id).select().single()"), 'Profile save must update the existing profile row and confirm the persisted result without a full remount.');
assert.ok(profileSource.includes('profile={...profile,...payload};paintIdentity(profile)') && profileSource.includes('profile=previous;paintIdentity(previous)'), 'Profile save must feel immediate and roll back optimistic UI if the server rejects the change.');
assert.ok(existsSync('supabase/migrations/20261110091730_enforce_personal_profile_identity_rules.sql'));
assert.ok(existsSync('supabase/migrations/20261110091739_allow_personal_username_separators.sql'));

assert.ok(!profileSource.includes('<div class="ua-section-title"><strong>Postingan</strong><a class="ua-outline" href="#/account/compose">＋ Buat</a></div>'), 'Profile feed must not repeat the Post/Feed label or create action already present in primary navigation.');
assert.ok(profileSource.includes('melalui tombol Buat pada navigasi utama'), 'Empty profile feed should direct users to the primary create navigation.');
const socialNavigationCss = read('src/styles/social-navigation.css');
assert.ok(socialNavigationCss.includes('.pl-social-menu-trigger') && socialNavigationCss.includes('.pl-social-menu-panel') && socialNavigationCss.includes('.ua-profile-editor'), 'Profile editing and settings must share one refined three-dot entry point and a dedicated editor surface.');
assert.ok(!socialNavigationCss.includes('.ua-profile-savebar'), 'Profile edit controls must not be styled as a sticky navbar.');
assert.ok(socialNavigationCss.includes('.ua-social-app .pl-social-mobile-nav > a .ua-avatar'), 'Mobile profile avatar must share the navigation icon sizing rules.');
assert.ok(socialNavigationCss.includes('flex: 0 0 22px'), 'Mobile navigation symbols must use a consistent 22px visual size.');

const profileCss = read('src/pages/account/user-account.css');
assert.ok(profileCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'), 'Profile tabs must align in four equal columns.');
assert.ok(profileCss.includes('height: 142px !important'), 'Mobile profile cover must use a compact hero height.');
assert.ok(profileCss.includes('grid-template-columns: 78px minmax(0, 1fr) !important'), 'Mobile profile identity must use an explicit two-column grid.');
assert.ok(profileCss.includes('min-height: 0 !important'), 'Mobile profile hero must not reserve unnecessary vertical space.');

const postDetailSource = read('src/pages/account/index.js');
assert.ok(postDetailSource.includes('class="ua-post-detail-page"'), 'Post detail must have a responsive detail layout wrapper.');
assert.ok(postDetailSource.includes('class="ua-post-detail-stream"'), 'Post detail must have a dedicated content stream.');
assert.ok(postDetailSource.includes('.ua-post-detail-page .ua-media img'), 'Media normalizer must include opened post detail images.');
assert.ok(postDetailSource.includes('const ratio=isDetail(el)?boundedRatio(w,h):4/5'), 'Feed media frames must use a consistent 4:5 ratio while detail preserves source proportions.');
const postLayoutCss = read('src/pages/account/user-account.css');
assert.ok(postLayoutCss.includes('aspect-ratio: 4 / 5'), 'Feed media must use a consistent responsive frame.');
assert.ok(postLayoutCss.includes('.ua-post-detail-page .ua-media img'), 'Post detail images must have responsive sizing rules.');
assert.ok(postLayoutCss.includes('overflow-y: auto;'), 'Mobile social pages must retain vertical document scrolling.');
assert.ok(postLayoutCss.includes('overflow: visible;'), 'Social feed must not clip vertical content.');
assert.ok(postDetailSource.includes("socialIcon(liked?'heart':'heart-crack',{size:144})"), 'Double-tap must show a prominent heart or cracked-heart feedback based on current like state.');
assert.ok(postDetailSource.includes('setTimeout(()=>overlay.remove(),1550)'), 'Like feedback must remain visible long enough for a smooth animation.');
assert.ok(postDetailSource.includes("const wasLiked=likeButton.classList.contains('is-liked');"), 'Double-tap on an already liked post must allow unlike.');
assert.ok(postLayoutCss.includes('.ua-double-tap-heart.is-removing'), 'Unlike feedback must have a distinct cracked-heart animation.');
assert.ok(postLayoutCss.includes('@keyframes pluits-heart-core') && postLayoutCss.includes('@keyframes pluits-heart-particle'), 'Like feedback must bloom into smaller hearts and fade out.');
assert.match(postLayoutCss, /\.ua-double-tap-heart\{[^}]*inset:0;transform:none!important/, 'Heart overlay must stay centered within the tapped image.');
assert.match(postLayoutCss, /\.ua-heart-core \.pl-icon\{width:144px;height:144px/, 'Main heart feedback must be large enough to see clearly.');
assert.match(postLayoutCss, /pluits-heart-core 1\.18s/, 'Main heart animation must be smooth, not abrupt.');





assert.ok(read('src/main.js').includes("history.replaceState(null, '', location.pathname + location.search + '#/')"), 'Legacy home aliases must normalize to the canonical public home URL.');
assert.ok(read('src/pages/home/index.js').includes("'#/account/explore'"), 'Authenticated users must land on the canonical Explore feed URL.');

assert.ok(read('src/pages/account/index.js').includes('sorted.map(post=>postCard(post)).join(\'\')'),'The home feed must use the defined post-card renderer, not the Reel-only renderer.');
assert.ok(read('src/pages/account/index.js').includes('accept="video/*,.mp4,.m4v,.mov,.webm,.3gp,.3gpp,.3g2,.3gp2"'),'Reel picker must request common Android video formats explicitly.');
assert.ok(read('src/features/reels/reel-card.js').includes('ua-reel-stage'),'Reel card module must own its stage.');
assert.ok(read('src/features/reels/reels.css').includes('aspect-ratio:9/16'),'Reel layout must preserve vertical framing.');
assert.ok(read('src/features/media/storage-upload.js').includes('storage/v1/upload/resumable'),'Media storage upload must be isolated.');
console.log('Production surface verification passed: Android media detection, mobile Reel module, Marketplace, Trip, DM, account and notification contracts.');

const postActionFeature = read('src/features/posts/post-actions.js');
assert.ok(postActionFeature.includes('data-action="like"') && postActionFeature.includes('data-action="comments"') && postActionFeature.includes('data-action="share"') && postActionFeature.includes('data-action="save"'), 'Dedicated post actions must preserve all interaction hooks.');
assert.ok(postActionFeature.includes('pl-post-icon') && !postActionFeature.includes('pluits-like'), 'Post actions must use their own restrained SVG icon set.');
assert.ok(read('src/features/posts/post-actions.css').includes('.pl-post-actions'), 'Post action controls must own their feature-scoped styles.');
assert.ok(read('src/pages/account/index.js').includes('renderPostActions({user,liked:p.liked,likes:p.likes,comments:p.comments,saved:p.saved})'), 'Post cards must delegate action rendering to the post feature module.');
assert.ok(read('src/pages/account/user-account.css').includes('.ua-social-app .ua-post-caption'), 'Post caption spacing must be explicitly compacted.');

import { ROUTES, NAVIGATION_CONTEXTS, getRoute } from '../src/components/social/navigation-routes.js';
assert.equal(ROUTES.inbox, '#/inbox', 'Inbox must have one canonical route.');
assert.equal(ROUTES.profile, '#/account/profile', 'Profile must have one canonical route.');
assert.equal(getRoute('inbox', true), '#/inbox', 'Authenticated Inbox must never route to Profile.');
assert.equal(getRoute('inbox', false), ROUTES.login, 'Anonymous Inbox must route to login.');
assert.deepEqual(NAVIGATION_CONTEXTS.social, ['home','discover','create','inbox','profile']);
assert.deepEqual(NAVIGATION_CONTEXTS.inbox, ['home','discover','create','activity','profile']);
assert.throws(() => getRoute('unknown'), /Unknown PLUITS route/);
