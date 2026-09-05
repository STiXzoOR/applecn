import { Button } from "@applecn/ui/components/button"

export default function ButtonStyles() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Filled</Button>
      <Button variant="tinted">Tinted</Button>
      <Button variant="gray">Gray</Button>
      <Button variant="bordered">Bordered</Button>
      <Button variant="plain">Plain</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Learn More</Button>
      <div className="flex gap-3 rounded-4xl bg-[linear-gradient(135deg,var(--system-purple),var(--system-pink))] p-4">
        <Button variant="glass">Glass</Button>
        <Button variant="glass-prominent">Prominent</Button>
      </div>
    </div>
  )
}
