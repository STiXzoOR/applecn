"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@apple-ds/ui/components/select"
import { Text } from "@apple-ds/ui/components/text"

const repeat = {
  never: "Never",
  daily: "Every Day",
  weekly: "Every Week",
  monthly: "Every Month",
}

export default function SelectBasic() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between rounded-4xl bg-card px-4 py-2">
        <Text>Repeat</Text>
        <Select defaultValue="weekly" items={repeat}>
          <SelectTrigger aria-label="Repeat">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(repeat).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select defaultValue="daily" items={repeat}>
        <SelectTrigger aria-label="Repeat (pop-up)" variant="popup">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(repeat).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
