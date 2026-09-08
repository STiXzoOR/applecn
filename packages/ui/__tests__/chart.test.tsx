import { render, screen } from "@testing-library/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts"
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../src/components/chart"
import { checkA11y } from "./helpers/axe"

const config = {
  steps: { label: "Steps", color: "var(--chart-1)" },
  flights: { label: "Flights", color: "var(--chart-2)" },
} satisfies ChartConfig

/**
 * recharts sizes itself from the container's `getBoundingClientRect()`, and jsdom has no layout,
 * so every box measures 0 × 0 — `ResponsiveContainer` then renders NOTHING at all rather than a
 * zero-sized chart. Without a size the marks, the tooltip and the legend never mount, so the
 * container is told it is 320 × 200: recharts' own `initialDimension`, which the effect would
 * otherwise overwrite with the zero it reads back. Nothing here asserts a pixel; the size only
 * buys a rendered tree to make assertions against.
 */
const CHART_BOX = { width: 320, height: 200 }
let measure: typeof Element.prototype.getBoundingClientRect

beforeAll(() => {
  measure = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function boundingBox() {
    return {
      ...CHART_BOX,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: CHART_BOX.width,
      bottom: CHART_BOX.height,
      toJSON: () => CHART_BOX,
    } as DOMRect
  }
})

afterAll(() => {
  Element.prototype.getBoundingClientRect = measure
})

const data = [
  { day: "Mon", steps: 6200, flights: 4 },
  { day: "Tue", steps: 8100, flights: 9 },
  { day: "Wed", steps: 7400, flights: 6 },
]

describe("Chart", () => {
  test("is a container carrying shadcn's slot and a chart id its style block can select", () => {
    render(
      <ChartContainer config={config} data-testid="chart">
        <LineChart data={data}>
          <Line dataKey="steps" stroke="var(--color-steps)" />
        </LineChart>
      </ChartContainer>
    )
    const container = screen.getByTestId("chart")
    expect(container).toHaveAttribute("data-slot", "chart")
    expect(container.getAttribute("data-chart")).toMatch(/^chart-/)
  })

  test("axis text and grid read Apple's secondary label and separator, not shadcn's muted pair", () => {
    render(
      <ChartContainer config={config} data-testid="chart">
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="day" />
          <Line dataKey="steps" />
        </LineChart>
      </ChartContainer>
    )
    const className = screen.getByTestId("chart").className
    expect(className).toContain(
      "[&_.recharts-cartesian-axis-tick_text]:fill-label-2"
    )
    expect(className).toContain(
      "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-separator"
    )
    expect(className).toContain("type-caption-2")
  })

  test("the axis rule reaches the element recharts 3.8 actually puts the tick text in", () => {
    render(
      <ChartContainer config={config} data-testid="chart">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <Line dataKey="steps" />
        </LineChart>
      </ChartContainer>
    )
    // shadcn's selector is `.recharts-cartesian-axis-tick text`, and in recharts 3.8 that
    // <g> is empty: the label moved out to `.recharts-cartesian-axis-tick-label`, and the
    // text itself carries `.recharts-cartesian-axis-tick-value`. Selecting the text's own
    // class is the one form that holds whichever group it sits in.
    const tick = screen
      .getByTestId("chart")
      .querySelector(".recharts-cartesian-axis-tick-value")
    expect(tick).not.toBeNull()
    expect(screen.getByTestId("chart").className).toContain(
      "[&_.recharts-cartesian-axis-tick-value]:fill-label-2"
    )
  })

  test("bar and area compose in the same container", () => {
    const { rerender } = render(
      <ChartContainer config={config} data-testid="chart">
        <BarChart data={data}>
          <Bar dataKey="steps" />
        </BarChart>
      </ChartContainer>
    )
    expect(
      screen.getByTestId("chart").querySelector(".recharts-bar")
    ).not.toBeNull()
    rerender(
      <ChartContainer config={config} data-testid="chart">
        <AreaChart data={data}>
          <Area dataKey="steps" />
        </AreaChart>
      </ChartContainer>
    )
    expect(
      screen.getByTestId("chart").querySelector(".recharts-area")
    ).not.toBeNull()
  })
})

describe("ChartStyle", () => {
  test("writes each series colour as --color-<key>, once per appearance", () => {
    const { container } = render(<ChartStyle id="chart-x" config={config} />)
    const css = container.querySelector("style")!.innerHTML
    expect(css).toContain("[data-chart=chart-x] {")
    expect(css).toContain("--color-steps: var(--chart-1);")
    expect(css).toContain("--color-flights: var(--chart-2);")
    expect(css).toContain(".dark [data-chart=chart-x] {")
  })

  test("renders nothing when no series carries a colour", () => {
    const { container } = render(
      <ChartStyle id="chart-x" config={{ steps: { label: "Steps" } }} />
    )
    expect(container.querySelector("style")).toBeNull()
  })
})

describe("ChartTooltipContent", () => {
  test("is a material card on the platform's popover corner, with Apple's own tabular figures", () => {
    const { container } = render(
      <ChartContainer config={config}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <ChartTooltip
            active
            defaultIndex={1}
            content={<ChartTooltipContent />}
          />
          <Line dataKey="steps" />
        </LineChart>
      </ChartContainer>
    )
    const tip = container.querySelector(".recharts-tooltip-wrapper > div")!
    expect(tip.className).toContain("rounded-popover")
    expect(tip.className).toContain("material-regular")
    expect(tip.className).toContain("shadow-glass")
    const value = screen.getByText(/^8[,. ]100$/)
    expect(value.className).toContain("tabular-nums")
    // Apple sets figures in SF with tabular numbers, not in a monospaced face.
    expect(value.className).not.toContain("font-mono")
  })

  test("reads the series label out of the config rather than the raw data key", () => {
    const { container } = render(
      <ChartContainer config={config}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <ChartTooltip
            active
            defaultIndex={1}
            content={<ChartTooltipContent />}
          />
          <Line dataKey="steps" />
        </LineChart>
      </ChartContainer>
    )
    const tip = container.querySelector(".recharts-tooltip-wrapper > div")!
    // The header is the x value; the row is the config's label for the series, not `steps`.
    expect(tip.firstElementChild!.textContent).toBe("Tue")
    expect(screen.getByText("Steps").className).toContain("text-label-2")
  })
})

describe("ChartLegendContent", () => {
  test("marks each series with Apple's dot rather than shadcn's square", () => {
    render(
      <ChartContainer config={config} data-testid="chart">
        <LineChart data={data}>
          <ChartLegend
            content={
              <ChartLegendContent
                payload={[
                  { dataKey: "steps", value: "steps", color: "var(--chart-1)" },
                ]}
              />
            }
          />
          <Line dataKey="steps" />
        </LineChart>
      </ChartContainer>
    )
    const swatch = screen.getByText("Steps").querySelector("[style]")!
    expect(swatch.className).toContain("rounded-full")
  })
})

describe("Chart accessibility", () => {
  test("a named chart has no violations", async () => {
    const { container } = render(
      <ChartContainer
        config={config}
        role="img"
        aria-label="Steps taken each day this week"
      >
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid />
          <XAxis dataKey="day" />
          <Line dataKey="steps" stroke="var(--color-steps)" />
        </LineChart>
      </ChartContainer>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})
