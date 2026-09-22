import { Map, MapControls } from "@/registry/ui/map"

export function MapWithControls() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/10">
      <Map center={[-74.006, 40.7128]} zoom={13} className="size-full">
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
      </Map>
    </div>
  )
}
export default MapWithControls
