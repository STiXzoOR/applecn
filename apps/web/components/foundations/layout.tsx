import {
  metrics,
  platforms,
  CAPSULE,
  type ControlMetrics,
} from "@applecn/ui/tokens/metrics"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

const devices: [string, string, string][] = [
  ["iPhone 17 Pro Max", "440 × 956", "1320 × 2868 @3x"],
  ["iPhone 17 Pro / 17", "402 × 874", "1206 × 2622 @3x"],
  ["iPhone Air", "420 × 912", "1260 × 2736 @3x"],
  ["iPhone 16", "393 × 852", "1179 × 2556 @3x"],
  ["iPad Pro 13-inch", "1032 × 1376", "2064 × 2752 @2x"],
  ["iPad Pro 11-inch", "834 × 1210", "1668 × 2420 @2x"],
  ["iPad Air 11-inch / iPad", "820 × 1180", "1640 × 2360 @2x"],
  ["iPad mini", "744 × 1133", "1488 × 2266 @2x"],
]

const r = (n: number) => (n >= CAPSULE ? "capsule" : `r ${n}`)

const rows: [string, (m: ControlMetrics) => string | number][] = [
  [
    "Button height mini / small / regular / large / xl",
    (m) => Object.values(m.buttonHeight).join(" / "),
  ],
  [
    "Button shape mini / small / regular / large / xl",
    (m) =>
      Object.values(m.buttonRadius)
        .map((v) => (v >= CAPSULE ? "capsule" : v))
        .join(" / "),
  ],
  ["Button label size", (m) => Object.values(m.buttonFont).join(" / ")],
  [
    "Switch",
    (m) =>
      `${m.switch.width}×${m.switch.height}, knob ${m.switch.thumbWidth}×${m.switch.thumbHeight}, inset ${m.switch.inset}`,
  ],
  [
    "Checkbox",
    (m) => `${m.checkbox.size} ${m.checkbox.shape}, ${r(m.checkbox.radius)}`,
  ],
  ["Radio", (m) => `${m.radio.size}, dot ${m.radio.dot}`],
  [
    "Slider track / thumb",
    (m) => `${m.slider.track} / ${m.slider.thumbWidth}×${m.slider.thumbHeight}`,
  ],
  [
    "Stepper",
    (m) =>
      `${m.stepper.width}×${m.stepper.height}, ${r(m.stepper.radius)}, ${m.stepper.orientation}`,
  ],
  [
    "Segmented control",
    (m) =>
      `h ${m.segmented.height}, inset ${m.segmented.inset}, ${r(m.segmented.radius)}`,
  ],
  ["Text field", (m) => `h ${m.textField.height}, r ${m.textField.radius}`],
  [
    "Search field",
    (m) => `h ${m.searchField.height}, ${r(m.searchField.radius)}`,
  ],
  [
    "List row",
    (m) =>
      `min ${m.list.rowMinHeight}, pad ${m.list.rowPaddingY}×${m.list.rowPaddingX}, r ${m.list.radius}, inset ${m.list.inset}`,
  ],
  [
    "List header / footer text",
    (m) => `${m.list.headerFont} / ${m.list.footerFont}`,
  ],
  [
    "Sidebar",
    (m) =>
      `w ${m.sidebar.width}, rows ${m.sidebar.rowHeight}, r ${m.sidebar.radius}`,
  ],
  ["Card corner", (m) => m.card.radius],
  [
    "Navigation bar",
    (m) =>
      m.navBar.largeTitle
        ? `${m.navBar.height} (+${m.navBar.largeTitle} large title), items ${m.navBar.item}`
        : `${m.navBar.height}, items ${m.navBar.item}`,
  ],
  [
    "Toolbar",
    (m) =>
      `${m.toolbar.height}, items ${m.toolbar.item}, inset ${m.toolbar.inset}`,
  ],
  [
    "Tab bar",
    (m) =>
      m.tabBar.height
        ? `h ${m.tabBar.height}, inset ${m.tabBar.inset}, items ${m.tabBar.item}, labels ${m.tabBar.label}`
        : "—",
  ],
  [
    "Sheet",
    (m) =>
      m.sheet.grabber[0]
        ? `r ${m.sheet.radius}, grabber ${m.sheet.grabber.join("×")}, scrim ${m.sheet.scrim}`
        : `r ${m.sheet.radius}, scrim ${m.sheet.scrim}`,
  ],
  [
    "Alert",
    (m) =>
      `w ${m.alert.width}, r ${m.alert.radius}, buttons ${m.alert.buttonHeight}, inset ${m.alert.buttonInset}, gap ${m.alert.buttonGap}`,
  ],
  [
    "Action sheet",
    (m) =>
      `w ${m.actionSheet.width}, rows ${m.actionSheet.rowHeight}, r ${m.actionSheet.radius}`,
  ],
  [
    "Menu",
    (m) =>
      `w ${m.menu.width}, items ${m.menu.itemHeight}, r ${m.menu.radius}, item r ${m.menu.itemRadius}`,
  ],
  ["Popover corner", (m) => m.popover.radius],
  ["Dialog", (m) => `w ${m.dialog.width}, r ${m.dialog.radius}`],
  [
    "Split view sidebar / content",
    (m) => `${m.splitView.sidebar} / ${m.splitView.content}`,
  ],
  ["Progress bar", (m) => m.progress.height],
  [
    "Activity indicator medium / large",
    (m) => `${m.spinner.medium} / ${m.spinner.large}`,
  ],
  ["Badge", (m) => `h ${m.badge.height}, min-w ${m.badge.minWidth}`],
  [
    "Page control dot / gap",
    (m) => `${m.pageControl.dot} / ${m.pageControl.gap}`,
  ],
  [
    "Window",
    (m) =>
      m.window
        ? `title bar ${m.window.titleBar}, r ${m.window.radius}, traffic lights ${m.window.trafficLight}`
        : "—",
  ],
]

const titles = { ios: "iOS 26", macos: "macOS 26", web: "Web" } as const

export function LayoutPage() {
  return (
    <>
      <PageHeader
        title="Layout"
        description="Hit targets, margins and the geometry of every control on iOS 26, macOS 26 and Apple’s web, as CSS variables the components read. Switching the platform swaps the whole table at runtime. iOS and macOS values were read from UIKit and AppKit on 2026-09-06; web values from apple.com and Apple’s web apps."
      />
      <Section
        title="Hit targets and margins"
        description="HIG Accessibility and Layout."
      >
        <TokenTable
          columns={["Metric", ...platforms.map((p) => titles[p])]}
          rows={[
            [
              "Hit target, default",
              ...platforms.map((p) => metrics[p].hitTarget.default),
            ],
            [
              "Hit target, minimum",
              ...platforms.map((p) => metrics[p].hitTarget.minimum),
            ],
            [
              "Layout margin",
              `${metrics.ios.list.inset} (${metrics.ios.list.insetWide} from 414 pt)`,
              metrics.macos.list.rowPaddingX,
              "25 (40 from 1000 px)",
            ],
            ["Padding around bezelled controls", "~12", "~12", "~12"],
            ["Padding around bezel-less controls", "~24", "~24", "~24"],
          ]}
        />
      </Section>
      <Section
        title="Controls"
        description="Points. Rows the research document marks approximate have no Apple source yet."
      >
        <TokenTable
          columns={["Control", ...platforms.map((p) => titles[p])]}
          rows={rows.map(([label, read]) => [
            label,
            ...platforms.map((p) => read(metrics[p])),
          ])}
        />
      </Section>
      <Section
        title="Devices"
        description="Screen sizes in points and pixels (HIG Layout › Specifications)."
      >
        <TokenTable columns={["Device", "Points", "Pixels"]} rows={devices} />
      </Section>
    </>
  )
}
