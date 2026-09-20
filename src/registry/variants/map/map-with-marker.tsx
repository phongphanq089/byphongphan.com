import { Coffee, Sparkles } from "lucide-react"

import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
} from "@/registry/ui/map"
import { Badge } from "@/shared/ui/core"

const SPOTS = [
  {
    id: "spot-1",
    name: "Artisan Coffee Roasters",
    category: "Cafe",
    coords: [-122.414, 37.776] as [number, number],
    rating: "4.9",
  },
  {
    id: "spot-2",
    name: "Design Studio Hub",
    category: "Workspace",
    coords: [-122.408, 37.785] as [number, number],
    rating: "5.0",
  },
]

export function MapWithMarker() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/10">
      <Map center={[-122.411, 37.78]} zoom={13} className="size-full">
        {SPOTS.map((spot) => (
          <MapMarker
            key={spot.id}
            longitude={spot.coords[0]}
            latitude={spot.coords[1]}
          >
            <MarkerContent>
              <div className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform hover:scale-110">
                {spot.category === "Cafe" ? (
                  <Coffee className="size-3.5 text-amber-500" />
                ) : (
                  <Sparkles className="size-3.5 text-primary" />
                )}
              </div>
            </MarkerContent>

            <MarkerLabel position="bottom">
              <span className="font-mono text-[10px] font-medium">
                {spot.name}
              </span>
            </MarkerLabel>

            <MarkerTooltip>
              <span>Click to view details</span>
            </MarkerTooltip>

            <MarkerPopup closeButton className="min-w-48 p-2.5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {spot.category}
                  </Badge>
                  <span className="font-mono text-[11px] text-amber-500">
                    ★ {spot.rating}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-foreground">
                  {spot.name}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Coordinates: {spot.coords[0].toFixed(3)},{" "}
                  {spot.coords[1].toFixed(3)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
export default MapWithMarker
