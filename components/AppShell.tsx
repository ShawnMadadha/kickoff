"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import matchesData from "@/data/matches.json";
import type { Match } from "@/lib/types";
import { t, type Language } from "@/lib/i18n";
import { kickoffCountdown, formatCountdown } from "@/lib/countdown";
import { useNow } from "@/lib/useNow";
import TabBar, { type Tab } from "./TabBar";
import ScheduleView from "./ScheduleView";
import PlanView from "./PlanView";
import MapView from "./MapView";
import VoiceView from "./VoiceView";
import LanguageToggle from "./LanguageToggle";

const matches = matchesData.matches as unknown as Match[];

function MatchdayChip({ match }: { match: Match }) {
  const now = useNow();
  const label = now ? formatCountdown(kickoffCountdown(match, now), "in") : null;
  if (!label) {
    return (
      <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
        Miami · WC 26
      </span>
    );
  }
  return (
    <span className="rounded-full border border-line bg-card-2 px-2.5 py-1 text-[10px] font-medium text-muted">
      Matchday{" "}
      <span className="tnum font-semibold text-accent">{label}</span>
    </span>
  );
}

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0].id);
  const [language, setLanguage] = useState<Language>("en");

  const selectedMatch =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0];

  function pickMatch(id: string) {
    setSelectedMatchId(id);
    setTab("plan");
  }

  const showLang = tab === "plan" || tab === "map" || tab === "voice";

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-night-2 shadow-2xl shadow-black/40 sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border sm:border-line/60">
        <header
          className="flex items-center gap-2.5 border-b border-line/60 px-5 py-3.5"
          style={{ paddingTop: "max(0.875rem, env(safe-area-inset-top))" }}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-accent to-[oklch(70%_0.1_195)] text-accent-ink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          <div className="leading-tight">
            <h1 className="font-display text-[18px] font-extrabold tracking-tight">
              Kickoff
            </h1>
            <p className="text-[11px] text-muted">
              {t("header", "tagline", language)}
            </p>
          </div>
          <div className="ml-auto">
            {showLang ? (
              <LanguageToggle language={language} onChange={setLanguage} />
            ) : (
              <MatchdayChip match={selectedMatch} />
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
          {tab === "schedule" && (
            <ScheduleView
              matches={matches}
              selectedId={selectedMatchId}
              onPick={pickMatch}
            />
          )}
          {tab === "plan" && (
            <PlanView match={selectedMatch} language={language} />
          )}
          {tab === "map" && <MapView language={language} />}
          {tab === "voice" && (
            <VoiceView
              match={selectedMatch}
              language={language}
              onLanguageChange={setLanguage}
            />
          )}
        </main>

        <TabBar active={tab} onChange={setTab} language={language} />
      </div>
    </MotionConfig>
  );
}
