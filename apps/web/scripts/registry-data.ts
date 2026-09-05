import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { tokenVars } from "@applecn/ui/tokens/css"

import { REGISTRY_URL, SITE_URL } from "../lib/site.ts"
import { componentDocs } from "../registry/index.ts"

/**
 * Builds the shadcn `registry.json` for `@applecn/ui` from the package sources: one
 * `registry:ui` item per component (dependencies read from its imports), the hooks and lib
 * modules, and an `apple` style item carrying every token as `cssVars` plus the `type-*`,
 * material, glass, hairline and press utilities as `css`. `shadcn build` turns this into
 * `public/r/<name>.json`, which any project can `shadcn add` from.
 */
export interface RegistryFile {
  path: string
  type: string
  target?: string
}

export interface RegistryItem {
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  cssVars?: { light?: Record<string, string>; dark?: Record<string, string> }
  css?: Record<string, unknown>
}

export interface Registry {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
}

export interface PublishedFile extends RegistryFile {
  content: string
}

/** What `public/r/<name>.json` holds: the item plus each file's content. */
export interface PublishedItem extends Omit<RegistryItem, "files"> {
  $schema: string
  files: PublishedFile[]
}

/** Where the package lives relative to this app; `shadcn build` runs with it as cwd. */
const UI_PACKAGE = "../../packages/ui"
const IGNORED_PACKAGES = new Set(["react", "react-dom"])

function readSource(relative: string): string {
  return readFileSync(join(process.cwd(), relative), "utf8")
}

function packageName(specifier: string): string {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0]!
}

function imports(source: string): {
  dependencies: string[]
  registryDependencies: string[]
} {
  const dependencies = new Set<string>()
  const registryDependencies = new Set<string>()
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const specifier = match[1]!
    if (specifier.startsWith(".")) {
      const name = specifier
        .split("/")
        .pop()!
        .replace(/\.tsx?$/, "")
      // Absolute, so the CLI never resolves a bare name against shadcn's own registry.
      if (name !== "colors" && name !== "metrics" && name !== "typography")
        registryDependencies.add(`${REGISTRY_URL}/${name}.json`)
    } else {
      const name = packageName(specifier)
      if (!IGNORED_PACKAGES.has(name)) dependencies.add(name)
    }
  }
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
  }
}

function item(
  kind: "ui" | "hook" | "lib",
  dir: string,
  file: string,
  title: string,
  description: string
): RegistryItem {
  // Relative to the package, never to this app: the CLI refuses a published path with
  // `..` in it, and derives components/ui, hooks/ and lib/ from `src/<dir>/<file>`.
  const path = `src/${dir}/${file}`
  const { dependencies, registryDependencies } = imports(
    readSource(`${UI_PACKAGE}/${path}`)
  )
  return {
    name: file.replace(/\.tsx?$/, ""),
    type: `registry:${kind}`,
    title,
    description,
    ...(dependencies.length ? { dependencies } : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files: [{ path, type: `registry:${kind}` }],
  }
}

/**
 * The content a consumer receives. Components import siblings relatively (`./dialog`), which
 * survives the copy into `components/ui/`, but `../hooks/<name>` would point at
 * `components/hooks/`. The CLI maps `@/hooks/…` and `@/lib/…` to the consumer's aliases, so
 * those two directories are rewritten to that form; the package sources stay relative.
 */
export function publishedContent(source: string): string {
  return source.replace(/from "\.\.\/(hooks|lib)\//g, 'from "@/$1/')
}

export function publishItem(entry: RegistryItem): PublishedItem {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...entry,
    files: entry.files.map((file) => ({
      ...file,
      content: publishedContent(readSource(`${UI_PACKAGE}/${file.path}`)),
    })),
  }
}

/** Parses the `@utility` blocks of globals.css into the nested object shape the `css` field takes. */
function utilities(css: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const pattern = /@utility ([\w-]+) \{/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(css))) {
    const start = match.index + match[0].length
    let depth = 1
    let end = start
    while (depth > 0 && end < css.length) {
      if (css[end] === "{") depth++
      if (css[end] === "}") depth--
      end++
    }
    result[`@utility ${match[1]}`] = parseBlock(css.slice(start, end - 1))
  }
  return result
}

function parseBlock(body: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  let i = 0
  while (i < body.length) {
    const rest = body.slice(i)
    const lead = rest.match(/^\s+/)
    if (lead) {
      i += lead[0].length
      continue
    }
    const open = rest.indexOf("{")
    const semi = rest.indexOf(";")
    if (open !== -1 && (semi === -1 || open < semi)) {
      const selector = rest.slice(0, open).trim()
      let depth = 1
      let j = open + 1
      while (depth > 0 && j < rest.length) {
        if (rest[j] === "{") depth++
        if (rest[j] === "}") depth--
        j++
      }
      out[selector] = parseBlock(rest.slice(open + 1, j - 1))
      i += j
    } else if (semi !== -1) {
      const declaration = rest.slice(0, semi)
      const colon = declaration.indexOf(":")
      if (colon !== -1)
        out[declaration.slice(0, colon).trim()] = declaration
          .slice(colon + 1)
          .trim()
      i += semi + 1
    } else {
      break
    }
  }
  return out
}

export function buildRegistry(): Registry {
  const components = readdirSync(
    join(process.cwd(), UI_PACKAGE, "src/components")
  )
    .filter((f) => f.endsWith(".tsx"))
    .sort()
  const docs = new Map(componentDocs.map((d) => [d.name, d]))

  const ui = components.map((file) => {
    const name = file.replace(/\.tsx$/, "")
    const doc = docs.get(name)
    return item(
      "ui",
      "components",
      file,
      doc?.title ?? name,
      doc?.description ?? ""
    )
  })

  const hooks: RegistryItem[] = [
    item(
      "hook",
      "hooks",
      "use-media-query.ts",
      "useMediaQuery",
      "Tracks a media query; useIsDesktop is the sheet breakpoint."
    ),
    item(
      "hook",
      "hooks",
      "use-scroll-collapse.ts",
      "useScrollCollapse",
      "Reports when a large title has scrolled under the bar."
    ),
  ]

  const lib: RegistryItem[] = [
    item("lib", "lib", "utils.ts", "cn", "Class merging."),
    item(
      "lib",
      "lib",
      "platform.tsx",
      "Platform",
      "PlatformProvider and usePlatform: the iOS/macOS idiom switch."
    ),
    item(
      "lib",
      "lib",
      "contrast.ts",
      "Contrast",
      "WCAG luminance, compositing and contrast ratio."
    ),
  ]

  const style: RegistryItem = {
    name: "apple",
    type: "registry:style",
    title: "Apple",
    description:
      "Every Apple token as CSS variables (light and dark) plus the type, material, glass, hairline and press utilities.",
    files: [],
    cssVars: { light: tokenVars("light"), dark: tokenVars("dark") },
    css: utilities(readSource(`${UI_PACKAGE}/src/styles/globals.css`)),
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "applecn",
    homepage: SITE_URL,
    items: [style, ...ui, ...hooks, ...lib],
  }
}
