# Full shadcn parity, Apple fidelity — design spec

Date: 2026-09-07. Approved by the owner in session on 2026-09-07 after a brainstorming pass.
Extends `2026-09-05-apple-design-system-design.md` (the design system itself) and
`2026-09-05-applecn-public-release-design.md` (the rename and toolchain); supersedes neither.

## 1. Goal

applecn is a shadcn fork. A developer who knows shadcn must be able to install applecn and find
every primitive they already know, under the name they already know, with the exports and
composition they already know — and have it look and behave like Apple's version of that control
on iOS 26, macOS 26 or apple.com.

Two things follow, and they are the whole spec:

1. **Structural parity with shadcn.** Every primitive shadcn ships, applecn ships: same item name,
   same exported sub-components, same composition, same props where the underlying primitive
   allows. No divergence for the sake of Apple's vocabulary.
2. **Apple fidelity, undiminished.** Every measured number in `docs/research/apple-design-system-reference.md`
   still holds after the refactor. Parity is names, exports and composition. It is never pixels.

Where Apple has a control shadcn has no analogue for, applecn adds it — built on shadcn primitives
and following shadcn conventions, never as a parallel implementation.

## 2. Non-goals

- Publishing an npm package. Everything ships through the shadcn registry, including the CSS. See §6.4.
- Changing any token value. The measured metrics are the asset; this spec moves where they are read
  from, never what they say.
- Runtime idiom switching as a default. It survives as an opt-in (§6.2), but a consumer installs one
  idiom unless they ask for more.
- Apple's fonts or SF Symbols. Unchanged from the original spec.

## 3. The parity rule

> Where shadcn ships a primitive, applecn ships **that** primitive — shadcn's name, shadcn's exports,
> shadcn's semantics — styled as Apple. Where Apple has something shadcn does not, applecn adds it
> **on top of** a shadcn primitive, under Apple's name. Nothing is ever renamed away from shadcn to
> be more Apple.

Three consequences worth stating, because each reverses an earlier decision in this repo:

- `sheet` means shadcn's edge panel (`side` = top/right/bottom/left). Today's bottom sheet becomes
  `drawer`. This is a silent breaking change for anyone who installed `@applecn/sheet`; it is taken
  now because the project is pre-announcement and the cost only grows.
- `typography` means shadcn's prose styles. Apple's eleven text styles remain a separate `text`
  component built on it.
- `item` means shadcn's row primitive. Apple's inset-grouped `list` is built on it.

### 3.1 The three layers of the surface

Parity is checked at three layers, all generated from shadcn's Base UI source and all enforced by
`packages/ui/__tests__/shadcn-export-parity.test.ts`:

1. **Exported symbols** — a shadcn user's imports resolve.
2. **`data-slot` values** — a shadcn user's CSS targets the right element.
3. **Props** — a shadcn user's copy-pasted markup accepts the same attributes.

applecn may expose _more_ at any layer; it may never expose _less_. Each layer was added only after a
divergence shipped undetected at it, so a fourth layer should be assumed missing rather than absent.

### 3.2 When parity and accessibility conflict, accessibility wins — narrowly, and on the record

shadcn's markup is not always accessible. Where copying it would introduce a violation the repo's own
axe gate catches, applecn diverges by the smallest amount that removes the violation, and records why
here. Guards are never weakened to accommodate a copied defect.

The first instance: shadcn's `ItemGroup` sets `role="list"` (`item.tsx:11`), but `ItemSeparator` —
the sibling that group exists to hold — carries `role="separator"`, which is not a permitted child of
`role="list"`. Restoring the role makes axe fail `aria-required-children` on the component's own
shipped example. The defect is upstream, in a Base UI primitive both projects wrap, so no applecn-side
fix exists that is not a workaround. **applecn's `ItemGroup` omits `role="list"`.** Exports, slots,
props and composition all still match, so nothing a shadcn user pastes breaks; only a container's ARIA
role differs, and it differs in the direction of announcing nothing rather than announcing an empty
list. The rejected alternative — `role="none"` on `ItemSeparator` inside a group — hides a real
separator from assistive technology, trading one defect for another to paper over someone else's bug.

## 4. Findings that motivate this

Measured on 2026-09-07 against the registry as published at commit `c67c4d3`.

### 4.1 applecn does not currently install correctly

The published `apple` style item carries 31 css keys — the `@utility` blocks and the
`[data-platform=…]` token scopes — and is missing three things a consumer needs:

- **`@custom-variant ios` / `macos` / `web` are not shipped.** Every `ios:` / `macos:` / `web:` class
  in the 64 installed components compiles to nothing. A fresh install silently renders the iOS base
  styling with the macOS and web idioms dead — the premise of the library.
- **`tw-animate-css` is neither declared nor shipped**, though `globals.css` imports it. `animate-in`,
  `animate-out`, `fade-in-0` and `zoom-in-95` do nothing in a consumer project, so every overlay
  animation is silently absent.
- **The `@layer base` block is not shipped** — Dynamic Type via `-apple-system-body`, the 16 px
  coarse-pointer input rule, `touch-action: manipulation`.

Two further divergences from shadcn convention:

- All 64 components do `import { cn } from "cn"`, an npm package. Every shadcn component does
  `import { cn } from "@/lib/utils"`. A `lib/utils.ts` item is registered and unused.
- Components import siblings relatively (`from "./icon"`). shadcn uses `@/components/ui/icon`. The
  build rewrites `../hooks/` and `../lib/` but leaves `./`.

### 4.2 The platform variants are unnecessary

All 160 `ios:` / `macos:` / `web:` usages across 25 files were classified by CSS property:

| property group                                                      | usages |
| ------------------------------------------------------------------- | ------ |
| spacing                                                             | 28     |
| background-color                                                    | 28     |
| color                                                               | 20     |
| box-shadow                                                          | 16     |
| font-weight                                                         | 13     |
| border-color                                                        | 12     |
| border-width                                                        | 11     |
| sizing                                                              | 10     |
| border-radius                                                       | 9      |
| motion                                                              | 4      |
| other (5 × `type-caption-1`, 3 × arbitrary property, 1 × translate) | 9      |

**None changes layout or structure.** Every usage is paint or metric, so every one is expressible as
a semantic token whose value the idiom supplies. Distinct `(component, state, property)` slots: **103**.
**39 of 64 components need no change** — they are already purely token-driven. The work concentrates
in twelve files: menu, select, combobox, button, alert-dialog, color-well, menubar, search-field,
context-menu, checkbox, radio-group, passcode-field.

Because the tokens already ship as `[data-platform=…]` scopes, deleting the variants loses nothing:
install one theme and one scope applies; install all three and runtime switching still works.

### 4.3 The custom CSS that must stay, and why

Twenty-one custom utilities remain after this spec's two deletions (§6.3). Three of those become
`@theme` entries, leaving eighteen as `@utility` blocks:

- **`type-*` (11).** They cannot become `@theme --text-*` entries. Measured with the repo's own `cn`:
  `cn("text-body", "text-label")` → `text-label` (the size is dropped) and `cn("text-label", "text-body")`
  → `text-body` (the colour is dropped). The conflict is **prefix-based, not name-based**:
  `cn("text-fg-label", "text-body")` → `text-body`, so renaming the colour ramp fixes nothing. Teaching
  the merger requires a per-project `cn build` step, which is exactly the config burden copy-paste
  exists to avoid. `cn("type-body", "text-label")` keeps both. The current design is correct.
- **`material-*` (4) and `glass*` (3).** Each carries two independent reduced-transparency fallbacks —
  the OS `prefers-reduced-transparency` media query and applecn's own `[data-transparency="reduced"]`
  setting — each overriding background, backdrop-filter and, for glass, box-shadow. Inlined that is
  ~8 classes per call site plus a custom variant, and any site that forgets them is an accessibility
  regression. `glass` has ~47 uses.
- **`hairline*` (3).** Optionally moved to `@theme` shadow entries. Note this is cosmetic only:
  `cn("shadow-hairline", "shadow-lg")` keeps both, so a theme entry gets no better conflict handling
  than a utility does.

shadcn itself ships nine `@custom-variant`s and roughly twenty `@utility` blocks in
`shadcn/tailwind.css`, so custom CSS is not a divergence from shadcn — the registry `css` field is
the convention for delivering it.

### 4.4 `segmented-control` duplicates `toggle-group`

Their tracks are character-identical (`h-(--segmented-height) rounded-segmented bg-fill-3
p-(--segmented-inset)`), as are the item radius, padding, font token, weight and focus ring. They
differ only in how selection is drawn — `toggle-group` moves a background on the pressed item,
`segmented-control` slides a `Tabs.Indicator` — and in semantics (`role="group"` vs `role="tablist"`).

A systematic sweep for components sharing a token family found this to be the **only** true
duplication. `--menu-*`, `--control-*`, `--text-field-*`, `--alert-*` and `--list-*` are shared design
language across primitives shadcn also ships separately; `--progress-*` across meter and progress is
legitimate because `role="meter"` and `role="progressbar"` mean different things.

### 4.5 The existing 64 are not verified per idiom

On 2026-09-07 a checked checkbox and a selected radio were found to be **invisible on the web idiom** —
shipped, with 277 tests passing. The cause was a cascade collision now guarded by
`packages/ui/__tests__/platform-state-cascade.test.ts`, but nothing verifies the general case: that
each component's states are visually distinct, and its measured metrics correct, on each of the three
idioms. "All primitives working properly" is not currently a checkable claim.

## 5. Catalogue

86 components. 43 parity, 21 to build, 22 Apple. Every one of the 64 that exist today is accounted
for below exactly once.

### 5.1 Parity, name already correct (38)

accordion, alert-dialog, avatar, badge, breadcrumb, button, button-group, card, carousel, checkbox,
combobox, context-menu, dialog, empty, field, input, kbd, label, menubar, navigation-menu, popover,
progress, radio-group, scroll-area, select, separator, sidebar, skeleton, slider, spinner, switch,
table, tabs, textarea, toast, toggle, toggle-group, tooltip.

Each still needs its **export surface** audited against shadcn's. That audit is done, and it is
now mechanical: `packages/ui/__tests__/fixtures/shadcn-exports.json` is generated from shadcn's
Base UI base by `packages/ui/scripts/refresh-shadcn-exports.ts`, and
`shadcn-export-parity.test.ts` carries one ledger row per component shadcn ships — at parity, or a
gap recorded exactly with the task that closes it, or not built yet with the task that builds it.

**Correction (2026-09-08, Phase 2 review C1/C2).** This section previously read "`dialog` already
matches shadcn exactly". That was false: shadcn's Base UI `dialog` exports ten symbols and
applecn's exported eight, missing `DialogOverlay` and `DialogPortal`. `alert-dialog` was likewise
audited against an eleven-symbol list where shadcn ships twelve, missing `AlertDialogMedia`. Both
claims had been "verified" against a hand-copied fixture rather than against shadcn, so the
verification was circular and the parity test was green on a live parity break. All three symbols
are now exported. The general rule this earns: **a fixture encoding an external project's API is a
claim about the world and must be checked against that world**, never against the document that
asserts it.

**Extension (2026-09-08, Task 15b).** The public surface is the exported symbols **and** the
`data-slot` values. `data-slot` is how a shadcn consumer targets a sub-component in CSS, so §3's
"shadcn's name, shadcn's exports, shadcn's semantics" governs it as it governs an export name, and
nothing audited it. The generated fixture now carries shadcn's `data-slot` values beside its
exports, the ledger a `slotGap` per component, and nine components were re-slotted to shadcn's
names — `drawer` (17 values still reading `sheet-*` after §5.2's rename, which Task 19's real edge
panel would have collided with), `dropdown-menu` (17 reading `menu-*`), `menubar`, `hover-card`,
`input-otp`, `collapsible`, `accordion`, `carousel`, `combobox` and `empty`. The gaps that remain
are sub-components applecn has not built; Task 15c owns them.

**Extension (2026-09-08, Task 15c).** Task 15c emptied the eight rows Task 15b had left, each of
which carried a composition question rather than a missing line. Three turned out to be the same
question — applecn's component renders a container that shadcn separates out — and took the same
answer: the root looks for the explicit child among its children and, finding none, supplies the
container itself, so shadcn's markup and applecn's shorthand reach the same tree. That is
`breadcrumb` (`BreadcrumbList`), `carousel` (`CarouselContent`) and `input-otp`
(`InputOTPGroup`/`InputOTPSlot`/`InputOTPSeparator`). `navigation-menu` and `toast` were
extractions: the portal/positioner/popup/viewport and the whole banner were rendered inline, and
are now the exported parts their roots assemble. `avatar` gained the badge, the group and the
group count; `combobox` the chips surface, `ComboboxValue`, `ComboboxCollection`,
`ComboboxSeparator` and shadcn's `ComboboxLabel` name, with `ComboboxGroupLabel` kept as an alias
of it. `sidebar` — the widest row — resolved on the layout model: shadcn's sidebar is
`position: fixed` with a spacer holding its place, applecn's stands in a grid, and shadcn's own
`collapsible="none"` **is** the standing sidebar, so `collapsible` now takes both vocabularies
(`false`/`"none"` stands, `true` is Apple's sheet, `"offcanvas"`/`"icon"` render shadcn's
structure) and `useSidebar` took shadcn's meanings with it — `open` is the standing sidebar,
`openMobile` the sheet.

The only gaps left in the ledger belong to tasks that rebuild their components: `tabs` (Task 16),
`field` (Task 37), `button-group` (Task 42) and combobox's `input-group-button` slot (Task 18).
Every other component shadcn ships and applecn has built is at parity on both halves of the
surface.

One finding worth carrying: a `data-slot` in shadcn's source is not always a `data-slot` in
shadcn's DOM. Base UI's `Combobox.Collection` renders its rows and no element of its own and
accepts only `children`, so shadcn's `data-slot="combobox-collection"` never reaches the page
there either. The generated fixture scrapes source, so it lists the value; applecn carries it for
that parity, and nothing can select on it in either project.

### 5.2 Parity, rename (5)

| from               | to              | note                                                                                                                                                   |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `menu`             | `dropdown-menu` |                                                                                                                                                        |
| `preview-card`     | `hover-card`    |                                                                                                                                                        |
| `passcode-field`   | `input-otp`     |                                                                                                                                                        |
| `disclosure-group` | `collapsible`   |                                                                                                                                                        |
| `sheet`            | `drawer`        | the name `sheet` is freed for the edge panel built in §5.4. See the correction below — `drawer` must be shadcn's Drawer, not today's component renamed |

**Correction (2026-09-08, owner).** This row previously read "today's bottom sheet **is** shadcn's
Drawer", and Task 15 executed the rename on that basis. The premise conflated a _component_ with a
_presentation pattern_, and it broke the owner's governing rule: expose shadcn's primitives as they
are, and build Apple's behaviour as additional primitives on top of them. A shadcn name is never
occupied by an Apple component wearing it.

What is actually true, verified against `shadcn-ui/ui@main` and Base UI:

- shadcn's Drawer is built on `@base-ui/react/drawer` and already ships `snapPoints` (Apple's
  detents), `showSwipeHandle` (the grabber), `swipeDirection`, nested drawers, and swipe-progress
  overlay opacity on `cubic-bezier(0.32, 0.72, 0, 1)` — the iOS sheet curve. It **is** an accessible
  bottom sheet matching Apple's model, so Apple needs no bottom-sheet primitive of its own.
- applecn's component already imports that same Base UI primitive; it was never hand-rolled.
- The only thing making it not shadcn's Drawer is that it calls `useIsDesktop()` and switches to
  Base UI **Dialog** above the breakpoint. shadcn's Drawer is always a drawer.

So `drawer` becomes shadcn's Drawer — always a drawer, `snapPoints`/`showSwipeHandle` in place of the
Apple-invented `detent` prop, Apple's measured styling unchanged, and `DrawerSection`/`DrawerToolbar`
retained as additive Apple extras, which §3 permits. The breakpoint switching moves to
`responsive-dialog` (§5.8), which is where the owner said it belonged from the start. **Task 44 owns
this**; it is not a Phase 3 change.

### 5.3 Parity, fold (1)

`segmented-control` folds into `toggle-group`, which takes the sliding indicator (the truer iOS
behaviour). `tabs` carries the same segmented styling for the case that drives panels. Net: one
component deleted.

### 5.4 To build — shadcn primitives applecn lacks (14)

alert, aspect-ratio, calendar, chart, command, data-table, date-picker, input-group, item,
native-select, pagination, resizable, sheet (edge panel), typography.

`drawer` is not here: it is §5.2's rename of today's bottom sheet.

`sonner` is deliberately not here either, and the export audit surfaced the omission. shadcn's
`sonner.tsx` exports one symbol, `Toaster`, wrapping the third-party `sonner` package. applecn
ships its own `toast` on Base UI and takes no runtime dependency on sonner, so the row is declined
on the record in `shadcn-export-parity.test.ts` rather than left as an unexplained absence.

Each has an Apple original to measure: `UICalendarView`/`NSDatePicker` for calendar and date-picker,
Spotlight for command, `NSTableView` for data-table, Swift Charts for chart, the iOS notification
banner for alert, apple.com's own pagination, the macOS draggable split divider for resizable.

`chart` and `data-table` are each a subsystem; they are sub-phases of §7.3, not single tasks.

### 5.5 To build — shadcn's AI set (7)

attachment, bubble, direction, marker, message, message-scroller, questionnaire. Last, because they
are a product surface rather than primitives.

### 5.6 Apple compositions on a shadcn base (13)

| applecn          | built on                      | Apple reference                               |
| ---------------- | ----------------------------- | --------------------------------------------- |
| `list`           | `item`                        | inset grouped list, 26 pt corners, 52 pt rows |
| `lockup`         | `item`                        | media + title + description                   |
| `search-field`   | `input-group`                 | 44 pt capsule, magnifier addon, clear, cancel |
| `stepper`        | `input-group`                 | 94 × 32 capsule, −/+ as `InputGroupButton`    |
| `color-well`     | `input-group`                 |                                               |
| `split-view`     | `resizable`                   | gains the drag it never had                   |
| `checkbox-group` | `field` (FieldSet/FieldGroup) | macOS text-style hierarchy                    |
| `tab-bar`        | `tabs`                        | platter 62 inset 21, items 54, labels 10      |
| `action-sheet`   | `drawer`                      | 48 pt capsule actions from the bottom         |
| `page-control`   | `pagination`                  | iOS dots                                      |
| `text`           | `typography`                  | the eleven text styles                        |
| `toolbar`        | `button-group`                | partial — grouped actions                     |
| `link`           | `typography`                  |                                               |

### 5.7 Genuinely Apple-only (7)

`navigation-bar`, `window`, `meter`, `rating`, `icon`, and the two utilities `glass` and `material`.

#### 5.7.1 ReUI as a sanctioned source for primitives shadcn lacks

Approved by the owner on 2026-09-08. Where shadcn ships no primitive at all, applecn may take one
from **ReUI** (`https://reui.io/r/<name>.json`, `keenthemes/reui`, MIT, ~1,700 registry items) rather
than inventing a shape. ReUI is shadcn-schema-compatible and builds on the same `@base-ui/react`
primitives this project already uses, so a component taken from it needs restyling, not rearchitecting.

This does not touch the parity rule. §3 governs everything shadcn _does_ ship; this covers only the
gaps. Verified absent from shadcn's Base UI registry and present in ReUI: `number-field`, `stepper`
(ReUI's is a _wizard_ stepper, not a numeric one), `rating`, `tree`, `timeline`, `kanban`,
`phone-input`, `cascader`, `data-grid`.

The immediate consequence is **`number-field`**. Apple's stepper — the 94 × 32 capsule with − and + —
is semantically a number field, and Base UI ships `number-field` with the increment, decrement,
clamping and scrub behaviour already solved. ReUI wraps it as `NumberField`, `NumberFieldGroup`,
`NumberFieldInput`, `NumberFieldIncrement`, `NumberFieldDecrement`, `NumberFieldScrubArea`. So
§5.6's `stepper` is better built on a `number-field` primitive than on `input-group` alone:
`input-group` supplies the capsule chrome, `number-field` supplies the behaviour. Task 34 owns this.

ReUI's `data-grid` is also worth weighing for §5.4's `data-table`, since shadcn has no `data-table`
component either — see the note in §5.4.

Attribution: components derived from ReUI carry a source comment naming the upstream item and its
MIT licence.

### 5.8 New Apple primitives (2)

- **`responsive-dialog`** — drawer below `sm`, dialog from `sm`.
- **`responsive-alert-dialog`** — action sheet below `sm`, alert dialog from `sm`. The action sheet is
  correct here: iOS presents a destructive confirmation as an action sheet, not a drawer.

Both follow shadcn's export shape exactly: `ResponsiveDialog`, `ResponsiveDialogTrigger`,
`ResponsiveDialogContent`, `ResponsiveDialogHeader`, `ResponsiveDialogFooter`, `ResponsiveDialogTitle`,
`ResponsiveDialogDescription`, `ResponsiveDialogClose`.

Delegation: `useIsDesktop()` picks the branch and a context tells the parts which to render. The
alternative — render both, hide one with CSS — gives two focus traps and duplicate DOM, and is
rejected. The media query is JS, so the trigger renders before the breakpoint is known; this is
harmless because content is portaled and exists only while open.

**Both compose applecn's own `dialog` and `drawer` components — never `@base-ui/react` directly.**
This is the layering the whole spec rests on: a shadcn-named primitive wraps the underlying library,
and everything Apple composes those primitives. Reaching past the shadcn layer into Base UI is what
§5.6's thirteen rebuilds exist to undo, and a new Apple primitive must not reintroduce it. It is also
concretely unsound: Base UI's Dialog and Drawer roots carry incompatible `onOpenChange` event-detail
types, so a component holding both raw roots does not typecheck. Compose `Dialog`/`DialogContent`
from `./dialog` and `Drawer`/`DrawerContent` from `./drawer`.

The delegation source is today's `drawer.tsx`, which already implements exactly this switch and must
have it removed as part of §5.2's correction — `drawer` keeps the drawer branch only.

## 6. Architecture

### 6.1 Detokenised components

Every `ios:` / `macos:` / `web:` class is replaced by a semantic token read with Tailwind's
`(--var)` syntax. Example, from `checkbox.tsx`:

```diff
- macos:border macos:shadow-control macos:data-unchecked:border-label-3
- macos:data-unchecked:bg-background-3
- web:border web:data-unchecked:border-label-4 web:data-unchecked:bg-background-3
+ border-(length:--checkbox-border-width) shadow-(--checkbox-shadow)
+ data-unchecked:border-(--checkbox-border) data-unchecked:bg-(--checkbox-bg)
```

The three `@custom-variant` blocks are then deleted from `globals.css`. New tokens are generated from
`packages/ui/src/tokens/*.ts` like every other token, so `tokens.css` stays generated and tested.

### 6.2 Three themes

Three `registry:theme` items — `@applecn/ios`, `@applecn/macos`, `@applecn/web` — each carrying one
idiom's `[data-platform=…]` scope as `cssVars`. Default install is one idiom:

```bash
npx shadcn@latest add @applecn/ios
```

Installing more than one keeps runtime switching working, because the scopes coexist and
`PlatformProvider` only sets `data-platform`. The docs site installs all three.

The `@applecn/apple` style item remains, now meaning "all three idioms plus the shared layer", so
existing instructions keep working.

### 6.3 CSS surface

- Delete `knob` and `pressable`. Both are fully expressible in stock utilities, and `pressable`
  duplicates what `button.tsx` already writes inline (`active:scale-[0.97] active:opacity-80 …
motion-reduce:active:scale-100`) while being used in only four files.
- Move `hairline`, `hairline-t`, `hairline-b` to `@theme` shadow entries.
- Keep `type-*` (11), `material-*` (4), `glass*` (3) as `@utility`, for the reasons in §4.3.
- Utilities stay **unprefixed**, matching shadcn's own `shimmer`, `scroll-fade`, `no-scrollbar`.

### 6.4 Registry-only distribution

No npm package. With the variants gone, everything a consumer needs travels through the registry:
`cssVars` for tokens, `css` for the remaining utilities and the base layer, `dependencies` for
`tw-animate-css` and the rest. This is how every third-party shadcn registry ships custom CSS. The
trade — CSS fixes arrive by re-running the CLI rather than a version bump — is the copy-paste bargain.

The style item must additionally ship what §4.1 found missing: the `@layer base` block, and
`tw-animate-css` declared as a dependency of the items that use it.

### 6.5 shadcn conventions in component source

- `import { cn } from "@/lib/utils"`, with `lib/utils.ts` re-exporting shadcn's own `cn` package
  (`export { cn } from "cn"`) rather than hand-rolling `clsx` + `tailwind-merge`. `cn` is shadcn's
  current class-merging engine — a drop-in, faster replacement for that pair, and shadcn's own
  documented `lib/utils.ts` is this exact line — so re-exporting it is more current than assembling
  the two packages it supersedes. §4.3's `cn` measurements were taken against this same package.
- Sibling imports become `@/components/ui/<name>`; the registry build rewrites them like it already
  rewrites `../hooks/` and `../lib/`.
- The install command is the namespaced short form (`npx shadcn@latest add @applecn/checkbox`)
  everywhere. Today the landing page and the docs disagree.

## 7. Phases

Each phase ends green on `pnpm check` and is a separate PR.

### 7.1 Detokenise and make installable

103 tokens, 25 component files, the three variants deleted, §6.3 CSS changes, §6.5 convention
changes, the three theme items.

**Acceptance:** a scratch Next app, created outside this repo, runs
`npx shadcn@latest add @applecn/ios` and a set of components, and renders them correctly with
animations, base styles and macOS/web idioms all working. This is the test §4.1 would have failed.

### 7.2 Apple-fidelity audit harness

A harness that renders every registry example under each of the three idioms and asserts:

- states that must differ visually do — checked ≠ unchecked background, selected ≠ unselected,
  disabled dimmed, indicator present;
- the measured metrics hold — control heights, corner radii, type sizes match the token fixtures.

Then fix what it finds. Also audit all 42 parity components' export surfaces against shadcn's.

**Acceptance:** the harness fails when the §4.5 checkbox bug is reintroduced by reverting its fix.

### 7.3 Renames, fold, and the 15 builds

The four renames of §5.2, the `segmented-control` fold of §5.3, then the 15 primitives of §5.4.
`chart` and `data-table` are sub-phases. Each new component is born under the §7.2 harness.

### 7.4 Rebuild the Apple layer

The 13 compositions of §5.6 onto their shadcn bases, and the two new primitives of §5.8. This phase
deletes more code than it adds.

**Acceptance:** no measured metric changes. §7.2 is the gate.

### 7.5 Docs 1:1 with shadcn, and brand

Component pages follow shadcn's anatomy: Installation (CLI/Manual tabs) → Usage → Examples → API
Reference, with prev/next and an "On This Page" rail. A Get Started section: Installation,
components.json, Theming, Dark Mode, CLI, Monorepo, llms.txt. An alias table so a shadcn user
searching "Dropdown Menu" finds it.

Two API-table notes owed from the Phase 2 review, both inert in the tree but visible to a reader
of the docs: `AlertDialogFooter` renders `AlertDialogActions` under `data-slot="alert-dialog-footer"`,
so a shadcn-shaped alert has a footer node and NO actions node; and `ComboboxGroupLabel` is
applecn's name for what shadcn calls `ComboboxLabel` until Task 15 renames it.

Brand starts from nothing — there is no logo, OG image, apple-touch-icon, manifest or
`metadata.icons` in the repo today.

### 7.6 The AI set

The seven primitives of §5.5.

## 8. Risks

- **Fidelity regression during §7.4.** Rebuilding thirteen Apple components on shadcn bases is where
  measured numbers are most likely to drift. Mitigated by §7.2 being a hard gate, and by the token
  fixtures that already fail when a value drifts from the research document.
- **API expectations from name parity.** A user installing `dropdown-menu` will reach for
  `<DropdownMenuTrigger asChild>` and find Base UI's `render=`. shadcn ships Base UI variants of its
  own; §7.2's export audit must compare against _those_, not the Radix originals, and any remaining
  delta must be documented on the component page.
- **The `sheet` → `drawer` rename is silent.** Anyone who installed `@applecn/sheet` and re-runs the
  CLI gets a different component. Accepted: pre-announcement, and the cost only grows.
- **Scope.** 22 components to build, 13 to rebuild. The phases are independently shippable
  specifically so this can stop after any of them and still leave the project better than it started.

## 9. Verification

- `pnpm check` — oxlint, oxfmt, tsc, vitest, build — green at every phase.
- `packages/ui/__tests__/platform-state-cascade.test.ts` keeps the §4.5 class of bug out.
- The §7.2 harness is the fidelity gate.
- The §7.1 scratch-app install is the parity gate.
- Token fixtures in `packages/ui/src/tokens/__tests__/` keep every measured number tied to
  `docs/research/apple-design-system-reference.md`.
