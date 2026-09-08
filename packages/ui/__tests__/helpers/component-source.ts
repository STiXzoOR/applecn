import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Shared reading of component source, for the guards that scan the catalogue rather than render
 * it — `platform-state-cascade.test.ts` and `idiom-fidelity-coverage.test.ts`. Both used to walk
 * the directory and split Tailwind class strings with their own copies of this; two independently
 * maintained modifier tables answering the same question is one divergence waiting to happen.
 */

export const COMPONENTS_DIR = join(import.meta.dirname, "../../src/components")

export interface ComponentModule {
  /** Path relative to the components directory, so a nested module reads as `chart/index.tsx`. */
  readonly file: string
  readonly source: string
}

/**
 * Every component module. Recursive and `.ts` as well as `.tsx`, because neither guard may go
 * blind on the shapes Phase 3 is about to add: §5.4's `chart` and `data-table` are named in the
 * spec as subsystems, which is to say directories, and a `cva` lifted into a sibling
 * `variants.ts` is still the file that decides what a selected control looks like.
 */
export function componentModules(
  dir = COMPONENTS_DIR,
  prefix = ""
): ComponentModule[] {
  const modules: ComponentModule[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const file = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory())
      modules.push(...componentModules(join(dir, entry.name), file))
    else if (/\.tsx?$/.test(entry.name))
      modules.push({
        file,
        source: readFileSync(join(dir, entry.name), "utf8"),
      })
  }
  return modules
}

/** Splits `data-[variant=destructive]:text-x` into its modifiers and utility, on top-level colons. */
export function splitModifiers(token: string): {
  modifiers: string[]
  utility: string
} {
  const parts: string[] = []
  let depth = 0
  let buffer = ""
  for (const character of token) {
    if (character === "[" || character === "(") depth++
    else if (character === "]" || character === ")") depth--
    if (character === ":" && depth === 0) {
      parts.push(buffer)
      buffer = ""
    } else buffer += character
  }
  parts.push(buffer)
  return { modifiers: parts.slice(0, -1), utility: parts.at(-1)! }
}

/** The coarse property group a utility paints, or null when it paints none we track. */
export function paintedProperty(utility: string): string | null {
  if (utility.startsWith("bg-")) return "background-color"
  if (/^border-(?![[\d]|[xytbsel]-|r-|\(length)/.test(utility))
    return "border-color"
  if (
    utility.startsWith("text-") &&
    !/^text-(\[length|xs|sm|base|lg|xl|\d)/.test(utility)
  )
    return "color"
  if (utility.startsWith("shadow-")) return "box-shadow"
  if (utility.startsWith("opacity-")) return "opacity"
  return null
}

/**
 * One top-level declaration and its body, so a rule can be attributed to the export that carries
 * it rather than to the whole file. A file-level answer says "something in checkbox.tsx is
 * covered", which a second selectable export in the same file — a `CheckboxCard`, a selectable
 * row — satisfies for free.
 */
export interface Declaration {
  readonly name: string
  readonly exported: boolean
  readonly body: string
}

const DECLARATION =
  /^(export\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm

export function topLevelDeclarations(source: string): Declaration[] {
  const starts: { name: string; exported: boolean; at: number }[] = []
  for (const match of source.matchAll(DECLARATION))
    starts.push({
      name: match[2]!,
      exported: Boolean(match[1]),
      at: match.index,
    })
  return starts.map((start, index) => ({
    name: start.name,
    exported: start.exported,
    body: source.slice(start.at, starts[index + 1]?.at ?? source.length),
  }))
}

/** Every value name a module exports, however it is written. */
export function exportedNames(source: string): string[] {
  const names = new Set<string>()
  for (const [, block] of source.matchAll(/export\s*\{([^}]*)\}/g))
    for (const raw of block!.split(",")) {
      const entry = raw.trim()
      if (!entry || entry.startsWith("type ")) continue
      names.add(
        entry
          .split(/\s+as\s+/)
          .pop()!
          .trim()
      )
    }
  for (const declaration of topLevelDeclarations(source))
    if (declaration.exported) names.add(declaration.name)
  return [...names]
}

/**
 * Words that make a custom property a MEASURED one — a number out of
 * `docs/research/apple-design-system-reference.md` rather than a colour or a duration.
 *
 * `target` was added for `--hit-target`, the 44 / 28 / 44 pt minimum the HIG publishes. It is as
 * measured as any control height, `calendar` sizes its day cell from it, and the contract could
 * not see it — the word list, not the token, was the limit.
 */
const MEASURED =
  /(?:height|width|size|radius|inset|gap|font|leading|tracking|weight|scale|offset|indent|dot|target|-p[xytblr]?$|-p[xytblr]-)/

/** Numeric geometry written as a literal utility rather than read from a token. */
const LITERAL_GEOMETRY =
  /^(?:h|w|size|min-h|min-w|max-h|max-w)-(?:\d[\d./]*|px|full|screen)$/

/**
 * The geometry one module reads: the measured tokens it dereferences, the named radii and text
 * styles it applies, and the numeric heights and widths it hardcodes. Sorted and deduplicated.
 *
 * This is spec §7.4's acceptance — "no measured metric changes" — made mechanical. Thirteen
 * components are about to be rebuilt on shadcn bases, and §8 names metric drift during that as
 * the top risk; nothing in the suite could see a rebuilt component start reading
 * `--control-height-small` where it used to read `--control-height-regular`. Task 14's browser
 * pass caught that class of thing once, by hand, on one day. This catches it on every run.
 */
export function geometryContract(source: string): string[] {
  const found = new Set<string>()
  for (const [, name] of source.matchAll(/var\((--[\w-]+)\)/g))
    if (MEASURED.test(name!)) found.add(name!)
  for (const [, block] of source.matchAll(/"([^"\n]*)"/g))
    for (const token of block!.split(/\s+/).filter(Boolean)) {
      const { utility } = splitModifiers(token)
      const property = /^([\w-]+?)-\((?:length:)?(--[\w-]+)\)$/.exec(utility)
      if (property && MEASURED.test(property[2]!)) {
        found.add(property[2]!)
        continue
      }
      if (/^(?:rounded|type)-[a-z][\w-]*$/.test(utility)) found.add(utility)
      else if (LITERAL_GEOMETRY.test(utility)) found.add(utility)
    }
  return [...found].sort()
}
