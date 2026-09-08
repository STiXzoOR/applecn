"use client"

import { useState } from "react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@applecn/ui/components/toggle-group"
import { Text } from "@applecn/ui/components/text"
import { PlatformProvider, type Platform } from "@applecn/ui/lib/platform"

import {
  BrowserFrame,
  IPhoneFrame,
  MacFrame,
} from "@/components/landing/device"
import { IosScreen, MacScreen, WebScreen } from "@/components/landing/screens"

const idioms: { value: Platform; label: string; blurb: string }[] = [
  {
    value: "ios",
    label: "iOS 26",
    blurb:
      "Liquid Glass bars, the 63 × 28 switch with its oval knob, 26 pt grouped lists, 34 pt alerts.",
  },
  {
    value: "macos",
    label: "macOS 26",
    blurb:
      "Tahoe’s 24 pt controls with 6 pt corners, 54 × 24 switches, 16 pt checkboxes, AppKit’s 85 % label.",
  },
  {
    value: "web",
    label: "Web",
    blurb:
      "apple.com’s 980 px pills, 17/25 body with SF Pro tracking, #1d1d1f on white, #0071e3 buttons.",
  },
]

/**
 * Three idioms, one switch: the same components in an iPhone, a Mac window and a browser,
 * each under its own PlatformProvider, so the switch swaps every metric at once.
 */
export function Showcase() {
  const [platform, setPlatform] = useState<Platform>("ios")
  const idiom = idioms.find((i) => i.value === platform)!
  return (
    <section
      data-slot="showcase"
      aria-label="Showcase"
      className="relative isolate overflow-hidden px-4 pt-6 pb-16 motion-safe:animate-in motion-safe:duration-1000 motion-safe:ease-(--ease-standard) motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-24 -z-10 mx-auto h-[640px] max-w-6xl rounded-[4rem] opacity-90 blur-2xl"
        style={{
          backgroundImage:
            "conic-gradient(from 200deg at 50% 40%, var(--system-blue), var(--system-indigo), var(--system-pink), var(--system-orange), var(--system-teal), var(--system-blue))",
        }}
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        {/* The glass sits behind the track rather than on it: the fill is translucent, and one
            element cannot carry both backgrounds. */}
        <div className="w-full max-w-sm rounded-segmented glass">
          <ToggleGroup
            aria-label="Platform"
            value={[platform]}
            onValueChange={([value]) => value && setPlatform(value as Platform)}
            className="w-full"
          >
            {idioms.map((i) => (
              <ToggleGroupItem key={i.value} value={i.value}>
                {i.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Text
          variant="footnote"
          color="label-2"
          className="max-w-xl text-center text-pretty"
        >
          {idiom.blurb}
        </Text>
        <div
          key={platform}
          className="flex w-full justify-center motion-safe:animate-in motion-safe:duration-500 motion-safe:ease-(--ease-standard) motion-safe:fade-in-0 motion-safe:zoom-in-95"
        >
          {platform === "ios" ? (
            <PlatformProvider platform="ios">
              <IPhoneFrame>
                <IosScreen />
              </IPhoneFrame>
            </PlatformProvider>
          ) : platform === "macos" ? (
            <PlatformProvider platform="macos">
              <MacFrame>
                <MacScreen />
              </MacFrame>
            </PlatformProvider>
          ) : (
            <PlatformProvider platform="web">
              <BrowserFrame>
                <WebScreen />
              </BrowserFrame>
            </PlatformProvider>
          )}
        </div>
      </div>
    </section>
  )
}
