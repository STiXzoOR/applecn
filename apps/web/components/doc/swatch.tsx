import { Text } from "@applecn/ui/components/text"

export function Swatch({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className="h-14 rounded-2xl hairline"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
      <Text variant="caption-1" className="mt-1.5">
        {name}
      </Text>
      <Text variant="caption-2" color="label-2" className="tabular-nums">
        {value}
      </Text>
    </div>
  )
}
