"use client";

import { t, type Language } from "@/lib/i18n";

export type Tab = "schedule" | "plan" | "map" | "voice";

const ICONS: Record<Tab, string> = {
  schedule: "📅",
  plan: "🧭",
  map: "📍",
  voice: "🎙️",
};

const ORDER: Tab[] = ["schedule", "plan", "map", "voice"];

export default function TabBar({
  active,
  onChange,
  language,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  language: Language;
}) {
  return (
    <nav className="shrink-0 border-t border-line/60 bg-night/95 backdrop-blur">
      <ul className="grid grid-cols-4">
        {ORDER.map((id) => {
          const on = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={on ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  on ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {ICONS[id]}
                </span>
                {t("tabs", id, language)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
