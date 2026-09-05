/**
 * Corner radii. shadcn's Luma style derives its scale from `--radius` (0.625rem = 10px) with
 * the multipliers 0.6, 0.8, 1, 1.4, 1.8, 2.2, 2.6, which lands on Apple's ladder:
 * 6, 8, 10, 14, 18, 22, 26. Source: research §5.
 */

export const radii = {
  /** `--radius`, in px. */
  base: 10,
  ladder: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    "2xl": 18,
    "3xl": 22,
    "4xl": 26,
  },
  /** iOS 26 sheets follow the display corner; 40px is the web stand-in. */
  sheet: 40,
  /** App icon mask, as a ratio of the icon's side. */
  icon: "22.37%",
  /** Capsules and circles. */
  capsule: 9999,
} as const

export type RadiusStep = keyof typeof radii.ladder
