# applecn Public Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the monorepo to applecn, swap ESLint and Prettier for oxlint and oxfmt, add the files a public GitHub repository needs to accept contributors, and ship an agent skill for the registry.

**Architecture:** Four self-contained commits on `feat/apple-design-system`, each leaving `pnpm check` green: (1) a mechanical rename plus one `site.ts` constant that replaces every hard-coded host; (2) root-level oxc configs replacing the per-package ESLint/Prettier setup, with lefthook and commitlint; (3) community, security and CI files modelled on shadcn-labs/pdfcn; (4) an in-repo `.agents/skills/applecn` skill and the public README. Guard tests in `apps/web/__tests__` pin the registry identity and fail on any leftover `apple-ds` or on install commands naming a registry item that does not exist.

**Tech Stack:** pnpm 10 workspaces, Turborepo, Next.js 16, vitest 5, oxlint 1.81.0 (+ oxlint-tsgolint 7.0.2001 for type-aware rules), oxfmt 0.66.0, lefthook 2.1.12, commitlint 21.2.2, GitHub Actions, the DCO GitHub App.

**Spec:** `docs/superpowers/specs/2026-09-05-applecn-public-release-design.md`

## Global Constraints

- Package scope is `@applecn`; root package name `applecn`; registry `name` is `applecn`; the style item stays `apple`.
- The only host constant is `SITE_URL` in `apps/web/lib/site.ts`, default `https://applecn.vercel.app`, overridable by `NEXT_PUBLIC_SITE_URL`. `REGISTRY_URL` is `${SITE_URL}/r`. `GITHUB_URL` is `https://github.com/STiXzoOR/applecn`.
- Formatting stays Prettier-compatible: `printWidth` 80, `semi` false, double quotes, `trailingComma` "es5", LF. Tailwind class order must not change in the migration.
- `sortImports` stays off. No changesets, renovate or knip.
- Every commit passes `pnpm check` (lint, format check, typecheck, test, build). Commits are Conventional Commits and end with the session trailers already used in this branch.
- Nothing is pushed; no remote is created; the working directory is not renamed.
- Shell note: the Bash tool's zsh has `noclobber` (use `>|`) and `rm -i` (use `command rm`). Binaries resolved by `xargs` are BSD, so call `gsed` explicitly there.
- Files under `docs/superpowers/` and `docs/research/` are history: they keep the old name, except for one note line added at the top of the earlier spec and plan.

---

### Task 1: Rename apple-ds to applecn

**Files:**

- Create: `apps/web/lib/site.ts`
- Create: `apps/web/__tests__/repo.test.ts`
- Modify: `apps/web/__tests__/registry.test.ts:41-44`
- Modify: `apps/web/scripts/registry-data.ts:219-224` (registry `name`, `homepage`)
- Modify: `apps/web/app/layout.tsx:9-16` (metadata)
- Modify: `apps/web/app/(docs)/page.tsx:83-86` and `apps/web/app/(docs)/components/[name]/page.tsx:102-105` (Install blocks)
- Modify (mechanical): every tracked file containing `apple-ds` outside `docs/superpowers/`, `docs/research/`, `pnpm-lock.yaml`
- Modify: `README.md:1`, `docs/superpowers/specs/2026-09-05-apple-design-system-design.md:1`, `docs/superpowers/plans/2026-09-05-apple-design-system.md:1` (title / note line)
- Regenerate: `pnpm-lock.yaml`, `apps/web/registry.json`

**Interfaces:**

- Produces: `SITE_URL: string`, `REGISTRY_URL: string`, `GITHUB_URL: string` from `apps/web/lib/site.ts`. Task 4's README and skill use the same literal host.
- Produces: `apps/web/__tests__/repo.test.ts` with a `registryNamesIn(markdown: string): string[]` helper Task 4 extends.

- [ ] **Step 1: Write the failing tests**

Change the style test in `apps/web/__tests__/registry.test.ts` and add an identity test:

```ts
import { SITE_URL } from "@/lib/site"
// ...existing imports stay

test("is named applecn and points at the site", () => {
  expect(registry.name).toBe("applecn")
  expect(registry.homepage).toBe(SITE_URL)
})
```

Create `apps/web/__tests__/repo.test.ts`:

```ts
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { buildRegistry } from "@/scripts/registry-data"

const root = join(process.cwd(), "../..")
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root })
  .toString()
  .split("\0")
  .filter(Boolean)

const history = /^(docs\/superpowers\/|docs\/research\/)/
const binary = /\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$/

/** Registry item names an install snippet mentions: `@applecn/<name>` or `/r/<name>.json`. */
export function registryNamesIn(markdown: string): string[] {
  const names = new Set<string>()
  for (const m of markdown.matchAll(/@applecn\/([a-z0-9-]+)/g)) names.add(m[1]!)
  for (const m of markdown.matchAll(/\/r\/([a-z0-9-]+)\.json/g))
    names.add(m[1]!)
  return [...names]
}

describe("repository hygiene", () => {
  test("no tracked file outside the history folders still says apple-ds", () => {
    const stale = tracked.filter(
      (f) =>
        !history.test(f) &&
        !binary.test(f) &&
        readFileSync(join(root, f), "utf8").includes("apple-ds")
    )
    expect(stale).toEqual([])
  })

  test("every registry item the README installs exists", () => {
    const items = new Set(buildRegistry().items.map((i) => i.name))
    const readme = readFileSync(join(root, "README.md"), "utf8")
    const mentioned = registryNamesIn(readme)
    expect(mentioned.length).toBeGreaterThan(0)
    expect(mentioned.filter((n) => !items.has(n))).toEqual([])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @apple-ds/web test -- repo registry`
Expected: FAIL — `@/lib/site` cannot be resolved; `registry.name` is `"apple-ds"`; the stale-name list is long; `mentioned.length` is 0 (the README has no `@applecn/` or `/r/<name>.json` with the placeholder host — `<your-host>` breaks the pattern).

- [ ] **Step 3: Create the site constant**

`apps/web/lib/site.ts`:

```ts
/**
 * The one place the site knows its own address. Vercel sets `NEXT_PUBLIC_SITE_URL` for a
 * custom domain; the default is the project's Vercel URL. Read by the registry generator
 * (the `homepage` field), the docs' Install blocks and the root layout's `metadataBase`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://applecn.vercel.app"
).replace(/\/$/, "")

export const REGISTRY_URL = `${SITE_URL}/r`

export const GITHUB_URL = "https://github.com/STiXzoOR/applecn"
```

- [ ] **Step 4: Mechanical rename**

```bash
cd /Users/stix/Projects/apple-ds
git ls-files -z \
  | grep -zvE '^(docs/superpowers/|docs/research/|pnpm-lock\.yaml$)' \
  | xargs -0 grep -lZ 'apple-ds' \
  | xargs -0 gsed -i 's/apple-ds/applecn/g'
git grep -l 'apple-ds' -- . ':!docs/superpowers' ':!docs/research' ':!pnpm-lock.yaml'
```

Expected: the last command prints nothing. (`@apple-ds/eslint-config` becomes `@applecn/eslint-config`; Task 2 deletes it.)

- [ ] **Step 5: Titles and hosts**

`apps/web/app/layout.tsx` — import `SITE_URL` and change `metadata`:

```ts
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "applecn", template: "%s · applecn" },
  description:
    "Apple’s Human Interface Guidelines as a shadcn design system on Base UI and Hugeicons.",
}
```

`apps/web/scripts/registry-data.ts` — add `import { SITE_URL } from "../lib/site.ts"` and set `name: "applecn", homepage: SITE_URL`.

`apps/web/app/(docs)/page.tsx` — import `REGISTRY_URL` from `@/lib/site` and replace the code string:

```ts
code={`npx shadcn@latest add ${REGISTRY_URL}/apple.json\nnpx shadcn@latest add ${REGISTRY_URL}/button.json ${REGISTRY_URL}/list.json`}
```

`apps/web/app/(docs)/components/[name]/page.tsx` — same import; `code={`npx shadcn@latest add ${REGISTRY_URL}/${doc.name}.json`}`.

`README.md` — first line `# applecn`; replace the two `https://<your-host>/r/...` lines with `https://applecn.vercel.app/r/apple.json` and `.../r/button.json`. (Task 4 rewrites the README fully; this keeps Task 1's test honest.)

Add as the first line of `docs/superpowers/specs/2026-09-05-apple-design-system-design.md` and `docs/superpowers/plans/2026-09-05-apple-design-system.md`, after the title:

```md
> Renamed to **applecn** on 2026-09-05 (`@applecn/*`); see `docs/superpowers/specs/2026-09-05-applecn-public-release-design.md`. Package names below are historical.
```

- [ ] **Step 6: Regenerate the lockfile and the registry**

```bash
pnpm install
pnpm registry:build
git status --short | head -20
```

Expected: `pnpm-lock.yaml` importer links now say `@applecn/...`; `apps/web/registry.json` has `"name": "applecn"` and the Vercel homepage.

- [ ] **Step 7: Run the tests and the full gate**

Run: `pnpm --filter @applecn/web test` then `pnpm check`
Expected: all green, including the existing `docs.test.ts` and `registry.test.ts` "committed registry.json is the generator output".

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(repo): rename apple-ds to applecn

The package scope, registry name and site title become applecn. One constant in
apps/web/lib/site.ts replaces every hard-coded host; a repo test fails on any leftover
apple-ds outside the history folders.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0144XmffgCpsCzS4Mx2UEmhH"
```

---

### Task 2: oxlint and oxfmt replace ESLint and Prettier

**Files:**

- Delete: `packages/eslint-config/` (whole directory), `.eslintrc.js`, `.prettierrc`, `.prettierignore`, `apps/web/eslint.config.js`, `packages/ui/eslint.config.js`, `packages/ui/tsconfig.lint.json`
- Create: `.oxlintrc.json`, `.oxfmtrc.jsonc`, `lefthook.yml`, `commitlint.config.mjs`, `.editorconfig`, `.node-version`, `.vscode/settings.json`, `.vscode/extensions.json`
- Modify: `package.json` (root), `packages/ui/package.json`, `apps/web/package.json`, `turbo.json`, `pnpm-workspace.yaml`
- Regenerate: `pnpm-lock.yaml`

**Interfaces:**

- Produces: root scripts `lint:check`, `lint:fix`, `format`, `format:check`, `check`, `prepare`. Task 3's CI and CONTRIBUTING call `pnpm check`; Task 3's PR template names `pnpm check`.

- [ ] **Step 1: Remove the old toolchain**

```bash
command rm -r packages/eslint-config .eslintrc.js .prettierrc .prettierignore \
  apps/web/eslint.config.js packages/ui/eslint.config.js packages/ui/tsconfig.lint.json
```

In `packages/ui/package.json` and `apps/web/package.json`: delete the `lint` and `format` scripts and the `@applecn/eslint-config` and `eslint` devDependencies. In `turbo.json`: delete the `lint` and `format` tasks. In the root `package.json` delete `@applecn/eslint-config`, `prettier`, `prettier-plugin-tailwindcss`.

- [ ] **Step 2: Root package.json scripts and dependencies**

```json
"scripts": {
  "build": "turbo build",
  "dev": "turbo dev --filter=@applecn/web",
  "lint:check": "oxlint --type-aware .",
  "lint:fix": "oxlint --type-aware --fix .",
  "format": "oxfmt .",
  "format:check": "oxfmt --check .",
  "typecheck": "turbo typecheck",
  "test": "turbo test",
  "check": "pnpm lint:check && pnpm format:check && pnpm typecheck && pnpm test && pnpm build",
  "tokens:build": "pnpm --filter @applecn/ui tokens:build",
  "registry:build": "pnpm --filter @applecn/web registry:build",
  "ui:add": "pnpm --filter @applecn/ui exec shadcn add",
  "prepare": "lefthook install"
},
"devDependencies": {
  "@applecn/typescript-config": "workspace:*",
  "@commitlint/cli": "21.2.2",
  "@commitlint/config-conventional": "21.2.2",
  "lefthook": "2.1.12",
  "oxfmt": "0.66.0",
  "oxlint": "1.81.0",
  "oxlint-tsgolint": "7.0.2001",
  "turbo": "^2.9.18",
  "typescript": "^5"
},
"engines": { "node": ">=22" }
```

`pnpm-workspace.yaml` `allowBuilds` gains `oxlint-tsgolint: true` and `lefthook: true`.

- [ ] **Step 3: Write the configs**

`.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "import",
    "jsx-a11y",
    "nextjs",
    "oxc",
    "promise",
    "react",
    "typescript",
    "unicorn",
    "vitest"
  ],
  "categories": { "correctness": "warn", "suspicious": "warn", "perf": "warn" },
  "env": { "browser": true, "node": true, "es2026": true },
  "rules": {
    "curly": ["error", "multi-line"],
    "eqeqeq": ["warn", "always", { "null": "ignore" }],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unassigned-import": "off",
    "no-debugger": "error",
    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "no-var": "error",
    "prefer-const": "error",
    "react/display-name": "off",
    "react/exhaustive-deps": "warn",
    "react/jsx-key": "error",
    "react/jsx-no-target-blank": "error",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "off",
    "react/react-in-jsx-scope": "off",
    "react/rules-of-hooks": "error",
    "typescript/consistent-type-imports": [
      "error",
      { "disallowTypeAnnotations": false }
    ],
    "typescript/no-explicit-any": "off",
    "typescript/no-non-null-assertion": "off",
    "typescript/no-require-imports": "error",
    "unicorn/consistent-function-scoping": "off",
    "vitest/valid-expect": "off"
  },
  "overrides": [
    {
      "files": ["apps/web/**/*.{ts,tsx}"],
      "rules": {
        "nextjs/no-html-link-for-pages": "off",
        "nextjs/no-img-element": "off",
        "nextjs/no-sync-scripts": "error",
        "nextjs/no-head-element": "warn",
        "nextjs/no-async-client-component": "warn"
      }
    }
  ],
  "ignorePatterns": [
    "**/*.config.{js,mjs,ts,mts}",
    "**/.next/**",
    "**/.turbo/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
    "apps/web/public/**",
    "apps/web/registry/examples.generated.ts",
    "docs/**"
  ]
}
```

`.oxfmtrc.jsonc`:

```jsonc
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  // Prettier-compatible: the tree was formatted with these values, so the swap is a no-op.
  "printWidth": 80,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": false,
  "trailingComma": "es5",
  "endOfLine": "lf",
  "sortPackageJson": false,
  // Same algorithm as prettier-plugin-tailwindcss; the stylesheet is Tailwind v4's entry.
  "sortTailwindcss": {
    "stylesheet": "packages/ui/src/styles/globals.css",
    "functions": ["cn", "cva"],
  },
  // Generated files are regenerated, never edited; docs/research holds verbatim captures.
  "ignorePatterns": [
    "pnpm-lock.yaml",
    "**/node_modules/**",
    "**/.next/**",
    "**/.turbo/**",
    "apps/web/public/**",
    "apps/web/registry.json",
    "apps/web/registry/examples.generated.ts",
    "packages/ui/src/styles/tokens.css",
    "docs/research/**",
    "**/AGENTS.md",
  ],
}
```

`lefthook.yml`:

```yaml
# Staged files: oxlint's safe fixes, then oxfmt, in that order so they never race on a file.
pre-commit:
  jobs:
    - name: lint
      glob: "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}"
      run: pnpm exec oxlint --fix --no-error-on-unmatched-pattern {staged_files}
      stage_fixed: true
    - name: format
      glob: "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,json,jsonc,md,css,yml,yaml}"
      run: pnpm exec oxfmt --no-error-on-unmatched-pattern {staged_files}
      stage_fixed: true

commit-msg:
  jobs:
    - name: commitlint
      run: pnpm exec commitlint --edit {1}
```

`commitlint.config.mjs`:

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "ui",
        "web",
        "tokens",
        "registry",
        "docs",
        "spec",
        "skills",
        "ci",
        "lint",
        "deps",
        "repo",
        "release",
      ],
    ],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
}
```

`.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

`.node-version`: `24`

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.oxc": "explicit" },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

`.vscode/extensions.json`: `{ "recommendations": ["oxc.oxc-vscode", "bradlc.vscode-tailwindcss"] }`

- [ ] **Step 4: Install and lint**

```bash
pnpm install
pnpm lint:check
```

Expected: 0 errors. Warnings are read one by one: fix real ones in code (only-warn used to hide everything), turn off a rule in `.oxlintrc.json` only when it is wrong for this codebase, and say which in the commit body.

- [ ] **Step 5: Format and prove the swap is a no-op**

```bash
pnpm format
git diff --stat
git diff -U0 -- '*.tsx' | grep -E '^[-+].*className' | head
```

Expected: a handful of files at most (`vitest.config.mts` quote style, `.mts` files were outside Prettier's glob). The className grep prints nothing: class order is unchanged. If it prints anything, the `stylesheet` path is wrong; fix it rather than accept the reorder.

- [ ] **Step 6: Full gate and hooks**

```bash
pnpm check
pnpm exec lefthook install
```

Expected: green. `.git/hooks/pre-commit` and `commit-msg` now exist.

- [ ] **Step 7: Commit (this exercises both hooks)**

```bash
git add -A
git commit -m "build(lint): replace eslint and prettier with oxlint and oxfmt

Root-level .oxlintrc.json (type-aware) and .oxfmtrc.jsonc carrying the Prettier settings the
tree already used, so no file reformats and Tailwind class order is unchanged. lefthook runs
both on staged files; commitlint enforces the conventional scopes the history already uses.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0144XmffgCpsCzS4Mx2UEmhH"
```

---

### Task 3: Community files, issue forms and CI

**Files:**

- Create: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- Create: `.github/CODEOWNERS`, `.github/dco.yml`, `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/bug_report.yml`, `.github/ISSUE_TEMPLATE/feature_request.yml`, `.github/pull_request_template.md`, `.github/actions/setup/action.yml`, `.github/workflows/ci.yml`
- Modify: `package.json`, `packages/ui/package.json`, `apps/web/package.json`, `packages/typescript-config/package.json` (`license`, `repository`)

**Interfaces:**

- Consumes: `pnpm check` from Task 2.
- Produces: the section anchors `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` that Task 4's README links.

- [ ] **Step 1: License and manifest fields**

`LICENSE`: the MIT text with `Copyright (c) 2026 Neoptolemos Kyriakou` (standard wording as in shadcn-labs/pdfcn's LICENSE).

Every `package.json`: `"license": "MIT"`; `packages/typescript-config/package.json` drops `"license": "PROPRIETARY"` and `publishConfig`. Root adds:

```json
"repository": { "type": "git", "url": "git+https://github.com/STiXzoOR/applecn.git" },
"homepage": "https://applecn.vercel.app",
"bugs": "https://github.com/STiXzoOR/applecn/issues"
```

- [ ] **Step 2: CONTRIBUTING.md**

````md
# Contributing to applecn

Thanks for helping. This covers getting the repo running and landing a change.

## Prerequisites

- Node 22 or newer (CI uses the version in `.node-version`)
- pnpm, the version pinned in `package.json` (`corepack enable` picks it up)

## Getting started

```sh
git clone https://github.com/STiXzoOR/applecn.git
cd applecn
pnpm install        # also installs the git hooks
pnpm dev            # http://localhost:3000
```
````

## The gate

`pnpm check` is what CI runs; run it before you push.

| Command             | Checks                                                  |
| ------------------- | ------------------------------------------------------- |
| `pnpm lint:check`   | oxlint, type-aware                                      |
| `pnpm format:check` | oxfmt (`pnpm format` fixes)                             |
| `pnpm typecheck`    | tsc in every workspace                                  |
| `pnpm test`         | vitest: tokens, components (roles, keyboard, axe), docs |
| `pnpm build`        | registry, then the site                                 |

The pre-commit hook runs oxlint and oxfmt on staged files; the commit-msg hook checks the
message.

## Rules that keep the system coherent

Read `AGENTS.md` and `packages/ui/AGENTS.md`. The short version:

- **Tokens first.** No literal colour, size, radius or duration in a component. A missing
  value becomes a token in `packages/ui/src/tokens/`, with its source recorded in
  `docs/research/apple-design-system-reference.md`, then `pnpm tokens:build`.
- **Base UI and Hugeicons only.** No Radix, no vaul, no lucide.
- **Tests first.** Every component, token module and page starts with a failing test.
- **Generated files are regenerated, never edited**: `tokens.css`, `registry.json`,
  `registry/examples.generated.ts`, `public/r/`.
- **Documentation is data.** A new component needs an entry in `apps/web/registry/index.ts`
  and an example under `apps/web/registry/examples/<name>/`; a test enforces both.

### Adding a component

1. `pnpm ui:add <name>` if shadcn has a counterpart to restyle, otherwise start a file in
   `packages/ui/src/components/`.
2. Write the test in `packages/ui/__tests__/<name>.test.tsx` first: roles, states, keyboard,
   axe.
3. Add the doc entry and at least one example; `pnpm --filter @applecn/web examples:build`.
4. `pnpm registry:build`, then `pnpm check`.

## Commits

Conventional Commits, enforced by commitlint: `type(scope): subject`. Scopes: `ui`, `web`,
`tokens`, `registry`, `docs`, `spec`, `skills`, `ci`, `lint`, `deps`, `repo`, `release`.

Every commit is signed off (`git commit -s`), which adds a `Signed-off-by` line certifying
the [Developer Certificate of Origin](https://developercertificate.org/). The DCO check on
pull requests fails without it.

## Before opening a pull request

Open or find an issue first and say you are taking it. For anything non-trivial, wait for a
maintainer to agree the direction before writing code. Keep one purpose per pull request; no
drive-by refactors or formatting-only changes. A design change needs the Apple source it is
based on, in the research document.

## Submitting

1. Branch from `main`, link the issue, make the change with tests and docs.
2. `pnpm check` passes; commits are signed off.
3. Open the pull request; the template asks for the summary, validation and checklist.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

````

- [ ] **Step 3: CODE_OF_CONDUCT.md and SECURITY.md**

`CODE_OF_CONDUCT.md`: Contributor Covenant 2.1, fetched verbatim:

```bash
curl -fsSL https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md >| CODE_OF_CONDUCT.md
````

Replace `[INSERT CONTACT METHOD]` with: `the maintainer, privately, through a GitHub security advisory at https://github.com/STiXzoOR/applecn/security/advisories/new or a direct message to @STiXzoOR on GitHub`. If the URL is unavailable, copy the 2.0 text from `shadcn-labs/pdfcn`'s `CODE_OF_CONDUCT.md` and apply the same replacement.

`SECURITY.md`:

```md
# Security

## Reporting a vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/STiXzoOR/applecn/security/advisories/new).
Do not open a public issue.

Include what you found, how to reproduce it and what it allows. We aim to acknowledge within
3 working days and to have an assessment within 14 days, and will credit you unless you would
rather we did not.

## Scope

- The site and its route handlers.
- The registry JSON under `/r/` and the component sources it ships.

Out of scope: the Apple web properties the token values were measured from, and reports from
automated scanners with no demonstrated impact.
```

- [ ] **Step 4: .github**

`.github/CODEOWNERS`: `* @STiXzoOR`

`.github/dco.yml`:

```yaml
require:
  members: true
allowRemediationCommits:
  individual: true
```

`.github/ISSUE_TEMPLATE/config.yml`:

```yaml
blank_issues_enabled: false
contact_links:
  - name: Question or idea
    url: https://github.com/STiXzoOR/applecn/discussions
    about: Ask a question or discuss an idea before it becomes an issue.
  - name: Security issue
    url: https://github.com/STiXzoOR/applecn/blob/main/SECURITY.md
    about: Do not open a public issue. Report privately through a security advisory.
```

`.github/ISSUE_TEMPLATE/bug_report.yml`:

```yaml
name: Bug report
description: Something renders or behaves differently from Apple's, or breaks.
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Search existing issues first. For a visual mismatch, a screenshot next to the Apple
        reference (HIG page, app, or web property) is the most useful thing you can give.
  - type: input
    id: component
    attributes:
      label: Component or page
      placeholder: "sheet, /foundations/color, registry"
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Install `@applecn/sheet`
        2. Open it at 390 px
        3. See …
    validations:
      required: true
  - type: textarea
    id: behavior
    attributes:
      label: Current vs expected behaviour
      description: What happens, and what Apple's counterpart does. Link the HIG page or name the app.
    validations:
      required: true
  - type: dropdown
    id: platform
    attributes:
      label: Platform idiom
      multiple: true
      options:
        [
          "iOS (default)",
          "macOS (data-platform)",
          "Dark mode",
          "Increase Contrast",
          "Reduce Transparency",
        ]
  - type: textarea
    id: environment
    attributes:
      label: Environment
      render: shell
      placeholder: |
        Browser: Safari 26 / Chrome 140
        Next: 16.2.6
        Node: v24
    validations:
      required: true
```

`.github/ISSUE_TEMPLATE/feature_request.yml`:

```yaml
name: Feature request
description: A component, token or behaviour Apple has that applecn does not.
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: What are you trying to build?
      description: The use case, and which Apple control or pattern it corresponds to.
    validations:
      required: true
  - type: input
    id: source
    attributes:
      label: Apple source
      description: HIG page, UIKit/AppKit API, or the Apple web page where the behaviour can be measured.
      placeholder: "https://developer.apple.com/design/human-interface-guidelines/…"
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: API sketch or example if you have one.
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
```

`.github/pull_request_template.md`:

```md
### Summary

<!-- Link the issue ("Closes #123"). What changes for a user of the design system, and why. -->

### Apple source

<!-- For any visual or metric change: the HIG page, API, or measured Apple web page. -->

### Validation

<!-- Commands run and manual checks: viewports, dark mode, macOS idiom, keyboard, VoiceOver. -->

### Checklist

- [ ] Linked an issue where the change was agreed
- [ ] Tests first; `pnpm check` passes
- [ ] Generated files regenerated (`pnpm tokens:build`, `pnpm registry:build`) rather than edited
- [ ] Docs entry and example updated for a component change
- [ ] Commits are signed off (`git commit -s`)
```

`.github/actions/setup/action.yml`:

```yaml
name: Setup
description: pnpm, Node and dependencies
runs:
  using: composite
  steps:
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v6
      with:
        node-version-file: .node-version
        cache: pnpm
    - shell: bash
      run: pnpm install --frozen-lockfile
```

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

jobs:
  check:
    runs-on: ubuntu-latest
    env:
      NEXT_TELEMETRY_DISABLED: 1
      TURBO_TELEMETRY_DISABLED: 1
    steps:
      - uses: actions/checkout@v5
      - uses: ./.github/actions/setup
      - run: pnpm check
```

- [ ] **Step 5: Verify**

```bash
pnpm format:check
for f in .github/workflows/ci.yml .github/actions/setup/action.yml .github/ISSUE_TEMPLATE/*.yml .github/dco.yml lefthook.yml; do ruby -ryaml -e "YAML.load_file('$f')" && echo "ok $f"; done
pnpm check
```

Expected: every YAML parses; the gate is green (only Markdown, YAML and JSON fields changed).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -s -m "chore(repo): community files, issue forms and CI for public release

MIT licence, contributing guide with the DCO sign-off, Contributor Covenant, a security
policy that routes to GitHub advisories, issue forms that ask for the Apple source, a PR
template, and one CI workflow that runs pnpm check.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0144XmffgCpsCzS4Mx2UEmhH"
```

---

### Task 4: Agent skill and the public README

**Files:**

- Create: `.agents/skills/applecn/SKILL.md`
- Modify: `apps/web/__tests__/repo.test.ts` (extend the install-name test to the skill)
- Rewrite: `README.md`
- Modify (outside the repo, machine-local): `~/Vault/Projects/apple-ds.md` → `~/Vault/Projects/applecn.md` plus `~/Vault/Projects/index.md`; `~/.claude/projects/-Users-stix-Projects-apple-ds/memory/apple-ds-project.md` and `MEMORY.md`

**Interfaces:**

- Consumes: `registryNamesIn` from Task 1; `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` from Task 3.

- [ ] **Step 1: Extend the failing test**

In `apps/web/__tests__/repo.test.ts` replace the README test with one over both documents:

```ts
test.each(["README.md", ".agents/skills/applecn/SKILL.md"])(
  "every registry item %s installs exists",
  (file) => {
    const items = new Set(buildRegistry().items.map((i) => i.name))
    const mentioned = registryNamesIn(readFileSync(join(root, file), "utf8"))
    expect(mentioned.length).toBeGreaterThan(0)
    expect(mentioned.filter((n) => !items.has(n))).toEqual([])
  }
)

test("the skill has the frontmatter the skills CLI needs", () => {
  const skill = readFileSync(
    join(root, ".agents/skills/applecn/SKILL.md"),
    "utf8"
  )
  expect(skill).toMatch(/^---\nname: applecn\ndescription: /)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @applecn/web test -- repo`
Expected: FAIL with ENOENT for `.agents/skills/applecn/SKILL.md`.

- [ ] **Step 3: Generate the component list and write the skill**

```bash
node -e '
import("./apps/web/registry/index.ts").then(({ componentDocs, componentGroups }) => {
  for (const g of componentGroups) {
    console.log(`\n### ${g[0].toUpperCase()}${g.slice(1)}\n`)
    for (const d of componentDocs.filter((d) => d.group === g))
      console.log(`- \`${d.name}\` — ${d.title} (${d.apple.name}): ${d.description}`)
  }
})'
```

Paste the output into the "Components" section of `.agents/skills/applecn/SKILL.md`:

````md
---
name: applecn
description: >-
  Build Apple-style UI in React or Next.js with applecn, a shadcn registry that reproduces
  Apple's Human Interface Guidelines (iOS 26 Liquid Glass by default, macOS as a switch) on
  Base UI and Hugeicons. Use whenever the user wants Apple, iOS, macOS, HIG or Liquid Glass
  styling, mentions applecn, or installs from this registry — even if they only say "make it
  look like an Apple app".
compatibility: A React 19 project with Tailwind CSS 4 and the shadcn CLI (npx shadcn@latest).
---

# applecn

A shadcn registry: Apple's tokens as CSS variables, one stylesheet of utilities, and 45
components on Base UI primitives with Hugeicons. Site and registry: https://applecn.vercel.app.
Source: https://github.com/STiXzoOR/applecn.

## Install

Register the namespace once in the project's `components.json`:

```json
{ "registries": { "@applecn": "https://applecn.vercel.app/r/{name}.json" } }
```
````

Then add the theme, and components as needed (dependencies resolve automatically):

```sh
npx shadcn@latest add @applecn/apple
npx shadcn@latest add @applecn/button @applecn/list @applecn/sheet
```

Without the namespace, the URL form works: `npx shadcn@latest add https://applecn.vercel.app/r/button.json`.

`@applecn/apple` is a style item: every token as `cssVars` (light and dark) plus the `type-*`,
`material-*`, `glass*`, `hairline*` and `pressable` utilities. shadcn's own names (`--primary`,
`--card`, `--border`, …) alias Apple's roles, so existing shadcn components pick up the theme.

## Using it

- **Text styles are utilities**: `type-large-title` … `type-caption-2`, never `text-<style>`
  (tailwind-merge reads `text-body` as a colour). The `Text` component takes `style` and `color`.
- **Colours are roles**: `bg-system-blue`, `text-label`, `text-label-2`, `bg-background-2`,
  `bg-fill`, `border-separator`. Never a literal hex or rgb value.
- **Shapes and motion** come from the ladder: `rounded-sheet`, `rounded-card`, `shadow-thumb`,
  `ease-sheet`, `duration-menu`.
- **Platform switch**: wrap with `PlatformProvider` from `@applecn/platform` or stamp
  `data-platform="macos"` on `<html>`; every control re-measures in CSS. `data-elevated` raises
  a dark surface one step (portals set it themselves). `[data-contrast="more"]` is Increase
  Contrast; `prefers-reduced-transparency` swaps glass for opaque materials.
- **Overlays adapt**: `Sheet` is a bottom sheet with detents on a phone and a centred card from
  `sm`; `ActionSheet` becomes a popover on desktop. Tab bars, toolbars and menus float on glass.
- **Icons**: `Icon` wraps Hugeicons with the SF Symbols sizing model (`scale`, `weight`); do
  not import lucide.
- **Conventions**: `data-slot` on every element, `cva` variants, `cn`, no `forwardRef`.

## Components

<!-- generated list here -->

## Gotchas

- Base UI's `Select` needs `items` on the root to show labels; `Tabs.List` needs
  `activateOnFocus` for arrow-key activation.
- Overlays portal to `body`: give them `data-elevated` if you build your own.
- The theme is exact sRGB from Apple's published tables and measured Apple web CSS; three
  values are documented approximations (iOS 26 tab bar height, bottom-sheet radius, macOS
  switch/stepper/alert width). See the research document in the repo before "correcting" one.

````

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @applecn/web test -- repo`
Expected: PASS. If a generated line names an item that does not exist, the generator output is wrong, not the test.

- [ ] **Step 5: README**

Replace the top of `README.md` (everything above "## How it is built") with:

```md
<h1 align="center">applecn</h1>

<p align="center">
  Apple's Human Interface Guidelines as a <a href="https://ui.shadcn.com">shadcn</a> design system.<br/>
  The iOS 26 Liquid Glass idiom by default, macOS as a switch, on <a href="https://base-ui.com">Base UI</a> primitives with <a href="https://hugeicons.com">Hugeicons</a>. Copy, paste, own the code.
</p>

<p align="center">
  <a href="https://applecn.vercel.app">Site</a> ·
  <a href="https://applecn.vercel.app/foundations/color">Foundations</a> ·
  <a href="https://applecn.vercel.app/components/button">Components</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

## Install

Register the namespace once in your `components.json`, then add the theme and any component:

```json
{ "registries": { "@applecn": "https://applecn.vercel.app/r/{name}.json" } }
````

```sh
npx shadcn@latest add @applecn/apple      # the theme: every token, light and dark
npx shadcn@latest add @applecn/button     # a component and its dependencies
```

Or by URL: `npx shadcn@latest add https://applecn.vercel.app/r/button.json`.

## Features

- **Exact values, with sources.** Colours, type, Dynamic Type, geometry and motion from the
  HIG and UIKit; what Apple does not publish was measured from Apple's own web apps.
  `docs/research/apple-design-system-reference.md` lists every number and where it came from.
- **Tokens as data.** `packages/ui/src/tokens/*.ts` generate the stylesheet; tests fail if it drifts.
- **One switch per idiom.** `data-platform`, dark mode, elevated surfaces, Increase Contrast,
  Reduce Transparency and Dynamic Type are handled in CSS.
- **45 components on Base UI.** shadcn conventions, `data-slot`, `cva`, tests with axe.
- **A registry and a site.** Every component page has live examples, source and an install command.
- **Agent-ready.** `npx skills add STiXzoOR/applecn` installs a skill that teaches coding agents the registry and its rules.

## Develop

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # lint + format check + typecheck + tests + build
```

Other scripts: `pnpm test`, `pnpm tokens:build` (regenerate `tokens.css` after editing a token module), `pnpm registry:build` (regenerate `registry.json` and `public/r`), `pnpm --filter @applecn/web examples:build` (regenerate the example map), `pnpm ui:add <name>` (pull a shadcn registry component into `packages/ui` to restyle).

````

Keep "How it is built", "What is exact and what is approximated" and "Layout" as they are (with Task 1's substitutions), and append:

```md
## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the gate and the rules. Use
[issues](https://github.com/STiXzoOR/applecn/issues) for bugs and requests and
[discussions](https://github.com/STiXzoOR/applecn/discussions) for questions. By participating
you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Do not open public issues for vulnerabilities; follow [SECURITY.md](SECURITY.md).

## Trademarks

Apple, iOS, iPadOS, macOS, SF Pro and SF Symbols are trademarks of Apple Inc. applecn is an
independent open-source project and is not affiliated with, endorsed by or sponsored by Apple.
It ships no Apple fonts, icons or artwork: the system font stack resolves to San Francisco on
Apple devices, and Hugeicons stands in for SF Symbols.

## License

[MIT](LICENSE)
````

- [ ] **Step 6: Notes outside the repo**

`git mv`-style rename in the vault: `~/Vault/Projects/apple-ds.md` → `~/Vault/Projects/applecn.md`, content updated to the new name, the toolchain and the release follow-ups; update `~/Vault/Projects/index.md`. Rewrite `~/.claude/projects/-Users-stix-Projects-apple-ds/memory/apple-ds-project.md` to the current state and update the pointer line in `MEMORY.md`.

- [ ] **Step 7: Full gate and commit**

```bash
pnpm check
git add -A
git commit -s -m "docs(skills): applecn agent skill and README for release

.agents/skills/applecn teaches an agent the install forms, the token rules, the platform
switch and every component; a repo test checks each item it names exists in the registry.
The README leads with the namespaced install and adds contributing, security and trademark
sections.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0144XmffgCpsCzS4Mx2UEmhH"
```

---

## Owner follow-ups (after the four commits)

1. `mv ~/Projects/apple-ds ~/Projects/applecn`
2. Create `STiXzoOR/applecn` (public) on GitHub; `git remote add origin git@github.com:STiXzoOR/applecn.git`; push the branch; merge into `main` (fast-forward).
3. Repository settings: install the DCO app, enable Discussions, enable private vulnerability reporting, protect `main` (require the `check` job and DCO, block force-push).
4. Vercel: import the repo with root directory `apps/web`; set `NEXT_PUBLIC_SITE_URL` only if the domain is not `applecn.vercel.app`.
5. Optional: `npx skills add shadcn-labs/skills --skill launch-shadcn-registry` to list the registry in the shadcn directory.
