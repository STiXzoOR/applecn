/**
 * Regenerates `__tests__/fixtures/geometry-contract.json` — which measured token, named radius,
 * text style and literal height each component reads. Run it, then READ THE DIFF: every line it
 * changes is a measured metric a component started or stopped reading, which spec §7.4 says must
 * not happen without a decision.
 *
 *   node scripts/build-geometry-contract.ts
 */
import { writeFileSync } from "node:fs"

import {
  componentModules,
  geometryContract,
} from "../__tests__/helpers/component-source.ts"

const target = new URL(
  "../__tests__/fixtures/geometry-contract.json",
  import.meta.url
)
const contract = Object.fromEntries(
  componentModules().map(({ file, source }) => [file, geometryContract(source)])
)
writeFileSync(target, `${JSON.stringify(contract, null, 2)}\n`)
console.log(
  `wrote ${target.pathname} — ${Object.keys(contract).length} modules`
)
