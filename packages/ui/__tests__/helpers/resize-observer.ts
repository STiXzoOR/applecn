/**
 * jsdom implements no `ResizeObserver`, and `react-resizable-panels` reads one off the group's
 * `ownerDocument.defaultView` the moment a `ResizablePanelGroup` mounts — so without this the
 * component throws before a single assertion runs.
 *
 * The stub observes nothing, which is the honest thing for an environment with no layout: every
 * box is 0 × 0, so a real observer would only ever report zeroes. Geometry is asserted from the
 * classes the component writes, and the drag itself belongs to a browser.
 */
export function installResizeObserver() {
  if ("ResizeObserver" in window) return
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  })
}
