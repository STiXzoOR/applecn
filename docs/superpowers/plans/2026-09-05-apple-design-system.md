# Apple Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the freshly scaffolded shadcn monorepo into an Apple design system: a tested token layer, ~40 components on Base UI + Hugeicons, and a Next.js documentation app that also publishes a shadcn registry.

**Architecture:** `packages/ui` holds typed token modules that generate `tokens.css`, a hand-written `globals.css` that bridges them into Tailwind's theme, and one file per component. `apps/web` documents every foundation and component from the same token data and live examples, and builds `public/r/*.json` with `shadcn build`.

**Tech Stack:** pnpm 10 workspaces, Turborepo, Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, shadcn CLI 4 (`style: base-luma`), `@base-ui/react` 1.8, `@hugeicons/react` + `@hugeicons/core-free-icons`, `class-variance-authority`, `cn`, vitest 4 + jsdom + Testing Library + vitest-axe, shiki.

**Spec:** `docs/superpowers/specs/2026-09-05-apple-design-system-design.md`

## Global Constraints

- Every `package.json` stays `"private": true`. No remote is added.
- Primitives: Base UI only. No Radix, no vaul, no lucide. Icons: Hugeicons only, through the `icon` component.
- Tokens: no literal colour, radius, font-size or duration inside a component. Everything comes from `globals.css`/`tokens.css` via Tailwind utilities.
- Colours are Apple's exact sRGB values written as `rgb(r g b)` / `rgb(r g b / a)`.
- Type sizes are authored as `calc(N * var(--pt))`; control heights as CSS variables so the platform switch works at runtime.
- shadcn conventions: `data-slot` on every rendered element, `cva` for variants, `cn` for class merging, function components, no `forwardRef`.
- TDD: a failing test precedes every component and every token module. Component tests: roles/labels, variant classes, keyboard behaviour, axe.
- Commit after every task with a conventional message and the trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` plus `Claude-Session: https://claude.ai/code/session_0144XmffgCpsCzS4Mx2UEmhH`.
- `pnpm check` (lint + typecheck + test + build) must be green before the work is called done.

---

## Milestone 1 — Foundation

### Task 1: Rename the workspace scope, pin pnpm, add root scripts

**Files:**
- Modify: `package.json`, `apps/web/package.json`, `packages/ui/package.json`, `packages/eslint-config/package.json`, `packages/typescript-config/package.json`, `apps/web/components.json`, `packages/ui/components.json`, `apps/web/app/layout.tsx`, `apps/web/tsconfig.json`, `packages/ui/tsconfig.json`, `apps/web/eslint.config.js`, `packages/ui/eslint.config.js`, `turbo.json`, `README.md`, `AGENTS.md`

- [ ] **Step 1: Replace the scope everywhere**

```bash
grep -rl '@workspace/' --exclude-dir=node_modules --exclude-dir=.git . | xargs sed -i 's#@workspace/#@apple-ds/#g'
sed -i 's/"name": "web"/"name": "@apple-ds\/web"/' apps/web/package.json
```

- [ ] **Step 2: Root scripts and turbo tasks**

Root `package.json` scripts become:

```json
"build": "turbo build",
"dev": "turbo dev --filter=@apple-ds/web",
"lint": "turbo lint",
"format": "prettier --write \"**/*.{ts,tsx,css,md,json}\"",
"format:check": "prettier --check \"**/*.{ts,tsx,css,md,json}\"",
"typecheck": "turbo typecheck",
"test": "turbo test",
"check": "pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build",
"tokens:build": "pnpm --filter @apple-ds/ui tokens:build",
"registry:build": "pnpm --filter @apple-ds/web registry:build",
"ui:add": "pnpm --filter @apple-ds/ui exec shadcn add"
```

`turbo.json` gains `"test": { "cache": false, "outputs": [] }` and `"registry:build": { "outputs": ["public/r/**"] }`; `@apple-ds/web#build` depends on `registry:build`.

- [ ] **Step 3: Verify install and typecheck**

Run: `pnpm install && pnpm typecheck`
Expected: both workspaces typecheck.

- [ ] **Step 4: Commit** `chore(repo): rename scope to @apple-ds, root scripts`

### Task 2: Vitest harness for `@apple-ds/ui`

**Files:**
- Create: `packages/ui/vitest.config.mts`, `packages/ui/__tests__/setup.ts`, `packages/ui/__tests__/smoke.test.tsx`
- Modify: `packages/ui/package.json` (scripts `test`, devDependencies), `packages/ui/tsconfig.json` (types)

- [ ] **Step 1: Failing smoke test**

```tsx
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Button } from '../src/components/button'

test('the harness renders a component and runs axe', async () => {
  const { container } = render(<Button>Save</Button>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  expect(await axe(container)).toHaveNoViolations()
})
```

- [ ] **Step 2: Run it** — `pnpm --filter @apple-ds/ui test` — Expected: fails, no vitest script.

- [ ] **Step 3: Harness**

`vitest.config.mts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
```

`__tests__/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import * as matchers from 'vitest-axe/matchers'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)
afterEach(() => cleanup())
```

devDependencies: `vitest`, `jsdom`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`, `vitest-axe`, `axe-core`. Script `"test": "vitest run"`.

- [ ] **Step 4: Run** — Expected: PASS. **Step 5: Commit** `test(ui): vitest harness`

### Task 3: Colour tokens

**Files:**
- Create: `packages/ui/src/tokens/colors.ts`, `packages/ui/src/tokens/__tests__/colors.test.ts`

**Interfaces (produces):**

```ts
export type Rgb = readonly [number, number, number]
export interface Rgba { rgb: Rgb; alpha?: number }
export interface Adaptive { light: Rgba; dark: Rgba }
export interface SystemColor extends Adaptive { name: SystemColorName; lightAccessible: Rgba; darkAccessible: Rgba }
export const systemColors: readonly SystemColor[]            // 12, HIG order red…brown
export const grays: readonly (Adaptive & { name: 'gray'|'gray-2'|…|'gray-6' })[]
export const labels: Record<'label'|'label-2'|'label-3'|'label-4'|'placeholder', Adaptive>
export const fills: Record<'fill'|'fill-2'|'fill-3'|'fill-4', Adaptive>
export const backgrounds: Record<'background'|'background-2'|'background-3', Adaptive & { darkElevated: Rgba }>
export const groupedBackgrounds: Record<'grouped-background'|…|'grouped-background-3', Adaptive & { darkElevated: Rgba }>
export const separators: Record<'separator'|'separator-opaque', Adaptive>
export const link: Adaptive
export function css(c: Rgba): string      // 'rgb(0 136 255)' | 'rgb(60 60 67 / 0.6)'
```

- [ ] **Step 1: Failing tests** (fixtures are the HIG "Specifications" table, fetched 2026-09-05)

```ts
import { css, grays, labels, systemColors } from '../colors'

const blue = systemColors.find((c) => c.name === 'blue')!
test('systemBlue is the iOS 26 value in every appearance', () => {
  expect(blue.light.rgb).toEqual([0, 136, 255])
  expect(blue.dark.rgb).toEqual([0, 145, 255])
  expect(blue.lightAccessible.rgb).toEqual([30, 110, 244])
  expect(blue.darkAccessible.rgb).toEqual([92, 184, 255])
})
test.each([
  ['red', [255, 56, 60], [255, 66, 69], [233, 21, 45], [255, 97, 101]],
  ['orange', [255, 141, 40], [255, 146, 48], [197, 83, 0], [255, 160, 86]],
  ['yellow', [255, 204, 0], [255, 214, 0], [161, 106, 0], [254, 223, 67]],
  ['green', [52, 199, 89], [48, 209, 88], [0, 137, 50], [74, 217, 104]],
  ['mint', [0, 200, 179], [0, 218, 195], [0, 133, 117], [84, 223, 203]],
  ['teal', [0, 195, 208], [0, 210, 224], [0, 129, 152], [59, 221, 236]],
  ['cyan', [0, 192, 232], [60, 211, 254], [0, 126, 174], [109, 217, 255]],
  ['indigo', [97, 85, 245], [109, 124, 255], [86, 74, 222], [167, 170, 255]],
  ['purple', [203, 48, 224], [219, 52, 242], [176, 47, 194], [234, 141, 255]],
  ['pink', [255, 45, 85], [255, 55, 95], [231, 18, 77], [255, 138, 196]],
  ['brown', [172, 127, 94], [183, 138, 102], [149, 109, 81], [219, 166, 121]],
])('%s matches the HIG table', (name, l, d, la, da) => { … })
test('gray ladder', () => { expect(grays.map((g) => g.light.rgb)).toEqual([[142,142,147],[174,174,178],[199,199,204],[209,209,214],[229,229,234],[242,242,247]]); expect(grays.map((g) => g.dark.rgb)).toEqual([[142,142,147],[99,99,102],[72,72,74],[58,58,60],[44,44,46],[28,28,30]]) })
test('secondary label is 60 % of (60,60,67) in light and (235,235,245) in dark', () => { expect(css(labels['label-2'].light)).toBe('rgb(60 60 67 / 0.6)'); expect(css(labels['label-2'].dark)).toBe('rgb(235 235 245 / 0.6)') })
```

- [ ] **Step 2: Run** — fails (module missing). **Step 3: Implement** the module with every value from the research doc. **Step 4: Run** — PASS. **Step 5: Commit** `feat(tokens): Apple colour tokens`

### Task 4: Typography tokens

**Files:** `packages/ui/src/tokens/typography.ts`, `packages/ui/src/tokens/__tests__/typography.test.ts`

**Produces:**

```ts
export const fontFamilies: { sans: string; rounded: string; mono: string }
export interface TextStyle { name: TextStyleName; size: number; leading: number; weight: 400|500|600|700; emphasized: 600|700|800|500 }
export const iosTextStyles: readonly TextStyle[]      // Large (default) category, 11 styles
export const macosTextStyles: readonly TextStyle[]
export const dynamicType: Record<DynamicTypeCategory, readonly TextStyle[]>  // xSmall…xxxLarge, AX1…AX5
export const tracking: readonly { size: number; tracking: number }[]           // 1/1000 em
```

- [ ] Failing tests: `body` is 17/22 regular emphasized semibold; `large-title` 34/41 regular emphasized bold; macOS `headline` 13/16 bold; `dynamicType.AX5` large-title is 60/70; `tracking` at 17 is −26 and at 34 is +12; `fontFamilies.sans` starts with `-apple-system`. Then implement, run, commit `feat(tokens): typography`.

### Task 5: Metrics, radii, motion, elevation, materials

**Files:** `packages/ui/src/tokens/{metrics,radii,motion,elevation,materials}.ts` + tests

**Produces (metrics):**

```ts
export type Platform = 'ios' | 'macos'
export interface ControlMetrics {
  buttonHeight: { mini: number; small: number; regular: number; large: number; xl: number }
  switch: { width: number; height: number; thumb: number }
  checkbox: { size: number; shape: 'circle' | 'square' }
  slider: { track: number; thumb: number }
  segmented: { height: number; inset: number; radius: number | 'capsule' }
  textField: { height: number; radius: number }
  searchField: { height: number; radius: number | 'capsule' }
  list: { inset: number; insetWide: number; radius: number; rowMinHeight: number; rowPaddingY: number; rowPaddingX: number }
  navBar: { height: number; largeTitle: number }
  tabBar: { height: number; inset: number }
  sheet: { radius: number; grabber: [number, number]; scrim: number }
  alert: { width: number; radius: number; buttonHeight: number }
  menu: { width: number; itemHeight: number; radius: number }
  hitTarget: { default: number; minimum: number }
}
export const metrics: Record<Platform, ControlMetrics>
```

- [ ] Failing tests: iOS switch is 51×31 thumb 27; iOS button heights 28/32/44/52/64; iOS list inset 16/20 radius 26 row 44; iOS alert 270 wide; hit target 44/28 (iOS) and 28/20 (macOS); radii ladder `[6,8,10,14,18,22,26]` from `--radius: 10`; motion `easeSheet === 'cubic-bezier(0.32, 0.72, 0, 1)'`; materials `regular.light.alpha === 0.82`. Implement, run, commit `feat(tokens): metrics, radii, motion, elevation, materials`.

### Task 6: CSS generator and `tokens.css`

**Files:**
- Create: `packages/ui/src/tokens/css.ts` (pure: `renderTokensCss(): string`), `packages/ui/scripts/build-css.ts`, `packages/ui/src/styles/tokens.css`, `packages/ui/src/tokens/__tests__/css.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { readFileSync } from 'node:fs'
import { renderTokensCss } from '../css'
test('renders the light system colours on :root', () => { expect(renderTokensCss()).toContain('--system-blue: rgb(0 136 255);') })
test('renders dark values under .dark', () => { expect(renderTokensCss()).toMatch(/\.dark\s*{[^}]*--system-blue: rgb\(0 145 255\);/) })
test('renders accessible values under prefers-contrast', () => { expect(renderTokensCss()).toMatch(/prefers-contrast: more[^]*--system-blue: rgb\(30 110 244\);/) })
test('renders macOS type sizes under [data-platform=macos]', () => { expect(renderTokensCss()).toMatch(/\[data-platform="macos"\][^]*--type-body-size: calc\(13 \* var\(--pt\)\);/) })
test('the committed tokens.css is the generator output', () => { expect(readFileSync(new URL('../../styles/tokens.css', import.meta.url), 'utf8')).toBe(renderTokensCss()) })
```

- [ ] **Step 2–4:** implement `renderTokensCss` (sections: `:root` primitives + semantic shadcn tokens + `--pt` + type + control metrics + radii + motion + elevation + materials; `.dark`; `@media (prefers-contrast: more)` and `[data-contrast="more"]`; `[data-platform="macos"]`; `@supports (font: -apple-system-body) and (-webkit-touch-callout: none)` sets `--pt: calc(1rem / 17)`), `scripts/build-css.ts` writes the file (`node scripts/build-css.ts`, script `tokens:build`). Run, commit `feat(tokens): generated tokens.css`.

### Task 7: `globals.css` bridge and base styles

**Files:** Modify `packages/ui/src/styles/globals.css`; create `packages/ui/__tests__/globals.test.ts`

- [ ] Failing test: the stylesheet imports `./tokens.css` after `shadcn/tailwind.css`; declares `--text-body: var(--type-body-size)` with `--text-body--line-height` and `--text-body--font-weight` in `@theme inline`; declares `--color-system-blue: var(--system-blue)`, `--color-label-2: var(--label-2)`, `--color-fill-3: var(--fill-3)`; keeps `--radius: 0.625rem`; defines utilities `material-regular` and `glass`; sets `--font-sans` to the system stack.
- [ ] Implement: replace the scaffold's neutral palette with the semantic mapping from spec §5.3 (each `--background`, `--primary`, … set to `var(--…)` primitives), the `@theme inline` bridge for every primitive colour, every text style, `--font-sans/rounded/mono`, `--ease-*`, `--radius-sheet`, `--radius-icon`; `@layer base` with `-webkit-text-size-adjust`, tap highlight, `touch-action: manipulation` on controls, `font-optical-sizing: auto`, `@media (pointer: coarse) input { font-size: max(16px, 1rem) }`; `@utility material-ultra-thin|thin|regular|thick`, `@utility glass`, `@utility glass-clear` with `prefers-reduced-transparency` and `[data-transparency="reduced"]` fallbacks; `@utility hairline` (0.5px separator via box-shadow).
- [ ] Commit `feat(ui): Apple theme bridge in globals.css`

### Task 8: Platform provider, contrast helper, research document

**Files:** `packages/ui/src/lib/platform.tsx` (`PlatformProvider`, `usePlatform`), `packages/ui/src/lib/contrast.ts` (`contrastRatio(fg: Rgba, bg: Rgb): number`, `composite`), tests; `docs/research/apple-design-system-reference.md` (every number used by the tokens with its source URL and date; approximations marked).

- [ ] Tests: `PlatformProvider platform="macos"` renders `data-platform="macos"` on its wrapper and `usePlatform()` returns `'macos'`; default is `'ios'`; `contrastRatio({rgb:[255,255,255]}, [0,136,255])` is `3.5 ± 0.05`; `contrastRatio(labels['label-2'].light, [255,255,255])` is `3.4 ± 0.1`; a `token-contrast` test asserts `foreground` on `background` ≥ 4.5 in light and dark and `primary-foreground` on `primary` ≥ 3 (Apple's rule for 17 pt semibold).
- [ ] Commit `feat(ui): platform provider, contrast helper, research doc`

---

## Milestone 2 — Foundation components

Each component task follows the same cycle: write `packages/ui/__tests__/<name>.test.tsx`, run it and watch it fail, write `packages/ui/src/components/<name>.tsx`, run to green, run axe, commit `feat(ui): <name>`. Base UI import paths are `@base-ui/react/<part>`. Registry code for the Luma style (fetched into the scratch probe) is the starting point for structure, then restyled to the Apple metrics below.

### Task 9: `text`
- API: `<Text style="large-title|title-1|title-2|title-3|headline|body|callout|subheadline|footnote|caption-1|caption-2" color="label|label-2|label-3|label-4|tint" emphasized weight? as="p|span|h1…" />`. Classes: `text-<style>`, `text-<color>`, emphasized → `font-[var(--type-<style>-emphasized)]` (generated per style).
- Tests: renders `<p>` with `text-body` by default; `style="large-title" as="h1"` renders an `h1` with `text-large-title`; `emphasized` adds the emphasized weight class; `color="label-2"` adds `text-label-2`.

### Task 10: `icon`
- API: `<Icon icon={Cancel01Icon} scale="small|medium|large" weight="regular|semibold|bold" aria-label? />` wrapping `HugeiconsIcon`; sizes relative to text: small `0.85em`, medium `1em` (cap-height aligned via `size-[1.2em]`), large `1.3em`; `strokeWidth` 1.5/2/2.5; `aria-hidden` when no label.
- Tests: renders an `svg` with `aria-hidden="true"` by default; with `aria-label` renders `role="img"`; `scale="large"` applies the large size class; a snapshot of the class string for medium.

### Task 11: `material` and `glass`
- API: `<Material thickness="ultra-thin|thin|regular|thick" as? />`, `<Glass variant="regular|clear" tint? interactive? shape="capsule|rounded|circle" />`.
- Tests: classes `material-regular`, `glass`, `glass-clear`, `rounded-full` for capsule, `data-slot`.

### Task 12: `separator`
- Base UI Separator; `inset="none|leading|both"` (iOS list separators start after the leading content: `ms-4`), hairline via `hairline` utility.
- Tests: `role="separator"`, orientation attribute, inset class.

### Task 13: `button` (fully worked)

**Files:** `packages/ui/src/components/button.tsx`, `packages/ui/__tests__/button.test.tsx`

- [ ] **Step 1: Failing tests**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Button, buttonVariants } from '../src/components/button'

test('filled is the default variant at the regular iOS size', () => {
  render(<Button>Continue</Button>)
  const b = screen.getByRole('button', { name: 'Continue' })
  expect(b).toHaveAttribute('data-slot', 'button')
  expect(b).toHaveAttribute('data-variant', 'filled')
  expect(b).toHaveAttribute('data-size', 'regular')
  expect(b.className).toContain('bg-primary')
  expect(b.className).toContain('h-(--control-height-regular)')
  expect(b.className).toContain('rounded-full')
})
test.each([
  ['tinted', 'bg-primary/15 text-primary'],
  ['gray', 'bg-fill-3 text-primary'],
  ['bordered', 'border-border'],
  ['plain', 'text-primary'],
  ['glass', 'glass'],
  ['glass-prominent', 'glass bg-primary'],
  ['destructive', 'text-destructive'],
])('%s variant', (variant, classes) => {
  expect(buttonVariants({ variant: variant as never })).toContain(classes.split(' ')[0])
})
test.each([['mini', 'mini'], ['small', 'small'], ['large', 'large'], ['xl', 'xl']])('size %s', (size) => {
  expect(buttonVariants({ size: size as never })).toContain(`h-(--control-height-${size})`)
})
test('shape rounded uses the control radius, circle is square', () => {
  expect(buttonVariants({ shape: 'rounded' })).toContain('rounded-lg')
  expect(buttonVariants({ shape: 'circle' })).toContain('aspect-square')
})
test('icon-only buttons require a label (axe)', async () => {
  const { container } = render(<Button shape="circle" aria-label="Close"><svg /></Button>)
  expect(await axe(container)).toHaveNoViolations()
})
test('press state is reachable with the keyboard', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Go</Button>)
  await userEvent.tab(); await userEvent.keyboard('{Enter}')
  expect(onClick).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run** `pnpm --filter @apple-ds/ui test button` — Expected: FAIL (`data-variant` missing, sizes missing).

- [ ] **Step 3: Implement**

```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap select-none border border-transparent bg-clip-padding text-body font-semibold transition-[background-color,transform,opacity] duration-(--duration-press) ease-(--ease-standard) outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] active:opacity-80 disabled:pointer-events-none disabled:opacity-40 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),black_8%)]',
        tinted: 'bg-primary/15 text-primary hover:bg-primary/20',
        gray: 'bg-fill-3 text-primary hover:bg-fill-2',
        bordered: 'border-border bg-transparent text-primary hover:bg-fill-4',
        plain: 'bg-transparent text-primary hover:bg-fill-4',
        glass: 'glass text-foreground',
        'glass-prominent': 'glass bg-primary text-primary-foreground',
        destructive: 'bg-destructive/15 text-destructive hover:bg-destructive/20',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        mini: 'h-(--control-height-mini) px-2.5 text-caption-1',
        small: 'h-(--control-height-small) px-3 text-subheadline',
        regular: 'h-(--control-height-regular) px-5',
        large: 'h-(--control-height-large) px-6',
        xl: 'h-(--control-height-xl) px-7 text-title-3',
      },
      shape: {
        capsule: 'rounded-full',
        rounded: 'rounded-lg',
        circle: 'aspect-square rounded-full px-0',
      },
    },
    defaultVariants: { variant: 'filled', size: 'regular', shape: 'capsule' },
  }
)

function Button({ className, variant = 'filled', size = 'regular', shape = 'capsule', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 4: Run** — PASS. **Step 5: Commit** `feat(ui): button with Apple styles, sizes and shapes`

### Task 14: `toggle` (Base UI Toggle; `pressed` → `data-pressed` tinted background `bg-primary/15 text-primary`, circle/capsule shapes; tests: `aria-pressed` toggles on click, pressed class).
### Task 15: `badge` (span; variants `count` (red capsule h-[18px] min-w-[18px] text-footnote font-medium text-white bg-system-red), `tag` (capsule tinted); tests: text, classes, `role="status"` when `live`).
### Task 16: `spinner` (activity indicator: 8 bars, `size="medium|large"` 20/37 px, `aria-label="Loading"`, `role="status"`, motion-reduce static; tests: role, size class, 8 bar elements).
### Task 17: `progress` (Base UI Progress: linear h-1 rounded-full track `bg-fill-3` indicator `bg-primary`; `variant="circular"` SVG ring 20/37; tests: `role="progressbar"`, `aria-valuenow`, indicator width style 40%, circular renders `circle` with `stroke-dashoffset`).

---

## Milestone 3 — Form controls

### Task 18: `switch` — Base UI Switch. Root `w-[51px] h-[31px] rounded-full bg-fill-2 data-checked:bg-system-green` (macOS via `[data-platform=macos]`: `w-[38px] h-[22px]`), thumb `size-[27px] rounded-full bg-white shadow-(--shadow-thumb) translate-x-[2px] data-checked:translate-x-[22px]`, transition `duration-(--duration-hover) ease-(--ease-standard)`. Tests: `role="switch"`, `aria-checked` flips on click and Space, checked class, `data-slot="switch-thumb"`.
### Task 19: `checkbox` — Base UI Checkbox. iOS: `size-[22px] rounded-full border-[1.5px] border-gray-3 data-checked:bg-primary data-checked:border-primary` with a check icon; macOS: `size-[14px] rounded-[3.5px]`; indeterminate renders a dash. Tests: role, `aria-checked` mixed, platform classes via `PlatformProvider`.
### Task 20: `radio-group` — Base UI RadioGroup/Radio: `size-[22px] rounded-full border-[1.5px] border-gray-3 data-checked:border-[7px] data-checked:border-primary` (iOS "filled ring"), macOS 14 px with 6 px dot. Tests: `role="radiogroup"`, arrow-key moves selection, `aria-checked`.
### Task 21: `slider` — Base UI Slider: track `h-1 rounded-full bg-fill-2`, indicator `bg-primary`, thumb `size-7 rounded-full bg-white shadow-(--shadow-thumb)` (macOS `size-5`), optional `minimumValueLabel`/`maximumValueLabel` icons, ticks. Tests: `role="slider"`, ArrowRight increments, `aria-valuenow`, thumb class.
### Task 22: `stepper` — Base UI NumberField: group `h-8 w-[94px] rounded-lg bg-fill-3` with two 47 px halves separated by a hairline, `−`/`+` icons 15 px semibold, `value` shown by the paired input. Tests: `role="group"`, clicking `+` increments the input value, `aria-label`s "Decrement"/"Increment".
### Task 23: `segmented-control` — Base UI Tabs (list + indicator): container `h-8 rounded-full bg-fill-3 p-0.5`, indicator `rounded-full bg-background shadow-(--shadow-segment)`, labels `text-footnote font-medium data-active:font-semibold`, momentary mode via `ToggleGroup`. Tests: `role="tablist"`, arrow keys move, indicator present, `aria-selected`.
### Task 24: `tabs` — Base UI Tabs with `SegmentedControl` as its list and `TabsPanel`; tests: panel switches, `aria-controls` wiring.
### Task 25: `input`, `textarea`, `label`, `field` — Base UI Input/Field. `variant="plain|rounded|bordered"`: rounded is `h-9 rounded-lg bg-fill-3 px-3 text-body placeholder:text-placeholder` (macOS `h-[22px] rounded-md border border-input bg-background`), `clearable` shows the iOS clear button (`xmark.circle.fill` equivalent) only when there is a value. Field: label/description/error (`text-footnote text-destructive`), `aria-invalid`. Tests: `role="textbox"`, clear button appears after typing and clears, error links via `aria-describedby`.
### Task 26: `search-field` — `h-9 rounded-full bg-fill-3` with leading search icon (`text-label-2`), placeholder "Search", clear button, optional Cancel button (`text-primary`, `text-body`) shown while focused/with value. Tests: `role="searchbox"`, cancel button clears and blurs, Escape clears.
### Task 27: `select` — Base UI Select styled as a menu picker: trigger `plain` text with chevron.up.chevron.down (`text-label-2`), popup `w-[250px] rounded-4xl glass p-1`, items `h-11 rounded-xl px-4 text-body data-highlighted:bg-fill-3`, check mark on the selected item (leading in iOS 26). Also `variant="popup"` (macOS pop-up button: `h-[22px] rounded-md bg-background border shadow-(--shadow-control)`). Tests: opens on click, `role="listbox"`, selects with keyboard, shows selected value.

---

## Milestone 4 — Overlays

### Task 28: `menu` — Base UI Menu: popup `min-w-[250px] rounded-4xl glass p-1 shadow-(--shadow-menu)`, items `h-11 px-4 text-body gap-3` with leading icon slot, `destructive` items `text-destructive`, groups separated by an 8 px `bg-fill-4` band (thick separator), submenus with trailing chevron, `checked` items with leading checkmark, `Menu.Shortcut` via `kbd`. Tests: opens on click, `role="menu"`, ArrowDown focuses first item, Escape closes, destructive class.
### Task 29: `context-menu` — Base UI ContextMenu with the same item styles. Tests: opens on `contextmenu` event, closes on Escape.
### Task 30: `popover` — Base UI Popover with arrow (`Popover.Arrow` 13×6.5 svg), popup `rounded-4xl material-regular p-4 shadow-(--shadow-popover)`. Tests: `role="dialog"`, arrow present, closes on outside click.
### Task 31: `tooltip` — Base UI Tooltip: `rounded-md material-thick px-2 py-1 text-caption-1` (macOS 11 pt), delay 500 ms. Tests: appears on hover after delay (fake timers), `role="tooltip"`.
### Task 32: `alert-dialog` — Base UI AlertDialog: backdrop `bg-black/40`, popup `w-[270px] rounded-4xl material-thick text-start` with title `text-headline`, description `text-footnote text-label-2`, optional `AlertDialogInput`, actions stacked when >2 or any label is long else side-by-side, each `h-11 text-body` separated by hairlines, `preferred` → `font-semibold`, `destructive` → `text-destructive`, cancel leading. Tests: `role="alertdialog"`, focus lands in the dialog, Escape triggers cancel, layout attribute `data-layout="stacked"` when three actions.
### Task 33: `sheet` — phone (<640): Base UI Drawer bottom sheet `rounded-t-sheet bg-popover` (half sheets `mx-2 mb-2 rounded-sheet` when `detent="medium"`), grabber `h-[5px] w-9 rounded-full bg-fill-2 mt-[5px]`, detents `medium|large`, `ease-(--ease-sheet) duration-(--duration-sheet)`; desktop (≥640): Base UI Dialog centred `rounded-4xl max-w-[540px]`. Header with Cancel/Done toolbar (`SheetToolbar`). Tests: `role="dialog"`, grabber present on phone (matchMedia mocked), Done/Cancel slots render, Escape closes.
### Task 34: `action-sheet` — phone: Drawer with `ActionSheetGroup` (`rounded-4xl material-thick mx-2`) rows `h-14 text-title-3 text-primary` (destructive red, title/message `text-footnote text-label-2`) and a separate Cancel group `mt-2 font-semibold`; iPad/desktop: Popover anchored to the trigger. Tests: destructive first, cancel last, `role="dialog"`, Escape cancels.
### Task 35: `dialog` — Base UI Dialog for macOS sheets/iPad form sheets: `rounded-4xl bg-popover shadow-(--shadow-window) w-[540px]`, header `text-title-2`, footer with trailing primary button. Tests: role, title wiring (`aria-labelledby`), close button label.

---

## Milestone 5 — Structure

### Task 36: `list` — `List style="plain|grouped|inset-grouped|sidebar"`, `ListSection header footer`, `ListRow leading title subtitle value accessory="disclosure|checkmark|detail|none" href? onClick?`. Inset grouped: `mx-(--list-inset) rounded-4xl bg-card overflow-hidden`, rows `min-h-(--list-row-min-height) py-(--list-row-padding-y) px-(--list-row-padding-x) gap-3`, separators inset to the title (`ms-(--list-row-padding-x)` plus leading width), header `text-subheadline text-label-2 px-4 pb-2` (sentence case), leading icon tile `size-[30px] rounded-[7px]`. Rows with `href` render `a`, with `onClick` render `button`, else `div`; interactive rows `active:bg-fill-3`. Tests: renders `ul/li`, disclosure chevron icon present, header text, `href` row is a link, checkmark accessory uses `aria-checked`.
### Task 37: `card` — group box: `rounded-4xl bg-card p-4` with `CardHeader/CardTitle(text-headline)/CardDescription(text-footnote text-label-2)/CardContent/CardFooter`. Tests: slots.
### Task 38: `table` — macOS table: header `h-6 text-caption-1 text-label-2 hairline-b`, rows `h-7 text-subheadline`, `striped` → `even:bg-fill-4`, `selectable` rows `aria-selected` → `bg-primary text-primary-foreground`. Tests: roles, striped class, selected row class.
### Task 39: `disclosure-group` — Base UI Collapsible: trigger row with trailing chevron (`rotate-90` when open, `text-label-2 text-footnote font-semibold`), panel animates height. Tests: `aria-expanded`, panel hidden/shown.
### Task 40: `page-control` — `count`, `index`, `onChange`, dots `size-[7px] rounded-full bg-label-4 data-current:bg-label`, gap 9 px, `background="automatic|prominent|minimal"` → prominent renders `material-thin rounded-full px-2 py-1`, buttons on each side for tap-to-advance. Tests: `role="tablist"` with `aria-selected`, click on trailing side advances, arrow keys.
### Task 41: `navigation-bar` — `NavigationBar title largeTitle? leading trailing` + `useScrollCollapse(ref)`: fixed 44 px bar with `glass` (scroll-edge effect: material only once `data-collapsed`), large title `text-large-title font-bold px-4 h-[52px]` in flow, collapsed small title `text-headline` fades in; back button = circle glass button with chevron. Tests: renders `role="banner"`?? no — `header` landmark with `aria-label`, large title `h1`, `data-collapsed` toggles from the hook (IntersectionObserver mocked).
### Task 42: `tab-bar` — `TabBar items=[{icon,label,href|onSelect,badge?}] search?` renders a fixed floating capsule `h-16 mx-[21px] mb-[max(21px,env(safe-area-inset-bottom))] rounded-full glass` with items (`icon` 24 px + `text-caption-2` 11 px label, selected `text-primary`), `minimized` state shows only the selected item, a separate circular search button. Tests: `role="navigation"`, `aria-current="page"` on the active item, badge text, minimized hides other labels.
### Task 43: `toolbar` — Base UI Toolbar: `Toolbar placement="top|bottom"` with `ToolbarGroup` (each group is a glass capsule `gap-1 p-1`), `ToolbarButton` (circle glass 44), `ToolbarSpacer flexible|fixed`, `prominent` button = `glass-prominent`. Tests: `role="toolbar"`, arrow keys move focus between buttons, prominent class.
### Task 44: `sidebar` — adapt the registry sidebar: `w-[240px] material-regular` (macOS width 200–260), items `h-7 rounded-md px-2 text-subheadline gap-2` (iPad `h-11`), selected `bg-fill-3 font-medium`, icons `text-primary`, group labels `text-caption-1 text-label-3 uppercase? no — sentence case`, collapsible groups via `disclosure-group`. Tests: `role="navigation"`, `aria-current`, collapse toggles `data-state`.
### Task 45: `split-view` — `SplitView columns={2|3}` grid with `SplitViewSidebar|Content|Detail`, 1 px hairline dividers, collapses to a stack below `lg`. Tests: renders three regions with `aria-label`s, divider count.
### Task 46: `empty` — `Empty icon title description actions` (ContentUnavailableView): icon 48 px `text-label-3`, title `text-title-2 font-bold`, description `text-body text-label-2`. Tests: role `status`? no — plain `section` with heading; heading present, icon aria-hidden.
### Task 47: `skeleton`, `avatar`, `kbd` — skeleton `rounded-md bg-fill-3 animate-pulse motion-reduce:animate-none`; avatar (Base UI Avatar) `rounded-full bg-gray-3 text-white` monogram fallback; kbd `rounded-md bg-fill-3 px-1.5 text-caption-1 font-medium`. Tests per component: roles/classes/fallback text.

---

## Milestone 6 — Design-system app

### Task 48: App chrome
- Files: `apps/web/app/layout.tsx` (system font stack, `ThemeProvider` from next-themes with `attribute="class"`, `PlatformProvider` driven by a cookie-free client store in `apps/web/components/platform-switch.tsx`), `apps/web/app/(docs)/layout.tsx` (sidebar from `@apple-ds/ui/components/sidebar` with Foundations + Components groups, top toolbar with platform segmented control and appearance menu), `apps/web/app/page.tsx` overview (hero, principle cards, links).
- Test (`apps/web/__tests__/nav.test.ts`): `docsNav` lists every component in `registry/index.ts` and every foundation page.

### Task 49: Foundations pages
- `/foundations/color` (system colours table with swatches in light/dark/accessible + grays + semantic mapping, contrast per pair), `/foundations/typography` (iOS Large table, macOS table, full Dynamic Type matrix, tracking table, live specimen), `/foundations/layout` (margins, hit targets, device table, safe areas), `/foundations/materials` (live material and glass swatches over an image), `/foundations/shapes` (radius ladder, concentric demo, icon mask), `/foundations/motion` (easings/springs with play buttons), `/foundations/icons` (Hugeicons ↔ SF Symbols mapping, scales/weights), `/foundations/platforms` (the switch and what it changes). All tables are rendered from `@apple-ds/ui/tokens/*`.
- Test: each foundation route renders its `h1` (React Testing Library on the page components).

### Task 50: Component pages and examples
- `apps/web/registry/index.ts` — `componentDocs: ComponentDoc[]` (`{ name, title, description, apple: { name, hig }, primitive, examples: { name, title, file }[] }`), `apps/web/registry/examples/<component>/<example>.tsx`, generated `apps/web/registry/examples.ts` map (script `pnpm --filter @apple-ds/web examples:index`), page `app/(docs)/components/[name]/page.tsx` with `generateStaticParams`, live preview in a `Preview` frame (light/dark + platform aware), source via `fs.readFile` + shiki.
- Tests: every `ComponentDoc.name` has a matching `packages/ui/src/components/<name>.tsx`; every example file exists and is in the map; every component file has a doc.

### Task 51: Registry build
- `apps/web/registry.json` (`registry:ui` per component with `files[].path` pointing into `../../packages/ui/src/components/`, `registryDependencies`, `dependencies`), one `registry:style` item `apple` carrying `cssVars` (light/dark) and the `css` block for utilities, `registry:hook` for `use-scroll-collapse`, `registry:lib` for `platform` and `utils`. Script `registry:build` = `shadcn build ./registry.json -o ./public/r`. `next build` runs it first.
- Test: `registry.json` names match `componentDocs`; after build every `public/r/<name>.json` exists and parses.

### Task 52: README and AGENTS
- Root README: what it is, the stack, `pnpm dev`, `pnpm ui:add`, how to consume the registry (`shadcn add https://<host>/r/button.json`), the platform switch, the token pipeline. `packages/ui/AGENTS.md` rules (tokens only, Base UI only, Hugeicons only, `pnpm tokens:build` after token edits).

---

## Milestone 7 — Gates

### Task 53: `pnpm check` green, final commit, summary
- Run `pnpm check`; fix everything it reports; commit; write the summary (what was built, what is approximated, what the owner does next: remote, hosting, fonts).
