// Browser-notification preview for a leave-by alert. True scheduled push needs
// a service worker + backend (out of scope for the seeded demo), so this fires
// the exact notification you'd get — the .ics calendar event is the durable one.
import type { Match, ArrivalOption } from "./types";

export function notifySupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export type PreviewResult = "shown" | "denied" | "unsupported";

export async function previewLeaveAlert(
  match: Match,
  option: ArrivalOption,
): Promise<PreviewResult> {
  if (!notifySupported()) return "unsupported";
  let perm = Notification.permission;
  if (perm === "default") perm = await Notification.requestPermission();
  if (perm !== "granted") return "denied";

  new Notification(`Time to leave for ${match.fixture}`, {
    body: `Leave by ${option.leaveBy} · ${option.method} · ~${option.transitEstimateMin} min to Hard Rock Stadium.`,
    icon: "/favicon.ico",
    tag: "kickoff-leave",
  });
  return "shown";
}
