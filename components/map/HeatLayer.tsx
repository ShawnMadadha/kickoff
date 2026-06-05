"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { Venue } from "@/lib/types";

// Modeled hot-zone overlay. Intensities come from data/venues.json (seeded,
// labeled "modeled") — never a live crowd feed. Clustered venues (Wynwood)
// naturally glow hottest as leaflet.heat blends overlapping points.
export default function HeatLayer({ venues }: { venues: Venue[] }) {
  const map = useMap();

  useEffect(() => {
    const points: L.HeatLatLngTuple[] = venues.map((v) => [
      v.lat,
      v.lng,
      v.intensity,
    ]);
    const layer = L.heatLayer(points, {
      radius: 45,
      blur: 35,
      maxZoom: 14,
      minOpacity: 0.3,
      // semantic ramp: calm aqua → amber → hot red (matches the app palette)
      gradient: { 0.2: "#3ad0d6", 0.5: "#f0a93a", 0.85: "#e8615f" },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, venues]);

  return null;
}
