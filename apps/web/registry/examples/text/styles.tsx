import { Text, textStyleNames } from "@apple-ds/ui/components/text"

export default function TextStyles() {
  return (
    <div className="flex flex-col gap-3">
      {textStyleNames.map((name) => (
        <div key={name} className="flex items-baseline gap-4">
          <Text
            variant="caption-1"
            color="label-3"
            className="w-24 shrink-0 tabular-nums"
          >
            {name}
          </Text>
          <Text variant={name}>The quick brown fox</Text>
          <Text variant={name} emphasized>
            jumps over
          </Text>
        </div>
      ))}
    </div>
  )
}
