"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-color-scheme: dark)"

type ColorScheme = "light" | "dark"

function subscribe(onChange: () => void) {
  const list = window.matchMedia(QUERY)
  list.addEventListener("change", onChange)
  return () => list.removeEventListener("change", onChange)
}

/**
 * The system colour scheme, for the rare case where JavaScript needs it (choosing an image,
 * a chart palette). Components never need it: the `.dark` class and the tokens handle
 * appearance in CSS.
 */
function useColorScheme(): ColorScheme {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "dark" : "light"),
    () => "light"
  )
}

export { useColorScheme }
export type { ColorScheme }
