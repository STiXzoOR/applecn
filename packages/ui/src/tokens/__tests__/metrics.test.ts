import { describe, expect, test } from "vitest"

import { elevation } from "../elevation"
import { materials } from "../materials"
import { metrics, platforms } from "../metrics"
import { durations, easings, springLinear, springs } from "../motion"
import { radii } from "../radii"

describe("platforms", () => {
  test("there are three idioms: iOS, macOS and Apple's web", () => {
    expect(platforms).toEqual(["ios", "macos", "web"])
    for (const p of platforms) expect(metrics[p]).toBeDefined()
  })
})

describe("iOS 26 metrics (UIKit on the iPhone 17 Pro simulator, 2026-09-06)", () => {
  const ios = metrics.ios
  test("button heights: 28 for mini and small, 34 medium, 50 large, all capsules", () => {
    expect(ios.buttonHeight).toEqual({
      mini: 28,
      small: 28,
      regular: 34,
      large: 50,
      xl: 60,
    })
    expect(ios.buttonRadius.regular).toBe(1000)
    expect(ios.buttonRadius.mini).toBe(1000)
    expect(ios.buttonFont).toEqual({
      mini: 15,
      small: 15,
      regular: 17,
      large: 17,
      xl: 20,
    })
    expect(ios.buttonPaddingX.regular).toBe(12)
    expect(ios.buttonPaddingX.large).toBe(20)
  })
  test("the switch is a 63×28 capsule with a 37×24 oval knob inset 2", () => {
    expect(ios.switch).toEqual({
      width: 63,
      height: 28,
      thumbWidth: 37,
      thumbHeight: 24,
      inset: 2,
    })
  })
  test("the slider has a 6 pt track and the same 37×24 pill thumb", () => {
    expect(ios.slider).toEqual({ track: 6, thumbWidth: 37, thumbHeight: 24 })
  })
  test("segmented control and stepper are 32 pt capsules", () => {
    expect(ios.segmented).toEqual({ height: 32, inset: 2, radius: 1000 })
    expect(ios.stepper).toEqual({
      width: 94,
      height: 32,
      radius: 1000,
      orientation: "horizontal",
    })
  })
  test("fields: the 34 pt rounded-rect text field (radius 5) and the 44 pt search capsule", () => {
    expect(ios.textField).toEqual({ height: 34, radius: 5 })
    expect(ios.searchField).toEqual({ height: 44, radius: 1000 })
  })
  test("inset grouped lists: inset 20, radius 26, rows 52 with 15×16 padding, 17 pt headers", () => {
    expect(ios.list.inset).toBe(16)
    expect(ios.list.insetWide).toBe(20)
    expect(ios.list.radius).toBe(26)
    expect(ios.list.rowMinHeight).toBe(52)
    expect(ios.list.rowPaddingY).toBe(15)
    expect(ios.list.rowPaddingX).toBe(16)
    expect(ios.list.iconTile).toBe(30)
    expect(ios.list.headerFont).toBe(17)
    expect(ios.list.footerFont).toBe(13)
    expect(ios.card.radius).toBe(26)
  })
  test("bars: 54 pt nav row with 44 pt platters, the 62 pt floating tab bar, 52 pt toolbars", () => {
    expect(ios.navBar).toEqual({ height: 54, largeTitle: 52, item: 44 })
    expect(ios.tabBar).toEqual({
      height: 62,
      inset: 21,
      item: 54,
      itemInset: 4,
      label: 10,
    })
    expect(ios.toolbar).toEqual({ height: 52, item: 44, inset: 4 })
  })
  test("alerts: 320 wide, radius 34, 48 pt capsule actions inset 16 and 8 apart", () => {
    expect(ios.alert).toEqual({
      width: 320,
      radius: 34,
      buttonHeight: 48,
      buttonInset: 16,
      buttonGap: 8,
    })
    expect(ios.actionSheet).toEqual({
      width: 320,
      rowHeight: 48,
      radius: 34,
      inset: 16,
      gap: 8,
    })
  })
  test("menus, popovers, sheets and dialogs", () => {
    expect(ios.menu).toEqual({
      width: 250,
      itemHeight: 44,
      radius: 26,
      itemRadius: 22,
      padding: 4,
    })
    expect(ios.popover.radius).toBe(26)
    expect(ios.sheet.grabber).toEqual([36, 5])
    expect(ios.sheet.radius).toBe(40)
    expect(ios.dialog).toEqual({ width: 540, radius: 34 })
  })
  test("small controls", () => {
    expect(ios.checkbox).toEqual({ size: 22, radius: 1000, shape: "circle" })
    expect(ios.radio).toEqual({ size: 22, dot: 8 })
    expect(ios.pageControl).toEqual({ dot: 7, gap: 10 })
    expect(ios.progress.height).toBe(4)
    expect(ios.spinner).toEqual({ medium: 20, large: 37 })
    expect(ios.hitTarget).toEqual({ default: 44, minimum: 28 })
    expect(ios.window).toBeUndefined()
  })
})

describe("macOS 26 metrics (AppKit on Tahoe 26.6, 2026-09-06)", () => {
  const mac = metrics.macos
  test("push buttons: 16/20/24/28/36, rounded rectangles up to regular, capsules from large", () => {
    expect(mac.buttonHeight).toEqual({
      mini: 16,
      small: 20,
      regular: 24,
      large: 28,
      xl: 36,
    })
    expect(mac.buttonRadius).toEqual({
      mini: 4,
      small: 5,
      regular: 6,
      large: 1000,
      xl: 1000,
    })
    expect(mac.buttonFont).toEqual({
      mini: 9,
      small: 11,
      regular: 13,
      large: 13,
      xl: 13,
    })
  })
  test("the switch is 54×24 with a 31×20 oval knob", () => {
    expect(mac.switch).toEqual({
      width: 54,
      height: 24,
      thumbWidth: 31,
      thumbHeight: 20,
      inset: 2,
    })
  })
  test("checkbox and radio are 16 pt; the checkbox a 4 pt rounded square", () => {
    expect(mac.checkbox).toEqual({ size: 16, radius: 4, shape: "square" })
    expect(mac.radio).toEqual({ size: 16, dot: 6 })
  })
  test("the slider knob is a 20×16 oval on a 4 pt track", () => {
    expect(mac.slider).toEqual({ track: 4, thumbWidth: 20, thumbHeight: 16 })
  })
  test("segmented 24 (radius 6), text field 24 (radius 6), search 24 capsule, stepper 20×26 vertical", () => {
    expect(mac.segmented).toEqual({ height: 24, inset: 2, radius: 6 })
    expect(mac.textField).toEqual({ height: 24, radius: 6 })
    expect(mac.searchField).toEqual({ height: 24, radius: 1000 })
    expect(mac.stepper).toEqual({
      width: 20,
      height: 26,
      radius: 5,
      orientation: "vertical",
    })
  })
  test("menus have 24 pt items with 5 pt padding; alerts are 260 wide with 28 pt buttons", () => {
    expect(mac.menu).toEqual({
      width: 200,
      itemHeight: 24,
      radius: 12,
      itemRadius: 5,
      padding: 5,
    })
    expect(mac.alert).toEqual({
      width: 260,
      radius: 16,
      buttonHeight: 28,
      buttonInset: 16,
      buttonGap: 8,
    })
  })
  test("windows: 32 pt title bar, 52 pt unified toolbar, 14 pt traffic lights", () => {
    expect(mac.window).toEqual({ titleBar: 32, radius: 16, trafficLight: 14 })
    expect(mac.toolbar).toEqual({ height: 52, item: 28, inset: 0 })
    expect(mac.navBar).toEqual({ height: 52, largeTitle: 0, item: 28 })
    expect(mac.tabBar.height).toBe(0)
  })
  test("sidebar rows are 28 with 6 pt corners; grouped forms use 10 pt corners", () => {
    expect(mac.sidebar).toEqual({ width: 240, rowHeight: 28, radius: 6 })
    expect(mac.list.radius).toBe(10)
    expect(mac.list.rowMinHeight).toBe(28)
    expect(mac.hitTarget).toEqual({ default: 28, minimum: 20 })
    expect(mac.spinner).toEqual({ medium: 16, large: 32 })
    expect(mac.progress.height).toBe(6)
  })
})

describe("web metrics (apple.com and Apple's web apps, 2026-09-05/06)", () => {
  const web = metrics.web
  test("apple.com's pill buttons: reduced 24, small 28, standard 36, elevated 44, super 56", () => {
    expect(web.buttonHeight).toEqual({
      mini: 24,
      small: 28,
      regular: 36,
      large: 44,
      xl: 56,
    })
    expect(web.buttonRadius.regular).toBe(1000)
    expect(web.buttonFont).toEqual({
      mini: 12,
      small: 12,
      regular: 14,
      large: 17,
      xl: 17,
    })
    expect(web.buttonPaddingX).toEqual({
      mini: 11,
      small: 15,
      regular: 16,
      large: 22,
      xl: 31,
    })
  })
  test("web-app controls: 32 pt fields, 34 pt sidebar rows with 8 pt corners, 44 pt menu rows", () => {
    expect(web.textField).toEqual({ height: 32, radius: 5 })
    expect(web.searchField).toEqual({ height: 32, radius: 1000 })
    expect(web.sidebar).toEqual({ width: 260, rowHeight: 34, radius: 8 })
    expect(web.menu).toEqual({
      width: 200,
      itemHeight: 44,
      radius: 12,
      itemRadius: 8,
      padding: 4,
    })
    expect(web.slider).toEqual({ track: 5, thumbWidth: 13, thumbHeight: 13 })
    expect(web.segmented).toEqual({ height: 32, inset: 2, radius: 1000 })
  })
  test("bars: the 44 pt global nav, 52 pt web-app headers; dialogs 10 pt corners, the 691 pt content modal", () => {
    expect(web.navBar).toEqual({ height: 44, largeTitle: 0, item: 36 })
    expect(web.toolbar).toEqual({ height: 52, item: 28, inset: 0 })
    expect(web.dialog).toEqual({ width: 691, radius: 10 })
    expect(web.sheet.radius).toBe(24)
    expect(web.card.radius).toBe(17)
    expect(web.list.radius).toBe(12)
  })
})

describe("radii per platform", () => {
  test("iOS 26: 5 (fields) to 26 (grouped lists), alerts 34, sheets 40", () => {
    expect(radii.ios.ladder).toEqual({
      sm: 5,
      md: 8,
      lg: 10,
      xl: 14,
      "2xl": 18,
      "3xl": 22,
      "4xl": 26,
    })
    expect(radii.ios.sheet).toBe(40)
  })
  test("macOS 26: 4 to 16", () => {
    expect(radii.macos.ladder).toEqual({
      sm: 4,
      md: 5,
      lg: 6,
      xl: 8,
      "2xl": 10,
      "3xl": 12,
      "4xl": 16,
    })
    expect(radii.macos.sheet).toBe(16)
  })
  test("web: the App Store's tokens, xsmall 5 to xlarge 24", () => {
    expect(radii.web.ladder).toEqual({
      sm: 5,
      md: 8,
      lg: 10,
      xl: 12,
      "2xl": 17,
      "3xl": 20,
      "4xl": 24,
    })
    expect(radii.web.sheet).toBe(24)
    expect(radii.icon).toBe("22.37%")
    expect(radii.capsule).toBe(1000)
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
