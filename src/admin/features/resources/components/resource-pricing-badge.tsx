import { Badge } from "@/shared/ui"

import type { ResourcePricing } from "../types"

interface ResourcePricingBadgeProps {
  pricing: ResourcePricing
  size?: "xs" | "sm" | "default"
}

const PRICING_VARIANTS: Record<
  ResourcePricing,
  "success" | "info" | "warning" | "secondary"
> = {
  Free: "success",
  MIT: "info",
  Freemium: "warning",
  Paid: "secondary",
}

export function ResourcePricingBadge({
  pricing,
  size = "sm",
}: ResourcePricingBadgeProps) {
  return (
    <Badge
      variant={PRICING_VARIANTS[pricing]}
      size={size}
      shape="pill"
      className="font-mono"
    >
      {pricing}
    </Badge>
  )
}
