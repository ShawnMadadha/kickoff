export type Language = "en" | "es" | "pt";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

export const copy = {
  plan: {
    stay: {
      en: "Where are you staying?",
      es: "¿Dónde te hospedas?",
      pt: "Onde voce esta hospedado?",
    },
    empty: {
      en: "Pick where you're staying to see your ranked arrival plan.",
      es: "Elige dónde te hospedas para ver tu plan de llegada.",
      pt: "Escolha onde voce esta hospedado para ver seu plano de chegada.",
    },
    ranked: {
      en: "Ranked for",
      es: "Ordenado para",
      pt: "Classificado para",
    },
    buffer: {
      en: "Times include a 75-min walk + security buffer.",
      es: "Los horarios incluyen 75 min para caminar y seguridad.",
      pt: "Os horarios incluem 75 min para caminhada e seguranca.",
    },
    notOption: {
      en: "not an option",
      es: "no es una opcion",
      pt: "nao e uma opcao",
    },
    recommended: {
      en: "Recommended",
      es: "Recomendado",
      pt: "Recomendado",
    },
    leaveBy: {
      en: "Leave by",
      es: "Sal antes de",
      pt: "Saia ate",
    },
    estimate: {
      en: "estimate",
      es: "estimado",
      pt: "estimativa",
    },
    uber: {
      en: "Open in Uber",
      es: "Abrir en Uber",
      pt: "Abrir no Uber",
    },
    tbd: {
      en: "This is a knockout match — the exact kickoff time is set once the bracket is decided, so leave-by times show as TBD until then. No fake times.",
      es: "Este partido es de eliminatoria: la hora exacta se fija cuando se decida el cuadro, asi que los horarios salen como TBD. Sin horarios inventados.",
      pt: "Esta partida e de mata-mata: o horario exato sai quando a chave for decidida, entao os horarios aparecem como TBD. Sem horarios inventados.",
    },
  },
  map: {
    title: {
      en: "Watch parties",
      es: "Fiestas para ver el partido",
      pt: "Festas para assistir",
    },
    subtitle: {
      en: "Where to catch the match around the city. Hot zones are modeled, not measured.",
      es: "Lugares para ver el partido por la ciudad. Las zonas calientes son modeladas, no medidas.",
      pt: "Onde assistir pela cidade. As zonas quentes sao modeladas, nao medidas.",
    },
    freeOnly: {
      en: "Free only",
      es: "Solo gratis",
      pt: "So gratis",
    },
    heat: {
      en: "Heat",
      es: "Calor",
      pt: "Calor",
    },
    legend: {
      en: "stadium · watch party · fan festival · fan zone. Tiles © OpenStreetMap, CARTO. Venues seeded — no live calls.",
      es: "estadio · fiesta · festival de fans · zona de fans. Tiles © OpenStreetMap, CARTO. Sedes sembradas — sin llamadas en vivo.",
      pt: "estadio · festa · festival de fas · zona de fas. Tiles © OpenStreetMap, CARTO. Locais semeados — sem chamadas ao vivo.",
    },
    empty: {
      en: "No venues match these filters.",
      es: "Ningun lugar coincide con estos filtros.",
      pt: "Nenhum local combina com estes filtros.",
    },
    minSpend: {
      en: "Min spend",
      es: "Consumo min.",
      pt: "Consumo min.",
    },
    free: {
      en: "Free",
      es: "Gratis",
      pt: "Gratis",
    },
    playlist: {
      en: "Neighborhood playlist",
      es: "Playlist del barrio",
      pt: "Playlist do bairro",
    },
  },
};

export function t(group: keyof typeof copy, key: string, language: Language) {
  return copy[group][key as keyof (typeof copy)[typeof group]][language];
}
