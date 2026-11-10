import React from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ui/popover"
import { cn } from "@/shared/lib/utils"
import {
  HandDrawnCurlyArrow,
  HighlightWord,
} from "@/shared/ui/animation/figma-text-highlight"

import { Avatar3x4Card } from "./avatar-card"

export function NameWithAvatarPopover() {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={60}
        closeDelay={150}
        nativeButton={false}
        className="group/trigger relative inline-flex items-center align-middle focus:outline-hidden"
      >
        {/* Hand-drawn Curly Arrow pointing to Name - hidden when popover is open */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 z-30 flex -translate-x-1/2 items-end transition-opacity duration-200 select-none group-data-popup-open/trigger:opacity-0 sm:-top-12"
        >
          <HandDrawnCurlyArrow className="h-6 w-11 text-muted-foreground/75 sm:h-7 sm:w-12" />
          <span className="font-handwriting -mb-1 ml-1 -rotate-6 text-xl font-medium tracking-wide whitespace-nowrap text-muted-foreground">
            hover here
          </span>
        </span>

        {/* Inline Round Avatar */}
        <span
          className={cn(
            "mx-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full sm:size-11 md:size-12",
            "align-middle shadow-sm ring-2 ring-primary/45 transition-transform hover:scale-110 active:scale-95"
          )}
        >
          <img
            src="/avatar-about.jpg"
            alt="Phong Phan"
            className="size-full object-cover"
          />
        </span>

        {/* Inline Name */}
        <HighlightWord
          id="phong-phan"
          text="Phong Phan"
          className="font-bold text-foreground"
        />
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={14}
        className="w-auto border-none bg-transparent p-0 shadow-none ring-0 outline-hidden"
      >
        <Avatar3x4Card />
      </PopoverContent>
    </Popover>
  )
}

export default NameWithAvatarPopover
