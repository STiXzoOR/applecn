# shadcn Parity with Apple Fidelity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make applecn a true shadcn fork — every shadcn primitive present under shadcn's name with shadcn's exports, every pixel still measured Apple, and an install that actually works.

**Architecture:** Replace the three `ios:`/`macos:`/`web:` Tailwind variants with 103 semantic tokens supplied by three installable themes, so components become plain shadcn components reading CSS variables. Then close the export-surface gaps, build the 14 missing primitives, and rebuild 13 Apple components as compositions of shadcn primitives rather than parallel implementations.

**Tech Stack:** pnpm workspace + Turborepo, Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Base UI 1.8, Hugeicons, vitest + @testing-library + vitest-axe, oxlint + oxfmt, shadcn registry v4.

**Spec:** `docs/superpowers/specs/2026-09-07-shadcn-parity-design.md`

## Global Constraints

- **Parity rule (spec §3):** where shadcn ships a primitive, ship _that_ primitive — shadcn's item name, exported sub-component names, composition — styled as Apple. Apple-only things are additive, built on a shadcn primitive. Never rename away from shadcn.
- **No token value may change.** Every number stays tied to `docs/research/apple-design-system-reference.md` via the fixtures in `packages/ui/src/tokens/__tests__/`.
- **No npm package.** Everything ships through the shadcn registry (`cssVars`, `css`, `dependencies`).
- **`pnpm check` green** (oxlint --type-aware, oxfmt --check, tsc, vitest, build) at the end of every task.
- **Commits:** conventional, header ≤100 chars, scope from `ui|web|tokens|registry|docs|spec|skills|ci|lint|deps|repo|release`, signed off (`-s`). Body lines unlimited.
- **Custom utilities stay unprefixed**, matching shadcn's own `shimmer`/`scroll-fade`/`no-scrollbar`.
- **`tokens.css` is generated**, never hand-edited. `packages/ui/scripts/build-css.ts` writes it; a test regenerates in memory and fails on drift.

## Granularity note

Phases 1 and 2 are one-off structural work and are specified as full TDD task cycles. Phases 3–6 are
largely repetition of a handful of patterns across many components; each of those phases gives one
**fully worked exemplar task** plus a table of the remaining instances with the specifics that differ
(Apple reference, exports, tokens). An executor follows the exemplar's code shape for each row. This
is deliberate: writing 86 near-identical task bodies would bury the parts that actually differ.

---

## File Structure

**New:**

- `packages/ui/src/tokens/components.ts` — per-component appearance tokens (background, border colour, border width, shadow, weight, spacing) per platform. The 103 slots live here. Sibling to `metrics.ts`, same typed-data shape.
- `packages/ui/__tests__/tokens/components.test.ts` — fixtures for the above.
- `packages/ui/__tests__/idiom-fidelity.test.tsx` — the phase 2 harness.
- `packages/ui/__tests__/shadcn-export-parity.test.ts` — the phase 2 export audit.
- `apps/web/scripts/themes.ts` — builds the three `registry:theme` items.

**Modified:**

- `packages/ui/src/lib/utils.ts` — becomes a real `cn` (clsx + tailwind-merge), not a re-export.
- `packages/ui/src/tokens/css.ts` — emits `components.ts` into the `[data-platform]` scopes.
- `packages/ui/src/styles/globals.css` — delete 3 `@custom-variant` blocks, delete `knob`/`pressable`, move `hairline*` to `@theme`.
- `packages/ui/src/components/*.tsx` — 25 files detokenised, all 64 change their `cn` import.
- `apps/web/scripts/registry-data.ts` — ship base layer, declare `tw-animate-css`, rewrite `./` sibling imports.

**Deleted:**

- `packages/ui/src/components/segmented-control.tsx` (folds into `toggle-group`).

---

# Phase 1 — Detokenise and make installable

Spec §7.1. Acceptance: a scratch Next app outside this repo runs `npx shadcn@latest add @applecn/ios` plus components and renders correctly, with animations, base styles and all three idioms working.

### Task 1: `cn` becomes shadcn's, not an npm package

**Files:**

- Modify: `packages/ui/src/lib/utils.ts`
- Modify: `packages/ui/package.json` (drop `cn`, add `clsx`, `tailwind-merge`)
- Test: `packages/ui/__tests__/utils.test.ts` (create)

**Interfaces:**

- Produces: `cn(...inputs: ClassValue[]): string` from `@/lib/utils`. Every component imports this from Task 2 onward.

- [ ] **Step 1: Write the failing test**

```ts
// packages/ui/__tests__/utils.test.ts
import { describe, expect, test } from "vitest"

import { cn } from "../src/lib/utils"

describe("cn", () => {
  test("resolves a genuine Tailwind conflict, last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  test("keeps a type utility beside a text colour", () => {
    // The reason type-* are @utility blocks and not @theme --text-* entries:
    // tailwind-merge groups by prefix, so `text-body` would drop `text-label`.
    expect(cn("type-body", "text-label")).toBe("type-body text-label")
  })

  test("takes clsx-style conditionals", () => {
    expect(cn("a", false && "b", ["c", { d: true, e: false }])).toBe("a c d")
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/utils.test.ts`
Expected: FAIL — `utils.ts` re-exports the `cn` package, whose conflict tables differ; and `clsx`/`tailwind-merge` are not installed.

- [ ] **Step 3: Install the shadcn dependencies**

```bash
cd packages/ui && pnpm remove cn && pnpm add clsx tailwind-merge
```

- [ ] **Step 4: Write the implementation**

```ts
// packages/ui/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges class names, resolving Tailwind conflicts so the last one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Run the test**

Run: `cd packages/ui && pnpm vitest run __tests__/utils.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/lib/utils.ts packages/ui/package.json packages/ui/__tests__/utils.test.ts pnpm-lock.yaml
git commit -s -m "refactor(ui): cn is clsx and tailwind-merge in lib/utils, as shadcn ships it"
```

### Task 2: Every component imports `cn` from `@/lib/utils`

**Files:**

- Modify: all 64 of `packages/ui/src/components/*.tsx`
- Test: `packages/ui/__tests__/shadcn-conventions.test.ts` (create)

**Interfaces:**

- Consumes: `cn` from Task 1.

- [ ] **Step 1: Write the failing test**

```ts
// packages/ui/__tests__/shadcn-conventions.test.ts
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

const dir = join(import.meta.dirname, "../src/components")
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"))

describe("shadcn source conventions", () => {
  test.each(files)(
    "%s imports cn from the local lib, never a package",
    (file) => {
      const source = readFileSync(join(dir, file), "utf8")
      expect(source).not.toMatch(/from "cn"/)
      if (source.includes("cn("))
        expect(source).toMatch(/from "\.\.\/lib\/utils"/)
    }
  )
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/shadcn-conventions.test.ts`
Expected: FAIL on all 64 — every file has `from "cn"`.

- [ ] **Step 3: Rewrite the imports**

```bash
cd packages/ui/src/components
sed -i 's|^import { cn } from "cn"$|import { cn } from "../lib/utils"|' *.tsx
```

- [ ] **Step 4: Run the whole suite**

Run: `cd packages/ui && pnpm vitest run`
Expected: PASS — 64 convention tests plus the existing suite unchanged.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components packages/ui/__tests__/shadcn-conventions.test.ts
git commit -s -m "refactor(ui): import cn from lib/utils in every component"
```

### Task 3: The component-appearance token module

**Files:**

- Create: `packages/ui/src/tokens/components.ts`
- Create: `packages/ui/src/tokens/__tests__/components.test.ts`
- Modify: `packages/ui/src/tokens/css.ts`

**Interfaces:**

- Produces: `componentTokens: Record<Platform, ComponentTokens>` and `componentLines(platform: Platform): Line[]`, consumed by `css.ts` and by Tasks 4–6.
- `Line` is the existing `readonly [name: string, value: string]` from `css.ts`.

This task covers `checkbox` and `radio` only — the smallest, already-proven pair. Tasks 4–6 extend the same module to the remaining components.

- [ ] **Step 1: Write the failing test**

```ts
// packages/ui/src/tokens/__tests__/components.test.ts
import { describe, expect, test } from "vitest"

import { componentLines, componentTokens } from "../components"

describe("component appearance tokens", () => {
  test("the checkbox bezel is the resting state on macOS and the web, absent on iOS", () => {
    // Measured 2026-09-06: iOS draws a bare ring, macOS and the web a filled bezel.
    expect(componentTokens.ios.checkbox.bg).toBe("transparent")
    expect(componentTokens.macos.checkbox.bg).toBe("var(--background-3)")
    expect(componentTokens.web.checkbox.bg).toBe("var(--background-3)")
  })

  test("the border narrows from 1.5 to 1 off iOS", () => {
    expect(componentTokens.ios.checkbox.borderWidth).toBe(1.5)
    expect(componentTokens.macos.checkbox.borderWidth).toBe(1)
    expect(componentTokens.web.checkbox.borderWidth).toBe(1)
  })

  test("only macOS carries the control bezel shadow", () => {
    expect(componentTokens.macos.checkbox.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.checkbox.shadow).toBe("none")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["checkbox-bg", "var(--background-3)"])
    expect(lines).toContainEqual(["checkbox-border-width", "1px"])
    expect(lines).toContainEqual([
      "checkbox-shadow",
      "var(--elevation-control)",
    ])
  })

  test("radio matches checkbox, since AppKit draws them on the same bezel", () => {
    for (const p of ["ios", "macos", "web"] as const) {
      expect(componentTokens[p].radio.bg).toBe(componentTokens[p].checkbox.bg)
      expect(componentTokens[p].radio.borderWidth).toBe(
        componentTokens[p].checkbox.borderWidth
      )
    }
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run src/tokens/__tests__/components.test.ts`
Expected: FAIL — `Cannot find module '../components'`.

- [ ] **Step 3: Write the module**

```ts
// packages/ui/src/tokens/components.ts
import type { Platform } from "../lib/platform"

/**
 * Per-component appearance, per idiom. `metrics.ts` holds geometry Apple publishes;
 * this holds the paint that used to live in `ios:`/`macos:`/`web:` classes. Splitting
 * them keeps the measured geometry fixtures untouched.
 */
export interface Bezel {
  /** Resting background. */
  readonly bg: string
  /** Resting border colour. */
  readonly border: string
  /** Border width in px. */
  readonly borderWidth: number
  /** Resting box-shadow. */
  readonly shadow: string
}

export interface ComponentTokens {
  readonly checkbox: Bezel
  readonly radio: Bezel
}

const iosBezel: Bezel = {
  bg: "transparent",
  border: "var(--gray-3)",
  borderWidth: 1.5,
  shadow: "none",
}

const macosBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-3)",
  borderWidth: 1,
  shadow: "var(--elevation-control)",
}

const webBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-4)",
  borderWidth: 1,
  shadow: "none",
}

export const componentTokens: Record<Platform, ComponentTokens> = {
  ios: { checkbox: iosBezel, radio: iosBezel },
  macos: { checkbox: macosBezel, radio: macosBezel },
  web: { checkbox: webBezel, radio: webBezel },
}

type Line = readonly [string, string]

const bezelLines = (name: string, b: Bezel): Line[] => [
  [`${name}-bg`, b.bg],
  [`${name}-border`, b.border],
  [`${name}-border-width`, `${b.borderWidth}px`],
  [`${name}-shadow`, b.shadow],
]

/** Every component appearance token for one idiom, as CSS variable lines. */
export function componentLines(platform: Platform): Line[] {
  const t = componentTokens[platform]
  return [
    ...bezelLines("checkbox", t.checkbox),
    ...bezelLines("radio", t.radio),
  ]
}
```

- [ ] **Step 4: Run the test**

Run: `cd packages/ui && pnpm vitest run src/tokens/__tests__/components.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Emit them into the platform scopes**

In `packages/ui/src/tokens/css.ts`, import `componentLines` and add it to the light-scope declarations inside `tokenPlatformCss()`:

```diff
+import { componentLines } from "./components"
...
     out[selector] = declarations([
       ...platformColorLines(colors, "light"),
       ...semanticAliases("light"),
       ...platformLines(platform),
+      ...componentLines(platform),
     ])
```

- [ ] **Step 6: Regenerate and verify the stylesheet test**

Run: `cd packages/ui && pnpm tokens:build && pnpm vitest run`
Expected: PASS. `tokens.css` now contains `--checkbox-bg` etc. under each `[data-platform]` scope.

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/tokens packages/ui/src/styles/tokens.css
git commit -s -m "feat(tokens): per-component appearance tokens, starting with the checkbox bezel"
```

### Task 4: Detokenise checkbox and radio-group

**Files:**

- Modify: `packages/ui/src/components/checkbox.tsx`, `packages/ui/src/components/radio-group.tsx`
- Test: `packages/ui/__tests__/checkbox.test.tsx`, `packages/ui/__tests__/radio-group.test.tsx`

**Interfaces:**

- Consumes: `--checkbox-*` and `--radio-*` from Task 3.

- [ ] **Step 1: Write the failing test**

```tsx
// append to packages/ui/__tests__/checkbox.test.tsx
describe("Checkbox is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", () => {
    render(<Checkbox aria-label="Tokens" />)
    const c = screen.getByRole("checkbox")
    expect(c.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(c.className).toContain("bg-(--checkbox-bg)")
    expect(c.className).toContain("border-(length:--checkbox-border-width)")
    expect(c.className).toContain("shadow-(--checkbox-shadow)")
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/checkbox.test.tsx`
Expected: FAIL — the class list still contains `macos:border` and `web:data-unchecked:bg-background-3`.

- [ ] **Step 3: Replace the variants with tokens**

In `checkbox.tsx`, replace this fragment of the root class string:

```
macos:border macos:shadow-control macos:data-unchecked:border-label-3 macos:data-unchecked:bg-background-3 web:border web:data-unchecked:border-label-4 web:data-unchecked:bg-background-3
```

with:

```
border-(length:--checkbox-border-width) shadow-(--checkbox-shadow) data-unchecked:border-(--checkbox-border) data-unchecked:bg-(--checkbox-bg)
```

and drop the now-redundant `border-[1.5px]` and `border-gray-3`, which the tokens supply. Apply the identical change to `radio-group.tsx` with `--radio-*`.

- [ ] **Step 4: Run the suite**

Run: `cd packages/ui && pnpm vitest run`
Expected: PASS, including `platform-state-cascade.test.ts` — with no platform variant left on these two, the collision it guards cannot occur here at all.

- [ ] **Step 5: Verify in the browser, all three idioms**

Start the dev server, open `/components/checkbox`, and confirm against the phase-1 baseline: iOS 22 pt circle, macOS and web 16 pt square with r4; checked, mixed, unchecked and disabled visibly distinct on each idiom.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/checkbox.tsx packages/ui/src/components/radio-group.tsx packages/ui/__tests__
git commit -s -m "refactor(ui): checkbox and radio read their bezel from tokens, not platform variants"
```

### Task 5: Detokenise the remaining 23 components

**Files:**

- Modify: `packages/ui/src/tokens/components.ts` (extend `ComponentTokens`)
- Modify: the 23 remaining files below
- Test: `packages/ui/__tests__/shadcn-conventions.test.ts` (extend)

Work in descending order of variant count so the hardest land first. Each file follows Task 4's cycle exactly: extend `components.ts` with that component's slots, add its fixture to `components.test.ts`, replace the variant classes with `(--token)` reads, run the suite, verify in the browser on all three idioms, commit.

| file                | variants | the slots it needs                                                           |
| ------------------- | -------- | ---------------------------------------------------------------------------- |
| `button`            | 20       | bg, border, shadow, font-weight, hover-bg, hover-text, active-scale          |
| `alert-dialog`      | 17       | bg, radius, shadow, padding, text-align, action colours                      |
| `menu`              | 15       | separator bg + height, item padding, gap, highlight bg/text, font, item type |
| `combobox`          | 10       | highlight bg/text, font, padding, shadow, border                             |
| `select`            | 10       | bg, highlight bg/text, font, hover-bg, shadow, border                        |
| `color-well`        | 8        | bg, border-width, height, padding, radius, shadow, width                     |
| `context-menu`      | 8        | as `menu`                                                                    |
| `menubar`           | 8        | as `menu`                                                                    |
| `toast`             | 8        | placement (inset + translate), width                                         |
| `search-field`      | 6        | bg, padding-start, shadow, border                                            |
| `toolbar`           | 6        | radius + two arbitrary-property blocks                                       |
| `passcode-field`    | 5        | height, shadow, width, border                                                |
| `input`             | 3        | shadow, border                                                               |
| `segmented-control` | 3        | folded in Phase 3 Task 2 — leave as-is                                       |
| `textarea`          | 3        | shadow, border                                                               |
| `toggle-group`      | 3        | pressed bg/text/shadow                                                       |
| `toggle`            | 3        | font-weight, active-scale                                                    |
| `action-sheet`      | 2        | hover bg/text                                                                |
| `link`              | 2        | font-weight                                                                  |
| `navigation-bar`    | 2        | radius                                                                       |
| `sidebar`           | 2        | gap, label colour                                                            |
| `list`              | 1        | header font-weight                                                           |
| `sheet`             | 1        | grabber height                                                               |

- [ ] **Step 1: Add the guard that finishes the phase**

```ts
// append to packages/ui/__tests__/shadcn-conventions.test.ts
describe("no platform variants remain", () => {
  test.each(files)("%s uses tokens, not ios:/macos:/web:", (file) => {
    const source = readFileSync(join(dir, file), "utf8")
    expect(source).not.toMatch(/(?<![\w-])(ios|macos|web):/)
  })
})
```

- [ ] **Step 2: Run it and watch it fail on 25 files**

Run: `cd packages/ui && pnpm vitest run __tests__/shadcn-conventions.test.ts`
Expected: FAIL on the 25 files in the table.

- [ ] **Step 3: Work the table top to bottom**

One commit per file, message `refactor(ui): <name> reads its idiom from tokens`.

- [ ] **Step 4: Confirm the guard passes**

Run: `cd packages/ui && pnpm vitest run`
Expected: PASS — zero platform variants in source.

### Task 6: Delete the three custom variants

**Files:**

- Modify: `packages/ui/src/styles/globals.css`
- Test: `packages/ui/__tests__/globals.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// append to packages/ui/__tests__/globals.test.ts
test("the idiom variants are gone; idioms are tokens now", () => {
  const css = readFileSync(
    join(import.meta.dirname, "../src/styles/globals.css"),
    "utf8"
  )
  expect(css).not.toContain("@custom-variant ios")
  expect(css).not.toContain("@custom-variant macos")
  expect(css).not.toContain("@custom-variant web")
  // dark stays: it is shadcn's, not ours.
  expect(css).toContain("@custom-variant dark")
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/globals.test.ts`
Expected: FAIL — the three blocks are still there.

- [ ] **Step 3: Delete the three `@custom-variant` blocks** from `globals.css` (lines 23–37 at time of writing), keeping the explanatory comment above them rewritten to describe the token approach.

- [ ] **Step 4: Run everything**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/styles/globals.css packages/ui/__tests__/globals.test.ts
git commit -s -m "refactor(tokens): delete the idiom variants; the themes carry the idiom now"
```

### Task 7: Delete `knob` and `pressable`, move `hairline*` to `@theme`

**Files:**

- Modify: `packages/ui/src/styles/globals.css`
- Modify: `packages/ui/src/components/{glass,navigation-bar,tab-bar,toolbar}.tsx` (drop `pressable`), `switch.tsx` and `slider.tsx` (drop `knob`)
- Test: `packages/ui/__tests__/globals.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// append to packages/ui/__tests__/globals.test.ts
test("knob and pressable are gone; both were stock utilities in disguise", () => {
  const css = readFileSync(
    join(import.meta.dirname, "../src/styles/globals.css"),
    "utf8"
  )
  expect(css).not.toContain("@utility knob")
  expect(css).not.toContain("@utility pressable")
  expect(css).not.toContain("@utility hairline")
  expect(css).toContain("--shadow-hairline:")
  expect(css).toContain("--shadow-hairline-t:")
  expect(css).toContain("--shadow-hairline-b:")
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/globals.test.ts`
Expected: FAIL.

- [ ] **Step 3: Replace `pressable` at its four call sites**

```
pressable
→ transition-[transform,opacity,background-color] duration-(--duration-press) ease-(--ease-standard) active:scale-[0.97] active:opacity-80 motion-reduce:active:scale-100
```

This is character-for-character what `button.tsx` already writes inline, which is why the utility is redundant.

- [ ] **Step 4: Replace `knob` at its call sites**

```
knob
→ bg-white shadow-(--elevation-thumb) rounded-full transition-[width,transform,translate,box-shadow] duration-(--duration-hover) ease-(--spring-snappy) motion-reduce:transition-none
```

- [ ] **Step 5: Move the hairlines into `@theme`**

```css
@theme {
  --shadow-hairline: 0 0 0 0.5px var(--separator);
  --shadow-hairline-t: inset 0 0.5px 0 var(--separator);
  --shadow-hairline-b: inset 0 -0.5px 0 var(--separator);
}
```

Then rewrite call sites: `hairline` → `shadow-hairline`, `hairline-t` → `shadow-hairline-t`, `hairline-b` → `shadow-hairline-b`. Delete the three `@utility` blocks.

- [ ] **Step 6: Run everything**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/ui
git commit -s -m "refactor(ui): drop knob and pressable, move the hairlines to theme shadows"
```

### Task 8: The registry ships what a consumer actually needs

**Files:**

- Modify: `apps/web/scripts/registry-data.ts`
- Test: `apps/web/__tests__/registry.test.ts`

**Interfaces:**

- Produces: a style item whose `css` contains the `@layer base` block, and items declaring `tw-animate-css`.

- [ ] **Step 1: Write the failing test**

```ts
// append to apps/web/__tests__/registry.test.ts
describe("a consumer gets everything the components need", () => {
  const registry = buildRegistry()
  const style = registry.items.find((i) => i.type === "registry:style")!

  test("ships the base layer, so Dynamic Type and the touch rules travel", () => {
    const css = JSON.stringify(style.css)
    expect(css).toContain("-apple-system-body")
    expect(css).toContain("touch-action")
  })

  test("declares tw-animate-css, which every overlay animation needs", () => {
    const animated = registry.items.filter((i) =>
      JSON.stringify(i.files ?? []).includes("animate-in")
    )
    expect(animated.length).toBeGreaterThan(0)
    for (const item of animated)
      expect(item.dependencies, item.name).toContain("tw-animate-css")
  })

  test("no item still depends on the cn package", () => {
    for (const item of registry.items)
      expect(item.dependencies ?? [], item.name).not.toContain("cn")
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd apps/web && pnpm vitest run __tests__/registry.test.ts`
Expected: FAIL on all three.

- [ ] **Step 3: Extend the style item's `css`** with a parsed `@layer base` block, alongside the existing `utilities(...)` and `tokenPlatformCss()` calls. Add a `baseLayer()` parser mirroring `utilities()`.

- [ ] **Step 4: Add the dependency rule** in the per-item builder: if a file's source matches `/\banimate-(in|out)\b/`, push `tw-animate-css` into `dependencies`.

- [ ] **Step 5: Rebuild and run**

Run: `pnpm registry:build && cd apps/web && pnpm vitest run`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -s -m "fix(registry): ship the base layer and declare tw-animate-css"
```

### Task 9: Sibling imports use the `@/components/ui` alias

**Files:**

- Modify: `apps/web/scripts/registry-data.ts:122`
- Test: `apps/web/__tests__/registry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// append to apps/web/__tests__/registry.test.ts
test("published sources import siblings by alias, as shadcn does", () => {
  for (const item of buildRegistry().items)
    for (const file of item.files ?? [])
      expect(file.content, item.name).not.toMatch(/from "\.\/[a-z-]+"/)
})
```

- [ ] **Step 2: Run it and watch it fail**

Expected: FAIL — `checkbox` imports `from "./icon"`.

- [ ] **Step 3: Extend the rewrite**

```diff
-  return source.replace(/from "\.\.\/(hooks|lib)\//g, 'from "@/$1/')
+  return source
+    .replace(/from "\.\.\/(hooks|lib)\//g, 'from "@/$1/')
+    .replace(/from "\.\/([a-z-]+)"/g, 'from "@/components/ui/$1"')
```

- [ ] **Step 4: Rebuild, run, commit**

```bash
pnpm registry:build && cd apps/web && pnpm vitest run
git add apps/web && git commit -s -m "fix(registry): publish sibling imports under the components alias"
```

### Task 10: Three installable themes

**Files:**

- Create: `apps/web/scripts/themes.ts`
- Modify: `apps/web/scripts/registry-data.ts`
- Test: `apps/web/__tests__/registry.test.ts`

**Interfaces:**

- Produces: `themeItems(): RegistryItem[]` returning three `registry:theme` items named `ios`, `macos`, `web`.

- [ ] **Step 1: Write the failing test**

```ts
// append to apps/web/__tests__/registry.test.ts
describe("the three idiom themes", () => {
  const items = buildRegistry().items

  test.each(["ios", "macos", "web"])(
    "%s installs one idiom's scope",
    (name) => {
      const theme = items.find((i) => i.name === name)!
      expect(theme.type).toBe("registry:theme")
      const css = JSON.stringify(theme.css)
      expect(css).toContain(`[data-platform="${name}"]`)
      for (const other of ["ios", "macos", "web"].filter((p) => p !== name))
        expect(css).not.toContain(`[data-platform="${other}"]`)
    }
  )

  test("the apple style item still carries all three", () => {
    const style = items.find((i) => i.name === "apple")!
    const css = JSON.stringify(style.css)
    for (const p of ["ios", "macos", "web"])
      expect(css).toContain(`[data-platform="${p}"]`)
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Expected: FAIL — no theme items exist.

- [ ] **Step 3: Write `themes.ts`**, reusing `tokenPlatformCss()` filtered to a single platform selector, and add the three items to the registry's `items` array.

- [ ] **Step 4: Rebuild, run, commit**

```bash
pnpm registry:build && cd apps/web && pnpm vitest run
git add apps/web && git commit -s -m "feat(registry): ios, macos and web as installable themes"
```

### Task 11: Prove it installs

**Files:** none in this repo — this task is the phase gate.

- [ ] **Step 1: Deploy the branch preview** so the registry URLs resolve, or run `pnpm --filter @applecn/web dev` and point `REGISTRY_URL` at `http://localhost:3000`.

- [ ] **Step 2: Scaffold a scratch app outside the repo**

```bash
cd /tmp && pnpm create next-app@latest applecn-smoke --ts --tailwind --app --no-src-dir --use-pnpm
cd applecn-smoke && pnpm dlx shadcn@latest init
```

- [ ] **Step 3: Install a theme and a spread of components**

```bash
pnpm dlx shadcn@latest add @applecn/ios
pnpm dlx shadcn@latest add @applecn/checkbox @applecn/button @applecn/dialog @applecn/switch @applecn/list
```

- [ ] **Step 4: Render and check**

Put all five on a page and run `pnpm dev`. Confirm: the checkbox draws its tick and its checked fill; the dialog animates in (proves `tw-animate-css` arrived); body type is Apple's, not Tailwind's default (proves the base layer arrived); adding `@applecn/macos` and setting `data-platform="macos"` on `<html>` switches every metric.

- [ ] **Step 5: Record the result** in `docs/superpowers/plans/2026-09-07-shadcn-parity.md` under this task, then commit the note.

---

# Phase 2 — Apple-fidelity audit harness

Spec §7.2. Acceptance: the harness fails when the 2026-09-07 checkbox bug is reverted back in.

### Task 12: The harness

**Files:**

- Create: `packages/ui/__tests__/idiom-fidelity.test.tsx`

**Interfaces:**

- Consumes: `componentTokens` from Task 3.
- Produces: nothing; it is a gate.

jsdom has no layout, so the harness asserts on **computed class intent and token wiring**, not measured pixels — the browser pass in Task 14 covers geometry.

- [ ] **Step 1: Write the harness**

```tsx
// packages/ui/__tests__/idiom-fidelity.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Checkbox } from "../src/components/checkbox"
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group"
import { Switch } from "../src/components/switch"
import { PlatformProvider, type Platform } from "../src/lib/platform"

const IDIOMS: Platform[] = ["ios", "macos", "web"]

/** Every selectable control, with the states that must be visually distinct. */
const CONTROLS = [
  {
    name: "checkbox",
    on: <Checkbox aria-label="c" defaultChecked />,
    off: <Checkbox aria-label="c" />,
    role: "checkbox",
  },
  {
    name: "radio",
    on: (
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" aria-label="r" />
      </RadioGroup>
    ),
    off: (
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" aria-label="r" />
      </RadioGroup>
    ),
    role: "radio",
  },
  {
    name: "switch",
    on: <Switch aria-label="s" defaultChecked />,
    off: <Switch aria-label="s" />,
    role: "switch",
  },
] as const

describe("selection is visible on every idiom", () => {
  for (const idiom of IDIOMS)
    for (const control of CONTROLS)
      test(`${control.name} on ${idiom} distinguishes on from off`, () => {
        const { unmount } = render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const on = screen.getByRole(control.role).className
        unmount()
        render(
          <PlatformProvider platform={idiom}>{control.off}</PlatformProvider>
        )
        const off = screen.getByRole(control.role).className

        // The on state must add a rule the off state does not have. This is exactly
        // what failed on the web idiom on 2026-09-07: both resolved to the bezel.
        expect(on, `${control.name}/${idiom}`).not.toBe(off)
        expect(on).toMatch(/data-checked:(bg|border)-/)
      })
})
```

- [ ] **Step 2: Run it**

Run: `cd packages/ui && pnpm vitest run __tests__/idiom-fidelity.test.tsx`
Expected: PASS (9 tests).

- [ ] **Step 3: Prove it catches the real bug**

Temporarily reintroduce the 2026-09-07 defect by changing `checkbox.tsx`'s token read back to `web:bg-background-3` alongside `data-checked:bg-primary`.

Run the harness. Expected: FAIL. Revert the temporary change.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/__tests__/idiom-fidelity.test.tsx
git commit -s -m "test(ui): selection must be visible on every idiom, for every control"
```

### Task 13: Export-surface parity with shadcn

**Files:**

- Create: `packages/ui/__tests__/shadcn-export-parity.test.ts`

- [ ] **Step 1: Write the fixture and the test**

```ts
// packages/ui/__tests__/shadcn-export-parity.test.ts
import { describe, expect, test } from "vitest"

/**
 * The sub-components shadcn exports, per primitive. Sourced from ui.shadcn.com
 * on 2026-09-07. applecn may export more (Apple additions); it may never export
 * fewer, or a shadcn user's copy-pasted markup breaks.
 */
const SHADCN_EXPORTS: Record<string, string[]> = {
  dialog: [
    "Dialog",
    "DialogClose",
    "DialogContent",
    "DialogDescription",
    "DialogFooter",
    "DialogHeader",
    "DialogTitle",
    "DialogTrigger",
  ],
  "alert-dialog": [
    "AlertDialog",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogHeader",
    "AlertDialogOverlay",
    "AlertDialogPortal",
    "AlertDialogTitle",
    "AlertDialogTrigger",
  ],
  sheet: [
    "Sheet",
    "SheetClose",
    "SheetContent",
    "SheetDescription",
    "SheetFooter",
    "SheetHeader",
    "SheetTitle",
    "SheetTrigger",
  ],
  item: [
    "Item",
    "ItemActions",
    "ItemContent",
    "ItemDescription",
    "ItemFooter",
    "ItemGroup",
    "ItemHeader",
    "ItemMedia",
    "ItemSeparator",
    "ItemTitle",
  ],
  "input-group": [
    "InputGroup",
    "InputGroupAddon",
    "InputGroupButton",
    "InputGroupInput",
    "InputGroupText",
    "InputGroupTextarea",
  ],
}

describe("export parity with shadcn", () => {
  for (const [name, expected] of Object.entries(SHADCN_EXPORTS))
    test(`${name} exports everything shadcn does`, async () => {
      const mod = await import(`../src/components/${name}`)
      for (const symbol of expected)
        expect(Object.keys(mod), `${name}.${symbol}`).toContain(symbol)
    })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/shadcn-export-parity.test.ts`
Expected: FAIL — `alert-dialog` lacks Header/Footer/Overlay/Portal; `sheet`, `item`, `input-group` do not exist yet.

- [ ] **Step 3: Add the missing sub-components to `alert-dialog.tsx`** (Header, Footer, Overlay, Portal), following `dialog.tsx`'s existing shapes. Leave `sheet`, `item` and `input-group` failing — Phase 3 builds them, and these tests are their acceptance criteria.

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -s -m "test(ui): shadcn export parity, and close the alert-dialog gaps"
```

### Task 14: Browser geometry pass

- [ ] **Step 1:** With the dev server running, walk every component page under each of the three idioms.
- [ ] **Step 2:** Spot-check the measured anchors from `docs/research/apple-design-system-reference.md`: iOS switch 63×28 with a 37×24 knob; list corners 26, rows 52; alert 320 wide, r34, 48 pt actions; macOS buttons 24 with r6, switch 54×24, checkbox 16; web pills 980 px radius, body 17/25.
- [ ] **Step 3:** File anything that drifted as its own fix commit before Phase 3 starts.

---

# Phase 3 — Renames, the fold, and the 14 builds

Spec §7.3.

### Task 15: The five renames

Each is mechanical and identical in shape; do them one commit at a time.

| from               | to              | also rename                                                   |
| ------------------ | --------------- | ------------------------------------------------------------- |
| `menu`             | `dropdown-menu` | `Menu*` → `DropdownMenu*`                                     |
| `preview-card`     | `hover-card`    | `PreviewCard*` → `HoverCard*`                                 |
| `passcode-field`   | `input-otp`     | `PasscodeField` → `InputOTP`                                  |
| `disclosure-group` | `collapsible`   | `DisclosureGroup*` → `Collapsible*`                           |
| `sheet`            | `drawer`        | `Sheet*` → `Drawer*`, keeping `DrawerSection`/`DrawerToolbar` |

- [ ] For each row: `git mv` the component, its test and its registry example; rename the exported symbols; update `apps/web/registry/index.ts`; update every import; add `DrawerHeader`/`DrawerFooter` for the last row; run `pnpm check`; commit as `refactor(ui): rename <old> to <new> for shadcn parity`.

### Task 16: Fold `segmented-control` into `toggle-group`

- [ ] **Step 1:** Move the sliding `Tabs.Indicator` treatment from `segmented-control.tsx` into `toggle-group.tsx`, replacing its `data-pressed:bg-background` approach.
- [ ] **Step 2:** Point every `SegmentedControl` usage — `apps/web/components/appearance-controls.tsx`, `landing/showcase.tsx`, `landing/mosaic.tsx`, and the registry examples — at `ToggleGroup`.
- [ ] **Step 3:** Delete `segmented-control.tsx`, its test and its registry entry.
- [ ] **Step 4:** `pnpm check`, then verify the docs platform switch and the landing showcase still look and behave identically.
- [ ] **Step 5:** Commit as `refactor(ui): fold segmented-control into toggle-group, which it duplicated`.

### Task 17 (exemplar): Build `item`

Every Phase 3 build follows this shape. `item` is the exemplar because Phase 4 depends on it.

**Files:**

- Create: `packages/ui/src/components/item.tsx`, `packages/ui/__tests__/item.test.tsx`, `apps/web/registry/examples/item/basic.tsx`
- Modify: `apps/web/registry/index.ts`

**Interfaces:**

- Produces: `Item`, `ItemGroup`, `ItemSeparator`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`. Phase 4's `list` and `lockup` build on these.

- [ ] **Step 1: Write the failing test**

```tsx
// packages/ui/__tests__/item.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../src/components/item"
import { checkA11y } from "./helpers/axe"

describe("Item", () => {
  test("lays media, content and actions across a row", () => {
    render(
      <Item>
        <ItemMedia data-testid="media" />
        <ItemContent>
          <ItemTitle>Wi-Fi</ItemTitle>
          <ItemDescription>Connected</ItemDescription>
        </ItemContent>
        <ItemActions>
          <button type="button">Info</button>
        </ItemActions>
      </Item>
    )
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument()
    expect(screen.getByText("Connected")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Info" })).toBeInTheDocument()
  })

  test("is Apple's list row: 52 pt minimum, 15 x 16 padding", () => {
    render(
      <Item data-testid="row">
        <ItemTitle>A</ItemTitle>
      </Item>
    )
    const row = screen.getByTestId("row")
    expect(row.className).toContain("min-h-(--list-row-min-height)")
    expect(row.className).toContain("px-(--list-row-padding-x)")
    expect(row).toHaveAttribute("data-slot", "item")
  })

  test("a group separates its rows", () => {
    render(
      <ItemGroup data-testid="group">
        <Item>
          <ItemTitle>A</ItemTitle>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemTitle>B</ItemTitle>
        </Item>
      </ItemGroup>
    )
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-slot",
      "item-group"
    )
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <ItemGroup>
        <Item>
          <ItemTitle>A</ItemTitle>
        </Item>
      </ItemGroup>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd packages/ui && pnpm vitest run __tests__/item.test.tsx`
Expected: FAIL — `Cannot find module '../src/components/item'`.

- [ ] **Step 3: Write the component**

```tsx
// packages/ui/src/components/item.tsx
import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

/**
 * A row of content (shadcn's Item): media at the leading edge, a title and
 * description, actions trailing. Apple's list-row metrics — 52 pt rows with
 * 15 x 16 padding on iOS, AppKit's 24 pt on macOS — come from the list tokens,
 * so a row matches the idiom without any per-platform class.
 */
function Item({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item"
      className={cn(
        "flex min-h-(--list-row-min-height) w-full items-center gap-2.5 px-(--list-row-padding-x) py-(--list-row-padding-y) text-[length:var(--list-font)] leading-snug text-label",
        className
      )}
      {...props}
    />
  )
}

function ItemGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-group"
      role="list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function ItemSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-separator"
      role="separator"
      className={cn(
        "ms-(--list-row-padding-x) h-[0.5px] bg-separator",
        className
      )}
      {...props}
    />
  )
}

function ItemMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex size-(--list-icon-tile) shrink-0 items-center justify-center rounded-md [&_svg]:size-[70%]",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col justify-center", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="item-title"
      className={cn("truncate", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="item-description"
      className={cn(
        "truncate text-[length:var(--list-subtitle-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
}
```

- [ ] **Step 4: Run the test**

Run: `cd packages/ui && pnpm vitest run __tests__/item.test.tsx`
Expected: PASS (4 tests). The export-parity test from Task 13 now passes for `item` too.

- [ ] **Step 5: Add the registry example and doc entry**

Create `apps/web/registry/examples/item/basic.tsx` rendering an `ItemGroup` of three rows, and add the doc entry to `apps/web/registry/index.ts` with `group: "collections"`, an Apple HIG link to Lists and Tables, and `primitive: "element"`.

- [ ] **Step 6: `pnpm check`, then commit**

```bash
git add packages/ui apps/web
git commit -s -m "feat(ui): item, shadcn's content row on Apple's list metrics"
```

### Tasks 18–30: The remaining 13 builds

Each follows Task 17 exactly — failing test with an a11y case, component, registry example, doc entry, `pnpm check`, commit. What differs per component:

| #   | component            | Apple reference                             | exports beyond the root                                                                          |
| --- | -------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 18  | `input-group`        | combined text field + affordance            | `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea` |
| 19  | `sheet` (edge panel) | iPadOS/macOS inspector panel                | `SheetClose/Content/Description/Footer/Header/Title/Trigger`, `side` prop                        |
| 20  | `alert`              | iOS notification banner                     | `AlertTitle`, `AlertDescription`                                                                 |
| 21  | `aspect-ratio`       | — (layout utility)                          | none                                                                                             |
| 22  | `native-select`      | `UIPickerView` compact / `NSPopUpButton`    | none                                                                                             |
| 23  | `pagination`         | apple.com pagination                        | `PaginationContent/Item/Link/Previous/Next/Ellipsis`                                             |
| 24  | `resizable`          | macOS draggable split divider               | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`                                       |
| 25  | `typography`         | the eleven text styles as prose CSS         | none — ships as `css` in the style item                                                          |
| 26  | `collapsible`*       | already renamed in Task 15                  | verify `CollapsibleTrigger`, `CollapsibleContent`                                                |
| 27  | `command`            | Spotlight                                   | `CommandDialog/Input/List/Empty/Group/Item/Separator/Shortcut`                                   |
| 28  | `calendar`           | `UICalendarView` / `NSDatePicker` graphical | none                                                                                             |
| 29  | `date-picker`        | `UIDatePicker` wheels, compact, inline      | composed of `calendar` + `popover`                                                               |
| 30a | `data-table`         | `NSTableView`                               | sub-phase: sorting, selection, column sizing                                                     |
| 30b | `chart`              | Swift Charts                                | sub-phase: line, bar, area, the Apple palette                                                    |

`*` Task 26 is verification only; the rename in Task 15 does the work.

---

# Phase 4 — Rebuild the Apple layer as compositions

Spec §7.4. Acceptance: no measured metric changes; the Phase 2 harness is the gate. **This phase deletes more code than it adds** — track the net line count per task and note it in each commit body.

### Task 31 (exemplar): `list` becomes a composition of `item`

**Files:**

- Modify: `packages/ui/src/components/list.tsx`
- Test: `packages/ui/__tests__/list.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// append to packages/ui/__tests__/list.test.tsx
describe("List composes Item", () => {
  test("a row is an Item underneath, so shadcn markup drops in", () => {
    render(
      <List>
        <ListRow title="Wi-Fi" />
      </List>
    )
    const row = screen.getByText("Wi-Fi").closest('[data-slot="item"]')
    expect(row).not.toBeNull()
  })

  test("the inset grouped list keeps its 26 pt corners", () => {
    render(
      <List data-testid="l" style="inset-grouped">
        <ListRow title="A" />
      </List>
    )
    expect(screen.getByTestId("l").className).toContain("rounded-list")
  })
})
```

- [ ] **Step 2: Run it and watch it fail.** Expected: no `data-slot="item"` in the tree.

- [ ] **Step 3: Rewrite `ListRow` to render `Item`/`ItemMedia`/`ItemContent`/`ItemTitle`/`ItemDescription`/`ItemActions`**, keeping `ListRow`'s existing prop names (`leading`, `title`, `subtitle`, `value`, `trailing`, `accessory`) as the Apple-facing API. Delete the duplicated row markup.

- [ ] **Step 4: `pnpm check` and the Phase 2 harness. Verify the docs list page is pixel-identical on all three idioms.**

- [ ] **Step 5: Commit**, noting the net line delta in the body.

### Tasks 32–43: The remaining 12 compositions

Same cycle. Rebuild each on its shadcn base, keep the Apple-facing prop names, delete the duplicated internals, prove no metric moved.

| #   | applecn          | rebuild on                                                                                                                                         |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32  | `lockup`         | `item`                                                                                                                                             |
| 33  | `search-field`   | `input-group`                                                                                                                                      |
| 34  | `stepper`        | `input-group`                                                                                                                                      |
| 35  | `color-well`     | `input-group`                                                                                                                                      |
| 36  | `split-view`     | `resizable` (gains the drag it never had)                                                                                                          |
| 37  | `checkbox-group` | `field` (FieldSet/FieldGroup)                                                                                                                      |
| 38  | `tab-bar`        | `tabs`                                                                                                                                             |
| 39  | `action-sheet`   | `drawer`                                                                                                                                           |
| 40  | `page-control`   | `pagination`                                                                                                                                       |
| 41  | `text`           | `typography`                                                                                                                                       |
| 42  | `toolbar`        | `button-group` — **spike first**: spacers, overflow and the prominent action may not fit, in which case leave it Apple-only and say so in the spec |
| 43  | `link`           | `typography`                                                                                                                                       |

### Task 44: `responsive-dialog` and `responsive-alert-dialog`

**Files:**

- Create: `packages/ui/src/components/responsive-dialog.tsx`, `responsive-alert-dialog.tsx`, and their tests and examples.

**Interfaces:**

- Produces: `ResponsiveDialog`, `ResponsiveDialogTrigger`, `ResponsiveDialogContent`, `ResponsiveDialogHeader`, `ResponsiveDialogFooter`, `ResponsiveDialogTitle`, `ResponsiveDialogDescription`, `ResponsiveDialogClose` — and the `ResponsiveAlertDialog*` equivalents.

- [ ] **Step 1: Write the failing test**

```tsx
// packages/ui/__tests__/responsive-dialog.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../src/components/responsive-dialog"
import { installMatchMedia, setViewport } from "./helpers/viewport"

installMatchMedia()

describe("ResponsiveDialog", () => {
  test("is a drawer on a phone", async () => {
    setViewport("phone")
    render(
      <ResponsiveDialog>
        <ResponsiveDialogTrigger>Open</ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogTitle>Title</ResponsiveDialogTitle>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    )
    await userEvent.click(screen.getByText("Open"))
    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "data-slot",
      "drawer-content"
    )
  })

  test("is a dialog on a desktop", async () => {
    setViewport("desktop")
    render(
      <ResponsiveDialog>
        <ResponsiveDialogTrigger>Open</ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogTitle>Title</ResponsiveDialogTitle>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    )
    await userEvent.click(screen.getByText("Open"))
    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "data-slot",
      "dialog-content"
    )
  })
})
```

- [ ] **Step 2: Run it and watch it fail.**
- [ ] **Step 3: Implement** using the delegation shape already in today's `sheet.tsx` — `useIsDesktop()` picks the primitive, a context tells the parts which to render. Do **not** render both and hide one; that gives two focus traps.
- [ ] **Step 4:** `ResponsiveAlertDialog` the same way, but the phone branch is `action-sheet`, not `drawer` — iOS presents a destructive confirmation as an action sheet.
- [ ] **Step 5:** `pnpm check`, commit.

---

# Phase 5 — Docs 1:1 with shadcn, and brand

Spec §7.5.

- [ ] **Task 45:** Restructure the component page template to shadcn's anatomy: Installation (CLI/Manual tabs) → Usage → Examples → API Reference. Installation moves from last to second; add the Manual tab; add a Usage section showing the import and basic markup. `apps/web/app/(docs)/components/[name]/page.tsx`.
- [ ] **Task 46:** Add prev/next navigation and an "On This Page" rail, driven by `docsNav` and the section ids the page already emits.
- [ ] **Task 47:** Add a props table per component, generated from the TypeScript types.
- [ ] **Task 48:** Build the Get Started section: Installation, components.json, Theming, Dark Mode, CLI, Monorepo. New routes under `apps/web/app/(docs)/docs/`.
- [ ] **Task 49:** Add the alias table so a shadcn user searching "Dropdown Menu" or "Hover Card" lands on the right page, and make the install command the namespaced short form everywhere — the landing page and the docs currently disagree.
- [ ] **Task 50:** Add `llms.txt`.
- [ ] **Task 51:** Brand from zero: wordmark/logo, favicon set, apple-touch-icon, `manifest.webmanifest`, OG image, and `metadata.icons` + `metadata.openGraph` in `apps/web/app/layout.tsx`. None of these exist today.

---

# Phase 6 — shadcn's AI set

Spec §7.6. Seven primitives — `attachment`, `bubble`, `direction`, `marker`, `message`, `message-scroller`, `questionnaire` — each following Task 17's cycle. Apple reference: the Messages app for bubbles and attachments.

- [ ] **Task 52–58:** one per primitive.

---

## Self-review notes

- **Spec coverage:** §4.1's three install gaps → Tasks 8 and 11. §4.2 detokenisation → Tasks 3–6. §4.3's retained utilities → Task 7 (deletions only; `type-*`, `material-*`, `glass*` are deliberately untouched). §4.4's fold → Task 16. §4.5's harness → Task 12. §5 catalogue → Tasks 15–44 and Phase 6. §6.2 themes → Task 10. §6.5 conventions → Tasks 1, 2, 9. §7.5 docs and brand → Tasks 45–51.
- **Known coarseness:** Tasks 18–30, 32–43 and 52–58 are table rows rather than full task bodies, per the granularity note. Task 17 and Task 31 are their worked exemplars.
- **Open risk carried from the spec:** Task 42 (`toolbar` on `button-group`) is marked spike-first because a macOS toolbar's spacers, overflow and prominent action may not fit `button-group`'s model. If it does not, it stays Apple-only and the spec's §5.6 is amended.
