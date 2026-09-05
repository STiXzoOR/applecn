<h1 align="center">applecn</h1>

<p align="center">
  Apple's Human Interface Guidelines as a <a href="https://ui.shadcn.com">shadcn</a> design system.<br/>
  iOS 26 (Liquid Glass), macOS 26 (Tahoe) and Apple's own web from one stylesheet, measured from the real thing, on <a href="https://base-ui.com">Base UI</a> primitives with <a href="https://hugeicons.com">Hugeicons</a>. Copy, paste, own the code.
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
```

```sh
npx shadcn@latest add @applecn/apple      # the theme: every token, light and dark
npx shadcn@latest add @applecn/button     # a component and its dependencies
```

Or by URL: `npx shadcn@latest add https://applecn.vercel.app/r/button.json`.

## Features

- **Measured, not eyeballed.** Colours and type from the HIG; the iOS 26 and macOS 26 control
  geometry read from UIKit and AppKit on device (the 63 × 28 switch with its oval knob, 26 pt
  grouped lists, 34 pt alerts, 24 pt macOS controls with 6 pt corners); the web idiom from
  apple.com's own stylesheet. `docs/research/apple-design-system-reference.md` lists every
  number and where it came from.
- **Three idioms, one switch.** `PlatformProvider` (or `data-platform`) swaps colours, type,
  corners and every control metric between `ios`, `macos` and `web`; providers nest, and
  `detectPlatform()` picks one from the visitor's device.
- **Tokens as data.** `packages/ui/src/tokens/*.ts` generate the stylesheet; tests fail if it
  drifts.
- **Everything in CSS.** Dark mode, elevated surfaces, Increase Contrast, Reduce Transparency
  and Dynamic Type are handled by the stylesheet, never by JavaScript.
- **64 components on Base UI.** From switches and sheets to the menu bar, apple.com's global
  navigation, notification banners, gauges, combo boxes and macOS windows; shadcn conventions,
  `data-slot`, `cva`, tests with axe.
- **A registry and a site.** Every component page has live examples, source and an install
  command.
- **Agent-ready.** `npx skills add STiXzoOR/applecn` installs a skill that teaches coding
  agents the registry and its rules.

## Develop

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # lint + format check + typecheck + tests + build
```

Other scripts: `pnpm test`, `pnpm tokens:build` (regenerate `tokens.css` after editing a token module), `pnpm registry:build` (regenerate `registry.json` and `public/r`), `pnpm --filter @applecn/web examples:build` (regenerate the example map), `pnpm ui:add <name>` (pull a shadcn registry component into `packages/ui` to restyle).

## How it is built

**Tokens as data.** `packages/ui/src/tokens/*.ts` hold Apple's published values: the twelve system colours in default and accessible variants for light and dark, the grays, the UIKit semantic roles, the eleven text styles at every Dynamic Type category, the macOS scale, per-platform control geometry, the radius ladder, easings and SwiftUI springs (rendered as CSS `linear()`), shadows and materials. `scripts/build-css.ts` generates `src/styles/tokens.css`; tests pin the values to the HIG tables and fail if the committed file drifts.

**One stylesheet.** `globals.css` bridges the tokens into Tailwind's theme (`bg-system-blue`, `text-label-2`, `rounded-sheet`, `shadow-thumb`, `ease-sheet`), defines `type-large-title` … `type-caption-2`, the `material-*` and `glass*` utilities (with Reduce Transparency fallbacks) and the half-point `hairline` utilities. shadcn's own token names (`--primary`, `--card`, …) are aliases of Apple roles, so any shadcn project can adopt the theme.

**Platform switch.** `tokens.css` scopes each idiom's colours, type scale, corners and control metrics under `[data-platform="ios" | "macos" | "web"]` and sets `--platform` there; `PlatformProvider` (or the toolbar switch on the site) stamps it and every control re-measures itself. The `ios:`, `macos:` and `web:` Tailwind variants are container style queries on `--platform`, so the nearest provider wins even when providers nest (a macOS window inside a web page). Dark mode, elevated dark surfaces (`[data-elevated]`), Increase Contrast (`prefers-contrast` or `[data-contrast="more"]`) and Dynamic Type (a `--pt` unit that follows `-apple-system-body` on iOS) are handled the same way, in CSS.

**Components.** shadcn conventions on Base UI: `data-slot` on every element, `cva` variants, `cn`, no `forwardRef`. Overlays adapt to the viewport — a `Sheet` is a bottom sheet with a grabber and detents on a phone and a centred card from `sm`; an `ActionSheet` becomes a popover. Tab bars, toolbars and menus float on Liquid Glass. Each component has a test that checks roles, states, keyboard behaviour and runs axe.

**Registry.** `apps/web/scripts/registry.ts` reads the package sources and writes `registry.json` (dependencies from imports, an `apple` style item with every token as `cssVars`, and the utilities plus the three platform scopes as `css`); the same script writes `public/r/<name>.json` with each file's content, rewriting `../hooks/…` imports to `@/hooks/…` so the CLI maps them to the consumer's aliases. To use the `ios:`, `macos:` and `web:` variants in an installed project, add to your stylesheet:

```css
@custom-variant ios {
  @container style(--platform: ios) {
    @slot;
  }
}
@custom-variant macos {
  @container style(--platform: macos) {
    @slot;
  }
}
@custom-variant web {
  @container style(--platform: web) {
    @slot;
  }
}
```

```sh
npx shadcn@latest add https://applecn.vercel.app/r/apple.json      # the theme
npx shadcn@latest add https://applecn.vercel.app/r/button.json     # a component and its dependencies
```

## What is exact and what is approximated

Colours, type sizes, leading, weights and the Dynamic Type matrix are Apple's published values. The iOS 26 control geometry was read from UIKit's own view trees in the iPhone 17 Pro simulator (iOS 26.5) and the macOS 26 geometry from AppKit on Tahoe 26.6 on 2026-09-06: switches, sliders, segmented controls, steppers, fields, buttons in every control size, inset grouped lists and their headers, navigation and tab bars, toolbars, alerts and action sheets, menus, windows, the semantic colours. The web idiom was measured from Apple's own web properties on 2026-09-05 and 2026-09-06 — apps.apple.com, music.apple.com, tv.apple.com and apple.com, read from their stylesheets and from rendered pages in headless Chromium: the radius ladder (`--global-border-radius-*`: 5, 9, 12, 17, 24, with 8, 10 and 20 in use), the materials (`--glassMaterialBackground` behind `saturate(2.2) blur(16px)`, apple.com's nav behind `saturate(180%) blur(20px)`), the shadows (`--glassMaterialShadowColor`, `--dialogShadowColor`, the App Store's card shadows), the durations and easings (`.1s` in, `.21s` out, `.3s` menus, `.24s` nav, `.56s` sheet), the `.45` scrim, the 4 px key-colour focus ring, and the desktop idiom's control sizes (24/28/36/40/44 px buttons, 34 px sidebar rows with 8 px corners, a 260 px sidebar, 32 px fields with 4 px corners, 10 px dialog corners). The research document lists each with its source.

Still approximated, and marked _approx._ there: the bottom-sheet radius (device-matched on iOS, no web counterpart), the extra-large iOS button, the macOS window, sheet, alert and popover corners, and a few web-app controls Apple's sites do not have (switches, steppers). SF Pro and SF Symbols are not shipped: the system font stack resolves to San Francisco on Apple devices, and Hugeicons stands in for symbols with the same scale and weight model.

## Layout

```
apps/web/                      Next.js 16 App Router site + registry
  app/page.tsx                 the landing page (apple.com's idiom, the three-idiom showcase)
  app/(docs)/                  /docs, /foundations/[slug], /components/[name]
  components/landing/          nav, hero, showcase (iPhone, Mac window, browser), mosaic, footer
  components/foundations/      the eight foundation pages (rendered from token data)
  registry/index.ts            component docs (title, Apple counterpart, primitive, examples)
  registry/examples/           live examples, one folder per component
  scripts/                     registry.ts, registry-data.ts, examples-index.ts
packages/ui/                   @applecn/ui
  src/tokens/                  the data; css.ts renders it
  src/styles/                  globals.css (hand-written), tokens.css (generated)
  src/components/              one file per component
  src/hooks/, src/lib/         use-media-query, use-scroll-collapse, use-reduced-motion,
                               use-color-scheme; platform, detect-platform, contrast, utils
  __tests__/                   vitest + Testing Library + axe
docs/research/                 the reference every number traces to
docs/superpowers/              spec and plan
```

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
