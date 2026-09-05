# Apple design system

Apple's Human Interface Guidelines — the iOS/iPadOS 26 Liquid Glass idiom by default, macOS 26 as a runtime switch — rebuilt as a **shadcn** design system on **Base UI** primitives with **Hugeicons**, in a private pnpm/Turborepo monorepo scaffolded by the shadcn CLI.

- `packages/ui` (`@apple-ds/ui`) — the tokens, the generated stylesheet, and 45 components.
- `apps/web` (`@apple-ds/web`) — the design-system site: eight foundation pages rendered from the token data, a page per component with live examples and source, and a shadcn registry at `/r/*.json`.
- `docs/` — the research (`docs/research/apple-design-system-reference.md`: every number and where it came from), the spec, and the plan.

## Run it

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # lint + format check + typecheck + tests + build
```

Other scripts: `pnpm test`, `pnpm tokens:build` (regenerate `tokens.css` after editing a token module), `pnpm registry:build` (regenerate `registry.json` and `public/r`), `pnpm --filter @apple-ds/web examples:build` (regenerate the example map), `pnpm ui:add <name>` (pull a shadcn registry component into `packages/ui` to restyle).

## How it is built

**Tokens as data.** `packages/ui/src/tokens/*.ts` hold Apple's published values: the twelve system colours in default and accessible variants for light and dark, the grays, the UIKit semantic roles, the eleven text styles at every Dynamic Type category, the macOS scale, per-platform control geometry, the radius ladder, easings and SwiftUI springs (rendered as CSS `linear()`), shadows and materials. `scripts/build-css.ts` generates `src/styles/tokens.css`; tests pin the values to the HIG tables and fail if the committed file drifts.

**One stylesheet.** `globals.css` bridges the tokens into Tailwind's theme (`bg-system-blue`, `text-label-2`, `rounded-sheet`, `shadow-thumb`, `ease-sheet`), defines `type-large-title` … `type-caption-2`, the `material-*` and `glass*` utilities (with Reduce Transparency fallbacks) and the half-point `hairline` utilities. shadcn's own token names (`--primary`, `--card`, …) are aliases of Apple roles, so any shadcn project can adopt the theme.

**Platform switch.** `tokens.css` scopes the macOS type scale and metrics under `[data-platform="macos"]`; `PlatformProvider` (or the toolbar switch on the site) stamps it and every control re-measures itself. Dark mode, elevated dark surfaces (`[data-elevated]`), Increase Contrast (`prefers-contrast` or `[data-contrast="more"]`) and Dynamic Type (a `--pt` unit that follows `-apple-system-body` on iOS) are handled the same way, in CSS.

**Components.** shadcn conventions on Base UI: `data-slot` on every element, `cva` variants, `cn`, no `forwardRef`. Overlays adapt to the viewport — a `Sheet` is a bottom sheet with a grabber and detents on a phone and a centred card from `sm`; an `ActionSheet` becomes a popover. Tab bars, toolbars and menus float on Liquid Glass. Each component has a test that checks roles, states, keyboard behaviour and runs axe.

**Registry.** `apps/web/scripts/registry.ts` reads the package sources and writes `registry.json` (dependencies from imports, an `apple` style item with every token as `cssVars` and the utilities as `css`); `shadcn build` turns it into `public/r/<name>.json` at build time.

```sh
npx shadcn@latest add https://<your-host>/r/apple.json      # the theme
npx shadcn@latest add https://<your-host>/r/button.json     # a component and its dependencies
```

## What is exact and what is approximated

Colours, type sizes, leading, weights, the Dynamic Type matrix, hit targets, the switch, slider, stepper and page-control geometry, alert width, list and menu metrics are Apple's published or runtime values. Apple publishes no radii, durations or material parameters, and the iOS 26 and macOS 26 sizes in the research document marked _approx._ are measured or rounded; they are the first things to revisit with a better source. SF Pro and SF Symbols are not shipped: the system font stack resolves to San Francisco on Apple devices, and Hugeicons stands in for symbols with the same scale and weight model.

## Layout

```
apps/web/                      Next.js 16 App Router site + registry
  app/(docs)/                  overview, /foundations/[slug], /components/[name]
  components/foundations/      the eight foundation pages (rendered from token data)
  registry/index.ts            component docs (title, Apple counterpart, primitive, examples)
  registry/examples/           live examples, one folder per component
  scripts/                     registry.ts, registry-data.ts, examples-index.ts
packages/ui/                   @apple-ds/ui
  src/tokens/                  the data; css.ts renders it
  src/styles/                  globals.css (hand-written), tokens.css (generated)
  src/components/              one file per component
  src/hooks/, src/lib/         use-media-query, use-scroll-collapse; platform, contrast, utils
  __tests__/                   vitest + Testing Library + axe
docs/research/                 the reference every number traces to
docs/superpowers/              spec and plan
```

The repository is private; no remote is configured.
