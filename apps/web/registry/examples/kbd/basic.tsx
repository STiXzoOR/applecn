import { Kbd } from '@apple-ds/ui/components/kbd'
import { Text } from '@apple-ds/ui/components/text'

export default function KbdBasic() {
  return (
    <Text className="flex items-center gap-2">
      Press <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>S</Kbd> to save a copy.
    </Text>
  )
}
