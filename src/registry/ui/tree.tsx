import type { ItemInstance } from "@headless-tree/core"
import { ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react"
import { Slot } from "radix-ui"
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes } from "react"
import { createContext, Fragment, useContext } from "react"

import { cn } from "@/shared/lib"

type ToggleIconType = "chevron" | "plus-minus"

interface TreeContextValue<T = any> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: any
  toggleIconType?: ToggleIconType
}

const TreeContext = createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
  toggleIconType: "plus-minus",
})

function useTreeContext<T = any>() {
  return useContext(TreeContext) as TreeContextValue<T>
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: any
  toggleIconType?: ToggleIconType
  asChild?: boolean
}

function Tree({
  indent = 20,
  tree,
  className,
  toggleIconType = "chevron",
  asChild = false,
  ...props
}: TreeProps) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {}
  const mergedProps = { ...props, ...containerProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  } as CSSProperties

  const Comp = asChild ? Slot.Root : "div"

  return (
    <TreeContext.Provider value={{ indent, tree, toggleIconType }}>
      <Comp
        data-slot="tree"
        style={mergedStyle}
        className={cn("flex flex-col", className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps<T = any> extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "indent"
> {
  item: ItemInstance<T>
  indent?: number
  asChild?: boolean
}

function TreeItem<T = any>({
  item,
  className,
  asChild = false,
  children,
  ...props
}: TreeItemProps<T>) {
  const parentContext = useTreeContext<T>()
  const { indent } = parentContext

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {}
  const mergedProps = { ...props, children, ...itemProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-padding": `${item.getItemMeta().level * indent}px`,
  } as CSSProperties

  const defaultProps = {
    "data-slot": "tree-item",
    style: mergedStyle,
    className: cn(
      "z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    "data-focus":
      typeof item.isFocused === "function"
        ? item.isFocused() || false
        : undefined,
    "data-folder":
      typeof item.isFolder === "function"
        ? item.isFolder() || false
        : undefined,
    "data-selected":
      typeof item.isSelected === "function"
        ? item.isSelected() || false
        : undefined,
    "data-drag-target":
      typeof item.isDragTarget === "function"
        ? item.isDragTarget() || false
        : undefined,
    "data-search-match":
      typeof item.isMatchingSearch === "function"
        ? item.isMatchingSearch() || false
        : undefined,
    "aria-expanded": item.isExpanded(),
  }

  const Comp = asChild ? Slot.Root : "button"

  return (
    <TreeContext.Provider value={{ ...parentContext, currentItem: item }}>
      <Comp {...defaultProps} {...otherProps}>
        {children}
      </Comp>
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps<T = any> extends HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
  asChild?: boolean
}

function TreeItemLabel<T = any>({
  item: propItem,
  children,
  className,
  asChild = false,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem, toggleIconType } = useTreeContext<T>()
  const item = propItem || currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="tree-item-label"
      className={cn(
        "flex w-full items-center gap-1.5 transition-colors not-in-data-[folder=true]:ps-6 hover:bg-muted/60 in-focus-visible:ring-1 in-focus-visible:ring-ring in-data-[drag-target=true]:bg-accent in-data-[selected=true]:bg-primary/10 in-data-[selected=true]:font-medium in-data-[selected=true]:text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "rounded-md",
        "py-1",
        "px-2",
        "text-xs",
        className
      )}
      {...props}
    >
      <Fragment>
        {item.isFolder() &&
          (toggleIconType === "plus-minus" ? (
            item.isExpanded() ? (
              <MinusIcon
                className="size-3.5 text-muted-foreground"
                stroke="currentColor"
                strokeWidth="1"
              />
            ) : (
              <PlusIcon
                className="size-3.5 text-muted-foreground"
                stroke="currentColor"
                strokeWidth="1"
              />
            )
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground in-aria-[expanded=false]:-rotate-90" />
          ))}
        {children ||
          (typeof item.getItemName === "function" ? item.getItemName() : null)}
      </Fragment>
    </Comp>
  )
}

function TreeDragLine({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { tree } = useTreeContext()

  if (!tree || typeof tree.getDragLineStyle !== "function") {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method"
    )
    return null
  }

  const dragLine = tree.getDragLineStyle()
  return (
    <div
      style={dragLine}
      className={cn(
        "absolute z-30 -mt-px h-0.5 w-[unset] bg-primary before:absolute before:-top-[3px] before:left-0 before:size-2 before:border-2 before:border-primary before:bg-background",
        "before:rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Tree, TreeDragLine, TreeItem, TreeItemLabel }
