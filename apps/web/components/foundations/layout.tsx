import { metrics } from "@apple-ds/ui/tokens/metrics"

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

export function LayoutPage() {
  const ios = metrics.ios
  const mac = metrics.macos
  return (
    <>
      <PageHeader
        title="Layout"
        description="Hit targets, margins and the geometry of every control on iOS and macOS, as CSS variables the components read. Switching the platform swaps the whole table at runtime."
      />
      <Section
        title="Hit targets and margins"
        description="HIG Accessibility and Layout."
      >
        <TokenTable
          columns={["Metric", "iOS", "macOS"]}
          rows={[
            [
              "Hit target, default",
              ios.hitTarget.default,
              mac.hitTarget.default,
            ],
            [
              "Hit target, minimum",
              ios.hitTarget.minimum,
              mac.hitTarget.minimum,
            ],
            [
              "Layout margin",
              `${ios.list.inset} (${ios.list.insetWide} from 414 pt)`,
              mac.list.rowPaddingX,
            ],
            ["Padding around bezelled controls", "~12", "~12"],
            ["Padding around bezel-less controls", "~24", "~24"],
          ]}
        />
      </Section>
      <Section
        title="Controls"
        description="Points. Values marked approximate in the research document are AppKit’s published sizes rounded for macOS 26."
      >
        <TokenTable
          columns={["Control", "iOS", "macOS"]}
          rows={[
            [
              "Button height mini / small / regular / large / xl",
              Object.values(ios.buttonHeight).join(" / "),
              Object.values(mac.buttonHeight).join(" / "),
            ],
            [
              "Switch",
              `${ios.switch.width}×${ios.switch.height}, thumb ${ios.switch.thumb}`,
              `${mac.switch.width}×${mac.switch.height}, thumb ${mac.switch.thumb}`,
            ],
            [
              "Checkbox",
              `${ios.checkbox.size} ${ios.checkbox.shape}`,
              `${mac.checkbox.size} ${mac.checkbox.shape}`,
            ],
            [
              "Radio",
              `${ios.radio.size}, dot ${ios.radio.dot}`,
              `${mac.radio.size}, dot ${mac.radio.dot}`,
            ],
            [
              "Slider track / thumb",
              `${ios.slider.track} / ${ios.slider.thumb}`,
              `${mac.slider.track} / ${mac.slider.thumb}`,
            ],
            [
              "Stepper",
              `${ios.stepper.width}×${ios.stepper.height}, r ${ios.stepper.radius}`,
              `${mac.stepper.width}×${mac.stepper.height}`,
            ],
            [
              "Segmented control",
              `h ${ios.segmented.height}, inset ${ios.segmented.inset}`,
              `h ${mac.segmented.height}, inset ${mac.segmented.inset}`,
            ],
            [
              "Text field",
              `h ${ios.textField.height}, r ${ios.textField.radius}`,
              `h ${mac.textField.height}, r ${mac.textField.radius}`,
            ],
            [
              "Search field",
              `h ${ios.searchField.height}`,
              `h ${mac.searchField.height}`,
            ],
            [
              "List row",
              `min ${ios.list.rowMinHeight}, pad ${ios.list.rowPaddingY}×${ios.list.rowPaddingX}, r ${ios.list.radius}`,
              `min ${mac.list.rowMinHeight}, pad ${mac.list.rowPaddingY}×${mac.list.rowPaddingX}`,
            ],
            [
              "Navigation bar",
              `${ios.navBar.height} (+${ios.navBar.largeTitle} large title)`,
              `title bar ${mac.navBar.height}`,
            ],
            ["Toolbar", ios.toolbar.height, mac.toolbar.height],
            [
              "Tab bar",
              `h ${ios.tabBar.height}, inset ${ios.tabBar.inset}`,
              "—",
            ],
            [
              "Sheet",
              `r ${ios.sheet.radius}, grabber ${ios.sheet.grabber.join("×")}, scrim ${ios.sheet.scrim}`,
              `r ${mac.sheet.radius}`,
            ],
            [
              "Alert",
              `w ${ios.alert.width}, r ${ios.alert.radius}, buttons ${ios.alert.buttonHeight}`,
              `w ${mac.alert.width}`,
            ],
            [
              "Action sheet",
              `rows ${ios.actionSheet.rowHeight}, cancel gap ${ios.actionSheet.cancelGap}`,
              "popover",
            ],
            [
              "Menu",
              `w ${ios.menu.width}, item ${ios.menu.itemHeight}, r ${ios.menu.radius}`,
              `w ${mac.menu.width}, item ${mac.menu.itemHeight}`,
            ],
            ["Dialog width", ios.dialog.width, mac.dialog.width],
            [
              "Split view sidebar / content",
              `${ios.splitView.sidebar} / ${ios.splitView.content}`,
              `${mac.splitView.sidebar} / ${mac.splitView.content}`,
            ],
            ["Progress bar", ios.progress.height, mac.progress.height],
            [
              "Activity indicator medium / large",
              `${ios.spinner.medium} / ${ios.spinner.large}`,
              `${mac.spinner.medium} / ${mac.spinner.large}`,
            ],
            [
              "Badge",
              `h ${ios.badge.height}, min-w ${ios.badge.minWidth}`,
              "—",
            ],
            [
              "Page control dot / gap",
              `${ios.pageControl.dot} / ${ios.pageControl.gap}`,
              "—",
            ],
          ]}
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
