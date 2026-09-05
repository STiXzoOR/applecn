import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Tabs, TabsList, TabsPanel, TabsTab } from '../src/components/tabs'

function Views() {
  return (
    <Tabs defaultValue="events">
      <TabsList aria-label="Kind">
        <TabsTab value="events">Event</TabsTab>
        <TabsTab value="reminders">Reminder</TabsTab>
      </TabsList>
      <TabsPanel value="events">Event form</TabsPanel>
      <TabsPanel value="reminders">Reminder form</TabsPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  test('shows the selected panel and switches on click', async () => {
    render(<Views />)
    expect(screen.getByText('Event form')).toBeVisible()
    expect(screen.queryByText('Reminder form')).toBeNull()
    await userEvent.click(screen.getByRole('tab', { name: 'Reminder' }))
    expect(screen.getByText('Reminder form')).toBeVisible()
  })

  test('the tab list is a segmented control and tabs control their panels', () => {
    render(<Views />)
    const list = screen.getByRole('tablist', { name: 'Kind' })
    expect(list).toHaveAttribute('data-slot', 'segmented-control')
    const tab = screen.getByRole('tab', { name: 'Event' })
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveAttribute('data-slot', 'tabs-panel')
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
  })
})
