import { readdirSync } from "node:fs";
import { join } from "node:path";

const LOCK_MAP = [
  {
    files: ["bun.lock", "bun.lockb"],
    pm: "bun",
    install: "bun add -d",
    dev: "-d",
  },
  { files: ["pnpm-lock.yaml"], pm: "pnpm", install: "pnpm add -D", dev: "-D" },
  { files: ["yarn.lock"], pm: "yarn", install: "yarn add -D", dev: "-D" },
  {
    files: ["package-lock.json"],
    pm: "npm",
    install: "npm install --save-dev",
    dev: "--save-dev",
  },
];

const DEFAULT_PM = LOCK_MAP[0];

export function detectPackageManager(cwd) {
  let entries;
  try {
    entries = readdirSync(cwd);
  } catch {
    return DEFAULT_PM;
  }

  for (const entry of LOCK_MAP) {
    if (entry.files.some((f) => entries.includes(f))) {
      return entry;
    }
  }

  return DEFAULT_PM;
}
