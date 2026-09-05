import { describe, expect, test } from 'vitest'

import { composite, contrastRatio, luminance } from '../src/lib/contrast'
import { backgrounds, labels, systemColors, white } from '../src/tokens/colors'

const blue = systemColors.find((c) => c.name === 'blue')!
const red = systemColors.find((c) => c.name === 'red')!

describe('contrast helper', () => {
  test('luminance of black and white', () => {
    expect(luminance([0, 0, 0])).toBe(0)
    expect(luminance([255, 255, 255])).toBeCloseTo(1, 5)
  })

  test('composite blends an alpha colour over an opaque one', () => {
    expect(composite({ rgb: [0, 0, 0], alpha: 0.5 }, [255, 255, 255])).toEqual([128, 128, 128])
    expect(composite({ rgb: [10, 20, 30] }, [255, 255, 255])).toEqual([10, 20, 30])
  })

  test('black on white is 21:1', () => {
    expect(contrastRatio({ rgb: [0, 0, 0] }, [255, 255, 255])).toBeCloseTo(21, 1)
  })

  test('white on system blue is about 3.5:1 (large or semibold text only)', () => {
    expect(contrastRatio(white, blue.light.rgb)).toBeCloseTo(3.5, 1)
  })

  test('the secondary label composites to about 3.4:1 on white', () => {
    expect(contrastRatio(labels['label-2'].light, [255, 255, 255])).toBeCloseTo(3.4, 1)
  })
})

describe('token pairs follow the HIG contrast rules', () => {
  // Up to 17 pt: 4.5:1. 18 pt+ or bold: 3:1. Controls use 17 pt semibold labels, so 3:1 applies.
  test('label on background reaches 4.5:1 in both appearances', () => {
    expect(contrastRatio(labels.label.light, backgrounds.background.light.rgb)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(labels.label.dark, backgrounds.background.dark.rgb)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(labels.label.dark, backgrounds.background.darkElevated.rgb)).toBeGreaterThanOrEqual(4.5)
  })

  test('secondary label on background reaches 3:1 in light and 4.5:1 in dark', () => {
    expect(contrastRatio(labels['label-2'].light, backgrounds.background.light.rgb)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(labels['label-2'].dark, backgrounds.background.dark.rgb)).toBeGreaterThanOrEqual(4.5)
  })

  test('white on the filled button colours reaches 3:1 in both appearances', () => {
    expect(contrastRatio(white, blue.light.rgb)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(white, blue.dark.rgb)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(white, red.light.rgb)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(white, red.dark.rgb)).toBeGreaterThanOrEqual(3)
  })

  test('the accessible blue reaches 4.5:1 with white', () => {
    expect(contrastRatio(white, blue.lightAccessible.rgb)).toBeGreaterThanOrEqual(4.5)
  })

  test('tinted button text (blue on white, blue on black) reaches 3:1', () => {
    expect(contrastRatio({ rgb: blue.light.rgb }, backgrounds.background.light.rgb)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio({ rgb: blue.dark.rgb }, backgrounds.background.dark.rgb)).toBeGreaterThanOrEqual(3)
  })
})
