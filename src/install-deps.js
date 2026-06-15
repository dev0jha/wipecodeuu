import { execSync } from "node:child_process";

export function installPrettier(pm) {
  console.log(`  ${pm.install} prettier`);
  execSync(`${pm.install} prettier`, { stdio: "inherit" });
}

export function installPlugins(pm) {
  const plugins =
    "@trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss";
  console.log(`  ${pm.install} ${plugins}`);
  execSync(`${pm.install} ${plugins}`, { stdio: "inherit" });
}
