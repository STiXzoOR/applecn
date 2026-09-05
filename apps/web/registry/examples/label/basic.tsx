import { Input } from "@applecn/ui/components/input"
import { Label } from "@applecn/ui/components/label"

export default function LabelBasic() {
  return (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="label-name">Name</Label>
      <Input id="label-name" placeholder="Required" />
    </div>
  )
}
