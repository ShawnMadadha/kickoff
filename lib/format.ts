// Display formatting helpers. These never touch departure-time math —
// that stays in arrivalEngine.ts. These only pretty-print already-known values.

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-06-24" -> "Wed, Jun 24". Parsed as a calendar date (no timezone shift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${WEEKDAYS[dt.getUTCDay()]}, ${MONTHS[m - 1]} ${d}`;
}

/** "18:00" -> "6:00 PM ET". null -> "Time TBD". */
export function formatKickoff(hhmm: string | null): string {
  if (!hhmm) return "Time TBD";
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h < 12 ? "AM" : "PM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap} ET`;
}
