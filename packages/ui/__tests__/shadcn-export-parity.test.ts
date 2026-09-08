import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

/**
 * Export-surface parity with shadcn (spec §3, §5.1, §7.2). applecn may export MORE than shadcn —
 * the Apple additions, `AlertDialogActions`, `SheetToolbar` and the rest — and may never export
 * fewer, or a shadcn user's copy-pasted markup breaks.
 *
 * The reference is `fixtures/shadcn-exports.json`, which is GENERATED from shadcn's own source by
 * `scripts/refresh-shadcn-exports.ts` and carries the upstream commit it was taken from. It is not
 * hand-maintained, and that is the point: the first version of this test carried a hand-copied list
 * claiming `dialog` exports 8 symbols where shadcn ships 10, so the one test whose whole job is
 * export parity was green while `DialogOverlay` and `DialogPortal` were missing — and two upstream
 * claims (spec §5.1, ledger R18) had been "verified" against that same wrong list. A fixture that
 * encodes an external project's API is a claim about the world; it is derived from the world here,
 * and `node scripts/refresh-shadcn-exports.ts --check` makes its drift detectable without making
 * `pnpm check` depend on the network.
 *
 * The variant is shadcn's **Base UI** base (`apps/v4/registry/bases/base/ui`), which spec §8
 * requires: "§7.2's export audit must compare against _those_, not the Radix originals".
 */

const FIXTURE = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "fixtures/shadcn-exports.json"),
    "utf8"
  )
) as {
  readonly source: string
  readonly commit: string
  readonly commitDate: string
  readonly exports: Record<string, string[]>
}

const COMPONENTS_DIR = join(import.meta.dirname, "../src/components")
const modulePath = (name: string) => join(COMPONENTS_DIR, `${name}.tsx`)

/**
 * A component applecn has not built yet. `task` names what builds it. The row asserts the module
 * does NOT resolve — so the moment the component exists, this row fails and has to be replaced by
 * a `gap` row. Without that, a task could build `item`, forget to delete its entry here, and leave
 * a permanently skipped test reading as coverage.
 */
interface Unbuilt {
  readonly task: string
  readonly note?: string
}

/**
 * A component applecn ships. `gap` is EXACTLY the set of shadcn symbols it does not export today,
 * and `closes` names the task that empties it. Exact rather than "at most": closing part of a gap
 * forces this list to shrink, and a symbol that goes missing later fails here.
 */
interface Built {
  readonly gap: readonly string[]
  readonly closes?: string
  readonly note?: string
}

/** A component applecn deliberately does not ship, with the reason on the record. */
interface Declined {
  readonly declined: string
}

type Row = Unbuilt | Built | Declined

/**
 * One row per component shadcn ships — 62 of them, audited 2026-09-08 against the fixture's
 * commit. This closes spec §5.1's "each still needs its export surface audited against shadcn's":
 * every parity component is either at parity, carries a named gap with the task that closes it, or
 * is not built yet with the task that builds it.
 *
 * Task 15's §5.2 renames land one at a time, so a row moves from unbuilt to a gap as its file
 * appears under shadcn's name. `input-otp`, `collapsible` and `drawer` are still
 * unbuilt here while `passcode-field.tsx`, `disclosure-group.tsx` and `sheet.tsx` carry their
 * code under Apple's names. Auditing them under shadcn's names is
 * deliberate: it is the rename that owes the parity, and each row fails the moment its file
 * appears.
 */
const LEDGER: Record<string, Row> = {
  accordion: { gap: ["AccordionContent"], closes: "Task 15" },
  alert: { task: "Task 20" },
  "alert-dialog": { gap: [] },
  "aspect-ratio": { task: "Task 21" },
  attachment: { task: "Task 52–58 (the AI set)" },
  avatar: {
    gap: ["AvatarBadge", "AvatarGroup", "AvatarGroupCount"],
    closes: "Task 15",
  },
  badge: { gap: [] },
  breadcrumb: {
    gap: ["BreadcrumbEllipsis", "BreadcrumbList", "BreadcrumbSeparator"],
    closes: "Task 15",
  },
  bubble: { task: "Task 52–58 (the AI set)" },
  button: { gap: [] },
  "button-group": {
    gap: ["ButtonGroupSeparator", "ButtonGroupText", "buttonGroupVariants"],
    closes: "Task 42",
    note: "Task 42 rebuilds `toolbar` on `button-group` and owns its surface.",
  },
  calendar: { task: "Task 28" },
  card: { gap: ["CardAction"], closes: "Task 15" },
  carousel: {
    gap: ["CarouselContent", "CarouselNext", "CarouselPrevious", "useCarousel"],
    closes: "Task 15",
  },
  chart: { task: "Task 30b" },
  checkbox: { gap: [] },
  collapsible: {
    task: "Task 15",
    note: "the rename of `disclosure-group`; verified again by Task 26.",
  },
  combobox: {
    gap: [
      "ComboboxChip",
      "ComboboxChips",
      "ComboboxChipsInput",
      "ComboboxCollection",
      "ComboboxLabel",
      "ComboboxSeparator",
      "ComboboxTrigger",
      "ComboboxValue",
      "useComboboxAnchor",
    ],
    closes: "Task 15",
    note:
      "`ComboboxLabel` is the naming split the Phase 2 review flagged as M6, and it resolves " +
      "against shadcn rather than by preference: shadcn's `ComboboxLabel` wraps Base UI's " +
      '`Combobox.GroupLabel` and carries `data-slot="combobox-label"`, so applecn\'s ' +
      "`ComboboxGroupLabel`/`combobox-group-label` diverges on both the export name and the " +
      "slot. Task 15 renames it and keeps the old name as an alias.",
  },
  command: { task: "Task 27" },
  "context-menu": {
    gap: [
      "ContextMenuPortal",
      "ContextMenuRadioGroup",
      "ContextMenuRadioItem",
      "ContextMenuShortcut",
      "ContextMenuSub",
      "ContextMenuSubContent",
      "ContextMenuSubTrigger",
    ],
    closes: "Task 15",
  },
  dialog: { gap: [] },
  direction: { task: "Task 52–58 (the AI set)" },
  drawer: {
    task: "Task 15",
    note: "today's bottom `sheet` renamed; gains DrawerHeader/DrawerFooter there (spec §5.2).",
  },
  "dropdown-menu": {
    gap: ["DropdownMenuPortal"],
    closes: "Task 15",
    note:
      "the rename of `menu`. The whole `Menu*` surface came across; `DropdownMenuPortal` is a " +
      "sub-component applecn never had, since `DropdownMenuContent` portals itself.",
  },
  empty: {
    gap: ["EmptyContent", "EmptyHeader", "EmptyMedia"],
    closes: "Task 15",
  },
  field: {
    gap: [
      "FieldContent",
      "FieldLegend",
      "FieldSeparator",
      "FieldSet",
      "FieldTitle",
    ],
    closes: "Task 37",
    note: "Task 37 rebuilds `checkbox-group` on FieldSet/FieldGroup and needs these.",
  },
  "hover-card": {
    gap: [],
    note: "the rename of `preview-card`; the three exports match shadcn's exactly.",
  },
  input: { gap: [] },
  "input-group": { task: "Task 18" },
  "input-otp": { task: "Task 15", note: "the rename of `passcode-field`." },
  item: { task: "Task 17" },
  kbd: { gap: ["KbdGroup"], closes: "Task 15" },
  label: { gap: [] },
  marker: { task: "Task 52–58 (the AI set)" },
  menubar: {
    gap: ["MenubarPortal", "MenubarRadioGroup", "MenubarRadioItem"],
    closes: "Task 15",
  },
  message: { task: "Task 52–58 (the AI set)" },
  "message-scroller": { task: "Task 52–58 (the AI set)" },
  "native-select": { task: "Task 22" },
  "navigation-menu": {
    gap: [
      "NavigationMenuIndicator",
      "NavigationMenuPositioner",
      "navigationMenuTriggerStyle",
    ],
    closes: "Task 15",
  },
  pagination: { task: "Task 23" },
  popover: { gap: [] },
  progress: { gap: [] },
  questionnaire: { task: "Task 52–58 (the AI set)" },
  "radio-group": { gap: [] },
  resizable: { task: "Task 24" },
  "scroll-area": { gap: ["ScrollBar"], closes: "Task 15" },
  select: { gap: [] },
  separator: { gap: [] },
  sheet: {
    gap: [],
    note:
      "today's `sheet` is the bottom sheet, which spec §5.2 renames to `drawer`. It matches " +
      "shadcn's edge-panel `sheet` surface by coincidence of naming; Task 19 builds the real " +
      "edge panel under this name and re-audits the row.",
  },
  sidebar: {
    gap: [
      "SidebarContent",
      "SidebarGroupAction",
      "SidebarGroupContent",
      "SidebarGroupLabel",
      "SidebarInput",
      "SidebarInset",
      "SidebarMenu",
      "SidebarMenuAction",
      "SidebarMenuBadge",
      "SidebarMenuButton",
      "SidebarMenuItem",
      "SidebarMenuSkeleton",
      "SidebarMenuSub",
      "SidebarMenuSubButton",
      "SidebarMenuSubItem",
      "SidebarRail",
      "SidebarSeparator",
    ],
    closes: "Task 15",
    note: "the widest gap in the catalogue — a task of its own inside Task 15.",
  },
  skeleton: { gap: [] },
  slider: { gap: [] },
  sonner: {
    declined:
      "a wrapper around the third-party `sonner` package, exporting only `Toaster`. applecn " +
      "ships its own `toast` on Base UI and takes no runtime dependency on sonner; spec §5's " +
      "catalogue does not list it.",
  },
  spinner: { gap: [] },
  switch: { gap: [] },
  table: { gap: [] },
  tabs: {
    gap: ["TabsContent", "TabsTrigger", "tabsListVariants"],
    closes: "Task 16",
    note: "applecn uses Base UI's TabsPanel/TabsTab names; Task 16 owns the tabs surface.",
  },
  textarea: { gap: [] },
  toast: {
    gap: [
      "Toast",
      "ToastAction",
      "ToastClose",
      "ToastContent",
      "ToastDescription",
      "ToastPortal",
      "ToastProvider",
      "ToastTitle",
      "ToastViewport",
      "toast",
      "useToastManager",
    ],
    closes: "Task 15",
    note: "applecn ships `Toaster` only; the composable surface is unbuilt.",
  },
  toggle: { gap: [] },
  "toggle-group": { gap: [] },
  tooltip: { gap: [] },
}

const isUnbuilt = (row: Row): row is Unbuilt => "task" in row
const isDeclined = (row: Row): row is Declined => "declined" in row

const rows = Object.entries(LEDGER)
const unbuilt = rows.filter((entry): entry is [string, Unbuilt] =>
  isUnbuilt(entry[1])
)
const declined = rows.filter((entry): entry is [string, Declined] =>
  isDeclined(entry[1])
)
const built = rows.filter(
  (entry): entry is [string, Built] =>
    !isUnbuilt(entry[1]) && !isDeclined(entry[1])
)

describe("export parity with shadcn", () => {
  test("the fixture is the generated one, and names the upstream it came from", () => {
    expect(FIXTURE.source).toMatch(
      /^https:\/\/github\.com\/shadcn-ui\/ui\/tree\/[0-9a-f]{40}\/apps\/v4\/registry\/bases\/base\/ui$/
    )
    expect(FIXTURE.commit).toMatch(/^[0-9a-f]{40}$/)
    expect(Date.parse(FIXTURE.commitDate)).not.toBeNaN()
    // A canary on the generator: an empty or truncated fetch must not read as "nothing to check".
    expect(Object.keys(FIXTURE.exports).length).toBeGreaterThan(50)
    for (const [name, symbols] of Object.entries(FIXTURE.exports))
      expect(symbols.length, `${name} exports something`).toBeGreaterThan(0)
  })

  test("every component shadcn ships has a ledger row, and no row invents one", () => {
    expect(Object.keys(LEDGER).sort()).toEqual(
      Object.keys(FIXTURE.exports).sort()
    )
  })

  test("a recorded gap names the task that closes it", () => {
    const unattributed = built
      .filter(([, row]) => row.gap.length > 0 && !row.closes)
      .map(([name]) => name)
    expect(unattributed, "every gap names the task that closes it").toEqual([])
  })

  for (const [name, row] of declined)
    test(`${name} is deliberately not shipped`, () => {
      expect(row.declined.length, `${name}'s reason is argued`).toBeGreaterThan(
        40
      )
      expect(
        existsSync(modulePath(name)),
        `${name} is declined but ${name}.tsx exists — decide which is true`
      ).toBe(false)
    })

  // Not `test.skip`. A skipped test is green forever, so a task that builds the component and
  // forgets its row leaves an untested component behind a green gate. Asserting the module does
  // NOT resolve makes the row self-expiring: building it fails here until the row moves.
  for (const [name, row] of unbuilt)
    test(`${name} is not built yet (${row.task}), so nothing here claims it is`, () => {
      expect(
        existsSync(modulePath(name)),
        `${name}.tsx now exists — ${row.task} must replace this ledger row with its export gap`
      ).toBe(false)
    })

  for (const [name, row] of built)
    test(`${name} exports everything shadcn does`, async () => {
      // The extension is part of the static prefix on purpose: without it Vite cannot build the
      // glob for a dynamic import and warns on every run.
      const mod = (await import(`../src/components/${name}.tsx`)) as Record<
        string,
        unknown
      >
      const present = new Set(Object.keys(mod))
      const missing = FIXTURE.exports[name]!.filter(
        (symbol) => !present.has(symbol)
      ).sort()
      expect(
        missing,
        `${name}'s gap against shadcn ${FIXTURE.commit.slice(0, 7)} changed. ` +
          `Either close it, or record it exactly in this file's LEDGER with the task that will.`
      ).toEqual([...row.gap].sort())
    })
})
