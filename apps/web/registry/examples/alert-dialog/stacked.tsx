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
} from "@applecn/ui/components/alert-dialog"
import { Button } from "@applecn/ui/components/button"

export default function AlertDialogStacked() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="gray" />}>
        Close Document
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Save changes to “Untitled”?</AlertDialogTitle>
        <AlertDialogDescription>
          Your changes will be lost if you don’t save them.
        </AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogAction preferred>Save</AlertDialogAction>
          <AlertDialogAction variant="destructive">
            Don’t Save
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  )
}
