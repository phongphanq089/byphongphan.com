import { GlassSelect } from "@/registry/animated/glass-select"

const ROLE_OPTIONS = [
  { value: "design-engineer", label: "Design Engineer" },
  { value: "frontend-lead", label: "Frontend Lead" },
  { value: "systems-architect", label: "Systems Architect" },
  { value: "motion-specialist", label: "Motion Specialist" },
  { value: "staff-reviewer", label: "Staff Reviewer", disabled: true },
]

export function LiquidGlassSelect() {
  return (
    <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-sky-500/15 via-violet-500/10 to-emerald-500/15 p-6">
      <GlassSelect
        label="Role"
        placeholder="Pick a role"
        defaultValue="design-engineer"
        options={ROLE_OPTIONS}
        opening="stretch"
      />
    </div>
  )
}
