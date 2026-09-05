import { Home01Icon } from "@hugeicons/core-free-icons"

import { Glass } from "@apple-ds/ui/components/glass"
import { Icon } from "@apple-ds/ui/components/icon"
import { Text } from "@apple-ds/ui/components/text"

export default function GlassBasic() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-4xl bg-[linear-gradient(135deg,var(--system-indigo),var(--system-cyan))] p-6">
      <Glass className="px-5 py-3">
        <Text variant="body" emphasized color="inherit">
          Regular
        </Text>
      </Glass>
      <Glass variant="clear" className="px-5 py-3 text-white">
        <Text variant="body" emphasized color="inherit">
          Clear
        </Text>
      </Glass>
      <Glass variant="prominent" className="px-5 py-3">
        <Text variant="body" emphasized color="inherit">
          Prominent
        </Text>
      </Glass>
      <Glass
        shape="circle"
        interactive
        className="flex size-11 items-center justify-center"
      >
        <Icon icon={Home01Icon} aria-label="Home" />
      </Glass>
    </div>
  )
}
