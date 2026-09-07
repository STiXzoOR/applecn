"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuEyebrow,
  NavigationMenuFlyoutLink,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@applecn/ui/components/navigation-menu"

export default function NavigationMenuBasic() {
  return (
    <NavigationMenu aria-label="Global" className="rounded-t-card">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Mac</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div>
              <NavigationMenuEyebrow>Explore Mac</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#" prominent>
                Explore All Mac
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#" prominent>
                MacBook Air
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#" prominent>
                MacBook Pro
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#" prominent>
                iMac
              </NavigationMenuFlyoutLink>
            </div>
            <div>
              <NavigationMenuEyebrow>Shop Mac</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#">
                Shop Mac
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                Mac Accessories
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                Apple Trade In
              </NavigationMenuFlyoutLink>
            </div>
            <div>
              <NavigationMenuEyebrow>More from Mac</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#">
                Mac Support
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                macOS Tahoe
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                Continuity
              </NavigationMenuFlyoutLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>iPad</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div>
              <NavigationMenuEyebrow>Explore iPad</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#" prominent>
                Explore All iPad
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#" prominent>
                iPad Pro
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#" prominent>
                iPad Air
              </NavigationMenuFlyoutLink>
            </div>
            <div>
              <NavigationMenuEyebrow>Shop iPad</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#">
                Shop iPad
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                iPad Accessories
              </NavigationMenuFlyoutLink>
            </div>
            <div>
              <NavigationMenuEyebrow>More from iPad</NavigationMenuEyebrow>
              <NavigationMenuFlyoutLink href="#">
                iPad Support
              </NavigationMenuFlyoutLink>
              <NavigationMenuFlyoutLink href="#">
                iPadOS 26
              </NavigationMenuFlyoutLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">iPhone</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Watch</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Support</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
