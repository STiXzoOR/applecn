import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { tokenPlatformCss, tokenVars } from "@applecn/ui/tokens/css"

import { REGISTRY_URL, SITE_URL } from "../lib/site.ts"
import { componentDocs } from "../registry/index.ts"
import { themeItems } from "./themes.ts"

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
  cssVars?: {
    light?: Record<string, string>
    dark?: Record<string, string>
    // Merges into the consumer's `@theme inline` via a plain `postcss` declaration — unlike
    // a top-level `css["@theme"]`/`css["@theme inline"]` key, which shadcn 4.20/4.21 cannot
    // merge (task 11: it treats a string-valued entry's name as a nested rule selector and
    // its value as that rule's body, so a plain `--x: 1px` crashes `update-css`).
    theme?: Record<string, string>
  }
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

/** Every overlay animation needs this; `globals.css` imports it, so items must declare it too. */
const USES_ANIMATE = /\banimate-(in|out)\b/

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
  const source = readSource(`${UI_PACKAGE}/${path}`)
  const { dependencies, registryDependencies } = imports(source)
  if (USES_ANIMATE.test(source) && !dependencies.includes("tw-animate-css")) {
    dependencies.push("tw-animate-css")
    dependencies.sort()
  }
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
 * The content a consumer receives. Package sources import relatively, but `../hooks/<name>`
 * and `../lib/<name>` would point at `components/hooks/` and `components/lib/` once copied
 * into `components/ui/`, and a sibling import like `./dialog` would too, once `checkbox`
 * imports `./icon` and `icon` isn't necessarily copied alongside it. So every relative import
 * is rewritten to the alias form the CLI maps: `@/hooks/…`, `@/lib/…`, `@/components/ui/…`.
 */
export function publishedContent(source: string): string {
  return source
    .replace(/from "\.\.\/(hooks|lib)\//g, 'from "@/$1/')
    .replace(/from "\.\/([a-z-]+)"/g, 'from "@/components/ui/$1"')
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

/**
 * Parses the plain `@theme { … }` block (not the large `@theme inline { … }` mapping, which
 * stays internal) into a flat, bare-name `cssVars.theme` map — not a `css["@theme"]` entry.
 * shadcn 4.20/4.21's `update-css` cannot merge a plain string-valued declaration nested under
 * a top-level `"@theme"`/`"@theme inline"` `css` key: it treats the declaration's own name as
 * a nested rule selector and its value as that rule's body, so `--shadow-hairline: 0 0 0
 * 0.5px var(--separator)` becomes the invalid rule `.temp{0 0 0 0.5px var(--separator)}` and
 * throws (task 11; confirmed with an unrelated trivial value, so it isn't specific to this
 * declaration's syntax, and confirmed still present in the latest published CLI release).
 * `cssVars.theme` merges into `@theme inline` through a separate, working code path — a
 * plain `postcss` declaration append — so it renders the identical CSS without touching the
 * broken one.
 */
function theme(css: string): Record<string, string> {
  const match = /@theme\s*\{/.exec(css)
  if (!match) return {}
  const start = match.index + match[0].length
  let depth = 1
  let end = start
  while (depth > 0 && end < css.length) {
    if (css[end] === "{") depth++
    if (css[end] === "}") depth--
    end++
  }
  const declarations = parseBlock(css.slice(start, end - 1)) as Record<
    string,
    string
  >
  return Object.fromEntries(
    Object.entries(declarations).map(([name, value]) => [
      name.replace(/^--/, ""),
      value,
    ])
  )
}

/**
 * Parses the `@layer base { … }` block into the nested object shape the `css` field takes, so
 * Dynamic Type and the touch-target rules travel with the published style. Comments are
 * stripped first: unlike `@utility` bodies, this block has one with a semicolon in its prose,
 * which would otherwise desync `parseBlock`'s brace/semicolon scan.
 */
function baseLayer(css: string): Record<string, unknown> {
  const match = /@layer base\s*\{/.exec(css)
  if (!match) return {}
  const start = match.index + match[0].length
  let depth = 1
  let end = start
  while (depth > 0 && end < css.length) {
    if (css[end] === "{") depth++
    if (css[end] === "}") depth--
    end++
  }
  const body = css.slice(start, end - 1).replace(/\/\*[\s\S]*?\*\//g, "")
  return { "@layer base": parseBlock(body) }
}

/**
 * Extracts the four `--font-*` declarations from `@theme inline` (the concrete Apple font
 * stacks) as a flat `cssVars` map. The rest of `@theme inline` stays internal — a project's
 * own `shadcn init` scaffold already maps `--font-sans` and friends onto whatever plain
 * custom property carries the same name, so shipping the value here (not the mapping) is
 * enough for it to reach a real font stack instead of Tailwind's default.
 */
function fontVars(css: string): Record<string, string> {
  const result: Record<string, string> = {}
  const pattern = /--font-(sans|rounded|mono|heading):\s*([\s\S]*?);/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(css)))
    result[`font-${match[1]}`] = match[2]!.replace(/\s+/g, " ").trim()
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
    item(
      "hook",
      "hooks",
      "use-reduced-motion.ts",
      "useReducedMotion",
      "Whether the person has asked for reduced motion."
    ),
    item(
      "hook",
      "hooks",
      "use-color-scheme.ts",
      "useColorScheme",
      "The system colour scheme, light or dark."
    ),
  ]

  const lib: RegistryItem[] = [
    item("lib", "lib", "utils.ts", "cn", "Class merging."),
    item(
      "lib",
      "lib",
      "platform.tsx",
      "Platform",
      "PlatformProvider and usePlatform: the iOS, macOS and web idiom switch."
    ),
    item(
      "lib",
      "lib",
      "contrast.ts",
      "Contrast",
      "WCAG luminance, compositing and contrast ratio."
    ),
    item(
      "lib",
      "lib",
      "detect-platform.ts",
      "detectPlatform",
      "Picks ios, macos or web from the visitor's device."
    ),
  ]

  const globalsCss = readSource(`${UI_PACKAGE}/src/styles/globals.css`)

  // The shared layer every idiom needs: every Apple primitive as `cssVars`, plus the
  // `@utility`, plain `@theme` and `@layer base` content from `globals.css` — none of it is
  // platform-specific, so `ios`/`macos`/`web` and `apple` all declare it as a
  // `registryDependency` instead of carrying their own copy (task 11: a copy in each would
  // drift, and `apple` carries every idiom, so a theme depending on it instead of `base`
  // would install all three).
  const base: RegistryItem = {
    name: "base",
    type: "registry:theme",
    title: "Base",
    description:
      "Every Apple colour, type, motion, elevation and material primitive as CSS variables, plus the type, material and glass utilities and the hairline shadow tokens every idiom and component reads at runtime.",
    files: [],
    cssVars: {
      light: { ...tokenVars("light"), ...fontVars(globalsCss) },
      dark: tokenVars("dark"),
      theme: theme(globalsCss),
    },
    css: {
      ...utilities(globalsCss),
      ...baseLayer(globalsCss),
    },
  }

  const style: RegistryItem = {
    name: "apple",
    type: "registry:style",
    title: "Apple",
    description:
      "Every Apple token as CSS variables (light and dark) plus the type, material and glass utilities and the hairline shadow tokens.",
    files: [],
    registryDependencies: [`${REGISTRY_URL}/base.json`],
    css: {
      ...tokenPlatformCss(),
    },
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "applecn",
    homepage: SITE_URL,
    items: [base, style, ...themeItems(), ...ui, ...hooks, ...lib],
  }
}
