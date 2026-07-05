import { existsSync, readFileSync, writeFileSync } from "node:fs";
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

export function addScriptsToPackageJson(cwd) {
  const pkgPath = join(cwd, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  const formatScript =
    "prettier --write  \"**/*.{ts,tsx,js,jsx,json,md,mdx,css}\"";
  const formatCheckScript =
    "prettier --check  \"**/*.{ts,tsx,js,jsx,json,md,mdx,css}\"";

  let added = false;

  if (!pkg.scripts.format) {
    pkg.scripts.format = formatScript;
    added = true;
  }

  if (!pkg.scripts["format:check"]) {
    pkg.scripts["format:check"] = formatCheckScript;
    added = true;
  }

  if (added) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
    console.log("done: format scripts added to package.json");
  }
}
