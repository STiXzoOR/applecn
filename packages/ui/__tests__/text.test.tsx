import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Text, textVariants } from '../src/components/text'

describe('Text', () => {
  test('renders a paragraph in the body variant with the primary label colour by default', () => {
    render(<Text>Hello</Text>)
    const el = screen.getByText('Hello')
    expect(el.tagName).toBe('P')
    expect(el).toHaveAttribute('data-slot', 'text')
    expect(el).toHaveAttribute('data-variant', 'body')
    expect(el.className).toContain('type-body')
    expect(el.className).toContain('text-label')
  })

  test('renders the requested element for a title variant', () => {
    render(
      <Text variant="large-title" as="h1">
        Settings
      </Text>,
    )
    const el = screen.getByRole('heading', { level: 1, name: 'Settings' })
    expect(el.className).toContain('type-large-title')
  })

  test('emphasized applies the variant-specific emphasized weight', () => {
    expect(textVariants({ variant: 'body', emphasized: true })).toContain('font-(--type-body-emphasized)')
    expect(textVariants({ variant: 'headline', emphasized: true })).toContain('font-(--type-headline-emphasized)')
    expect(textVariants({ variant: 'body' })).not.toContain('emphasized')
  })

  test('colour roles map to the label ladder, the tint and destructive', () => {
    expect(textVariants({ color: 'label-2' })).toContain('text-label-2')
    expect(textVariants({ color: 'label-4' })).toContain('text-label-4')
    expect(textVariants({ color: 'tint' })).toContain('text-primary')
    expect(textVariants({ color: 'destructive' })).toContain('text-destructive')
  })

  test('truncate clamps to one line', () => {
    render(<Text truncate>Long</Text>)
    expect(screen.getByText('Long').className).toContain('truncate')
  })
})
