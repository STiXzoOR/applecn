// oxlint-disable vitest/no-conditional-expect -- the control table below is a capability table:
// only some controls have an indicator, a resting attribute or a disabled state, and the branches
// are decided by that static fixture data rather than by anything that happens at run time.
import { readFileSync } from "node:fs"
import { join } from "node:path"

import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactElement } from "react"
import { describe, expect, test } from "vitest"

import { Home01Icon } from "@hugeicons/core-free-icons"

import { Calendar, CalendarDayButton } from "../src/components/calendar"
import { Checkbox } from "../src/components/checkbox"
import { Command, CommandItem, CommandList } from "../src/components/command"
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../src/components/combobox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "../src/components/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../src/components/dropdown-menu"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from "../src/components/menubar"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../src/components/navigation-menu"
import { PageControl } from "../src/components/page-control"
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../src/components/select"
import {
  SidebarItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "../src/components/sidebar"
import { Switch } from "../src/components/switch"
import { TabBar, TabBarItem } from "../src/components/tab-bar"
import { Table, TableBody, TableCell, TableRow } from "../src/components/table"
import { Tabs, TabsList, TabsPanel, TabsTab } from "../src/components/tabs"
import { Toggle } from "../src/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "../src/components/toggle-group"
import { PlatformProvider, type Platform } from "../src/lib/platform"
import { tokenBaseCss, tokenPlatformCss, tokenVars } from "../src/tokens/css"

/**
 * The Apple-fidelity gate (spec §7.2). jsdom has no layout, so it asserts at the two layers that
 * do carry the information there — the intent a class string declares, and the token values those
 * classes resolve to on each idiom. Task 14's browser pass covers measured geometry.
 *
 * What it does NOT do, and why (ruling R16): the plan asked for `expect(on).not.toBe(off)` over a
 * checked and an unchecked render's `className`. A control's class list is one static `cn(...)`
 * string carrying the checked rule and the resting rule together; Base UI toggles the data
 * ATTRIBUTE, not the class list, so the two renders are character-identical and that assertion can
 * never fail. The attribute difference is asserted on the DOM instead, and the paint difference at
 * the two layers below.
 *
 * The §4.5 bug — a checked checkbox and a selected radio invisible on the web idiom, shipped with
 * 277 tests green — is caught here twice: once because the resting and selected rules would declare
 * the same value, and once because they would resolve, through the real variable cascade, to the
 * same colour. The second is the live risk now that the platform variants are gone: nothing stops a
 * token being given the paint its own selected state uses, under a different alias.
 */

const IDIOMS: readonly Platform[] = ["ios", "macos", "web"]

/**
 * The cascade contexts a control is actually rendered in. `tokens.css` emits seven scopes, not
 * four: alongside `:root`, `.dark` and the two platform scopes it writes `.dark [data-elevated]`
 * (the raised backgrounds a sheet or a menu reads through), `[data-contrast="more"]` and
 * `.dark [data-contrast="more"]`. §4.5 was itself a cascade collision, so a collision that only
 * appears inside a dark popover, or under increased contrast, is the same class of bug in a
 * lower-frequency place. Each environment below is one real combination of those scopes.
 */
interface Environment {
  readonly name: string
  readonly appearance: "light" | "dark"
  readonly elevated?: boolean
  readonly contrast?: boolean
}

const ENVIRONMENTS: readonly Environment[] = [
  { name: "light", appearance: "light" },
  { name: "light/contrast", appearance: "light", contrast: true },
  { name: "dark", appearance: "dark" },
  { name: "dark/elevated", appearance: "dark", elevated: true },
  { name: "dark/contrast", appearance: "dark", contrast: true },
]

/**
 * `--color-x: var(--y)` from `globals.css`'s `@theme inline` block: how a colour utility's name
 * (`bg-primary`) reaches the token it paints (`var(--primary)`). Read from the stylesheet rather
 * than hardcoded, so a renamed or dropped mapping surfaces here as an unresolvable utility.
 */
const themeColors = new Map<string, string>()
for (const [, name, value] of readFileSync(
  join(import.meta.dirname, "../src/styles/globals.css"),
  "utf8"
).matchAll(/--color-([\w-]+):\s*(var\(--[\w-]+\));/g))
  themeColors.set(name!, value!)

const withoutPrefix = (declarations: Record<string, string>) =>
  Object.entries(declarations).map(
    ([name, value]) => [name.replace(/^--/, ""), value] as const
  )

const baseCss = tokenBaseCss() as Record<string, Record<string, string>>

/**
 * Every custom property in scope for an element under one idiom and one environment, resolved the
 * way a browser would: layers sorted by selector weight first and by emission order only to break
 * a tie. Modelling the weight matters — `.dark [data-elevated]` is (0,2,0) and outranks
 * `[data-platform="ios"]`'s (0,1,0) however late the platform scope is written, while
 * `.dark [data-platform="ios"]` matches it on weight and wins on order. A flat last-one-wins map
 * gets the first of those two backwards.
 *
 * Composed from the token modules rather than parsed from the generated stylesheet, so it cannot
 * drift from what a consumer installs.
 */
function variableMap(
  platform: Platform,
  environment: Environment
): ReadonlyMap<string, string> {
  const scopes = tokenPlatformCss(platform) as Record<
    string,
    Record<string, string>
  >
  const light = scopes[`[data-platform="${platform}"]`]
  const dark = Object.entries(scopes).find(([selector]) =>
    selector.startsWith(".dark")
  )?.[1]
  expect(light, `${platform} has a light scope`).toBeDefined()
  expect(dark, `${platform} has a dark scope`).toBeDefined()

  const isDark = environment.appearance === "dark"
  // [weight, emission order, declarations] — the order `tokens.css` writes these scopes in.
  const layers: [number, number, Iterable<readonly [string, string]>][] = [
    [0, 0, Object.entries(tokenVars("light"))],
  ]
  if (isDark) layers.push([1, 1, Object.entries(tokenVars("dark"))])
  if (isDark && environment.elevated)
    layers.push([2, 2, withoutPrefix(baseCss[".dark [data-elevated]"]!)])
  if (environment.contrast) {
    layers.push([1, 3, withoutPrefix(baseCss['[data-contrast="more"]']!)])
    if (isDark)
      layers.push([
        2,
        4,
        withoutPrefix(baseCss['.dark [data-contrast="more"]']!),
      ])
  }
  layers.push([1, 5, withoutPrefix(light!)])
  if (isDark) layers.push([2, 6, withoutPrefix(dark!)])

  const vars = new Map<string, string>()
  for (const [, , entries] of layers.sort((a, b) => a[0] - b[0] || a[1] - b[1]))
    for (const [name, value] of entries) vars.set(name, value)
  return vars
}

const VAR = /^var\(--([\w-]+)\)$/

/** Follows a `var(--x)` chain to the literal it ends at, on one idiom's variable map. */
function resolve(value: string, vars: ReadonlyMap<string, string>): string {
  const seen = new Set<string>()
  let current = value.trim()
  for (let match = VAR.exec(current); match; match = VAR.exec(current)) {
    const name = match[1]!
    expect(seen.has(name), `--${name} resolves without a cycle`).toBe(false)
    seen.add(name)
    const next = vars.get(name)
    // A token that dereferences a variable the stylesheet never delivers renders as nothing —
    // the shape of the install defect Task 11 found in the registry's base layer.
    expect(next, `--${name} is delivered by the token scopes`).toBeDefined()
    current = next!.trim()
  }
  return current
}

/** Splits `data-checked:bg-(--x)` into its modifiers and its utility, on top-level colons only. */
function splitModifiers(token: string): {
  modifiers: string[]
  utility: string
} {
  const parts: string[] = []
  let depth = 0
  let buffer = ""
  for (const character of token) {
    if (character === "[" || character === "(") depth++
    else if (character === "]" || character === ")") depth--
    if (character === ":" && depth === 0) {
      parts.push(buffer)
      buffer = ""
    } else buffer += character
  }
  parts.push(buffer)
  return { modifiers: parts.slice(0, -1), utility: parts.at(-1)! }
}

/**
 * A colour a utility paints, with its opacity modifier. The alpha is carried rather than dropped
 * because it is the whole difference between a `toggle`'s 15%-tint fill and the full-tint label
 * sitting on it: same token, two very different paints.
 */
interface Paint {
  readonly value: string
  readonly alpha: number
}

/** Colour keywords Tailwind writes literally. `current`/`inherit` name no colour of their own. */
const LITERALS: Record<string, string | null> = {
  white: "#fff",
  black: "#000",
  transparent: "transparent",
  current: null,
  inherit: null,
}

/** The CSS value a colour utility paints, or null when it is not one we can resolve. */
function paint(utility: string): Paint | null {
  const opacity = /\/(\d+(?:\.\d+)?)$/.exec(utility)
  const alpha = opacity ? Number(opacity[1]) / 100 : 1
  const bare = opacity ? utility.slice(0, opacity.index) : utility
  const arbitrary = /^(?:bg|border|text)-\((--[\w-]+)\)$/.exec(bare)
  if (arbitrary) return { value: `var(${arbitrary[1]})`, alpha }
  const named = /^(?:bg|border|text)-([a-z][\w-]*)$/.exec(bare)
  if (!named) return null
  const themed = themeColors.get(named[1]!)
  if (themed) return { value: themed, alpha }
  const literal = LITERALS[named[1]!]
  return literal ? { value: literal, alpha } : null
}

/** The property a colour utility writes. */
function property(utility: string): string | null {
  if (utility.startsWith("bg-")) return "background-color"
  if (utility.startsWith("border-")) return "border-color"
  if (utility.startsWith("text-")) return "color"
  return null
}

/**
 * Which attributes name a control's two halves. `off` is optional on purpose: Base UI's Toggle
 * emits `data-pressed` when pressed and NOTHING when it is not — `ToggleDataAttributes` exports
 * `pressed` and `disabled`, with no `unpressed` twin. The first version of this harness hardcoded
 * `RESTING = "data-unchecked"`, which is why `toggle` and `toggle-group` had to be exempted from
 * its own coverage guard. That was a limit of this file, not of the primitive, and spec §5.3 folded
 * `segmented-control` — the sliding indicator and all — into `toggle-group`, so the exemption
 * would have swallowed the one component §5.3 rebuilds. A resting state is now allowed to be *the
 * absence of the selected attribute*, and the resting paint is then read off the cascade the way a
 * browser reads it: the element's own unmodified background, or the nearest ancestor's.
 */
interface State {
  readonly on: string
  readonly off?: string
}

/**
 * The DOM assertion one state modifier makes. Tailwind writes a state two ways and a primitive
 * chooses which one is readable: `data-checked` keys on the attribute being PRESENT, which is what
 * Base UI's toggles give; `data-[selected=true]` keys on its VALUE, which is the only form that
 * works against `cmdk`, because it stamps `data-selected` on every row and toggles what it says.
 * A resting state is then "the attribute says false" rather than "the attribute is absent", and
 * both are expressible here — the limit the previous batch reported when it left `command`
 * outside the coverage guard.
 */
function attribute(
  modifier: string
): [name: string, value: string | undefined] {
  const arbitrary = /^(data|aria)-\[([\w-]+)(?:=(.*))?\]$/.exec(modifier)
  if (arbitrary) return [`${arbitrary[1]!}-${arbitrary[2]!}`, arbitrary[3]]
  // `toHaveAttribute` reads an undefined value as "present, whatever it says", which is what the
  // bare `data-*` form means. The bare `aria-*` form does NOT: Tailwind compiles `aria-selected:`
  // to `[aria-selected="true"]`, so a row that says `aria-selected="false"` is resting, and
  // reading it as presence would call it selected.
  return [modifier, modifier.startsWith("aria-") ? "true" : undefined]
}

interface Rule {
  readonly modifier: string
  readonly property: string
  readonly paint: Paint
}

/** Every colour rule one class string declares under one state modifier, by property. */
function rulesFor(className: string, modifier: string): Map<string, Rule[]> {
  const byProperty = new Map<string, Rule[]>()
  for (const token of className.split(/\s+/).filter(Boolean)) {
    const { modifiers, utility } = splitModifiers(token)
    if (modifiers.length !== 1 || modifiers[0] !== modifier) continue
    const value = paint(utility)
    const group = property(utility)
    if (!value || !group) continue
    byProperty.set(group, [
      ...(byProperty.get(group) ?? []),
      { modifier, property: group, paint: value },
    ])
  }
  return byProperty
}

/** The first unmodified `bg-`/`text-`/`border-` colour one element declares, ignoring transparent. */
function baseColour(element: Element, prefix: string): Paint | null {
  // `getAttribute`, not `className`: an SVG element's `className` is an `SVGAnimatedString`, and
  // the walk below runs over the icon inside an indicator.
  for (const token of (element.getAttribute("class") ?? "")
    .split(/\s+/)
    .filter(Boolean)) {
    const { modifiers, utility } = splitModifiers(token)
    if (modifiers.length !== 0 || !utility.startsWith(`${prefix}-`)) continue
    const value = paint(utility)
    if (value && value.value !== "transparent") return value
  }
  return null
}

/**
 * What the control is painted with at rest. A declared resting rule wins; otherwise the paint is
 * whatever shows through — the element's own unmodified background, else the nearest ancestor
 * that declares one (a `ToggleGroupItem` rests on its group's `bg-fill-3`), else the page.
 */
function restingColour(root: HTMLElement, state: State, group: string): Paint {
  const prefix =
    group === "background-color" ? "bg" : group === "color" ? "text" : "border"
  if (state.off) {
    const declared = rulesFor(root.className, state.off).get(group)?.[0]
    if (declared) return declared.paint
  }
  for (let node: Element | null = root; node; node = node.parentElement) {
    const found = baseColour(node, prefix)
    if (found) return found
  }
  return { value: "transparent", alpha: 1 }
}

/**
 * The colour the control's *content* draws in when selected — the tick, the dot, the thumb, the
 * label. This is the layer the first harness could not see, and the escape the Phase 2 review
 * named: `checkbox.tsx` paints its tick with an unmodified `text-primary-foreground` over a
 * `data-checked:bg-primary` fill, so aliasing `--primary-foreground` to `--primary` on one idiom
 * turns a checked checkbox into a solid blue square with no tick — visually the §4.5 bug — while
 * every root-level assertion stays green. The same holds for the radio's dot and the switch's
 * thumb, whose contrast is against a token nothing else here reads.
 */
function inkColour(
  root: HTMLElement,
  indicator: Element | null,
  state: State
): Paint | null {
  const declared = rulesFor(root.className, state.on).get("color")?.[0]
  if (declared) return declared.paint
  if (indicator)
    for (const node of [indicator, ...indicator.querySelectorAll("*")]) {
      const filled = baseColour(node, "bg")
      if (filled) return filled
    }
  for (
    let node: Element | null = indicator ?? root;
    node;
    node = node.parentElement
  ) {
    const text = baseColour(node, "text")
    if (text) return text
  }
  return null
}

interface Control {
  readonly name: string
  readonly role: string
  /** Extra `getByRole` options, where the role alone does not pick the control out. */
  readonly options?: Record<string, unknown>
  readonly state: State
  /**
   * How the control draws its selection — §4.5's failure mode is "selected is indistinguishable
   * from unselected", and all three of these can produce it. A harness that reads only `fill`
   * states a limit of its own machinery in the voice of a judgement about risk.
   *
   * - `fill`: the root's own background swaps (checkbox, radio, switch, toggle). The indicator
   *   then sits ON that fill and must contrast with it.
   * - `ink`: the root is untouched and the content re-colours (`navigation-menu`'s active link).
   * - `indicator`: a separate element carries the whole selection — the pill `tabs` and
   *   `toggle-group` slide to the selected segment. On iOS and the web the selected label is the
   *   SAME `--label` as its neighbours (the pill is what reads); only macOS re-colours. So the
   *   assertion for these is not "the label changes colour" but "the pill is visible on the
   *   track, and the label is visible on the pill".
   */
  readonly paints?: "fill" | "ink" | "indicator"
  /**
   * Whether the control has a disabled state to dim. Default true. `navigation-menu`'s link is an
   * `<a>` and Base UI's `NavigationMenu.Link` takes no `disabled` prop, so there is no such state
   * to assert — this is the one place the exception is real rather than an omission.
   */
  readonly disables?: boolean
  /**
   * The element that shows the selection. `persists` marks the ones that stay mounted and move
   * instead of appearing — the switch's thumb and the segmented control's pill both slide, so
   * presence proves nothing about them. `tracksState` says the persisting element carries the
   * state attribute itself (the thumb does; a pill shared by every segment cannot), which is then
   * what the resting render asserts on in place of absence.
   */
  readonly indicator?: {
    readonly slot: string
    readonly persists?: boolean
    readonly tracksState?: boolean
  }
  /**
   * Whether the selected fill carries a mark that has to read against it. Default true. A
   * `page-control` dot is the one control where it is false and that is not an omission: the dot
   * has no content at all — it IS the selection — so there is no tick, dot or label to contrast,
   * and asking for one would be asking for a glyph inside a 7 pt circle.
   */
  readonly marks?: boolean
  readonly on: ReactElement
  readonly off: ReactElement
}

/* --- rendered controls: read verbatim by idiom-fidelity-coverage.test.ts --- */

const views = (selected: "a" | "b") => (
  <Tabs value={selected}>
    <TabsList aria-label="s">
      <TabsTab value="a">t</TabsTab>
      <TabsTab value="b">u</TabsTab>
    </TabsList>
    <TabsPanel value="a">t</TabsPanel>
    <TabsPanel value="b">u</TabsPanel>
  </Tabs>
)

const navLink = (active: boolean) => (
  <NavigationMenu aria-label="n">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink href="/t" active={active}>
          t
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

const sidebarRow = (active: boolean) => (
  <SidebarProvider>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={active}>t</SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarProvider>
)

const sidebarSubRow = (active: boolean) => (
  <SidebarProvider>
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton href="/t" isActive={active}>
          t
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </SidebarProvider>
)

/**
 * A Spotlight result. `cmdk` decides the highlighted row from the root's `value`, and it writes
 * `data-selected="false"` on the others rather than dropping the attribute — so this is the one
 * control whose resting state is an attribute VALUE, and the reason `State` had to grow past
 * "present or absent".
 */
const commandRow = (selected: boolean) => (
  <Command value={selected ? "t" : "u"}>
    <CommandList>
      <CommandItem value="t">t</CommandItem>
      <CommandItem value="u">u</CommandItem>
    </CommandList>
  </Command>
)

/**
 * A calendar day. Three things about `react-day-picker` shape this: it renders a day BUTTON only
 * when a `mode` makes the grid interactive, it leaves `modifiers.selected` undefined rather than
 * false on an unselected day (so the resting state is the attribute's absence), and
 * `CalendarDayButton` reaches the tree through `components` — the documented override, and the
 * composition a caller writes to customise a day, so naming it here is the real API rather than a
 * contrivance for the coverage guard.
 */
const calendarDay = (selected: boolean) => (
  <Calendar
    mode="single"
    month={new Date(2026, 8, 1)}
    selected={selected ? new Date(2026, 8, 15) : undefined}
    components={{ DayButton: (props) => <CalendarDayButton {...props} /> }}
  />
)

/**
 * The four ARIA-stated controls. Each was invisible to the coverage guard until it learned to
 * read `aria-*` beside `data-*`, and each paints a real selection: a selected table row, the
 * current page's dot, the sidebar row you are on, the tab you are in.
 *
 * `aria-selected` and `aria-current` differ in how they rest, and both are the components' own
 * doing rather than a choice here: React writes `aria-selected={false}` as the string "false",
 * so a resting row still carries the attribute, while `aria-current={undefined}` is omitted
 * entirely.
 */
const tableRow = (selected: boolean) => (
  <Table>
    <TableBody>
      <TableRow selected={selected}>
        <TableCell>t</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const pageDot = (selected: boolean) => (
  <PageControl count={2} index={selected ? 0 : 1} />
)

const sidebarItem = (current: boolean) => (
  <SidebarProvider>
    <SidebarItem href="/t" current={current}>
      t
    </SidebarItem>
  </SidebarProvider>
)

const tabBarItem = (current: boolean) => (
  <TabBar value={current ? "t" : "u"}>
    <TabBarItem value="t" icon={Home01Icon} label="t" />
    <TabBarItem value="u" icon={Home01Icon} label="u" />
  </TabBar>
)

/** Every selectable control, with the two states that must be visually distinct. */
const CONTROLS: readonly Control[] = [
  {
    name: "checkbox",
    role: "checkbox",
    state: { on: "data-checked", off: "data-unchecked" },
    indicator: { slot: "checkbox-indicator" },
    on: <Checkbox aria-label="c" defaultChecked />,
    off: <Checkbox aria-label="c" />,
  },
  {
    name: "radio",
    role: "radio",
    state: { on: "data-checked", off: "data-unchecked" },
    indicator: { slot: "radio-group-indicator" },
    on: (
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" aria-label="r" />
      </RadioGroup>
    ),
    off: (
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" aria-label="r" />
      </RadioGroup>
    ),
  },
  {
    name: "switch",
    role: "switch",
    state: { on: "data-checked", off: "data-unchecked" },
    indicator: { slot: "switch-thumb", persists: true, tracksState: true },
    on: <Switch aria-label="s" defaultChecked />,
    off: <Switch aria-label="s" />,
  },
  {
    name: "toggle-group",
    role: "button",
    options: { name: "t" },
    state: { on: "data-pressed" },
    paints: "indicator",
    indicator: { slot: "toggle-group-indicator", persists: true },
    on: (
      <ToggleGroup defaultValue={["t"]}>
        <ToggleGroupItem value="t" aria-label="t" />
      </ToggleGroup>
    ),
    off: (
      <ToggleGroup defaultValue={[]}>
        <ToggleGroupItem value="t" aria-label="t" />
      </ToggleGroup>
    ),
  },
  {
    name: "toggle",
    role: "button",
    options: { name: "t" },
    state: { on: "data-pressed" },
    on: <Toggle aria-label="t" defaultPressed />,
    off: <Toggle aria-label="t" />,
  },
  {
    name: "tabs",
    role: "tab",
    options: { name: "t" },
    state: { on: "data-active" },
    paints: "indicator",
    indicator: { slot: "tabs-indicator", persists: true },
    on: views("a"),
    off: views("b"),
  },
  {
    name: "navigation-menu",
    role: "link",
    options: { name: "t" },
    state: { on: "data-active" },
    paints: "ink",
    disables: false,
    on: navLink(true),
    off: navLink(false),
  },
  {
    name: "sidebar-menu-button",
    role: "button",
    options: { name: "t" },
    state: { on: "data-active" },
    on: sidebarRow(true),
    off: sidebarRow(false),
  },
  {
    name: "calendar-day",
    role: "button",
    options: { name: /September 15th/ },
    state: { on: "data-[selected-single=true]" },
    on: calendarDay(true),
    off: calendarDay(false),
  },
  {
    name: "command-item",
    role: "option",
    options: { name: "t" },
    state: { on: "data-[selected=true]", off: "data-[selected=false]" },
    on: commandRow(true),
    off: commandRow(false),
  },
  {
    name: "table-row",
    role: "row",
    state: { on: "aria-selected", off: "aria-[selected=false]" },
    disables: false,
    on: tableRow(true),
    off: tableRow(false),
  },
  {
    name: "page-control-dot",
    role: "tab",
    options: { name: "Page 1" },
    state: { on: "aria-selected", off: "aria-[selected=false]" },
    disables: false,
    marks: false,
    on: pageDot(true),
    off: pageDot(false),
  },
  {
    name: "sidebar-item",
    role: "link",
    options: { name: "t" },
    state: { on: "aria-[current=page]" },
    on: sidebarItem(true),
    off: sidebarItem(false),
  },
  {
    name: "tab-bar-item",
    role: "button",
    options: { name: "t" },
    state: { on: "aria-[current=true]" },
    disables: false,
    on: tabBarItem(true),
    off: tabBarItem(false),
  },
  {
    name: "sidebar-menu-sub-button",
    role: "link",
    options: { name: "t" },
    state: { on: "data-active" },
    on: sidebarSubRow(true),
    off: sidebarSubRow(false),
  },
]

/* --- end rendered controls --- */

describe("selection is visible on every idiom", () => {
  for (const idiom of IDIOMS)
    for (const control of CONTROLS) {
      const where = `${control.name}/${idiom}`
      const paints = control.paints ?? "fill"
      const find = () =>
        screen.getByRole(control.role, control.options as never)
      // One control is rendered per test, so the indicator is looked up document-wide rather than
      // inside the control: a sliding pill is a SIBLING of the item it marks, not a descendant.
      const findIndicator = () =>
        control.indicator
          ? document.querySelector(`[data-slot="${control.indicator.slot}"]`)
          : null

      test(`${control.name} on ${idiom} carries the state its paint keys off`, () => {
        const { unmount } = render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const on = find()
        expect(on, `${where} is selected`).toHaveAttribute(
          ...attribute(control.state.on)
        )
        if (control.indicator)
          expect(
            findIndicator(),
            `${where} shows its indicator when selected`
          ).not.toBeNull()
        unmount()

        render(
          <PlatformProvider platform={idiom}>{control.off}</PlatformProvider>
        )
        const off = find()
        if (control.state.off)
          expect(off, `${where} rests`).toHaveAttribute(
            ...attribute(control.state.off)
          )
        else
          expect(off, `${where} rests`).not.toHaveAttribute(
            ...attribute(control.state.on)
          )

        // Asserting only that the indicator is THERE when selected is signal-free: an indicator
        // mounted in both states satisfies it either way, and one of ours is (the switch's thumb
        // slides rather than appears). So the resting render is asserted too — absence for the
        // ones that appear, and the resting state attribute for the one that stays.
        if (!control.indicator) return
        const resting = findIndicator()
        if (!control.indicator.persists) {
          expect(resting, `${where} hides its indicator at rest`).toBeNull()
          return
        }
        expect(resting, `${where} keeps its indicator at rest`).not.toBeNull()
        if (control.indicator.tracksState)
          expect(
            resting,
            `${where}'s indicator stays mounted, so it must track the state itself`
          ).not.toHaveAttribute(...attribute(control.state.on))
      })

      test(`${control.name} on ${idiom} declares a selected paint its resting state does not`, () => {
        render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const element = find()
        const selected = rulesFor(element.className, control.state.on)

        // An `indicator` control paints nothing on its own root; the element that carries its
        // selection is asserted in the next test.
        if (paints !== "indicator")
          expect(
            [...selected.keys()],
            `${where} paints its selection`
          ).toContain(paints === "fill" ? "background-color" : "color")
        if (control.disables !== false)
          // `disabled:opacity-40` and `data-[disabled=true]:opacity-40` are the same rule; which
          // one a component writes is decided by whether its primitive stamps the attribute on
          // every row (`cmdk`) or only on the disabled one (Base UI).
          expect(element.className, `${where} dims when disabled`).toMatch(
            /\bdisabled(?:=true\])?:opacity-/
          )

        for (const [group, rules] of selected) {
          if (paints === "indicator") continue
          // A `fill` control's own colour is asserted against its fill in the next test; an `ink`
          // control's background is the surface it shares with its unselected siblings, and
          // comparing it to itself would be the tautology R16 removed.
          if ((group === "color") === (paints === "fill")) continue
          const resting = restingColour(element, control.state, group)
          for (const rule of rules) {
            expect(
              `${rule.paint.value}/${rule.paint.alpha}`,
              `${where} ${group}: ${rule.modifier} and its resting state declare one value`
            ).not.toBe(`${resting.value}/${resting.alpha}`)

            // The values differing textually is not enough: two tokens can alias the same
            // colour. This is the assertion that would have caught the §4.5 bug.
            for (const environment of ENVIRONMENTS) {
              const vars = variableMap(idiom, environment)
              if (rule.paint.alpha !== resting.alpha) continue
              expect(
                resolve(rule.paint.value, vars),
                `${where}/${environment.name} ${group}: ${rule.paint.value} and ${resting.value} resolve alike`
              ).not.toBe(resolve(resting.value, vars))
            }
          }
        }
      })

      // The escape the Phase 2 review named: the harness compared exactly two properties on
      // exactly one element, so the indicator's OWN colour was never read. Alias
      // `--primary-foreground` to `--primary` on one idiom and a checked checkbox becomes a solid
      // blue square with no tick — visually the §4.5 bug — with every other assertion green.
      test(`${control.name} on ${idiom} draws its indicator in a colour its surface is not`, () => {
        if (!control.indicator && paints !== "fill") return
        render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const element = find()
        const indicator = findIndicator()

        /** Neither of these may resolve to the other, or the mark vanishes into its ground. */
        const distinct = (mark: Paint, surface: Paint, what: string) => {
          if (mark.alpha !== surface.alpha) return
          for (const environment of ENVIRONMENTS) {
            const vars = variableMap(idiom, environment)
            expect(
              resolve(mark.value, vars),
              `${where}/${environment.name}: ${what} — the surface ${surface.value} and ` +
                `${mark.value} resolve alike, so it is invisible on it`
            ).not.toBe(resolve(surface.value, vars))
          }
        }

        if (paints === "indicator") {
          // The pill must read against the track it slides along...
          const pill = baseColour(indicator!, "bg")
          let track: Paint | undefined
          for (
            let node = indicator!.parentElement;
            node && !track;
            node = node.parentElement
          )
            track = baseColour(node, "bg") ?? undefined
          expect(pill, `${where}'s indicator declares a fill`).not.toBeNull()
          expect(
            track,
            `${where} names the track its indicator slides along`
          ).toBeDefined()
          distinct(pill!, track!, "the selected pill on its track")

          // ...and the selected label must read against the pill it now sits on.
          const label =
            rulesFor(element.className, control.state.on).get("color")?.[0]
              ?.paint ?? baseColour(element, "text")
          expect(
            label,
            `${where}'s selected item declares a colour`
          ).not.toBeNull()
          distinct(label!, pill!, "the selected label on its pill")
          return
        }

        const fill = rulesFor(element.className, control.state.on).get(
          "background-color"
        )?.[0]?.paint
        expect(fill, `${where} paints a selected background`).toBeDefined()
        if (control.marks === false) return
        const mark = inkColour(element, indicator, control.state)
        expect(
          mark,
          `${where}'s selected indicator declares no colour this harness can read — ` +
            `add one, or the tick, dot or thumb could take the fill's own paint unnoticed`
        ).not.toBeNull()
        distinct(mark!, fill!, "the indicator on the selected fill")
      })
    }
})

interface LabelFixture {
  readonly name: string
  readonly slot: string
  /** The token family the label's four type slots come from. */
  readonly family: "menu" | "select"
  readonly element: () => ReactElement
  readonly open: () => Promise<void>
}

/**
 * The menu-shaped group labels. Phase 1 rebuilt these from a two-utility swap
 * (`macos:type-caption-1 macos:font-semibold`) into four token slots, and no registry example
 * anywhere renders one, so nothing had ever put one on screen under an idiom.
 *
 * The per-entry `slot` is not a fixture convenience papering over a naming split: shadcn's own
 * `ComboboxLabel` wraps Base UI's `Combobox.GroupLabel` under `data-slot="combobox-label"`, so
 * applecn's `ComboboxGroupLabel`/`combobox-group-label` is a real parity gap. It is recorded
 * against Task 15 in `shadcn-export-parity.test.ts`, and this fixture follows the tree as it is
 * until then.
 *
 * These assertions run once per idiom and, with the platform variants gone, compare identical
 * strings each time. Kept deliberately: the cost is three cheap string checks, and what they buy
 * is the case where a future component gates RENDERING rather than styling on the platform — a
 * label that fails to appear on one idiom is exactly the §7.2 failure this file exists for, and
 * only a per-idiom render can see it.
 */
const LABELS: readonly LabelFixture[] = [
  {
    name: "menu",
    slot: "dropdown-menu-label",
    family: "menu",
    element: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Group</DropdownMenuLabel>
            <DropdownMenuItem>Copy</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    open: async () => {
      await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    },
  },
  {
    name: "context-menu",
    slot: "context-menu-label",
    family: "menu",
    element: () => (
      <ContextMenu>
        <ContextMenuTrigger>Photo</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Group</ContextMenuLabel>
            <ContextMenuItem>Share</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    ),
    open: async () => {
      fireEvent.contextMenu(screen.getByText("Photo"))
    },
  },
  {
    name: "menubar",
    slot: "menubar-label",
    family: "menu",
    element: () => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>Group</MenubarLabel>
              <MenubarItem>New Window</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    open: async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: "File" }))
    },
  },
  {
    name: "select",
    slot: "select-label",
    family: "select",
    element: () => (
      <Select defaultValue="apple" items={{ apple: "Apple", pear: "Pear" }}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="pear">Pear</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    open: async () => {
      await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }))
    },
  },
  {
    name: "combobox",
    slot: "combobox-label",
    family: "menu",
    element: () => (
      <Combobox items={["Apple", "Apricot"]}>
        <ComboboxInput aria-label="Fruit" />
        <ComboboxContent>
          <ComboboxGroup>
            <ComboboxGroupLabel>Group</ComboboxGroupLabel>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxGroup>
        </ComboboxContent>
      </Combobox>
    ),
    open: async () => {
      await userEvent.type(
        screen.getByRole("combobox", { name: "Fruit" }),
        "Ap"
      )
    },
  },
]

describe("a menu-shaped group label renders on every idiom", () => {
  for (const idiom of IDIOMS)
    for (const label of LABELS)
      test(`${label.name} shows its group label on ${idiom}`, async () => {
        render(
          <PlatformProvider platform={idiom}>
            {label.element()}
          </PlatformProvider>
        )
        await label.open()
        const element = await screen.findByText("Group", {
          selector: `[data-slot=${label.slot}]`,
        })
        for (const slot of [
          `text-[length:var(--${label.family}-label-font-size)]`,
          `leading-(--${label.family}-label-leading)`,
          `font-(--${label.family}-label-weight)`,
          `tracking-(--${label.family}-label-tracking)`,
        ])
          expect(
            element.className,
            `${label.name}/${idiom} reads ${slot}`
          ).toContain(slot)
      })
})

/** `calc(10 * var(--pt))` → 10. */
function points(value: string): number {
  const match = /^calc\(([\d.]+) \* var\(--pt\)\)$/.exec(value)
  expect(match, `${value} is a point-scaled length`).not.toBeNull()
  return Number(match![1])
}

describe("a group label keeps the type each idiom measures", () => {
  test.each(["menu", "select"] as const)(
    "%s labels are semibold on macOS and step down a size",
    (family) => {
      const slot = (idiom: Platform, name: string) =>
        resolve(
          `var(--${family}-label-${name})`,
          variableMap(idiom, ENVIRONMENTS[0]!)
        )

      // AppKit's grouped-list header: caption-1, bolded to 600. macOS's caption-1 scale is itself
      // 400 (500 emphasized), so a slot that fell back to the scale's own weight would demote
      // every macOS group label to regular — which the four-slot rebuild came within one token of
      // doing, with no test able to see it.
      expect(slot("macos", "weight")).toBe("600")
      for (const idiom of ["ios", "web"] as const) {
        expect(
          Number(slot("macos", "weight")),
          `macOS outweighs ${idiom}`
        ).toBeGreaterThan(Number(slot(idiom, "weight")))
        expect(
          points(slot("macos", "font-size")),
          `macOS steps down from ${idiom}`
        ).toBeLessThan(points(slot(idiom, "font-size")))
      }
    }
  )
})
