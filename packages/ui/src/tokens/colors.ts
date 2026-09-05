/**
 * Apple's colour system as data. Every value is the exact sRGB number Apple publishes
 * (HIG Color › Specifications, iOS 26) or the UIKit runtime value for the semantic roles the
 * HIG names without numbers. Sources: docs/research/apple-design-system-reference.md §1.
 */

export type Rgb = readonly [number, number, number]

export interface Rgba {
  readonly rgb: Rgb
  readonly alpha?: number
}

export interface Adaptive {
  readonly light: Rgba
  readonly dark: Rgba
}

export interface AccessibleAdaptive extends Adaptive {
  readonly lightAccessible: Rgba
  readonly darkAccessible: Rgba
}

export type SystemColorName =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "brown"

export interface SystemColor extends AccessibleAdaptive {
  readonly name: SystemColorName
}

export type GrayName =
  | "gray"
  | "gray-2"
  | "gray-3"
  | "gray-4"
  | "gray-5"
  | "gray-6"

export interface Gray extends AccessibleAdaptive {
  readonly name: GrayName
}

export interface Background extends Adaptive {
  /** iOS dark mode raises foreground layers (sheets, popovers) one step lighter. */
  readonly darkElevated: Rgba
}

const c = (r: number, g: number, b: number, alpha?: number): Rgba =>
  alpha === undefined ? { rgb: [r, g, b] } : { rgb: [r, g, b], alpha }

const system = (
  name: SystemColorName,
  light: Rgb,
  dark: Rgb,
  lightAccessible: Rgb,
  darkAccessible: Rgb
): SystemColor => ({
  name,
  light: { rgb: light },
  dark: { rgb: dark },
  lightAccessible: { rgb: lightAccessible },
  darkAccessible: { rgb: darkAccessible },
})

export const systemColors: readonly SystemColor[] = [
  system("red", [255, 56, 60], [255, 66, 69], [233, 21, 45], [255, 97, 101]),
  system(
    "orange",
    [255, 141, 40],
    [255, 146, 48],
    [197, 83, 0],
    [255, 160, 86]
  ),
  system("yellow", [255, 204, 0], [255, 214, 0], [161, 106, 0], [254, 223, 67]),
  system("green", [52, 199, 89], [48, 209, 88], [0, 137, 50], [74, 217, 104]),
  system("mint", [0, 200, 179], [0, 218, 195], [0, 133, 117], [84, 223, 203]),
  system("teal", [0, 195, 208], [0, 210, 224], [0, 129, 152], [59, 221, 236]),
  system("cyan", [0, 192, 232], [60, 211, 254], [0, 126, 174], [109, 217, 255]),
  system("blue", [0, 136, 255], [0, 145, 255], [30, 110, 244], [92, 184, 255]),
  system(
    "indigo",
    [97, 85, 245],
    [109, 124, 255],
    [86, 74, 222],
    [167, 170, 255]
  ),
  system(
    "purple",
    [203, 48, 224],
    [219, 52, 242],
    [176, 47, 194],
    [234, 141, 255]
  ),
  system("pink", [255, 45, 85], [255, 55, 95], [231, 18, 77], [255, 138, 196]),
  system(
    "brown",
    [172, 127, 94],
    [183, 138, 102],
    [149, 109, 81],
    [219, 166, 121]
  ),
]

const gray = (
  name: GrayName,
  light: Rgb,
  dark: Rgb,
  lightAccessible: Rgb,
  darkAccessible: Rgb
): Gray => ({
  name,
  light: { rgb: light },
  dark: { rgb: dark },
  lightAccessible: { rgb: lightAccessible },
  darkAccessible: { rgb: darkAccessible },
})

export const grays: readonly Gray[] = [
  gray(
    "gray",
    [142, 142, 147],
    [142, 142, 147],
    [108, 108, 112],
    [174, 174, 178]
  ),
  gray(
    "gray-2",
    [174, 174, 178],
    [99, 99, 102],
    [142, 142, 147],
    [124, 124, 128]
  ),
  gray("gray-3", [199, 199, 204], [72, 72, 74], [174, 174, 178], [84, 84, 86]),
  gray("gray-4", [209, 209, 214], [58, 58, 60], [188, 188, 192], [68, 68, 70]),
  gray("gray-5", [229, 229, 234], [44, 44, 46], [216, 216, 220], [54, 54, 56]),
  gray("gray-6", [242, 242, 247], [28, 28, 30], [235, 235, 240], [36, 36, 38]),
]

export type LabelName =
  | "label"
  | "label-2"
  | "label-3"
  | "label-4"
  | "placeholder"

export const labels: Readonly<Record<LabelName, Adaptive>> = {
  label: { light: c(0, 0, 0), dark: c(255, 255, 255) },
  "label-2": { light: c(60, 60, 67, 0.6), dark: c(235, 235, 245, 0.6) },
  "label-3": { light: c(60, 60, 67, 0.3), dark: c(235, 235, 245, 0.3) },
  "label-4": { light: c(60, 60, 67, 0.18), dark: c(235, 235, 245, 0.16) },
  placeholder: { light: c(60, 60, 67, 0.3), dark: c(235, 235, 245, 0.3) },
}

export type FillName = "fill" | "fill-2" | "fill-3" | "fill-4"

export const fills: Readonly<Record<FillName, Adaptive>> = {
  fill: { light: c(120, 120, 128, 0.2), dark: c(120, 120, 128, 0.36) },
  "fill-2": { light: c(120, 120, 128, 0.16), dark: c(120, 120, 128, 0.32) },
  "fill-3": { light: c(118, 118, 128, 0.12), dark: c(118, 118, 128, 0.24) },
  "fill-4": { light: c(116, 116, 128, 0.08), dark: c(118, 118, 128, 0.18) },
}

export type BackgroundName = "background" | "background-2" | "background-3"

export const backgrounds: Readonly<Record<BackgroundName, Background>> = {
  background: {
    light: c(255, 255, 255),
    dark: c(0, 0, 0),
    darkElevated: c(28, 28, 30),
  },
  "background-2": {
    light: c(242, 242, 247),
    dark: c(28, 28, 30),
    darkElevated: c(44, 44, 46),
  },
  "background-3": {
    light: c(255, 255, 255),
    dark: c(44, 44, 46),
    darkElevated: c(58, 58, 60),
  },
}

export type GroupedBackgroundName =
  | "grouped-background"
  | "grouped-background-2"
  | "grouped-background-3"

export const groupedBackgrounds: Readonly<
  Record<GroupedBackgroundName, Background>
> = {
  "grouped-background": {
    light: c(242, 242, 247),
    dark: c(0, 0, 0),
    darkElevated: c(28, 28, 30),
  },
  "grouped-background-2": {
    light: c(255, 255, 255),
    dark: c(28, 28, 30),
    darkElevated: c(44, 44, 46),
  },
  "grouped-background-3": {
    light: c(242, 242, 247),
    dark: c(44, 44, 46),
    darkElevated: c(58, 58, 60),
  },
}

export type SeparatorName = "separator" | "separator-opaque"

export const separators: Readonly<Record<SeparatorName, Adaptive>> = {
  separator: { light: c(60, 60, 67, 0.29), dark: c(84, 84, 88, 0.6) },
  "separator-opaque": { light: c(198, 198, 200), dark: c(56, 56, 58) },
}

export const link: Adaptive = { light: c(0, 122, 255), dark: c(9, 132, 255) }

export const white: Rgba = c(255, 255, 255)
export const black: Rgba = c(0, 0, 0)

/** Serialises a colour as modern CSS `rgb()` syntax, omitting a full alpha. */
export function css(color: Rgba): string {
  const [r, g, b] = color.rgb
  const alpha = color.alpha
  return alpha === undefined || alpha >= 1
    ? `rgb(${r} ${g} ${b})`
    : `rgb(${r} ${g} ${b} / ${alpha})`
}
