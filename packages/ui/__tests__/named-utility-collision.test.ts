import { readFileSync } from "node:fs"
import { join } from "node:path"

import { cn } from "cn"
import { describe, expect, test } from "vitest"

import {
  canCoexist,
  classSets,
  componentModules,
  splitModifiers,
} from "./helpers/component-source"

/**
 * applecn's own named utilities do not participate in `cn`'s conflict resolution. Verified with
 * the repo's own `cn`:
 *
 *   cn("rounded-field", "rounded-full")  ->  BOTH kept
 *   cn("shadow-control", "shadow-none")  ->  BOTH kept
 *   cn("rounded-md", "rounded-full")     ->  rounded-full   (stock names DO merge)
 *
 * tailwind-merge knows Tailwind's own scales and nothing about a project's theme, so a class
 * string carrying two named utilities of one property group keeps both, and CSS EMISSION ORDER
 * picks the winner — invisible from the source. Measured against the built stylesheet
 * (`apps/web/.next`, 2026-09-08), that order is:
 *
 *   - alphabetical WITHIN a namespace, core and custom names interleaved:
 *     rounded-alert, rounded-card, rounded-control, rounded-field, rounded-full, rounded-list,
 *     rounded-md, rounded-menu, rounded-none, rounded-search, rounded-sheet, rounded-stepper;
 *     shadow-control, shadow-hairline, shadow-lift, shadow-none, shadow-thumb. A RENAME flips it.
 *   - by Tailwind's property order ACROSS namespaces, with an `@utility` block placed by its
 *     first declaration: radius, then `glass` and `material-*` (background), then `bg-*`, then
 *     `type-*` (font-size), `leading-*`, `font-<weight>`, `tracking-*`, text colour, `shadow-*`.
 *
 * Nothing about either answer expresses design intent, and the first cost real time: `shadow-none`
 * written to clear an inherited group silently killed the macOS stepper's bezel, because
 * `shadow-none` sorts after `shadow-control`. `platform-state-cascade.test.ts` cannot see this —
 * it models attribute-state races between two MODIFIERS, and these classes carry the same
 * modifiers (usually none at all).
 *
 * Spec §4.3 rejects the obvious cure: teaching the merger takes a per-project `cn` build step,
 * which is the config burden copy-paste exists to avoid, and a registry-distributed library would
 * push it onto every consumer. So this is a guard rather than a merge config. Every pair it finds
 * is resolved, or accepted here on the record.
 *
 * Its reach is one element's class list as written in one module: a string literal, a `cn()` call
 * across its arguments and ternary branches, and a `cva()` across its base and variants. It cannot
 * see a class this module passes as `className` into ANOTHER component's `cn` — the three
 * cross-component radius races the spec records (§5.6, Tasks 33/34/35) live there, and stay
 * recorded in prose rather than here.
 */

const css = readFileSync(
  join(import.meta.dirname, "../src/styles/globals.css"),
  "utf8"
)

const CORNERS = [
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
] as const

/** The corners each `rounded-*` side suffix writes, so `rounded-t-x` and `rounded-b-y` do not race. */
const SIDES: Record<string, readonly string[]> = {
  "": CORNERS,
  t: [CORNERS[0], CORNERS[1]],
  r: [CORNERS[1], CORNERS[2]],
  b: [CORNERS[2], CORNERS[3]],
  l: [CORNERS[3], CORNERS[0]],
  s: [CORNERS[0], CORNERS[3]],
  e: [CORNERS[1], CORNERS[2]],
  tl: [CORNERS[0]],
  tr: [CORNERS[1]],
  br: [CORNERS[2]],
  bl: [CORNERS[3]],
  ss: [CORNERS[0]],
  se: [CORNERS[1]],
  ee: [CORNERS[2]],
  es: [CORNERS[3]],
}

/**
 * What each of applecn's own named utilities writes, read out of `globals.css` rather than
 * listed here: an `@utility` block's top-level declarations, and the `@theme` entries whose
 * namespace mints a utility Tailwind's merger cannot know (`--radius-*`, `--shadow-*`, `--ease-*`).
 * `--color-*` and `--font-*` are left out on purpose — `cn` resolves those by prefix, so
 * `bg-fill-3` and `text-label` merge like any stock colour and cannot collide.
 */
function namedUtilities(): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>()
  for (const match of css.matchAll(/@utility\s+([\w-]+)\s*\{/g)) {
    let depth = 1
    let index = match.index + match[0].length
    const start = index
    while (depth > 0 && index < css.length) {
      if (css[index] === "{") depth++
      else if (css[index] === "}") depth--
      index++
    }
    // Nested blocks are the reduced-transparency fallbacks and child selectors; the utility's
    // own declarations are the top-level ones.
    let flat = ""
    let nested = 0
    for (const character of css.slice(start, index - 1)) {
      if (character === "{") nested++
      else if (character === "}") nested--
      else if (nested === 0) flat += character
    }
    const properties = new Set<string>()
    for (const [, property] of flat.matchAll(/([-\w]+)\s*:/g))
      if (!property!.startsWith("--"))
        properties.add(property!.replace(/^-webkit-/, ""))
    found.set(match[1]!, properties)
  }
  const namespaces: Record<string, [string, readonly string[]]> = {
    radius: ["rounded-", CORNERS],
    shadow: ["shadow-", ["box-shadow"]],
    ease: ["ease-", ["transition-timing-function"]],
  }
  for (const [, name] of css.matchAll(/^ {2}(--[\w-]+):/gm))
    for (const [namespace, [prefix, properties]] of Object.entries(namespaces))
      if (name!.startsWith(`--${namespace}-`))
        found.set(
          prefix + name!.slice(namespace.length + 3),
          new Set(properties)
        )
  return found
}

const NAMED = namedUtilities()

const SHADOW_SCALE = /^(?:2xs|xs|sm|md|lg|xl|2xl|none|inner|initial)$/
const TEXT_SCALE = /^(?:xs|sm|base|lg|xl|\d+xl)$/
const WEIGHT_SCALE =
  /^(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/

/** The CSS properties a utility writes, or null for one whose property this guard does not track. */
function cssProperties(utility: string): Set<string> | null {
  const name = utility.replace(/^!/, "").replace(/!$/, "")
  const named = NAMED.get(name)
  if (named) return named
  const radius =
    /^rounded(?:-(tl|tr|br|bl|ss|se|ee|es|[trbl]|[se]))?(?:-|$)/.exec(name)
  if (radius) return new Set(SIDES[radius[1] ?? ""])
  const shadow = /^shadow-(.+)$/.exec(name)
  if (shadow)
    return SHADOW_SCALE.test(shadow[1]!) || /^[[(]/.test(shadow[1]!)
      ? new Set(["box-shadow"])
      : null // a shadow COLOUR, which `cn` resolves like any other colour
  if (name.startsWith("ease-")) return new Set(["transition-timing-function"])
  const text = /^text-(.+)$/.exec(name)
  if (text) {
    const value = text[1]!
    if (/^(?:left|center|right|justify|start|end)$/.test(value))
      return new Set(["text-align"])
    if (/^(?:wrap|nowrap|balance|pretty)$/.test(value))
      return new Set(["text-wrap"])
    if (/^(?:ellipsis|clip)$/.test(value)) return new Set(["text-overflow"])
    if (value.startsWith("shadow")) return new Set(["text-shadow"])
    return /^[[(]length:/.test(value) || TEXT_SCALE.test(value.split("/")[0]!)
      ? new Set(["font-size"])
      : new Set(["color"])
  }
  if (name.startsWith("leading-")) return new Set(["line-height"])
  if (name.startsWith("tracking-")) return new Set(["letter-spacing"])
  const font = /^font-(.+)$/.exec(name)
  if (font) return WEIGHT_SCALE.test(font[1]!) ? new Set(["font-weight"]) : null
  const background = /^bg-(.+)$/.exec(name)
  if (background)
    return /^(?:clip|origin|repeat|blend|fixed|local|scroll|top|bottom|left|right|center|cover|contain|auto|none|linear|radial|conic|position|size)\b/.test(
      background[1]!
    )
      ? null
      : new Set(["background-color"])
  if (name.startsWith("backdrop-blur")) return new Set(["backdrop-filter"])
  return null
}

/**
 * The one pair shape left to emission order deliberately, as a rule rather than a list: a core
 * `font-<weight>` written over a `type-*` text style, which is how an emphasized Apple style is
 * spelled — the style's measured size, leading and tracking, and a heavier weight than the style
 * carries. It appears eighteen times across the catalogue and is one decision, not eighteen.
 *
 * It is safe on the ordering that holds ACROSS namespaces rather than the alphabetical one within
 * a namespace: `type-*` is placed by its first declaration (font-size) and Tailwind emits
 * font-weight after font-size, so the weight lands whatever either is called.
 */
const isEmphasis = (a: string, b: string) =>
  [
    [a, b],
    [b, a],
  ].some(
    ([weight, style]) =>
      weight!.startsWith("font-") &&
      NAMED.has(style!) &&
      style!.startsWith("type-")
  )

/**
 * Collisions reviewed and accepted rather than resolved. Every entry is a decision on the record;
 * a new pair is a new decision.
 *
 * A modal surface asks for the dialog elevation over the glass one. `shadow-dialog` is emitted
 * after `.glass`, so it wins in both transparency states — and what it wins with under reduced
 * transparency is the value `glass` would itself have swapped to, so the fallback is unharmed.
 * Deleting it would change the resting paint of three modal surfaces, which is a design decision
 * rather than a defect.
 */
const ACCEPTED = new Set([
  "action-sheet.tsx box-shadow glass|shadow-dialog",
  "alert-dialog.tsx box-shadow glass|shadow-dialog",
  "toast.tsx box-shadow glass|shadow-dialog",
])

/** Every pair of classes that can reach one element, writes one property, and `cn` keeps both. */
function collisions(file: string, source: string): string[] {
  const found = new Set<string>()
  for (const set of classSets(file, source))
    for (let i = 0; i < set.tokens.length; i++)
      for (let j = i + 1; j < set.tokens.length; j++) {
        const a = set.tokens[i]!
        const b = set.tokens[j]!
        if (a.token === b.token) continue
        if (!canCoexist(a, b)) continue
        const left = splitModifiers(a.token)
        const right = splitModifiers(b.token)
        // Different modifiers are different selectors, and which one paints is a question of
        // specificity and state rather than of emission order — `platform-state-cascade.test.ts`.
        if (left.modifiers.join(":") !== right.modifiers.join(":")) continue
        if (isEmphasis(left.utility, right.utility)) continue
        const properties = cssProperties(left.utility)
        const others = cssProperties(right.utility)
        if (!properties || !others) continue
        const shared = [...properties].filter((property) =>
          others.has(property)
        )
        if (shared.length === 0) continue
        // `cn` is the oracle for whether the pair survives: a stock pair merges and never races.
        if (cn(a.token, b.token).split(" ").length < 2) continue
        const [x, y] = [left.utility, right.utility].sort()
        const key = `${file} ${shared.sort()[0]} ${x}|${y}`
        if (!ACCEPTED.has(key)) found.add(key)
      }
  return [...found].sort()
}

describe("two named utilities never race for the same property", () => {
  test.each(componentModules())("$file", ({ file, source }) => {
    expect(collisions(file, source)).toEqual([])
  })

  test("the scan sees the collision that shipped, so an empty result cannot mean an empty input", () => {
    // `shadow-none`, written to clear a shadow the composed group brings, against the
    // `shadow-control` that draws the macOS stepper's bezel — in two arguments of one `cn`.
    const planted = `
      function Stepper({ className, vertical }) {
        return <div className={cn("rounded-stepper shadow-none", vertical && "shadow-control", className)} />
      }`
    expect(collisions("planted.tsx", planted)).toEqual([
      "planted.tsx box-shadow shadow-control|shadow-none",
    ])
  })

  test("a pair the two branches of one ternary keep apart is not a collision", () => {
    const planted = `const c = cn(vertical ? "shadow-control" : "shadow-none")`
    expect(collisions("planted.tsx", planted)).toEqual([])
  })

  test("a stock pair `cn` resolves is not a collision", () => {
    expect(
      collisions("planted.tsx", `const c = "rounded-md rounded-full"`)
    ).toEqual([])
  })
})
