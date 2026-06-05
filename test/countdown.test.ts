import { describe, test, expect } from "vitest";
import {
  leaveCountdown,
  kickoffCountdown,
  formatCountdown,
} from "../lib/countdown";
import type { Match } from "../lib/types";

// Scotland vs Brazil, 6:00 PM ET. Brickell shuttle transit = 35 → leave-by 4:10 PM ET.
// 4:10 PM EDT = 20:10 UTC on the match date.
const match: Match = {
  id: "sco-bra",
  fixture: "Scotland vs Brazil",
  date: "2026-06-24",
  kickoff: "18:00",
  stage: "Group",
};
const knockout: Match = {
  id: "r32",
  fixture: "Round of 32",
  date: "2026-07-03",
  kickoff: null,
  stage: "Knockout",
};
const TRANSIT = 35;

describe("leaveCountdown (anchored on match date + ET)", () => {
  test("< 24h before leave-by → soon, with hours+mins", () => {
    const now = new Date(Date.UTC(2026, 5, 24, 18, 0)); // 6:00 PM UTC = 2h10m before 20:10 UTC
    const cd = leaveCountdown(match, TRANSIT, now);
    expect(cd).toEqual({ kind: "soon", hours: 2, mins: 10 });
    expect(formatCountdown(cd, "leave in")).toBe("leave in 2h 10m");
  });

  test("after leave-by → past, never negative", () => {
    const now = new Date(Date.UTC(2026, 5, 24, 21, 0)); // past 20:10 UTC
    const cd = leaveCountdown(match, TRANSIT, now);
    expect(cd.kind).toBe("past");
    expect(formatCountdown(cd, "leave in")).toBe("leave now");
  });

  test(">= 24h out → days (the demo-day case: shows days, not a fake 2h)", () => {
    const now = new Date(Date.UTC(2026, 5, 4, 12, 0)); // ~20 days early
    const cd = leaveCountdown(match, TRANSIT, now);
    expect(cd.kind).toBe("days");
    if (cd.kind === "days") expect(cd.days).toBeGreaterThanOrEqual(19);
    expect(formatCountdown(cd, "leave in")).toMatch(/^leave in \d+d \d+h$/);
  });

  test("null kickoff (knockout) → none, no countdown shown", () => {
    const cd = leaveCountdown(knockout, TRANSIT, new Date());
    expect(cd).toEqual({ kind: "none" });
    expect(formatCountdown(cd, "leave in")).toBeNull();
  });

  test("a non-ET host clock is irrelevant — anchoring is absolute (UTC) math", () => {
    // Same instant expressed two ways must give the same countdown.
    const a = new Date(Date.UTC(2026, 5, 24, 18, 0));
    const b = new Date(a.getTime());
    expect(leaveCountdown(match, TRANSIT, a)).toEqual(
      leaveCountdown(match, TRANSIT, b),
    );
  });
});

describe("kickoffCountdown (header chip)", () => {
  test("counts to kickoff, days when far out", () => {
    const now = new Date(Date.UTC(2026, 5, 14, 22, 0));
    const cd = kickoffCountdown(match, now); // kickoff 18:00 ET = 22:00 UTC
    expect(cd.kind).toBe("days");
  });
  test("null kickoff → none", () => {
    expect(kickoffCountdown(knockout, new Date())).toEqual({ kind: "none" });
  });
});
