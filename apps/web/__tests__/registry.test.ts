import { existsSync, readdirSync, readFileSync } from "node:fs"
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

  test('ships the hairline shadows via cssVars.theme, not a css["@theme"] block', () => {
    // Task 11 found `shadcn add` crashing on this exact value. Bisection traced it to a real
    // bug in shadcn 4.20/4.21's `update-css`: a plain string-valued declaration nested under
    // a top-level `"@theme"` (or `"@theme inline"`) `css` key is always routed through a
    // helper that treats the declaration's name as a nested rule selector and the value as
    // that rule's raw body — `.temp{0 0 0 0.5px var(--separator)}` isn't valid CSS, so it
    // throws. `cssVars.theme` merges into `@theme inline` through a separate, working code
    // path (a plain `O.decl`), so it renders the identical CSS without touching the broken
    // one. No item may ship a plain `css["@theme"]`/`css["@theme inline"]` key again.
    const base = registry.items.find((i) => i.name === "base")!
    expect(base.cssVars?.theme?.["shadow-hairline"]).toBe(
      "0 0 0 0.5px var(--separator)"
    )
    expect(base.cssVars?.theme?.["shadow-hairline-t"]).toBe(
      "inset 0 0.5px 0 var(--separator)"
    )
    expect(base.cssVars?.theme?.["shadow-hairline-b"]).toBe(
      "inset 0 -0.5px 0 var(--separator)"
    )
    for (const item of registry.items) {
      expect(Object.keys(item.css ?? {}), item.name).not.toContain("@theme")
      expect(Object.keys(item.css ?? {}), item.name).not.toContain(
        "@theme inline"
      )
    }
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
    expect(publishedContent(source, "components").split("\n")).toEqual([
      'import { useIsDesktop } from "@/hooks/use-media-query"',
      'import { platform } from "@/lib/platform"',
      'import { Dialog } from "@/components/ui/dialog"',
    ])
  })

  test("a sibling import resolves against the importing file's own directory", () => {
    const source = 'import type { Platform } from "./platform"'
    expect(publishedContent(source, "lib")).toBe(
      'import type { Platform } from "@/lib/platform"'
    )
    expect(publishedContent(source, "hooks")).toBe(
      'import type { Platform } from "@/hooks/platform"'
    )
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
      for (const key of Object.keys(item.cssVars?.theme ?? {}))
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

/**
 * Task 11's "New finding" (theme-inline-report.md): `globals.css`'s `@theme inline` block
 * registers 116 Tailwind theme names (69 `--color-*`, 24 `--radius-*`, 11 `--shadow-*`, 8
 * `--ease-*`, 4 `--font-*`), but only the four `--font-*` values ever reached a consumer
 * (via `fontVars()`, as a concrete `cssVars.light` value, because a `shadcn init` scaffold's
 * own boilerplate already carries the generic `--font-sans: var(--font-sans)` mapping). The
 * other 112 registrations are absent from every published item, so a named utility built on
 * one of them (`rounded-list`, `shadow-control`, `text-label`, …) never generates a rule in a
 * consumer's build — Tailwind never learns the name exists — even though the underlying
 * `--list-radius`/`--elevation-control`/`--label` value is right there in `base.cssVars`.
 *
 * This derives, empirically from the component sources (not from reading `globals.css`), the
 * exact set of named utilities `packages/ui/src/components/*.tsx` relies on, and asserts each
 * one is reachable from `base` — the item every idiom (`ios`/`macos`/`web`/`apple`) depends on.
 */
describe("named Tailwind utilities the components use are shipped, not just declared", () => {
  const items = buildRegistry().items
  const base = items.find((i) => i.name === "base")!

  const uiPackage = join(process.cwd(), "../../packages/ui")
  const componentDir = join(uiPackage, "src/components")
  const componentSource = readdirSync(componentDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => readFileSync(join(componentDir, f), "utf8"))
    .join("\n")
  const globalsCss = readFileSync(
    join(uiPackage, "src/styles/globals.css"),
    "utf8"
  )

  /** Brace-matches the first block opened by `marker` and returns its body. */
  function blockBody(css: string, marker: RegExp): string {
    const match = marker.exec(css)
    if (!match) return ""
    const start = match.index + match[0].length
    let depth = 1
    let end = start
    while (depth > 0 && end < css.length) {
      if (css[end] === "{") depth++
      if (css[end] === "}") depth--
      end++
    }
    return css.slice(start, end - 1)
  }

  /**
   * Every bare-name flat `--name: value;` declaration directly in `body` (not inside a
   * nested block like `@keyframes progress-indeterminate`, which isn't a theme registration).
   */
  function flatDeclarationNames(body: string): string[] {
    const names: string[] = []
    let i = 0
    while (i < body.length) {
      const rest = body.slice(i)
      const leading = rest.match(/^\s+/)
      if (leading) {
        i += leading[0].length
        continue
      }
      if (rest.startsWith("/*")) {
        const close = rest.indexOf("*/")
        i += close === -1 ? rest.length : close + 2
        continue
      }
      const open = rest.indexOf("{")
      const semi = rest.indexOf(";")
      if (open !== -1 && (semi === -1 || open < semi)) {
        let depth = 1
        let j = open + 1
        while (depth > 0 && j < rest.length) {
          if (rest[j] === "{") depth++
          if (rest[j] === "}") depth--
          j++
        }
        i += j
      } else if (semi !== -1) {
        const colon = rest.slice(0, semi).indexOf(":")
        if (colon !== -1) {
          const name = rest.slice(0, colon).trim()
          if (name.startsWith("--")) names.push(name.replace(/^--/, ""))
        }
        i += semi + 1
      } else break
    }
    return names
  }

  const declaredNames = flatDeclarationNames(
    blockBody(globalsCss, /@theme inline\s*\{/)
  )

  function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  /**
   * True if `candidate` occurs in `text` as a standalone Tailwind class token: preceded by
   * start-of-string, whitespace, a quote, or a variant-chaining `:`, and followed by
   * end-of-string, whitespace, a quote, or an opacity-modifier `/`. This is what tells a
   * plain named utility (`rounded-checkbox`) apart from a longer sibling (`text-label-2`
   * when searching for `text-label`) and from `var(--x)`/Tailwind's `(--x)` arbitrary-value
   * shorthand (there the preceding character is `-`, never in the allowed boundary set).
   */
  function usesNamedUtility(text: string, candidate: string): boolean {
    return new RegExp(
      `(?<=^|[\\s"'\`:])${escapeRegex(candidate)}(?=$|[\\s"'\`/])`
    ).test(text)
  }

  const UTILITY_PREFIXES: Readonly<Record<string, readonly string[]>> = {
    color: [
      "bg",
      "text",
      "border",
      "border-t",
      "border-r",
      "border-b",
      "border-l",
      "border-x",
      "border-y",
      "ring",
      "ring-offset",
      "outline",
      "decoration",
      "divide",
      "accent",
      "caret",
      "fill",
      "stroke",
      "from",
      "via",
      "to",
      "placeholder",
      "shadow",
    ],
    radius: [
      "rounded",
      "rounded-t",
      "rounded-r",
      "rounded-b",
      "rounded-l",
      "rounded-tl",
      "rounded-tr",
      "rounded-br",
      "rounded-bl",
      "rounded-s",
      "rounded-e",
    ],
    shadow: ["shadow"],
    ease: ["ease"],
    font: ["font"],
  }

  const usedNames = declaredNames.filter((name) => {
    const match = /^(color|radius|shadow|ease|font)-(.+)$/.exec(name)
    if (!match) return false
    const prefixes = UTILITY_PREFIXES[match[1]!] ?? []
    return prefixes.some((prefix) =>
      usesNamedUtility(componentSource, `${prefix}-${match[2]}`)
    )
  })

  test("the enumeration itself finds the utilities already known (from manual inspection) to be in use", () => {
    // A sanity check on the empirical method above, not on the production code: if this
    // fails, the enumeration is broken, not the registry.
    expect(usedNames).toEqual(
      expect.arrayContaining([
        "color-label",
        "color-fill-3",
        "color-primary",
        "radius-list",
        "radius-checkbox",
        "radius-alert",
        "radius-dialog",
        "radius-sheet",
        "radius-segmented",
        "radius-menu",
        "radius-control",
        "shadow-control",
        "shadow-dialog",
        "shadow-glass",
      ])
    )
  })

  test.each(usedNames)(
    "--%s is reachable from base's cssVars (theme, or a concrete value for --font-*)",
    (name) => {
      const shipped = name.startsWith("font-")
        ? base.cssVars?.light?.[name]
        : base.cssVars?.theme?.[name]
      expect(shipped).toBeTruthy()
    }
  )

  test("progress.tsx's animate-[progress-indeterminate_…] arbitrary value has a matching @keyframes shipped, since the bracket syntax needs no theme registration but still needs the rule to exist", () => {
    expect(componentSource).toContain("animate-[progress-indeterminate")
    expect(base.css?.["@keyframes progress-indeterminate"]).toBeTruthy()
  })
})

/**
 * A sibling import (`./platform`) means "the file next to me", and where that file lands in a
 * consumer depends on the importing file's own directory: `src/components/*` installs at
 * `components/ui/`, `src/lib/*` at `lib/`, `src/hooks/*` at `hooks/`. Rewriting every sibling
 * to `@/components/ui/` therefore breaks any lib or hook that imports its neighbour —
 * `lib/detect-platform.ts`'s `./platform` published as `@/components/ui/platform` while
 * `platform.tsx` installs at `@/lib/platform`, so the consumer's build failed on a missing
 * module. The guard that let it through only asserted no `./x` *survived*; it never asked
 * whether the target it was rewritten to is where that file actually installs.
 */
describe("rewritten imports point at where the file they name actually installs", () => {
  const items = buildRegistry().items

  /** The alias prefix the CLI installs each item under, from its registry type. */
  const ALIAS: Readonly<Record<string, string>> = {
    "registry:ui": "@/components/ui",
    "registry:lib": "@/lib",
    "registry:hook": "@/hooks",
  }
  const prefixOf = new Map(
    items.filter((i) => ALIAS[i.type]).map((i) => [i.name, ALIAS[i.type]!])
  )

  test("a lib module's sibling import resolves to @/lib, not @/components/ui", () => {
    const detect = items.find((i) => i.name === "detect-platform")!
    const content = publishItem(detect).files[0]!.content
    expect(content).toContain('from "@/lib/platform"')
    expect(content).not.toContain('from "@/components/ui/platform"')
  })

  test("every alias import in every published file names the directory that item installs into", () => {
    const problems: string[] = []
    for (const item of items) {
      for (const file of publishItem(item).files) {
        for (const match of file.content.matchAll(
          /from "(@\/(?:components\/ui|lib|hooks))\/([\w-]+)"/g
        )) {
          const expected = prefixOf.get(match[2]!)
          if (expected && expected !== match[1])
            problems.push(
              `${item.name} imports ${match[2]} as ${match[1]}, but it installs at ${expected}`
            )
        }
      }
    }
    expect(problems).toEqual([])
  })
})
