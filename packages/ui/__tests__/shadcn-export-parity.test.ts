import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import ts from "typescript"
import { describe, expect, test } from "vitest"

/**
 * Public-surface parity with shadcn (spec §3, §5.1, §7.2) — the exported symbols, the `data-slot`
 * values AND the props. applecn may ship MORE than shadcn — the Apple additions,
 * `AlertDialogActions`, `DrawerToolbar`, `data-slot="drawer-toolbar"` and the rest — and may never
 * ship fewer, or a shadcn user's copy-pasted markup breaks.
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
 *
 * The props layer is the third and newest, and it exists because the first two did not bite where
 * spec §1 says parity lives — "same props where the underlying primitive allows". `item` shipped
 * with every export and every slot shadcn has, green on both layers, while `Item` took `className`
 * and `render` against shadcn's `className`, `render`, `variant` and `size`: a `<Item variant=
 * "outline">` transplanted from shadcn's docs put an unknown attribute on a `<div>` and changed
 * nothing. That is the same class of hole `data-slot` was before Task 15b, caught the same way —
 * from shadcn's own source, against the same recorded commit.
 *
 * The two sides are read differently, on purpose:
 *
 * - **shadcn's side is syntactic** — the props each component names in its signature, which is what
 *   the generator can see in a repo it only fetches. It is also the right set: a prop reached
 *   through `...props` is forwarded untouched, while a destructured one is being consumed.
 * - **applecn's side is the type** — `ts`'s view of what the exported component's props actually
 *   admit. This repo is here to be asked, so it is asked the exact question a shadcn user's editor
 *   would: does `<DropdownMenuItem inset>` typecheck? Reading applecn's destructuring instead would
 *   report a divergence every time applecn forwards a prop its primitive already handles — Base UI
 *   takes `orientation` on `Tabs.Root` and `modal` on `Dialog.Root`, so applecn's `Tabs` and
 *   `Drawer` need not name them, and a syntactic read called all three a gap. The type does not.
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
  readonly props: Record<string, Record<string, string[]>>
}

const COMPONENTS_DIR = join(import.meta.dirname, "../src/components")
const modulePath = (name: string) => join(COMPONENTS_DIR, `${name}.tsx`)

/**
 * One TypeScript program over every component, built on first use (~0.7 s) and reused for the rest
 * of the file. Its only job is to answer "which props does this exported component admit?".
 */
let program: ts.Program | undefined
function typeChecker(): ts.TypeChecker {
  if (!program) {
    const root = join(import.meta.dirname, "..")
    const config = ts.readConfigFile(join(root, "tsconfig.json"), (path) =>
      ts.sys.readFile(path)
    )
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
    const sources = readdirSync(COMPONENTS_DIR)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => join(COMPONENTS_DIR, file))
    program = ts.createProgram(sources, { ...parsed.options, noEmit: true })
  }
  return program.getTypeChecker()
}

/**
 * The prop names `name.tsx`'s exported `component` admits, or `null` when the module does not
 * export it as something callable — which means the export gap above already owns the divergence.
 */
function acceptedProps(name: string, component: string): Set<string> | null {
  const checker = typeChecker()
  const source = program!.getSourceFile(modulePath(name))
  if (!source) return null
  const moduleSymbol = checker.getSymbolAtLocation(source)
  if (!moduleSymbol) return null
  const exported = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.name === component)
  if (!exported) return null
  const [signature] = checker
    .getTypeOfSymbolAtLocation(exported, source)
    .getCallSignatures()
  if (!signature) return null
  const [parameter] = signature.getParameters()
  if (!parameter) return new Set()
  return new Set(
    checker
      .getTypeOfSymbolAtLocation(
        parameter,
        parameter.valueDeclaration ?? source
      )
      .getProperties()
      .map((symbol) => symbol.name)
  )
}

/**
 * The `data-slot` values one module stamps, read from its source the same way the generator reads
 * shadcn's. Static rather than rendered on purpose: a rendered tree only shows the branch the test
 * happened to take — `drawer` alone has a phone branch and a desktop one — and a slot a component
 * borrows from a sibling file genuinely does not answer to shadcn's selector, which is the
 * divergence worth catching. `tabs` was the case that proved it, renaming nothing while it
 * rendered `segmented-control`'s parts, until Task 16's fold gave it its own.
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
  /**
   * EXACTLY the `Component.prop` pairs shadcn names that applecn's type does not admit, with
   * `propCloses` (falling back to `closes`) naming the task that empties them. A pair only belongs
   * here when applecn exports the component: a component it does not export yet is already a `gap`,
   * and listing its props too would double-count the same divergence.
   */
  readonly propGap?: readonly string[]
  readonly propCloses?: string
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
  "alert-dialog": {
    propGap: [
      "AlertDialogCancel.size",
      "AlertDialogCancel.variant",
      "AlertDialogContent.size",
    ],
    propCloses: "Task 59",
    gap: [],
  },
  "aspect-ratio": { task: "Task 21" },
  attachment: { task: "Task 52–58 (the AI set)" },
  avatar: {
    gap: [],
    note:
      "`AvatarBadge`, `AvatarGroup` and `AvatarGroupCount` are Task 15c's. shadcn keys the " +
      "badge's size off `group-data-[size=…]/avatar`, so applecn's do the same against its own " +
      "`small`/`medium`/`large` — the size names are an older divergence, not this task's.",
  },
  badge: {
    propGap: ["Badge.render"],
    propCloses: "Task 59",
    gap: [],
  },
  breadcrumb: {
    propGap: ["BreadcrumbLink.render"],
    propCloses: "Task 59",
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
  card: {
    propGap: ["Card.size"],
    propCloses: "Task 59",
    gap: [],
  },
  carousel: {
    propGap: [
      "Carousel.opts",
      "Carousel.orientation",
      "Carousel.plugins",
      "Carousel.setApi",
    ],
    propCloses: "Task 59",
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
    propGap: [
      "ComboboxContent.alignOffset",
      "ComboboxContent.anchor",
      "ComboboxInput.showClear",
      "ComboboxInput.showTrigger",
    ],
    propCloses: "Task 59",
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
  "context-menu": {
    propGap: [
      "ContextMenuCheckboxItem.inset",
      "ContextMenuContent.align",
      "ContextMenuContent.alignOffset",
      "ContextMenuContent.side",
      "ContextMenuContent.sideOffset",
      "ContextMenuItem.inset",
      "ContextMenuLabel.inset",
      "ContextMenuRadioItem.inset",
      "ContextMenuSubTrigger.inset",
    ],
    propCloses: "Task 59",
    gap: [],
  },
  dialog: {
    propGap: ["DialogContent.showCloseButton", "DialogFooter.showCloseButton"],
    propCloses: "Task 59",
    gap: [],
  },
  direction: { task: "Task 52–58 (the AI set)" },
  drawer: {
    propGap: [
      "Drawer.showSwipeHandle",
      "Drawer.snapPoints",
      "Drawer.swipeDirection",
    ],
    propCloses: "Task 59",
    gap: [],
    note:
      "the rename of the bottom `sheet`. Task 15b re-slotted it from the `sheet-*` values the " +
      "rename left behind, which Task 19's real edge panel would otherwise have collided with, " +
      "and Task 15c exposed the three parts `DrawerContent` used to render inline: " +
      "`DrawerPortal`, `DrawerOverlay` and `DrawerSwipeHandle` (the grabber's shadcn name).",
  },
  "dropdown-menu": {
    propGap: [
      "DropdownMenuCheckboxItem.inset",
      "DropdownMenuItem.inset",
      "DropdownMenuLabel.inset",
      "DropdownMenuRadioItem.inset",
      "DropdownMenuSubTrigger.inset",
    ],
    propCloses: "Task 59",
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
    propGap: ["Field.orientation", "FieldError.errors"],
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
    propGap: ["InputOTP.containerClassName"],
    propCloses: "Task 59",
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
  item: {
    gap: [],
    note:
      "shadcn's row primitive on Apple's list metrics: the `--list-row-*` tokens give it 52 pt " +
      "rows with 15 × 16 pt padding on iOS 26 and AppKit's 28 pt with 4 × 10 on macOS, which is " +
      "what lets Task 31 rebuild `list` on it without a measured metric moving. " +
      '`data-slot="item"` is stamped by `useRender`\'s state rather than written, exactly as ' +
      "shadcn stamps it, so it is a literal in neither source and neither side of this row " +
      "carries it. `Item` takes shadcn's `variant` (default/outline/muted) and `size` " +
      "(default/sm/xs) with shadcn's defaults, resolved to measured Apple slots rather than to " +
      "the theme classes shadcn's own CSS defines — the grouped card's radius and hairline, the " +
      "quietest fill, and the type one and two steps below a row's. The smaller sizes drop the " +
      "height floor rather than invent a shorter one, because `default` is the size with a " +
      "measured metric behind it. No token was added and no value changed. " +
      'One divergence stands: shadcn\'s `ItemGroup` sets `role="list"` (upstream `item.tsx:12`) ' +
      "over rows that are not `listitem`s, which announces an empty list — and `ItemSeparator`, " +
      "the sibling the group exists to be used with, is Base UI's `Separator` in both projects " +
      'and renders `role="separator"`, a child the role forbids. Re-verified on 2026-09-08 by ' +
      "restoring the role: axe fails this module's own registry example on " +
      "`aria-required-children`, so the composition is unsound upstream too, not merely unbuilt " +
      "here. applecn's group leaves the role to a caller who supplies real list rows.",
  },
  kbd: { gap: [] },
  label: { gap: [] },
  marker: { task: "Task 52–58 (the AI set)" },
  menubar: {
    propGap: [
      "MenubarCheckboxItem.inset",
      "MenubarContent.alignOffset",
      "MenubarItem.inset",
      "MenubarLabel.inset",
      "MenubarRadioItem.inset",
      "MenubarSubTrigger.inset",
    ],
    propCloses: "Task 59",
    gap: [],
  },
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
  select: {
    propGap: ["SelectTrigger.size"],
    propCloses: "Task 59",
    gap: [],
  },
  separator: { gap: [] },
  sheet: {
    task: "Task 19",
    note:
      "spec §5.2 freed this name: the bottom sheet that answered to it is now `drawer`. The " +
      "old row read as parity because `Sheet*` and shadcn's edge-panel `Sheet*` spell the same " +
      "symbols, not because applecn shipped an edge panel. Task 19 builds the real one.",
  },
  sidebar: {
    propGap: ["SidebarMenuButton.size", "SidebarMenuButton.variant"],
    propCloses: "Task 59",
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
  switch: {
    propGap: ["Switch.size"],
    propCloses: "Task 59",
    gap: [],
  },
  table: { gap: [] },
  tabs: {
    propGap: ["TabsList.variant"],
    gap: ["tabsListVariants"],
    closes: "Task 38",
    note:
      "Task 16's fold gave `tabs` the segmented list, tab and sliding indicator it used to " +
      "borrow from `segmented-control`, so it stamps shadcn's three slots itself and exports " +
      "`TabsTrigger`/`TabsContent` as aliases of Base UI's `TabsTab`/`TabsPanel`. " +
      "`tabsListVariants` switches shadcn's list between its `default` and `line` looks; " +
      "applecn ships one look, the Apple segmented control, so Task 38 — which rebuilds " +
      "`tab-bar` on `tabs` — owns whether a second list style exists.",
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
  toggle: {
    propGap: ["Toggle.variant"],
    propCloses: "Task 59",
    gap: [],
  },
  "toggle-group": {
    propGap: [
      "ToggleGroup.size",
      "ToggleGroup.spacing",
      "ToggleGroup.variant",
      "ToggleGroupItem.size",
      "ToggleGroupItem.variant",
    ],
    propCloses: "Task 59",
    gap: [],
  },
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

  test("a recorded prop gap names the task that closes it", () => {
    const unattributed = built
      .filter(
        ([, row]) =>
          (row.propGap?.length ?? 0) > 0 && !(row.propCloses ?? row.closes)
      )
      .map(([name]) => name)
    expect(
      unattributed,
      "every prop gap names the task that closes it"
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

  test("the fixture records the props shadcn's components name", () => {
    expect(Object.keys(FIXTURE.props).sort()).toEqual(
      Object.keys(FIXTURE.exports).sort()
    )
    // Every component recorded must be one shadcn exports: the internal `ToastList`, `ToastIcon`,
    // `ComboboxClear`, `SheetPortal` and `SheetOverlay` are not surface a user writes against.
    for (const [name, components] of Object.entries(FIXTURE.props))
      for (const component of Object.keys(components))
        expect(FIXTURE.exports[name], `${name} exports ${component}`).toContain(
          component
        )
    // Canaries on the extraction. A component naming nothing is real and common — `function
    // Dialog({ ...props })` forwards everything and consumes none — so emptiness is not the
    // signal. A collapse in the *count* is: the parse either reads a signature or skips the
    // component entirely, so a broken one shows up as components going missing.
    const recorded = Object.values(FIXTURE.props).flatMap((components) =>
      Object.keys(components)
    )
    expect(recorded.length).toBeGreaterThan(300)
    // And a module recording nothing at all must be one that declares no component: `direction`
    // re-exports Base UI's provider untouched, `sonner` wraps the third-party toaster.
    const componentless = Object.entries(FIXTURE.props)
      .filter(([, components]) => Object.keys(components).length === 0)
      .map(([name]) => name)
    expect(componentless).toEqual(["direction", "sonner"])
    // And the sharpest one: `variant`/`size` on `Item` are the pair this layer was added for. If
    // the extraction stops seeing cva variant props, it has stopped being worth running.
    expect(FIXTURE.props.item?.Item).toContain("variant")
    expect(FIXTURE.props.item?.Item).toContain("size")
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

  for (const [name, row] of built)
    test(`${name} takes every prop shadcn's components name`, () => {
      const missing: string[] = []
      const unexported: string[] = []
      for (const [component, props] of Object.entries(FIXTURE.props[name]!)) {
        const accepted = acceptedProps(name, component)
        if (!accepted) {
          unexported.push(component)
          continue
        }
        for (const prop of props)
          if (!accepted.has(prop)) missing.push(`${component}.${prop}`)
      }
      // A component whose props cannot be read is one applecn does not export as a component. That
      // is an export gap, already recorded above — but only if it IS recorded, so the skip cannot
      // become a quiet hole where a component is exported as something uncallable.
      expect(
        unexported.filter((component) => !row.gap.includes(component)),
        `${name} exports these but not as components, and no export gap covers them`
      ).toEqual([])
      expect(
        missing.sort(),
        `${name}'s prop gap against shadcn ${FIXTURE.commit.slice(0, 7)} changed. ` +
          `A shadcn user writes these props, so either take them, or record them exactly in ` +
          `this file's LEDGER as \`propGap\` with the task that will.`
      ).toEqual([...(row.propGap ?? [])].sort())
    })
})
