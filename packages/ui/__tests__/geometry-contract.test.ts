import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { componentModules, geometryContract } from "./helpers/component-source"

/**
 * The measured-geometry gate (spec §7.4: "no measured metric changes"; §8's top risk is metric
 * drift during the thirteen rebuilds).
 *
 * Phase 2 shipped the fidelity harness with no automated assertion of this kind at all. Token
 * VALUES are tied to `docs/research/apple-design-system-reference.md` by
 * `src/tokens/__tests__/`, and 46 of 63 component test files happen to carry a geometry class
 * assertion — but both are hand-maintained and neither is required of a new component, so nothing
 * could see a rebuilt component start reading `--control-height-small` where it used to read
 * `--control-height-regular`. Task 14's browser pass caught that class of thing once, by hand, on
 * one day; it cannot gate Phases 3–6.
 *
 * So this records, per module, WHICH measured tokens, named radii, text styles and literal heights
 * it reads — not what they are worth, which the token fixtures already own. A rebuild that changes
 * the answer fails here, and closing the failure means running
 * `node scripts/build-geometry-contract.ts` and reading the diff: every changed line is a measured
 * metric a component started or stopped reading, which is a decision, not a formality.
 */

const CONTRACT = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "fixtures/geometry-contract.json"),
    "utf8"
  )
) as Record<string, string[]>

const modules = componentModules()

describe("every component reads the geometry it read before", () => {
  test("the contract covers the catalogue, and invents nothing", () => {
    expect(Object.keys(CONTRACT).sort()).toEqual(
      modules.map(({ file }) => file).sort()
    )
  })

  // A canary on the derivation: if the extraction broke, every module would read as geometry-free
  // and this test file would pass on an empty comparison for all of them.
  test("the derivation finds geometry to compare", () => {
    const total = modules.reduce(
      (sum, { source }) => sum + geometryContract(source).length,
      0
    )
    expect(total).toBeGreaterThan(300)
  })

  test.each(modules)("$file", ({ file, source }) => {
    expect(
      geometryContract(source),
      `${file} reads different measured geometry than the contract records. If that is ` +
        `intended, run \`node scripts/build-geometry-contract.ts\` and justify each changed ` +
        `line — spec §7.4's acceptance is that no measured metric changes.`
    ).toEqual(CONTRACT[file] ?? [])
  })
})
