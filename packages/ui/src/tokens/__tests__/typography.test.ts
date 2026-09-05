import { describe, expect, test } from "vitest"

import {
  dynamicType,
  fontFamilies,
  iosTextStyles,
  macosTextStyles,
  tracking,
} from "../typography"

const byName = (styles: typeof iosTextStyles, name: string) =>
  styles.find((s) => s.name === name)!

describe("font stacks", () => {
  test("the sans stack is the system font, never a named SF family", () => {
    expect(fontFamilies.sans.startsWith("-apple-system")).toBe(true)
    expect(fontFamilies.sans).not.toMatch(/SF Pro/)
    expect(fontFamilies.rounded.startsWith("ui-rounded")).toBe(true)
    expect(fontFamilies.mono.startsWith("ui-monospace")).toBe(true)
  })
})

describe("iOS text styles at the Large (default) size", () => {
  // Fixtures: HIG "Typography" specifications, fetched 2026-09-05.
  test.each([
    ["large-title", 34, 41, 400, 700],
    ["title-1", 28, 34, 400, 700],
    ["title-2", 22, 28, 400, 700],
    ["title-3", 20, 25, 400, 600],
    ["headline", 17, 22, 600, 600],
    ["body", 17, 22, 400, 600],
    ["callout", 16, 21, 400, 600],
    ["subheadline", 15, 20, 400, 600],
    ["footnote", 13, 18, 400, 600],
    ["caption-1", 12, 16, 400, 600],
    ["caption-2", 11, 13, 400, 600],
  ])(
    "%s is %s/%s weight %s (emphasized %s)",
    (name, size, leading, weight, emphasized) => {
      const s = byName(iosTextStyles, name)
      expect(s.size).toBe(size)
      expect(s.leading).toBe(leading)
      expect(s.weight).toBe(weight)
      expect(s.emphasized).toBe(emphasized)
    }
  )

  test("the Large category in the Dynamic Type matrix is the default scale", () => {
    expect(dynamicType.large).toEqual(iosTextStyles)
  })

  test("the matrix covers every category from xSmall to AX5", () => {
    expect(Object.keys(dynamicType)).toEqual([
      "xSmall",
      "small",
      "medium",
      "large",
      "xLarge",
      "xxLarge",
      "xxxLarge",
      "ax1",
      "ax2",
      "ax3",
      "ax4",
      "ax5",
    ])
    expect(byName(dynamicType.xSmall, "body").size).toBe(14)
    expect(byName(dynamicType.xxxLarge, "body").size).toBe(23)
    expect(byName(dynamicType.ax5, "large-title").size).toBe(60)
    expect(byName(dynamicType.ax5, "large-title").leading).toBe(70)
    expect(byName(dynamicType.ax3, "caption-2").size).toBe(29)
  })
})

describe("macOS text styles", () => {
  test.each([
    ["large-title", 26, 32, 400, 700],
    ["title-1", 22, 26, 400, 700],
    ["title-2", 17, 22, 400, 700],
    ["title-3", 15, 20, 400, 600],
    ["headline", 13, 16, 700, 800],
    ["body", 13, 16, 400, 600],
    ["callout", 12, 15, 400, 600],
    ["subheadline", 11, 14, 400, 600],
    ["footnote", 10, 13, 400, 600],
    ["caption-1", 10, 13, 400, 500],
    ["caption-2", 10, 13, 500, 600],
  ])(
    "%s is %s/%s weight %s (emphasized %s)",
    (name, size, leading, weight, emphasized) => {
      const s = byName(macosTextStyles, name)
      expect(s.size).toBe(size)
      expect(s.leading).toBe(leading)
      expect(s.weight).toBe(weight)
      expect(s.emphasized).toBe(emphasized)
    }
  )
})

describe("tracking table (1/1000 em, static SF Pro only)", () => {
  test("body size tracks tight and display sizes open up", () => {
    const at = (size: number) => tracking.find((t) => t.size === size)!.tracking
    expect(at(11)).toBe(6)
    expect(at(12)).toBe(0)
    expect(at(17)).toBe(-24)
    expect(at(34)).toBe(12)
    expect(at(80)).toBe(0)
  })
})
