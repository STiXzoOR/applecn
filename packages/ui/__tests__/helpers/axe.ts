import { axe } from 'vitest-axe'

/**
 * Runs axe without the colour-contrast rule: jsdom has no layout or canvas, so
 * that rule cannot evaluate and only logs a "getContext not implemented" warning.
 * Contrast is asserted numerically in the token tests instead.
 */
export function checkA11y(container: Element) {
  return axe(container, { rules: { 'color-contrast': { enabled: false } } })
}
