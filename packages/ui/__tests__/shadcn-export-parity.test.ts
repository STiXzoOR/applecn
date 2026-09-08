import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

/**
 * Public-surface parity with shadcn (spec §3, §5.1, §7.2) — the exported symbols AND the
 * `data-slot` values. applecn may ship MORE than shadcn — the Apple additions, `AlertDialogActions`,
 * `DrawerToolbar`, `data-slot="drawer-toolbar"` and the rest — and may never ship fewer, or a shadcn
 * user's copy-pasted markup breaks.
 *
 * `data-slot` belongs here because it is not decoration: it is how a shadcn consumer targets a
 * sub-component in CSS (`[data-slot="dropdown-menu-item"] { … }`), so spec §3's "shadcn's name,
 * shadcn's exports, shadcn's semantics" governs it exactly as it governs an export name. Nothing
 * audited it until Task 15b, and three components had drifted: `drawer` still emitted every
 * `sheet-*` value from before its rename, `dropdown-menu` every `menu-*` value from before its own,
 * and `menubar` borrowed `menu-shortcut` from the file it shares styles with.
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
  readonly slots: Record<string, string[]>
}

const COMPONENTS_DIR = join(import.meta.dirname, "../src/components")
const modulePath = (name: string) => join(COMPONENTS_DIR, `${name}.tsx`)

/**
 * The `data-slot` values one module stamps, read from its source the same way the generator reads
 * shadcn's. Static rather than rendered on purpose: a rendered tree only shows the branch the test
 * happened to take — `drawer` alone has a phone branch and a desktop one — and a slot a component
 * borrows from a sibling file (today `tabs`, which renders `segmented-control`'s parts) genuinely
 * does not answer to shadcn's selector, which is the divergence worth catching.
 */
function slotsOf(source: string): Set<string> {
  return new Set(
    [...source.matchAll(/data-slot="([^"]+)"/g)].map(([, slot]) => slot!)
  )
}

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
 * and `slotGap` EXACTLY the set of shadcn `data-slot` values it does not stamp; `closes` names the
 * task that empties them, `slotCloses` overriding it where the two are owned by different tasks.
 * Exact rather than "at most": closing part of a gap forces this list to shrink, and a symbol or
 * slot that goes missing later fails here.
 */
interface Built {
  readonly gap: readonly string[]
  readonly closes?: string
  readonly slotGap?: readonly string[]
  readonly slotCloses?: string
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
 * Task 15's §5.2 renames have all landed, so each is audited under shadcn's name against the
 * file that now carries it. `sheet` is the one row that went the other way: the bottom sheet
 * left under `drawer`, and the name is held for Task 19's edge panel.
 */
const LEDGER: Record<string, Row> = {
  accordion: {
    gap: [],
    note:
      "`AccordionContent` is shadcn's name for Base UI's `Panel`, exported as an alias of " +
      "`AccordionPanel` so both names reach the same component.",
  },
  alert: { task: "Task 20" },
  "alert-dialog": { gap: [] },
  "aspect-ratio": { task: "Task 21" },
  attachment: { task: "Task 52–58 (the AI set)" },
  avatar: {
    gap: [],
    note:
      "`AvatarBadge`, `AvatarGroup` and `AvatarGroupCount` are Task 15c's. shadcn keys the " +
      "badge's size off `group-data-[size=…]/avatar`, so applecn's do the same against its own " +
      "`small`/`medium`/`large` — the size names are an older divergence, not this task's.",
  },
  badge: { gap: [] },
  breadcrumb: {
    gap: [],
    note:
      "two markups reach the same tree, which is how Task 15c settled `BreadcrumbList`: " +
      "`Breadcrumb` looks for a `BreadcrumbList` among its children and, finding one, renders " +
      "what it was given — shadcn's explicit composition, one `<ol>`, only the separators " +
      "written. Finding none, it keeps applecn's shorthand and supplies both.",
  },
  bubble: { task: "Task 52–58 (the AI set)" },
  button: { gap: [] },
  "button-group": {
    gap: ["ButtonGroupSeparator", "ButtonGroupText", "buttonGroupVariants"],
    slotGap: ["button-group-separator"],
    closes: "Task 42",
    note: "Task 42 rebuilds `toolbar` on `button-group` and owns its surface.",
  },
  calendar: { task: "Task 28" },
  card: { gap: [] },
  carousel: {
    gap: [],
    note:
      "the same shape as `breadcrumb`: `Carousel` looks for a `CarouselContent` among its " +
      "children and, finding none, supplies the track itself — keeping the arrows out of it, " +
      "since an arrow is not a slide. `useCarousel` returns the scroller and where it has got " +
      "to; shadcn's returns embla's `api` and `opts` beside those, and applecn's carousel " +
      "scrolls natively and takes no carousel library, so it has neither.",
  },
  chart: { task: "Task 30b" },
  checkbox: { gap: [] },
  collapsible: {
    gap: [],
    note:
      "the rename of `disclosure-group`. Base UI names the region `Panel`, so the sub-component " +
      "took shadcn's `CollapsibleContent` rather than a literal `CollapsiblePanel`; Task 26 " +
      "verifies exactly that pair. Task 15b re-slotted it: `collapsible`, `collapsible-trigger` " +
      "and `collapsible-content`, with `collapsible-chevron` the Apple addition.",
  },
  combobox: {
    gap: [],
    slotGap: ["input-group-button"],
    slotCloses: "Task 18",
    note:
      "`ComboboxLabel` was the naming split the Phase 2 review flagged as M6, and it resolved " +
      "against shadcn rather than by preference: shadcn's `ComboboxLabel` wraps Base UI's " +
      '`Combobox.GroupLabel` and carries `data-slot="combobox-label"`. Task 15b closed the slot ' +
      "half; Task 15c renamed the export and kept `ComboboxGroupLabel` as an alias of it. " +
      "`input-group-button` waits for Task 18's `input-group`, which is what stamps it. One " +
      "value in this row is a phantom on both sides: Base UI's `Collection` renders the rows " +
      "and no element of its own and takes only `children`, so shadcn's " +
      '`data-slot="combobox-collection"` never reaches the DOM there either. applecn carries it ' +
      "for source parity; nothing can select on it in either project.",
  },
  command: { task: "Task 27" },
  "context-menu": { gap: [] },
  dialog: { gap: [] },
  direction: { task: "Task 52–58 (the AI set)" },
  drawer: {
    gap: [],
    note:
      "the rename of the bottom `sheet`. Task 15b re-slotted it from the `sheet-*` values the " +
      "rename left behind, which Task 19's real edge panel would otherwise have collided with, " +
      "and Task 15c exposed the three parts `DrawerContent` used to render inline: " +
      "`DrawerPortal`, `DrawerOverlay` and `DrawerSwipeHandle` (the grabber's shadcn name).",
  },
  "dropdown-menu": {
    gap: [],
    note:
      "the rename of `menu`. Task 15b re-slotted its 17 `menu-*` values and widened the shared " +
      "item class's shortcut selector to `[data-slot$=-shortcut]` so `menubar` and " +
      "`context-menu` keep their own names; `DropdownMenuPortal` is the portal " +
      "`DropdownMenuContent` always used, now exposed.",
  },
  empty: {
    gap: [],
    note:
      "`EmptyContent` is an alias of the Apple-named `EmptyActions`; `EmptyMedia` is the " +
      "general media well beside `EmptyIcon`, and both stamp `empty-icon` as shadcn's does.",
  },
  field: {
    gap: [
      "FieldContent",
      "FieldLegend",
      "FieldSeparator",
      "FieldSet",
      "FieldTitle",
    ],
    slotGap: [
      "field-content",
      "field-legend",
      "field-separator",
      "field-separator-content",
      "field-set",
    ],
    closes: "Task 37",
    note: "Task 37 rebuilds `checkbox-group` on FieldSet/FieldGroup and needs these.",
  },
  "hover-card": {
    gap: [],
    note:
      "the rename of `preview-card`; the three exports match shadcn's exactly, and Task 15b " +
      "re-slotted it — including `hover-card-portal`, which shadcn stamps inside its content " +
      "rather than exporting.",
  },
  input: { gap: [] },
  "input-group": { task: "Task 18" },
  "input-otp": {
    gap: [],
    note:
      "the rename of `passcode-field`. Task 15c built shadcn's three composition parts on Base " +
      "UI's OTP Field: giving `InputOTP` children hands the layout to them, and the `length` " +
      "shorthand renders the same `InputOTPSlot`, so `[data-slot=input-otp-slot]` reaches the " +
      "boxes either way. `index` is shadcn's prop — Base UI takes a box's position from render " +
      "order — and is kept so its markup transplants, naming the digit and never reaching the " +
      "input. One divergence stands: shadcn's slot is a `<div>` echoing one hidden input, " +
      "because it wraps the `input-otp` package; Base UI gives each box a real `<input>`.",
  },
  item: { task: "Task 17" },
  kbd: { gap: [] },
  label: { gap: [] },
  marker: { task: "Task 52–58 (the AI set)" },
  menubar: { gap: [] },
  message: { task: "Task 52–58 (the AI set)" },
  "message-scroller": { task: "Task 52–58 (the AI set)" },
  "native-select": { task: "Task 22" },
  "navigation-menu": {
    gap: [],
    note:
      "Task 15c lifted the portal/positioner/popup/viewport `NavigationMenu` rendered inline " +
      "into shadcn's `NavigationMenuPositioner`, which the root still renders, so apple.com's " +
      "bar needs no extra markup. `navigationMenuTriggerStyle` is the cva of the class the " +
      "trigger and the link share — shadcn styles only its trigger with it, and applecn's link " +
      "wears it too because apple.com draws the two identically.",
  },
  pagination: { task: "Task 23" },
  popover: { gap: [] },
  progress: { gap: [] },
  questionnaire: { task: "Task 52–58 (the AI set)" },
  "radio-group": { gap: [] },
  resizable: { task: "Task 24" },
  "scroll-area": {
    gap: [],
    note: "`ScrollBar` is shadcn's name for `ScrollAreaScrollbar`, exported as an alias.",
  },
  select: { gap: [] },
  separator: { gap: [] },
  sheet: {
    task: "Task 19",
    note:
      "spec §5.2 freed this name: the bottom sheet that answered to it is now `drawer`. The " +
      "old row read as parity because `Sheet*` and shadcn's edge-panel `Sheet*` spell the same " +
      "symbols, not because applecn shipped an edge panel. Task 19 builds the real one.",
  },
  sidebar: {
    gap: [],
    note:
      "the widest gap in the catalogue, closed by Task 15c. The composition question was the " +
      "layout model: shadcn's sidebar is `position: fixed` with a spacer holding its place, and " +
      "applecn's stands in a grid, which is how macOS's split view works. They are not in " +
      'conflict — shadcn\'s own `collapsible="none"` is the standing sidebar exactly — so ' +
      '`collapsible` now takes both vocabularies: `false`/`"none"` stands in the layout, ' +
      '`true` is Apple\'s sheet presentation, and `"offcanvas"`/`"icon"` render shadcn\'s ' +
      "`sidebar-gap`/`sidebar-container`/`sidebar-inner` structure. `useSidebar` took shadcn's " +
      "meanings with it: `open` is now the standing sidebar and `openMobile` the sheet, where " +
      "applecn had one `open` that meant the sheet. `SidebarItem` and `SidebarMenuButton` are " +
      "the same measured row wearing two APIs.",
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
    slotGap: ["tabs-content", "tabs-list", "tabs-trigger"],
    closes: "Task 16",
    note: "applecn uses Base UI's TabsPanel/TabsTab names; Task 16 owns the tabs surface.",
  },
  textarea: { gap: [] },
  toast: {
    gap: [],
    note:
      "Task 15c split the banner `Toaster` rendered inline into shadcn's parts, so the stack a " +
      "caller assembles themselves is the one `Toaster` assembles. `useToast` is kept as an " +
      "alias of `useToastManager`, `ToastIcon` is the Apple addition (Notification Center's " +
      "app icon, drawn from the toast's `data.icon` rather than shadcn's `type`), and " +
      "`Toaster` keeps its 5 s default timeout.",
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

  test("a recorded slot gap names the task that closes it", () => {
    const unattributed = built
      .filter(
        ([, row]) =>
          (row.slotGap?.length ?? 0) > 0 && !(row.slotCloses ?? row.closes)
      )
      .map(([name]) => name)
    expect(
      unattributed,
      "every slot gap names the task that closes it"
    ).toEqual([])
  })

  test("the fixture records shadcn's data-slot values alongside its exports", () => {
    expect(Object.keys(FIXTURE.slots).sort()).toEqual(
      Object.keys(FIXTURE.exports).sort()
    )
    // A canary on the generator: `data-slot` is shadcn's own convention, so a component that
    // stamps none at all means the extraction broke, not that shadcn stopped using it.
    const slotless = Object.entries(FIXTURE.slots)
      .filter(([, slots]) => slots.length === 0)
      .map(([name]) => name)
    expect(slotless).toEqual(["badge", "direction", "sonner"])
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

  for (const [name, row] of built)
    test(`${name} stamps every data-slot shadcn does`, () => {
      const present = slotsOf(readFileSync(modulePath(name), "utf8"))
      const missing = FIXTURE.slots[name]!.filter(
        (slot) => !present.has(slot)
      ).sort()
      expect(
        missing,
        `${name}'s data-slot gap against shadcn ${FIXTURE.commit.slice(0, 7)} changed. ` +
          `A shadcn user's CSS selects on these, so either close the gap, or record it exactly ` +
          `in this file's LEDGER as \`slotGap\` with the task that will.`
      ).toEqual([...(row.slotGap ?? [])].sort())
    })
})
