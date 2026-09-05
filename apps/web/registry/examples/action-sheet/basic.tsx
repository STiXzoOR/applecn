'use client'

import {
  ActionSheet,
  ActionSheetAction,
  ActionSheetCancel,
  ActionSheetContent,
  ActionSheetTrigger,
} from '@apple-ds/ui/components/action-sheet'
import { Button } from '@apple-ds/ui/components/button'

export default function ActionSheetBasic() {
  return (
    <ActionSheet>
      <ActionSheetTrigger render={<Button variant="gray" />}>Close Draft</ActionSheetTrigger>
      <ActionSheetContent title="Unsaved Draft" message="You can save it and finish later.">
        <ActionSheetAction destructive>Delete Draft</ActionSheetAction>
        <ActionSheetAction>Save Draft</ActionSheetAction>
        <ActionSheetCancel>Cancel</ActionSheetCancel>
      </ActionSheetContent>
    </ActionSheet>
  )
}
