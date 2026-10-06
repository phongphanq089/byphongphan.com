import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "cn"

// Context để đồng bộ tab active cho hiệu ứng Motion Indicator
type TabsContextType = {
  value?: string
  tabsId: string
}

type TabsListContextType = {
  variant?: "default" | "line"
}

const TabsContext = React.createContext<TabsContextType | null>(null)
const TabsListContext = React.createContext<TabsListContextType>({
  variant: "default",
})

function Tabs({
  className,
  orientation = "horizontal",
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const tabsId = React.useId()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val)
      }
      onValueChange?.(val)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, tabsId }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        value={currentValue}
        onValueChange={handleValueChange}
        className={cn(
          "group/tabs flex gap-2 data-horizontal:flex-col",
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-sm p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default:
          "border border-border/40 bg-muted/80 shadow-xs backdrop-blur-xs",
        line: "gap-2 rounded-none border-b border-border/50 bg-transparent p-0 group-data-vertical/tabs:border-r group-data-vertical/tabs:border-b-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider value={{ variant: variant ?? "default" }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabsContext = React.useContext(TabsContext)
  const { variant } = React.useContext(TabsListContext)

  const isActive = tabsContext?.value === value
  const tabsId = tabsContext?.tabsId ?? "tabs"

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        // Base Layout & Typography
        "relative isolate inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap select-none",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",

        // Text Colors & State
        "text-muted-foreground transition-colors duration-150 hover:text-foreground",
        "data-active:text-foreground",

        // Focus & Disabled
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",

        // Icon Rules
        "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        className
      )}
      {...props}
    >
      {/* Sliding Pill Indicator (variant="default") */}
      {isActive && variant === "default" && (
        <motion.span
          layoutId={`${tabsId}-default-indicator`}
          className="absolute inset-0 -z-10 rounded-sm border border-black/5 bg-background shadow-xs dark:border-white/10 dark:bg-input/60"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 32,
          }}
        />
      )}

      {/* Sliding Line Indicator (variant="line") */}
      {isActive && variant === "line" && (
        <motion.span
          layoutId={`${tabsId}-line-indicator`}
          className={cn(
            "absolute -z-10 rounded-sm bg-primary",
            "group-data-horizontal/tabs:inset-x-0 group-data-horizontal/tabs:-bottom-[1px] group-data-horizontal/tabs:h-[2px]",
            "group-data-vertical/tabs:inset-y-0 group-data-vertical/tabs:-right-[1px] group-data-vertical/tabs:w-[2px]"
          )}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 35,
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-1.5">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger }
