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

describe("toast appearance tokens", () => {
  test("iOS centres the viewport by its safe-area inset; macOS and the web anchor it to the top trailing corner", () => {
    expect(componentTokens.ios.toast.top).toBe(
      "max(0.5rem, env(safe-area-inset-top))"
    )
    expect(componentTokens.macos.toast.top).toBe("1.25rem")
    expect(componentTokens.web.toast.top).toBe("1.25rem")
    expect(componentTokens.ios.toast.left).toBe("50%")
    expect(componentTokens.macos.toast.left).toBe("auto")
    expect(componentTokens.ios.toast.translateX).toBe("-50%")
    expect(componentTokens.macos.toast.translateX).toBe("0%")
    expect(componentTokens.ios.toast.right).toBe("auto")
    expect(componentTokens.macos.toast.right).toBe("1.25rem")
    expect(componentTokens.web.toast.right).toBe("1.25rem")
  })

  test("the viewport narrows to a fixed 360px off iOS, where it stays fluid", () => {
    expect(componentTokens.ios.toast.width).toBe("calc(100% - 1rem)")
    expect(componentTokens.macos.toast.width).toBe("360px")
    expect(componentTokens.web.toast.width).toBe("360px")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["toast-top", "1.25rem"])
    expect(lines).toContainEqual(["toast-right", "1.25rem"])
    expect(lines).toContainEqual(["toast-left", "auto"])
    expect(lines).toContainEqual(["toast-translate-x", "0%"])
    expect(lines).toContainEqual(["toast-width", "360px"])
  })
})

describe("color well appearance tokens", () => {
  test("iOS is a bare 28pt ring; macOS is AppKit's 48x24 filled capsule with a control shadow", () => {
    expect(componentTokens.ios.colorWell.height).toBe("1.75rem")
    expect(componentTokens.ios.colorWell.width).toBe("1.75rem")
    expect(componentTokens.macos.colorWell.height).toBe(
      "var(--control-height-regular)"
    )
    expect(componentTokens.macos.colorWell.width).toBe("3rem")
    expect(componentTokens.ios.colorWell.bg).toBe("transparent")
    expect(componentTokens.macos.colorWell.bg).toBe("var(--background-3)")
    expect(componentTokens.macos.colorWell.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.colorWell.shadow).toBe("none")
  })

  test("the ring drops to no border at all on macOS, since AppKit fills the bezel instead", () => {
    expect(componentTokens.ios.colorWell.borderWidth).toBe(1.5)
    expect(componentTokens.macos.colorWell.borderWidth).toBe(0)
  })

  test("the corner steps from a full circle to macOS's control radius, inset 4px on the swatch", () => {
    expect(componentTokens.ios.colorWell.radius).toBe("calc(infinity * 1px)")
    expect(componentTokens.macos.colorWell.radius).toBe("var(--radius-control)")
    expect(componentTokens.ios.colorWell.swatchRadius).toBe(
      "calc(infinity * 1px)"
    )
    expect(componentTokens.macos.colorWell.swatchRadius).toBe(
      "calc(var(--radius-control) - 4px)"
    )
  })

  test("padding widens from 0.125rem to 0.25rem on macOS", () => {
    expect(componentTokens.ios.colorWell.padding).toBe("0.125rem")
    expect(componentTokens.macos.colorWell.padding).toBe("0.25rem")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "color-well-height",
      "var(--control-height-regular)",
    ])
    expect(lines).toContainEqual(["color-well-width", "3rem"])
    expect(lines).toContainEqual(["color-well-border-width", "0px"])
    expect(lines).toContainEqual(["color-well-bg", "var(--background-3)"])
    expect(lines).toContainEqual(["color-well-padding", "0.25rem"])
    expect(lines).toContainEqual([
      "color-well-shadow",
      "var(--elevation-control)",
    ])
    expect(lines).toContainEqual(["color-well-radius", "var(--radius-control)"])
    expect(lines).toContainEqual([
      "color-well-swatch-radius",
      "calc(var(--radius-control) - 4px)",
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

  test("the group label steps down from footnote to caption-1 on macOS, bolded — its own family, since select doesn't otherwise share menu's tokens", () => {
    expect(componentTokens.ios.select.label.fontSize).toBe(
      "var(--type-footnote-size)"
    )
    expect(componentTokens.macos.select.label.fontSize).toBe(
      "var(--type-caption-1-size)"
    )
    expect(componentTokens.ios.select.label.weight).toBe(
      "var(--type-footnote-weight)"
    )
    expect(componentTokens.macos.select.label.weight).toBe("600")
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
    expect(lines).toContainEqual([
      "select-label-font-size",
      "var(--type-footnote-size)",
    ])
  })
})

describe("toolbar appearance tokens", () => {
  test("iOS keeps a full capsule; macOS and the web round to the control radius", () => {
    expect(componentTokens.ios.toolbar.controlRadius).toBe(
      "calc(infinity * 1px)"
    )
    expect(componentTokens.macos.toolbar.controlRadius).toBe(
      "var(--radius-control)"
    )
    expect(componentTokens.web.toolbar.controlRadius).toBe(
      "var(--radius-control)"
    )
  })

  test("the button glyph shrinks from 24pt on iOS to 16pt on macOS, 20pt on the web", () => {
    expect(componentTokens.ios.toolbar.buttonIconSize).toBe("1.5rem")
    expect(componentTokens.macos.toolbar.buttonIconSize).toBe("1rem")
    expect(componentTokens.web.toolbar.buttonIconSize).toBe("1.25rem")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "toolbar-control-radius",
      "var(--radius-control)",
    ])
    expect(lines).toContainEqual(["toolbar-button-icon-size", "1rem"])
  })
})

describe("search field appearance tokens", () => {
  test("the fill-3 capsule steps to the AppKit bezel on macOS, a bordered field on the web", () => {
    expect(componentTokens.ios.searchField.bg).toBe("var(--fill-3)")
    expect(componentTokens.macos.searchField.bg).toBe("var(--background-3)")
    expect(componentTokens.web.searchField.bg).toBe("var(--background-3)")
    expect(componentTokens.macos.searchField.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.searchField.shadow).toBe("none")
    expect(componentTokens.web.searchField.borderWidth).toBe(1)
    expect(componentTokens.web.searchField.borderColor).toBe("var(--label-4)")
    expect(componentTokens.ios.searchField.borderWidth).toBe(0)
  })

  test("the leading inset tightens from 0.75rem to 0.5rem on macOS", () => {
    expect(componentTokens.ios.searchField.paddingStart).toBe("0.75rem")
    expect(componentTokens.macos.searchField.paddingStart).toBe("0.5rem")
    expect(componentTokens.web.searchField.paddingStart).toBe("0.75rem")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["search-field-bg", "var(--background-3)"])
    expect(lines).toContainEqual(["search-field-padding-start", "0.5rem"])
    expect(lines).toContainEqual([
      "search-field-shadow",
      "var(--elevation-control)",
    ])
    expect(lines).toContainEqual(["search-field-border-width", "0px"])
  })
})

describe("passcode field appearance tokens", () => {
  test("shares the bordered field's 0.5px separator hairline off the web, control shadow on macOS", () => {
    expect(componentTokens.ios.passcodeField.borderWidth).toBe(0.5)
    expect(componentTokens.macos.passcodeField.borderWidth).toBe(0.5)
    expect(componentTokens.web.passcodeField.borderWidth).toBe(1)
    expect(componentTokens.ios.passcodeField.borderColor).toBe(
      "var(--separator)"
    )
    expect(componentTokens.web.passcodeField.borderColor).toBe("var(--label-4)")
    expect(componentTokens.macos.passcodeField.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.passcodeField.shadow).toBe("none")
  })

  test("the box narrows from 2.5rem to 2rem on macOS, and its height reads the alert button height off macOS", () => {
    expect(componentTokens.ios.passcodeField.width).toBe("2.5rem")
    expect(componentTokens.macos.passcodeField.width).toBe("2rem")
    expect(componentTokens.web.passcodeField.width).toBe("2.5rem")
    expect(componentTokens.ios.passcodeField.height).toBe(
      "var(--alert-button-height)"
    )
    expect(componentTokens.macos.passcodeField.height).toBe(
      "var(--control-height-large)"
    )
    expect(componentTokens.web.passcodeField.height).toBe(
      "var(--alert-button-height)"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "passcode-field-height",
      "var(--control-height-large)",
    ])
    expect(lines).toContainEqual(["passcode-field-width", "2rem"])
    expect(lines).toContainEqual(["passcode-field-border-width", "0.5px"])
    expect(lines).toContainEqual([
      "passcode-field-border-color",
      "var(--separator)",
    ])
    expect(lines).toContainEqual([
      "passcode-field-shadow",
      "var(--elevation-control)",
    ])
  })
})

describe("toggle group appearance tokens", () => {
  test("iOS and the web press to a white, shadowed segment; macOS fills it with the accent and drops the shadow", () => {
    expect(componentTokens.ios.toggleGroup.pressed.bg).toBe("var(--background)")
    expect(componentTokens.macos.toggleGroup.pressed.bg).toBe("var(--primary)")
    expect(componentTokens.web.toggleGroup.pressed.bg).toBe("var(--background)")
    expect(componentTokens.ios.toggleGroup.pressed.shadow).toBe(
      "var(--elevation-segment)"
    )
    expect(componentTokens.macos.toggleGroup.pressed.shadow).toBe("none")
  })

  test("the pressed label stays the resting label colour off macOS, which turns it white", () => {
    expect(componentTokens.ios.toggleGroup.pressed.text).toBe("var(--label)")
    expect(componentTokens.web.toggleGroup.pressed.text).toBe("var(--label)")
    expect(componentTokens.macos.toggleGroup.pressed.text).toBe("white")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["toggle-group-pressed-bg", "var(--primary)"])
    expect(lines).toContainEqual(["toggle-group-pressed-text", "white"])
    expect(lines).toContainEqual(["toggle-group-pressed-shadow", "none"])
  })
})

describe("toggle appearance tokens", () => {
  test("iOS stays semibold at full press-down scale; macOS holds still at normal weight; the web keeps the press scale at normal weight", () => {
    expect(componentTokens.ios.toggle.fontWeight).toBe("600")
    expect(componentTokens.macos.toggle.fontWeight).toBe("400")
    expect(componentTokens.web.toggle.fontWeight).toBe("400")
    expect(componentTokens.ios.toggle.activeScale).toBe("0.97")
    expect(componentTokens.macos.toggle.activeScale).toBe("1")
    expect(componentTokens.web.toggle.activeScale).toBe("0.97")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("web")
    expect(lines).toContainEqual(["toggle-font-weight", "400"])
    expect(lines).toContainEqual(["toggle-active-scale", "0.97"])
  })
})

describe("textarea appearance tokens", () => {
  test("shares the bordered field's 0.5px separator hairline off the web, control shadow on macOS", () => {
    expect(componentTokens.ios.textarea.borderWidth).toBe(0.5)
    expect(componentTokens.macos.textarea.borderWidth).toBe(0.5)
    expect(componentTokens.web.textarea.borderWidth).toBe(1)
    expect(componentTokens.ios.textarea.borderColor).toBe("var(--separator)")
    expect(componentTokens.web.textarea.borderColor).toBe("var(--label-4)")
    expect(componentTokens.macos.textarea.shadow).toBe(
      "var(--elevation-control)"
    )
    expect(componentTokens.ios.textarea.shadow).toBe("none")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("web")
    expect(lines).toContainEqual(["textarea-border-width", "1px"])
    expect(lines).toContainEqual(["textarea-border-color", "var(--label-4)"])
    expect(lines).toContainEqual(["textarea-shadow", "none"])
  })
})

describe("segmented control appearance tokens", () => {
  test("the sliding indicator is the same white/shadowed vs. accent-filled race as ToggleGroup", () => {
    expect(componentTokens.ios.segmentedControl.indicator.bg).toBe(
      "var(--background)"
    )
    expect(componentTokens.macos.segmentedControl.indicator.bg).toBe(
      "var(--primary)"
    )
    expect(componentTokens.ios.segmentedControl.indicator.shadow).toBe(
      "var(--elevation-segment)"
    )
    expect(componentTokens.macos.segmentedControl.indicator.shadow).toBe("none")
  })

  test("the active label stays the resting label colour off macOS, which turns it white", () => {
    expect(componentTokens.ios.segmentedControl.item.activeText).toBe(
      "var(--label)"
    )
    expect(componentTokens.web.segmentedControl.item.activeText).toBe(
      "var(--label)"
    )
    expect(componentTokens.macos.segmentedControl.item.activeText).toBe("white")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "segmented-control-indicator-bg",
      "var(--primary)",
    ])
    expect(lines).toContainEqual(["segmented-control-indicator-shadow", "none"])
    expect(lines).toContainEqual([
      "segmented-control-item-active-text",
      "white",
    ])
  })
})

describe("input appearance tokens", () => {
  test("the bordered variant shares the same field border race as textarea and passcode-field", () => {
    expect(componentTokens.ios.input.borderWidth).toBe(0.5)
    expect(componentTokens.macos.input.borderWidth).toBe(0.5)
    expect(componentTokens.web.input.borderWidth).toBe(1)
    expect(componentTokens.ios.input.borderColor).toBe("var(--separator)")
    expect(componentTokens.web.input.borderColor).toBe("var(--label-4)")
    expect(componentTokens.macos.input.shadow).toBe("var(--elevation-control)")
    expect(componentTokens.ios.input.shadow).toBe("none")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["input-border-width", "0.5px"])
    expect(lines).toContainEqual(["input-border-color", "var(--separator)"])
    expect(lines).toContainEqual(["input-shadow", "var(--elevation-control)"])
  })
})

describe("sidebar appearance tokens", () => {
  test("macOS packs rows tighter and steps the group label down to label-2", () => {
    expect(componentTokens.ios.sidebar.itemGap).toBe("0.625rem")
    expect(componentTokens.macos.sidebar.itemGap).toBe("0.5rem")
    expect(componentTokens.web.sidebar.itemGap).toBe("0.625rem")
    expect(componentTokens.ios.sidebar.groupLabelText).toBe("var(--label-3)")
    expect(componentTokens.macos.sidebar.groupLabelText).toBe("var(--label-2)")
    expect(componentTokens.web.sidebar.groupLabelText).toBe("var(--label-3)")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["sidebar-item-gap", "0.5rem"])
    expect(lines).toContainEqual(["sidebar-group-label-text", "var(--label-2)"])
  })
})

describe("navigation bar appearance tokens", () => {
  test("the back button keeps a full capsule on iOS; macOS and the web round to the control radius", () => {
    expect(componentTokens.ios.navigationBar.backRadius).toBe(
      "calc(infinity * 1px)"
    )
    expect(componentTokens.macos.navigationBar.backRadius).toBe(
      "var(--radius-control)"
    )
    expect(componentTokens.web.navigationBar.backRadius).toBe(
      "var(--radius-control)"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "navigation-bar-back-radius",
      "var(--radius-control)",
    ])
  })
})

describe("action sheet appearance tokens", () => {
  test("the popover row highlights with fill-3 off macOS; macOS highlights with the selection colour", () => {
    expect(componentTokens.ios.actionSheet.item.hoverBg).toBe("var(--fill-3)")
    expect(componentTokens.macos.actionSheet.item.hoverBg).toBe(
      "var(--selection)"
    )
    expect(componentTokens.web.actionSheet.item.hoverBg).toBe("var(--fill-3)")
  })

  test("macOS turns the row's label white on hover, whichever variant it is; other idioms keep the resting colour", () => {
    expect(componentTokens.ios.actionSheet.item.hoverTextDefault).toBe(
      "var(--primary)"
    )
    expect(componentTokens.ios.actionSheet.item.hoverTextDestructive).toBe(
      "var(--destructive)"
    )
    expect(componentTokens.macos.actionSheet.item.hoverTextDefault).toBe(
      "white"
    )
    expect(componentTokens.macos.actionSheet.item.hoverTextDestructive).toBe(
      "white"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual([
      "action-sheet-item-hover-bg",
      "var(--selection)",
    ])
    expect(lines).toContainEqual([
      "action-sheet-item-hover-text-default",
      "white",
    ])
    expect(lines).toContainEqual([
      "action-sheet-item-hover-text-destructive",
      "white",
    ])
  })
})

describe("sheet appearance tokens", () => {
  test("the toolbar row shares the platform nav bar height off macOS, where it holds at a fixed 48pt", () => {
    expect(componentTokens.ios.sheet.toolbarHeight).toBe(
      "var(--nav-bar-height)"
    )
    expect(componentTokens.macos.sheet.toolbarHeight).toBe("3rem")
    expect(componentTokens.web.sheet.toolbarHeight).toBe(
      "var(--nav-bar-height)"
    )
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["sheet-toolbar-height", "3rem"])
  })
})

describe("list appearance tokens", () => {
  test("a section header is semibold everywhere but macOS, which bolds it", () => {
    expect(componentTokens.ios.list.headerFontWeight).toBe("600")
    expect(componentTokens.macos.list.headerFontWeight).toBe("700")
    expect(componentTokens.web.list.headerFontWeight).toBe("600")
  })

  test("emits kebab-case CSS variable lines", () => {
    const lines = componentLines("macos")
    expect(lines).toContainEqual(["list-header-font-weight", "700"])
  })
})
