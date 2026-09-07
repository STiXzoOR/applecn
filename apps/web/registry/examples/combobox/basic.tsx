"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@applecn/ui/components/combobox"

const cities = [
  "Cupertino",
  "Copenhagen",
  "Cork",
  "London",
  "Munich",
  "Singapore",
  "Sydney",
  "Tokyo",
]

export default function ComboboxBasic() {
  return (
    <div className="max-w-xs">
      <Combobox items={cities}>
        <ComboboxInput aria-label="City" placeholder="City" />
        <ComboboxContent>
          <ComboboxEmpty>No cities found.</ComboboxEmpty>
          <ComboboxList>
            {(city: string) => (
              <ComboboxItem key={city} value={city}>
                {city}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
