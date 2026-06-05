"use client";

import { useState } from "react";
import type { Match, Origin } from "@/lib/types";
import { buildPlan } from "@/lib/arrivalEngine";
import matchesData from "@/data/matches.json";
import { formatDate, formatKickoff } from "@/lib/format";
import SourceChip from "./SourceChip";
import LeaveAlert from "./LeaveAlert";

const ORIGINS: Origin[] = ["Brickell", "Miami Beach", "Downtown", "Aventura"];
const venue = matchesData.venue;

/** Uber universal deep link with the stadium prefilled as the drop-off. */
function uberLink() {
  const p = new URLSearchParams({
    action: "setPickup",
    "dropoff[latitude]": String(venue.lat),
    "dropoff[longitude]": String(venue.lng),
    "dropoff[nickname]": venue.name,
  });
  return `https://m.uber.com/ul/?${p.toString()}`;
}

export default function PlanView({ match }: { match: Match }) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const plan = origin ? buildPlan(origin, match) : null;

  return (
    <section>
      {/* Selected match header */}
      <div className="mb-4 rounded-xl border border-line bg-card p-4">
        <p className="text-base font-semibold tracking-tight">{match.fixture}</p>
        <p className="text-xs text-muted">
          {formatDate(match.date)} · {formatKickoff(match.kickoff)} ·{" "}
          {venue.name}
        </p>
      </div>

      {/* Origin picker */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-muted">
          Where are you staying?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ORIGINS.map((o) => {
            const on = origin === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setOrigin(o)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-card text-ink hover:border-accent/50"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>

      {!plan && (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
          Pick where you&apos;re staying to see your ranked arrival plan.
        </p>
      )}

      {plan && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted">
            Ranked for {origin} → {venue.name}. Times include a 75-min walk +
            security buffer.
          </p>

          {plan.options.map((opt) => {
            if (opt.status === "BLOCKED") {
              return (
                <div
                  key={opt.rank}
                  className="rounded-xl border border-danger/40 bg-danger-bg/60 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" aria-hidden>
                      🚫
                    </span>
                    <p className="text-sm font-semibold text-danger">
                      {opt.method} — not an option
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-ink">{opt.why}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {opt.sourceKeys.map((k) => (
                      <SourceChip key={k} k={k} />
                    ))}
                  </div>
                </div>
              );
            }

            const isRideshare = opt.method.toLowerCase().includes("rideshare");
            return (
              <div
                key={opt.rank}
                className={`rounded-xl border p-4 ${
                  opt.rank === 1
                    ? "border-accent/60 bg-accent/5"
                    : "border-line bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{opt.method}</p>
                      {opt.rank === 1 && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          Recommended
                        </span>
                      )}
                    </div>
                    {opt.sub && (
                      <p className="mt-0.5 text-xs text-muted">{opt.sub}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Leave by
                    </p>
                    <p className="text-2xl font-bold leading-none text-accent">
                      {opt.leaveBy}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted">
                    ~{opt.transitEstimateMin} min{" "}
                    <span className="text-muted/70">(estimate)</span>
                  </p>
                </div>

                {(opt.sourceKeys.length > 0 || isRideshare) && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {opt.sourceKeys.map((k) => (
                      <SourceChip key={k} k={k} />
                    ))}
                    {isRideshare && (
                      <a
                        href={uberLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold text-night transition-opacity hover:opacity-90"
                      >
                        Open in Uber →
                      </a>
                    )}
                  </div>
                )}

                {match.kickoff !== null && origin && (
                  <LeaveAlert match={match} origin={origin} option={opt} />
                )}
              </div>
            );
          })}

          {match.kickoff === null && (
            <p className="rounded-lg bg-card-2 px-3 py-2 text-[11px] text-muted">
              This is a knockout match — the exact kickoff time is set once the
              bracket is decided, so leave-by times show as TBD until then. No
              fake times.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
