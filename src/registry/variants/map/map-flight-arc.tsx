import {
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/ui/map"

const FLIGHT_ARCS = [
  {
    id: "sfo-tyo",
    from: [-122.4194, 37.7749] as [number, number],
    to: [139.6917, 35.6895] as [number, number],
  },
  {
    id: "sfo-lhr",
    from: [-122.4194, 37.7749] as [number, number],
    to: [-0.1276, 51.5074] as [number, number],
  },
  {
    id: "sfo-syd",
    from: [-122.4194, 37.7749] as [number, number],
    to: [151.2093, -33.8688] as [number, number],
  },
]

const CITIES = [
  { name: "San Francisco", coords: [-122.4194, 37.7749] as [number, number] },
  { name: "Tokyo", coords: [139.6917, 35.6895] as [number, number] },
  { name: "London", coords: [-0.1276, 51.5074] as [number, number] },
  { name: "Sydney", coords: [151.2093, -33.8688] as [number, number] },
]

export function MapFlightArc() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/10">
      <Map center={[-30, 25]} zoom={1.5} className="size-full">
        <MapControls position="top-right" showZoom />

        <MapArc
          data={FLIGHT_ARCS}
          curvature={0.25}
          paint={{
            "line-color": "#3b82f6",
            "line-width": 2,
            "line-opacity": 0.85,
          }}
          hoverPaint={{
            "line-color": "#60a5fa",
            "line-width": 3,
            "line-opacity": 1,
          }}
        />

        {CITIES.map((city) => (
          <MapMarker
            key={city.name}
            longitude={city.coords[0]}
            latitude={city.coords[1]}
          >
            <MarkerContent>
              <div className="size-2.5 rounded-full border-2 border-white bg-primary shadow-sm" />
            </MarkerContent>
            <MarkerTooltip>
              <span>{city.name}</span>
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
export default MapFlightArc
