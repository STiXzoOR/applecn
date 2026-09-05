import { Text } from "@applecn/ui/components/text"
import {
  dynamicType,
  fontFamilies,
  iosTextStyles,
  macosTextStyles,
  platformSizes,
  textStyleNames,
  tracking,
} from "@applecn/ui/tokens/typography"

import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { TokenTable } from "@/components/doc/token-table"

const label = (name: string) =>
  name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

export function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        description="San Francisco through the system font stack, the eleven text styles at every Dynamic Type size, and the macOS scale. Sizes are authored in a pt unit that follows the reader’s text size on iOS."
      />
      <Section
        title="Font stacks"
        description="SF Pro is never named or self-hosted; the stack resolves to it on Apple devices and the variable font applies its own optical sizes, so tracking stays 0."
      >
        <TokenTable
          columns={["Role", "Stack"]}
          rows={[
            ["sans", fontFamilies.sans],
            ["rounded", fontFamilies.rounded],
            ["mono", fontFamilies.mono],
          ]}
        />
      </Section>
      <Section
        title="iOS text styles"
        description="At the Large (default) size. Each line is rendered with the style it names."
      >
        <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
          {iosTextStyles.map((s) => (
            <div
              key={s.name}
              className="grid grid-cols-[7rem_1fr_auto] items-baseline gap-4"
            >
              <Text variant="caption-1" color="label-3">
                {label(s.name)}
              </Text>
              <Text variant={s.name}>{label(s.name)}</Text>
              <Text
                variant="caption-1"
                color="label-2"
                className="tabular-nums"
              >
                {s.size}/{s.leading} · {s.weight} · emphasized {s.emphasized}
              </Text>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="macOS text styles"
        description="Applied under the macOS platform: 13 pt body, 26 pt large title."
      >
        <TokenTable
          columns={["Style", "Size", "Leading", "Weight", "Emphasized"]}
          rows={macosTextStyles.map((s) => [
            label(s.name),
            s.size,
            s.leading,
            s.weight,
            s.emphasized,
          ])}
        />
      </Section>
      <Section
        title="Dynamic Type"
        description="Size/leading for every category from xSmall to AX5 (HIG Typography › Specifications)."
      >
        <TokenTable
          columns={["Category", ...textStyleNames.map(label)]}
          rows={Object.entries(dynamicType).map(([category, styles]) => [
            category,
            ...styles.map((s) => `${s.size}/${s.leading}`),
          ])}
        />
      </Section>
      <Section
        title="Defaults and minimums"
        description="Default and minimum point sizes per platform; text must enlarge to at least 200 %."
      >
        <TokenTable
          columns={["Platform", "Default", "Minimum"]}
          rows={Object.entries(platformSizes).map(([p, v]) => [
            p,
            v.default,
            v.minimum,
          ])}
        />
      </Section>
      <Section
        title="Tracking"
        description="SF Pro tracking in 1/1000 em, for static font files and mockups only."
      >
        <TokenTable
          columns={["Size", "Tracking"]}
          rows={tracking.map((t) => [t.size, t.tracking])}
        />
      </Section>
    </>
  )
}
