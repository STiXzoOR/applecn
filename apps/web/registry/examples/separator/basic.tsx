import { Separator } from "@applecn/ui/components/separator"
import { Text } from "@applecn/ui/components/text"

export default function SeparatorBasic() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-4xl bg-card">
        <Text className="px-4 py-3">Wi-Fi</Text>
        <Separator inset="leading" />
        <Text className="px-4 py-3">Bluetooth</Text>
        <Separator inset="both" />
        <Text className="px-4 py-3">Cellular</Text>
      </div>
      <div className="flex h-6 items-center gap-4">
        <Text variant="subheadline" color="label-2">
          Edit
        </Text>
        <Separator orientation="vertical" />
        <Text variant="subheadline" color="label-2">
          Share
        </Text>
      </div>
    </div>
  )
}
