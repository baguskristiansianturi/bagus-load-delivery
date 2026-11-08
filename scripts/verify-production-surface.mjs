import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const retiredFiles = [
  'src/app/page-factory.js',
  'src/app/services.js',
  'src/app/store.js',
  'src/data/catalog.js',
  'src/data/marketplace.js',
];

for (const path of retiredFiles) {
  assert.equal(existsSync(path), false, `Retired demo module returned: ${path}`);
}

const router = read('src/app/router.js');
for (const retiredImport of ['page-factory.js', '../app/services.js', '../app/store.js', '../data/catalog.js', '../data/marketplace.js']) {
  assert.equal(router.includes(retiredImport), false, `Router references retired module: ${retiredImport}`);
}

const marketplace = read('src/pages/marketplace/index.js');
assert.match(marketplace, /public_marketplace_products/, 'Marketplace catalog must read the backend catalog view.');
assert.match(marketplace, /place_marketplace_order/, 'Marketplace checkout must create orders through the backend RPC.');

const trip = read('src/pages/trip/index.js');
assert.match(trip, /trip_itineraries/, 'Trip itineraries must persist through the backend.');
assert.match(trip, /request_trip_service/, 'Trip service requests must use the backend lifecycle.');

console.log('Production surface verification passed: no retired demo modules, active Marketplace and Trip backend contracts present.');
