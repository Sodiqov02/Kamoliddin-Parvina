import { readFileSync } from "node:fs";
import { launchBrowser } from "./browser.mjs";
import {
  coupleNames,
  startTime,
  wedding,
  writtenDate,
} from "../app/wedding.ts";

const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const font = readFileSync("app/fonts/cormorant-garamond-latin.woff2").toString(
  "base64",
);
const portrait = readFileSync(
  "public/kamoliddin-parvinaxon-couple.webp",
).toString("base64");
const browser = await launchBrowser();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><html><head><style>@font-face{font-family:Romance;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#fcf6ec;color:#312b28;width:1200px;height:630px;display:flex;align-items:center;padding:50px;gap:50px}.copy{width:640px}p{font:20px Arial;margin:25px 0;color:#80602e}h1{font:400 72px/1.02 Romance;margin:35px 0;letter-spacing:-2px}h1 span{display:block}small{font:18px Arial;line-height:1.8}img{width:390px;height:440px;object-fit:cover;border:8px solid #fffdf8;outline:1px solid #b58b49}</style></head><body><div class="copy"><p>Toʻy taklifnomasi</p><h1>${escape(wedding.groom)}<span>&amp; ${escape(wedding.bride)}</span></h1><p>${escape(writtenDate)} · ${startTime}</p><small>${escape(wedding.venue)}<br>Ikki qalb. Bir taqdir.</small></div><img src="data:image/webp;base64,${portrait}" alt="${escape(coupleNames)}"></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/og.png" });
  console.log("OG_GENERATED");
} finally {
  await browser.close();
}
