import { Label } from "@applecn/ui/components/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@applecn/ui/components/native-select"

export default function NativeSelectBasic() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort-by">Sort By</Label>
        <NativeSelect id="sort-by" defaultValue="added">
          <NativeSelectOption value="name">Name</NativeSelectOption>
          <NativeSelectOption value="kind">Kind</NativeSelectOption>
          <NativeSelectOptGroup label="Dates">
            <NativeSelectOption value="added">Date Added</NativeSelectOption>
            <NativeSelectOption value="modified">
              Date Modified
            </NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="group-by">Group By</Label>
        <NativeSelect id="group-by" size="sm" defaultValue="none">
          <NativeSelectOption value="none">None</NativeSelectOption>
          <NativeSelectOption value="app">Application</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  )
}
