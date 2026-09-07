import { tokenPlatformCss } from "@applecn/ui/tokens/css"
import { platforms, type Platform } from "@applecn/ui/tokens/metrics"

import type { RegistryItem } from "./registry-data.ts"

const TITLES: Readonly<Record<Platform, string>> = {
  ios: "iOS",
  macos: "macOS",
  web: "Web",
}

const DESCRIPTIONS: Readonly<Record<Platform, string>> = {
  ios: "Just the iOS idiom's tokens: AppKit-free colours, type, control metrics and shape.",
  macos:
    "Just the macOS idiom's tokens: AppKit colours, type, control metrics and shape.",
  web: "Just the web idiom's tokens: apple.com's colours, responsive type ramp, control metrics and shape.",
}

/**
 * Three `registry:theme` items — `ios`, `macos`, `web` — each carrying one idiom's scope of
 * `tokenPlatformCss()`, so a project that only ever runs one idiom can install just that
 * scope instead of the `apple` style item's full three-idiom `css`.
 */
export function themeItems(): RegistryItem[] {
  return platforms.map((platform) => ({
    name: platform,
    type: "registry:theme",
    title: TITLES[platform],
    description: DESCRIPTIONS[platform],
    files: [],
    css: tokenPlatformCss(platform),
  }))
}
