import { spawnSync } from "node:child_process";
for (const args of [
  [
    "node_modules/eslint/bin/eslint.js",
    "app",
    "tests",
    "scripts",
    "vite.config.ts",
    "next.config.ts",
  ],
  ["node_modules/typescript/bin/tsc", "--noEmit"],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("SOURCE_OK");
