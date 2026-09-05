import {
  backgrounds,
  css,
  fills,
  grays,
  groupedBackgrounds,
  labels,
  link,
  separators,
  systemColors,
  white,
  type Rgba,
} from "./colors.ts"
import { elevation } from "./elevation.ts"
import { materials } from "./materials.ts"
import { metrics, type ControlMetrics, type Platform } from "./metrics.ts"
import { durations, easings, springs } from "./motion.ts"
import { radii } from "./radii.ts"
import { iosTextStyles, macosTextStyles, type TextStyle } from "./typography.ts"

/**
 * Renders `src/styles/tokens.css` from the token modules. The output is committed and a test
 * regenerates it, so the file can never drift from the data. Structure:
 *
 *   :root                       light primitives, semantic aliases, type, controls, shape, motion
 *   @media (width >= 414px)     the wider layout margin
 *   .dark                       dark primitives and aliases
 *   .dark [data-elevated]       raised dark backgrounds (sheets, popovers)
 *   prefers-contrast / [data-contrast="more"]   accessible colours, light and dark
 *   [data-platform="macos"]     macOS type scale and control metrics
 *   @supports -apple-system-body   Dynamic Type drives the pt unit on iOS
 *
 * Semantic aliases (`--background: var(--background-1)`) are repeated in every scope that
 * overrides a primitive: a custom property resolves `var()` where it is declared, so an alias
 * declared only on :root would keep :root's value under a descendant override.
 */

type Line = readonly [name: string, value: string]

const px = (n: number) => `${n}px`
const pt = (n: number) => `calc(${n} * var(--pt))`

function block(selector: string, lines: readonly Line[], indent = ""): string {
  const body = lines.map(([n, v]) => `${indent}  --${n}: ${v};`).join("\n")
  return `${indent}${selector} {\n${body}\n${indent}}`
}

type Appearance = "light" | "dark"

function primitives(appearance: Appearance): Line[] {
  const pick = (c: { light: Rgba; dark: Rgba }) => css(c[appearance])
  const lines: Line[] = []
  for (const s of systemColors) lines.push([`system-${s.name}`, pick(s)])
  for (const g of grays) lines.push([g.name, pick(g)])
  for (const [name, v] of Object.entries(labels)) lines.push([name, pick(v)])
  for (const [name, v] of Object.entries(fills)) lines.push([name, pick(v)])
  lines.push(["background-1", pick(backgrounds.background)])
  lines.push(["background-2", pick(backgrounds["background-2"])])
  lines.push(["background-3", pick(backgrounds["background-3"])])
  lines.push([
    "grouped-background-1",
    pick(groupedBackgrounds["grouped-background"]),
  ])
  lines.push([
    "grouped-background-2",
    pick(groupedBackgrounds["grouped-background-2"]),
  ])
  lines.push([
    "grouped-background-3",
    pick(groupedBackgrounds["grouped-background-3"]),
  ])
  for (const [name, v] of Object.entries(separators))
    lines.push([name, pick(v)])
  lines.push(["link", pick(link)])
  lines.push(["white", css(white)])
  return lines
}

function accessiblePrimitives(appearance: Appearance): Line[] {
  const key = appearance === "light" ? "lightAccessible" : "darkAccessible"
  const lines: Line[] = []
  for (const s of systemColors) lines.push([`system-${s.name}`, css(s[key])])
  for (const g of grays) lines.push([g.name, css(g[key])])
  return lines
}

function elevatedPrimitives(): Line[] {
  return [
    ["background-1", css(backgrounds.background.darkElevated)],
    ["background-2", css(backgrounds["background-2"].darkElevated)],
    ["background-3", css(backgrounds["background-3"].darkElevated)],
    [
      "grouped-background-1",
      css(groupedBackgrounds["grouped-background"].darkElevated),
    ],
    [
      "grouped-background-2",
      css(groupedBackgrounds["grouped-background-2"].darkElevated),
    ],
    [
      "grouped-background-3",
      css(groupedBackgrounds["grouped-background-3"].darkElevated),
    ],
  ]
}

/** shadcn's vocabulary, mapped onto Apple's roles (spec §5.3). */
function semanticAliases(appearance: Appearance): Line[] {
  return [
    ["background", "var(--background-1)"],
    ["foreground", "var(--label)"],
    ["card", "var(--grouped-background-2)"],
    ["card-foreground", "var(--label)"],
    [
      "popover",
      appearance === "dark" ? "var(--background-2)" : "var(--background-1)",
    ],
    ["popover-foreground", "var(--label)"],
    ["primary", "var(--system-blue)"],
    ["primary-foreground", "var(--white)"],
    ["secondary", "var(--fill-3)"],
    ["secondary-foreground", "var(--label)"],
    ["muted", "var(--background-2)"],
    ["muted-foreground", "var(--label-2)"],
    ["accent", "var(--fill-4)"],
    ["accent-foreground", "var(--label)"],
    ["destructive", "var(--system-red)"],
    ["border", "var(--separator)"],
    ["input", "var(--fill-3)"],
    ["ring", "var(--system-blue)"],
    ["chart-1", "var(--system-blue)"],
    ["chart-2", "var(--system-green)"],
    ["chart-3", "var(--system-orange)"],
    ["chart-4", "var(--system-purple)"],
    ["chart-5", "var(--system-red)"],
    ["sidebar", "var(--grouped-background-1)"],
    ["sidebar-foreground", "var(--label)"],
    ["sidebar-primary", "var(--system-blue)"],
    ["sidebar-primary-foreground", "var(--white)"],
    ["sidebar-accent", "var(--fill-3)"],
    ["sidebar-accent-foreground", "var(--label)"],
    ["sidebar-border", "var(--separator)"],
    ["sidebar-ring", "var(--system-blue)"],
  ]
}

function typeLines(styles: readonly TextStyle[]): Line[] {
  const lines: Line[] = []
  for (const s of styles) {
    lines.push([`type-${s.name}-size`, pt(s.size)])
    lines.push([`type-${s.name}-leading`, pt(s.leading)])
    lines.push([`type-${s.name}-weight`, String(s.weight)])
    lines.push([`type-${s.name}-emphasized`, String(s.emphasized)])
  }
  return lines
}

function controlLines(m: ControlMetrics): Line[] {
  return [
    ["control-height-mini", px(m.buttonHeight.mini)],
    ["control-height-small", px(m.buttonHeight.small)],
    ["control-height-regular", px(m.buttonHeight.regular)],
    ["control-height-large", px(m.buttonHeight.large)],
    ["control-height-xl", px(m.buttonHeight.xl)],
    ["switch-width", px(m.switch.width)],
    ["switch-height", px(m.switch.height)],
    ["switch-thumb", px(m.switch.thumb)],
    ["checkbox-size", px(m.checkbox.size)],
    ["radio-size", px(m.radio.size)],
    ["radio-dot", px(m.radio.dot)],
    ["slider-track", px(m.slider.track)],
    ["slider-thumb", px(m.slider.thumb)],
    ["stepper-width", px(m.stepper.width)],
    ["stepper-height", px(m.stepper.height)],
    ["segmented-height", px(m.segmented.height)],
    ["segmented-inset", px(m.segmented.inset)],
    ["text-field-height", px(m.textField.height)],
    ["search-field-height", px(m.searchField.height)],
    ["list-inset", px(m.list.inset)],
    ["list-radius", px(m.list.radius)],
    ["list-row-min-height", px(m.list.rowMinHeight)],
    ["list-row-padding-y", px(m.list.rowPaddingY)],
    ["list-row-padding-x", px(m.list.rowPaddingX)],
    ["list-icon-tile", px(m.list.iconTile)],
    ["nav-bar-height", px(m.navBar.height)],
    ["nav-bar-large-title", px(m.navBar.largeTitle)],
    ["tab-bar-height", px(m.tabBar.height)],
    ["tab-bar-inset", px(m.tabBar.inset)],
    ["toolbar-height", px(m.toolbar.height)],
    ["sheet-grabber-width", px(m.sheet.grabber[0])],
    ["sheet-grabber-height", px(m.sheet.grabber[1])],
    ["sheet-scrim", String(m.sheet.scrim)],
    ["alert-width", px(m.alert.width)],
    ["alert-button-height", px(m.alert.buttonHeight)],
    ["action-sheet-row-height", px(m.actionSheet.rowHeight)],
    ["action-sheet-cancel-gap", px(m.actionSheet.cancelGap)],
    ["menu-width", px(m.menu.width)],
    ["menu-item-height", px(m.menu.itemHeight)],
    ["dialog-width", px(m.dialog.width)],
    ["split-view-sidebar-width", px(m.splitView.sidebar)],
    ["split-view-content-width", px(m.splitView.content)],
    ["popover-arrow-width", px(m.popover.arrow[0])],
    ["popover-arrow-height", px(m.popover.arrow[1])],
    ["progress-height", px(m.progress.height)],
    ["spinner-medium", px(m.spinner.medium)],
    ["spinner-large", px(m.spinner.large)],
    ["badge-height", px(m.badge.height)],
    ["badge-min-width", px(m.badge.minWidth)],
    ["page-control-dot", px(m.pageControl.dot)],
    ["page-control-gap", px(m.pageControl.gap)],
    ["hit-target", px(m.hitTarget.default)],
    ["hit-target-min", px(m.hitTarget.minimum)],
  ]
}

function shapeLines(): Line[] {
  return [
    ["radius", `${radii.base / 16}rem`],
    // `--radius-*`, `--shadow-*` and `--ease-*` are Tailwind theme namespaces; globals.css bridges
    // these primitives into them, so the primitives carry different names to avoid a cycle.
    ["sheet-radius", px(radii.sheet)],
    ["icon-radius", radii.icon],
  ]
}

function motionLines(): Line[] {
  return [
    ["easing-standard", easings.standard],
    ["easing-sheet", easings.sheet],
    ["easing-nav", easings.nav],
    ["spring-smooth", springs.smooth],
    ["spring-snappy", springs.snappy],
    ["spring-bouncy", springs.bouncy],
    ["duration-press", `${durations.press}ms`],
    ["duration-hover", `${durations.hover}ms`],
    ["duration-overlay", `${durations.overlay}ms`],
    ["duration-nav", `${durations.nav}ms`],
    ["duration-sheet", `${durations.sheet}ms`],
  ]
}

function elevationLines(): Line[] {
  const toKebab = (s: string) =>
    s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  return Object.entries(elevation).map(([name, value]) => [
    `elevation-${toKebab(name)}`,
    value,
  ])
}

function materialLines(appearance: Appearance): Line[] {
  const lines: Line[] = []
  for (const [name, m] of Object.entries(materials)) {
    lines.push([`material-${name}-bg`, css(m[appearance])])
    if (appearance === "light") {
      lines.push([`material-${name}-blur`, px(m.blur)])
      lines.push([`material-${name}-saturate`, String(m.saturate)])
    }
  }
  return lines
}

const platformLines = (platform: Platform): Line[] => [
  ...typeLines(platform === "ios" ? iosTextStyles : macosTextStyles),
  ...controlLines(metrics[platform]),
]

/** The variables of one appearance as a flat map (no `--`), for the registry's style item. */
export function tokenVars(appearance: Appearance): Record<string, string> {
  const lines: Line[] =
    appearance === "light"
      ? [
          ["pt", "0.0625rem"],
          ...primitives("light"),
          ...semanticAliases("light"),
          ...shapeLines(),
          ...platformLines("ios"),
          ...motionLines(),
          ...elevationLines(),
          ...materialLines("light"),
        ]
      : [
          ...primitives("dark"),
          ...semanticAliases("dark"),
          ...materialLines("dark"),
        ]
  return Object.fromEntries(lines)
}

export function renderTokensCss(): string {
  const parts: string[] = []
  parts.push(
    "/* Generated by scripts/build-css.ts from src/tokens — edit the token modules, then run `pnpm tokens:build`. */"
  )

  parts.push(
    block(":root", [
      ["pt", "0.0625rem"],
      ...primitives("light"),
      ...semanticAliases("light"),
      ...shapeLines(),
      ...platformLines("ios"),
      ...motionLines(),
      ...elevationLines(),
      ...materialLines("light"),
    ])
  )
  parts.push(
    `@media (width >= 414px) {\n${block(":root", [["list-inset", px(metrics.ios.list.insetWide)]], "  ")}\n}`
  )

  parts.push(
    block(".dark", [
      ...primitives("dark"),
      ...semanticAliases("dark"),
      ...materialLines("dark"),
    ])
  )
  parts.push(
    block(".dark [data-elevated]", [
      ...elevatedPrimitives(),
      ...semanticAliases("dark"),
    ])
  )

  const contrastLight = [
    ...accessiblePrimitives("light"),
    ...semanticAliases("light"),
  ]
  const contrastDark = [
    ...accessiblePrimitives("dark"),
    ...semanticAliases("dark"),
  ]
  parts.push(
    `@media (prefers-contrast: more) {\n${block(":root", contrastLight, "  ")}\n${block(".dark", contrastDark, "  ")}\n}`
  )
  parts.push(block('[data-contrast="more"]', contrastLight))
  parts.push(block('.dark [data-contrast="more"]', contrastDark))

  parts.push(block('[data-platform="macos"]', platformLines("macos")))

  parts.push(
    `@supports (font: -apple-system-body) and (-webkit-touch-callout: none) {\n${block(":root", [["pt", "calc(1rem / 17)"]], "  ")}\n}`
  )

  return parts.join("\n\n") + "\n"
}
