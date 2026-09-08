"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@applecn/ui/components/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const config = {
  screen: { label: "Screen time (h)", color: "var(--chart-4)" },
} satisfies ChartConfig

const week = [
  { day: "Mon", screen: 3.2 },
  { day: "Tue", screen: 4.1 },
  { day: "Wed", screen: 2.8 },
  { day: "Thu", screen: 5.4 },
  { day: "Fri", screen: 4.7 },
  { day: "Sat", screen: 6.2 },
  { day: "Sun", screen: 5.1 },
]

export default function ChartBar() {
  return (
    <ChartContainer
      config={config}
      role="img"
      aria-label="Screen time each day this week"
      className="w-full max-w-md"
    >
      <BarChart data={week} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
        {/* The bar takes the platform's small control corner, as a Swift Charts bar does. */}
        <Bar dataKey="screen" fill="var(--color-screen)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}
