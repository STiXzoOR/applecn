import { Material } from '@apple-ds/ui/components/material'
import { Text } from '@apple-ds/ui/components/text'

export default function MaterialBasic() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-4xl bg-[linear-gradient(135deg,var(--system-pink),var(--system-orange),var(--system-teal))] p-4 sm:grid-cols-4">
      {(['ultra-thin', 'thin', 'regular', 'thick'] as const).map((thickness) => (
        <Material key={thickness} thickness={thickness} className="flex h-24 items-center justify-center rounded-3xl">
          <Text variant="subheadline" emphasized>
            {thickness}
          </Text>
        </Material>
      ))}
    </div>
  )
}
