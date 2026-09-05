import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Separator } from '../src/components/separator'

describe('Separator', () => {
  test('is a horizontal hairline by default', () => {
    render(<Separator />)
    const el = screen.getByRole('separator')
    expect(el).toHaveAttribute('data-slot', 'separator')
    expect(el).toHaveAttribute('data-orientation', 'horizontal')
    expect(el.className).toContain('bg-separator')
    expect(el.className).toContain('data-horizontal:h-[0.5px]')
  })

  test('vertical separators stretch to the row', () => {
    render(<Separator orientation="vertical" />)
    const el = screen.getByRole('separator')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
    expect(el.className).toContain('data-vertical:w-[0.5px]')
  })

  test('list separators can start after the leading content or be inset on both sides', () => {
    const { rerender } = render(<Separator inset="leading" />)
    expect(screen.getByRole('separator').className).toContain('ms-(--list-row-padding-x)')
    rerender(<Separator inset="both" />)
    expect(screen.getByRole('separator').className).toContain('mx-(--list-row-padding-x)')
  })
})
