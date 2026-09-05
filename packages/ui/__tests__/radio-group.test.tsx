import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { RadioGroup, RadioGroupItem } from '../src/components/radio-group'

function Sizes() {
  return (
    <RadioGroup aria-label="Size" defaultValue="m">
      <label>
        <RadioGroupItem value="s" /> Small
      </label>
      <label>
        <RadioGroupItem value="m" /> Medium
      </label>
      <label>
        <RadioGroupItem value="l" /> Large
      </label>
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  test('is a radiogroup of radios with one selected', () => {
    render(<Sizes />)
    expect(screen.getByRole('radiogroup', { name: 'Size' })).toHaveAttribute('data-slot', 'radio-group')
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveAttribute('aria-checked', 'true')
  })

  test('arrow keys move the selection', async () => {
    render(<Sizes />)
    const medium = screen.getByRole('radio', { name: 'Medium' })
    medium.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Large' })).toHaveAttribute('aria-checked', 'true')
  })

  test('the item is a ring that fills with the tint and shows a dot when selected', () => {
    render(<Sizes />)
    const item = screen.getByRole('radio', { name: 'Medium' })
    expect(item).toHaveAttribute('data-slot', 'radio-group-item')
    expect(item.className).toContain('size-(--radio-size)')
    expect(item.className).toContain('rounded-full')
    expect(item.className).toContain('border-gray-3')
    expect(item.className).toContain('data-checked:border-primary')
    const dot = item.querySelector('[data-slot="radio-group-indicator"] span')!
    expect(dot.className).toContain('size-(--radio-dot)')
  })
})
