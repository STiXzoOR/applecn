"use client"

import { PaintBoardIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@applecn/ui/components/menu"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@applecn/ui/components/segmented-control"

import type { Platform } from "@applecn/ui/lib/platform"

import { useAppearance } from "@/components/appearance"

export function PlatformSwitch({ className }: { className?: string }) {
  const { platform, setPlatform } = useAppearance()
  return (
    <SegmentedControl
      aria-label="Platform"
      value={platform}
      onValueChange={(v) => setPlatform(v as Platform)}
      className={className}
    >
      <SegmentedControlItem value="ios">iOS</SegmentedControlItem>
      <SegmentedControlItem value="macos">macOS</SegmentedControlItem>
      <SegmentedControlItem value="web">Web</SegmentedControlItem>
    </SegmentedControl>
  )
}

export function AppearanceMenu() {
  const { theme, setTheme } = useTheme()
  const { contrast, setContrast, transparency, setTransparency } =
    useAppearance()
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="gray"
            shape="circle"
            size="small"
            aria-label="Appearance"
          />
        }
      >
        <Icon icon={PaintBoardIcon} />
      </MenuTrigger>
      <MenuContent align="end">
        {/* Base UI group labels must sit inside a group or radio group. */}
        <MenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(v) => setTheme(String(v))}
        >
          <MenuLabel>Appearance</MenuLabel>
          <MenuRadioItem value="light">Light</MenuRadioItem>
          <MenuRadioItem value="dark">Dark</MenuRadioItem>
          <MenuRadioItem value="system">Automatic</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuLabel>Accessibility</MenuLabel>
          <MenuCheckboxItem checked={contrast} onCheckedChange={setContrast}>
            Increase Contrast
          </MenuCheckboxItem>
          <MenuCheckboxItem
            checked={transparency}
            onCheckedChange={setTransparency}
          >
            Reduce Transparency
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}
