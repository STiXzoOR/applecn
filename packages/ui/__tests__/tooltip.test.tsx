import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../src/components/tooltip'

describe('Tooltip', () => {
  test('appears on hover as a small thick-material label', async () => {
    render(
      <TooltipProvider delay={0}>
        <Tooltip>
          <TooltipTrigger>Save</TooltipTrigger>
          <TooltipContent>Save the document</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await userEvent.hover(screen.getByRole('button', { name: 'Save' }))
    const tip = await screen.findByRole('tooltip')
    expect(tip).toHaveTextContent('Save the document')
    expect(tip).toHaveAttribute('data-slot', 'tooltip-content')
    expect(tip.className).toContain('material-thick')
    expect(tip.className).toContain('rounded-md')
    expect(tip.className).toContain('type-caption-1')
  })
})
