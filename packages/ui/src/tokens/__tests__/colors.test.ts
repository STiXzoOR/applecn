import { describe, expect, test } from 'vitest'

import {
  backgrounds,
  css,
  fills,
  grays,
  groupedBackgrounds,
  labels,
  link,
  separators,
  systemColors,
} from '../colors'

// Fixtures: HIG "Color" specifications table, fetched 2026-09-05 (iOS 26 values).
const table: Array<[string, number[], number[], number[], number[]]> = [
  ['red', [255, 56, 60], [255, 66, 69], [233, 21, 45], [255, 97, 101]],
  ['orange', [255, 141, 40], [255, 146, 48], [197, 83, 0], [255, 160, 86]],
  ['yellow', [255, 204, 0], [255, 214, 0], [161, 106, 0], [254, 223, 67]],
  ['green', [52, 199, 89], [48, 209, 88], [0, 137, 50], [74, 217, 104]],
  ['mint', [0, 200, 179], [0, 218, 195], [0, 133, 117], [84, 223, 203]],
  ['teal', [0, 195, 208], [0, 210, 224], [0, 129, 152], [59, 221, 236]],
  ['cyan', [0, 192, 232], [60, 211, 254], [0, 126, 174], [109, 217, 255]],
  ['blue', [0, 136, 255], [0, 145, 255], [30, 110, 244], [92, 184, 255]],
  ['indigo', [97, 85, 245], [109, 124, 255], [86, 74, 222], [167, 170, 255]],
  ['purple', [203, 48, 224], [219, 52, 242], [176, 47, 194], [234, 141, 255]],
  ['pink', [255, 45, 85], [255, 55, 95], [231, 18, 77], [255, 138, 196]],
  ['brown', [172, 127, 94], [183, 138, 102], [149, 109, 81], [219, 166, 121]],
]

describe('system colours', () => {
  test('there are twelve, in HIG order', () => {
    expect(systemColors.map((c) => c.name)).toEqual(table.map((r) => r[0]))
  })

  test.each(table)('%s matches the HIG table', (name, light, dark, lightA11y, darkA11y) => {
    const c = systemColors.find((x) => x.name === name)!
    expect(c.light.rgb).toEqual(light)
    expect(c.dark.rgb).toEqual(dark)
    expect(c.lightAccessible.rgb).toEqual(lightA11y)
    expect(c.darkAccessible.rgb).toEqual(darkA11y)
  })
})

describe('grays', () => {
  test('the six-step ladder in light and dark', () => {
    expect(grays.map((g) => g.name)).toEqual(['gray', 'gray-2', 'gray-3', 'gray-4', 'gray-5', 'gray-6'])
    expect(grays.map((g) => g.light.rgb)).toEqual([
      [142, 142, 147],
      [174, 174, 178],
      [199, 199, 204],
      [209, 209, 214],
      [229, 229, 234],
      [242, 242, 247],
    ])
    expect(grays.map((g) => g.dark.rgb)).toEqual([
      [142, 142, 147],
      [99, 99, 102],
      [72, 72, 74],
      [58, 58, 60],
      [44, 44, 46],
      [28, 28, 30],
    ])
  })
})

describe('semantic colours', () => {
  test('labels are black/white with the 60/30/18 alpha ladder', () => {
    expect(css(labels.label.light)).toBe('rgb(0 0 0)')
    expect(css(labels.label.dark)).toBe('rgb(255 255 255)')
    expect(css(labels['label-2'].light)).toBe('rgb(60 60 67 / 0.6)')
    expect(css(labels['label-2'].dark)).toBe('rgb(235 235 245 / 0.6)')
    expect(css(labels['label-3'].light)).toBe('rgb(60 60 67 / 0.3)')
    expect(css(labels['label-4'].light)).toBe('rgb(60 60 67 / 0.18)')
    expect(css(labels['label-4'].dark)).toBe('rgb(235 235 245 / 0.16)')
    expect(css(labels.placeholder.light)).toBe('rgb(60 60 67 / 0.3)')
  })

  test('fills step down 20/16/12/8 in light and 36/32/24/18 in dark', () => {
    expect(css(fills.fill.light)).toBe('rgb(120 120 128 / 0.2)')
    expect(css(fills['fill-2'].light)).toBe('rgb(120 120 128 / 0.16)')
    expect(css(fills['fill-3'].light)).toBe('rgb(118 118 128 / 0.12)')
    expect(css(fills['fill-4'].light)).toBe('rgb(116 116 128 / 0.08)')
    expect(css(fills.fill.dark)).toBe('rgb(120 120 128 / 0.36)')
    expect(css(fills['fill-4'].dark)).toBe('rgb(118 118 128 / 0.18)')
  })

  test('backgrounds, with the elevated dark set one step lighter', () => {
    expect(css(backgrounds.background.light)).toBe('rgb(255 255 255)')
    expect(css(backgrounds.background.dark)).toBe('rgb(0 0 0)')
    expect(css(backgrounds.background.darkElevated)).toBe('rgb(28 28 30)')
    expect(css(backgrounds['background-2'].light)).toBe('rgb(242 242 247)')
    expect(css(backgrounds['background-2'].dark)).toBe('rgb(28 28 30)')
    expect(css(backgrounds['background-3'].dark)).toBe('rgb(44 44 46)')
    expect(css(groupedBackgrounds['grouped-background'].light)).toBe('rgb(242 242 247)')
    expect(css(groupedBackgrounds['grouped-background-2'].light)).toBe('rgb(255 255 255)')
    expect(css(groupedBackgrounds['grouped-background-2'].dark)).toBe('rgb(28 28 30)')
    expect(css(groupedBackgrounds['grouped-background-3'].darkElevated)).toBe('rgb(58 58 60)')
  })

  test('separators and link', () => {
    expect(css(separators.separator.light)).toBe('rgb(60 60 67 / 0.29)')
    expect(css(separators.separator.dark)).toBe('rgb(84 84 88 / 0.6)')
    expect(css(separators['separator-opaque'].light)).toBe('rgb(198 198 200)')
    expect(css(separators['separator-opaque'].dark)).toBe('rgb(56 56 58)')
    expect(css(link.light)).toBe('rgb(0 122 255)')
    expect(css(link.dark)).toBe('rgb(9 132 255)')
  })
})

describe('css()', () => {
  test('omits the alpha channel when it is 1 or absent', () => {
    expect(css({ rgb: [1, 2, 3] })).toBe('rgb(1 2 3)')
    expect(css({ rgb: [1, 2, 3], alpha: 1 })).toBe('rgb(1 2 3)')
    expect(css({ rgb: [1, 2, 3], alpha: 0.5 })).toBe('rgb(1 2 3 / 0.5)')
  })
})
