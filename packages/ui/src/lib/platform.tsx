"use client"

import { createContext, useContext, type ReactNode } from "react"

type Platform = "ios" | "macos"

const PlatformContext = createContext<Platform>("ios")

/**
 * Selects the platform idiom for everything inside. The wrapper stamps `data-platform`, which
 * `tokens.css` uses to swap the type scale and control metrics; components read the context
 * only where their structure differs (a circular iOS checkbox vs a square macOS one).
 */
function PlatformProvider({
  platform,
  children,
}: {
  platform: Platform
  children: ReactNode
}) {
  return (
    <PlatformContext.Provider value={platform}>
      <div data-slot="platform" data-platform={platform} className="contents">
        {children}
      </div>
    </PlatformContext.Provider>
  )
}

function usePlatform(): Platform {
  return useContext(PlatformContext)
}

export { PlatformProvider, usePlatform }
export type { Platform }
