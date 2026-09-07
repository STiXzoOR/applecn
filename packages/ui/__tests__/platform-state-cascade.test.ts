import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

/**
 * The platform variants are container style queries on `--platform`, so a class like
 * `web:bg-background-3` weighs a single class — and Tailwind emits them after the state
 * variants. Most state variants outweigh that with an attribute selector, but the ones
 * Tailwind wraps in `:where()` carry no weight at all and lose the tie on source order.
 * A checked checkbox then paints its resting bezel and shows no selection whatsoever.
 *
 * So: where a platform variant sets a property, no weightless state variant on the same
 * element may set it too — scope the platform class to a state, or override it per platform.
 */
const PLATFORMS = new Set(["ios", "macos", "web"])

/** State variants Tailwind compiles to `:where(…)`, which adds no specificity. */
const WEIGHTLESS = new Set([
  "data-checked",
  "data-unchecked",
  "data-active",
  "data-open",
  "data-disabled",
])

/** The coarse property group a utility writes, or null when it writes none we track. */
function property(utility: string): string | null {
  if (utility.startsWith("bg-")) return "background-color"
  if (/^border-(?![[\d]|[xytbsel]-|r-)/.test(utility)) return "border-color"
  if (
    utility.startsWith("text-") &&
    !/^text-(\[length|xs|sm|base|lg|xl|\d)/.test(utility)
  )
    return "color"
  if (utility.startsWith("shadow-")) return "box-shadow"
  if (utility.startsWith("opacity-")) return "opacity"
  return null
}

/** Only classes on the same element can outrank one another. */
function collisionsIn(classList: string) {
  const platformBase = new Map<string, string>()
  const stateOnly = new Map<string, string>()
  const overrides = new Set<string>()

  for (const c of classList.split(/\s+/).filter(Boolean)) {
    const parts = c.split(":")
    const prop = property(parts.at(-1)!)
    if (!prop) continue
    const modifiers = parts.slice(0, -1)
    const platform = modifiers.find((m) => PLATFORMS.has(m))
    const state = modifiers.find((m) => WEIGHTLESS.has(m))
    if (platform && state) overrides.add(`${platform}|${state}|${prop}`)
    else if (platform) platformBase.set(`${platform}|${prop}`, c)
    else if (state) stateOnly.set(`${state}|${prop}`, c)
  }

  const found: string[] = []
  for (const [key, platformClass] of platformBase) {
    const [platform, prop] = key.split("|")
    for (const [stateKey, stateClass] of stateOnly) {
      const [state, stateProp] = stateKey.split("|")
      if (stateProp !== prop) continue
      if (overrides.has(`${platform}|${state}|${prop}`)) continue
      found.push(`${platformClass} silently outranks ${stateClass}`)
    }
  }
  return found
}

/** Every class string in the file that mixes a platform variant in. */
function collisions(source: string) {
  const found: string[] = []
  for (const match of source.matchAll(
    /"([^"\n]*?(?:ios:|macos:|web:)[^"\n]*?)"/g
  ))
    found.push(...collisionsIn(match[1]!))
  return [...new Set(found)]
}

const dir = join(import.meta.dirname, "../src/components")

describe("platform variants never swallow a weightless state", () => {
  test.each(readdirSync(dir).filter((f) => f.endsWith(".tsx")))(
    "%s",
    (file) => {
      expect(collisions(readFileSync(join(dir, file), "utf8"))).toEqual([])
    }
  )
})
