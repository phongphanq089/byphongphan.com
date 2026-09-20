import { ExternalLink,MapPin, Navigation } from "lucide-react"

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/registry/ui/map"
import { Badge, Button } from "@/shared/ui/core"

const LOCATIONS = [
  {
    id: "loc-1",
    name: "San Francisco HQ",
    coordinates: [-122.4194, 37.7749] as [number, number],
    type: "Headquarters",
    address: "Market St, San Francisco, CA",
  },
  {
    id: "loc-2",
    name: "Embarcadero Studio",
    coordinates: [-122.395, 37.795] as [number, number],
    type: "Innovation Lab",
    address: "The Embarcadero, San Francisco, CA",
  },
]

export function MapDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-xs">
      <Map center={[-122.41, 37.78]} zoom={12} className="size-full">
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {LOCATIONS.map((loc) => (
          <MapMarker
            key={loc.id}
            longitude={loc.coordinates[0]}
            latitude={loc.coordinates[1]}
          >
            <MarkerContent>
              <div className="group relative flex items-center justify-center">
                <span className="absolute size-6 animate-ping rounded-full bg-primary/30 opacity-75" />
                <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform duration-200 group-hover:scale-110">
                  <MapPin className="size-4" />
                </div>
              </div>
            </MarkerContent>

            <MarkerTooltip>
              <span className="font-medium">{loc.name}</span>
            </MarkerTooltip>

            <MarkerPopup closeButton className="min-w-56 p-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] uppercase"
                  >
                    {loc.type}
                  </Badge>
                  <Navigation className="size-3 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {loc.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {loc.address}
                  </p>
                </div>
                <div className="pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-full gap-1.5 text-xs"
                  >
                    <span>View Direction</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
