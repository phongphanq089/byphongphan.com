import type { ComponentVariant } from "@/features/component-ui/types"

import MapFlightArc from "./map/map-flight-arc"
import MapWithControls from "./map/map-with-controls"
import MapWithMarker from "./map/map-with-marker"
import MapWithRoute from "./map/map-with-route"

export const MAP_VARIANTS: ComponentVariant[] = [
  {
    id: "map-with-marker",
    title: "Map with Custom Markers & Popups",
    description:
      "Interactive vector map with animated pulsing pins, labels, tooltips, and rich card popups.",
    component: MapWithMarker,
  },
  {
    id: "map-with-controls",
    title: "Map with Navigation Controls",
    description:
      "Map with zoom, compass orientation, locate user, and fullscreen controls.",
    component: MapWithControls,
  },
  {
    id: "map-with-route",
    title: "Map with Vector Route",
    description:
      "Polyline route rendering with anchor endpoints, custom path styling, and interactive markers.",
    component: MapWithRoute,
  },
  {
    id: "map-flight-arc",
    title: "Map with Curved Great-Circle Arcs",
    description:
      "Great-circle curved arcs connecting geographical coordinates with hover states.",
    component: MapFlightArc,
  },
]

export { MapFlightArc, MapWithControls, MapWithMarker, MapWithRoute }
