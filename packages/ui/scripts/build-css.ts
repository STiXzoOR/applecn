import { writeFileSync } from "node:fs"

import { renderTokensCss } from "../src/tokens/css.ts"

const target = new URL("../src/styles/tokens.css", import.meta.url)
writeFileSync(target, renderTokensCss())
console.log(`wrote ${target.pathname}`)
