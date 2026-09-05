import { Share01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSpacer } from '../src/components/toolbar'

describe('Toolbar', () => {
  test('is a toolbar of glass groups whose buttons are reached with the arrow keys', async () => {
    render(
      <Toolbar aria-label="Actions">
        <ToolbarGroup>
          <ToolbarButton icon={Share01Icon} aria-label="Share" />
          <ToolbarButton icon={Share01Icon} aria-label="Bookmark" />
        </ToolbarGroup>
        <ToolbarSpacer />
        <ToolbarButton prominent icon={Tick02Icon} aria-label="Done" />
      </Toolbar>,
    )
    const toolbar = screen.getByRole('toolbar', { name: 'Actions' })
    expect(toolbar).toHaveAttribute('data-slot', 'toolbar')
    const group = toolbar.querySelector('[data-slot="toolbar-group"]')!
    expect(group.className).toContain('glass')
    expect(group.className).toContain('rounded-full')
    const share = screen.getByRole('button', { name: 'Share' })
    expect(share.className).toContain('size-(--control-height-regular)')
    expect(screen.getByRole('button', { name: 'Done' }).className).toContain('glass-prominent')
    expect(toolbar.querySelector('[data-slot="toolbar-spacer"]')!.className).toContain('flex-1')
    share.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveFocus()
  })
})
