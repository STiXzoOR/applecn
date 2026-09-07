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

describe("button appearance tokens", () => {
  test("labels are semibold on iOS, normal on macOS and the web", () => {
    expect(componentTokens.ios.button.fontWeight).toBe("600")
    expect(componentTokens.macos.button.fontWeight).toBe("400")
    expect(componentTokens.web.button.fontWeight).toBe("400")
  })

  test("only iOS keeps the press-down scale; macOS and the web hold still", () => {
    expect(componentTokens.ios.button.activeScale).toBe("0.97")
    expect(componentTokens.macos.button.activeScale).toBe("1")
    expect(componentTokens.web.button.activeScale).toBe("1")
  })

  test("filled: only macOS carries the control bezel shadow; the web hover tints white instead of black", () => {
    expect(componentTokens.macos.button.filled.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.button.filled.shadow).toBe("none")
    expect(componentTokens.ios.button.filled.hoverBg).toBe(
      "color-mix(in srgb, var(--primary), black 8%)"
    )
    expect(componentTokens.web.button.filled.hoverBg).toBe(
      "color-mix(in srgb, var(--primary), white 6%)"
    )
  })

  test("gray: the macOS push-button bezel reads background-3 and label; iOS and the web share fill-3", () => {
    expect(componentTokens.ios.button.gray.bg).toBe("var(--fill-3)")
    expect(componentTokens.macos.button.gray.bg).toBe("var(--background-3)")
    expect(componentTokens.web.button.gray.bg).toBe("var(--fill-3)")
    expect(componentTokens.ios.button.gray.text).toBe("var(--primary)")
    expect(componentTokens.macos.button.gray.text).toBe("var(--label)")
    expect(componentTokens.web.button.gray.text).toBe("var(--label)")
  })

  test("bordered: macOS fills the bezel and drops its outline; the web keeps a label-4 hairline", () => {
    expect(componentTokens.ios.button.bordered.border).toBe("var(--border)")
    expect(componentTokens.macos.button.bordered.border).toBe("transparent")
    expect(componentTokens.web.button.bordered.border).toBe("var(--label)")
    expect(componentTokens.macos.button.bordered.bg).toBe("var(--background-3)")
    expect(componentTokens.web.button.bordered.hoverText).toBe(
      "var(--background)"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("web")
    expect(lines).toContainEqual(["button-font-weight", "400"])
    expect(lines).toContainEqual(["button-active-scale", "1"])
    expect(lines).toContainEqual([
      "button-filled-hover-bg",
      "color-mix(in srgb, var(--primary), white 6%)",
    ])
    expect(lines).toContainEqual(["button-gray-bg", "var(--fill-3)"])
    expect(lines).toContainEqual(["button-bordered-border", "var(--label)"])
  })
})
