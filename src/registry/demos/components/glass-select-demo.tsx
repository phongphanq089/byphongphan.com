import { GlassSelect } from "@/registry/animated/glass-select"

const OPTIONS = [
  { value: "stretch", label: "Stretch (Spring Neck)" },
  { value: "morph", label: "Morph (Control to Surface)" },
  { value: "grow", label: "Grow (Anchor Expansion)" },
  { value: "disabled", label: "Disabled Option", disabled: true },
]

export function GlassSelectDemo() {
  return (
    <div className="flex min-h-[340px] w-full items-center justify-center p-6">
      <GlassSelect
        label="Opening Physics"
        placeholder="Pick an option"
        defaultValue="stretch"
        options={OPTIONS}
        opening="stretch"
      />
    </div>
  )
}
