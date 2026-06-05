// Turn-by-turn hand-off to the user's maps app. Pure URL schemes — no API,
// no key — so they're zero-risk and open the native app on phones.
export function googleDir(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function appleDir(lat: number, lng: number): string {
  return `https://maps.apple.com/?daddr=${lat},${lng}`;
}
