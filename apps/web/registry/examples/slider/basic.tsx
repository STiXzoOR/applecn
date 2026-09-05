"use client"

import { Sun01Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import { Slider } from "@applecn/ui/components/slider"

export default function SliderBasic() {
  return (
    <div className="flex flex-col gap-6">
      <Slider aria-label="Volume" defaultValue={40} />
      <Slider
        aria-label="Brightness"
        defaultValue={70}
        minimumValueLabel={<Icon icon={Sun01Icon} />}
        maximumValueLabel={<Icon icon={Sun03Icon} scale="large" />}
      />
    </div>
  )
}
