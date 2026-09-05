import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/card'

describe('Card', () => {
  test('is a group box on the grouped card surface', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <CardDescription>12 GB of 64 GB used</CardDescription>
        </CardHeader>
        <CardContent>Bar</CardContent>
        <CardFooter>Manage</CardFooter>
      </Card>,
    )
    const title = screen.getByText('Storage')
    const card = title.closest('[data-slot="card"]')!
    expect(card.className).toContain('rounded-4xl')
    expect(card.className).toContain('bg-card')
    expect(title.className).toContain('type-headline')
    expect(screen.getByText('12 GB of 64 GB used').className).toContain('text-label-2')
    expect(screen.getByText('Bar').closest('[data-slot="card-content"]')).not.toBeNull()
    expect(screen.getByText('Manage').closest('[data-slot="card-footer"]')).not.toBeNull()
  })
})
