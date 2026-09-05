import { Text } from "@applecn/ui/components/text"
import { radii } from "@applecn/ui/tokens/radii"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

export function ShapesPage() {
  return (
    <>
      <PageHeader
        title="Shapes"
        description="shadcn’s Luma radius derivation from a 10 px base lands exactly on Apple’s ladder — 6, 8, 10, 14, 18, 22, 26 — plus the sheet radius, the app-icon mask and the capsule. Nested corners are concentric: inner = outer − inset."
      />
      <Section title="Radius ladder">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {Object.entries(radii.ladder).map(([step, px]) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className="size-16 bg-primary"
                style={{ borderRadius: px }}
                aria-hidden="true"
              />
              <Text variant="caption-1">rounded-{step}</Text>
              <Text variant="caption-2" color="label-2">
                {px}px
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
            <Text variant="caption-1">rounded-sheet · {radii.sheet}px</Text>
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
        description="A 26 pt card with 8 pt padding holds an 18 pt child; the child’s corner is the parent’s minus the inset."
      >
        <div className="w-64 rounded-4xl bg-fill-2 p-2">
          <div className="h-24 rounded-2xl bg-card" aria-hidden="true" />
        </div>
      </Section>
      <Section title="Values">
        <TokenTable
          columns={["Token", "Value"]}
          rows={[
            ["--radius", `${radii.base}px`],
            ...Object.entries(radii.ladder).map(([s, v]) => [
              `--radius-${s}`,
              `${v}px`,
            ]),
            ["--radius-sheet", `${radii.sheet}px`],
            ["--radius-icon", radii.icon],
          ]}
        />
      </Section>
    </>
  )
}
