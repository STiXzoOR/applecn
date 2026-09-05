'use client'

import { useState } from 'react'

import { Stepper } from '@apple-ds/ui/components/stepper'
import { Text } from '@apple-ds/ui/components/text'

export default function StepperBasic() {
  const [copies, setCopies] = useState(1)
  return (
    <div className="flex items-center justify-between rounded-4xl bg-card px-4 py-2">
      <Text>Copies</Text>
      <div className="flex items-center gap-4">
        <Text color="label-2" className="tabular-nums">
          {copies}
        </Text>
        <Stepper aria-label="Copies" value={copies} min={1} max={99} onValueChange={(v) => setCopies(v ?? 1)} />
      </div>
    </div>
  )
}
