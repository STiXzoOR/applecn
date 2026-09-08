/**
 * Regenerates `__tests__/fixtures/shadcn-exports.json` — the **public surface** of every component
 * shadcn ships in its **Base UI** base variant, which spec §8 names as applecn's reference
 * ("§7.2's export audit must compare against _those_, not the Radix originals"). Public surface is
 * two things: the symbols a module exports, and the `data-slot` values it stamps. The second is
 * there because a shadcn consumer selects on it in CSS, so it is as breakable as an export name.
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
  await Promise.all(
    components.map(async (file) => {
      const response = await fetch(file.download_url)
      if (!response.ok)
        throw new Error(`${response.status} fetching ${file.name}`)
      const source = await response.text()
      const name = file.name.replace(/\.tsx$/, "")
      exports[name] = exportedValues(source)
      slots[name] = stampedSlots(source)
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

if (process.argv.includes("--check")) {
  const committed = JSON.parse(readFileSync(FIXTURE, "utf8")) as Fixture
  const drift = [
    ...driftLines("exports", committed.exports, fresh.exports),
    ...driftLines("slots", committed.slots ?? {}, fresh.slots),
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
