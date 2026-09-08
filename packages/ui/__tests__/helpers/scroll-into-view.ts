/**
 * jsdom implements no `Element.scrollIntoView`, and `cmdk` calls it every time the highlighted
 * command changes — so without this a `Command` throws on its first render.
 *
 * The stub scrolls nothing, which is all an environment with no layout could do: there is no
 * viewport to bring a row into. What the row is and how it is dressed is asserted from the DOM.
 */
export function installScrollIntoView() {
  if ("scrollIntoView" in Element.prototype) return
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    writable: true,
    configurable: true,
    value: () => {},
  })
}
