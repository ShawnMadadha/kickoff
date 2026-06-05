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
      gradient: { 0.2: "#19c37d", 0.5: "#f2c14e", 0.85: "#f0596b" },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, venues]);

  return null;
}
