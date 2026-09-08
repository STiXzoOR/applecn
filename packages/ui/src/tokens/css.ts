import {
  backgrounds,
  css,
  fills,
  grays,
  groupedBackgrounds,
  labels,
  link,
  platformColors,
  separators,
  systemColors,
  white,
  type Adaptive,
  type PlatformColors,
  type Rgba,
} from "./colors.ts"
import { componentLines } from "./components.ts"
import { elevation, type AdaptiveShadow } from "./elevation.ts"
import { materials } from "./materials.ts"
import {
  metrics,
  platforms,
  type ControlMetrics,
  type Platform,
} from "./metrics.ts"
import { durations, easings, springs } from "./motion.ts"
import { radii } from "./radii.ts"
import {
  iosTextStyles,
  macosTextStyles,
  webTextStyles,
  type TextStyle,
} from "./typography.ts"

/**
 * Renders `src/styles/tokens.css` from the token modules. The output is committed and a test
 * regenerates it, so the file can never drift from the data. Structure:
 *
 *   :root                       light primitives, semantic aliases; iOS type, controls, shape; motion
 *   @media (width >= 414px)     the wider iOS layout margin
 *   .dark                       dark primitives and aliases
 *   .dark [data-elevated]       raised dark backgrounds (sheets, popovers)
 *   prefers-contrast / [data-contrast="more"]   accessible colours, light and dark
 *   [data-platform="ios"]       the iOS type, controls and shape again (so a nested iOS
 *                               provider resets a macOS or web ancestor)
 *   [data-platform="macos"]     AppKit colours (light), type scale, control metrics, shape
 *   .dark[data-platform="macos"], .dark [data-platform="macos"]   AppKit colours (dark)
 *   [data-platform="web"]       apple.com colours, type (with its breakpoints), controls, shape
 *   @supports -apple-system-body   Dynamic Type drives the pt unit on iOS
 *
 * Semantic aliases (`--background: var(--background-1)`) are repeated in every scope that
 * overrides a primitive: a custom property resolves `var()` where it is declared, so an alias
 * declared only on :root would keep :root's value under a descendant override.
 */

type Line = readonly [name: string, value: string]

const px = (n: number) => `${n}px`
const pt = (n: number) => `calc(${n} * var(--pt))`
const em = (n: number) => (n === 0 ? "0" : `${n}em`)

function block(selector: string, lines: readonly Line[], indent = ""): string {
  const body = lines.map(([n, v]) => `${indent}  --${n}: ${v};`).join("\n")
  return `${indent}${selector} {\n${body}\n${indent}}`
}

type Appearance = "light" | "dark"

const pickAppearance = (c: Adaptive, appearance: Appearance) =>
  css(c[appearance])

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
  lines.push(["accent-color", "var(--system-blue)"])
  lines.push(["selection", "var(--system-blue)"])
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

/**
 * The iOS values of every role a platform can override, so a nested iOS provider inside a
 * macOS or web one gets Apple's baseline colours back rather than inheriting the ancestor's.
 */
const iosColors: PlatformColors = {
  label: labels.label,
  "label-2": labels["label-2"],
  "label-3": labels["label-3"],
  "label-4": labels["label-4"],
  placeholder: labels.placeholder,
  fill: fills.fill,
  "fill-2": fills["fill-2"],
  "fill-3": fills["fill-3"],
  "fill-4": fills["fill-4"],
  "background-1": backgrounds.background,
  "background-2": backgrounds["background-2"],
  "background-3": backgrounds["background-3"],
  "grouped-background-1": groupedBackgrounds["grouped-background"],
  "grouped-background-2": groupedBackgrounds["grouped-background-2"],
  "grouped-background-3": groupedBackgrounds["grouped-background-3"],
  separator: separators.separator,
  "separator-opaque": separators["separator-opaque"],
  link,
}

/** A platform's colour overrides for one appearance (research document §11 and §12). */
function platformColorLines(
  colors: PlatformColors,
  appearance: Appearance
): Line[] {
  const lines: Line[] = []
  for (const [name, value] of Object.entries(colors) as [
    keyof PlatformColors,
    Adaptive,
  ][]) {
    if (name === "accent")
      lines.push(["accent-color", pickAppearance(value, appearance)])
    else lines.push([name, pickAppearance(value, appearance)])
  }
  if (!colors.accent) lines.push(["accent-color", "var(--system-blue)"])
  if (!colors.selection) lines.push(["selection", "var(--system-blue)"])
  return lines
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
    ["primary", "var(--accent-color)"],
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
    ["ring", "var(--accent-color)"],
    ["chart-1", "var(--system-blue)"],
    ["chart-2", "var(--system-green)"],
    ["chart-3", "var(--system-orange)"],
    ["chart-4", "var(--system-purple)"],
    ["chart-5", "var(--system-red)"],
    ["sidebar", "var(--grouped-background-1)"],
    ["sidebar-foreground", "var(--label)"],
    ["sidebar-primary", "var(--accent-color)"],
    ["sidebar-primary-foreground", "var(--white)"],
    ["sidebar-accent", "var(--fill-3)"],
    ["sidebar-accent-foreground", "var(--label)"],
    ["sidebar-border", "var(--separator)"],
    ["sidebar-ring", "var(--accent-color)"],
  ]
}

const textStyles: Readonly<Record<Platform, readonly TextStyle[]>> = {
  ios: iosTextStyles,
  macos: macosTextStyles,
  web: webTextStyles,
}

/** The base type lines: a style's compact size where it has breakpoints, otherwise its size. */
function typeLines(styles: readonly TextStyle[]): Line[] {
  const lines: Line[] = []
  for (const s of styles) {
    const base = s.compact ?? {
      size: s.size,
      leading: s.leading,
      tracking: s.tracking ?? 0,
    }
    lines.push([`type-${s.name}-size`, pt(base.size)])
    lines.push([`type-${s.name}-leading`, pt(base.leading)])
    lines.push([`type-${s.name}-weight`, String(s.weight)])
    lines.push([`type-${s.name}-emphasized`, String(s.emphasized)])
    lines.push([`type-${s.name}-tracking`, em(base.tracking)])
  }
  return lines
}

function controlLines(m: ControlMetrics): Line[] {
  const sizes = ["mini", "small", "regular", "large", "xl"] as const
  const lines: Line[] = []
  for (const size of sizes) {
    lines.push([`control-height-${size}`, px(m.buttonHeight[size])])
    lines.push([`control-radius-${size}`, px(m.buttonRadius[size])])
    lines.push([`control-font-${size}`, pt(m.buttonFont[size])])
    lines.push([`control-padding-x-${size}`, px(m.buttonPaddingX[size])])
  }
  lines.push(
    ["switch-width", px(m.switch.width)],
    ["switch-height", px(m.switch.height)],
    ["switch-thumb-width", px(m.switch.thumbWidth)],
    ["switch-thumb-height", px(m.switch.thumbHeight)],
    ["switch-inset", px(m.switch.inset)],
    ["checkbox-size", px(m.checkbox.size)],
    ["checkbox-radius", px(m.checkbox.radius)],
    ["radio-size", px(m.radio.size)],
    ["radio-dot", px(m.radio.dot)],
    ["slider-track", px(m.slider.track)],
    ["slider-thumb-width", px(m.slider.thumbWidth)],
    ["slider-thumb-height", px(m.slider.thumbHeight)],
    ["stepper-width", px(m.stepper.width)],
    ["stepper-height", px(m.stepper.height)],
    ["stepper-radius", px(m.stepper.radius)],
    ["segmented-height", px(m.segmented.height)],
    ["segmented-inset", px(m.segmented.inset)],
    ["segmented-radius", px(m.segmented.radius)],
    ["segmented-font", pt(m.segmented.font)],
    ["text-field-height", px(m.textField.height)],
    ["text-field-radius", px(m.textField.radius)],
    ["text-field-font", pt(m.textField.font)],
    ["search-field-height", px(m.searchField.height)],
    ["search-field-radius", px(m.searchField.radius)],
    ["list-inset", px(m.list.inset)],
    ["list-radius", px(m.list.radius)],
    ["list-row-min-height", px(m.list.rowMinHeight)],
    ["list-row-padding-y", px(m.list.rowPaddingY)],
    ["list-row-padding-x", px(m.list.rowPaddingX)],
    ["list-icon-tile", px(m.list.iconTile)],
    ["list-font", pt(m.list.font)],
    ["list-subtitle-font", pt(m.list.subtitleFont)],
    ["list-header-font", pt(m.list.headerFont)],
    ["list-footer-font", pt(m.list.footerFont)],
    ["sidebar-width", px(m.sidebar.width)],
    ["sidebar-row-height", px(m.sidebar.rowHeight)],
    ["sidebar-radius", px(m.sidebar.radius)],
    ["sidebar-font", pt(m.sidebar.font)],
    ["card-radius", px(m.card.radius)],
    ["nav-bar-height", px(m.navBar.height)],
    ["nav-bar-large-title", px(m.navBar.largeTitle)],
    ["nav-bar-item", px(m.navBar.item)],
    ["nav-bar-title-font", pt(m.navBar.titleFont)],
    ["tab-bar-height", px(m.tabBar.height)],
    ["tab-bar-inset", px(m.tabBar.inset)],
    ["tab-bar-item", px(m.tabBar.item)],
    ["tab-bar-item-inset", px(m.tabBar.itemInset)],
    ["tab-bar-label", pt(m.tabBar.label)],
    ["toolbar-height", px(m.toolbar.height)],
    ["toolbar-item", px(m.toolbar.item)],
    ["toolbar-inset", px(m.toolbar.inset)],
    ["sheet-grabber-width", px(m.sheet.grabber[0])],
    ["sheet-grabber-height", px(m.sheet.grabber[1])],
    ["sheet-scrim", String(m.sheet.scrim)],
    ["alert-width", px(m.alert.width)],
    ["alert-radius", px(m.alert.radius)],
    ["alert-button-height", px(m.alert.buttonHeight)],
    ["alert-button-inset", px(m.alert.buttonInset)],
    ["alert-button-gap", px(m.alert.buttonGap)],
    ["alert-title-font", pt(m.alert.titleFont)],
    ["alert-message-font", pt(m.alert.messageFont)],
    ["action-sheet-width", px(m.actionSheet.width)],
    ["action-sheet-row-height", px(m.actionSheet.rowHeight)],
    ["action-sheet-radius", px(m.actionSheet.radius)],
    ["action-sheet-inset", px(m.actionSheet.inset)],
    ["action-sheet-gap", px(m.actionSheet.gap)],
    ["menu-width", px(m.menu.width)],
    ["menu-item-height", px(m.menu.itemHeight)],
    ["menu-radius", px(m.menu.radius)],
    ["menu-item-radius", px(m.menu.itemRadius)],
    ["menu-padding", px(m.menu.padding)],
    ["menu-font", pt(m.menu.font)],
    ["menu-bar-height", px(m.menuBar.height)],
    ["dialog-width", px(m.dialog.width)],
    ["dialog-radius", px(m.dialog.radius)],
    ["split-view-sidebar-width", px(m.splitView.sidebar)],
    ["split-view-content-width", px(m.splitView.content)],
    ["popover-radius", px(m.popover.radius)],
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
    ["window-title-bar", px(m.window?.titleBar ?? 0)],
    ["window-radius", px(m.window?.radius ?? 0)],
    ["window-traffic-light", px(m.window?.trafficLight ?? 0)]
  )
  return lines
}

function shapeLines(platform: Platform): Line[] {
  const r = radii[platform]
  return [
    ["radius", `${radii.base / 16}rem`],
    // `--radius-*`, `--shadow-*` and `--ease-*` are Tailwind theme namespaces; globals.css bridges
    // these primitives into them, so the primitives carry different names to avoid a cycle.
    ["sheet-radius", px(r.sheet)],
    ["icon-radius", radii.icon],
    ...Object.entries(r.ladder).map(([step, value]): Line => [
      `corner-${step}`,
      px(value),
    ]),
  ]
}

function motionLines(): Line[] {
  return [
    ["easing-standard", easings.standard],
    ["easing-sheet", easings.sheet],
    ["easing-nav", easings.nav],
    ["easing-transform", easings.transform],
    ["easing-menu", easings.menu],
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

function elevationLines(appearance: Appearance, onlyAdaptive = false): Line[] {
  const toKebab = (s: string) =>
    s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  const lines: Line[] = []
  for (const [name, value] of Object.entries(elevation) as [
    string,
    string | AdaptiveShadow,
  ][]) {
    if (typeof value === "string") {
      if (!onlyAdaptive) lines.push([`elevation-${toKebab(name)}`, value])
    } else {
      lines.push([`elevation-${toKebab(name)}`, value[appearance]])
    }
  }
  return lines
}

function materialLines(appearance: Appearance): Line[] {
  const lines: Line[] = []
  for (const [name, m] of Object.entries(materials)) {
    lines.push([`material-${name}-bg`, css(m[appearance])])
    lines.push([`material-${name}-fallback`, css(m.fallback[appearance])])
    if (appearance === "light") {
      lines.push([`material-${name}-blur`, px(m.blur)])
      lines.push([`material-${name}-saturate`, String(m.saturate)])
    }
  }
  return lines
}

/** Everything that changes with the platform and not the appearance. */
const platformLines = (platform: Platform): Line[] => [
  // Read by tokens.css under each `[data-platform]`, so the nearest provider wins even when
  // providers nest.
  ["platform", platform],
  ...shapeLines(platform),
  ...typeLines(textStyles[platform]),
  ...controlLines(metrics[platform]),
]

/**
 * One scope of the stylesheet: a selector, its declarations, and the at-rule it sits inside.
 * `renderTokensCss()` and the registry's `css` objects are both generated from these, so a
 * scope cannot exist in the committed stylesheet without also reaching a consumer — the class
 * of defect where `globals.css`/`tokens.css` has something the registry never delivers.
 */
interface Scope {
  readonly at?: string
  readonly selector: string
  readonly lines: readonly Line[]
}

/**
 * Every scope that is not platform-specific, in stylesheet order. `:root` and `.dark` reach a
 * consumer as `cssVars.light`/`cssVars.dark`, which is how shadcn writes those two selectors;
 * `tokenBaseCss()` ships the rest as `css` keys. The `@supports` scope is separate because
 * tokens.css emits it last, after the platform scopes.
 */
function baseScopes(): Scope[] {
  const contrastLight = [
    ...accessiblePrimitives("light"),
    ...semanticAliases("light"),
  ]
  const contrastDark = [
    ...accessiblePrimitives("dark"),
    ...semanticAliases("dark"),
  ]
  return [
    {
      selector: ":root",
      lines: [
        ["pt", "0.0625rem"],
        ...primitives("light"),
        ...semanticAliases("light"),
        ...platformLines("ios"),
        ...motionLines(),
        ...elevationLines("light"),
        ...materialLines("light"),
      ],
    },
    {
      at: "@media (width >= 414px)",
      selector: ":root",
      lines: [["list-inset", px(metrics.ios.list.insetWide)]],
    },
    {
      selector: ".dark",
      lines: [
        ...primitives("dark"),
        ...semanticAliases("dark"),
        ...elevationLines("dark", true),
        ...materialLines("dark"),
      ],
    },
    {
      selector: ".dark [data-elevated]",
      lines: [...elevatedPrimitives(), ...semanticAliases("dark")],
    },
    {
      at: "@media (prefers-contrast: more)",
      selector: ":root",
      lines: contrastLight,
    },
    {
      at: "@media (prefers-contrast: more)",
      selector: ".dark",
      lines: contrastDark,
    },
    { selector: '[data-contrast="more"]', lines: contrastLight },
    { selector: '.dark [data-contrast="more"]', lines: contrastDark },
  ]
}

/**
 * Dynamic Type's other half. `globals.css`'s `@layer base` sets the root font to
 * `-apple-system-body` under the same query; this re-derives the `pt` unit from that root, so
 * the 180 `calc(N * var(--pt))` type tokens keep their measured size. Ship one without the
 * other and every one of them renders 17/16 = 6.25% oversized on iOS Safari.
 */
const dynamicTypeScope: Scope = {
  at: "@supports (font: -apple-system-body) and (-webkit-touch-callout: none)",
  selector: ":root",
  lines: [["pt", "calc(1rem / 17)"]],
}

/** One idiom's scopes, in stylesheet order. */
function platformScopes(platform: Platform): Scope[] {
  const selector = platformSelector(platform)
  const colors = platform === "ios" ? iosColors : platformColors[platform]
  const scopes: Scope[] = [
    {
      selector,
      lines: [
        ...platformColorLines(colors, "light"),
        ...semanticAliases("light"),
        ...platformLines(platform),
        ...componentLines(platform),
      ],
    },
  ]
  // The wide-phone layout margin: iPhone Plus/Pro Max class devices inset a grouped list by
  // 20 pt rather than 16 (research document §layout).
  if (platform === "ios")
    scopes.push({
      at: "@media (width >= 414px)",
      selector,
      lines: [["list-inset", px(metrics.ios.list.insetWide)]],
    })
  scopes.push({
    selector: darkPlatformSelector(platform),
    lines: [...platformColorLines(colors, "dark"), ...semanticAliases("dark")],
  })
  const byBreakpoint = new Map<number, Line[]>()
  for (const s of textStyles[platform]) {
    for (const step of s.responsive ?? []) {
      const lines = byBreakpoint.get(step.minWidth) ?? []
      lines.push([`type-${s.name}-size`, pt(step.size)])
      lines.push([`type-${s.name}-leading`, pt(step.leading)])
      lines.push([`type-${s.name}-tracking`, em(step.tracking)])
      byBreakpoint.set(step.minWidth, lines)
    }
  }
  for (const [minWidth, lines] of [...byBreakpoint.entries()].sort(
    (a, b) => a[0] - b[0]
  ))
    scopes.push({ at: `@media (width >= ${minWidth}px)`, selector, lines })
  return scopes
}

/** Renders scopes to CSS text, merging a run that shares one at-rule into a single block. */
function renderScopes(scopes: readonly Scope[]): string[] {
  const parts: string[] = []
  let i = 0
  while (i < scopes.length) {
    const scope = scopes[i]!
    if (!scope.at) {
      parts.push(block(scope.selector, scope.lines))
      i++
      continue
    }
    const run: Scope[] = []
    while (i < scopes.length && scopes[i]!.at === scope.at)
      run.push(scopes[i++]!)
    const body = run.map((s) => block(s.selector, s.lines, "  ")).join("\n")
    parts.push(`${scope.at} {\n${body}\n}`)
  }
  return parts
}

/** Scopes as the nested object the registry's `css` field takes; keys are single-line. */
function scopeObject(scopes: readonly Scope[]): Record<string, unknown> {
  const declarations = (lines: readonly Line[]) =>
    Object.fromEntries(lines.map(([n, v]) => [`--${n}`, v]))
  const out: Record<string, unknown> = {}
  for (const scope of scopes) {
    const selector = scope.selector.replace(",\n", ", ")
    if (!scope.at)
      out[selector] = {
        ...(out[selector] as object),
        ...declarations(scope.lines),
      }
    else
      out[scope.at] = {
        ...(out[scope.at] as object),
        [selector]: declarations(scope.lines),
      }
  }
  return out
}

/** The variables of one appearance as a flat map (no `--`), for the registry's style item. */
export function tokenVars(appearance: Appearance): Record<string, string> {
  const lines: Line[] =
    appearance === "light"
      ? [
          ["pt", "0.0625rem"],
          ...primitives("light"),
          ...semanticAliases("light"),
          ...platformLines("ios"),
          ...motionLines(),
          ...elevationLines("light"),
          ...materialLines("light"),
        ]
      : [
          ...primitives("dark"),
          ...semanticAliases("dark"),
          ...elevationLines("dark", true),
          ...materialLines("dark"),
        ]
  return Object.fromEntries(lines)
}

const platformSelector = (platform: Platform) => `[data-platform="${platform}"]`
const darkPlatformSelector = (platform: Platform) =>
  `.dark${platformSelector(platform)},\n.dark ${platformSelector(platform)}`

export function renderTokensCss(): string {
  return (
    [
      "/* Generated by scripts/build-css.ts from src/tokens — edit the token modules, then run `pnpm tokens:build`. */",
      ...renderScopes([
        ...baseScopes(),
        ...platforms.flatMap(platformScopes),
        dynamicTypeScope,
      ]),
    ].join("\n\n") + "\n"
  )
}

/**
 * The scopes `base` ships as `css`: everything `renderTokensCss()` writes outside a
 * `[data-platform]` scope, less `:root` and `.dark` themselves, which travel as
 * `cssVars.light`/`cssVars.dark`. Without these a consumer loses the wide-phone list inset,
 * the raised dark backgrounds sheets and menus read through `[data-elevated]`, the whole
 * increased-contrast colour set, and Dynamic Type's `--pt` re-derivation.
 */
export function tokenBaseCss(): Record<string, unknown> {
  return scopeObject([
    ...baseScopes().filter(
      (s) => s.at || (s.selector !== ":root" && s.selector !== ".dark")
    ),
    dynamicTypeScope,
  ])
}

/**
 * The platform scopes as a nested object for the registry's style item (`css`), so a project
 * that installs the theme can switch idioms with `data-platform` the way the site does. Keys
 * are selectors or at-rules; values are declarations with their `--` prefix.
 *
 * Pass a single `only` platform to generate just that idiom's scope (for the installable
 * theme items) rather than filtering the combined output after the fact — web's `@media`
 * breakpoints are keyed at the top level with the platform selector nested inside, so
 * filtering by top-level key would either lose web's responsive type ramp or leak
 * `[data-platform="web"]` into the ios/macos themes, depending on which way it filtered.
 */
export function tokenPlatformCss(only?: Platform): Record<string, unknown> {
  return scopeObject((only ? [only] : platforms).flatMap(platformScopes))
}
