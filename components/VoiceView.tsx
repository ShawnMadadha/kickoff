"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import type { Language } from "@/lib/i18n";
import {
  VOICE_DEMOS,
  buildVoicePlan,
  renderPlanTemplate,
} from "@/lib/voiceTemplate";
import SourceChip from "./SourceChip";

const SPEECH_LANG: Record<Language, string> = {
  en: "en-US",
  es: "es-US",
  pt: "pt-BR",
};

export default function VoiceView({
  match,
  language,
  onLanguageChange,
}: {
  match: Match;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  const [transcript, setTranscript] = useState(VOICE_DEMOS[0].transcript);

  const result = useMemo(
    () => buildVoicePlan(transcript, match),
    [match, transcript],
  );
  const readback = result
    ? renderPlanTemplate(result.plan, result.language)
    : "";

  function handleDemo(index: number) {
    const demo = VOICE_DEMOS[index];
    setTranscript(demo.transcript);
    onLanguageChange(demo.language);
  }

  function speak() {
    if (!readback || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(readback);
    utterance.lang = SPEECH_LANG[result?.language ?? language];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Voice & language
        </h2>
        <p className="text-xs text-muted">Español · Português · English</p>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {VOICE_DEMOS.map((demo, index) => (
          <button
            key={demo.language}
            type="button"
            onClick={() => handleDemo(index)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-left transition-colors hover:border-accent/50"
          >
            <span className="block text-xs font-semibold">{demo.label}</span>
            <span className="mt-0.5 block text-[11px] text-muted">
              Demo STT transcript
            </span>
          </button>
        ))}
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-xs font-medium text-muted">
          Transcript
        </span>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
          placeholder="Soy hincha de Brasil, me quedo en Brickell"
        />
      </label>

      {result ? (
        <div className="rounded-xl border border-accent/50 bg-accent/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Template readback
              </p>
              <p className="mt-1 text-sm leading-relaxed">{readback}</p>
            </div>
            <button
              type="button"
              onClick={speak}
              className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink transition-opacity hover:opacity-90"
            >
              Play
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.plan.options[0]?.sourceKeys.map((key) => (
              <SourceChip key={key} k={key} />
            ))}
            <SourceChip k="no_parking" />
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
          Use a transcript that includes a seeded origin: Brickell, Miami Beach,
          Downtown, or Aventura.
        </p>
      )}

      <div className="mt-4 rounded-xl border border-line bg-card-2 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">The honest rule:</span> voice
          only does speech-to-text + translation. It fills the{" "}
          <span className="font-medium text-ink">same computed plan</span> — it
          never invents a departure time. The model can&apos;t hallucinate a
          wrong &ldquo;leave by.&rdquo;
        </p>
      </div>
    </section>
  );
}
