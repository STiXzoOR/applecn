import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { PageControl, pageControlVariants } from '../src/components/page-control'

describe('PageControl', () => {
  test('is a row of 7 pt dots 9 pt apart with the current page filled', () => {
    render(<PageControl aria-label="Pages" count={4} index={1} />)
    const list = screen.getByRole('tablist', { name: 'Pages' })
    expect(list).toHaveAttribute('data-slot', 'page-control')
    expect(list.className).toContain('gap-(--page-control-gap)')
    const dots = screen.getAllByRole('tab')
    expect(dots).toHaveLength(4)
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    expect(dots[0]!.className).toContain('size-(--page-control-dot)')
    expect(dots[0]!.className).toContain('aria-selected:bg-label')
  })

  test('pressing a dot and arrow keys change the page', async () => {
    const onIndexChange = vi.fn()
    render(<PageControl aria-label="Pages" count={3} index={0} onIndexChange={onIndexChange} />)
    await userEvent.click(screen.getAllByRole('tab')[2]!)
    expect(onIndexChange).toHaveBeenLastCalledWith(2)
    screen.getAllByRole('tab')[0]!.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
  })

  test('the prominent background is a thin-material capsule', () => {
    expect(pageControlVariants({ background: 'prominent' })).toContain('material-thin')
    expect(pageControlVariants({ background: 'prominent' })).toContain('rounded-full')
    expect(pageControlVariants({ background: 'minimal' })).not.toContain('material')
  })
})
