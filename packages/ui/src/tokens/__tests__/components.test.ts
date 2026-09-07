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

describe("alert dialog appearance tokens", () => {
  test("iOS text starts; macOS centres it, as AppKit alerts do", () => {
    expect(componentTokens.ios.alertDialog.textAlign).toBe("start")
    expect(componentTokens.macos.alertDialog.textAlign).toBe("center")
    expect(componentTokens.web.alertDialog.textAlign).toBe("start")
  })

  test("title and message insets narrow from 1.5rem to 1rem on macOS", () => {
    expect(componentTokens.ios.alertDialog.titlePx).toBe("1.5rem")
    expect(componentTokens.macos.alertDialog.titlePx).toBe("1rem")
    expect(componentTokens.web.alertDialog.titlePx).toBe("1.5rem")
    expect(componentTokens.ios.alertDialog.titlePt).toBe("1.25rem")
    expect(componentTokens.macos.alertDialog.titlePt).toBe("1.5rem")
    expect(componentTokens.macos.alertDialog.descriptionText).toBe(
      "var(--label)"
    )
    expect(componentTokens.ios.alertDialog.descriptionText).toBe(
      "var(--label-2)"
    )
  })

  test("the action bezel: only macOS carries a shadow and a control radius", () => {
    expect(componentTokens.ios.alertDialog.button.radius).toBe(
      "calc(infinity * 1px)"
    )
    expect(componentTokens.macos.alertDialog.button.radius).toBe(
      "var(--control-radius-regular)"
    )
    expect(componentTokens.macos.alertDialog.button.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.alertDialog.button.shadow).toBe("none")
  })

  test("only macOS disables the press-down scale; iOS and the web keep it", () => {
    expect(componentTokens.ios.alertDialog.button.activeScale).toBe("0.97")
    expect(componentTokens.macos.alertDialog.button.activeScale).toBe("1")
    expect(componentTokens.web.alertDialog.button.activeScale).toBe("0.97")
  })

  test("the web always renders action labels at normal weight, preferred or not", () => {
    expect(componentTokens.web.alertDialog.button.fontWeight).toBe("400")
    expect(componentTokens.web.alertDialog.button.fontWeightPreferred).toBe(
      "400"
    )
    expect(componentTokens.ios.alertDialog.button.fontWeight).toBe("500")
    expect(componentTokens.ios.alertDialog.button.fontWeightPreferred).toBe(
      "600"
    )
  })

  test("a preferred action is filled with the accent and turns white, macOS only", () => {
    expect(componentTokens.macos.alertDialog.button.bgPreferred).toBe(
      "var(--primary)"
    )
    expect(componentTokens.macos.alertDialog.button.textDefaultPreferred).toBe(
      "white"
    )
    expect(
      componentTokens.macos.alertDialog.button.textDestructivePreferred
    ).toBe("white")
    expect(componentTokens.ios.alertDialog.button.bgPreferred).toBe(
      componentTokens.ios.alertDialog.button.bg
    )
    expect(componentTokens.web.alertDialog.button.textDefaultPreferred).toBe(
      componentTokens.web.alertDialog.button.textDefault
    )
  })

  test("destructive text is red on every idiom, preferred or not", () => {
    for (const p of ["ios", "macos", "web"] as const) {
      expect(componentTokens[p].alertDialog.button.textDestructive).toBe(
        "var(--destructive)"
      )
    }
  })

  test("emits kebab-case CSS variable lines, prefixed alert- to match the geometry tokens", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["alert-text-align", "center"])
    expect(lines).toContainEqual(["alert-title-px", "1rem"])
    expect(lines).toContainEqual([
      "alert-button-radius",
      "var(--control-radius-regular)",
    ])
    expect(lines).toContainEqual([
      "alert-button-bg-preferred",
      "var(--primary)",
    ])
  })
})

describe("menu appearance tokens", () => {
  test("rows tighten from 3 to 2 gap and 4 to 2.5 padding off iOS", () => {
    expect(componentTokens.ios.menu.item.gap).toBe("0.75rem")
    expect(componentTokens.macos.menu.item.gap).toBe("0.5rem")
    expect(componentTokens.web.menu.item.gap).toBe("0.75rem")
    expect(componentTokens.ios.menu.item.px).toBe("1rem")
    expect(componentTokens.macos.menu.item.px).toBe("0.625rem")
  })

  test("macOS highlights with the system selection colour and turns text and the shortcut white", () => {
    expect(componentTokens.macos.menu.item.highlightBg).toBe("var(--selection)")
    expect(componentTokens.ios.menu.item.highlightBg).toBe("var(--fill-3)")
    expect(componentTokens.macos.menu.item.highlightText).toBe("white")
    expect(componentTokens.ios.menu.item.highlightText).toBe("var(--label)")
    expect(componentTokens.macos.menu.item.shortcutHighlightText).toBe(
      "rgb(255 255 255 / 0.7)"
    )
    expect(componentTokens.web.menu.item.shortcutHighlightText).toBe(
      "var(--label-2)"
    )
  })

  test("the group label's own padding narrows from 0.5rem to 0.25rem off iOS", () => {
    expect(componentTokens.ios.menu.label.py).toBe("0.5rem")
    expect(componentTokens.macos.menu.label.py).toBe("0.25rem")
    expect(componentTokens.web.menu.label.py).toBe("0.5rem")
  })

  test("the group label steps down from footnote to caption-1 on macOS, bolded", () => {
    expect(componentTokens.ios.menu.label.fontSize).toBe(
      "var(--type-footnote-size)"
    )
    expect(componentTokens.macos.menu.label.fontSize).toBe(
      "var(--type-caption-1-size)"
    )
    expect(componentTokens.web.menu.label.fontSize).toBe(
      "var(--type-footnote-size)"
    )
    expect(componentTokens.ios.menu.label.leading).toBe(
      "var(--type-footnote-leading)"
    )
    expect(componentTokens.macos.menu.label.leading).toBe(
      "var(--type-caption-1-leading)"
    )
    expect(componentTokens.ios.menu.label.weight).toBe(
      "var(--type-footnote-weight)"
    )
    // macOS bolds it with font-semibold's fixed 600, not the caption-1 scale's own weight.
    expect(componentTokens.macos.menu.label.weight).toBe("600")
    expect(componentTokens.ios.menu.label.tracking).toBe(
      "var(--type-footnote-tracking)"
    )
    expect(componentTokens.macos.menu.label.tracking).toBe(
      "var(--type-caption-1-tracking)"
    )
  })

  test("the separator bleeds to the edges on iOS and the web; macOS insets it to a hairline", () => {
    expect(componentTokens.ios.menu.separator.mx).toBe(
      "calc(-1 * var(--menu-padding))"
    )
    expect(componentTokens.macos.menu.separator.mx).toBe("0.5rem")
    expect(componentTokens.ios.menu.separator.height).toBe("0.5rem")
    expect(componentTokens.macos.menu.separator.height).toBe("0.5px")
    expect(componentTokens.macos.menu.separator.bg).toBe("var(--separator)")
    expect(componentTokens.web.menu.separator.bg).toBe("var(--fill-4)")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["menu-item-gap", "0.5rem"])
    expect(lines).toContainEqual(["menu-item-highlight-bg", "var(--selection)"])
    expect(lines).toContainEqual(["menu-separator-height", "0.5px"])
    expect(lines).toContainEqual(["menu-separator-bg", "var(--separator)"])
    expect(lines).toContainEqual([
      "menu-label-font-size",
      "var(--type-caption-1-size)",
    ])
    expect(lines).toContainEqual(["menu-label-weight", "600"])
  })
})

describe("combobox appearance tokens", () => {
  test("the field keeps a 0.5px separator hairline off the web; only the web widens it to 1px label-4", () => {
    expect(componentTokens.ios.combobox.field.borderWidth).toBe(0.5)
    expect(componentTokens.macos.combobox.field.borderWidth).toBe(0.5)
    expect(componentTokens.web.combobox.field.borderWidth).toBe(1)
    expect(componentTokens.ios.combobox.field.borderColor).toBe(
      "var(--separator)"
    )
    expect(componentTokens.web.combobox.field.borderColor).toBe(
      "var(--label-4)"
    )
  })

  test("only macOS carries the control bezel shadow on the field", () => {
    expect(componentTokens.macos.combobox.field.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.combobox.field.shadow).toBe("none")
  })

  test("the selected check mark turns white on a macOS highlight; iOS and the web keep it tinted", () => {
    expect(componentTokens.macos.combobox.item.indicatorHighlightText).toBe(
      "white"
    )
    expect(componentTokens.ios.combobox.item.indicatorHighlightText).toBe(
      "var(--primary)"
    )
    expect(componentTokens.web.combobox.item.indicatorHighlightText).toBe(
      "var(--primary)"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("web")
    expect(lines).toContainEqual(["combobox-field-border-width", "1px"])
    expect(lines).toContainEqual([
      "combobox-field-border-color",
      "var(--label-4)",
    ])
    expect(lines).toContainEqual(["combobox-field-shadow", "none"])
    expect(lines).toContainEqual([
      "combobox-item-indicator-highlight-text",
      "var(--primary)",
    ])
  })
})

describe("select appearance tokens", () => {
  test("the popup trigger: macOS reads background-3 with a control shadow; the web adds a label-4 hairline iOS and macOS don't have", () => {
    expect(componentTokens.ios.select.popup.bg).toBe("var(--fill-3)")
    expect(componentTokens.macos.select.popup.bg).toBe("var(--background-3)")
    expect(componentTokens.web.select.popup.bg).toBe("var(--background-3)")
    expect(componentTokens.macos.select.popup.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.web.select.popup.shadow).toBe("none")
    expect(componentTokens.ios.select.popup.borderWidth).toBe(0)
    expect(componentTokens.web.select.popup.borderWidth).toBe(1)
    expect(componentTokens.web.select.popup.borderColor).toBe("var(--label-4)")
  })

  test("the trigger's hover tint matches macOS's resting bezel; iOS and the web share fill-2", () => {
    expect(componentTokens.macos.select.popup.hoverBg).toBe(
      "var(--background-3)"
    )
    expect(componentTokens.ios.select.popup.hoverBg).toBe("var(--fill-2)")
    expect(componentTokens.web.select.popup.hoverBg).toBe("var(--fill-2)")
  })

  test("macOS highlights options with the system selection colour and white text, like Menu", () => {
    expect(componentTokens.macos.select.item.highlightBg).toBe(
      "var(--selection)"
    )
    expect(componentTokens.macos.select.item.highlightText).toBe("white")
    expect(componentTokens.ios.select.item.highlightBg).toBe("var(--fill-3)")
    expect(componentTokens.ios.select.item.highlightText).toBe("var(--label)")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("web")
    expect(lines).toContainEqual(["select-popup-bg", "var(--background-3)"])
    expect(lines).toContainEqual(["select-popup-border-width", "1px"])
    expect(lines).toContainEqual([
      "select-popup-border-color",
      "var(--label-4)",
    ])
    expect(lines).toContainEqual(["select-item-highlight-bg", "var(--fill-3)"])
  })
})
