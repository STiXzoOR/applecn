# Apple design system reference

Every number the tokens and components use, with where it came from. Researched 2026-09-05. Sources are Apple's Human Interface Guidelines (HIG, read as the DocC JSON that backs each page), Apple's own web CSS (apple.com, apps.apple.com), UIKit/AppKit runtime values, and community measurements where Apple publishes nothing. Rows marked **approx.** are not Apple-published; they are the closest defensible value and are the first thing to revisit if a better source appears.

Platform baseline: iOS/iPadOS 26 (Liquid Glass) is the default idiom; macOS 26 (Tahoe) is the alternate. Points map 1:1 to CSS px at the default text size.

## 1. Colour

Source: HIG Color › Specifications (https://developer.apple.com/design/human-interface-guidelines/color#Specifications), unified table for all platforms, iOS 26 values.

| Colour | Default light | Default dark  | Accessible light | Accessible dark |
| ------ | ------------- | ------------- | ---------------- | --------------- |
| Red    | 255, 56, 60   | 255, 66, 69   | 233, 21, 45      | 255, 97, 101    |
| Orange | 255, 141, 40  | 255, 146, 48  | 197, 83, 0       | 255, 160, 86    |
| Yellow | 255, 204, 0   | 255, 214, 0   | 161, 106, 0      | 254, 223, 67    |
| Green  | 52, 199, 89   | 48, 209, 88   | 0, 137, 50       | 74, 217, 104    |
| Mint   | 0, 200, 179   | 0, 218, 195   | 0, 133, 117      | 84, 223, 203    |
| Teal   | 0, 195, 208   | 0, 210, 224   | 0, 129, 152      | 59, 221, 236    |
| Cyan   | 0, 192, 232   | 60, 211, 254  | 0, 126, 174      | 109, 217, 255   |
| Blue   | 0, 136, 255   | 0, 145, 255   | 30, 110, 244     | 92, 184, 255    |
| Indigo | 97, 85, 245   | 109, 124, 255 | 86, 74, 222      | 167, 170, 255   |
| Purple | 203, 48, 224  | 219, 52, 242  | 176, 47, 194     | 234, 141, 255   |
| Pink   | 255, 45, 85   | 255, 55, 95   | 231, 18, 77      | 255, 138, 196   |
| Brown  | 172, 127, 94  | 183, 138, 102 | 149, 109, 81     | 219, 166, 121   |

System grays (UIKit `systemGray`…`systemGray6`; the HIG page shows them as artwork only):

| Gray   | Light         | Dark          | Accessible light | Accessible dark |
| ------ | ------------- | ------------- | ---------------- | --------------- |
| gray   | 142, 142, 147 | 142, 142, 147 | 108, 108, 112    | 174, 174, 178   |
| gray-2 | 174, 174, 178 | 99, 99, 102   | 142, 142, 147    | 124, 124, 128   |
| gray-3 | 199, 199, 204 | 72, 72, 74    | 174, 174, 178    | 84, 84, 86      |
| gray-4 | 209, 209, 214 | 58, 58, 60    | 188, 188, 192    | 68, 68, 70      |
| gray-5 | 229, 229, 234 | 44, 44, 46    | 216, 216, 220    | 54, 54, 56      |
| gray-6 | 242, 242, 247 | 28, 28, 30    | 235, 235, 240    | 36, 36, 38      |

Semantic colours (UIKit runtime values; the HIG names them without numbers):

| Role                 | Light             | Dark              | Dark elevated |
| -------------------- | ----------------- | ----------------- | ------------- |
| label                | 0 0 0             | 255 255 255       |               |
| label-2 (secondary)  | 60 60 67 / .60    | 235 235 245 / .60 |               |
| label-3 (tertiary)   | 60 60 67 / .30    | 235 235 245 / .30 |               |
| label-4 (quaternary) | 60 60 67 / .18    | 235 235 245 / .16 |               |
| placeholder          | 60 60 67 / .30    | 235 235 245 / .30 |               |
| fill (systemFill)    | 120 120 128 / .20 | 120 120 128 / .36 |               |
| fill-2               | 120 120 128 / .16 | 120 120 128 / .32 |               |
| fill-3               | 118 118 128 / .12 | 118 118 128 / .24 |               |
| fill-4               | 116 116 128 / .08 | 118 118 128 / .18 |               |
| background-1         | 255 255 255       | 0 0 0             | 28 28 30      |
| background-2         | 242 242 247       | 28 28 30          | 44 44 46      |
| background-3         | 255 255 255       | 44 44 46          | 58 58 60      |
| grouped-background-1 | 242 242 247       | 0 0 0             | 28 28 30      |
| grouped-background-2 | 255 255 255       | 28 28 30          | 44 44 46      |
| grouped-background-3 | 242 242 247       | 44 44 46          | 58 58 60      |
| separator            | 60 60 67 / .29    | 84 84 88 / .60    |               |
| separator-opaque     | 198 198 200       | 56 56 58          |               |
| link                 | 0 122 255         | 9 132 255         |               |

Contrast rules (HIG Accessibility): text up to 17 pt needs 4.5:1, 18 pt and up or bold text 3:1; 7:1 recommended for custom dark-mode colours. Apple's own secondary label on white is 3.4:1 and white on system blue is 3.5:1 (large/semibold text only).

shadcn semantic mapping (design decision, spec §5.3): background→background-1, foreground→label, card→grouped-background-2, popover→background-1 (elevated in dark), primary→system-blue, primary-foreground→white, secondary→fill-3, secondary-foreground→label, muted→background-2, muted-foreground→label-2, accent→fill-4, accent-foreground→label, destructive→system-red, border→separator, input→fill-3, ring→system-blue, sidebar→grouped-background-1, chart-1..5→blue, green, orange, purple, red.

## 2. Typography

Source: HIG Typography › Specifications (https://developer.apple.com/design/human-interface-guidelines/typography#Specifications), fetched 2026-09-05.

Font stack on the web (design decision): `-apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`; rounded `ui-rounded, …`; mono `ui-monospace, "SF Mono", Menlo, monospace`. SF Pro may not be self-hosted; on Apple devices the stack resolves to it. Tracking stays 0 because the variable system font applies optical sizes itself.

iOS/iPadOS, Large (default) size:

| Style       | Weight   | Size | Leading | Emphasized |
| ----------- | -------- | ---- | ------- | ---------- |
| Large Title | Regular  | 34   | 41      | Bold       |
| Title 1     | Regular  | 28   | 34      | Bold       |
| Title 2     | Regular  | 22   | 28      | Bold       |
| Title 3     | Regular  | 20   | 25      | Semibold   |
| Headline    | Semibold | 17   | 22      | Semibold   |
| Body        | Regular  | 17   | 22      | Semibold   |
| Callout     | Regular  | 16   | 21      | Semibold   |
| Subheadline | Regular  | 15   | 20      | Semibold   |
| Footnote    | Regular  | 13   | 18      | Semibold   |
| Caption 1   | Regular  | 12   | 16      | Semibold   |
| Caption 2   | Regular  | 11   | 13      | Semibold   |

Dynamic Type matrix (size/leading), same order of styles:

| Category | Large Title | Title 1 | Title 2 | Title 3 | Headline | Body  | Callout | Subhead | Footnote | Caption 1 | Caption 2 |
| -------- | ----------- | ------- | ------- | ------- | -------- | ----- | ------- | ------- | -------- | --------- | --------- |
| xSmall   | 31/38       | 25/31   | 19/24   | 17/22   | 14/19    | 14/19 | 13/18   | 12/16   | 12/16    | 11/13     | 11/13     |
| Small    | 32/39       | 26/32   | 20/25   | 18/23   | 15/20    | 15/20 | 14/19   | 13/18   | 12/16    | 11/13     | 11/13     |
| Medium   | 33/40       | 27/33   | 21/26   | 19/24   | 16/21    | 16/21 | 15/20   | 14/19   | 12/16    | 11/13     | 11/13     |
| Large    | 34/41       | 28/34   | 22/28   | 20/25   | 17/22    | 17/22 | 16/21   | 15/20   | 13/18    | 12/16     | 11/13     |
| xLarge   | 36/43       | 30/37   | 24/30   | 22/28   | 19/24    | 19/24 | 18/23   | 17/22   | 15/20    | 14/19     | 13/18     |
| xxLarge  | 38/46       | 32/39   | 26/32   | 24/30   | 21/26    | 21/26 | 20/25   | 19/24   | 17/22    | 16/21     | 15/20     |
| xxxLarge | 40/48       | 34/41   | 28/34   | 26/32   | 23/29    | 23/29 | 22/28   | 21/28   | 19/24    | 18/23     | 17/22     |
| AX1      | 44/52       | 38/46   | 34/41   | 31/38   | 28/34    | 28/34 | 26/32   | 25/31   | 23/29    | 22/28     | 20/25     |
| AX2      | 48/57       | 43/51   | 39/47   | 37/44   | 33/40    | 33/40 | 32/39   | 30/37   | 27/33    | 26/32     | 24/30     |
| AX3      | 52/61       | 48/57   | 44/52   | 43/51   | 40/48    | 40/48 | 38/46   | 36/43   | 33/40    | 32/39     | 29/35     |
| AX4      | 56/66       | 53/62   | 50/59   | 49/58   | 47/56    | 47/56 | 44/52   | 42/50   | 38/46    | 37/44     | 34/41     |
| AX5      | 60/70       | 58/68   | 56/66   | 55/65   | 53/62    | 53/62 | 51/60   | 49/58   | 44/52    | 43/51     | 40/48     |

macOS:

| Style       | Weight  | Size | Leading | Emphasized |
| ----------- | ------- | ---- | ------- | ---------- |
| Large Title | Regular | 26   | 32      | Bold       |
| Title 1     | Regular | 22   | 26      | Bold       |
| Title 2     | Regular | 17   | 22      | Bold       |
| Title 3     | Regular | 15   | 20      | Semibold   |
| Headline    | Bold    | 13   | 16      | Heavy      |
| Body        | Regular | 13   | 16      | Semibold   |
| Callout     | Regular | 12   | 15      | Semibold   |
| Subheadline | Regular | 11   | 14      | Semibold   |
| Footnote    | Regular | 10   | 13      | Semibold   |
| Caption 1   | Regular | 10   | 13      | Medium     |
| Caption 2   | Medium  | 10   | 13      | Semibold   |

Defaults and minimums: iOS 17 / 11 pt, macOS 13 / 10, tvOS 29 / 23, visionOS 17 / 12, watchOS 16 / 12. Support at least 200 % text enlargement.

SF Pro tracking (1/1000 em; HIG table as read 2026-09-02, for static fonts and mockups only): 11 +6, 12 0, 13 −6, 14 −11, 15 −16, 16 −20, 17 −24, 18 −25, 20 −23, 22 −12, 24 +3, 28 +14, 34 +12, 40 +10, 48 +8, 56 +6, 64 +4, 80 0.

## 3. Layout

Source: HIG Layout and Accessibility.

| Metric                               | Value                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Hit target iOS/iPadOS                | 44×44 default, 28×28 minimum                                                                                 |
| Hit target macOS                     | 28×28 default, 20×20 minimum                                                                                 |
| Hit target visionOS / watchOS / tvOS | 60 / 44 / 66 default                                                                                         |
| Padding around bezelled controls     | ~12 pt; ~24 pt without bezel                                                                                 |
| Layout margins                       | 16 pt on phones ≤ 375 pt wide, 20 pt from 414 pt and on iPad                                                 |
| Nav bar row                          | 44 pt (iPhone portrait), 32 landscape, 50 iPad; large title adds 52 pt                                       |
| Status bar                           | 20 / 47 (notch) / 54 (Dynamic Island) pt                                                                     |
| Tab bar (iOS 26)                     | floating Liquid Glass capsule, 21 pt inset from the sides and bottom, 11 pt labels; height 64 pt **approx.** |
| Tab bar (pre-26)                     | 49 pt + 34 pt home indicator inset                                                                           |
| tvOS safe area                       | 60 pt top/bottom, 80 pt sides                                                                                |
| iPhone widths (pt)                   | 375, 390, 393, 402, 420, 430, 440                                                                            |

## 4. Materials

Source: HIG Materials. Liquid Glass has `regular` and `clear` variants; clear needs a 35 % dark dimming layer over bright content. Content-layer materials: ultra-thin, thin, regular (default), thick. Vibrancy: label/secondary/tertiary/quaternary, fill/secondary/tertiary, separator.

Web values (**approx.**, spec §5.5): light backgrounds white at .55/.70/.82/.93 alpha, dark backgrounds rgb(37 37 37) at .30/.45/.62/.80, blur 10/20/30/40 px, saturate 180 %. Glass regular: white .50 / rgb(40 40 40) .50, blur 16 px; glass clear: white .20 / black .30, blur 8 px. apple.com uses `saturate(180%) blur(20px)` over rgba(250,250,252,.8) light / rgba(22,22,23,.8) dark; the App Store uses white 25 % + blur(10px) for translucent buttons.

## 5. Shape

Apple publishes no radii. The ladder below is shadcn's Luma derivation from `--radius: 10px`, which lands on the values measured from iOS: 6 (small controls), 8 (stepper), 10 (classic text field/list), 14 (classic alert), 18, 22, 26 (iOS 26 inset grouped lists, alerts, menus; **approx.** for iOS 26 which only says "rounder"). Sheet 40 pt (iOS 26 sheets match the display corner; **approx.** for the web). App icon mask 22.37 % of the side. Capsule = `9999px`. Nested corners are concentric: inner = outer − inset.

## 6. Controls (iOS 26 default; macOS in the second column)

| Control                                   | iOS                                                                          | macOS                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Button height mini/small/regular/large/xl | 28/32/44/52/64 (HIG Buttons size table)                                      | 16/20/24/28/34 **approx.** (AppKit published 15/18/21/26 pre-Tahoe; Tahoe grew them) |
| Button shape                              | capsule; circle when icon-only                                               | rounded 6 pt                                                                         |
| Switch                                    | 51×31, thumb 27, on = system green (UIKit)                                   | 38×22, thumb 20 **approx.**                                                          |
| Checkbox                                  | 22 pt circle in lists **approx.**                                            | 14 pt square, radius 3.5                                                             |
| Radio                                     | 22 pt circle                                                                 | 14 pt                                                                                |
| Slider                                    | track 4, thumb 28 (UIKit)                                                    | track 4, knob 20                                                                     |
| Stepper                                   | 94×32, radius 8 (UIKit)                                                      | —                                                                                    |
| Segmented control                         | height 32, inset 2, capsule (iOS 26)                                         | height 22, radius 6                                                                  |
| Text field                                | list row 44; standalone 36, radius 10                                        | 22, radius 6                                                                         |
| Search field                              | 36, capsule                                                                  | 22, radius 6                                                                         |
| Inset grouped list                        | inset 16/20, radius 26, row ≥ 44, padding 11×16, icon tile 30 pt             | sidebar rows 28, radius 6                                                            |
| Sheet                                     | radius 40, grabber 36×5, scrim black 40 %, detents medium 50 % / large       | dialog radius 26                                                                     |
| Alert                                     | width 270, radius 26, buttons 44, thick material, text left-aligned (iOS 26) | width 260                                                                            |
| Action sheet                              | rows 56, radius 26, cancel group 8 pt below                                  | popover                                                                              |
| Menu                                      | width 250, item 44, radius 26, glyphs leading (iOS 26)                       | item 22, radius 12                                                                   |
| Popover                                   | radius 26, arrow 13×6.5                                                      | radius 12                                                                            |
| Progress bar                              | height 4, radius 2                                                           | height 4                                                                             |
| Activity indicator                        | 20 / 37 (UIKit medium/large)                                                 | 16 / 32                                                                              |
| Badge                                     | height 18, min width 18, system red                                          | —                                                                                    |
| Page control                              | dots 7, gap 9 (UIKit)                                                        | —                                                                                    |

## 7. Motion

HIG Motion publishes no durations. SwiftUI defaults: `.smooth` bounce 0, `.snappy` 0.15, `.bouncy` 0.3, all 0.5 s. apple.com: `cubic-bezier(.4,0,.6,1)` 240–300 ms; App Store buttons 140 ms in / 210 ms out. Tokens: standard `cubic-bezier(0.25, 0.1, 0.25, 1)`, sheet `cubic-bezier(0.32, 0.72, 0, 1)`; durations press 120, hover 150, overlay 250, nav 300, sheet 450 ms. Reduce Motion: keep fades, drop transforms, never animate blur.

## 8. Elevation

UIKit switch/slider thumb: `0 3px 8px rgb(0 0 0 / .15), 0 3px 1px rgb(0 0 0 / .06)`. Segmented control selected segment: `0 3px 8px rgb(0 0 0 / .12), 0 3px 1px rgb(0 0 0 / .04)`. App Store cards: `0 3px 9px rgb(0 0 0 / .08)` small, `0 3px 20px rgb(0 0 0 / .08)` medium. Menus, popovers and windows (**approx.**): hairline `0 0 0 0.5px rgb(0 0 0 / .1)` plus a soft drop of 40 / 32 / 70 px.

## 9. Icons

SF Symbols: nine weights matching the text weights; three scales (small, medium, large) relative to the cap height; rendering modes monochrome, hierarchical, palette, multicolor. The design system maps Hugeicons onto this model: scale small 0.85 em, medium 1 em (rendered at 1.2 em so the glyph's cap height matches the text), large 1.3 em; weights regular / semibold / bold as stroke 1.5 / 2 / 2.5.
