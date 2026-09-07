---
name: applecn
description: >-
  Build Apple-style UI in React or Next.js with applecn, a shadcn registry that reproduces
  Apple's Human Interface Guidelines (iOS 26 Liquid Glass, macOS 26 and Apple's web idiom,
  measured on device) on Base UI and Hugeicons. Use whenever the user wants Apple, iOS, macOS, HIG or Liquid Glass
  styling, mentions applecn, or installs from this registry, even if they only say "make it
  look like an Apple app".
compatibility: A React 19 project with Tailwind CSS 4 and the shadcn CLI (npx shadcn@latest).
---

# applecn

A shadcn registry: Apple's tokens as CSS variables, one stylesheet of utilities, and 64
components on Base UI primitives with Hugeicons. Three idioms from one stylesheet: `ios`
(iOS 26), `macos` (macOS 26) and `web` (apple.com and Apple's web apps), with control
geometry read from UIKit and AppKit on device. Site and registry: https://applecn.vercel.app.
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
`material-*`, `glass*`, `hairline*`, `knob` and `pressable` utilities and the three
`[data-platform]` scopes. shadcn's own names (`--primary`,
`--card`, `--border`, …) alias Apple's roles, so existing shadcn components pick up the theme.

## Using it

- **Text styles are utilities**: `type-large-title` … `type-caption-2`, never `text-<style>`
  (tailwind-merge reads `text-body` as a colour). The `Text` component takes `style` and `color`.
- **Colours are roles**: `bg-system-blue`, `text-label`, `text-label-2`, `bg-background-2`,
  `bg-fill`, `border-separator`. Never a literal hex or rgb value.
- **Shapes and motion** come from the tokens: the platform ladder `rounded-sm` … `rounded-4xl`
  and the semantic corners `rounded-card`, `rounded-list`, `rounded-control`, `rounded-field`,
  `rounded-menu`, `rounded-alert`, `rounded-sheet`, `rounded-window`; `shadow-thumb`,
  `ease-sheet`, `duration-(--duration-press)`. Control sizes read `--control-height-*`,
  `--control-radius-*`, `--control-font-*`; never hard-code a size.
- **Platform switch**: wrap with `PlatformProvider platform="ios" | "macos" | "web"` from the
  `platform` lib item (`npx shadcn@latest add @applecn/platform`) or stamp `data-platform` on
  `<html>`; every colour, corner and control metric re-measures in CSS, and providers nest
  (a macOS `Window` inside a web page). `detectPlatform()` (the `detect-platform` lib item)
  picks one from the visitor's device. The `ios:`, `macos:` and `web:` Tailwind variants need
  `@custom-variant macos { @container style(--platform: macos) { @slot; } }` (and the same for
  `ios` and `web`) in the project's stylesheet. `data-elevated` raises a dark surface one step (portals
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

- `button` — Button (Buttons): Filled, tinted, gray, bordered, plain, glass and destructive buttons in the five control sizes — a 34 pt capsule on iOS 26, a 24 pt rounded rectangle on macOS 26, apple.com’s 36 px pill on the web.
- `toggle` — Toggle (Toggle buttons): A toggle button whose pressed state is the tinted fill, for options outside a list.
- `badge` — Badge (Badges): The red count capsule, and tinted or filled tags.
- `spinner` — Spinner (Activity indicator): The activity indicator: eight fading bars at the medium and large sizes.
- `progress` — Progress (Progress indicators): The 4 pt linear bar and the circular ring, determinate or indeterminate.
- `link` — Link (Buttons, links): A link in the link colour: apple.com’s “Learn more ›” with its chevron, a pill button, or a quiet inline link.
- `toggle-group` — Toggle group (Segmented controls (select any)): A joined set of toggle buttons in the segmented control’s geometry, single- or multi-select — Keynote’s bold, italic and underline.
- `meter` — Meter (Gauges): Gauges for a value in a range that is not progress: the linear meter with a label and percentage, and the circular gauge with the value in the centre.
- `button-group` — Button group (Buttons): Adjacent buttons joined into one control — AppKit’s segmented push buttons, apple.com’s paired actions.
- `rating` — Rating (Rating indicators): The App Store’s five stars: read-only with the value in its name, or a radio group the person can set.

### Forms

- `switch` — Switch (Toggles (switch)): The iOS 26 switch: a 63×28 pt track with a 37×24 oval knob that stretches while pressed; 54×24 on macOS 26. Green or tinted when on.
- `checkbox` — Checkbox (Checkboxes): A 22 pt circle on iOS, a 16 pt rounded square on the bezel on macOS 26, with a mixed state.
- `radio-group` — Radio group (Radio buttons): Two to five mutually exclusive options as rings that fill with the tint and show a white dot.
- `slider` — Slider (Sliders): A 6 pt track with the 37×24 pill knob on iOS 26 (a 20×16 oval on macOS 26) and optional images at either end.
- `stepper` — Stepper (Steppers): The 94×32 pt capsule with − and + halves on iOS 26; AppKit’s 20×26 vertical stepper on macOS 26.
- `segmented-control` — Segmented control (Segmented controls): Equal segments with a sliding selection: a white pill in a 32 pt capsule on iOS 26, the accent fill in a 24 pt rounded rectangle on macOS 26.
- `tabs` — Tabs (Tab views): A segmented control that switches between related subviews.
- `input` — Input (Text fields): The bordered text field on every platform — 34 pt with 5 pt corners on iOS 26, AppKit’s 24 pt bezel, the App Store’s 32 px field — plus filled and plain variants and the iOS clear button.
- `textarea` — Textarea (Text views): The text view for longer text, on the same surface as the text field.
- `label` — Label (Labels): A control’s label in body text.
- `field` — Field (Entering data): A labelled control with a description and an error, wired together for assistive technology.
- `search-field` — Search field (Search fields): The 44 pt capsule search field of iOS 26 with the magnifier, clear and Cancel; AppKit’s 24 pt capsule on macOS.
- `select` — Select (Pickers, pop-up buttons): The menu picker: a tinted inline value on iOS, AppKit’s pop-up button bezel on macOS 26, a pill on the web, opening a glass menu with leading check marks.
- `combobox` — Combo box (Combo boxes): A text field that offers suggestions filtered as the person types, in a glass menu with the platform’s rows.
- `checkbox-group` — Checkbox group (Checkboxes): Checkboxes that share a value under a parent that turns them all on or off and shows the mixed state — macOS’s settings hierarchy.
- `passcode-field` — Passcode field (Text fields): A row of one-character boxes for a verification code that advances as digits are typed and fills on paste.
- `color-well` — Color well (Color wells): The native colour input as Apple presents it: a ring around the swatch on iOS, AppKit’s capsule on macOS.

### Overlays

- `menu` — Menu (Menus, pull-down buttons): Liquid Glass menus: 250 pt panels of 44 pt rows with leading glyphs on iOS 26; AppKit’s 24 pt rows, hairlines and accent highlight on macOS 26.
- `context-menu` — Context menu (Context menus): The same menu, opened by a secondary click or a long press on an item.
- `popover` — Popover (Popovers): A transient Liquid Glass card with an arrow, on the platform’s popover corner.
- `tooltip` — Tooltip (Tooltips): A brief phrase on thick material after a short hover.
- `alert-dialog` — Alert (Alerts): The iOS 26 alert: 320 pt, 34 pt corners, Liquid Glass, left-aligned text and 48 pt capsule actions; AppKit’s 260 pt alert with 28 pt push buttons on macOS.
- `action-sheet` — Action sheet (Action sheets): Choices related to an action: the iOS 26 card with 48 pt capsule actions from the bottom on a phone, a popover anchored to the control from the sm breakpoint.
- `sheet` — Sheet (Sheets): A bottom sheet with a grabber and detents on phones, a centred card from the sm breakpoint.
- `dialog` — Dialog (Sheets (macOS), form sheets): A modal card: the macOS sheet and the iPad form sheet, on the platform’s dialog corner and width.
- `preview-card` — Preview card (Link previews): Safari’s link preview: a Liquid Glass card that appears after hovering a link for a moment.
- `toast` — Toast (Notifications): Notification banners: a Liquid Glass card with an icon, title and message that drops in from the top and can be swiped away.

### Navigation

- `navigation-bar` — Navigation bar (Navigation bars): A 54 pt row with 44 pt glass platters and the 34 pt large title that collapses as content scrolls under it.
- `tab-bar` — Tab bar (Tab bars): The iOS 26 tab bar: a 62 pt Liquid Glass platter inset 21 pt with 54 pt items, the current one on a tinted lens, and a separate search circle; minimises on scroll.
- `toolbar` — Toolbar (Toolbars): Items in floating glass platters — 44 pt circles inset 4 on iOS 26, 28 pt on macOS and the web — with the prominent action filled.
- `sidebar` — Sidebar (Sidebars): A navigation list on the regular material: 44 pt rows on iPad, AppKit’s 28 pt rows with 6 pt corners on macOS 26, Music’s 34 pt rows on the web.
- `split-view` — Split view (Split views): Two or three adjacent panes with hairline dividers that stack on narrow screens.
- `page-control` — Page control (Page controls): A row of dots for a flat sequence of pages.
- `menubar` — Menu bar (The menu bar): The macOS menu bar: top-level menus whose titles highlight with the accent while open, each a full menu with shortcuts and submenus.
- `navigation-menu` — Navigation menu (apple.com global nav): apple.com’s global navigation: a 44 pt material bar of small links with full-width flyout panels of large links under eyebrows.
- `breadcrumb` — Breadcrumb (Path controls): The path to the current location as links separated by chevrons — the Finder’s path bar, apple.com’s breadcrumbs.

### Content

- `list` — List (Lists and tables): Plain, grouped, inset grouped and sidebar lists with rows, accessories and sections — 26 pt corners and 52 pt rows on iOS 26, 10 pt corners and 28 pt rows on macOS 26.
- `card` — Card (Boxes): A group box on the grouped card surface with the platform’s card corner.
- `table` — Table (Tables (macOS)): The macOS table with small column headers, compact rows and a tinted selection.
- `disclosure-group` — Disclosure group (Disclosure controls): A row that reveals details, its chevron turning as it opens.
- `empty` — Empty (ContentUnavailableView): The unavailable-content view: a symbol, a title, a description and an action.
- `skeleton` — Skeleton (Redacted placeholders): A redacted placeholder for loading content.
- `avatar` — Avatar (Contact photos): A person’s picture or their monogram on gray.
- `accordion` — Accordion (Disclosure controls): An inset grouped list of disclosure rows that each reveal a panel, one open at a time unless multiple.
- `scroll-area` — Scroll area (Scroll views): A scroll view with Apple’s overlay scrollbars, which fade in while scrolling and never take layout space.
- `window` — Window (Windows): A macOS 26 window: 16 pt corners, the title bar with its traffic lights or the unified toolbar, and the dialog shadow.
- `lockup` — Lockup (Lockups): The App Store’s product lockup: an icon on the icon mask, a title, a subtitle and the Get button.
- `carousel` — Carousel (Collections): A snapping horizontal shelf of items with a page control, scrolled natively — the App Store’s shelves.
- `kbd` — Kbd (Keyboard shortcuts): A keyboard key, as shown beside menu items.

## Gotchas

- Base UI's `Select` needs `items` on the root to show labels; `Tabs.List` needs
  `activateOnFocus` for arrow-key activation.
- Overlays portal to `body`: give them `data-elevated` if you build your own.
- The theme is exact sRGB from Apple's published tables and measured Apple web CSS; three
  values are documented approximations (iOS 26 tab bar height, bottom-sheet radius, macOS
  switch, stepper and alert width). Read `docs/research/apple-design-system-reference.md` in
  the repo before "correcting" one.
