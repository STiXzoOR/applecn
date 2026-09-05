import { Add01Icon, Share01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"

export default function ButtonShapes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button shape="capsule">
        <Icon icon={Share01Icon} /> Share
      </Button>
      <Button shape="rounded" variant="tinted">
        Rounded
      </Button>
      <Button shape="circle" variant="gray" aria-label="Add">
        <Icon icon={Add01Icon} weight="semibold" />
      </Button>
      <Button shape="circle" size="small" variant="tinted" aria-label="Share">
        <Icon icon={Share01Icon} />
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
