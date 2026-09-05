type Rgb = readonly [number, number, number]

interface Rgba {
  readonly rgb: Rgb
  readonly alpha?: number
}

/** WCAG 2 relative luminance of an sRGB colour. */
export function luminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Alpha-blends `fg` over an opaque `bg`, rounding to whole channels. */
export function composite(fg: Rgba, bg: Rgb): Rgb {
  const alpha = fg.alpha ?? 1
  const mix = (f: number, b: number) => Math.round(f * alpha + b * (1 - alpha))
  return [mix(fg.rgb[0], bg[0]), mix(fg.rgb[1], bg[1]), mix(fg.rgb[2], bg[2])]
}

/** WCAG contrast ratio of `fg` (composited over `bg` when translucent) against `bg`. */
export function contrastRatio(fg: Rgba, bg: Rgb): number {
  const l1 = luminance(composite(fg, bg))
  const l2 = luminance(bg)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (light + 0.05) / (dark + 0.05)
}
