import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  avatarVariants,
} from "../src/components/avatar"
import { Checkbox } from "../src/components/checkbox"
import { Kbd, KbdGroup } from "../src/components/kbd"
import { Label } from "../src/components/label"
import { Skeleton } from "../src/components/skeleton"

describe("Skeleton", () => {
  test("is a pulsing placeholder hidden from assistive technology", () => {
    render(<Skeleton data-testid="s" className="h-4 w-24" />)
    const s = screen.getByTestId("s")
    expect(s).toHaveAttribute("aria-hidden", "true")
    expect(s.className).toContain("bg-fill-3")
    expect(s.className).toContain("animate-pulse")
    expect(s.className).toContain("motion-reduce:animate-none")
  })
})

describe("Avatar", () => {
  test("shows the monogram until an image loads", () => {
    render(
      <Avatar size="large">
        <AvatarImage src="" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )
    const fallback = screen.getByText("AL")
    expect(fallback).toHaveAttribute("data-slot", "avatar-fallback")
    expect(fallback.closest('[data-slot="avatar"]')!.className).toContain(
      "rounded-full"
    )
    expect(avatarVariants({ size: "large" })).toContain("size-16")
    expect(avatarVariants({ size: "small" })).toContain("size-7")
  })
})

describe("Kbd", () => {
  test("is a keyboard key on the tertiary fill", () => {
    render(<Kbd>⌘</Kbd>)
    const k = screen.getByText("⌘")
    expect(k.tagName).toBe("KBD")
    expect(k.className).toContain("bg-fill-3")
    expect(k.className).toContain("type-caption-1")
  })

  test("KbdGroup lines up the keys of one shortcut", () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    )
    const group = screen.getByText("⌘").closest('[data-slot="kbd-group"]')!
    expect(group).not.toBeNull()
    expect(group.className).toContain("inline-flex")
    expect(group.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2)
  })
})

describe("Label", () => {
  test("dims with the control it wraps, which Base UI renders as a span rather than a disabled input", () => {
    render(
      <Label>
        <Checkbox aria-label="Unavailable" disabled /> Unavailable
      </Label>
    )
    const label = screen.getByText("Unavailable", { selector: "label" })
    // `peer-*` needs a preceding sibling, and `:disabled` never matches a span.
    expect(label.className).not.toContain("peer-disabled:")
    expect(label.className).toContain("has-data-disabled:opacity-40")
    expect(label.className).toContain("has-data-disabled:cursor-not-allowed")
  })
})
