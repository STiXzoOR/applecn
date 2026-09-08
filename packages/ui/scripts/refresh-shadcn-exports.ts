/**
 * Regenerates `__tests__/fixtures/shadcn-exports.json` — the **public surface** of every component
 * shadcn ships in its **Base UI** base variant, which spec §8 names as applecn's reference
 * ("§7.2's export audit must compare against _those_, not the Radix originals"). Public surface is
 * three things: the symbols a module exports, the `data-slot` values it stamps, and the props each
 * exported component names. The second is there because a shadcn consumer selects on it in CSS; the
 * third because a shadcn consumer *writes* those props, and a component that silently drops one
 * breaks their copy-pasted markup exactly as a missing export does.
 *
 * Why this exists rather than a hand-written list: the Phase 2 review found two entries of a
 * hand-copied fixture wrong (`dialog` claimed 8 exports where shadcn ships 10, `alert-dialog` 11
 * where it ships 12), and the export-parity test was green on a live parity break because the
 * fixture — not shadcn — was the thing being checked. A fixture that encodes an external
 * project's API is a claim about the world; it has to be derived from that world, and its drift
 * has to be detectable. So:
 *
 *   node scripts/refresh-shadcn-exports.ts            rewrite the fixture from shadcn@main
 *   node scripts/refresh-shadcn-exports.ts --check    exit 1 if shadcn has moved since
 *
 * `--check` is deliberately NOT part of `pnpm check`: the test suite must stay offline and
 * deterministic. It is a manual/scheduled drift alarm, and the fixture's recorded commit says
 * exactly which upstream state the committed answer was taken from.
 */
import { readFileSync, writeFileSync } from "node:fs"

const REPO = "shadcn-ui/ui"
const REF = process.env.SHADCN_REF ?? "main"
const DIR = "apps/v4/registry/bases/base/ui"
const FIXTURE = new URL(
  "../__tests__/fixtures/shadcn-exports.json",
  import.meta.url
)

interface Fixture {
  readonly $generated: string
  readonly source: string
  readonly variant: string
  readonly ref: string
  readonly commit: string
  readonly commitDate: string
  readonly fetchedAt: string
  readonly exports: Record<string, string[]>
  readonly slots: Record<string, string[]>
  readonly props: Record<string, Record<string, string[]>>
}

async function json<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN
        ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  })
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return (await response.json()) as T
}

/**
 * The value symbols one component module exports. Type-only exports are skipped: they are not
 * what a shadcn user's copy-pasted JSX reaches for, and they do not appear in a runtime
 * `Object.keys(module)`, which is what the parity test compares against.
 */
function exportedValues(source: string): string[] {
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
  for (const [, name] of source.matchAll(
    /export\s+(?:default\s+)?function\s+([A-Za-z_]\w*)/g
  ))
    names.add(name!)
  for (const [, name] of source.matchAll(
    /export\s+(?:const|let|var|class)\s+([A-Za-z_]\w*)/g
  ))
    names.add(name!)
  return [...names].sort()
}

/**
 * The `data-slot` values one component module stamps. Every assignment in shadcn's source is a
 * string literal, so a literal match is exact; the bare `[data-slot=item-content]` forms that
 * appear inside Tailwind class strings are CSS selectors, not assignments, and are correctly
 * skipped by requiring the quote.
 */
function stampedSlots(source: string): string[] {
  return [
    ...new Set([...source.matchAll(/data-slot="([^"]+)"/g)].map(([, s]) => s!)),
  ].sort()
}

/** The text between `source[open]` and its matching bracket, exclusive. */
function bracketBody(source: string, open: number): string {
  let depth = 0
  for (let i = open; i < source.length; i++) {
    const char = source[i]!
    if (char === "{" || char === "(" || char === "[") depth++
    else if (char === "}" || char === ")" || char === "]") {
      depth--
      if (depth === 0) return source.slice(open + 1, i)
    }
  }
  return ""
}

/** One destructuring pattern's entries, split on the commas that are not inside anything. */
function patternEntries(pattern: string): string[] {
  const entries: string[] = []
  let depth = 0
  let start = 0
  let quote = ""
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i]!
    if (quote) {
      if (char === quote && pattern[i - 1] !== "\\") quote = ""
      continue
    }
    if (char === '"' || char === "'" || char === "`") quote = char
    else if ("{[(".includes(char)) depth++
    else if ("}])".includes(char)) depth--
    else if (char === "," && depth === 0) {
      entries.push(pattern.slice(start, i))
      start = i + 1
    }
  }
  entries.push(pattern.slice(start))
  return entries.map((entry) => entry.trim()).filter(Boolean)
}

/**
 * The props each component in one module **names in its signature** — the destructuring pattern of
 * its first parameter, minus the `...rest`.
 *
 * Why this and not the props *type*: shadcn's components and applecn's wrap different primitives, so
 * their prop types are different objects by construction and comparing them would report a
 * divergence on every line. What a shadcn user's copy-pasted markup depends on is narrower and
 * sharper — a prop the component reads and acts on. In shadcn's source that is exactly the
 * destructured set: a prop reached through `...props` is forwarded untouched and needs no matching
 * declaration on applecn's side, while a destructured one is being *consumed* — turned into a class,
 * a positioner offset, an extra element — and a component that does not name it silently drops it.
 *
 * This subsumes the cva variant props rather than needing a second pass for them: checked across all
 * 62 components at `c257f68`, every key of every `cva({ variants })` block is destructured by the
 * component that applies it, so `variant`, `size` and `spacing` arrive here already.
 *
 * Two things this reads that the first version did not, both because they were INDISTINGUISHABLE
 * from a component that names nothing:
 *
 * - An arrow const. shadcn writes most components as `function X(…)` but not all — `ChartStyle`
 *   and `sonner`'s `Toaster` are `const X = ({ … }) =>` — and matching only `function` left those
 *   with no row at all, so nothing compared their props against applecn's.
 * - A component that takes its props whole (`function X(props: …)`, which is how
 *   `MessageScrollerProvider` is written) now gets an EMPTY row rather than being skipped. It
 *   really does name no props and forwards everything, so there is nothing for the other side to
 *   declare — but "names none" and "was not parsed" must not look the same in the output, or a
 *   parse miss reads as a clean bill of health.
 *
 * A bare re-export (`const Select = SelectPrimitive.Root`) still gets no row, and that is the true
 * answer: there is no signature of shadcn's to read.
 */
const COMPONENT =
  /^(?:export\s+)?(?:function\s+([A-Z]\w*)\s*\(|const\s+([A-Z]\w*)(?:\s*:[^=\n]+)?\s*=\s*\()/gm

function namedProps(source: string): Record<string, string[]> {
  const components: Record<string, string[]> = {}
  for (const match of source.matchAll(COMPONENT)) {
    const parameters = bracketBody(
      source,
      match.index + match[0].length - 1
    ).trim()
    if (!parameters.startsWith("{")) {
      components[(match[1] ?? match[2])!] = []
      continue
    }
    const named = patternEntries(bracketBody(parameters, 0))
      .filter((entry) => !entry.startsWith("..."))
      .map((entry) => entry.split(/[:=]/)[0]!.trim())
      .filter(Boolean)
    components[(match[1] ?? match[2])!] = [...new Set(named)].sort()
  }
  return components
}

async function fetchSurface(): Promise<
  Omit<Fixture, "$generated" | "fetchedAt">
> {
  const [commit] = await json<
    { sha: string; commit: { committer: { date: string } } }[]
  >(
    `https://api.github.com/repos/${REPO}/commits?sha=${REF}&path=${DIR}&per_page=1`
  )
  if (!commit) throw new Error(`no commits found for ${DIR} on ${REF}`)

  const listing = await json<{ name: string; download_url: string }[]>(
    `https://api.github.com/repos/${REPO}/contents/${DIR}?ref=${commit.sha}`
  )
  const components = listing.filter((file) => file.name.endsWith(".tsx"))

  const exports: Record<string, string[]> = {}
  const slots: Record<string, string[]> = {}
  const props: Record<string, Record<string, string[]>> = {}
  await Promise.all(
    components.map(async (file) => {
      const response = await fetch(file.download_url)
      if (!response.ok)
        throw new Error(`${response.status} fetching ${file.name}`)
      const source = await response.text()
      const name = file.name.replace(/\.tsx$/, "")
      exports[name] = exportedValues(source)
      slots[name] = stampedSlots(source)
      // Only the components shadcn actually exports: `ComboboxClear`, `SheetPortal`,
      // `SheetOverlay`, `ToastIcon` and `ToastList` are internal to their modules at `c257f68`,
      // so nothing a shadcn user writes can pass them a prop.
      props[name] = Object.fromEntries(
        Object.entries(namedProps(source))
          .filter(([component]) => exports[name]!.includes(component))
          .sort(([a], [b]) => (a < b ? -1 : 1))
      )
    })
  )

  return {
    source: `https://github.com/${REPO}/tree/${commit.sha}/${DIR}`,
    variant:
      "base (Base UI) — the variant spec §8 requires, not the Radix originals",
    ref: REF,
    commit: commit.sha,
    commitDate: commit.commit.committer.date,
    exports: Object.fromEntries(
      Object.keys(exports)
        .sort()
        .map((name) => [name, exports[name]!])
    ),
    slots: Object.fromEntries(
      Object.keys(slots)
        .sort()
        .map((name) => [name, slots[name]!])
    ),
    props: Object.fromEntries(
      Object.keys(props)
        .sort()
        .map((name) => [name, props[name]!])
    ),
  }
}

const fresh = await fetchSurface()

/** The `+added -gone` lines for one half of the surface, empty when that half has not moved. */
function driftLines(
  label: string,
  committed: Record<string, string[]>,
  now: Record<string, string[]>
): string[] {
  const names = [
    ...new Set([...Object.keys(committed), ...Object.keys(now)]),
  ].sort()
  const lines: string[] = []
  for (const name of names) {
    const was = committed[name] ?? []
    const is = now[name] ?? []
    const gone = was.filter((entry) => !is.includes(entry))
    const added = is.filter((entry) => !was.includes(entry))
    if (gone.length || added.length)
      lines.push(
        `  ${name} ${label}: ${added.map((s) => `+${s}`).join(" ")} ${gone.map((s) => `-${s}`).join(" ")}`.trimEnd()
      )
  }
  return lines
}

/** `{ item: { Item: [...] } }` → `{ "item.Item": [...] }`, so one `driftLines` reads both shapes. */
function flatten(
  nested: Record<string, Record<string, string[]>>
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(nested).flatMap(([module, components]) =>
      Object.entries(components).map(
        ([component, props]) => [`${module}.${component}`, props] as const
      )
    )
  )
}

if (process.argv.includes("--check")) {
  const committed = JSON.parse(readFileSync(FIXTURE, "utf8")) as Fixture
  const drift = [
    ...driftLines("exports", committed.exports, fresh.exports),
    ...driftLines("slots", committed.slots ?? {}, fresh.slots),
    ...driftLines(
      "props",
      flatten(committed.props ?? {}),
      flatten(fresh.props)
    ),
  ]
  if (drift.length) {
    console.error(
      `shadcn's public surface has moved since ${committed.commit.slice(0, 7)} (${committed.commitDate}):\n${drift.join("\n")}\n\n` +
        `Re-run without --check to refresh the fixture, then close or record the new gaps in shadcn-export-parity.test.ts.`
    )
    process.exit(1)
  }
  console.log(
    `fixture matches shadcn ${fresh.commit.slice(0, 7)} — ${Object.keys(fresh.exports).length} components, no drift`
  )
} else {
  const fixture: Fixture = {
    $generated:
      "GENERATED by scripts/refresh-shadcn-exports.ts — do not hand-edit. " +
      "Run `pnpm --filter @applecn/ui shadcn:exports` to refresh, `… --check` to detect drift.",
    ...fresh,
    fetchedAt: new Date().toISOString().slice(0, 10),
  }
  writeFileSync(FIXTURE, `${JSON.stringify(fixture, null, 2)}\n`)
  console.log(
    `wrote ${FIXTURE.pathname} — ${Object.keys(fresh.exports).length} components from ${fresh.commit.slice(0, 7)}`
  )
}
