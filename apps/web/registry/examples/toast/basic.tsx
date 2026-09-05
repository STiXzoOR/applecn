"use client"

import { Message01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import { Toaster, useToast } from "@applecn/ui/components/toast"

const messageIcon = <Icon icon={Message01Icon} />

function Notify() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast.add({
            title: "Messages",
            description: "Ada: Running five minutes late, order without me.",
            data: { icon: messageIcon },
          })
        }
      >
        Notify
      </Button>
      <Button
        variant="gray"
        onClick={() =>
          toast.add({
            title: "Download complete",
            description: "Keynote.dmg is ready to open.",
            actionProps: { children: "Open" },
          })
        }
      >
        With action
      </Button>
    </div>
  )
}

export default function ToastBasic() {
  return (
    <Toaster>
      <Notify />
    </Toaster>
  )
}
