"use client"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@applecn/ui/components/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

const config = {
  steps: { label: "Steps", color: "var(--chart-1)" },
  distance: { label: "Distance (km)", color: "var(--chart-2)" },
} satisfies ChartConfig

const week = [
  { day: "Mon", steps: 6240, distance: 4.4 },
  { day: "Tue", steps: 8130, distance: 5.9 },
  { day: "Wed", steps: 7420, distance: 5.2 },
  { day: "Thu", steps: 9310, distance: 6.8 },
  { day: "Fri", steps: 5890, distance: 4.1 },
  { day: "Sat", steps: 11240, distance: 8.3 },
  { day: "Sun", steps: 4310, distance: 3.0 },
]

export default function ChartLine() {
  return (
    <ChartContainer
      config={config}
      role="img"
      aria-label="Steps and distance walked each day this week"
      className="w-full max-w-md"
    >
      <LineChart data={week} accessibilityLayer margin={{ left: 4, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="steps"
          stroke="var(--color-steps)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
