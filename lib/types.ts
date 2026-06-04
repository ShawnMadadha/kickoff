export type Match = {
  id: string;
  fixture: string;
  date: string;          // ISO yyyy-mm-dd
  kickoff: string | null; // "HH:MM" 24h, or null if TBD
  stage: "Group" | "Knockout";
};

export type Origin = "Brickell" | "Miami Beach" | "Downtown" | "Aventura";

export type ArrivalOption = {
  rank: number;
  method: string;
  sub?: string;
  status: "OK" | "BLOCKED";
  leaveBy?: string;        // computed, e.g. "4:10 PM"; never model-generated
  transitEstimateMin?: number;
  sourceKeys: string[];    // keys into data/sources.json
  why?: string;            // for BLOCKED
};

export type ArrivalPlan = {
  origin: Origin;
  fixture: string;
  date: string;
  kickoff: string | null;
  options: ArrivalOption[];
};
