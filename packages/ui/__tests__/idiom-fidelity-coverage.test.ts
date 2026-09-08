import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

/**
 * Meta-guard for the §7.2 fidelity harness (`idiom-fidelity.test.tsx`). That harness's `CONTROLS`
 * table is hand-maintained, so nothing stops a newly built selectable control from shipping
 * without an entry in it — exactly the shape of gap that let a checked checkbox and a selected
 * radio ship invisible on the web idiom with 277 tests green (spec §4.5).
 *
 * This derives, from `packages/ui/src/components/*.tsx` source, every component that declares a
 * selection-state colour rule — the same `data-checked`/`data-unchecked`/`data-pressed`/…
 * modifiers the harness itself parses in `selectionRules()` — and asserts that the component is
 * exercised inside the harness's `CONTROLS` table. A component added later in Phases 3–6 with such
 * a rule and no coverage (and no entry in this file's `EXEMPT` list) fails this test instead of
 * passing quietly.
 *
 * Scope: background/border colour rules only, matching what `idiom-fidelity.test.tsx`'s own
 * `paint()` resolves (`bg-`/`border-` utilities — `paint()` returns `null` for anything else, so a
 * `text-` only rule can never enter the harness's `selectionRules()` map). Two components declare a
 * text-only selection rule today (`segmented-control.tsx`'s `data-active:text-…`,
 * `navigation-menu.tsx`'s `data-active:text-label`) and are correctly outside this guard's reach:
 * they are not the "checked ≠ unchecked paint must stay visible" failure mode §4.5 was, and adding
 * them to `EXEMPT` for a rule they never trip would make the list dishonest busywork.
 */

const COMPONENTS_DIR = join(import.meta.dirname, "../src/components")
const HARNESS_PATH = join(import.meta.dirname, "idiom-fidelity.test.tsx")

/** Selection-state modifiers actually in use across the catalogue, verified 2026-09-08 by
 *  grepping every component for `data-<word>:(bg|border|text)-`. `data-selected`/`data-on` are
 *  not in use anywhere yet; they are listed because Base UI ships both spellings and a future
 *  component may reach for either. */
const SELECTION_MODIFIERS = new Set([
  "checked",
  "unchecked",
  "indeterminate",
  "pressed",
  "selected",
  "on",
])

const RULE = new RegExp(
  `data-(?:${[...SELECTION_MODIFIERS].join("|")}):(?:bg|border)-`
)

/**
 * Components whose selection-state colour rule cannot be reached by the harness's mechanism.
 * Each entry is a decision, not a default — keep this list short, and delete an entry the moment
 * its component becomes coverable.
 */
const EXEMPT: Readonly<Record<string, string>> = {
  // Base UI's Toggle sets `data-pressed` only when true — `ToggleDataAttributes` (see
  // @base-ui/react/toggle/ToggleDataAttributes.js) exports `pressed` and `disabled`, no
  // `unpressed`/`off` twin. The harness's RESTING constant is the literal string
  // "data-unchecked": with no opposite attribute to pair against, `selectionRules()`'s
  // checked-and-resting-rule requirement can never be satisfied for this component. Its pressed
  // fill (`--toggle-*`, not per-idiom in the token layer) is exercised by Task 14's browser pass.
  "toggle.tsx":
    "data-pressed has no data-unpressed twin (Base UI ToggleDataAttributes); the harness's " +
    "checked/resting pairing cannot apply.",
  // ToggleGroupItem renders the same Toggle primitive as toggle.tsx — identical limitation.
  "toggle-group.tsx":
    "ToggleGroupItem renders Base UI's Toggle primitive: same data-pressed-only limitation as " +
    "toggle.tsx.",
}

/** The identifiers one component file exports, the way the harness would import and render them. */
function exportedIdentifiers(source: string): string[] {
  const names = new Set<string>()
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g))
    for (const raw of match[1]!.split(","))
      if (raw.trim())
        names.add(
          raw
            .trim()
            .split(/\s+as\s+/)
            .pop()!
            .trim()
        )
  for (const match of source.matchAll(
    /export\s+(?:default\s+)?function\s+([A-Z]\w*)/g
  ))
    names.add(match[1]!)
  return [...names]
}

const harnessSource = readFileSync(HARNESS_PATH, "utf8")
const controlsStart = harnessSource.indexOf("const CONTROLS")
const controlsEnd = harnessSource.indexOf('describe("selection is visible')
const controlsBlock = harnessSource.slice(controlsStart, controlsEnd)

const componentFiles = readdirSync(COMPONENTS_DIR).filter((name) =>
  name.endsWith(".tsx")
)
const withSelectionColour = componentFiles.filter((file) =>
  RULE.test(readFileSync(join(COMPONENTS_DIR, file), "utf8"))
)
const toVerify = withSelectionColour.filter((file) => !EXEMPT[file])
const exempted = withSelectionColour.filter((file) => EXEMPT[file])

describe("every selection-colour rule is covered by the idiom-fidelity harness", () => {
  test("the harness's CONTROLS table was found", () => {
    expect(controlsStart, "harness declares CONTROLS").toBeGreaterThan(-1)
    expect(
      controlsEnd,
      "harness declares the selection-visibility describe block"
    ).toBeGreaterThan(controlsStart)
  })

  // A canary on the derivation itself: if the catalogue ever stopped declaring any selection
  // colour rule at all, that would mean this regex broke, not that coverage is complete.
  test("the scan finds components to check", () => {
    expect(withSelectionColour.length).toBeGreaterThan(0)
  })

  for (const file of toVerify)
    test(`${file} is exercised in the CONTROLS table`, () => {
      const identifiers = exportedIdentifiers(
        readFileSync(join(COMPONENTS_DIR, file), "utf8")
      )
      const covered = identifiers.some(
        (name) => controlsBlock.indexOf(`<${name}`) !== -1
      )
      expect(
        covered,
        `${file} declares a selection colour rule but none of its exports ` +
          `(${identifiers.join(", ") || "none found"}) are rendered inside idiom-fidelity.test.tsx's ` +
          `CONTROLS table, and ${file} is not in this file's EXEMPT list`
      ).toBe(true)
    })

  for (const file of exempted)
    test(`${file} has a documented EXEMPT reason`, () => {
      expect(
        EXEMPT[file]?.length,
        `${file}'s EXEMPT reason is not empty`
      ).toBeGreaterThan(0)
    })
})
