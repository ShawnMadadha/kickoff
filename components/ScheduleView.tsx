"use client";

import type { Match } from "@/lib/types";
import matchesData from "@/data/matches.json";
import { formatDate, formatKickoff } from "@/lib/format";
import SourceChip from "./SourceChip";

const venueName = matchesData.venue.name;

export default function ScheduleView({
  matches,
  selectedId,
  onPick,
}: {
  matches: Match[];
  selectedId: string;
  onPick: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Miami matches</h2>
        <p className="text-xs text-muted">
          {matches.length} World Cup matches at {venueName}. Tap one to plan your
          arrival.
        </p>
      </div>

      {/* The stakes — real, sourced. Sets up the whole pitch. */}
      <div className="mb-4 rounded-xl border border-danger/30 bg-danger-bg/60 p-3">
        <p className="text-xs leading-relaxed text-ink">
          <span className="font-semibold text-danger">Why this matters:</span>{" "}
          the 2024 Copa América final at this exact stadium ended in a dangerous
          crowd crush. There&apos;s no stadium parking and the shuttle is
          ticketholder-only. Kickoff fixes the first mile.
        </p>
        <div className="mt-2">
          <SourceChip k="copa_2024" />
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {matches.map((m) => {
          const isSelected = m.id === selectedId;
          const tbd = m.kickoff === null;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onPick(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? "border-accent/60 bg-accent/5"
                    : "border-line bg-card hover:border-accent/40 hover:bg-card-2"
                }`}
              >
                <div className="flex w-12 shrink-0 flex-col items-center">
                  <span className="text-[10px] uppercase tracking-wide text-muted">
                    {formatDate(m.date).split(",")[1]?.trim().split(" ")[0]}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {m.date.split("-")[2]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.fixture}</p>
                  <p className="text-xs text-muted">
                    {formatKickoff(m.kickoff)}
                    {tbd && (
                      <span className="ml-1 text-muted/70">
                        · bracket pending
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    m.stage === "Knockout"
                      ? "bg-card-2 text-muted"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {m.stage}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
