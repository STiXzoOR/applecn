"use client"

import { Share01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@applecn/ui/components/tooltip"

export default function TooltipBasic() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="gray" shape="circle" aria-label="Share" />}
        >
          <Icon icon={Share01Icon} />
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
