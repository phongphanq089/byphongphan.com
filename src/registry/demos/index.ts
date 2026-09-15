import type React from "react"

import { AnimatedGlowCardDemo } from "./animated-glow-card-demo"
import { BadgeDemo } from "./badge-demo"
import { ButtonDemo } from "./button-demo"
import { CardDemo } from "./card-demo"
import { CodeBlockDemo } from "./code-block-demo"
import { SelectDemo } from "./select-demo"
import { SeparatorDemo } from "./separator-demo"
import { UnboxingBucketDemo } from "./unboxing-bucket-demo"

export {
  AnimatedGlowCardDemo,
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CodeBlockDemo,
  SelectDemo,
  SeparatorDemo,
  UnboxingBucketDemo,
}

export const REGISTRY_DEMOS: Record<string, React.ComponentType> = {
  select: SelectDemo,
  button: ButtonDemo,
  badge: BadgeDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "animated-glow-card": AnimatedGlowCardDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  separator: SeparatorDemo,
}

export const REGISTRY_DEMO_CODES: Record<string, string> = {
  select: `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select defaultValue="react">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectItem value="react">React 19</SelectItem>
          <SelectItem value="nextjs">Next.js 15</SelectItem>
          <SelectItem value="tanstack">TanStack Start</SelectItem>
          <SelectItem value="vue">Vue 3</SelectItem>
          <SelectItem value="svelte">Svelte 5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}`,
  button: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}`,
  badge: `import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  )
}`,
  card: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Your project will be deployed to your custom domain with zero configuration.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Deploy</Button>
      </CardFooter>
    </Card>
  )
}`,
  "animated-glow-card": `import { Card, CardCanvas } from "@/components/animated-glow-card"

export function AnimatedGlowCardDemo() {
  return (
    <CardCanvas className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm" showCrosshairs={true}>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px]  uppercase tracking-widest text-muted-foreground">
              SEC-01 // RADIAL
            </span>
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          </div>
          <h4 className="text-base font-semibold text-foreground">
            Specular Highlight
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Dynamic cursor-following glow border utilizing mouse tracking CSS variables.
          </p>
        </div>
      </Card>
    </CardCanvas>
  )
}`,
  "unboxing-bucket": `import { UnboxingBucket } from "@/components/unboxing-bucket"

export function UnboxingBucketDemo() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <UnboxingBucket />
    </div>
  )
}`,
  separator: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border/80 bg-background/60 p-5 shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold leading-none text-foreground">
          Radix UI Primitives
        </h4>
        <p className="text-xs text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-1" />
      <div className="flex h-5 items-center space-x-4 text-xs">
        <div className="font-medium text-foreground">Blog</div>
        <Separator orientation="vertical" />
        <div className="font-medium text-foreground">Docs</div>
        <Separator orientation="vertical" />
        <div className="font-medium text-foreground">Source</div>
      </div>
    </div>
  )
}`,
  "code-block": `import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const SAMPLE_CODE = \`import { useMemo, useState } from "react"

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const stats = useMemo(() => ({
    isEven: count % 2 === 0,
    isPositive: count > 0,
  }), [count])

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(initialValue)

  return { count, stats, increment, decrement, reset }
}\`

export function CodeBlockDemo() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={SAMPLE_CODE}
        language="typescript"
        showLineNumbers
        highlightedLines="6-9"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>use-counter.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}`,
}
