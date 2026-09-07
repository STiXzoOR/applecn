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
