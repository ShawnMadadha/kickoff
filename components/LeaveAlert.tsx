"use client";

import { useState } from "react";
import type { Match, Origin, ArrivalOption } from "@/lib/types";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import { previewLeaveAlert } from "@/lib/notify";
import { t, fill, type Language } from "@/lib/i18n";

export default function LeaveAlert({
  match,
  origin,
  option,
  language,
}: {
  match: Match;
  origin: Origin;
  option: ArrivalOption;
  language: Language;
}) {
  const [added, setAdded] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function onCalendar() {
    const ics = buildIcs(match, origin, option);
    if (!ics) return;
    const slug = match.fixture.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    downloadIcs(`kickoff-${slug}.ics`, ics);
    setAdded(true);
  }

  async function onPreview() {
    const r = await previewLeaveAlert(match, option);
    setMsg(
      r === "shown"
        ? t("alert", "previewed", language)
        : r === "denied"
          ? t("alert", "blocked", language)
          : t("alert", "unsupported", language),
    );
  }

  return (
    <div className="mt-3 border-t border-line/60 pt-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onCalendar}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            added
              ? "border-accent/60 bg-accent/15 text-accent"
              : "border-line bg-card-2 text-ink hover:border-accent/50"
          }`}
        >
          {added
            ? `✓ ${t("alert", "added", language)}`
            : `📅 ${t("alert", "add", language)}`}
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors hover:border-accent/50"
        >
          🔔 {t("alert", "preview", language)}
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-muted/80">
        {msg ??
          fill(t("alert", "note", language), { time: option.leaveBy ?? "" })}
      </p>
    </div>
  );
}
