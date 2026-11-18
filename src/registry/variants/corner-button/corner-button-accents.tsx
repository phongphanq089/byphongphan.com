import { CornerButton } from "@/registry/animated/corner-button"

export default function CornerButtonAccents() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6">
      <CornerButton accentColor="var(--primary)">System Primary</CornerButton>

      <CornerButton accentColor="#8b5cf6">Cyber Violet</CornerButton>

      <CornerButton accentColor="#10b981">Neon Emerald</CornerButton>

      <CornerButton accentColor="#f59e0b">Amber Gold</CornerButton>
    </div>
  )
}
