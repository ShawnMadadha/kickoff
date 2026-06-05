"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { Prohibit } from "@phosphor-icons/react";
import type { Match, Origin } from "@/lib/types";
import { buildPlan } from "@/lib/arrivalEngine";
import matchesData from "@/data/matches.json";
import { formatDate, formatKickoff } from "@/lib/format";
import { leaveCountdown, formatCountdown } from "@/lib/countdown";
import { useNow } from "@/lib/useNow";
import { t, type Language } from "@/lib/i18n";
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function isRideshare(method: string) {
  return method.toLowerCase().includes("rideshare");
}

export default function PlanView({
  match,
  language,
}: {
  match: Match;
  language: Language;
}) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const now = useNow();
  const plan = origin ? buildPlan(origin, match) : null;

  const ok = plan ? plan.options.filter((o) => o.status === "OK") : [];
  const rec = ok[0];
  const alts = ok.slice(1);
  const blocked = plan ? plan.options.filter((o) => o.status === "BLOCKED") : [];

  const cdLabel =
    rec && now && rec.transitEstimateMin != null
      ? formatCountdown(
          leaveCountdown(match, rec.transitEstimateMin, now),
          "leave in",
        )
      : null;

  const [recTime, recAp] = (rec?.leaveBy ?? "").split(" ");

  return (
    <section>
      {/* Selected match */}
      <div className="mb-4">
        <p className="font-display text-lg font-bold tracking-tight">
          {match.fixture}
        </p>
        <p className="text-xs text-muted">
          {formatDate(match.date)} · {formatKickoff(match.kickoff)} · {venue.name}
        </p>
      </div>

      {/* Origin picker */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {t("plan", "stay", language)}
        </p>
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map((o) => {
            const on = origin === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setOrigin(o)}
                aria-pressed={on}
                className={`min-h-[44px] rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
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
        <p className="rounded-2xl border border-dashed border-line px-4 py-7 text-center text-xs text-muted">
          {t("plan", "empty", language)}
        </p>
      )}

      {plan && rec && (
        <motion.div
          key={origin}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* HERO — the recommended departure-board moment */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                {t("plan", "leaveBy", language)}
              </span>
              <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                {t("plan", "recommended", language)} · {rec.method}
              </span>
            </div>

            {match.kickoff === null ? (
              <div className="mt-1 font-display text-5xl font-black tracking-tight">
                TBD
              </div>
            ) : (
              <>
                <div className="mt-1 font-display text-[64px] font-black leading-[0.92] tracking-tight tnum">
                  {recTime}
                  <span className="ml-1.5 text-3xl font-bold text-accent">
                    {recAp}
                  </span>
                </div>
                {cdLabel && (
                  <div className="flex items-center gap-2 text-[13px] text-muted tnum">
                    <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
                    {cdLabel} · ~{rec.transitEstimateMin} min
                  </div>
                )}
              </>
            )}

            {/* Route timeline (engine times only; durations elsewhere) */}
            <ol className="mt-4">
              <TimelineNode
                tone="start"
                title={origin!}
                sub="Your stay"
                when={match.kickoff === null ? undefined : recTime}
              />
              <TimelineNode
                title={rec.method}
                sub={`~${rec.transitEstimateMin} min in match-day traffic`}
              />
              <TimelineNode buffer title="Walk in + security screening" sub="75-min buffer baked in" />
              <TimelineNode
                tone="end"
                title="Kickoff"
                sub="Be in your seat"
                when={
                  match.kickoff
                    ? formatKickoff(match.kickoff).replace(" ET", "")
                    : "TBD"
                }
              />
            </ol>

            {/* Proof + primary CTA */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {rec.sourceKeys.map((k) => (
                <SourceChip key={k} k={k} />
              ))}
            </div>
            {isRideshare(rec.method) && (
              <a
                href={uberLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-accent font-display text-sm font-bold text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.99]"
              >
                {t("plan", "uber", language)} →
              </a>
            )}
            {match.kickoff !== null && origin && (
              <LeaveAlert
                match={match}
                origin={origin}
                option={rec}
                language={language}
              />
            )}
          </motion.div>

          {/* Alternatives — quiet, not loud cards */}
          {alts.map((opt) => (
            <motion.div
              key={opt.rank}
              variants={item}
              className="mt-3 rounded-2xl border border-line bg-card p-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{opt.method}</p>
                  {opt.sub && <p className="text-xs text-muted">{opt.sub}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-wide text-muted">
                    {t("plan", "leaveBy", language)}
                  </p>
                  <p className="font-display text-lg font-bold text-accent tnum">
                    {opt.leaveBy}
                  </p>
                </div>
              </div>
              {(opt.sourceKeys.length > 0 || isRideshare(opt.method)) && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {opt.sourceKeys.map((k) => (
                    <SourceChip key={k} k={k} />
                  ))}
                  {isRideshare(opt.method) && (
                    <a
                      href={uberLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold text-night transition-opacity hover:opacity-90"
                    >
                      {t("plan", "uber", language)} →
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {/* Blocked hard-stop */}
          {blocked.map((opt) => (
            <motion.div
              key={opt.rank}
              variants={item}
              className="mt-3 rounded-2xl border border-danger/35 bg-danger-bg/50 p-4"
            >
              <div className="flex items-center gap-2 text-danger">
                <Prohibit size={18} weight="bold" aria-hidden />
                <p className="text-sm font-semibold">
                  {opt.method} — {t("plan", "notOption", language)}
                </p>
              </div>
              <p className="mt-1 text-xs text-ink">{opt.why}</p>
              {opt.sourceKeys.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {opt.sourceKeys.map((k) => (
                    <SourceChip key={k} k={k} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {match.kickoff === null && (
            <motion.p
              variants={item}
              className="mt-3 rounded-xl bg-card-2 px-3 py-2 text-[11px] text-muted"
            >
              {t("plan", "tbd", language)}
            </motion.p>
          )}
        </motion.div>
      )}
    </section>
  );
}

function TimelineNode({
  title,
  sub,
  when,
  tone,
  buffer,
}: {
  title: string;
  sub: string;
  when?: string;
  tone?: "start" | "end";
  buffer?: boolean;
}) {
  const pin =
    tone === "start"
      ? "bg-accent border-accent"
      : tone === "end"
        ? "bg-rush border-rush"
        : "bg-night border-accent/50";
  return (
    <motion.li
      variants={item}
      className="relative grid grid-cols-[18px_1fr_auto] items-start gap-3 pb-4 last:pb-0"
    >
      {tone !== "end" && (
        <span aria-hidden className="absolute left-2 top-[18px] bottom-0 w-px bg-line" />
      )}
      <span className={`mt-0.5 h-[18px] w-[18px] rounded-full border-2 ${pin}`} />
      <span>
        <span className={`block text-sm ${buffer ? "font-medium text-muted" : "font-semibold"}`}>
          {title}
        </span>
        <span className="block text-xs text-muted">{sub}</span>
      </span>
      {when && (
        <span className="font-display text-sm font-semibold text-muted tnum">
          {when}
        </span>
      )}
    </motion.li>
  );
}
