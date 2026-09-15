import { ChevronDown, ChevronUp, Info, User } from "lucide-react"

import type { SchematicType } from "../../types"

// 1. Accordion Schematic (Image 1)
export function AccordionSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-1.5">
      {/* Closed Panel 1 */}
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="h-2 w-16 rounded-full bg-white/30" />
        <ChevronDown className="size-3 text-white/40" />
      </div>

      {/* Expanded Panel 2 */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/15 bg-white/[0.06] p-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 rounded-full bg-white/70" />
          <ChevronUp className="size-3 text-white/70" />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="h-1.5 w-full rounded-full bg-white/20" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Closed Panel 3 */}
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="h-2 w-14 rounded-full bg-white/30" />
        <ChevronDown className="size-3 text-white/40" />
      </div>
    </div>
  )
}

// 2. Alert Schematic (Image 1)
export function AlertSchematic() {
  return (
    <div className="flex w-full max-w-[220px] items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.05] p-3 shadow-xs">
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80">
        <Info className="size-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-2 w-24 rounded-full bg-white/60" />
        <div className="h-1.5 w-32 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

// 3. Alert Dialog Schematic (Image 1)
export function AlertDialogSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-3 rounded-xl border border-white/15 bg-white/[0.06] p-3.5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-20 rounded-full bg-white/80" />
        <div className="h-1.5 w-full rounded-full bg-white/25" />
        <div className="h-1.5 w-4/5 rounded-full bg-white/20" />
      </div>
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <div className="h-5 w-10 rounded-md border border-white/10 bg-white/5" />
        <div className="h-5 w-12 rounded-md bg-white shadow-xs" />
      </div>
    </div>
  )
}

// 4. Autocomplete / Combobox Schematic (Image 1)
export function AutocompleteSchematic() {
  return (
    <div className="flex w-full max-w-[190px] flex-col gap-1.5">
      {/* Input box with text cursor I */}
      <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-1">
          <div className="h-2 w-14 rounded-full bg-white/70" />
          <div className="h-3 w-[1.5px] animate-pulse bg-white" />
        </div>
      </div>

      {/* Open Dropdown List */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/15 bg-black/80 p-1.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center rounded-md bg-white/15 px-2 py-1.5">
          <div className="h-2 w-16 rounded-full bg-white" />
        </div>
        <div className="flex items-center px-2 py-1.5">
          <div className="h-2 w-20 rounded-full bg-white/30" />
        </div>
        <div className="flex items-center px-2 py-1.5">
          <div className="h-2 w-12 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}

// 5. Avatar Schematic (Image 1)
export function AvatarSchematic() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white/80 shadow-md">
        <User className="size-7 text-white/60" />
      </div>
      <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-xs font-semibold text-white/60">
        +3
      </div>
    </div>
  )
}

// 6. Badge Schematic (Image 1)
export function BadgeSchematic() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 shadow-xs">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        <div className="h-2 w-10 rounded-full bg-white/80" />
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1">
        <div className="h-2 w-8 rounded-full bg-white/40" />
      </div>
    </div>
  )
}

// 7. Breadcrumb Schematic (Image 1)
export function BreadcrumbSchematic() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-xs">
      <div className="h-2 w-10 rounded-full bg-white/40" />
      <span className="text-xs text-white/30">›</span>
      <div className="h-2 w-12 rounded-full bg-white/50" />
      <span className="text-xs text-white/30">›</span>
      <div className="h-2 w-14 rounded-full bg-white/90" />
    </div>
  )
}

// 8. Button Schematic (Image 1)
export function ButtonSchematic() {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <div className="flex h-9 w-24 items-center justify-center rounded-xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <div className="h-2 w-10 rounded-full bg-black/80" />
      </div>
      <div className="flex h-7 w-20 items-center justify-center rounded-lg border border-white/20 bg-white/[0.05]">
        <div className="h-1.5 w-8 rounded-full bg-white/60" />
      </div>
    </div>
  )
}

// 9. Calendar Schematic (Image 2)
export function CalendarSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.05] p-3 shadow-lg">
      {/* Month header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-white/40">‹</span>
        <div className="h-2 w-16 rounded-full bg-white/80" />
        <span className="text-[10px] text-white/40">›</span>
      </div>

      {/* Date squares grid 5 rows x 7 cols */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const isSelected = i === 10
          return (
            <div
              key={i}
              className={`flex size-4 items-center justify-center rounded-[3px] text-[8px] ${
                isSelected
                  ? "bg-white font-bold text-black shadow-xs"
                  : i < 5
                    ? "bg-white/[0.02] text-white/20"
                    : "bg-white/[0.06] text-white/60"
              }`}
            >
              {isSelected ? "" : ""}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 10. 404 / Not Found Schematic (Image 2)
export function NotFoundSchematic() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-3xl font-extrabold tracking-widest text-white">
        404
      </div>
      <div className="h-1.5 w-24 rounded-full bg-white/20" />
      <div className="mt-2 flex h-6 items-center justify-center rounded-md bg-white px-3 shadow-xs">
        <span className="text-[9px] font-bold text-black">Back home</span>
      </div>
    </div>
  )
}

// 11. Activity Feed Schematic (Image 2)
export function ActivityFeedSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.04] p-3">
      {[{ amount: "-$12" }, { amount: "-$24" }, { amount: "-$36" }].map(
        (item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-5 shrink-0 rounded-full bg-white/20" />
              <div className="h-2 w-16 rounded-full bg-white/40" />
            </div>
            <span className="text-[10px] font-semibold text-white/80">
              {item.amount}
            </span>
          </div>
        )
      )}
    </div>
  )
}

// 12. Banner Schematic (Image 2)
export function BannerSchematic() {
  return (
    <div className="flex w-full max-w-[220px] items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-2.5 shadow-md">
      <div className="flex items-center gap-2">
        <div className="size-6 shrink-0 rounded-lg bg-white/15" />
        <div className="flex flex-col gap-1">
          <div className="h-2 w-16 rounded-full bg-white/80" />
          <div className="h-1.5 w-20 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 items-center justify-center rounded-md bg-white px-2 shadow-xs">
          <span className="text-[9px] font-bold text-black">Enable</span>
        </div>
        <span className="text-xs text-white/40">×</span>
      </div>
    </div>
  )
}

// 13. Benefits / Feature Grid Schematic (Image 2)
export function BenefitsSchematic() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex w-14 flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] p-2 shadow-xs"
        >
          <div className="size-4 rounded-md bg-white/20" />
          <div className="h-1.5 w-8 rounded-full bg-white/60" />
          <div className="h-1 w-10 rounded-full bg-white/25" />
        </div>
      ))}
    </div>
  )
}

// 14. Blog Listings Schematic (Image 2)
export function BlogListingsSchematic() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex w-14 flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 shadow-xs"
        >
          <div className="h-8 w-full rounded-md bg-white/15" />
          <div className="h-1.5 w-8 rounded-full bg-white/60" />
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
      ))}
    </div>
  )
}

// 15. Careers / Job List Schematic (Image 2)
export function CareersSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.04] p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-16 rounded-full bg-white/70" />
            <div className="h-1.5 w-20 rounded-full bg-white/25" />
          </div>
          <div className="flex h-5 items-center justify-center rounded-md bg-white px-2 shadow-xs">
            <span className="text-[9px] font-bold text-black">Apply</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// 16. Chat / Messages Schematic (Image 2)
export function ChatSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.05] p-3 shadow-md">
      {/* Incoming Message Bubble */}
      <div className="flex items-end gap-1.5">
        <div className="size-4 shrink-0 rounded-full bg-white/20" />
        <div className="flex max-w-[120px] flex-col gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.08] p-2">
          <div className="h-1.5 w-16 rounded-full bg-white/80" />
          <div className="h-1.5 w-20 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Outgoing Message Bubble */}
      <div className="flex justify-end">
        <div className="flex max-w-[100px] flex-col gap-1 rounded-2xl rounded-br-sm bg-white p-2 text-black shadow-xs">
          <div className="h-1.5 w-12 rounded-full bg-black/80" />
        </div>
      </div>

      {/* Input bar */}
      <div className="mt-1 flex items-center justify-between rounded-lg border border-white/10 bg-black/60 px-2 py-1.5">
        <div className="h-1.5 w-24 rounded-full bg-white/20" />
        <div className="size-3 rounded-md bg-white/60" />
      </div>
    </div>
  )
}

// 17. Command Menu Schematic
export function CommandSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-1.5 rounded-xl border border-white/15 bg-black/90 p-2.5 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="h-2 w-20 rounded-full bg-white/70" />
        <span className="rounded border border-white/20 bg-white/10 px-1 text-[8px] text-white/60">
          ⌘K
        </span>
      </div>
      <div className="flex flex-col gap-1 pt-0.5">
        <div className="flex items-center justify-between rounded-md bg-white/15 px-2 py-1">
          <div className="h-1.5 w-14 rounded-full bg-white" />
          <div className="size-2 rounded-full bg-pp-primary" />
        </div>
        <div className="flex items-center px-2 py-1">
          <div className="h-1.5 w-18 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

// 18. Checkbox & Switch Schematic
export function CheckboxSchematic() {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Checkbox */}
      <div className="flex size-6 items-center justify-center rounded-md border border-white/40 bg-white text-black shadow-xs">
        <span className="text-xs font-black">✓</span>
      </div>
      {/* Switch Toggle */}
      <div className="flex h-6 w-11 items-center rounded-full border border-white/20 bg-white/20 p-0.5 shadow-inner">
        <div className="size-5 translate-x-5 rounded-full bg-white shadow-md transition-transform" />
      </div>
    </div>
  )
}

// 19. Dialog / Modal Schematic
export function DialogSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-2 rounded-xl border border-white/20 bg-black/80 p-3.5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-16 rounded-full bg-white/90" />
        <span className="text-[10px] text-white/40">×</span>
      </div>
      <div className="flex flex-col gap-1 py-1">
        <div className="h-1.5 w-full rounded-full bg-white/30" />
        <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
      </div>
      <div className="flex justify-end gap-1.5 pt-1">
        <div className="h-5 w-10 rounded-md border border-white/10 bg-white/5" />
        <div className="h-5 w-12 rounded-md bg-white shadow-xs" />
      </div>
    </div>
  )
}

// 20. Dropdown Menu Schematic
export function DropdownSchematic() {
  return (
    <div className="flex w-full max-w-[170px] flex-col gap-1.5">
      <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/[0.06] px-3 py-1.5">
        <div className="h-2 w-12 rounded-full bg-white/70" />
        <ChevronDown className="size-3 text-white/40" />
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-white/15 bg-black/90 p-1.5 shadow-lg">
        <div className="flex items-center justify-between rounded-md bg-white/15 px-2 py-1">
          <div className="h-1.5 w-14 rounded-full bg-white" />
          <span className="text-[8px] text-white">✓</span>
        </div>
        <div className="h-px w-full bg-white/10" />
        <div className="flex items-center px-2 py-1">
          <div className="h-1.5 w-16 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

// 21. Hover Card Schematic
export function HoverCardSchematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-white/60 underline decoration-white/40 decoration-dotted underline-offset-4" />
      <div className="flex w-44 items-center gap-2.5 rounded-xl border border-white/15 bg-black/80 p-2.5 shadow-xl backdrop-blur-md">
        <div className="size-7 shrink-0 rounded-full bg-white/20" />
        <div className="flex flex-col gap-1">
          <div className="h-2 w-14 rounded-full bg-white/90" />
          <div className="h-1.5 w-20 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}

// 22. Input Schematic
export function InputSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-2">
      <div className="flex items-center justify-between rounded-lg border border-white/30 bg-white/[0.06] px-3 py-2 shadow-xs ring-1 ring-white/10">
        <div className="flex items-center gap-1">
          <div className="h-2 w-20 rounded-full bg-white/80" />
          <div className="h-3 w-[1.5px] animate-pulse bg-white" />
        </div>
        <span className="text-xs text-white/40">×</span>
      </div>
    </div>
  )
}

// 23. Tabs / Segmented Control Schematic
export function TabsSchematic() {
  return (
    <div className="flex w-full max-w-[210px] items-center rounded-xl border border-white/10 bg-white/[0.04] p-1 shadow-inner">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-white py-1.5 shadow-xs">
        <div className="h-2 w-10 rounded-full bg-black" />
      </div>
      <div className="flex flex-1 items-center justify-center py-1.5">
        <div className="h-2 w-10 rounded-full bg-white/40" />
      </div>
      <div className="flex flex-1 items-center justify-center py-1.5">
        <div className="h-2 w-10 rounded-full bg-white/40" />
      </div>
    </div>
  )
}

// 24. Toast / Notification Schematic
export function ToastSchematic() {
  return (
    <div className="flex w-full max-w-[210px] items-center justify-between gap-2.5 rounded-xl border border-white/20 bg-black/90 p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-emerald-400" />
        <div className="flex flex-col gap-1">
          <div className="h-2 w-16 rounded-full bg-white/90" />
          <div className="h-1.5 w-24 rounded-full bg-white/30" />
        </div>
      </div>
      <span className="text-xs text-white/40">×</span>
    </div>
  )
}

// 25. Tooltip Schematic
export function TooltipSchematic() {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Floating Tooltip Bubble with arrow */}
      <div className="relative rounded-md border border-white/20 bg-white px-2.5 py-1 text-black shadow-lg">
        <span className="text-[9px] font-bold">Add to favorites</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-white" />
      </div>

      <div className="mt-1 flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
        <div className="size-3.5 rounded-sm bg-white/60" />
      </div>
    </div>
  )
}

export function SkeletonSchematic() {
  return (
    <div className="flex w-full max-w-[190px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="size-8 shrink-0 animate-pulse rounded-full bg-white/15" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-2 w-20 animate-pulse rounded-full bg-white/25" />
        <div className="h-1.5 w-full animate-pulse rounded-full bg-white/15" />
      </div>
    </div>
  )
}

// Card Schematic
export function CardSchematic() {
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.04] p-3.5 shadow-md">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full bg-white/40" />
        <div className="h-2 w-16 rounded-full bg-white/80" />
      </div>
      <div className="flex flex-col gap-1.5 py-1">
        <div className="h-1.5 w-full rounded-full bg-white/20" />
        <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-1.5 w-10 rounded-full bg-white/30" />
        <div className="h-4 w-10 rounded-md bg-white/10" />
      </div>
    </div>
  )
}

// Animated Glow Card Schematic
export function AnimatedGlowCardSchematic() {
  return (
    <div className="relative flex w-full max-w-[200px] flex-col gap-2 rounded-xl border border-white/30 bg-white/[0.06] p-3.5 shadow-[0_0_25px_rgba(255,255,255,0.15)]">
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-70" />
      <div className="flex items-center justify-between">
        <div className="h-2 w-16 rounded-full bg-white/90" />
        <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
      </div>
      <div className="flex flex-col gap-1.5 py-1">
        <div className="h-1.5 w-full rounded-full bg-white/25" />
        <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
      </div>
      <div className="flex items-center justify-end pt-1">
        <div className="h-4 w-12 rounded-md bg-white/20" />
      </div>
    </div>
  )
}

// Unboxing Bucket Schematic
export function UnboxingBucketSchematic() {
  return (
    <div className="relative flex w-full max-w-[190px] flex-col items-center justify-center">
      {/* Floating chip above box */}
      <div className="z-10 flex items-center gap-1.5 rounded-full border border-pp-primary/60 bg-white/10 px-2.5 py-1 shadow-lg backdrop-blur-md">
        <span className="size-2 animate-pulse rounded-full bg-pp-primary" />
        <div className="h-1.5 w-12 rounded-full bg-white/90" />
      </div>

      {/* Isometric box wireframe shape */}
      <div className="relative -mt-1 h-14 w-28 rounded-lg border border-white/25 bg-white/[0.04] shadow-md">
        <div className="absolute -top-1.5 left-2 h-2 w-10 -rotate-12 rounded-sm border-t border-l border-white/30" />
        <div className="absolute -top-1.5 right-2 h-2 w-10 rotate-12 rounded-sm border-t border-r border-white/30" />
        <div className="flex h-full items-center justify-center">
          <div className="h-1 w-16 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}

// Separator Schematic
export function SeparatorSchematic() {
  return (
    <div className="flex w-full max-w-[190px] flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-16 rounded-full bg-white/60" />
        <div className="h-1 w-24 rounded-full bg-white/25" />
      </div>
      {/* Horizontal Separator */}
      <div className="h-px w-full bg-white/20" />
      {/* Horizontal items divided by vertical separators */}
      <div className="flex h-4 items-center justify-center gap-2.5">
        <div className="h-1.5 w-8 rounded-full bg-white/40" />
        <div className="h-full w-px bg-white/20" />
        <div className="h-1.5 w-8 rounded-full bg-white/40" />
        <div className="h-full w-px bg-white/20" />
        <div className="h-1.5 w-8 rounded-full bg-white/40" />
      </div>
    </div>
  )
}

export function CodeBlockSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col rounded-lg border border-white/15 bg-black/60 p-2.5 shadow-md">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-red-500/80" />
          <span className="size-1.5 rounded-full bg-yellow-500/80" />
          <span className="size-1.5 rounded-full bg-emerald-500/80" />
          <div className="ml-1 h-1.5 w-12 rounded-full bg-white/20" />
        </div>
        <div className="h-1.5 w-6 rounded-full bg-white/10" />
      </div>
      <div className="flex flex-col gap-1.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/30">1</span>
          <div className="h-1.5 w-24 rounded-full bg-purple-400/70" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/30">2</span>
          <div className="h-1.5 w-32 rounded-full bg-blue-400/60" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/30">3</span>
          <div className="h-1.5 w-16 rounded-full bg-emerald-400/60" />
        </div>
      </div>
    </div>
  )
}

export function RenderSchematic({ type }: { type: SchematicType }) {
  switch (type) {
    case "accordion":
      return <AccordionSchematic />
    case "alert":
      return <AlertSchematic />
    case "alert-dialog":
      return <AlertDialogSchematic />
    case "autocomplete":
      return <AutocompleteSchematic />
    case "avatar":
      return <AvatarSchematic />
    case "badge":
      return <BadgeSchematic />
    case "breadcrumb":
      return <BreadcrumbSchematic />
    case "button":
      return <ButtonSchematic />
    case "calendar":
      return <CalendarSchematic />
    case "not-found":
      return <NotFoundSchematic />
    case "activity-feed":
      return <ActivityFeedSchematic />
    case "banner":
      return <BannerSchematic />
    case "benefits":
      return <BenefitsSchematic />
    case "blog-listings":
      return <BlogListingsSchematic />
    case "careers":
      return <CareersSchematic />
    case "chat":
      return <ChatSchematic />
    case "command":
      return <CommandSchematic />
    case "checkbox":
      return <CheckboxSchematic />
    case "dialog":
      return <DialogSchematic />
    case "dropdown":
    case "select":
      return <DropdownSchematic />
    case "hover-card":
      return <HoverCardSchematic />
    case "input":
      return <InputSchematic />
    case "tabs":
      return <TabsSchematic />
    case "toast":
      return <ToastSchematic />
    case "tooltip":
      return <TooltipSchematic />
    case "skeleton":
      return <SkeletonSchematic />
    case "card":
      return <CardSchematic />
    case "animated-glow-card":
      return <AnimatedGlowCardSchematic />
    case "unboxing-bucket":
      return <UnboxingBucketSchematic />
    case "separator":
      return <SeparatorSchematic />
    case "code-block":
      return <CodeBlockSchematic />
    default:
      return null
  }
}
