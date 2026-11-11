import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('registration form remains reachable from guest preview even with an existing session', async () => {
  const source = await readFile(new URL('../../src/pages/account/index.js', import.meta.url), 'utf8');
  const mount = source.slice(source.indexOf('async function mountAccount('), source.indexOf('function bindWallet('));
  const registerGate = mount.indexOf("if(section==='register'){authScreen('register');return;}");
  const sessionGate = mount.indexOf("if(!user){authScreen('login');return;}");
  assert.ok(registerGate >= 0, 'register route must explicitly render registration form');
  assert.ok(sessionGate > registerGate, 'register route must be handled before the existing-session redirect');
  assert.match(source, /new URL\(import\.meta\.env\.BASE_URL\|\|'\/'\,window\.location\.origin\)/, 'email confirmation must return to the deployed app base path');
  assert.match(source, /export function mountUserAccount\([^]*?\)\{return mountAccount\(/, 'account mount must return its promise so router failures can be caught');
});

test('deferred route modules surface actionable errors and retry the current route', async () => {
  const source = await readFile(new URL('../../src/app/router.js', import.meta.url), 'utf8');
  assert.match(source, /function showRouteFailure\(/);
  assert.match(source, /data-route-error/);
  assert.match(source, /data-route-retry/);
  assert.match(source, /function defer\(task, version, retry\)/);
  assert.match(source, /showRouteFailure\(error,version,retry\)/);
  assert.match(source, /await mountUserAccount\(v\|\|'explore',s\[2\]\|\|''\)/);
});
