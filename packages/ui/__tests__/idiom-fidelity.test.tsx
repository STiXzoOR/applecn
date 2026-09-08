import { readFileSync } from "node:fs"
import { join } from "node:path"

import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactElement } from "react"
import { describe, expect, test } from "vitest"

import { Checkbox } from "../src/components/checkbox"
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
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuTrigger,
} from "../src/components/menu"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from "../src/components/menubar"
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
import { Switch } from "../src/components/switch"
import { PlatformProvider, type Platform } from "../src/lib/platform"
import { tokenPlatformCss, tokenVars } from "../src/tokens/css"

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
const APPEARANCES = ["light", "dark"] as const

type Appearance = (typeof APPEARANCES)[number]

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

/**
 * Every custom property in scope for an element under one idiom and appearance, in the order the
 * cascade resolves them. `tokens.css` emits `:root`, `.dark`, `[data-platform=…]` and
 * `.dark[data-platform=…]` in that order; the first three weigh the same, so the later declaration
 * wins between them, and the fourth outranks all three. Composed from the token modules rather
 * than parsed from the generated stylesheet, so it cannot drift from what a consumer installs.
 */
function variableMap(
  platform: Platform,
  appearance: Appearance
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

  const vars = new Map<string, string>()
  const add = (entries: Iterable<readonly [string, string]>) => {
    for (const [name, value] of entries) vars.set(name, value)
  }
  add(Object.entries(tokenVars("light")))
  if (appearance === "dark") add(Object.entries(tokenVars("dark")))
  add(withoutPrefix(light!))
  if (appearance === "dark") add(withoutPrefix(dark!))
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

/** The CSS value a colour utility paints, or null when it is not one we can resolve. */
function paint(utility: string): string | null {
  const arbitrary = /^(?:bg|border)-\((--[\w-]+)\)$/.exec(utility)
  if (arbitrary) return `var(${arbitrary[1]})`
  const named = /^(?:bg|border)-([a-z][\w-]*)$/.exec(utility)
  if (!named) return null
  return themeColors.get(named[1]!) ?? null
}

/** The half of a toggle a modifier describes. */
const RESTING = "data-unchecked"
const CHECKED = "data-checked"
const SELECTED = new Set([CHECKED, "data-indeterminate"])

interface Rule {
  readonly modifier: string
  readonly property: string
  readonly value: string
}

/** Every selection-state colour rule one class string declares, by property. */
function selectionRules(className: string): Map<string, Rule[]> {
  const byProperty = new Map<string, Rule[]>()
  for (const token of className.split(/\s+/).filter(Boolean)) {
    const { modifiers, utility } = splitModifiers(token)
    if (modifiers.length !== 1) continue
    const modifier = modifiers[0]!
    if (modifier !== RESTING && !SELECTED.has(modifier)) continue
    const value = paint(utility)
    if (!value) continue
    const property = utility.startsWith("bg-")
      ? "background-color"
      : "border-color"
    byProperty.set(property, [
      ...(byProperty.get(property) ?? []),
      { modifier, property, value },
    ])
  }
  return byProperty
}

interface Control {
  readonly name: string
  readonly role: string
  /** The slot the selected state shows, which must be in the tree when it is on. */
  readonly indicator: string
  readonly on: ReactElement
  readonly off: ReactElement
}

/** Every selectable control, with the two states that must be visually distinct. */
const CONTROLS: readonly Control[] = [
  {
    name: "checkbox",
    role: "checkbox",
    indicator: "checkbox-indicator",
    on: <Checkbox aria-label="c" defaultChecked />,
    off: <Checkbox aria-label="c" />,
  },
  {
    name: "radio",
    role: "radio",
    indicator: "radio-group-indicator",
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
    indicator: "switch-thumb",
    on: <Switch aria-label="s" defaultChecked />,
    off: <Switch aria-label="s" />,
  },
]

describe("selection is visible on every idiom", () => {
  for (const idiom of IDIOMS)
    for (const control of CONTROLS) {
      const where = `${control.name}/${idiom}`

      test(`${control.name} on ${idiom} carries the state its paint keys off`, () => {
        const { unmount } = render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const on = screen.getByRole(control.role)
        expect(on, `${where} is checked`).toHaveAttribute("data-checked")
        expect(
          on.querySelector(`[data-slot="${control.indicator}"]`),
          `${where} shows its indicator when checked`
        ).not.toBeNull()
        unmount()

        render(
          <PlatformProvider platform={idiom}>{control.off}</PlatformProvider>
        )
        expect(
          screen.getByRole(control.role),
          `${where} is unchecked`
        ).toHaveAttribute("data-unchecked")
      })

      test(`${control.name} on ${idiom} declares a selected paint its resting state does not`, () => {
        render(
          <PlatformProvider platform={idiom}>{control.on}</PlatformProvider>
        )
        const element = screen.getByRole(control.role)
        const byProperty = selectionRules(element.className)

        expect(
          [...byProperty.keys()],
          `${where} paints a selected background`
        ).toContain("background-color")
        expect(element.className, `${where} dims when disabled`).toMatch(
          /data-disabled:opacity-/
        )

        for (const [property, rules] of byProperty) {
          const selected = rules.filter((rule) => rule.modifier !== RESTING)
          const resting = rules.filter((rule) => rule.modifier === RESTING)
          // `data-checked` by name, not "some selected state": a checkbox whose checked fill was
          // deleted still declares `data-indeterminate:bg-primary`, and a laxer check passes on
          // the strength of a state the control is almost never in.
          expect(
            rules.map((rule) => rule.modifier),
            `${where} ${property} has a checked and a resting rule`
          ).toEqual(expect.arrayContaining([CHECKED, RESTING]))
          expect(
            resting.length,
            `${where} ${property} has one resting rule`
          ).toBe(1)

          for (const on of selected)
            for (const off of resting) {
              expect(
                on.value,
                `${where} ${property}: ${on.modifier} and ${off.modifier} declare one value`
              ).not.toBe(off.value)

              // The values differing textually is not enough: two tokens can alias the same
              // colour. This is the assertion that would have caught the §4.5 bug.
              for (const appearance of APPEARANCES) {
                const vars = variableMap(idiom, appearance)
                expect(
                  resolve(on.value, vars),
                  `${where}/${appearance} ${property}: ${on.value} and ${off.value} resolve alike`
                ).not.toBe(resolve(off.value, vars))
              }
            }
        }
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
 */
const LABELS: readonly LabelFixture[] = [
  {
    name: "menu",
    slot: "menu-label",
    family: "menu",
    element: () => (
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuLabel>Group</MenuLabel>
            <MenuItem>Copy</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
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
    slot: "combobox-group-label",
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
        resolve(`var(--${family}-label-${name})`, variableMap(idiom, "light"))

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
