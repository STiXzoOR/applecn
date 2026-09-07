import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { renderTokensCss } from "../css"

const out = renderTokensCss()
const section = (selector: string) => {
  const start = out.indexOf(selector)
  expect(start, `${selector} present`).toBeGreaterThan(-1)
  const open = out.indexOf("{", start)
  let depth = 0
  for (let i = open; i < out.length; i++) {
    if (out[i] === "{") depth++
    if (out[i] === "}") depth--
    if (depth === 0) return out.slice(open, i + 1)
  }
  throw new Error("unbalanced")
}

describe("renderTokensCss", () => {
  test("light primitives live on :root", () => {
    const root = section(":root")
    expect(root).toContain("--system-blue: rgb(0 136 255);")
    expect(root).toContain("--gray-6: rgb(242 242 247);")
    expect(root).toContain("--label-2: rgb(60 60 67 / 0.6);")
    expect(root).toContain("--fill-3: rgb(118 118 128 / 0.12);")
    expect(root).toContain("--background: var(--background-1);")
    expect(root).toContain("--primary: var(--accent-color);")
    expect(root).toContain("--pt: 0.0625rem;")
  })

  test("dark values live under .dark", () => {
    const dark = section(".dark")
    expect(dark).toContain("--system-blue: rgb(0 145 255);")
    expect(dark).toContain("--background-1: rgb(0 0 0);")
    expect(dark).toContain("--label-2: rgb(235 235 245 / 0.6);")
  })

  test("accessible values under prefers-contrast and the data attribute", () => {
    expect(out).toMatch(
      /@media \(prefers-contrast: more\)[^]*--system-blue: rgb\(30 110 244\);/
    )
    expect(out).toMatch(
      /\[data-contrast="more"\][^]*--system-blue: rgb\(30 110 244\);/
    )
    expect(out).toMatch(
      /\.dark[^]*prefers-contrast: more[^]*--system-blue: rgb\(92 184 255\);/
    )
  })

  test("elevated dark backgrounds under [data-elevated]", () => {
    expect(out).toMatch(
      /\.dark \[data-elevated\][^]*--background-1: rgb\(28 28 30\);/
    )
  })

  test("type sizes are pt-based and switch with the platform", () => {
    const root = section(":root")
    expect(root).toContain("--type-body-size: calc(17 * var(--pt));")
    expect(root).toContain("--type-body-leading: calc(22 * var(--pt));")
    expect(root).toContain("--type-body-weight: 400;")
    expect(root).toContain("--type-headline-emphasized: 600;")
    const mac = section('[data-platform="macos"]')
    expect(mac).toContain("--type-body-size: calc(13 * var(--pt));")
    expect(mac).toContain("--control-height-regular: 24px;")
    expect(mac).toContain("--type-body-tracking: 0;")
    const web = section('[data-platform="web"]')
    expect(web).toContain("--type-body-size: calc(17 * var(--pt));")
    expect(web).toContain("--type-body-leading: calc(25 * var(--pt));")
    expect(web).toContain("--type-body-tracking: -0.022em;")
    expect(web).toContain("--type-large-title-size: calc(32 * var(--pt));")
    expect(web).toContain("--control-height-regular: 36px;")
    expect(out).toMatch(
      /@media \(width >= 1069px\)[^]*\[data-platform="web"\][^]*--type-large-title-size: calc\(48 \* var\(--pt\)\);/
    )
    expect(out).toMatch(
      /@media \(width >= 735px\)[^]*\[data-platform="web"\][^]*--type-large-title-size: calc\(40 \* var\(--pt\)\);/
    )
  })

  test("the iOS block repeats the defaults so a nested iOS provider resets a macOS or web ancestor", () => {
    const ios = section('[data-platform="ios"]')
    expect(ios).toContain("--control-height-regular: 34px;")
    expect(ios).toContain("--type-body-size: calc(17 * var(--pt));")
    expect(ios).toContain("--corner-4xl: 26px;")
    expect(ios).toContain("--label: rgb(0 0 0);")
    expect(ios).toContain("--label-2: rgb(60 60 67 / 0.6);")
    expect(ios).toContain("--separator: rgb(60 60 67 / 0.29);")
    expect(ios).toContain("--accent-color: var(--system-blue);")
    expect(ios).toContain("--primary: var(--accent-color);")
    expect(out).toMatch(
      /\.dark\[data-platform="ios"\],\s*\.dark \[data-platform="ios"\][^]*--label: rgb\(255 255 255\);/
    )
  })

  test("platform colour overrides: AppKit's labels on macOS, apple.com's palette on the web, dark too", () => {
    const mac = section('[data-platform="macos"]')
    expect(mac).toContain("--platform: macos;")
    expect(section(":root")).toContain("--platform: ios;")
    expect(section('[data-platform="web"]')).toContain("--platform: web;")
    expect(mac).toContain("--label: rgb(0 0 0 / 0.85);")
    expect(mac).toContain("--separator: rgb(0 0 0 / 0.1);")
    expect(mac).toContain("--primary: var(--accent-color);")
    expect(mac).toContain("--accent-color: rgb(0 122 255);")
    expect(mac).toContain("--selection: rgb(0 100 225);")
    const web = section('[data-platform="web"]')
    expect(web).toContain("--label: rgb(29 29 31);")
    expect(web).toContain("--label-2: rgb(110 110 115);")
    expect(web).toContain("--background-2: rgb(245 245 247);")
    expect(web).toContain("--separator: rgb(210 210 215);")
    expect(web).toContain("--accent-color: rgb(0 113 227);")
    expect(web).toContain("--link: rgb(0 102 204);")
    expect(out).toMatch(
      /\.dark\[data-platform="macos"\],\s*\.dark \[data-platform="macos"\][^]*--label: rgb\(255 255 255 \/ 0\.85\);/
    )
    expect(out).toMatch(
      /\.dark\[data-platform="web"\],\s*\.dark \[data-platform="web"\][^]*--link: rgb\(41 151 255\);/
    )
  })

  test("control metrics as CSS variables", () => {
    const root = section(":root")
    expect(root).toContain("--control-height-regular: 34px;")
    expect(root).toContain("--control-radius-regular: 1000px;")
    expect(root).toContain("--control-font-regular: calc(17 * var(--pt));")
    expect(root).toContain("--control-padding-x-regular: 12px;")
    expect(root).toContain("--switch-width: 63px;")
    expect(root).toContain("--switch-thumb-width: 37px;")
    expect(root).toContain("--switch-thumb-height: 24px;")
    expect(root).toContain("--switch-inset: 2px;")
    expect(root).toContain("--slider-thumb-width: 37px;")
    expect(root).toContain("--list-inset: 16px;")
    expect(root).toContain("--list-radius: 26px;")
    expect(root).toContain("--list-header-font: calc(17 * var(--pt));")
    expect(root).toContain("--list-font: calc(17 * var(--pt));")
    expect(root).toContain("--segmented-font: calc(13 * var(--pt));")
    expect(root).toContain("--text-field-font: calc(17 * var(--pt));")
    expect(root).toContain("--menu-font: calc(17 * var(--pt));")
    expect(root).toContain("--alert-title-font: calc(17 * var(--pt));")
    expect(root).toContain("--alert-message-font: calc(13 * var(--pt));")
    expect(root).toContain("--sidebar-font: calc(17 * var(--pt));")
    expect(root).toContain("--sheet-radius: 40px;")
    expect(root).toContain("--corner-sm: 5px;")
    expect(root).toContain("--corner-4xl: 26px;")
    expect(root).toContain("--text-field-radius: 5px;")
    expect(root).toContain("--alert-radius: 34px;")
    expect(root).toContain("--alert-button-inset: 16px;")
    expect(root).toContain("--tab-bar-item: 54px;")
    expect(root).toContain("--nav-bar-item: 44px;")
    expect(root).toContain("--menu-radius: 26px;")
    expect(root).toContain("--card-radius: 26px;")
    expect(root).toContain("--selection: var(--system-blue);")
    expect(root).toContain("--accent-color: var(--system-blue);")
    expect(root).toContain("--primary: var(--accent-color);")
    expect(root).toContain("--type-body-tracking: 0;")
    expect(root).toContain("--material-glass-fallback: rgb(242 242 242);")
    expect(root).toContain("--easing-sheet: cubic-bezier(0.52, 0.16, 0.24, 1);")
    expect(root).toContain("--duration-press: 100ms;")
    expect(root).toContain(
      "--elevation-thumb: 0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06);"
    )
    expect(root).toContain(
      "--elevation-glass: inset 0 0 0 1px rgb(0 0 0 / 0.05), 0 10px 40px rgb(0 0 0 / 0.1);"
    )
    expect(section(".dark")).toContain(
      "--elevation-glass: inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 10px 40px rgb(0 0 0 / 0.2);"
    )
    expect(section(".dark")).toContain(
      "--material-glass-fallback: rgb(14 14 14);"
    )
  })

  test("Dynamic Type makes the pt unit follow the reader on iOS", () => {
    expect(out).toMatch(
      /@supports \(font: -apple-system-body\) and \(-webkit-touch-callout: none\)[^]*--pt: calc\(1rem \/ 17\);/
    )
  })

  test("the wide-phone list inset switches at 414 px", () => {
    expect(out).toMatch(/@media \(width >= 414px\)[^]*--list-inset: 20px;/)
  })

  test("the committed tokens.css is the generator output", () => {
    const committed = readFileSync(
      join(process.cwd(), "src/styles/tokens.css"),
      "utf8"
    )
    expect(committed).toBe(out)
  })
})
