import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Build a disposable local Supabase workspace whose migration filenames follow
// the exact production migration-history versions. Never rename historical files.
const root = process.cwd();
const sourceDir = path.join(root, 'supabase');
const outputDir = path.join(root, '.supabase-ci');
const sourceMigrations = path.join(sourceDir, 'migrations');
const overridesPath = path.join(sourceDir, 'migration-order-overrides.json');
const overrides = JSON.parse(readFileSync(overridesPath, 'utf8')).overrides;

assert.ok(existsSync(path.join(sourceDir, 'config.toml')), 'Supabase config missing');
assert.equal(readFileSync(path.join(sourceDir, 'config.toml'), 'utf8').includes('ytndswhqxayqpftszwfh'), false, 'Production project ref must not enter local workspace');

const files = readdirSync(sourceMigrations).filter((name) => name.endsWith('.sql')).sort();
assert.equal(files.length, 83, 'Migration count changed; refresh and review the production order manifest before CI replay');

const entries = files.map((file) => {
  const match = file.match(/^(\d{14})_(.+)\.sql$/);
  assert.ok(match, 'Invalid migration filename: ' + file);
  const [version, name] = overrides[file] || [match[1], match[2]];
  assert.match(version, /^\d{14}$/, 'Invalid canonical migration version for ' + file);
  assert.ok(name && !name.includes('/'), 'Invalid canonical migration name for ' + file);
  return { file, version, name };
}).sort((a, b) => a.version.localeCompare(b.version));

assert.equal(new Set(entries.map((entry) => entry.version)).size, entries.length, 'Duplicate canonical migration version');
assert.equal(new Set(entries.map((entry) => entry.file)).size, files.length, 'Migration manifest contains duplicate files');

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(path.join(outputDir, 'supabase', 'migrations'), { recursive: true });
cpSync(path.join(sourceDir, 'config.toml'), path.join(outputDir, 'supabase', 'config.toml'));

for (const entry of entries) {
  const destination = path.join(outputDir, 'supabase', 'migrations', entry.version + '_' + entry.name + '.sql');
  cpSync(path.join(sourceMigrations, entry.file), destination);
}

writeFileSync(path.join(outputDir, 'migration-order-report.json'), JSON.stringify(entries, null, 2) + '\n');
console.log('Prepared ' + entries.length + ' local migrations using production history order; source migration files were not changed.');
console.log('First GeoDirectory migration: ' + entries.find((entry) => entry.name === 'pluits_geodirectory_core').version);
