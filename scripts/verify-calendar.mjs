import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { launchBrowser } from './browser.mjs';

const base = process.env.TEST_URL ?? 'http://127.0.0.1:4187/';
const browser = await launchBrowser();
try {
  for (const [width, height, timezoneId] of [[320,568,'America/New_York'],[390,844,'Asia/Tashkent'],[1440,900,'Europe/London']]) {
    const context = await browser.newContext({ viewport:{width,height}, timezoneId, acceptDownloads:true, reducedMotion:'reduce' });
    const page = await context.newPage();
    await page.goto(base);
    await page.locator('.open-button').click();
    await page.locator('.phase-open').waitFor();
    const trigger = page.locator('.date-copy > button');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#calendar-options');
    assert.equal(await trigger.getAttribute('aria-expanded'),'true');
    assert.equal(await menu.locator('a').count(),3);
    assert.equal(await page.evaluate(()=>document.activeElement?.textContent.trim()),'Google Calendar');
    assert.equal(await menu.locator('a').nth(1).getAttribute('download'),'kamoliddin-parvinaxon.ics');
    assert.equal(await menu.locator('a').first().getAttribute('target'),'_blank');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
    await page.keyboard.press('Tab');
    assert.match(await page.evaluate(()=>document.activeElement?.textContent.trim()),/^Apple Calendar/);
    await page.keyboard.press('Escape');
    assert.ok(await menu.isHidden());
    assert.ok(await trigger.evaluate(el=>document.activeElement===el));
    await page.locator('.selected-day button').click();
    assert.ok(await menu.isVisible());
    await page.keyboard.press('Escape');
    assert.ok(await page.locator('.selected-day button').evaluate(el=>document.activeElement===el));
    await trigger.click();
    const google = new URL(await menu.locator('a').nth(0).getAttribute('href'));
    const outlook = new URL(await menu.locator('a').nth(2).getAttribute('href'));
    assert.equal(google.searchParams.get('dates'),'20261113T130000Z/20261113T140000Z');
    assert.equal(google.searchParams.get('ctz'),'Asia/Tashkent');
    assert.equal(outlook.searchParams.get('startdt'),'2026-11-13T13:00:00Z');
    assert.equal(google.searchParams.get('text'),'Kamoliddin & Parvinaxon — Toʻy marosimi');
    assert.equal(outlook.searchParams.get('location'),'Shabnam toʻyxonasi');
    assert.match(await menu.innerText(),/1 soat texnik vaqt/);
    // Intercept the provider composers: verify actual clicks and popup URLs without signing in or creating events.
    await context.route('https://calendar.google.com/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Google composer fixture</title>'}));
    await context.route('https://outlook.live.com/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Outlook composer fixture</title>'}));
    for (const [index, expected] of [[0,google],[2,outlook]]) {
      const [popup] = await Promise.all([page.waitForEvent('popup'),menu.locator('a').nth(index).click()]);
      await popup.waitForLoadState();
      assert.equal(popup.url(),expected.href);
      await popup.close();
    }
    const [download] = await Promise.all([page.waitForEvent('download'),menu.locator('a[download]').click()]);
    const file = `artifacts/calendar-${width}.ics`;
    await download.saveAs(file);
    const data = readFileSync(file,'utf8').replace(/\r\n /g,'');
    assert.ok(data.includes('SUMMARY:Kamoliddin & Parvinaxon — Toʻy marosimi'));
    assert.ok(data.includes('DTSTART;TZID=Asia/Tashkent:20261113T180000'));
    assert.ok(data.includes('TRIGGER:-P1D'));
    assert.ok(!data.includes('DTEND'));
    await page.screenshot({path:`artifacts/calendar-menu-${width}.png`});
    await page.locator('#date-title').click();
    assert.ok(await menu.isHidden());
    await context.close();
  }
  console.log('CALENDAR_BROWSER_OK');
} finally { await browser.close(); }
