import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

const dir = join(import.meta.dirname, "../src/components")
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"))

describe("shadcn source conventions", () => {
  test.each(files)(
    "%s imports cn from the local lib, never a package",
    (file) => {
      const source = readFileSync(join(dir, file), "utf8")
      expect(source).not.toMatch(/from "cn"/)
      if (source.includes("cn("))
        expect(source).toMatch(/from "\.\.\/lib\/utils"/)
    }
  )
})

describe("no platform variants remain", () => {
  test.each(files)("%s uses tokens, not ios:/macos:/web:", (file) => {
    const source = readFileSync(join(dir, file), "utf8")
    expect(source).not.toMatch(/(?<![\w-])(ios|macos|web):/)
  })
})
