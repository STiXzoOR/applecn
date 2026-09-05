import { describe, expect, test } from "vitest"

import { elevation } from "../elevation"
import { materials } from "../materials"
import { metrics } from "../metrics"
import { durations, easings, springLinear, springs } from "../motion"
import { radii } from "../radii"

describe("iOS metrics", () => {
  const ios = metrics.ios
  test("button heights per control size", () => {
    expect(ios.buttonHeight).toEqual({
      mini: 28,
      small: 32,
      regular: 44,
      large: 52,
      xl: 64,
    })
  })
  test("the switch is 51×31 with a 27 pt thumb", () => {
    expect(ios.switch).toEqual({ width: 51, height: 31, thumb: 27 })
  })
  test("list rows and the inset grouped shape", () => {
    expect(ios.list.inset).toBe(16)
    expect(ios.list.insetWide).toBe(20)
    expect(ios.list.radius).toBe(26)
    expect(ios.list.rowMinHeight).toBe(44)
    expect(ios.list.rowPaddingX).toBe(16)
    expect(ios.list.rowPaddingY).toBe(11)
  })
  test("alert, sheet, tab bar and nav bar", () => {
    expect(ios.alert).toEqual({ width: 270, radius: 26, buttonHeight: 44 })
    expect(ios.sheet).toEqual({ radius: 40, grabber: [36, 5], scrim: 0.4 })
    expect(ios.tabBar).toEqual({ height: 64, inset: 21 })
    expect(ios.navBar).toEqual({ height: 44, largeTitle: 52 })
  })
  test("hit targets", () => {
    expect(ios.hitTarget).toEqual({ default: 44, minimum: 28 })
    expect(metrics.macos.hitTarget).toEqual({ default: 28, minimum: 20 })
  })
  test("macOS checkbox is a 14 pt square, iOS a 22 pt circle", () => {
    expect(ios.checkbox).toEqual({ size: 22, shape: "circle" })
    expect(metrics.macos.checkbox).toEqual({ size: 14, shape: "square" })
  })
})

describe("radii", () => {
  test("the Luma derivation from --radius: 10px is the Apple ladder", () => {
    expect(radii.base).toBe(10)
    expect(Object.values(radii.ladder)).toEqual([6, 8, 10, 14, 18, 22, 26])
    expect(radii.sheet).toBe(40)
    expect(radii.icon).toBe("22.37%")
  })
})

describe("motion", () => {
  test("easings and durations", () => {
    expect(easings.standard).toBe("cubic-bezier(0.25, 0.1, 0.25, 1)")
    expect(easings.sheet).toBe("cubic-bezier(0.32, 0.72, 0, 1)")
    expect(durations).toEqual({
      press: 120,
      hover: 150,
      overlay: 250,
      nav: 300,
      sheet: 450,
    })
  })
  test("springs render as linear() easings that start at 0 and end at 1", () => {
    const smooth = springLinear({ duration: 0.5, bounce: 0 })
    expect(smooth.startsWith("linear(0")).toBe(true)
    expect(smooth.endsWith("1)")).toBe(true)
    expect(springs.smooth).toBe(smooth)
  })
  test("a bouncy spring overshoots and a smooth one does not", () => {
    const values = (s: string) =>
      s.slice("linear(".length, -1).split(", ").map(Number)
    expect(Math.max(...values(springs.bouncy))).toBeGreaterThan(1)
    expect(Math.max(...values(springs.smooth))).toBeLessThanOrEqual(1)
  })
})

describe("materials and elevation", () => {
  test("content materials thicken from ultra-thin to thick", () => {
    expect(materials["ultra-thin"].light.alpha).toBeLessThan(
      materials.thin.light.alpha
    )
    expect(materials.thin.light.alpha).toBeLessThan(
      materials.regular.light.alpha
    )
    expect(materials.regular.light.alpha).toBe(0.82)
    expect(materials.thick.light.alpha).toBeLessThan(1)
    expect(materials.regular.blur).toBe(30)
    expect(materials.regular.saturate).toBe(1.8)
  })
  test("glass has a regular and a clear variant", () => {
    expect(materials.glass.light.alpha).toBeGreaterThan(
      materials["glass-clear"].light.alpha
    )
  })
  test("shadows are CSS box-shadow strings", () => {
    expect(elevation.thumb).toBe(
      "0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06)"
    )
    expect(elevation.menu).toMatch(/^0 0 0 0\.5px/)
  })
})
