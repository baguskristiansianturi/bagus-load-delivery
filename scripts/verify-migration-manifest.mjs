import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const migrationDir = path.join(root, 'supabase', 'migrations');
const files = readdirSync(migrationDir).filter((file) => file.endsWith('.sql')).sort();
const manifest = JSON.parse(readFileSync(path.join(root, 'supabase', 'migration-order-overrides.json'), 'utf8'));
const overrides = manifest.overrides;

assert.equal(files.length, 82, 'Expected 81 historical migrations plus one forward D-005 migration');
for (const file of Object.keys(overrides)) {
  assert.ok(files.includes(file), 'Migration mapping references a missing source file: ' + file);
}
const entries = files.map((file) => {
  const match = file.match(/^(\d{14})_(.+)\.sql$/);
  assert.ok(match, 'Invalid migration filename: ' + file);
  const [version, name] = overrides[file] || [match[1], match[2]];
  assert.match(version, /^\d{14}$/, 'Invalid canonical version: ' + file);
  return { file, version, name };
}).sort((a, b) => a.version.localeCompare(b.version));
assert.equal(new Set(entries.map((entry) => entry.version)).size, entries.length, 'Canonical migration versions must be unique');
assert.ok(entries.findIndex((entry) => entry.name === 'pluits_geodirectory_core') < entries.findIndex((entry) => entry.name === 'pluits_directory_fk_indexes'), 'GeoDirectory core must precede directory indexes');
assert.ok(entries.findIndex((entry) => entry.name === 'pluits_geodirectory_core') < entries.findIndex((entry) => entry.name === 'pluits_directory_claim_revocation'), 'GeoDirectory core must precede claim revocation');

const sellerMigration = readFileSync(path.join(migrationDir, '20261109100000_pluits_seller_eligibility_d005.sql'), 'utf8');
for (const type of ['individual', 'umkm', 'family_business', 'cooperative', 'company']) {
  assert.ok(sellerMigration.includes("'" + type + "'"), 'D-005 migration missing business type: ' + type);
}
assert.match(sellerMigration, /legal_form text/, 'Legal form must be stored separately from operational business type.');
assert.match(sellerMigration, /create function public\.create_store\(/, 'D-005 migration must replace create_store.');
assert.match(sellerMigration, /create or replace function public\.submit_store_for_verification/, 'D-005 migration must align verification requirements.');

const seller = readFileSync(path.join(root, 'src', 'pages', 'seller', 'index.js'), 'utf8');
for (const type of ['individual', 'umkm', 'family_business', 'cooperative', 'company']) {
  assert.ok(seller.includes('value="' + type + '"'), 'Seller onboarding missing option: ' + type);
}
assert.match(seller, /p_legal_form:/, 'Seller onboarding must submit legal form separately.');
console.log('Migration manifest and D-005 seller eligibility contracts passed.');
