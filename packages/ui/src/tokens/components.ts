import type { Platform } from "../lib/platform"

/**
 * Per-component appearance, per idiom. `metrics.ts` holds geometry Apple publishes;
 * this holds the paint that used to live in `ios:`/`macos:`/`web:` classes. Splitting
 * them keeps the measured geometry fixtures untouched.
 */
export interface Bezel {
  /** Resting background. */
  readonly bg: string
  /** Resting border colour. */
  readonly border: string
  /** Border width in px. */
  readonly borderWidth: number
  /** Resting box-shadow. */
  readonly shadow: string
}

/**
 * The button bezel per style. `filled`, `gray` and `bordered` are the three styles whose
 * paint used to differ by platform variant; `tinted`, `plain`, `glass`, `destructive` and
 * `link` are identical on every idiom and stay plain Tailwind classes.
 */
export interface ButtonTokens {
  /** Label weight: semibold on iOS, normal on macOS and the web. */
  readonly fontWeight: string
  /** Press-down scale factor: iOS scales down, macOS and the web hold still. */
  readonly activeScale: string
  readonly filled: {
    readonly shadow: string
    readonly hoverBg: string
  }
  readonly gray: {
    readonly bg: string
    readonly text: string
    readonly shadow: string
    readonly hoverBg: string
  }
  readonly bordered: {
    readonly bg: string
    readonly text: string
    readonly border: string
    readonly shadow: string
    readonly hoverBg: string
    readonly hoverText: string
  }
}

/**
 * The alert's action bezel. `textDefault`/`textDestructive` are the resting text colour per
 * `variant`; the `*Preferred` siblings are what a `preferred` action shows instead — on macOS
 * that's AppKit filling the preferred button with the accent and turning its label white; iOS
 * and the web don't recolour a preferred action, only its `fontWeightPreferred`.
 */
export interface AlertDialogTokens {
  /** Popup text alignment: iOS and the web start it, macOS centres it. */
  readonly textAlign: string
  readonly titlePx: string
  readonly titlePt: string
  readonly descriptionPx: string
  readonly descriptionText: string
  readonly fieldPx: string
  readonly button: {
    readonly radius: string
    readonly activeScale: string
    readonly bg: string
    readonly bgPreferred: string
    readonly shadow: string
    readonly shadowPreferred: string
    readonly fontWeight: string
    readonly fontWeightPreferred: string
    readonly textDefault: string
    readonly textDefaultPreferred: string
    readonly textDestructive: string
    readonly textDestructivePreferred: string
  }
}

/**
 * The menu row and separator. `highlightBg`/`highlightText` cover both `focus:` and
 * `data-highlighted:` — iOS and the web share one fill-3 highlight, macOS uses the system
 * selection colour and turns text (and a shortcut glyph) white.
 */
export interface MenuTokens {
  readonly item: {
    readonly gap: string
    readonly px: string
    readonly highlightBg: string
    readonly highlightText: string
    readonly shortcutHighlightText: string
  }
  /**
   * The group label's own padding and type style: iOS and the web set it in footnote size,
   * macOS steps down to caption-1 and bolds it. Decomposed into four slots since the two type
   * scales are otherwise inseparable `@utility` bundles (font-size, line-height, weight and
   * tracking together — see globals.css's `type-footnote`/`type-caption-1`), not a single
   * value a token can swap. Shared by every menu-shaped list's group label (menu, context-menu,
   * menubar, combobox); `select` reads its own `SelectTokens.label` instead.
   */
  readonly label: {
    readonly py: string
    readonly fontSize: string
    readonly leading: string
    readonly weight: string
    readonly tracking: string
  }
  readonly separator: {
    /** Horizontal margin: negative (bleeds to the menu's edge) on iOS/web, inset on macOS. */
    readonly mx: string
    readonly height: string
    readonly bg: string
  }
}

/**
 * The pop-up button (`variant="popup"`) and its listbox rows. iOS and macOS have no border at
 * all on the trigger; only the web adds one, so `popup.borderWidth` is 0 off the web.
 */
export interface SelectTokens {
  readonly popup: {
    readonly bg: string
    readonly shadow: string
    readonly hoverBg: string
    readonly borderWidth: number
    readonly borderColor: string
  }
  readonly item: {
    readonly highlightBg: string
    readonly highlightText: string
  }
  /**
   * The group label's type style — footnote on iOS/web, caption-1 bolded on macOS. Its own
   * family, not `MenuTokens.label`, since select's popup/item tokens already have their own
   * namespace and its label carries no platform-specific padding to share.
   */
  readonly label: {
    readonly fontSize: string
    readonly leading: string
    readonly weight: string
    readonly tracking: string
  }
}

/**
 * The combo box's text field border/shadow and its list's check-mark tint when highlighted.
 * Row highlight and the group label reuse `MenuTokens`, since the list is menu-shaped.
 */
export interface ComboboxTokens {
  readonly field: {
    readonly borderWidth: number
    readonly borderColor: string
    readonly shadow: string
  }
  readonly item: {
    readonly indicatorHighlightText: string
  }
}

/**
 * The toast viewport's placement. iOS centres it under the safe-area inset with `left`/
 * `translateX`; macOS and the web instead anchor it to the top trailing corner with `right`
 * and a fixed width, leaving `left`/`translateX` at their CSS-default no-ops.
 */
export interface ToastTokens {
  readonly top: string
  readonly right: string
  readonly left: string
  readonly translateX: string
  readonly width: string
}

/**
 * The colour well: a bare 28pt ring on iOS, AppKit's 48x24 filled capsule on macOS. The
 * swatch's own corner insets 4px from the well's on macOS, so it clears the bezel's edge.
 */
export interface ColorWellTokens {
  readonly height: string
  readonly width: string
  readonly radius: string
  readonly swatchRadius: string
  readonly borderWidth: number
  readonly bg: string
  readonly padding: string
  readonly shadow: string
}

/**
 * The toolbar's circular glass controls (`ToolbarGroup`, `ToolbarButton`): iOS keeps the full
 * capsule at every size; macOS and the web round to the control radius instead, and shrink the
 * glyph inside each button from 24pt to 16pt (macOS) or 20pt (web).
 */
export interface ToolbarTokens {
  readonly controlRadius: string
  readonly buttonIconSize: string
}

/**
 * The search field's shell: the fill-3 capsule on iOS, AppKit's bezel with a tighter leading
 * inset on macOS, and the web's bordered field with no fill overlap.
 */
export interface SearchFieldTokens {
  readonly bg: string
  readonly paddingStart: string
  readonly shadow: string
  readonly borderWidth: number
  readonly borderColor: string
}

/**
 * The bordered field shell shared by `Input`'s `bordered` variant, `Textarea` and
 * `PasscodeField`'s boxes: a 0.5px separator hairline on iOS and macOS — macOS alone carrying
 * the control bezel shadow — widening to a 1px label-4 border on the web. The same race
 * `combobox`'s field resolved.
 */
export interface FieldBorderTokens {
  readonly borderWidth: number
  readonly borderColor: string
  readonly shadow: string
}

/** `PasscodeField`'s boxes: the shared field border, plus their own height and width. */
export interface PasscodeFieldTokens extends FieldBorderTokens {
  readonly height: string
  readonly width: string
}

/**
 * The joined toggle group's pressed segment (HIG › Segmented controls, select-any style): a
 * white, shadowed segment on iOS and the web; macOS fills it with the accent and drops the
 * shadow. The resting label colour never changes off macOS, so `pressed.text` there is the same
 * `--label` value the row already reads at rest.
 */
export interface ToggleGroupTokens {
  readonly pressed: {
    readonly bg: string
    readonly text: string
    readonly shadow: string
  }
}

/** The standalone toggle button's label weight and press-down scale. */
export interface ToggleTokens {
  readonly fontWeight: string
  readonly activeScale: string
}

export interface ComponentTokens {
  readonly checkbox: Bezel
  readonly radio: Bezel
  readonly button: ButtonTokens
  readonly alertDialog: AlertDialogTokens
  readonly menu: MenuTokens
  readonly select: SelectTokens
  readonly combobox: ComboboxTokens
  readonly toast: ToastTokens
  readonly colorWell: ColorWellTokens
  readonly toolbar: ToolbarTokens
  readonly searchField: SearchFieldTokens
  readonly passcodeField: PasscodeFieldTokens
  readonly toggleGroup: ToggleGroupTokens
  readonly toggle: ToggleTokens
  readonly textarea: FieldBorderTokens
}

const iosBezel: Bezel = {
  bg: "transparent",
  border: "var(--gray-3)",
  borderWidth: 1.5,
  shadow: "none",
}

const macosBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-3)",
  borderWidth: 1,
  shadow: "var(--elevation-control)",
}

const webBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-4)",
  borderWidth: 1,
  shadow: "none",
}

// Measured 2026-09-06/07: iOS presses with a 0.97 scale and stays semibold; macOS and the
// web hold still on press and set their labels to normal weight (docs/research/apple-design-
// system-reference.md §buttons).
const iosButton: ButtonTokens = {
  fontWeight: "600",
  activeScale: "0.97",
  filled: {
    shadow: "none",
    hoverBg: "color-mix(in srgb, var(--primary), black 8%)",
  },
  gray: {
    bg: "var(--fill-3)",
    text: "var(--primary)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
  },
  bordered: {
    bg: "transparent",
    text: "var(--primary)",
    border: "var(--border)",
    shadow: "none",
    hoverBg: "var(--fill-4)",
    hoverText: "var(--primary)",
  },
}

const macosButton: ButtonTokens = {
  fontWeight: "400",
  activeScale: "1",
  filled: {
    shadow: "var(--elevation-control)",
    hoverBg: "color-mix(in srgb, var(--primary), black 8%)",
  },
  gray: {
    bg: "var(--background-3)",
    text: "var(--label)",
    shadow: "var(--elevation-control)",
    hoverBg: "var(--background-3)",
  },
  bordered: {
    bg: "var(--background-3)",
    text: "var(--label)",
    border: "transparent",
    shadow: "var(--elevation-control)",
    hoverBg: "var(--fill-4)",
    hoverText: "var(--label)",
  },
}

const webButton: ButtonTokens = {
  fontWeight: "400",
  activeScale: "1",
  filled: {
    shadow: "none",
    hoverBg: "color-mix(in srgb, var(--primary), white 6%)",
  },
  gray: {
    bg: "var(--fill-3)",
    text: "var(--label)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
  },
  bordered: {
    bg: "transparent",
    text: "var(--label)",
    border: "var(--label)",
    shadow: "none",
    hoverBg: "var(--label)",
    hoverText: "var(--background)",
  },
}

// Measured 2026-09-06/07: iOS's 320 pt card left-aligns and never recolours a preferred
// action, just bolds its label; macOS centres text and fills the preferred action with the
// accent in white; the web keeps normal-weight labels throughout, preferred or not
// (docs/research/apple-design-system-reference.md §alerts).
const iosAlertDialog: AlertDialogTokens = {
  textAlign: "start",
  titlePx: "1.5rem",
  titlePt: "1.25rem",
  descriptionPx: "1.5rem",
  descriptionText: "var(--label-2)",
  fieldPx: "1.5rem",
  button: {
    radius: "calc(infinity * 1px)",
    activeScale: "0.97",
    bg: "var(--fill-3)",
    bgPreferred: "var(--fill-3)",
    shadow: "none",
    shadowPreferred: "none",
    fontWeight: "500",
    fontWeightPreferred: "600",
    textDefault: "var(--primary)",
    textDefaultPreferred: "var(--primary)",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "var(--destructive)",
  },
}

const macosAlertDialog: AlertDialogTokens = {
  textAlign: "center",
  titlePx: "1rem",
  titlePt: "1.5rem",
  descriptionPx: "1rem",
  descriptionText: "var(--label)",
  fieldPx: "1rem",
  button: {
    radius: "var(--control-radius-regular)",
    activeScale: "1",
    bg: "var(--background-3)",
    bgPreferred: "var(--primary)",
    shadow: "var(--elevation-control)",
    shadowPreferred: "none",
    fontWeight: "500",
    fontWeightPreferred: "600",
    textDefault: "var(--label)",
    textDefaultPreferred: "white",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "white",
  },
}

const webAlertDialog: AlertDialogTokens = {
  textAlign: "start",
  titlePx: "1.5rem",
  titlePt: "1.25rem",
  descriptionPx: "1.5rem",
  descriptionText: "var(--label-2)",
  fieldPx: "1.5rem",
  button: {
    radius: "calc(infinity * 1px)",
    activeScale: "0.97",
    bg: "var(--fill-3)",
    bgPreferred: "var(--fill-3)",
    shadow: "none",
    shadowPreferred: "none",
    fontWeight: "400",
    fontWeightPreferred: "400",
    textDefault: "var(--primary)",
    textDefaultPreferred: "var(--primary)",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "var(--destructive)",
  },
}

// Measured 2026-09-06/07: macOS's 24 pt rows pack tighter (0.5rem gap, 0.625rem padding) than
// iOS/web's 44 pt rows, highlight with the system selection colour instead of fill-3, and
// inset the separator to a 0.5px hairline instead of a 2px band bleeding to the edges
// (docs/research/apple-design-system-reference.md §menus).
const iosMenu: MenuTokens = {
  item: {
    gap: "0.75rem",
    px: "1rem",
    highlightBg: "var(--fill-3)",
    highlightText: "var(--label)",
    shortcutHighlightText: "var(--label-2)",
  },
  label: {
    py: "0.5rem",
    fontSize: "var(--type-footnote-size)",
    leading: "var(--type-footnote-leading)",
    weight: "var(--type-footnote-weight)",
    tracking: "var(--type-footnote-tracking)",
  },
  separator: {
    mx: "calc(-1 * var(--menu-padding))",
    height: "0.5rem",
    bg: "var(--fill-4)",
  },
}

const macosMenu: MenuTokens = {
  item: {
    gap: "0.5rem",
    px: "0.625rem",
    highlightBg: "var(--selection)",
    highlightText: "white",
    shortcutHighlightText: "rgb(255 255 255 / 0.7)",
  },
  label: {
    py: "0.25rem",
    fontSize: "var(--type-caption-1-size)",
    leading: "var(--type-caption-1-leading)",
    // font-semibold's fixed 600, not the caption-1 scale's own weight (400, 500 emphasized).
    weight: "600",
    tracking: "var(--type-caption-1-tracking)",
  },
  separator: {
    mx: "0.5rem",
    height: "0.5px",
    bg: "var(--separator)",
  },
}

const webMenu: MenuTokens = iosMenu

// Measured 2026-09-07: the pop-up button has no border at all on iOS or macOS — only the web
// adds a label-4 hairline, since apple.com's controls sit on a plain background instead of a
// grouped list (docs/research/apple-design-system-reference.md §pickers). Its listbox rows
// highlight the same way `menu` does.
const iosSelectLabel = {
  fontSize: "var(--type-footnote-size)",
  leading: "var(--type-footnote-leading)",
  weight: "var(--type-footnote-weight)",
  tracking: "var(--type-footnote-tracking)",
}

const macosSelectLabel = {
  fontSize: "var(--type-caption-1-size)",
  leading: "var(--type-caption-1-leading)",
  // font-semibold's fixed 600, not the caption-1 scale's own weight (400, 500 emphasized).
  weight: "600",
  tracking: "var(--type-caption-1-tracking)",
}

const iosSelect: SelectTokens = {
  popup: {
    bg: "var(--fill-3)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
    borderWidth: 0,
    borderColor: "transparent",
  },
  item: {
    highlightBg: "var(--fill-3)",
    highlightText: "var(--label)",
  },
  label: iosSelectLabel,
}

const macosSelect: SelectTokens = {
  popup: {
    bg: "var(--background-3)",
    shadow: "var(--elevation-control)",
    hoverBg: "var(--background-3)",
    borderWidth: 0,
    borderColor: "transparent",
  },
  item: {
    highlightBg: "var(--selection)",
    highlightText: "white",
  },
  label: macosSelectLabel,
}

const webSelect: SelectTokens = {
  popup: {
    bg: "var(--background-3)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
    borderWidth: 1,
    borderColor: "var(--label-4)",
  },
  item: {
    highlightBg: "var(--fill-3)",
    highlightText: "var(--label)",
  },
  label: iosSelectLabel,
}

// Measured 2026-09-07: the field keeps its resting 0.5px separator hairline on iOS and macOS;
// only the web widens it to a 1px label-4 border, the same race `select`'s popup border
// resolved (docs/research/apple-design-system-reference.md §combo boxes). The selected row's
// check mark turns white to read against macOS's selection-coloured highlight; iOS and the web
// leave it tinted, since their highlight never recolours it.
const iosCombobox: ComboboxTokens = {
  field: {
    borderWidth: 0.5,
    borderColor: "var(--separator)",
    shadow: "none",
  },
  item: {
    indicatorHighlightText: "var(--primary)",
  },
}

const macosCombobox: ComboboxTokens = {
  field: {
    borderWidth: 0.5,
    borderColor: "var(--separator)",
    shadow: "var(--elevation-control)",
  },
  item: {
    indicatorHighlightText: "white",
  },
}

const webCombobox: ComboboxTokens = {
  field: {
    borderWidth: 1,
    borderColor: "var(--label-4)",
    shadow: "none",
  },
  item: {
    indicatorHighlightText: "var(--primary)",
  },
}

// Measured 2026-09-07: iOS centres the viewport under the safe-area inset, the same way a
// notification banner drops in; macOS and the web instead tuck it into the top trailing
// corner at a fixed 360px, apple.com's and AppKit's shared notification width
// (docs/research/apple-design-system-reference.md §notifications).
const iosToast: ToastTokens = {
  top: "max(0.5rem, env(safe-area-inset-top))",
  right: "auto",
  left: "50%",
  translateX: "-50%",
  width: "calc(100% - 1rem)",
}

const macosToast: ToastTokens = {
  top: "1.25rem",
  right: "1.25rem",
  left: "auto",
  translateX: "0%",
  width: "360px",
}

const webToast: ToastTokens = macosToast

// Measured 2026-09-07: iOS and the web share a bare 28pt ring (no fill, no shadow); macOS
// fills AppKit's 48x24 push-button-style bezel and drops the ring border entirely
// (docs/research/apple-design-system-reference.md §color wells).
const iosColorWell: ColorWellTokens = {
  height: "1.75rem",
  width: "1.75rem",
  radius: "calc(infinity * 1px)",
  swatchRadius: "calc(infinity * 1px)",
  borderWidth: 1.5,
  bg: "transparent",
  padding: "0.125rem",
  shadow: "none",
}

const macosColorWell: ColorWellTokens = {
  height: "var(--control-height-regular)",
  width: "3rem",
  radius: "var(--radius-control)",
  swatchRadius: "calc(var(--radius-control) - 4px)",
  borderWidth: 0,
  bg: "var(--background-3)",
  padding: "0.25rem",
  shadow: "var(--elevation-control)",
}

const webColorWell: ColorWellTokens = iosColorWell

// Shared by the toolbar's circular glass controls and the navigation bar's back button: iOS
// keeps the full capsule; macOS and the web round to the control radius instead.
const iosGlassRadius = "calc(infinity * 1px)"
const controlRadius = "var(--radius-control)"

// Measured 2026-09-07: iOS's 44pt glass button carries a 24pt glyph; macOS and the web shrink
// it to 16pt/20pt on their smaller controls (docs/research/apple-design-system-reference.md
// §toolbars).
const iosToolbar: ToolbarTokens = {
  controlRadius: iosGlassRadius,
  buttonIconSize: "1.5rem",
}

const macosToolbar: ToolbarTokens = {
  controlRadius,
  buttonIconSize: "1rem",
}

const webToolbar: ToolbarTokens = {
  controlRadius,
  buttonIconSize: "1.25rem",
}

// Measured 2026-09-07: iOS's fill-3 capsule sits with a 0.75rem leading inset; macOS's bezel
// tightens that to 0.5rem and carries the control bezel shadow; the web borders the field
// instead of filling it (docs/research/apple-design-system-reference.md §search fields).
const iosSearchField: SearchFieldTokens = {
  bg: "var(--fill-3)",
  paddingStart: "0.75rem",
  shadow: "none",
  borderWidth: 0,
  borderColor: "transparent",
}

const macosSearchField: SearchFieldTokens = {
  bg: "var(--background-3)",
  paddingStart: "0.5rem",
  shadow: "var(--elevation-control)",
  borderWidth: 0,
  borderColor: "transparent",
}

const webSearchField: SearchFieldTokens = {
  bg: "var(--background-3)",
  paddingStart: "0.75rem",
  shadow: "none",
  borderWidth: 1,
  borderColor: "var(--label-4)",
}

// Measured 2026-09-06/07: the bordered field keeps its resting 0.5px separator hairline on iOS
// and macOS — macOS alone carrying the control bezel shadow; only the web widens it to a 1px
// label-4 border (docs/research/apple-design-system-reference.md §text fields).
const iosFieldBorder: FieldBorderTokens = {
  borderWidth: 0.5,
  borderColor: "var(--separator)",
  shadow: "none",
}

const macosFieldBorder: FieldBorderTokens = {
  borderWidth: 0.5,
  borderColor: "var(--separator)",
  shadow: "var(--elevation-control)",
}

const webFieldBorder: FieldBorderTokens = {
  borderWidth: 1,
  borderColor: "var(--label-4)",
  shadow: "none",
}

// Measured 2026-09-07: the box narrows from 2.5rem to 2rem on macOS; its height reads the same
// alert-button height as the rest of the platform off macOS, where it steps to the large
// control height instead (docs/research/apple-design-system-reference.md §passcode fields).
const iosPasscodeField: PasscodeFieldTokens = {
  ...iosFieldBorder,
  height: "var(--alert-button-height)",
  width: "2.5rem",
}

const macosPasscodeField: PasscodeFieldTokens = {
  ...macosFieldBorder,
  height: "var(--control-height-large)",
  width: "2rem",
}

const webPasscodeField: PasscodeFieldTokens = {
  ...webFieldBorder,
  height: "var(--alert-button-height)",
  width: "2.5rem",
}

// Measured 2026-09-06/07: iOS and the web share a white, shadowed pressed segment; macOS fills
// it with the accent and drops the shadow. The row's resting label colour (`--label`) never
// changes off macOS, so its pressed text token there is the same value, unchanged
// (docs/research/apple-design-system-reference.md §segmented controls).
const iosSegmentPress = {
  bg: "var(--background)",
  text: "var(--label)",
  shadow: "var(--elevation-segment)",
}

const macosSegmentPress = {
  bg: "var(--primary)",
  text: "white",
  shadow: "none",
}

const iosToggleGroup: ToggleGroupTokens = { pressed: iosSegmentPress }
const macosToggleGroup: ToggleGroupTokens = { pressed: macosSegmentPress }
const webToggleGroup: ToggleGroupTokens = { pressed: iosSegmentPress }

// Measured 2026-09-06/07: iOS stays semibold at full press-down scale; macOS holds still at
// normal weight; the web keeps iOS's press-down scale but drops to normal weight, matching
// apple.com's toggle buttons (docs/research/apple-design-system-reference.md §toggles).
const iosToggle: ToggleTokens = { fontWeight: "600", activeScale: "0.97" }
const macosToggle: ToggleTokens = { fontWeight: "400", activeScale: "1" }
const webToggle: ToggleTokens = { fontWeight: "400", activeScale: "0.97" }

export const componentTokens: Record<Platform, ComponentTokens> = {
  ios: {
    checkbox: iosBezel,
    radio: iosBezel,
    button: iosButton,
    alertDialog: iosAlertDialog,
    menu: iosMenu,
    select: iosSelect,
    combobox: iosCombobox,
    toast: iosToast,
    colorWell: iosColorWell,
    toolbar: iosToolbar,
    searchField: iosSearchField,
    passcodeField: iosPasscodeField,
    toggleGroup: iosToggleGroup,
    toggle: iosToggle,
    textarea: iosFieldBorder,
  },
  macos: {
    checkbox: macosBezel,
    radio: macosBezel,
    button: macosButton,
    alertDialog: macosAlertDialog,
    menu: macosMenu,
    select: macosSelect,
    combobox: macosCombobox,
    toast: macosToast,
    colorWell: macosColorWell,
    toolbar: macosToolbar,
    searchField: macosSearchField,
    passcodeField: macosPasscodeField,
    toggleGroup: macosToggleGroup,
    toggle: macosToggle,
    textarea: macosFieldBorder,
  },
  web: {
    checkbox: webBezel,
    radio: webBezel,
    button: webButton,
    alertDialog: webAlertDialog,
    menu: webMenu,
    select: webSelect,
    combobox: webCombobox,
    toast: webToast,
    colorWell: webColorWell,
    toolbar: webToolbar,
    searchField: webSearchField,
    passcodeField: webPasscodeField,
    toggleGroup: webToggleGroup,
    toggle: webToggle,
    textarea: webFieldBorder,
  },
}

type Line = readonly [string, string]

const bezelLines = (name: string, b: Bezel): Line[] => [
  [`${name}-bg`, b.bg],
  [`${name}-border`, b.border],
  [`${name}-border-width`, `${b.borderWidth}px`],
  [`${name}-shadow`, b.shadow],
]

const buttonLines = (b: ButtonTokens): Line[] => [
  ["button-font-weight", b.fontWeight],
  ["button-active-scale", b.activeScale],
  ["button-filled-shadow", b.filled.shadow],
  ["button-filled-hover-bg", b.filled.hoverBg],
  ["button-gray-bg", b.gray.bg],
  ["button-gray-text", b.gray.text],
  ["button-gray-shadow", b.gray.shadow],
  ["button-gray-hover-bg", b.gray.hoverBg],
  ["button-bordered-bg", b.bordered.bg],
  ["button-bordered-text", b.bordered.text],
  ["button-bordered-border", b.bordered.border],
  ["button-bordered-shadow", b.bordered.shadow],
  ["button-bordered-hover-bg", b.bordered.hoverBg],
  ["button-bordered-hover-text", b.bordered.hoverText],
]

const alertDialogLines = (a: AlertDialogTokens): Line[] => [
  ["alert-text-align", a.textAlign],
  ["alert-title-px", a.titlePx],
  ["alert-title-pt", a.titlePt],
  ["alert-description-px", a.descriptionPx],
  ["alert-description-text", a.descriptionText],
  ["alert-field-px", a.fieldPx],
  ["alert-button-radius", a.button.radius],
  ["alert-button-active-scale", a.button.activeScale],
  ["alert-button-bg", a.button.bg],
  ["alert-button-bg-preferred", a.button.bgPreferred],
  ["alert-button-shadow", a.button.shadow],
  ["alert-button-shadow-preferred", a.button.shadowPreferred],
  ["alert-button-font-weight", a.button.fontWeight],
  ["alert-button-font-weight-preferred", a.button.fontWeightPreferred],
  ["alert-button-text-default", a.button.textDefault],
  ["alert-button-text-default-preferred", a.button.textDefaultPreferred],
  ["alert-button-text-destructive", a.button.textDestructive],
  [
    "alert-button-text-destructive-preferred",
    a.button.textDestructivePreferred,
  ],
]

const menuLines = (m: MenuTokens): Line[] => [
  ["menu-item-gap", m.item.gap],
  ["menu-item-px", m.item.px],
  ["menu-item-highlight-bg", m.item.highlightBg],
  ["menu-item-highlight-text", m.item.highlightText],
  ["menu-shortcut-highlight-text", m.item.shortcutHighlightText],
  ["menu-label-py", m.label.py],
  ["menu-label-font-size", m.label.fontSize],
  ["menu-label-leading", m.label.leading],
  ["menu-label-weight", m.label.weight],
  ["menu-label-tracking", m.label.tracking],
  ["menu-separator-mx", m.separator.mx],
  ["menu-separator-height", m.separator.height],
  ["menu-separator-bg", m.separator.bg],
]

const comboboxLines = (c: ComboboxTokens): Line[] => [
  ["combobox-field-border-width", `${c.field.borderWidth}px`],
  ["combobox-field-border-color", c.field.borderColor],
  ["combobox-field-shadow", c.field.shadow],
  ["combobox-item-indicator-highlight-text", c.item.indicatorHighlightText],
]

const toastLines = (t: ToastTokens): Line[] => [
  ["toast-top", t.top],
  ["toast-right", t.right],
  ["toast-left", t.left],
  ["toast-translate-x", t.translateX],
  ["toast-width", t.width],
]

const colorWellLines = (w: ColorWellTokens): Line[] => [
  ["color-well-height", w.height],
  ["color-well-width", w.width],
  ["color-well-radius", w.radius],
  ["color-well-swatch-radius", w.swatchRadius],
  ["color-well-border-width", `${w.borderWidth}px`],
  ["color-well-bg", w.bg],
  ["color-well-padding", w.padding],
  ["color-well-shadow", w.shadow],
]

const selectLines = (s: SelectTokens): Line[] => [
  ["select-popup-bg", s.popup.bg],
  ["select-popup-shadow", s.popup.shadow],
  ["select-popup-hover-bg", s.popup.hoverBg],
  ["select-popup-border-width", `${s.popup.borderWidth}px`],
  ["select-popup-border-color", s.popup.borderColor],
  ["select-item-highlight-bg", s.item.highlightBg],
  ["select-item-highlight-text", s.item.highlightText],
  ["select-label-font-size", s.label.fontSize],
  ["select-label-leading", s.label.leading],
  ["select-label-weight", s.label.weight],
  ["select-label-tracking", s.label.tracking],
]

const toolbarLines = (t: ToolbarTokens): Line[] => [
  ["toolbar-control-radius", t.controlRadius],
  ["toolbar-button-icon-size", t.buttonIconSize],
]

const searchFieldLines = (s: SearchFieldTokens): Line[] => [
  ["search-field-bg", s.bg],
  ["search-field-padding-start", s.paddingStart],
  ["search-field-shadow", s.shadow],
  ["search-field-border-width", `${s.borderWidth}px`],
  ["search-field-border-color", s.borderColor],
]

const fieldBorderLines = (name: string, f: FieldBorderTokens): Line[] => [
  [`${name}-border-width`, `${f.borderWidth}px`],
  [`${name}-border-color`, f.borderColor],
  [`${name}-shadow`, f.shadow],
]

const passcodeFieldLines = (p: PasscodeFieldTokens): Line[] => [
  ["passcode-field-height", p.height],
  ["passcode-field-width", p.width],
  ...fieldBorderLines("passcode-field", p),
]

const toggleGroupLines = (g: ToggleGroupTokens): Line[] => [
  ["toggle-group-pressed-bg", g.pressed.bg],
  ["toggle-group-pressed-text", g.pressed.text],
  ["toggle-group-pressed-shadow", g.pressed.shadow],
]

const toggleLines = (t: ToggleTokens): Line[] => [
  ["toggle-font-weight", t.fontWeight],
  ["toggle-active-scale", t.activeScale],
]

/** Every component appearance token for one idiom, as CSS variable lines. */
export function componentLines(platform: Platform): Line[] {
  const t = componentTokens[platform]
  return [
    ...bezelLines("checkbox", t.checkbox),
    ...bezelLines("radio", t.radio),
    ...buttonLines(t.button),
    ...alertDialogLines(t.alertDialog),
    ...menuLines(t.menu),
    ...selectLines(t.select),
    ...comboboxLines(t.combobox),
    ...toastLines(t.toast),
    ...colorWellLines(t.colorWell),
    ...toolbarLines(t.toolbar),
    ...searchFieldLines(t.searchField),
    ...passcodeFieldLines(t.passcodeField),
    ...toggleGroupLines(t.toggleGroup),
    ...toggleLines(t.toggle),
    ...fieldBorderLines("textarea", t.textarea),
  ]
}
