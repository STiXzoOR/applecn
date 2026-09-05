import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Stepper } from '../src/components/stepper'

describe('Stepper', () => {
  test('is a two-segment group that increments and decrements a value', async () => {
    render(<Stepper aria-label="Copies" defaultValue={1} min={0} max={3} />)
    const group = screen.getByRole('group', { name: 'Copies' })
    expect(group).toHaveAttribute('data-slot', 'stepper')
    const input = group.querySelector('input')!
    expect(input).toHaveValue('1')
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }))
    expect(input).toHaveValue('2')
    await userEvent.click(screen.getByRole('button', { name: 'Decrement' }))
    expect(input).toHaveValue('1')
  })

  test('is 94×32 with an 8 pt radius on iOS, with a hairline between the halves', () => {
    render(<Stepper aria-label="Copies" defaultValue={1} />)
    const group = screen.getByRole('group')
    expect(group.className).toContain('w-(--stepper-width)')
    expect(group.className).toContain('h-(--stepper-height)')
    expect(group.className).toContain('rounded-lg')
    expect(group.className).toContain('bg-fill-3')
    expect(group.querySelector('[data-slot="stepper-divider"]')).not.toBeNull()
  })

  test('disables the segment at a bound', () => {
    render(<Stepper aria-label="Copies" defaultValue={3} max={3} />)
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeEnabled()
  })
})
