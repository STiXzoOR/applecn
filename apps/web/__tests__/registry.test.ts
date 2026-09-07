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

  test("ships the theme as a style item with light and dark variables plus the type and material utilities", () => {
    const style = registry.items.find((i) => i.type === "registry:style")!
    expect(style.name).toBe("apple")
    expect(style.cssVars?.light?.["system-blue"]).toBe("rgb(0 136 255)")
    expect(style.cssVars?.dark?.["system-blue"]).toBe("rgb(0 145 255)")
    expect(style.cssVars?.light?.primary).toBe("var(--accent-color)")
    expect(Object.keys(style.css ?? {})).toEqual(
      expect.arrayContaining([
        "@utility type-body",
        "@utility glass",
        '[data-platform="macos"]',
        '[data-platform="web"]',
        '.dark[data-platform="web"], .dark [data-platform="web"]',
        "@media (width >= 1069px)",
      ])
    )
    const macos = style.css?.['[data-platform="macos"]'] as Record<
      string,
      string
    >
    expect(macos["--control-height-regular"]).toBe("24px")
    expect(macos["--platform"]).toBe("macos")
  })

  test("ships the hairline shadows from the plain @theme block, not the @theme inline mapping", () => {
    const style = registry.items.find((i) => i.type === "registry:style")!
    const theme = style.css?.["@theme"] as Record<string, string>
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
    expect(Object.keys(style.css ?? {})).not.toContain("@theme inline")
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
      'import { cn } from "cn"',
    ].join("\n")
    expect(publishedContent(source).split("\n")).toEqual([
      'import { useIsDesktop } from "@/hooks/use-media-query"',
      'import { platform } from "@/lib/platform"',
      'import { Dialog } from "./dialog"',
      'import { cn } from "cn"',
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
  const style = registry.items.find((i) => i.type === "registry:style")!

  test("ships the base layer, so Dynamic Type and the touch rules travel", () => {
    const css = JSON.stringify(style.css)
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
