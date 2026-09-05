/**
 * Motion tokens. The HIG publishes no durations; these are apple.com and App Store CSS values
 * plus SwiftUI's spring presets rendered as CSS `linear()` easings. Source: research §7.
 */

export const easings = {
  /** The general-purpose curve (apple.com transforms). */
  standard: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  /** Sheets and drawers settle with this long ease-out. */
  sheet: "cubic-bezier(0.32, 0.72, 0, 1)",
  /** apple.com navigation reveal. */
  nav: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const

/** Milliseconds. */
export const durations = {
  press: 120,
  hover: 150,
  overlay: 250,
  nav: 300,
  sheet: 450,
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
