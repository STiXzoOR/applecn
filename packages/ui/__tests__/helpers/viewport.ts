import { vi } from 'vitest'

type Viewport = 'phone' | 'desktop'

let current: Viewport = 'phone'
const listeners = new Set<(event: MediaQueryListEvent) => void>()

/** Evaluates the only kind of query the design system asks: a `min-width` breakpoint. */
function matches(query: string): boolean {
  const min = /min-width:\s*(\d+)px/.exec(query)
  const width = current === 'phone' ? 390 : 1280
  return min ? width >= Number(min[1]) : false
}

/**
 * Installs a `window.matchMedia` that answers for a phone (390 px) or a desktop (1280 px) and
 * notifies listeners when the viewport is switched, so responsive components can be tested.
 */
export function setViewport(viewport: Viewport) {
  current = viewport
  for (const listener of listeners) listener({ matches: true } as MediaQueryListEvent)
}

export function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return matches(query)
      },
      media: query,
      onchange: null,
      addEventListener: (_: 'change', listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeEventListener: (_: 'change', listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
      addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
      dispatchEvent: () => false,
    })),
  })
}
