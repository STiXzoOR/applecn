import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

import { componentDocs } from "@/registry/index"
import { REGISTRY_URL, SITE_URL } from "@/lib/site"
import {
  buildRegistry,
  publishItem,
  publishedContent,
} from "@/scripts/registry-data"

const registry = buildRegistry()

describe("registry", () => {
  test("is named applecn and points at the site", () => {
    expect(registry.name).toBe("applecn")
    expect(registry.homepage).toBe(SITE_URL)
  })

  test("has a registry:ui item per component, each pointing at the package source", () => {
    const ui = registry.items.filter((i) => i.type === "registry:ui")
    expect(ui.map((i) => i.name).sort()).toEqual(
      componentDocs.map((d) => d.name).sort()
    )
    for (const item of ui) {
      for (const file of item.files) {
        expect(
          existsSync(join(process.cwd(), "../../packages/ui", file.path)),
          `${item.name}: ${file.path}`
        ).toBe(true)
      }
    }
  })

  test("registry dependencies are absolute URLs, so a bare name never resolves against shadcn's own registry", () => {
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        expect(dep, item.name).toMatch(
          new RegExp(`^${REGISTRY_URL}/[a-z0-9-]+\\.json$`)
        )
      }
    }
  })

  test("file paths are relative to the package with no traversal, so the CLI accepts them and derives the install location", () => {
    // shadcn rejects any `..` in a published path; `src/<dir>/<file>` resolves to
    // components/ui, hooks/ and lib/ in the consumer without a `target`.
    for (const item of registry.items) {
      for (const file of item.files) {
        expect(file.path, item.name).toMatch(
          /^src\/(components|hooks|lib)\/[\w-]+\.tsx?$/
        )
      }
    }
  })

  test("local imports become registry dependencies and packages become dependencies", () => {
    const tabs = registry.items.find((i) => i.name === "tabs")!
    expect(tabs.registryDependencies).toContain(
      `${REGISTRY_URL}/segmented-control.json`
    )
    expect(tabs.dependencies).toContain("@base-ui/react")
    const icon = registry.items.find((i) => i.name === "icon")!
    expect(icon.dependencies).toEqual(
      expect.arrayContaining(["@hugeicons/react", "class-variance-authority"])
    )
    expect(icon.registryDependencies).toContain(`${REGISTRY_URL}/utils.json`)
  })

  test("ships the theme as a style item depending on base, carrying only the three idiom scopes", () => {
    const style = registry.items.find((i) => i.type === "registry:style")!
    expect(style.name).toBe("apple")
    expect(style.registryDependencies).toContain(`${REGISTRY_URL}/base.json`)
    // the primitives and utilities now live on `base`, not inlined here again.
    expect(style.cssVars).toBeUndefined()
    expect(Object.keys(style.css ?? {})).toEqual(
      expect.arrayContaining([
        '[data-platform="macos"]',
        '[data-platform="web"]',
        '.dark[data-platform="web"], .dark [data-platform="web"]',
        "@media (width >= 1069px)",
      ])
    )
    expect(Object.keys(style.css ?? {})).not.toContain("@utility type-body")
    const macos = style.css?.['[data-platform="macos"]'] as Record<
      string,
      string
    >
    expect(macos["--control-height-regular"]).toBe("24px")
    expect(macos["--platform"]).toBe("macos")
  })

  test("base carries every primitive as cssVars, light and dark", () => {
    const base = registry.items.find((i) => i.name === "base")!
    expect(base.type).toBe("registry:theme")
    expect(base.cssVars?.light?.["system-blue"]).toBe("rgb(0 136 255)")
    expect(base.cssVars?.dark?.["system-blue"]).toBe("rgb(0 145 255)")
    expect(base.cssVars?.light?.primary).toBe("var(--accent-color)")
  })

  test("ships the hairline shadows from the plain @theme block, not the @theme inline mapping", () => {
    const base = registry.items.find((i) => i.name === "base")!
    const theme = base.css?.["@theme"] as Record<string, string>
    expect(theme["--shadow-hairline"]).toBe("0 0 0 0.5px var(--separator)")
    expect(theme["--shadow-hairline-t"]).toBe(
      "inset 0 0.5px 0 var(--separator)"
    )
    expect(theme["--shadow-hairline-b"]).toBe(
      "inset 0 -0.5px 0 var(--separator)"
    )
    // the large `@theme inline { … }` mapping is a separate block and must not ship as a
    // side effect of extracting the plain one.
    expect(theme["--color-background"]).toBeUndefined()
    expect(Object.keys(base.css ?? {})).not.toContain("@theme inline")
  })

  test("base carries the type and material utilities", () => {
    const base = registry.items.find((i) => i.name === "base")!
    expect(Object.keys(base.css ?? {})).toEqual(
      expect.arrayContaining(["@utility type-body", "@utility glass"])
    )
  })

  test("ships the hooks and lib modules", () => {
    expect(
      registry.items
        .filter((i) => i.type === "registry:hook")
        .map((i) => i.name)
        .sort()
    ).toEqual([
      "use-color-scheme",
      "use-media-query",
      "use-reduced-motion",
      "use-scroll-collapse",
    ])
    expect(
      registry.items
        .filter((i) => i.type === "registry:lib")
        .map((i) => i.name)
        .sort()
    ).toEqual(["contrast", "detect-platform", "platform", "utils"])
  })

  test("published content rewrites cross-directory relative imports to the alias form the CLI maps", () => {
    const source = [
      'import { useIsDesktop } from "../hooks/use-media-query"',
      'import { platform } from "../lib/platform"',
      'import { Dialog } from "./dialog"',
    ].join("\n")
    expect(publishedContent(source).split("\n")).toEqual([
      'import { useIsDesktop } from "@/hooks/use-media-query"',
      'import { platform } from "@/lib/platform"',
      'import { Dialog } from "@/components/ui/dialog"',
    ])
  })

  test("published items carry each file's content and never a ../ import", () => {
    const sheet = publishItem(registry.items.find((i) => i.name === "sheet")!)
    expect(sheet.$schema).toBe(
      "https://ui.shadcn.com/schema/registry-item.json"
    )
    expect(sheet.files[0]!.content).toContain('from "@/hooks/use-media-query"')
    for (const item of registry.items) {
      for (const file of publishItem(item).files) {
        expect(file.content, `${item.name}: ${file.path}`).not.toMatch(
          /from "\.\.\//
        )
      }
    }
  })

  test("the committed registry.json is the generator output", () => {
    const committed = JSON.parse(
      readFileSync(join(process.cwd(), "registry.json"), "utf8")
    )
    expect(committed).toEqual(registry)
  })
})

describe("a consumer gets everything the components need", () => {
  const registry = buildRegistry()
  const base = registry.items.find((i) => i.name === "base")!

  test("ships the base layer, so Dynamic Type and the touch rules travel", () => {
    const css = JSON.stringify(base.css)
    expect(css).toContain("-apple-system-body")
    expect(css).toContain("touch-action")
  })

  test("declares tw-animate-css, which every overlay animation needs", () => {
    const animated = registry.items.filter((i) =>
      publishItem(i).files.some((f) => /\banimate-(in|out)\b/.test(f.content))
    )
    expect(animated.length).toBeGreaterThan(0)
    for (const item of animated)
      expect(item.dependencies, item.name).toContain("tw-animate-css")
  })

  test("no item still depends on the cn package", () => {
    for (const item of registry.items)
      expect(item.dependencies ?? [], item.name).not.toContain("cn")
  })
})

test("published sources import siblings by alias, as shadcn does", () => {
  for (const item of buildRegistry().items)
    for (const file of publishItem(item).files)
      expect(file.content, item.name).not.toMatch(/from "\.\/[a-z-]+"/)
})

describe("the three idiom themes", () => {
  const items = buildRegistry().items

  test.each(["ios", "macos", "web"])(
    "%s installs one idiom's scope",
    (name) => {
      const theme = items.find((i) => i.name === name)!
      expect(theme.type).toBe("registry:theme")
      const keys = Object.keys(theme.css ?? {})
      expect(keys).toContain(`[data-platform="${name}"]`)
      for (const other of ["ios", "macos", "web"].filter((p) => p !== name))
        expect(keys).not.toContain(`[data-platform="${other}"]`)
    }
  )

  test("the apple style item still carries all three", () => {
    const style = items.find((i) => i.name === "apple")!
    const keys = Object.keys(style.css ?? {})
    for (const p of ["ios", "macos", "web"])
      expect(keys).toContain(`[data-platform="${p}"]`)
  })

  test.each([
    ["ios", 2],
    ["macos", 2],
    ["web", 4],
  ] as const)("%s carries exactly %i top-level css keys", (name, count) => {
    const theme = items.find((i) => i.name === name)!
    expect(Object.keys(theme.css ?? {})).toHaveLength(count)
  })

  test("only the web theme carries apple.com's responsive type ramp", () => {
    const web = items.find((i) => i.name === "web")!
    expect(Object.keys(web.css ?? {})).toEqual(
      expect.arrayContaining([
        "@media (width >= 735px)",
        "@media (width >= 1069px)",
      ])
    )
    for (const name of ["ios", "macos"]) {
      const theme = items.find((i) => i.name === name)!
      for (const key of Object.keys(theme.css ?? {}))
        expect(key, name).not.toMatch(/^@media/)
    }
  })
})

/**
 * Task 11 found the base token layer (`--system-blue`, `--font-sans`, …) orphaned: nothing
 * declared it as a `registryDependency`, so a real `shadcn add @applecn/ios` installed a
 * platform scope whose every value dereferenced a variable that was never installed. These
 * tests hold the fix: `base` carries the shared layer, and every idiom (plus `apple`) pulls
 * it in transitively.
 */
describe("the shared base layer reaches every idiom", () => {
  const items = buildRegistry().items
  const byName = new Map(items.map((i) => [i.name, i]))
  const nameFromUrl = (url: string) =>
    url.replace(/^.*\//, "").replace(/\.json$/, "")

  function closureNames(name: string, seen = new Set<string>()): Set<string> {
    if (seen.has(name)) return seen
    seen.add(name)
    for (const dep of byName.get(name)?.registryDependencies ?? [])
      closureNames(nameFromUrl(dep), seen)
    return seen
  }

  /** Every `--custom-property` declared as a key anywhere in an item's `css` (recursively). */
  function collectDeclared(node: unknown, into: Set<string>): void {
    if (!node || typeof node !== "object") return
    for (const [key, value] of Object.entries(
      node as Record<string, unknown>
    )) {
      if (key.startsWith("--")) into.add(key)
      collectDeclared(value, into)
    }
  }

  /** Every `var(--custom-property` reference anywhere in an item's `css` or `cssVars`. */
  function collectReferenced(node: unknown, into: Set<string>): void {
    if (typeof node === "string") {
      for (const m of node.matchAll(/var\((--[\w-]+)/g)) into.add(m[1]!)
      return
    }
    if (!node || typeof node !== "object") return
    for (const value of Object.values(node as Record<string, unknown>))
      collectReferenced(value, into)
  }

  /** Every variable an install of `name` transitively defines, via cssVars or css. */
  function definedByClosure(name: string): Set<string> {
    const defined = new Set<string>()
    for (const dep of closureNames(name)) {
      const item = byName.get(dep)
      if (!item) continue
      for (const key of Object.keys(item.cssVars?.light ?? {}))
        defined.add(`--${key}`)
      for (const key of Object.keys(item.cssVars?.dark ?? {}))
        defined.add(`--${key}`)
      collectDeclared(item.css, defined)
    }
    return defined
  }

  test.each(["ios", "macos", "web", "apple"])(
    "installing %s transitively defines --system-blue and --font-sans",
    (name) => {
      const defined = definedByClosure(name)
      expect(defined.has("--system-blue")).toBe(true)
      expect(defined.has("--font-sans")).toBe(true)
    }
  )

  test("no theme-shaped item's own css or cssVars dereferences a variable its dependency closure doesn't define", () => {
    const problems: string[] = []
    for (const item of items) {
      if (!item.css && !item.cssVars) continue
      const referenced = new Set<string>()
      collectReferenced(item.css, referenced)
      collectReferenced(item.cssVars, referenced)
      const defined = definedByClosure(item.name)
      for (const ref of referenced)
        if (!defined.has(ref)) problems.push(`${item.name} references ${ref}`)
    }
    expect(problems).toEqual([])
  })
})
