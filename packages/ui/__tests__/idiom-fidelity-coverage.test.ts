import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import {
  COMPONENTS_DIR,
  componentModules,
  exportedNames,
  paintedProperty,
  splitModifiers,
  topLevelDeclarations,
} from "./helpers/component-source"

/**
 * Meta-guard for the §7.2 fidelity harness (`idiom-fidelity.test.tsx`). That harness's control
 * table is hand-maintained, so nothing stops a newly built selectable control from shipping
 * without an entry in it — exactly the shape of gap that let a checked checkbox and a selected
 * radio ship invisible on the web idiom with 277 tests green (spec §4.5).
 *
 * This derives, from component source, every export that declares a selection-state paint rule and
 * asserts that export is rendered inside the harness. A component added in Phases 3–6 with such a
 * rule and no coverage fails here rather than passing quietly.
 *
 * Three things the first version of this guard got wrong, all of which the Phase 2 review found:
 *
 * 1. It matched `bg`/`border` only — the same two properties the harness itself could read — so a
 *    control drawing selection with text colour, opacity, a shadow or a sliding indicator was not
 *    merely uncovered, it was never *asked* to be covered. The guard could therefore only compel
 *    coverage the harness could already provide, which is not a gate that grows with the
 *    catalogue (ruling R20). The property list below is now everything a selection can be seen in.
 * 2. It answered per FILE. Any one export appearing as JSX text anywhere in the harness marked the
 *    whole file covered, including by prefix (`<CheckboxGroup` satisfying `checkbox.tsx` through
 *    `<Checkbox`). It now attributes each rule to the declaration that carries it, and matches the
 *    rendered name exactly.
 * 3. It read one flat directory of `.tsx`. §5.4's `chart` and `data-table` are subsystems, which
 *    is to say directories, and a `cva` lifted into a sibling `variants.ts` was invisible.
 */

const HARNESS_PATH = join(import.meta.dirname, "idiom-fidelity.test.tsx")
const START = "/* --- rendered controls"
const END = "/* --- end rendered controls --- */"

/**
 * Selection-state modifiers in use across the catalogue or shipped by Base UI for a future one,
 * verified 2026-09-08 against the primitives' `*DataAttributes` modules.
 */
const SELECTION_MODIFIERS = [
  "checked",
  "unchecked",
  "indeterminate",
  "pressed",
  "unpressed",
  "selected",
  "unselected",
  "on",
  "off",
  "active",
  "inactive",
]

const SELECTION = new Set(SELECTION_MODIFIERS.map((name) => `data-${name}`))

/**
 * A property that makes selection visible. `paintedProperty` covers the colours, the shadow and
 * the opacity; the rest are the ways a selection can be shown without changing a colour at all —
 * a knob that slides, a pill that scales, an icon that fills.
 */
function visibleProperty(utility: string): string | null {
  const painted = paintedProperty(utility)
  if (painted) return painted
  if (/^(?:translate|scale|rotate|skew)-/.test(utility)) return "transform"
  if (/^(?:fill|stroke)-/.test(utility)) return "svg-paint"
  return null
}

/** Does this class string declare a selection-state rule on a visible property? */
function declaresSelection(source: string): boolean {
  for (const [, block] of source.matchAll(/"([^"\n]*)"/g))
    for (const token of block!.split(/\s+/).filter(Boolean)) {
      const { modifiers, utility } = splitModifiers(token)
      if (!modifiers.some((modifier) => SELECTION.has(modifier))) continue
      if (visibleProperty(utility)) return true
    }
  return false
}

/**
 * Components whose selection rule cannot be reached by the harness's mechanism. Each entry is a
 * decision, not a default. The list is EMPTY, and that is the point: it held `toggle.tsx` and
 * `toggle-group.tsx` on the grounds that Base UI's Toggle emits `data-pressed` with no
 * `unpressed` twin. The premise was true and the conclusion was not — the limit was the harness's
 * own hardcoded `RESTING = "data-unchecked"`, and spec §5.3 was about to fold `segmented-control`
 * into `toggle-group`, landing the one component §5.3 rebuilds inside a file exempt by name. The
 * harness now expresses a resting state as the absence of the selected attribute, and both are
 * covered.
 */
const EXEMPT: Readonly<Record<string, string>> = {}

const harness = readFileSync(HARNESS_PATH, "utf8")
const start = harness.indexOf(START)
const end = harness.indexOf(END)
const rendered = harness.slice(start, end)

/** Is `Name` rendered as JSX in the harness — exactly, not as a prefix of a longer name? */
const isRendered = (name: string) =>
  new RegExp(`<${name}(?![A-Za-z0-9_])`).test(rendered)

interface Carrier {
  readonly file: string
  /** The declaration the rule is written in. */
  readonly declaration: string
  /** The exported components any of which being rendered covers it. */
  readonly required: string[]
}

/**
 * Every selection rule in the catalogue, attributed to the exported component that must be
 * rendered to cover it. A rule written in a shared `cva`/class-string constant belongs to
 * whichever components read that constant — `navigationMenuLinkClassName` is used by two.
 */
function carriers(): Carrier[] {
  const found: Carrier[] = []
  for (const { file, source } of componentModules()) {
    // Most of the catalogue exports at the bottom of the file rather than inline, so what makes a
    // declaration public is the export block, not an `export` keyword on the declaration itself.
    const exported = new Set(exportedNames(source))
    const declarations = topLevelDeclarations(source)
    const isComponent = (name: string) =>
      exported.has(name) && /^[A-Z]/.test(name)
    const components = declarations.filter(
      (declaration) =>
        isComponent(declaration.name) && declaration.body.includes("<")
    )
    for (const declaration of declarations) {
      if (!declaresSelection(declaration.body)) continue
      const required = isComponent(declaration.name)
        ? [declaration.name]
        : components
            .filter((component) =>
              new RegExp(`\\b${declaration.name}\\b`).test(component.body)
            )
            .map((component) => component.name)
      found.push({ file, declaration: declaration.name, required })
    }
  }
  return found
}

const all = carriers()
const toVerify = all.filter((carrier) => !EXEMPT[carrier.file])

describe("every selection rule is covered by the idiom-fidelity harness", () => {
  test("the harness's rendered controls were found", () => {
    expect(
      start,
      "harness marks where its rendered controls start"
    ).toBeGreaterThan(-1)
    expect(end, "harness marks where they end").toBeGreaterThan(start)
  })

  // A canary on the derivation itself: if the catalogue ever stopped declaring any selection rule
  // at all, that would mean this scan broke, not that coverage is complete.
  test("the scan finds rules to check", () => {
    expect(all.length).toBeGreaterThan(0)
    expect(new Set(all.map((carrier) => carrier.file)).size).toBeGreaterThan(1)
  })

  // A second canary, on the matching rather than the scanning: a planted rule in a module nobody
  // renders must be reported, or an empty result could mean the attribution is broken.
  test("an uncovered rule is actually detected", () => {
    const planted = topLevelDeclarations(
      'export function Unrendered() {\n  return <div className="data-checked:bg-primary" />\n}\n'
    )
    expect(planted.map((d) => d.name)).toEqual(["Unrendered"])
    expect(declaresSelection(planted[0]!.body)).toBe(true)
    expect(isRendered("Unrendered")).toBe(false)
  })

  for (const carrier of toVerify)
    test(`${carrier.file}'s ${carrier.declaration} is exercised in the harness`, () => {
      expect(
        carrier.required.length,
        `${carrier.file}'s ${carrier.declaration} declares a selection rule but no exported ` +
          `component reads it, so nothing can cover it`
      ).toBeGreaterThan(0)
      expect(
        carrier.required.some(isRendered),
        `${carrier.file} declares a selection rule in ${carrier.declaration}, but none of the ` +
          `components that carry it (${carrier.required.join(", ")}) are rendered in ` +
          `idiom-fidelity.test.tsx, and ${carrier.file} is not in this file's EXEMPT list`
      ).toBe(true)
    })

  // Nothing pruned the old list: a file whose selection rule was later removed simply dropped out
  // of the scan and kept its exemption forever, with no test naming it.
  test("no EXEMPT entry is stale", () => {
    const stale = Object.keys(EXEMPT).filter(
      (file) =>
        !existsSync(join(COMPONENTS_DIR, file)) ||
        !all.some((carrier) => carrier.file === file)
    )
    expect(
      stale,
      "these files are exempted from a rule they no longer declare, or no longer exist"
    ).toEqual([])
  })

  test("every EXEMPT entry argues its case", () => {
    for (const [file, reason] of Object.entries(EXEMPT))
      expect(
        reason.length,
        `${file}'s EXEMPT reason is argued`
      ).toBeGreaterThan(60)
  })
})
