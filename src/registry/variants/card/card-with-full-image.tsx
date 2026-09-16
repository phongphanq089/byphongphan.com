import { ArrowRightIcon, BellIcon } from "lucide-react"

import { Badge, Button, Card, CardContent } from "@/shared/ui"

//Card with full image
export function CardWithFullImage() {
  return (
    <Card className="w-full max-w-xs overflow-hidden p-0">
      <CardContent className="flex flex-col gap-5 p-0!">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src="https://picsum.photos/1000/800?grayscale&random=52"
            alt="16:9"
            width={1000}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center gap-4 p-6 pt-0">
          <Badge variant="outline">
            <BellIcon aria-hidden="true" />
            Trending
          </Badge>

          <p className="text-center text-sm text-foreground">
            Making your design process faster and easier. Design tools for your
            team.
          </p>

          <Button className="w-fit">
            Get Started
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
