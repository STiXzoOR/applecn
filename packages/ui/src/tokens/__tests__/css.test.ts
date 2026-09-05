import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { renderTokensCss } from '../css'

const out = renderTokensCss()
const section = (selector: string) => {
  const start = out.indexOf(selector)
  expect(start, `${selector} present`).toBeGreaterThan(-1)
  const open = out.indexOf('{', start)
  let depth = 0
  for (let i = open; i < out.length; i++) {
    if (out[i] === '{') depth++
    if (out[i] === '}') depth--
    if (depth === 0) return out.slice(open, i + 1)
  }
  throw new Error('unbalanced')
}

describe('renderTokensCss', () => {
  test('light primitives live on :root', () => {
    const root = section(':root')
    expect(root).toContain('--system-blue: rgb(0 136 255);')
    expect(root).toContain('--gray-6: rgb(242 242 247);')
    expect(root).toContain('--label-2: rgb(60 60 67 / 0.6);')
    expect(root).toContain('--fill-3: rgb(118 118 128 / 0.12);')
    expect(root).toContain('--background: var(--background-1);')
    expect(root).toContain('--primary: var(--system-blue);')
    expect(root).toContain('--pt: 0.0625rem;')
  })

  test('dark values live under .dark', () => {
    const dark = section('.dark')
    expect(dark).toContain('--system-blue: rgb(0 145 255);')
    expect(dark).toContain('--background-1: rgb(0 0 0);')
    expect(dark).toContain('--label-2: rgb(235 235 245 / 0.6);')
  })

  test('accessible values under prefers-contrast and the data attribute', () => {
    expect(out).toMatch(/@media \(prefers-contrast: more\)[^]*--system-blue: rgb\(30 110 244\);/)
    expect(out).toMatch(/\[data-contrast="more"\][^]*--system-blue: rgb\(30 110 244\);/)
    expect(out).toMatch(/\.dark[^]*prefers-contrast: more[^]*--system-blue: rgb\(92 184 255\);/)
  })

  test('elevated dark backgrounds under [data-elevated]', () => {
    expect(out).toMatch(/\.dark \[data-elevated\][^]*--background-1: rgb\(28 28 30\);/)
  })

  test('type sizes are pt-based and switch with the platform', () => {
    const root = section(':root')
    expect(root).toContain('--type-body-size: calc(17 * var(--pt));')
    expect(root).toContain('--type-body-leading: calc(22 * var(--pt));')
    expect(root).toContain('--type-body-weight: 400;')
    expect(root).toContain('--type-headline-emphasized: 600;')
    const mac = section('[data-platform="macos"]')
    expect(mac).toContain('--type-body-size: calc(13 * var(--pt));')
    expect(mac).toContain('--control-height-regular: 24px;')
  })

  test('control metrics as CSS variables', () => {
    const root = section(':root')
    expect(root).toContain('--control-height-regular: 44px;')
    expect(root).toContain('--switch-width: 51px;')
    expect(root).toContain('--list-inset: 16px;')
    expect(root).toContain('--radius-sheet: 40px;')
    expect(root).toContain('--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);')
    expect(root).toContain('--duration-press: 120ms;')
    expect(root).toContain('--shadow-thumb: 0 3px 8px rgb(0 0 0 / 0.15), 0 3px 1px rgb(0 0 0 / 0.06);')
  })

  test('Dynamic Type makes the pt unit follow the reader on iOS', () => {
    expect(out).toMatch(/@supports \(font: -apple-system-body\) and \(-webkit-touch-callout: none\)[^]*--pt: calc\(1rem \/ 17\);/)
  })

  test('the wide-phone list inset switches at 414 px', () => {
    expect(out).toMatch(/@media \(width >= 414px\)[^]*--list-inset: 20px;/)
  })

  test('the committed tokens.css is the generator output', () => {
    const committed = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8')
    expect(committed).toBe(out)
  })
})
