import { Text } from "@apple-ds/ui/components/text"
import { contrastRatio } from "@apple-ds/ui/lib/contrast"
import {
  backgrounds,
  css,
  fills,
  grays,
  groupedBackgrounds,
  labels,
  link,
  separators,
  systemColors,
  white,
} from "@apple-ds/ui/tokens/colors"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { Swatch } from "@/components/doc/swatch"
import { TokenTable } from "@/components/doc/token-table"

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const mapping: [string, string][] = [
  ["background", "background-1 (systemBackground)"],
  ["foreground", "label"],
  ["card", "grouped-background-2 (secondarySystemGroupedBackground)"],
  ["popover", "background-1, background-2 in dark (elevated)"],
  ["primary", "system-blue"],
  ["secondary", "fill-3 (tertiarySystemFill)"],
  ["muted", "background-2"],
  ["muted-foreground", "label-2 (secondaryLabel)"],
  ["accent", "fill-4 (quaternarySystemFill)"],
  ["destructive", "system-red"],
  ["border", "separator"],
  ["input", "fill-3"],
  ["ring", "system-blue"],
]

export function ColorPage() {
  const blue = systemColors.find((c) => c.name === "blue")!
  return (
    <>
      <PageHeader
        title="Color"
        description="The twelve system colours in their default and accessible variants for light and dark, the six-step gray ladder, and the semantic roles UIKit exposes. Every value is Apple’s published sRGB number."
      />
      <Section
        title="System colours"
        description="Default light, default dark, accessible light, accessible dark. The accessible values apply under Increase Contrast."
      >
        <div className="flex flex-col gap-6">
          {systemColors.map((c) => (
            <div key={c.name} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Text variant="headline" className="sm:self-center">
                {titleCase(c.name)}
              </Text>
              <Swatch name="Light" value={css(c.light)} />
              <Swatch name="Dark" value={css(c.dark)} />
              <Swatch name="Accessible light" value={css(c.lightAccessible)} />
              <Swatch name="Accessible dark" value={css(c.darkAccessible)} />
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Grays"
        description="systemGray through systemGray6. In dark mode the ladder inverts: gray-6 is the darkest surface."
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {grays.map((g) => (
            <Swatch
              key={g.name}
              name={`${g.name} · light`}
              value={css(g.light)}
            />
          ))}
          {grays.map((g) => (
            <Swatch
              key={`${g.name}-dark`}
              name={`${g.name} · dark`}
              value={css(g.dark)}
            />
          ))}
        </div>
      </Section>
      <Section
        title="Semantic roles"
        description="Labels, fills, backgrounds and separators. Backgrounds have an elevated dark set one step lighter for sheets and popovers."
      >
        <TokenTable
          columns={["Role", "Light", "Dark", "Dark elevated"]}
          rows={[
            ...Object.entries(labels).map(([n, v]) => [
              n,
              css(v.light),
              css(v.dark),
              "",
            ]),
            ...Object.entries(fills).map(([n, v]) => [
              n,
              css(v.light),
              css(v.dark),
              "",
            ]),
            ...Object.entries(backgrounds).map(([n, v]) => [
              n,
              css(v.light),
              css(v.dark),
              css(v.darkElevated),
            ]),
            ...Object.entries(groupedBackgrounds).map(([n, v]) => [
              n,
              css(v.light),
              css(v.dark),
              css(v.darkElevated),
            ]),
            ...Object.entries(separators).map(([n, v]) => [
              n,
              css(v.light),
              css(v.dark),
              "",
            ]),
            ["link", css(link.light), css(link.dark), ""],
          ]}
        />
      </Section>
      <Section
        title="shadcn vocabulary"
        description="Components use shadcn’s token names; each is an alias of an Apple role, so the registry’s style item is enough for any shadcn project."
      >
        <TokenTable columns={["shadcn token", "Apple role"]} rows={mapping} />
      </Section>
      <Section
        title="Contrast"
        description="Apple’s rule: 4.5:1 up to 17 pt, 3:1 from 18 pt or bold. Apple’s own secondary label and white-on-blue pass only the large-text rule."
      >
        <TokenTable
          columns={["Pair", "Ratio", "Meets"]}
          rows={[
            [
              "label on background (light)",
              contrastRatio(
                labels.label.light,
                backgrounds.background.light.rgb
              ).toFixed(2),
              "4.5:1",
            ],
            [
              "label-2 on background (light)",
              contrastRatio(
                labels["label-2"].light,
                backgrounds.background.light.rgb
              ).toFixed(2),
              "3:1",
            ],
            [
              "label-2 on background (dark)",
              contrastRatio(
                labels["label-2"].dark,
                backgrounds.background.dark.rgb
              ).toFixed(2),
              "4.5:1",
            ],
            [
              "white on system-blue (light)",
              contrastRatio(white, blue.light.rgb).toFixed(2),
              "3:1",
            ],
            [
              "white on system-blue (accessible)",
              contrastRatio(white, blue.lightAccessible.rgb).toFixed(2),
              "4.5:1",
            ],
          ]}
        />
      </Section>
    </>
  )
}
