import { buildPlan } from "./arrivalEngine";
import type { ArrivalPlan, Match, Origin } from "./types";
import type { Language } from "./i18n";

export type VoiceDemo = {
  language: Language;
  label: string;
  transcript: string;
  origin: Origin;
};

export const VOICE_DEMOS: VoiceDemo[] = [
  {
    language: "es",
    label: "Spanish",
    transcript: "Soy hincha de Brasil, me quedo en Brickell",
    origin: "Brickell",
  },
  {
    language: "pt",
    label: "Portuguese",
    transcript: "Sou torcedor do Brasil, estou em Aventura",
    origin: "Aventura",
  },
];

const ORIGIN_ALIASES: { origin: Origin; aliases: string[] }[] = [
  { origin: "Brickell", aliases: ["brickell"] },
  { origin: "Miami Beach", aliases: ["miami beach", "south beach", "playa"] },
  { origin: "Downtown", aliases: ["downtown", "centro"] },
  { origin: "Aventura", aliases: ["aventura"] },
];

const LANGUAGE_MARKERS: { language: Language; markers: string[] }[] = [
  { language: "es", markers: ["soy", "hincha", "me quedo", "estoy"] },
  { language: "pt", markers: ["sou", "torcedor", "estou"] },
];

export function parseVoiceTranscript(transcript: string): {
  language: Language;
  origin: Origin;
} | null {
  const normalized = transcript.trim().toLowerCase();
  const origin = ORIGIN_ALIASES.find(({ aliases }) =>
    aliases.some((alias) => normalized.includes(alias)),
  )?.origin;
  if (!origin) return null;

  const language =
    LANGUAGE_MARKERS.find(({ markers }) =>
      markers.some((marker) => normalized.includes(marker)),
    )?.language ?? "en";

  return { language, origin };
}

export function buildVoicePlan(transcript: string, match: Match) {
  const parsed = parseVoiceTranscript(transcript);
  if (!parsed) return null;
  return {
    ...parsed,
    plan: buildPlan(parsed.origin, match),
  };
}

export function renderPlanTemplate(plan: ArrivalPlan, language: Language) {
  const best = plan.options.find((option) => option.status === "OK");
  const blocked = plan.options.find((option) => option.status === "BLOCKED");
  if (!best) return "";

  if (language === "es") {
    return [
      `Para ${plan.fixture}, desde ${plan.origin}, la mejor opción es ${best.method}.`,
      `Sal a las ${best.leaveBy}. Ese horario viene del motor de llegada.`,
      blocked ? "Conducir no es opción: no hay estacionamiento en el estadio." : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (language === "pt") {
    return [
      `Para ${plan.fixture}, saindo de ${plan.origin}, a melhor opção é ${best.method}.`,
      `Saia às ${best.leaveBy}. Esse horário vem do motor de chegada.`,
      blocked ? "Dirigir está fora: não há estacionamento no estádio." : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    `For ${plan.fixture}, from ${plan.origin}, the best option is ${best.method}.`,
    `Leave by ${best.leaveBy}. That time comes from the arrival engine.`,
    blocked ? "Driving is out: there's no parking at the stadium." : "",
  ]
    .filter(Boolean)
    .join(" ");
}
