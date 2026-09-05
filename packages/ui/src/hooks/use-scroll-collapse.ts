'use client'

import { useEffect, useState } from 'react'

interface ScrollCollapseOptions {
  /** How far under the top edge the sentinel must pass before the bar collapses, in px. */
  offset?: number
}

/**
 * Reports when a sentinel placed after a large title has scrolled under the bar. Attach the
 * returned `ref` to a 1 px element; `collapsed` turns true only when the sentinel leaves through
 * the top (short pages and rubber-banding never collapse the bar).
 */
function useScrollCollapse({ offset = 44 }: ScrollCollapseOptions = {}) {
  const [node, setNode] = useState<Element | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < 0)
        }
      },
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, offset])

  return { ref: setNode, collapsed }
}

export { useScrollCollapse }
export type { ScrollCollapseOptions }
