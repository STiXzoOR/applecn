import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { buildRegistry } from "@/scripts/registry-data"

const root = join(process.cwd(), "../..")
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root })
  .toString()
  .split("\0")
  .filter(Boolean)

/** History: the earlier spec and plan, and the verbatim research captures. */
const history = /^(docs\/superpowers\/|docs\/research\/)/
const binary = /\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$/
/** This file names the strings it hunts for. */
const self = "apps/web/__tests__/repo.test.ts"

/**
 * Registry item names the install commands mention: `@applecn/<name>` on a
 * `shadcn@latest add` line (the package scope `@applecn/ui` is not an item), or
 * `/r/<name>.json` anywhere.
 */
export function registryNamesIn(markdown: string): string[] {
  const names = new Set<string>()
  for (const line of markdown.split("\n")) {
    if (!line.includes("shadcn@latest add")) continue
    for (const m of line.matchAll(/@applecn\/([a-z0-9-]+)/g)) names.add(m[1]!)
  }
  for (const m of markdown.matchAll(/\/r\/([a-z0-9-]+)\.json/g))
    names.add(m[1]!)
  return [...names]
}

describe("repository hygiene", () => {
  test("no tracked file outside the history folders still says apple-ds or <your-host>", () => {
    const stale = tracked.filter((f) => {
      if (f === self || history.test(f) || binary.test(f)) return false
      if (!existsSync(join(root, f))) return false // deleted, not yet committed
      const text = readFileSync(join(root, f), "utf8")
      return text.includes("apple-ds") || text.includes("<your-host>")
    })
    expect(stale).toEqual([])
  })

  test.each(["README.md", ".agents/skills/applecn/SKILL.md"])(
    "every registry item %s installs exists",
    (file) => {
      const items = new Set(buildRegistry().items.map((i) => i.name))
      const mentioned = registryNamesIn(readFileSync(join(root, file), "utf8"))
      expect(mentioned.length).toBeGreaterThan(0)
      expect(mentioned.filter((n) => !items.has(n))).toEqual([])
    }
  )

  test("the skill has the frontmatter the skills CLI needs", () => {
    const skill = readFileSync(
      join(root, ".agents/skills/applecn/SKILL.md"),
      "utf8"
    )
    expect(skill).toMatch(/^---\nname: applecn\ndescription: /)
  })

  /**
   * Task 15's five renames each moved a component's file, exports and registry entry, and each
   * time SKILL.md's catalogue had to be edited by hand — with nothing to fail if it was not. The
   * `@applecn/<name>` check above only reads `shadcn@latest add` lines, and the catalogue does not
   * install anything, so `preview-card`, `disclosure-group`, `passcode-field`, `menu` and `sheet`
   * could all have survived there behind a green suite. This closes that: the catalogue is the
   * component list, exactly, so a rename fails here and so does a component built without a docs
   * entry.
   */
  test("SKILL.md's catalogue is exactly the components that exist", () => {
    const catalogue = [
      ...readFileSync(
        join(root, ".agents/skills/applecn/SKILL.md"),
        "utf8"
      ).matchAll(/^- `([a-z0-9-]+)` — /gm),
    ].map(([, name]) => name!)
    const components = readdirSync(join(root, "packages/ui/src/components"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => f.replace(/\.tsx$/, ""))
    expect(
      catalogue.filter((n) => !components.includes(n)),
      "SKILL.md documents a component that no longer exists — renamed, or deleted"
    ).toEqual([])
    expect(
      components.filter((n) => !catalogue.includes(n)),
      "a component exists that SKILL.md's catalogue does not document"
    ).toEqual([])
  })
})
