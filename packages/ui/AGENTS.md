# @apple-ds/ui

The design system's primitives: Apple's tokens as data, the stylesheet generated from them, and one file per component on Base UI with Hugeicons. Nothing in here knows about the docs app.

## Layout

- `src/tokens/*.ts` — the single source of truth for every value: `colors`, `typography`, `metrics` (per platform), `radii`, `motion`, `elevation`, `materials`. `css.ts` renders them; `scripts/build-css.ts` writes `src/styles/tokens.css`. Edit a token module, run `pnpm tokens:build`, and a test fails until the committed file matches.
- `src/styles/globals.css` — bridges the tokens into Tailwind's theme (`bg-system-blue`, `rounded-sheet`, `shadow-thumb`, `ease-sheet`), defines the `type-*` text-style utilities, the `material-*`, `glass*`, `hairline*` and `pressable` utilities, and the base styles. Hand-written; `__tests__/globals.test.ts` pins its contract.
- `src/components/*.tsx` — shadcn conventions: `data-slot` on every element, `cva` for variants, `cn` for merging, function components, no `forwardRef`. Relative imports are extensionless and never reach into `tokens/`, so the registry can copy a file into any project.
- `src/hooks/*.ts`, `src/lib/*.ts` — `use-media-query` (the `sm` sheet breakpoint), `use-scroll-collapse`, `platform` (the iOS/macOS context), `contrast` (WCAG maths), `utils` (`cn`).

## Rules

- No literal colour, size, radius or duration in a component. If a value is missing, add a token.
- Base UI only. No Radix, no vaul, no lucide. Icons go through `Icon`.
- Type styles are `type-*` utilities, never `text-<style>`: tailwind-merge reads `text-body` as a colour and drops it against `text-label`.
- `--radius-*`, `--shadow-*` and `--ease-*` are Tailwind namespaces; the primitives that feed them are `--sheet-radius`, `--elevation-*`, `--easing-*` so the bridge never loops.
- Semantic aliases (`--background: var(--background-1)`) are repeated inside every scope that overrides a primitive (`.dark`, `[data-elevated]`, `[data-contrast="more"]`); a `var()` resolves where it is declared.
- Overlays that portal to `body` set `data-elevated` so dark mode raises them one step.
- Every component has a test in `__tests__/` that renders it, checks roles and states, and runs axe (`helpers/axe.ts` disables the colour-contrast rule jsdom cannot evaluate; contrast is asserted numerically in `contrast.test.ts`).
- Responsive components read `matchMedia`; tests switch viewports with `helpers/viewport.ts`.

## Commands

```sh
pnpm --filter @apple-ds/ui test          # vitest
pnpm --filter @apple-ds/ui typecheck
pnpm tokens:build                        # regenerate tokens.css
pnpm ui:add <name>                       # pull a shadcn registry component to restyle
```
