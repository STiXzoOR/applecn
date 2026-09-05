"use client"

import { Gauge, Meter } from "@applecn/ui/components/meter"

export default function MeterBasic() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-sm flex-col gap-4">
        <Meter value={64} label="iPhone" />
        <Meter value={91} label="Battery" color="green" />
        <Meter value={97} max={100} label="Storage" color="red" />
      </div>
      <div className="flex items-end gap-6">
        <Gauge value={40} label="Move" color="red" size="small" />
        <Gauge value={72} label="Exercise" color="green" />
        <Gauge value={100} label="Stand" size="large" />
      </div>
    </div>
  )
}
