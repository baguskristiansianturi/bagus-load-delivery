import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { posix as posixPath } from 'node:path';

const sourceRoot = path.resolve('src');
const sourceFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) walk(fullPath);
    else if (/\.(?:js|mjs)$/.test(entry)) sourceFiles.push(fullPath);
  }
}
walk(sourceRoot);

const relativePath = (file) => path.relative(process.cwd(), file).split(path.sep).join('/');
const forbidden = {
  components: new Set(['pages', 'features']),
  services: new Set(['pages', 'features', 'components']),
  lib: new Set(['pages', 'features', 'components']),
  'design-system': new Set(['pages', 'features', 'components', 'services']),
  platform: new Set(['pages', 'features', 'components']),
};

const violations = [];
const importPattern = /(?:\bimport\s+(?:[^'"]*?\s+from\s+)?|\bexport\s+[^'"]*?\s+from\s+|\bimport\s*\()(['"])([^'"]+)\1/g;

for (const absoluteFile of sourceFiles) {
  const file = relativePath(absoluteFile);
  const sourceLayer = file.split('/')[1];
  const content = readFileSync(absoluteFile, 'utf8');
  for (const match of content.matchAll(importPattern)) {
    const specifier = match[2];
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;
    const resolved = specifier.startsWith('@/') 
      ? posixPath.normalize('src/' + specifier.slice(2))
      : posixPath.normalize(posixPath.join(posixPath.dirname(file), specifier));
    const targetLayer = resolved.split('/')[1];
    if (targetLayer === sourceLayer && sourceLayer === 'features') {
      const sourceFeature = file.split('/')[2];
      const targetFeature = resolved.split('/')[2];
      if (sourceFeature && targetFeature && sourceFeature !== targetFeature && !resolved.endsWith('/index.js')) {
        violations.push(file + ' -> ' + resolved + ': feature modules must use an explicit shared contract, not another feature private files.');
      }
    }
    if (forbidden[sourceLayer]?.has(targetLayer)) {
      violations.push(file + ' -> ' + resolved + ': ' + sourceLayer + ' must not depend on ' + targetLayer + '.');
    }
  }
}

assert.deepEqual(
  violations,
  [],
  'PLUITS module-boundary violations found:\n- ' + violations.join('\n- ')
);
console.log('Module boundaries verified across ' + sourceFiles.length + ' source modules.');
