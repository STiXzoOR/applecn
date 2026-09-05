import { Button } from "@applecn/ui/components/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="mini">Mini</Button>
      <Button size="small">Small</Button>
      <Button size="regular">Regular</Button>
      <Button size="large">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  )
}
