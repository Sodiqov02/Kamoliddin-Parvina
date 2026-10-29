import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pagesBase } from '../scripts/pages-base.mjs';

test('project and user-site base paths follow GitHub repository settings', () => {
  assert.equal(pagesBase({ GITHUB_REPOSITORY:'Sodiqov02/Kamoliddin-Parvina' }), '/Kamoliddin-Parvina');
  assert.equal(pagesBase({ GITHUB_REPOSITORY:'Sodiqov02/Sodiqov02.github.io' }), '');
  assert.equal(pagesBase({ GITHUB_REPOSITORY:'Sodiqov02/Kamoliddin-Parvina', PAGES_BASE_PATH:'' }), '');
  assert.equal(pagesBase({ PAGES_BASE_PATH:'/custom/' }), '/custom');
});

test('Pages preparation prefixes project assets and is safe to repeat', async () => {
  await mkdir('artifacts', { recursive:true });
  const output = await mkdtemp(path.resolve('artifacts/pages-fixture-'));
  await writeFile(path.join(output, 'index.html'), '<script src="/_next/app.js"></script><link href="_next/app.css">');
  await writeFile(path.join(output, 'style.css'), '@font-face{src:url(/_next/font.woff2)}');
  const env = { ...process.env, GITHUB_REPOSITORY:'Sodiqov02/Kamoliddin-Parvina', PAGES_OUTPUT_DIR:output };
  delete env.PAGES_BASE_PATH;
  const run = () => spawnSync(process.execPath, ['scripts/prepare-pages.mjs'], { env, encoding:'utf8' });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const html = await readFile(path.join(output,'index.html'),'utf8');
  const css = await readFile(path.join(output,'style.css'),'utf8');
  assert.match(html, /src="\/Kamoliddin-Parvina\/_next\/app\.js"/);
  assert.match(html, /href="Kamoliddin-Parvina\/_next\/app\.css"/);
  assert.match(css, /url\(\/Kamoliddin-Parvina\/_next\/font\.woff2\)/);
  await readFile(path.join(output,'.nojekyll'));
  const second = run();
  assert.equal(second.status, 0, second.stderr);
  assert.equal(await readFile(path.join(output,'index.html'),'utf8'),html);
  assert.equal(await readFile(path.join(output,'style.css'),'utf8'),css);
});
