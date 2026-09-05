import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@applecn/ui/components/avatar"

export default function AvatarBasic() {
  return (
    <div className="flex items-end gap-4">
      <Avatar size="small">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=5" alt="Grace Hopper" />
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>KJ</AvatarFallback>
      </Avatar>
    </div>
  )
}
