import { Button } from "@applecn/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@applecn/ui/components/card"
import { Progress } from "@applecn/ui/components/progress"

export default function CardBasic() {
  return (
    <div className="rounded-4xl bg-grouped-background-1 p-4">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>iPhone Storage</CardTitle>
          <CardDescription>52.4 GB of 128 GB used</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={41} aria-label="Storage used" />
        </CardContent>
        <CardFooter>
          <Button size="small" variant="tinted">
            Manage Storage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
