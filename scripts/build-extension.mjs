import { cp, mkdir, rm, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(await readFile(path.join(root, 'release.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'apps/extension/manifest.json'), 'utf8'));
const web = JSON.parse(await readFile(path.join(root, 'apps/web/package.json'), 'utf8'));
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version.version)) {
  throw new Error('Invalid release version.');
}
if (manifest.version !== version.version || web.version !== version.version) {
  throw new Error('Web, extension and release versions must match.');
}
const destination = path.join(root, 'releases', version.version, 'extension');
const releaseRoot = path.join(root, 'releases', version.version);
if (path.dirname(destination) !== releaseRoot || path.basename(destination) !== 'extension') {
  throw new Error('Extension destination is outside the release directory.');
}
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(path.join(root, 'apps/extension/src'), destination, { recursive: true });
await cp(path.join(root, 'apps/extension/icons'), path.join(destination, 'icons'), { recursive: true });
await copyFile(path.join(root, 'apps/web/src/analysis/triage.mjs'), path.join(destination, 'triage.mjs'));
await writeFile(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Built ' + destination);
