import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import { ButtonGroup } from "@applecn/ui/components/button-group"
import { Icon } from "@applecn/ui/components/icon"

export default function ButtonGroupBasic() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup aria-label="Navigate">
        <Button variant="gray" aria-label="Back">
          <Icon icon={ArrowLeft01Icon} weight="semibold" />
        </Button>
        <Button variant="gray" aria-label="Forward">
          <Icon icon={ArrowRight01Icon} weight="semibold" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="View">
        <Button variant="gray" size="small">
          Day
        </Button>
        <Button variant="gray" size="small">
          Week
        </Button>
        <Button variant="gray" size="small">
          Month
        </Button>
      </ButtonGroup>
    </div>
  )
}
