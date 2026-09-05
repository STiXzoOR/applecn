# applecn: rename, oxc toolchain, public release

Date: 2026-09-05. Approved by the owner in session; supersedes nothing — it extends
`2026-09-05-apple-design-system-design.md`, which still describes the design system itself.

## Goal

Take the finished `apple-ds` monorepo to a state where it can be pushed to a public GitHub
repository and accept outside contributions:

1. The project is called **applecn** everywhere.
2. Linting and formatting run on **oxlint** and **oxfmt**; ESLint and Prettier are gone.
3. The repository carries the community, security and CI files a public project needs.
4. An in-repo **agent skill** teaches coding agents how to use the registry.

## Non-goals

- Creating the GitHub remote, pushing, or deploying. Those are the owner's actions and are
  listed as follow-ups at the end.
- Publishing packages to npm. Nothing here is an npm package; the registry is copy-paste. So
  no changesets, no release workflow, no renovate, no knip.
- Renaming the working directory on disk. The session runs inside it; the owner runs
  `mv ~/Projects/apple-ds ~/Projects/applecn` afterwards.
- Import sorting. `sortImports` stays off so the migration diff stays readable; it can be
  enabled later in its own commit.
- Merging `feat/apple-design-system` into `main`. Fast-forward, owner's call.

## 1. Naming

| Before                       | After                        |
| ---------------------------- | ---------------------------- |
| root package `apple-ds`      | `applecn`                    |
| `@apple-ds/ui`               | `@applecn/ui`                |
| `@apple-ds/web`              | `@applecn/web`               |
| `@apple-ds/typescript-config`| `@applecn/typescript-config` |
| `@apple-ds/eslint-config`    | deleted (see §2)             |
| registry `name: "apple-ds"`  | `name: "applecn"`            |
| registry `homepage`          | the site URL constant        |
| "Apple design system" (title)| "applecn"                    |

The `apple` style item keeps its name: `npx shadcn@latest add @applecn/apple` reads as "the
Apple theme from applecn".

Every occurrence of `apple-ds` in tracked files changes: imports (163 of `@apple-ds/ui`),
tsconfig `paths`, both `components.json`, the vitest alias, `next.config.ts`
`transpilePackages`, turbo's `@apple-ds/web#build` task, `pnpm --filter` invocations in
scripts and docs, README, both AGENTS files, the earlier spec and plan (a one-line note at
the top of each saying the project was renamed, plus the substitutions), and the generated
`registry.json` and `public/r/*` (regenerated, not edited).

**Site URL.** `apps/web/lib/site.ts` exports `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`,
default `https://applecn.vercel.app`) and `REGISTRY_URL` (`${SITE_URL}/r`). The README's
install block, the two Install code blocks in the docs pages, the registry `homepage`, and
`metadataBase` in the root layout all read from it. `<your-host>` disappears.

**Install story in docs.** Two forms are shown: the namespaced form once the consumer has
added the registry to `components.json`

```json
{ "registries": { "@applecn": "https://applecn.vercel.app/r/{name}.json" } }
```

and the URL form `npx shadcn@latest add https://applecn.vercel.app/r/button.json`.

## 2. Toolchain

**Removed.** `packages/eslint-config` (whole package), `eslint`, `prettier`,
`prettier-plugin-tailwindcss`, `eslint-config-prettier` and friends from every
`package.json`; `.eslintrc.js`, `.prettierrc`, `.prettierignore`, `apps/web/eslint.config.js`,
`packages/ui/eslint.config.js`, `packages/ui/tsconfig.lint.json` if nothing else uses it; the
per-package `lint` and `format` scripts; the `lint` and `format` tasks in `turbo.json`.

**Added.**

- `oxlint`, `oxlint-tsgolint`, `oxfmt`, `lefthook`, `@commitlint/cli`,
  `@commitlint/config-conventional` as root devDependencies, pinned to the versions on npm
  today (oxlint 1.81.0, oxfmt 0.66.0, oxlint-tsgolint 7.0.2001, lefthook 2.1.12,
  commitlint 21.2.2). `pnpm-workspace.yaml` `allowBuilds` gains `oxlint-tsgolint` and
  `lefthook`.
- `.oxlintrc.json` at the root: plugins `import`, `jsx-a11y`, `nextjs`, `oxc`, `promise`,
  `react`, `typescript`, `unicorn`, `vitest`; categories correctness/suspicious/perf as
  warnings; the explicit rule set from the owner's altshelf config minus its house plugin and
  its `simple-import-sort`/`turbo` JS plugins; `react/react-in-jsx-scope` off,
  `react/rules-of-hooks` error, `typescript/consistent-type-imports` error; `nextjs/*` rules
  scoped to `apps/web`; ignores for `.next`, `node_modules`, `public`, generated files and
  `*.config.*`.
- `.oxfmtrc.jsonc` at the root, carrying the Prettier settings the code is already
  formatted with so the swap does not reformat the tree: `printWidth` 80, `tabWidth` 2,
  `semi` false, `singleQuote` false, `trailingComma` "es5", `endOfLine` "lf",
  `sortPackageJson` false, `sortTailwindcss` with
  `stylesheet: "packages/ui/src/styles/globals.css"` and `functions: ["cn", "cva"]`,
  `ignorePatterns` = the old `.prettierignore` entries plus `docs/research/**` (verbatim
  captures) and `**/AGENTS.md`.
- Root scripts: `lint:check` (`oxlint --type-aware .`), `lint:fix`, `format` (`oxfmt .`),
  `format:check` (`oxfmt --check .`); `lint` and `format:check` in `check` become the new
  names, so `pnpm check` still means lint, format, typecheck, test, build.
- `lefthook.yml`: pre-commit runs `oxlint --fix` then `oxfmt` on staged files with
  `stage_fixed`; commit-msg runs commitlint. `prepare` script installs the hooks.
- `commitlint.config.mjs`: conventional, scopes `ui`, `web`, `tokens`, `registry`, `docs`,
  `ci`, `lint`, `deps`, `repo`, `skills`. The existing history already uses these shapes.
- `.editorconfig`, `.node-version` (24), `engines.node >= 22`, `.vscode/settings.json` and
  `.vscode/extensions.json` recommending `oxc.oxc-vscode` as the formatter and fixer.

**Acceptance.** `pnpm lint:check` and `pnpm format:check` exit 0 on the migrated tree with a
formatting diff of zero or near zero files (any residual differences are applied in the same
commit and inspected: Tailwind class order must not change).

## 3. Public-release scaffolding

Root files:

- `LICENSE` — MIT, `Copyright (c) 2026 Neoptolemos Kyriakou`.
- `CONTRIBUTING.md` — prerequisites, `pnpm install`, `pnpm dev`, the gate (`pnpm check`), how
  to add a component (test first, registry entry, example), how to add a token (`tokens:build`,
  research source), commit convention, the DCO sign-off requirement with the `git commit -s`
  example, and the "before opening a PR" etiquette adapted from pdfcn.
- `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1; reports go to the maintainer through a
  GitHub private vulnerability report or a direct message, no email is published.
- `SECURITY.md` — report privately through GitHub Security Advisories at
  `https://github.com/STiXzoOR/applecn/security/advisories/new`; scope: the site and the
  registry JSON; out of scope: Apple's properties the values were measured from.
- `README.md` — reshaped after pdfcn's: name, one-line pitch, install block, feature bullets,
  then the existing technical sections (how it is built, exact vs approximate, layout), then
  Contributing, Security, License, and a **Trademarks** section: Apple, iOS, macOS, SF Pro
  and SF Symbols are trademarks of Apple Inc.; applecn is an independent open-source project
  and is not affiliated with or endorsed by Apple.

`.github/`:

- `CODEOWNERS` — `* @STiXzoOR`.
- `dco.yml` — `require: members: true`, remediation commits allowed (the DCO app's config).
- `ISSUE_TEMPLATE/bug_report.yml`, `feature_request.yml`, `config.yml` (blank issues off,
  questions to Discussions, security to SECURITY.md).
- `pull_request_template.md` — summary, validation, checklist (`pnpm check`, tests and docs,
  registry regenerated, signed off).
- `actions/setup/action.yml` — pnpm from `packageManager`, Node from `.node-version`, pnpm
  cache, `pnpm install --frozen-lockfile`.
- `workflows/ci.yml` — on pull requests and pushes to `main`; one job: setup then
  `pnpm check`; `NEXT_TELEMETRY_DISABLED=1`; concurrency cancels superseded runs.

Every `package.json` gains `"license": "MIT"` and the root gains a `repository` field.
`private: true` stays: it only blocks npm publishing.

## 4. Agent skill

`.agents/skills/applecn/SKILL.md`, frontmatter `name: applecn` and a description that lists
the triggers (building Apple-style UI in React or Next, using applecn, the Liquid Glass
idiom, installing from this registry). Body: what the registry is, the two install forms,
the theme item, the platform switch and appearance attributes, the token rule (no literal
values; the utilities to use instead), the component list with one line each generated from
`apps/web/registry/index.ts` at authoring time, and the gotchas from `packages/ui/AGENTS.md`
that matter to a consumer. README links it with `npx skills add STiXzoOR/applecn`.

## Tests

Test-driven where there is behaviour:

- `apps/web/__tests__/registry.test.ts` pins `registry.name === "applecn"` and
  `registry.homepage === SITE_URL` (fails first, then the generator changes).
- New `apps/web/__tests__/repo.test.ts`: walks `git ls-files` from the repo root and fails if
  any tracked text file outside `docs/superpowers/` and `docs/research/` contains `apple-ds`;
  parses `README.md` and `.agents/skills/applecn/SKILL.md` for `@applecn/<name>` and
  `/r/<name>.json` mentions and fails if a name is not a registry item.
- `apps/web/__tests__/docs.test.ts` gains a check that the Install blocks use `REGISTRY_URL`.

Everything else (toolchain, community files, CI) is verified by `pnpm check` being green and
by running the new hooks once locally.

## Commits

On `feat/apple-design-system`, in order, each passing `pnpm check`:

1. `refactor(repo): rename apple-ds to applecn`
2. `build(lint): replace eslint and prettier with oxlint and oxfmt`
3. `chore(repo): community files, issue forms and CI for public release`
4. `docs(skills): applecn agent skill and README for release`

Nothing is pushed; no remote is created.

## Owner follow-ups (not automated)

1. `mv ~/Projects/apple-ds ~/Projects/applecn`; the vault note and the Claude memory file are
   updated by this work to the new name but keep their current paths.
2. Create `STiXzoOR/applecn` on GitHub (public), push the branch, merge to `main`.
3. Install the DCO GitHub App; enable Discussions; enable private vulnerability reporting;
   protect `main` (require the CI check and DCO, no force-push).
4. Deploy `apps/web` on Vercel (root directory `apps/web`), set `NEXT_PUBLIC_SITE_URL` if the
   domain differs from `applecn.vercel.app`.
5. Optional: list the registry in the shadcn directory with the `launch-shadcn-registry`
   skill from shadcn-labs.
