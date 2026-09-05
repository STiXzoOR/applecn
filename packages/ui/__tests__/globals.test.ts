import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { textStyleNames } from '../src/tokens/typography'

const css = readFileSync(join(process.cwd(), 'src/styles/globals.css'), 'utf8')
const themeInline = css.slice(css.indexOf('@theme inline {'))

describe('globals.css', () => {
  test('imports the generated tokens after the shadcn stylesheet', () => {
    const order = ['@import "tailwindcss"', '@import "tw-animate-css"', '@import "shadcn/tailwind.css"', '@import "./tokens.css"']
    const positions = order.map((s) => css.indexOf(s))
    expect(positions.every((p) => p > -1)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })

  test('declares the dark and macos variants', () => {
    expect(css).toContain('@custom-variant dark (&:is(.dark *));')
    expect(css).toContain('@custom-variant macos')
  })

  test('uses the system font stack, never a named SF family', () => {
    expect(themeInline).toMatch(/--font-sans:\s*-apple-system, BlinkMacSystemFont, system-ui/)
    expect(themeInline).toMatch(/--font-rounded:\s*ui-rounded/)
    expect(themeInline).toMatch(/--font-mono:\s*ui-monospace/)
    expect(css).not.toMatch(/SF Pro/)
  })

  test('bridges every text style into the Tailwind theme', () => {
    for (const name of textStyleNames) {
      expect(themeInline).toContain(`--text-${name}: var(--type-${name}-size);`)
      expect(themeInline).toContain(`--text-${name}--line-height: var(--type-${name}-leading);`)
      expect(themeInline).toContain(`--text-${name}--font-weight: var(--type-${name}-weight);`)
    }
  })

  test('bridges the Apple colour primitives and the shadcn aliases', () => {
    expect(themeInline).toContain('--color-system-blue: var(--system-blue);')
    expect(themeInline).toContain('--color-gray-6: var(--gray-6);')
    expect(themeInline).toContain('--color-label-2: var(--label-2);')
    expect(themeInline).toContain('--color-placeholder: var(--placeholder);')
    expect(themeInline).toContain('--color-fill-3: var(--fill-3);')
    expect(themeInline).toContain('--color-grouped-background-2: var(--grouped-background-2);')
    expect(themeInline).toContain('--color-separator: var(--separator);')
    expect(themeInline).toContain('--color-background: var(--background);')
    expect(themeInline).toContain('--color-primary: var(--primary);')
    expect(themeInline).toContain('--color-sidebar-ring: var(--sidebar-ring);')
  })

  test('keeps the Luma radius derivation and adds the sheet and icon radii', () => {
    expect(themeInline).toContain('--radius-sm: calc(var(--radius) * 0.6);')
    expect(themeInline).toContain('--radius-4xl: calc(var(--radius) * 2.6);')
    expect(themeInline).toContain('--radius-sheet: var(--sheet-radius);')
    expect(themeInline).toContain('--radius-icon: var(--icon-radius);')
  })

  test('bridges motion and elevation', () => {
    expect(themeInline).toContain('--ease-standard: var(--easing-standard);')
    expect(themeInline).toContain('--ease-sheet: var(--easing-sheet);')
    expect(themeInline).toContain('--ease-spring-bouncy: var(--spring-bouncy);')
    expect(themeInline).toContain('--shadow-thumb: var(--elevation-thumb);')
    expect(themeInline).toContain('--shadow-glass: var(--elevation-glass);')
  })

  test('defines the material, glass and hairline utilities with reduced-transparency fallbacks', () => {
    for (const name of ['material-ultra-thin', 'material-thin', 'material-regular', 'material-thick', 'glass', 'glass-clear']) {
      expect(css).toContain(`@utility ${name} {`)
    }
    expect(css).toContain('@utility hairline {')
    expect(css).toContain('prefers-reduced-transparency: reduce')
    expect(css).toContain('[data-transparency="reduced"]')
  })

  test('base layer: tap highlight, optical sizing, coarse-pointer input size, Dynamic Type root', () => {
    expect(css).toContain('-webkit-tap-highlight-color: transparent;')
    expect(css).toContain('font-optical-sizing: auto;')
    expect(css).toMatch(/@media \(pointer: coarse\)[^]*font-size: max\(16px, 1rem\);/)
    expect(css).toMatch(/@supports \(font: -apple-system-body\)[^]*font: -apple-system-body;/)
  })
})
