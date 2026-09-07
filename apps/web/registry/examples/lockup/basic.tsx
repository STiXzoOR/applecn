import {
  PaintBrush01Icon,
  PresentationBarChart01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import { Lockup } from "@applecn/ui/components/lockup"

export default function LockupBasic() {
  return (
    <div className="flex flex-col gap-8">
      <Lockup
        size="small"
        icon={
          <span className="flex size-full items-center justify-center bg-[linear-gradient(135deg,var(--system-pink),var(--system-orange))] text-white">
            <Icon icon={PaintBrush01Icon} scale="large" />
          </span>
        }
        title="Procreate"
        subtitle="Sketch, paint, create."
        action={
          <Button variant="gray" size="small">
            Get
          </Button>
        }
      />
      <Lockup
        size="large"
        icon={
          <span className="flex size-full items-center justify-center bg-[linear-gradient(135deg,var(--system-blue),var(--system-indigo))] text-white">
            <Icon icon={PresentationBarChart01Icon} scale="large" />
          </span>
        }
        title="Keynote"
        subtitle="Build stunning presentations."
        description="Apple · Productivity · Editors’ Choice"
        action={
          <Button variant="filled" size="small">
            Open
          </Button>
        }
      />
    </div>
  )
}
