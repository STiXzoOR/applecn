import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../src/components/context-menu'

describe('ContextMenu', () => {
  test('opens on a secondary click and closes on Escape', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Photo</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Share</ContextMenuItem>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Photo'))
    const menu = await screen.findByRole('menu')
    expect(menu).toHaveAttribute('data-slot', 'context-menu-content')
    expect(menu.className).toContain('glass')
    expect(screen.getByRole('menuitem', { name: 'Delete' }).className).toContain('text-destructive')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
