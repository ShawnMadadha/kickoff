// Thin wrapper over the browser SpeechRecognition API for live mic input.
// Chrome-centric and network-backed, so it's strictly best-effort — the Voice
// tab always keeps demo + text fallbacks. TTS lives in VoiceView (speechSynthesis).
import type { Language } from "./i18n";

const BCP47: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function sttSupported(): boolean {
  return getCtor() !== null;
}

/** Starts one-shot recognition. Returns a stop() handle, or null if unsupported. */
export function listen(
  language: Language,
  onResult: (transcript: string) => void,
  onDone: () => void,
): (() => void) | null {
  const Ctor = getCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = BCP47[language];
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.continuous = false;
  rec.onresult = (e) => {
    const transcript = e.results?.[0]?.[0]?.transcript ?? "";
    if (transcript) onResult(transcript);
  };
  rec.onerror = () => onDone();
  rec.onend = () => onDone();
  try {
    rec.start();
  } catch {
    return null;
  }
  return () => rec.stop();
}
