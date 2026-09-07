import { Link } from "@applecn/ui/components/link"
import { Text } from "@applecn/ui/components/text"

export default function LinkBasic() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="#" chevron>
          Learn more
        </Link>
        <Link href="#" variant="button">
          Buy
        </Link>
        <Link href="#" variant="quiet">
          Terms of use
        </Link>
      </div>
      <Text color="label-2">
        Body copy with an{" "}
        <Link href="#" variant="quiet">
          inline link
        </Link>{" "}
        that underlines on hover.
      </Text>
    </div>
  )
}
