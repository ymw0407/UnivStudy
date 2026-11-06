import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const site = new URL('../dist/', import.meta.url);
const home = readFileSync(new URL('index.html', site), 'utf8');
for (const course of ['os', 'quantum', 'rust']) {
  assert.ok(home.includes(`href="./${course}/"`), `Missing archive link: ${course}`);
  const directory = new URL(`${course}/`, site);
  const html = readFileSync(new URL('index.html', directory), 'utf8');
  assert.match(html, /<script\b[^>]*type="module"[^>]*src=/);
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (asset.startsWith('data:')) continue;
    const url = new URL(asset, directory);
    assert.ok(url.href.startsWith(directory.href) && existsSync(url), `Broken asset: ${course}/${asset}`);
  }
}
console.log('All three course entry points and their assets passed.');
