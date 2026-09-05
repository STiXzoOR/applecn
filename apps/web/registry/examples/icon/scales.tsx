import { Wifi01Icon } from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import { Text } from "@applecn/ui/components/text"

export default function IconScales() {
  return (
    <div className="flex flex-col gap-4">
      {(["small", "medium", "large"] as const).map((scale) => (
        <Text key={scale} variant="body" className="flex items-center gap-2">
          <Icon icon={Wifi01Icon} scale={scale} /> Wi-Fi at the {scale} scale
        </Text>
      ))}
      <Text variant="title-2" className="flex items-center gap-2">
        {(["regular", "semibold", "bold"] as const).map((weight) => (
          <Icon
            key={weight}
            icon={Wifi01Icon}
            weight={weight}
            aria-label={`${weight} weight`}
          />
        ))}
        Regular, semibold, bold
      </Text>
    </div>
  )
}
