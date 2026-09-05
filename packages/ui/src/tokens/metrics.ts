/**
 * Control geometry per platform, in points. iOS values are UIKit runtime values or HIG tables,
 * with the radii Apple publishes nowhere taken from its web tokens (xlarge 24). The macOS
 * platform is Apple's desktop web idiom, measured on apps.apple.com, music.apple.com,
 * tv.apple.com and apple.com on 2026-09-05; the few values with no web counterpart (switch,
 * stepper, alert width) are AppKit's and are marked in the research document.
 */

export type Platform = "ios" | "macos"

export interface ControlMetrics {
  readonly buttonHeight: {
    readonly mini: number
    readonly small: number
    readonly regular: number
    readonly large: number
    readonly xl: number
  }
  readonly switch: {
    readonly width: number
    readonly height: number
    readonly thumb: number
  }
  readonly checkbox: {
    readonly size: number
    readonly shape: "circle" | "square"
  }
  readonly radio: { readonly size: number; readonly dot: number }
  readonly slider: { readonly track: number; readonly thumb: number }
  readonly stepper: {
    readonly width: number
    readonly height: number
    readonly radius: number
  }
  readonly segmented: { readonly height: number; readonly inset: number }
  readonly textField: { readonly height: number; readonly radius: number }
  readonly searchField: { readonly height: number }
  readonly list: {
    readonly inset: number
    readonly insetWide: number
    readonly radius: number
    readonly rowMinHeight: number
    readonly rowPaddingY: number
    readonly rowPaddingX: number
    readonly iconTile: number
  }
  readonly navBar: { readonly height: number; readonly largeTitle: number }
  readonly tabBar: { readonly height: number; readonly inset: number }
  readonly toolbar: { readonly height: number }
  readonly sheet: {
    readonly radius: number
    readonly grabber: readonly [number, number]
    readonly scrim: number
  }
  readonly alert: {
    readonly width: number
    readonly radius: number
    readonly buttonHeight: number
  }
  readonly actionSheet: {
    readonly rowHeight: number
    readonly radius: number
    readonly cancelGap: number
  }
  readonly menu: {
    readonly width: number
    readonly itemHeight: number
    readonly radius: number
  }
  readonly dialog: { readonly width: number }
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
}

const ios: ControlMetrics = {
  buttonHeight: { mini: 28, small: 32, regular: 44, large: 52, xl: 64 },
  switch: { width: 51, height: 31, thumb: 27 },
  checkbox: { size: 22, shape: "circle" },
  radio: { size: 22, dot: 8 },
  slider: { track: 4, thumb: 28 },
  stepper: { width: 94, height: 32, radius: 8 },
  segmented: { height: 32, inset: 2 },
  textField: { height: 36, radius: 10 },
  searchField: { height: 36 },
  list: {
    inset: 16,
    insetWide: 20,
    radius: 24,
    rowMinHeight: 44,
    rowPaddingY: 11,
    rowPaddingX: 16,
    iconTile: 30,
  },
  navBar: { height: 44, largeTitle: 52 },
  tabBar: { height: 64, inset: 21 },
  toolbar: { height: 44 },
  sheet: { radius: 40, grabber: [36, 5], scrim: 0.45 },
  alert: { width: 270, radius: 24, buttonHeight: 44 },
  actionSheet: { rowHeight: 56, radius: 24, cancelGap: 8 },
  menu: { width: 250, itemHeight: 44, radius: 24 },
  dialog: { width: 540 },
  splitView: { sidebar: 320, content: 375 },
  popover: { radius: 24, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 20, large: 37 },
  badge: { height: 18, minWidth: 18 },
  pageControl: { dot: 7, gap: 9 },
  hitTarget: { default: 44, minimum: 28 },
}

const macos: ControlMetrics = {
  /** Music's 24 and 28 pt buttons, its 36 pt pill, TV's 40 pt pill, apple.com's 44 pt CTA. */
  buttonHeight: { mini: 24, small: 28, regular: 36, large: 40, xl: 44 },
  switch: { width: 38, height: 22, thumb: 20 },
  checkbox: { size: 14, shape: "square" },
  radio: { size: 14, dot: 6 },
  /** TV's player scrubber. */
  slider: { track: 5, thumb: 13 },
  stepper: { width: 13, height: 22, radius: 4 },
  /** TV's `--selectHeight`. */
  segmented: { height: 32, inset: 2 },
  /** The App Store's search field. */
  textField: { height: 32, radius: 4 },
  searchField: { height: 32 },
  /** Music's sidebar rows (34 pt, 8 pt corners, 3 pt padding). */
  list: {
    inset: 0,
    insetWide: 0,
    radius: 8,
    rowMinHeight: 34,
    rowPaddingY: 3,
    rowPaddingX: 8,
    iconTile: 16,
  },
  /** TV's and Music's header bar. */
  navBar: { height: 52, largeTitle: 0 },
  tabBar: { height: 0, inset: 0 },
  toolbar: { height: 52 },
  /** Dialogs on every Apple property: 10 pt corners under the .45 scrim. */
  sheet: { radius: 10, grabber: [0, 0], scrim: 0.45 },
  alert: { width: 260, radius: 10, buttonHeight: 28 },
  actionSheet: { rowHeight: 44, radius: 12, cancelGap: 0 },
  /** TV's popover menus: 44 pt rows, 200 pt max width. */
  menu: { width: 200, itemHeight: 44, radius: 12 },
  /** The App Store's Version History modal. */
  dialog: { width: 691 },
  /** The App Store's sidebar. */
  splitView: { sidebar: 260, content: 320 },
  popover: { radius: 12, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 16, large: 32 },
  badge: { height: 18, minWidth: 18 },
  pageControl: { dot: 7, gap: 9 },
  hitTarget: { default: 28, minimum: 20 },
}

export const metrics: Readonly<Record<Platform, ControlMetrics>> = {
  ios,
  macos,
}
