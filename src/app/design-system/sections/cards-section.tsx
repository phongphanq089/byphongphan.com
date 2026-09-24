import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { BlockCard } from "@/features/blocks/components/block-card"
import { ComponentCard } from "@/features/component-ui/components/component-card"
import { COMPONENTS_DATA } from "@/features/component-ui/components-data"
import { XGradientCard } from "@/shared/ui/animation/x-gradient-card"
import { Button } from "@/shared/ui/core/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/core/card"

import { ShowcaseCard } from "../components/showcase-card"

export function CardsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 1. Production Block Card */}
      <ShowcaseCard
        title="Production Block Card"
        description="2-Column widescreen section preview card with mockup viewport header"
        tag="Blocks"
      >
        <div className="w-full max-w-sm">
          <BlockCard block={BLOCKS_DATA[0]} />
        </div>
      </ShowcaseCard>

      {/* 2. Component UI Card */}
      <ShowcaseCard
        title="Component UI Card"
        description="Primitive UI card with category count, copy name action and schematic"
        tag="Components"
      >
        <div className="w-full max-w-sm">
          <ComponentCard component={COMPONENTS_DATA[0]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        title="Standard Card Primitive"
        description="Shadcn styled container with header, content & footer"
        tag="Core"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-base">Project Card</CardTitle>
            <CardDescription className="text-xs">
              Fullstack web application setup
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Structured components with type safety and reactive state.
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm">Deploy</Button>
          </CardFooter>
        </Card>
      </ShowcaseCard>

      <ShowcaseCard
        title="X-Gradient Card"
        description="Complex radial and linear backdrop gradient container"
        tag="Animation"
        className="md:col-span-2"
      >
        <div className="w-full max-w-lg">
          <XGradientCard
            authorName="PHONG PHAN"
            authorHandle="phongphan"
            authorImage="https://api.dicebear.com/10.x/bottts-neutral/svg?seed=7jt3bo28"
            content={[
              "Fullstack Architect & Creative Developer building scalable web systems with React 19 & Tailwind CSS v4.",
            ]}
            link="https://github.com/phongphanq089"
            timestamp="Just now"
            isVerified
          />
        </div>
      </ShowcaseCard>
    </div>
  )
}
