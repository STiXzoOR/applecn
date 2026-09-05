/**
 * The documentation index: one entry per component in `@applecn/ui`, with its Apple
 * counterpart, the Base UI primitive underneath, and the live examples shown on its page.
 * A test asserts this list matches the package's component files exactly.
 */

export type ComponentGroup =
  | "foundation"
  | "controls"
  | "forms"
  | "overlays"
  | "navigation"
  | "content"

export const componentGroups: ComponentGroup[] = [
  "foundation",
  "controls",
  "forms",
  "overlays",
  "navigation",
  "content",
]

export interface ComponentExample {
  /** File name under `registry/examples/<component>/`. */
  name: string
  title: string
  description?: string
}

export interface ComponentDoc {
  name: string
  title: string
  description: string
  group: ComponentGroup
  apple: { name: string; hig?: string }
  primitive: string
  examples: ComponentExample[]
}

const hig = (page: string) =>
  `https://developer.apple.com/design/human-interface-guidelines/${page}`

export const componentDocs: ComponentDoc[] = [
  // ---------- primitives ----------
  {
    name: "text",
    title: "Text",
    description:
      "A label in one of the eleven text styles, with the label colour roles and per-style emphasis.",
    group: "foundation",
    apple: { name: "Labels, text styles", hig: hig("typography") },
    primitive: "element",
    examples: [{ name: "styles", title: "Text styles" }],
  },
  {
    name: "icon",
    title: "Icon",
    description:
      "Hugeicons rendered with the SF Symbols sizing model: scales relative to text and weights that follow it.",
    group: "foundation",
    apple: { name: "SF Symbols", hig: hig("sf-symbols") },
    primitive: "Hugeicons",
    examples: [{ name: "scales", title: "Scales and weights" }],
  },
  {
    name: "material",
    title: "Material",
    description:
      "A content-layer material from ultra-thin to thick that blurs what is behind it.",
    group: "foundation",
    apple: { name: "Materials", hig: hig("materials") },
    primitive: "element",
    examples: [{ name: "basic", title: "Thicknesses" }],
  },
  {
    name: "glass",
    title: "Glass",
    description:
      "Liquid Glass for the functional layer: regular, clear and prominent, as a capsule, rounded rectangle or circle.",
    group: "foundation",
    apple: { name: "Liquid Glass", hig: hig("materials") },
    primitive: "element",
    examples: [{ name: "basic", title: "Variants" }],
  },
  {
    name: "separator",
    title: "Separator",
    description:
      "The half-point hairline, inset after a row’s leading content when it divides a list.",
    group: "foundation",
    apple: { name: "Separators", hig: hig("lists-and-tables") },
    primitive: "Separator",
    examples: [{ name: "basic", title: "Horizontal, inset and vertical" }],
  },
  // ---------- controls ----------
  {
    name: "button",
    title: "Button",
    description:
      "Filled, tinted, gray, bordered, plain, glass and destructive buttons in the five control sizes — a 34 pt capsule on iOS 26, a 24 pt rounded rectangle on macOS 26, apple.com’s 36 px pill on the web.",
    group: "controls",
    apple: { name: "Buttons", hig: hig("buttons") },
    primitive: "Button",
    examples: [
      { name: "styles", title: "Styles" },
      { name: "sizes", title: "Sizes" },
      { name: "shapes", title: "Shapes and icons" },
    ],
  },
  {
    name: "toggle",
    title: "Toggle",
    description:
      "A toggle button whose pressed state is the tinted fill, for options outside a list.",
    group: "controls",
    apple: { name: "Toggle buttons", hig: hig("toggles") },
    primitive: "Toggle",
    examples: [{ name: "basic", title: "Toggle buttons" }],
  },
  {
    name: "badge",
    title: "Badge",
    description: "The red count capsule, and tinted or filled tags.",
    group: "controls",
    apple: { name: "Badges", hig: hig("tab-bars") },
    primitive: "element",
    examples: [{ name: "basic", title: "Count and tags" }],
  },
  {
    name: "spinner",
    title: "Spinner",
    description:
      "The activity indicator: eight fading bars at the medium and large sizes.",
    group: "controls",
    apple: { name: "Activity indicator", hig: hig("progress-indicators") },
    primitive: "element",
    examples: [{ name: "basic", title: "Sizes" }],
  },
  {
    name: "progress",
    title: "Progress",
    description:
      "The 4 pt linear bar and the circular ring, determinate or indeterminate.",
    group: "controls",
    apple: { name: "Progress indicators", hig: hig("progress-indicators") },
    primitive: "Progress",
    examples: [{ name: "basic", title: "Linear and circular" }],
  },
  // ---------- forms ----------
  {
    name: "switch",
    title: "Switch",
    description:
      "The iOS 26 switch: a 63×28 pt track with a 37×24 oval knob that stretches while pressed; 54×24 on macOS 26. Green or tinted when on.",
    group: "forms",
    apple: { name: "Toggles (switch)", hig: hig("toggles") },
    primitive: "Switch",
    examples: [{ name: "basic", title: "In a list row" }],
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description:
      "A 22 pt circle on iOS, a 16 pt rounded square on the bezel on macOS 26, with a mixed state.",
    group: "forms",
    apple: { name: "Checkboxes", hig: hig("toggles") },
    primitive: "Checkbox",
    examples: [{ name: "basic", title: "States" }],
  },
  {
    name: "radio-group",
    title: "Radio group",
    description:
      "Two to five mutually exclusive options as rings that fill with the tint and show a white dot.",
    group: "forms",
    apple: { name: "Radio buttons", hig: hig("toggles") },
    primitive: "RadioGroup",
    examples: [{ name: "basic", title: "Options" }],
  },
  {
    name: "slider",
    title: "Slider",
    description:
      "A 6 pt track with the 37×24 pill knob on iOS 26 (a 20×16 oval on macOS 26) and optional images at either end.",
    group: "forms",
    apple: { name: "Sliders", hig: hig("sliders") },
    primitive: "Slider",
    examples: [{ name: "basic", title: "With value labels" }],
  },
  {
    name: "stepper",
    title: "Stepper",
    description:
      "The 94×32 pt capsule with − and + halves on iOS 26; AppKit’s 20×26 vertical stepper on macOS 26.",
    group: "forms",
    apple: { name: "Steppers", hig: hig("steppers") },
    primitive: "NumberField",
    examples: [{ name: "basic", title: "Paired with a value" }],
  },
  {
    name: "segmented-control",
    title: "Segmented control",
    description:
      "Equal segments with a sliding selection: a white pill in a 32 pt capsule on iOS 26, the accent fill in a 24 pt rounded rectangle on macOS 26.",
    group: "forms",
    apple: { name: "Segmented controls", hig: hig("segmented-controls") },
    primitive: "Tabs",
    examples: [{ name: "basic", title: "Single choice" }],
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "A segmented control that switches between related subviews.",
    group: "forms",
    apple: { name: "Tab views", hig: hig("tab-views") },
    primitive: "Tabs",
    examples: [{ name: "basic", title: "Subviews" }],
  },
  {
    name: "input",
    title: "Input",
    description:
      "The bordered text field on every platform — 34 pt with 5 pt corners on iOS 26, AppKit’s 24 pt bezel, the App Store’s 32 px field — plus filled and plain variants and the iOS clear button.",
    group: "forms",
    apple: { name: "Text fields", hig: hig("text-fields") },
    primitive: "Input",
    examples: [
      { name: "basic", title: "Variants" },
      { name: "clearable", title: "Clear button" },
    ],
  },
  {
    name: "textarea",
    title: "Textarea",
    description:
      "The text view for longer text, on the same surface as the text field.",
    group: "forms",
    apple: { name: "Text views", hig: hig("text-views") },
    primitive: "element",
    examples: [{ name: "basic", title: "Notes" }],
  },
  {
    name: "label",
    title: "Label",
    description: "A control’s label in body text.",
    group: "forms",
    apple: { name: "Labels", hig: hig("labels") },
    primitive: "element",
    examples: [{ name: "basic", title: "With a control" }],
  },
  {
    name: "field",
    title: "Field",
    description:
      "A labelled control with a description and an error, wired together for assistive technology.",
    group: "forms",
    apple: { name: "Entering data", hig: hig("entering-data") },
    primitive: "Field",
    examples: [{ name: "basic", title: "Validation" }],
  },
  {
    name: "search-field",
    title: "Search field",
    description:
      "The 44 pt capsule search field of iOS 26 with the magnifier, clear and Cancel; AppKit’s 24 pt capsule on macOS.",
    group: "forms",
    apple: { name: "Search fields", hig: hig("search-fields") },
    primitive: "element",
    examples: [{ name: "basic", title: "Search" }],
  },
  {
    name: "select",
    title: "Select",
    description:
      "The menu picker: a tinted inline value on iOS, AppKit’s pop-up button bezel on macOS 26, a pill on the web, opening a glass menu with leading check marks.",
    group: "forms",
    apple: { name: "Pickers, pop-up buttons", hig: hig("pickers") },
    primitive: "Select",
    examples: [{ name: "basic", title: "Plain and pop-up" }],
  },
  // ---------- overlays ----------
  {
    name: "menu",
    title: "Menu",
    description:
      "Liquid Glass menus: 250 pt panels of 44 pt rows with leading glyphs on iOS 26; AppKit’s 24 pt rows, hairlines and accent highlight on macOS 26.",
    group: "overlays",
    apple: { name: "Menus, pull-down buttons", hig: hig("menus") },
    primitive: "Menu",
    examples: [{ name: "basic", title: "Pull-down menu" }],
  },
  {
    name: "context-menu",
    title: "Context menu",
    description:
      "The same menu, opened by a secondary click or a long press on an item.",
    group: "overlays",
    apple: { name: "Context menus", hig: hig("menus") },
    primitive: "ContextMenu",
    examples: [{ name: "basic", title: "On a photo" }],
  },
  {
    name: "popover",
    title: "Popover",
    description:
      "A transient Liquid Glass card with an arrow, on the platform’s popover corner.",
    group: "overlays",
    apple: { name: "Popovers", hig: hig("popovers") },
    primitive: "Popover",
    examples: [{ name: "basic", title: "Anchored card" }],
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "A brief phrase on thick material after a short hover.",
    group: "overlays",
    apple: { name: "Tooltips", hig: hig("tooltips") },
    primitive: "Tooltip",
    examples: [{ name: "basic", title: "On hover" }],
  },
  {
    name: "alert-dialog",
    title: "Alert",
    description:
      "The iOS 26 alert: 320 pt, 34 pt corners, Liquid Glass, left-aligned text and 48 pt capsule actions; AppKit’s 260 pt alert with 28 pt push buttons on macOS.",
    group: "overlays",
    apple: { name: "Alerts", hig: hig("alerts") },
    primitive: "AlertDialog",
    examples: [
      { name: "basic", title: "Two actions" },
      { name: "stacked", title: "Three actions" },
    ],
  },
  {
    name: "action-sheet",
    title: "Action sheet",
    description:
      "Choices related to an action: the iOS 26 card with 48 pt capsule actions from the bottom on a phone, a popover anchored to the control from the sm breakpoint.",
    group: "overlays",
    apple: { name: "Action sheets", hig: hig("action-sheets") },
    primitive: "Drawer, Popover",
    examples: [{ name: "basic", title: "Unsaved draft" }],
  },
  {
    name: "sheet",
    title: "Sheet",
    description:
      "A bottom sheet with a grabber and detents on phones, a centred card from the sm breakpoint.",
    group: "overlays",
    apple: { name: "Sheets", hig: hig("sheets") },
    primitive: "Drawer, Dialog",
    examples: [{ name: "basic", title: "New event" }],
  },
  {
    name: "dialog",
    title: "Dialog",
    description:
      "A modal card: the macOS sheet and the iPad form sheet, on the platform’s dialog corner and width.",
    group: "overlays",
    apple: { name: "Sheets (macOS), form sheets", hig: hig("sheets") },
    primitive: "Dialog",
    examples: [{ name: "basic", title: "Rename" }],
  },
  // ---------- navigation ----------
  {
    name: "navigation-bar",
    title: "Navigation bar",
    description:
      "A 54 pt row with 44 pt glass platters and the 34 pt large title that collapses as content scrolls under it.",
    group: "navigation",
    apple: { name: "Navigation bars", hig: hig("toolbars") },
    primitive: "element",
    examples: [{ name: "basic", title: "Large title" }],
  },
  {
    name: "tab-bar",
    title: "Tab bar",
    description:
      "The iOS 26 tab bar: a 62 pt Liquid Glass platter inset 21 pt with 54 pt items, the current one on a tinted lens, and a separate search circle; minimises on scroll.",
    group: "navigation",
    apple: { name: "Tab bars", hig: hig("tab-bars") },
    primitive: "element",
    examples: [{ name: "basic", title: "Four tabs and search" }],
  },
  {
    name: "toolbar",
    title: "Toolbar",
    description:
      "Items in floating glass platters — 44 pt circles inset 4 on iOS 26, 28 pt on macOS and the web — with the prominent action filled.",
    group: "navigation",
    apple: { name: "Toolbars", hig: hig("toolbars") },
    primitive: "Toolbar",
    examples: [{ name: "basic", title: "Groups and a prominent action" }],
  },
  {
    name: "sidebar",
    title: "Sidebar",
    description:
      "A navigation list on the regular material: 44 pt rows on iPad, AppKit’s 28 pt rows with 6 pt corners on macOS 26, Music’s 34 pt rows on the web.",
    group: "navigation",
    apple: { name: "Sidebars", hig: hig("sidebars") },
    primitive: "Collapsible",
    examples: [{ name: "basic", title: "Library" }],
  },
  {
    name: "split-view",
    title: "Split view",
    description:
      "Two or three adjacent panes with hairline dividers that stack on narrow screens.",
    group: "navigation",
    apple: { name: "Split views", hig: hig("split-views") },
    primitive: "element",
    examples: [{ name: "basic", title: "Three columns" }],
  },
  {
    name: "page-control",
    title: "Page control",
    description: "A row of dots for a flat sequence of pages.",
    group: "navigation",
    apple: { name: "Page controls", hig: hig("page-controls") },
    primitive: "element",
    examples: [{ name: "basic", title: "Pages" }],
  },
  // ---------- content ----------
  {
    name: "list",
    title: "List",
    description:
      "Plain, grouped, inset grouped and sidebar lists with rows, accessories and sections — 26 pt corners and 52 pt rows on iOS 26, 10 pt corners and 28 pt rows on macOS 26.",
    group: "content",
    apple: { name: "Lists and tables", hig: hig("lists-and-tables") },
    primitive: "element",
    examples: [
      { name: "settings", title: "Inset grouped" },
      { name: "selection", title: "Check-mark selection" },
    ],
  },
  {
    name: "card",
    title: "Card",
    description:
      "A group box on the grouped card surface with the platform’s card corner.",
    group: "content",
    apple: { name: "Boxes", hig: hig("boxes") },
    primitive: "element",
    examples: [{ name: "basic", title: "Storage" }],
  },
  {
    name: "table",
    title: "Table",
    description:
      "The macOS table with small column headers, compact rows and a tinted selection.",
    group: "content",
    apple: { name: "Tables (macOS)", hig: hig("lists-and-tables") },
    primitive: "element",
    examples: [{ name: "basic", title: "Files" }],
  },
  {
    name: "disclosure-group",
    title: "Disclosure group",
    description: "A row that reveals details, its chevron turning as it opens.",
    group: "content",
    apple: { name: "Disclosure controls", hig: hig("disclosure-controls") },
    primitive: "Collapsible",
    examples: [{ name: "basic", title: "Advanced options" }],
  },
  {
    name: "empty",
    title: "Empty",
    description:
      "The unavailable-content view: a symbol, a title, a description and an action.",
    group: "content",
    apple: { name: "ContentUnavailableView" },
    primitive: "element",
    examples: [{ name: "basic", title: "No results" }],
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description: "A redacted placeholder for loading content.",
    group: "content",
    apple: { name: "Redacted placeholders" },
    primitive: "element",
    examples: [{ name: "basic", title: "Loading row" }],
  },
  {
    name: "avatar",
    title: "Avatar",
    description: "A person’s picture or their monogram on gray.",
    group: "content",
    apple: { name: "Contact photos" },
    primitive: "Avatar",
    examples: [{ name: "basic", title: "Sizes" }],
  },
  {
    name: "kbd",
    title: "Kbd",
    description: "A keyboard key, as shown beside menu items.",
    group: "content",
    apple: { name: "Keyboard shortcuts", hig: hig("keyboards") },
    primitive: "element",
    examples: [{ name: "basic", title: "Shortcuts" }],
  },
]
