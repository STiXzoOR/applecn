import { Text } from '@apple-ds/ui/components/text'
import { durations, easings, springs } from '@apple-ds/ui/tokens/motion'

import { PageHeader } from '@/components/doc/page-header'
import { Section } from '@/components/doc/section'
import { TokenTable } from '@/components/doc/token-table'
import { MotionDemo } from '@/components/foundations/motion-demo'

export function MotionPage() {
  return (
    <>
      <PageHeader
        title="Motion"
        description="The HIG publishes no durations, so these come from apple.com and App Store CSS and from SwiftUI’s spring presets, rendered as CSS linear() easings. Reduce Motion keeps fades and drops transforms."
      />
      <Section title="Easings and springs" description="Hover or focus a row to play it.">
        <div className="flex flex-col gap-3">
          {Object.entries(easings).map(([name, value]) => (
            <MotionDemo key={name} name={`ease-${name}`} easing={value} duration={durations.overlay} />
          ))}
          {Object.entries(springs).map(([name, value]) => (
            <MotionDemo key={name} name={`ease-spring-${name}`} easing={value} duration={500} />
          ))}
        </div>
      </Section>
      <Section title="Durations">
        <TokenTable columns={['Token', 'Value', 'Use']} rows={[
          ['--duration-press', `${durations.press}ms`, 'Press feedback'],
          ['--duration-hover', `${durations.hover}ms`, 'Hover and toggles'],
          ['--duration-overlay', `${durations.overlay}ms`, 'Menus, popovers, alerts'],
          ['--duration-nav', `${durations.nav}ms`, 'Bars collapsing'],
          ['--duration-sheet', `${durations.sheet}ms`, 'Sheets and drawers'],
        ]} />
      </Section>
      <Section title="Values">
        <TokenTable columns={['Token', 'Value']} rows={[...Object.entries(easings).map(([n, v]) => [`--easing-${n}`, v]), ...Object.entries(springs).map(([n, v]) => [`--spring-${n}`, <Text key={n} variant="caption-2" className="font-mono break-all">{v}</Text>])]} />
      </Section>
    </>
  )
}
