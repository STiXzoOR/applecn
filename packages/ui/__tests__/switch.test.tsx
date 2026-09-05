import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Switch, switchVariants } from '../src/components/switch'

describe('Switch', () => {
  test('is a switch that toggles on click and on Space', async () => {
    render(<Switch aria-label="Wi-Fi" />)
    const s = screen.getByRole('switch', { name: 'Wi-Fi' })
    expect(s).toHaveAttribute('aria-checked', 'false')
    expect(s).toHaveAttribute('data-slot', 'switch')
    await userEvent.click(s)
    expect(s).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard(' ')
    expect(s).toHaveAttribute('aria-checked', 'false')
  })

  test('is 51×31 with a 27 pt thumb on iOS, from the platform tokens', () => {
    render(<Switch aria-label="Bluetooth" />)
    const s = screen.getByRole('switch')
    expect(s.className).toContain('w-(--switch-width)')
    expect(s.className).toContain('h-(--switch-height)')
    const thumb = s.querySelector('[data-slot="switch-thumb"]')!
    expect(thumb.className).toContain('size-(--switch-thumb)')
    expect(thumb.className).toContain('shadow-thumb')
    expect(thumb.className).toContain('data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb)-4px)]')
  })

  test('on is system green by default and the accent colour on request', () => {
    expect(switchVariants()).toContain('data-checked:bg-system-green')
    expect(switchVariants({ color: 'tint' })).toContain('data-checked:bg-primary')
    expect(switchVariants()).toContain('data-unchecked:bg-fill')
  })

  test('disabled switches are dimmed and inert', async () => {
    render(<Switch aria-label="Off" disabled />)
    const s = screen.getByRole('switch')
    expect(s).toHaveAttribute('aria-disabled', 'true')
    expect(s).toHaveAttribute('data-disabled')
    await userEvent.click(s)
    expect(s).toHaveAttribute('aria-checked', 'false')
  })
})
