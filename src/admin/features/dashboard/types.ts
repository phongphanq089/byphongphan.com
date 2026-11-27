export type DashboardRange = "7d" | "30d" | "90d"

export interface DashboardKpiSummary {
  visitors: number
  visitorsDelta: string
  pageviews: number
  pageviewsDelta: string
  bounceRate: string
  avgDuration: string
  registryInstalls: number
  registryDelta: string
}

export interface TrafficSeriesPoint {
  label: string
  visitors: number
  pageviews: number
}

export interface EngagementSeriesPoint {
  label: string
  blogReads: number
  registryCopies: number
}

export interface TrafficSourceItem {
  name: string
  value: number
  color: string
}

export interface TopPageItem {
  path: string
  title: string
  views: number
  visitors: number
  bounceRate: string
}

export interface DashboardDataset {
  kpis: DashboardKpiSummary
  traffic: TrafficSeriesPoint[]
  engagement: EngagementSeriesPoint[]
  sources: TrafficSourceItem[]
  topPages: TopPageItem[]
}
