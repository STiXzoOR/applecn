---
name: applecn
description: >-
  Build Apple-style UI in React or Next.js with applecn, a shadcn registry that reproduces
  Apple's Human Interface Guidelines (iOS 26 Liquid Glass by default, macOS as a switch) on
  Base UI and Hugeicons. Use whenever the user wants Apple, iOS, macOS, HIG or Liquid Glass
  styling, mentions applecn, or installs from this registry, even if they only say "make it
  look like an Apple app".
compatibility: A React 19 project with Tailwind CSS 4 and the shadcn CLI (npx shadcn@latest).
---

# applecn

A shadcn registry: Apple's tokens as CSS variables, one stylesheet of utilities, and 45
components on Base UI primitives with Hugeicons. Site and registry: https://applecn.vercel.app.
Source: https://github.com/STiXzoOR/applecn.

## Install

Register the namespace once in the project's `components.json`:

```json
{ "registries": { "@applecn": "https://applecn.vercel.app/r/{name}.json" } }
```

Then add the theme, and components as needed (dependencies resolve automatically):

```sh
npx shadcn@latest add @applecn/apple
npx shadcn@latest add @applecn/button @applecn/list @applecn/sheet
```

Without the namespace, the URL form works:
`npx shadcn@latest add https://applecn.vercel.app/r/button.json`.

`@applecn/apple` is a style item: every token as `cssVars` (light and dark) plus the `type-*`,
`material-*`, `glass*`, `hairline*` and `pressable` utilities. shadcn's own names (`--primary`,
`--card`, `--border`, …) alias Apple's roles, so existing shadcn components pick up the theme.

## Using it

- **Text styles are utilities**: `type-large-title` … `type-caption-2`, never `text-<style>`
  (tailwind-merge reads `text-body` as a colour). The `Text` component takes `style` and `color`.
- **Colours are roles**: `bg-system-blue`, `text-label`, `text-label-2`, `bg-background-2`,
  `bg-fill`, `border-separator`. Never a literal hex or rgb value.
- **Shapes and motion** come from the ladder: `rounded-sheet`, `rounded-card`, `shadow-thumb`,
  `ease-sheet`, `duration-(--duration-press)`.
- **Platform switch**: wrap with `PlatformProvider` from the `platform` lib item
  (`npx shadcn@latest add @applecn/platform`) or stamp `data-platform="macos"` on `<html>`;
  every control re-measures in CSS. `data-elevated` raises a dark surface one step (portals
  set it themselves). `[data-contrast="more"]` is Increase Contrast;
  `prefers-reduced-transparency` swaps glass for opaque materials.
- **Overlays adapt**: `Sheet` is a bottom sheet with detents on a phone and a centred card from
  `sm`; `ActionSheet` becomes a popover on desktop. Tab bars, toolbars and menus float on glass.
- **Icons**: `Icon` wraps Hugeicons with the SF Symbols sizing model (`scale`, `weight`); do
  not import lucide.
- **Conventions**: `data-slot` on every element, `cva` variants, `cn`, no `forwardRef`.

## Components

Install any of these as `@applecn/<name>`.

### Foundation

- `text` — Text (Labels, text styles): A label in one of the eleven text styles, with the label colour roles and per-style emphasis.
- `icon` — Icon (SF Symbols): Hugeicons rendered with the SF Symbols sizing model: scales relative to text and weights that follow it.
- `material` — Material (Materials): A content-layer material from ultra-thin to thick that blurs what is behind it.
- `glass` — Glass (Liquid Glass): Liquid Glass for the functional layer: regular, clear and prominent, as a capsule, rounded rectangle or circle.
- `separator` — Separator (Separators): The half-point hairline, inset after a row’s leading content when it divides a list.

### Controls

- `button` — Button (Buttons): Filled, tinted, gray, bordered, plain, glass and destructive buttons in the five control sizes.
- `toggle` — Toggle (Toggle buttons): A toggle button whose pressed state is the tinted fill, for options outside a list.
- `badge` — Badge (Badges): The red count capsule, and tinted or filled tags.
- `spinner` — Spinner (Activity indicator): The activity indicator: eight fading bars at the medium and large sizes.
- `progress` — Progress (Progress indicators): The 4 pt linear bar and the circular ring, determinate or indeterminate.

### Forms

- `switch` — Switch (Toggles (switch)): The 51×31 pt switch with a 27 pt thumb, green or tinted when on.
- `checkbox` — Checkbox (Checkboxes): A circular checkbox on iOS, a rounded square on macOS, with a mixed state.
- `radio-group` — Radio group (Radio buttons): Two to five mutually exclusive options as tinted rings.
- `slider` — Slider (Sliders): A 4 pt track with a 28 pt thumb and optional images at either end.
- `stepper` — Stepper (Steppers): The 94×32 pt two-segment control for incremental values.
- `segmented-control` — Segmented control (Segmented controls): A capsule of equal segments with a sliding white selection.
- `tabs` — Tabs (Tab views): A segmented control that switches between related subviews.
- `input` — Input (Text fields): The text field: rounded, plain in a list, or bordered on macOS, with the iOS clear button.
- `textarea` — Textarea (Text views): The text view for longer text, on the same surface as the text field.
- `label` — Label (Labels): A control’s label in body text.
- `field` — Field (Entering data): A labelled control with a description and an error, wired together for assistive technology.
- `search-field` — Search field (Search fields): A capsule with the magnifier, a clear button and Cancel while editing.
- `select` — Select (Pickers, pop-up buttons): The menu picker and the macOS pop-up button, opening a glass menu with leading check marks.

### Overlays

- `menu` — Menu (Menus, pull-down buttons): A 250 pt glass menu of 44 pt rows with leading glyphs, group bands, check marks and submenus.
- `context-menu` — Context menu (Context menus): The same menu, opened by a secondary click or a long press on an item.
- `popover` — Popover (Popovers): A transient card on the regular material with an arrow pointing at its control.
- `tooltip` — Tooltip (Tooltips): A brief phrase on thick material after a short hover.
- `alert-dialog` — Alert (Alerts): The 270 pt alert on thick material with up to three actions, side by side or stacked.
- `action-sheet` — Action sheet (Action sheets): Choices related to an action: a bottom sheet on phones, a popover on wider screens.
- `sheet` — Sheet (Sheets): A bottom sheet with a grabber and detents on phones, a centred card from the sm breakpoint.
- `dialog` — Dialog (Sheets (macOS), form sheets): A modal card: the macOS sheet and the iPad form sheet.

### Navigation

- `navigation-bar` — Navigation bar (Navigation bars): The 44 pt bar with a large title that collapses into it as content scrolls under.
- `tab-bar` — Tab bar (Tab bars): The floating Liquid Glass capsule of tabs with a separate search button and a minimized state.
- `toolbar` — Toolbar (Toolbars): Floating glass groups of circular buttons with one prominent action.
- `sidebar` — Sidebar (Sidebars): A navigation list on the regular material with labelled, collapsible groups.
- `split-view` — Split view (Split views): Two or three adjacent panes with hairline dividers that stack on narrow screens.
- `page-control` — Page control (Page controls): A row of dots for a flat sequence of pages.

### Content

- `list` — List (Lists and tables): Plain, grouped, inset grouped and sidebar lists with rows, accessories and sections.
- `card` — Card (Boxes): A group box on the grouped card surface.
- `table` — Table (Tables (macOS)): The macOS table with small column headers, compact rows and a tinted selection.
- `disclosure-group` — Disclosure group (Disclosure controls): A row that reveals details, its chevron turning as it opens.
- `empty` — Empty (ContentUnavailableView): The unavailable-content view: a symbol, a title, a description and an action.
- `skeleton` — Skeleton (Redacted placeholders): A redacted placeholder for loading content.
- `avatar` — Avatar (Contact photos): A person’s picture or their monogram on gray.
- `kbd` — Kbd (Keyboard shortcuts): A keyboard key, as shown beside menu items.

## Gotchas

- Base UI's `Select` needs `items` on the root to show labels; `Tabs.List` needs
  `activateOnFocus` for arrow-key activation.
- Overlays portal to `body`: give them `data-elevated` if you build your own.
- The theme is exact sRGB from Apple's published tables and measured Apple web CSS; three
  values are documented approximations (iOS 26 tab bar height, bottom-sheet radius, macOS
  switch, stepper and alert width). Read `docs/research/apple-design-system-reference.md` in
  the repo before "correcting" one.
