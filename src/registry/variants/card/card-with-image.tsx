import { ArrowRightIcon, BellIcon, TreePalmIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"

export function CardWithImage() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <img
            src="https://picsum.photos/1000/800?grayscale&random=18"
            alt="16:9"
            width={1000}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between gap-5">
          <Badge variant="outline">
            <BellIcon aria-hidden="true" />
            Trending
          </Badge>
          <div className="flex items-center gap-1">
            <TreePalmIcon aria-hidden="true" />
            <span className="text-xs font-medium text-secondary-foreground">
              Featured
            </span>
          </div>
        </div>
        <p className="text-sm text-foreground">
          Simplifying your workflow from day one. Manage your tasks, projects,
          and team in one place.
        </p>
        <Button>
          Get Started
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default CardWithImage
