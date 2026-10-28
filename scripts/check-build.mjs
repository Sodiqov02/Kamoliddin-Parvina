import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";
const calendar = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/generate-calendar.mjs"], { stdio: "inherit" });
if (calendar.status !== 0) process.exit(calendar.status ?? 1);
const result = spawnSync(
  process.execPath,
  ["node_modules/vinext/dist/cli.js", "build"],
  { stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);
for (const file of [
  "dist/client/index.html",
  "dist/client/og.png",
  "dist/client/kamoliddin-parvinaxon-couple.webp",
  "dist/client/kamoliddin-parvinaxon.ics",
])
  assert.ok(existsSync(file), file);
console.log("BUILD_OK");
