import { readFile, writeFile } from 'node:fs/promises';

const [version, releaseNumber] = process.argv.slice(2);
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? '') ||
    version.split('.').some(part => Number(part) > 65535) || !/^[1-9]\d*$/.test(releaseNumber ?? '')) {
  throw new Error('Usage: node scripts/set-version.mjs <major.minor.patch> <positive-release-number>');
}
const previous = JSON.parse(await readFile('release.json', 'utf8'));
const parts = version.split('.').map(Number);
const previousParts = previous.version.split('.').map(Number);
const difference = parts.findIndex((value, index) => value !== previousParts[index]);
if (difference === -1 || parts[difference] < previousParts[difference] || Number(releaseNumber) <= previous.release) {
  throw new Error('Both the version and release number must increase.');
}
for (const file of ['package.json', 'apps/web/package.json', 'apps/extension/manifest.json']) {
  const data = JSON.parse(await readFile(file, 'utf8'));
  data.version = version;
  if (file.endsWith('manifest.json')) data.version_name = version + ' (release ' + releaseNumber + ')';
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
}
await writeFile('release.json', JSON.stringify({
  version, release: Number(releaseNumber), date: new Date().toISOString().slice(0, 10), status: 'preview',
}, null, 2) + '\n');
await writeFile('apps/web/src/release.ts', "export const version = '" + version + "';\nexport const release = " + releaseNumber + ';\n');
console.log('Updated version and release. Update CHANGELOG.md before creating the Git tag.');
