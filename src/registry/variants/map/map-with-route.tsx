import { Flag, Navigation } from "lucide-react"

import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
  RouteMarker,
} from "@/registry/ui/map"

const ROUTE_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-122.415, 37.78],
  [-122.408, 37.785],
  [-122.401, 37.792],
  [-122.395, 37.798],
]

export function MapWithRoute() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/10">
      <Map center={[-122.407, 37.786]} zoom={13} className="size-full">
        <MapControls position="top-right" showZoom showCompass />

        {/* Start Point Marker */}
        <MapMarker
          longitude={ROUTE_COORDINATES[0][0]}
          latitude={ROUTE_COORDINATES[0][1]}
        >
          <MarkerContent>
            <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <Navigation className="size-3" />
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <span>Start Point</span>
          </MarkerTooltip>
        </MapMarker>

        {/* End Point Marker */}
        <MapMarker
          longitude={ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1][0]}
          latitude={ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1][1]}
        >
          <MarkerContent>
            <div className="flex size-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
              <Flag className="size-3" />
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <span>Destination</span>
          </MarkerTooltip>
        </MapMarker>

        {/* Animated / styled Route line */}
        <MapRoute
          coordinates={ROUTE_COORDINATES}
          color="#3b82f6"
          width={4}
          opacity={0.9}
        >
          <RouteMarker at="start">
            <MarkerContent>
              <div className="size-2 rounded-full bg-white shadow-xs" />
            </MarkerContent>
          </RouteMarker>
          <RouteMarker at="end">
            <MarkerContent>
              <div className="size-2 rounded-full bg-white shadow-xs" />
            </MarkerContent>
          </RouteMarker>
        </MapRoute>
      </Map>
    </div>
  )
}
export default MapWithRoute
