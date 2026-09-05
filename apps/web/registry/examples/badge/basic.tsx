import { Badge } from "@applecn/ui/components/badge"

export default function BadgeBasic() {
  return (
    <div className="flex items-center gap-4">
      <Badge>3</Badge>
      <Badge>128</Badge>
      <Badge variant="tag">New</Badge>
      <Badge variant="filled">Beta</Badge>
    </div>
  )
}
