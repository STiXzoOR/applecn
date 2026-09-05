import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { foundations } from '@/components/foundations/pages'
import { foundationPages } from '@/lib/nav'

describe('foundation pages', () => {
  test('there is a page component for every foundation entry', () => {
    expect(Object.keys(foundations).sort()).toEqual(foundationPages.map((p) => p.slug).sort())
  })

  test.each(foundationPages.map((p) => [p.slug, p.title] as const))('%s renders its heading', (slug, title) => {
    const Page = foundations[slug]!
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  test('the colour page shows every system colour and the typography page every text style', () => {
    const Color = foundations.color!
    render(<Color />)
    for (const name of ['Red', 'Blue', 'Brown']) expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    const Typography = foundations.typography!
    render(<Typography />)
    for (const name of ['Large Title', 'Body', 'Caption 2']) expect(screen.getAllByText(name).length).toBeGreaterThan(0)
  })
})
