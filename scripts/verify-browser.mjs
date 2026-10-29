import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { launchBrowser } from "./browser.mjs";

const baseURL = process.env.TEST_URL ?? "http://127.0.0.1:4173/";
const browser = await launchBrowser();
mkdirSync("artifacts", { recursive: true });
const checks = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const hostile = "<img src=x onerror=window.guestInjected=true>";
  await page.goto(`${baseURL}?guest=${encodeURIComponent(hostile)}`);
  await page.locator(".guest-name").filter({ hasText: hostile }).waitFor();
  assert.equal(await page.locator(".guest-name img").count(), 0);
  assert.equal(await page.evaluate(() => window.guestInjected), undefined);
  assert.equal(await page.locator("html").getAttribute("lang"), "uz");
  assert.match(await page.title(), /Kamoliddin & Parvinaxon/);
  assert.match(
    await page
      .locator('meta[property="og:description"]')
      .getAttribute("content"),
    /13 noyabr 2026.*18:00.*Shabnam/,
  );
  const og = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  assert.ok(
    !og.includes("localhost"),
    "social preview must not point to a development host",
  );
  const ogResponse = await page.request.get(new URL("og.png", baseURL).href);
  assert.equal(ogResponse.status(), 200);
  assert.match(ogResponse.headers()["content-type"], /image\/png/);
  assert.ok((await ogResponse.body()).length > 10_000);
  assert.equal(await page.locator('a[href*="maps"]').count(), 0);
  checks.push(
    "guest query is safe text; current metadata and PNG preview load; unconfirmed map absent",
  );

  for (const width of [320, 360, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    await page.goto(
      `${baseURL}?guest=${encodeURIComponent("Azizbek va oilasi")}`,
    );
    await page
      .locator(".guest-name")
      .filter({ hasText: "Azizbek va oilasi" })
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `cover overflow ${width}`,
    );
    await page.screenshot({ path: `artifacts/cover-${width}.png` });
    await page.locator(".open-button").focus();
    await page.keyboard.press("Enter");
    await page.locator(".phase-opening").waitFor();
    const durations = await page
      .locator(".envelope-flap")
      .evaluate((element) => getComputedStyle(element).animationDuration);
    assert.equal(durations, "0.65s");
    await page.locator(".phase-open").waitFor();
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      "names",
    );
    await page.waitForTimeout(900);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `story overflow ${width}`,
    );
    const layout = await page.evaluate(() => {
      const names = [...document.querySelectorAll(".names-title>span")].map(
        (el) => ({
          width: el.getBoundingClientRect().width,
          scroll: el.scrollWidth,
        }),
      );
      const date = document
        .querySelector(".date-display")
        .getBoundingClientRect();
      const time = document
        .querySelector(".date-copy>p:not(.date-display)")
        .getBoundingClientRect();
      return { names, dateBottom: date.bottom, timeTop: time.top };
    });
    assert.ok(
      layout.names.every((name) => name.scroll <= name.width + 1),
      `name clipped ${width}`,
    );
    assert.ok(layout.timeTop >= layout.dateBottom, `date overlap ${width}`);
    await page.locator("#moment").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1150);
    const portrait = page.locator(".portrait-frame img");
    assert.ok(
      await portrait.evaluate(
        (img) => img.complete && img.naturalWidth === 1100,
      ),
    );
    const ratio = await portrait.evaluate((img) => img.width / img.height);
    assert.ok(Math.abs(ratio - 1100 / 1021) < 0.01);
    const day = page.locator(".selected-day");
    assert.equal(await day.evaluate((td) => td.cellIndex), 4);
    assert.equal(await page.locator(".calendar td").count(), 42);
    assert.equal(
      await page
        .locator(".calendar td")
        .evaluateAll(
          (cells) => cells.filter((cell) => cell.textContent.trim()).length,
        ),
      30,
    );
    // Scroll normally: every reveal must remain readable, and natural keyboard navigation works.
    for (const section of await page.locator(".story section, .finale").all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(750);
      assert.ok(
        await section.evaluate((el) =>
          [...el.querySelectorAll("h2,p")].every(
            (text) =>
              getComputedStyle(text).visibility !== "hidden" &&
              Number(getComputedStyle(text).opacity) > 0.9,
          ),
        ),
      );
    }
    await page.screenshot({
      path: `artifacts/story-${width}.png`,
      fullPage: true,
    });
    checks.push(
      `${width}px: envelope + keyboard + focus + names + date + portrait + calendar + scrolling`,
    );
  }

  await page.locator("#date").scrollIntoViewIfNeeded();
  await page.locator(".date-copy > button").click();
  await page.locator('#calendar-options a').first().waitFor();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator('#calendar-options a[download]').click(),
  ]);
  await download.saveAs("artifacts/wedding.ics");
  const ics = readFileSync("artifacts/wedding.ics", "utf8");
  assert.ok(ics.includes("DTSTART;TZID=Asia/Tashkent:20261113T180000"));
  assert.ok(!ics.includes("DTEND"));
  assert.ok(ics.includes("TRIGGER:-P1D"));
  assert.equal(download.suggestedFilename(), "kamoliddin-parvinaxon.ics");
  await page.locator(".finale-bottom a").click();
  await page.waitForTimeout(1000);
  assert.ok(
    await page
      .locator("#names")
      .evaluate(
        (el) =>
          el.getBoundingClientRect().top >= 0 &&
          el.getBoundingClientRect().top < 200,
      ),
  );
  checks.push(
    "real ICS download contains Tashkent start and no end; back-to-top link works",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(baseURL);
  await page.locator(".open-button").click();
  await page.locator(".phase-open").waitFor({ timeout: 1000 });
  assert.equal(
    await page
      .locator(".names-title>span")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.screenshot({ path: "artifacts/reduced-320.png", fullPage: true });
  await page.goto(`${baseURL}?guest=${"W".repeat(200)}`);
  await page.locator(".guest-name").filter({ hasText: "WWWW" }).waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  checks.push(
    "reduced-motion opening, short screen and long unbroken guest name",
  );

  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const plain = await noJS.newPage();
  await plain.goto(baseURL);
  assert.match(await plain.locator(".story").innerText(), /Parvinaxon/);
  await plain.locator("#location").scrollIntoViewIfNeeded();
  assert.ok(await plain.locator("#location").isVisible());
  await noJS.close();
  checks.push("invitation stays readable with JavaScript disabled");
  assert.deepEqual(errors, []);
  writeFileSync(
    "artifacts/browser-results.json",
    JSON.stringify({ baseURL, checks, errors }, null, 2),
  );
  console.log(checks.join("\n"));
  console.log("BROWSER_OK");
} finally {
  await browser.close();
}
