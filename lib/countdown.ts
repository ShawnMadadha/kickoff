// Honest, anchored countdowns. The relative "leave in 2h 14m" / "in 19 days"
// is computed from the match's REAL date + Eastern time, derived from the
// engine's leaveByClock — never recomputed here, never fabricated, never
// negative. World Cup 26 matches run June/July, so ET = EDT = UTC-4.
import { leaveByClock } from "./arrivalEngine";
import type { Match } from "./types";

const ET_OFFSET_HOURS = 4; // EDT (UTC-4)

export type Countdown =
  | { kind: "none" } // TBD / no time
  | { kind: "past" } // leave/kick time already passed
  | { kind: "soon"; hours: number; mins: number } // < 24h
  | { kind: "days"; days: number; hours: number }; // >= 24h

function toCountdown(targetMs: number, now: Date): Countdown {
  const diffMin = Math.round((targetMs - now.getTime()) / 60000);
  if (diffMin <= 0) return { kind: "past" };
  if (diffMin < 24 * 60) {
    return { kind: "soon", hours: Math.floor(diffMin / 60), mins: diffMin % 60 };
  }
  return {
    kind: "days",
    days: Math.floor(diffMin / (24 * 60)),
    hours: Math.floor((diffMin % (24 * 60)) / 60),
  };
}

function instantMs(date: string, hh: number, mm: number): number {
  const [y, mo, d] = date.split("-").map(Number);
  return Date.UTC(y, mo - 1, d, hh + ET_OFFSET_HOURS, mm);
}

/** Countdown to the recommended option's computed leave-by time. */
export function leaveCountdown(
  match: Match,
  transitMin: number,
  now: Date,
): Countdown {
  const clock = leaveByClock(match.kickoff, transitMin);
  if (!clock) return { kind: "none" };
  return toCountdown(instantMs(match.date, clock.hh, clock.mm), now);
}

/** Countdown to kickoff (for the header "Matchday in…" chip). */
export function kickoffCountdown(match: Match, now: Date): Countdown {
  if (!match.kickoff) return { kind: "none" };
  const [h, m] = match.kickoff.split(":").map(Number);
  return toCountdown(instantMs(match.date, h, m), now);
}

/** Terse, numeric label. `leadWord` lets the hero say "leave in" vs the
 * header's bare "in". Returns null when there's no time (TBD). */
export function formatCountdown(c: Countdown, leadWord = "in"): string | null {
  switch (c.kind) {
    case "none":
      return null;
    case "past":
      return leadWord === "in" ? "now" : "leave now";
    case "soon":
      return `${leadWord} ${c.hours}h ${String(c.mins).padStart(2, "0")}m`;
    case "days":
      return `${leadWord} ${c.days}d ${c.hours}h`;
  }
}
