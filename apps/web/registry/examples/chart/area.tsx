"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@applecn/ui/components/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const config = {
  resting: { label: "Resting (bpm)", color: "var(--chart-5)" },
} satisfies ChartConfig

const months = [
  { month: "Apr", resting: 62 },
  { month: "May", resting: 61 },
  { month: "Jun", resting: 59 },
  { month: "Jul", resting: 58 },
  { month: "Aug", resting: 57 },
  { month: "Sep", resting: 58 },
]

export default function ChartArea() {
  return (
    <ChartContainer
      config={config}
      role="img"
      aria-label="Resting heart rate over the last six months"
      className="w-full max-w-md"
    >
      <AreaChart data={months} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="resting"
          type="monotone"
          stroke="var(--color-resting)"
          strokeWidth={2}
          fill="var(--color-resting)"
          fillOpacity={0.16}
        />
      </AreaChart>
    </ChartContainer>
  )
}
