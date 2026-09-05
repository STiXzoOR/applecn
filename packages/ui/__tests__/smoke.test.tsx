import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Button } from '../src/components/button'
import { checkA11y } from './helpers/axe'

test('the harness renders a component and runs axe', async () => {
  const { container } = render(<Button>Save</Button>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  expect(await checkA11y(container)).toHaveNoViolations()
})
