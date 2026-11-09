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
assert.match(postActions, /toggleLike\(true\)/, 'Double-tap must call the like action without toggling an existing like off.');

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


const sharedSupabaseClient = read('src/lib/supabase/client.js');
assert.match(sharedSupabaseClient, /createClient\(/, 'A single shared Supabase browser client must exist.');
assert.match(sharedSupabaseClient, /VITE_SUPABASE_URL/, 'Supabase URL must be configurable without editing page modules.');
assert.match(sharedSupabaseClient, /VITE_SUPABASE_PUBLISHABLE_KEY/, 'Publishable key must be configurable without editing page modules.');
assert.doesNotMatch(sharedSupabaseClient, /service_role|sb_secret/i, 'Secret/service-role keys must never enter the browser client.');
for (const path of [
  'src/pages/account/index.js',
  'src/pages/seller/index.js',
  'src/pages/marketplace/index.js',
  'src/pages/trip/index.js',
  'src/pages/messages/index.js',
  'src/pages/directory/index.js',
  'src/pages/admin/moderation.js',
  'src/pages/home/index.js',
  'src/pages/search/discovery.js',
  'src/pages/misc/index.js',
]) {
  const content = read(path);
  assert.doesNotMatch(content, /createClient\(|@supabase\/supabase-js@2/, `Page must use the shared Supabase client: ${path}`);
  assert.match(content, /lib\/supabase\/client\.js/, `Shared Supabase client import missing: ${path}`);
}

const seller = read('src/pages/seller/index.js');
assert.match(seller, /value="individual"/, 'Seller onboarding must accept individual businesses.');
assert.match(seller, /value="umkm"/, 'Seller onboarding must accept UMKM businesses.');
assert.match(seller, /value="family_business"/, 'Seller onboarding must accept family businesses.');
assert.match(seller, /value="cooperative"/, 'Seller onboarding must accept cooperatives.');
assert.match(seller, /value="company"/, 'Seller onboarding must accept companies.');

console.log('Production surface verification passed: legacy modules absent; Marketplace, Trip, social DM, account security, notifications and Seller Center flow contracts present.');
