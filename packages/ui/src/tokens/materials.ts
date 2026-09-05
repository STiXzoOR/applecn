import type { Rgb, Rgba } from "./colors.ts"

/**
 * Materials, measured from Apple's web CSS (2026-09-05): the four content-layer thicknesses and
 * the two Liquid Glass variants, each as a tint per appearance, a backdrop blur and saturation,
 * and the opaque fallback Apple ships for browsers without backdrop-filter and for Reduce
 * Transparency (`--fallbackMaterialBG`, `--glassMaterialBackground-*_IC`).
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
  /** The opaque stand-in under Reduce Transparency. */
  readonly fallback: {
    readonly light: MaterialTint
    readonly dark: MaterialTint
  }
}

const tint = (rgb: Rgb, alpha: number): MaterialTint => ({ rgb, alpha })

/** `--fallbackMaterialBG`: white and near-black at 97 %. */
const contentFallback = {
  light: tint([255, 255, 255], 0.97),
  dark: tint([31, 31, 31], 0.97),
}
/** `--glassMaterialBackground-*_IC`: the increased-contrast, opaque glass. */
const glassFallback = {
  light: tint([242, 242, 242], 1),
  dark: tint([14, 14, 14], 1),
}

export const materials: Readonly<Record<MaterialName, Material>> = {
  /** The App Store's translucent control (white 25 % over `saturate(180%) blur(10px)`); TV's dark counterpart. */
  "ultra-thin": {
    light: tint([255, 255, 255], 0.25),
    dark: tint([0, 0, 0], 0.3),
    blur: 10,
    saturate: 1.8,
    fallback: contentFallback,
  },
  /** Music's and TV's glass tiles (`saturate(1.9) blur(60px)` over 48 % / 50 %). */
  thin: {
    light: tint([246, 246, 246], 0.48),
    dark: tint([40, 40, 40], 0.5),
    blur: 60,
    saturate: 1.8,
    fallback: contentFallback,
  },
  /** apple.com's global nav (`rgba(250,250,252,.8)` / `rgba(22,22,23,.8)` over `saturate(180%) blur(20px)`). */
  regular: {
    light: tint([250, 250, 252], 0.8),
    dark: tint([22, 22, 23], 0.8),
    blur: 20,
    saturate: 1.8,
    fallback: contentFallback,
  },
  /** Music's player bar (`--playerBackground`: 88 %). */
  thick: {
    light: tint([255, 255, 255], 0.88),
    dark: tint([45, 45, 45], 0.88),
    blur: 60,
    saturate: 1.8,
    fallback: contentFallback,
  },
  /** Music's floating sidebar: `--glassMaterialBackground` behind `saturate(2.2) blur(16px)`. */
  glass: {
    light: tint([245, 245, 247], 0.55),
    dark: tint([38, 38, 40], 0.6),
    blur: 16,
    saturate: 2.2,
    fallback: glassFallback,
  },
  /** The App Store's translucent button over artwork: white 25 %, `saturate(180%) blur(10px)`. */
  "glass-clear": {
    light: tint([255, 255, 255], 0.25),
    dark: tint([255, 255, 255], 0.25),
    blur: 10,
    saturate: 1.8,
    fallback: glassFallback,
  },
}
