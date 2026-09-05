import { Glass } from "@applecn/ui/components/glass"
import { Material } from "@applecn/ui/components/material"
import { Text } from "@applecn/ui/components/text"
import { css } from "@applecn/ui/tokens/colors"
import { materials } from "@applecn/ui/tokens/materials"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

export function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="Materials"
        description="Content-layer materials from ultra-thin to thick, and Liquid Glass for the functional layer. The web values are approximations of Apple’s private effect parameters; Reduce Transparency collapses every one to an opaque surface."
      />
      <Section
        title="Content layer"
        description="Thicker materials give text more contrast; thinner ones keep the background present."
      >
        <div className="grid grid-cols-2 gap-4 rounded-4xl bg-[linear-gradient(135deg,var(--system-pink),var(--system-yellow),var(--system-mint))] p-4 sm:grid-cols-4">
          {(["ultra-thin", "thin", "regular", "thick"] as const).map((t) => (
            <Material
              key={t}
              thickness={t}
              className="flex h-28 flex-col items-center justify-center gap-1 rounded-3xl"
            >
              <Text variant="headline">{t}</Text>
              <Text variant="caption-1" color="label-2">
                Secondary label
              </Text>
            </Material>
          ))}
        </div>
      </Section>
      <Section
        title="Liquid Glass"
        description="Regular keeps text legible over anything; clear shows a rich background and expects a dimming layer over bright content; prominent is the one tinted action."
      >
        <div className="flex flex-wrap items-center gap-4 rounded-4xl bg-[url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=60')] bg-cover bg-center p-8">
          <Glass className="px-5 py-3">
            <Text emphasized color="inherit">
              Regular
            </Text>
          </Glass>
          <Glass variant="clear" className="px-5 py-3 text-white">
            <Text emphasized color="inherit">
              Clear
            </Text>
          </Glass>
          <Glass variant="prominent" className="px-5 py-3">
            <Text emphasized color="inherit">
              Prominent
            </Text>
          </Glass>
        </div>
      </Section>
      <Section
        title="Values"
        description="Background tint per appearance, backdrop blur radius and saturation."
      >
        <TokenTable
          columns={["Material", "Light", "Dark", "Blur", "Saturate"]}
          rows={Object.entries(materials).map(([n, m]) => [
            n,
            css(m.light),
            css(m.dark),
            `${m.blur}px`,
            `${m.saturate}`,
          ])}
        />
      </Section>
    </>
  )
}
