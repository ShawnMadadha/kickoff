export type Language = "en" | "es" | "pt";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

export const copy = {
  header: {
    tagline: {
      en: "Get to the match, not the traffic",
      es: "Llega al partido, no al tráfico",
      pt: "Chegue ao jogo, não ao trânsito",
    },
  },
  tabs: {
    schedule: { en: "Schedule", es: "Partidos", pt: "Jogos" },
    plan: { en: "Plan", es: "Plan", pt: "Plano" },
    map: { en: "Map", es: "Mapa", pt: "Mapa" },
    voice: { en: "Voice", es: "Voz", pt: "Voz" },
  },
  plan: {
    stay: {
      en: "Where are you staying?",
      es: "¿Dónde te hospedas?",
      pt: "Onde você está hospedado?",
    },
    empty: {
      en: "Pick where you're staying to see your ranked arrival plan.",
      es: "Elige dónde te hospedas para ver tu plan de llegada.",
      pt: "Escolha onde você está hospedado para ver seu plano de chegada.",
    },
    ranked: {
      en: "Ranked for",
      es: "Ordenado para",
      pt: "Ordenado para",
    },
    buffer: {
      en: "Times include a 75-min walk + security buffer.",
      es: "Los tiempos incluyen 75 min de caminata + seguridad.",
      pt: "Os tempos incluem 75 min de caminhada + segurança.",
    },
    notOption: {
      en: "not an option",
      es: "no es opción",
      pt: "não é opção",
    },
    recommended: {
      en: "Recommended",
      es: "Recomendado",
      pt: "Recomendado",
    },
    leaveBy: {
      en: "Leave by",
      es: "Sal a las",
      pt: "Saia às",
    },
    estimate: {
      en: "estimate",
      es: "estimado",
      pt: "estimado",
    },
    uber: {
      en: "Open in Uber",
      es: "Abrir en Uber",
      pt: "Abrir no Uber",
    },
    tbd: {
      en: "This is a knockout match — the exact kickoff time is set once the bracket is decided, so leave-by times show as TBD until then. No fake times.",
      es: "Es un partido de eliminatoria: la hora exacta se fija cuando se define el cuadro, así que la hora de salida aparece como pendiente. Sin horarios falsos.",
      pt: "É um jogo de mata-mata: o horário exato é definido quando o chaveamento sai, então a hora de saída aparece como pendente. Sem horários falsos.",
    },
  },
  alert: {
    add: {
      en: "Add to calendar",
      es: "Añadir al calendario",
      pt: "Adicionar à agenda",
    },
    added: {
      en: "Added to calendar",
      es: "Añadido al calendario",
      pt: "Adicionado à agenda",
    },
    preview: {
      en: "Preview alert",
      es: "Probar alerta",
      pt: "Testar alerta",
    },
    note: {
      en: "Calendar fires a reminder at {time} on match day.",
      es: "El calendario te avisará a las {time} el día del partido.",
      pt: "A agenda vai te lembrar às {time} no dia do jogo.",
    },
    previewed: {
      en: "Alert previewed ✓",
      es: "Alerta probada ✓",
      pt: "Alerta testado ✓",
    },
    blocked: {
      en: "Notifications blocked — use the calendar reminder",
      es: "Notificaciones bloqueadas — usa el recordatorio del calendario",
      pt: "Notificações bloqueadas — use o lembrete da agenda",
    },
    unsupported: {
      en: "Notifications not supported here — use the calendar reminder",
      es: "Notificaciones no disponibles aquí — usa el calendario",
      pt: "Notificações indisponíveis aqui — use a agenda",
    },
  },
  map: {
    title: {
      en: "Watch parties",
      es: "Dónde verlo",
      pt: "Onde assistir",
    },
    subtitle: {
      en: "Where to catch the match around the city. Hot zones are modeled, not measured.",
      es: "Lugares para ver el partido por la ciudad. Las zonas calientes son modeladas, no medidas.",
      pt: "Onde assistir ao jogo pela cidade. As zonas quentes são modeladas, não medidas.",
    },
    freeOnly: {
      en: "Free only",
      es: "Solo gratis",
      pt: "Só grátis",
    },
    heat: {
      en: "Heat",
      es: "Calor",
      pt: "Calor",
    },
    legend: {
      en: "⚽ stadium · 🍻 watch party · 🎉 fan festival · 🪅 fan zone. Tiles © OpenStreetMap, CARTO. Venues seeded — no live calls.",
      es: "⚽ estadio · 🍻 fiesta · 🎉 festival de fans · 🪅 zona de fans. Tiles © OpenStreetMap, CARTO. Sedes sembradas — sin llamadas en vivo.",
      pt: "⚽ estádio · 🍻 festa · 🎉 festival de fãs · 🪅 zona de fãs. Tiles © OpenStreetMap, CARTO. Locais semeados — sem chamadas ao vivo.",
    },
    empty: {
      en: "No venues match these filters.",
      es: "Ningún lugar coincide con estos filtros.",
      pt: "Nenhum local corresponde a esses filtros.",
    },
    minSpend: {
      en: "Min spend",
      es: "Consumo mín.",
      pt: "Consumo mín.",
    },
    free: {
      en: "Free",
      es: "Gratis",
      pt: "Grátis",
    },
    playlist: {
      en: "Neighborhood playlist",
      es: "Playlist del barrio",
      pt: "Playlist do bairro",
    },
  },
  voice: {
    title: {
      en: "Ask in your language",
      es: "Pregunta en tu idioma",
      pt: "Pergunte no seu idioma",
    },
    sub: {
      en: "Español · Português · English",
      es: "Español · Português · English",
      pt: "Español · Português · English",
    },
    tapMic: {
      en: "Tap and say where you're staying",
      es: "Toca y di dónde te hospedas",
      pt: "Toque e diga onde está hospedado",
    },
    listening: {
      en: "Listening…",
      es: "Escuchando…",
      pt: "Ouvindo…",
    },
    micHint: {
      en: "🎙️ Live mic works best in Chrome — or pick a demo / type below.",
      es: "🎙️ El micrófono funciona mejor en Chrome — o elige un ejemplo / escribe abajo.",
      pt: "🎙️ O microfone funciona melhor no Chrome — ou escolha um exemplo / digite abaixo.",
    },
    demoLabel: {
      en: "Demo transcript",
      es: "Ejemplo de dictado",
      pt: "Exemplo de transcrição",
    },
    transcript: {
      en: "Transcript",
      es: "Transcripción",
      pt: "Transcrição",
    },
    placeholder: {
      en: "Soy hincha de Brasil, me quedo en Brickell",
      es: "Soy hincha de Brasil, me quedo en Brickell",
      pt: "Sou torcedor do Brasil, estou em Aventura",
    },
    readbackLabel: {
      en: "Template readback",
      es: "Respuesta de plantilla",
      pt: "Resposta de modelo",
    },
    play: {
      en: "Play",
      es: "Reproducir",
      pt: "Reproduzir",
    },
    emptyHint: {
      en: "Use a transcript that includes a seeded origin: Brickell, Miami Beach, Downtown, or Aventura.",
      es: "Usa una frase con un origen sembrado: Brickell, Miami Beach, Downtown o Aventura.",
      pt: "Use uma frase com um bairro semeado: Brickell, Miami Beach, Downtown ou Aventura.",
    },
    rule: {
      en: "Voice only does speech-to-text + translation. It fills the same computed plan — it never invents a departure time.",
      es: "La voz solo hace dictado + traducción. Rellena el mismo plan calculado — nunca inventa una hora de salida.",
      pt: "A voz só faz transcrição + tradução. Ela preenche o mesmo plano calculado — nunca inventa um horário de saída.",
    },
  },
};

export function t(
  group: keyof typeof copy,
  key: string,
  language: Language,
): string {
  const entry = copy[group][key as keyof (typeof copy)[typeof group]] as
    | Record<Language, string>
    | undefined;
  return entry?.[language] ?? "";
}

/** Fill {placeholders} in a translated string. */
export function fill(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
