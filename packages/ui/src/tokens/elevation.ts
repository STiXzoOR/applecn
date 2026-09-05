/**
 * Shadows as CSS `box-shadow` values. Thumb and segment shadows are UIKit's (the App Store's
 * `--segmentedControlSelectedShadow1/2` confirm them); cards, the hero icon and the mobile bar
 * are the App Store's; `lift` and `artwork` are Music's; glass and dialog shadows are the
 * `--glassMaterial*` and `--dialogShadowColor` recipes Music and TV ship, per appearance.
 * Measured 2026-09-05.
 */

export interface AdaptiveShadow {
  readonly light: string
  readonly dark: string
}

export const elevation = {
  /** Switch and slider thumbs (UIKit). */
  thumb: "0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06)",
  /** The selected segment of a segmented control. */
  segment: "0 3px 8px rgb(0 0 0 / 0.12), 0 3px 1px rgb(0 0 0 / 0.04)",
  /** Desktop bezelled controls (TV's `--progress-thumb-box-shadow`). */
  control:
    "inset 0 0 0.5px 0 rgb(0 0 0 / 0.15), 1px 1px 1px 0 rgb(0 0 0 / 0.1)",
  /** App Store `--shadow-small` and `--shadow-medium`. */
  cardSmall: "0 3px 9px rgb(0 0 0 / 0.08)",
  cardMedium: "0 3px 20px rgb(0 0 0 / 0.08)",
  /** Music's lifted artwork and cards. */
  lift: "0 1px 1px rgb(0 0 0 / 0.01), 0 2px 2px rgb(0 0 0 / 0.01), 0 4px 4px rgb(0 0 0 / 0.02), 0 8px 8px rgb(0 0 0 / 0.03), 0 14px 14px rgb(0 0 0 / 0.03)",
  artwork: "0 2px 6px -4px rgb(0 0 0 / 0.4)",
  /** The App Store's hero icon. */
  heroIcon: "0 0 30px rgb(0 0 0 / 0.33)",
  /** The App Store's fixed mobile bar. */
  mobileBar: "0 1px 2px rgb(0 0 0 / 0.1)",
  /** Liquid Glass: the inner stroke and the 40 px drop (`--glassMaterialInnerStrokeCombined`, `--glassMaterialShadowColor`). */
  glass: {
    light: "inset 0 0 0 1px rgb(0 0 0 / 0.05), 0 10px 40px rgb(0 0 0 / 0.1)",
    dark: "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 10px 40px rgb(0 0 0 / 0.2)",
  },
  /** Dialogs and alerts (`--dialogShadowColor`). */
  dialog: {
    light:
      "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 8px 40px rgb(0 0 0 / 0.25)",
    dark: "inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 8px 40px rgb(0 0 0 / 0.55)",
  },
} as const satisfies Record<string, string | AdaptiveShadow>

export type ElevationName = keyof typeof elevation
