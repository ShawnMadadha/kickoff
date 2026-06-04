// Deterministic arrival router. Direct port of the verified reference/arrival_router.py.
// RULE: every time here is COMPUTED. Never let an LLM produce a departure time.
import type { Match, Origin, ArrivalOption, ArrivalPlan } from "./types";

const SECURITY_BUFFER_MIN = 75; // walk + security; arrive early

type Method = {
  name: string;
  sub?: string;
  transitMin: number;
  sourceKeys: string[];
  hardStop?: string; // source key => this is a blocked option, not a route
};

const PLANS: Record<Origin, Method[]> = {
  "Brickell": [
    { name: "Official free shuttle", sub: "From the Brickell rail hub", transitMin: 35, sourceKeys: ["shuttle_window", "ticketholder_only"] },
    { name: "Metrorail + shuttle", sub: "Transfer at a rail hub", transitMin: 50, sourceKeys: ["transit_encouraged"] },
    { name: "Rideshare", sub: "Drop-off outside the security perimeter", transitMin: 40, sourceKeys: [] },
    { name: "Drive & park", transitMin: 0, sourceKeys: [], hardStop: "no_parking" },
  ],
  "Miami Beach": [
    { name: "Official shuttle", sub: "From Miami Beach Convention Center", transitMin: 55, sourceKeys: ["shuttle_window", "ticketholder_only"] },
    { name: "Rideshare", sub: "Across the causeway, drop-off outside", transitMin: 50, sourceKeys: [] },
    { name: "Drive & park", transitMin: 0, sourceKeys: [], hardStop: "no_parking" },
  ],
  "Downtown": [
    { name: "Metrorail + shuttle", sub: "Transfer at a rail hub", transitMin: 45, sourceKeys: ["transit_encouraged", "ticketholder_only"] },
    { name: "Rideshare", sub: "Drop-off outside the perimeter", transitMin: 40, sourceKeys: [] },
    { name: "Drive & park", transitMin: 0, sourceKeys: [], hardStop: "no_parking" },
  ],
  "Aventura": [
    { name: "Brightline + shuttle", sub: "Transfer at Aventura", transitMin: 30, sourceKeys: ["shuttle_window"] },
    { name: "Rideshare", sub: "Short hop, drop-off outside", transitMin: 25, sourceKeys: [] },
    { name: "Drive & park", transitMin: 0, sourceKeys: [], hardStop: "no_parking" },
  ],
};

function toAmPm(totalMin: number): string {
  const x = ((totalMin % 1440) + 1440) % 1440;
  let h = Math.floor(x / 60);
  const m = x % 60;
  const ap = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
}

export function leaveBy(kickoff: string | null, transitMin: number): string {
  if (!kickoff) return "TBD";
  const [h, m] = kickoff.split(":").map(Number);
  return toAmPm(h * 60 + m - (transitMin + SECURITY_BUFFER_MIN));
}

export function buildPlan(origin: Origin, match: Match): ArrivalPlan {
  const options: ArrivalOption[] = PLANS[origin].map((mth, i) => {
    if (mth.hardStop) {
      return { rank: i + 1, method: mth.name, status: "BLOCKED",
        why: "No parking available at the stadium", sourceKeys: [mth.hardStop] };
    }
    return {
      rank: i + 1, method: mth.name, sub: mth.sub, status: "OK",
      transitEstimateMin: mth.transitMin,
      leaveBy: leaveBy(match.kickoff, mth.transitMin),
      sourceKeys: mth.sourceKeys,
    };
  });
  return { origin, fixture: match.fixture, date: match.date, kickoff: match.kickoff, options };
}
