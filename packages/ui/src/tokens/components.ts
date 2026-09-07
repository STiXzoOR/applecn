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

/**
 * The button bezel per style. `filled`, `gray` and `bordered` are the three styles whose
 * paint used to differ by platform variant; `tinted`, `plain`, `glass`, `destructive` and
 * `link` are identical on every idiom and stay plain Tailwind classes.
 */
export interface ButtonTokens {
  /** Label weight: semibold on iOS, normal on macOS and the web. */
  readonly fontWeight: string
  /** Press-down scale factor: iOS scales down, macOS and the web hold still. */
  readonly activeScale: string
  readonly filled: {
    readonly shadow: string
    readonly hoverBg: string
  }
  readonly gray: {
    readonly bg: string
    readonly text: string
    readonly shadow: string
    readonly hoverBg: string
  }
  readonly bordered: {
    readonly bg: string
    readonly text: string
    readonly border: string
    readonly shadow: string
    readonly hoverBg: string
    readonly hoverText: string
  }
}

/**
 * The alert's action bezel. `textDefault`/`textDestructive` are the resting text colour per
 * `variant`; the `*Preferred` siblings are what a `preferred` action shows instead — on macOS
 * that's AppKit filling the preferred button with the accent and turning its label white; iOS
 * and the web don't recolour a preferred action, only its `fontWeightPreferred`.
 */
export interface AlertDialogTokens {
  /** Popup text alignment: iOS and the web start it, macOS centres it. */
  readonly textAlign: string
  readonly titlePx: string
  readonly titlePt: string
  readonly descriptionPx: string
  readonly descriptionText: string
  readonly fieldPx: string
  readonly button: {
    readonly radius: string
    readonly activeScale: string
    readonly bg: string
    readonly bgPreferred: string
    readonly shadow: string
    readonly shadowPreferred: string
    readonly fontWeight: string
    readonly fontWeightPreferred: string
    readonly textDefault: string
    readonly textDefaultPreferred: string
    readonly textDestructive: string
    readonly textDestructivePreferred: string
  }
}

export interface ComponentTokens {
  readonly checkbox: Bezel
  readonly radio: Bezel
  readonly button: ButtonTokens
  readonly alertDialog: AlertDialogTokens
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

// Measured 2026-09-06/07: iOS presses with a 0.97 scale and stays semibold; macOS and the
// web hold still on press and set their labels to normal weight (docs/research/apple-design-
// system-reference.md §buttons).
const iosButton: ButtonTokens = {
  fontWeight: "600",
  activeScale: "0.97",
  filled: {
    shadow: "none",
    hoverBg: "color-mix(in srgb, var(--primary), black 8%)",
  },
  gray: {
    bg: "var(--fill-3)",
    text: "var(--primary)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
  },
  bordered: {
    bg: "transparent",
    text: "var(--primary)",
    border: "var(--border)",
    shadow: "none",
    hoverBg: "var(--fill-4)",
    hoverText: "var(--primary)",
  },
}

const macosButton: ButtonTokens = {
  fontWeight: "400",
  activeScale: "1",
  filled: {
    shadow: "var(--elevation-control)",
    hoverBg: "color-mix(in srgb, var(--primary), black 8%)",
  },
  gray: {
    bg: "var(--background-3)",
    text: "var(--label)",
    shadow: "var(--elevation-control)",
    hoverBg: "var(--background-3)",
  },
  bordered: {
    bg: "var(--background-3)",
    text: "var(--label)",
    border: "transparent",
    shadow: "var(--elevation-control)",
    hoverBg: "var(--fill-4)",
    hoverText: "var(--label)",
  },
}

const webButton: ButtonTokens = {
  fontWeight: "400",
  activeScale: "1",
  filled: {
    shadow: "none",
    hoverBg: "color-mix(in srgb, var(--primary), white 6%)",
  },
  gray: {
    bg: "var(--fill-3)",
    text: "var(--label)",
    shadow: "none",
    hoverBg: "var(--fill-2)",
  },
  bordered: {
    bg: "transparent",
    text: "var(--label)",
    border: "var(--label)",
    shadow: "none",
    hoverBg: "var(--label)",
    hoverText: "var(--background)",
  },
}

// Measured 2026-09-06/07: iOS's 320 pt card left-aligns and never recolours a preferred
// action, just bolds its label; macOS centres text and fills the preferred action with the
// accent in white; the web keeps normal-weight labels throughout, preferred or not
// (docs/research/apple-design-system-reference.md §alerts).
const iosAlertDialog: AlertDialogTokens = {
  textAlign: "start",
  titlePx: "1.5rem",
  titlePt: "1.25rem",
  descriptionPx: "1.5rem",
  descriptionText: "var(--label-2)",
  fieldPx: "1.5rem",
  button: {
    radius: "calc(infinity * 1px)",
    activeScale: "0.97",
    bg: "var(--fill-3)",
    bgPreferred: "var(--fill-3)",
    shadow: "none",
    shadowPreferred: "none",
    fontWeight: "500",
    fontWeightPreferred: "600",
    textDefault: "var(--primary)",
    textDefaultPreferred: "var(--primary)",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "var(--destructive)",
  },
}

const macosAlertDialog: AlertDialogTokens = {
  textAlign: "center",
  titlePx: "1rem",
  titlePt: "1.5rem",
  descriptionPx: "1rem",
  descriptionText: "var(--label)",
  fieldPx: "1rem",
  button: {
    radius: "var(--control-radius-regular)",
    activeScale: "1",
    bg: "var(--background-3)",
    bgPreferred: "var(--primary)",
    shadow: "var(--elevation-control)",
    shadowPreferred: "none",
    fontWeight: "500",
    fontWeightPreferred: "600",
    textDefault: "var(--label)",
    textDefaultPreferred: "white",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "white",
  },
}

const webAlertDialog: AlertDialogTokens = {
  textAlign: "start",
  titlePx: "1.5rem",
  titlePt: "1.25rem",
  descriptionPx: "1.5rem",
  descriptionText: "var(--label-2)",
  fieldPx: "1.5rem",
  button: {
    radius: "calc(infinity * 1px)",
    activeScale: "0.97",
    bg: "var(--fill-3)",
    bgPreferred: "var(--fill-3)",
    shadow: "none",
    shadowPreferred: "none",
    fontWeight: "400",
    fontWeightPreferred: "400",
    textDefault: "var(--primary)",
    textDefaultPreferred: "var(--primary)",
    textDestructive: "var(--destructive)",
    textDestructivePreferred: "var(--destructive)",
  },
}

export const componentTokens: Record<Platform, ComponentTokens> = {
  ios: {
    checkbox: iosBezel,
    radio: iosBezel,
    button: iosButton,
    alertDialog: iosAlertDialog,
  },
  macos: {
    checkbox: macosBezel,
    radio: macosBezel,
    button: macosButton,
    alertDialog: macosAlertDialog,
  },
  web: {
    checkbox: webBezel,
    radio: webBezel,
    button: webButton,
    alertDialog: webAlertDialog,
  },
}

type Line = readonly [string, string]

const bezelLines = (name: string, b: Bezel): Line[] => [
  [`${name}-bg`, b.bg],
  [`${name}-border`, b.border],
  [`${name}-border-width`, `${b.borderWidth}px`],
  [`${name}-shadow`, b.shadow],
]

const buttonLines = (b: ButtonTokens): Line[] => [
  ["button-font-weight", b.fontWeight],
  ["button-active-scale", b.activeScale],
  ["button-filled-shadow", b.filled.shadow],
  ["button-filled-hover-bg", b.filled.hoverBg],
  ["button-gray-bg", b.gray.bg],
  ["button-gray-text", b.gray.text],
  ["button-gray-shadow", b.gray.shadow],
  ["button-gray-hover-bg", b.gray.hoverBg],
  ["button-bordered-bg", b.bordered.bg],
  ["button-bordered-text", b.bordered.text],
  ["button-bordered-border", b.bordered.border],
  ["button-bordered-shadow", b.bordered.shadow],
  ["button-bordered-hover-bg", b.bordered.hoverBg],
  ["button-bordered-hover-text", b.bordered.hoverText],
]

const alertDialogLines = (a: AlertDialogTokens): Line[] => [
  ["alert-text-align", a.textAlign],
  ["alert-title-px", a.titlePx],
  ["alert-title-pt", a.titlePt],
  ["alert-description-px", a.descriptionPx],
  ["alert-description-text", a.descriptionText],
  ["alert-field-px", a.fieldPx],
  ["alert-button-radius", a.button.radius],
  ["alert-button-active-scale", a.button.activeScale],
  ["alert-button-bg", a.button.bg],
  ["alert-button-bg-preferred", a.button.bgPreferred],
  ["alert-button-shadow", a.button.shadow],
  ["alert-button-shadow-preferred", a.button.shadowPreferred],
  ["alert-button-font-weight", a.button.fontWeight],
  ["alert-button-font-weight-preferred", a.button.fontWeightPreferred],
  ["alert-button-text-default", a.button.textDefault],
  ["alert-button-text-default-preferred", a.button.textDefaultPreferred],
  ["alert-button-text-destructive", a.button.textDestructive],
  [
    "alert-button-text-destructive-preferred",
    a.button.textDestructivePreferred,
  ],
]

/** Every component appearance token for one idiom, as CSS variable lines. */
export function componentLines(platform: Platform): Line[] {
  const t = componentTokens[platform]
  return [
    ...bezelLines("checkbox", t.checkbox),
    ...bezelLines("radio", t.radio),
    ...buttonLines(t.button),
    ...alertDialogLines(t.alertDialog),
  ]
}
