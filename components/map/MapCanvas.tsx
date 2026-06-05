"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Venue } from "@/lib/types";
import matchesData from "@/data/matches.json";
import { venueIcon } from "./icons";
import HeatLayer from "./HeatLayer";

const stadium = matchesData.venue;

export default function MapCanvas({
  venues,
  showHeat,
}: {
  venues: Venue[];
  showHeat: boolean;
}) {
  // Always include the stadium so the view shows "parties in the city,
  // stadium up north" even when filters empty the venue list.
  const pts: [number, number][] = [
    [stadium.lat, stadium.lng],
    ...venues.map((v) => [v.lat, v.lng] as [number, number]),
  ];
  const bounds = L.latLngBounds(pts);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [28, 28] }}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#10131c" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {showHeat && venues.length > 0 && <HeatLayer venues={venues} />}

      <Marker
        position={[stadium.lat, stadium.lng]}
        icon={venueIcon("stadium")}
      >
        <Popup>
          <b>{stadium.name}</b>
          <br />
          Match venue · no parking, shuttle only
        </Popup>
      </Marker>

      {venues.map((v) => (
        <Marker
          key={v.name}
          position={[v.lat, v.lng]}
          icon={venueIcon(v.type)}
        >
          <Popup>
            <b>{v.name}</b>
            <br />
            {v.neighborhood} · {v.free ? "Free entry" : "Min spend"}
            <br />
            {v.note}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
