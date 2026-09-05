# Apple design system on shadcn — design spec

> Renamed to **applecn** on 2026-09-05 (`@applecn/*`); see `docs/superpowers/specs/2026-09-05-applecn-public-release-design.md`. Package names below are historical.

Date: 2026-09-05. Status: approved by the owner's `/goal` directive (autonomous run); the brainstorming approval gate was overridden by that directive, so every decision below is recorded with its reason.

## 1. Goal

A private monorepo, scaffolded by the shadcn CLI, that reproduces Apple's design system (Human Interface Guidelines, iOS/iPadOS 26 "Liquid Glass" era, with macOS 26 metrics as a switch) as a proper design system: a token layer, a component library built on shadcn conventions over **Base UI** primitives with **Hugeicons**, and a Next.js design-system application that documents every foundation and component with live previews and publishes a shadcn registry so other projects can `shadcn add` the components.

## 2. Non-goals

- Shipping Apple's fonts or SF Symbols. Both are licence-restricted; the system font stack renders San Francisco on Apple devices, and Hugeicons stands in for SF Symbols with an SF-Symbol-like sizing model.
- watchOS, tvOS, visionOS idioms. Their metrics are recorded in the research document but no component targets them.
- A Storybook. The docs app is the showcase; tests cover behaviour.
- Pushing to GitHub. The repo is initialised locally and marked private; creating a remote is the owner's call.

## 3. Sources of truth

Everything measurable comes from a source recorded in `docs/research/apple-design-system-reference.md`: the HIG pages (fetched as DocC JSON, 2026-09-05), UIKit/AppKit runtime metrics, apple.com and apps.apple.com CSS, and community measurements where Apple publishes nothing (each of those is flagged as an approximation). The numbers in that document are duplicated as fixtures in `packages/ui/src/tokens/__tests__/`, so a token that drifts from Apple's published value fails a test.

## 4. Architecture

```
apple-ds/                      pnpm workspace + Turborepo (scaffolded by `shadcn init --monorepo`)
├── apps/web                   @apple-ds/web — Next.js 16 App Router design-system site + registry
├── packages/ui                @apple-ds/ui  — tokens + components (shadcn on Base UI, Hugeicons)
├── packages/eslint-config     @apple-ds/eslint-config (scaffolded)
├── packages/typescript-config @apple-ds/typescript-config (scaffolded)
└── docs/                      research, spec, plan
```

### 4.1 `@apple-ds/ui`

- `src/tokens/*.ts` — the single source of truth for every token, as typed data: `colors.ts` (system colours light/dark/accessible, grays, labels, fills, backgrounds, separators, link, materials), `typography.ts` (iOS Dynamic Type at the Large size, macOS text styles, font stacks, tracking table), `metrics.ts` (control geometry per platform), `radii.ts`, `motion.ts`, `elevation.ts`. Exported as `@apple-ds/ui/tokens/*` for the docs app.
- `scripts/build-css.ts` — generates `src/styles/tokens.css` from the token modules. The generated file is committed; a test regenerates it in memory and fails if it differs.
- `src/styles/globals.css` — imports Tailwind, `tw-animate-css`, `shadcn/tailwind.css`, then `tokens.css`; declares the `dark` variant, the `@theme` bridge (`--color-*`, `--text-*`, `--radius-*`, `--font-*`, `--ease-*`), the `pt` unit, base styles, and the material/glass utilities.
- `src/components/*.tsx` — one file per component, shadcn conventions (`data-slot`, `cva` variants, `cn`), Base UI primitives only, Hugeicons only. Per-module `exports`, no barrel.
- `src/hooks/*.ts` — `use-platform`, `use-scroll-collapse`, `use-media-query`.
- `src/lib/*.ts` — `utils` (cn), `platform` (context), `contrast` (WCAG helper used by tests and docs).

### 4.2 `@apple-ds/web`

- Routes: `/` (overview), `/foundations/{color,typography,layout,materials,shapes,motion,icons,platforms}`, `/components/{name}`, `/r/{name}.json` (static registry output).
- `registry/index.ts` — component metadata (name, description, Apple counterpart, HIG URL, Base UI primitive, examples). `registry/examples/*.tsx` — live examples. A component page renders every example live and shows its source (read from disk in a server component).
- Chrome: sidebar (Foundations, Components) built from the design system's own `sidebar`; a toolbar with **platform** (iOS / macOS) and **appearance** (light / dark / system, plus increased contrast) controls; the whole site is built from `@apple-ds/ui` so it is also the first consumer.
- `registry.json` + `pnpm registry:build` (`shadcn build`) → `public/r/*.json` containing every `registry:ui` item plus a `registry:style` item that carries the token CSS.

## 5. Design decisions

### 5.1 Idioms and the platform switch

iOS/iPadOS 26 is the default idiom: it is the most completely specified platform (Dynamic Type tables, colour tables, control sizes). macOS 26 is available as `<PlatformProvider platform="macos">`, which sets `data-platform="macos"` on a wrapper; the stylesheet re-maps the type scale and control metrics under that attribute. Components read the platform from context only where the _structure_ differs (checkbox circle vs square, action sheet vs popover); everything else is CSS.

### 5.2 Type

- Font stack: `-apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`; rounded `ui-rounded`; mono `ui-monospace, "SF Mono", Menlo, monospace`. `font-optical-sizing: auto`, tracking 0 (variable SF handles optical sizes; the tracking table is documented for static-font consumers).
- Text styles are Tailwind theme entries (`text-large-title` … `text-caption-2`) with size, line-height and weight. Values are authored in a `pt` unit: `--pt: 0.0625rem` normally and `calc(1rem / 17)` on iOS Safari where `html { font: -apple-system-body }` makes the root follow Dynamic Type. `17 * var(--pt)` is exactly 17px at the default size and scales with the reader's text size.
- iOS sizes (Large): 34/41 700, 28/34 700, 22/28 700, 20/25 600, 17/22 600, 17/22 400, 16/21, 15/20, 13/18, 12/16, 11/13. macOS: 26/32, 22/26, 17/22, 15/20, 13/16 700, 13/16, 12/15, 11/14, 10/13, 10/13, 10/13 500.

### 5.3 Colour

- Values are the exact sRGB numbers Apple publishes, written as `rgb()` (with alpha where Apple uses alpha). No OKLCH round-tripping.
- Primitive tokens: `--system-{red,orange,yellow,green,mint,teal,cyan,blue,indigo,purple,pink,brown}`, `--gray-{1..6}`, `--label-{1..4}`, `--placeholder`, `--fill-{1..4}`, `--background-{1..3}`, `--grouped-background-{1..3}`, `--separator`, `--separator-opaque`, `--link`. Dark values under `.dark`; accessible values under `@media (prefers-contrast: more)` and `[data-contrast="more"]`; dark "elevated" backgrounds under `[data-elevated]`.
- shadcn semantic tokens map onto those: `background`→background-1, `foreground`→label-1, `card`→grouped-background-2, `popover`→background-1 (elevated in dark), `primary`→system-blue, `secondary`→fill-3, `muted`→background-2, `muted-foreground`→label-2, `accent`→fill-4, `destructive`→system-red, `border`→separator, `input`→fill-3, `ring`→system-blue, `sidebar*`, `chart-1..5`→blue, green, orange, purple, red.
- `@theme` exposes the primitives (`bg-system-blue`, `text-label-2`, `bg-fill-3`, …) so components and consumers never write a literal.

### 5.4 Shape

shadcn's Luma radius derivation with `--radius: 0.625rem` already yields Apple's ladder: 6, 8, 10, 14, 18, 22, 26 px (`sm`…`4xl`). Additions: `--radius-sheet: 2.5rem` (iOS 26 sheet, device-matched), `--radius-icon: 22.37%` (app icon mask), `rounded-full` for capsules. Nested corners are concentric (inner = outer − inset).

### 5.5 Materials and Liquid Glass

Utilities `material-ultra-thin|thin|regular|thick` (content layer) and `glass`, `glass-clear` (functional layer: bars, sheets, menus, prominent controls). Each is `light-dark()` background + `backdrop-filter: blur() saturate(180%)` + hairline and, for glass, inset specular rims. `prefers-reduced-transparency` and `[data-transparency="reduced"]` collapse them to opaque surfaces. Values are approximations and are documented as such.

### 5.6 Motion

`--ease-standard: cubic-bezier(.25,.1,.25,1)`, `--ease-sheet: cubic-bezier(.32,.72,0,1)`, springs `--spring-smooth|snappy|bouncy` as `linear()` easings (0.5 s), durations press 120 ms, hover 150 ms, overlay 250 ms, sheet 450 ms. `prefers-reduced-motion` keeps fades and drops transforms.

### 5.7 Geometry (iOS default → macOS)

| Control                                   | iOS 26                                         | macOS 26                            |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------- |
| Button height mini/small/regular/large/xl | 28/32/44/52/64                                 | 16/20/24/28/34 (approx.)            |
| Button shape                              | capsule; circle icon-only                      | rounded 6 (Tahoe capsule for large) |
| Switch                                    | 51×31, thumb 27, green                         | 38×22, thumb 20 (approx.)           |
| Checkbox                                  | 22 circle (list)                               | 14 square r 3.5                     |
| Radio                                     | 22 circle                                      | 14 circle                           |
| Slider                                    | track 4, thumb 28                              | track 4, knob 20                    |
| Stepper                                   | 94×32 r 8                                      | —                                   |
| Segmented control                         | h 32, capsule, inset 2                         | h 22 r 6                            |
| Text field                                | row 44 / standalone 36 r 10                    | h 22 r 6                            |
| Search field                              | h 36 capsule                                   | h 22 r 6                            |
| Inset grouped list                        | inset 16 (20 ≥ 414), r 26, row ≥ 44, pad 11×16 | sidebar rows 28 r 6                 |
| Nav bar                                   | 44, large title +52                            | title bar 28, toolbar 52            |
| Tab bar                                   | floating capsule 64, inset 21, label 11        | —                                   |
| Sheet                                     | r 40, grabber 36×5, scrim .4, detents 50/100 % | dialog r 26                         |
| Alert                                     | w 270 r 26, buttons 44, thick material         | w 260                               |
| Action sheet                              | rows 56, r 26, cancel 8 below                  | popover                             |
| Menu                                      | w 250, item 44, r 26, leading glyphs           | item 22 r 12                        |
| Popover                                   | r 26, arrow 13×6.5                             | r 12                                |
| Progress bar                              | h 4 r 2                                        | h 4                                 |
| Activity indicator                        | 20 / 37                                        | 16 / 32                             |
| Badge                                     | h 18, min-w 18, red                            | —                                   |
| Page control                              | dots 7, gap 9                                  | —                                   |
| Hit target                                | 44 min 28                                      | 28 min 20                           |

### 5.8 Component inventory

Every row is one file in `packages/ui/src/components/`, one test file, one docs entry with live examples.

| Component                     | Base UI / basis    | Apple counterpart                                                                                   |
| ----------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| text                          | element            | Labels / text styles                                                                                |
| icon                          | Hugeicons wrapper  | SF Symbols (scales small/medium/large, weights)                                                     |
| material, glass               | element            | Materials, Liquid Glass                                                                             |
| separator                     | Separator          | Separators (0.5 px)                                                                                 |
| button                        | Button             | Buttons (filled, tinted, gray, bordered, plain, glass, glass-prominent, destructive; sizes; shapes) |
| toggle                        | Toggle             | Toggle buttons                                                                                      |
| badge                         | element            | Badges, capsule tags                                                                                |
| spinner                       | element            | Activity indicator                                                                                  |
| progress                      | Progress           | Progress bars, circular progress                                                                    |
| switch                        | Switch             | Toggle (switch)                                                                                     |
| checkbox                      | Checkbox           | Checkbox / list checkmark                                                                           |
| radio-group                   | RadioGroup         | Radio buttons                                                                                       |
| slider                        | Slider             | Sliders                                                                                             |
| stepper                       | NumberField        | Steppers                                                                                            |
| segmented-control             | Tabs list          | Segmented controls                                                                                  |
| tabs                          | Tabs               | Tab views                                                                                           |
| input, textarea, field, label | Input, Field       | Text fields, text views                                                                             |
| search-field                  | Input              | Search fields                                                                                       |
| select                        | Select             | Pickers (menu), pop-up buttons                                                                      |
| menu                          | Menu               | Menus, pull-down buttons                                                                            |
| context-menu                  | ContextMenu        | Context menus                                                                                       |
| popover                       | Popover            | Popovers                                                                                            |
| tooltip                       | Tooltip            | Tooltips                                                                                            |
| alert-dialog                  | AlertDialog        | Alerts                                                                                              |
| action-sheet                  | Drawer / Popover   | Action sheets                                                                                       |
| sheet                         | Drawer / Dialog    | Sheets (detents, grabber)                                                                           |
| dialog                        | Dialog             | macOS sheets, iPad form sheets                                                                      |
| list                          | composition        | Lists (plain, grouped, inset grouped, sidebar)                                                      |
| card                          | element            | Group boxes                                                                                         |
| table                         | element            | macOS tables                                                                                        |
| disclosure-group              | Collapsible        | Disclosure controls                                                                                 |
| page-control                  | element            | Page controls                                                                                       |
| navigation-bar                | composition + hook | Navigation bars (large title collapse)                                                              |
| tab-bar                       | composition        | Floating tab bar (minimise, search)                                                                 |
| toolbar                       | Toolbar            | Toolbars                                                                                            |
| sidebar                       | composition        | Sidebars                                                                                            |
| split-view                    | composition        | Split views                                                                                         |
| empty                         | element            | ContentUnavailableView                                                                              |
| skeleton                      | element            | Redacted placeholders                                                                               |
| avatar                        | Avatar             | Contact monograms                                                                                   |
| kbd                           | element            | Keyboard shortcuts in menus                                                                         |

### 5.9 Testing and gates

- `packages/ui`: vitest + jsdom + Testing Library + jest-dom + vitest-axe. Token tests pin Apple's published values, contrast pairs, and the generated CSS. Component tests cover roles, states, variant classes, keyboard behaviour and an axe pass.
- `apps/web`: vitest for the registry metadata (every component documented, every example importable) and the registry build; `next build` is the integration gate.
- Root: `pnpm check` = lint + format check + typecheck + test + build. Nothing is reported done without it.

### 5.10 Privacy

Every `package.json` is `"private": true`, so nothing can be published by accident. The git repo is local; no remote is configured.

## 6. Error handling

Components delegate behaviour (focus, dismissal, keyboard) to Base UI; the design system adds no behaviour that Base UI already provides. Overlays trap focus and restore it. Every icon-only control takes an `aria-label`; tests fail without one. Dynamic Type, reduced motion, reduced transparency and increased contrast are honoured by CSS, never by JavaScript.

## 7. Milestones

1. Foundation: scaffold, rename scope, Hugeicons, pnpm/turbo hygiene, vitest, tokens + generator + tests, globals.css, research doc, first commit.
2. Foundation components: text, icon, material/glass, separator, button, toggle, badge, spinner, progress.
3. Form controls: switch, checkbox, radio-group, slider, stepper, segmented-control, tabs, input/textarea/field/label, search-field, select.
4. Overlays: menu, context-menu, popover, tooltip, alert-dialog, action-sheet, sheet, dialog.
5. Structure: list, card, table, disclosure-group, page-control, navigation-bar, tab-bar, toolbar, sidebar, split-view, empty, skeleton, avatar, kbd.
6. Design-system app: chrome, foundations pages, component pages with examples, platform/appearance controls, registry build, README.
7. Gates and hand-off: full `pnpm check`, commit history, summary.
