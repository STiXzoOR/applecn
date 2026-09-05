import { Button } from "@apple-ds/ui/components/button"
import { Checkbox } from "@apple-ds/ui/components/checkbox"
import { Input } from "@apple-ds/ui/components/input"
import { Label } from "@apple-ds/ui/components/label"
import { Switch } from "@apple-ds/ui/components/switch"
import { Text } from "@apple-ds/ui/components/text"
import { PlatformProvider } from "@apple-ds/ui/lib/platform"

import { PlatformSwitch } from "@/components/appearance-controls"
import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"

function Sample() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-card p-4">
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
      <Input
        aria-label="Name"
        placeholder="Name"
        variant="bordered"
        className="max-w-xs"
      />
    </div>
  )
}

export function PlatformsPage() {
  return (
    <>
      <PageHeader
        title="Platforms"
        description="iOS/iPadOS 26 is the default idiom. Wrapping any subtree in a PlatformProvider — or flipping the switch in the toolbar — sets data-platform, and the stylesheet swaps the type scale and every control metric at runtime; components change structure only where Apple’s do (a circular versus square checkbox)."
      >
        <PlatformSwitch className="w-48" />
      </PageHeader>
      <Section
        title="Side by side"
        description="The same components under each platform."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Text variant="headline">iOS</Text>
            <PlatformProvider platform="ios">
              <Sample />
            </PlatformProvider>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="headline">macOS</Text>
            <PlatformProvider platform="macos">
              <Sample />
            </PlatformProvider>
          </div>
        </div>
      </Section>
      <Section
        title="What changes"
        description="Type sizes (17 → 13 body), control heights (44 → 24 regular), the checkbox shape, list row height (44 → 28), and the sheet, alert, menu and dialog geometry. Colours do not change."
      >
        <Text color="label-2">
          Everything is CSS: the platform is stamped on the document root so
          portaled overlays inherit it too.
        </Text>
      </Section>
    </>
  )
}
