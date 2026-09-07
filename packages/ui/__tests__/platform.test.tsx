import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"

import { PlatformProvider, usePlatform } from "../src/lib/platform"

function Probe() {
  const platform = usePlatform()
  return <span data-testid="probe">{platform}</span>
}

test("the platform defaults to ios", () => {
  render(<Probe />)
  expect(screen.getByTestId("probe")).toHaveTextContent("ios")
})

test("the provider exposes macos and stamps data-platform on its wrapper", () => {
  render(
    <PlatformProvider platform="macos">
      <Probe />
    </PlatformProvider>
  )
  const probe = screen.getByTestId("probe")
  expect(probe).toHaveTextContent("macos")
  expect(probe.closest("[data-platform]")).toHaveAttribute(
    "data-platform",
    "macos"
  )
  expect(probe.closest("[data-platform]")).toHaveAttribute(
    "data-slot",
    "platform"
  )
})

test('the ios provider stamps data-platform="ios" so nested providers can switch back', () => {
  render(
    <PlatformProvider platform="macos">
      <PlatformProvider platform="ios">
        <Probe />
      </PlatformProvider>
    </PlatformProvider>
  )
  const probe = screen.getByTestId("probe")
  expect(probe).toHaveTextContent("ios")
  expect(probe.closest("[data-platform]")).toHaveAttribute(
    "data-platform",
    "ios"
  )
})

test("the provider accepts the web idiom", () => {
  render(
    <PlatformProvider platform="web">
      <Probe />
    </PlatformProvider>
  )
  expect(screen.getByTestId("probe")).toHaveTextContent("web")
  expect(
    screen.getByTestId("probe").closest("[data-platform]")
  ).toHaveAttribute("data-platform", "web")
})
