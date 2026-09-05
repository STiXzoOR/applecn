'use client'

import { useEffect, useState } from 'react'

import { Progress, ProgressCircular, ProgressLabel, ProgressValue } from '@apple-ds/ui/components/progress'

export default function ProgressBasic() {
  const [value, setValue] = useState(20)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <Progress value={value}>
        <ProgressLabel>Downloading</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={null} aria-label="Preparing" />
      <div className="flex items-center gap-4">
        <ProgressCircular value={value} aria-label="Upload" />
        <ProgressCircular value={value} aria-label="Upload" size="large" />
        <ProgressCircular value={null} aria-label="Working" size="large" />
      </div>
    </div>
  )
}
