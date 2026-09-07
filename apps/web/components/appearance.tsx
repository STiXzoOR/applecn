"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { PlatformProvider, type Platform } from "@applecn/ui/lib/platform"

/**
 * The site's appearance settings: the platform idiom, increased contrast and reduced
 * transparency. Each is stamped on the document root so portaled overlays inherit it, and
 * remembered per browser.
 *
 * The settings live in a small external store read through `useSyncExternalStore`: the server
 * (and hydration) always see the defaults, the client the remembered values, so the markup
 * never mismatches. `appearanceScript` stamps the root attributes before the first paint so
 * the stylesheet is right from the first frame.
 */
interface Appearance {
  platform: Platform
  contrast: boolean
  transparency: boolean
  setPlatform: (platform: Platform) => void
  setContrast: (on: boolean) => void
  setTransparency: (reduced: boolean) => void
}

type Stored = Pick<Appearance, "platform" | "contrast" | "transparency">

const defaults: Stored = {
  platform: "ios",
  contrast: false,
  transparency: false,
}

const KEY = "applecn:appearance"

/** Inline in `<head>`: applies the remembered appearance before the first paint. */
const appearanceScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(KEY)})||"{}");var r=document.documentElement;r.dataset.platform=["ios","macos","web"].includes(s.platform)?s.platform:"ios";if(s.contrast)r.dataset.contrast="more";if(s.transparency)r.dataset.transparency="reduced";}catch(e){}})()`

let cache: Stored | null = null
const listeners = new Set<() => void>()

function read(): Stored {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {
    // storage unavailable
  }
  return defaults
}

function getSnapshot(): Stored {
  cache ??= read()
  return cache
}

function getServerSnapshot(): Stored {
  return defaults
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function write(next: Stored) {
  cache = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage unavailable
  }
  for (const listener of listeners) listener()
}

const AppearanceContext = createContext<Appearance>({
  ...defaults,
  setPlatform: () => {},
  setContrast: () => {},
  setTransparency: () => {},
})

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.platform = state.platform
    if (state.contrast) root.dataset.contrast = "more"
    else delete root.dataset.contrast
    if (state.transparency) root.dataset.transparency = "reduced"
    else delete root.dataset.transparency
  }, [state])

  const value = useMemo<Appearance>(
    () => ({
      ...state,
      setPlatform: (platform) => write({ ...getSnapshot(), platform }),
      setContrast: (contrast) => write({ ...getSnapshot(), contrast }),
      setTransparency: (transparency) =>
        write({ ...getSnapshot(), transparency }),
    }),
    [state]
  )

  return (
    <AppearanceContext.Provider value={value}>
      <PlatformProvider platform={state.platform}>{children}</PlatformProvider>
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  return useContext(AppearanceContext)
}

/** Test hook: forget the cached snapshot so the next read hits storage again. */
export function resetAppearanceCache() {
  cache = null
}

export { appearanceScript }
