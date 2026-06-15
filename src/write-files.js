import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function writeConfigFile(cwd, filename, templateContent, force) {
  const filePath = join(cwd, filename);

  if (existsSync(filePath) && !force) {
    console.log(`skip: ${filename} already exists (use --force to overwrite)`);
    return false;
  }

  writeFileSync(filePath, templateContent, "utf-8");
  console.log(`done: ${filename} written`);
  return true;
}
