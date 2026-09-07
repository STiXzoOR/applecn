import type { Platform } from "../lib/platform"

/**
 * Per-component appearance, per idiom. `metrics.ts` holds geometry Apple publishes;
 * this holds the paint that used to live in `ios:`/`macos:`/`web:` classes. Splitting
 * them keeps the measured geometry fixtures untouched.
 */
export interface Bezel {
  /** Resting background. */
  readonly bg: string
  /** Resting border colour. */
  readonly border: string
  /** Border width in px. */
  readonly borderWidth: number
  /** Resting box-shadow. */
  readonly shadow: string
}

export interface ComponentTokens {
  readonly checkbox: Bezel
  readonly radio: Bezel
}

const iosBezel: Bezel = {
  bg: "transparent",
  border: "var(--gray-3)",
  borderWidth: 1.5,
  shadow: "none",
}

const macosBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-3)",
  borderWidth: 1,
  shadow: "var(--elevation-control)",
}

const webBezel: Bezel = {
  bg: "var(--background-3)",
  border: "var(--label-4)",
  borderWidth: 1,
  shadow: "none",
}

export const componentTokens: Record<Platform, ComponentTokens> = {
  ios: { checkbox: iosBezel, radio: iosBezel },
  macos: { checkbox: macosBezel, radio: macosBezel },
  web: { checkbox: webBezel, radio: webBezel },
}

type Line = readonly [string, string]

const bezelLines = (name: string, b: Bezel): Line[] => [
  [`${name}-bg`, b.bg],
  [`${name}-border`, b.border],
  [`${name}-border-width`, `${b.borderWidth}px`],
  [`${name}-shadow`, b.shadow],
]

/** Every component appearance token for one idiom, as CSS variable lines. */
export function componentLines(platform: Platform): Line[] {
  const t = componentTokens[platform]
  return [
    ...bezelLines("checkbox", t.checkbox),
    ...bezelLines("radio", t.radio),
  ]
}
