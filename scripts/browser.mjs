import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";

export async function launchBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    path.join(
      process.env.PROGRAMFILES ?? "C:/Program Files",
      "Google/Chrome/Application/chrome.exe",
    ),
    path.join(
      process.env["PROGRAMFILES(X86)"] ?? "C:/Program Files (x86)",
      "Microsoft/Edge/Application/msedge.exe",
    ),
    chromium.executablePath(),
  ];
  const executablePath = candidates.find(
    (candidate) => candidate && existsSync(candidate),
  );
  if (!executablePath)
    throw new Error(
      "Install Chromium with npx playwright install chromium, or set CHROME_PATH.",
    );
  return chromium.launch({ executablePath, headless: true });
}
