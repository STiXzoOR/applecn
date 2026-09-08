import { tokenBaseCss, tokenPlatformCss, tokenVars } from "../../src/tokens/css"
import type { Platform } from "../../src/lib/platform"

/**
 * Resolving a token the way a browser would, shared by the guards that ask what a class actually
 * PAINTS rather than what it declares — `idiom-fidelity.test.tsx`, which asks whether a selected
 * control looks different from a resting one, and `alert.test.tsx`, which asks whether a surface
 * looks different from the ground under it.
 *
 * It lives here rather than in either file because both answer the same question and a second
 * copy of a cascade model is a divergence waiting to happen: spec §4.4 recorded exactly that
 * about the segmented tracks, and the two copies had drifted within one phase.
 */

/**
 * The cascade contexts a control is actually rendered in. `tokens.css` emits seven scopes, not
 * four: alongside `:root`, `.dark` and the two platform scopes it writes `.dark [data-elevated]`
 * (the raised backgrounds a sheet or a menu reads through), `[data-contrast="more"]` and
 * `.dark [data-contrast="more"]`. §4.5 was itself a cascade collision, so a collision that only
 * appears inside a dark popover, or under increased contrast, is the same class of bug in a
 * lower-frequency place.
 */
export interface Environment {
  readonly name: string
  readonly appearance: "light" | "dark"
  readonly elevated?: boolean
  readonly contrast?: boolean
}

const withoutPrefix = (declarations: Record<string, string>) =>
  Object.entries(declarations).map(
    ([name, value]) => [name.replace(/^--/, ""), value] as const
  )

const baseCss = tokenBaseCss() as Record<string, Record<string, string>>

/**
 * Every custom property in scope for an element under one idiom and one environment, resolved the
 * way a browser would: layers sorted by selector weight first and by emission order only to break
 * a tie. Modelling the weight matters — `.dark [data-elevated]` is (0,2,0) and outranks
 * `[data-platform="ios"]`'s (0,1,0) however late the platform scope is written, while
 * `.dark [data-platform="ios"]` matches it on weight and wins on order. A flat last-one-wins map
 * gets the first of those two backwards.
 *
 * Composed from the token modules rather than parsed from the generated stylesheet, so it cannot
 * drift from what a consumer installs.
 */
export function variableMap(
  platform: Platform,
  environment: Environment
): ReadonlyMap<string, string> {
  const scopes = tokenPlatformCss(platform) as Record<
    string,
    Record<string, string>
  >
  const light = scopes[`[data-platform="${platform}"]`]
  const dark = Object.entries(scopes).find(([selector]) =>
    selector.startsWith(".dark")
  )?.[1]
  if (!light) throw new Error(`${platform} has no light scope`)
  if (!dark) throw new Error(`${platform} has no dark scope`)

  const isDark = environment.appearance === "dark"
  // [weight, emission order, declarations] — the order `tokens.css` writes these scopes in.
  const layers: [number, number, Iterable<readonly [string, string]>][] = [
    [0, 0, Object.entries(tokenVars("light"))],
  ]
  if (isDark) layers.push([1, 1, Object.entries(tokenVars("dark"))])
  if (isDark && environment.elevated)
    layers.push([2, 2, withoutPrefix(baseCss[".dark [data-elevated]"]!)])
  if (environment.contrast) {
    layers.push([1, 3, withoutPrefix(baseCss['[data-contrast="more"]']!)])
    if (isDark)
      layers.push([
        2,
        4,
        withoutPrefix(baseCss['.dark [data-contrast="more"]']!),
      ])
  }
  layers.push([1, 5, withoutPrefix(light)])
  if (isDark) layers.push([2, 6, withoutPrefix(dark)])

  const vars = new Map<string, string>()
  for (const [, , entries] of layers.sort((a, b) => a[0] - b[0] || a[1] - b[1]))
    for (const [name, value] of entries) vars.set(name, value)
  return vars
}

const VAR = /^var\(--([\w-]+)\)$/

/** Follows a `var(--x)` chain to the literal it ends at, on one idiom's variable map. */
export function resolve(
  value: string,
  vars: ReadonlyMap<string, string>
): string {
  const seen = new Set<string>()
  let current = value.trim()
  for (let match = VAR.exec(current); match; match = VAR.exec(current)) {
    const name = match[1]!
    // A token that dereferences a variable the stylesheet never delivers renders as nothing —
    // the shape of the install defect Task 11 found in the registry's base layer.
    if (seen.has(name)) throw new Error(`--${name} resolves in a cycle`)
    seen.add(name)
    const next = vars.get(name)
    if (next === undefined)
      throw new Error(`--${name} is not delivered by the token scopes`)
    current = next.trim()
  }
  return current
}
