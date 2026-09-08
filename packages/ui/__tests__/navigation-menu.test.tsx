import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../src/components/navigation-menu"

describe("NavigationMenu", () => {
  test("is apple.com's global nav: a 44 pt glass bar of small links, with flyout panels", async () => {
    render(
      <NavigationMenu aria-label="Global">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Store</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/shop">
                Shop the Latest
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/support">Support</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    const nav = screen.getByRole("navigation", { name: "Global" })
    expect(nav).toHaveAttribute("data-slot", "navigation-menu")
    expect(nav.className).toContain("h-(--nav-bar-height)")
    expect(nav.className).toContain("material-regular")
    const support = screen.getByRole("link", { name: "Support" })
    expect(support.className).toContain("type-caption-1")
    const store = screen.getByRole("button", { name: "Store" })
    await userEvent.click(store)
    const link = await screen.findByRole("link", { name: "Shop the Latest" })
    expect(link.closest('[data-slot="navigation-menu-content"]')).not.toBeNull()
  })
})

describe("navigationMenuTriggerStyle", () => {
  test("is the class the bar's triggers and links both wear", () => {
    expect(navigationMenuTriggerStyle()).toContain("h-(--nav-bar-height)")
    expect(navigationMenuTriggerStyle()).toContain("type-caption-1")
  })
})

describe("NavigationMenuIndicator", () => {
  test("marks the item whose panel is open", async () => {
    render(
      <NavigationMenu aria-label="Global">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Store</NavigationMenuTrigger>
            <NavigationMenuIndicator />
            <NavigationMenuContent>
              <NavigationMenuLink href="/shop">Shop</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    const indicator = document.querySelector(
      '[data-slot="navigation-menu-indicator"]'
    )!
    expect(indicator).not.toBeNull()
    expect(indicator).toHaveAttribute("aria-hidden", "true")
    await userEvent.click(screen.getByRole("button", { name: "Store" }))
    expect(indicator).toHaveAttribute("data-popup-open")
  })
})
