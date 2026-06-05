import { describe, test, expect } from "vitest";
import { buildPlan, leaveBy } from "../lib/arrivalEngine";
import type { Match } from "../lib/types";

const scoBra: Match = {
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

describe("buildPlan — the judge-proof spine", () => {
  test("canonical demo: Brickell → Scotland vs Brazil recommends 4:10 PM", () => {
    const plan = buildPlan("Brickell", scoBra);
    const rec = plan.options.find((o) => o.status === "OK");
    expect(rec?.method).toBe("Official free shuttle");
    expect(rec?.leaveBy).toBe("4:10 PM"); // 18:00 − (35 + 75) = 16:10
  });

  test("drive is always a BLOCKED hard-stop, never a route with a time", () => {
    for (const origin of ["Brickell", "Miami Beach", "Downtown", "Aventura"] as const) {
      const drive = buildPlan(origin, scoBra).options.find((o) =>
        o.method.toLowerCase().includes("drive"),
      );
      expect(drive?.status).toBe("BLOCKED");
      expect(drive?.leaveBy).toBeUndefined();
      expect(drive?.sourceKeys).toContain("no_parking");
    }
  });

  test("knockout (no kickoff) → TBD, never a fabricated time", () => {
    const plan = buildPlan("Brickell", knockout);
    const ok = plan.options.filter((o) => o.status === "OK");
    expect(ok.length).toBeGreaterThan(0);
    expect(ok.every((o) => o.leaveBy === "TBD")).toBe(true);
  });
});

describe("leaveBy — midnight wrap guard", () => {
  test("wraps past midnight instead of going negative", () => {
    // 01:00 kickoff, 0 transit → 60 − 75 = −15 → 23:45 = 11:45 PM
    expect(leaveBy("01:00", 0)).toBe("11:45 PM");
  });
  test("null kickoff → TBD", () => {
    expect(leaveBy(null, 30)).toBe("TBD");
  });
});
