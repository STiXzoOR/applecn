/**
 * Apple's type system as data: the system font stacks, the eleven text styles on iOS at every
 * Dynamic Type category, the macOS text styles, and the SF Pro tracking table. Source: HIG
 * Typography › Specifications (docs/research/apple-design-system-reference.md §2).
 */

export const fontFamilies = {
  sans: '-apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
  rounded:
    "ui-rounded, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const

export type FontWeight = 400 | 500 | 600 | 700 | 800

export type TextStyleName =
  | "large-title"
  | "title-1"
  | "title-2"
  | "title-3"
  | "headline"
  | "body"
  | "callout"
  | "subheadline"
  | "footnote"
  | "caption-1"
  | "caption-2"

export interface ResponsiveSize {
  /** Viewport width from which this size applies. */
  readonly minWidth: number
  readonly size: number
  readonly leading: number
  readonly tracking: number
}

export interface TextStyle {
  readonly name: TextStyleName
  /** Point size at the category (1 pt = 1 CSS px at the default text size). */
  readonly size: number
  /** Line height in points. */
  readonly leading: number
  readonly weight: FontWeight
  /** The weight the style takes when emphasized (SwiftUI `.bold()`). */
  readonly emphasized: FontWeight
  /** Letter spacing in em; 0 where the variable system font handles optical sizing. */
  readonly tracking?: number
  /** Larger sizes at wider viewports (apple.com's headline breakpoints), ascending. */
  readonly responsive?: readonly ResponsiveSize[]
  /** The size below the first breakpoint (the base `size` is the widest). */
  readonly compact?: Omit<ResponsiveSize, "minWidth">
}

export const textStyleNames: readonly TextStyleName[] = [
  "large-title",
  "title-1",
  "title-2",
  "title-3",
  "headline",
  "body",
  "callout",
  "subheadline",
  "footnote",
  "caption-1",
  "caption-2",
]

/** iOS weights are the same at every Dynamic Type category. */
const iosWeights: Readonly<
  Record<TextStyleName, readonly [FontWeight, FontWeight]>
> = {
  "large-title": [400, 700],
  "title-1": [400, 700],
  "title-2": [400, 700],
  "title-3": [400, 600],
  headline: [600, 600],
  body: [400, 600],
  callout: [400, 600],
  subheadline: [400, 600],
  footnote: [400, 600],
  "caption-1": [400, 600],
  "caption-2": [400, 600],
}

export type DynamicTypeCategory =
  | "xSmall"
  | "small"
  | "medium"
  | "large"
  | "xLarge"
  | "xxLarge"
  | "xxxLarge"
  | "ax1"
  | "ax2"
  | "ax3"
  | "ax4"
  | "ax5"

type SizeLeading = readonly [number, number]

/** Size/leading per style, in `textStyleNames` order, per category. */
const matrix: Readonly<Record<DynamicTypeCategory, readonly SizeLeading[]>> = {
  xSmall: [
    [31, 38],
    [25, 31],
    [19, 24],
    [17, 22],
    [14, 19],
    [14, 19],
    [13, 18],
    [12, 16],
    [12, 16],
    [11, 13],
    [11, 13],
  ],
  small: [
    [32, 39],
    [26, 32],
    [20, 25],
    [18, 23],
    [15, 20],
    [15, 20],
    [14, 19],
    [13, 18],
    [12, 16],
    [11, 13],
    [11, 13],
  ],
  medium: [
    [33, 40],
    [27, 33],
    [21, 26],
    [19, 24],
    [16, 21],
    [16, 21],
    [15, 20],
    [14, 19],
    [12, 16],
    [11, 13],
    [11, 13],
  ],
  large: [
    [34, 41],
    [28, 34],
    [22, 28],
    [20, 25],
    [17, 22],
    [17, 22],
    [16, 21],
    [15, 20],
    [13, 18],
    [12, 16],
    [11, 13],
  ],
  xLarge: [
    [36, 43],
    [30, 37],
    [24, 30],
    [22, 28],
    [19, 24],
    [19, 24],
    [18, 23],
    [17, 22],
    [15, 20],
    [14, 19],
    [13, 18],
  ],
  xxLarge: [
    [38, 46],
    [32, 39],
    [26, 32],
    [24, 30],
    [21, 26],
    [21, 26],
    [20, 25],
    [19, 24],
    [17, 22],
    [16, 21],
    [15, 20],
  ],
  xxxLarge: [
    [40, 48],
    [34, 41],
    [28, 34],
    [26, 32],
    [23, 29],
    [23, 29],
    [22, 28],
    [21, 28],
    [19, 24],
    [18, 23],
    [17, 22],
  ],
  ax1: [
    [44, 52],
    [38, 46],
    [34, 41],
    [31, 38],
    [28, 34],
    [28, 34],
    [26, 32],
    [25, 31],
    [23, 29],
    [22, 28],
    [20, 25],
  ],
  ax2: [
    [48, 57],
    [43, 51],
    [39, 47],
    [37, 44],
    [33, 40],
    [33, 40],
    [32, 39],
    [30, 37],
    [27, 33],
    [26, 32],
    [24, 30],
  ],
  ax3: [
    [52, 61],
    [48, 57],
    [44, 52],
    [43, 51],
    [40, 48],
    [40, 48],
    [38, 46],
    [36, 43],
    [33, 40],
    [32, 39],
    [29, 35],
  ],
  ax4: [
    [56, 66],
    [53, 62],
    [50, 59],
    [49, 58],
    [47, 56],
    [47, 56],
    [44, 52],
    [42, 50],
    [38, 46],
    [37, 44],
    [34, 41],
  ],
  ax5: [
    [60, 70],
    [58, 68],
    [56, 66],
    [55, 65],
    [53, 62],
    [53, 62],
    [51, 60],
    [49, 58],
    [44, 52],
    [43, 51],
    [40, 48],
  ],
}

const category = (sizes: readonly SizeLeading[]): readonly TextStyle[] =>
  textStyleNames.map((name, i) => {
    const [size, leading] = sizes[i]!
    const [weight, emphasized] = iosWeights[name]
    return { name, size, leading, weight, emphasized }
  })

export const dynamicType: Readonly<
  Record<DynamicTypeCategory, readonly TextStyle[]>
> = {
  xSmall: category(matrix.xSmall),
  small: category(matrix.small),
  medium: category(matrix.medium),
  large: category(matrix.large),
  xLarge: category(matrix.xLarge),
  xxLarge: category(matrix.xxLarge),
  xxxLarge: category(matrix.xxxLarge),
  ax1: category(matrix.ax1),
  ax2: category(matrix.ax2),
  ax3: category(matrix.ax3),
  ax4: category(matrix.ax4),
  ax5: category(matrix.ax5),
}

/** The default (Large) category: what `text-body` and friends render at. */
export const iosTextStyles: readonly TextStyle[] = dynamicType.large

const mac = (
  name: TextStyleName,
  size: number,
  leading: number,
  weight: FontWeight,
  emphasized: FontWeight
): TextStyle => ({
  name,
  size,
  leading,
  weight,
  emphasized,
})

export const macosTextStyles: readonly TextStyle[] = [
  mac("large-title", 26, 32, 400, 700),
  mac("title-1", 22, 26, 400, 700),
  mac("title-2", 17, 22, 400, 700),
  mac("title-3", 15, 20, 400, 600),
  mac("headline", 13, 16, 700, 800),
  mac("body", 13, 16, 400, 600),
  mac("callout", 12, 15, 400, 600),
  mac("subheadline", 11, 14, 400, 600),
  mac("footnote", 10, 13, 400, 600),
  mac("caption-1", 10, 13, 400, 500),
  mac("caption-2", 10, 13, 500, 600),
]

/**
 * Apple's web type (apple.com, read 2026-09-06; research document §12). The static SF Pro
 * webfont needs explicit tracking, and headlines step down at apple.com's 1068 and 734 px
 * breakpoints: `size`/`leading` are the widest values, `responsive` the ladder from the
 * narrowest breakpoint up, and `compact` the phone size.
 */
const web = (
  name: TextStyleName,
  size: number,
  leading: number,
  weight: FontWeight,
  emphasized: FontWeight,
  tracking: number,
  steps?: {
    readonly medium: readonly [number, number, number]
    readonly compact: readonly [number, number, number]
  }
): TextStyle => ({
  name,
  size,
  leading,
  weight,
  emphasized,
  tracking,
  ...(steps
    ? {
        responsive: [
          {
            minWidth: 735,
            size: steps.medium[0],
            leading: steps.medium[1],
            tracking: steps.medium[2],
          },
          { minWidth: 1069, size, leading, tracking },
        ],
        compact: {
          size: steps.compact[0],
          leading: steps.compact[1],
          tracking: steps.compact[2],
        },
      }
    : {}),
})

export const webTextStyles: readonly TextStyle[] = [
  /** `typography-headline`: 48/52 → 40/44 → 32/36. */
  web("large-title", 48, 52, 600, 700, -0.003, {
    medium: [40, 44, 0],
    compact: [32, 36, 0.004],
  }),
  /** `typography-headline-reduced`: 40/44 → 32/36 → 28/32. */
  web("title-1", 40, 44, 600, 700, 0, {
    medium: [32, 36, 0.004],
    compact: [28, 32, 0.007],
  }),
  /** `typography-tile-headline-reduced`: 32/36 → 28/32 → 24/28. */
  web("title-2", 32, 36, 600, 700, 0.002, {
    medium: [28, 32, 0.007],
    compact: [24, 28, 0.009],
  }),
  /** `typography-callout`: 28/32 → 24/28 → 21/25. */
  web("title-3", 28, 32, 600, 700, 0.007, {
    medium: [24, 28, 0.009],
    compact: [21, 25, 0.011],
  }),
  /** `typography-promo-subhead` in its semibold use: 21/25, 19/23 on phones. */
  web("headline", 21, 25, 600, 700, 0.011, {
    medium: [21, 25, 0.011],
    compact: [19, 23, 0.012],
  }),
  /** `body`: 17 px at `line-height: 1.47059`, `-0.022em`. */
  web("body", 17, 25, 400, 600, -0.022),
  /** `typography-intro`: 21/25, 19/23 on phones. */
  web("callout", 21, 25, 400, 600, 0.011, {
    medium: [19, 23, 0.012],
    compact: [19, 23, 0.012],
  }),
  /** `typography-tile-subhead-reduced`. */
  web("subheadline", 19, 23, 400, 600, 0.012),
  /** `typography-body-reduced`. */
  web("footnote", 14, 20, 400, 600, -0.016),
  /** `typography-caption`. */
  web("caption-1", 12, 16, 400, 600, -0.01),
  /** Eyebrows and labels: the caption at semibold. */
  web("caption-2", 12, 16, 600, 700, -0.01),
]

/** Default and minimum point sizes per platform (HIG Typography). */
export const platformSizes = {
  ios: { default: 17, minimum: 11 },
  macos: { default: 13, minimum: 10 },
  /** apple.com's body and caption. */
  web: { default: 17, minimum: 12 },
  tvos: { default: 29, minimum: 23 },
  visionos: { default: 17, minimum: 12 },
  watchos: { default: 16, minimum: 12 },
} as const

/**
 * SF Pro tracking in 1/1000 em at each point size. Only for static font files and mockups;
 * the variable system font on the web applies its own optical sizing, so components use 0.
 */
export const tracking: readonly {
  readonly size: number
  readonly tracking: number
}[] = [
  { size: 11, tracking: 6 },
  { size: 12, tracking: 0 },
  { size: 13, tracking: -6 },
  { size: 14, tracking: -11 },
  { size: 15, tracking: -16 },
  { size: 16, tracking: -20 },
  { size: 17, tracking: -24 },
  { size: 18, tracking: -25 },
  { size: 20, tracking: -23 },
  { size: 22, tracking: -12 },
  { size: 24, tracking: 3 },
  { size: 28, tracking: 14 },
  { size: 34, tracking: 12 },
  { size: 40, tracking: 10 },
  { size: 48, tracking: 8 },
  { size: 56, tracking: 6 },
  { size: 64, tracking: 4 },
  { size: 80, tracking: 0 },
]
