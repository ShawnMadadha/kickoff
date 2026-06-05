import L from "leaflet";

// Emoji "div" pins. Using divIcon sidesteps Leaflet's classic broken
// marker-image problem under bundlers, and matches the app's playful tone.
const PIN: Record<string, { emoji: string; color: string }> = {
  fan_festival: { emoji: "🎉", color: "#19c37d" },
  watch_party: { emoji: "🍻", color: "#5b9bff" },
  fan_zone: { emoji: "🪅", color: "#f2c14e" },
  stadium: { emoji: "⚽", color: "#f0596b" },
};

export function venueIcon(kind: string): L.DivIcon {
  const p = PIN[kind] ?? PIN.watch_party;
  const size = kind === "stadium" ? 38 : 30;
  return L.divIcon({
    className: "kickoff-pin",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#121c2e;border:2px solid ${p.color};display:flex;align-items:center;justify-content:center;font-size:${size === 38 ? 18 : 15}px;box-shadow:0 2px 6px rgba(0,0,0,.55)">${p.emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 2],
  });
}
