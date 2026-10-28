import { cp, mkdir, readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import assert from 'node:assert/strict';
import path from 'node:path';
import { launchBrowser } from './browser.mjs';

const output = path.resolve('artifacts/pages-client');
await mkdir(output, { recursive: true });
await cp('dist/client', output, { recursive: true });
const prepared = spawnSync(process.execPath, ['scripts/prepare-pages.mjs'], { env: { ...process.env, PAGES_OUTPUT_DIR:output, PAGES_BASE_PATH:'/Kamoliddin-Parvina' }, encoding:'utf8' });
assert.equal(prepared.status, 0, prepared.stderr);
await readFile(path.join(output, '.nojekyll'));
const server = spawn(process.execPath, ['scripts/preview.mjs'], { env:{ ...process.env, PREVIEW_ROOT:output, PREVIEW_BASE:'/Kamoliddin-Parvina', PORT:'4174' }, stdio:['ignore','pipe','pipe'] });
let browser;
try {
  await Promise.race([once(server.stdout,'data'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('preview startup timeout')),10000))]);
  browser = await launchBrowser();
  const page = await browser.newPage({ viewport:{width:390,height:844} });
  const errors = [];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('response', response=>{ if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://127.0.0.1:4174/Kamoliddin-Parvina/?guest=Azizbek');
  await page.locator('.guest-name').filter({hasText:'Azizbek'}).waitFor();
  await page.locator('.open-button').click();
  await page.locator('.phase-open').waitFor();
  await page.locator('.portrait-frame img').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  assert.ok(await page.locator('.portrait-frame img').evaluate(img=>img.complete&&img.naturalWidth===1100));
  assert.ok(await page.evaluate(()=>document.fonts.check('16px Manrope')&&document.fonts.check('16px "Cormorant Garamond"')));
  await page.locator('.date-copy > button').click();
  const ics = await page.request.get('http://127.0.0.1:4174/Kamoliddin-Parvina/kamoliddin-parvinaxon.ics');
  assert.equal(ics.status(),200);
  assert.match(await ics.text(),/TRIGGER:-P1D/);
  assert.ok((await page.locator('#calendar-options a[download]').getAttribute('href')).endsWith('.ics'));
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'artifacts/pages-mobile.png'});
  console.log('PAGES_OK');
} finally { if(browser) await browser.close(); server.kill(); }
