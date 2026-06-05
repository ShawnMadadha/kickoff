"use client";

import { LANGUAGES, type Language } from "@/lib/i18n";

export default function LanguageToggle({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div
      className="inline-grid grid-cols-3 rounded-full border border-line bg-card p-0.5"
      aria-label="Language"
    >
      {LANGUAGES.map((item) => {
        const on = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => onChange(item.code)}
            className={`h-7 min-w-10 rounded-full px-2 text-[11px] font-semibold transition-colors ${
              on ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
