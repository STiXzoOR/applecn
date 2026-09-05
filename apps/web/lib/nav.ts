import { componentDocs, componentGroups, type ComponentGroup } from '@/registry/index'

export interface NavItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface FoundationPage {
  slug: string
  title: string
  description: string
}

export const foundationPages: FoundationPage[] = [
  { slug: 'color', title: 'Color', description: 'System colours, grays and the semantic roles, in every appearance.' },
  { slug: 'typography', title: 'Typography', description: 'The eleven text styles, Dynamic Type, and the macOS scale.' },
  { slug: 'layout', title: 'Layout', description: 'Margins, hit targets, control metrics and device sizes.' },
  { slug: 'materials', title: 'Materials', description: 'The content-layer materials and Liquid Glass.' },
  { slug: 'shapes', title: 'Shapes', description: 'The radius ladder, concentric corners and the icon mask.' },
  { slug: 'motion', title: 'Motion', description: 'Easings, springs and durations.' },
  { slug: 'icons', title: 'Icons', description: 'Hugeicons with SF Symbols sizing and weights.' },
  { slug: 'platforms', title: 'Platforms', description: 'The iOS and macOS idioms and the switch between them.' },
]

const groupTitles: Record<ComponentGroup, string> = {
  foundation: 'Primitives',
  controls: 'Controls',
  forms: 'Form controls',
  overlays: 'Overlays',
  navigation: 'Navigation',
  content: 'Content',
}

export const docsNav: NavGroup[] = [
  {
    title: 'Foundations',
    items: foundationPages.map((p) => ({ title: p.title, href: `/foundations/${p.slug}` })),
  },
  ...componentGroups.map((group) => ({
    title: groupTitles[group],
    items: componentDocs
      .filter((d) => d.group === group)
      .map((d) => ({ title: d.title, href: `/components/${d.name}` })),
  })),
]
