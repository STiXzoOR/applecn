'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { PlatformProvider, type Platform } from '@apple-ds/ui/lib/platform'

/**
 * The site's appearance settings: the platform idiom, increased contrast and reduced
 * transparency. Each is stamped on the document root so portaled overlays inherit it, and
 * remembered per browser.
 */
interface Appearance {
  platform: Platform
  contrast: boolean
  transparency: boolean
  setPlatform: (platform: Platform) => void
  setContrast: (on: boolean) => void
  setTransparency: (reduced: boolean) => void
}

const AppearanceContext = createContext<Appearance>({
  platform: 'ios',
  contrast: false,
  transparency: false,
  setPlatform: () => {},
  setContrast: () => {},
  setTransparency: () => {},
})

const KEY = 'apple-ds:appearance'

function read(): { platform: Platform; contrast: boolean; transparency: boolean } {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null
    if (raw) return { platform: 'ios', contrast: false, transparency: false, ...JSON.parse(raw) }
  } catch {
    // storage unavailable
  }
  return { platform: 'ios', contrast: false, transparency: false }
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(read)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.platform = state.platform
    if (state.contrast) root.dataset.contrast = 'more'
    else delete root.dataset.contrast
    if (state.transparency) root.dataset.transparency = 'reduced'
    else delete root.dataset.transparency
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // storage unavailable
    }
  }, [state])

  const value: Appearance = {
    ...state,
    setPlatform: (platform) => setState((s) => ({ ...s, platform })),
    setContrast: (contrast) => setState((s) => ({ ...s, contrast })),
    setTransparency: (transparency) => setState((s) => ({ ...s, transparency })),
  }

  return (
    <AppearanceContext.Provider value={value}>
      <PlatformProvider platform={state.platform}>{children}</PlatformProvider>
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  return useContext(AppearanceContext)
}
