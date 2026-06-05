"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
import matchesData from "@/data/matches.json";
import type { Match, Origin } from "@/lib/types";
import { t, type Language } from "@/lib/i18n";
import { kickoffCountdown, formatCountdown } from "@/lib/countdown";
import { useNow } from "@/lib/useNow";
import TabBar, { type Tab } from "./TabBar";
import LoginScreen from "./LoginScreen";
import CountryPicker, { type Country } from "./CountryPicker";
import TeamBackground from "./TeamBackground";
import { TEAMS } from "@/lib/teams";
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
  const [entered, setEntered] = useState(false);
  const [team, setTeam] = useState<Country | "none" | null>(null);
  const [initialOrigin, setInitialOrigin] = useState<Origin | null>(null);

  const selectedMatch =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0];

  // Deep link from a shared/QR'd plan: ?m=<match>&o=<origin>&l=<lang>.
  // Lands straight on the plan (skips the splash) in the shared language.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get("m");
    if (!m || !matches.some((x) => x.id === m)) return;
    const o = p.get("o");
    const l = p.get("l");
    const validOrigins: Origin[] = ["Brickell", "Miami Beach", "Downtown", "Aventura"];
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedMatchId(m);
    if (l === "en" || l === "es" || l === "pt") setLanguage(l);
    if (o && validOrigins.includes(o as Origin)) setInitialOrigin(o as Origin);
    setTab("plan");
    setEntered(true);
    setTeam("none"); // deep link skips the splash + country picker
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function pickMatch(id: string) {
    setSelectedMatchId(id);
    setTab("plan");
  }

  const showLang = tab === "plan" || tab === "map" || tab === "voice";
  // Chosen team recolors every `accent` across the app (token override).
  const tm = team && team !== "none" ? TEAMS[team] : null;
  const teamStyle = tm
    ? ({ "--color-accent": tm.accent } as CSSProperties)
    : undefined;

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", visualDuration: 0.45, bounce: 0.12 }}
    >
      <div
        style={teamStyle}
        className="relative z-10 mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-night-2 shadow-2xl shadow-black/40 sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border sm:border-line/60"
      >
        <TeamBackground team={team} />
        <header
          className="relative z-10 flex items-center gap-2.5 border-b border-line/60 px-5 py-3.5"
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

        <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-6 pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "schedule" && (
                <ScheduleView
                  matches={matches}
                  selectedId={selectedMatchId}
                  onPick={pickMatch}
                />
              )}
              {tab === "plan" && (
                <PlanView
                  match={selectedMatch}
                  language={language}
                  initialOrigin={initialOrigin}
                />
              )}
              {tab === "map" && <MapView language={language} />}
              {tab === "voice" && (
                <VoiceView
                  match={selectedMatch}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <TabBar active={tab} onChange={setTab} language={language} />

        <AnimatePresence>
          {!entered && (
            <LoginScreen key="login" onEnter={() => setEntered(true)} />
          )}
          {entered && team === null && (
            <CountryPicker key="country" onPick={setTeam} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
