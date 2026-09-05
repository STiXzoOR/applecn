"use client"

import type { ReactNode } from "react"

import { Button } from "@applecn/ui/components/button"
import { Slider } from "@applecn/ui/components/slider"
import { Switch } from "@applecn/ui/components/switch"
import { Text } from "@applecn/ui/components/text"
import { PlatformProvider } from "@applecn/ui/lib/platform"

interface Proof {
  control: ReactNode
  figure: string
  detail: string
  source: string
}

const proofs: Proof[] = [
  {
    control: (
      <PlatformProvider platform="ios">
        <Switch aria-label="Example switch" defaultChecked />
      </PlatformProvider>
    ),
    figure: "63 × 28 pt",
    detail:
      "The switch, with a 37 × 24 oval knob inset 2 that stretches while pressed.",
    source: "UIKit, iOS 26.5",
  },
  {
    control: (
      <PlatformProvider platform="ios">
        <Slider
          aria-label="Example slider"
          defaultValue={60}
          className="w-40"
        />
      </PlatformProvider>
    ),
    figure: "6 pt track",
    detail:
      "The slider, whose thumb is the same 37 × 24 pill as the switch knob.",
    source: "UIKit, iOS 26.5",
  },
  {
    control: (
      <PlatformProvider platform="ios">
        <div className="flex w-44 flex-col gap-2 rounded-alert glass p-3 shadow-dialog">
          <span className="type-caption-2 font-semibold text-label">
            Delete Note?
          </span>
          <span className="grid grid-cols-2 gap-1.5">
            <span className="h-7 rounded-full bg-fill-3" />
            <span className="h-7 rounded-full bg-fill-3" />
          </span>
        </div>
      </PlatformProvider>
    ),
    figure: "34 pt corners",
    detail: "The alert: 320 wide, glass, capsule actions inset 16 and 8 apart.",
    source: "UIAlertController, iOS 26.5",
  },
  {
    control: (
      <PlatformProvider platform="macos">
        <span className="flex items-center gap-2">
          <Button variant="gray">Cancel</Button>
          <Button>OK</Button>
        </span>
      </PlatformProvider>
    ),
    figure: "24 pt, r 6",
    detail:
      "The push button: a rounded rectangle up to regular, a capsule from large.",
    source: "AppKit, macOS 26.6",
  },
  {
    control: (
      <PlatformProvider platform="web">
        <span className="flex items-center gap-2">
          <Button>Buy</Button>
          <Button variant="bordered">Learn more</Button>
        </span>
      </PlatformProvider>
    ),
    figure: "36 px pill",
    detail:
      "apple.com’s button: 14 px text, 9 × 16 padding, a 980 px radius, #0071e3.",
    source: "apple.com stylesheet",
  },
  {
    control: (
      <PlatformProvider platform="ios">
        <div className="w-40 rounded-list bg-card shadow-card-small">
          <span className="flex h-9 items-center px-4 type-footnote">
            Wi-Fi
          </span>
          <span className="mx-4 block h-[0.5px] bg-separator" />
          <span className="flex h-9 items-center px-4 type-footnote">
            Bluetooth
          </span>
        </div>
      </PlatformProvider>
    ),
    figure: "26 pt corners",
    detail:
      "The inset grouped list: 52 pt rows, 15 × 16 padding, 17 pt semibold headers.",
    source: "UITableView, iOS 26.5",
  },
]

/** Measured, not eyeballed: the controls beside the numbers they were read from. */
export function Evidence() {
  return (
    <section
      data-slot="evidence"
      aria-labelledby="evidence-title"
      className="bg-background-2 px-6 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <Text
            as="h2"
            id="evidence-title"
            variant="title-1"
            emphasized
            className="text-balance"
          >
            Measured, not eyeballed.
          </Text>
          <Text variant="callout" color="label-2" className="text-pretty">
            The iOS and macOS values were read from UIKit and AppKit on device;
            the web from apple.com’s own stylesheet. Every number in the tokens
            names its source.
          </Text>
        </div>
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {proofs.map((proof) => (
            <li key={proof.figure} className="flex flex-col gap-4">
              <div className="flex h-24 items-center">{proof.control}</div>
              <div className="flex flex-col gap-1">
                <Text variant="title-3" emphasized>
                  {proof.figure}
                </Text>
                <Text
                  variant="footnote"
                  color="label-2"
                  className="text-pretty"
                >
                  {proof.detail}
                </Text>
                <Text variant="caption-1" color="label-3">
                  {proof.source}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
