"use client";

import { motion } from "motion/react";
import {
  CalendarBlank,
  NavigationArrow,
  MapTrifold,
  Microphone,
  type Icon,
} from "@phosphor-icons/react";
import { t, type Language } from "@/lib/i18n";

export type Tab = "schedule" | "plan" | "map" | "voice";

const TABS: { id: Tab; Icon: Icon }[] = [
  { id: "schedule", Icon: CalendarBlank },
  { id: "plan", Icon: NavigationArrow },
  { id: "map", Icon: MapTrifold },
  { id: "voice", Icon: Microphone },
];

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
    <nav
      className="relative z-10 shrink-0 border-t border-line/60 bg-night-2/90 backdrop-blur"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ id, Icon }) => {
          const on = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={on ? "page" : undefined}
                className={`relative flex min-h-[52px] w-full flex-col items-center justify-center gap-1 pt-2.5 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/70 ${
                  on ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    aria-hidden
                    layoutId="tab-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    className="absolute top-0 h-[3px] w-7 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
                  />
                )}
                <Icon size={22} weight={on ? "fill" : "regular"} aria-hidden />
                {t("tabs", id, language)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
