/**
 * Motion tokens, measured from Apple's web CSS (2026-09-05). The HIG publishes no durations;
 * apple.com, the App Store, Music and TV do: hover states come in over `.1s ease-in` and out
 * over `.21s`, menus and reveals take `.3s`, apple.com's nav `.24s`, the App Store's full-height
 * nav sheet `.56s`. SwiftUI's spring presets are rendered as CSS `linear()` easings.
 */

export const easings = {
  /** The App Store's and Music's ease-out for reveals and hover states. */
  standard: "cubic-bezier(0.04, 0.04, 0.12, 0.96)",
  /** apple.com's global nav. */
  nav: "cubic-bezier(0.4, 0, 0.6, 1)",
  /** apple.com's transforms. */
  transform: "cubic-bezier(0.25, 0.1, 0.3, 1)",
  /** The App Store's mobile nav sheet expanding. */
  sheet: "cubic-bezier(0.52, 0.16, 0.24, 1)",
  /** Music's menus and popovers (ease-out cubic). */
  menu: "cubic-bezier(0.215, 0.61, 0.355, 1)",
} as const

/** Milliseconds. */
export const durations = {
  /** Hover and press states coming in (`.1s ease-in`, Music and the App Store). */
  press: 100,
  /** Hover states going out (`.21s`, the App Store). */
  hover: 210,
  /** Menus, popovers, alerts (`.3s`, Music and TV). */
  overlay: 300,
  /** Bars collapsing (`.24s`, apple.com). */
  nav: 240,
  /** Sheets (`.56s`, the App Store's nav sheet). */
  sheet: 560,
} as const

export interface SpringOptions {
  /** Perceptual duration in seconds (SwiftUI `Spring(duration:bounce:)`). */
  readonly duration: number
  /** 0 = critically damped, up to 1. */
  readonly bounce: number
  /** Number of samples in the `linear()` list. */
  readonly samples?: number
}

/**
 * Solves SwiftUI's spring model (mass 1, stiffness (2π/duration)², damping 4π(1−bounce)/duration)
 * over `duration` and renders it as a CSS `linear()` easing. The last sample is pinned to 1 so
 * the animation always lands exactly on its end value.
 */
export function springLinear({
  duration,
  bounce,
  samples = 32,
}: SpringOptions): string {
  const zeta = 1 - bounce
  const omega = (2 * Math.PI) / duration
  const position = (t: number): number => {
    if (zeta >= 1) return 1 - Math.exp(-omega * t) * (1 + omega * t)
    const omegaD = omega * Math.sqrt(1 - zeta * zeta)
    return (
      1 -
      Math.exp(-zeta * omega * t) *
        (Math.cos(omegaD * t) +
          ((zeta * omega) / omegaD) * Math.sin(omegaD * t))
    )
  }
  const values: string[] = []
  for (let i = 0; i < samples; i++) {
    const t = (i / (samples - 1)) * duration
    const v = i === samples - 1 ? 1 : position(t)
    values.push(String(Math.round(v * 10000) / 10000))
  }
  return `linear(${values.join(", ")})`
}

export const springs = {
  smooth: springLinear({ duration: 0.5, bounce: 0 }),
  snappy: springLinear({ duration: 0.5, bounce: 0.15 }),
  bouncy: springLinear({ duration: 0.5, bounce: 0.3 }),
} as const
