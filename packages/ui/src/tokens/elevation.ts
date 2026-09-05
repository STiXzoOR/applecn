/**
 * Shadows as CSS `box-shadow` values. Thumb and segment shadows are UIKit's; card shadows are
 * the App Store's; menu, popover and window shadows are approximations. Source: research §8.
 */

export const elevation = {
  /** Switch and slider thumbs. */
  thumb: "0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06)",
  /** The selected segment of a segmented control. */
  segment: "0 3px 8px rgb(0 0 0 / 0.12), 0 3px 1px rgb(0 0 0 / 0.04)",
  /** macOS bezelled controls. */
  control: "0 0.5px 1px rgb(0 0 0 / 0.1), 0 0 0 0.5px rgb(0 0 0 / 0.05)",
  cardSmall: "0 3px 9px rgb(0 0 0 / 0.08)",
  cardMedium: "0 3px 20px rgb(0 0 0 / 0.08)",
  menu: "0 0 0 0.5px rgb(0 0 0 / 0.1), 0 8px 40px rgb(0 0 0 / 0.2)",
  popover: "0 0 0 0.5px rgb(0 0 0 / 0.1), 0 8px 32px rgb(0 0 0 / 0.16)",
  window: "0 0 0 0.5px rgb(0 0 0 / 0.15), 0 22px 70px rgb(0 0 0 / 0.35)",
  /** Liquid Glass: soft drop plus the inset specular rims. */
  glass:
    "0 8px 24px rgb(0 0 0 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.6), inset 0 -1px 0 rgb(0 0 0 / 0.08)",
} as const

export type ElevationName = keyof typeof elevation
