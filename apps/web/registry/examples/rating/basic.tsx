"use client"

import { useState } from "react"

import { Rating } from "@applecn/ui/components/rating"
import { Text } from "@applecn/ui/components/text"

export default function RatingBasic() {
  const [value, setValue] = useState(4)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Rating value={4.5} label="Average rating" />
        <Text variant="footnote" color="label-2">
          4.5 · 12K Ratings
        </Text>
      </div>
      <div className="flex items-center gap-3">
        <Rating
          value={value}
          label="Your rating"
          size="large"
          onValueChange={setValue}
        />
        <Text variant="footnote" color="label-2">
          Tap to Rate
        </Text>
      </div>
    </div>
  )
}
