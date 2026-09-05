import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { docsNav, foundationPages } from '@/lib/nav'
import { examples } from '@/registry/examples.generated'
import { componentDocs } from '@/registry/index'

const uiComponents = readdirSync(join(process.cwd(), '../../packages/ui/src/components'))
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''))

describe('component documentation', () => {
  test('every component in the package is documented, and every doc points at a real component', () => {
    const documented = componentDocs.map((d) => d.name).sort()
    expect(documented).toEqual([...uiComponents].sort())
  })

  test('every doc has a title, a one-sentence description, an Apple counterpart and at least one example', () => {
    for (const doc of componentDocs) {
      expect(doc.title, doc.name).not.toBe('')
      expect(doc.description, doc.name).toMatch(/\.$/)
      expect(doc.apple.name, doc.name).not.toBe('')
      expect(doc.examples.length, doc.name).toBeGreaterThan(0)
    }
  })

  test('every example has a file and an entry in the generated map, and the map has nothing extra', () => {
    const expected = componentDocs.flatMap((d) => d.examples.map((e) => `${d.name}/${e.name}`)).sort()
    for (const key of expected) {
      expect(existsSync(join(process.cwd(), 'registry/examples', `${key}.tsx`)), key).toBe(true)
    }
    expect(Object.keys(examples).sort()).toEqual(expected)
  })
})

describe('navigation', () => {
  test('lists every foundation page and every component, grouped', () => {
    const hrefs = docsNav.flatMap((g) => g.items.map((i) => i.href))
    for (const page of foundationPages) expect(hrefs).toContain(`/foundations/${page.slug}`)
    for (const doc of componentDocs) expect(hrefs).toContain(`/components/${doc.name}`)
    expect(docsNav[0]?.title).toBe('Foundations')
  })
})
