/**
 * Control geometry per platform, in points. iOS values are UIKit runtime values or HIG
 * tables; macOS values marked in the research document as approximations are AppKit's
 * published pre-Tahoe sizes rounded up for macOS 26. Source: research §3 and §6.
 */

export type Platform = 'ios' | 'macos'

export interface ControlMetrics {
  readonly buttonHeight: { readonly mini: number; readonly small: number; readonly regular: number; readonly large: number; readonly xl: number }
  readonly switch: { readonly width: number; readonly height: number; readonly thumb: number }
  readonly checkbox: { readonly size: number; readonly shape: 'circle' | 'square' }
  readonly radio: { readonly size: number; readonly dot: number }
  readonly slider: { readonly track: number; readonly thumb: number }
  readonly stepper: { readonly width: number; readonly height: number; readonly radius: number }
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
  readonly sheet: { readonly radius: number; readonly grabber: readonly [number, number]; readonly scrim: number }
  readonly alert: { readonly width: number; readonly radius: number; readonly buttonHeight: number }
  readonly actionSheet: { readonly rowHeight: number; readonly radius: number; readonly cancelGap: number }
  readonly menu: { readonly width: number; readonly itemHeight: number; readonly radius: number }
  readonly dialog: { readonly width: number }
  readonly splitView: { readonly sidebar: number; readonly content: number }
  readonly popover: { readonly radius: number; readonly arrow: readonly [number, number] }
  readonly progress: { readonly height: number }
  readonly spinner: { readonly medium: number; readonly large: number }
  readonly badge: { readonly height: number; readonly minWidth: number }
  readonly pageControl: { readonly dot: number; readonly gap: number }
  readonly hitTarget: { readonly default: number; readonly minimum: number }
}

const ios: ControlMetrics = {
  buttonHeight: { mini: 28, small: 32, regular: 44, large: 52, xl: 64 },
  switch: { width: 51, height: 31, thumb: 27 },
  checkbox: { size: 22, shape: 'circle' },
  radio: { size: 22, dot: 8 },
  slider: { track: 4, thumb: 28 },
  stepper: { width: 94, height: 32, radius: 8 },
  segmented: { height: 32, inset: 2 },
  textField: { height: 36, radius: 10 },
  searchField: { height: 36 },
  list: { inset: 16, insetWide: 20, radius: 26, rowMinHeight: 44, rowPaddingY: 11, rowPaddingX: 16, iconTile: 30 },
  navBar: { height: 44, largeTitle: 52 },
  tabBar: { height: 64, inset: 21 },
  toolbar: { height: 44 },
  sheet: { radius: 40, grabber: [36, 5], scrim: 0.4 },
  alert: { width: 270, radius: 26, buttonHeight: 44 },
  actionSheet: { rowHeight: 56, radius: 26, cancelGap: 8 },
  menu: { width: 250, itemHeight: 44, radius: 26 },
  dialog: { width: 540 },
  splitView: { sidebar: 320, content: 375 },
  popover: { radius: 26, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 20, large: 37 },
  badge: { height: 18, minWidth: 18 },
  pageControl: { dot: 7, gap: 9 },
  hitTarget: { default: 44, minimum: 28 },
}

const macos: ControlMetrics = {
  buttonHeight: { mini: 16, small: 20, regular: 24, large: 28, xl: 34 },
  switch: { width: 38, height: 22, thumb: 20 },
  checkbox: { size: 14, shape: 'square' },
  radio: { size: 14, dot: 6 },
  slider: { track: 4, thumb: 20 },
  stepper: { width: 13, height: 22, radius: 4 },
  segmented: { height: 22, inset: 1 },
  textField: { height: 22, radius: 6 },
  searchField: { height: 22 },
  list: { inset: 0, insetWide: 0, radius: 6, rowMinHeight: 28, rowPaddingY: 4, rowPaddingX: 8, iconTile: 16 },
  navBar: { height: 28, largeTitle: 0 },
  tabBar: { height: 0, inset: 0 },
  toolbar: { height: 52 },
  sheet: { radius: 26, grabber: [0, 0], scrim: 0.25 },
  alert: { width: 260, radius: 12, buttonHeight: 24 },
  actionSheet: { rowHeight: 22, radius: 12, cancelGap: 0 },
  menu: { width: 200, itemHeight: 22, radius: 12 },
  dialog: { width: 480 },
  splitView: { sidebar: 240, content: 320 },
  popover: { radius: 12, arrow: [13, 6.5] },
  progress: { height: 4 },
  spinner: { medium: 16, large: 32 },
  badge: { height: 18, minWidth: 18 },
  pageControl: { dot: 7, gap: 9 },
  hitTarget: { default: 28, minimum: 20 },
}

export const metrics: Readonly<Record<Platform, ControlMetrics>> = { ios, macos }
