import type { Rgb, Rgba } from "./colors.ts"

/**
 * Materials: the four content-layer thicknesses and the two Liquid Glass variants, as a
 * background colour per appearance plus the backdrop blur and saturation. All values are
 * web approximations of Apple's private effect parameters (research §4).
 */

export type MaterialName =
  | "ultra-thin"
  | "thin"
  | "regular"
  | "thick"
  | "glass"
  | "glass-clear"

/** A material tint always carries an alpha. */
export interface MaterialTint extends Rgba {
  readonly rgb: Rgb
  readonly alpha: number
}

export interface Material {
  readonly light: MaterialTint
  readonly dark: MaterialTint
  /** Backdrop blur radius in px. */
  readonly blur: number
  /** Backdrop saturation multiplier. */
  readonly saturate: number
}

const lightTint = (alpha: number): MaterialTint => ({
  rgb: [255, 255, 255],
  alpha,
})
const darkTint = (alpha: number): MaterialTint => ({ rgb: [37, 37, 37], alpha })

export const materials: Readonly<Record<MaterialName, Material>> = {
  "ultra-thin": {
    light: lightTint(0.55),
    dark: darkTint(0.3),
    blur: 10,
    saturate: 1.8,
  },
  thin: {
    light: lightTint(0.7),
    dark: darkTint(0.45),
    blur: 20,
    saturate: 1.8,
  },
  regular: {
    light: lightTint(0.82),
    dark: darkTint(0.62),
    blur: 30,
    saturate: 1.8,
  },
  thick: {
    light: lightTint(0.93),
    dark: darkTint(0.8),
    blur: 40,
    saturate: 1.8,
  },
  glass: {
    light: lightTint(0.5),
    dark: { rgb: [40, 40, 40], alpha: 0.5 },
    blur: 16,
    saturate: 1.6,
  },
  "glass-clear": {
    light: lightTint(0.2),
    dark: { rgb: [0, 0, 0], alpha: 0.3 },
    blur: 8,
    saturate: 1.4,
  },
}
