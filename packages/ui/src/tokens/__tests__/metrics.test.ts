import { describe, expect, test } from "vitest"

import { elevation } from "../elevation"
import { materials } from "../materials"
import { metrics } from "../metrics"
import { durations, easings, springLinear, springs } from "../motion"
import { radii } from "../radii"

describe("iOS metrics (UIKit and HIG values)", () => {
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
  test("list rows, with the inset group on Apple's web xlarge radius", () => {
    expect(ios.list.inset).toBe(16)
    expect(ios.list.insetWide).toBe(20)
    expect(ios.list.radius).toBe(24)
    expect(ios.list.rowMinHeight).toBe(44)
    expect(ios.list.rowPaddingX).toBe(16)
    expect(ios.list.rowPaddingY).toBe(11)
  })
  test("alert, sheet and nav bar", () => {
    expect(ios.alert).toEqual({ width: 270, radius: 24, buttonHeight: 44 })
    expect(ios.sheet.grabber).toEqual([36, 5])
    expect(ios.sheet.scrim).toBe(0.45)
    expect(ios.navBar).toEqual({ height: 44, largeTitle: 52 })
    expect(ios.menu).toEqual({ width: 250, itemHeight: 44, radius: 24 })
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

describe("macOS metrics (measured from Apple's desktop web apps, 2026-09-05)", () => {
  const mac = metrics.macos
  test("button heights: Music 24 and 28, the 36 pt pill, TV's 40 pt pill, apple.com's 44 pt CTA", () => {
    expect(mac.buttonHeight).toEqual({
      mini: 24,
      small: 28,
      regular: 36,
      large: 40,
      xl: 44,
    })
  })
  test("sidebar rows are Music's 34 pt with 8 pt corners; the sidebar is the App Store's 260 pt", () => {
    expect(mac.list.rowMinHeight).toBe(34)
    expect(mac.list.radius).toBe(8)
    expect(mac.splitView).toEqual({ sidebar: 260, content: 320 })
  })
  test("fields are the App Store search field: 32 pt, 4 pt corners; the select is 32 pt", () => {
    expect(mac.textField).toEqual({ height: 32, radius: 4 })
    expect(mac.searchField.height).toBe(32)
    expect(mac.segmented.height).toBe(32)
  })
  test("dialogs: 10 pt corners, the App Store's 691 pt content modal, the .45 scrim; menus 44 pt rows", () => {
    expect(mac.sheet.radius).toBe(10)
    expect(mac.sheet.scrim).toBe(0.45)
    expect(mac.dialog.width).toBe(691)
    expect(mac.menu).toEqual({ width: 200, itemHeight: 44, radius: 12 })
    expect(mac.toolbar.height).toBe(52)
    expect(mac.navBar.height).toBe(52)
  })
  test("the TV player's scrubber: 5 pt track, 13 pt thumb", () => {
    expect(mac.slider).toEqual({ track: 5, thumb: 13 })
  })
})

describe("radii (apps.apple.com tokens plus the sizes in use)", () => {
  test("xsmall 5, 8 (Music rows), 10 (dialogs), medium 12, large 17, 20 (Music sidebar), xlarge 24", () => {
    expect(radii.ladder).toEqual({
      sm: 5,
      md: 8,
      lg: 10,
      xl: 12,
      "2xl": 17,
      "3xl": 20,
      "4xl": 24,
    })
    expect(radii.icon).toBe("22.37%")
    expect(radii.capsule).toBe(1000)
    expect(radii.sheet).toBe(40)
  })
})

describe("motion (Apple web CSS)", () => {
  test("easings are the curves apple.com, the App Store and Music ship", () => {
    expect(easings.standard).toBe("cubic-bezier(0.04, 0.04, 0.12, 0.96)")
    expect(easings.nav).toBe("cubic-bezier(0.4, 0, 0.6, 1)")
    expect(easings.transform).toBe("cubic-bezier(0.25, 0.1, 0.3, 1)")
    expect(easings.sheet).toBe("cubic-bezier(0.52, 0.16, 0.24, 1)")
    expect(easings.menu).toBe("cubic-bezier(0.215, 0.61, 0.355, 1)")
  })
  test("durations: .1s hover-in, .21s hover-out, .3s menus, .24s apple.com nav, .56s the App Store nav sheet", () => {
    expect(durations).toEqual({
      press: 100,
      hover: 210,
      overlay: 300,
      nav: 240,
      sheet: 560,
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

describe("materials (Apple web CSS)", () => {
  test("glass is Music's floating sidebar: the glassMaterial tint behind saturate(2.2) blur(16px)", () => {
    expect(materials.glass.light).toEqual({ rgb: [245, 245, 247], alpha: 0.55 })
    expect(materials.glass.dark).toEqual({ rgb: [38, 38, 40], alpha: 0.6 })
    expect(materials.glass.blur).toBe(16)
    expect(materials.glass.saturate).toBe(2.2)
    expect(materials.glass.fallback.light).toEqual({
      rgb: [242, 242, 242],
      alpha: 1,
    })
    expect(materials.glass.fallback.dark).toEqual({
      rgb: [14, 14, 14],
      alpha: 1,
    })
  })
  test("clear glass is the App Store's translucent control: white 25 %, blur 10", () => {
    expect(materials["glass-clear"].light).toEqual({
      rgb: [255, 255, 255],
      alpha: 0.25,
    })
    expect(materials["glass-clear"].blur).toBe(10)
    expect(materials["glass-clear"].saturate).toBe(1.8)
  })
  test("content materials: translucent control, Music's tiles, apple.com's nav, Music's player", () => {
    expect(materials["ultra-thin"].light).toEqual({
      rgb: [255, 255, 255],
      alpha: 0.25,
    })
    expect(materials["ultra-thin"].blur).toBe(10)
    expect(materials.thin.light).toEqual({ rgb: [246, 246, 246], alpha: 0.48 })
    expect(materials.thin.dark).toEqual({ rgb: [40, 40, 40], alpha: 0.5 })
    expect(materials.thin.blur).toBe(60)
    expect(materials.regular.light).toEqual({
      rgb: [250, 250, 252],
      alpha: 0.8,
    })
    expect(materials.regular.dark).toEqual({ rgb: [22, 22, 23], alpha: 0.8 })
    expect(materials.regular.blur).toBe(20)
    expect(materials.regular.saturate).toBe(1.8)
    expect(materials.thick.light).toEqual({ rgb: [255, 255, 255], alpha: 0.88 })
    expect(materials.thick.dark).toEqual({ rgb: [45, 45, 45], alpha: 0.88 })
    expect(materials.regular.fallback.light).toEqual({
      rgb: [255, 255, 255],
      alpha: 0.97,
    })
    expect(materials.regular.fallback.dark).toEqual({
      rgb: [31, 31, 31],
      alpha: 0.97,
    })
  })
})

describe("elevation (UIKit thumbs, App Store cards, Music glass and dialogs)", () => {
  test("appearance-independent shadows", () => {
    expect(elevation.thumb).toBe(
      "0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06)"
    )
    expect(elevation.segment).toBe(
      "0 3px 8px rgb(0 0 0 / 0.12), 0 3px 1px rgb(0 0 0 / 0.04)"
    )
    expect(elevation.cardSmall).toBe("0 3px 9px rgb(0 0 0 / 0.08)")
    expect(elevation.cardMedium).toBe("0 3px 20px rgb(0 0 0 / 0.08)")
    expect(elevation.lift).toBe(
      "0 1px 1px rgb(0 0 0 / 0.01), 0 2px 2px rgb(0 0 0 / 0.01), 0 4px 4px rgb(0 0 0 / 0.02), 0 8px 8px rgb(0 0 0 / 0.03), 0 14px 14px rgb(0 0 0 / 0.03)"
    )
    expect(elevation.heroIcon).toBe("0 0 30px rgb(0 0 0 / 0.33)")
    expect(elevation.mobileBar).toBe("0 1px 2px rgb(0 0 0 / 0.1)")
    expect(elevation.control).toBe(
      "inset 0 0 0.5px 0 rgb(0 0 0 / 0.15), 1px 1px 1px 0 rgb(0 0 0 / 0.1)"
    )
  })
  test("glass and dialog shadows differ per appearance", () => {
    expect(elevation.glass).toEqual({
      light: "inset 0 0 0 1px rgb(0 0 0 / 0.05), 0 10px 40px rgb(0 0 0 / 0.1)",
      dark: "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 10px 40px rgb(0 0 0 / 0.2)",
    })
    expect(elevation.dialog).toEqual({
      light:
        "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 8px 40px rgb(0 0 0 / 0.25)",
      dark: "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 8px 40px rgb(0 0 0 / 0.55)",
    })
  })
})
