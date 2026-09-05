# Contributing to applecn

Thanks for helping. This covers getting the repo running and landing a change.

## Prerequisites

- Node 22 or newer (CI uses the version in `.node-version`)
- pnpm, the version pinned in `package.json` (`corepack enable` picks it up)

## Getting started

```sh
git clone https://github.com/STiXzoOR/applecn.git
cd applecn
pnpm install        # also installs the git hooks (skipped where there is no git checkout)
pnpm dev            # http://localhost:3000
```

If the hooks do not run on commit, you probably have a global `core.hooksPath`. Point this
clone at its own hooks once:

```sh
git config --local core.hooksPath .git/hooks
pnpm exec lefthook install --force
```

## The gate

`pnpm check` is what CI runs; run it before you push.

| Command             | Checks                                                  |
| ------------------- | ------------------------------------------------------- |
| `pnpm lint:check`   | oxlint, type-aware (`pnpm lint:fix` applies safe fixes) |
| `pnpm format:check` | oxfmt (`pnpm format` fixes)                             |
| `pnpm typecheck`    | tsc in every workspace                                  |
| `pnpm test`         | vitest: tokens, components (roles, keyboard, axe), docs |
| `pnpm build`        | the registry, then the site                             |

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
3. Add the doc entry and at least one example, then
   `pnpm --filter @applecn/web examples:build`.
4. `pnpm registry:build`, then `pnpm check`.

### Changing a value

Every number traces to an Apple source. A change needs the HIG page, the UIKit or AppKit
API, or the Apple web page it was measured from, added to the research document next to the
value.

## Commits

Conventional Commits, enforced by commitlint: `type(scope): subject`. Scopes: `ui`, `web`,
`tokens`, `registry`, `docs`, `spec`, `skills`, `ci`, `lint`, `deps`, `repo`, `release`.

Every commit is signed off (`git commit -s`), which adds a `Signed-off-by` line certifying
the [Developer Certificate of Origin](https://developercertificate.org/). The DCO check on
pull requests fails without it.

## Before opening a pull request

Open or find an issue first and say you are taking it. For anything non-trivial, wait for a
maintainer to agree the direction before writing code. Keep one purpose per pull request; no
drive-by refactors or formatting-only changes.

## Submitting

1. Branch from `main`, link the issue, make the change with tests and docs.
2. `pnpm check` passes; commits are signed off.
3. Open the pull request; the template asks for the summary, the Apple source, validation
   and a checklist.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
