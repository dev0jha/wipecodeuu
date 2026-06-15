# wipecodeuu

[![npm](https://img.shields.io/npm/v/wipecodeuu)](https://www.npmjs.com/package/wipecodeuu)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/wipecodeuu)](LICENSE)

> One command to set up Prettier with import sorting + Tailwind — zero config, zero thinking.

```bash
npx wipecodeuu
```

Detects your package manager, installs `prettier` + `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`, and writes opinionated `.prettierrc.json` + `.prettierignore`. Done.

## How it works

| Step | What happens |
|------|-------------|
| 1 | Detects package manager from lock files (bun → pnpm → yarn → npm) |
| 2 | Installs prettier + plugins via `add -d` |
| 3 | Writes `.prettierrc.json` with sorted imports, Tailwind plugin, LF line endings |
| 4 | Writes `.prettierignore` covering deps, builds, env, IDE, OS files |

## Options

| Flag | Purpose |
|------|---------|
| `--force` | Overwrite existing config files |
| `--skip-install` | Config files only, no deps |
| `--pm <name>` | Override detected package manager |
| `--help` / `--version` | Help / version info |

## Also works with

```bash
bunx wipecodeuu    # bun
pnpx wipecodeuu   # pnpm
yarn dlx wipecodeuu  # yarn
```
