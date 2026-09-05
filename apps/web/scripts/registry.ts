import { writeFileSync } from "node:fs"

import { buildRegistry } from "./registry-data.ts"

const target = new URL("../registry.json", import.meta.url)
writeFileSync(target, JSON.stringify(buildRegistry(), null, 2) + "\n")
console.log(`wrote ${target.pathname}`)
