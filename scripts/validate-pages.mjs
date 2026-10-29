import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pagesBase } from './pages-base.mjs';

const root = path.resolve(process.env.PAGES_OUTPUT_DIR ?? 'dist/client');
const base = pagesBase();
const origin = 'https://pages-validation.invalid';
const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const file of ['.nojekyll', 'favicon.svg', 'og.png', 'kamoliddin-parvinaxon-couple.webp', 'kamoliddin-parvinaxon.ics']) {
  await access(path.join(root, file));
}
assert.match(html, /Kamoliddin/);
assert.match(html, /Parvinaxon/);
assert.match(html, /kamoliddin-parvinaxon-couple\.webp/);
assert.match(html, /kamoliddin-parvinaxon\.ics/);

const resources = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)]
  .map((match) => match[1].replaceAll('&amp;', '&'))
  .filter((url) => /\.(?:css|js|svg|webp|ics)(?:[?#]|$)/.test(url));
assert.ok(resources.some((url) => /\.css(?:[?#]|$)/.test(url)), 'HTML must reference CSS');
assert.ok(resources.some((url) => /\.js(?:[?#]|$)/.test(url)), 'HTML must reference JS');
assert.ok(resources.some((url) => url.includes('kamoliddin-parvinaxon-couple.webp')), 'HTML must reference the supplied photograph');
assert.ok(resources.some((url) => url.includes('kamoliddin-parvinaxon.ics')), 'HTML must reference the calendar file');

async function checkResource(url, parent = `${origin}${base}/`) {
  const resolved = new URL(url, parent);
  if (resolved.origin !== origin) return null;
  assert.ok(resolved.pathname.startsWith(`${base}/`), `Wrong Pages prefix: ${resolved.pathname}`);
  const relative = decodeURIComponent(resolved.pathname.slice(base.length + 1));
  const target = path.resolve(root, relative);
  assert.ok(target.startsWith(root + path.sep), `Resource escapes output: ${url}`);
  await access(target);
  return { target, resolved };
}

for (const url of resources) {
  const result = await checkResource(url);
  if (result && /\.css(?:[?#]|$)/.test(url)) {
    const css = await readFile(result.target, 'utf8');
    const fontUrls = [...css.matchAll(/url\(["']?([^"')]+\.woff2(?:\?[^"')]*)?)["']?\)/g)].map((match) => match[1]);
    assert.ok(fontUrls.length >= 2, 'CSS must reference both local font files');
    for (const font of fontUrls) await checkResource(font, result.resolved.href);
  }
}
const ics = await readFile(path.join(root, 'kamoliddin-parvinaxon.ics'), 'utf8');
assert.match(ics, /DTSTART;TZID=Asia\/Tashkent:20261113T180000/);
assert.match(ics, /TRIGGER:-P1D/);
console.log(`PAGES_ARTIFACT_OK base=${base || '/'} resources=${resources.length}`);
