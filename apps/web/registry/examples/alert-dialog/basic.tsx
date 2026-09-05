"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@apple-ds/ui/components/alert-dialog"
import { Button } from "@apple-ds/ui/components/button"

export default function AlertDialogBasic() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Note
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete Note?</AlertDialogTitle>
        <AlertDialogDescription>
          This note will be moved to Recently Deleted.
        </AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" preferred>
            Delete
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  )
}
