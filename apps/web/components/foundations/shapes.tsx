import { Text } from "@applecn/ui/components/text"
import { platforms } from "@applecn/ui/tokens/metrics"
import { radii, type RadiusStep } from "@applecn/ui/tokens/radii"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

const platformTitles = { ios: "iOS 26", macos: "macOS 26", web: "Web" } as const

const steps = Object.keys(radii.ios.ladder) as RadiusStep[]

export function ShapesPage() {
  return (
    <>
      <PageHeader
        title="Shapes"
        description="Corners follow the platform. iOS 26 runs from 5 pt fields to 26 pt grouped lists and 34 pt alerts; macOS 26 keeps controls at 4–6 pt and windows at 16; Apple’s web uses the App Store’s 5–24 ladder. rounded-sm … rounded-4xl always mean the current platform’s ladder, and the semantic radii (rounded-card, rounded-menu, rounded-alert …) each control’s measured corner. Nested corners are concentric: inner = outer − inset."
      />
      <Section
        title="Radius ladder"
        description="Rendered with the current platform’s values; switch the platform in the toolbar to see the ladder change."
      >
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {steps.map((step) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={`size-16 bg-primary rounded-${step}`}
                aria-hidden="true"
              />
              <Text variant="caption-1">rounded-{step}</Text>
              <Text variant="caption-2" color="label-2">
                {platforms.map((p) => radii[p].ladder[step]).join(" · ")}
              </Text>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Sheet, icon, capsule">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-24 w-40 rounded-t-sheet bg-fill-2"
              aria-hidden="true"
            />
            <Text variant="caption-1">
              rounded-sheet · {platforms.map((p) => radii[p].sheet).join(" · ")}
            </Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="size-24 rounded-icon bg-[linear-gradient(160deg,var(--system-blue),var(--system-indigo))]"
              aria-hidden="true"
            />
            <Text variant="caption-1">rounded-icon · {radii.icon}</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-11 w-32 rounded-full bg-fill-2"
              aria-hidden="true"
            />
            <Text variant="caption-1">rounded-full · capsule</Text>
          </div>
        </div>
      </Section>
      <Section
        title="Concentric corners"
        description="A card with 8 pt padding holds a child whose corner is the parent’s minus the inset — the rule every iOS 26 sheet, toolbar and button follows."
      >
        <div className="w-64 rounded-card bg-fill-2 p-2">
          <div
            className="h-24 rounded-[calc(var(--radius-card)-0.5rem)] bg-card"
            aria-hidden="true"
          />
        </div>
      </Section>
      <Section
        title="Values"
        description="Points per platform. Sources: UIKit and AppKit view trees (§11), the App Store’s tokens (§5, §12)."
      >
        <TokenTable
          columns={["Token", ...platforms.map((p) => platformTitles[p])]}
          rows={[
            ...steps.map((s) => [
              `--radius-${s}`,
              ...platforms.map((p) => `${radii[p].ladder[s]}px`),
            ]),
            ["--radius-sheet", ...platforms.map((p) => `${radii[p].sheet}px`)],
            ["--radius-icon", radii.icon, radii.icon, radii.icon],
            [
              "--radius",
              `${radii.base}px`,
              `${radii.base}px`,
              `${radii.base}px`,
            ],
          ]}
        />
      </Section>
    </>
  )
}
