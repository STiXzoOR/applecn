import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  avatarVariants,
} from "../src/components/avatar"
import { Kbd } from "../src/components/kbd"
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
})
