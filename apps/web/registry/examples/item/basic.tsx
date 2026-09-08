"use client"

import {
  Airplane01Icon,
  ArrowRight01Icon,
  Bluetooth,
  Wifi01Icon,
} from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@applecn/ui/components/item"
import { Switch } from "@applecn/ui/components/switch"

export default function ItemBasic() {
  return (
    <div className="overflow-hidden rounded-list bg-card">
      <ItemGroup>
        <Item>
          <ItemMedia className="bg-system-orange text-white">
            <Icon icon={Airplane01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Airplane Mode</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Switch aria-label="Airplane Mode" />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item render={<a href="#wi-fi" />}>
          <ItemMedia className="bg-system-blue text-white">
            <Icon icon={Wifi01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Wi-Fi</ItemTitle>
            <ItemDescription>Home</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon
              icon={ArrowRight01Icon}
              weight="semibold"
              className="text-label-3"
            />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item render={<a href="#bluetooth" />}>
          <ItemMedia className="bg-system-blue text-white">
            <Icon icon={Bluetooth} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Bluetooth</ItemTitle>
            <ItemDescription>On</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon
              icon={ArrowRight01Icon}
              weight="semibold"
              className="text-label-3"
            />
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}
