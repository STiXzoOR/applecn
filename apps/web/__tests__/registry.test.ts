import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { componentDocs } from '@/registry/index'
import { buildRegistry } from '@/scripts/registry-data'

const registry = buildRegistry()

describe('registry', () => {
  test('has a registry:ui item per component, each pointing at the package source', () => {
    const ui = registry.items.filter((i) => i.type === 'registry:ui')
    expect(ui.map((i) => i.name).sort()).toEqual(componentDocs.map((d) => d.name).sort())
    for (const item of ui) {
      for (const file of item.files) {
        expect(existsSync(join(process.cwd(), file.path)), `${item.name}: ${file.path}`).toBe(true)
      }
    }
  })

  test('local imports become registry dependencies and packages become dependencies', () => {
    const tabs = registry.items.find((i) => i.name === 'tabs')!
    expect(tabs.registryDependencies).toContain('segmented-control')
    expect(tabs.dependencies).toContain('@base-ui/react')
    const icon = registry.items.find((i) => i.name === 'icon')!
    expect(icon.dependencies).toEqual(expect.arrayContaining(['@hugeicons/react', 'class-variance-authority', 'cn']))
  })

  test('ships the theme as a style item with light and dark variables plus the type and material utilities', () => {
    const style = registry.items.find((i) => i.type === 'registry:style')!
    expect(style.name).toBe('apple')
    expect(style.cssVars?.light?.['system-blue']).toBe('rgb(0 136 255)')
    expect(style.cssVars?.dark?.['system-blue']).toBe('rgb(0 145 255)')
    expect(style.cssVars?.light?.primary).toBe('var(--system-blue)')
    expect(Object.keys(style.css ?? {})).toEqual(expect.arrayContaining(['@utility type-body', '@utility glass']))
  })

  test('ships the hooks and lib modules', () => {
    expect(registry.items.filter((i) => i.type === 'registry:hook').map((i) => i.name).sort()).toEqual(['use-media-query', 'use-scroll-collapse'])
    expect(registry.items.filter((i) => i.type === 'registry:lib').map((i) => i.name).sort()).toEqual(['contrast', 'platform', 'utils'])
  })

  test('the committed registry.json is the generator output', () => {
    const committed = JSON.parse(readFileSync(join(process.cwd(), 'registry.json'), 'utf8'))
    expect(committed).toEqual(registry)
  })
})
