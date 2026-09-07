"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const list = window.matchMedia(QUERY)
  list.addEventListener("change", onChange)
  return () => list.removeEventListener("change", onChange)
}

/**
 * Whether the person has asked for reduced motion. The stylesheet already honours the
 * preference for every transition; use this for JavaScript-driven motion (scroll animations,
 * springs) so it can fall back to a fade or a jump.
 */
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

export { useReducedMotion }
