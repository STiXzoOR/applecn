/**
 * Control geometry per platform, in points (1 pt = 1 CSS px at the default text size).
 *
 * - `ios` is iOS 26: every value was read from UIKit's own view trees in the iPhone 17 Pro
 *   simulator (iOS 26.5) on 2026-09-06 — research document §11.
 * - `macos` is macOS 26 (Tahoe): AppKit `fittingSize`, fonts and pixel-measured renders on
 *   macOS 26.6.1 — research document §11.
 * - `web` is Apple's own web idiom: apple.com's stylesheet and computed styles plus the App
 *   Store, Music and TV web apps — research document §12 and §3–§8.
 *
 * Values with no Apple source are marked **approx.** in the comments.
 */

export type Platform = "ios" | "macos" | "web"

export const platforms: readonly Platform[] = ["ios", "macos", "web"]

export type ControlSize = "mini" | "small" | "regular" | "large" | "xl"

type PerSize = Readonly<Record<ControlSize, number>>

/** A capsule: any radius larger than half the control's height. */
export const CAPSULE = 1000

export interface ControlMetrics {
  readonly buttonHeight: PerSize
  /** Corner radius per size; `CAPSULE` for a pill. */
  readonly buttonRadius: PerSize
  /** Label size in points per control size. */
  readonly buttonFont: PerSize
  readonly buttonPaddingX: PerSize
  readonly switch: {
    readonly width: number
    readonly height: number
    readonly thumbWidth: number
    readonly thumbHeight: number
    readonly inset: number
  }
  readonly checkbox: {
    readonly size: number
    readonly radius: number
    readonly shape: "circle" | "square"
  }
  readonly radio: { readonly size: number; readonly dot: number }
  readonly slider: {
    readonly track: number
    readonly thumbWidth: number
    readonly thumbHeight: number
  }
  readonly stepper: {
    readonly width: number
    readonly height: number
    readonly radius: number
    readonly orientation: "horizontal" | "vertical"
  }
  readonly segmented: {
    readonly height: number
    readonly inset: number
    readonly radius: number
    /** Segment label size in points. */
    readonly font: number
  }
  readonly textField: {
    readonly height: number
    readonly radius: number
    readonly font: number
  }
  readonly searchField: { readonly height: number; readonly radius: number }
  readonly list: {
    readonly inset: number
    readonly insetWide: number
    readonly radius: number
    readonly rowMinHeight: number
    readonly rowPaddingY: number
    readonly rowPaddingX: number
    readonly iconTile: number
    /** Row text, subtitle, section header and footer sizes, in points. */
    readonly font: number
    readonly subtitleFont: number
    readonly headerFont: number
    readonly footerFont: number
  }
  readonly sidebar: {
    readonly width: number
    readonly rowHeight: number
    readonly radius: number
    readonly font: number
  }
  readonly card: { readonly radius: number }
  readonly navBar: {
    readonly height: number
    readonly largeTitle: number
    /** Bar item (platter) size. */
    readonly item: number
    readonly titleFont: number
  }
  readonly tabBar: {
    readonly height: number
    readonly inset: number
    readonly item: number
    readonly itemInset: number
    readonly label: number
  }
  readonly toolbar: {
    readonly height: number
    readonly item: number
    readonly inset: number
  }
  readonly sheet: {
    readonly radius: number
    readonly grabber: readonly [number, number]
    readonly scrim: number
  }
  readonly alert: {
    readonly width: number
    readonly radius: number
    readonly buttonHeight: number
    readonly buttonInset: number
    readonly buttonGap: number
    readonly titleFont: number
    readonly messageFont: number
  }
  readonly actionSheet: {
    readonly width: number
    readonly rowHeight: number
    readonly radius: number
    readonly inset: number
    readonly gap: number
  }
  readonly menu: {
    readonly width: number
    readonly itemHeight: number
    readonly radius: number
    readonly itemRadius: number
    readonly padding: number
    readonly font: number
  }
  readonly dialog: { readonly width: number; readonly radius: number }
  readonly splitView: { readonly sidebar: number; readonly content: number }
  readonly popover: {
    readonly radius: number
    readonly arrow: readonly [number, number]
  }
  readonly progress: { readonly height: number }
  readonly spinner: { readonly medium: number; readonly large: number }
  readonly badge: { readonly height: number; readonly minWidth: number }
  readonly pageControl: { readonly dot: number; readonly gap: number }
  readonly hitTarget: { readonly default: number; readonly minimum: number }
  /** Window chrome; macOS only. */
  readonly window?: {
    readonly titleBar: number
    readonly radius: number
    readonly trafficLight: number
  }
}

const ios: ControlMetrics = {
  /** UIButton.Configuration: mini and small 28, medium 34, large 50; extra large is **approx.** */
  buttonHeight: { mini: 28, small: 28, regular: 34, large: 50, xl: 60 },
  buttonRadius: {
    mini: CAPSULE,
    small: CAPSULE,
    regular: CAPSULE,
    large: CAPSULE,
    xl: CAPSULE,
  },
  /** 15 pt labels below medium, 17 from medium; extra large **approx.** */
  buttonFont: { mini: 15, small: 15, regular: 17, large: 17, xl: 20 },
  buttonPaddingX: { mini: 10, small: 10, regular: 12, large: 20, xl: 24 },
  /** UISwitch: a 63×28 track with the 37×24 oval knob inset 2. */
  switch: { width: 63, height: 28, thumbWidth: 37, thumbHeight: 24, inset: 2 },
  checkbox: { size: 22, radius: CAPSULE, shape: "circle" },
  radio: { size: 22, dot: 8 },
  /** UISlider: 6 pt track, the same 37×24 pill as the switch knob. */
  slider: { track: 6, thumbWidth: 37, thumbHeight: 24 },
  /** UIStepper is a 94×32 capsule. */
  stepper: {
    width: 94,
    height: 32,
    radius: CAPSULE,
    orientation: "horizontal",
  },
  segmented: { height: 32, inset: 2, radius: CAPSULE, font: 13 },
  /** UITextField `.roundedRect`: 34 tall, radius 5, hairline border, 17 pt text. */
  textField: { height: 34, radius: 5, font: 17 },
  /** UISearchBar's field: a 44 pt capsule. */
  searchField: { height: 44, radius: CAPSULE },
  /** Inset grouped: 20 from the edge (16 on ≤ 375 pt phones), 26 pt corners, 52 pt rows. */
  list: {
    inset: 16,
    insetWide: 20,
    radius: 26,
    rowMinHeight: 52,
    rowPaddingY: 15,
    rowPaddingX: 16,
    iconTile: 30,
    font: 17,
    subtitleFont: 15,
    headerFont: 17,
    footerFont: 13,
  },
  /** iPadOS sidebars: 320 wide, 44 pt rows, 10 pt corners **approx.** */
  sidebar: { width: 320, rowHeight: 44, radius: 10, font: 17 },
  card: { radius: 26 },
  /** 54 pt row with 44 pt glass platters; the 52 pt large title below it. */
  navBar: { height: 54, largeTitle: 52, item: 44, titleFont: 17 },
  /** The floating glass platter: 62 tall, inset 21, 54 pt items inset 4, 10 pt labels. */
  tabBar: { height: 62, inset: 21, item: 54, itemInset: 4, label: 10 },
  toolbar: { height: 52, item: 44, inset: 4 },
  /** Sheets follow the display corner; 40 is the web stand-in **approx.** */
  sheet: { radius: 40, grabber: [36, 5], scrim: 0.4 },
  /** UIAlertController: 320 wide, radius 34, 48 pt capsule actions inset 16, 8 apart. */
  alert: {
    width: 320,
    radius: 34,
    buttonHeight: 48,
    buttonInset: 16,
    buttonGap: 8,
    titleFont: 17,
    messageFont: 13,
  },
  actionSheet: { width: 320, rowHeight: 48, radius: 34, inset: 16, gap: 8 },
  /** Width and rows as before; the radius follows the 26 pt list corner **approx.** */
  menu: {
    width: 250,
    itemHeight: 44,
    radius: 26,
    itemRadius: 22,
    padding: 4,
    font: 17,
  },
  /** iPad form sheet; radius **approx.** */
  dialog: { width: 540, radius: 34 },
  splitView: { sidebar: 320, content: 375 },
  popover: { radius: 26, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 20, large: 37 },
  badge: { height: 18, minWidth: 18 },
  /** UIPageControl: 7 pt dots at a 17 pt pitch. */
  pageControl: { dot: 7, gap: 10 },
  hitTarget: { default: 44, minimum: 28 },
}

const macos: ControlMetrics = {
  /** NSButton push bezel: 16/20/24/28/36; rounded rectangles up to regular, capsules from large. */
  buttonHeight: { mini: 16, small: 20, regular: 24, large: 28, xl: 36 },
  buttonRadius: { mini: 4, small: 5, regular: 6, large: CAPSULE, xl: CAPSULE },
  buttonFont: { mini: 9, small: 11, regular: 13, large: 13, xl: 13 },
  buttonPaddingX: { mini: 9, small: 11, regular: 12, large: 14, xl: 18 },
  /** NSSwitch regular: 54×24 with a 31×20 oval knob. */
  switch: { width: 54, height: 24, thumbWidth: 31, thumbHeight: 20, inset: 2 },
  checkbox: { size: 16, radius: 4, shape: "square" },
  radio: { size: 16, dot: 6 },
  /** NSSlider regular: 20×16 oval knob; the track thickness is **approx.** */
  slider: { track: 4, thumbWidth: 20, thumbHeight: 16 },
  /** NSStepper regular: 20×26, stacked arrows. */
  stepper: { width: 20, height: 26, radius: 5, orientation: "vertical" },
  segmented: { height: 24, inset: 2, radius: 6, font: 13 },
  textField: { height: 24, radius: 6, font: 13 },
  searchField: { height: 24, radius: CAPSULE },
  /** Grouped forms (System Settings): white groups on the window, 10 pt corners **approx.**, 28 pt rows. */
  list: {
    inset: 0,
    insetWide: 0,
    radius: 10,
    rowMinHeight: 28,
    rowPaddingY: 4,
    rowPaddingX: 10,
    iconTile: 20,
    font: 13,
    subtitleFont: 11,
    headerFont: 13,
    footerFont: 11,
  },
  /** Source lists: 24 pt rows with spacing (28), 6 pt selection corners, 13 pt text. */
  sidebar: { width: 240, rowHeight: 28, radius: 6, font: 13 },
  card: { radius: 10 },
  /** The unified title/toolbar area; items are 28 pt glass capsules. */
  navBar: { height: 52, largeTitle: 0, item: 28, titleFont: 13 },
  tabBar: { height: 0, inset: 0, item: 0, itemInset: 0, label: 0 },
  toolbar: { height: 52, item: 28, inset: 0 },
  /** Modal sheets: radius **approx.**, no grabber. */
  sheet: { radius: 16, grabber: [0, 0], scrim: 0.45 },
  /** NSAlert: 260 wide with 110×28 buttons; radius **approx.** */
  alert: {
    width: 260,
    radius: 16,
    buttonHeight: 28,
    buttonInset: 16,
    buttonGap: 8,
    titleFont: 13,
    messageFont: 11,
  },
  /** Action sheets become popovers on macOS. */
  actionSheet: { width: 260, rowHeight: 24, radius: 12, inset: 5, gap: 0 },
  /** NSMenu: 24 pt items with 5 pt padding (a one-item menu is 34); width and radius **approx.** */
  menu: {
    width: 200,
    itemHeight: 24,
    radius: 12,
    itemRadius: 5,
    padding: 5,
    font: 13,
  },
  dialog: { width: 480, radius: 16 },
  splitView: { sidebar: 240, content: 320 },
  /** **approx.** */
  popover: { radius: 12, arrow: [13, 6.5] },
  progress: { height: 6 },
  spinner: { medium: 16, large: 32 },
  badge: { height: 18, minWidth: 18 },
  pageControl: { dot: 7, gap: 10 },
  hitTarget: { default: 28, minimum: 20 },
  /** Titled window: 32 pt title bar, 14 pt traffic lights at (12, 13); radius **approx.** */
  window: { titleBar: 32, radius: 16, trafficLight: 14 },
}

const web: ControlMetrics = {
  /** apple.com's pill buttons: reduced 24, standard 36, elevated 44, super 56; Music's 28. */
  buttonHeight: { mini: 24, small: 28, regular: 36, large: 44, xl: 56 },
  buttonRadius: {
    mini: CAPSULE,
    small: CAPSULE,
    regular: CAPSULE,
    large: CAPSULE,
    xl: CAPSULE,
  },
  buttonFont: { mini: 12, small: 12, regular: 14, large: 17, xl: 17 },
  buttonPaddingX: { mini: 11, small: 15, regular: 16, large: 22, xl: 31 },
  /** Apple's web apps mirror the classic 51×31 iOS switch **approx.** */
  switch: { width: 51, height: 31, thumbWidth: 27, thumbHeight: 27, inset: 2 },
  /** apple.com form checkboxes **approx.** */
  checkbox: { size: 16, radius: 4, shape: "square" },
  radio: { size: 16, dot: 6 },
  /** TV's player scrubber: 5 pt track, 13 pt round thumb. */
  slider: { track: 5, thumbWidth: 13, thumbHeight: 13 },
  /** Store quantity steppers **approx.** */
  stepper: { width: 64, height: 28, radius: 6, orientation: "horizontal" },
  /** TV's `--selectHeight`, a pill. */
  segmented: { height: 32, inset: 2, radius: CAPSULE, font: 14 },
  /** The App Store's fields: 32 tall, xsmall corners. */
  textField: { height: 32, radius: 5, font: 14 },
  searchField: { height: 32, radius: CAPSULE },
  /** Web-app lists: 44 pt rows, medium corners. */
  list: {
    inset: 0,
    insetWide: 0,
    radius: 12,
    rowMinHeight: 44,
    rowPaddingY: 8,
    rowPaddingX: 16,
    iconTile: 28,
    font: 15,
    subtitleFont: 13,
    headerFont: 17,
    footerFont: 12,
  },
  /** Music's sidebar: 34 pt rows with 8 pt corners and 14 pt text; the App Store's 260 pt width. */
  sidebar: { width: 260, rowHeight: 34, radius: 8, font: 14 },
  /** The App Store's large corner. */
  card: { radius: 17 },
  /** apple.com's global nav (48 below 834 px). */
  navBar: { height: 44, largeTitle: 0, item: 36, titleFont: 17 },
  tabBar: { height: 0, inset: 0, item: 0, itemInset: 0, label: 0 },
  /** Music's and TV's 52 px headers. */
  toolbar: { height: 52, item: 28, inset: 0 },
  sheet: { radius: 24, grabber: [0, 0], scrim: 0.45 },
  /** Web dialogs **approx.**; corners as on every Apple property. */
  alert: {
    width: 320,
    radius: 12,
    buttonHeight: 36,
    buttonInset: 20,
    buttonGap: 8,
    titleFont: 17,
    messageFont: 14,
  },
  actionSheet: { width: 260, rowHeight: 44, radius: 12, inset: 4, gap: 0 },
  /** TV's popover menus: 44 px rows, 200 px max, 14 px text. */
  menu: {
    width: 200,
    itemHeight: 44,
    radius: 12,
    itemRadius: 8,
    padding: 4,
    font: 14,
  },
  /** The App Store's Version History modal. */
  dialog: { width: 691, radius: 10 },
  splitView: { sidebar: 260, content: 320 },
  popover: { radius: 12, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 16, large: 32 },
  badge: { height: 18, minWidth: 18 },
  /** apple.com's dot nav **approx.** */
  pageControl: { dot: 8, gap: 8 },
  hitTarget: { default: 44, minimum: 28 },
}

export const metrics: Readonly<Record<Platform, ControlMetrics>> = {
  ios,
  macos,
  web,
}
