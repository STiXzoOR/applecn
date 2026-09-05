"use client"

import { useSyncExternalStore } from "react"

const noop = () => {}

/** Tracks a media query; `false` on the server and wherever `matchMedia` is missing. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      )
        return noop
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () =>
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia(query).matches
        : false,
    () => false
  )
}

/** The width at which sheets become centred cards and action sheets become popovers (Tailwind `sm`). */
const DESKTOP_QUERY = "(min-width: 640px)"

function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY)
}

export { DESKTOP_QUERY, useIsDesktop, useMediaQuery }
