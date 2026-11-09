import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

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

const accountSettings = read('src/pages/account/security-settings.js');
assert.match(accountSettings, /auth\.mfa\.enroll/, 'Account settings must provide authenticator enrollment.');
assert.match(accountSettings, /auth\.updateUser\(\{password/, 'Account settings must support password updates.');
assert.match(accountSettings, /verifyOtp/, 'Account settings must verify phone ownership.');
assert.match(accountSettings, /preferred_language/, 'Account language preference must persist.');
assert.match(accountSettings, /visibility/, 'Account privacy setting must persist.');

const navigation = read('src/components/social/navigation.js');
assert.match(navigation, /#\/messages/, 'Social navigation must expose inbox access.');
assert.match(navigation, /#\/account\/activity/, 'Social navigation must expose activity access.');

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
assert.match(postActions, /dblclick/, 'Photo posts must support double-tap/double-click like.');
assert.match(postActions, /toggleLike\(false\)/, 'Double-tap must toggle like state so a second double-tap can unlike.');

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
assert.match(publicHome, /mountUserAccount\('explore'\)/, 'Signed-in homepage must use the canonical interactive social feed.');
assert.match(publicHome, /if\(viewer\)\{mountUserAccount\('explore'\);return;\}/, 'Guest feed must not render a duplicate interactive experience for signed-in users.');

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
assert.ok(sharedHeader.includes("aria-label='Notifikasi'") && sharedHeader.includes("socialIcon('bell', { size: 21 })"), 'Shared social header must render the notification bell.');
assert.ok(sharedHeader.includes("aria-label='Kontak dan koneksi'") && sharedHeader.includes("socialIcon('users', { size: 21 })"), 'Shared social header must render Contacts.');
assert.ok(sharedHeader.includes("aria-label='Wishlist dan tersimpan'") && sharedHeader.includes("socialIcon('bookmark', { size: 21 })"), 'Saved items shortcut must be available privately.');
assert.ok(sharedHeader.includes("aria-label='Pengaturan'") && sharedHeader.includes("#/account/settings"), 'Settings must have one clear header entry point.');
assert.ok(socialHome.includes('function createPage()') && socialHome.includes('function storyComposePage()'), 'Bottom create flow must expose Story/Post/Reel/Live entry selection.');
assert.ok(socialHome.includes("section==='saved'?await savedPage()"), 'Saved items route must be available to the signed-in owner.');
assert.doesNotMatch(socialHome, /<header class='ua-feed-top'>/, 'Signed-in feed must not render a duplicate second header.');
assert.ok(socialHome.includes("endpoint:'https://ytndswhqxayqpftszwfh.storage.supabase.co/storage/v1/upload/resumable'"), 'Large video uploads must use the Supabase direct-storage TUS endpoint.');
assert.ok(socialHome.includes('multiple accept="image/*,video/*"'), 'Composer must allow selecting multiple photos and videos.');
assert.ok(socialHome.includes('let selectedFiles=[]') && socialHome.includes('data-remove-media'), 'Composer must preserve selected files and allow removing individual media.');
assert.ok(socialHome.includes('name="visibility"') && socialHome.includes('class="ua-post-options"'), 'Post audience settings must be available inline in the compact composer.');
assert.ok(socialHome.includes("files.length!==1||!uploadMime(files[0]).startsWith('video/')"), 'Reel must require exactly one video file.');
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
assert.ok(!profileSource.includes('<div class="ua-section-title"><strong>Postingan</strong><a class="ua-outline" href="#/account/compose">＋ Buat</a></div>'), 'Profile feed must not repeat the Post/Feed label or create action already present in primary navigation.');
assert.ok(profileSource.includes('melalui tombol Buat pada navigasi utama'), 'Empty profile feed should direct users to the primary create navigation.');
const socialNavigationCss = read('src/styles/social-navigation.css');
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
assert.ok(postDetailSource.includes("socialIcon(removing?'heart-crack':'heart',{size:112})"), 'Double-tap must show a large heart or cracked-heart feedback based on current like state.');
assert.ok(postDetailSource.includes("const wasLiked=likeButton.classList.contains('is-liked');"), 'Double-tap on an already liked post must allow unlike.');
assert.ok(postLayoutCss.includes('.ua-double-tap-heart.is-removing'), 'Unlike feedback must have a distinct cracked-heart animation.');
assert.ok(postLayoutCss.includes('@keyframes ua-heart-appear'), 'Like feedback must animate in and fade out.');





console.log('Production surface verification passed: legacy modules absent; Marketplace, Trip, social DM, account security and notification contracts present.');
