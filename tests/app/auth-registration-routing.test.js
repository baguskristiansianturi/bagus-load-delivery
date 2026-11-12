import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('registration is delegated to its own feature and remains reachable before the session gate', async () => {
  const account = await readFile(new URL('../../src/pages/account/index.js', import.meta.url), 'utf8');
  const feature = await readFile(new URL('../../src/features/auth/register.js', import.meta.url), 'utf8');
  const mount = account.slice(account.indexOf('async function mountAccount('), account.indexOf('function bindWallet('));
  const registerGate = mount.indexOf("if(section==='register'){authScreen('register');return;}");
  const sessionGate = mount.indexOf("if(!user){authScreen('login');return;}");
  assert.ok(registerGate >= 0);
  assert.ok(sessionGate > registerGate);
  assert.match(account, /mountRegisterPage/);
  assert.match(feature, /supabase\.auth\.signUp/);
  assert.match(feature, /supabase\.auth\.resend/);
  assert.match(feature, /emailRedirectTo:\s*appBase/);
  assert.match(feature, /autocomplete="email"/);
  assert.match(feature, /autocomplete="new-password"/);
  assert.doesNotMatch(feature, /confirm_password/);
  assert.match(feature, /data-toggle-password/);
  assert.match(feature, /pl-register-pending/);
  assert.match(feature, /Ketentuan Layanan/);
  assert.match(feature, /Kebijakan Privasi/);
});

test('registration styling is isolated from other account and public pages', async () => {
  const css = await readFile(new URL('../../src/features/auth/register.css', import.meta.url), 'utf8');
  assert.match(css, /\.pl-register-page/);
  assert.doesNotMatch(css, /(^|[,{\\s])\.ua-auth-app/);
});
