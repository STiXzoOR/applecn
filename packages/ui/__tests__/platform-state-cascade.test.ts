import { describe, expect, test } from "vitest"

import { componentTokens } from "../src/tokens/components"
import {
  componentModules,
  paintedProperty,
  splitModifiers,
  topLevelDeclarations,
} from "./helpers/component-source"

/**
 * The §4.5 bug: a checked checkbox painted its resting bezel and showed no selection at all.
 * The original diagnosis blamed specificity — the platform variants were container style
 * queries weighing a single class, and the state variants were thought to be `:where()`-wrapped
 * and weightless. That was wrong twice over. Compiled through the version in the lockfile,
 * `data-checked:` produces `&[data-checked]` at full `(0,1,0)` weight, so nothing was
 * weightless; and phase 1 deleted every platform variant, which left the old test scanning for
 * `/(?:ios:|macos:|web:)/` in files that no longer contain it — passing on an empty input set
 * for every file, unable ever to fail again.
 *
 * The real failure shape is emission order, and it survives the platform variants' removal.
 * Measured against Tailwind 4.3.0, the order utilities are written out in is:
 *
 *   focus-within → hover → focus → focus-visible → active → disabled     (pseudo-classes)
 *   → aria-*  → data-<name>, alphabetically  → data-[key=value], alphabetically
 *
 * Two of those orderings carry meaning and can be relied on. Pseudo-classes layer the way a
 * designer expects (a pressed control outranks a hovered one; a disabled one outranks both),
 * and a state *attribute* outranking a pseudo-class is likewise stable and intended — a
 * checked control keeps its checked paint under the cursor.
 *
 * The rest is incidental. When two attribute-shaped state variants write the same property
 * with different values on one element, which one paints is decided by the alphabet, or by
 * whether the author happened to write `data-highlighted:` rather than
 * `data-[variant=destructive]:`. Nothing about that answer expresses design intent, and it
 * changes under a rename. So those pairs must be resolved explicitly — with a class carrying
 * both modifiers, which by construction outranks either alone — rather than left to race.
 */

/** Pseudo-class modifiers, whose relative order Tailwind fixes and designers rely on. */
const PSEUDO = new Set([
  "hover",
  "focus",
  "focus-visible",
  "focus-within",
  "active",
  "disabled",
  "enabled",
  "visited",
  "target",
  "first",
  "last",
  "odd",
  "even",
  "checked",
  "indeterminate",
  "placeholder-shown",
  "read-only",
])

const isAttribute = (modifier: string) =>
  (modifier.startsWith("data-") || modifier.startsWith("aria-")) &&
  !PSEUDO.has(modifier)

/** States that cannot both be true: the two halves of a toggle, or one attribute's two values. */
const OPPOSITES: readonly (readonly string[])[] = [
  ["data-checked", "data-unchecked", "data-indeterminate"],
  ["data-open", "data-closed"],
  ["data-pressed", "data-unpressed"],
  ["data-selected", "data-unselected"],
  ["data-active", "data-inactive"],
  ["data-horizontal", "data-vertical"],
  ["data-starting-style", "data-ending-style"],
]

function opposed(a: string, b: string): boolean {
  if (a === b) return false
  if (OPPOSITES.some((group) => group.includes(a) && group.includes(b)))
    return true
  // `data-[side=top]` and `data-[side=left]` are the same attribute holding two values.
  const key = (m: string) => /^(?:data|aria)-\[([^=\]]+)=([^\]]*)\]$/.exec(m)
  const [, keyA, valueA] = key(a) ?? []
  const [, keyB, valueB] = key(b) ?? []
  return Boolean(keyA && keyA === keyB && valueA !== valueB)
}

const opposedSets = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
  [...a].some((x) => [...b].some((y) => opposed(x, y)))

const subset = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
  [...a].every((x) => b.has(x))

/**
 * How much specificity a modifier set adds: a pseudo-class, an attribute selector and `dark`'s
 * `.dark` ancestor each contribute one component; a media-query variant (`motion-reduce`, a
 * breakpoint) contributes none. Two classes only race when these are equal — otherwise the
 * heavier selector wins outright, whatever order they are emitted in.
 */
const weight = (set: ReadonlySet<string>) =>
  [...set].filter((m) => PSEUDO.has(m) || isAttribute(m) || m === "dark").length

/**
 * Collisions reviewed and accepted rather than resolved, each with the winner Tailwind's order
 * actually produces. Every entry is a decision on the record; a new pair is a new decision.
 *
 * `aria-invalid` versus a selection state is shadcn's own convention, applied identically in
 * its upstream checkbox and radio: `aria-*` is emitted before `data-*`, so a checked-and-invalid
 * control keeps the checked accent and drops the destructive border. Changing it would repaint
 * a state phase 1 did not touch, so it is recorded here for the owner rather than altered.
 */
const ACCEPTED = new Set([
  "checkbox.tsx border-color aria-invalid:border-destructive|data-checked:border-primary",
  "checkbox.tsx border-color aria-invalid:border-destructive|data-indeterminate:border-primary",
  "checkbox.tsx border-color aria-invalid:border-destructive|data-unchecked:border-(--checkbox-border)",
  "radio-group.tsx border-color aria-invalid:border-destructive|data-checked:border-primary",
  "radio-group.tsx border-color aria-invalid:border-destructive|data-unchecked:border-(--radio-border)",
])

/** Every unresolved same-property race between two attribute states in one class string. */
function races(file: string, source: string): string[] {
  const found = new Set<string>()
  for (const match of source.matchAll(/"([^"\n]*)"/g)) {
    const byProperty = new Map<
      string,
      { set: Set<string>; utility: string; token: string }[]
    >()
    for (const token of match[1]!.split(/\s+/).filter(Boolean)) {
      const { modifiers, utility } = splitModifiers(token)
      const group = paintedProperty(utility)
      if (!group || modifiers.length === 0) continue
      // A `group-`/`peer-`/`[&…]` modifier conditions on another element, so two such classes
      // are not necessarily deciding one element's paint between them.
      if (modifiers.some((m) => m.includes("&") || /^(group|peer)-/.test(m)))
        continue
      const list = byProperty.get(group) ?? []
      list.push({ set: new Set(modifiers), utility, token })
      byProperty.set(group, list)
    }
    for (const [group, list] of byProperty)
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i]!
          const b = list[j]!
          if (a.utility === b.utility) continue
          if (![...a.set].some(isAttribute)) continue
          if (![...b.set].some(isAttribute)) continue
          if (weight(a.set) !== weight(b.set)) continue
          if (subset(a.set, b.set) || subset(b.set, a.set)) continue
          if (opposedSets(a.set, b.set)) continue
          const union = new Set([...a.set, ...b.set])
          if (
            list.some((c) => c.set.size === union.size && subset(union, c.set))
          )
            continue
          const [x, y] = [a.token, b.token].sort()
          const key = `${file} ${group} ${x}|${y}`
          if (!ACCEPTED.has(key)) found.add(key)
        }
  }
  return [...found]
}

describe("two state attributes never race for the same property", () => {
  test.each(componentModules())("$file", ({ file, source }) => {
    expect(races(file, source)).toEqual([])
  })

  test("the scan reaches real class strings, so an empty result cannot mean an empty input", () => {
    // A sanity check on the method: the guard must see a known collision when one is present.
    const planted =
      'className="data-highlighted:text-white data-[variant=destructive]:text-destructive"'
    expect(races("planted.tsx", planted)).toHaveLength(1)
  })
})

/**
 * The other half of §4.5, at the layer that carries the value rather than the selector: the web
 * idiom shipped a checkbox whose resting fill was the same colour the checked state paints, so
 * the control looked identical selected and unselected however the cascade resolved. A token
 * cannot be allowed to equal the paint its own selected state uses.
 */
describe("a selected control never resolves to its resting paint", () => {
  const CHECKED_BG = "var(--primary)"
  const CHECKED_BORDER = "var(--primary)"

  test.each(["ios", "macos", "web"] as const)(
    "%s draws a checkbox and a radio differently checked than unchecked",
    (platform) => {
      for (const control of ["checkbox", "radio"] as const) {
        const bezel = componentTokens[platform][control]
        expect(bezel.bg, `${platform} ${control} bg`).not.toBe(CHECKED_BG)
        expect(bezel.border, `${platform} ${control} border`).not.toBe(
          CHECKED_BORDER
        )
      }
    }
  )

  test.each(["ios", "macos", "web"] as const)(
    "%s draws a pressed toggle-group item differently from a resting one",
    (platform) => {
      const pressed = componentTokens[platform].toggleGroup.pressed
      expect(pressed.bg).not.toBe("transparent")
      expect(pressed.text).not.toBe(pressed.bg)
    }
  )

  test.each(["ios", "macos", "web"] as const)(
    "%s highlights a menu row with a fill it does not use at rest",
    (platform) => {
      const item = componentTokens[platform].menu.item
      expect(item.highlightBg).not.toBe("transparent")
      expect(item.highlightText).not.toBe(item.highlightBg)
    }
  )
})

/**
 * The third hole in the same family, and the one that shipped a live defect: a race decided not
 * by emission order but by SPECIFICITY, between a container's rule on a descendant and that
 * descendant's own state.
 *
 * `table` writes its stripe on the table root as `[&_tbody_tr:nth-child(even)]:bg-fill-4`, which
 * compiles to `.<class> tbody tr:nth-child(even)` — one class plus one pseudo-class. `TableRow`
 * writes selection on itself as `aria-selected:bg-selection`, which compiles to
 * `.<class>[aria-selected="true"]` — one class plus one attribute. They weigh the same, so the
 * stripe won on order and `bg-selection` never landed, while `aria-selected:text-white` (which
 * nothing competes with) did: a selected row was white text on near-white in light mode, on all
 * three idioms.
 *
 * Neither guard above could see it. `races()` compares two modifiers inside ONE class string and
 * skips anything conditioning on another element, which is exactly what a `[&_…]` variant does;
 * the coverage guard asks whether a selection rule is exercised in the harness, and `table` IS in
 * the harness — jsdom has no cascade, so rendering it proves the attribute and the class, not
 * which of two matching rules paints.
 *
 * So this pairs the two across declarations: a rule a container writes on a descendant TAG, and a
 * state rule on the declaration that renders that tag. The container's rule may not outweigh the
 * state unless it excludes the state outright.
 */

/** The tag a component declaration renders, from the first lower-case JSX element in its body. */
const renderedTag = (body: string) => /<([a-z][\w-]*)[\s/>]/.exec(body)?.[1]

/** CSS specificity of one compound/descendant selector, in classes+attributes+pseudo-classes. */
function selectorWeight(selector: string): number {
  const attributes = selector.match(/\[[^\]]*\]/g)?.length ?? 0
  const pseudo = selector.replace(/\[[^\]]*\]/g, "").match(/(?<!:):[a-z-]+/g)
  const classes = selector.match(/\.[A-Za-z]/g)?.length ?? 0
  return attributes + (pseudo?.length ?? 0) + classes
}

interface DescendantRule {
  /** The selector after the `&`, with Tailwind's `_` read back as a space. */
  readonly target: string
  readonly tag: string
  readonly property: string
  readonly utility: string
  readonly weight: number
}

/** Every rule a class string writes on a descendant through an arbitrary `[&…]` variant. */
function descendantRules(source: string): DescendantRule[] {
  const found: DescendantRule[] = []
  for (const [, block] of source.matchAll(/"([^"\n]*)"/g))
    for (const token of block!.split(/\s+/).filter(Boolean)) {
      const { modifiers, utility } = splitModifiers(token)
      const property = paintedProperty(utility)
      if (!property) continue
      for (const modifier of modifiers) {
        const arbitrary = /^\[&([_>~+].*)\]$/.exec(modifier)
        if (!arbitrary) continue
        const target = arbitrary[1]!.replaceAll("_", " ")
        const compound = target
          .split(/[\s>~+]+/)
          .filter(Boolean)
          .at(-1)
        const tag = /^([a-z][\w-]*)/.exec(compound ?? "")?.[1]
        if (!tag) continue
        found.push({
          target,
          tag,
          property,
          utility,
          // The utility's own class counts too: `.x tbody tr:nth-child(even)` is (0,2,2).
          weight: 1 + selectorWeight(target),
        })
      }
    }
  return found
}

interface StateRule {
  readonly declaration: string
  readonly tag: string
  readonly property: string
  readonly utility: string
  readonly modifiers: string[]
  readonly weight: number
}

/** Every state rule a declaration writes on the element it renders itself. */
function stateRules(source: string): StateRule[] {
  const found: StateRule[] = []
  for (const declaration of topLevelDeclarations(source)) {
    const tag = renderedTag(declaration.body)
    if (!tag) continue
    for (const [, block] of declaration.body.matchAll(/"([^"\n]*)"/g))
      for (const token of block!.split(/\s+/).filter(Boolean)) {
        const { modifiers, utility } = splitModifiers(token)
        const property = paintedProperty(utility)
        if (!property || modifiers.length === 0) continue
        if (!modifiers.every(isAttribute)) continue
        found.push({
          declaration: declaration.name,
          tag,
          property,
          utility,
          modifiers,
          weight: 1 + modifiers.length,
        })
      }
  }
  return found
}

/** Does the container's selector take the stated rows out of its own reach? */
const excludes = (target: string, state: StateRule) =>
  state.modifiers.some((modifier) => {
    const name = /^((?:data|aria)-[\w-]+)/.exec(modifier.replace("[", ""))?.[1]
    return Boolean(name) && new RegExp(`:not\\([^)]*${name}`).test(target)
  })

function specificityRaces(source: string): string[] {
  const found = new Set<string>()
  for (const rule of descendantRules(source))
    for (const state of stateRules(source)) {
      if (state.tag !== rule.tag || state.property !== rule.property) continue
      if (state.utility === rule.utility) continue
      if (excludes(rule.target, state)) continue
      if (rule.weight < state.weight) continue
      found.add(
        `[&${rule.target}]:${rule.utility} outranks ${state.declaration}'s ` +
          `${state.modifiers.join(":")}:${state.utility}`
      )
    }
  return [...found]
}

describe("a container's rule on a descendant never outranks that element's own state", () => {
  test.each(componentModules())("$file", ({ file, source }) => {
    expect(
      specificityRaces(source),
      `${file} paints a descendant from its container with a selector at least as heavy as the ` +
        `state rule on that same element, so the state never lands. Narrow the container's ` +
        `selector so it does not reach the stated element.`
    ).toEqual([])
  })

  test("the scan sees the collision it was built from", () => {
    // `table` before the fix, in miniature: the stripe at (0,2,2) over selection at (0,2,0).
    // `topLevelDeclarations` anchors on the line start, so the plant is written flush left.
    const planted = [
      "function Table() {",
      '  return <table className="[&_tbody_tr:nth-child(even)]:bg-fill-4" />',
      "}",
      "function TableRow() {",
      '  return <tr className="aria-selected:bg-selection" />',
      "}",
    ].join("\n")
    expect(specificityRaces(planted)).toHaveLength(1)
    // And it is resolved by taking the stated rows out of the container's reach, not by weight.
    const narrowed = planted.replace(
      "tr:nth-child(even)",
      "tr:nth-child(even):not([aria-selected=true])"
    )
    expect(specificityRaces(narrowed)).toEqual([])
  })
})
