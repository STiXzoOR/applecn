import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { textStyleNames } from "../src/tokens/typography"

const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8")
const themeInline = css.slice(css.indexOf("@theme inline {"))

describe("globals.css", () => {
  test("imports the generated tokens after the shadcn stylesheet", () => {
    const order = [
      '@import "tailwindcss"',
      '@import "tw-animate-css"',
      '@import "shadcn/tailwind.css"',
      '@import "./tokens.css"',
    ]
    const positions = order.map((s) => css.indexOf(s))
    expect(positions.every((p) => p > -1)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })

  test("declares the dark variant", () => {
    expect(css).toContain("@custom-variant dark (&:is(.dark *));")
  })

  test("uses the system font stack, never a named SF family", () => {
    expect(themeInline).toMatch(
      /--font-sans:\s*-apple-system, BlinkMacSystemFont, system-ui/
    )
    expect(themeInline).toMatch(/--font-rounded:\s*ui-rounded/)
    expect(themeInline).toMatch(/--font-mono:\s*ui-monospace/)
    expect(css).not.toMatch(/SF Pro/)
  })

  test("defines a type-* utility per text style (outside the text-* namespace tailwind-merge misreads)", () => {
    for (const name of textStyleNames) {
      expect(css).toContain(`@utility type-${name} {`)
      expect(css).toContain(`font-size: var(--type-${name}-size);`)
      expect(css).toContain(`line-height: var(--type-${name}-leading);`)
      expect(css).toContain(`font-weight: var(--type-${name}-weight);`)
    }
    expect(themeInline).not.toContain("--text-body")
  })

  test("bridges the Apple colour primitives and the shadcn aliases", () => {
    expect(themeInline).toContain("--color-system-blue: var(--system-blue);")
    expect(themeInline).toContain("--color-gray-6: var(--gray-6);")
    expect(themeInline).toContain("--color-label-2: var(--label-2);")
    expect(themeInline).toContain("--color-placeholder: var(--placeholder);")
    expect(themeInline).toContain("--color-fill-3: var(--fill-3);")
    expect(themeInline).toContain(
      "--color-grouped-background-2: var(--grouped-background-2);"
    )
    expect(themeInline).toContain("--color-separator: var(--separator);")
    expect(themeInline).toContain("--color-background: var(--background);")
    expect(themeInline).toContain("--color-primary: var(--primary);")
    expect(themeInline).toContain("--color-sidebar-ring: var(--sidebar-ring);")
  })

  test("keeps the Luma radius derivation and adds the sheet and icon radii", () => {
    expect(themeInline).toContain("--radius-sm: var(--corner-sm);")
    expect(themeInline).toContain("--radius-4xl: var(--corner-4xl);")
    expect(themeInline).toContain("--radius-sheet: var(--sheet-radius);")
    expect(themeInline).toContain("--radius-icon: var(--icon-radius);")
  })

  test("bridges motion and elevation", () => {
    expect(themeInline).toContain("--ease-standard: var(--easing-standard);")
    expect(themeInline).toContain("--ease-sheet: var(--easing-sheet);")
    expect(themeInline).toContain("--ease-spring-bouncy: var(--spring-bouncy);")
    expect(themeInline).toContain("--shadow-thumb: var(--elevation-thumb);")
    expect(themeInline).toContain("--shadow-glass: var(--elevation-glass);")
    expect(themeInline).toContain("--shadow-dialog: var(--elevation-dialog);")
    expect(themeInline).toContain("--ease-menu: var(--easing-menu);")
  })

  test("defines the material and glass utilities with reduced-transparency fallbacks", () => {
    for (const name of [
      "material-ultra-thin",
      "material-thin",
      "material-regular",
      "material-thick",
      "glass",
      "glass-clear",
      "glass-prominent",
    ]) {
      expect(css).toContain(`@utility ${name} {`)
    }
    expect(css).toContain("prefers-reduced-transparency: reduce")
    expect(css).toContain('[data-transparency="reduced"]')
    expect(css).toContain("var(--material-glass-fallback)")
    expect(css).toContain("var(--material-regular-fallback)")
  })

  test("base layer: the UA colour scheme follows the theme class, so OS-drawn controls do too", () => {
    // Dark mode here is a class (`@custom-variant dark (&:is(.dark *))`), and the UA does not read
    // classes: `Canvas`, `CanvasText`, scrollbars, date pickers and the `<select>` popup all follow
    // the CSS `color-scheme` property. Without these two declarations a page toggled dark on a light
    // OS keeps drawing every UA-painted widget light — `native-select`'s `bg-[Canvas]` popup most
    // visibly. Both live in `@layer base` so `registry-data.ts` ships them to consumers too.
    const start = css.indexOf("@layer base {")
    expect(start).toBeGreaterThan(-1)
    let depth = 1
    let end = start + "@layer base {".length
    while (depth > 0 && end < css.length) {
      if (css[end] === "{") depth++
      if (css[end] === "}") depth--
      end++
    }
    const base = css.slice(start, end)
    expect(base).toMatch(/:root\s*\{[^}]*color-scheme: light;/)
    expect(base).toMatch(/\.dark\s*\{[^}]*color-scheme: dark;/)
  })

  test("base layer: tap highlight, optical sizing, coarse-pointer input size, Dynamic Type root", () => {
    expect(css).toContain("-webkit-tap-highlight-color: transparent;")
    expect(css).toContain("font-optical-sizing: auto;")
    expect(css).toMatch(
      /@media \(pointer: coarse\)[^]*font-size: max\(16px, 1rem\);/
    )
    expect(css).toMatch(
      /@supports \(font: -apple-system-body\)[^]*font: -apple-system-body;/
    )
  })

  test("the idiom variants are gone; idioms are tokens now", () => {
    expect(css).not.toContain("@custom-variant ios")
    expect(css).not.toContain("@custom-variant macos")
    expect(css).not.toContain("@custom-variant web")
    // dark stays: it is shadcn's, not ours.
    expect(css).toContain("@custom-variant dark")
  })

  test("knob and pressable are gone; both were stock utilities in disguise", () => {
    expect(css).not.toContain("@utility knob")
    expect(css).not.toContain("@utility pressable")
    expect(css).not.toContain("@utility hairline")
    expect(css).toContain("--shadow-hairline:")
    expect(css).toContain("--shadow-hairline-t:")
    expect(css).toContain("--shadow-hairline-b:")
  })
})

/**
 * The `typography` prose utility (spec §5.4, Task 25). shadcn ships no `typography` component —
 * their Typography page is documentation telling a consumer which Tailwind classes to put on an
 * `h1`, because shadcn has no type scale of its own. applecn has eleven measured Apple text
 * styles, so the thing worth shipping is the half a consumer cannot write by hand: a container
 * that styles HTML it does not control — markdown, MDX, a CMS — off that same scale.
 */
describe("the typography prose utility", () => {
  const block = (() => {
    const start = css.indexOf("@utility typography {")
    if (start === -1) return ""
    let depth = 1
    let i = start + "@utility typography {".length
    while (depth > 0 && i < css.length) {
      if (css[i] === "{") depth++
      if (css[i] === "}") depth--
      i++
    }
    return css.slice(start, i)
  })()

  test("maps each prose element onto a measured Apple text style, not a Tailwind size", () => {
    const scale: [string, string][] = [
      ["h1", "large-title"],
      ["h2", "title-1"],
      ["h3", "title-2"],
      ["h4", "title-3"],
      ["p", "body"],
      ["blockquote", "body"],
      ["small", "footnote"],
      ["figcaption", "caption-1"],
    ]
    for (const [element, style] of scale) {
      expect(block).toContain(`& ${element} {`)
      expect(block).toContain(`font-size: var(--type-${style}-size);`)
      expect(block).toContain(`line-height: var(--type-${style}-leading);`)
    }
  })

  test("a heading takes its style's own emphasized weight, which differs per style", () => {
    for (const style of ["large-title", "title-1", "title-2", "title-3"]) {
      expect(block).toContain(`font-weight: var(--type-${style}-emphasized);`)
    }
  })

  test("its rules are Apple roles, and it invents no colour or hairline of its own", () => {
    expect(block).toContain("color: var(--label);")
    expect(block).toContain("color: var(--label-2);")
    expect(block).toContain("var(--separator)")
    expect(block).toContain("color: var(--link);")
  })

  test("the leading rule and list markers are logical, so the block is RTL-correct", () => {
    expect(block).toContain("border-inline-start:")
    expect(block).toContain("padding-inline-start:")
    expect(block).not.toContain("border-left:")
    expect(block).not.toContain("padding-left:")
  })
})
