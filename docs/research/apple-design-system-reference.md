# Apple design system reference

Every number the tokens and components use, with where it came from. Researched 2026-09-05. Sources are Apple's Human Interface Guidelines (HIG, read as the DocC JSON that backs each page), UIKit/AppKit runtime values, and — for everything Apple publishes nowhere — Apple's own web properties, read from their stylesheets and from rendered pages in headless Chromium at 1440 and 390 px in both colour schemes: apps.apple.com (the 2025 App Store), music.apple.com, tv.apple.com and apple.com. Rows marked **approx.** have no Apple source and are the first thing to revisit.

Platform baseline: iOS/iPadOS 26 (Liquid Glass) is the default idiom. The macOS platform is Apple's desktop web idiom — the App Store, Music and TV web apps on a desktop viewport — which is what a web design system can measure. Points map 1:1 to CSS px at the default text size.

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

Apple's web confirms the separator and labels: apps.apple.com `--labelDivider-vibrant` is `rgba(60,60,67,.29)` / `rgba(235,235,245,.19)`, `--keyline-border-style` is `.5px solid`, `systemPrimary` is `rgba(0,0,0,.88)` / white `.92`, `systemSecondary` `.56` / `.64`, sidebar ground `rgba(60,60,67,.03)` / `rgba(235,235,245,.03)`, sidebar selection `.1`, key colour pressed `#005cd7`, rollover `#0045b7`, increased-contrast key colour `#0040dd`, focus ring `0 0 0 4px rgba(keyColor, .6)`.

Contrast rules (HIG Accessibility): text up to 17 pt needs 4.5:1, 18 pt and up or bold text 3:1; 7:1 recommended for custom dark-mode colours. Apple's own secondary label on white is 3.4:1 and white on system blue is 3.5:1 (large/semibold text only).

shadcn semantic mapping (design decision, spec §5.3): background→background-1, foreground→label, card→grouped-background-2, popover→background-1 (elevated in dark), primary→system-blue, primary-foreground→white, secondary→fill-3, secondary-foreground→label, muted→background-2, muted-foreground→label-2, accent→fill-4, accent-foreground→label, destructive→system-red, border→separator, input→fill-3, ring→system-blue, sidebar→grouped-background-1, chart-1..5→blue, green, orange, purple, red.

## 2. Typography

Source: HIG Typography › Specifications (https://developer.apple.com/design/human-interface-guidelines/typography#Specifications), fetched 2026-09-05.

Font stack on the web (design decision): `-apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`; rounded `ui-rounded, …`; mono `ui-monospace, "SF Mono", Menlo, monospace`. SF Pro may not be self-hosted; on Apple devices the stack resolves to it. Tracking stays 0 because the variable system font applies optical sizes itself (apple.com sets `-0.374px` on 17 px and `-0.12px` on 12 px with its static webfont; the App Store and Music set none).

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

Apple's desktop web uses the same scale: the App Store and Music render `13px/16px` body, `15px/20px` sidebar items, `17px/22px` 700 section titles, `22px/26px` 700 titles and a `34px/40px` 700 page title; TV's page title is `26px/32px` 700.

Defaults and minimums: iOS 17 / 11 pt, macOS 13 / 10, tvOS 29 / 23, visionOS 17 / 12, watchOS 16 / 12. Support at least 200 % text enlargement.

SF Pro tracking (1/1000 em; HIG table as read 2026-09-02, for static fonts and mockups only): 11 +6, 12 0, 13 −6, 14 −11, 15 −16, 16 −20, 17 −24, 18 −25, 20 −23, 22 −12, 24 +3, 28 +14, 34 +12, 40 +10, 48 +8, 56 +6, 64 +4, 80 0.

## 3. Layout

Source: HIG Layout and Accessibility, plus the App Store and apple.com rendered at 1440 and 390 px.

| Metric                               | Value                                                                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hit target iOS/iPadOS                | 44×44 default, 28×28 minimum                                                                                                                                                                                               |
| Hit target macOS                     | 28×28 default, 20×20 minimum                                                                                                                                                                                               |
| Hit target visionOS / watchOS / tvOS | 60 / 44 / 66 default                                                                                                                                                                                                       |
| Padding around bezelled controls     | ~12 pt; ~24 pt without bezel                                                                                                                                                                                               |
| Layout margins                       | 16 pt on phones ≤ 375 pt wide, 20 pt from 414 pt and on iPad                                                                                                                                                               |
| Nav bar row                          | 44 pt (iPhone portrait), 32 landscape, 50 iPad; large title adds 52 pt                                                                                                                                                     |
| Status bar                           | 20 / 47 (notch) / 54 (Dynamic Island) pt                                                                                                                                                                                   |
| Tab bar (iOS 26)                     | floating Liquid Glass capsule, 21 pt inset from the sides and bottom, 11 pt labels; height 64 pt **approx.**                                                                                                               |
| Tab bar (pre-26)                     | 49 pt + 34 pt home indicator inset                                                                                                                                                                                         |
| Web bars                             | apple.com global nav 44 px (48 px below 834 px); the App Store's fixed mobile bar 44 px with `0 1px 2px rgba(0,0,0,.1)`; Music's mobile bar 52 px on glass; TV's header 52 px; Music's player bar 54 px (61 px on a phone) |
| Web sidebar                          | App Store 260 px on `rgba(60,60,67,.03)`, rows 30 px with 6 px corners, 15 px text; Music: a floating glass panel inset 8 px with 20 px corners, rows 34 px with 8 px corners, 14 px text                                  |
| Web gutters                          | 25 px below 1000 px, 40 px from 1000 px; module gutter 30 px (`--moduleGutter`)                                                                                                                                            |
| tvOS safe area                       | 60 pt top/bottom, 80 pt sides                                                                                                                                                                                              |
| iPhone widths (pt)                   | 375, 390, 393, 402, 420, 430, 440                                                                                                                                                                                          |

## 4. Materials

Source: HIG Materials for the model (Liquid Glass `regular` and `clear`; content materials ultra-thin, thin, regular, thick; vibrancy levels), Apple's web CSS for the values.

| Material    | Light             | Dark           | Backdrop                    | Source                                                         |
| ----------- | ----------------- | -------------- | --------------------------- | -------------------------------------------------------------- |
| ultra-thin  | white .25         | black .30      | `saturate(180%) blur(10px)` | App Store translucent control; TV                              |
| thin        | 246 246 246 / .48 | 40 40 40 / .50 | `saturate(190%) blur(60px)` | Music and TV glass tiles (rendered)                            |
| regular     | 250 250 252 / .80 | 22 22 23 / .80 | `saturate(180%) blur(20px)` | apple.com `--globalnav-background`                             |
| thick       | white .88         | 45 45 45 / .88 | `saturate(180%) blur(60px)` | Music `--playerBackground`                                     |
| glass       | 245 245 247 / .55 | 38 38 40 / .60 | `saturate(2.2) blur(16px)`  | Music floating sidebar (`--glassMaterialBackground`, rendered) |
| glass-clear | white .25         | white .25      | `saturate(180%) blur(10px)` | App Store translucent button over artwork                      |

Glass carries a 1 px inner stroke (`--glassMaterialInnerStrokeCombined`: `rgba(0,0,0,.05)` light, `rgba(255,255,255,.2)` dark) and a `0 10px 40px` shadow (`--glassMaterialShadowColor`: `.1` light, `.2` dark). Fallbacks when backdrop-filter is unavailable or transparency reduced: `--fallbackMaterialBG` `hsla(0,0%,100%,.97)` / `rgba(31,31,31,.97)` for content materials; the increased-contrast glass `#f2f2f2` / `#0e0e0e`. The App Store's hero blurs artwork with `blur(80px) saturate(1.5)` and its legibility layer with `blur(34px) brightness(.95) saturate(1.6) contrast(1.1)`.

## 5. Shape

Source: apps.apple.com tokens `--global-border-radius-xsmall` 5, `-small` 9, `-medium` 12, `-large` 17, `-xlarge` 24, `--pill-button-border-radius` 1000; in use on Music and TV: 6 and 8 (rows, buttons), 10 (dialogs on every property), 14 (TV lockups), 20 (Music's sidebar panel). The ladder: `sm` 5, `md` 8, `lg` 10, `xl` 12, `2xl` 17, `3xl` 20, `4xl` 24. Icons: 25 % (App Store web), 22.37 % (the iOS mask). The bottom-sheet radius (40) is **approx.**: iOS 26 sheets match the display corner and Apple's web has no bottom sheets. Nested corners are concentric: inner = outer − inset.

## 6. Controls

| Control                                   | iOS                                                                          | macOS (Apple's desktop web)                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Button height mini/small/regular/large/xl | 28/32/44/52/64 (HIG Buttons size table)                                      | 24/28/36/40/44 (Music 24 and 28 px buttons, Music's 36 px pill, TV's 40 px pill, apple.com's 44 px CTA; 36 px on a phone)         |
| Button shape                              | capsule; circle when icon-only                                               | capsule (`980px`/`1000px`); 6 px corners on bar items                                                                             |
| Button label                              | 17 semibold                                                                  | apple.com CTA 17 px, padding 11×21; App Store Get 13 px 700, padding 7×16                                                         |
| Switch                                    | 51×31, thumb 27, on = system green (UIKit)                                   | 38×22, thumb 20 **approx.** (AppKit)                                                                                              |
| Checkbox                                  | 22 pt circle in lists **approx.**                                            | 14 pt square, radius 3.5 (AppKit)                                                                                                 |
| Radio                                     | 22 pt circle                                                                 | 14 pt (AppKit)                                                                                                                    |
| Slider                                    | track 4, thumb 28 (UIKit)                                                    | track 5, thumb 13 (TV player, `--progress-track-height`, `--progress-thumb-height`)                                               |
| Stepper                                   | 94×32, radius 8 (UIKit)                                                      | **approx.** (AppKit)                                                                                                              |
| Segmented control                         | height 32, inset 2, capsule (iOS 26)                                         | height 32 (TV `--selectHeight`), selected shadow `0 3px 8px .12, 0 3px 1px .04` (App Store `--segmentedControlSelectedShadow1/2`) |
| Text field                                | list row 44; standalone 36, radius 10                                        | 32 px, radius 4, 1 px `rgba(0,0,0,.15)` border, 12 px text (App Store search field)                                               |
| Search field                              | 36, capsule                                                                  | 32 px (App Store), 28 px (TV)                                                                                                     |
| Inset grouped list                        | inset 16/20, radius 24 (web xlarge), row ≥ 44, padding 11×16, icon tile 30   | sidebar rows 34 px, 8 px corners, 3 px padding (Music)                                                                            |
| Sheet                                     | radius 40 **approx.**, grabber 36×5, scrim .45 (`--modalScrimColor`)         | dialog: 10 px corners, App Store content modal 691 px, scrim `rgba(0,0,0,.45)`                                                    |
| Alert                                     | width 270, radius 24, buttons 44, thick material, text left-aligned (iOS 26) | width 260 **approx.** (AppKit), 10 px corners                                                                                     |
| Action sheet                              | rows 56, radius 24, cancel group 8 pt below                                  | popover                                                                                                                           |
| Menu                                      | width 250, item 44, radius 24, glyphs leading (iOS 26)                       | TV popover menus: 44 px rows, 200 px max, context menu min 185 px; border `rgba(0,0,0,.15)` / white `.1`; destructive `#ff3b30`   |
| Popover                                   | radius 24, arrow 13×6.5                                                      | radius 12                                                                                                                         |
| Progress bar                              | height 4, radius 2                                                           | height 4                                                                                                                          |
| Activity indicator                        | 20 / 37 (UIKit medium/large)                                                 | 16 / 32                                                                                                                           |
| Badge                                     | height 18, min width 18, system red                                          | —                                                                                                                                 |
| Page control                              | dots 7, gap 9 (UIKit)                                                        | —                                                                                                                                 |
| Split view                                | sidebar 320, content 375                                                     | sidebar 260 (App Store), content 320                                                                                              |

## 7. Motion

Source: Apple's web CSS. The HIG publishes no durations.

| Token            | Value                           | Source                                               |
| ---------------- | ------------------------------- | ---------------------------------------------------- |
| ease-standard    | `cubic-bezier(.04,.04,.12,.96)` | App Store, Music, TV reveals                         |
| ease-nav         | `cubic-bezier(.4,0,.6,1)`       | apple.com global nav (78 uses)                       |
| ease-transform   | `cubic-bezier(.25,.1,.3,1)`     | apple.com transforms                                 |
| ease-sheet       | `cubic-bezier(.52,.16,.24,1)`   | App Store mobile nav sheet, `.56s`                   |
| ease-menu        | `cubic-bezier(.215,.61,.355,1)` | Music menus and popovers, `.3s`                      |
| duration-press   | 100 ms                          | `.1s ease-in` hover/press in (Music ×123, App Store) |
| duration-hover   | 210 ms                          | `.21s ease-out` hover out (App Store ×27)            |
| duration-overlay | 300 ms                          | Music `.3s`, TV `.3s cubic-bezier(0,0,.2,1)`         |
| duration-nav     | 240 ms                          | apple.com `.24s` (and `.32s` for flyouts)            |
| duration-sheet   | 560 ms                          | App Store nav sheet `.56s`                           |

SwiftUI springs (`.smooth` bounce 0, `.snappy` 0.15, `.bouncy` 0.3, all 0.5 s) are rendered as `linear()` easings. Reduce Motion: keep fades, drop transforms, never animate blur.

## 8. Elevation

| Token                    | Value                                                                                                       | Source                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| thumb                    | `0 3px 8px rgb(0 0 0 / .15), 0 3px 1px rgb(0 0 0 / .06)`                                                    | UIKit switch/slider thumb                              |
| segment                  | `0 3px 8px .12, 0 3px 1px .04`                                                                              | UIKit; App Store `--segmentedControlSelectedShadow`    |
| control                  | `inset 0 0 .5px 0 .15, 1px 1px 1px 0 .1`                                                                    | TV `--progress-thumb-box-shadow`                       |
| card-small / card-medium | `0 3px 9px .08` / `0 3px 20px .08`                                                                          | App Store `--shadow-small`, `--shadow-medium`          |
| lift                     | `0 1px 1px .01, 0 2px 2px .01, 0 4px 4px .02, 0 8px 8px .03, 0 14px 14px .03`                               | Music artwork and cards                                |
| artwork                  | `0 2px 6px -4px .4`                                                                                         | Music                                                  |
| hero-icon                | `0 0 30px .33`                                                                                              | App Store hero                                         |
| mobile-bar               | `0 1px 2px .1`                                                                                              | App Store fixed mobile bar                             |
| glass                    | `inset 0 0 0 1px rgb(0 0 0 / .05), 0 10px 40px rgb(0 0 0 / .1)` light; stroke white `.2` and drop `.2` dark | Music `--glassMaterial*`                               |
| dialog                   | `inset 0 0 0 1px rgb(255 255 255 / .2), 0 8px 40px rgb(0 0 0 / .25)` light, `.55` dark                      | App Store, Music, TV `--dialogShadowColor`             |
| focus ring               | `0 0 0 4px rgba(keyColor, .6)`                                                                              | App Store, Music (`focus-visible:ring-4 ring-ring/60`) |

## 9. Icons

SF Symbols: nine weights matching the text weights; three scales (small, medium, large) relative to the cap height; rendering modes monochrome, hierarchical, palette, multicolor. The design system maps Hugeicons onto this model: scale small 0.85 em, medium 1 em (rendered at 1.2 em so the glyph's cap height matches the text), large 1.3 em; weights regular / semibold / bold as stroke 1.5 / 2 / 2.5.

## 10. Method for the web measurements

`scripts` in the session scratchpad: the stylesheets linked from each page were downloaded and grepped for `:root` custom properties and for histograms of `border-radius`, `backdrop-filter`, `box-shadow`, `cubic-bezier` and durations; then headless Chromium (Playwright) loaded each page at 1440×900 and 390×844 in light and dark schemes and read computed styles of every visible element — fixed and sticky bars, radii, backdrop filters, shadows, transitions, button heights and font sizes — plus the nav, sidebar, search field and headings. Values above cite the stylesheet token where one exists and "rendered" where they were read from the page.
