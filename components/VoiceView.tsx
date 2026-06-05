"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Match } from "@/lib/types";
import { t, type Language } from "@/lib/i18n";
import {
  VOICE_DEMOS,
  buildVoicePlan,
  parseVoiceTranscript,
  renderPlanTemplate,
} from "@/lib/voiceTemplate";
import { listen, sttSupported } from "@/lib/speech";
import SourceChip from "./SourceChip";

const SPEECH_LANG: Record<Language, string> = {
  en: "en-US",
  es: "es-US",
  pt: "pt-BR",
};

// Client-only flag without an effect (avoids a hydration mismatch + the
// react-compiler set-state-in-effect lint) for SpeechRecognition detection.
const emptySubscribe = () => () => {};

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
  const [listening, setListening] = useState(false);
  const stopRef = useRef<null | (() => void)>(null);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const micEnabled = isClient && sttSupported();

  const result = useMemo(
    () => buildVoicePlan(transcript, match),
    [match, transcript],
  );
  const readback = result
    ? renderPlanTemplate(result.plan, result.language)
    : "";

  function applyTranscript(text: string) {
    setTranscript(text);
    const parsed = parseVoiceTranscript(text);
    if (parsed) onLanguageChange(parsed.language);
  }

  function handleDemo(index: number) {
    const demo = VOICE_DEMOS[index];
    applyTranscript(demo.transcript);
  }

  function onMic() {
    if (listening) {
      stopRef.current?.();
      setListening(false);
      return;
    }
    setListening(true);
    const stop = listen(
      language,
      (tr) => applyTranscript(tr),
      () => setListening(false),
    );
    if (!stop) setListening(false);
    else stopRef.current = stop;
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
      <div className="mb-3 text-center">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("voice", "title", language)}
        </h2>
        <p className="text-xs text-muted">{t("voice", "sub", language)}</p>
      </div>

      {/* Live mic (Chrome) or a hint pointing to the demos/text */}
      {isClient && (
        <div className="mb-4 flex flex-col items-center">
          {micEnabled ? (
            <>
              <button
                type="button"
                onClick={onMic}
                aria-pressed={listening}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-all ${
                  listening
                    ? "animate-pulse bg-danger/20 ring-4 ring-danger/40"
                    : "bg-accent/15 ring-2 ring-accent/30 hover:bg-accent/25"
                }`}
              >
                🎙️
              </button>
              <p className="mt-2 text-xs text-muted">
                {listening
                  ? t("voice", "listening", language)
                  : t("voice", "tapMic", language)}
              </p>
            </>
          ) : (
            <div className="w-full rounded-xl border border-dashed border-line bg-card px-4 py-2.5 text-center text-xs text-muted">
              {t("voice", "micHint", language)}
            </div>
          )}
        </div>
      )}

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
              {t("voice", "demoLabel", language)}
            </span>
          </button>
        ))}
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-xs font-medium text-muted">
          {t("voice", "transcript", language)}
        </span>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
          placeholder={t("voice", "placeholder", language)}
        />
      </label>

      {result ? (
        <div className="rounded-xl border border-accent/50 bg-accent/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {t("voice", "readbackLabel", language)}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{readback}</p>
            </div>
            <button
              type="button"
              onClick={speak}
              className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink transition-opacity hover:opacity-90"
            >
              ▶ {t("voice", "play", language)}
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
          {t("voice", "emptyHint", language)}
        </p>
      )}

      <div className="mt-4 rounded-xl border border-line bg-card-2 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">⚖️</span>{" "}
          {t("voice", "rule", language)}
        </p>
      </div>
    </section>
  );
}
