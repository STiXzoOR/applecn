import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { NavigationBar, NavigationBarBackButton } from '../src/components/navigation-bar'

type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void
const callbacks: Callback[] = []

beforeEach(() => {
  callbacks.length = 0
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: Callback) {
        callbacks.push(cb)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

afterEach(() => vi.unstubAllGlobals())

describe('NavigationBar', () => {
  test('renders a 44 pt bar with a large title below it, collapsing once the title scrolls under', () => {
    render(
      <NavigationBar title="Settings" largeTitle leading={<NavigationBarBackButton href="/" />} trailing={<button type="button">Edit</button>}>
        <p>Content</p>
      </NavigationBar>,
    )
    const bar = screen.getByRole('banner')
    expect(bar).toHaveAttribute('data-slot', 'navigation-bar')
    expect(bar).toHaveAttribute('data-collapsed', 'false')
    const row = bar.querySelector('[data-slot="navigation-bar-row"]')!
    expect(row.className).toContain('h-(--nav-bar-height)')
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' }).className).toContain('type-large-title')
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()

    act(() => {
      for (const cb of callbacks) cb([{ isIntersecting: false, boundingClientRect: { top: -10 } as DOMRectReadOnly }])
    })
    expect(bar).toHaveAttribute('data-collapsed', 'true')
  })

  test('without a large title the bar carries the title itself', () => {
    render(<NavigationBar title="Wi-Fi" />)
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    expect(screen.getByRole('banner').querySelector('[data-slot="navigation-bar-title"]')).toHaveTextContent('Wi-Fi')
  })
})
