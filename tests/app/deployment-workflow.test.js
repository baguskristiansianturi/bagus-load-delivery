import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Pages deploys main and the dedicated Circle UI-test branch while pull requests only validate artifacts', async () => {
  const workflow = await readFile(new URL('../../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /pull_request:\s*\n\s*branches:\s*\n\s*- main/);
  assert.match(workflow, /push:\s*\n\s*branches:\s*\n\s*- main\s*\n\s*- fix\/circle-feed-navigation-mobile-white/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /if: github\.event_name != 'pull_request' && \(github\.ref == 'refs\/heads\/main' \|\| github\.ref == 'refs\/heads\/fix\/circle-feed-navigation-mobile-white'\)/);
  assert.match(workflow, /actions\/upload-pages-artifact/);
  assert.match(workflow, /actions\/deploy-pages/);
});
