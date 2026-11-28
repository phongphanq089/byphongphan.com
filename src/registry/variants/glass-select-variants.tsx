import type { ComponentVariant } from "@/features/component-ui/types"
import {
  GlassSelect,
  type GlassSelectOpening,
} from "@/registry/animated/glass-select"

const OPTIONS = [
  { value: "design", label: "Design Systems" },
  { value: "motion", label: "Motion Physics" },
  { value: "shaders", label: "WebGL2 Shaders" },
  { value: "disabled", label: "Disabled Option", disabled: true },
]

function GlassSelectPreset({ opening }: { opening: GlassSelectOpening }) {
  return (
    <div className="flex min-h-[340px] w-full items-center justify-center p-6">
      <GlassSelect
        label="Category"
        placeholder="Pick a category"
        defaultValue="design"
        options={OPTIONS}
        opening={opening}
      />
    </div>
  )
}

export function GlassSelectStretch() {
  return <GlassSelectPreset opening="stretch" />
}

export function GlassSelectMorph() {
  return <GlassSelectPreset opening="morph" />
}

export function GlassSelectGrow() {
  return <GlassSelectPreset opening="grow" />
}

export const GLASS_SELECT_VARIANTS: ComponentVariant[] = [
  {
    id: "glass-select-stretch",
    title: "Stretch (Spring Neck)",
    description:
      "The list swells out of the trigger on a stretching liquid-glass neck that thins, snaps, and retracts smoothly.",
    component: GlassSelectStretch,
  },
  {
    id: "glass-select-morph",
    title: "Morph (Control to Surface)",
    description:
      "The pill trigger morphs seamlessly into the dropdown card over its anchor.",
    component: GlassSelectMorph,
  },
  {
    id: "glass-select-grow",
    title: "Grow (Anchor Expansion)",
    description:
      "The anchor's own glass expands directly into the select list and shrinks back along the same path.",
    component: GlassSelectGrow,
  },
]
