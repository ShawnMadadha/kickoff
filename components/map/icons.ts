import L from "leaflet";

// On-palette SVG "div" pins (no emoji). divIcon sidesteps Leaflet's classic
// broken marker-image problem under bundlers. Colors come from the Aqua
// Departure Board palette; the type is read by glyph + hue.
const GLYPH: Record<string, string> = {
  // stadium = your destination → target
  stadium: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/>',
  // watch party → screen
  watch_party: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',
  // fan festival → star
  fan_festival: '<path d="M12 3.5l2.5 5.3 5.8.8-4.2 4 1 5.7L12 16.6 6.9 19.3l1-5.7-4.2-4 5.8-.8z" fill="currentColor" stroke="none"/>',
  // fan zone → flag
  fan_zone: '<path d="M6 21V4M6 5h11l-2.2 3.5L17 12H6"/>',
};

const COLOR: Record<string, string> = {
  stadium: "#3ad0d6", // aqua accent — the destination
  watch_party: "#74d6cd", // teal
  fan_festival: "#f0a93a", // amber (rush)
  fan_zone: "#86c257", // green
};

export function venueIcon(kind: string): L.DivIcon {
  const color = COLOR[kind] ?? COLOR.watch_party;
  const glyph = GLYPH[kind] ?? GLYPH.watch_party;
  const size = kind === "stadium" ? 38 : 30;
  const icon = size === 38 ? 20 : 16;
  return L.divIcon({
    className: "kickoff-pin",
    html: `<div style="color:${color};width:${size}px;height:${size}px;border-radius:50%;background:#172231;border:2px solid ${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.55)"><svg width="${icon}" height="${icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 2],
  });
}
