import type { Country } from "@/components/CountryPicker";

// One source of truth for team colors.
//  - `flag`: the true flag (for the stripe + header chip + ambient background)
//  - `accent`: a bright, dark-ink-readable UI accent that OVERRIDES --color-accent
//    app-wide when this team is chosen. Greens/blue only, so it never collides
//    with the danger-red "stop" token.
export const TEAMS: Record<
  Country,
  { name: string; cheer: string; flag: string; accent: string }
> = {
  mexico: {
    name: "México",
    cheer: "¡Vamos México!",
    flag: "linear-gradient(90deg,#006847 0 33.33%,#ffffff 33.33% 66.66%,#ce1126 66.66%)",
    accent: "oklch(76% 0.17 152)",
  },
  portugal: {
    name: "Portugal",
    cheer: "Força Portugal!",
    flag: "linear-gradient(90deg,#046a38 0 40%,#da291c 40%)",
    accent: "oklch(72% 0.15 146)",
  },
  usa: {
    name: "USA",
    cheer: "Let's go USA!",
    flag: "repeating-linear-gradient(90deg,#b22234 0 10px,#ffffff 10px 20px)",
    accent: "oklch(70% 0.15 250)",
  },
};
