import { Layout } from "lucide-react"

export interface DefaultBlockSchematicProps {
  title?: string
}

export function DefaultBlockSchematic({ title }: DefaultBlockSchematicProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Layout className="size-8 text-white/30 transition-colors group-hover:text-primary/60" />
      <span className="font-mono text-[9px] text-white/40">
        {title || "Block"}
      </span>
    </div>
  )
}
