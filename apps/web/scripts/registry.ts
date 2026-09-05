import { mkdirSync, writeFileSync } from "node:fs"

import { buildRegistry, publishItem } from "./registry-data.ts"

/**
 * Writes `registry.json` (committed, tested against the generator) and the published form
 * under `public/r/`: the same index plus one `<name>.json` per item with file contents,
 * which is what `shadcn add` fetches.
 */
const registry = buildRegistry()
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n"

const registryFile = new URL("../registry.json", import.meta.url)
writeFileSync(registryFile, json(registry))

const out = new URL("../public/r/", import.meta.url)
mkdirSync(out, { recursive: true })
writeFileSync(new URL("registry.json", out), json(registry))
for (const item of registry.items) {
  writeFileSync(new URL(`${item.name}.json`, out), json(publishItem(item)))
}
console.log(
  `wrote ${registryFile.pathname} and ${registry.items.length} items to ${out.pathname}`
)
