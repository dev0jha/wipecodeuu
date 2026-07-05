import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { detectPackageManager } from "./detect-pm.js";
import { installPlugins, installPrettier } from "./install-deps.js";
import { addScriptsToPackageJson, writeConfigFile } from "./write-files.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8")
);

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    force: false,
    skipInstall: false,
    pm: null,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--force":
        flags.force = true;
        break;
      case "--skip-install":
        flags.skipInstall = true;
        break;
      case "--pm":
        flags.pm = args[++i] || null;
        break;
      case "--help":
        flags.help = true;
        break;
      case "--version":
        flags.version = true;
        break;
    }
  }

  return flags;
}

function printHelp() {
  console.log(`
codeuu v${pkg.version} — Zero-config Prettier setup

Usage:
  npx codeuu               Setup Prettier in current project
  npx codeuu --force        Overwrite existing config files
  npx codeuu --skip-install Skip dependency installation
  npx codeuu --pm <manager> Override package manager (npm, bun, pnpm, yarn)
  npx codeuu --help         Show this help
  npx codeuu --version      Show version
`);
}

function printBanner() {
  console.log("wipecodeuu -- setting up Prettier...\n");
}

function printSuccess() {
  console.log(`\nDone. Prettier is configured.`);
  console.log(`Run: npx prettier --write .`);
}

async function main() {
  const flags = parseArgs();

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  if (flags.version) {
    console.log(pkg.version);
    process.exit(0);
  }

  const cwd = process.cwd();

  if (!existsSync(join(cwd, "package.json"))) {
    console.error("No package.json found. Are you in a project root?");
    process.exit(1);
  }

  if (Number(process.versions.node.split(".")[0]) < 18) {
    console.error(
      `Node.js >= 18 is required. Current version: ${process.version}`
    );
    process.exit(1);
  }

  printBanner();

  const detected = detectPackageManager(cwd);
  const pm = flags.pm
    ? { ...detected, pm: flags.pm, install: `${flags.pm} add -D` }
    : detected;

  console.log(`Detected package manager: ${pm.pm}\n`);

  if (!flags.skipInstall) {
    try {
      console.log("[1/2] Installing prettier...");
      installPrettier(pm);

      console.log("\n[2/2] Installing plugins...");
      installPlugins(pm);
    } catch (err) {
      console.error(`\nInstallation failed:\n${err.message}`);
      process.exit(1);
    }
  }

  console.log("");

  const templatesDir = fileURLToPath(new URL("../templates/", import.meta.url));
  const prettierRc = readFileSync(
    join(templatesDir, ".prettierrc.json"),
    "utf-8"
  );
  const prettierIgnore = readFileSync(
    join(templatesDir, ".prettierignore"),
    "utf-8"
  );

  writeConfigFile(cwd, ".prettierrc.json", prettierRc, flags.force);
  writeConfigFile(cwd, ".prettierignore", prettierIgnore, flags.force);

  addScriptsToPackageJson(cwd);

  printSuccess();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
