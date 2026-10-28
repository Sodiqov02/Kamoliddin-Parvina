import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  createCalendarEvent,
  calendarLinks,
  calendarTitle,
  monthCells,
  normalizeGuest,
  wedding,
} from "../app/wedding.ts";

test("November has all 30 days and the wedding occupies Friday", () => {
  const cells = monthCells();
  assert.equal(cells.length, 42);
  assert.deepEqual(
    cells.filter(Boolean),
    Array.from({ length: 30 }, (_, i) => i + 1),
  );
  assert.equal(cells.indexOf(13) % 7, 4);
  assert.equal(cells.indexOf(1) % 7, 6);
  assert.equal(
    new Intl.DateTimeFormat("en", {
      weekday: "long",
      timeZone: wedding.timeZone,
    }).format(new Date("2026-11-13T13:00:00Z")),
    "Friday",
  );
});

test("calendar is CRLF, UTF-8 folded, Tashkent 18:00 and has no invented end", () => {
  const ics = createCalendarEvent(new Date("2026-10-28T10:00:00Z"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.ok(ics.includes("DTSTART;TZID=Asia/Tashkent:20261113T180000\r\n"));
  assert.ok(ics.includes("DTSTAMP:20261028T100000Z"));
  assert.ok(ics.includes("TZOFFSETTO:+0500"));
  assert.ok(!ics.includes("DTEND"));
  assert.ok(!ics.includes("DURATION"));
  for (const line of ics.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.includes(`LOCATION:${wedding.venue}`));
  assert.ok(unfolded.includes(wedding.families));
  assert.ok(unfolded.includes(`SUMMARY:${calendarTitle}`));
  assert.ok(unfolded.includes("BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-P1D\r\n"));
  const staticIcs = readFileSync("public/kamoliddin-parvinaxon.ics", "utf8");
  assert.equal(staticIcs.replace(/DTSTAMP:[^\r]+/, "DTSTAMP:STAMP"), ics.replace(/DTSTAMP:[^\r]+/, "DTSTAMP:STAMP"));
});

test("calendar links encode the real start, timezone, title and technical end", () => {
  const { google, outlook } = calendarLinks();
  const g = new URL(google), o = new URL(outlook);
  assert.equal(g.origin, "https://calendar.google.com");
  assert.equal(g.pathname, "/calendar/render");
  assert.equal(g.searchParams.get("text"), calendarTitle);
  assert.equal(g.searchParams.get("ctz"), "Asia/Tashkent");
  assert.equal(g.searchParams.get("dates"), "20261113T130000Z/20261113T140000Z");
  assert.equal(g.searchParams.get("location"), wedding.venue);
  assert.match(g.searchParams.get("details"), /texnik vaqt.*tasdiqlanmagan/);
  assert.equal(o.origin, "https://outlook.live.com");
  assert.equal(o.pathname, "/calendar/0/deeplink/compose");
  assert.equal(o.searchParams.get("subject"), calendarTitle);
  assert.equal(o.searchParams.get("location"), wedding.venue);
  assert.equal(o.searchParams.get("startdt"), "2026-11-13T13:00:00Z");
  assert.equal(o.searchParams.get("enddt"), "2026-11-13T14:00:00Z");
  assert.match(o.searchParams.get("body"), /texnik vaqt.*tasdiqlanmagan/);
  assert.equal(new Intl.DateTimeFormat("en-GB", {timeZone:wedding.timeZone, hour:"2-digit", minute:"2-digit", hourCycle:"h23"}).format(new Date(o.searchParams.get("startdt"))), "18:00");
});

test("guest input supports Unicode, bounds length and removes control characters", () => {
  assert.equal(normalizeGuest(null), "Aziz mehmonimiz");
  assert.equal(normalizeGuest("  "), "Aziz mehmonimiz");
  assert.equal(normalizeGuest("  Azizbek va oilasi  "), "Azizbek va oilasi");
  assert.equal(normalizeGuest("Алишер 👰"), "Алишер 👰");
  assert.equal(Array.from(normalizeGuest("💛".repeat(90))).length, 80);
  assert.equal(normalizeGuest("\u202eAli\n"), "Ali");
  assert.equal(
    normalizeGuest("<img src=x onerror=alert(1)>"),
    "<img src=x onerror=alert(1)>",
  );
});

test("the exact supplied privacy-treated image is served", () => {
  const digest = (file) =>
    createHash("sha256").update(readFileSync(file)).digest("hex");
  assert.equal(
    digest("public/kamoliddin-parvinaxon-couple.webp"),
    digest("kamoliddin-parvinaxon-couple.webp"),
  );
});

test("active application does not contain obsolete details; negative control works", () => {
  const obsolete =
    /Ofarin|26.{0,12}(?:sentabr|сентябр|09)|TgTqMce928wAXUiv8|17:00|19:00/i;
  assert.ok(obsolete.test("26-sentabr 2026 · Ofarin"));
  for (const file of [
    "app/invitation.tsx",
    "app/layout.tsx",
    "app/wedding.ts",
    "app/globals.css",
  ])
    assert.ok(!obsolete.test(readFileSync(file, "utf8")), file);
});
