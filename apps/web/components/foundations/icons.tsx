import {
  Clock01Icon,
  Camera01Icon,
  Home01Icon,
  Mail01Icon,
  Search01Icon,
  Settings01Icon,
  Share01Icon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons"

import { Icon, strokeWidths } from "@applecn/ui/components/icon"
import { Text } from "@applecn/ui/components/text"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

const sample = [
  ["house", Home01Icon],
  ["magnifyingglass", Search01Icon],
  ["gear", Settings01Icon],
  ["envelope", Mail01Icon],
  ["square.and.arrow.up", Share01Icon],
  ["wifi", Wifi01Icon],
  ["camera", Camera01Icon],
  ["clock", Clock01Icon],
] as const

export function IconsPage() {
  return (
    <>
      <PageHeader
        title="Icons"
        description="SF Symbols cannot ship on the web, so Hugeicons stands in with the same model: three scales relative to the text’s cap height and weights that follow the text weight through the stroke width."
      />
      <Section
        title="Scales"
        description="small 0.85 em, medium 1.2 em (a glyph’s cap height matches a 1 em cap), large 1.5 em."
      >
        <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
          {(["small", "medium", "large"] as const).map((scale) => (
            <Text
              key={scale}
              variant="body"
              className="flex items-center gap-2"
            >
              <Icon icon={Wifi01Icon} scale={scale} /> Wi-Fi{" "}
              <Text as="span" variant="caption-1" color="label-3">
                {scale}
              </Text>
            </Text>
          ))}
        </div>
      </Section>
      <Section
        title="Weights"
        description="Regular, semibold and bold map to stroke widths."
      >
        <TokenTable
          columns={["Weight", "Stroke width"]}
          rows={Object.entries(strokeWidths).map(([w, s]) => [w, s])}
        />
      </Section>
      <Section
        title="SF Symbol equivalents"
        description="A few common symbols and the Hugeicons glyph the components use for them."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sample.map(([symbol, icon]) => (
            <div
              key={symbol}
              className="flex items-center gap-3 rounded-3xl bg-card px-4 py-3"
            >
              <Icon icon={icon} scale="large" className="text-primary" />
              <Text variant="footnote" className="font-mono">
                {symbol}
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
