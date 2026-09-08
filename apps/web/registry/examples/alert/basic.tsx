import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@applecn/ui/components/alert"
import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"

export default function AlertBasic() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert>
        <Icon icon={CheckmarkCircle02Icon} weight="semibold" />
        <AlertTitle>Backup complete</AlertTitle>
        <AlertDescription>
          All 1,204 photos are up to date in iCloud.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <Icon icon={Alert02Icon} weight="semibold" />
        <AlertTitle>Backup failed</AlertTitle>
        <AlertDescription>
          Not enough iCloud storage to finish.
        </AlertDescription>
        <AlertAction>
          <Button variant="tinted" size="small">
            Retry
          </Button>
        </AlertAction>
      </Alert>
    </div>
  )
}
