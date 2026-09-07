import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
