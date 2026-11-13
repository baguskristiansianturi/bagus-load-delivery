import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const modules = [
  'src/README.md',
  'src/features/stories/README.md','src/features/posts/README.md','src/features/profile/README.md',
  'src/features/reels/README.md','src/features/media/README.md','src/features/inbox/README.md',
  'src/features/seller/README.md','src/features/cart/README.md','src/features/orders/README.md',
  'src/features/account-settings/README.md','src/features/moderation/README.md',
  'src/features/store/catalog/README.md','src/features/store/storefront/README.md',
  'src/features/store/product/README.md','src/features/store/wishlist/README.md',
  'src/features/inbox/conversations/README.md','src/features/inbox/composer/README.md',
  'src/features/inbox/contacts/README.md','src/features/inbox/requests/README.md',
  'src/features/directory/places/README.md','src/features/directory/providers/README.md',
  'src/features/directory/claims/README.md','src/features/directory/map/README.md',
  'src/features/notifications/list/README.md','src/features/notifications/preferences/README.md',
  'src/features/seller/dashboard/README.md','src/features/seller/store-switcher/README.md',
  'src/features/seller/products/README.md','src/features/seller/categories/README.md',
  'src/features/seller/inventory/README.md','src/features/seller/delivery/README.md',
  'src/features/seller/store-profile/README.md','src/features/seller/settings/README.md',
  'src/features/trips/itinerary/README.md','src/features/trips/destinations/README.md',
  'src/features/trips/service-requests/README.md',
  'src/services/repositories/accounts/README.md','src/services/repositories/social/README.md',
  'src/services/repositories/messaging/README.md','src/services/repositories/notifications/README.md',
  'src/services/repositories/directory/README.md','src/services/repositories/marketplace/README.md',
  'src/services/repositories/seller/README.md','src/services/repositories/trips/README.md',
  'src/services/repositories/blog/README.md','src/services/realtime/presence/README.md',
  'src/services/realtime/messages/README.md','src/services/realtime/notifications/README.md',
  'src/services/offline/outbox/README.md','src/services/offline/cache/README.md',
  'src/design-system/tokens/README.md','src/design-system/typography/README.md',
  'src/design-system/icons/README.md','src/design-system/motion/README.md',
  'src/platform/browser/README.md','src/platform/native/README.md',
  'supabase/functions/README.md','supabase/tests/rls/README.md',
  'supabase/tests/rpc/README.md','supabase/tests/storage/README.md',
  'tests/README.md','tests/architecture/README.md','tests/contracts/README.md',
  'tests/integration/README.md','tests/routes/README.md','tests/e2e/README.md',
  'tests/visual/README.md','docs/pluits/BACKEND-MODULE-MAP.md'
];

test('agreed PLUITS module roadmap folders are tracked', () => {
  const missing = modules.filter(path => !existsSync(resolve(root, path)));
  assert.deepEqual(missing, [], 'Missing module markers: ' + missing.join(', '));
});

test('reserved Inbox page folders are not registered as runtime routes', () => {
  const router = readFileSync(resolve(root, 'src/app/router.js'), 'utf8');
  assert.equal(router.includes('../pages/inbox-personal/'), false);
  assert.equal(router.includes('../pages/inbox-toko/'), false);
});
