/**
 * Corner radii, measured from Apple's web (apps.apple.com, music.apple.com, tv.apple.com,
 * 2026-09-05). The App Store's tokens are `--global-border-radius-xsmall` 5, `small` 9,
 * `medium` 12, `large` 17 and `xlarge` 24; Music's sidebar rows use 8 and its floating sidebar
 * 20; dialogs on every property use 10. Names follow Tailwind's ladder so `rounded-4xl` is the
 * grouped list, `rounded-lg` a dialog, `rounded-md` a sidebar row.
 */

export const radii = {
  /** `--radius`, kept for shadcn compatibility. */
  base: 10,
  ladder: {
    sm: 5,
    md: 8,
    lg: 10,
    xl: 12,
    "2xl": 17,
    "3xl": 20,
    "4xl": 24,
  },
  /** iOS 26 sheets follow the display corner; 40px is the web stand-in (not measured). */
  sheet: 40,
  /** App icon mask, as a ratio of the icon's side. */
  icon: "22.37%",
  /** Capsules and circles (`--pill-button-border-radius: 1000px`). */
  capsule: 1000,
} as const

export type RadiusStep = keyof typeof radii.ladder
