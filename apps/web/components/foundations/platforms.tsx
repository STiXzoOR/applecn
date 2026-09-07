import { Button } from "@applecn/ui/components/button"
import { Checkbox } from "@applecn/ui/components/checkbox"
import { Input } from "@applecn/ui/components/input"
import { Label } from "@applecn/ui/components/label"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@applecn/ui/components/segmented-control"
import { Slider } from "@applecn/ui/components/slider"
import { Switch } from "@applecn/ui/components/switch"
import { Text } from "@applecn/ui/components/text"
import { PlatformProvider, type Platform } from "@applecn/ui/lib/platform"

import { PlatformSwitch } from "@/components/appearance-controls"
import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

function Sample() {
  return (
    <div className="flex flex-col gap-4 rounded-card bg-card p-4">
      <Text variant="large-title" emphasized>
        Large Title
      </Text>
      <Text>Body text at the platform’s default size.</Text>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Continue</Button>
        <Button variant="gray">Cancel</Button>
        <Switch aria-label="Wi-Fi" defaultChecked />
        <Label>
          <Checkbox defaultChecked /> Remember
        </Label>
      </div>
      <SegmentedControl aria-label="View" defaultValue="list">
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      </SegmentedControl>
      <Slider aria-label="Volume" defaultValue={60} />
      <Input
        aria-label="Name"
        placeholder="Name"
        variant="bordered"
        className="max-w-xs"
      />
    </div>
  )
}

const idioms: { platform: Platform; title: string; description: string }[] = [
  {
    platform: "ios",
    title: "iOS 26",
    description:
      "Liquid Glass. Capsule buttons, the 63 × 28 switch with its oval knob, 26 pt grouped lists, 34 pt alerts, floating glass bars.",
  },
  {
    platform: "macos",
    title: "macOS 26",
    description:
      "Tahoe. 24 pt controls with 6 pt corners (capsules from the large size), 16 pt checkboxes, 13 pt body, AppKit’s 85 % label.",
  },
  {
    platform: "web",
    title: "Web",
    description:
      "apple.com and Apple’s web apps. 980 px pill buttons, 17/25 body with SF Pro tracking, #1d1d1f on white, #0071e3 buttons, #06c links.",
  },
]

export function PlatformsPage() {
  return (
    <>
      <PageHeader
        title="Platforms"
        description="Three idioms from one stylesheet. iOS 26 is the default; wrapping any subtree in a PlatformProvider — or flipping the switch in the toolbar — sets data-platform, and tokens.css swaps the colours, type scale, corners and every control metric at runtime. Components change structure only where Apple’s do."
      >
        <PlatformSwitch className="w-64" />
      </PageHeader>
      <Section
        title="Side by side"
        description="The same components under each platform."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {idioms.map((idiom) => (
            <div key={idiom.platform} className="flex flex-col gap-2">
              <Text variant="headline">{idiom.title}</Text>
              <Text variant="footnote" color="label-2">
                {idiom.description}
              </Text>
              <PlatformProvider platform={idiom.platform}>
                <Sample />
              </PlatformProvider>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="What changes"
        description="Everything below is CSS. The platform is stamped on the document root so portaled overlays inherit it too."
      >
        <TokenTable
          columns={["", "iOS 26", "macOS 26", "Web"]}
          rows={[
            ["Body text", "17/22", "13/16", "17/25, −0.022em"],
            ["Regular button", "34, capsule", "24, r 6", "36, pill"],
            ["Switch", "63 × 28, oval knob", "54 × 24, oval knob", "51 × 31"],
            ["Checkbox", "22 circle", "16 square r 4", "16 square r 4"],
            ["List row / corner", "52 / 26", "28 / 10", "44 / 12"],
            ["Alert", "320, r 34, capsule actions", "260, r 16", "320, r 12"],
            ["Label colour", "black", "black 85 %", "#1d1d1f"],
            ["Tint", "system blue", "accent #007aff", "#0071e3"],
          ]}
        />
      </Section>
      <Section
        title="Picking a platform"
        description="Set it explicitly, or let detectPlatform() read the visitor’s device: iOS and iPadOS get ios, macOS gets macos, everything else web."
      >
        <pre className="overflow-x-auto rounded-card bg-card p-4 font-mono type-footnote text-label">
          {`import { PlatformProvider } from "@applecn/ui/lib/platform"
import { detectPlatform } from "@applecn/ui/lib/detect-platform"

<PlatformProvider platform={detectPlatform()}>
  <App />
</PlatformProvider>`}
        </pre>
      </Section>
    </>
  )
}
