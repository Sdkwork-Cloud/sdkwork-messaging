#!/usr/bin/env node

import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.resolve(APP_ROOT, "../..");
const SOURCES = [
  "apps/sdkwork-messaging-pc/package.json",
  "apps/sdkwork-messaging-pc/tsconfig.json",
  "apps/sdkwork-messaging-pc/vite.config.ts",
  "apps/sdkwork-messaging-pc/src/main.tsx",
];

const missing = SOURCES.filter((source) => !existsSync(path.join(REPO_ROOT, source)));
for (const source of missing) {
  try {
    const tracked = execFileSync("git", ["ls-files", "--error-unmatch", source], { cwd: REPO_ROOT, stdio: "pipe" });
    if (tracked.length > 0) execFileSync("git", ["checkout", "HEAD", "--", source], { cwd: REPO_ROOT, stdio: "pipe" });
  } catch {
    // The final verification below reports every unresolved source in one actionable error.
  }
}
const unresolved = SOURCES.filter((source) => !existsSync(path.join(REPO_ROOT, source)));
if (unresolved.length > 0) {
  throw new Error(`Missing build-critical sources: ${unresolved.join(", ")}. Restore them with git checkout HEAD -- <path>.`);
}
console.log("[sdkwork-messaging-pc] build-critical sources verified");

