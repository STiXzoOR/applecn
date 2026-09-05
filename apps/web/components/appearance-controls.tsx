"use client"

import { PaintBoardIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

import { Button } from "@apple-ds/ui/components/button"
import { Icon } from "@apple-ds/ui/components/icon"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@apple-ds/ui/components/menu"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@apple-ds/ui/components/segmented-control"

import { useAppearance } from "@/components/appearance"

export function PlatformSwitch({ className }: { className?: string }) {
  const { platform, setPlatform } = useAppearance()
  return (
    <SegmentedControl
      aria-label="Platform"
      value={platform}
      onValueChange={(v) => setPlatform(v as "ios" | "macos")}
      className={className}
    >
      <SegmentedControlItem value="ios">iOS</SegmentedControlItem>
      <SegmentedControlItem value="macos">macOS</SegmentedControlItem>
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
        <MenuLabel>Appearance</MenuLabel>
        <MenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(v) => setTheme(String(v))}
        >
          <MenuRadioItem value="light">Light</MenuRadioItem>
          <MenuRadioItem value="dark">Dark</MenuRadioItem>
          <MenuRadioItem value="system">Automatic</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
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
      </MenuContent>
    </Menu>
  )
}
