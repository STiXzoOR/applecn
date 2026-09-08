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

/**
 * `--available-height` and its siblings are emitted by a **Base UI positioner** — they come out
 * of `utils/CommonPositionerCssVars` when a `*Positioner` measures the space around its anchor.
 * Nothing else defines them: they are not in `tokens.css`, not in `globals.css`, and a module
 * that reads one without rendering a positioner resolves it to nothing at computed-value time.
 * The property then keeps its initial value and every rule built on it silently does nothing —
 * `command`'s result list capped its height with `--available-height` inside a `Dialog`, so
 * `max-height` stayed `none`, `overflow-y-auto` never engaged, and results below the fold were
 * unreachable with no scrollbar, no error and a green suite.
 */
const POSITIONER_VARS = [
  "--available-height",
  "--available-width",
  "--anchor-width",
  "--anchor-height",
]

/**
 * A READ, not a mention. Both forms a component reaches one of these with — `var(--x)` and
 * Tailwind's `max-h-(--x)` — put the name in parentheses, and the doc comments discuss these
 * variables by name, so a bare substring scan would report every file that explains itself.
 */
const reads = (source: string, name: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").includes(`(${name})`)

const positionerReaders = files.filter((file) =>
  POSITIONER_VARS.some((name) =>
    reads(readFileSync(join(dir, file), "utf8"), name)
  )
)

describe("a positioner's variables are only read inside a positioner", () => {
  test("the scan finds readers, so an empty result cannot mean an empty input", () => {
    expect(positionerReaders.length).toBeGreaterThan(0)
  })

  test("a mention in a comment is not a read, and a read is not missed", () => {
    expect(
      reads(
        "/* --available-height is (--available-height) */",
        "--available-height"
      )
    ).toBe(false)
    expect(
      reads('className="max-h-(--available-height)"', "--available-height")
    ).toBe(true)
    expect(
      reads("height: var(--available-height);", "--available-height")
    ).toBe(true)
  })

  test.each(positionerReaders)("%s renders the positioner it reads", (file) => {
    const source = readFileSync(join(dir, file), "utf8")
    const read = POSITIONER_VARS.filter((name) => reads(source, name))
    expect(
      source,
      `${file} reads ${read.join(", ")}, which only a Base UI positioner emits. Outside one ` +
        `the variable resolves to nothing and every rule built on it silently does nothing.`
    ).toMatch(/Positioner/)
  })
})
