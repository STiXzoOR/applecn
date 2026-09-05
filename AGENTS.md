<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Working in this repository

Read `README.md` for what this is. The rules that keep it coherent:

- **Tokens first.** A value that is not a token becomes one in `packages/ui/src/tokens/`, then `pnpm tokens:build`. Never write a literal colour, size, radius or duration in a component or page. The research document (`docs/research/apple-design-system-reference.md`) records where every number comes from; add the source when adding a number.
- **Base UI and Hugeicons only.** No Radix, no vaul, no lucide.
- **Tests before code.** Every component, token module and page has a failing test first (`pnpm test`). Component tests check roles, states, keyboard behaviour and run axe.
- **Generated files are committed and checked.** `tokens.css`, `registry.json` and `registry/examples.generated.ts` are produced by scripts; tests fail when they are stale. Regenerate rather than edit.
- **Documentation is data.** A new component needs an entry in `apps/web/registry/index.ts` and at least one example under `apps/web/registry/examples/<name>/`; a test enforces both.
- **`pnpm check` before calling anything done.** Lint, format check, typecheck, tests and build.

`packages/ui/AGENTS.md` has the package's own rules.
