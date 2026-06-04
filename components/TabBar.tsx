"use client";

export type Tab = "schedule" | "plan" | "map" | "voice";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "plan", label: "Plan", icon: "🧭" },
  { id: "map", label: "Map", icon: "📍" },
  { id: "voice", label: "Voice", icon: "🎙️" },
];

export default function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="shrink-0 border-t border-line/60 bg-night/95 backdrop-blur">
      <ul className="grid grid-cols-4">
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-current={on ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  on ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {t.icon}
                </span>
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
