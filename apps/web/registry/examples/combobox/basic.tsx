"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
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
          <ComboboxGroup>
            <ComboboxGroupLabel>Cities</ComboboxGroupLabel>
            <ComboboxList>
              {(city: string) => (
                <ComboboxItem key={city} value={city}>
                  {city}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxGroup>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
