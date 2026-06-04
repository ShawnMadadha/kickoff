"use client";

import { useState } from "react";
import matchesData from "@/data/matches.json";
import type { Match } from "@/lib/types";
import TabBar, { type Tab } from "./TabBar";
import ScheduleView from "./ScheduleView";
import PlanView from "./PlanView";
import MapView from "./MapView";
import VoiceView from "./VoiceView";

const matches = matchesData.matches as unknown as Match[];

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0].id);

  const selectedMatch =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0];

  function pickMatch(id: string) {
    setSelectedMatchId(id);
    setTab("plan");
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-night-2 shadow-2xl shadow-black/40 sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border sm:border-line/60">
      <header className="flex items-center gap-2 border-b border-line/60 px-5 py-4">
        <span className="text-xl" aria-hidden>
          ⚽
        </span>
        <div className="leading-tight">
          <h1 className="text-base font-semibold tracking-tight">Kickoff</h1>
          <p className="text-[11px] text-muted">
            Get to the match, not the traffic
          </p>
        </div>
        <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Miami · WC 26
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {tab === "schedule" && (
          <ScheduleView
            matches={matches}
            selectedId={selectedMatchId}
            onPick={pickMatch}
          />
        )}
        {tab === "plan" && <PlanView match={selectedMatch} />}
        {tab === "map" && <MapView />}
        {tab === "voice" && <VoiceView />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
