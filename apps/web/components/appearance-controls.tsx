"use client"

import { PaintBoardIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@applecn/ui/components/dropdown-menu"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@applecn/ui/components/toggle-group"

import type { Platform } from "@applecn/ui/lib/platform"

import { useAppearance } from "@/components/appearance"

export function PlatformSwitch({ className }: { className?: string }) {
  const { platform, setPlatform } = useAppearance()
  return (
    <ToggleGroup
      aria-label="Platform"
      value={[platform]}
      // A toggle group lets its pressed item be pressed off again; the documentation is always
      // being read under some idiom, so a second press on the current one keeps it.
      onValueChange={([next]) => next && setPlatform(next as Platform)}
      className={className}
    >
      <ToggleGroupItem value="ios">iOS</ToggleGroupItem>
      <ToggleGroupItem value="macos">macOS</ToggleGroupItem>
      <ToggleGroupItem value="web">Web</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function AppearanceMenu() {
  const { theme, setTheme } = useTheme()
  const { contrast, setContrast, transparency, setTransparency } =
    useAppearance()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Base UI group labels must sit inside a group or radio group. */}
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(v) => setTheme(String(v))}
        >
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            Automatic
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={contrast}
            onCheckedChange={setContrast}
          >
            Increase Contrast
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={transparency}
            onCheckedChange={setTransparency}
          >
            Reduce Transparency
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
