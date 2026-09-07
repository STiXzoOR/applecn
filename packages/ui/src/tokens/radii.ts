import type { Platform } from "./metrics.ts"

/**
 * Corner radii per platform. Names follow Tailwind's ladder so `rounded-4xl` is always the
 * platform's largest content corner (a grouped list on iOS, a window on macOS, an App Store
 * card on the web) and `rounded-sm` its smallest.
 *
 * - iOS 26: fields 5, grouped lists 26, alerts 34 (UIKit, 2026-09-06); sheets follow the
 *   display corner, so 40 is a stand-in.
 * - macOS 26: controls 4–6, groups 10, menus 12, windows and sheets 16 (AppKit renders;
 *   window and sheet radius **approx.**).
 * - Web: the App Store's `--global-border-radius-xsmall` 5 … `-xlarge` 24; dialogs 10.
 */

export type RadiusStep = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"

export interface PlatformRadii {
  readonly ladder: Readonly<Record<RadiusStep, number>>
  /** The sheet (bottom sheet on iOS, modal sheet on macOS, modal on the web). */
  readonly sheet: number
}

const byPlatform: Readonly<Record<Platform, PlatformRadii>> = {
  ios: {
    ladder: { sm: 5, md: 8, lg: 10, xl: 14, "2xl": 18, "3xl": 22, "4xl": 26 },
    sheet: 40,
  },
  macos: {
    ladder: { sm: 4, md: 5, lg: 6, xl: 8, "2xl": 10, "3xl": 12, "4xl": 16 },
    sheet: 16,
  },
  web: {
    ladder: { sm: 5, md: 8, lg: 10, xl: 12, "2xl": 17, "3xl": 20, "4xl": 24 },
    sheet: 24,
  },
}

export const radii = {
  ...byPlatform,
  /** `--radius`, kept for shadcn compatibility. */
  base: 10,
  /** App icon mask, as a ratio of the icon's side. */
  icon: "22.37%",
  /** Capsules and circles (`--pill-button-border-radius: 1000px`, apple.com's `980px`). */
  capsule: 1000,
} as const
